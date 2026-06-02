import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { getPool, query } from '../config/db.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import {
  getContentItemByTypeAndId,
  getContentItemsByType,
  getDateKey,
  resolveDailyChallenge,
} from '../utils/content.js'

const router = Router()

router.use(requireAuth, requireAdmin)

const RELATION_OPTIONS = new Set(['Sinonim', 'Antonim', 'Asocijacija'])
const LOGIC_MODES = new Set(['concept', 'odd-one-out'])

const validatePassword = (password = '') => {
  if (password.length < 4) {
    return 'Lozinka mora imati najmanje 4 karaktera.'
  }

  if (!/[A-Z]/.test(password)) {
    return 'Lozinka mora imati bar jedno veliko slovo.'
  }

  return ''
}

const parseList = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => String(item || '').trim())
    .filter(Boolean)

const parseUniqueList = (value) => {
  const uniqueMap = new Map()

  parseList(value).forEach((item) => {
    const itemKey = item.toLowerCase()

    if (!uniqueMap.has(itemKey)) {
      uniqueMap.set(itemKey, item)
    }
  })

  return Array.from(uniqueMap.values())
}

const getContentTargetTitle = (type, item = {}) => {
  if (type === 'logic') {
    return item.answer || 'Logicki izazov'
  }

  if (type === 'relation') {
    return `${item.leftWord || '?'} / ${item.rightWord || '?'}`
  }

  return item.word || 'Asocijacija'
}

const getContentTargetSubtitle = (type, item = {}) => {
  if (type === 'logic') {
    return `${item.mode === 'odd-one-out' ? 'Ne pripada' : 'Koncept'} / ${item.category || 'Bez kategorije'} / ${item.difficulty || 'Lako'}`
  }

  if (type === 'relation') {
    return `${item.relation || 'Asocijacija'} / ${item.category || 'Bez kategorije'} / ${item.difficulty || 'Lako'}`
  }

  return `${item.category || 'Bez kategorije'} / ${item.difficulty || 'Lako'}`
}

const buildContentTarget = (type, item = {}) => {
  if (!item) {
    return null
  }

  return {
    type,
    id: Number(item.id || 0) || null,
    title: getContentTargetTitle(type, item),
    subtitle: getContentTargetSubtitle(type, item),
    symbol: item.symbol || '',
    hint: item.hint || '',
    clues: Array.isArray(item.clues) ? item.clues : [],
    words: Array.isArray(item.words) ? item.words : [],
    acceptedAnswers: Array.isArray(item.acceptedAnswers) ? item.acceptedAnswers : [],
    relation: item.relation || '',
    leftWord: item.leftWord || '',
    rightWord: item.rightWord || '',
    category: item.category || '',
    difficulty: item.difficulty || '',
  }
}

const mapSubmission = (item) => ({
  id: item.id,
  user: item.user_label,
  type: item.game_type,
  content: item.content,
  contentLines: String(item.content || '')
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean),
  points: item.points,
  time: item.time_seconds,
  status: item.status,
  isDaily: Boolean(item.is_daily),
  submissionKind: item.submission_kind || 'game',
  contentType: item.content_type || null,
  contentItemId: item.content_item_id ? Number(item.content_item_id) : null,
  proposedAnswer: item.proposed_answer || null,
  createdAt: item.created_at,
})

const enrichSubmission = async (submission) => {
  if (
    submission?.submissionKind === 'answer_review' &&
    (!submission?.contentType || !submission?.contentItemId)
  ) {
    return {
      ...submission,
      requestedAction: submission.proposedAnswer
        ? `Provjeri da li prijedlog "${submission.proposedAnswer}" treba prihvatiti za igru "${submission.type}".`
        : `Pregledaj korisnicki prijedlog za igru "${submission.type}".`,
    }
  }

  if (!submission?.contentType || !submission?.contentItemId) {
    return submission
  }

  const contentItem = await getContentItemByTypeAndId(
    submission.contentType,
    submission.contentItemId
  )

  if (!contentItem) {
    return submission
  }

  const contentTarget = buildContentTarget(submission.contentType, contentItem)
  const requestedAction =
    submission.submissionKind === 'answer_review' && submission.proposedAnswer
      ? `Dodaj odgovor "${submission.proposedAnswer}" za unos "${contentTarget.title}".`
      : `Pregledaj unos "${contentTarget.title}".`

  return {
    ...submission,
    contentTarget,
    requestedAction,
  }
}

