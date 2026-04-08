import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppIcon from '../components/AppIcon'
import BottomNav from '../components/BottomNav'
import { getCurrentUserRequest, getDailyChallengeRequest } from '../utils/api'
import {
  calculateLevelFromPoints,
  clearActiveSession,
  getActiveSession,
  getAuthToken,
  getCategory,
  getDailyChallengeCompletionState,
  getCurrentUser,
  getCurrentUserGameHistory,
  getDifficulty,
  getTodayKey,
  isExpiredDailySession,
  saveActiveSession,
  saveCategory,
  saveCurrentUser,
  saveDifficulty,
} from '../utils/storage'

const ALL_CATEGORIES = [
  'Sve',
  'Nauka',
  'Sport',
  'Film',
  'Istorija',
  'Priroda',
  'Umjetnost',
  'Tehnologija',
  'Geografija',
]

const getMillisecondsUntilNextDailyReset = () => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Podgorica',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })

  const now = new Date()
  const parts = formatter.formatToParts(now)
  const year = Number(parts.find((part) => part.type === 'year')?.value || 0)
  const month = Number(parts.find((part) => part.type === 'month')?.value || 1)
  const day = Number(parts.find((part) => part.type === 'day')?.value || 1)
  const hour = Number(parts.find((part) => part.type === 'hour')?.value || 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value || 0)
  const second = Number(parts.find((part) => part.type === 'second')?.value || 0)

  const podgoricaNow = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    now.getMilliseconds()
  )
  const nextMidnight = new Date(podgoricaNow)
  nextMidnight.setDate(nextMidnight.getDate() + 1)
  nextMidnight.setHours(0, 0, 0, 250)

  return Math.max(1000, nextMidnight.getTime() - podgoricaNow.getTime())
}

