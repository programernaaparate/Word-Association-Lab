import { Router } from 'express'
import { query } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import {
  buildDailyChallengePayload,
  getContentItemsByType,
  getDateKey,
  resolveDailyChallenge,
} from '../utils/content.js'

const router = Router()

router.get('/association', async (req, res) => {
  const { difficulty, category } = req.query
  const rows = await getContentItemsByType('association', { difficulty, category })

  return res.json({
    items: rows,
  })
})

router.get('/logic', async (req, res) => {
  const { difficulty, category, mode } = req.query
  const rows = await getContentItemsByType('logic', { difficulty, category, mode })

  return res.json({
    items: rows,
  })
})

router.get('/relation', async (req, res) => {
  const { difficulty, category } = req.query
  const rows = await getContentItemsByType('relation', { difficulty, category })

  return res.json({
    items: rows,
  })
})

router.get('/daily', requireAuth, async (req, res) => {
  const dateKey = getDateKey()
  const resolvedChallenge = await resolveDailyChallenge({ dateKey })

  if (!resolvedChallenge) {
    return res.json({ challenge: null })
  }

  const completionRows = await query(
    `SELECT id
     FROM daily_challenge_completions
     WHERE user_id = ? AND challenge_date = ?
     LIMIT 1`,
    [req.user.id, dateKey]
  )

  const challenge = buildDailyChallengePayload({
    dateKey,
    type: resolvedChallenge.type,
    content: resolvedChallenge.content,
    isCompleted: Boolean(completionRows[0]),
  })

  return res.json({
    challenge,
    override: resolvedChallenge.isOverride
      ? {
          id: resolvedChallenge.overrideId,
          dateKey,
          type: resolvedChallenge.type,
          contentId: resolvedChallenge.contentId,
        }
      : null,
  })
})

export default router
