import jwt from 'jsonwebtoken'
import { getJwtSecret } from '../utils/env.js'

const getTokenFromHeader = (header = '') => {
  if (!header.startsWith('Bearer ')) {
    return null
  }

  return header.slice(7)
}

export const requireAuth = (req, res, next) => {
  const token = getTokenFromHeader(req.headers.authorization)

  if (!token) {
    return res.status(401).json({ message: 'Nedostaje autorizacija.' })
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret())
    req.user = decoded
    return next()
  } catch {
    return res.status(401).json({ message: 'Token nije validan.' })
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin pristup je potreban.' })
  }

  return next()
}
