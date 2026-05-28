import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppIcon from '../components/AppIcon'
import BottomNav from '../components/BottomNav'
import { getCurrentUserRequest, getDailyChallengeRequest } from '../utils/api'
import { getLevelTheme } from '../utils/levelTheme'
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

const AUTO_EXPAND_CATEGORIES_BREAKPOINT = 640

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
  const [shouldAutoExpandCategories, setShouldAutoExpandCategories] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.innerWidth >= AUTO_EXPAND_CATEGORIES_BREAKPOINT
  )
  const [dailyChallenge, setDailyChallenge] = useState(null)
  const [dailyError, setDailyError] = useState('')
  const [isDailyLoading, setIsDailyLoading] = useState(false)
  const [dailyDateKey, setDailyDateKey] = useState(() => getTodayKey())
  const hasContinuableSession = Boolean(activeSession?.type) && !isExpiredDailySession(activeSession)
  const hasSavedWordChainSession = activeSession?.type === 'word-chain'
  const historyPoints = getCurrentUserGameHistory().reduce(
    (sum, item) => sum + Math.max(0, Number(item.awardedPoints ?? item.earnedPoints ?? 0) || 0),
    0
  )
  const displayPoints = Math.max(Number(user?.points || 0), historyPoints)
  const displayLevel = Math.max(
    Number(user?.level || 1),
    calculateLevelFromPoints(displayPoints)
  )
  const levelTheme = getLevelTheme(displayLevel)
  const dailyStatusCopy = dailyChallenge?.isCompleted
    ? 'Danasnji izazov je vec zatvoren sa 100%.'
    : dailyChallenge?.content
      ? `Daily je spreman za ${selectedDifficulty.toLowerCase()} / ${selectedCategory.toLowerCase()} izbor.`
      : isDailyLoading
        ? 'Dnevni izazov se upravo ucitava iz baze.'
        : dailyError
          ? 'Daily trenutno nije dostupan, ali ostali modovi rade normalno.'
          : 'Cekamo da daily stigne sa servera.'
  const sessionStatusCopy = hasContinuableSession
    ? 'Imas sacuvanu sesiju koju mozes nastaviti bez gubitka progresa.'
    : `Sljedeca nova runda krece sa ${selectedDifficulty.toLowerCase()} tezinom i kategorijom ${selectedCategory.toLowerCase()}.`

  const visibleCategories = useMemo(
    () =>
      shouldAutoExpandCategories || showAllCategories
        ? ALL_CATEGORIES
        : ALL_CATEGORIES.slice(0, 7),
    [shouldAutoExpandCategories, showAllCategories]
  )
  const shouldShowCategoryToggle =
    !shouldAutoExpandCategories && ALL_CATEGORIES.length > 7

  useEffect(() => {
    const handleResize = () => {
      setShouldAutoExpandCategories(window.innerWidth >= AUTO_EXPAND_CATEGORIES_BREAKPOINT)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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
        setIsDailyLoading(false)
        return
      }

      try {
        setIsDailyLoading(true)
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
      } finally {
        if (isMounted) {
          setIsDailyLoading(false)
        }
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
    const latestSession = getActiveSession()

    if (isExpiredDailySession(latestSession)) {
      clearActiveSession()
      return
    }

    if (!latestSession?.type) {
      navigate('/association-game')
      return
    }

    navigateToSessionType(latestSession.type)
  }

  const handleNewSession = () => {
    clearActiveSession()
    navigate('/association-game')
  }

  const handleFreshGameStart = (route) => {
    clearActiveSession()
    navigate(route)
  }

  const handleWordChainStart = () => {
    if (hasSavedWordChainSession) {
      navigate('/word-chain')
      return
    }

    clearActiveSession()
    navigate('/word-chain')
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
    <div className="screen app-screen">
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
          <div className={`home-profile-card level-hero-card ${levelTheme.tier}`}>
            <div className="home-avatar-wrap">
              <div className="home-avatar">{user?.username?.charAt(0)?.toUpperCase() || 'M'}</div>
              <span className="home-online-dot"></span>
            </div>

            <div className="home-profile-text">
              <h2>Zdravo, {user?.username || 'Marko'}!</h2>
              <p>
                {levelTheme.title} - Nivo {displayLevel}
              </p>
              <span className="level-rank-chip">{levelTheme.accentLabel}</span>
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

              {shouldShowCategoryToggle ? (
                <button
                  className="home-link-button home-link-toggle"
                  onClick={() => setShowAllCategories((prev) => !prev)}
                  type="button"
                >
                  <span>{showAllCategories ? 'Sakrij' : 'Vidi sve'}</span>
                  <AppIcon name={showAllCategories ? 'arrow-up' : 'arrow-down'} size={12} />
                </button>
              ) : null}
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

          <section className="home-ready-card">
            <div className="home-ready-copy">
              <small>Tvoj naredni start</small>
              <strong>{hasContinuableSession ? 'Sesija te vec ceka' : 'Sve je spremno za novu rundu'}</strong>
              <p>{sessionStatusCopy}</p>
            </div>

            <div className="home-ready-tags">
              <span className="tag blue-pill">{selectedDifficulty}</span>
              <span className="tag neutral">{selectedCategory}</span>
              {dailyChallenge?.content ? (
                <span className="tag green-pill">
                  {dailyChallenge?.isCompleted ? 'Daily zavrsen' : 'Daily spreman'}
                </span>
              ) : null}
            </div>

            <p className="home-ready-note">{dailyStatusCopy}</p>
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
                    : isDailyLoading
                      ? 'Ucitavam...'
                      : 'Ucitaj'}
              </span>
            </div>

            <h2>{dailyChallenge?.title || 'Ucitaj dnevni izazov'}</h2>
            <p>
              {dailyChallenge?.description ||
                (isDailyLoading
                  ? 'Ucitavam dnevni izazov iz baze...'
                  : dailyError ||
                    'Daily challenge ce se pojaviti cim backend vrati sadrzaj.')}
            </p>

            <div className="daily-percent">{dailyChallenge?.progress ?? 0}%</div>
          </button>

          <section className="home-section">
            <div className="home-section-row">
              <h3 className="home-section-title">BRZE OPCIJE</h3>
              <span className="home-section-note">Precice i pomoc</span>
            </div>

            <div className="home-mini-grid">
              <button className="home-mini-card" onClick={handleContinue} type="button">
                <div className="mini-icon soft-blue-box">
                  <AppIcon name="play" size={20} />
                </div>
                <div className="home-mini-copy">
                  <strong>{hasContinuableSession ? 'Nastavi sesiju' : 'Brzi start'}</strong>
                  <small>
                    {hasContinuableSession
                      ? 'Vrati se tacno tamo gdje si stao'
                      : 'Odmah uskoči u novu rundu'}
                  </small>
                </div>
              </button>

              <button className="home-mini-card" onClick={() => navigate('/history')} type="button">
                <div className="mini-icon soft-green-box">
                  <AppIcon name="chart" size={20} />
                </div>
                <div className="home-mini-copy">
                  <strong>Napredak</strong>
                  <small>XP, istorija i tvoj ritam igre</small>
                </div>
              </button>

              <button className="home-mini-card" onClick={() => navigate('/guide')} type="button">
                <div className="mini-icon soft-blue-box">
                  <AppIcon name="guide" size={20} />
                </div>
                <div className="home-mini-copy">
                  <strong>Uputstvo</strong>
                  <small>Pravila, modovi i kratki savjeti</small>
                </div>
              </button>

              {user?.role === 'admin' ? (
                <button
                  className="home-mini-card"
                  onClick={() => navigate('/explore')}
                  type="button"
                >
                  <div className="mini-icon soft-green-box">
                    <AppIcon name="search" size={20} />
                  </div>
                  <div className="home-mini-copy">
                    <strong>Baza sadrzaja</strong>
                    <small>Admin pregled i uredjivanje sadrzaja</small>
                  </div>
                </button>
              ) : (
                <button
                  className="home-mini-card"
                  onClick={() => navigate('/profile')}
                  type="button"
                >
                  <div className="mini-icon soft-blue-box">
                    <AppIcon name="user" size={20} />
                  </div>
                  <div className="home-mini-copy">
                    <strong>Profil</strong>
                    <small>Nalog, nivo i pregled napretka</small>
                  </div>
                </button>
              )}
            </div>
          </section>

          <section className="home-section">
            <div className="home-section-row">
              <h3 className="home-section-title">IZABERI IGRU</h3>
              <span className="home-section-note">Tvoj sledeci mod</span>
            </div>

            <button
              className="start-session-btn association-cta"
              onClick={handleNewSession}
              type="button"
            >
              <span className="start-icon">
                <AppIcon name="play" size={18} />
              </span>
              <span className="start-copy">
                <strong>Asocijacije</strong>
                <small>Pokreni novu rundu</small>
              </span>
              <span className="start-arrow">{'>'}</span>
            </button>

            <div className="home-mini-grid home-games-grid">
              <button
                className="home-mini-card home-game-card game-logic"
                onClick={() => handleFreshGameStart('/logic-challenge')}
                type="button"
              >
                <div className="mini-icon soft-blue-box">
                  <AppIcon name="logic" size={20} />
                </div>
                <div className="home-game-copy">
                  <strong>Zajednicki pojam</strong>
                  <small>Povezi kartice jednim pojmom</small>
                </div>
              </button>

              <button
                className="home-mini-card home-game-card game-relation"
                onClick={() => handleFreshGameStart('/relation-game')}
                type="button"
              >
                <div className="mini-icon soft-green-box">
                  <AppIcon name="relation" size={20} />
                </div>
                <div className="home-game-copy">
                  <strong>Sinonim / Antonim</strong>
                  <small>Prepoznaj odnos izmedju rijeci</small>
                </div>
              </button>

              <button
                className="home-mini-card home-game-card game-chain"
                onClick={handleWordChainStart}
                type="button"
              >
                <div className="mini-icon soft-blue-box">
                  <AppIcon name="chain" size={20} />
                </div>
                <div className="home-game-copy">
                  <strong>Lanac rijeci</strong>
                  <small>
                    {hasSavedWordChainSession
                      ? 'Nastavi svoj postojeci lanac'
                      : 'Napravi smislen niz veza'}
                  </small>
                </div>
              </button>
            </div>
          </section>

          <button
            className="leaderboard-large-btn"
            onClick={() => navigate('/leaderboard')}
            type="button"
          >
            <AppIcon name="trophy" size={20} />
            <span>Rang lista</span>
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


