import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { query } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { getGoogleClientId } from '../utils/env.js'
import { signUserToken } from '../utils/jwt.js'

const router = Router()
const googleOAuthClient = new OAuth2Client()

const validatePassword = (password = '') => {
  if (password.length < 4) {
    return 'Lozinka mora imati najmanje 4 karaktera.'
  }

  if (!/[A-Z]/.test(password)) {
    return 'Lozinka mora imati bar jedno veliko slovo.'
  }

  return ''
}

const normalizeUsernameCandidate = (value = '') =>
  String(value || '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^0-9A-Za-z_]/g, '')
    .slice(0, 80)

const buildPublicUser = (user = {}) => ({
  id: user.id,
  username: user.username,
  role: user.role,
  points: Number(user.points || 0),
  level: Number(user.level || 1),
  progressResetAt: user.progress_reset_at ?? user.progressResetAt ?? null,
  email: user.email || null,
  avatarUrl: user.avatar_url || user.avatarUrl || null,
  authProvider: user.auth_provider || user.authProvider || 'local',
})

const getUniqueUsername = async (baseUsername = '', excludeUserId = 0) => {
  const normalizedBase =
    normalizeUsernameCandidate(baseUsername) || `igrac${Math.floor(Math.random() * 9000) + 1000}`

  let attempt = 0

  while (attempt < 200) {
    const candidate =
      attempt === 0
        ? normalizedBase
        : `${normalizedBase.slice(0, Math.max(1, 76 - String(attempt + 1).length))}_${attempt + 1}`

    if (candidate.toLowerCase() === 'admin') {
      attempt += 1
      continue
    }

    const rows = await query(
      'SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id <> ? LIMIT 1',
      [candidate, Number(excludeUserId || 0)]
    )

    if (!rows.length) {
      return candidate
    }

    attempt += 1
  }

  return `igrac_${Date.now()}`
}

const resolveLinkedAuthProvider = (user = {}) => {
  if (user.password_hash) {
    return 'hybrid'
  }

  return 'google'
}

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

  const passwordValidationMessage = validatePassword(password)
  if (passwordValidationMessage) {
    return res.status(400).json({ message: passwordValidationMessage })
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
    "INSERT INTO users (username, password_hash, auth_provider, role, points, level) VALUES (?, ?, 'local', ?, 0, 1)",
    [cleanUsername, passwordHash, role]
  )

  const user = buildPublicUser({
    id: result.insertId,
    username: cleanUsername,
    role,
    points: 0,
    level: 1,
    progress_reset_at: null,
    email: null,
    avatar_url: null,
    auth_provider: 'local',
  })

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
    'SELECT id, username, email, avatar_url, auth_provider, google_id, password_hash, role, points, level, progress_reset_at FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1',
    [cleanUsername]
  )

  const user = users[0]
  if (!user) {
    return res.status(401).json({ message: 'Pogresno korisnicko ime ili lozinka.' })
  }

  if (!user.password_hash) {
    return res.status(401).json({
      message: 'Ovaj nalog koristi Google prijavu. Klikni na Google dugme.',
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash)
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Pogresno korisnicko ime ili lozinka.' })
  }

  return res.json({
    token: signUserToken(buildPublicUser(user)),
    user: buildPublicUser(user),
  })
})

router.post('/google', async (req, res) => {
  const googleClientId = getGoogleClientId()
  const credential = String(req.body?.credential || '').trim()

  if (!googleClientId) {
    return res.status(503).json({
      message: 'Google prijava jos nije konfigurirana na serveru.',
    })
  }

  if (!credential) {
    return res.status(400).json({ message: 'Google credential je obavezan.' })
  }

  let payload = null

  try {
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    })

    payload = ticket.getPayload() || null
  } catch {
    return res.status(401).json({ message: 'Google prijava nije validna.' })
  }

  if (!payload?.sub || !payload?.email || payload.email_verified === false) {
    return res.status(401).json({
      message: 'Google nalog mora imati verifikovan email.',
    })
  }

  const googleId = String(payload.sub)
  const email = String(payload.email).trim().toLowerCase()
  const displayName = String(payload.name || payload.given_name || email.split('@')[0] || 'Igrac')
  const picture = String(payload.picture || '').trim() || null

  let existingUser = (
    await query(
      `SELECT
         id,
         username,
         email,
         avatar_url,
         auth_provider,
         google_id,
         password_hash,
         role,
         points,
         level,
         progress_reset_at
       FROM users
       WHERE google_id = ? OR LOWER(email) = LOWER(?)
       ORDER BY CASE WHEN google_id = ? THEN 0 ELSE 1 END
       LIMIT 1`,
      [googleId, email, googleId]
    )
  )[0]

  if (existingUser?.role === 'admin') {
    return res.status(403).json({
      message: 'Admin nalog se ne moze povezati preko Google prijave iz ovog toka.',
    })
  }

  if (existingUser) {
    const nextAuthProvider = resolveLinkedAuthProvider(existingUser)

    await query(
      `UPDATE users
       SET email = ?, google_id = ?, avatar_url = ?, auth_provider = ?
       WHERE id = ?`,
      [email, googleId, picture, nextAuthProvider, existingUser.id]
    )

    existingUser = (
      await query(
        `SELECT
           id,
           username,
           email,
           avatar_url,
           auth_provider,
           google_id,
           password_hash,
           role,
           points,
           level,
           progress_reset_at
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [existingUser.id]
      )
    )[0]
  } else {
    const preferredUsername = await getUniqueUsername(
      payload.given_name || displayName || email.split('@')[0]
    )

    const result = await query(
      `INSERT INTO users
        (username, email, password_hash, auth_provider, google_id, avatar_url, role, points, level)
       VALUES (?, ?, NULL, 'google', ?, ?, 'user', 0, 1)`,
      [preferredUsername, email, googleId, picture]
    )

    existingUser = (
      await query(
        `SELECT
           id,
           username,
           email,
           avatar_url,
           auth_provider,
           google_id,
           password_hash,
           role,
           points,
           level,
           progress_reset_at
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [result.insertId]
      )
    )[0]
  }

  const publicUser = buildPublicUser(existingUser)

  return res.json({
    token: signUserToken(publicUser),
    user: publicUser,
  })
})

router.get('/me', requireAuth, async (req, res) => {
  const users = await query(
    'SELECT id, username, email, avatar_url, auth_provider, role, points, level, progress_reset_at, created_at FROM users WHERE id = ? LIMIT 1',
    [req.user.id]
  )

  const user = users[0]
  if (!user) {
    return res.status(404).json({ message: 'Korisnik nije pronadjen.' })
  }

  return res.json({
    user: {
      ...buildPublicUser(user),
      createdAt: user.created_at,
    },
  })
})

export default router
