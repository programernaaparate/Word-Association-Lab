const DIFFICULTY_MULTIPLIERS = {
  Lako: 1,
  Srednje: 1.35,
  Tesko: 1.75,
}

const normalizeNumber = (value) => Math.max(0, Number(value) || 0)

const applyDifficultyMultiplier = (value, difficulty = 'Lako') => {
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1
  return Math.max(0, Math.round(normalizeNumber(value) * multiplier))
}

export const getDifficultyMultiplier = (difficulty = 'Lako') =>
  DIFFICULTY_MULTIPLIERS[difficulty] || 1

export const calculateAssociationReward = ({
  difficulty = 'Lako',
  totalClues = 4,
  revealedCount = 1,
  hintUsed = false,
}) => {
  const hiddenClueBonus = Math.max(0, totalClues - revealedCount) * 7
  const cleanSolveBonus = hintUsed ? 0 : 6

  return applyDifficultyMultiplier(24 + hiddenClueBonus + cleanSolveBonus, difficulty)
}

export const calculateLogicReward = ({
  difficulty = 'Lako',
  mode = 'concept',
  hintUsed = false,
}) => {
  const modeBonus = mode === 'odd-one-out' ? 30 : 26
  const cleanSolveBonus = hintUsed ? 0 : 8

  return applyDifficultyMultiplier(modeBonus + cleanSolveBonus, difficulty)
}

export const calculateRelationReward = ({
  difficulty = 'Lako',
  hintUsed = false,
}) => {
  const cleanSolveBonus = hintUsed ? 0 : 5
  return applyDifficultyMultiplier(18 + cleanSolveBonus, difficulty)
}

export const calculateWordChainReward = ({
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

export const calculatePerformanceBonus = ({
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

export const calculateComboBonus = ({
  difficulty = 'Lako',
  comboStreak = 0,
  partialAccepted = false,
  hintUsed = false,
}) => {
  const safeCombo = Math.max(0, Math.floor(Number(comboStreak) || 0))

  if (safeCombo < 2) {
    return 0
  }

  let rawBonus = 4 + safeCombo * 4

  if (safeCombo >= 4) {
    rawBonus += 4
  }

  if (partialAccepted) {
    rawBonus = Math.round(rawBonus * 0.6)
  }

  if (hintUsed) {
    rawBonus = Math.round(rawBonus * 0.7)
  }

  return applyDifficultyMultiplier(rawBonus, difficulty)
}

export const resolveComboProgress = ({
  currentCombo = 0,
  bestCombo = 0,
  comboBonusTotal = 0,
  difficulty = 'Lako',
  accepted = false,
  partialAccepted = false,
  hintUsed = false,
}) => {
  const safeCurrentCombo = Math.max(0, Number(currentCombo) || 0)
  const safeBestCombo = Math.max(0, Number(bestCombo) || 0)
  const safeComboBonusTotal = Math.max(0, Number(comboBonusTotal) || 0)

  if (!accepted && !partialAccepted) {
    return {
      comboStreak: 0,
      bestCombo: safeBestCombo,
      comboBonusTotal: safeComboBonusTotal,
      awardedComboBonus: 0,
    }
  }

  const nextCombo = safeCurrentCombo + 1
  const awardedComboBonus = calculateComboBonus({
    difficulty,
    comboStreak: nextCombo,
    partialAccepted,
    hintUsed,
  })

  return {
    comboStreak: nextCombo,
    bestCombo: Math.max(safeBestCombo, nextCombo),
    comboBonusTotal: safeComboBonusTotal + awardedComboBonus,
    awardedComboBonus,
  }
}

export const buildResultBadges = (result = {}) => {
  const total = normalizeNumber(result.total)
  const correct = normalizeNumber(result.correct)
  const accuracy = normalizeNumber(result.accuracy)
  const time = normalizeNumber(result.time)
  const hintCount = normalizeNumber(result.hintCount)
  const wrongAttempts = normalizeNumber(result.wrongAttempts)
  const awardedPoints = normalizeNumber(
    result.awardedPoints ?? result.earnedPoints ?? 0
  )
  const meaningfulAnswerCount = Array.isArray(result.answers)
    ? result.answers.filter((item) => {
        const answer = String(item?.answer || '').trim()
        return answer && answer !== '(bez odgovora)'
      }).length
    : 0
  const difficulty = result.difficulty || 'Lako'
  const type = result.type || 'association'
  const perRoundTime = total > 0 ? time / total : time
  const maxCombo = normalizeNumber(result.maxCombo)
  const currentStreak = normalizeNumber(result.progressSnapshot?.currentStreak)
  const newAchievements = Array.isArray(result.newAchievements) ? result.newAchievements : []
  const badges = []
  const completedAll = total > 0 && correct === total
  const flawlessRun = completedAll && accuracy === 100 && wrongAttempts === 0
  const hasAnyRealAttempt = meaningfulAnswerCount > 0 || wrongAttempts > 0 || correct > 0
  const hasPositiveResult = correct > 0 || awardedPoints > 0

  if (correct > 0 && perRoundTime > 0 && perRoundTime <= 18) {
    badges.push({ key: 'speed', label: 'Brzi mislilac', tone: 'sand' })
  }

  if (flawlessRun) {
    badges.push({ key: 'perfect', label: 'Nepogresiv', tone: 'green' })
  }

  if (correct > 0 && hintCount === 0) {
    badges.push({ key: 'clean', label: 'Bez pomoci', tone: 'blue' })
  }

  if (difficulty === 'Tesko' && hasPositiveResult) {
    badges.push({ key: 'hard', label: 'Teski igrac', tone: 'violet' })
  }

  if (result.isDaily && normalizeNumber(result.dailyReward) > 0) {
    badges.push({ key: 'daily', label: 'Daily heroj', tone: 'teal' })
  }

  if (awardedPoints >= 150) {
    badges.push({ key: 'xp', label: 'XP nalet', tone: 'gold' })
  }

  if (normalizeNumber(result.performanceBonus) >= 20 && accuracy >= 75 && wrongAttempts <= 1) {
    badges.push({ key: 'performance', label: 'Top forma', tone: 'violet' })
  }

  if (maxCombo >= 3) {
    badges.push({ key: 'combo', label: `Combo x${maxCombo}`, tone: 'red' })
  }

  if (currentStreak >= 3) {
    badges.push({ key: 'streak', label: `${currentStreak} dana u nizu`, tone: 'teal' })
  }

  if (newAchievements.length > 0) {
    badges.push({ key: 'unlock', label: 'Novo otkljucano', tone: 'gold' })
  }

  if ((type === 'logic' || type === 'logic-odd-one-out') && accuracy >= 75) {
    badges.push({ key: 'logic', label: 'Logicar', tone: 'blue' })
  }

  if (type === 'association' && correct >= Math.max(1, Math.ceil(total / 2))) {
    badges.push({ key: 'association', label: 'Asocijator', tone: 'sand' })
  }

  if (type === 'relation' && accuracy >= 75) {
    badges.push({ key: 'relation', label: 'Veza majstor', tone: 'teal' })
  }

  if (type === 'word-chain' && accuracy >= 80) {
    badges.push({ key: 'chain', label: 'Lanac majstor', tone: 'red' })
  }

  if (!badges.length) {
    badges.push({
      key: 'starter',
      label: hasAnyRealAttempt ? 'U zagrijavanju' : 'Probaj ponovo',
      tone: 'slate',
    })
  }

  return badges.slice(0, 6)
}
