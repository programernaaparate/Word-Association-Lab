import { query } from '../config/db.js'

export const ALL_CATEGORY = 'Sve'
export const DAILY_REWARD = 500
const APP_TIME_ZONE = 'Europe/Podgorica'

const CONTENT_CONFIG = {
  association: {
    table: 'association_words',
    select:
      'id, word, symbol, category, difficulty, clues_json, hint, accepted_answers_json',
    orderBy: 'id ASC',
    mapRow: (item) => ({
      id: item.id,
      word: item.word,
      symbol: item.symbol,
      category: item.category,
      difficulty: item.difficulty,
      clues: parseJsonArray(item.clues_json),
      hint: item.hint,
      acceptedAnswers: parseJsonArray(item.accepted_answers_json),
    }),
  },
  logic: {
    table: 'logic_challenges',
    select: 'id, mode, words_json, answer, hint, category, difficulty',
    orderBy: 'id ASC',
    mapRow: (item) => ({
      id: item.id,
      mode: item.mode,
      words: parseJsonArray(item.words_json),
      answer: item.answer,
      hint: item.hint,
      category: item.category,
      difficulty: item.difficulty,
    }),
  },
  relation: {
    table: 'relation_challenges',
    select:
      'id, left_word, right_word, relation, category, difficulty, hint',
    orderBy: 'id ASC',
    mapRow: (item) => ({
      id: item.id,
      leftWord: item.left_word,
      rightWord: item.right_word,
      relation: item.relation,
      category: item.category,
      difficulty: item.difficulty,
      hint: item.hint,
    }),
  },
}

const parseJsonArray = (value) => {
  if (Array.isArray(value)) {
    return value
  }

  if (value && typeof value === 'object') {
    return Array.isArray(value.values) ? value.values : []
  }

  try {
    return JSON.parse(value || '[]')
  } catch {
    return []
  }
}

const runSelect = async (sql, params = [], executor = null) => {
  if (executor?.execute) {
    const [rows] = await executor.execute(sql, params)
    return rows
  }

  return query(sql, params)
}

const buildFilter = ({ difficulty, category, mode } = {}) => {
  const conditions = []
  const params = []

  if (difficulty) {
    conditions.push('difficulty = ?')
    params.push(difficulty)
  }

  if (category && category !== ALL_CATEGORY) {
    conditions.push('category = ?')
    params.push(category)
  }

  if (mode) {
    conditions.push('mode = ?')
    params.push(mode)
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  }
}

const buildDailyTitle = (type, content) => {
  if (type === 'logic') {
    return content.mode === 'odd-one-out'
      ? 'Dnevni izazov: Ne pripada'
      : 'Dnevni izazov: Zajednicki pojam'
  }

  if (type === 'relation') {
    return 'Dnevna relacija'
  }

  return content.symbol ? 'Dnevni simbol' : 'Dnevna asocijacija'
}

const buildDailyDescription = (type, content) => {
  if (type === 'logic') {
    return `Povezi pojmove ${content.words.join(', ')} i osvoji bonus.`
  }

  if (type === 'relation') {
    return `Odredi odnos izmedju ${content.leftWord} i ${content.rightWord}.`
  }

  return content.symbol
    ? `Povezi simbol ${content.symbol} sa pravim pojmom i osvoji bonus.`
    : 'Povezi otvorene tragove i pogodi konacno rjesenje za bonus.'
}

export const getDateKey = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  return `${year}-${month}-${day}`
}

export const calculateLevelFromPoints = (points = 0) => {
  const safePoints = Math.max(0, Number(points) || 0)
  return Math.floor(safePoints / 1000) + 1
}

export const getContentItemsByType = async (type, filters = {}, executor = null) => {
  const config = CONTENT_CONFIG[type]

  if (!config) {
    return []
  }

  const { whereClause, params } = buildFilter(filters)
  const rows = await runSelect(
    `SELECT ${config.select}
     FROM ${config.table}
     ${whereClause}
     ORDER BY ${config.orderBy}`,
    params,
    executor
  )

  return rows.map(config.mapRow)
}

export const getContentItemByTypeAndId = async (type, id, executor = null) => {
  const config = CONTENT_CONFIG[type]

  if (!config || !id) {
    return null
  }

  const rows = await runSelect(
    `SELECT ${config.select}
     FROM ${config.table}
     WHERE id = ?
     LIMIT 1`,
    [id],
    executor
  )

  return rows[0] ? config.mapRow(rows[0]) : null
}

export const buildDailyChallengePayload = ({
  dateKey,
  type,
  content,
  isCompleted,
}) => {
  if (!content) {
    return null
  }

  return {
    id: `${dateKey}-${type}-${content.id}`,
    dateKey,
    reward: DAILY_REWARD,
    progress: isCompleted ? 100 : 0,
    isCompleted,
    type,
    title: buildDailyTitle(type, content),
    description: buildDailyDescription(type, content),
    difficulty: content.difficulty,
    category: content.category,
    contentId: content.id,
    content,
  }
}

export const resolveDailyChallenge = async (
  { dateKey = getDateKey(), difficulty, category } = {},
  executor = null
) => {
  const overrideRows = await runSelect(
    `SELECT id, challenge_date, content_type, content_id
     FROM daily_challenge_overrides
     WHERE challenge_date = ?
     LIMIT 1`,
    [dateKey],
    executor
  )

  const override = overrideRows[0] || null

  if (override) {
    const overrideContent = await getContentItemByTypeAndId(
      override.content_type,
      override.content_id,
      executor
    )

    if (overrideContent) {
      return {
        overrideId: override.id,
        isOverride: true,
        ...buildDailyChallengePayload({
          dateKey,
          type: override.content_type,
          content: overrideContent,
          isCompleted: false,
        }),
      }
    }
  }

  const associationPool = await getContentItemsByType(
    'association',
    { difficulty, category },
    executor
  )
  const logicPool = await getContentItemsByType('logic', { difficulty, category }, executor)
  const relationPool = await getContentItemsByType(
    'relation',
    { difficulty, category },
    executor
  )

  const filteredPool = [
    ...associationPool.map((item) => ({ type: 'association', content: item })),
    ...logicPool.map((item) => ({ type: 'logic', content: item })),
    ...relationPool.map((item) => ({ type: 'relation', content: item })),
  ]

  const fallbackPool =
    filteredPool.length > 0
      ? filteredPool
      : [
          ...(await getContentItemsByType('association', {}, executor)).map((item) => ({
            type: 'association',
            content: item,
          })),
          ...(await getContentItemsByType('logic', {}, executor)).map((item) => ({
            type: 'logic',
            content: item,
          })),
          ...(await getContentItemsByType('relation', {}, executor)).map((item) => ({
            type: 'relation',
            content: item,
          })),
        ]

  if (!fallbackPool.length) {
    return null
  }

  const seed = dateKey
    .replaceAll('-', '')
    .split('')
    .reduce((sum, digit) => sum + Number(digit || 0), 0)
  const selectedItem = fallbackPool[seed % fallbackPool.length]

  return {
    overrideId: null,
    isOverride: false,
    ...buildDailyChallengePayload({
      dateKey,
      type: selectedItem.type,
      content: selectedItem.content,
      isCompleted: false,
    }),
  }
}
