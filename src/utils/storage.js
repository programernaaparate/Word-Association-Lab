import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'
import {
  DEFAULT_ASSOCIATION_WORDS as ASSOCIATION_CONTENT_MATRIX,
  DEFAULT_LOGIC_CHALLENGES as LOGIC_CONTENT_MATRIX,
  DEFAULT_RELATION_CHALLENGES as RELATION_CONTENT_MATRIX,
  DEFAULT_WORD_CHAIN_PRESETS,
} from './defaultGameContent'
import {
  evaluateSmartAssociationAnswer,
  evaluateSmartConceptAnswer,
  expandAcceptedAnswersForValue,
  normalizeRegionalDisplayText,
  sanitizeGameSymbol,
} from './localSmartMatching'

const DEFAULT_ASSOCIATION_WORDS = [
  {
    id: 1,
    word: 'Sunce',
    symbol: '☀️',
    category: 'Priroda',
    difficulty: 'Lako',
    clues: ['Dan', 'Toplota', 'Svjetlost', 'Ljeto'],
    hint: 'Pomisli na nebesko tijelo koje nam daje svjetlost i toplotu.',
    acceptedAnswers: ['sunce'],
  },
  {
    id: 2,
    word: 'More',
    symbol: '🌊',
    category: 'Priroda',
    difficulty: 'Srednje',
    clues: ['Talas', 'So', 'Plaza', 'Obala'],
    hint: 'Velika slana povrsina vode.',
    acceptedAnswers: ['more'],
  },
  {
    id: 3,
    word: 'Knjiga',
    symbol: '📚',
    category: 'Umjetnost',
    difficulty: 'Lako',
    clues: ['Stranice', 'Citanje', 'Biblioteka', 'Autor'],
    hint: 'Predmet koji citamo i iz koga ucimo ili uzivamo u prici.',
    acceptedAnswers: ['knjiga', 'roman'],
  },
  {
    id: 4,
    word: 'Galaksija',
    symbol: '🌌',
    category: 'Nauka',
    difficulty: 'Tesko',
    clues: ['Zvijezde', 'Kosmos', 'Mlijecni put', 'Svemir'],
    hint: 'Ogromna skupina zvijezda, gasa i prasine u svemiru.',
    acceptedAnswers: ['galaksija'],
  },
  {
    id: 5,
    word: 'Trcanje',
    symbol: '🏃',
    category: 'Sport',
    difficulty: 'Lako',
    clues: ['Brzina', 'Trka', 'Atletika', 'Koraci'],
    hint: 'Sportska aktivnost koja ukljucuje brzo kretanje.',
    acceptedAnswers: ['trcanje'],
  },
]

const DEFAULT_LOGIC_CHALLENGES = [
  {
    id: 1,
    mode: 'concept',
    words: ['Pas', 'Macka', 'Lav'],
    answer: 'Zivotinja',
    hint: 'Rjesenje je povezano sa zivotinjama.',
    category: 'Priroda',
    difficulty: 'Lako',
  },
  {
    id: 2,
    mode: 'concept',
    words: ['Voda', 'Oblak', 'Kisa', 'Led'],
    answer: 'Voda',
    hint: 'Rjesenje je povezano sa vodom i prirodnim ciklusima.',
    category: 'Priroda',
    difficulty: 'Srednje',
  },
  {
    id: 3,
    mode: 'concept',
    words: ['Merkur', 'Venera', 'Mars'],
    answer: 'Planete',
    hint: 'Rijeci pripadaju Suncevom sistemu.',
    category: 'Nauka',
    difficulty: 'Tesko',
  },
  {
    id: 4,
    mode: 'odd-one-out',
    words: ['Lav', 'Tigar', 'Vuk', 'Mrkva'],
    answer: 'Mrkva',
    hint: 'Tri pojma pripadaju istoj grupi zivih bica.',
    category: 'Priroda',
    difficulty: 'Lako',
  },
  {
    id: 5,
    mode: 'odd-one-out',
    words: ['Roman', 'Pjesma', 'Drama', 'Teleskop'],
    answer: 'Teleskop',
    hint: 'Tri pojma su knjizevne forme.',
    category: 'Umjetnost',
    difficulty: 'Srednje',
  },
  {
    id: 6,
    mode: 'odd-one-out',
    words: ['Proton', 'Elektron', 'Neutron', 'Galerija'],
    answer: 'Galerija',
    hint: 'Tri pojma pripadaju osnovi atomske strukture.',
    category: 'Nauka',
    difficulty: 'Tesko',
  },
]

const DEFAULT_RELATION_CHALLENGES = [
  {
    id: 1,
    leftWord: 'Topao',
    rightWord: 'Hladan',
    relation: 'Antonim',
    category: 'Priroda',
    difficulty: 'Lako',
    hint: 'Rijeci imaju suprotno znacenje.',
  },
  {
    id: 2,
    leftWord: 'Sreca',
    rightWord: 'Radost',
    relation: 'Sinonim',
    category: 'Umjetnost',
    difficulty: 'Lako',
    hint: 'Rijeci izrazavaju slican osjecaj.',
  },
  {
    id: 3,
    leftWord: 'More',
    rightWord: 'Talas',
    relation: 'Asocijacija',
    category: 'Priroda',
    difficulty: 'Srednje',
    hint: 'Pojmovi se prirodno povezuju, ali nijesu isti ni suprotni.',
  },
  {
    id: 4,
    leftWord: 'Brz',
    rightWord: 'Spor',
    relation: 'Antonim',
    category: 'Sport',
    difficulty: 'Lako',
    hint: 'Opisujes dvije suprotne brzine.',
  },
  {
    id: 5,
    leftWord: 'Planeta',
    rightWord: 'Svemir',
    relation: 'Asocijacija',
    category: 'Nauka',
    difficulty: 'Srednje',
    hint: 'Jedan pojam prirodno pripada sirem drugom pojmu.',
  },
  {
    id: 6,
    leftWord: 'Pametan',
    rightWord: 'Inteligentan',
    relation: 'Sinonim',
    category: 'Nauka',
    difficulty: 'Tesko',
    hint: 'Rijeci imaju skoro isto znacenje.',
  },
]

