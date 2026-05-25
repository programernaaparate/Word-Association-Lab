import {
  DEFAULT_ASSOCIATION_WORDS as ASSOCIATION_CONTENT_MATRIX,
  DEFAULT_LOGIC_CHALLENGES as LOGIC_CONTENT_MATRIX,
  DEFAULT_RELATION_CHALLENGES as RELATION_CONTENT_MATRIX,
  DEFAULT_WORD_CHAIN_PRESETS,
} from './defaultGameContent'
import { evaluateSmartConceptAnswer, repairLegacyText } from './localSmartMatching'

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
    clues: ['Stranice', '?itanje', 'Biblioteka', 'Autor'],
    hint: 'Predmet koji citamo i iz koga ucimo ili uzivamo u prici.',
    acceptedAnswers: ['knjiga', 'roman'],
  },
  {
    id: 4,
    word: 'Galaksija',
    symbol: '🌌',
    category: 'Nauka',
    difficulty: 'Tesko',
    clues: ['Zvijezde', 'Kosmos', 'Mliječni put', 'Svemir'],
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
const DIFFICULTY_ORDER = ['Lako', 'Srednje', 'Tesko']

const readStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
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
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Podgorica',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(new Date())
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
  repairLegacyText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const sanitizeTextArray = (values = []) =>
  (values || []).map((value) => repairLegacyText(value)).filter(Boolean)

const sanitizeContentItem = (item = {}) => ({
  ...item,
  word: repairLegacyText(item.word || ''),
  symbol: repairLegacyText(item.symbol || ''),
  category: repairLegacyText(item.category || ''),
  difficulty: repairLegacyText(item.difficulty || ''),
  clue: repairLegacyText(item.clue || ''),
  hint: repairLegacyText(item.hint || ''),
  answer: repairLegacyText(item.answer || ''),
  leftWord: repairLegacyText(item.leftWord || ''),
  rightWord: repairLegacyText(item.rightWord || ''),
  acceptedAnswers: sanitizeTextArray(item.acceptedAnswers || []),
  clues: sanitizeTextArray(item.clues || []),
  words: sanitizeTextArray(item.words || []),
})

const sanitizeContentItems = (items = []) => (items || []).map(sanitizeContentItem)

const sanitizeWordChainPreset = (preset = {}) => ({
  centerWord: repairLegacyText(preset.centerWord || ''),
  starterNodes: (preset.starterNodes || []).map((node) => ({
    ...node,
    word: repairLegacyText(node.word || ''),
    relation: repairLegacyText(node.relation || ''),
  })),
})

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
  localStorage.removeItem('dailyChallengeOverride')
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

const migrateProgressData = () => {
  if (localStorage.getItem('progressVersion') === '2') {
    return
  }

  const users = readStorage('users', [])
  const history = readStorage('gameHistory', [])

  if (!users.length) {
    localStorage.setItem('progressVersion', '2')
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

  localStorage.setItem('progressVersion', '2')
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

export const saveAuthSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
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
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export const logoutUser = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem('currentUser')
}

export const getAssociationWords = () => {
  const defaultWords = mergeDefaultItems(
    DEFAULT_ASSOCIATION_WORDS,
    ASSOCIATION_CONTENT_MATRIX,
    (item) => item.word
  )
  const storedWords = readStorage('associationWords', [])

  return sanitizeContentItems(mergeDefaultItems(storedWords, defaultWords, (item) => item.word))
}

export const saveAssociationWords = (words) => {
  writeStorage('associationWords', words)
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
  const defaultChallenges = mergeDefaultItems(
    DEFAULT_LOGIC_CHALLENGES,
    LOGIC_CONTENT_MATRIX,
    (item) => `${item.mode}-${item.answer}-${item.category}-${item.difficulty}`
  )
  const storedChallenges = readStorage('logicChallenges', [])

  return sanitizeContentItems(
    mergeDefaultItems(
    storedChallenges,
    defaultChallenges,
    (item) => `${item.mode}-${item.answer}-${item.category}-${item.difficulty}`
  )
  )
}

export const saveLogicChallenges = (challenges) => {
  writeStorage('logicChallenges', challenges)
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
  writeStorage('relationChallenges', challenges)
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
  writeStorage('lastResult', result)
}

export const getLastResult = () => {
  return readStorage('lastResult', null)
}

export const getGameSubmissions = () => {
  return readStorage('gameSubmissions', [])
}

export const saveGameSubmissions = (submissions) => {
  writeStorage('gameSubmissions', submissions)
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
  writeStorage('activeSession', {
    ...session,
    updatedAt: new Date().toISOString(),
  })
}

export const getActiveSession = () => {
  return readStorage('activeSession', null)
}

export const clearActiveSession = () => {
  localStorage.removeItem('activeSession')
}

export const saveDifficulty = (difficulty) => {
  localStorage.setItem('difficulty', difficulty)
}

export const getDifficulty = () => {
  return localStorage.getItem('difficulty') || DEFAULT_DIFFICULTY
}

export const saveCategory = (category) => {
  localStorage.setItem('category', normalizeCategory(category))
}

export const getCategory = () => {
  return localStorage.getItem('category') || DEFAULT_CATEGORY
}

const getRecentContentRotations = () => {
  return readStorage(RECENT_CONTENT_ROTATIONS_KEY, {})
}

const saveRecentContentRotations = (value) => {
  writeStorage(RECENT_CONTENT_ROTATIONS_KEY, value)
}

const buildContentRotationKey = ({ gameType, difficulty, category, mode = 'default' }) =>
  [
    gameType || 'game',
    normalizeCategory(category),
    difficulty || DEFAULT_DIFFICULTY,
    mode || 'default',
  ].join('::')

export const getRotatedSessionItemIds = ({
  gameType,
  difficulty = DEFAULT_DIFFICULTY,
  category = DEFAULT_CATEGORY,
  mode = 'default',
  items = [],
  count = 5,
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

  let selectedIds = shuffleItems(unseenIds).slice(0, maxCount)

  if (selectedIds.length < maxCount) {
    const remainingIds = shuffleItems(
      uniqueIds.filter((itemId) => !selectedIds.includes(itemId))
    )
    selectedIds = [...selectedIds, ...remainingIds.slice(0, maxCount - selectedIds.length)]
  }

  let nextSeenIds = [...new Set([...seenIds, ...selectedIds])]
  if (nextSeenIds.length >= uniqueIds.length) {
    nextSeenIds = [...selectedIds]
  }

  saveRecentContentRotations({
    ...rotations,
    [rotationKey]: nextSeenIds,
  })

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
  category = DEFAULT_CATEGORY
) => {
  const normalizedCategory = normalizeCategory(category)
  const presetKey =
    normalizedCategory === ALL_CATEGORY
      ? `${DEFAULT_CATEGORY}-${difficulty}`
      : `${normalizedCategory}-${difficulty}`

  return (
    sanitizeWordChainPreset(
      DEFAULT_WORD_CHAIN_PRESETS[presetKey] ||
        DEFAULT_WORD_CHAIN_PRESETS[`${DEFAULT_CATEGORY}-${difficulty}`] ||
        DEFAULT_WORD_CHAIN_PRESETS[`${DEFAULT_CATEGORY}-${DEFAULT_DIFFICULTY}`]
    )
  )
}

export const evaluateAssociationAnswer = (wordItem, answer) => {
  const normalizedAnswer = normalizeText(answer)
  if (!normalizedAnswer) {
    return { accepted: false, matchedAnswer: null }
  }

  const acceptedAnswers = [
    normalizeText(wordItem?.word || ''),
    ...(wordItem?.acceptedAnswers || []).map(normalizeText),
  ].filter(Boolean)
  const directMatch = acceptedAnswers.find((item) => item === normalizedAnswer)
  if (directMatch) {
    return { accepted: true, matchedAnswer: directMatch }
  }

  const closeMatch = acceptedAnswers.find(
    (item) => item.includes(normalizedAnswer) || normalizedAnswer.includes(item)
  )

  return {
    accepted: Boolean(closeMatch),
    matchedAnswer: closeMatch || null,
  }
}

export const evaluateExactAnswer = (expectedAnswer, actualAnswer) => {
  return normalizeText(expectedAnswer) === normalizeText(actualAnswer)
}

export const evaluateLogicAnswer = (challenge, actualAnswer) => {
  return evaluateSmartConceptAnswer(challenge, actualAnswer)
}

export const getGameHistory = () => {
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
  writeStorage('gameHistory', history)
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

  saveGameHistory([historyItem, ...history].slice(0, 50))
}

export const clearGameHistory = () => {
  localStorage.removeItem('gameHistory')
}

export const getHistorySummary = () => {
  const history = getCurrentUserGameHistory()
  const totalGames = history.length
  const totalPoints = history.reduce(
    (sum, item) => sum + Math.max(0, Number(item.awardedPoints ?? item.earnedPoints ?? 0) || 0),
    0
  )
  const completedDaily = history.filter((item) => Number(item.dailyReward || 0) > 0).length
  const averageAccuracy = totalGames
    ? Math.round(
        history.reduce((sum, item) => sum + (item.accuracy || 0), 0) / totalGames
      )
    : 0

  return {
    totalGames,
    totalPoints,
    completedDaily,
    averageAccuracy,
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
  ].forEach((key) => localStorage.removeItem(key))
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
