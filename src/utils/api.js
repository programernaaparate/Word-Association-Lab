import { Capacitor } from '@capacitor/core'

const LAST_SUCCESSFUL_API_BASE_KEY = 'lastSuccessfulApiBaseUrl'

const isNativeAndroid = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android'

const normalizeApiBaseUrl = (url) => String(url || '').trim().replace(/\/+$/, '')

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const getStoredApiBaseUrl = () => {
  if (!canUseLocalStorage()) {
    return ''
  }

  return normalizeApiBaseUrl(window.localStorage.getItem(LAST_SUCCESSFUL_API_BASE_KEY))
}

const saveStoredApiBaseUrl = (url) => {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(LAST_SUCCESSFUL_API_BASE_KEY, normalizeApiBaseUrl(url))
}

const getBrowserHostApiUrl = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  const hostName = window.location.hostname

  if (!hostName) {
    return ''
  }

  return `http://${hostName}:4000/api`
}

const getCandidateApiBaseUrls = () => {
  const configuredApiUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)
  const storedApiUrl = getStoredApiBaseUrl()
  const browserHostApiUrl = normalizeApiBaseUrl(getBrowserHostApiUrl())
  const defaults = isNativeAndroid()
    ? ['http://10.0.2.2:4000/api']
    : ['http://localhost:4000/api', 'http://127.0.0.1:4000/api']

  return [...new Set([configuredApiUrl, storedApiUrl, browserHostApiUrl, ...defaults].filter(Boolean))]
}

const getPrimaryApiBaseUrl = () => getCandidateApiBaseUrls()[0] || 'http://localhost:4000/api'

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Doslo je do greske pri komunikaciji sa serverom.')
  }

  return data
}

const isNetworkError = (error) => {
  const message = String(error?.message || '').toLowerCase()

  return (
    error instanceof TypeError ||
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('network request failed') ||
    message.includes('load failed')
  )
}

