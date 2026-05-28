import { useEffect, useMemo, useState } from 'react'
import BottomNav from '../components/BottomNav'
import Navbar from '../components/Navbar'
import { getLeaderboardRequest } from '../utils/api'
import { calculateLevelFromPoints, getCurrentUser } from '../utils/storage'

function LeaderboardPage() {
  const currentUser = getCurrentUser()
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadLeaderboard = async () => {
      try {
        setIsLoading(true)
        setError('')
        const response = await getLeaderboardRequest()

        if (!isMounted) return

        setUsers(response.users || [])
      } catch (requestError) {
        if (!isMounted) return
        setError(requestError.message)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadLeaderboard()

    return () => {
      isMounted = false
    }
  }, [])

  const topUsers = useMemo(() => users.slice(0, 10), [users])
  const podiumUsers = useMemo(() => topUsers.slice(0, 3), [topUsers])
  const currentUserRank = useMemo(() => {
    const rank = users.findIndex((user) => user.id === currentUser?.id) + 1
    return rank || null
  }, [currentUser?.id, users])

  const getRankBadge = (index) => {
    if (index === 0) return '#1'
    if (index === 1) return '#2'
    if (index === 2) return '#3'
    return `#${index + 1}`
  }

  return (
    <div className="screen app-screen">
      <div className="phone-card app-shell">
        <Navbar title="Rang lista" showBack />

        <div className="page-content leaderboard-page">
          <div className="leaderboard-card">
            <h2>Najbolji igraci</h2>
            <p className="muted">Rang lista po ukupnom broju poena i nivou aktivnosti.</p>
            {error ? <p className="error">{error}</p> : null}

            <div className="mini-stats-grid">
              <div className="mini-stat-card">
                <small>IGRACA</small>
                <strong>{users.length}</strong>
              </div>

              <div className="mini-stat-card">
                <small>TVOJ RANK</small>
                <strong>{currentUserRank || '-'}</strong>
              </div>

              <div className="mini-stat-card">
                <small>TOP SCORE</small>
                <strong>{topUsers[0]?.points ?? 0}</strong>
              </div>
            </div>
          </div>

          {currentUser && (
            <div className="leaderboard-card">
              <div className="section-row">
                <h2>Tvoja pozicija</h2>
                <span className="muted">U odnosu na sve korisnike</span>
              </div>

              <div className="leaderboard-row leaderboard-row-highlight">
                <div className="leaderboard-rank">{currentUserRank || '-'}</div>

                <div className="leaderboard-user">
                  <div className="leaderboard-avatar">
                    {currentUser.username?.charAt(0)?.toUpperCase() || 'K'}
                  </div>

                  <div>
                    <strong>{currentUser.username || 'Korisnik'}</strong>
                    <p>{currentUser.role === 'admin' ? 'Administrator' : 'Igrac'}</p>
                  </div>
                </div>

                <div className="leaderboard-points">{currentUser.points ?? 0}</div>
              </div>
            </div>
          )}

          <div className="leaderboard-card">
            {podiumUsers.length > 0 ? (
              <div className="leaderboard-podium">
                {podiumUsers.map((user, index) => (
                  <div className="leaderboard-podium-card" key={`podium-${user.id}`}>
                    <span className="leaderboard-podium-rank">{getRankBadge(index)}</span>
                    <strong>{user.username || 'Korisnik'}</strong>
                    <small>Nivo {calculateLevelFromPoints(user.points || 0)}</small>
                    <p>{user.points ?? 0} XP</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="leaderboard-list">
              {isLoading ? (
                <div className="page-loading-card">Ucitavamo rang listu...</div>
              ) : topUsers.length > 0 ? (
                topUsers.map((user, index) => (
                  <div
                    className={`leaderboard-row ${
                      user.id === currentUser?.id ? 'leaderboard-row-highlight' : ''
                    }`}
                    key={user.id}
                  >
                    <div className="leaderboard-rank">{getRankBadge(index)}</div>

                    <div className="leaderboard-user">
                      <div className="leaderboard-avatar">
                        {user.username?.charAt(0)?.toUpperCase() || 'K'}
                      </div>

                      <div>
                        <strong>{user.username || 'Korisnik'}</strong>
                        <p>
                          {user.role === 'admin'
                            ? 'Administrator'
                            : `Nivo ${calculateLevelFromPoints(user.points || 0)}`}
                        </p>
                      </div>
                    </div>

                    <div className="leaderboard-points">{user.points ?? 0}</div>
                  </div>
                ))
              ) : (
                <div className="empty-admin-state">Jos nema korisnika na tabeli.</div>
              )}
            </div>
          </div>
        </div>

        <BottomNav current="leaderboard" />
      </div>
    </div>
  )
}

export default LeaderboardPage


