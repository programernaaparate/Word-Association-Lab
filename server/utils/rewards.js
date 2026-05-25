const BASE_SCORE = 1200
const ASSOCIATION_WRONG_PENALTY = 15
const LOGIC_WRONG_PENALTY = 15
const RELATION_WRONG_PENALTY = 12
const MAX_ANSWERS_BY_TYPE = {
  association: 5,
  logic: 4,
  'logic-odd-one-out': 4,
  relation: 5,
  'word-chain': 12,
}

const DIFFICULTY_MULTIPLIERS = {
  Lako: 1,
  Srednje: 1.35,
  Tesko: 1.75,
}

const RELATION_OPTIONS = ['Sinonim', 'Antonim', 'Asocijacija']

const normalizeNumber = (value) => Math.max(0, Number(value) || 0)

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const normalizeDifficulty = (difficulty = 'Lako') =>
  DIFFICULTY_MULTIPLIERS[difficulty] ? difficulty : 'Lako'

const applyDifficultyMultiplier = (value, difficulty = 'Lako') => {
  const multiplier = DIFFICULTY_MULTIPLIERS[normalizeDifficulty(difficulty)] || 1
  return Math.max(0, Math.round(normalizeNumber(value) * multiplier))
}

const hasSubmittedAnswer = (answer = '') => {
  const normalizedAnswer = String(answer || '').trim()
  return Boolean(normalizedAnswer && normalizedAnswer !== '(bez odgovora)')
}

const getRoundDifficulty = (item = {}, fallbackDifficulty = 'Lako') =>
  normalizeDifficulty(item.roundDifficulty || fallbackDifficulty)

const getPerformanceDifficulty = (answers = [], fallbackDifficulty = 'Lako') => {
  const lastAnswerWithDifficulty = [...answers]
    .reverse()
    .find((item) => item?.roundDifficulty && DIFFICULTY_MULTIPLIERS[item.roundDifficulty])

  return normalizeDifficulty(lastAnswerWithDifficulty?.roundDifficulty || fallbackDifficulty)
}

const getSafeAnswers = (type, answers = []) =>
  Array.isArray(answers)
    ? answers.slice(0, MAX_ANSWERS_BY_TYPE[type] || 10)
    : []

const calculateAssociationReward = ({
  difficulty = 'Lako',
  totalClues = 4,
  revealedCount = 1,
  hintUsed = false,
}) => {
  const safeTotalClues = clamp(normalizeNumber(totalClues) || 4, 1, 8)
  const safeRevealedCount = clamp(normalizeNumber(revealedCount) || 1, 1, safeTotalClues)
  const hiddenClueBonus = Math.max(0, safeTotalClues - safeRevealedCount) * 7
  const cleanSolveBonus = hintUsed ? 0 : 6

  return applyDifficultyMultiplier(24 + hiddenClueBonus + cleanSolveBonus, difficulty)
}

const calculateLogicReward = ({
  difficulty = 'Lako',
  mode = 'concept',
  hintUsed = false,
}) => {
  const modeBonus = mode === 'odd-one-out' ? 30 : 26
  const cleanSolveBonus = hintUsed ? 0 : 8

  return applyDifficultyMultiplier(modeBonus + cleanSolveBonus, difficulty)
}

const calculateRelationReward = ({
  difficulty = 'Lako',
  hintUsed = false,
}) => {
  const cleanSolveBonus = hintUsed ? 0 : 5
  return applyDifficultyMultiplier(18 + cleanSolveBonus, difficulty)
}

const calculateWordChainReward = ({
  difficulty = 'Lako',
  validNodes = 0,
  representedRelations = 0,
  hasMinimumNodes = false,
  hasAllRelations = false,
  accuracy = 0,
}) => {
  const structureBonus = hasMinimumNodes ? 24 : 0
  const relationBonus = hasAllRelations ? 28 : 0
  const accuracyBonus = accuracy >= 80 ? 12 : accuracy >= 60 ? 6 : 0
  const rawScore =
    normalizeNumber(validNodes) * 12 +
    normalizeNumber(representedRelations) * 18 +
    structureBonus +
    relationBonus +
    accuracyBonus

  return applyDifficultyMultiplier(rawScore, difficulty)
}