const requestWithBaseUrl = async (baseUrl, path, options = {}) => {
  const { headers: requestHeaders = {}, ...restOptions } = options

  const response = await fetch(`${baseUrl}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...requestHeaders,
    },
  })

  const data = await parseResponse(response)
  saveStoredApiBaseUrl(baseUrl)
  return data
}

const buildNetworkErrorMessage = () => {
  const primaryApiBaseUrl = getPrimaryApiBaseUrl()

  return `Ne mogu da se povezem sa serverom (${primaryApiBaseUrl}). Proveri da li backend radi, da li su telefon i racunar na istoj mrezi i da li je instaliran najnoviji APK.`
}

export const apiRequest = async (path, options = {}) => {
  const candidateApiBaseUrls = getCandidateApiBaseUrls()
  let lastError = null

  for (const baseUrl of candidateApiBaseUrls) {
    try {
      return await requestWithBaseUrl(baseUrl, path, options)
    } catch (error) {
      if (!isNetworkError(error)) {
        throw error
      }

      lastError = error
    }
  }

  throw new Error(lastError ? buildNetworkErrorMessage() : 'Server trenutno nije dostupan.')
}

const withAuth = (token) => ({
  Authorization: `Bearer ${token}`,
})

export const loginUserRequest = (payload) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const registerUserRequest = (payload) =>
  apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const getCurrentUserRequest = (token) =>
  apiRequest('/auth/me', {
    headers: {
      ...withAuth(token),
    },
  })

export const getLeaderboardRequest = () => apiRequest('/leaderboard')

export const getMyHistoryRequest = (token) =>
  apiRequest('/history/me', {
    headers: {
      ...withAuth(token),
    },
  })

export const saveHistoryEntryRequest = (token, payload) =>
  apiRequest('/history', {
    method: 'POST',
    headers: {
      ...withAuth(token),
    },
    body: JSON.stringify(payload),
  })

export const resetMyHistoryRequest = (token) =>
  apiRequest('/history/me', {
    method: 'DELETE',
    headers: {
      ...withAuth(token),
    },
  })

export const createSubmissionRequest = (token, payload) =>
  apiRequest('/submissions', {
    method: 'POST',
    headers: {
      ...withAuth(token),
    },
    body: JSON.stringify(payload),
  })

const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export const getAssociationContentRequest = (params) =>
  apiRequest(`/content/association${buildQueryString(params)}`)

export const getLogicContentRequest = (params) =>
  apiRequest(`/content/logic${buildQueryString(params)}`)

export const getRelationContentRequest = (params) =>
  apiRequest(`/content/relation${buildQueryString(params)}`)

export const getDailyChallengeRequest = (token, params) =>
  apiRequest(`/content/daily${buildQueryString(params)}`, {
    headers: {
      ...withAuth(token),
    },
  })

export const getAdminDashboardRequest = (token) =>
  apiRequest('/admin/dashboard', {
    headers: {
      ...withAuth(token),
    },
  })

export const getAdminUsersRequest = (token) =>
  apiRequest('/admin/users', {
    headers: {
      ...withAuth(token),
    },
  })

export const updateAdminUserRequest = (token, userId, payload) =>
  apiRequest(`/admin/users/${userId}`, {
    method: 'PATCH',
    headers: {
      ...withAuth(token),
    },
    body: JSON.stringify(payload),
  })

export const resetAdminUserProgressRequest = (token, userId) =>
  apiRequest(`/admin/users/${userId}/reset-progress`, {
    method: 'POST',
    headers: {
      ...withAuth(token),
    },
  })

export const getAdminSubmissionsRequest = (token, params) =>
  apiRequest(`/admin/submissions${buildQueryString(params)}`, {
    headers: {
      ...withAuth(token),
    },
  })

export const updateAdminSubmissionStatusRequest = (token, submissionId, status) =>
  apiRequest(`/admin/submissions/${submissionId}/status`, {
    method: 'PATCH',
    headers: {
      ...withAuth(token),
    },
    body: JSON.stringify({ status }),
  })

export const getAdminContentRequest = (token, type) =>
  apiRequest(`/admin/content/${type}`, {
    headers: {
      ...withAuth(token),
    },
  })

export const createAdminContentRequest = (token, type, payload) =>
  apiRequest(`/admin/content/${type}`, {
    method: 'POST',
    headers: {
      ...withAuth(token),
    },
    body: JSON.stringify(payload),
  })

export const updateAdminContentRequest = (token, type, id, payload) =>
  apiRequest(`/admin/content/${type}/${id}`, {
    method: 'PUT',
    headers: {
      ...withAuth(token),
    },
    body: JSON.stringify(payload),
  })

export const deleteAdminContentRequest = (token, type, id) =>
  apiRequest(`/admin/content/${type}/${id}`, {
    method: 'DELETE',
    headers: {
      ...withAuth(token),
    },
  })

export const getAdminDailyRequest = (token, params) =>
  apiRequest(`/admin/daily${buildQueryString(params)}`, {
    headers: {
      ...withAuth(token),
    },
  })

export const setAdminDailyRequest = (token, payload) =>
  apiRequest('/admin/daily', {
    method: 'PUT',
    headers: {
      ...withAuth(token),
    },
    body: JSON.stringify(payload),
  })

export const clearAdminDailyRequest = (token, params) =>
  apiRequest(`/admin/daily${buildQueryString(params)}`, {
    method: 'DELETE',
    headers: {
      ...withAuth(token),
    },
  })

export const getMessageContactsRequest = (token) =>
  apiRequest('/messages/contacts', {
    headers: {
      ...withAuth(token),
    },
  })

export const getMessageThreadRequest = (token, otherUserId) =>
  apiRequest(`/messages/thread/${otherUserId}`, {
    headers: {
      ...withAuth(token),
    },
  })

export const sendMessageRequest = (token, otherUserId, payload) =>
  apiRequest(`/messages/thread/${otherUserId}`, {
    method: 'POST',
    headers: {
      ...withAuth(token),
    },
    body: JSON.stringify(payload),
  })

export const evaluateAiConceptAnswerRequest = (token, payload) =>
  apiRequest('/ai/concept-answer', {
    method: 'POST',
    headers: {
      ...withAuth(token),
    },
    body: JSON.stringify(payload),
  })

export const evaluateAiWordChainNodeRequest = (token, payload) =>
  apiRequest('/ai/word-chain-node', {
    method: 'POST',
    headers: {
      ...withAuth(token),
    },
    body: JSON.stringify(payload),
  })