const mapAdminUser = (item) => ({
  id: item.id,
  username: item.username,
  role: item.role,
  points: Number(item.points || 0),
  level: Number(item.level || 1),
  createdAt: item.created_at,
  totalGames: Number(item.total_games || 0),
  completedDaily: Number(item.completed_daily || 0),
  lastPlayedAt: item.last_played_at,
  unreadCount: Number(item.unread_count || 0),
})

const buildContentPayload = (type, payload = {}) => {
  if (type === 'association') {
    const word = String(payload.word || '').trim()
    const symbol = String(payload.symbol || '').trim()
    const clues = parseList(payload.clues)
    const acceptedAnswers = parseUniqueList([word, ...parseList(payload.acceptedAnswers)])

    if (!word || clues.length < 2) {
      return { error: 'Asocijacija mora imati rjesenje i makar dva traga.' }
    }

    return {
      values: {
        word,
        symbol: symbol || null,
        category: String(payload.category || 'Priroda').trim() || 'Priroda',
        difficulty: String(payload.difficulty || 'Lako').trim() || 'Lako',
        clues,
        hint:
          String(payload.hint || '').trim() ||
          `Pomisli na pojam ${word.toLowerCase()}.`,
        acceptedAnswers,
      },
    }
  }

  if (type === 'logic') {
    const words = parseList(payload.words)
    const answer = String(payload.answer || '').trim()
    const mode = LOGIC_MODES.has(payload.mode) ? payload.mode : 'concept'

    if (!answer || words.length < 2) {
      return { error: 'Logicki izazov mora imati odgovor i makar dva pojma.' }
    }

    return {
      values: {
        mode,
        words,
        answer,
        hint:
          String(payload.hint || '').trim() ||
          'Pokusaj da pronadjes zajednicku osobinu.',
        category: String(payload.category || 'Priroda').trim() || 'Priroda',
        difficulty: String(payload.difficulty || 'Lako').trim() || 'Lako',
      },
    }
  }

  if (type === 'relation') {
    const leftWord = String(payload.leftWord || '').trim()
    const rightWord = String(payload.rightWord || '').trim()
    const relation = RELATION_OPTIONS.has(payload.relation)
      ? payload.relation
      : 'Asocijacija'

    if (!leftWord || !rightWord) {
      return { error: 'Relacija mora imati obje rijeci.' }
    }

    return {
      values: {
        leftWord,
        rightWord,
        relation,
        hint:
          String(payload.hint || '').trim() ||
          'Pomisli kakav odnos imaju ova dva pojma.',
        category: String(payload.category || 'Priroda').trim() || 'Priroda',
        difficulty: String(payload.difficulty || 'Lako').trim() || 'Lako',
      },
    }
  }

  return { error: 'Nepodrzan tip sadrzaja.' }
}

router.get('/dashboard', async (_req, res) => {
  const [associationStats] = await query('SELECT COUNT(*) AS total FROM association_words')
  const [logicStats] = await query('SELECT COUNT(*) AS total FROM logic_challenges')
  const [relationStats] = await query('SELECT COUNT(*) AS total FROM relation_challenges')
  const [submissionStats] = await query(
    `SELECT
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
      SUM(CASE WHEN status = 'flagged' THEN 1 ELSE 0 END) AS flaggedCount
     FROM game_submissions`
  )

  return res.json({
    totalWords: associationStats.total || 0,
    activeGames: (associationStats.total || 0) + (logicStats.total || 0) + (relationStats.total || 0),
    pendingSubmissions: submissionStats.pendingCount || 0,
    flaggedSubmissions: submissionStats.flaggedCount || 0,
  })
})

router.get('/users', async (req, res) => {
  const rows = await query(
    `SELECT
        u.id,
        u.username,
        u.role,
        u.points,
        u.level,
        u.created_at,
        COALESCE(history_stats.total_games, 0) AS total_games,
        COALESCE(history_stats.completed_daily, 0) AS completed_daily,
        history_stats.last_played_at,
        COALESCE(message_stats.unread_count, 0) AS unread_count
     FROM users u
     LEFT JOIN (
       SELECT
         user_id,
         COUNT(*) AS total_games,
         SUM(CASE WHEN daily_reward > 0 THEN 1 ELSE 0 END) AS completed_daily,
         MAX(created_at) AS last_played_at
       FROM game_history
       GROUP BY user_id
     ) AS history_stats ON history_stats.user_id = u.id
     LEFT JOIN (
       SELECT
         sender_id AS user_id,
         COUNT(*) AS unread_count
       FROM support_messages
       WHERE recipient_id = ? AND is_read = 0
       GROUP BY sender_id
     ) AS message_stats ON message_stats.user_id = u.id
     WHERE u.role <> 'admin'
     ORDER BY unread_count DESC, u.points DESC, u.username ASC`,
    [req.user.id]
  )

  return res.json({ items: rows.map(mapAdminUser) })
})

