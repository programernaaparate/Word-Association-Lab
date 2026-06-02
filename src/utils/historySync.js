import {
  getCurrentUserGameHistory,
  getPlayerProgressOverview,
  saveGameHistory,
} from './storage'

const hasValue = (value) => value !== undefined && value !== null && value !== ''

const isNonEmptyArray = (value) => Array.isArray(value) && value.length > 0

export const getHistoryKey = (item = {}) => {
  if (item?.id) {
    return `history-${item.id}`
  }

  return [
    item?.type || '',
    item?.createdAt || '',
    item?.score || '',
    item?.total || '',
    item?.correct || '',
  ].join('-')
}

const mergeHistoryItem = (remoteItem = {}, localItem = {}) => {
  const mergedItem = {
    ...localItem,
    ...remoteItem,
  }

  if (!isNonEmptyArray(remoteItem.answers) && isNonEmptyArray(localItem.answers)) {
    mergedItem.answers = localItem.answers
  }

  ;[
    'comboBonus',
    'maxCombo',
    'performanceBonus',
    'wrongAttempts',
    'partialCount',
    'dailyChallengeId',
    'dailyDateKey',
    'dailyContentType',
    'dailyContentId',
    'dailySelectionDifficulty',
    'dailySelectionCategory',
  ].forEach((field) => {
    if (!hasValue(remoteItem[field]) && hasValue(localItem[field])) {
      mergedItem[field] = localItem[field]
    }
  })

  return mergedItem
}

export const mergeRemoteHistoryWithLocal = (remoteHistory = []) => {
  const localHistory = getCurrentUserGameHistory()
  const mergedMap = new Map()

  ;(remoteHistory || []).forEach((item) => {
    mergedMap.set(getHistoryKey(item), item)
  })

  localHistory.forEach((item) => {
    const itemKey = getHistoryKey(item)
    const existingItem = mergedMap.get(itemKey)

    mergedMap.set(
      itemKey,
      existingItem ? mergeHistoryItem(existingItem, item) : item
    )
  })

  return Array.from(mergedMap.values()).sort(
    (leftItem, rightItem) =>
      new Date(rightItem.createdAt || 0) - new Date(leftItem.createdAt || 0)
  )
}

const getHistoryPoints = (history = []) =>
  history.reduce(
    (sum, item) =>
      sum + Math.max(0, Number(item.awardedPoints ?? item.earnedPoints ?? 0) || 0),
    0
  )

export const buildHistorySummary = (history = [], remoteSummary = null) => {
  const overview = getPlayerProgressOverview(history)

  if (!remoteSummary) {
    return {
      ...overview,
      totalPoints: Math.max(overview.totalPoints, getHistoryPoints(history)),
    }
  }

  return {
    ...overview,
    ...remoteSummary,
    totalPoints: Math.max(0, Number(remoteSummary.totalPoints || 0)),
    bestScore: Math.max(
      Number(remoteSummary.bestScore || 0),
      Number(overview.bestScore || 0)
    ),
    bestCombo: Math.max(
      Number(remoteSummary.bestCombo || 0),
      Number(overview.bestCombo || 0)
    ),
    perfectRuns: Math.max(
      Number(remoteSummary.perfectRuns || 0),
      Number(overview.perfectRuns || 0)
    ),
  }
}

export const persistMergedHistory = (history = []) => {
  saveGameHistory(history)
}