const DEFAULT_DAILY_REWARD = 500
const DEFAULT_DIFFICULTY = 'Srednje'
const DEFAULT_CATEGORY = 'Priroda'
const ALL_CATEGORY = 'Sve'
const AUTH_TOKEN_KEY = 'authToken'
const RECENT_CONTENT_ROTATIONS_KEY = 'recentContentRotations'
const NATIVE_STORAGE_PREFIX = 'wal-mobile'
export const STORAGE_CHANGE_EVENT = 'wal-storage-change'
const DIFFICULTY_ORDER = ['Lako', 'Srednje', 'Tesko']
const HISTORY_LIMIT = 250
const HISTORY_DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Podgorica',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const ACHIEVEMENT_DEFINITIONS = [
  {
    key: 'first-game',
    label: 'Prvi korak',
    description: 'Odigraj prvu partiju u labu.',
    tone: 'blue',
    metric: 'totalGames',
    target: 1,
  },
  {
    key: 'xp-1000',
    label: '1000 XP',
    description: 'Sakupi ukupno 1000 XP iz istorije.',
    tone: 'gold',
    metric: 'totalPoints',
    target: 1000,
  },
  {
    key: 'streak-3',
    label: 'Niz od 3',
    description: 'Odrzi tri dana igre zaredom.',
    tone: 'green',
    metric: 'longestStreak',
    target: 3,
  },
  {
    key: 'combo-4',
    label: 'Serija x4',
    description: 'Spoji cetiri uzastopna tacna poteza.',
    tone: 'red',
    metric: 'bestCombo',
    target: 4,
  },
  {
    key: 'perfect-3',
    label: 'Perfekcionista',
    description: 'Zavrsi tri partije bez greske.',
    tone: 'violet',
    metric: 'perfectRuns',
    target: 3,
  },
  {
    key: 'all-rounder',
    label: 'Svestran igrac',
    description: 'Odigraj sva 4 moda igre.',
    tone: 'sand',
    metric: 'distinctModeCount',
    target: 4,
  },
  {
    key: 'daily-7',
    label: 'Dnevna rutina',
    description: 'Zavrsi 7 dnevnih izazova.',
    tone: 'teal',
    metric: 'completedDaily',
    target: 7,
  },
]

const NATIVE_MIRRORED_KEYS = [
  'users',
  'currentUser',
  AUTH_TOKEN_KEY,
  'associationWords',
  'logicChallenges',
  'relationChallenges',
  'wordChainApprovedNodes',
  'activeSession',
  'lastResult',
  'gameSubmissions',
  'gameHistory',
  'dailyChallengeEntries',
  'dailyChallengeOverride',
  'difficulty',
  'category',
  RECENT_CONTENT_ROTATIONS_KEY,
  'progressVersion',
]

const canUseBrowserStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const emitStorageChange = (key) => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent(STORAGE_CHANGE_EVENT, {
      detail: { key },
    })
  )
}

const isNativeMobileStorageEnabled = () =>
  Capacitor.isNativePlatform() && canUseBrowserStorage()

const getNativeStorageKey = (key) => `${NATIVE_STORAGE_PREFIX}:${key}`

const syncNativeStorageKey = (key, value) => {
  if (!isNativeMobileStorageEnabled() || !NATIVE_MIRRORED_KEYS.includes(key)) {
    return
  }

  Promise.resolve()
    .then(() => {
      if (value === null || value === undefined) {
        return Preferences.remove({ key: getNativeStorageKey(key) })
      }

      return Preferences.set({
        key: getNativeStorageKey(key),
        value: String(value),
      })
    })
    .catch(() => {})
}

const setRawStorageValue = (key, value) => {
  if (!canUseBrowserStorage()) {
    return
  }

  window.localStorage.setItem(key, value)
  syncNativeStorageKey(key, value)
  emitStorageChange(key)
}

const removeStorageValue = (key) => {
  if (!canUseBrowserStorage()) {
    return
  }

  window.localStorage.removeItem(key)
  syncNativeStorageKey(key, null)
  emitStorageChange(key)
}

export const hydrateNativeAppStorage = async () => {
  if (!isNativeMobileStorageEnabled()) {
    return
  }

  await Promise.all(
    NATIVE_MIRRORED_KEYS.map(async (key) => {
      const localValue = window.localStorage.getItem(key)
      const { value: nativeValue } = await Preferences.get({
        key: getNativeStorageKey(key),
      })

      if (localValue === null && nativeValue !== null) {
        window.localStorage.setItem(key, nativeValue)
        return
      }

      if (localValue !== null && localValue !== nativeValue) {
        await Preferences.set({
          key: getNativeStorageKey(key),
          value: localValue,
        })
      }
    })
  )
}

const readStorage = (key, fallback) => {
  try {
    if (!canUseBrowserStorage()) {
      return fallback
    }

    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = (key, value) => {
  setRawStorageValue(key, JSON.stringify(value))
}

const sanitizeStoredGameValue = (value, fieldName = '') => {
  if (typeof value === 'string') {
    return fieldName === 'symbol'
      ? sanitizeGameSymbol(value)
      : normalizeRegionalDisplayText(value)
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeStoredGameValue(item, fieldName))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([nestedKey, nestedValue]) => [
        nestedKey,
        sanitizeStoredGameValue(nestedValue, nestedKey),
      ])
    )
  }

  return value
}

const STORED_GAME_TEXT_VERSION = '1'

const migrateStoredGameText = () => {
  if (!canUseBrowserStorage()) {
    return
  }

  if (window.localStorage.getItem('storedGameTextVersion') === STORED_GAME_TEXT_VERSION) {
    return
  }

  const keysToSanitize = [
    'associationWords',
    'logicChallenges',
    'relationChallenges',
    'activeSession',
    'lastResult',
    'gameSubmissions',
    'gameHistory',
    'wordChainApprovedNodes',
    'dailyChallengeEntries',
    'dailyChallengeOverride',
  ]

  keysToSanitize.forEach((key) => {
    const currentValue = readStorage(key, undefined)

    if (currentValue !== undefined) {
      writeStorage(key, sanitizeStoredGameValue(currentValue))
    }
  })

  setRawStorageValue('storedGameTextVersion', STORED_GAME_TEXT_VERSION)
}

const shuffleItems = (items = []) => {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]]
  }

  return nextItems
}

export const getTodayKey = () => {
  const parts = HISTORY_DATE_FORMATTER.formatToParts(new Date())
  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  return `${year}-${month}-${day}`
}

