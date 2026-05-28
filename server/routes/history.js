import { Router } from 'express'
import { getPool, query } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { calculateHistoryMetrics } from '../utils/rewards.js'
import {
  calculateLevelFromPoints,
  DAILY_REWARD,
  getDateKey,
  resolveDailyChallenge,
} from '../utils/content.js'

const router = Router()
const MAX_HISTORY_SAVE_RETRIES = 3

const isDeadlockError = (error) =>
  error?.code === 'ER_LOCK_DEADLOCK' || error?.errno === 1213

const mapHistoryItem = (item) => ({
  id: item.id,
  type: item.game_type,
  score: item.score,
  baseScore: item.base_score,
  earnedPoints: item.earned_points,
  awardedPoints: item.awarded_points,
  total: item.total,
  correct: item.correct,
  accuracy: item.accuracy,
  time: item.time_seconds,
  category: item.category,
  difficulty: item.difficulty,
  hintCount: item.hint_count,
  isDaily: Boolean(item.is_daily),
  dailyReward: item.daily_reward,
  createdAt: item.created_at,
})

router.get('/me', requireAuth, async (req, res) => {
  const rows = await query(
    `SELECT id, game_type, score, base_score, earned_points, awarded_points, total, correct,
            accuracy, time_seconds, category, difficulty, hint_count, is_daily,
            daily_reward, created_at
     FROM game_history
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 50`,
    [req.user.id]
  )

  const [summary] = await query(
    `SELECT
        COUNT(*) AS total_games,
        COALESCE(SUM(awarded_points), 0) AS total_points,
        COALESCE(SUM(CASE WHEN daily_reward > 0 THEN 1 ELSE 0 END), 0) AS completed_daily,
        COALESCE(ROUND(AVG(accuracy)), 0) AS average_accuracy,
        COALESCE(MAX(awarded_points), 0) AS best_score
     FROM game_history
     WHERE user_id = ?`,
    [req.user.id]
  )

  return res.json({
    items: rows.map(mapHistoryItem),
    summary: {
      totalGames: Number(summary?.total_games || 0),
      totalPoints: Number(summary?.total_points || 0),
      completedDaily: Number(summary?.completed_daily || 0),
      averageAccuracy: Number(summary?.average_accuracy || 0),
      bestScore: Number(summary?.best_score || 0),
    },
  })
})

router.delete('/me', requireAuth, async (req, res) => {
  return res.status(403).json({
    message: 'Reset napretka radi samo administrator kroz admin panel.',
  })
})

router.post('/', requireAuth, async (req, res) => {
  const {
    type,
    earnedPoints = 0,
    time = 0,
    category = null,
    difficulty = null,
    hintCount = 0,
    isDaily = false,
    dailyReward = 0,
    dailyDateKey = null,
    dailyContentType = null,
    dailyContentId = null,
    answers = [],
  } = req.body || {}

  if (!type) {
    return res.status(400).json({ message: 'Tip igre je obavezan.' })
  }

  const calculatedMetrics = calculateHistoryMetrics({
    type,
    difficulty,
    earnedPoints,
    time,
    hintCount,
    answers,
    total: req.body?.total,
    correct: req.body?.correct,
    accuracy: req.body?.accuracy,
  })
  const safeScore = Math.max(0, Number(calculatedMetrics.score) || 0)
  const safeBaseScore = Math.max(0, Number(calculatedMetrics.baseScore) || 0)
  const safeEarnedPoints = Math.max(0, Number(calculatedMetrics.earnedPoints) || 0)
  const safeTotal = Math.max(0, Number(calculatedMetrics.total) || 0)
  const safeCorrect = Math.max(0, Number(calculatedMetrics.correct) || 0)
  const safeAccuracy = Math.max(0, Number(calculatedMetrics.accuracy) || 0)
  const safeTime = Math.max(0, Number(time) || 0)
  const safeHintCount = Math.max(0, Number(hintCount) || 0)
  const completedSuccessfully = safeTotal > 0 && safeCorrect >= safeTotal

  for (let attempt = 1; attempt <= MAX_HISTORY_SAVE_RETRIES; attempt += 1) {
    const connection = await getPool().getConnection()

    try {
      await connection.beginTransaction()

      let resolvedDailyReward = Math.max(0, Number(dailyReward) || 0)

      if (isDaily) {
        const todayKey = getDateKey()
        const requestedDateKey = String(dailyDateKey || todayKey)
        const expectedChallenge = await resolveDailyChallenge(
          { dateKey: requestedDateKey },
          connection
        )

        const matchesDailyChallenge =
          requestedDateKey === todayKey &&
          expectedChallenge &&
          expectedChallenge.type === dailyContentType &&
          Number(expectedChallenge.contentId) === Number(dailyContentId)

        if (matchesDailyChallenge && completedSuccessfully) {
          const [completionRows] = await connection.execute(
            `SELECT id
             FROM daily_challenge_completions
             WHERE user_id = ? AND challenge_date = ?
             LIMIT 1`,
            [req.user.id, requestedDateKey]
          )

          if (!completionRows.length) {
            resolvedDailyReward = DAILY_REWARD

            await connection.execute(
              `INSERT INTO daily_challenge_completions
                (user_id, challenge_date, content_type, content_id, reward)
               VALUES (?, ?, ?, ?, ?)`,
              [
                req.user.id,
                requestedDateKey,
                expectedChallenge.type,
                expectedChallenge.contentId,
                DAILY_REWARD,
              ]
            )
          } else {
            resolvedDailyReward = 0
          }
        } else {
          resolvedDailyReward = 0
        }
      } else {
        resolvedDailyReward = 0
      }

      const finalAwardedPoints = safeEarnedPoints + resolvedDailyReward

      const [insertResult] = await connection.execute(
        `INSERT INTO game_history
          (user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
           accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          type,
          safeScore,
          safeBaseScore,
          safeEarnedPoints,
          finalAwardedPoints,
          safeTotal,
          safeCorrect,
          safeAccuracy,
          safeTime,
          category,
          difficulty,
          safeHintCount,
          Number(Boolean(isDaily)),
          resolvedDailyReward,
        ]
      )

      await connection.execute(
        `UPDATE users
         SET points = points + ?
         WHERE id = ?`,
        [finalAwardedPoints, req.user.id]
      )

      const [updatedUsers] = await connection.execute(
        `SELECT id, username, role, points, level
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [req.user.id]
      )
      const updatedUser = updatedUsers[0] || null

      if (updatedUser) {
        const nextLevel = calculateLevelFromPoints(updatedUser.points)

        if (updatedUser.level !== nextLevel) {
          await connection.execute('UPDATE users SET level = ? WHERE id = ?', [
            nextLevel,
            req.user.id,
          ])
          updatedUser.level = nextLevel
        }
      }
      const [historyRows] = await connection.execute(
        `SELECT id, game_type, score, base_score, earned_points, awarded_points, total, correct,
                accuracy, time_seconds, category, difficulty, hint_count, is_daily,
                daily_reward, created_at
         FROM game_history
         WHERE id = ?
         LIMIT 1`,
        [insertResult.insertId]
      )

      await connection.commit()

      return res.status(201).json({
        history: mapHistoryItem(historyRows[0]),
        user: updatedUser,
      })
    } catch (error) {
      await connection.rollback()

      if (isDeadlockError(error) && attempt < MAX_HISTORY_SAVE_RETRIES) {
        continue
      }

      throw error
    } finally {
      connection.release()
    }
  }
})

export default router
