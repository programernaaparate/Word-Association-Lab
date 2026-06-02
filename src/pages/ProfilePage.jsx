import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import Navbar from '../components/Navbar'
import {
  buildHistorySummary,
  mergeRemoteHistoryWithLocal,
  persistMergedHistory,
} from '../utils/historySync'
import {
  getCurrentUserRequest,
  getMyHistoryRequest,
} from '../utils/api'
import {
  calculateLevelFromPoints,
  clearActiveSession,
  clearAllAppData,
  getActiveSession,
  getAuthToken,
  getCurrentUser,
  isExpiredDailySession,
  getLevelProgress,
  logoutUser,
  saveCurrentUser,
} from '../utils/storage'
import { getLevelTheme } from '../utils/levelTheme'
import { getSoundEnabled, playSuccessSound, saveSoundEnabled } from '../utils/uiFeedback'

function ProfilePage() {
  const navigate = useNavigate()
  const token = getAuthToken()
  const activeSession = getActiveSession()
  const [user, setUser] = useState(() => getCurrentUser())
  const [summary, setSummary] = useState(() =>
    buildHistorySummary(mergeRemoteHistoryWithLocal([]))
  )
  const [error, setError] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(() => getSoundEnabled())
  const hasContinuableSession = Boolean(activeSession?.type) && !isExpiredDailySession(activeSession)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      if (!token) {
        return
      }

      try {
        setError('')
        const [userResponse, historyResponse] = await Promise.all([
          getCurrentUserRequest(token),
          getMyHistoryRequest(token),
        ])

        if (!isMounted) {
          return
        }

        const remoteHistory = historyResponse.items || []
        const mergedHistory = mergeRemoteHistoryWithLocal(remoteHistory)
        const localUser = getCurrentUser()
        const nextSummary = buildHistorySummary(mergedHistory, historyResponse.summary || null)
        const nextUser = {
          ...(localUser || {}),
          ...(userResponse.user || {}),
        }

        nextUser.points = Math.max(
          0,
          Number(userResponse.user?.points ?? nextUser.points ?? nextSummary.totalPoints ?? 0) || 0
        )
        nextUser.level = calculateLevelFromPoints(nextUser.points)

        persistMergedHistory(mergedHistory)
        saveCurrentUser(nextUser)
        setUser(nextUser)
        setSummary(nextSummary)
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        const localHistory = mergeRemoteHistoryWithLocal([])
        setSummary(buildHistorySummary(localHistory))
        setError(
          localHistory.length
            ? 'Prikazujemo lokalne podatke dok se backend ne usaglasi.'
            : requestError.message
        )
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [token])

  useEffect(() => {
    if (isExpiredDailySession(activeSession)) {
      clearActiveSession()
    }
  }, [activeSession])

  const displayPoints = Math.max(0, Number(user?.points ?? summary.totalPoints ?? 0) || 0)
  const username = user?.username || 'Korisnik'
  const role = user?.role === 'admin' ? 'Administrator' : 'Igrac laboratorije'
  const levelData = getLevelProgress(displayPoints)
  const levelTheme = getLevelTheme(levelData.level)

  const formatSessionType = (type) => {
    if (type === 'logic') return 'Logicki izazov'
    if (type === 'relation') return 'Sinonim / Antonim'
    if (type === 'word-chain') return 'Lanac rijeci'
    return 'Asocijacije'
  }

  const handleResume = () => {
    if (isExpiredDailySession(activeSession)) {
      clearActiveSession()
      navigate('/home')
      return
    }

    if (activeSession?.type === 'logic') {
      navigate('/logic-challenge')
      return
    }

    if (activeSession?.type === 'word-chain') {
      navigate('/word-chain')
      return
    }

    if (activeSession?.type === 'relation') {
      navigate('/relation-game')
      return
    }

    navigate('/association-game')
  }

  const handleClearSession = () => {
    if (!window.confirm('Da li sigurno zelis da obrises aktivnu sesiju?')) {
      return
    }

    clearActiveSession()
    navigate('/home')
  }

  const handleFullReset = () => {
    if (!window.confirm('Da li sigurno zelis da resetujes sve lokalne podatke?')) {
      return
    }

    clearAllAppData()
    navigate('/register')
  }

  const handleSoundToggle = () => {
    const nextValue = saveSoundEnabled(!soundEnabled)
    setSoundEnabled(nextValue)

    if (nextValue) {
      playSuccessSound()
    }
  }

  return (
    <div className="screen app-screen">
      <div className="phone-card app-shell">
        <Navbar title="Profil" showBack />

        <div className="page-content profile-page">
          <div className={`profile-page-card level-hero-card ${levelTheme.tier}`}>
            <div className="profile-big-avatar">{username.charAt(0).toUpperCase()}</div>

            <h2>{username}</h2>
            <p className="muted">{role}</p>
            <span className="level-rank-chip profile-rank-chip">{levelTheme.title}</span>
            {error ? <p className="error">{error}</p> : null}

            <div className="profile-stats">
              <div className="profile-stat">
                <small>UKUPNO POENA</small>
                <strong>{displayPoints}</strong>
              </div>

              <div className="profile-stat">
                <small>NIVO</small>
                <strong>{levelData.level}</strong>
              </div>
            </div>

            <div className="level-card">
              <div className="section-row">
                <h3>Napredak nivoa</h3>
                <span>
                  {levelData.currentXp} / {levelData.neededXp} XP
                </span>
              </div>

              <div className="level-progress">
                <span style={{ width: `${levelData.progressPercent}%` }}></span>
              </div>

              <p className="muted small-text">
                Jos {levelData.remainingXp} XP do sledeceg nivoa.
              </p>
            </div>

            <div className="profile-info-box">
              <p><strong>Korisnicko ime:</strong> {username}</p>
              <p><strong>Uloga:</strong> {role}</p>
              <p><strong>Status:</strong> Aktivan korisnik</p>
              <p><strong>Aktivni niz:</strong> {summary.currentStreak} dana</p>
              <p><strong>Najbolja serija:</strong> {summary.bestCombo > 0 ? `x${summary.bestCombo}` : 'Nema'}</p>
            </div>
          </div>

          <div className="leaderboard-card">
            <div className="section-row">
              <h2>Tvoj pregled</h2>
              <button
                className="home-link-button"
                type="button"
                onClick={() => navigate('/history')}
              >
                Vidi istoriju
              </button>
            </div>

            <div className="mini-stats-grid">
              <div className="mini-stat-card">
                <small>PARTIJE</small>
                <strong>{summary.totalGames}</strong>
              </div>

              <div className="mini-stat-card">
                <small>NAJBOLJI XP</small>
                <strong>{summary.bestScore}</strong>
              </div>

              <div className="mini-stat-card">
                <small>DNEVNI</small>
                <strong>{summary.completedDaily}</strong>
              </div>
            </div>

            <div className="mini-stats-grid">
              <div className="mini-stat-card">
                <small>NIZ</small>
                <strong>{summary.currentStreak}</strong>
              </div>

              <div className="mini-stat-card">
                <small>SERIJA</small>
                <strong>{summary.bestCombo > 0 ? `x${summary.bestCombo}` : '-'}</strong>
              </div>

              <div className="mini-stat-card">
                <small>BEDZEVI</small>
                <strong>{summary.achievementCount}</strong>
              </div>
            </div>

            <div className="profile-info-box">
              <p><strong>Ukupno zaradjen XP iz istorije:</strong> {summary.totalPoints}</p>
              <p><strong>Najduzi niz:</strong> {summary.longestStreak} dana</p>
              <p><strong>Perfektnih partija:</strong> {summary.perfectRuns}</p>
            </div>
          </div>

          <div className="leaderboard-card">
            <div className="section-row">
              <h2>Otkljucani bedzevi</h2>
              <span className="muted">{summary.achievementCount} ukupno</span>
            </div>

            <div className="achievement-grid">
              {(summary.achievements || []).map((achievement) => (
                <div className="achievement-card" key={achievement.key}>
                  <div className={`badge-circle ${achievement.tone}`}></div>
                  <strong>{achievement.label}</strong>
                  <small>{achievement.description}</small>
                  <span className={achievement.unlocked ? 'link-text' : 'muted'}>
                    {achievement.progressLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="leaderboard-card">
            <div className="section-row">
              <h2>Aktivna sesija</h2>
              <span className="muted">{hasContinuableSession ? 'Sacuvano' : 'Nema'}</span>
            </div>

            {hasContinuableSession ? (
              <>
                <div className="profile-info-box">
                  <p><strong>Tip igre:</strong> {formatSessionType(activeSession.type)}</p>
                  <p><strong>Progres:</strong> korak {(activeSession.index ?? 0) + 1}</p>
                  <p><strong>Dnevni rezim:</strong> {activeSession.isDaily ? 'Da' : 'Ne'}</p>
                </div>

                <div className="results-actions">
                  <button className="secondary-btn" type="button" onClick={handleResume}>
                    Nastavi
                  </button>

                  <button
                    className="secondary-btn full-btn"
                    type="button"
                    onClick={handleClearSession}
                  >
                    Zatvori
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-admin-state">
                Trenutno nema aktivne sesije za nastavak.
              </div>
            )}
          </div>

          <div className="leaderboard-card">
            <div className="section-row">
              <h2>Podesavanja</h2>
              <span className="muted">Nalog i podaci</span>
            </div>

            <div className="settings-stack">
              <button className="secondary-btn full-btn" type="button" onClick={handleSoundToggle}>
                Zvukovi: {soundEnabled ? 'Ukljuceni' : 'Iskljuceni'}
              </button>

              {user?.role === 'admin' && (
                <>
                  <button
                    className="secondary-btn full-btn"
                    type="button"
                    onClick={() => navigate('/admin')}
                  >
                    Otvori administraciju
                  </button>

                  <button className="danger-btn full-btn" type="button" onClick={handleFullReset}>
                    Resetuj sve lokalne podatke
                  </button>
                </>
              )}

              <button
                className="danger-btn logout-btn full-btn"
                type="button"
                onClick={() => {
                  logoutUser()
                  navigate('/login')
                }}
              >
                Odjavi se
              </button>
            </div>
          </div>
        </div>

        <BottomNav current="profile" />
      </div>
    </div>
  )
}

export default ProfilePage