const calculatePerformanceBonus = ({
  difficulty = 'Lako',
  total = 0,
  correct = 0,
  time = 0,
  hintCount = 0,
  type = 'association',
}) => {
  const safeTotal = normalizeNumber(total)
  const safeCorrect = normalizeNumber(correct)
  const safeTime = normalizeNumber(time)
  const safeHints = normalizeNumber(hintCount)

  if (!safeTotal || !safeCorrect) {
    return 0
  }

  const accuracy = Math.round((safeCorrect / safeTotal) * 100)
  const timePerRound = safeTotal > 0 ? safeTime / safeTotal : safeTime

  let accuracyBonus = 0
  if (accuracy === 100) {
    accuracyBonus = 24
  } else if (accuracy >= 75) {
    accuracyBonus = 16
  } else if (accuracy >= 50) {
    accuracyBonus = 8
  }

  let speedBonus = 0
  if (timePerRound > 0 && timePerRound <= 10) {
    speedBonus = 18
  } else if (timePerRound <= 18) {
    speedBonus = 10
  } else if (timePerRound <= 26) {
    speedBonus = 4
  }

  const cleanRunBonus = safeHints === 0 ? 10 : safeHints <= 1 ? 4 : 0
  const modeBonus =
    type === 'logic-odd-one-out'
      ? 8
      : type === 'word-chain'
        ? 12
        : type === 'relation'
          ? 6
          : 0

  return applyDifficultyMultiplier(
    accuracyBonus + speedBonus + cleanRunBonus + modeBonus,
    difficulty
  )
}

const buildMetricsFromScoreDelta = ({
  roundDelta = 0,
  performanceBonus = 0,
  total = 0,
  correct = 0,
  accuracy = 0,
}) => {
  const baseScore = Math.max(0, BASE_SCORE + roundDelta)
  const score = Math.max(0, baseScore + performanceBonus)
  const earnedPoints = Math.max(0, score - BASE_SCORE)

  return {
    score,
    baseScore,
    earnedPoints,
    total,
    correct,
    accuracy,
    performanceBonus,
  }
}

const buildFallbackMetrics = ({
  type,
  difficulty,
  total,
  correct,
  accuracy,
  time,
  hintCount,
  clientEarnedPoints,
}) => {
  const safeType = String(type || 'association')
  const maxTotal = MAX_ANSWERS_BY_TYPE[safeType] || 10
  const safeTotal = clamp(normalizeNumber(total), 0, maxTotal)
  const safeCorrect = clamp(normalizeNumber(correct), 0, safeTotal)
  const safeAccuracy =
    safeType === 'word-chain'
      ? clamp(normalizeNumber(accuracy), 0, 100)
      : safeTotal > 0
        ? Math.round((safeCorrect / safeTotal) * 100)
        : 0
  const normalizedDifficulty = normalizeDifficulty(difficulty)
  const performanceBonus = calculatePerformanceBonus({
    difficulty: normalizedDifficulty,
    total: safeTotal,
    correct: safeCorrect,
    time,
    hintCount,
    type: safeType,
  })

  let roundDelta = 0

  if (safeType === 'association') {
    roundDelta =
      safeCorrect *
      calculateAssociationReward({
        difficulty: normalizedDifficulty,
        totalClues: 4,
        revealedCount: 4,
        hintUsed: normalizeNumber(hintCount) > 0,
      })
  } else if (safeType === 'logic' || safeType === 'logic-odd-one-out') {
    roundDelta =
      safeCorrect *
      calculateLogicReward({
        difficulty: normalizedDifficulty,
        mode: safeType === 'logic-odd-one-out' ? 'odd-one-out' : 'concept',
        hintUsed: normalizeNumber(hintCount) > 0,
      })
  } else if (safeType === 'relation') {
    roundDelta =
      safeCorrect *
      calculateRelationReward({
        difficulty: normalizedDifficulty,
        hintUsed: normalizeNumber(hintCount) > 0,
      })
  } else if (safeType === 'word-chain') {
    const representedRelations = Math.min(RELATION_OPTIONS.length, safeCorrect)
    roundDelta = calculateWordChainReward({
      difficulty: normalizedDifficulty,
      validNodes: safeCorrect,
      representedRelations,
      hasMinimumNodes: safeCorrect >= 4,
      hasAllRelations: representedRelations === RELATION_OPTIONS.length,
      accuracy: safeAccuracy,
    })
  }

  const metrics = buildMetricsFromScoreDelta({
    roundDelta,
    performanceBonus,
    total: safeTotal,
    correct: safeCorrect,
    accuracy: safeAccuracy,
  })

  metrics.earnedPoints = Math.min(metrics.earnedPoints, normalizeNumber(clientEarnedPoints))
  metrics.score = BASE_SCORE + metrics.earnedPoints
  metrics.baseScore = Math.max(BASE_SCORE, metrics.score - performanceBonus)

  return metrics
}