router.patch('/users/:id', async (req, res) => {
  const targetUserId = Number(req.params.id || 0)
  const cleanUsername = String(req.body?.username || '').trim()
  const nextPassword = String(req.body?.password || '')

  if (!targetUserId) {
    return res.status(400).json({ message: 'Korisnik nije validan.' })
  }

  if (!cleanUsername) {
    return res.status(400).json({ message: 'Korisnicko ime je obavezno.' })
  }

  if (cleanUsername.toLowerCase() === 'admin') {
    return res.status(403).json({
      message: 'Korisnicko ime "admin" je rezervisano za sistemski admin nalog.',
    })
  }

  if (nextPassword) {
    const passwordValidationMessage = validatePassword(nextPassword)
    if (passwordValidationMessage) {
      return res.status(400).json({ message: passwordValidationMessage })
    }
  }

  const users = await query(
    'SELECT id, username, role, points, level, created_at FROM users WHERE id = ? LIMIT 1',
    [targetUserId]
  )
  const targetUser = users[0]

  if (!targetUser) {
    return res.status(404).json({ message: 'Korisnik nije pronadjen.' })
  }

  if (targetUser.role === 'admin') {
    return res.status(403).json({ message: 'Admin nalog se ne menja iz ovog panela.' })
  }

  const existingUsers = await query(
    'SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id <> ? LIMIT 1',
    [cleanUsername, targetUserId]
  )

  if (existingUsers.length > 0) {
    return res.status(409).json({ message: 'Korisnicko ime vec postoji.' })
  }

  if (nextPassword) {
    const passwordHash = await bcrypt.hash(nextPassword, 10)
    await query(
      'UPDATE users SET username = ?, password_hash = ? WHERE id = ?',
      [cleanUsername, passwordHash, targetUserId]
    )
  } else {
    await query('UPDATE users SET username = ? WHERE id = ?', [cleanUsername, targetUserId])
  }

  const [updatedUser] = await query(
    `SELECT
        u.id,
        u.username,
        u.role,
        u.points,
        u.level,
        u.created_at,
        0 AS total_games,
        0 AS completed_daily,
        NULL AS last_played_at,
        0 AS unread_count
     FROM users u
     WHERE u.id = ?
     LIMIT 1`,
    [targetUserId]
  )

  return res.json({
    message: nextPassword
      ? `Azurirani su korisnicko ime i lozinka za korisnika ${cleanUsername}.`
      : `Azurirano je korisnicko ime za korisnika ${cleanUsername}.`,
    user: updatedUser ? mapAdminUser(updatedUser) : null,
  })
})

router.post('/users/:id/reset-progress', async (req, res) => {
  const targetUserId = Number(req.params.id || 0)

  if (!targetUserId) {
    return res.status(400).json({ message: 'Korisnik nije validan.' })
  }

  const users = await query(
    'SELECT id, username, role, points, level, created_at FROM users WHERE id = ? LIMIT 1',
    [targetUserId]
  )
  const targetUser = users[0]

  if (!targetUser) {
    return res.status(404).json({ message: 'Korisnik nije pronadjen.' })
  }

  if (targetUser.role === 'admin') {
    return res.status(403).json({ message: 'Admin nalog se ne resetuje iz ovog panela.' })
  }

  const connection = await getPool().getConnection()

  try {
    await connection.beginTransaction()

    await connection.execute('DELETE FROM game_history WHERE user_id = ?', [targetUserId])
    await connection.execute('DELETE FROM daily_challenge_completions WHERE user_id = ?', [
      targetUserId,
    ])
    await connection.execute(
      'UPDATE users SET points = 0, level = 1, progress_reset_at = CURRENT_TIMESTAMP WHERE id = ?',
      [targetUserId]
    )

    const [updatedRows] = await connection.execute(
      `SELECT id, username, role, points, level, progress_reset_at, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [targetUserId]
    )

    await connection.commit()

    return res.json({
      message: `Resetovani su XP i istorija za korisnika ${targetUser.username}.`,
      user: updatedRows[0] ? mapAdminUser(updatedRows[0]) : null,
    })
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
})

router.get('/content/:type', async (req, res) => {
  const items = await getContentItemsByType(req.params.type, {})
  return res.json({ items })
})

router.post('/content/:type', async (req, res) => {
  const { type } = req.params
  const { values, error } = buildContentPayload(type, req.body)

  if (error) {
    return res.status(400).json({ message: error })
  }

  let result = null

  if (type === 'association') {
    result = await query(
      `INSERT INTO association_words
        (word, symbol, category, difficulty, clues_json, hint, accepted_answers_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        values.word,
        values.symbol,
        values.category,
        values.difficulty,
        JSON.stringify(values.clues),
        values.hint,
        JSON.stringify(values.acceptedAnswers),
      ]
    )
  } else if (type === 'logic') {
    result = await query(
      `INSERT INTO logic_challenges
        (mode, words_json, answer, hint, category, difficulty)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        values.mode,
        JSON.stringify(values.words),
        values.answer,
        values.hint,
        values.category,
        values.difficulty,
      ]
    )
  } else if (type === 'relation') {
    result = await query(
      `INSERT INTO relation_challenges
        (left_word, right_word, relation, category, difficulty, hint)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        values.leftWord,
        values.rightWord,
        values.relation,
        values.category,
        values.difficulty,
        values.hint,
      ]
    )
  }

  const item = await getContentItemByTypeAndId(type, result.insertId)
  return res.status(201).json({ item })
})

router.put('/content/:type/:id', async (req, res) => {
  const { type, id } = req.params
  const { values, error } = buildContentPayload(type, req.body)

  if (error) {
    return res.status(400).json({ message: error })
  }

  if (type === 'association') {
    await query(
      `UPDATE association_words
       SET word = ?, symbol = ?, category = ?, difficulty = ?, clues_json = ?, hint = ?, accepted_answers_json = ?
       WHERE id = ?`,
      [
        values.word,
        values.symbol,
        values.category,
        values.difficulty,
        JSON.stringify(values.clues),
        values.hint,
        JSON.stringify(values.acceptedAnswers),
        id,
      ]
    )
  } else if (type === 'logic') {
    await query(
      `UPDATE logic_challenges
       SET mode = ?, words_json = ?, answer = ?, hint = ?, category = ?, difficulty = ?
       WHERE id = ?`,
      [
        values.mode,
        JSON.stringify(values.words),
        values.answer,
        values.hint,
        values.category,
        values.difficulty,
        id,
      ]
    )
  } else if (type === 'relation') {
    await query(
      `UPDATE relation_challenges
       SET left_word = ?, right_word = ?, relation = ?, category = ?, difficulty = ?, hint = ?
       WHERE id = ?`,
      [
        values.leftWord,
        values.rightWord,
        values.relation,
        values.category,
        values.difficulty,
        values.hint,
        id,
      ]
    )
  }

  const item = await getContentItemByTypeAndId(type, id)
  return res.json({ item })
})

