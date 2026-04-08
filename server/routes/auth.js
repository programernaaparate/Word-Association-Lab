import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { query } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { signUserToken } from '../utils/jwt.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { username = '', password = '' } = req.body || {}
  const cleanUsername = username.trim()

  if (!cleanUsername || !password) {
    return res.status(400).json({ message: 'Korisnicko ime i lozinka su obavezni.' })
  }

  if (cleanUsername.toLowerCase() === 'admin') {
    return res.status(403).json({
      message: 'Admin nalog se kreira samo direktno kroz bazu ili seed podatke.',
    })
  }

  if (password.length < 4) {
    return res.status(400).json({ message: 'Lozinka mora imati najmanje 4 karaktera.' })
  }

  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ message: 'Lozinka mora imati bar jedno veliko slovo.' })
  }

  const existingUsers = await query(
    'SELECT id FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1',
    [cleanUsername]
  )

  if (existingUsers.length > 0) {
    return res.status(409).json({ message: 'Korisnicko ime vec postoji.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const role = 'user'

  const result = await query(
    'INSERT INTO users (username, password_hash, role, points, level) VALUES (?, ?, ?, 0, 1)',
    [cleanUsername, passwordHash, role]
  )

  const user = {
    id: result.insertId,
    username: cleanUsername,
    role,
    points: 0,
    level: 1,
    progressResetAt: null,
  }

  return res.status(201).json({
    token: signUserToken(user),
    user,
  })
})

router.post('/login', async (req, res) => {
  const { username = '', password = '' } = req.body || {}
  const cleanUsername = username.trim()

  if (!cleanUsername || !password) {
    return res.status(400).json({ message: 'Korisnicko ime i lozinka su obavezni.' })
  }

  const users = await query(
    'SELECT id, username, password_hash, role, points, level, progress_reset_at FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1',
    [cleanUsername]
  )

  const user = users[0]
  if (!user) {
    return res.status(401).json({ message: 'Pogresno korisnicko ime ili lozinka.' })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash)
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Pogresno korisnicko ime ili lozinka.' })
  }

  return res.json({
    token: signUserToken(user),
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      points: user.points,
      level: user.level,
      progressResetAt: user.progress_reset_at,
    },
  })
})

router.get('/me', requireAuth, async (req, res) => {
  const users = await query(
    'SELECT id, username, role, points, level, progress_reset_at, created_at FROM users WHERE id = ? LIMIT 1',
    [req.user.id]
  )

  const user = users[0]
  if (!user) {
    return res.status(404).json({ message: 'Korisnik nije pronadjen.' })
  }

  return res.json({
    user: {
      ...user,
      progressResetAt: user.progress_reset_at,
    },
  })
})

export default router
