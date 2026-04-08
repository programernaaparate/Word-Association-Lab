import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GameHelpModal from '../components/GameHelpModal'
import Navbar from '../components/Navbar'
import { getRelationContentRequest } from '../utils/api'
import { syncCompletedGame } from '../utils/gameSync'
import {
  calculatePerformanceBonus,
  calculateRelationReward,
} from '../utils/gameRewards'
import {
  clearActiveSession,
  getActiveSession,
  getCategory,
  getCurrentUser,
  getDifficulty,
  getRelationChallengesByDifficulty,
  isExpiredDailySession,
  saveActiveSession,
  saveLastResult,
} from '../utils/storage'

const BASE_SCORE = 1200
const HINT_PENALTY = 5
const WRONG_ANSWER_PENALTY = 12
const RELATION_OPTIONS = ['Sinonim', 'Antonim', 'Asocijacija']

const mergeRelationPools = (primaryItems = [], fallbackItems = []) => {
  const itemMap = new Map()

  ;[...primaryItems, ...fallbackItems].forEach((item) => {
    const itemKey = `${item.leftWord}-${item.rightWord}-${item.relation}-${item.category}-${item.difficulty}`
    if (!itemMap.has(itemKey)) {
      itemMap.set(itemKey, item)
    }
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

function RelationGamePage() {
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
  const savedSessionChallengeIds = useMemo(
    () => (activeSession?.type === 'relation' ? activeSession.sessionChallengeIds || [] : []),
    [activeSession]
  )
  const isDailyMode =
    activeSession?.isDaily === true &&
    activeSession?.type === 'relation' &&
    Boolean(dailyContent)
  const hasExpiredDailySession = isExpiredDailySession(activeSession)

  const fallbackChallenges = useMemo(
    () => getRelationChallengesByDifficulty(difficulty, category),
    [difficulty, category]
  )
  const [allChallenges, setAllChallenges] = useState(fallbackChallenges)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const resolvedSessionChallengeIds = useMemo(() => {
    if (isDailyMode || !allChallenges.length) {
      return []
    }

    const validIds = savedSessionChallengeIds.filter((itemId) =>
      allChallenges.some((item) => item.id === itemId)
    )

    if (validIds.length > 0) {
      return validIds
    }

    return shuffleItems(allChallenges)
      .slice(0, Math.min(5, allChallenges.length))
      .map((item) => item.id)
  }, [allChallenges, isDailyMode, savedSessionChallengeIds])

  const challenges = useMemo(() => {
    if (isDailyMode) {
      return [dailyContent].filter(Boolean)
    }

    const selectedChallenges = resolvedSessionChallengeIds
      .map((itemId) => allChallenges.find((item) => item.id === itemId))
      .filter(Boolean)

    return (selectedChallenges.length ? selectedChallenges : allChallenges.slice(0, 5)).filter(Boolean)
  }, [allChallenges, dailyContent, isDailyMode, resolvedSessionChallengeIds])

  useEffect(() => {
    if (isDailyMode) return

    let isMounted = true

    const loadChallenges = async () => {
      try {
        const response = await getRelationContentRequest({ difficulty, category })
        if (!isMounted) return
        setAllChallenges(
          response.items?.length
            ? mergeRelationPools(response.items, fallbackChallenges)
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

  const [index, setIndex] = useState(
    activeSession?.type === 'relation' ? activeSession.index || 0 : 0
  )
  const [selectedRelation, setSelectedRelation] = useState(
    activeSession?.type === 'relation' ? activeSession.selectedRelation || '' : ''
  )
  const [score, setScore] = useState(
    activeSession?.type === 'relation' ? activeSession.score || BASE_SCORE : BASE_SCORE
  )
  const [correct, setCorrect] = useState(
    activeSession?.type === 'relation' ? activeSession.correct || 0 : 0
  )
  const [answers, setAnswers] = useState(
    activeSession?.type === 'relation' ? activeSession.answers || [] : []
  )
  const [showHint, setShowHint] = useState(
    activeSession?.type === 'relation' ? activeSession.showHint || false : false
  )
  const [hintUsedSteps, setHintUsedSteps] = useState(
    activeSession?.type === 'relation' ? activeSession.hintUsedSteps || [] : []
  )
  const [startedAt] = useState(
    activeSession?.type === 'relation'
      ? activeSession.startedAt || new Date().toISOString()
      : new Date().toISOString()
  )

  const currentChallenge = challenges[index]
  const hintAlreadyUsedForCurrentStep = hintUsedSteps.includes(index)
  const hintCount = hintUsedSteps.length
  const displayScore = Math.max(0, score - BASE_SCORE)
  const helpSections = [
    {
      title: 'Cilj igre',
      text: 'Za svaki par rijeci izaberi da li su sinonimi, antonimi ili samo smisleno povezane asocijacijom.',
    },
    {
      title: 'Kako prepoznati odgovor',
      items: [
        'Sinonim: rijeci imaju slicno ili isto znacenje.',
        'Antonim: rijeci imaju suprotno znacenje.',
        'Asocijacija: rijeci nisu iste ni suprotne, ali su logicno povezane.',
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

    if (!challenges.length) {
      navigate('/home')
    }
  }, [challenges.length, hasExpiredDailySession, navigate])

  useEffect(() => {
    if (hasExpiredDailySession || !challenges.length) return

    saveActiveSession({
      type: 'relation',
      index,
      selectedRelation,
      score,
      correct,
      answers,
      showHint,
      hintUsedSteps,
      hintCount,
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
      sessionChallengeIds: isDailyMode ? [] : resolvedSessionChallengeIds,
    })
  }, [
    answers,
    challenges.length,
    correct,
    dailyChallengeId,
    dailyContent,
    dailyContentId,
    dailyContentType,
    dailyDateKey,
    dailyReward,
    dailySelectionCategory,
    dailySelectionDifficulty,
    hintCount,
    hintUsedSteps,
    index,
    isDailyMode,
    resolvedSessionChallengeIds,
    score,
    selectedRelation,
    showHint,
    startedAt,
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

  const handleNext = async () => {
    if (!currentChallenge || !selectedRelation) return

    const isAccepted = selectedRelation === currentChallenge.relation
    const updatedScore = isAccepted
      ? score +
        calculateRelationReward({
          difficulty: currentChallenge.difficulty || difficulty,
          hintUsed: hintAlreadyUsedForCurrentStep,
        })
      : Math.max(0, score - WRONG_ANSWER_PENALTY)
    const updatedCorrect = isAccepted ? correct + 1 : correct

    const updatedAnswers = [
      ...answers,
      {
        prompt: `${currentChallenge.leftWord} / ${currentChallenge.rightWord}`,
        answer: selectedRelation,
        accepted: isAccepted,
        hintUsed: hintAlreadyUsedForCurrentStep,
        solution: currentChallenge.relation,
        roundDifficulty: currentChallenge.difficulty || difficulty,
      },
    ]

    setScore(updatedScore)
    setCorrect(updatedCorrect)
    setAnswers(updatedAnswers)

    if (index < challenges.length - 1) {
      setIndex((prev) => prev + 1)
      setSelectedRelation('')
      setShowHint(false)
      return
    }

    const elapsedMs = new Date().getTime() - new Date(startedAt).getTime()
    const seconds = Math.max(1, Math.floor(elapsedMs / 1000))
    const accuracy = Math.round((updatedCorrect / challenges.length) * 100)
    const currentUser = getCurrentUser()
    const performanceBonus = calculatePerformanceBonus({
      difficulty: currentChallenge.difficulty || difficulty,
      total: challenges.length,
      correct: updatedCorrect,
      time: seconds,
      hintCount,
      type: 'relation',
    })
    const finalScore = updatedScore + performanceBonus
    const earnedPoints = Math.max(0, finalScore - BASE_SCORE)
    const completedDaily =
      isDailyMode && challenges.length > 0 && updatedCorrect === challenges.length
    const fallbackDailyReward = completedDaily ? Number(dailyReward || 500) : 0

    const historyEntry = {
      type: 'relation',
      score: finalScore,
      baseScore: updatedScore,
      earnedPoints,
      awardedPoints: earnedPoints + fallbackDailyReward,
      roundScore: finalScore,
      performanceBonus,
      dailyReward: fallbackDailyReward,
      total: challenges.length,
      correct: updatedCorrect,
      accuracy,
      time: seconds,
      category: currentChallenge.category,
      difficulty: currentChallenge.difficulty,
      hintCount,
      isDaily: isDailyMode,
      answers: updatedAnswers,
      username: currentUser?.username,
      dailyChallengeId: isDailyMode ? dailyChallengeId : null,
      dailyDateKey: isDailyMode ? dailyDateKey : null,
      dailyContentType: isDailyMode ? dailyContentType || 'relation' : null,
      dailyContentId: isDailyMode ? dailyContentId || currentChallenge.id : null,
      dailySelectionDifficulty: isDailyMode ? dailySelectionDifficulty || difficulty : null,
      dailySelectionCategory: isDailyMode ? dailySelectionCategory || category : null,
    }

    const submission = {
      gameType: isDailyMode ? 'Dnevna relacija' : 'Sinonim / Antonim',
      content: updatedAnswers.map((item) => `${item.prompt} -> ${item.answer}`).join(' | '),
      points: historyEntry.awardedPoints,
      time: seconds,
      isDaily: isDailyMode,
    }

    const syncResult = await syncCompletedGame({ historyEntry, submission })
    const finalHistoryEntry = syncResult.historyEntry

    saveLastResult({
      type: 'relation',
      score: finalHistoryEntry.score ?? finalScore,
      earnedPoints: finalHistoryEntry.earnedPoints ?? earnedPoints,
      performanceBonus: finalHistoryEntry.performanceBonus ?? performanceBonus,
      total: finalHistoryEntry.total ?? challenges.length,
      correct: finalHistoryEntry.correct ?? updatedCorrect,
      accuracy: finalHistoryEntry.accuracy ?? accuracy,
      time: finalHistoryEntry.time ?? seconds,
      answers: updatedAnswers,
      category: currentChallenge.category,
      difficulty: currentChallenge.difficulty,
      hintCount,
      isDaily: finalHistoryEntry.isDaily,
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
          title="Sinonim / Antonim"
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
              <span>VEZA</span>
              <div>
                <small>RUNDA</small>
                <strong>
                  {Math.max(1, index + 1)} / {challenges.length}
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
            <h2 className="logic-title">Povezanost rijeci</h2>
            <span className="tag green-soft-tag">Izaberi odnos</span>
          </div>

          <div className="logic-grid">
            <div className="logic-box">{currentChallenge?.leftWord}</div>
            <div className="logic-box">{currentChallenge?.rightWord}</div>
          </div>

          <div className="segmented">
            {RELATION_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={selectedRelation === option ? 'active' : ''}
                onClick={() => setSelectedRelation(option)}
              >
                {option}
              </button>
            ))}
          </div>

          {showHint && (
            <p className="muted small-text">
              Pomoc: {currentChallenge?.hint || 'Pomisli na odnos izmedju pojmova.'}
            </p>
          )}

          <div className="dual-actions">
            <button
              className="secondary-btn"
              type="button"
              onClick={handleToggleHint}
              disabled={hintAlreadyUsedForCurrentStep}
            >
              {hintAlreadyUsedForCurrentStep ? 'Pomoc iskoriscena' : 'Prikazi pomoc (-5)'}
            </button>

            <button className="primary-btn" type="button" onClick={handleNext}>
              {index === challenges.length - 1 ? 'Zavrsi rundu' : 'Potvrdi odgovor'}
            </button>
          </div>
        </div>

        <GameHelpModal
          open={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          title="Sinonim / Antonim / Asocijacija"
          subtitle="Proceni kakav odnos imaju dvije prikazane rijeci."
          sections={helpSections}
          footer="Ako nisi siguran, prvo razmisli da li su rijeci slicne, suprotne ili samo povezane."
        />
      </div>
    </div>
  )
}

export default RelationGamePage