function HomePage() {
  const navigate = useNavigate()
  const token = getAuthToken()
  const activeSession = getActiveSession()
  const [user, setUser] = useState(() => getCurrentUser())
  const [selectedCategory, setSelectedCategory] = useState(getCategory())
  const [selectedDifficulty, setSelectedDifficulty] = useState(getDifficulty())
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [dailyChallenge, setDailyChallenge] = useState(null)
  const [dailyError, setDailyError] = useState('')
  const [dailyDateKey, setDailyDateKey] = useState(() => getTodayKey())
  const hasContinuableSession = Boolean(activeSession?.type) && !isExpiredDailySession(activeSession)
  const historyPoints = getCurrentUserGameHistory().reduce(
    (sum, item) => sum + Math.max(0, Number(item.awardedPoints ?? item.earnedPoints ?? 0) || 0),
    0
  )
  const displayPoints = Math.max(Number(user?.points || 0), historyPoints)
  const displayLevel = Math.max(
    Number(user?.level || 1),
    calculateLevelFromPoints(displayPoints)
  )

  const visibleCategories = useMemo(
    () => (showAllCategories ? ALL_CATEGORIES : ALL_CATEGORIES.slice(0, 5)),
    [showAllCategories]
  )

  useEffect(() => {
    let isMounted = true

    const loadCurrentUser = async () => {
      if (!token) {
        return
      }

      try {
        const response = await getCurrentUserRequest(token)
        if (!isMounted || !response.user) {
          return
        }

        const nextUser = {
          ...response.user,
          points: Math.max(Number(response.user?.points || 0), historyPoints),
        }
        nextUser.level = calculateLevelFromPoints(nextUser.points)

        saveCurrentUser(nextUser)
        setUser(nextUser)
      } catch {
        if (!isMounted) {
          return
        }

        setUser(getCurrentUser())
      }
    }

    loadCurrentUser()

    return () => {
      isMounted = false
    }
  }, [historyPoints, token])

  useEffect(() => {
    if (!token) {
      return undefined
    }

    let timeoutId

    const syncDailyDateKey = () => {
      const nextDateKey = getTodayKey()
      setDailyDateKey((currentDateKey) =>
        currentDateKey === nextDateKey ? currentDateKey : nextDateKey
      )
    }

    const scheduleDailyRefresh = () => {
      timeoutId = window.setTimeout(() => {
        syncDailyDateKey()
        scheduleDailyRefresh()
      }, getMillisecondsUntilNextDailyReset())
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncDailyDateKey()
      }
    }

    syncDailyDateKey()
    scheduleDailyRefresh()
    window.addEventListener('focus', syncDailyDateKey)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener('focus', syncDailyDateKey)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [token])

  useEffect(() => {
    if (isExpiredDailySession(activeSession)) {
      clearActiveSession()
    }
  }, [activeSession, dailyDateKey])

  useEffect(() => {
    let isMounted = true

    const loadDailyChallenge = async () => {
      if (!token) {
        return
      }

      try {
        setDailyError('')
        const response = await getDailyChallengeRequest(token)

        if (!isMounted) {
          return
        }

        const currentUser = getCurrentUser()
        const localCompleted = response.challenge
          ? getDailyChallengeCompletionState(response.challenge.dateKey, currentUser?.id)
          : false
        const resolvedChallenge = response.challenge
          ? {
              ...response.challenge,
              isCompleted: response.challenge.isCompleted || localCompleted,
              progress:
                response.challenge.isCompleted || localCompleted
                  ? 100
                  : response.challenge.progress || 0,
            }
          : null

        setDailyChallenge(resolvedChallenge)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setDailyChallenge(null)
        setDailyError(error.message)
      }
    }

    loadDailyChallenge()

    return () => {
      isMounted = false
    }
  }, [dailyDateKey, token])

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty)
    saveDifficulty(difficulty)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    saveCategory(category)
  }

  const navigateToSessionType = (type) => {
    if (type === 'logic') {
      navigate('/logic-challenge')
      return
    }

    if (type === 'relation') {
      navigate('/relation-game')
      return
    }

    if (type === 'word-chain') {
      navigate('/word-chain')
      return
    }

    navigate('/association-game')
  }

  const handleContinue = () => {
    if (isExpiredDailySession(activeSession)) {
      clearActiveSession()
      return
    }

    if (!activeSession?.type) {
      navigate('/association-game')
      return
    }

    navigateToSessionType(activeSession.type)
  }

  const handleNewSession = () => {
    clearActiveSession()
    navigate('/association-game')
  }

  const handleFreshGameStart = (route) => {
    clearActiveSession()
    navigate(route)
  }

  const handleDailyGameStart = () => {
    if (!dailyChallenge?.content) {
      return
    }

    clearActiveSession()
    saveActiveSession({
      type: dailyChallenge.type,
      mode: dailyChallenge.content?.mode || 'concept',
      index: 0,
      answer: '',
      score: 1200,
      correct: 0,
      answers: [],
      selectedRelation: '',
      showHint: false,
      startedAt: new Date().toISOString(),
      isDaily: true,
      dailyChallengeId: dailyChallenge.id,
      dailyDateKey: dailyChallenge.dateKey,
      dailyReward: dailyChallenge.reward,
      dailyContent: dailyChallenge.content,
      dailyContentId: dailyChallenge.contentId,
      dailyContentType: dailyChallenge.type,
      dailySelectionDifficulty: selectedDifficulty,
      dailySelectionCategory: selectedCategory,
      hintUsedSteps: [],
      hintCount: 0,
      revealedClues: { 0: 1 },
    })
    navigateToSessionType(dailyChallenge.type)
  }

  return (
    <div className="screen">
      <div className="phone-card app-shell">
        <div className="home-topbar">
          <button
            className="header-square-btn"
            onClick={() => navigate('/home')}
            type="button"
            aria-label="Pocetna"
          >
            <AppIcon name="lab" size={18} />
          </button>

          <h1>Word Association Lab</h1>

          <button
            className="header-icon-btn"
            onClick={() => navigate('/profile')}
            type="button"
            aria-label="Profil"
          >
            <AppIcon name="user" size={18} />
          </button>
        </div>

        <div className="page-content home-page">
          <div className="home-profile-card">
            <div className="home-avatar-wrap">
              <div className="home-avatar">{user?.username?.charAt(0)?.toUpperCase() || 'M'}</div>
              <span className="home-online-dot"></span>
            </div>

            <div className="home-profile-text">
              <h2>Zdravo, {user?.username || 'Marko'}!</h2>
              <p>Lab istrazivac - Nivo {displayLevel}</p>
            </div>

            <div className="home-points-box">
              <div className="points-number">{displayPoints}</div>
              <div className="points-label">UKUPNO POENA</div>
            </div>
          </div>

          <section className="home-section">
            <h3 className="home-section-title">NIVO TEZINE</h3>

            <div className="difficulty-tabs">
              <button
                type="button"
                className={selectedDifficulty === 'Lako' ? 'active' : ''}
                onClick={() => handleDifficultyChange('Lako')}
              >
                Lako
              </button>

              <button
                type="button"
                className={selectedDifficulty === 'Srednje' ? 'active' : ''}
                onClick={() => handleDifficultyChange('Srednje')}
              >
                Srednje
              </button>

              <button
                type="button"
                className={selectedDifficulty === 'Tesko' ? 'active' : ''}
                onClick={() => handleDifficultyChange('Tesko')}
              >
                Tesko
              </button>
            </div>
          </section>

          <section className="home-section">
            <div className="home-section-row">
              <h3 className="home-section-title">KATEGORIJE</h3>

              <button
                className="home-link-button"
                onClick={() => setShowAllCategories((prev) => !prev)}
                type="button"
              >
                {showAllCategories ? 'Sakrij' : 'Vidi sve'}
              </button>
            </div>

            <div className="category-row">
              {visibleCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-pill neutral-pill ${
                    selectedCategory === category ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>

          <button
            className="daily-card clickable-card"
            onClick={handleDailyGameStart}
            type="button"
            disabled={!dailyChallenge?.content}
          >
            <div className="daily-top-row">
              <span className="daily-badge">Dnevni izazov</span>
              <span className="daily-timer">
                {dailyChallenge?.isCompleted
                  ? 'Zavrseno'
                  : dailyChallenge?.reward
                    ? `+${dailyChallenge.reward} XP`
                    : 'Ucitaj'}
              </span>
            </div>

            <h2>{dailyChallenge?.title || 'Ucitaj dnevni izazov'}</h2>
            <p>
              {dailyChallenge?.description ||
                dailyError ||
                'Daily challenge ce se pojaviti cim backend vrati sadrzaj.'}
            </p>

            <div className="daily-percent">{dailyChallenge?.progress ?? 0}%</div>
          </button>

          <button className="start-session-btn" onClick={handleNewSession} type="button">
            <span className="start-icon">Start</span>
            <span>Pocni novu sesiju</span>
            <span className="start-arrow">{'>'}</span>
          </button>

          <div className="home-mini-grid">
            <button className="home-mini-card" onClick={handleContinue} type="button">
              <div className="mini-icon soft-blue-box">
                <AppIcon name="play" size={20} />
              </div>
              <span>{hasContinuableSession ? 'Nastavi sesiju' : 'Brzi start'}</span>
            </button>

            <button className="home-mini-card" onClick={() => navigate('/history')} type="button">
              <div className="mini-icon soft-green-box">
                <AppIcon name="chart" size={20} />
              </div>
              <span>Napredak</span>
            </button>

            <button
              className="home-mini-card"
              onClick={() => handleFreshGameStart('/logic-challenge')}
              type="button"
            >
              <div className="mini-icon soft-blue-box">
                <AppIcon name="logic" size={20} />
              </div>
              <span>Zajednicki pojam</span>
            </button>

            <button
              className="home-mini-card"
              onClick={() => handleFreshGameStart('/relation-game')}
              type="button"
            >
              <div className="mini-icon soft-green-box">
                <AppIcon name="relation" size={20} />
              </div>
              <span>Sinonim / Antonim</span>
            </button>

            <button
              className="home-mini-card"
              onClick={() => handleFreshGameStart('/word-chain')}
              type="button"
            >
              <div className="mini-icon soft-blue-box">
                <AppIcon name="chain" size={20} />
              </div>
              <span>Lanac rijeci</span>
            </button>

            {user?.role === 'admin' && (
              <button
                className="home-mini-card"
                onClick={() => navigate('/explore')}
                type="button"
              >
                <div className="mini-icon soft-green-box">
                  <AppIcon name="search" size={20} />
                </div>
                <span>Baza sadrzaja</span>
              </button>
            )}
          </div>

          <button
            className="leaderboard-large-btn"
            onClick={() => navigate('/leaderboard')}
            type="button"
          >
            <AppIcon name="trophy" size={20} />
            <span>Tabela lidera</span>
          </button>

          {user?.role === 'admin' && (
            <button
              className="leaderboard-large-btn"
              onClick={() => navigate('/admin')}
              type="button"
            >
              <AppIcon name="shield" size={20} />
              <span>Administracija</span>
            </button>
          )}

          <p className="home-quote">"Rijeci su mostovi izmedju misli."</p>
        </div>

        <BottomNav current="home" />
      </div>
    </div>
  )
}

export default HomePage


