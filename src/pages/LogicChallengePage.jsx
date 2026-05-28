import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FirstRunTipCard from '../components/FirstRunTipCard'
import GameHelpModal from '../components/GameHelpModal'
import Navbar from '../components/Navbar'
import { evaluateAiConceptAnswerRequest, getLogicContentRequest } from '../utils/api'
import { syncCompletedGame } from '../utils/gameSync'
import {
  calculateLogicReward,
  calculatePerformanceBonus,
  resolveComboProgress,
} from '../utils/gameRewards'
import {
  clearActiveSession,
  getActiveSession,
  getAuthToken,
  getCategory,
  getCurrentUser,
  getDifficulty,
  getNewUnlockedAchievements,
  getLogicChallengesByDifficulty,
  getPlayerProgressOverview,
  getRotatedSessionItemIds,
  getSessionRoundSize,
  isExpiredDailySession,
  evaluateLogicAnswer,
  saveActiveSession,
  saveLastResult,
} from '../utils/storage'
import {
  playCelebrateSound,
  playErrorSound,
  playHintSound,
  playSuccessSound,
} from '../utils/uiFeedback'

const BASE_SCORE = 1200
const HINT_PENALTY = 10
const WRONG_ANSWER_PENALTY = 15

const mergeLogicPools = (primaryItems = [], fallbackItems = []) => {
  const itemMap = new Map()

  ;[...fallbackItems, ...primaryItems].forEach((item) => {
    const itemKey = buildLogicChallengeKey(item)
    const existingItem = itemMap.get(itemKey) || {}
    const mergedAcceptedAnswers = [
      ...(existingItem.acceptedAnswers || []),
      ...(item.acceptedAnswers || []),
    ]

    itemMap.set(itemKey, {
      ...existingItem,
      ...item,
      acceptedAnswers: [...new Set(mergedAcceptedAnswers.filter(Boolean))],
    })
  })

  return Array.from(itemMap.values())
}

const buildLogicChallengeKey = (item = {}) =>
  `${item.mode || 'concept'}-${item.answer || ''}-${item.category || ''}-${item.difficulty || ''}-${(
    (item.mode || 'concept') === 'odd-one-out' ? item.words || [] : []
  ).join('|')}`

const normalizeLogicAnswerKey = (value = '') =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const remapLogicSessionChallengesToPool = (sessionChallenges = [], poolChallenges = []) =>
  (sessionChallenges || [])
    .map((savedChallenge) => {
      const savedKey = buildLogicChallengeKey(savedChallenge)

      return (
        poolChallenges.find(
          (item) =>
            (savedChallenge.id && item.id === savedChallenge.id) ||
            buildLogicChallengeKey(item) === savedKey
        ) || savedChallenge
      )
    })
    .filter(Boolean)

const pickDistinctOddOneOutChallenges = ({
  challenges = [],
  difficulty,
  category,
  count,
  commit = true,
}) => {
  const groups = new Map()

  ;(challenges || []).forEach((challenge) => {
    const answerKey = normalizeLogicAnswerKey(challenge.answer)
    if (!answerKey) {
      return
    }

    const group = groups.get(answerKey) || []
    group.push(challenge)
    groups.set(answerKey, group)
  })

  const answerItems = [...groups.keys()].map((answerKey) => ({ id: answerKey }))
  const selectedAnswerKeys = getRotatedSessionItemIds({
    gameType: 'logic-odd-answer',
    difficulty,
    category,
    mode: 'odd-one-out-answer',
    items: answerItems,
    count: Math.min(count, answerItems.length),
    commit,
  })

  return selectedAnswerKeys
    .map((answerKey) => {
      const groupedChallenges = groups.get(String(answerKey)) || []

      if (!groupedChallenges.length) {
        return null
      }

      const [selectedChallengeId] = getRotatedSessionItemIds({
        gameType: 'logic-odd-variant',
        difficulty,
        category,
        mode: `odd-one-out-${String(answerKey)}`,
        items: groupedChallenges,
        count: 1,
        commit,
      })

      return (
        groupedChallenges.find((challenge) => challenge.id === selectedChallengeId) ||
        groupedChallenges[0]
      )
    })
    .filter(Boolean)
}