export const isExpiredDailySession = (session = getActiveSession()) => {
  return Boolean(session?.isDaily && session?.dailyDateKey && session.dailyDateKey !== getTodayKey())
}

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`

const normalizeCategory = (category) => {
  if (!category || category === ALL_CATEGORY) {
    return ALL_CATEGORY
  }

  return category
}

const normalizeText = (value = '') =>
  normalizeRegionalDisplayText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const sanitizeTextArray = (values = []) =>
  (values || []).map((value) => normalizeRegionalDisplayText(value)).filter(Boolean)

const sanitizeContentItem = (item = {}) => ({
  ...item,
  word: normalizeRegionalDisplayText(item.word || ''),
  symbol: sanitizeGameSymbol(item.symbol || ''),
  category: normalizeRegionalDisplayText(item.category || ''),
  difficulty: normalizeRegionalDisplayText(item.difficulty || ''),
  clue: normalizeRegionalDisplayText(item.clue || ''),
  hint: normalizeRegionalDisplayText(item.hint || ''),
  answer: normalizeRegionalDisplayText(item.answer || ''),
  leftWord: normalizeRegionalDisplayText(item.leftWord || ''),
  rightWord: normalizeRegionalDisplayText(item.rightWord || ''),
  acceptedAnswers: expandAcceptedAnswersForValue(
    normalizeRegionalDisplayText(item.word || item.answer || ''),
    sanitizeTextArray(item.acceptedAnswers || [])
  ),
  clues: sanitizeTextArray(item.clues || []),
  words: sanitizeTextArray(item.words || []),
})

const sanitizeContentItems = (items = []) => (items || []).map(sanitizeContentItem)

const sanitizeWordChainPreset = (preset = {}) => ({
  id: normalizeRegionalDisplayText(preset.id || preset.centerWord || ''),
  centerWord: normalizeRegionalDisplayText(preset.centerWord || ''),
  category: normalizeRegionalDisplayText(preset.category || ''),
  difficulty: normalizeRegionalDisplayText(preset.difficulty || ''),
  starterNodes: (preset.starterNodes || []).map((node) => ({
    ...node,
    word: normalizeRegionalDisplayText(node.word || ''),
    relation: normalizeRegionalDisplayText(node.relation || ''),
  })),
})

const sanitizeWordChainPresetCollection = (value) => {
  const presets = Array.isArray(value) ? value : value ? [value] : []

  return presets
    .map(sanitizeWordChainPreset)
    .filter((preset) => Boolean(preset.centerWord) && preset.starterNodes.length > 0)
}

const buildLogicChallengeMergeKey = (item = {}) =>
  [
    item.mode || 'concept',
    normalizeRegionalDisplayText(item.answer || ''),
    normalizeRegionalDisplayText(item.category || ''),
    normalizeRegionalDisplayText(item.difficulty || ''),
    item.mode === 'odd-one-out' ? sanitizeTextArray(item.words || []).join('|') : '',
  ].join('-')

const mergeDefaultItems = (baseItems, extraItems, getKey) => {
  const mergedMap = new Map()

  ;[...(baseItems || []), ...(extraItems || [])].forEach((item) => {
    const itemKey = getKey(item)
    if (!itemKey) {
      return
    }

    const existingItem = mergedMap.get(itemKey)

    if (!existingItem) {
      mergedMap.set(itemKey, item)
      return
    }

    mergedMap.set(itemKey, {
      ...existingItem,
      ...item,
      acceptedAnswers: [
        ...new Set([...(existingItem.acceptedAnswers || []), ...(item.acceptedAnswers || [])]),
      ],
      clues: item.clues?.length ? item.clues : existingItem.clues,
      words: item.words?.length ? item.words : existingItem.words,
    })
  })

  return Array.from(mergedMap.values())
}

const getDifficultyDistance = (selectedDifficulty, currentDifficulty) => {
  const selectedIndex = DIFFICULTY_ORDER.indexOf(selectedDifficulty)
  const currentIndex = DIFFICULTY_ORDER.indexOf(currentDifficulty)

  if (selectedIndex === -1 || currentIndex === -1) {
    return 99
  }

  return Math.abs(selectedIndex - currentIndex)
}

const sortItemsByDifficultyAndId = (items = [], difficulty) =>
  [...items].sort((leftItem, rightItem) => {
    const distanceDifference =
      getDifficultyDistance(difficulty, leftItem.difficulty) -
      getDifficultyDistance(difficulty, rightItem.difficulty)

    if (distanceDifference !== 0) {
      return distanceDifference
    }

    return (leftItem.id || 0) - (rightItem.id || 0)
  })

const getFilteredItems = (items, difficulty, category) => {
  const normalizedCategory = normalizeCategory(category)

  if (normalizedCategory === ALL_CATEGORY) {
    const difficultyMatches = items.filter((item) => item.difficulty === difficulty)
    return difficultyMatches.length ? sortItemsByDifficultyAndId(difficultyMatches, difficulty) : sortItemsByDifficultyAndId(items, difficulty)
  }

  const exactMatches = items.filter(
    (item) => item.category === normalizedCategory && item.difficulty === difficulty
  )

  if (exactMatches.length) {
    return sortItemsByDifficultyAndId(exactMatches, difficulty)
  }

  const sameCategoryItems = items.filter((item) => item.category === normalizedCategory)
  const sameDifficultyItems = items.filter((item) => item.difficulty === difficulty)

  if (sameDifficultyItems.length) {
    return sortItemsByDifficultyAndId(sameDifficultyItems, difficulty)
  }

  if (!sameCategoryItems.length) {
    return []
  }

  return sortItemsByDifficultyAndId(sameCategoryItems, difficulty)
}

const calculateDailyProgress = (isCompleted) => (isCompleted ? 100 : 0)

const getDailyChallengeEntries = () => readStorage('dailyChallengeEntries', {})

const saveDailyChallengeEntries = (entries) => {
  writeStorage('dailyChallengeEntries', entries)
}

const getDailyChallengeStateKey = (userId) => `${getTodayKey()}-${userId || 'guest'}`

export const getDailyChallengeCompletionState = (
  dateKey = getTodayKey(),
  userId = getCurrentUser()?.id
) => {
  const entries = getDailyChallengeEntries()
  const stateKey = `${dateKey}-${userId || 'guest'}`
  return Boolean(entries[stateKey]?.completed)
}

export const markDailyChallengeCompleted = ({
  dateKey = getTodayKey(),
  challengeId = '',
  userId = getCurrentUser()?.id,
} = {}) => {
  const entries = getDailyChallengeEntries()
  const stateKey = `${dateKey}-${userId || 'guest'}`

  saveDailyChallengeEntries({
    ...entries,
    [stateKey]: {
      challengeId,
      completed: true,
      completedAt: new Date().toISOString(),
    },
  })
}

export const getDailyChallengeOverride = () => {
  return readStorage('dailyChallengeOverride', null)
}

export const saveDailyChallengeOverride = (override) => {
  writeStorage('dailyChallengeOverride', override)
}

export const clearDailyChallengeOverride = () => {
  removeStorageValue('dailyChallengeOverride')
}

const getAwardedPointsFromHistoryItem = (item = {}) => {
  const directAward = Number(item.awardedPoints)
  if (Number.isFinite(directAward) && directAward >= 0) {
    return directAward
  }

  const directEarned = Number(item.earnedPoints)
  const dailyReward = Math.max(0, Number(item.dailyReward) || 0)
  if (Number.isFinite(directEarned) && directEarned >= 0) {
    return directEarned + dailyReward
  }

  const score = Math.max(0, Number(item.score) || 0)
  const baseScore = Number(item.baseScore)

  if (Number.isFinite(baseScore)) {
    return Math.max(0, baseScore - 1200) + Math.max(0, score - baseScore)
  }

  if (item.type === 'word-chain') {
    return Math.max(0, score - 1250)
  }

  return Math.max(0, score - 1200)
}

const getHistoryDateKey = (dateValue) => {
  if (!dateValue) {
    return ''
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const parts = HISTORY_DATE_FORMATTER.formatToParts(date)
  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  return year && month && day ? `${year}-${month}-${day}` : ''
}

const dateKeyToUtcTimestamp = (dateKey = '') => {
  const [year, month, day] = String(dateKey || '')
    .split('-')
    .map((value) => Number(value))

  if (!year || !month || !day) {
    return Number.NaN
  }

  return Date.UTC(year, month - 1, day)
}

const getDateKeyDifference = (leftDateKey = '', rightDateKey = '') => {
  const leftTimestamp = dateKeyToUtcTimestamp(leftDateKey)
  const rightTimestamp = dateKeyToUtcTimestamp(rightDateKey)

  if (Number.isNaN(leftTimestamp) || Number.isNaN(rightTimestamp)) {
    return Number.NaN
  }

  return Math.round((rightTimestamp - leftTimestamp) / 86400000)
}

const isSuccessfulAnswer = (answer = {}) => Boolean(answer?.accepted || answer?.partialAccepted)

const deriveMaxComboFromAnswers = (answers = []) => {
  let currentCombo = 0
  let bestCombo = 0

  ;(answers || []).forEach((answer) => {
    if (isSuccessfulAnswer(answer)) {
      currentCombo += 1
      bestCombo = Math.max(bestCombo, currentCombo)
      return
    }

    currentCombo = 0
  })

  return bestCombo
}

const deriveBestComboFromHistoryItem = (item = {}) => {
  const savedCombo = Number(item.maxCombo)

  if (Number.isFinite(savedCombo) && savedCombo >= 0) {
    return savedCombo
  }

  return deriveMaxComboFromAnswers(item.answers || [])
}

const calculateStreakStats = (history = []) => {
  const uniqueDateKeys = [...new Set((history || []).map((item) => getHistoryDateKey(item.createdAt)).filter(Boolean))].sort()

  if (!uniqueDateKeys.length) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDateKey: '',
    }
  }

  let longestStreak = 1
  let runningStreak = 1

  for (let index = 1; index < uniqueDateKeys.length; index += 1) {
    const gap = getDateKeyDifference(uniqueDateKeys[index - 1], uniqueDateKeys[index])

    if (gap === 1) {
      runningStreak += 1
      longestStreak = Math.max(longestStreak, runningStreak)
    } else {
      runningStreak = 1
    }
  }

  const lastPlayedDateKey = uniqueDateKeys[uniqueDateKeys.length - 1]
  const gapToToday = getDateKeyDifference(lastPlayedDateKey, getTodayKey())
  let currentStreak = 0

  if (!Number.isNaN(gapToToday) && gapToToday <= 1) {
    currentStreak = 1

    for (let index = uniqueDateKeys.length - 1; index > 0; index -= 1) {
      const gap = getDateKeyDifference(uniqueDateKeys[index - 1], uniqueDateKeys[index])

      if (gap === 1) {
        currentStreak += 1
      } else {
        break
      }
    }
  }

  return {
    currentStreak,
    longestStreak,
    lastPlayedDateKey,
  }
}

const buildAchievementProgressLabel = (currentValue = 0, targetValue = 0, unlocked = false) => {
  if (unlocked) {
    return 'Otkljucano'
  }

  return `${Math.min(Number(currentValue) || 0, Number(targetValue) || 0)}/${targetValue}`
}

const buildAchievements = (metrics = {}) =>
  ACHIEVEMENT_DEFINITIONS.map((achievement) => {
    const currentValue = Math.max(0, Number(metrics[achievement.metric]) || 0)
    const unlocked = currentValue >= achievement.target

    return {
      ...achievement,
      unlocked,
      currentValue,
      progressLabel: buildAchievementProgressLabel(currentValue, achievement.target, unlocked),
    }
  })

const migrateProgressData = () => {
  if (canUseBrowserStorage() && window.localStorage.getItem('progressVersion') === '2') {
    return
  }

  const users = readStorage('users', [])
  const history = readStorage('gameHistory', [])

  if (!users.length) {
    setRawStorageValue('progressVersion', '2')
    return
  }

  const totalsByUserId = history.reduce((accumulator, item) => {
    if (!item?.userId) return accumulator

    const currentTotal = accumulator[item.userId] || 0
    return {
      ...accumulator,
      [item.userId]: currentTotal + getAwardedPointsFromHistoryItem(item),
    }
  }, {})

  const updatedUsers = users.map((user) => {
    const recalculatedPoints =
      totalsByUserId[user.id] !== undefined ? totalsByUserId[user.id] : user.points || 0

    return {
      ...user,
      points: recalculatedPoints,
      level: calculateLevelFromPoints(recalculatedPoints),
    }
  })

  writeStorage('users', updatedUsers)

  const currentUser = readStorage('currentUser', null)
  if (currentUser?.id) {
    const updatedCurrentUser =
      updatedUsers.find((user) => user.id === currentUser.id) || currentUser
    writeStorage('currentUser', updatedCurrentUser)
  }

  setRawStorageValue('progressVersion', '2')
}

export const getUsers = () => {
  migrateProgressData()
  return readStorage('users', [])
}

export const saveUsers = (users) => {
  writeStorage('users', users)
}

export const saveCurrentUser = (user) => {
  writeStorage('currentUser', user)
}

export const syncStoredCurrentUser = (user) => {
  if (!user?.id) {
    return
  }

  const nextUser = {
    ...user,
    points: Math.max(0, Number(user.points || 0) || 0),
    level: Math.max(1, Number(user.level || 1) || 1),
  }

  const nextUsers = getUsers()
  const alreadyExists = nextUsers.some((item) => item.id === nextUser.id)
  saveUsers(
    alreadyExists
      ? nextUsers.map((item) => (item.id === nextUser.id ? { ...item, ...nextUser } : item))
      : [nextUser, ...nextUsers]
  )
  saveCurrentUser(nextUser)
}

export const saveAuthSession = ({ token, user }) => {
  if (token) {
    setRawStorageValue(AUTH_TOKEN_KEY, token)
  }

  if (user) {
    saveCurrentUser(user)
  }
}

export const getCurrentUser = () => {
  migrateProgressData()
  return readStorage('currentUser', null)
}

export const getAuthToken = () => {
  return canUseBrowserStorage() ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null
}

export const logoutUser = () => {
  removeStorageValue(AUTH_TOKEN_KEY)
  removeStorageValue('currentUser')
}

export const getAssociationWords = () => {
  migrateStoredGameText()
  const defaultWords = mergeDefaultItems(
    DEFAULT_ASSOCIATION_WORDS,
    ASSOCIATION_CONTENT_MATRIX,
    (item) => item.word
  )
  const storedWords = readStorage('associationWords', [])

  return sanitizeContentItems(mergeDefaultItems(storedWords, defaultWords, (item) => item.word))
}

export const saveAssociationWords = (words) => {
  writeStorage('associationWords', sanitizeStoredGameValue(words))
}

export const updateAssociationWord = (updatedWord) => {
  const updatedWords = getAssociationWords().map((word) =>
    word.id === updatedWord.id ? { ...word, ...updatedWord } : word
  )
  saveAssociationWords(updatedWords)
  return updatedWords
}

export const deleteAssociationWord = (id) => {
  const updatedWords = getAssociationWords().filter((word) => word.id !== id)
  saveAssociationWords(updatedWords)
  return updatedWords
}

export const getLogicChallenges = () => {
  migrateStoredGameText()
  const defaultChallenges = mergeDefaultItems(
    DEFAULT_LOGIC_CHALLENGES,
    LOGIC_CONTENT_MATRIX,
    buildLogicChallengeMergeKey
  )
  const storedChallenges = readStorage('logicChallenges', [])

  return sanitizeContentItems(
    mergeDefaultItems(
    storedChallenges,
    defaultChallenges,
    buildLogicChallengeMergeKey
  )
  )
}

export const saveLogicChallenges = (challenges) => {
  writeStorage('logicChallenges', sanitizeStoredGameValue(challenges))
}

export const updateLogicChallenge = (updatedChallenge) => {
  const updatedChallenges = getLogicChallenges().map((challenge) =>
    challenge.id === updatedChallenge.id
      ? { ...challenge, ...updatedChallenge }
      : challenge
  )
  saveLogicChallenges(updatedChallenges)
  return updatedChallenges
}

export const deleteLogicChallenge = (id) => {
  const updatedChallenges = getLogicChallenges().filter(
    (challenge) => challenge.id !== id
  )
  saveLogicChallenges(updatedChallenges)
  return updatedChallenges
}

export const getRelationChallenges = () => {
  migrateStoredGameText()
  const defaultChallenges = mergeDefaultItems(
    DEFAULT_RELATION_CHALLENGES,
    RELATION_CONTENT_MATRIX,
    (item) =>
      `${item.leftWord}-${item.rightWord}-${item.relation}-${item.category}-${item.difficulty}`
  )
  const storedChallenges = readStorage('relationChallenges', [])

  return sanitizeContentItems(
    mergeDefaultItems(
    storedChallenges,
    defaultChallenges,
    (item) =>
      `${item.leftWord}-${item.rightWord}-${item.relation}-${item.category}-${item.difficulty}`
  )
  )
}

export const saveRelationChallenges = (challenges) => {
  writeStorage('relationChallenges', sanitizeStoredGameValue(challenges))
}

export const updateRelationChallenge = (updatedChallenge) => {
  const updatedChallenges = getRelationChallenges().map((challenge) =>
    challenge.id === updatedChallenge.id
      ? { ...challenge, ...updatedChallenge }
      : challenge
  )
  saveRelationChallenges(updatedChallenges)
  return updatedChallenges
}

export const deleteRelationChallenge = (id) => {
  const updatedChallenges = getRelationChallenges().filter(
    (challenge) => challenge.id !== id
  )
  saveRelationChallenges(updatedChallenges)
  return updatedChallenges
}

export const saveLastResult = (result) => {
  writeStorage('lastResult', sanitizeStoredGameValue(result))
}

export const getLastResult = () => {
  migrateStoredGameText()
  return readStorage('lastResult', null)
}

const WORD_CHAIN_APPROVED_RELATIONS = ['Sinonim', 'Antonim', 'Asocijacija']

const sanitizeWordChainApprovedNode = (node = {}) => {
  const relation = WORD_CHAIN_APPROVED_RELATIONS.includes(node.relation) ? node.relation : ''

  return {
    id: Number(node.id || 0) || null,
    centerWord: normalizeRegionalDisplayText(node.centerWord || ''),
    candidateWord: normalizeRegionalDisplayText(node.candidateWord || ''),
    relation,
    category: normalizeRegionalDisplayText(node.category || ''),
    difficulty: normalizeRegionalDisplayText(node.difficulty || ''),
    approvedSubmissionId: Number(node.approvedSubmissionId || 0) || null,
    createdAt: node.createdAt || new Date().toISOString(),
    updatedAt: node.updatedAt || new Date().toISOString(),
  }
}

const buildWordChainApprovedNodeKey = (node = {}) =>
  [
    normalizeText(node.centerWord || ''),
    normalizeText(node.candidateWord || ''),
    node.relation || '',
    normalizeText(node.category || ''),
    normalizeText(node.difficulty || ''),
  ].join('|')

export const getWordChainApprovedNodes = () => {
  migrateStoredGameText()
  const storedNodes = readStorage('wordChainApprovedNodes', [])
  return (Array.isArray(storedNodes) ? storedNodes : [])
    .map(sanitizeWordChainApprovedNode)
    .filter(
      (item) =>
        item.centerWord &&
        item.candidateWord &&
        WORD_CHAIN_APPROVED_RELATIONS.includes(item.relation) &&
        item.category &&
        item.difficulty
    )
}

export const saveWordChainApprovedNodes = (nodes) => {
  writeStorage(
    'wordChainApprovedNodes',
    (Array.isArray(nodes) ? nodes : [])
      .map(sanitizeWordChainApprovedNode)
      .filter(
        (item) =>
          item.centerWord &&
          item.candidateWord &&
          WORD_CHAIN_APPROVED_RELATIONS.includes(item.relation) &&
          item.category &&
          item.difficulty
      )
  )
}

export const upsertWordChainApprovedNode = (node = {}) => {
  const sanitizedNode = sanitizeWordChainApprovedNode(node)

  if (
    !sanitizedNode.centerWord ||
    !sanitizedNode.candidateWord ||
    !WORD_CHAIN_APPROVED_RELATIONS.includes(sanitizedNode.relation) ||
    !sanitizedNode.category ||
    !sanitizedNode.difficulty
  ) {
    return
  }

  const nextKey = buildWordChainApprovedNodeKey(sanitizedNode)
  const existingNodes = getWordChainApprovedNodes()
  let matched = false
  let changed = false

  const nextNodes = existingNodes.map((item) => {
    if (buildWordChainApprovedNodeKey(item) !== nextKey) {
      return item
    }

    matched = true
    const nextItem = {
      ...item,
      ...sanitizedNode,
      id: sanitizedNode.id || item.id,
      approvedSubmissionId: sanitizedNode.approvedSubmissionId || item.approvedSubmissionId,
      createdAt: item.createdAt || sanitizedNode.createdAt,
      updatedAt: sanitizedNode.updatedAt || new Date().toISOString(),
    }

    if (JSON.stringify(nextItem) !== JSON.stringify(item)) {
      changed = true
    }

    return nextItem
  })

  if (!matched) {
    changed = true
    nextNodes.unshift(sanitizedNode)
  }

  if (changed) {
    saveWordChainApprovedNodes(nextNodes)
  }
}

export const getWordChainApprovedNodesForRound = (
  centerWord = '',
  category = '',
  difficulty = ''
) =>
  WORD_CHAIN_APPROVED_RELATIONS.reduce(
    (accumulator, relation) => {
      const seenWords = new Set()
      const words = []

      getWordChainApprovedNodes()
        .filter(
          (item) =>
            item.relation === relation &&
            normalizeText(item.centerWord) === normalizeText(centerWord) &&
            normalizeText(item.category) === normalizeText(category) &&
            normalizeText(item.difficulty) === normalizeText(difficulty)
        )
        .forEach((item) => {
          const normalizedCandidateWord = normalizeText(item.candidateWord)

          if (!normalizedCandidateWord || seenWords.has(normalizedCandidateWord)) {
            return
          }

          seenWords.add(normalizedCandidateWord)
          words.push(item.candidateWord)
        })

      return {
        ...accumulator,
        [relation]: words,
      }
    },
    {
      Sinonim: [],
      Antonim: [],
      Asocijacija: [],
    }
  )

export const getGameSubmissions = () => {
  migrateStoredGameText()
  return readStorage('gameSubmissions', [])
}

export const saveGameSubmissions = (submissions) => {
  writeStorage('gameSubmissions', sanitizeStoredGameValue(submissions))
}

export const addGameSubmission = (submission) => {
  const submissions = getGameSubmissions()
  saveGameSubmissions([
    {
      id: submission.id || createId(),
      ...submission,
    },
    ...submissions,
  ])
}

export const updateGameSubmission = (submissionId, updates = {}) => {
  if (!submissionId) {
    return
  }

  const submissions = getGameSubmissions()
  let changed = false
  const nextSubmissions = submissions.map((item) => {
    if (Number(item.id) !== Number(submissionId)) {
      return item
    }

    changed = true
    return {
      ...item,
      ...updates,
    }
  })

  if (changed) {
    saveGameSubmissions(nextSubmissions)
  }
}

export const applyReviewSubmissionDecisionLocally = (reviewUpdate = {}) => {
  if (!reviewUpdate?.id) {
    return
  }

  updateGameSubmission(reviewUpdate.id, {
    status: reviewUpdate.status,
    reviewedAt: reviewUpdate.reviewedAt || new Date().toISOString(),
    rewardGranted: Boolean(reviewUpdate.rewardGranted),
    points: Math.max(0, Number(reviewUpdate.rewardPoints || 0) || 0),
  })

  if (
    reviewUpdate.status === 'approved' &&
    reviewUpdate.contentType === 'association' &&
    Number(reviewUpdate.contentItemId || 0) > 0 &&
    String(reviewUpdate.proposedAnswer || '').trim()
  ) {
    const nextAnswer = String(reviewUpdate.proposedAnswer || '').trim()
    const updatedWords = getAssociationWords().map((word) => {
      if (Number(word.id) !== Number(reviewUpdate.contentItemId)) {
        return word
      }

      return {
        ...word,
        acceptedAnswers: expandAcceptedAnswersForValue(word.word, [
          ...(Array.isArray(word.acceptedAnswers) ? word.acceptedAnswers : []),
          nextAnswer,
        ]),
      }
    })

    saveAssociationWords(updatedWords)
  }

  if (reviewUpdate.status === 'approved' && reviewUpdate.wordChainApproval) {
    upsertWordChainApprovedNode(reviewUpdate.wordChainApproval)
  }
}

export const getDashboardStats = () => {
  const associationWords = getAssociationWords()
  const logicChallenges = getLogicChallenges()
  const relationChallenges = getRelationChallenges()
  const submissions = getGameSubmissions()

  return {
    totalWords: associationWords.length,
    activeGames:
      logicChallenges.length + associationWords.length + relationChallenges.length,
    pendingSubmissions: submissions.filter((item) => item.status === 'pending').length,
    flaggedSubmissions: submissions.filter((item) => item.status === 'flagged').length,
  }
}

export const saveActiveSession = (session) => {
  const currentUser = getCurrentUser()

  writeStorage('activeSession', {
    ...sanitizeStoredGameValue(session),
    userId: session?.userId ?? currentUser?.id ?? null,
    username: session?.username ?? currentUser?.username ?? null,
    updatedAt: new Date().toISOString(),
  })
}

export const getActiveSession = () => {
  migrateStoredGameText()
  const session = readStorage('activeSession', null)

  if (!session) {
    return null
  }

  const currentUser = getCurrentUser()

  if (!currentUser) {
    return session
  }

  const sessionUserId =
    session?.userId === null || session?.userId === undefined ? null : Number(session.userId)
  const currentUserId =
    currentUser?.id === null || currentUser?.id === undefined ? null : Number(currentUser.id)
  const sessionUsername =
    typeof session?.username === 'string' ? session.username.trim().toLowerCase() : ''
  const currentUsername =
    typeof currentUser?.username === 'string' ? currentUser.username.trim().toLowerCase() : ''

  if (sessionUserId !== null && currentUserId !== null) {
    if (sessionUserId !== currentUserId) {
      removeStorageValue('activeSession')
      return null
    }

    return session
  }

  if (sessionUsername && currentUsername) {
    if (sessionUsername !== currentUsername) {
      removeStorageValue('activeSession')
      return null
    }

    return session
  }

  removeStorageValue('activeSession')
  return null
}

export const clearActiveSession = () => {
  removeStorageValue('activeSession')
}

export const saveDifficulty = (difficulty) => {
  setRawStorageValue('difficulty', difficulty)
}

export const getDifficulty = () => {
  return canUseBrowserStorage()
    ? window.localStorage.getItem('difficulty') || DEFAULT_DIFFICULTY
    : DEFAULT_DIFFICULTY
}

export const saveCategory = (category) => {
  setRawStorageValue('category', normalizeCategory(category))
}

export const getCategory = () => {
  return canUseBrowserStorage()
    ? window.localStorage.getItem('category') || DEFAULT_CATEGORY
    : DEFAULT_CATEGORY
}

const getRecentContentRotations = () => {
  return readStorage(RECENT_CONTENT_ROTATIONS_KEY, {})
}

const saveRecentContentRotations = (value) => {
  writeStorage(RECENT_CONTENT_ROTATIONS_KEY, value)
}

const buildContentRotationKey = ({ gameType, difficulty, category, mode = 'default' }) =>
  [
    getCurrentUser()?.id || 'guest',
    gameType || 'game',
    normalizeCategory(category),
    difficulty || DEFAULT_DIFFICULTY,
    mode || 'default',
  ].join('::')

export const getSessionRoundSize = ({
  availableCount = 0,
  preferredCount = 5,
  minimumCount = 1,
} = {}) => {
  const safeAvailableCount = Math.max(0, Number(availableCount) || 0)
  if (!safeAvailableCount) {
    return 0
  }

  const cappedPreferredCount = Math.max(
    1,
    Math.min(Number(preferredCount) || 1, safeAvailableCount)
  )
  const cappedMinimumCount = Math.max(
    1,
    Math.min(Number(minimumCount) || 1, cappedPreferredCount)
  )

  if (safeAvailableCount >= cappedPreferredCount * 2) {
    return cappedPreferredCount
  }

  const halfPoolCount = Math.max(1, Math.floor(safeAvailableCount / 2))
  return Math.min(cappedPreferredCount, Math.max(halfPoolCount, cappedMinimumCount))
}

export const getRotatedSessionItemIds = ({
  gameType,
  difficulty = DEFAULT_DIFFICULTY,
  category = DEFAULT_CATEGORY,
  mode = 'default',
  items = [],
  count = 5,
  commit = true,
} = {}) => {
  const validItems = (items || []).filter((item) => item?.id !== undefined && item?.id !== null)
  if (!validItems.length) {
    return []
  }

  const idMap = new Map(validItems.map((item) => [String(item.id), item.id]))
  const uniqueIds = [...idMap.keys()]
  const maxCount = Math.max(1, Math.min(Number(count) || 1, uniqueIds.length))
  const rotationKey = buildContentRotationKey({ gameType, difficulty, category, mode })
  const rotations = getRecentContentRotations()
  const seenIds = (rotations[rotationKey] || []).filter((itemId) => uniqueIds.includes(itemId))
  const unseenIds = uniqueIds.filter((itemId) => !seenIds.includes(itemId))

  let selectedIds = []
  let nextSeenIds = seenIds

  if (unseenIds.length > 0) {
    selectedIds = shuffleItems(unseenIds).slice(0, maxCount)
    nextSeenIds = [...new Set([...seenIds, ...selectedIds])]
    if (nextSeenIds.length >= uniqueIds.length) {
      nextSeenIds = []
    }
  } else {
    selectedIds = shuffleItems(uniqueIds).slice(0, maxCount)
    nextSeenIds = selectedIds.length >= uniqueIds.length ? [] : [...selectedIds]
  }

  if (commit) {
    saveRecentContentRotations({
      ...rotations,
      [rotationKey]: nextSeenIds,
    })
  }

  return selectedIds.map((itemId) => idMap.get(itemId)).filter(Boolean)
}

export const calculateLevelFromPoints = (points = 0) => {
  return Math.floor(points / 1000) + 1
}

export const getLevelProgress = (points = 0) => {
  const safePoints = Math.max(0, Number(points) || 0)
  const currentXp = safePoints % 1000
  const neededXp = 1000
  const remainingXp = neededXp - currentXp
  const progressPercent = Math.min((currentXp / neededXp) * 100, 100)

  return {
    level: calculateLevelFromPoints(safePoints),
    currentXp,
    neededXp,
    remainingXp,
    progressPercent,
  }
}

export const updateCurrentUserPoints = (pointsToAdd) => {
  const currentUser = getCurrentUser()
  if (!currentUser) return null

  const users = getUsers()
  const safePointsToAdd = Math.max(0, Number(pointsToAdd) || 0)
  const newPoints = Math.max(0, (currentUser.points || 0) + safePointsToAdd)
  const updatedUser = {
    ...currentUser,
    points: newPoints,
    level: calculateLevelFromPoints(newPoints),
  }

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id ? updatedUser : user
  )

  saveUsers(updatedUsers)
  saveCurrentUser(updatedUser)
  return updatedUser
}

export const getAssociationWordsByDifficulty = (
  difficulty,
  category = ALL_CATEGORY
) => {
  return getFilteredItems(getAssociationWords(), difficulty, category)
}

export const getLogicChallengesByDifficulty = (
  difficulty,
  category = ALL_CATEGORY
) => {
  return getFilteredItems(getLogicChallenges(), difficulty, category)
}

export const getRelationChallengesByDifficulty = (
  difficulty,
  category = ALL_CATEGORY
) => {
  return getFilteredItems(getRelationChallenges(), difficulty, category)
}

export const getWordChainPreset = (
  difficulty = DEFAULT_DIFFICULTY,
  category = DEFAULT_CATEGORY,
  { commit = true, presetId = null } = {}
) => {
  const normalizedCategory = normalizeCategory(category)
  const presetKey = `${normalizedCategory}-${difficulty}`
  const fallbackPresetKey = `${DEFAULT_CATEGORY}-${difficulty}`
  const defaultFallbackPresetKey = `${DEFAULT_CATEGORY}-${DEFAULT_DIFFICULTY}`
  const availablePresets =
    normalizedCategory === ALL_CATEGORY
      ? Object.entries(DEFAULT_WORD_CHAIN_PRESETS)
          .filter(([key]) => key.endsWith(`-${difficulty}`))
          .flatMap(([key, presets]) => {
            const [presetCategory = DEFAULT_CATEGORY] = key.split('-')
            return sanitizeWordChainPresetCollection(presets).map((preset) => ({
              ...preset,
              category: preset.category || presetCategory,
              difficulty: preset.difficulty || difficulty,
            }))
          })
      : sanitizeWordChainPresetCollection(
          DEFAULT_WORD_CHAIN_PRESETS[presetKey] ||
            DEFAULT_WORD_CHAIN_PRESETS[fallbackPresetKey] ||
            DEFAULT_WORD_CHAIN_PRESETS[defaultFallbackPresetKey]
        ).map((preset) => ({
          ...preset,
          category:
            preset.category ||
            (DEFAULT_WORD_CHAIN_PRESETS[presetKey]
              ? normalizedCategory
              : DEFAULT_WORD_CHAIN_PRESETS[fallbackPresetKey]
                ? DEFAULT_CATEGORY
                : DEFAULT_CATEGORY),
          difficulty: preset.difficulty || difficulty,
        }))

  if (!availablePresets.length) {
    return sanitizeWordChainPreset({
      id: `${presetKey}-fallback`,
      centerWord: DEFAULT_CATEGORY,
      category: DEFAULT_CATEGORY,
      difficulty,
      starterNodes: [],
    })
  }

  if (availablePresets.length === 1) {
    return availablePresets[0]
  }

  if (presetId) {
    return availablePresets.find((preset) => String(preset.id) === String(presetId)) || availablePresets[0]
  }

  const [selectedPresetId] = getRotatedSessionItemIds({
    gameType: 'word-chain-preset',
    difficulty,
    category: normalizedCategory,
    mode: presetKey,
    items: availablePresets,
    count: 1,
    commit,
  })

  return (
    availablePresets.find((preset) => String(preset.id) === String(selectedPresetId)) ||
    availablePresets[0]
  )
}

export const evaluateAssociationAnswer = (wordItem, answer) => {
  return evaluateSmartAssociationAnswer(wordItem, answer)
}

export const evaluateExactAnswer = (expectedAnswer, actualAnswer) => {
  return normalizeText(expectedAnswer) === normalizeText(actualAnswer)
}

export const evaluateLogicAnswer = (challenge, actualAnswer) => {
  return evaluateSmartConceptAnswer(challenge, actualAnswer)
}

export const getGameHistory = () => {
  migrateStoredGameText()
  return readStorage('gameHistory', [])
}

export const getCurrentUserGameHistory = () => {
  const currentUser = getCurrentUser()
  if (!currentUser?.id) return []
  const resetTimestamp = currentUser.progressResetAt
    ? new Date(currentUser.progressResetAt).getTime()
    : 0

  return getGameHistory().filter((item) => {
    if (item.userId !== currentUser.id) {
      return false
    }

    if (!resetTimestamp) {
      return true
    }

    const itemTimestamp = new Date(item.createdAt || 0).getTime()
    return !Number.isNaN(itemTimestamp) && itemTimestamp >= resetTimestamp
  })
}

export const saveGameHistory = (history) => {
  writeStorage('gameHistory', sanitizeStoredGameValue(history))
}

export const getPlayerProgressOverview = (history = getCurrentUserGameHistory()) => {
  const safeHistory = Array.isArray(history) ? history : []
  const totalGames = safeHistory.length
  const totalPoints = safeHistory.reduce(
    (sum, item) => sum + getAwardedPointsFromHistoryItem(item),
    0
  )
  const completedDaily = safeHistory.filter((item) => Number(item.dailyReward || 0) > 0).length
  const averageAccuracy = totalGames
    ? Math.round(safeHistory.reduce((sum, item) => sum + (Number(item.accuracy) || 0), 0) / totalGames)
    : 0
  const bestScore = safeHistory.reduce(
    (highest, item) => Math.max(highest, getAwardedPointsFromHistoryItem(item)),
    0
  )
  const bestCombo = safeHistory.reduce(
    (highest, item) => Math.max(highest, deriveBestComboFromHistoryItem(item)),
    0
  )
  const perfectRuns = safeHistory.filter((item) => {
    const totalRounds = Math.max(0, Number(item.total) || 0)
    const accuracy = Math.max(0, Number(item.accuracy) || 0)
    const wrongAttempts = Math.max(0, Number(item.wrongAttempts) || 0)

    return totalRounds > 0 && accuracy === 100 && wrongAttempts === 0
  }).length
  const distinctModeCount = new Set(safeHistory.map((item) => item.type).filter(Boolean)).size
  const streakStats = calculateStreakStats(safeHistory)
  const achievements = buildAchievements({
    totalGames,
    totalPoints,
    completedDaily,
    bestCombo,
    perfectRuns,
    distinctModeCount,
    longestStreak: streakStats.longestStreak,
  })
  const unlockedAchievements = achievements.filter((item) => item.unlocked)

  return {
    totalGames,
    totalPoints,
    completedDaily,
    averageAccuracy,
    bestScore,
    bestCombo,
    perfectRuns,
    distinctModeCount,
    currentStreak: streakStats.currentStreak,
    longestStreak: streakStats.longestStreak,
    lastPlayedDateKey: streakStats.lastPlayedDateKey,
    achievements,
    unlockedAchievements,
    achievementCount: unlockedAchievements.length,
  }
}

export const getNewUnlockedAchievements = (
  previousOverview = {},
  nextOverview = getPlayerProgressOverview()
) => {
  const previousKeys = new Set(
    (previousOverview.unlockedAchievements || []).map((item) => item.key)
  )

  return (nextOverview.unlockedAchievements || []).filter((item) => !previousKeys.has(item.key))
}

export const addGameHistory = (item) => {
  const history = getGameHistory()
  const currentUser = getCurrentUser()
  const historyItem = {
    id: item.id || createId(),
    createdAt: item.createdAt || new Date().toISOString(),
    userId: item.userId || currentUser?.id || null,
    username: item.username || currentUser?.username || 'Korisnik',
    ...item,
  }

  saveGameHistory([historyItem, ...history].slice(0, HISTORY_LIMIT))
}

export const clearGameHistory = () => {
  removeStorageValue('gameHistory')
}

export const getHistorySummary = () => {
  const summary = getPlayerProgressOverview()

  return {
    totalGames: summary.totalGames,
    totalPoints: summary.totalPoints,
    completedDaily: summary.completedDaily,
    averageAccuracy: summary.averageAccuracy,
    currentStreak: summary.currentStreak,
    longestStreak: summary.longestStreak,
    bestCombo: summary.bestCombo,
    achievementCount: summary.achievementCount,
  }
}

export const clearAllAppData = () => {
  ;[
    'users',
    'currentUser',
    AUTH_TOKEN_KEY,
    'associationWords',
    'logicChallenges',
    'relationChallenges',
    'wordChainApprovedNodes',
    'activeSession',
    'lastResult',
    'gameSubmissions',
    'gameHistory',
    'dailyChallengeEntries',
    'dailyChallengeOverride',
    'difficulty',
    'category',
    RECENT_CONTENT_ROTATIONS_KEY,
    'progressVersion',
  ].forEach((key) => removeStorageValue(key))
}

export const getExploreIndex = () => {
  const associationWords = getAssociationWords().map((item) => ({
    id: `association-${item.id}`,
    type: 'association',
    title: item.word,
    description: item.hint,
    category: item.category,
    difficulty: item.difficulty,
    meta: [item.symbol, ...(item.clues || [])].filter(Boolean).join(', '),
  }))

  const logicChallenges = getLogicChallenges().map((item) => ({
    id: `logic-${item.id}`,
    type: item.mode === 'odd-one-out' ? 'odd-one-out' : 'logic',
    title: item.answer,
    description: item.words.join(', '),
    category: item.category,
    difficulty: item.difficulty,
    meta: item.hint,
  }))

  const relationChallenges = getRelationChallenges().map((item) => ({
    id: `relation-${item.id}`,
    type: 'relation',
    title: `${item.leftWord} / ${item.rightWord}`,
    description: item.relation,
    category: item.category,
    difficulty: item.difficulty,
    meta: item.hint,
  }))

  return [...associationWords, ...logicChallenges, ...relationChallenges]
}

export const getDailyChallenge = () => {
  const currentUser = getCurrentUser()
  const todayKey = getTodayKey()
  const associationPool = getAssociationWords()
  const logicPool = getLogicChallenges()
  const relationPool = getRelationChallenges()
  const combinedPool = [
    ...associationPool.map((item) => ({ type: 'association', payload: item })),
    ...logicPool.map((item) => ({ type: 'logic', payload: item })),
    ...relationPool.map((item) => ({ type: 'relation', payload: item })),
  ]

  const fallbackPool = combinedPool.length
    ? combinedPool
    : [
        {
          type: 'association',
          payload: getAssociationWordsByDifficulty(DEFAULT_DIFFICULTY, ALL_CATEGORY)[0],
        },
      ]

  const indexSeed = todayKey
    .split('-')
    .join('')
    .split('')
    .reduce((sum, char) => sum + Number(char), 0)

  const selectedItem = fallbackPool[indexSeed % fallbackPool.length]
  const dailyOverride = getDailyChallengeOverride()
  const effectiveItem =
    dailyOverride?.type && dailyOverride?.payload ? dailyOverride : selectedItem
  const stateEntries = getDailyChallengeEntries()
  const stateKey = getDailyChallengeStateKey(currentUser?.id)
  const storedState = stateEntries[stateKey] || {}
  const isCompleted = Boolean(storedState.completed)

  const isLogic = effectiveItem.type === 'logic'
  const isRelation = effectiveItem.type === 'relation'
  const title = isLogic
    ? `Dnevni izazov: ${effectiveItem.payload.answer}`
    : isRelation
      ? `Dnevna relacija: ${effectiveItem.payload.leftWord}`
      : `Dnevna rijec: ${effectiveItem.payload.word}`

  const description = isLogic
    ? `Povezi pojmove ${effectiveItem.payload.words.join(', ')} i osvoji bonus.`
    : isRelation
      ? `Odredi odnos izmedju ${effectiveItem.payload.leftWord} i ${effectiveItem.payload.rightWord}.`
      : `Pronadji najbolju asocijaciju za pojam ${effectiveItem.payload.word}.`

  return {
    id: `${todayKey}-${effectiveItem.type}-${effectiveItem.payload.id}`,
    dateKey: todayKey,
    reward: DEFAULT_DAILY_REWARD,
    progress: calculateDailyProgress(isCompleted),
    isCompleted,
    type: effectiveItem.type,
      title,
      description,
      difficulty: effectiveItem.payload.difficulty || DEFAULT_DIFFICULTY,
      category: effectiveItem.payload.category || DEFAULT_CATEGORY,
      contentId: effectiveItem.payload.id,
      content: effectiveItem.payload,
  }
}

export const completeDailyChallenge = (result) => {
  const currentUser = getCurrentUser()
  const challenge = getDailyChallenge()
  const stateEntries = getDailyChallengeEntries()
  const stateKey = getDailyChallengeStateKey(currentUser?.id)
  const total = Math.max(0, Number(result?.total) || 0)
  const correct = Math.max(0, Number(result?.correct) || 0)
  const completedSuccessfully = total > 0 && correct >= total

  if (completedSuccessfully && !stateEntries[stateKey]?.completed) {
    saveDailyChallengeEntries({
      ...stateEntries,
      [stateKey]: {
        challengeId: challenge.id,
        completed: true,
        completedAt: new Date().toISOString(),
      },
    })
    updateCurrentUserPoints(DEFAULT_DAILY_REWARD)
  }

  return {
    ...result,
    dailyReward: completedSuccessfully ? DEFAULT_DAILY_REWARD : 0,
    isDaily: true,
    dailyChallengeId: challenge.id,
  }
}
