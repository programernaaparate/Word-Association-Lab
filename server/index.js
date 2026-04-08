import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.js'
import contentRoutes from './routes/content.js'
import leaderboardRoutes from './routes/leaderboard.js'
import historyRoutes from './routes/history.js'
import adminRoutes from './routes/admin.js'
import messageRoutes from './routes/messages.js'
import submissionsRoutes from './routes/submissions.js'
import { getPool } from './config/db.js'
import { assertRequiredServerEnv } from './utils/env.js'
import { runMigrations } from './utils/migrations.js'

const app = express()
const port = Number(process.env.PORT || 4000)
const allowedOrigins = new Set([process.env.CLIENT_URL || 'http://localhost:5173'])
const isLocalFrontendOrigin = (origin) => {
  if (!origin) {
    return true
  }

  if (allowedOrigins.has(origin)) {
    return true
  }

  try {
    const parsedOrigin = new URL(origin)
    const isLocalHost =
      parsedOrigin.hostname === 'localhost' || parsedOrigin.hostname === '127.0.0.1'

    return parsedOrigin.protocol === 'http:' && isLocalHost
  } catch {
    return false
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isLocalFrontendOrigin(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('CORS origin nije dozvoljen.'))
    },
    credentials: true,
  })
)
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    await getPool().query('SELECT 1')
    return res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: error.message,
    })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/submissions', submissionsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/messages', messageRoutes)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Doslo je do greske na serveru.' })
})

const startServer = async () => {
  assertRequiredServerEnv()
  await runMigrations()

  app.listen(port, () => {
    console.log(`Server radi na http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
