import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import LevelThemeEffects from './LevelThemeEffects'
import MessagePopup from './MessagePopup'
import ReviewStatusWatcher from './ReviewStatusWatcher'
import { STORAGE_CHANGE_EVENT, getAuthToken, getCurrentUser } from '../utils/storage'

function ProtectedRoute({ children, adminOnly = false }) {
  const [authSnapshot, setAuthSnapshot] = useState(() => ({
    currentUser: getCurrentUser(),
    token: getAuthToken(),
  }))

  useEffect(() => {
    const syncAuthSnapshot = () => {
      setAuthSnapshot({
        currentUser: getCurrentUser(),
        token: getAuthToken(),
      })
    }

    window.addEventListener(STORAGE_CHANGE_EVENT, syncAuthSnapshot)
    window.addEventListener('focus', syncAuthSnapshot)

    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, syncAuthSnapshot)
      window.removeEventListener('focus', syncAuthSnapshot)
    }
  }, [])

  const currentUser = authSnapshot.currentUser
  const token = authSnapshot.token

  if (!currentUser || !token) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/home" replace />
  }

  return (
    <>
      {children}
      <LevelThemeEffects currentUser={currentUser} />
      <ReviewStatusWatcher />
      <MessagePopup />
    </>
  )
}

export default ProtectedRoute
