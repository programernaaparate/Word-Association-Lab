import { Router } from 'express'
import { query } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { getContentItemByTypeAndId } from '../utils/content.js'
import { parseWordChainSubmissionContext } from '../utils/wordChain.js'

const router = Router()

const REVIEW_REWARD_POINTS = 20

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

const buildReviewUpdate = async (item = {}) => {
  const contentType = item.content_type || null
  const contentItemId = Number(item.content_item_id || 0) || null
  const contentTarget =
    contentType && contentItemId ? await getContentItemByTypeAndId(contentType, contentItemId) : null
  const wordChainApproval = parseWordChainSubmissionContext({
    gameType: item.game_type,
    content: item.content,
    proposedAnswer: item.proposed_answer,
  })

  return {
    id: item.id,
    status: item.status,
    gameType: item.game_type,
    proposedAnswer: item.proposed_answer || '',
    contentType,
    contentItemId,
    rewardPoints: Number(item.points || 0),
    rewardGranted: Boolean(item.reward_granted),
    createdAt: item.created_at,
    reviewedAt: item.reviewed_at,
    contentTitle:
      contentTarget?.word ||
      contentTarget?.answer ||
      wordChainApproval?.centerWord ||
      (contentTarget ? `${contentTarget.leftWord || '?'} / ${contentTarget.rightWord || '?'}` : ''),
    contentSubtitle:
      contentTarget?.category && contentTarget?.difficulty
        ? `${contentTarget.category} / ${contentTarget.difficulty}`
        : wordChainApproval
          ? `${wordChainApproval.relation} / ${wordChainApproval.category} / ${wordChainApproval.difficulty}`
        : '',
    wordChainApproval,
  }
}

router.get('/review-updates', requireAuth, async (req, res) => {
  const rows = await query(
    `SELECT id, game_type, content, status, proposed_answer, content_type, content_item_id, points,
            reward_granted, created_at, reviewed_at
     FROM game_submissions
     WHERE submission_kind = 'answer_review'
       AND status IN ('approved', 'rejected')
       AND player_notified = 0
       AND (
         (user_id IS NOT NULL AND user_id = ?)
         OR (user_id IS NULL AND LOWER(user_label) = LOWER(?))
       )
     ORDER BY COALESCE(reviewed_at, created_at) ASC, id ASC
     LIMIT 20`,
    [req.user.id, req.user.username]
  )

  if (!rows.length) {
    return res.json({ items: [], user: null })
  }

  await query(
    `UPDATE game_submissions
     SET player_notified = 1
     WHERE id IN (${rows.map(() => '?').join(',')})`,
    rows.map((item) => item.id)
  )

  const [freshUser] = await query(
    `SELECT id, username, role, points, level, progress_reset_at, email, avatar_url, auth_provider
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [req.user.id]
  )

  const items = await Promise.all(rows.map((item) => buildReviewUpdate(item)))

  return res.json({
    items,
    user: freshUser ? buildPublicUser(freshUser) : null,
  })
})

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
  const submissionPoints =
    submissionKind === 'answer_review'
      ? Math.max(REVIEW_REWARD_POINTS, safePoints)
      : safePoints

  if (!cleanGameType || !cleanContent) {
    return res.status(400).json({ message: 'Tip igre i sadrzaj su obavezni.' })
  }

  const result = await query(
    `INSERT INTO game_submissions
      (user_id, user_label, game_type, content, points, time_seconds, status, is_daily, submission_kind, content_type, content_item_id, proposed_answer, player_notified)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, 1)`,
    [
      req.user.id,
      req.user.username,
      cleanGameType,
      cleanContent,
      submissionPoints,
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
      userId: req.user.id,
      type: cleanGameType,
      content: cleanContent,
      points: submissionPoints,
      time: safeTime,
      status: 'pending',
      isDaily: Boolean(safeIsDaily),
      submissionKind,
      contentType,
      contentItemId,
      proposedAnswer,
      rewardGranted: false,
      createdAt: new Date().toISOString(),
    },
  })
})

export default router
