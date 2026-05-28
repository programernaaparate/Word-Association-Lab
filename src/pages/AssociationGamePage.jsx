import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FirstRunTipCard from '../components/FirstRunTipCard'
import Navbar from '../components/Navbar'
import { getAssociationContentRequest } from '../utils/api'
import { syncCompletedGame } from '../utils/gameSync'
import {
  calculateAssociationReward,
  calculatePerformanceBonus,
  resolveComboProgress,
} from '../utils/gameRewards'
import {
  clearActiveSession,
  evaluateAssociationAnswer,
  getActiveSession,
  getAssociationWordsByDifficulty,
  getCategory,
  getCurrentUser,
  getDifficulty,
  getNewUnlockedAchievements,
  getPlayerProgressOverview,
  getRotatedSessionItemIds,
  getSessionRoundSize,
  isExpiredDailySession,
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
const HINT_PENALTY = 5
const REVEAL_PENALTY = 10
const WRONG_ANSWER_PENALTY = 15

const mergeWordPools = (primaryItems = [], fallbackItems = []) => {
  const itemMap = new Map()

  fallbackItems.forEach((item) => {
    const itemKey = `${item.word}-${item.category}-${item.difficulty}`
    itemMap.set(itemKey, item)
  })

  primaryItems.forEach((item) => {
    const itemKey = `${item.word}-${item.category}-${item.difficulty}`
    const previousItem = itemMap.get(itemKey) || {}
    itemMap.set(itemKey, {
      ...previousItem,
      ...item,
      symbol: item.symbol || previousItem.symbol || '',
      acceptedAnswers:
        item.acceptedAnswers?.length ? item.acceptedAnswers : previousItem.acceptedAnswers || [],
    })
  })

  return Array.from(itemMap.values())
}

const remapSessionWordsToPool = (sessionWords = [], poolWords = []) =>
  (sessionWords || [])
    .map((savedWord) =>
      poolWords.find(
        (item) =>
          item.word === savedWord.word &&
          item.category === savedWord.category &&
          item.difficulty === savedWord.difficulty
      ) || savedWord
    )
    .filter(Boolean)

const pickAssociationSessionWords = ({
  words = [],
  difficulty,
  category,
  count = getSessionRoundSize({
    availableCount: words.length,
    preferredCount: 5,
    minimumCount: 3,
  }),
  commit = true,
}) => {
  const selectedIds = getRotatedSessionItemIds({
    gameType: 'association',
    difficulty,
    category,
    items: words,
    count: Math.min(count, words.length),
    commit,
  })

  const selectedWords = selectedIds
    .map((itemId) => words.find((item) => item.id === itemId))
    .filter(Boolean)

  return selectedWords.length ? selectedWords : words.slice(0, count)
}

function AssociationGamePage() {
  const navigate = useNavigate()
  const activeSession = getActiveSession()
  const selectedDifficulty = getDifficulty()
  const selectedCategory = getCategory()
  const difficulty =
    activeSession?.type === 'association' && !activeSession?.isDaily
      ? activeSession.sessionDifficulty || selectedDifficulty
      : selectedDifficulty
  const category =
    activeSession?.type === 'association' && !activeSession?.isDaily
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
  const savedSessionWordIds =
    activeSession?.type === 'association' ? activeSession.sessionWordIds || [] : []
  const savedSessionWords =
    activeSession?.type === 'association' ? activeSession.sessionWords || [] : []
  const isDailyMode =
    activeSession?.isDaily === true &&
    activeSession?.type === 'association' &&
    Boolean(dailyContent)
  const hasRestoredSession = activeSession?.type === 'association' && !isDailyMode
  const hasExpiredDailySession = isExpiredDailySession(activeSession)

  const fallbackWords = useMemo(
    () => getAssociationWordsByDifficulty(difficulty, category),
    [difficulty, category]
  )
  const [words, setWords] = useState(fallbackWords)
  const [sessionWords, setSessionWords] = useState(() => {
    if (isDailyMode) {
      return []
    }

    if (savedSessionWords.length > 0) {
      return savedSessionWords
    }

    const mappedSavedWords = savedSessionWordIds
      .map((itemId) => fallbackWords.find((item) => item.id === itemId))
      .filter(Boolean)

    if (mappedSavedWords.length > 0) {
      return mappedSavedWords
    }

      return pickAssociationSessionWords({
        words: fallbackWords,
        difficulty,
        category,
        count: getSessionRoundSize({
          availableCount: fallbackWords.length,
          preferredCount: 5,
          minimumCount: 3,
        }),
        commit: false,
      })
  })
  const resolvedDailyContent = useMemo(() => {
    if (!dailyContent) {
      return null
    }

    if (Array.isArray(dailyContent.clues) && dailyContent.clues.length > 0) {
      return dailyContent
    }

    return (
      fallbackWords.find(
        (item) =>
          item.id === dailyContent.id ||
          (item.word === dailyContent.word &&
            item.category === dailyContent.category &&
            item.difficulty === dailyContent.difficulty)
      ) || dailyContent
    )
  }, [dailyContent, fallbackWords])

  const gameWords = useMemo(() => {
    if (isDailyMode) {
      return [resolvedDailyContent].filter(Boolean)
    }

    return (
      sessionWords.length
        ? sessionWords
        : words.slice(
            0,
            getSessionRoundSize({
              availableCount: words.length,
              preferredCount: 5,
              minimumCount: 3,
            })
          )
    ).filter(Boolean)
  }, [isDailyMode, resolvedDailyContent, sessionWords, words])

  useEffect(() => {
    if (isDailyMode) return

    let isMounted = true

    const loadWords = async () => {
      try {
        const response = await getAssociationContentRequest({ difficulty, category })
        if (!isMounted) return
        const nextWords =
          response.items?.length ? mergeWordPools(response.items, fallbackWords) : fallbackWords
        setWords(nextWords)
        setSessionWords((prev) => {
          if (hasRestoredSession) {
            return prev.length ? remapSessionWordsToPool(prev, nextWords) : prev
          }

          return pickAssociationSessionWords({
            words: nextWords,
            difficulty,
            category,
            count: getSessionRoundSize({
              availableCount: nextWords.length,
              preferredCount: 5,
              minimumCount: 3,
            }),
            commit: true,
          })
        })
      } catch {
        if (!isMounted) return
        setWords(fallbackWords)
        setSessionWords((prev) => {
          if (hasRestoredSession) {
            return prev.length ? remapSessionWordsToPool(prev, fallbackWords) : prev
          }

          return pickAssociationSessionWords({
            words: fallbackWords,
            difficulty,
            category,
            count: getSessionRoundSize({
              availableCount: fallbackWords.length,
              preferredCount: 5,
              minimumCount: 3,
            }),
            commit: true,
          })
        })
      }
    }

    loadWords()

    return () => {
      isMounted = false
    }
  }, [category, difficulty, fallbackWords, hasRestoredSession, isDailyMode])

  const [index, setIndex] = useState(
    activeSession?.type === 'association' ? activeSession.index || 0 : 0
  )
  const [answer, setAnswer] = useState(
    activeSession?.type === 'association' ? activeSession.answer || '' : ''
  )
  const [score, setScore] = useState(
    activeSession?.type === 'association' ? activeSession.score || BASE_SCORE : BASE_SCORE
  )
  const [correct, setCorrect] = useState(
    activeSession?.type === 'association' ? activeSession.correct || 0 : 0
  )
  const [showHint, setShowHint] = useState(
    activeSession?.type === 'association' ? activeSession.showHint || false : false
  )
  const [roundFeedback, setRoundFeedback] = useState('')
  const [wrongAttempts, setWrongAttempts] = useState(
    activeSession?.type === 'association' ? activeSession.wrongAttempts || 0 : 0
  )
  const [answers, setAnswers] = useState(
    activeSession?.type === 'association' ? activeSession.answers || [] : []
  )
  const [comboStreak, setComboStreak] = useState(
    activeSession?.type === 'association' ? activeSession.comboStreak || 0 : 0
  )
  const [bestCombo, setBestCombo] = useState(
    activeSession?.type === 'association' ? activeSession.bestCombo || 0 : 0
  )
  const [comboBonusTotal, setComboBonusTotal] = useState(
    activeSession?.type === 'association' ? activeSession.comboBonusTotal || 0 : 0
  )
  const [hintUsedSteps, setHintUsedSteps] = useState(
    activeSession?.type === 'association' ? activeSession.hintUsedSteps || [] : []
  )
  const [revealedClues, setRevealedClues] = useState(
    activeSession?.type === 'association' ? activeSession.revealedClues || { 0: 1 } : { 0: 1 }
  )
  const [startedAt] = useState(
    activeSession?.type === 'association'
      ? activeSession.startedAt || new Date().toISOString()
      : new Date().toISOString()
  )

  const currentWord = gameWords[index]
  const currentClues = useMemo(() => currentWord?.clues || [], [currentWord])
  const revealedCount = Math.max(1, revealedClues[index] || 1)
  const hintAlreadyUsedForCurrentStep = hintUsedSteps.includes(index)
  const canRevealMore = revealedCount < currentClues.length
  const revealedHintCount = Object.values(revealedClues).reduce(
    (total, count) => total + Math.max(0, Number(count || 1) - 1),
    0
  )
  const hintCount = hintUsedSteps.length + revealedHintCount
  const displayScore = Math.max(0, score - BASE_SCORE)
  const currentPromptLabel = [currentWord?.symbol, ...currentClues.slice(0, revealedCount)]
    .filter(Boolean)
    .join(', ')
  const canSubmit = Boolean(answer.trim())

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

    if (!gameWords.length) {
      navigate('/home')
    }
  }, [gameWords.length, hasExpiredDailySession, navigate])

  useEffect(() => {
    if (hasExpiredDailySession || !gameWords.length) return

    saveActiveSession({
      type: 'association',
      sessionDifficulty: isDailyMode ? null : difficulty,
      sessionCategory: isDailyMode ? null : category,
      index,
      answer,
      score,
      correct,
      showHint,
      answers,
      comboStreak,
      bestCombo,
      comboBonusTotal,
      startedAt,
      isDaily: isDailyMode,
      dailyChallengeId: isDailyMode ? dailyChallengeId : null,
      dailyDateKey: isDailyMode ? dailyDateKey : null,
      dailyReward: isDailyMode ? dailyReward : 0,
      dailyContent: isDailyMode ? resolvedDailyContent : null,
      dailyContentId: isDailyMode ? dailyContentId : null,
      dailyContentType: isDailyMode ? dailyContentType : null,
      dailySelectionDifficulty: isDailyMode ? dailySelectionDifficulty : null,
      dailySelectionCategory: isDailyMode ? dailySelectionCategory : null,
      hintUsedSteps,
      hintCount,
      revealedClues,
      sessionWordIds: isDailyMode ? [] : sessionWords.map((item) => item.id).filter(Boolean),
      sessionWords: isDailyMode ? [] : sessionWords,
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
    dailyChallengeId,
    resolvedDailyContent,
    dailyContentId,
    dailyContentType,
    dailyDateKey,
    dailyReward,
    dailySelectionCategory,
    dailySelectionDifficulty,
    gameWords.length,
    hintCount,
    hintUsedSteps,
    index,
    isDailyMode,
    difficulty,
    revealedClues,
    sessionWords,
    score,
    showHint,
    startedAt,
    wrongAttempts,
    hasExpiredDailySession,
  ])

  const handleToggleHint = () => {
    if (hintAlreadyUsedForCurrentStep) {
      return
    }

    playHintSound()
    setScore((prev) => Math.max(0, prev - HINT_PENALTY))
    setHintUsedSteps((prev) => [...prev, index])
    setShowHint(true)
  }

  const handleRevealClue = () => {
    if (!canRevealMore) return

    playHintSound()
    setScore((prev) => Math.max(0, prev - REVEAL_PENALTY))
    setRevealedClues((prev) => ({
      ...prev,
      [index]: Math.min(currentClues.length, revealedCount + 1),
    }))
  }

  const handleNext = async ({ skip = false } = {}) => {
    if (!currentWord) return

    const trimmedAnswer = skip ? '' : answer.trim()
    const evaluation = evaluateAssociationAnswer(currentWord, trimmedAnswer)

    let updatedScore = score
    let updatedCorrect = correct
    let updatedComboStreak = comboStreak
    let updatedBestCombo = bestCombo
    let updatedComboBonusTotal = comboBonusTotal
    let awardedComboBonus = 0

    if (evaluation.accepted) {
      const comboState = resolveComboProgress({
        currentCombo: comboStreak,
        bestCombo,
        comboBonusTotal,
        difficulty: currentWord.difficulty || difficulty,
        accepted: true,
        hintUsed: hintAlreadyUsedForCurrentStep,
      })

      updatedComboStreak = comboState.comboStreak
      updatedBestCombo = comboState.bestCombo
      updatedComboBonusTotal = comboState.comboBonusTotal
      awardedComboBonus = comboState.awardedComboBonus
      updatedScore += calculateAssociationReward({
        difficulty: currentWord.difficulty || difficulty,
        totalClues: currentClues.length,
        revealedCount,
        hintUsed: hintAlreadyUsedForCurrentStep,
      })
      updatedScore += awardedComboBonus
      updatedCorrect += 1
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
        prompt: currentPromptLabel,
        answer: trimmedAnswer || '(bez odgovora)',
        accepted: evaluation.accepted,
        hintUsed: hintAlreadyUsedForCurrentStep,
        solution: currentWord.word,
        symbol: currentWord.symbol || '',
        revealedCount,
        totalClues: currentClues.length,
        roundDifficulty: currentWord.difficulty || difficulty,
        comboAfterRound: updatedComboStreak,
        comboBonusAwarded: awardedComboBonus,
      },
    ]

    setScore(updatedScore)
    setCorrect(updatedCorrect)
    setAnswers(updatedAnswers)
    setComboStreak(updatedComboStreak)
    setBestCombo(updatedBestCombo)
    setComboBonusTotal(updatedComboBonusTotal)
    setRoundFeedback('')

    if (index < gameWords.length - 1) {
      if (evaluation.accepted) {
        playSuccessSound()
      }
      const nextIndex = index + 1
      setIndex(nextIndex)
      setAnswer('')
      setShowHint(false)
      setRevealedClues((prev) => ({
        ...prev,
        [nextIndex]: Math.max(1, prev[nextIndex] || 1),
      }))
      return
    }

    const elapsedMs = new Date().getTime() - new Date(startedAt).getTime()
    const seconds = Math.max(1, Math.floor(elapsedMs / 1000))
    const accuracy = Math.round((updatedCorrect / gameWords.length) * 100)
    const currentUser = getCurrentUser()
    const previousProgress = getPlayerProgressOverview()
    const performanceBonus = calculatePerformanceBonus({
      difficulty: currentWord.difficulty || difficulty,
      total: gameWords.length,
      correct: updatedCorrect,
      time: seconds,
      hintCount,
      type: 'association',
    })
    const finalScore = updatedScore + performanceBonus
    const earnedPoints = Math.max(0, finalScore - BASE_SCORE)
    const completedDaily =
      isDailyMode && gameWords.length > 0 && updatedCorrect === gameWords.length
    const fallbackDailyReward = completedDaily ? Number(dailyReward || 500) : 0

    const historyEntry = {
      type: 'association',
      score: finalScore,
      baseScore: updatedScore,
      earnedPoints,
      awardedPoints: earnedPoints + fallbackDailyReward,
      roundScore: finalScore,
      performanceBonus,
      dailyReward: fallbackDailyReward,
      comboBonus: updatedComboBonusTotal,
      maxCombo: updatedBestCombo,
      total: gameWords.length,
      correct: updatedCorrect,
      accuracy,
      time: seconds,
      category: currentWord.category,
      difficulty: currentWord.difficulty,
      isDaily: isDailyMode,
      hintCount,
      wrongAttempts,
      answers: updatedAnswers,
      username: currentUser?.username,
      dailyChallengeId: isDailyMode ? dailyChallengeId : null,
      dailyDateKey: isDailyMode ? dailyDateKey : null,
      dailyContentType: isDailyMode ? dailyContentType || 'association' : null,
      dailyContentId: isDailyMode ? dailyContentId || currentWord.id : null,
      dailySelectionDifficulty: isDailyMode ? dailySelectionDifficulty || difficulty : null,
      dailySelectionCategory: isDailyMode ? dailySelectionCategory || category : null,
    }

    const submission = {
      gameType: isDailyMode ? 'Dnevna asocijacija' : 'Asocijacija',
      content: updatedAnswers
        .map((item) => `${item.prompt} -> ${item.answer} (${item.solution})`)
        .join(' | '),
      points: historyEntry.awardedPoints,
      time: seconds,
      isDaily: isDailyMode,
    }

    const syncResult = await syncCompletedGame({ historyEntry, submission })
    const finalHistoryEntry = syncResult.historyEntry
    const progressSnapshot = getPlayerProgressOverview()
    const newAchievements = getNewUnlockedAchievements(previousProgress, progressSnapshot)

    saveLastResult({
      type: 'association',
      score: finalHistoryEntry.score ?? finalScore,
      earnedPoints: finalHistoryEntry.earnedPoints ?? earnedPoints,
      performanceBonus: finalHistoryEntry.performanceBonus ?? performanceBonus,
      total: finalHistoryEntry.total ?? gameWords.length,
      correct: finalHistoryEntry.correct ?? updatedCorrect,
      accuracy: finalHistoryEntry.accuracy ?? accuracy,
      time: finalHistoryEntry.time ?? seconds,
      answers: updatedAnswers,
      category: currentWord.category,
      difficulty: currentWord.difficulty,
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
          title={`Igra asocijacija - ${displayScore} XP`}
          showBack
          rightText={isDailyMode ? 'D' : '?'}
        />

        <div className="page-content game-page">
          <div className="tag-row">
            <span className="tag purple-light">{currentWord?.category || category}</span>
            <span className="tag neutral">{currentWord?.difficulty || difficulty}</span>
            {isDailyMode && <span className="tag green-pill">Dnevni izazov</span>}
          </div>

          <FirstRunTipCard
            storageKey="association"
            eyebrow="Prvi ulazak"
            title="Otvaraj tragove samo kad moras"
            description="Najvise XP uzimas kad pogodis sa sto manje otvorenih tragova i bez pomoci."
            items={[
              'Prvo probaj bez pomoci, pa tek onda otvori novi trag.',
              'Hint i reveal cuvaj za zadnje 1-2 dileme.',
            ]}
            tone="green"
          />

          <div className="section-row">
            <h2 className="logic-title">Pogodi konacno rjesenje</h2>
            <span className="tag blue-pill">
              {Math.max(1, index + 1)} / {gameWords.length}
            </span>
          </div>

          {currentWord?.symbol ? (
            <div className="association-symbol-card">
              <small>POCETNI SIMBOL</small>
              <strong>{currentWord.symbol}</strong>
              <p className="muted small-text">
                Simbol je dodatni trag uz otvorene pojmove.
              </p>
            </div>
          ) : null}

          <div className="logic-grid">
            {currentClues.map((clue, clueIndex) => (
              <div key={`${clue}-${clueIndex}`} className="logic-box">
                {clueIndex < revealedCount ? clue : '?'}
              </div>
            ))}
          </div>

          <div className="profile-info-box">
            <p><strong>Otkriveno tragova:</strong> {revealedCount} / {currentClues.length}</p>
            <p><strong>Bodovanje:</strong> manje otvorenih tragova donosi vise poena.</p>
            <p><strong>Aktivni combo:</strong> {comboStreak > 0 ? `x${comboStreak}` : 'Nema'}</p>
            <p><strong>Najbolji combo:</strong> x{bestCombo}</p>
            <p><strong>Combo bonus:</strong> +{comboBonusTotal} XP</p>
          </div>

          <label htmlFor="association-answer">Konacno rjesenje</label>
          <input
            id="association-answer"
            name="associationAnswer"
            className="large-input"
            type="text"
            placeholder="Unesi pojam koji povezuje tragove..."
            value={answer}
            onChange={(event) => {
              if (roundFeedback) {
                setRoundFeedback('')
              }
              setAnswer(event.target.value)
            }}
          />

          {roundFeedback ? <p className="error game-inline-feedback">{roundFeedback}</p> : null}

          {showHint && (
            <p className="muted small-text">
              Pomoc: {currentWord?.hint || 'Pokusaj da povezes sve otvorene tragove.'}
            </p>
          )}

          <div className="dual-actions">
            <button className="secondary-btn" type="button" onClick={handleRevealClue}>
              {canRevealMore ? 'Otvori trag (-10)' : 'Svi tragovi otvoreni'}
            </button>

            <button
              className="secondary-btn"
              type="button"
              onClick={handleToggleHint}
              disabled={hintAlreadyUsedForCurrentStep}
            >
              {hintAlreadyUsedForCurrentStep ? 'Pomoc iskoriscena' : 'Prikazi pomoc (-5)'}
            </button>
          </div>

          <button
            className="primary-btn full-btn"
            onClick={() => handleNext()}
            type="button"
            disabled={!canSubmit}
          >
            {index === gameWords.length - 1 ? 'Zavrsi rundu' : 'Potvrdi odgovor'}
          </button>

          <button
            className="secondary-btn full-btn"
            onClick={() => handleNext({ skip: true })}
            type="button"
          >
            {index === gameWords.length - 1 ? 'Ne znam, zavrsi rundu' : 'Ne znam, preskoci'}
          </button>

          <div className="progress-wrap">
            <p className="muted">Progres igre</p>
            <div className="progress-bars">
              {gameWords.map((item, itemIndex) => (
                <span
                  key={`${item.id}-${itemIndex}`}
                  className={`progress-bar ${itemIndex <= index ? 'filled' : ''}`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssociationGamePage


