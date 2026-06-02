import { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import {
  clearAdminDailyRequest,
  createAdminContentRequest,
  deleteAdminContentRequest,
  getAdminContentRequest,
  getAdminDailyRequest,
  getAdminDashboardRequest,
  getAdminSubmissionsRequest,
  getAdminUsersRequest,
  resetAdminUserProgressRequest,
  setAdminDailyRequest,
  updateAdminContentRequest,
  updateAdminSubmissionStatusRequest,
  updateAdminUserRequest,
} from '../utils/api'
import { getAuthToken } from '../utils/storage'

const AUTO_REFRESH_MS = 12000
const categories = [
  'Priroda',
  'Nauka',
  'Umjetnost',
  'Sport',
  'Film',
  'Istorija',
  'Tehnologija',
  'Geografija',
]
const contentTabs = ['association', 'logic', 'relation']
const moderationTabs = [
  { id: 'attention', label: 'Za odluku' },
  { id: 'answer_review', label: 'Odgovori' },
  { id: 'flagged', label: 'Oznaceni' },
  { id: 'audit', label: 'Arhiva partija' },
  { id: 'all', label: 'Sve' },
]

const parseList = (value = '') =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const getContentKindLabel = (kind) => {
  if (kind === 'association') return 'Asocijacija'
  if (kind === 'logic') return 'Logika'
  if (kind === 'relation') return 'Relacija'
  return 'Sadrzaj'
}

const getSubmissionKindLabel = (submissionKind) => {
  if (submissionKind === 'answer_review') return 'Provjera odgovora'
  return 'Partija'
}

const getStatusLabel = (status) => {
  if (status === 'approved') return 'Odobreno'
  if (status === 'flagged') return 'Pregled'
  return 'Novo'
}

const getSubmissionCreatedAt = (item = {}) => {
  const timestamp = new Date(item?.createdAt || 0).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

const getSubmissionPriorityTone = (item = {}) => {
  if (item?.submissionKind === 'answer_review') return 'answer'
  if (item?.status === 'flagged') return 'flagged'
  return 'pending'
}

const getSubmissionPriorityRank = (item = {}) => {
  if (item?.submissionKind === 'answer_review') return 3
  if (item?.status === 'flagged') return 2
  if (item?.contentTarget || item?.requestedAction) return 1
  return 0
}

const getSubmissionPriorityLabel = (item = {}) => {
  if (item?.submissionKind === 'answer_review') return 'Trazi novi odgovor'
  if (item?.status === 'flagged') return 'Oznaceno za pregled'
  if (item?.contentTarget || item?.requestedAction) return 'Trazi pregled unosa'
  return 'Novo za provjeru'
}

const isAttentionSubmission = (item = {}) => getSubmissionPriorityRank(item) > 0

const formatDateTime = (value) => {
  if (!value) return 'Bez datuma'

  return new Intl.DateTimeFormat('sr-Latn-ME', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const formatRelativeTime = (value) => {
  if (!value) return 'upravo sada'

  const diffMs = new Date(value).getTime() - Date.now()
  const diffMinutes = Math.round(diffMs / 60000)
  const formatter = new Intl.RelativeTimeFormat('sr-Latn-ME', { numeric: 'auto' })

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, 'minute')
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, 'hour')
  }

  const diffDays = Math.round(diffHours / 24)
  return formatter.format(diffDays, 'day')
}

const getContentKey = (item) => `${item.kind}:${item.id}`

const getDailyMatch = (dailyOverride, item) =>
  Boolean(
    dailyOverride &&
      item &&
      dailyOverride.type === item.kind &&
      Number(dailyOverride.contentId) === Number(item.id)
  )

const getEmptyCreateForm = (kind) => {
  if (kind === 'logic') {
    return {
      mode: 'concept',
      wordsText: '',
      answer: '',
      hint: '',
      category: 'Priroda',
      difficulty: 'Lako',
    }
  }

  if (kind === 'relation') {
    return {
      leftWord: '',
      rightWord: '',
      relation: 'Sinonim',
      hint: '',
      category: 'Priroda',
      difficulty: 'Lako',
    }
  }

  return {
    word: '',
    symbol: '',
    cluesText: '',
    acceptedAnswersText: '',
    hint: '',
    category: 'Priroda',
    difficulty: 'Lako',
  }
}

const buildContentDraft = (item) => {
  if (!item) {
    return null
  }

  if (item.kind === 'logic') {
    return {
      ...item,
      wordsText: (item.words || []).join(', '),
    }
  }

  if (item.kind === 'relation') {
    return { ...item }
  }

  return {
    ...item,
    cluesText: (item.clues || []).join(', '),
    acceptedAnswersText: (item.acceptedAnswers || []).join(', '),
  }
}

const buildContentItems = ({ associationWords, logicChallenges, relationChallenges, kind, searchQuery }) => {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const rawItems =
    kind === 'association'
      ? (associationWords || []).map((item) => ({
          ...item,
          kind: 'association',
          title: item.symbol ? `${item.symbol} ${item.word}` : item.word,
          subtitle: `${item.category} / ${item.difficulty}`,
          preview: (item.clues || []).join(', '),
        }))
      : kind === 'logic'
        ? (logicChallenges || []).map((item) => ({
            ...item,
            kind: 'logic',
            title: item.answer,
            subtitle: `${item.mode === 'odd-one-out' ? 'Ne pripada' : 'Koncept'} / ${item.category} / ${item.difficulty}`,
            preview: (item.words || []).join(', '),
          }))
        : (relationChallenges || []).map((item) => ({
            ...item,
            kind: 'relation',
            title: `${item.leftWord} / ${item.rightWord}`,
            subtitle: `${item.relation} / ${item.category} / ${item.difficulty}`,
            preview: item.hint || '',
          }))

  return rawItems.filter((item) => {
    if (!normalizedQuery) {
      return true
    }

    return [
      item.title,
      item.subtitle,
      item.preview,
      item.hint,
      ...(item.acceptedAnswers || []),
      ...(item.clues || []),
      ...(item.words || []),
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)
  })
}

function AdminPage() {
  const token = getAuthToken()
  const [contentFilter, setContentFilter] = useState('association')
  const [contentSearch, setContentSearch] = useState('')
  const [moderationFilter, setModerationFilter] = useState('attention')
  const [moderationSearch, setModerationSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [createType, setCreateType] = useState('association')
  const [createForms, setCreateForms] = useState(() => ({
    association: getEmptyCreateForm('association'),
    logic: getEmptyCreateForm('logic'),
    relation: getEmptyCreateForm('relation'),
  }))
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null)
  const [selectedContentKey, setSelectedContentKey] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [contentDraft, setContentDraft] = useState(null)
  const [contentDirty, setContentDirty] = useState(false)
  const [userDraft, setUserDraft] = useState(null)
  const [userDirty, setUserDirty] = useState(false)
  const [associationWords, setAssociationWords] = useState([])
  const [logicChallenges, setLogicChallenges] = useState([])
  const [relationChallenges, setRelationChallenges] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [dailyOverride, setDailyOverride] = useState(null)
  const [stats, setStats] = useState({
    totalWords: 0,
    activeGames: 0,
    pendingSubmissions: 0,
    flaggedSubmissions: 0,
  })
  const [isLiveMode, setIsLiveMode] = useState(true)
  const [isLoading, setIsLoading] = useState(Boolean(token))
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState('')
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const hasLoadedAdminData = useRef(false)

  useEffect(() => {
    if (!token || !isLiveMode) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setRefreshKey((prev) => prev + 1)
    }, AUTO_REFRESH_MS)

    return () => window.clearInterval(intervalId)
  }, [isLiveMode, token])

  useEffect(() => {
    let isMounted = true

    const loadAdminData = async () => {
      if (!token) {
        return
      }

      try {
        if (!hasLoadedAdminData.current) {
          setIsLoading(true)
        } else {
          setIsRefreshing(true)
        }
        setError('')

        const [
          dashboardResponse,
          submissionsResponse,
          dailyResponse,
          associationResponse,
          logicResponse,
          relationResponse,
          usersResponse,
        ] = await Promise.all([
          getAdminDashboardRequest(token),
          getAdminSubmissionsRequest(token, {}),
          getAdminDailyRequest(token, {}),
          getAdminContentRequest(token, 'association'),
          getAdminContentRequest(token, 'logic'),
          getAdminContentRequest(token, 'relation'),
          getAdminUsersRequest(token),
        ])

        if (!isMounted) {
          return
        }

        setStats(dashboardResponse)
        setSubmissions(submissionsResponse.items || [])
        setDailyOverride(dailyResponse.override || null)
        setAssociationWords(associationResponse.items || [])
        setLogicChallenges(logicResponse.items || [])
        setRelationChallenges(relationResponse.items || [])
        setAdminUsers(usersResponse.items || [])
        setLastUpdatedAt(new Date().toISOString())
        hasLoadedAdminData.current = true
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        setError(requestError.message)
      } finally {
        if (isMounted) {
          setIsLoading(false)
          setIsRefreshing(false)
        }
      }
    }

    loadAdminData()

    return () => {
      isMounted = false
    }
  }, [refreshKey, token])

  const moderationItems = useMemo(() => {
    const normalizedQuery = moderationSearch.trim().toLowerCase()

    return (submissions || [])
      .filter((item) => item.status !== 'approved')
      .filter((item) => {
        if (moderationFilter === 'attention') {
          return isAttentionSubmission(item)
        }

        if (moderationFilter === 'pending') {
          return item.status === 'pending'
        }

        if (moderationFilter === 'flagged') {
          return item.status === 'flagged'
        }

        if (moderationFilter === 'answer_review') {
          return item.submissionKind === 'answer_review'
        }

        if (moderationFilter === 'audit') {
          return !isAttentionSubmission(item)
        }

        return true
      })
      .filter((item) => {
        if (!normalizedQuery) {
          return true
        }

        return [
          item.user,
          item.type,
          item.proposedAnswer,
          item.requestedAction,
          item.content,
          item.contentTarget?.title,
          item.contentTarget?.subtitle,
          ...(item.contentLines || []),
          ...(item.contentTarget?.acceptedAnswers || []),
          ...(item.contentTarget?.clues || []),
          ...(item.contentTarget?.words || []),
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      })
      .sort((leftItem, rightItem) => {
        const priorityDiff =
          getSubmissionPriorityRank(rightItem) - getSubmissionPriorityRank(leftItem)

        if (priorityDiff !== 0) {
          return priorityDiff
        }

        const createdAtDiff =
          getSubmissionCreatedAt(rightItem) - getSubmissionCreatedAt(leftItem)

        if (createdAtDiff !== 0) {
          return createdAtDiff
        }

        return Number(rightItem.id || 0) - Number(leftItem.id || 0)
      })
  }, [moderationFilter, moderationSearch, submissions])

  const selectedSubmission =
    moderationItems.find((item) => item.id === selectedSubmissionId) || moderationItems[0] || null

  useEffect(() => {
    if (!moderationItems.length) {
      setSelectedSubmissionId(null)
      return
    }

    if (!moderationItems.some((item) => item.id === selectedSubmissionId)) {
      setSelectedSubmissionId(moderationItems[0].id)
    }
  }, [moderationItems, selectedSubmissionId])

  const contentItems = useMemo(
    () =>
      buildContentItems({
        associationWords,
        logicChallenges,
        relationChallenges,
        kind: contentFilter,
        searchQuery: contentSearch,
      }),
    [associationWords, contentFilter, contentSearch, logicChallenges, relationChallenges]
  )

  const selectedContentItem =
    contentItems.find((item) => getContentKey(item) === selectedContentKey) || contentItems[0] || null

  useEffect(() => {
    if (!contentItems.length) {
      setSelectedContentKey('')
      return
    }

    if (!contentItems.some((item) => getContentKey(item) === selectedContentKey)) {
      setSelectedContentKey(getContentKey(contentItems[0]))
    }
  }, [contentItems, selectedContentKey])

  useEffect(() => {
    if (!selectedContentItem) {
      setContentDraft(null)
      setContentDirty(false)
      return
    }

    const isSameDraftSelection =
      contentDraft?.id === selectedContentItem.id &&
      contentDraft?.kind === selectedContentItem.kind

    if (contentDirty && isSameDraftSelection) {
      return
    }

    setContentDraft(buildContentDraft(selectedContentItem))
    setContentDirty(false)
  }, [contentDirty, contentDraft?.id, contentDraft?.kind, selectedContentItem])

  const filteredUsers = useMemo(() => {
    const normalizedQuery = userSearch.trim().toLowerCase()

    return (adminUsers || []).filter((item) => {
      if (!normalizedQuery) {
        return true
      }

      return [item.username, item.points, item.level, item.totalGames]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [adminUsers, userSearch])

  const selectedUser =
    filteredUsers.find((item) => item.id === selectedUserId) || filteredUsers[0] || null

  useEffect(() => {
    if (!filteredUsers.length) {
      setSelectedUserId(null)
      return
    }

    if (!filteredUsers.some((item) => item.id === selectedUserId)) {
      setSelectedUserId(filteredUsers[0].id)
    }
  }, [filteredUsers, selectedUserId])

  useEffect(() => {
    if (!selectedUser) {
      setUserDraft(null)
      setUserDirty(false)
      return
    }

    if (userDirty && userDraft?.id === selectedUser.id) {
      return
    }

    setUserDraft({
      id: selectedUser.id,
      username: selectedUser.username,
      password: '',
    })
    setUserDirty(false)
  }, [selectedUser, userDirty, userDraft?.id])

  const pendingAnswerReviewCount = useMemo(
    () =>
      (submissions || []).filter(
        (item) => item.status !== 'approved' && item.submissionKind === 'answer_review'
      ).length,
    [submissions]
  )

  const attentionSubmissionCount = useMemo(
    () =>
      (submissions || []).filter(
        (item) => item.status !== 'approved' && isAttentionSubmission(item)
      ).length,
    [submissions]
  )

  const archivedSubmissionCount = useMemo(
    () =>
      (submissions || []).filter(
        (item) => item.status !== 'approved' && !isAttentionSubmission(item)
      ).length,
    [submissions]
  )

  const moderationCounts = useMemo(
    () => ({
      pending: (submissions || []).filter((item) => item.status === 'pending').length,
      flagged: (submissions || []).filter((item) => item.status === 'flagged').length,
      answerReview: pendingAnswerReviewCount,
      attention: attentionSubmissionCount,
      archived: archivedSubmissionCount,
    }),
    [archivedSubmissionCount, attentionSubmissionCount, pendingAnswerReviewCount, submissions]
  )

  const currentCreateForm = createForms[createType]
  const isSelectedContentDaily = getDailyMatch(dailyOverride, selectedContentItem)

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const updateCreateFormField = (field, value) => {
    setCreateForms((prev) => ({
      ...prev,
      [createType]: {
        ...prev[createType],
        [field]: value,
      },
    }))
  }

  const updateContentDraftField = (field, value) => {
    setContentDraft((prev) => (prev ? { ...prev, [field]: value } : prev))
    setContentDirty(true)
  }

  const updateUserDraftField = (field, value) => {
    setUserDraft((prev) => (prev ? { ...prev, [field]: value } : prev))
    setUserDirty(true)
  }

  const handleCreateContent = async () => {
    if (!token) {
      return
    }

    try {
      setError('')

      if (createType === 'association') {
        const nextWord = currentCreateForm.word.trim()
        const nextClues = parseList(currentCreateForm.cluesText)

        if (!nextWord || nextClues.length < 2) {
          setError('Unesi rjesenje i makar dva traga za asocijaciju.')
          return
        }

        await createAdminContentRequest(token, 'association', {
          word: nextWord,
          symbol: currentCreateForm.symbol.trim(),
          clues: nextClues.slice(0, 4),
          acceptedAnswers: [nextWord, ...parseList(currentCreateForm.acceptedAnswersText)],
          hint:
            currentCreateForm.hint.trim() ||
            `Pomisli na pojam ${nextWord.toLowerCase()}.`,
          category: currentCreateForm.category,
          difficulty: currentCreateForm.difficulty,
        })
      } else if (createType === 'logic') {
        const nextWords = parseList(currentCreateForm.wordsText)
        const nextAnswer = currentCreateForm.answer.trim()

        if (!nextAnswer || nextWords.length < 2) {
          setError('Logicki izazov trazi odgovor i makar dva pojma.')
          return
        }

        await createAdminContentRequest(token, 'logic', {
          mode: currentCreateForm.mode,
          words: nextWords,
          answer: nextAnswer,
          hint:
            currentCreateForm.hint.trim() ||
            'Pokusaj da pronadjes zajednicku osobinu.',
          category: currentCreateForm.category,
          difficulty: currentCreateForm.difficulty,
        })
      } else {
        const leftWord = currentCreateForm.leftWord.trim()
        const rightWord = currentCreateForm.rightWord.trim()

        if (!leftWord || !rightWord) {
          setError('Relacija mora imati obje rijeci.')
          return
        }

        await createAdminContentRequest(token, 'relation', {
          leftWord,
          rightWord,
          relation: currentCreateForm.relation,
          hint:
            currentCreateForm.hint.trim() ||
            'Pomisli kakav odnos imaju ova dva pojma.',
          category: currentCreateForm.category,
          difficulty: currentCreateForm.difficulty,
        })
      }

      setCreateForms((prev) => ({
        ...prev,
        [createType]: getEmptyCreateForm(createType),
      }))
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleSaveSelectedContent = async () => {
    if (!token || !contentDraft) {
      return
    }

    try {
      setError('')

      if (contentDraft.kind === 'association') {
        const nextWord = String(contentDraft.word || '').trim()
        const nextClues = parseList(contentDraft.cluesText)

        if (!nextWord || nextClues.length < 2) {
          setError('Asocijacija mora imati rjesenje i makar dva traga.')
          return
        }

        await updateAdminContentRequest(token, 'association', contentDraft.id, {
          word: nextWord,
          symbol: String(contentDraft.symbol || '').trim(),
          clues: nextClues.slice(0, 4),
          acceptedAnswers: [nextWord, ...parseList(contentDraft.acceptedAnswersText)],
          hint:
            String(contentDraft.hint || '').trim() ||
            `Pomisli na pojam ${nextWord.toLowerCase()}.`,
          category: contentDraft.category,
          difficulty: contentDraft.difficulty,
        })
      } else if (contentDraft.kind === 'logic') {
        const nextWords = parseList(contentDraft.wordsText)
        const nextAnswer = String(contentDraft.answer || '').trim()

        if (!nextAnswer || nextWords.length < 2) {
          setError('Logicki izazov mora imati odgovor i makar dva pojma.')
          return
        }

        await updateAdminContentRequest(token, 'logic', contentDraft.id, {
          mode: contentDraft.mode,
          words: nextWords,
          answer: nextAnswer,
          hint:
            String(contentDraft.hint || '').trim() ||
            'Pokusaj da pronadjes zajednicku osobinu.',
          category: contentDraft.category,
          difficulty: contentDraft.difficulty,
        })
      } else {
        const leftWord = String(contentDraft.leftWord || '').trim()
        const rightWord = String(contentDraft.rightWord || '').trim()

        if (!leftWord || !rightWord) {
          setError('Relacija mora imati obje rijeci.')
          return
        }

        await updateAdminContentRequest(token, 'relation', contentDraft.id, {
          leftWord,
          rightWord,
          relation: contentDraft.relation,
          hint:
            String(contentDraft.hint || '').trim() ||
            'Pomisli kakav odnos imaju ova dva pojma.',
          category: contentDraft.category,
          difficulty: contentDraft.difficulty,
        })
      }

      setContentDirty(false)
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleDeleteSelectedContent = async () => {
    if (!token || !selectedContentItem) {
      return
    }

    const confirmationMessage = isSelectedContentDaily
      ? `Da li sigurno zelis da obrises "${selectedContentItem.title}"? Ovaj unos je trenutni dnevni izazov i bice uklonjen iz dnevnog izbora.`
      : `Da li sigurno zelis da obrises "${selectedContentItem.title}"?`

    if (!window.confirm(confirmationMessage)) {
      return
    }

    try {
      setError('')
      await deleteAdminContentRequest(token, selectedContentItem.kind, selectedContentItem.id)
      setContentDirty(false)
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleToggleDaily = async () => {
    if (!token || !selectedContentItem) {
      return
    }

    try {
      setError('')

      if (isSelectedContentDaily) {
        await clearAdminDailyRequest(token, {})
      } else {
        await setAdminDailyRequest(token, {
          type: selectedContentItem.kind,
          contentId: selectedContentItem.id,
        })
      }

      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleClearDailyOverride = async () => {
    if (!token || !dailyOverride) {
      return
    }

    try {
      setError('')
      await clearAdminDailyRequest(token, {})
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleSubmissionStatus = async (submissionId, status) => {
    if (!token || !submissionId) {
      return
    }

    try {
      setError('')
      await updateAdminSubmissionStatusRequest(token, submissionId, status)
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleOpenSubmissionTarget = (submission) => {
    if (!submission?.contentType || !submission?.contentItemId) {
      return
    }

    setContentFilter(submission.contentType)
    setSelectedContentKey(`${submission.contentType}:${submission.contentItemId}`)
  }

  const handleSaveUser = async () => {
    const cleanUsername = String(userDraft?.username || '').trim()

    if (!token || !userDraft?.id || !cleanUsername) {
      setError('Korisnicko ime je obavezno.')
      return
    }

    try {
      setError('')
      await updateAdminUserRequest(token, userDraft.id, {
        username: cleanUsername,
        password: userDraft.password,
      })
      setUserDirty(false)
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleResetUserProgress = async () => {
    if (!token || !selectedUser?.id) {
      return
    }

    if (
      !window.confirm(
        `Da li sigurno zelis da resetujes XP i istoriju za korisnika ${selectedUser.username}?`
      )
    ) {
      return
    }

    try {
      setError('')
      await resetAdminUserProgressRequest(token, selectedUser.id)
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const renderCreateForm = () => {
    if (createType === 'logic') {
      return (
        <>
          <div className="two-col">
            <div>
              <label htmlFor="admin-create-logic-mode">Mod</label>
              <select
                id="admin-create-logic-mode"
                className="styled-select"
                value={currentCreateForm.mode}
                onChange={(event) => updateCreateFormField('mode', event.target.value)}
              >
                <option value="concept">Koncept</option>
                <option value="odd-one-out">Ne pripada</option>
              </select>
            </div>

            <div>
              <label htmlFor="admin-create-logic-category">Kategorija</label>
              <select
                id="admin-create-logic-category"
                className="styled-select"
                value={currentCreateForm.category}
                onChange={(event) => updateCreateFormField('category', event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="two-col">
            <div>
              <label htmlFor="admin-create-logic-difficulty">Tezina</label>
              <select
                id="admin-create-logic-difficulty"
                className="styled-select"
                value={currentCreateForm.difficulty}
                onChange={(event) => updateCreateFormField('difficulty', event.target.value)}
              >
                <option>Lako</option>
                <option>Srednje</option>
                <option>Tesko</option>
              </select>
            </div>

            <div>
              <label htmlFor="admin-create-logic-answer">Odgovor</label>
              <input
                id="admin-create-logic-answer"
                type="text"
                value={currentCreateForm.answer}
                onChange={(event) => updateCreateFormField('answer', event.target.value)}
              />
            </div>
          </div>

          <label htmlFor="admin-create-logic-words">Pojmovi</label>
          <textarea
            id="admin-create-logic-words"
            className="admin-textarea"
            value={currentCreateForm.wordsText}
            onChange={(event) => updateCreateFormField('wordsText', event.target.value)}
            placeholder="Prica, Kratak opis, Radnja"
          />

          <label htmlFor="admin-create-logic-hint">Pomoc</label>
          <textarea
            id="admin-create-logic-hint"
            className="admin-textarea"
            value={currentCreateForm.hint}
            onChange={(event) => updateCreateFormField('hint', event.target.value)}
            placeholder="Pokusaj da pronadjes zajednicku osobinu."
          />
        </>
      )
    }

    if (createType === 'relation') {
      return (
        <>
          <div className="two-col">
            <div>
              <label htmlFor="admin-create-relation-left">Prva rijec</label>
              <input
                id="admin-create-relation-left"
                type="text"
                value={currentCreateForm.leftWord}
                onChange={(event) => updateCreateFormField('leftWord', event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="admin-create-relation-right">Druga rijec</label>
              <input
                id="admin-create-relation-right"
                type="text"
                value={currentCreateForm.rightWord}
                onChange={(event) => updateCreateFormField('rightWord', event.target.value)}
              />
            </div>
          </div>

          <div className="two-col">
            <div>
              <label htmlFor="admin-create-relation-type">Relacija</label>
              <select
                id="admin-create-relation-type"
                className="styled-select"
                value={currentCreateForm.relation}
                onChange={(event) => updateCreateFormField('relation', event.target.value)}
              >
                <option>Sinonim</option>
                <option>Antonim</option>
                <option>Asocijacija</option>
              </select>
            </div>

            <div>
              <label htmlFor="admin-create-relation-category">Kategorija</label>
              <select
                id="admin-create-relation-category"
                className="styled-select"
                value={currentCreateForm.category}
                onChange={(event) => updateCreateFormField('category', event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="two-col">
            <div>
              <label htmlFor="admin-create-relation-difficulty">Tezina</label>
              <select
                id="admin-create-relation-difficulty"
                className="styled-select"
                value={currentCreateForm.difficulty}
                onChange={(event) => updateCreateFormField('difficulty', event.target.value)}
              >
                <option>Lako</option>
                <option>Srednje</option>
                <option>Tesko</option>
              </select>
            </div>

            <div>
              <label htmlFor="admin-create-relation-hint">Pomoc</label>
              <input
                id="admin-create-relation-hint"
                type="text"
                value={currentCreateForm.hint}
                onChange={(event) => updateCreateFormField('hint', event.target.value)}
                placeholder="Pomisli kakav odnos imaju ova dva pojma."
              />
            </div>
          </div>
        </>
      )
    }

    return (
      <>
        <div className="two-col">
          <div>
            <label htmlFor="admin-create-word">Rjesenje</label>
            <input
              id="admin-create-word"
              type="text"
              value={currentCreateForm.word}
              onChange={(event) => updateCreateFormField('word', event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="admin-create-symbol">Simbol</label>
            <input
              id="admin-create-symbol"
              type="text"
              value={currentCreateForm.symbol}
              onChange={(event) => updateCreateFormField('symbol', event.target.value)}
              placeholder="☀️ ili 🌊"
            />
          </div>
        </div>

        <label htmlFor="admin-create-clues">Tragovi</label>
        <textarea
          id="admin-create-clues"
          className="admin-textarea"
          value={currentCreateForm.cluesText}
          onChange={(event) => updateCreateFormField('cluesText', event.target.value)}
          placeholder="dan, toplota, svjetlost, ljeto"
        />

        <label htmlFor="admin-create-accepted">Prihvatljivi odgovori</label>
        <textarea
          id="admin-create-accepted"
          className="admin-textarea"
          value={currentCreateForm.acceptedAnswersText}
          onChange={(event) => updateCreateFormField('acceptedAnswersText', event.target.value)}
          placeholder="sunce, suncevo tijelo"
        />

        <label htmlFor="admin-create-hint">Pomoc</label>
        <textarea
          id="admin-create-hint"
          className="admin-textarea"
          value={currentCreateForm.hint}
          onChange={(event) => updateCreateFormField('hint', event.target.value)}
          placeholder="Pomisli na pojam sunce."
        />

        <div className="two-col">
          <div>
            <label htmlFor="admin-create-category">Kategorija</label>
            <select
              id="admin-create-category"
              className="styled-select"
              value={currentCreateForm.category}
              onChange={(event) => updateCreateFormField('category', event.target.value)}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="admin-create-difficulty">Tezina</label>
            <select
              id="admin-create-difficulty"
              className="styled-select"
              value={currentCreateForm.difficulty}
              onChange={(event) => updateCreateFormField('difficulty', event.target.value)}
            >
              <option>Lako</option>
              <option>Srednje</option>
              <option>Tesko</option>
            </select>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="screen app-screen">
      <div className="phone-card app-shell">
        <Navbar title="Administracija" showBack />

        <div className="page-content admin-page admin-workbench">
          {error ? <p className="error">{error}</p> : null}

          <section className="leaderboard-card admin-hero-panel">
            <div className="section-row">
              <div>
                <h2>Operativni pregled</h2>
                <p className="muted">
                  Moderacija, sadrzaj i korisnici na jednom mjestu, sa osvezavanjem uzivo.
                </p>
              </div>

              <div className="admin-hero-actions">
                <span className={`admin-live-badge ${isLiveMode ? 'active' : ''}`}>
                  {isLiveMode ? 'Osvezavanje ukljuceno' : 'Osvezavanje pauzirano'}
                </span>

                <button
                  className="admin-chip"
                  type="button"
                  onClick={() => setIsLiveMode((prev) => !prev)}
                >
                  {isLiveMode ? 'Pauziraj osvezavanje' : 'Ukljuci osvezavanje'}
                </button>

                <button className="admin-chip active" type="button" onClick={triggerRefresh}>
                  {isRefreshing ? 'Osvjezavam...' : 'Osvjezi sada'}
                </button>
              </div>
            </div>

            <div className="admin-hero-grid">
              <div className="admin-stats-strip">
                <div className="admin-stat-card-v2">
                  <small>ZA ODLUKU ADMINA</small>
                  <strong>{moderationCounts.attention}</strong>
                  <span>
                    {moderationCounts.answerReview} odgovora i {moderationCounts.flagged}{' '}
                    oznacenih stavki
                  </span>
                </div>

                <div className="admin-stat-card-v2 warn">
                  <small>ODGOVORI ZA DODAVANJE</small>
                  <strong>{pendingAnswerReviewCount}</strong>
                  <span>prijedlozi novih validnih rijeci</span>
                </div>

                <div className="admin-stat-card-v2">
                  <small>OZNACENI</small>
                  <strong>{stats.flaggedSubmissions}</strong>
                  <span>potreban dodatni pregled</span>
                </div>

                <div className="admin-stat-card-v2 cool">
                  <small>ARHIVA PARTIJA</small>
                  <strong>{moderationCounts.archived}</strong>
                  <span>obicne partije su sacuvane, ali ne smetaju glavnom inboxu</span>
                </div>
              </div>

              <div className="admin-daily-spotlight">
                <div className="section-row">
                  <div>
                    <small className="link-text">DNEVNI IZAZOV</small>
                    <h3>{dailyOverride?.title || 'Automatski izbor'}</h3>
                  </div>

                  {lastUpdatedAt ? (
                    <span className="muted small-text">
                      Azurirano {formatRelativeTime(lastUpdatedAt)}
                    </span>
                  ) : null}
                </div>

                <p className="muted">
                  {dailyOverride
                    ? `${getContentKindLabel(dailyOverride.type)} / ${dailyOverride.item?.category || 'Bez kategorije'} / ${dailyOverride.item?.difficulty || 'Lako'}`
                    : 'Ako nista nije rucno postavljeno, sistem bira dnevni izazov automatski.'}
                </p>

                {dailyOverride ? (
                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={handleClearDailyOverride}
                  >
                    Vrati na automatski izbor
                  </button>
                ) : (
                  <p className="muted small-text">
                    Izaberi bilo koji unos ispod i klikni "Postavi za danas".
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="admin-grid-layout">
            <div className="admin-primary-column">
              <section className="leaderboard-card admin-review-shell">
                <div className="section-row">
                  <div>
                    <h2>Prijave za moderaciju</h2>
                    <p className="muted">
                      U prvom planu su samo stavke koje stvarno traze odluku admina.
                    </p>
                  </div>

                  <div className="admin-review-meta">
                    <span className="admin-mini-tag accent">Najnovije prvo</span>
                    <span className="admin-queue-count">
                      {moderationFilter === 'attention'
                        ? `${moderationItems.length} stavki za odluku`
                        : `${moderationItems.length} otvorenih stavki`}
                    </span>
                  </div>
                </div>

                <div className="admin-toolbar">
                  <div className="admin-pill-row">
                    {moderationTabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`admin-chip ${moderationFilter === tab.id ? 'active' : ''}`}
                        type="button"
                        onClick={() => setModerationFilter(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <input
                    className="admin-search-input"
                    type="search"
                    value={moderationSearch}
                    onChange={(event) => setModerationSearch(event.target.value)}
                    placeholder="Pretrazi korisnika, rijec ili pojam..."
                  />
                </div>

                <div className="admin-review-layout">
                  <div className="admin-review-list">
                    {isLoading ? (
                      <div className="page-loading-card">Ucitavamo moderaciju...</div>
                    ) : moderationItems.length > 0 ? (
                      moderationItems.map((item, index) => (
                        <button
                          key={item.id}
                          className={`admin-review-card ${
                            selectedSubmission?.id === item.id ? 'active' : ''
                          } ${getSubmissionPriorityTone(item)} ${index === 0 ? 'latest' : ''}`}
                          type="button"
                          onClick={() => setSelectedSubmissionId(item.id)}
                        >
                          <div className="admin-review-card-head">
                            <div className="moderation-avatar">
                              {String(item.user || 'K').charAt(0).toUpperCase()}
                            </div>

                            <div className="admin-review-card-copy">
                              <span className="content-kind-tag">
                                {getSubmissionKindLabel(item.submissionKind)}
                              </span>
                              <strong>{item.requestedAction || item.type}</strong>
                              <p>
                                {item.user} - {formatRelativeTime(item.createdAt)}
                              </p>
                            </div>

                            <div className="admin-review-card-side">
                              <span
                                className={`admin-priority-pill ${getSubmissionPriorityTone(item)}`}
                              >
                                {index === 0 ? 'Najnovije' : getSubmissionPriorityLabel(item)}
                              </span>
                              <span className={`admin-status-pill ${item.status}`}>
                                {getStatusLabel(item.status)}
                              </span>
                              <strong>{item.points} XP</strong>
                            </div>
                          </div>

                          <p className="admin-review-preview">
                            {item.proposedAnswer
                              ? `Predlozen odgovor: ${item.proposedAnswer}`
                              : item.contentLines?.[0] || item.content}
                          </p>

                          {item.contentTarget ? (
                            <div className="admin-tag-row">
                              <span className="admin-mini-tag">
                                {getContentKindLabel(item.contentType)}
                              </span>
                              <span className="admin-mini-tag muted">
                                {item.contentTarget.title}
                              </span>
                            </div>
                          ) : null}
                        </button>
                      ))
                    ) : (
                      <div className="empty-admin-state">
                        {moderationFilter === 'attention'
                          ? `Sve je u redu. Trenutno nema zahtjeva koji traze odluku admina. U arhivi je sacuvano ${moderationCounts.archived} obicnih partija.`
                          : 'Nema otvorenih prijava za izabrani filter.'}
                      </div>
                    )}
                  </div>

                  <div className="admin-detail-panel">
                    {selectedSubmission ? (
                      <>
                        <div className="section-row">
                          <div>
                            <span className="content-kind-tag">
                              {getSubmissionKindLabel(selectedSubmission.submissionKind)}
                            </span>
                            <h3>{selectedSubmission.requestedAction || selectedSubmission.type}</h3>
                            <p className="muted">
                              {selectedSubmission.user} - {formatDateTime(selectedSubmission.createdAt)}
                            </p>
                          </div>

                          <div className="admin-detail-actions">
                            <button
                              className="approve-btn"
                              type="button"
                              onClick={() => handleSubmissionStatus(selectedSubmission.id, 'approved')}
                            >
                              {selectedSubmission.submissionKind === 'answer_review'
                                ? 'Odobri odgovor'
                                : 'Odobri unos'}
                            </button>

                            <button
                              className="flag-btn"
                              type="button"
                              onClick={() =>
                                handleSubmissionStatus(
                                  selectedSubmission.id,
                                  selectedSubmission.status === 'flagged' ? 'pending' : 'flagged'
                                )
                              }
                            >
                              {selectedSubmission.status === 'flagged'
                                ? 'Vrati na cekanje'
                                : 'Oznaci za pregled'}
                            </button>

                            {selectedSubmission.contentTarget ? (
                              <button
                                className="secondary-btn"
                                type="button"
                                onClick={() => handleOpenSubmissionTarget(selectedSubmission)}
                              >
                                Otvori u editoru
                              </button>
                            ) : null}
                          </div>
                        </div>

                        <div
                          className={`admin-attention-banner ${getSubmissionPriorityTone(
                            selectedSubmission
                          )}`}
                        >
                          <small>PREGLEDAJ SADA</small>
                          <strong>{getSubmissionPriorityLabel(selectedSubmission)}</strong>
                          <p>
                            Stiglo {formatRelativeTime(selectedSubmission.createdAt)} i trenutno je
                            otvoreno za brzu odluku.
                          </p>
                        </div>

                        <div className="admin-detail-grid">
                          <div className="admin-detail-section">
                            <small>STA KORISNIK TRAZI</small>
                            <strong>
                              {selectedSubmission.requestedAction ||
                                'Potrebna je odluka admina za ovaj unos.'}
                            </strong>
                            <p className="muted small-text">
                              Tip: {selectedSubmission.type} - Bodovi: {selectedSubmission.points} XP
                            </p>
                            {selectedSubmission.proposedAnswer ? (
                              <div className="admin-tag-row">
                                <span className="admin-proposed-tag">
                                  {selectedSubmission.proposedAnswer}
                                </span>
                              </div>
                            ) : null}
                          </div>

                          <div className="admin-detail-section">
                            <small>CILJNI UNOS</small>
                            {selectedSubmission.contentTarget ? (
                              <>
                                <strong>{selectedSubmission.contentTarget.title}</strong>
                                <p>{selectedSubmission.contentTarget.subtitle}</p>
                                {selectedSubmission.contentTarget.symbol ? (
                                  <p className="muted small-text">
                                    Simbol: {selectedSubmission.contentTarget.symbol}
                                  </p>
                                ) : null}
                                {selectedSubmission.contentTarget.hint ? (
                                  <p className="muted small-text">
                                    Pomoc: {selectedSubmission.contentTarget.hint}
                                  </p>
                                ) : null}
                              </>
                            ) : (
                              <p className="muted">Ova prijava nema vezan sadrzaj za direktno uredjivanje.</p>
                            )}
                          </div>
                        </div>

                        {selectedSubmission.contentTarget?.clues?.length ? (
                          <div className="admin-detail-section">
                            <small>TRAGOVI</small>
                            <div className="admin-tag-row">
                              {selectedSubmission.contentTarget.clues.map((clue) => (
                                <span className="admin-mini-tag" key={clue}>
                                  {clue}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {selectedSubmission.contentTarget?.words?.length ? (
                          <div className="admin-detail-section">
                            <small>POJMOVI</small>
                            <div className="admin-tag-row">
                              {selectedSubmission.contentTarget.words.map((word) => (
                                <span className="admin-mini-tag" key={word}>
                                  {word}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {selectedSubmission.contentTarget?.acceptedAnswers?.length ? (
                          <div className="admin-detail-section">
                            <small>TRENUTNO PRIZNATI ODGOVORI</small>
                            <div className="admin-tag-row">
                              {selectedSubmission.contentTarget.acceptedAnswers.map((answer) => (
                                <span className="admin-mini-tag accent" key={answer}>
                                  {answer}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <div className="admin-detail-section">
                          <small>ORIGINALNI TEKST PRIJAVE</small>
                          <div className="admin-detail-list">
                            {(selectedSubmission.contentLines || [selectedSubmission.content]).map((line, index) => (
                              <div className="admin-detail-list-item" key={`${line}-${index}`}>
                                {line}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="empty-admin-state">
                        {moderationFilter === 'attention'
                          ? 'Sve je uredno. Nema aktivnih zahtjeva za odobravanje odgovora ili pregled sadrzaja.'
                          : 'Nema izabrane prijave. Klikni stavku sa lijeve strane.'}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="leaderboard-card admin-library-shell">
                <div className="section-row">
                  <div>
                    <h2>Biblioteka sadrzaja</h2>
                    <p className="muted">
                      Pregledaj, uredi, postavi za danas ili obrisi bilo koji unos.
                    </p>
                  </div>

                  <span className="admin-queue-count">{contentItems.length} rezultata</span>
                </div>

                <div className="admin-toolbar">
                  <div className="admin-pill-row">
                    {contentTabs.map((tab) => (
                      <button
                        key={tab}
                        className={`admin-chip ${contentFilter === tab ? 'active' : ''}`}
                        type="button"
                        onClick={() => setContentFilter(tab)}
                      >
                        {getContentKindLabel(tab)}
                      </button>
                    ))}
                  </div>

                  <input
                    className="admin-search-input"
                    type="search"
                    value={contentSearch}
                    onChange={(event) => setContentSearch(event.target.value)}
                    placeholder="Pretrazi naziv, trag, pomoc ili priznati odgovor..."
                  />
                </div>

                <div className="admin-content-layout">
                  <div className="admin-content-list">
                    {contentItems.length > 0 ? (
                      contentItems.map((item) => (
                        <button
                          key={getContentKey(item)}
                          className={`admin-content-card ${
                            selectedContentItem?.id === item.id &&
                            selectedContentItem?.kind === item.kind
                              ? 'active'
                              : ''
                          }`}
                          type="button"
                          onClick={() => {
                            setSelectedContentKey(getContentKey(item))
                            setContentDirty(false)
                          }}
                        >
                          <div className="admin-content-card-head">
                            <div>
                              <span className="content-kind-tag">
                                {getContentKindLabel(item.kind)}
                              </span>
                              {getDailyMatch(dailyOverride, item) ? (
                                <span className="content-daily-tag">Danasnji</span>
                              ) : null}
                              <strong>{item.title}</strong>
                              <p>{item.subtitle}</p>
                            </div>
                          </div>

                          <p className="admin-review-preview">{item.preview || item.hint || 'Bez opisa'}</p>
                        </button>
                      ))
                    ) : (
                      <div className="empty-admin-state">
                        Nema sadrzaja za izabranu kombinaciju tipa i pretrage.
                      </div>
                    )}
                  </div>

                  <div className="admin-detail-panel">
                    {contentDraft ? (
                      <>
                        <div className="section-row">
                          <div>
                            <span className="content-kind-tag">
                              {getContentKindLabel(contentDraft.kind)}
                            </span>
                            <h3>{selectedContentItem?.title}</h3>
                            <p className="muted">
                              {selectedContentItem?.subtitle}
                              {isSelectedContentDaily ? ' - Trenutni dnevni izazov' : ''}
                            </p>
                          </div>

                          <div className="admin-detail-actions">
                            <button className="approve-btn" type="button" onClick={handleSaveSelectedContent}>
                              Sacuvaj izmjene
                            </button>

                            <button className="secondary-btn" type="button" onClick={handleToggleDaily}>
                              {isSelectedContentDaily ? 'Vrati automatski izbor' : 'Postavi za danas'}
                            </button>

                            <button className="flag-btn" type="button" onClick={handleDeleteSelectedContent}>
                              Obrisi unos
                            </button>
                          </div>
                        </div>

                        {contentDraft.kind === 'association' ? (
                          <>
                            <div className="two-col">
                              <div>
                                <label htmlFor="admin-edit-word">Rjesenje</label>
                                <input
                                  id="admin-edit-word"
                                  type="text"
                                  value={contentDraft.word || ''}
                                  onChange={(event) => updateContentDraftField('word', event.target.value)}
                                />
                              </div>

                              <div>
                                <label htmlFor="admin-edit-symbol">Simbol</label>
                                <input
                                  id="admin-edit-symbol"
                                  type="text"
                                  value={contentDraft.symbol || ''}
                                  onChange={(event) => updateContentDraftField('symbol', event.target.value)}
                                />
                              </div>
                            </div>

                            <label htmlFor="admin-edit-clues">Tragovi</label>
                            <textarea
                              id="admin-edit-clues"
                              className="admin-textarea"
                              value={contentDraft.cluesText || ''}
                              onChange={(event) => updateContentDraftField('cluesText', event.target.value)}
                            />

                            <label htmlFor="admin-edit-accepted">Prihvatljivi odgovori</label>
                            <textarea
                              id="admin-edit-accepted"
                              className="admin-textarea"
                              value={contentDraft.acceptedAnswersText || ''}
                              onChange={(event) =>
                                updateContentDraftField('acceptedAnswersText', event.target.value)
                              }
                            />

                            <div className="admin-tag-row">
                              {parseList(contentDraft.acceptedAnswersText || '').map((answer) => (
                                <span className="admin-mini-tag accent" key={answer}>
                                  {answer}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : null}

                        {contentDraft.kind === 'logic' ? (
                          <>
                            <div className="two-col">
                              <div>
                                <label htmlFor="admin-edit-logic-mode">Mod</label>
                                <select
                                  id="admin-edit-logic-mode"
                                  className="styled-select"
                                  value={contentDraft.mode || 'concept'}
                                  onChange={(event) => updateContentDraftField('mode', event.target.value)}
                                >
                                  <option value="concept">Koncept</option>
                                  <option value="odd-one-out">Ne pripada</option>
                                </select>
                              </div>

                              <div>
                                <label htmlFor="admin-edit-logic-answer">Odgovor</label>
                                <input
                                  id="admin-edit-logic-answer"
                                  type="text"
                                  value={contentDraft.answer || ''}
                                  onChange={(event) => updateContentDraftField('answer', event.target.value)}
                                />
                              </div>
                            </div>

                            <label htmlFor="admin-edit-logic-words">Pojmovi</label>
                            <textarea
                              id="admin-edit-logic-words"
                              className="admin-textarea"
                              value={contentDraft.wordsText || ''}
                              onChange={(event) => updateContentDraftField('wordsText', event.target.value)}
                            />
                          </>
                        ) : null}

                        {contentDraft.kind === 'relation' ? (
                          <>
                            <div className="two-col">
                              <div>
                                <label htmlFor="admin-edit-left">Prva rijec</label>
                                <input
                                  id="admin-edit-left"
                                  type="text"
                                  value={contentDraft.leftWord || ''}
                                  onChange={(event) =>
                                    updateContentDraftField('leftWord', event.target.value)
                                  }
                                />
                              </div>

                              <div>
                                <label htmlFor="admin-edit-right">Druga rijec</label>
                                <input
                                  id="admin-edit-right"
                                  type="text"
                                  value={contentDraft.rightWord || ''}
                                  onChange={(event) =>
                                    updateContentDraftField('rightWord', event.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <label htmlFor="admin-edit-relation">Relacija</label>
                            <select
                              id="admin-edit-relation"
                              className="styled-select"
                              value={contentDraft.relation || 'Sinonim'}
                              onChange={(event) =>
                                updateContentDraftField('relation', event.target.value)
                              }
                            >
                              <option>Sinonim</option>
                              <option>Antonim</option>
                              <option>Asocijacija</option>
                            </select>
                          </>
                        ) : null}

                        <label htmlFor="admin-edit-hint">Pomoc</label>
                        <textarea
                          id="admin-edit-hint"
                          className="admin-textarea"
                          value={contentDraft.hint || ''}
                          onChange={(event) => updateContentDraftField('hint', event.target.value)}
                        />

                        <div className="two-col">
                          <div>
                            <label htmlFor="admin-edit-category">Kategorija</label>
                            <select
                              id="admin-edit-category"
                              className="styled-select"
                              value={contentDraft.category || 'Priroda'}
                              onChange={(event) => updateContentDraftField('category', event.target.value)}
                            >
                              {categories.map((category) => (
                                <option key={category}>{category}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label htmlFor="admin-edit-difficulty">Tezina</label>
                            <select
                              id="admin-edit-difficulty"
                              className="styled-select"
                              value={contentDraft.difficulty || 'Lako'}
                              onChange={(event) =>
                                updateContentDraftField('difficulty', event.target.value)
                              }
                            >
                              <option>Lako</option>
                              <option>Srednje</option>
                              <option>Tesko</option>
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="empty-admin-state">
                        Izaberi sadrzaj lijevo da bi ga uredio ili postavio za danas.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="leaderboard-card admin-create-shell">
                <div className="section-row">
                  <div>
                    <h2>Dodaj novi unos</h2>
                    <p className="muted">
                      Jedan fokusirani formular umjesto tri uske kolone.
                    </p>
                  </div>

                  <span className="admin-queue-count">{getContentKindLabel(createType)}</span>
                </div>

                <div className="admin-pill-row">
                  {contentTabs.map((tab) => (
                    <button
                      key={tab}
                      className={`admin-chip ${createType === tab ? 'active' : ''}`}
                      type="button"
                      onClick={() => setCreateType(tab)}
                    >
                      {getContentKindLabel(tab)}
                    </button>
                  ))}
                </div>

                <div className="admin-create-form">
                  {renderCreateForm()}

                  <button className="primary-btn full-btn" type="button" onClick={handleCreateContent}>
                    Sacuvaj novi {getContentKindLabel(createType).toLowerCase()}
                  </button>
                </div>
              </section>
            </div>

            <aside className="admin-side-stack">
              <section className="leaderboard-card admin-users-shell">
                <div className="section-row">
                  <div>
                    <h2>Korisnici</h2>
                    <p className="muted">
                      Brzi pregled napretka, naloga i resetovanja istorije.
                    </p>
                  </div>

                  <span className="admin-queue-count">{filteredUsers.length}</span>
                </div>

                <input
                  className="admin-search-input"
                  type="search"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  placeholder="Pretrazi korisnicko ime..."
                />

                {selectedUser ? (
                  <div className="admin-user-detail">
                    <div className="section-row">
                      <div>
                        <span className="content-kind-tag">Korisnicki nalog</span>
                        <h3>{selectedUser.username}</h3>
                        <p className="muted">
                          Nivo {selectedUser.level} - {selectedUser.points} XP - {selectedUser.totalGames} partija
                        </p>
                      </div>

                      {selectedUser.unreadCount > 0 ? (
                        <span className="admin-status-pill flagged">
                          {selectedUser.unreadCount} neprocitanih poruka
                        </span>
                      ) : null}
                    </div>

                    <div className="two-col">
                      <div>
                        <label htmlFor="admin-user-username">Korisnicko ime</label>
                        <input
                          id="admin-user-username"
                          type="text"
                          value={userDraft?.username || ''}
                          onChange={(event) => updateUserDraftField('username', event.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="admin-user-password">Nova lozinka</label>
                        <input
                          id="admin-user-password"
                          type="password"
                          value={userDraft?.password || ''}
                          onChange={(event) => updateUserDraftField('password', event.target.value)}
                          placeholder="Ostavi prazno ako se ne mijenja"
                        />
                      </div>
                    </div>

                    <div className="admin-detail-grid">
                      <div className="admin-detail-section">
                        <small>STATISTIKA</small>
                        <strong>{selectedUser.totalGames} partija</strong>
                        <p>Dnevni izazovi: {selectedUser.completedDaily}</p>
                        <p>
                          Poslednja aktivnost:{' '}
                          {selectedUser.lastPlayedAt
                            ? formatDateTime(selectedUser.lastPlayedAt)
                            : 'nema aktivnosti'}
                        </p>
                      </div>

                      <div className="admin-detail-section">
                        <small>BRZE AKCIJE</small>
                        <div className="admin-user-quick-actions">
                          <button className="approve-btn" type="button" onClick={handleSaveUser}>
                            Sacuvaj nalog
                          </button>
                          <button className="flag-btn" type="button" onClick={handleResetUserProgress}>
                            Reset XP i istoriju
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-admin-state">Nema korisnika za prikaz.</div>
                )}

                <div className="admin-users-list">
                  {filteredUsers.map((item) => (
                    <button
                      key={item.id}
                      className={`admin-user-card ${selectedUser?.id === item.id ? 'active' : ''}`}
                      type="button"
                      onClick={() => {
                        setSelectedUserId(item.id)
                        setUserDirty(false)
                      }}
                    >
                      <div className="moderation-avatar">
                        {String(item.username || 'K').charAt(0).toUpperCase()}
                      </div>

                      <div className="admin-user-card-copy">
                        <strong>{item.username}</strong>
                        <p>
                          Nivo {item.level} - {item.points} XP
                        </p>
                        <p>
                          {item.totalGames} partija - Dnevni: {item.completedDaily}
                        </p>
                      </div>

                      {item.unreadCount > 0 ? (
                        <span className="admin-status-pill flagged">{item.unreadCount}</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage

