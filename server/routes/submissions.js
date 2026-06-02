import { Router } from 'express'
import { query } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/', requireAuth, async (req, res) => {
  const body = req.body || {}
  const cleanGameType = String(body.gameType || '').trim()
  const cleanContent = String(body.content || '').trim()
  const safePoints = Math.max(0, Number(body.points) || 0)
  const safeTime = Math.max(0, Number(body.time) || 0)
  const safeIsDaily = body.isDaily ? 1 : 0
  const submissionKind =
    String(body.submissionKind || '').trim() === 'answer_review' ? 'answer_review' : 'game'
  const contentType =
    ['association', 'logic', 'relation'].includes(String(body.contentType || '').trim())
      ? String(body.contentType || '').trim()
      : null
  const contentItemId = Number(body.contentItemId || 0) || null
  const proposedAnswer = String(body.proposedAnswer || '').trim() || null

  if (!cleanGameType || !cleanContent) {
    return res.status(400).json({ message: 'Tip igre i sadrzaj su obavezni.' })
  }

  const result = await query(
    `INSERT INTO game_submissions
      (user_label, game_type, content, points, time_seconds, status, is_daily, submission_kind, content_type, content_item_id, proposed_answer)
     VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
    [
      req.user.username,
      cleanGameType,
      cleanContent,
      safePoints,
      safeTime,
      safeIsDaily,
      submissionKind,
      contentType,
      contentItemId,
      proposedAnswer,
    ]
  )

  return res.status(201).json({
    item: {
      id: result.insertId,
      user: req.user.username,
      type: cleanGameType,
      content: cleanContent,
      points: safePoints,
      time: safeTime,
      status: 'pending',
      isDaily: Boolean(safeIsDaily),
      submissionKind,
      contentType,
      contentItemId,
      proposedAnswer,
      createdAt: new Date().toISOString(),
    },
  })
})

export default router