const calculateAssociationMetrics = ({
  answers,
  difficulty,
  time,
  hintCount,
}) => {
  const safeAnswers = getSafeAnswers('association', answers)
  const total = safeAnswers.length
  const correct = safeAnswers.filter((item) => Boolean(item.accepted)).length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const roundDelta = safeAnswers.reduce((sum, item) => {
    if (item.accepted) {
      return (
        sum +
        calculateAssociationReward({
          difficulty: getRoundDifficulty(item, difficulty),
          totalClues: item.totalClues,
          revealedCount: item.revealedCount,
          hintUsed: Boolean(item.hintUsed),
        })
      )
    }

    if (hasSubmittedAnswer(item.answer)) {
      return sum - ASSOCIATION_WRONG_PENALTY
    }

    return sum
  }, 0)
  const performanceBonus = calculatePerformanceBonus({
    difficulty: getPerformanceDifficulty(safeAnswers, difficulty),
    total,
    correct,
    time,
    hintCount,
    type: 'association',
  })

  return buildMetricsFromScoreDelta({
    roundDelta,
    performanceBonus,
    total,
    correct,
    accuracy,
  })
}

const calculateLogicMetrics = ({
  type,
  answers,
  difficulty,
  time,
  hintCount,
}) => {
  const safeType = type === 'logic-odd-one-out' ? 'logic-odd-one-out' : 'logic'
  const safeAnswers = getSafeAnswers(safeType, answers)
  const total = safeAnswers.length
  const correct = safeAnswers.filter((item) => Boolean(item.accepted)).length
  const partialCount = safeAnswers.filter((item) => Boolean(item.partialAccepted)).length
  const weightedCorrect = correct + partialCount * 0.5
  const accuracy = total > 0 ? Math.round((weightedCorrect / total) * 100) : 0
  const roundDelta = safeAnswers.reduce((sum, item) => {
    if (item.accepted) {
      return (
        sum +
        calculateLogicReward({
          difficulty: getRoundDifficulty(item, difficulty),
          mode:
            item.mode === 'odd-one-out' || safeType === 'logic-odd-one-out'
              ? 'odd-one-out'
              : 'concept',
          hintUsed: Boolean(item.hintUsed),
        })
      )
    }

    if (item.partialAccepted) {
      return (
        sum +
        Math.max(
          1,
          Math.round(
            calculateLogicReward({
              difficulty: getRoundDifficulty(item, difficulty),
              mode:
                item.mode === 'odd-one-out' || safeType === 'logic-odd-one-out'
                  ? 'odd-one-out'
                  : 'concept',
              hintUsed: Boolean(item.hintUsed),
            }) * 0.5
          )
        )
      )
    }

    if (hasSubmittedAnswer(item.answer)) {
      return sum - LOGIC_WRONG_PENALTY
    }

    return sum
  }, 0)
  const performanceBonus = calculatePerformanceBonus({
    difficulty: getPerformanceDifficulty(safeAnswers, difficulty),
    total,
    correct: weightedCorrect,
    time,
    hintCount,
    type: safeType,
  })

  return buildMetricsFromScoreDelta({
    roundDelta,
    performanceBonus,
    total,
    correct,
    accuracy,
  })
}

