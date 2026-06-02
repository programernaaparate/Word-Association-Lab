import { createSubmissionRequest, saveHistoryEntryRequest } from './api'
import {
  addGameHistory,
  addGameSubmission,
  getAuthToken,
  markDailyChallengeCompleted,
  saveCurrentUser,
  updateCurrentUserPoints,
} from './storage'

export const syncCompletedGame = async ({ historyEntry, submission }) => {
  const token = getAuthToken()
  const fallbackPoints = Math.max(
    0,
    Number(historyEntry?.awardedPoints ?? historyEntry?.earnedPoints ?? 0) || 0
  )
  const saveDailyCompletionLocally = (reward = 0) => {
    if (!historyEntry?.isDaily || Number(reward || 0) <= 0) {
      return
    }

    markDailyChallengeCompleted({
      dateKey: historyEntry.dailyDateKey,
      challengeId: historyEntry.dailyChallengeId || '',
    })
  }

  if (!token) {
    addGameHistory(historyEntry)

    if (submission) {
      addGameSubmission(submission)
    }

    const user = updateCurrentUserPoints(fallbackPoints)
    saveDailyCompletionLocally(historyEntry?.dailyReward)
    return {
      historyEntry,
      submission,
      user,
      synced: false,
    }
  }

  try {
    const historyResponse = await saveHistoryEntryRequest(token, historyEntry)
    const syncedHistoryEntry = historyResponse.history
      ? { ...historyEntry, ...historyResponse.history }
      : historyEntry

    addGameHistory(syncedHistoryEntry)

    let syncedSubmission = submission || null

    if (submission) {
      const syncedSubmissionPayload = {
        ...submission,
        points: Math.max(
          0,
          Number(
            syncedHistoryEntry.awardedPoints ??
              syncedHistoryEntry.earnedPoints ??
              submission.points ??
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

    addGameHistory(historyEntry)

    if (submission) {
      addGameSubmission(submission)
    }

    const user = updateCurrentUserPoints(fallbackPoints)
    saveDailyCompletionLocally(historyEntry?.dailyReward)

    return {
      historyEntry,
      submission,
      user,
      synced: false,
    }
  }
}