const pickLogicSessionChallenges = ({
  challenges = [],
  difficulty,
  category,
  mode,
  count = getSessionRoundSize({
    availableCount: challenges.filter((item) => (item.mode || 'concept') === mode).length || challenges.length,
    preferredCount: 4,
    minimumCount: 2,
  }),
  commit = true,
}) => {
  const availableChallenges = challenges.filter((item) => (item.mode || 'concept') === mode)
  const challengePool = availableChallenges.length > 0 ? availableChallenges : challenges

  if ((mode || 'concept') === 'odd-one-out') {
    const distinctChallenges = pickDistinctOddOneOutChallenges({
      challenges: challengePool,
      difficulty,
      category,
      count,
      commit,
    })

    return distinctChallenges.length ? distinctChallenges : challengePool.slice(0, count)
  }

  const selectedIds = getRotatedSessionItemIds({
    gameType: 'logic',
    difficulty,
    category,
    mode,
    items: challengePool,
    count: Math.min(count, challengePool.length),
    commit,
  })
  const selectedChallenges = selectedIds
    .map((itemId) => challengePool.find((item) => item.id === itemId))
    .filter(Boolean)

  return selectedChallenges.length ? selectedChallenges : challengePool.slice(0, count)
}

function LogicChallengePage() {
  const navigate = useNavigate()
  const token = getAuthToken()
  const aiEvaluationEnabled = import.meta.env.VITE_ENABLE_AI_EVALUATION === 'true'
  const activeSession = getActiveSession()
  const selectedDifficulty = getDifficulty()
  const selectedCategory = getCategory()
  const difficulty =
    activeSession?.type === 'logic' && !activeSession?.isDaily
      ? activeSession.sessionDifficulty || selectedDifficulty
      : selectedDifficulty
  const category =
    activeSession?.type === 'logic' && !activeSession?.isDaily
      ? activeSession.sessionCategory || selectedCategory
      : selectedCategory
  const dailyChallengeId = activeSession?.dailyChallengeId || null
  const dailyDateKey = activeSession?.dailyDateKey || null
  const dailyReward = activeSession?.dailyReward || 0
  const dailyContent = activeSession?.dailyContent || null
  const dailyContentId = activeSession?.dailyContentId || null
  const dailyContentType = activeSession?.dailyContentType || null
  const dailySelectionDifficulty = activeSession?.dailySelectionDifficulty || null
  const dailySelectionCategory = activeSession?.dailySelectionCategory || null
  const savedSessionChallengeIds =
    activeSession?.type === 'logic' ? activeSession.sessionChallengeIds || [] : []
  const savedSessionChallenges =
    activeSession?.type === 'logic' ? activeSession.sessionChallenges || [] : []
  const isDailyMode =
    activeSession?.isDaily === true &&
    activeSession?.type === 'logic' &&
    Boolean(dailyContent)
  const hasRestoredSession = activeSession?.type === 'logic' && !isDailyMode
  const hasExpiredDailySession = isExpiredDailySession(activeSession)

  const initialMode =
    activeSession?.type === 'logic'
      ? activeSession.mode || 'concept'
      : isDailyMode
        ? dailyContent?.mode || 'concept'
        : 'concept'

  const fallbackChallenges = getLogicChallengesByDifficulty(difficulty, category)
  const [allChallenges, setAllChallenges] = useState(fallbackChallenges)
  const [mode, setMode] = useState(initialMode)
  const [sessionChallenges, setSessionChallenges] = useState(() => {
    if (isDailyMode) {
      return []
    }

    if (savedSessionChallenges.length > 0) {
      return savedSessionChallenges
    }

    const mappedSavedChallenges = savedSessionChallengeIds
      .map((itemId) => fallbackChallenges.find((item) => item.id === itemId))
      .filter(Boolean)

    if (mappedSavedChallenges.length > 0) {
      return mappedSavedChallenges
    }

    return pickLogicSessionChallenges({
      challenges: fallbackChallenges,
      difficulty,
      category,
      mode: initialMode,
      count: getSessionRoundSize({
        availableCount: fallbackChallenges.length,
        preferredCount: 4,
        minimumCount: 2,
      }),
      commit: false,
    })
  })
  const [showHelpModal, setShowHelpModal] = useState(false)

  const filteredChallenges = useMemo(() => {
    const byMode = allChallenges.filter((item) => (item.mode || 'concept') === mode)
    return byMode.length > 0 ? byMode : allChallenges
  }, [allChallenges, mode])

  useEffect(() => {
    if (isDailyMode) return

    let isMounted = true

    const loadChallenges = async () => {
      try {
        const response = await getLogicContentRequest({ difficulty, category })
        if (!isMounted) return
        const nextChallenges =
          response.items?.length
            ? mergeLogicPools(response.items, fallbackChallenges)
            : fallbackChallenges
        setAllChallenges(nextChallenges)
        setSessionChallenges((prev) => {
          if (hasRestoredSession) {
            return prev.length ? remapLogicSessionChallengesToPool(prev, nextChallenges) : prev
          }

          return pickLogicSessionChallenges({
            challenges: nextChallenges,
            difficulty,
            category,
            mode: initialMode,
            count: getSessionRoundSize({
              availableCount: nextChallenges.length,
              preferredCount: 4,
              minimumCount: 2,
            }),
            commit: true,
          })
        })
      } catch {
        if (!isMounted) return
        setAllChallenges(fallbackChallenges)
        setSessionChallenges((prev) => {
          if (hasRestoredSession) {
            return prev.length ? remapLogicSessionChallengesToPool(prev, fallbackChallenges) : prev
          }

          return pickLogicSessionChallenges({
            challenges: fallbackChallenges,
            difficulty,
            category,
            mode: initialMode,
            count: getSessionRoundSize({
              availableCount: fallbackChallenges.length,
              preferredCount: 4,
              minimumCount: 2,
            }),
            commit: true,
          })
        })
      }
    }

    loadChallenges()

    return () => {
      isMounted = false
    }
  }, [category, difficulty, fallbackChallenges, hasRestoredSession, initialMode, isDailyMode])

  const dailyChallenges = isDailyMode ? [dailyContent].filter(Boolean) : []
  const gameChallenges = (
    isDailyMode
      ? dailyChallenges
      : sessionChallenges.length
        ? sessionChallenges
        : filteredChallenges.slice(
            0,
            getSessionRoundSize({
              availableCount: filteredChallenges.length,
              preferredCount: 4,
              minimumCount: 2,
            })
          )
  ).filter(Boolean)

  const [index, setIndex] = useState(
    activeSession?.type === 'logic' ? activeSession.index || 0 : 0
  )
  const [answer, setAnswer] = useState(
    activeSession?.type === 'logic' ? activeSession.answer || '' : ''
  )
  const [score, setScore] = useState(
    activeSession?.type === 'logic' ? activeSession.score || BASE_SCORE : BASE_SCORE
  )
  const [correct, setCorrect] = useState(
    activeSession?.type === 'logic' ? activeSession.correct || 0 : 0
  )
  const [partialCount, setPartialCount] = useState(
    activeSession?.type === 'logic' ? activeSession.partialCount || 0 : 0
  )
  const [answers, setAnswers] = useState(
    activeSession?.type === 'logic' ? activeSession.answers || [] : []
  )
  const [comboStreak, setComboStreak] = useState(
    activeSession?.type === 'logic' ? activeSession.comboStreak || 0 : 0
  )
  const [bestCombo, setBestCombo] = useState(
    activeSession?.type === 'logic' ? activeSession.bestCombo || 0 : 0
  )
  const [comboBonusTotal, setComboBonusTotal] = useState(
    activeSession?.type === 'logic' ? activeSession.comboBonusTotal || 0 : 0
  )
  const [roundFeedback, setRoundFeedback] = useState('')
  const [wrongAttempts, setWrongAttempts] = useState(
    activeSession?.type === 'logic' ? activeSession.wrongAttempts || 0 : 0
  )
  const [showHint, setShowHint] = useState(
    activeSession?.type === 'logic' ? activeSession.showHint ?? false : false
  )
  const [hintUsedSteps, setHintUsedSteps] = useState(
    activeSession?.type === 'logic' ? activeSession.hintUsedSteps || [] : []
  )
  const [startedAt] = useState(
    activeSession?.type === 'logic'
      ? activeSession.startedAt || new Date().toISOString()
      : new Date().toISOString()
  )

  const currentChallenge = gameChallenges[index]
  const hintAlreadyUsedForCurrentStep = hintUsedSteps.includes(index)
  const isOddOneOut = (currentChallenge?.mode || mode) === 'odd-one-out'
  const hintCount = hintUsedSteps.length
  const displayScore = Math.max(0, score - BASE_SCORE)
  const helperTitle = isOddOneOut ? 'Ne pripada' : 'Zajednicki pojam'
  const helperDescription = isOddOneOut
    ? 'Tri pojma pripadaju istoj grupi, a jedan odskace. Trazi uljeza.'
    : 'Pronadji jednu rijec ili pojam koji najbolje povezuje sve kartice.'
  const canSubmit = Boolean(answer.trim())
  const helpSections = isOddOneOut
    ? [
        {
          title: 'Cilj igre',
          text: 'Klikni na rijec koja ne pripada istoj grupi kao ostale tri kartice.',
        },
        {
          title: 'Kako igras',
          items: [
            'Pogledaj koja tri pojma prirodno idu zajedno.',
            'Klikni na uljeza i proveri da li je izabrana prava kartica.',
            'Na kraju runde potvrdi odgovor dugmetom ispod.',
          ],
        },
        {
          title: 'Bodovanje',
          items: [
            'Tacan izbor donosi XP prema tezini zadatka.',
            `Pogresan izbor skida ${WRONG_ANSWER_PENALTY} XP.`,
            `Pomoc mozes iskoristiti jednom po rundi i skida ${HINT_PENALTY} XP.`,
          ],
        },
      ]
    : [
        {
          title: 'Cilj igre',
          text: 'Pronadji zajednicki pojam koji najbolje povezuje sve prikazane rijeci.',
        },
        {
          title: 'Kako igras',
          items: [
            'Posmatraj sve kartice kao jednu grupu ili oblast.',
            'Unesi pojam koji ih najlogicnije spaja.',
            'Sistem prihvata i normalne varijacije odgovora kada imaju smisla.',
          ],
        },
        {
          title: 'Bodovanje',
          items: [
            'Tacan odgovor donosi XP prema tezini zadatka.',
            `Netacan unesen odgovor skida ${WRONG_ANSWER_PENALTY} XP.`,
            `Pomoc mozes iskoristiti jednom po rundi i skida ${HINT_PENALTY} XP.`,
          ],
        },
      ]

  useEffect(() => {
    if (hasExpiredDailySession) {
      clearActiveSession()
      navigate('/home')
      return
    }
  }, [hasExpiredDailySession, navigate])

  useEffect(() => {
    if (hasExpiredDailySession) {
      return
    }

    if (!gameChallenges.length) {
      navigate('/home')
    }
  }, [gameChallenges.length, hasExpiredDailySession, navigate])

  useEffect(() => {
    if (hasExpiredDailySession || !gameChallenges.length) return

    saveActiveSession({
      type: 'logic',
      sessionDifficulty: isDailyMode ? null : difficulty,
      sessionCategory: isDailyMode ? null : category,
      mode,
      index,
      answer,
      score,
      correct,
      partialCount,
      answers,
      comboStreak,
      bestCombo,
      comboBonusTotal,
      showHint,
      startedAt,
      isDaily: isDailyMode,
      dailyChallengeId: isDailyMode ? dailyChallengeId : null,
      dailyDateKey: isDailyMode ? dailyDateKey : null,
      dailyReward: isDailyMode ? dailyReward : 0,
      dailyContent: isDailyMode ? dailyContent : null,
      dailyContentId: isDailyMode ? dailyContentId : null,
      dailyContentType: isDailyMode ? dailyContentType : null,
      dailySelectionDifficulty: isDailyMode ? dailySelectionDifficulty : null,
      dailySelectionCategory: isDailyMode ? dailySelectionCategory : null,
      hintUsedSteps,
      hintCount,
      sessionChallengeIds: isDailyMode
        ? []
        : sessionChallenges.map((item) => item.id).filter(Boolean),
      sessionChallenges: isDailyMode ? [] : sessionChallenges,
      wrongAttempts,
    })
  }, [
    answer,
    answers,
    bestCombo,
    category,
    comboBonusTotal,
    comboStreak,
    correct,
    partialCount,
    dailyChallengeId,
    dailyContent,
    dailyContentId,
    dailyContentType,
    dailyDateKey,
    dailyReward,
    dailySelectionCategory,
    dailySelectionDifficulty,
    gameChallenges.length,
    hintCount,
    hintUsedSteps,
    index,
    isDailyMode,
    difficulty,
    mode,
    sessionChallenges,
    score,
    showHint,
    startedAt,
    wrongAttempts,
    hasExpiredDailySession,
  ])

  const handleModeChange = (nextMode) => {
    if (isDailyMode) return

    const nextSessionChallenges = pickLogicSessionChallenges({
      challenges: allChallenges,
      difficulty,
      category,
      mode: nextMode,
      count: Math.min(4, allChallenges.length),
    })

    setMode(nextMode)
    setIndex(0)
    setAnswer('')
    setAnswers([])
    setCorrect(0)
    setPartialCount(0)
    setScore(BASE_SCORE)
    setComboStreak(0)
    setBestCombo(0)
    setComboBonusTotal(0)
    setShowHint(false)
    setHintUsedSteps([])
    setWrongAttempts(0)
    setSessionChallenges(nextSessionChallenges)
  }

  const handleToggleHint = () => {
    if (hintAlreadyUsedForCurrentStep) {
      return
    }

    playHintSound()
    setScore((prev) => Math.max(0, prev - HINT_PENALTY))
    setHintUsedSteps((prev) => [...prev, index])
    setShowHint(true)
  }

  const handleNext = async () => {
    if (!currentChallenge) return

    const trimmedAnswer = answer.trim()
    let evaluation = evaluateLogicAnswer(currentChallenge, trimmedAnswer)
    let isAccepted = evaluation.accepted
    let isPartialAccepted = Boolean(evaluation.partialAccepted)

    if (!isOddOneOut && !isAccepted && trimmedAnswer && token && aiEvaluationEnabled) {
      try {
        const aiEvaluation = await evaluateAiConceptAnswerRequest(token, {
          words: currentChallenge.words,
          canonicalAnswer: currentChallenge.answer,
          submittedAnswer: trimmedAnswer,
          category: currentChallenge.category,
          difficulty: currentChallenge.difficulty || difficulty,
        })

        if (aiEvaluation.available && aiEvaluation.accepted) {
          evaluation = {
            ...evaluation,
            accepted: true,
            partialAccepted: false,
            matchedAnswer: trimmedAnswer,
            aiAccepted: true,
            aiReason: aiEvaluation.reason || '',
            scoreWeight: 1,
          }
          isAccepted = true
          isPartialAccepted = false
        }
      } catch {
        // Local fallback remains active if AI is unavailable.
      }
    }

    let updatedScore = score
    let updatedCorrect = correct
    let updatedPartialCount = partialCount
    let updatedComboStreak = comboStreak
    let updatedBestCombo = bestCombo
    let updatedComboBonusTotal = comboBonusTotal
    let awardedComboBonus = 0

    if (isAccepted) {
      const comboState = resolveComboProgress({
        currentCombo: comboStreak,
        bestCombo,
        comboBonusTotal,
        difficulty: currentChallenge.difficulty || difficulty,
        accepted: true,
        hintUsed: hintAlreadyUsedForCurrentStep,
      })

      updatedComboStreak = comboState.comboStreak
      updatedBestCombo = comboState.bestCombo
      updatedComboBonusTotal = comboState.comboBonusTotal
      awardedComboBonus = comboState.awardedComboBonus
      updatedScore += calculateLogicReward({
        difficulty: currentChallenge.difficulty || difficulty,
        mode: currentChallenge.mode || mode,
        hintUsed: hintAlreadyUsedForCurrentStep,
      })
      updatedScore += awardedComboBonus
      updatedCorrect += 1
    } else if (isPartialAccepted) {
      const comboState = resolveComboProgress({
        currentCombo: comboStreak,
        bestCombo,
        comboBonusTotal,
        difficulty: currentChallenge.difficulty || difficulty,
        partialAccepted: true,
        hintUsed: hintAlreadyUsedForCurrentStep,
      })

      updatedComboStreak = comboState.comboStreak
      updatedBestCombo = comboState.bestCombo
      updatedComboBonusTotal = comboState.comboBonusTotal
      awardedComboBonus = comboState.awardedComboBonus
      updatedScore += Math.max(
        1,
        Math.round(
          calculateLogicReward({
            difficulty: currentChallenge.difficulty || difficulty,
            mode: currentChallenge.mode || mode,
            hintUsed: hintAlreadyUsedForCurrentStep,
          }) * 0.5
        )
      )
      updatedScore += awardedComboBonus
      updatedPartialCount += 1
    } else if (trimmedAnswer) {
      updatedScore = Math.max(0, updatedScore - WRONG_ANSWER_PENALTY)
      setScore(updatedScore)
      setWrongAttempts((prev) => prev + 1)
      setComboStreak(0)
      setRoundFeedback(`Netacno: "${trimmedAnswer}". Pokusaj ponovo.`)
      playErrorSound()
      return
    }

    const updatedAnswers = [
      ...answers,
      {
        prompt: currentChallenge.words.join(', '),
        answer: trimmedAnswer || '(bez odgovora)',
        accepted: isAccepted,
        partialAccepted: isPartialAccepted,
        scoreWeight: isAccepted ? 1 : isPartialAccepted ? 0.5 : 0,
        hintUsed: hintAlreadyUsedForCurrentStep,
        solution: currentChallenge.answer,
        mode: currentChallenge.mode || mode,
        roundDifficulty: currentChallenge.difficulty || difficulty,
        aiAccepted: Boolean(evaluation.aiAccepted),
        feedbackReason: evaluation.reason || '',
        comboAfterRound: updatedComboStreak,
        comboBonusAwarded: awardedComboBonus,
      },
    ]

    setScore(updatedScore)
    setCorrect(updatedCorrect)
    setPartialCount(updatedPartialCount)
    setAnswers(updatedAnswers)
    setComboStreak(updatedComboStreak)
    setBestCombo(updatedBestCombo)
    setComboBonusTotal(updatedComboBonusTotal)
    setRoundFeedback('')

    if (index < gameChallenges.length - 1) {
      if (isAccepted || isPartialAccepted) {
        playSuccessSound()
      }
      setIndex((prev) => prev + 1)
      setAnswer('')
      setShowHint(false)
      return
    }

    const elapsedMs = new Date().getTime() - new Date(startedAt).getTime()
    const seconds = Math.max(1, Math.floor(elapsedMs / 1000))
    const weightedCorrect = updatedCorrect + updatedPartialCount * 0.5
    const accuracy = Math.round((weightedCorrect / gameChallenges.length) * 100)
    const currentUser = getCurrentUser()
    const previousProgress = getPlayerProgressOverview()
    const finalType = isOddOneOut ? 'logic-odd-one-out' : 'logic'
    const performanceBonus = calculatePerformanceBonus({
      difficulty: currentChallenge.difficulty || difficulty,
      total: gameChallenges.length,
      correct: weightedCorrect,
      time: seconds,
      hintCount,
      type: finalType,
    })
    const finalScore = updatedScore + performanceBonus
    const earnedPoints = Math.max(0, finalScore - BASE_SCORE)
    const completedDaily =
      isDailyMode && gameChallenges.length > 0 && updatedCorrect === gameChallenges.length
    const fallbackDailyReward = completedDaily ? Number(dailyReward || 500) : 0

    const historyEntry = {
      type: finalType,
      score: finalScore,
      baseScore: updatedScore,
      earnedPoints,
      awardedPoints: earnedPoints + fallbackDailyReward,
      roundScore: finalScore,
      performanceBonus,
      dailyReward: fallbackDailyReward,
      comboBonus: updatedComboBonusTotal,
      maxCombo: updatedBestCombo,
      total: gameChallenges.length,
      correct: updatedCorrect,
      partialCount: updatedPartialCount,
      accuracy,
      time: seconds,
      category: currentChallenge.category,
      difficulty: currentChallenge.difficulty,
      isDaily: isDailyMode,
      hintCount,
      wrongAttempts,
      answers: updatedAnswers,
      username: currentUser?.username,
      dailyChallengeId: isDailyMode ? dailyChallengeId : null,
      dailyDateKey: isDailyMode ? dailyDateKey : null,
      dailyContentType: isDailyMode ? dailyContentType || 'logic' : null,
      dailyContentId: isDailyMode ? dailyContentId || currentChallenge.id : null,
      dailySelectionDifficulty: isDailyMode ? dailySelectionDifficulty || difficulty : null,
      dailySelectionCategory: isDailyMode ? dailySelectionCategory || category : null,
    }

    const submission = {
      gameType: isOddOneOut ? 'Ne pripada' : 'Logicki test',
      content: updatedAnswers.map((item) => `${item.prompt} -> ${item.answer}`).join(' | '),
      points: historyEntry.awardedPoints,
      time: seconds,
      isDaily: isDailyMode,
    }

    const syncResult = await syncCompletedGame({ historyEntry, submission })
    const finalHistoryEntry = syncResult.historyEntry
    const progressSnapshot = getPlayerProgressOverview()
    const newAchievements = getNewUnlockedAchievements(previousProgress, progressSnapshot)

    saveLastResult({
      type: finalType,
      score: finalHistoryEntry.score ?? finalScore,
      earnedPoints: finalHistoryEntry.earnedPoints ?? earnedPoints,
      performanceBonus: finalHistoryEntry.performanceBonus ?? performanceBonus,
      total: finalHistoryEntry.total ?? gameChallenges.length,
      correct: finalHistoryEntry.correct ?? updatedCorrect,
      partialCount: finalHistoryEntry.partialCount ?? updatedPartialCount,
      accuracy: finalHistoryEntry.accuracy ?? accuracy,
      time: finalHistoryEntry.time ?? seconds,
      answers: updatedAnswers,
      category: currentChallenge.category,
      difficulty: currentChallenge.difficulty,
      isDaily: finalHistoryEntry.isDaily,
      hintCount,
      wrongAttempts,
      comboBonus: finalHistoryEntry.comboBonus ?? updatedComboBonusTotal,
      maxCombo: finalHistoryEntry.maxCombo ?? updatedBestCombo,
      progressSnapshot,
      newAchievements,
      dailyReward: finalHistoryEntry.dailyReward || 0,
      awardedPoints: finalHistoryEntry.awardedPoints ?? earnedPoints + fallbackDailyReward,
    })

    playCelebrateSound()
    clearActiveSession()
    navigate('/results')
  }

  return (
    <div className="screen app-screen">
      <div className="phone-card app-shell">
        <Navbar
          title={`Izazov: ${difficulty}`}
          showBack
          rightText="!"
          onRightClick={() => setShowHelpModal(true)}
        />

        <div className="page-content game-page">
          <div className="tag-row">
            <span className="tag purple-light">{currentChallenge?.category || category}</span>
            <span className="tag neutral">{currentChallenge?.difficulty || difficulty}</span>
            {isDailyMode && <span className="tag green-pill">Dnevni izazov</span>}
          </div>

          <FirstRunTipCard
            storageKey="logic"
            eyebrow="Brzi onboarding"
            title="Trazi zajednicku logiku, ne samo slicne rijeci"
            description="Najbolje prolaze odgovori koji opisuju grupu, funkciju ili osobinu koja spaja pojmove."
            items={[
              'U modu Ne pripada trazi 3 pojma koji cine jasnu grupu.',
              'Ako nisi siguran, kratka pomoc vrijedi manje od promasenog pokusaja.',
            ]}
          />

          <div className="stat-row">
            <div className="stat-pill">
              <span>TIME</span>
              <div>
                <small>RUNDA</small>
                <strong>
                  {Math.max(1, index + 1)} / {gameChallenges.length}
                </strong>
              </div>
            </div>

            <div className="stat-pill">
              <span>XP</span>
              <div>
                <small>SKOR</small>
                <strong>{displayScore}</strong>
              </div>
            </div>

            <div className="stat-pill">
              <span>COMBO</span>
              <div>
                <small>NAJBOLJI</small>
                <strong>{comboStreak > 0 ? `x${comboStreak}` : `x${bestCombo}`}</strong>
              </div>
            </div>
          </div>

          <div className="section-row">
            <h2 className="logic-title">{helperTitle}</h2>
            <span className="tag green-soft-tag">{isOddOneOut ? 'Klikni odgovor' : 'Unesi pojam'}</span>
          </div>

          <div className="segmented">
            <button
              type="button"
              className={mode === 'concept' ? 'active' : ''}
              onClick={() => handleModeChange('concept')}
            >
              Koncept
            </button>
            <button
              type="button"
              className={mode === 'odd-one-out' ? 'active' : ''}
              onClick={() => handleModeChange('odd-one-out')}
            >
              Ne pripada
            </button>
          </div>

          <div className="challenge-tip-card">
            <div className="challenge-tip-copy">
              <small>{helperTitle}</small>
              <strong>{helperDescription}</strong>
              <p className="muted small-text">
                {showHint
                  ? `Pomoc: ${
                      currentChallenge?.hint || 'Pokusaj da pronadjes zajednicku osobinu.'
                    }`
                  : isOddOneOut
                    ? 'Pogledaj koja tri pojma prirodno pripadaju istoj grupi.'
                    : 'Razmisli o jednoj grupi, oblasti ili pojmu koji sve spaja.'}
              </p>
              <p className="muted small-text">
                Combo bonus do sada: +{comboBonusTotal} XP
              </p>
            </div>

            <button
              className="secondary-btn"
              type="button"
              onClick={handleToggleHint}
              disabled={hintAlreadyUsedForCurrentStep}
            >
              {hintAlreadyUsedForCurrentStep
                ? 'Pomoc iskoriscena'
                : `Prikazi pomoc (-${HINT_PENALTY})`}
            </button>
          </div>

          <div className="logic-grid">
            {currentChallenge?.words.map((word, itemIndex) => (
              isOddOneOut ? (
                <button
                  key={`${word}-${itemIndex}`}
                  type="button"
                  className={`logic-box logic-option ${
                    answer.trim() === word ? 'selected' : ''
                  }`}
                  onClick={() => {
                    if (roundFeedback) {
                      setRoundFeedback('')
                    }
                    setAnswer(word)
                  }}
                  aria-pressed={answer.trim() === word}
                >
                  {word}
                </button>
              ) : (
                <div key={`${word}-${itemIndex}`} className="logic-box">
                  {word}
                </div>
              )
            ))}
          </div>

          {isOddOneOut ? (
            <div className="answer-block">
              <label>Izabrana rijec</label>
              <div className="logic-selection-preview">
                {answer.trim() || 'Klikni na karticu koja ne pripada.'}
              </div>
            </div>
          ) : (
            <div className="answer-block">
              <label htmlFor="logic-answer">Koji je zajednicki pojam?</label>

              <input
                id="logic-answer"
                name="logicAnswer"
                type="text"
                placeholder="Unesi zajednicki pojam..."
                value={answer}
                onChange={(event) => {
                  if (roundFeedback) {
                    setRoundFeedback('')
                  }
                  setAnswer(event.target.value)
                }}
              />
            </div>
          )}

          {roundFeedback ? <p className="error game-inline-feedback">{roundFeedback}</p> : null}

          <p className="muted small-text">
            {isOddOneOut
              ? `Klik na pogresnu karticu skida ${WRONG_ANSWER_PENALTY} XP kada potvrdis odgovor.`
              : `Hint se u jednoj rundi racuna samo prvi put i skida ${HINT_PENALTY} XP.`}
          </p>

          <button
            className="primary-btn full-btn"
            onClick={handleNext}
            type="button"
            disabled={!canSubmit}
          >
            {index === gameChallenges.length - 1 ? 'Zavrsi izazov' : 'Potvrdi odgovor'}
          </button>
        </div>

        <GameHelpModal
          open={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          title={helperTitle}
          subtitle={helperDescription}
          sections={helpSections}
          footer="Zatvori prozor i nastavi igru kad budes spreman."
        />
      </div>
    </div>
  )
}

export default LogicChallengePage
