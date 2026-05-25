import { useNavigate } from 'react-router-dom'
import AppIcon from './AppIcon'

const navItems = [
  { key: 'home', label: 'Pocetna', icon: 'home', path: '/home' },
  { key: 'history', label: 'Napredak', icon: 'chart', path: '/history' },
  { key: 'leaderboard', label: 'Rang lista', icon: 'trophy', path: '/leaderboard' },
  { key: 'profile', label: 'Profil', icon: 'user', path: '/profile' },
]

function BottomNav({ current = 'home' }) {
  const navigate = useNavigate()

  const handleNavigate = (path, key) => {
    if (current === key) return
    navigate(path)
  }

  return (
    <nav className="bottom-nav" aria-label="Donja navigacija">
      {navItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`bottom-item ${current === item.key ? 'active' : ''}`}
          onClick={() => handleNavigate(item.path, item.key)}
          aria-current={current === item.key ? 'page' : undefined}
        >
          <span className="bottom-icon">
            <AppIcon name={item.icon} size={19} />
          </span>
          <small>{item.label}</small>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
