import { useEffect, useMemo, useState } from 'react'
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
  updateAdminUserRequest,
  updateAdminContentRequest,
  updateAdminSubmissionStatusRequest,
} from '../utils/api'
import { getAuthToken } from '../utils/storage'

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

const parseList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const getContentKindLabel = (kind) => {
  if (kind === 'association') return 'Asocijacija'
  if (kind === 'logic') return 'Logika'
  if (kind === 'relation') return 'Relacija'
  return 'Sadrzaj'
}

const isSameDailyItem = (dailyOverride, item) =>
  Boolean(
    dailyOverride &&
      item &&
      dailyOverride.type === item.kind &&
      Number(dailyOverride.contentId) === Number(item.id)
  )

function AdminPage() {
  const token = getAuthToken()
  const [contentFilter, setContentFilter] = useState('association')
  const [searchQuery, setSearchQuery] = useState('')
  const [moderationFilter, setModerationFilter] = useState('all')
  const [editingItem, setEditingItem] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const [term, setTerm] = useState('')
  const [associationSymbol, setAssociationSymbol] = useState('')
  const [cluesText, setCluesText] = useState('')
  const [acceptedAnswers, setAcceptedAnswers] = useState('')
  const [difficulty, setDifficulty] = useState('Lako')
  const [selectedCategory, setSelectedCategory] = useState('Priroda')

  const [logicMode, setLogicMode] = useState('concept')
  const [logicWords, setLogicWords] = useState('')
  const [logicAnswer, setLogicAnswer] = useState('')
  const [logicHint, setLogicHint] = useState('')

  const [relationLeftWord, setRelationLeftWord] = useState('')
  const [relationRightWord, setRelationRightWord] = useState('')
  const [relationType, setRelationType] = useState('Sinonim')
  const [relationHint, setRelationHint] = useState('')

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

  useEffect(() => {
    let isMounted = true

    const loadAdminData = async () => {
      if (!token) {
        return
      }

      try {
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
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        setError(requestError.message)
      }
    }

    loadAdminData()

    return () => {
      isMounted = false
    }
  }, [refreshKey, token])

  const contentItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const items =
      contentFilter === 'association'
        ? associationWords.map((item) => ({
            ...item,
            kind: 'association',
            title: item.symbol ? `${item.symbol} ${item.word}` : item.word,
            subtitle: `${item.category} / ${item.difficulty}`,
            extra: (item.clues || []).join(', '),
          }))
        : contentFilter === 'logic'
          ? logicChallenges.map((item) => ({
              ...item,
              kind: 'logic',
              title: item.answer,
              subtitle: `${item.mode} / ${item.category} / ${item.difficulty}`,
              extra: (item.words || []).join(', '),
            }))
          : relationChallenges.map((item) => ({
              ...item,
              kind: 'relation',
              title: `${item.leftWord} / ${item.rightWord}`,
              subtitle: `${item.relation} / ${item.category} / ${item.difficulty}`,
              extra: item.hint || '',
            }))

    return items.filter((item) =>
      `${item.title} ${item.subtitle} ${item.extra}`.toLowerCase().includes(normalizedQuery)
    )
  }, [
    associationWords,
    contentFilter,
    logicChallenges,
    relationChallenges,
    searchQuery,
  ])

  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter((item) => item.status !== 'approved')
      .filter((item) => {
        if (moderationFilter === 'new') return item.status === 'pending'
        if (moderationFilter === 'flagged') return item.status === 'flagged'
        return true
      })
      .slice(0, 8)
  }, [moderationFilter, submissions])

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleAddAssociation = async () => {
    const normalizedWord = term.trim()
    const parsedClues = parseList(cluesText)

    if (!normalizedWord || parsedClues.length < 2 || !token) {
      return
    }

    try {
      setError('')
      await createAdminContentRequest(token, 'association', {
        word: normalizedWord,
        symbol: associationSymbol.trim(),
        difficulty,
        category: selectedCategory,
        clues: parsedClues.slice(0, 4),
        hint: `Pomisli na pojam ${normalizedWord.toLowerCase()}.`,
        acceptedAnswers: [normalizedWord, ...parseList(acceptedAnswers)],
      })

      setTerm('')
      setAssociationSymbol('')
      setCluesText('')
      setAcceptedAnswers('')
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleAddLogic = async () => {
    if (!logicAnswer.trim() || parseList(logicWords).length < 2 || !token) {
      return
    }

    try {
      setError('')
      await createAdminContentRequest(token, 'logic', {
        mode: logicMode,
        words: parseList(logicWords),
        answer: logicAnswer.trim(),
        hint: logicHint.trim() || 'Pokusaj da pronadjes zajednicku osobinu.',
        category: selectedCategory,
        difficulty,
      })

      setLogicWords('')
      setLogicAnswer('')
      setLogicHint('')
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleAddRelation = async () => {
    if (!relationLeftWord.trim() || !relationRightWord.trim() || !token) {
      return
    }

    try {
      setError('')
      await createAdminContentRequest(token, 'relation', {
        leftWord: relationLeftWord.trim(),
        rightWord: relationRightWord.trim(),
        relation: relationType,
        hint: relationHint.trim() || 'Pomisli kakav odnos imaju ova dva pojma.',
        category: selectedCategory,
        difficulty,
      })

      setRelationLeftWord('')
      setRelationRightWord('')
      setRelationHint('')
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleEditStart = (item) => {
    setEditingItem({
      ...item,
      acceptedAnswersText: item.acceptedAnswers ? item.acceptedAnswers.join(', ') : '',
      cluesText: item.clues ? item.clues.join(', ') : '',
      wordsText: item.words ? item.words.join(', ') : '',
    })
  }

  const handleEditSave = async () => {
    if (!editingItem || !token) {
      return
    }

    try {
      setError('')

      if (editingItem.kind === 'association') {
        await updateAdminContentRequest(token, 'association', editingItem.id, {
          word: editingItem.word,
          symbol: editingItem.symbol || '',
          category: editingItem.category,
          difficulty: editingItem.difficulty,
          clues: parseList(editingItem.cluesText || '').slice(0, 4),
          hint: editingItem.hint || '',
          acceptedAnswers: parseList(editingItem.acceptedAnswersText || ''),
        })
      } else if (editingItem.kind === 'logic') {
        await updateAdminContentRequest(token, 'logic', editingItem.id, {
          mode: editingItem.mode,
          words: parseList(editingItem.wordsText || ''),
          answer: editingItem.answer,
          hint: editingItem.hint || '',
          category: editingItem.category,
          difficulty: editingItem.difficulty,
        })
      } else {
        await updateAdminContentRequest(token, 'relation', editingItem.id, {
          leftWord: editingItem.leftWord,
          rightWord: editingItem.rightWord,
          relation: editingItem.relation,
          hint: editingItem.hint || '',
          category: editingItem.category,
          difficulty: editingItem.difficulty,
        })
      }

      setEditingItem(null)
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleDelete = async (item) => {
    const confirmationMessage = isSameDailyItem(dailyOverride, item)
      ? `Da li sigurno zelis da trajno obrises "${item.title}" iz baze sadrzaja? Ovaj unos je trenutno aktivni daily za danas i bice uklonjen i iz dnevnog izazova.`
      : `Da li sigurno zelis da trajno obrises "${item.title}" iz baze sadrzaja?`

    if (
      !token ||
      !window.confirm(confirmationMessage)
    ) {
      return
    }

    try {
      setError('')
      await deleteAdminContentRequest(token, item.kind, item.id)
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleSetDaily = async (item) => {
    if (!token) {
      return
    }

    try {
      setError('')

      if (isSameDailyItem(dailyOverride, item)) {
        await clearAdminDailyRequest(token, {})
      } else {
        await setAdminDailyRequest(token, {
          type: item.kind,
          contentId: item.id,
        })
      }

      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleClearDaily = async () => {
    if (!token || !window.confirm('Vrati dnevni izazov na automatski izbor?')) {
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

  const handleSubmissionStatus = async (id, status) => {
    if (!token) {
      return
    }

    try {
      setError('')
      await updateAdminSubmissionStatusRequest(token, id, status)
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleResetUserProgress = async (userItem) => {
    if (!token || !userItem?.id) {
      return
    }

    if (
      !window.confirm(
        `Da li sigurno zelis da resetujes XP i istoriju za korisnika ${userItem.username}?`
      )
    ) {
      return
    }

    try {
      setError('')
      await resetAdminUserProgressRequest(token, userItem.id)
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleEditUserStart = (userItem) => {
    setEditingUser({
      id: userItem.id,
      username: userItem.username,
      password: '',
    })
  }

  const handleEditUserSave = async () => {
    const cleanUsername = String(editingUser?.username || '').trim()

    if (!editingUser?.id || !token || !cleanUsername) {
      setError('Korisnicko ime je obavezno.')
      return
    }

    try {
      setError('')
      await updateAdminUserRequest(token, editingUser.id, {
        username: cleanUsername,
        password: editingUser.password,
      })
      setEditingUser(null)
      triggerRefresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="screen">
      <div className="phone-card app-shell">
        <Navbar title="Admin panel" showBack />

        <div className="page-content admin-page">
          {error ? <p className="error">{error}</p> : null}

          <div className="admin-desktop-grid">
            <div className="admin-forms-column">
              <div className="form-card">
                <h3>Asocijacija</h3>
                <label htmlFor="admin-term">Konacno rjesenje</label>
                <input
                  id="admin-term"
                  type="text"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                />

                <label htmlFor="admin-symbol">Simbol ili piktogram</label>
                <input
                  id="admin-symbol"
                  type="text"
                  value={associationSymbol}
                  onChange={(event) => setAssociationSymbol(event.target.value)}
                  placeholder="☀️ ili 🌊"
                />

                <label htmlFor="admin-clues">Tragovi</label>
                <input
                  id="admin-clues"
                  type="text"
                  value={cluesText}
                  onChange={(event) => setCluesText(event.target.value)}
                  placeholder="dan, toplota, svjetlost, ljeto"
                />

                <div className="two-col">
                  <div>
                    <label htmlFor="admin-difficulty">Tezina</label>
                    <select
                      id="admin-difficulty"
                      className="styled-select"
                      value={difficulty}
                      onChange={(event) => setDifficulty(event.target.value)}
                    >
                      <option>Lako</option>
                      <option>Srednje</option>
                      <option>Tesko</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="admin-category">Kategorija</label>
                    <select
                      id="admin-category"
                      className="styled-select"
                      value={selectedCategory}
                      onChange={(event) => setSelectedCategory(event.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <label htmlFor="admin-accepted">Prihvatljivi odgovori</label>
                <input
                  id="admin-accepted"
                  type="text"
                  value={acceptedAnswers}
                  onChange={(event) => setAcceptedAnswers(event.target.value)}
                  placeholder="sunce, suncevo tijelo"
                />

                <button className="primary-btn full-btn" type="button" onClick={handleAddAssociation}>
                  Sacuvaj asocijaciju
                </button>
              </div>

              <div className="form-card">
                <h3>Logicki izazov</h3>

                <div className="segmented slim">
                  <button
                    type="button"
                    className={logicMode === 'concept' ? 'active' : ''}
                    onClick={() => setLogicMode('concept')}
                  >
                    Koncept
                  </button>
                  <button
                    type="button"
                    className={logicMode === 'odd-one-out' ? 'active' : ''}
                    onClick={() => setLogicMode('odd-one-out')}
                  >
                    Ne pripada
                  </button>
                </div>

                <label htmlFor="logic-words">Pojmovi</label>
                <input
                  id="logic-words"
                  type="text"
                  value={logicWords}
                  onChange={(event) => setLogicWords(event.target.value)}
                  placeholder="Pas, Macka, Lav"
                />

                <label htmlFor="logic-answer">Odgovor</label>
                <input
                  id="logic-answer"
                  type="text"
                  value={logicAnswer}
                  onChange={(event) => setLogicAnswer(event.target.value)}
                />

              <label htmlFor="logic-hint">Hint</label>
              <input
                id="logic-hint"
                type="text"
                value={logicHint}
                onChange={(event) => setLogicHint(event.target.value)}
              />

              <div className="two-col">
                <div>
                  <label htmlFor="logic-difficulty">Tezina</label>
                  <select
                    id="logic-difficulty"
                    className="styled-select"
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value)}
                  >
                    <option>Lako</option>
                    <option>Srednje</option>
                    <option>Tesko</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="logic-category">Kategorija</label>
                  <select
                    id="logic-category"
                    className="styled-select"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="secondary-btn full-btn" type="button" onClick={handleAddLogic}>
                Dodaj logicki izazov
              </button>
            </div>

              <div className="form-card">
                <h3>Relacija</h3>
                <label htmlFor="relation-left">Prva rijec</label>
                <input
                  id="relation-left"
                  type="text"
                  value={relationLeftWord}
                  onChange={(event) => setRelationLeftWord(event.target.value)}
                />

                <label htmlFor="relation-right">Druga rijec</label>
                <input
                  id="relation-right"
                  type="text"
                  value={relationRightWord}
                  onChange={(event) => setRelationRightWord(event.target.value)}
                />

                <div className="two-col">
                  <div>
                    <label htmlFor="relation-type">Relacija</label>
                    <select
                      id="relation-type"
                      className="styled-select"
                      value={relationType}
                      onChange={(event) => setRelationType(event.target.value)}
                    >
                      <option>Sinonim</option>
                      <option>Antonim</option>
                      <option>Asocijacija</option>
                    </select>
                  </div>

                <div>
                  <label htmlFor="relation-hint">Hint</label>
                  <input
                    id="relation-hint"
                    type="text"
                    value={relationHint}
                    onChange={(event) => setRelationHint(event.target.value)}
                  />
                </div>
              </div>

              <div className="two-col">
                <div>
                  <label htmlFor="relation-difficulty">Tezina</label>
                  <select
                    id="relation-difficulty"
                    className="styled-select"
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value)}
                  >
                    <option>Lako</option>
                    <option>Srednje</option>
                    <option>Tesko</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="relation-category">Kategorija</label>
                  <select
                    id="relation-category"
                    className="styled-select"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="secondary-btn full-btn" type="button" onClick={handleAddRelation}>
                Dodaj relaciju
              </button>
            </div>
            </div>

            <div className="admin-main-column">
              <div className="leaderboard-card">
                <div className="section-row">
                  <h2>Dnevni izazov</h2>
                  <span className="muted">{dailyOverride ? 'Rucno postavljen' : 'Automatski'}</span>
                </div>

                {dailyOverride ? (
                  <>
                    <div className="profile-info-box">
                      <p><strong>Tip:</strong> {dailyOverride.type}</p>
                      <p><strong>Sadrzaj:</strong> {dailyOverride.title}</p>
                      <p>
                        <strong>Logika:</strong> rucno postavljen daily vazi samo za danas
                        dok ga ne vratis na automatski izbor.
                      </p>
                    </div>
                    <button className="secondary-btn full-btn" type="button" onClick={handleClearDaily}>
                      Vrati automatski izbor
                    </button>
                  </>
                ) : (
                  <div className="empty-admin-state">
                    Daily challenge se bira automatski dok ispod ne kliknes "Postavi za danas"
                    na nekom unosu.
                  </div>
                )}
              </div>

              <div className="leaderboard-card">
                <div className="section-row">
                  <h2>Upravljanje sadrzajem</h2>
                  <span className="muted">{contentItems.length}</span>
                </div>

                <div className="profile-info-box admin-help-box">
                  <p><strong>Uredi unos:</strong> menja naziv, tragove, hint i ostale podatke.</p>
                  <p>
                    <strong>Postavi za danas:</strong> bira taj unos kao danasnji dnevni izazov.
                  </p>
                  <p><strong>Obrisi unos:</strong> trajno uklanja sadrzaj iz baze.</p>
                </div>

                <div className="segmented slim">
                  <button
                    type="button"
                    className={contentFilter === 'association' ? 'active' : ''}
                    onClick={() => setContentFilter('association')}
                  >
                    Asocijacije
                  </button>
                  <button
                    type="button"
                    className={contentFilter === 'logic' ? 'active' : ''}
                    onClick={() => setContentFilter('logic')}
                  >
                    Logika
                  </button>
                  <button
                    type="button"
                    className={contentFilter === 'relation' ? 'active' : ''}
                    onClick={() => setContentFilter('relation')}
                  >
                    Relacije
                  </button>
                </div>

                <label htmlFor="admin-search">Pretraga</label>
                <input
                  id="admin-search"
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />

                <div className="moderation-list content-management-list">
                  {contentItems.slice(0, 12).map((item) => (
                    <div
                      className="moderation-card content-management-card"
                      key={`${item.kind}-${item.id}`}
                    >
                      <div className="moderation-head content-management-head">
                        <div className="moderation-avatar">{item.title.charAt(0).toUpperCase()}</div>
                        <div className="moderation-info content-management-info">
                          <strong>{item.title}</strong>
                          <span className="content-kind-tag">{getContentKindLabel(item.kind)}</span>
                          {isSameDailyItem(dailyOverride, item) ? (
                            <span className="content-daily-tag">Aktivni daily danas</span>
                          ) : null}
                          <p>{item.subtitle}</p>
                          {item.extra ? <p>{item.extra}</p> : null}
                        </div>
                      </div>

                      <div className="moderation-actions moderation-actions-3">
                        <button
                          className="approve-btn"
                          type="button"
                          onClick={() => handleEditStart(item)}
                        >
                          Uredi unos
                        </button>
                        <button
                          className={`secondary-btn compact-btn ${
                            isSameDailyItem(dailyOverride, item) ? 'active-daily-btn' : ''
                          }`}
                          type="button"
                          onClick={() => handleSetDaily(item)}
                        >
                          {isSameDailyItem(dailyOverride, item)
                            ? 'Ukloni daily'
                            : 'Postavi za danas'}
                        </button>
                        <button className="flag-btn" type="button" onClick={() => handleDelete(item)}>
                          Obrisi unos
                        </button>
                      </div>
                    </div>
                  ))}

                  {contentItems.length === 0 && (
                    <div className="empty-admin-state">
                      Nema sadrzaja za izabrani tip i pretragu.
                    </div>
                  )}
                </div>
              </div>

              {editingItem && (
                <div className="form-card admin-edit-card">
                  <div className="section-row">
                    <h3>Izmjena sadrzaja</h3>
                    <button className="ghost-inline" type="button" onClick={() => setEditingItem(null)}>
                      Zatvori
                    </button>
                  </div>

                  {editingItem.kind === 'association' && (
                    <>
                      <label htmlFor="edit-word">Rjesenje</label>
                      <input
                        id="edit-word"
                        type="text"
                        value={editingItem.word}
                        onChange={(event) =>
                          setEditingItem((prev) => ({ ...prev, word: event.target.value }))
                        }
                      />
                      <label htmlFor="edit-symbol">Simbol ili piktogram</label>
                      <input
                        id="edit-symbol"
                        type="text"
                        value={editingItem.symbol || ''}
                        onChange={(event) =>
                          setEditingItem((prev) => ({ ...prev, symbol: event.target.value }))
                        }
                      />
                      <label htmlFor="edit-clues">Tragovi</label>
                      <input
                        id="edit-clues"
                        type="text"
                        value={editingItem.cluesText}
                        onChange={(event) =>
                          setEditingItem((prev) => ({ ...prev, cluesText: event.target.value }))
                        }
                      />
                      <label htmlFor="edit-accepted">Prihvatljivi odgovori</label>
                      <input
                        id="edit-accepted"
                        type="text"
                        value={editingItem.acceptedAnswersText}
                        onChange={(event) =>
                          setEditingItem((prev) => ({
                            ...prev,
                            acceptedAnswersText: event.target.value,
                          }))
                        }
                      />
                    </>
                  )}

                  {editingItem.kind === 'logic' && (
                    <>
                      <label htmlFor="edit-words">Pojmovi</label>
                      <input
                        id="edit-words"
                        type="text"
                        value={editingItem.wordsText}
                        onChange={(event) =>
                          setEditingItem((prev) => ({ ...prev, wordsText: event.target.value }))
                        }
                      />
                      <label htmlFor="edit-answer">Odgovor</label>
                      <input
                        id="edit-answer"
                        type="text"
                        value={editingItem.answer}
                        onChange={(event) =>
                          setEditingItem((prev) => ({ ...prev, answer: event.target.value }))
                        }
                      />
                    </>
                  )}

                  {editingItem.kind === 'relation' && (
                    <>
                      <label htmlFor="edit-left">Prva rijec</label>
                      <input
                        id="edit-left"
                        type="text"
                        value={editingItem.leftWord}
                        onChange={(event) =>
                          setEditingItem((prev) => ({ ...prev, leftWord: event.target.value }))
                        }
                      />
                      <label htmlFor="edit-right">Druga rijec</label>
                      <input
                        id="edit-right"
                        type="text"
                        value={editingItem.rightWord}
                        onChange={(event) =>
                          setEditingItem((prev) => ({ ...prev, rightWord: event.target.value }))
                        }
                      />
                    </>
                  )}

                  <label htmlFor="edit-hint">Hint</label>
                  <input
                    id="edit-hint"
                    type="text"
                    value={editingItem.hint || ''}
                    onChange={(event) =>
                      setEditingItem((prev) => ({ ...prev, hint: event.target.value }))
                    }
                  />

                  <button className="primary-btn full-btn" type="button" onClick={handleEditSave}>
                    Sacuvaj izmjene
                  </button>
                </div>
              )}
            </div>

            <div className="admin-side-column">
              <div className="leaderboard-card">
                <div className="section-row">
                  <h2>Korisnici</h2>
                  <span className="muted">{adminUsers.length}</span>
                </div>

                <div className="moderation-list admin-users-list">
                  {adminUsers.length > 0 ? (
                    adminUsers.slice(0, 10).map((item) => (
                      <div className="moderation-card" key={`user-${item.id}`}>
                        <div className="moderation-head">
                          <div className="moderation-avatar">
                            {item.username?.charAt(0)?.toUpperCase() || 'K'}
                          </div>
                          <div className="moderation-info">
                            <strong>{item.username}</strong>
                            <p>
                              Nivo {item.level} · {item.points} XP · {item.totalGames} partija
                            </p>
                            <p>
                              Daily: {item.completedDaily}
                              {item.unreadCount > 0 ? ` · ${item.unreadCount} novih poruka` : ''}
                            </p>
                          </div>
                          <div className="moderation-score">
                            <strong>{item.points}</strong>
                            <small>XP</small>
                          </div>
                        </div>

                        <div className="moderation-actions">
                          <button
                            className="secondary-btn compact-btn"
                            type="button"
                            onClick={() => handleEditUserStart(item)}
                          >
                            Uredi nalog
                          </button>
                          <button
                            className="flag-btn"
                            type="button"
                            onClick={() => handleResetUserProgress(item)}
                          >
                            Reset XP i istoriju
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-admin-state">Trenutno nema korisnika za upravljanje.</div>
                  )}
                </div>
              </div>

              {editingUser && (
                <div className="form-card admin-user-edit-card">
                  <div className="section-row">
                    <h3>Uredi korisnika</h3>
                    <button className="ghost-inline" type="button" onClick={() => setEditingUser(null)}>
                      Zatvori
                    </button>
                  </div>

                  <label htmlFor="edit-admin-username">Korisnicko ime</label>
                  <input
                    id="edit-admin-username"
                    type="text"
                    value={editingUser.username}
                    onChange={(event) =>
                      setEditingUser((prev) => ({ ...prev, username: event.target.value }))
                    }
                  />

                  <label htmlFor="edit-admin-password">Nova lozinka</label>
                  <input
                    id="edit-admin-password"
                    type="password"
                    value={editingUser.password}
                    onChange={(event) =>
                      setEditingUser((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder="Ostavi prazno ako ne menjas lozinku"
                  />

                  <div className="profile-info-box admin-help-box">
                    <p><strong>Napomena:</strong> ako polje lozinke ostane prazno, stara lozinka ostaje aktivna.</p>
                    <p><strong>Pravilo:</strong> nova lozinka mora imati najmanje 4 karaktera i bar jedno veliko slovo.</p>
                  </div>

                  <button className="primary-btn full-btn" type="button" onClick={handleEditUserSave}>
                    Sacuvaj korisnika
                  </button>
                </div>
              )}

              <div className="leaderboard-card">
                <div className="section-row">
                  <h2>Moderacija unosa</h2>
                  <span className="muted">{stats.pendingSubmissions} na cekanju</span>
                </div>

                <div className="profile-info-box admin-help-box">
                  <p><strong>Odobri unos:</strong> prihvata korisnicki unos kao uredan.</p>
                  <p><strong>Oznaci unos:</strong> obelezava ga za dodatni pregled ili moderaciju.</p>
                </div>

                <div className="segmented slim">
                  <button
                    type="button"
                    className={moderationFilter === 'all' ? 'active' : ''}
                    onClick={() => setModerationFilter('all')}
                  >
                    Svi
                  </button>
                  <button
                    type="button"
                    className={moderationFilter === 'new' ? 'active' : ''}
                    onClick={() => setModerationFilter('new')}
                  >
                    Novi
                  </button>
                  <button
                    type="button"
                    className={moderationFilter === 'flagged' ? 'active' : ''}
                    onClick={() => setModerationFilter('flagged')}
                  >
                    Obiljezeni
                  </button>
                </div>

                <div className="moderation-list admin-submissions-list">
                  {filteredSubmissions.map((item) => (
                    <div className="moderation-card" key={item.id}>
                      <div className="moderation-head">
                        <div className="moderation-avatar">
                          {item.user?.charAt(0)?.toUpperCase() || 'K'}
                        </div>
                        <div className="moderation-info">
                          <strong>{item.user}</strong>
                          <p>
                            {item.type}: {item.content}
                          </p>
                        </div>
                        <div className="moderation-score">
                          <strong>{item.points}</strong>
                          <small>{item.time}s</small>
                        </div>
                      </div>

                      <div className="moderation-actions">
                        <button
                          className="approve-btn"
                          type="button"
                          onClick={() => handleSubmissionStatus(item.id, 'approved')}
                        >
                          Odobri unos
                        </button>
                        <button
                          className="flag-btn"
                          type="button"
                          onClick={() => handleSubmissionStatus(item.id, 'flagged')}
                        >
                          Oznaci unos
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredSubmissions.length === 0 && (
                    <div className="empty-admin-state">Nema korisnickih unosa za izabrani filter.</div>
                  )}
                </div>
              </div>

              <div className="stats-grid admin-stats-grid">
                <div className="soft-stat">
                  <small>UKUPNO RIJECI</small>
                  <strong>{stats.totalWords}</strong>
                </div>
                <div className="soft-stat green-tint">
                  <small>AKTIVNIH IGRI</small>
                  <strong>{stats.activeGames}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage

