import { useEffect, useState } from 'react'
import BottomNav from '../components/BottomNav'
import Navbar from '../components/Navbar'
import { getCurrentUserRequest, getMyHistoryRequest } from '../utils/api'
import {
  calculateLevelFromPoints,
  getAuthToken,
  getCurrentUser,
  getCurrentUserGameHistory,
  getLevelProgress,
  getPlayerProgressOverview,
  saveCurrentUser,
} from '../utils/storage'

const getHistoryPoints = (history) =>
  history.reduce(
    (sum, item) => sum + Math.max(0, Number(item.awardedPoints ?? item.earnedPoints ?? 0) || 0),
    0
  )

const getHistoryKey = (item) =>
  [
    item?.id || 'local',
    item?.type || '',
    item?.createdAt || '',
    item?.score || '',
    item?.total || '',
    item?.correct || '',
  ].join('-')

const mergeHistoryLists = (remoteHistory = []) => {
  const localHistory = getCurrentUserGameHistory()
  const mergedMap = new Map()

  ;[...(remoteHistory || []), ...localHistory].forEach((item) => {
    const itemKey = getHistoryKey(item)
    if (!mergedMap.has(itemKey)) {
      mergedMap.set(itemKey, item)
    }
  })

  return Array.from(mergedMap.values()).sort(
    (leftItem, rightItem) => new Date(rightItem.createdAt || 0) - new Date(leftItem.createdAt || 0)
  )
}

const buildHistorySummary = (history = []) => {
  const overview = getPlayerProgressOverview(history)

  return {
    ...overview,
    totalPoints: Math.max(overview.totalPoints, getHistoryPoints(history)),
  }
}

function HistoryPage() {
  const token = getAuthToken()
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  const [history, setHistory] = useState(() => mergeHistoryLists([]))
  const [summary, setSummary] = useState(() => buildHistorySummary(mergeHistoryLists([])))
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(Boolean(token))

  useEffect(() => {
    let isMounted = true

    const loadHistory = async () => {
      if (!token) return

      try {
        setIsLoading(true)
        setError('')
        const [historyResponse, userResponse] = await Promise.all([
          getMyHistoryRequest(token),
          getCurrentUserRequest(token),
        ])

        if (!isMounted) return

        const remoteHistory = historyResponse.items || []
        const mergedHistory = mergeHistoryLists(remoteHistory)
        const localUser = getCurrentUser()
        const fallbackSummary = buildHistorySummary(mergedHistory)
        const remoteSummary = historyResponse.summary || null
        const nextSummary =
          remoteSummary && mergedHistory.length === remoteHistory.length
            ? {
                ...fallbackSummary,
                ...remoteSummary,
              }
            : fallbackSummary
        const historyPoints = nextSummary.totalPoints
        const nextUser = {
          ...(localUser || {}),
          ...(userResponse.user || {}),
          points: Math.max(
            Number(userResponse.user?.points || 0),
            Number(localUser?.points || 0),
            historyPoints
          ),
        }

        nextUser.level = calculateLevelFromPoints(nextUser.points)
        saveCurrentUser(nextUser)
        setCurrentUser(nextUser)
        setHistory(mergedHistory)
        setSummary(nextSummary)
      } catch (requestError) {
        if (!isMounted) return

        const localHistory = mergeHistoryLists([])
        setHistory(localHistory)
        setSummary(buildHistorySummary(localHistory))
        setError(
          localHistory.length
            ? 'Prikazujemo lokalnu istoriju dok se backend ne usaglasi.'
            : requestError.message
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadHistory()

    return () => {
      isMounted = false
    }
  }, [token])

  const displayPoints = Math.max(Number(currentUser?.points || 0), summary.totalPoints)
  const levelProgress = getLevelProgress(displayPoints)

  const formatType = (type) => {
    if (type === 'logic') return 'Logicki test'
    if (type === 'logic-odd-one-out') return 'Ne pripada'
    if (type === 'relation') return 'Sinonim / Antonim'
    if (type === 'word-chain') return 'Lanac rijeci'
    return 'Asocijacije'
  }

  const formatTime = (seconds = 0) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
    const remainderSeconds = String(seconds % 60).padStart(2, '0')
    return `${minutes}:${remainderSeconds}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Bez datuma'

    return new Intl.DateTimeFormat('sr-Latn-ME', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  return (
    <div className="screen app-screen">
      <div className="phone-card app-shell">
        <Navbar title="Napredak" showBack />

        <div className="page-content history-page">
          <div className="leaderboard-card">
            <h2>Pregled napretka</h2>
            <p className="muted">Tvoje partije, preciznost i dnevni izazovi na jednom mjestu.</p>

            <div className="mini-stats-grid">
              <div className="mini-stat-card">
                <small>PARTIJE</small>
                <strong>{summary.totalGames}</strong>
              </div>

              <div className="mini-stat-card">
                <small>ZARADJEN XP</small>
                <strong>{summary.totalPoints}</strong>
              </div>

              <div className="mini-stat-card">
                <small>TACNOST</small>
                <strong>{summary.averageAccuracy}%</strong>
              </div>
            </div>

            <div className="mini-stats-grid">
              <div className="mini-stat-card">
                <small>BEST XP</small>
                <strong>{summary.bestScore}</strong>
              </div>

              <div className="mini-stat-card">
                <small>PERFEKTNE</small>
                <strong>{summary.perfectRuns}</strong>
              </div>

              <div className="mini-stat-card">
                <small>BEDZEVI</small>
                <strong>{summary.achievementCount}</strong>
              </div>
            </div>

            <div className="profile-info-box">
              <p><strong>Dnevni izazovi:</strong> {summary.completedDaily}</p>
              <p><strong>Nivo:</strong> {levelProgress.level}</p>
              <p><strong>Do sledeceg nivoa:</strong> {levelProgress.remainingXp} XP</p>
              <p><strong>Aktivni streak:</strong> {summary.currentStreak} dana</p>
              <p><strong>Najbolji combo:</strong> {summary.bestCombo > 0 ? `x${summary.bestCombo}` : 'Nema'}</p>
            </div>
          </div>

          <div className="leaderboard-card">
            <h2>Istorija partija</h2>
            <p className="muted">Pregled tvojih poslednjih rezultata.</p>
            {error ? <p className="error">{error}</p> : null}

            <div className="leaderboard-list">
              {isLoading ? (
                <div className="page-loading-card">Ucitavamo tvoju istoriju i napredak...</div>
              ) : history.length > 0 ? (
                history.map((item, index) => (
                  <div className="leaderboard-row" key={`${item.id}-${index}`}>
                    <div className="leaderboard-rank">#{index + 1}</div>

                    <div className="leaderboard-user">
                      <div className="leaderboard-avatar">{formatType(item.type).charAt(0)}</div>
                      <div>
                        <strong>
                          {formatType(item.type)}
                          {item.isDaily ? ' / Daily' : ''}
                        </strong>
                        <p>
                          {item.correct}/{item.total} / {item.accuracy}% / {formatTime(item.time)}
                        </p>
                        <p>{formatDate(item.createdAt)}</p>
                      </div>
                    </div>

                    <div className="leaderboard-points">
                      +{item.awardedPoints ?? item.earnedPoints ?? 0} XP
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-admin-state">Jos nema odigranih partija.</div>
              )}
            </div>
          </div>
        </div>

        <BottomNav current="history" />
      </div>
    </div>
  )
}

export default HistoryPage

