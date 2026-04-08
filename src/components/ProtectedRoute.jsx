import { Navigate } from 'react-router-dom'
import MessagePopup from './MessagePopup'
import { getAuthToken, getCurrentUser } from '../utils/storage'

function ProtectedRoute({ children, adminOnly = false }) {
  const currentUser = getCurrentUser()
  const token = getAuthToken()

  if (!currentUser || !token) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/home" replace />
  }

  return (
    <>
      {children}
      <MessagePopup />
    </>
  )
}

export default ProtectedRoute
