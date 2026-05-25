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
import aiRoutes from './routes/ai.js'
import { getPool } from './config/db.js'
import { assertRequiredServerEnv } from './utils/env.js'
import { runMigrations } from './utils/migrations.js'

const app = express()
const port = Number(process.env.PORT || 4000)
const allowedOrigins = new Set([process.env.CLIENT_URL || 'http://localhost:5173'])
const allowedNativeOrigins = new Set([
  'http://localhost',
  'https://localhost',
  'http://127.0.0.1',
  'https://127.0.0.1',
  'capacitor://localhost',
  'ionic://localhost',
])

const isPrivateLanHost = (hostname) => {
  return (
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)
  )
}

const isLocalFrontendOrigin = (origin) => {
  if (!origin) {
    return true
  }

  if (allowedOrigins.has(origin)) {
    return true
  }

  if (allowedNativeOrigins.has(origin)) {
    return true
  }

  try {
    const parsedOrigin = new URL(origin)
    const isLocalHost =
      parsedOrigin.hostname === 'localhost' || parsedOrigin.hostname === '127.0.0.1'

    const isSafeProtocol =
      parsedOrigin.protocol === 'http:' || parsedOrigin.protocol === 'https:'

    return isSafeProtocol && (isLocalHost || isPrivateLanHost(parsedOrigin.hostname))
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
app.use('/api/ai', aiRoutes)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Doslo je do greske na serveru.' })
})

const startServer = async () => {
  assertRequiredServerEnv()
  await runMigrations()

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server radi na http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
