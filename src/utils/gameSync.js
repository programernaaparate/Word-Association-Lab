import { createSubmissionRequest, saveHistoryEntryRequest } from './api'
import {
  addGameHistory,
  addGameSubmission,
  getAuthToken,
  getCurrentUser,
  getDailyChallengeCompletionState,
  markDailyChallengeCompleted,
  saveCurrentUser,
  updateCurrentUserPoints,
} from './storage'

const normalizeDailyReplayLocally = (historyEntry = {}) => {
  if (!historyEntry?.isDaily) {
    return historyEntry
  }

  const currentUser = getCurrentUser()
  const alreadyCompleted = getDailyChallengeCompletionState(
    historyEntry.dailyDateKey,
    currentUser?.id
  )

  if (!alreadyCompleted) {
    return historyEntry
  }

  return {
    ...historyEntry,
    earnedPoints: 0,
    awardedPoints: 0,
    performanceBonus: 0,
    comboBonus: 0,
    dailyReward: 0,
    dailyReplayBlocked: true,
  }
}

export const syncCompletedGame = async ({ historyEntry, submission }) => {
  const token = getAuthToken()
  const normalizedHistoryEntry = normalizeDailyReplayLocally(historyEntry)
  const fallbackPoints = Math.max(
    0,
    Number(
      normalizedHistoryEntry?.awardedPoints ??
        normalizedHistoryEntry?.earnedPoints ??
        0
    ) || 0
  )
  const saveDailyCompletionLocally = (reward = 0) => {
    if (!normalizedHistoryEntry?.isDaily || Number(reward || 0) <= 0) {
      return
    }

    markDailyChallengeCompleted({
      dateKey: normalizedHistoryEntry.dailyDateKey,
      challengeId: normalizedHistoryEntry.dailyChallengeId || '',
    })
  }

  const normalizedSubmission = submission
    ? {
        ...submission,
        points: fallbackPoints,
      }
    : null

  if (!token) {
    addGameHistory(normalizedHistoryEntry)

    if (normalizedSubmission) {
      addGameSubmission(normalizedSubmission)
    }

    const user = updateCurrentUserPoints(fallbackPoints)
    saveDailyCompletionLocally(normalizedHistoryEntry?.dailyReward)
    return {
      historyEntry: normalizedHistoryEntry,
      submission: normalizedSubmission,
      user,
      synced: false,
    }
  }

  try {
    const historyResponse = await saveHistoryEntryRequest(token, normalizedHistoryEntry)
    const syncedHistoryEntry = historyResponse.history
      ? { ...normalizedHistoryEntry, ...historyResponse.history }
      : normalizedHistoryEntry

    addGameHistory(syncedHistoryEntry)

    let syncedSubmission = normalizedSubmission || null

    if (normalizedSubmission) {
      const syncedSubmissionPayload = {
        ...normalizedSubmission,
        points: Math.max(
          0,
          Number(
            syncedHistoryEntry.awardedPoints ??
              syncedHistoryEntry.earnedPoints ??
              normalizedSubmission.points ??
              0
          ) || 0
        ),
      }
      const submissionResponse = await createSubmissionRequest(
        token,
        syncedSubmissionPayload
      )
      syncedSubmission = submissionResponse.item
        ? { ...syncedSubmissionPayload, ...submissionResponse.item }
        : syncedSubmissionPayload
      addGameSubmission(syncedSubmission)
    }

    if (historyResponse.user) {
      saveCurrentUser(historyResponse.user)
    }

    saveDailyCompletionLocally(
      historyResponse.history?.dailyReward ?? syncedHistoryEntry?.dailyReward
    )

    return {
      historyEntry: syncedHistoryEntry,
      submission: syncedSubmission,
      user: historyResponse.user || null,
      synced: true,
    }
  } catch (error) {
    console.error('Game sync failed:', error)

    addGameHistory(normalizedHistoryEntry)

    if (normalizedSubmission) {
      addGameSubmission(normalizedSubmission)
    }

    const user = updateCurrentUserPoints(fallbackPoints)
    saveDailyCompletionLocally(normalizedHistoryEntry?.dailyReward)

    return {
      historyEntry: normalizedHistoryEntry,
      submission: normalizedSubmission,
      user,
      synced: false,
    }
  }
}
