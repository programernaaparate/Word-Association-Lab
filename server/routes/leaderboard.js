import { Router } from 'express'
import { query } from '../config/db.js'

const router = Router()

router.get('/', async (_req, res) => {
  const users = await query(
    `SELECT id, username, role, points, level
     FROM users
     ORDER BY points DESC, username ASC
     LIMIT 50`
  )

  return res.json({ users })
})

export default router
