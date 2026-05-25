import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getAssociationContentRequest } from '../utils/api'
import { syncCompletedGame } from '../utils/gameSync'
import {
  calculateAssociationReward,
  calculatePerformanceBonus,
} from '../utils/gameRewards'
import {
  clearActiveSession,
  evaluateAssociationAnswer,
  getActiveSession,
  getAssociationWordsByDifficulty,
  getCategory,
  getCurrentUser,
  getDifficulty,
  getRotatedSessionItemIds,
  isExpiredDailySession,
  saveActiveSession,
  saveLastResult,
} from '../utils/storage'

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

    const initialWordIds = getRotatedSessionItemIds({
      gameType: 'association',
      difficulty,
      category,
      items: fallbackWords,
      count: Math.min(5, fallbackWords.length),
    })

    const initialWords = initialWordIds
      .map((itemId) => fallbackWords.find((item) => item.id === itemId))
      .filter(Boolean)

    return initialWords.length ? initialWords : fallbackWords.slice(0, 5)
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

    return (sessionWords.length ? sessionWords : words.slice(0, 5)).filter(Boolean)
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
        setSessionWords((prev) =>
          prev.length ? remapSessionWordsToPool(prev, nextWords) : prev
        )
      } catch {
        if (!isMounted) return
        setWords(fallbackWords)
        setSessionWords((prev) =>
          prev.length ? remapSessionWordsToPool(prev, fallbackWords) : prev
        )
      }
    }

    loadWords()

    return () => {
      isMounted = false
    }
  }, [category, difficulty, fallbackWords, isDailyMode])

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
    category,
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

    setScore((prev) => Math.max(0, prev - HINT_PENALTY))
    setHintUsedSteps((prev) => [...prev, index])
    setShowHint(true)
  }

  const handleRevealClue = () => {
    if (!canRevealMore) return

    setScore((prev) => Math.max(0, prev - REVEAL_PENALTY))
    setRevealedClues((prev) => ({
      ...prev,
      [index]: Math.min(currentClues.length, revealedCount + 1),
    }))
  }

  const handleNext = async () => {
    if (!currentWord) return

    const trimmedAnswer = answer.trim()
    const evaluation = evaluateAssociationAnswer(currentWord, trimmedAnswer)

    let updatedScore = score
    let updatedCorrect = correct

    if (evaluation.accepted) {
      updatedScore += calculateAssociationReward({
        difficulty: currentWord.difficulty || difficulty,
        totalClues: currentClues.length,
        revealedCount,
        hintUsed: hintAlreadyUsedForCurrentStep,
      })
      updatedCorrect += 1
    } else if (trimmedAnswer) {
      updatedScore = Math.max(0, updatedScore - WRONG_ANSWER_PENALTY)
      setScore(updatedScore)
      setWrongAttempts((prev) => prev + 1)
      setRoundFeedback(`Netacno: "${trimmedAnswer}". Pokusaj ponovo.`)
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
      },
    ]

    setScore(updatedScore)
    setCorrect(updatedCorrect)
    setAnswers(updatedAnswers)
    setRoundFeedback('')

    if (index < gameWords.length - 1) {
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

          <button className="primary-btn full-btn" onClick={handleNext} type="button">
            {index === gameWords.length - 1 ? 'Zavrsi rundu' : 'Potvrdi odgovor'}
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