const calculateRelationMetrics = ({
  answers,
  difficulty,
  time,
  hintCount,
}) => {
  const safeAnswers = getSafeAnswers('relation', answers)
  const total = safeAnswers.length
  const correct = safeAnswers.filter((item) => Boolean(item.accepted)).length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const roundDelta = safeAnswers.reduce((sum, item) => {
    if (item.accepted) {
      return (
        sum +
        calculateRelationReward({
          difficulty: getRoundDifficulty(item, difficulty),
          hintUsed: Boolean(item.hintUsed),
        })
      )
    }

    if (hasSubmittedAnswer(item.answer)) {
      return sum - RELATION_WRONG_PENALTY
    }

    return sum
  }, 0)
  const performanceBonus = calculatePerformanceBonus({
    difficulty: getPerformanceDifficulty(safeAnswers, difficulty),
    total,
    correct,
    time,
    hintCount,
    type: 'relation',
  })

  return buildMetricsFromScoreDelta({
    roundDelta,
    performanceBonus,
    total,
    correct,
    accuracy,
  })
}

const calculateWordChainMetrics = ({
  answers,
  difficulty,
  time,
  hintCount,
}) => {
  const safeAnswers = getSafeAnswers('word-chain', answers)
  const total = Math.max(4, safeAnswers.length)
  const validAnswers = safeAnswers.filter((item) => Boolean(item.accepted))
  const correct = validAnswers.length
  const relationCounts = {
    Sinonim: 0,
    Antonim: 0,
    Asocijacija: 0,
  }

  validAnswers.forEach((item) => {
    const relation = RELATION_OPTIONS.includes(item.relation) ? item.relation : null

    if (relation) {
      relationCounts[relation] += 1
    }
  })

  const representedRelations = RELATION_OPTIONS.filter(
    (item) => relationCounts[item] > 0
  ).length
  const hasMinimumNodes = correct >= 4
  const hasAllRelations = representedRelations === RELATION_OPTIONS.length
  const completedGoals = [
    correct >= 2,
    hasMinimumNodes,
    relationCounts.Sinonim > 0,
    relationCounts.Antonim > 0,
    relationCounts.Asocijacija > 0,
  ].filter(Boolean).length
  const accuracy = Math.round((completedGoals / 5) * 100)
  const roundDelta = calculateWordChainReward({
    difficulty,
    validNodes: correct,
    representedRelations,
    hasMinimumNodes,
    hasAllRelations,
    accuracy,
  })
  const performanceBonus = calculatePerformanceBonus({
    difficulty,
    total,
    correct,
    time,
    hintCount,
    type: 'word-chain',
  })

  return buildMetricsFromScoreDelta({
    roundDelta,
    performanceBonus,
    total,
    correct,
    accuracy,
  })
}

export const calculateHistoryMetrics = (payload = {}) => {
  const type = String(payload.type || 'association')
  const difficulty = normalizeDifficulty(payload.difficulty)
  const time = clamp(normalizeNumber(payload.time), 0, 60 * 60 * 6)
  const hintCount = clamp(normalizeNumber(payload.hintCount), 0, 50)
  const answers = Array.isArray(payload.answers) ? payload.answers : []

  if (!answers.length) {
    return buildFallbackMetrics({
      type,
      difficulty,
      total: payload.total,
      correct: payload.correct,
      accuracy: payload.accuracy,
      time,
      hintCount,
      clientEarnedPoints: payload.earnedPoints,
    })
  }

  if (type === 'association') {
    return calculateAssociationMetrics({
      answers,
      difficulty,
      time,
      hintCount,
    })
  }

  if (type === 'logic' || type === 'logic-odd-one-out') {
    return calculateLogicMetrics({
      type,
      answers,
      difficulty,
      time,
      hintCount,
    })
  }

  if (type === 'relation') {
    return calculateRelationMetrics({
      answers,
      difficulty,
      time,
      hintCount,
    })
  }

  if (type === 'word-chain') {
    return calculateWordChainMetrics({
      answers,
      difficulty,
      time,
      hintCount,
    })
  }

  return buildFallbackMetrics({
    type,
    difficulty,
    total: payload.total,
    correct: payload.correct,
    accuracy: payload.accuracy,
    time,
    hintCount,
    clientEarnedPoints: payload.earnedPoints,
  })
}
