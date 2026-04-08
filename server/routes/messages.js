import { Router } from 'express'
import { query } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

const mapContact = (item) => ({
  id: item.id,
  username: item.username,
  role: item.role,
  points: Number(item.points || 0),
  level: Number(item.level || 1),
  unreadCount: Number(item.unread_count || 0),
  lastMessageAt: item.last_message_at,
})

const mapMessage = (item, currentUserId) => ({
  id: item.id,
  senderId: item.sender_id,
  recipientId: item.recipient_id,
  message: item.message,
  isRead: Boolean(item.is_read),
  createdAt: item.created_at,
  senderName: item.sender_name,
  senderRole: item.sender_role,
  isOwn: Number(item.sender_id) === Number(currentUserId),
})

const getConversationTarget = async (currentUser, otherUserId) => {
  const safeOtherUserId = Number(otherUserId || 0)

  if (!safeOtherUserId || safeOtherUserId === Number(currentUser.id)) {
    return { error: 'Izaberi validnog korisnika za razgovor.', status: 400 }
  }

  const users = await query(
    'SELECT id, username, role, points, level FROM users WHERE id = ? LIMIT 1',
    [safeOtherUserId]
  )
  const otherUser = users[0]

  if (!otherUser) {
    return { error: 'Korisnik nije pronadjen.', status: 404 }
  }

  const currentUserIsAdmin = currentUser.role === 'admin'
  const otherUserIsAdmin = otherUser.role === 'admin'

  if (!currentUserIsAdmin && !otherUserIsAdmin) {
    return { error: 'Poruke su dozvoljene samo izmedju korisnika i admina.', status: 403 }
  }

  return { otherUser }
}

router.get('/contacts', async (req, res) => {
  const currentUserId = Number(req.user.id)
  const isAdmin = req.user.role === 'admin'

  const rows = await query(
    `SELECT
        u.id,
        u.username,
        u.role,
        u.points,
        u.level,
        COALESCE(SUM(
          CASE
            WHEN m.recipient_id = ? AND m.sender_id = u.id AND m.is_read = 0 THEN 1
            ELSE 0
          END
        ), 0) AS unread_count,
        MAX(m.created_at) AS last_message_at
     FROM users u
     LEFT JOIN support_messages m
       ON (m.sender_id = u.id AND m.recipient_id = ?)
       OR (m.sender_id = ? AND m.recipient_id = u.id)
     WHERE u.id <> ?
       AND ${
         isAdmin ? "u.role <> 'admin'" : "u.role = 'admin'"
       }
     GROUP BY u.id, u.username, u.role, u.points, u.level
     ORDER BY unread_count DESC, last_message_at DESC, u.username ASC`,
    [currentUserId, currentUserId, currentUserId, currentUserId]
  )

  return res.json({ items: rows.map(mapContact) })
})

router.get('/thread/:otherUserId', async (req, res) => {
  const currentUserId = Number(req.user.id)
  const target = await getConversationTarget(req.user, req.params.otherUserId)

  if (target.error) {
    return res.status(target.status).json({ message: target.error })
  }

  await query(
    `UPDATE support_messages
     SET is_read = 1
     WHERE sender_id = ? AND recipient_id = ? AND is_read = 0`,
    [target.otherUser.id, currentUserId]
  )

  const rows = await query(
    `SELECT
        m.id,
        m.sender_id,
        m.recipient_id,
        m.message,
        m.is_read,
        m.created_at,
        sender.username AS sender_name,
        sender.role AS sender_role
     FROM support_messages m
     INNER JOIN users sender ON sender.id = m.sender_id
     WHERE (m.sender_id = ? AND m.recipient_id = ?)
        OR (m.sender_id = ? AND m.recipient_id = ?)
     ORDER BY m.created_at ASC`,
    [currentUserId, target.otherUser.id, target.otherUser.id, currentUserId]
  )

  return res.json({
    contact: target.otherUser,
    items: rows.map((item) => mapMessage(item, currentUserId)),
  })
})

router.post('/thread/:otherUserId', async (req, res) => {
  const currentUserId = Number(req.user.id)
  const target = await getConversationTarget(req.user, req.params.otherUserId)

  if (target.error) {
    return res.status(target.status).json({ message: target.error })
  }

  const message = String(req.body?.message || '').trim()
  if (!message) {
    return res.status(400).json({ message: 'Poruka ne moze biti prazna.' })
  }

  if (message.length > 1000) {
    return res.status(400).json({ message: 'Poruka je predugacka.' })
  }

  const result = await query(
    `INSERT INTO support_messages (sender_id, recipient_id, message, is_read)
     VALUES (?, ?, ?, 0)`,
    [currentUserId, target.otherUser.id, message]
  )

  const rows = await query(
    `SELECT
        m.id,
        m.sender_id,
        m.recipient_id,
        m.message,
        m.is_read,
        m.created_at,
        sender.username AS sender_name,
        sender.role AS sender_role
     FROM support_messages m
     INNER JOIN users sender ON sender.id = m.sender_id
     WHERE m.id = ?
     LIMIT 1`,
    [result.insertId]
  )

  return res.status(201).json({
    item: rows[0] ? mapMessage(rows[0], currentUserId) : null,
  })
})

export default router
