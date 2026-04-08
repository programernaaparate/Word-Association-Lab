import { useNavigate } from 'react-router-dom'
import AppIcon from './AppIcon'
import { logoutUser } from '../utils/storage'

function Navbar({
  title = 'Word Association Lab',
  showBack = false,
  rightText = '',
  onRightClick,
  logout = false,
}) {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  const handleRight = () => {
    if (logout) {
      logoutUser()
      navigate('/login')
      return
    }

    if (onRightClick) {
      onRightClick()
    }
  }

  const isRightHidden = !rightText && !logout

  return (
    <header className="topbar">
      <button
        type="button"
        className={`icon-btn ${showBack ? '' : 'invisible'}`}
        onClick={handleBack}
        aria-label="Nazad"
      >
        <AppIcon name="arrow-left" size={18} />
      </button>

      <h1 className="topbar-title">{title}</h1>

      <button
        type="button"
        className={`icon-btn ${isRightHidden ? 'invisible' : ''}`}
        onClick={handleRight}
        aria-label={logout ? 'Odjava' : rightText || 'Akcija'}
      >
        {logout ? <AppIcon name="logout" size={18} /> : rightText}
      </button>
    </header>
  )
}

export default Navbar
