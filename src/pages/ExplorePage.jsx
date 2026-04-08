import { useEffect, useMemo, useState } from 'react'
import BottomNav from '../components/BottomNav'
import Navbar from '../components/Navbar'
import {
  getAssociationContentRequest,
  getLogicContentRequest,
  getRelationContentRequest,
} from '../utils/api'

function ExplorePage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [exploreItems, setExploreItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadExploreItems = async () => {
      try {
        setError('')

        const [associationResponse, logicResponse, relationResponse] = await Promise.all([
          getAssociationContentRequest({}),
          getLogicContentRequest({}),
          getRelationContentRequest({}),
        ])

        if (!isMounted) {
          return
        }

        const associationItems = (associationResponse.items || []).map((item) => ({
          id: `association-${item.id}`,
          type: 'association',
          title: item.word,
          description: item.hint,
          category: item.category,
          difficulty: item.difficulty,
          meta: (item.clues || []).join(', '),
        }))

        const logicItems = (logicResponse.items || []).map((item) => ({
          id: `logic-${item.id}`,
          type: item.mode === 'odd-one-out' ? 'odd-one-out' : 'logic',
          title: item.answer,
          description: (item.words || []).join(', '),
          category: item.category,
          difficulty: item.difficulty,
          meta: item.hint,
        }))

        const relationItems = (relationResponse.items || []).map((item) => ({
          id: `relation-${item.id}`,
          type: 'relation',
          title: `${item.leftWord} / ${item.rightWord}`,
          description: item.relation,
          category: item.category,
          difficulty: item.difficulty,
          meta: item.hint,
        }))

        setExploreItems([...associationItems, ...logicItems, ...relationItems])
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        setError(requestError.message)
      }
    }

    loadExploreItems()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return exploreItems.filter((item) => {
      const matchesFilter = filter === 'all' ? true : item.type === filter
      const matchesQuery = !normalizedQuery
        ? true
        : `${item.title} ${item.description} ${item.meta} ${item.category}`
            .toLowerCase()
            .includes(normalizedQuery)

      return matchesFilter && matchesQuery
    })
  }, [exploreItems, filter, query])

  const counts = useMemo(
    () => ({
      all: exploreItems.length,
      association: exploreItems.filter((item) => item.type === 'association').length,
      logic: exploreItems.filter((item) => item.type === 'logic').length,
      oddOneOut: exploreItems.filter((item) => item.type === 'odd-one-out').length,
      relation: exploreItems.filter((item) => item.type === 'relation').length,
    }),
    [exploreItems]
  )

  const formatType = (type) => {
    if (type === 'logic') return 'Zajednicki pojam'
    if (type === 'odd-one-out') return 'Ne pripada'
    if (type === 'relation') return 'Sinonim / Antonim'
    return 'Asocijacija'
  }

  return (
    <div className="screen">
      <div className="phone-card app-shell">
        <Navbar title="Baza sadrzaja" showBack />

        <div className="page-content explore-page">
          <div className="leaderboard-card">
            <h2>Pregled sadrzaja</h2>
            <p className="muted">
              Admin pregled svih asocijacija, logickih izazova i relacija koje vec postoje u aplikaciji.
            </p>
            {error ? <p className="error">{error}</p> : null}

            <label htmlFor="explore-search">Pretraga</label>
            <input
              id="explore-search"
              name="exploreSearch"
              type="text"
              placeholder="npr. svemir, sinonim, priroda..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <div className="explore-summary-grid">
              <div className="mini-stat-card">
                <small>UKUPNO</small>
                <strong>{counts.all}</strong>
              </div>
              <div className="mini-stat-card">
                <small>ASOCIJACIJE</small>
                <strong>{counts.association}</strong>
              </div>
              <div className="mini-stat-card">
                <small>LOGIKA</small>
                <strong>{counts.logic + counts.oddOneOut}</strong>
              </div>
              <div className="mini-stat-card">
                <small>RELACIJE</small>
                <strong>{counts.relation}</strong>
              </div>
            </div>

            <div className="segmented slim">
              <button
                type="button"
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                Sve
              </button>
              <button
                type="button"
                className={filter === 'association' ? 'active' : ''}
                onClick={() => setFilter('association')}
              >
                Asocijacije
              </button>
              <button
                type="button"
                className={filter === 'logic' ? 'active' : ''}
                onClick={() => setFilter('logic')}
              >
                Pojam
              </button>
            </div>

            <div className="segmented slim">
              <button
                type="button"
                className={filter === 'odd-one-out' ? 'active' : ''}
                onClick={() => setFilter('odd-one-out')}
              >
                Ne pripada
              </button>
              <button
                type="button"
                className={filter === 'relation' ? 'active' : ''}
                onClick={() => setFilter('relation')}
              >
                Relacije
              </button>
              <button type="button" disabled>
                {filteredItems.length}
              </button>
            </div>
          </div>

          <div className="leaderboard-card">
            <div className="section-row">
              <h2>Rezultati pretrage</h2>
              <span className="muted">{filteredItems.length} pronadjenih stavki</span>
            </div>

            <div className="explore-results-grid">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <article className="explore-result-card" key={item.id}>
                    <div className="explore-card-head">
                      <span className="explore-type-tag">{formatType(item.type)}</span>
                      <span className="muted">{item.difficulty}</span>
                    </div>

                    <h3>{item.title}</h3>
                    <p className="muted">{item.category}</p>

                    <div className="explore-card-block">
                      <small>OPIS</small>
                      <p>{item.description}</p>
                    </div>

                    {item.meta ? (
                      <div className="explore-card-block">
                        <small>DETALJI</small>
                        <p>{item.meta}</p>
                      </div>
                    ) : null}
                  </article>
                ))
              ) : (
                <div className="empty-admin-state">Nema rezultata za trenutnu pretragu.</div>
              )}
            </div>
          </div>
        </div>

        <BottomNav current="home" />
      </div>
    </div>
  )
}

export default ExplorePage
