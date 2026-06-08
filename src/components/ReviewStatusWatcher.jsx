import { useEffect, useRef, useState } from 'react'
import AppIcon from './AppIcon'
import { getReviewSubmissionUpdatesRequest } from '../utils/api'
import {
  addGameHistory,
  applyReviewSubmissionDecisionLocally,
  getAuthToken,
  getCurrentUser,
  getGameHistory,
  syncStoredCurrentUser,
} from '../utils/storage'

const REVIEW_STATUS_POLL_MS = 5000

const buildToastPayload = (item = {}) => {
  const rewardPoints = Math.max(0, Number(item.rewardPoints || 0) || 0)
  const targetTitle = item.contentTitle || item.gameType || 'tvoj unos'
  const answerLabel = item.proposedAnswer ? `"${item.proposedAnswer}"` : 'Tvoj prijedlog'

  if (item.status === 'approved') {
    return {
      id: item.id,
      status: 'approved',
      icon: 'trophy',
      title: 'Vasa rijec je prihvacena',
      message:
        rewardPoints > 0
          ? `${answerLabel} za "${targetTitle}" je odobren. Dodato je +${rewardPoints} XP. Hvala!`
          : `${answerLabel} za "${targetTitle}" je odobren. Hvala!`,
    }
  }

  return {
    id: item.id,
    status: 'rejected',
    icon: 'close',
    title: 'Prijedlog nije prihvacen',
    message: `${answerLabel} za "${targetTitle}" nije prihvacen. XP nije dodat.`,
  }
}

function ReviewStatusWatcher() {
  const [toastQueue, setToastQueue] = useState([])
  const seenUpdateIdsRef = useRef(new Set())
  const token = getAuthToken()
  const currentUser = getCurrentUser()
  const activeToast = toastQueue[0] || null

  useEffect(() => {
    if (!token || !currentUser?.id) {
      return undefined
    }

    let isMounted = true

    const checkReviewUpdates = async () => {
      try {
        const response = await getReviewSubmissionUpdatesRequest(token)
        const items = Array.isArray(response.items) ? response.items : []

        if (!isMounted || !items.length) {
          if (response.user) {
            syncStoredCurrentUser(response.user)
          }
          return
        }

        if (response.user) {
          syncStoredCurrentUser(response.user)
        }

        const nextToasts = []

        items.forEach((item) => {
          if (seenUpdateIdsRef.current.has(`${item.id}-${item.status}`)) {
            return
          }

          seenUpdateIdsRef.current.add(`${item.id}-${item.status}`)
          applyReviewSubmissionDecisionLocally(item)

          if (item.status === 'approved' && item.rewardGranted && Number(item.rewardPoints || 0) > 0) {
            const localHistoryId = `review-reward-${item.id}`
            const alreadySaved = getGameHistory().some(
              (historyItem) => String(historyItem.id) === localHistoryId
            )

            if (!alreadySaved) {
              addGameHistory({
                id: localHistoryId,
                type: 'Provjera odgovora',
                score: Number(item.rewardPoints || 0),
                baseScore: Number(item.rewardPoints || 0),
                earnedPoints: Number(item.rewardPoints || 0),
                awardedPoints: Number(item.rewardPoints || 0),
                performanceBonus: 0,
                comboBonus: 0,
                maxCombo: 0,
                total: 1,
                correct: 1,
                accuracy: 100,
                timeSeconds: 0,
                category: item.contentSubtitle?.split('/')[0]?.trim() || null,
                difficulty: item.contentSubtitle?.split('/')[1]?.trim() || null,
                hintCount: 0,
                wrongAttempts: 0,
                partialCount: 0,
                isDaily: false,
                dailyReward: 0,
                createdAt: item.reviewedAt || new Date().toISOString(),
              })
            }
          }

          nextToasts.push(buildToastPayload(item))
        })

        if (nextToasts.length) {
          setToastQueue((prev) => [...prev, ...nextToasts])
        }
      } catch {
        // Tihi fail: app ne treba da prekida igraca ako privremeno nema mreze.
      }
    }

    checkReviewUpdates()
    const intervalId = window.setInterval(checkReviewUpdates, REVIEW_STATUS_POLL_MS)

    const handleFocus = () => {
      checkReviewUpdates()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkReviewUpdates()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [currentUser?.id, token])

  useEffect(() => {
    if (!activeToast) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setToastQueue((prev) => prev.slice(1))
    }, 5200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [activeToast])

  if (!activeToast) {
    return null
  }

  return (
    <div className={`submission-review-toast ${activeToast.status}`}>
      <div className="submission-review-toast-main">
        <div className="submission-review-toast-icon">
          <AppIcon name={activeToast.icon} size={18} />
        </div>

        <div className="submission-review-toast-text">
          <strong>{activeToast.title}</strong>
          <span>{activeToast.message}</span>
        </div>
      </div>

      <button
        className="submission-review-toast-close"
        type="button"
        onClick={() => setToastQueue((prev) => prev.slice(1))}
        aria-label="Zatvori obavjestenje"
      >
        <AppIcon name="close" size={14} />
      </button>
    </div>
  )
}

export default ReviewStatusWatcher