router.delete('/content/:type/:id', async (req, res) => {
  const { type } = req.params
  const contentId = Number(req.params.id || 0)

  if (!contentId) {
    return res.status(400).json({ message: 'Sadrzaj nije validan.' })
  }

  let tableName = ''

  if (type === 'association') {
    tableName = 'association_words'
  } else if (type === 'logic') {
    tableName = 'logic_challenges'
  } else if (type === 'relation') {
    tableName = 'relation_challenges'
  } else {
    return res.status(400).json({ message: 'Nepodrzan tip sadrzaja.' })
  }

  const existingItem = await getContentItemByTypeAndId(type, contentId)

  if (!existingItem) {
    return res.status(404).json({ message: 'Sadrzaj nije pronadjen.' })
  }

  const connection = await getPool().getConnection()

  try {
    await connection.beginTransaction()

    await connection.execute(
      'DELETE FROM daily_challenge_overrides WHERE content_type = ? AND content_id = ?',
      [type, contentId]
    )
    await connection.execute(`DELETE FROM ${tableName} WHERE id = ?`, [contentId])

    await connection.commit()

    return res.json({
      success: true,
      item: existingItem,
      message: 'Sadrzaj je obrisan, a povezani daily override je uklonjen.',
    })
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
})

router.get('/submissions', async (req, res) => {
  const { status, kind, contentType, search } = req.query
  const params = []
  const conditions = []

  if (status && status !== 'all') {
    conditions.push('status = ?')
    params.push(status)
  }

  if (kind && kind !== 'all') {
    conditions.push('submission_kind = ?')
    params.push(kind)
  }

  if (contentType && contentType !== 'all') {
    conditions.push('content_type = ?')
    params.push(contentType)
  }

  if (search) {
    const searchPattern = `%${String(search).trim()}%`
    conditions.push(
      '(user_label LIKE ? OR content LIKE ? OR COALESCE(proposed_answer, \'\') LIKE ?)'
    )
    params.push(searchPattern, searchPattern, searchPattern)
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = await query(
    `SELECT id, user_label, game_type, content, points, time_seconds, status, is_daily, submission_kind, content_type, content_item_id, proposed_answer, created_at
     FROM game_submissions
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT 200`,
    params
  )

  const items = await Promise.all(rows.map((item) => enrichSubmission(mapSubmission(item))))

  return res.json({ items })
})

router.patch('/submissions/:id/status', async (req, res) => {
  const submissionId = Number(req.params.id || 0)
  const nextStatus =
    req.body?.status === 'approved' || req.body?.status === 'flagged'
      ? req.body.status
      : 'pending'

  if (!submissionId) {
    return res.status(400).json({ message: 'Submission nije validan.' })
  }

  const [existingSubmission] = await query(
    `SELECT id, submission_kind, content_type, content_item_id, proposed_answer
     FROM game_submissions
     WHERE id = ?
     LIMIT 1`,
    [submissionId]
  )

  if (!existingSubmission) {
    return res.status(404).json({ message: 'Submission nije pronadjen.' })
  }

  if (
    nextStatus === 'approved' &&
    existingSubmission.submission_kind === 'answer_review' &&
    existingSubmission.content_type === 'association' &&
    Number(existingSubmission.content_item_id || 0) > 0 &&
    String(existingSubmission.proposed_answer || '').trim()
  ) {
    const [associationItem] = await query(
      'SELECT accepted_answers_json FROM association_words WHERE id = ? LIMIT 1',
      [existingSubmission.content_item_id]
    )

    if (associationItem) {
      let acceptedAnswers = []

      try {
        acceptedAnswers = Array.isArray(associationItem.accepted_answers_json)
          ? associationItem.accepted_answers_json
          : JSON.parse(String(associationItem.accepted_answers_json || '[]'))
      } catch {
        acceptedAnswers = []
      }

      const nextAnswer = String(existingSubmission.proposed_answer || '').trim()
      const alreadyExists = acceptedAnswers.some(
        (item) => String(item || '').trim().toLowerCase() === nextAnswer.toLowerCase()
      )

      if (!alreadyExists) {
        await query(
          'UPDATE association_words SET accepted_answers_json = ? WHERE id = ?',
          [JSON.stringify([...acceptedAnswers, nextAnswer]), existingSubmission.content_item_id]
        )
      }
    }
  }

  await query('UPDATE game_submissions SET status = ? WHERE id = ?', [nextStatus, submissionId])

  const rows = await query(
    `SELECT id, user_label, game_type, content, points, time_seconds, status, is_daily, submission_kind, content_type, content_item_id, proposed_answer, created_at
     FROM game_submissions
     WHERE id = ?
     LIMIT 1`,
    [submissionId]
  )

  return res.json({
    item: rows[0] ? await enrichSubmission(mapSubmission(rows[0])) : null,
  })
})

router.get('/daily', async (req, res) => {
  const dateKey = String(req.query.dateKey || getDateKey())
  const challenge = await resolveDailyChallenge({ dateKey })

  return res.json({
    override: challenge?.isOverride
      ? {
          id: challenge.overrideId,
          dateKey,
          type: challenge.type,
          contentId: challenge.contentId,
          item: challenge.content,
          title:
            challenge.content?.word ||
            challenge.content?.answer ||
            `${challenge.content?.leftWord} / ${challenge.content?.rightWord}`,
        }
      : null,
  })
})

router.put('/daily', async (req, res) => {
  const dateKey = String(req.body?.dateKey || getDateKey())
  const type = String(req.body?.type || '')
  const contentId = Number(req.body?.contentId || 0)

  if (!contentId || !['association', 'logic', 'relation'].includes(type)) {
    return res.status(400).json({ message: 'Tip sadrzaja i ID su obavezni.' })
  }

  const content = await getContentItemByTypeAndId(type, contentId)
  if (!content) {
    return res.status(404).json({ message: 'Sadrzaj nije pronadjen.' })
  }

  await query(
    `INSERT INTO daily_challenge_overrides (challenge_date, content_type, content_id)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE content_type = VALUES(content_type), content_id = VALUES(content_id)`,
    [dateKey, type, contentId]
  )

  return res.json({
    override: {
      dateKey,
      type,
      contentId,
      item: content,
      title:
        content.word || content.answer || `${content.leftWord} / ${content.rightWord}`,
    },
  })
})

router.delete('/daily', async (req, res) => {
  const dateKey = String(req.query.dateKey || getDateKey())
  await query('DELETE FROM daily_challenge_overrides WHERE challenge_date = ?', [dateKey])
  return res.json({ success: true })
})

export default router
