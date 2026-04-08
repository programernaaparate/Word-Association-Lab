import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GameHelpModal from '../components/GameHelpModal'
import Navbar from '../components/Navbar'
import { getLogicContentRequest } from '../utils/api'
import { syncCompletedGame } from '../utils/gameSync'
import {
  calculateLogicReward,
  calculatePerformanceBonus,
} from '../utils/gameRewards'
import {
  clearActiveSession,
  getActiveSession,
  getCategory,
  getCurrentUser,
  getDifficulty,
  getLogicChallengesByDifficulty,
  isExpiredDailySession,
  evaluateLogicAnswer,
  saveActiveSession,
  saveLastResult,
} from '../utils/storage'

const BASE_SCORE = 1200
const HINT_PENALTY = 10
const WRONG_ANSWER_PENALTY = 15

const mergeLogicPools = (primaryItems = [], fallbackItems = []) => {
  const itemMap = new Map()

  ;[...fallbackItems, ...primaryItems].forEach((item) => {
    const itemKey = `${item.mode}-${item.answer}-${item.category}-${item.difficulty}`
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

const shuffleItems = (items = []) => {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]]
  }

  return nextItems
}

function LogicChallengePage() {
  const navigate = useNavigate()
  const difficulty = getDifficulty()
  const category = getCategory()
  const activeSession = getActiveSession()
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
  const isDailyMode =
    activeSession?.isDaily === true &&
    activeSession?.type === 'logic' &&
    Boolean(dailyContent)
  const hasExpiredDailySession = isExpiredDailySession(activeSession)

  const initialMode =
    activeSession?.type === 'logic'
      ? activeSession.mode || 'concept'
      : isDailyMode
        ? dailyContent?.mode || 'concept'
        : 'concept'

  const fallbackChallenges = useMemo(
    () => getLogicChallengesByDifficulty(difficulty, category),
    [difficulty, category]
  )
  const [allChallenges, setAllChallenges] = useState(fallbackChallenges)
  const [mode, setMode] = useState(initialMode)
  const [sessionChallengeIds, setSessionChallengeIds] = useState(savedSessionChallengeIds)
  const [showHelpModal, setShowHelpModal] = useState(false)

  useEffect(() => {
    if (isDailyMode) return

    let isMounted = true

    const loadChallenges = async () => {
      try {
        const response = await getLogicContentRequest({ difficulty, category })
        if (!isMounted) return
        setAllChallenges(
          response.items?.length
            ? mergeLogicPools(response.items, fallbackChallenges)
            : fallbackChallenges
        )
      } catch {
        if (!isMounted) return
        setAllChallenges(fallbackChallenges)
      }
    }

    loadChallenges()

    return () => {
      isMounted = false
    }
  }, [category, difficulty, fallbackChallenges, isDailyMode])

  const filteredChallenges = useMemo(() => {
    const byMode = allChallenges.filter((item) => (item.mode || 'concept') === mode)
    return byMode.length > 0 ? byMode : allChallenges
  }, [allChallenges, mode])

  const resolvedSessionChallengeIds = useMemo(() => {
    if (isDailyMode || !filteredChallenges.length) {
      return []
    }

    const validIds = sessionChallengeIds.filter((itemId) =>
      filteredChallenges.some((item) => item.id === itemId)
    )

    if (validIds.length > 0) {
      return validIds
    }

    return shuffleItems(filteredChallenges)
      .slice(0, Math.min(4, filteredChallenges.length))
      .map((item) => item.id)
  }, [filteredChallenges, isDailyMode, sessionChallengeIds])

  const defaultChallenges = resolvedSessionChallengeIds
    .map((itemId) => filteredChallenges.find((item) => item.id === itemId))
    .filter(Boolean)
  const dailyChallenges = isDailyMode ? [dailyContent].filter(Boolean) : []
  const gameChallenges = (
    isDailyMode ? dailyChallenges : defaultChallenges.length ? defaultChallenges : filteredChallenges.slice(0, 4)
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
  const [answers, setAnswers] = useState(
    activeSession?.type === 'logic' ? activeSession.answers || [] : []
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
  const canSubmit = isOddOneOut ? Boolean(answer.trim()) : true
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
      mode,
      index,
      answer,
      score,
      correct,
      answers,
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
      sessionChallengeIds: isDailyMode ? [] : resolvedSessionChallengeIds,
    })
  }, [
    answer,
    answers,
    correct,
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
    mode,
    resolvedSessionChallengeIds,
    score,
    showHint,
    startedAt,
    hasExpiredDailySession,
  ])

  const handleModeChange = (nextMode) => {
    if (isDailyMode) return

    setMode(nextMode)
    setIndex(0)
    setAnswer('')
    setAnswers([])
    setCorrect(0)
    setScore(BASE_SCORE)
    setShowHint(false)
    setHintUsedSteps([])
    setSessionChallengeIds([])
  }

  const handleToggleHint = () => {
    if (hintAlreadyUsedForCurrentStep) {
      return
    }

    setScore((prev) => Math.max(0, prev - HINT_PENALTY))
    setHintUsedSteps((prev) => [...prev, index])
    setShowHint(true)
  }

  const handleNext = async () => {
    if (!currentChallenge) return

    const trimmedAnswer = answer.trim()
    const evaluation = evaluateLogicAnswer(currentChallenge, trimmedAnswer)
    const isAccepted = evaluation.accepted

    let updatedScore = score
    let updatedCorrect = correct

    if (isAccepted) {
      updatedScore += calculateLogicReward({
        difficulty: currentChallenge.difficulty || difficulty,
        mode: currentChallenge.mode || mode,
        hintUsed: hintAlreadyUsedForCurrentStep,
      })
      updatedCorrect += 1
    } else if (trimmedAnswer) {
      updatedScore = Math.max(0, updatedScore - WRONG_ANSWER_PENALTY)
    }

    const updatedAnswers = [
      ...answers,
      {
        prompt: currentChallenge.words.join(', '),
        answer: trimmedAnswer || '(bez odgovora)',
        accepted: isAccepted,
        hintUsed: hintAlreadyUsedForCurrentStep,
        solution: currentChallenge.answer,
        mode: currentChallenge.mode || mode,
        roundDifficulty: currentChallenge.difficulty || difficulty,
      },
    ]

    setScore(updatedScore)
    setCorrect(updatedCorrect)
    setAnswers(updatedAnswers)

    if (index < gameChallenges.length - 1) {
      setIndex((prev) => prev + 1)
      setAnswer('')
      setShowHint(false)
      return
    }

    const elapsedMs = new Date().getTime() - new Date(startedAt).getTime()
    const seconds = Math.max(1, Math.floor(elapsedMs / 1000))
    const accuracy = Math.round((updatedCorrect / gameChallenges.length) * 100)
    const currentUser = getCurrentUser()
    const finalType = isOddOneOut ? 'logic-odd-one-out' : 'logic'
    const performanceBonus = calculatePerformanceBonus({
      difficulty: currentChallenge.difficulty || difficulty,
      total: gameChallenges.length,
      correct: updatedCorrect,
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
      total: gameChallenges.length,
      correct: updatedCorrect,
      accuracy,
      time: seconds,
      category: currentChallenge.category,
      difficulty: currentChallenge.difficulty,
      isDaily: isDailyMode,
      hintCount,
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

    saveLastResult({
      type: finalType,
      score: finalHistoryEntry.score ?? finalScore,
      earnedPoints: finalHistoryEntry.earnedPoints ?? earnedPoints,
      performanceBonus: finalHistoryEntry.performanceBonus ?? performanceBonus,
      total: finalHistoryEntry.total ?? gameChallenges.length,
      correct: finalHistoryEntry.correct ?? updatedCorrect,
      accuracy: finalHistoryEntry.accuracy ?? accuracy,
      time: finalHistoryEntry.time ?? seconds,
      answers: updatedAnswers,
      category: currentChallenge.category,
      difficulty: currentChallenge.difficulty,
      isDaily: finalHistoryEntry.isDaily,
      hintCount,
      dailyReward: finalHistoryEntry.dailyReward || 0,
      awardedPoints: finalHistoryEntry.awardedPoints || earnedPoints,
    })

    clearActiveSession()
    navigate('/results')
  }

  return (
    <div className="screen">
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
                  onClick={() => setAnswer(word)}
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
                onChange={(event) => setAnswer(event.target.value)}
              />
            </div>
          )}

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
