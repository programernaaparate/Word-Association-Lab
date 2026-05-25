import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GameHelpModal from '../components/GameHelpModal'
import Navbar from '../components/Navbar'
import { evaluateAiWordChainNodeRequest } from '../utils/api'
import { syncCompletedGame } from '../utils/gameSync'
import {
  calculatePerformanceBonus,
  calculateWordChainReward,
} from '../utils/gameRewards'
import { evaluateSmartWordChainCandidate } from '../utils/localSmartMatching'
import {
  clearActiveSession,
  getActiveSession,
  getAuthToken,
  getCategory,
  getCurrentUser,
  getDifficulty,
  getWordChainPreset,
  saveActiveSession,
  saveLastResult,
} from '../utils/storage'

const RELATION_OPTIONS = ['Sinonim', 'Antonim', 'Asocijacija']

const buildAllowedNodes = (synonyms = [], antonyms = [], associations = []) => ({
  Sinonim: synonyms,
  Antonim: antonyms,
  Asocijacija: associations,
})

const CHAIN_ALLOWED_NODES = {
  'Nauka-Lako': buildAllowedNodes(
    ['Preciznost', 'Ispravnost', 'Pouzdanost'],
    ['Greska', 'Netacnost', 'Promasaj'],
    ['Eksperiment', 'Laboratorija', 'Mjerenje', 'Formula']
  ),
  'Nauka-Srednje': buildAllowedNodes(
    ['Kosmos', 'Univerzum', 'Vasiona'],
    ['Zemlja', 'Tlo', 'Podzemlje'],
    ['Galaksija', 'Orbita', 'Planeta', 'Zvijezda']
  ),
  'Nauka-Tesko': buildAllowedNodes(
    ['Privlacnost', 'Privlacenje', 'Teza'],
    ['Odbijanje', 'Lebdenje', 'Bestezinsko'],
    ['Njutn', 'Masa', 'Pad', 'Orbita']
  ),
  'Sport-Lako': buildAllowedNodes(
    ['Trijumf', 'Uspjeh', 'Slavlje'],
    ['Poraz', 'Neuspjeh', 'Gubitak'],
    ['Medalja', 'Trofej', 'Finale', 'Tim']
  ),
  'Sport-Srednje': buildAllowedNodes(
    ['Utrka', 'Nadmetanje', 'Takmicenje'],
    ['Zastoj', 'Mirovanje', 'Pauza'],
    ['Maraton', 'Start', 'Cilj', 'Staza']
  ),
  'Sport-Tesko': buildAllowedNodes(
    ['Red', 'Samokontrola', 'Urednost'],
    ['Nered', 'Haos', 'Neposlusnost'],
    ['Trening', 'Pravilo', 'Gimnastika', 'Fokus']
  ),
  'Film-Lako': buildAllowedNodes(
    ['Prizor', 'Sekvenca', 'Kadar'],
    ['Pauza', 'Mrak', 'Praznina'],
    ['Kamera', 'Glumac', 'Dijalog', 'Set']
  ),
  'Film-Srednje': buildAllowedNodes(
    ['Karakter', 'Junak', 'Persona'],
    ['Publika', 'Statista', 'Kulisa', 'Pozadina'],
    ['Scenario', 'Glumac', 'Zaplet', 'Dijalog']
  ),
  'Film-Tesko': buildAllowedNodes(
    ['Sklapanje', 'Spajanje', 'Obrada'],
    ['Rasipanje', 'Raskidanje', 'Haos'],
    ['Rez', 'Postprodukcija', 'Kadar', 'Ritam']
  ),
  'Istorija-Lako': buildAllowedNodes(
    ['Vladar', 'Monarh', 'Knez'],
    ['Podanik', 'Sluga', 'Narod'],
    ['Kruna', 'Dvor', 'Prijesto', 'Kraljevina']
  ),
  'Istorija-Srednje': buildAllowedNodes(
    ['Staro', 'Prastaro', 'Davno'],
    ['Savremeno', 'Novo', 'Moderno'],
    ['Renesansa', 'Antika', 'Civilizacija', 'Spomenik']
  ),
  'Istorija-Tesko': buildAllowedNodes(
    ['Dogovor', 'Ugovor', 'Nagodba'],
    ['Sukob', 'Rat', 'Raskid'],
    ['Diplomatija', 'Pregovori', 'Ambasada', 'Savez']
  ),
  'Priroda-Lako': buildAllowedNodes(
    ['Vrucina', 'Vrelina', 'Zagrijanost'],
    ['Hladnoca', 'Studen', 'Led'],
    ['Sunce', 'Ljeto', 'Vatra', 'Energija']
  ),
  'Priroda-Srednje': buildAllowedNodes(
    ['Primorje', 'Zal', 'Obalni pojas'],
    ['Pucina', 'Dubina', 'Otvoreno more'],
    ['More', 'Pijesak', 'Luka', 'Talas']
  ),
  'Priroda-Tesko': buildAllowedNodes(
    ['Izlivanje', 'Eksplozija', 'Provala'],
    ['Mirovanje', 'Tisina', 'Zatisje'],
    ['Vulkan', 'Lava', 'Krater', 'Pepeo']
  ),
  'Umjetnost-Lako': buildAllowedNodes(
    ['Melodija', 'Harmonija', 'Zvuk'],
    ['Tisina', 'Muk', 'Bezvucnost'],
    ['Simfonija', 'Orkestar', 'Nota', 'Ritam']
  ),
  'Umjetnost-Srednje': buildAllowedNodes(
    ['Oblik', 'Silueta', 'Forma'],
    ['Praznina', 'Bezoblicnost', 'Prazan prostor'],
    ['Skulptura', 'Crtez', 'Tijelo', 'Vajar']
  ),
  'Umjetnost-Tesko': buildAllowedNodes(
    ['Prostornost', 'Udaljenost', 'Slojevitost'],
    ['Plitkost', 'Ravnina', 'Spljostenost'],
    ['Perspektiva', 'Linije', 'Slika', 'Horizont']
  ),
  'Tehnologija-Lako': buildAllowedNodes(
    ['Softver', 'Aplikacija', 'Sistem'],
    ['Kvar', 'Prekid', 'Bag'],
    ['Kod', 'Racunar', 'Robot', 'Algoritam']
  ),
  'Tehnologija-Srednje': buildAllowedNodes(
    ['Racunanje', 'Zakljucivanje', 'Analiza'],
    ['Haos', 'Nelogicnost', 'Slucajnost'],
    ['Algoritam', 'Program', 'Odluka', 'Koraci']
  ),
  'Tehnologija-Tesko': buildAllowedNodes(
    ['Jezgro', 'Centralna jedinica', 'Cvoriste'],
    ['Kvar', 'Rucni rad', 'Analogno'],
    ['Mikrocip', 'Racunar', 'Takt', 'Ploca']
  ),
  'Geografija-Lako': buildAllowedNodes(
    ['Mapa', 'Plan', 'Prikaz'],
    ['Nepoznat teren', 'Dezorijentacija', 'Magla'],
    ['Atlas', 'Kompas', 'Ruta', 'Kontinent']
  ),
  'Geografija-Srednje': buildAllowedNodes(
    ['Ada', 'Otocic', 'Ostrvce'],
    ['Kopno', 'Kontinent', 'Poluostrvo'],
    ['Arhipelag', 'More', 'Obala', 'Luka']
  ),
  'Geografija-Tesko': buildAllowedNodes(
    ['Smjer', 'Kurs', 'Orijentacija'],
    ['Lutanje', 'Skretanje', 'Dezorijentacija'],
    ['Meridijan', 'Kompas', 'Putanja', 'Koordinate']
  ),
}

const relationStyles = {
  Sinonim: 'synonym-badge',
  Antonim: 'antonym-badge',
  Asocijacija: 'association-badge',
}

const normalizeWord = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const buildAllowedNodeIndex = (allowedNodes = {}) =>
  RELATION_OPTIONS.reduce(
    (accumulator, relation) => ({
      ...accumulator,
      [relation]: new Set((allowedNodes[relation] || []).map(normalizeWord)),
    }),
    {}
  )

const evaluateChain = (nodes, centerWord, difficulty, allowedNodes) => {
  const normalizedCenter = normalizeWord(centerWord)
  const allowedNodeIndex = buildAllowedNodeIndex(allowedNodes)
  const seenWords = new Set()
  const relationCounts = {
    Sinonim: 0,
    Antonim: 0,
    Asocijacija: 0,
  }

  const evaluatedNodes = nodes.map((node) => {
    const normalizedNodeWord = normalizeWord(node.word)
    const isDuplicate = seenWords.has(normalizedNodeWord)
    const isCenterWord = normalizedNodeWord === normalizedCenter
    const localSmartMatch = evaluateSmartWordChainCandidate({
      candidateWord: node.word,
      allowedWords: allowedNodes[node.relation] || [],
    })
    const isKnownRelation =
      Boolean(normalizedNodeWord) &&
      (allowedNodeIndex[node.relation]?.has(normalizedNodeWord) ||
        Boolean(localSmartMatch.accepted) ||
        Boolean(node.aiValidated))
    const accepted =
      Boolean(normalizedNodeWord) && !isDuplicate && !isCenterWord && Boolean(isKnownRelation)

    if (accepted) {
      seenWords.add(normalizedNodeWord)
      relationCounts[node.relation] += 1
    }

    return {
      ...node,
      accepted,
      reason: isCenterWord
        ? 'Ista rijec kao centralni pojam.'
        : isDuplicate
            ? 'Duplirana rijec.'
            : !isKnownRelation
              ? `Nije prepoznata kao dobra ${node.relation.toLowerCase()} veza za centralni pojam.`
              : node.aiValidated
                ? node.aiReason || 'AI je potvrdio da ova veza ima smisla.'
                : localSmartMatch.accepted
                  ? localSmartMatch.reason
                  : 'Validan cvor.',
    }
  })

  const validNodes = evaluatedNodes.filter((node) => node.accepted).length
  const representedRelations = RELATION_OPTIONS.filter((item) => relationCounts[item] > 0).length
  const hasMinimumNodes = validNodes >= 4
  const hasAllRelations = representedRelations === RELATION_OPTIONS.length
  const structureGoals = [
    validNodes >= 2,
    validNodes >= 4,
    relationCounts.Sinonim > 0,
    relationCounts.Antonim > 0,
    relationCounts.Asocijacija > 0,
  ]

  const completedGoals = structureGoals.filter(Boolean).length
  const accuracy = Math.round((completedGoals / structureGoals.length) * 100)
  const earnedPoints = calculateWordChainReward({
    difficulty,
    validNodes,
    representedRelations,
    hasMinimumNodes,
    hasAllRelations,
    accuracy,
  })

  return {
    evaluatedNodes,
    relationCounts,
    validNodes,
    hasMinimumNodes,
    hasAllRelations,
    accuracy,
    earnedPoints,
    missingGoals: [
      !hasMinimumNodes ? 'Dodaj najmanje 4 razlicita cvora.' : null,
      relationCounts.Sinonim === 0 ? 'Nedostaje makar jedan sinonim.' : null,
      relationCounts.Antonim === 0 ? 'Nedostaje makar jedan antonim.' : null,
      relationCounts.Asocijacija === 0 ? 'Nedostaje makar jedna asocijacija.' : null,
    ].filter(Boolean),
  }
}

function WordChainPage() {
  const navigate = useNavigate()
  const token = getAuthToken()
  const aiEvaluationEnabled = import.meta.env.VITE_ENABLE_AI_EVALUATION === 'true'
  const activeSession = getActiveSession()
  const isSavedWordChainSession = activeSession?.type === 'word-chain'
  const selectedDifficulty = getDifficulty()
  const selectedCategory = getCategory()
  const difficulty = isSavedWordChainSession
    ? activeSession.sessionDifficulty || activeSession.difficulty || selectedDifficulty
    : selectedDifficulty
  const category = isSavedWordChainSession
    ? activeSession.sessionCategory || activeSession.category || selectedCategory
    : selectedCategory
  const chainPreset = getWordChainPreset(difficulty, category)
  const presetKey = category === 'Sve' ? `Priroda-${difficulty}` : `${category}-${difficulty}`
  const allowedNodes = CHAIN_ALLOWED_NODES[presetKey] || CHAIN_ALLOWED_NODES['Priroda-Srednje']

  const [centerWord] = useState(
    isSavedWordChainSession
      ? activeSession.centerWord || chainPreset.centerWord
      : chainPreset.centerWord
  )
  const [nodes, setNodes] = useState(
    isSavedWordChainSession ? activeSession.nodes || chainPreset.starterNodes : chainPreset.starterNodes
  )
  const [newWord, setNewWord] = useState(
    isSavedWordChainSession ? activeSession.newWord || '' : ''
  )
  const [relation, setRelation] = useState(
    isSavedWordChainSession ? activeSession.relation || 'Asocijacija' : 'Asocijacija'
  )
  const [chainMessage, setChainMessage] = useState('')
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [startedAt] = useState(
    isSavedWordChainSession
      ? activeSession.startedAt || new Date().toISOString()
      : new Date().toISOString()
  )

  const chainEvaluation = useMemo(
    () => evaluateChain(nodes, centerWord, difficulty, allowedNodes),
    [allowedNodes, centerWord, difficulty, nodes]
  )
  const canFinishChain = chainEvaluation.hasMinimumNodes && chainEvaluation.hasAllRelations

  const helpSections = [
    {
      title: 'Cilj igre',
      text: 'Napravi smislen lanac oko centralne rijeci koristeci sinonime, antonime i asocijacije.',
    },
    {
      title: 'Kako igras',
      items: [
        'Dodaj razlicite rijeci koje stvarno odgovaraju centralnom pojmu.',
        'Svaki cvor mora biti oznacen kao sinonim, antonim ili asocijacija.',
        'Za dobar rezultat ciljaj najmanje 4 validna cvora.',
      ],
    },
    {
      title: 'Sta donosi vise XP',
      items: [
        'Vise validnih cvorova.',
        'Bar jedan sinonim, jedan antonim i jedna asocijacija.',
        'Balansiran lanac bez duplikata i besmislenih unosa.',
      ],
    },
  ]

  useEffect(() => {
    saveActiveSession({
      type: 'word-chain',
      centerWord,
      nodes,
      newWord,
      relation,
      sessionCategory: category,
      sessionDifficulty: difficulty,
      startedAt,
    })
  }, [category, centerWord, difficulty, newWord, nodes, relation, startedAt])

  const handleAddNode = async () => {
    const trimmedWord = newWord.trim()
    const normalizedWord = normalizeWord(trimmedWord)

    if (!trimmedWord) {
      setChainMessage('Unesi rijec prije nego sto je dodas u lanac.')
      return
    }

    if (normalizedWord === normalizeWord(centerWord)) {
      setChainMessage('Nova rijec ne moze biti ista kao centralni pojam.')
      return
    }

    if (nodes.some((item) => normalizeWord(item.word) === normalizedWord)) {
      setChainMessage('Ta rijec je vec dodata u lanac.')
      return
    }

    let aiValidated = false
    let aiReason = ''
    const localSmartMatch = evaluateSmartWordChainCandidate({
      candidateWord: trimmedWord,
      allowedWords: allowedNodes[relation] || [],
    })

    if (
      !buildAllowedNodeIndex(allowedNodes)[relation]?.has(normalizedWord) &&
      !localSmartMatch.accepted
    ) {
      if (token && aiEvaluationEnabled) {
        try {
          const aiEvaluation = await evaluateAiWordChainNodeRequest(token, {
            centerWord,
            candidateWord: trimmedWord,
            relation,
            category,
            difficulty,
            relationExamples: allowedNodes[relation] || [],
          })

          if (aiEvaluation.available && aiEvaluation.accepted) {
            aiValidated = true
            aiReason = aiEvaluation.reason || 'AI je potvrdio da ova veza ima smisla.'
          } else {
            setChainMessage(
              aiEvaluation.reason ||
                localSmartMatch.reason ||
                `Ta rijec nije prepoznata kao dobra ${relation.toLowerCase()} veza za "${centerWord}".`
            )
            return
          }
        } catch {
          setChainMessage(
            localSmartMatch.reason ||
              `Ta rijec nije prepoznata kao dobra ${relation.toLowerCase()} veza za "${centerWord}".`
          )
          return
        }
      } else {
        setChainMessage(
          localSmartMatch.reason ||
            `Ta rijec nije prepoznata kao dobra ${relation.toLowerCase()} veza za "${centerWord}".`
        )
        return
      }
    }

    const newNode = {
      id: `${Date.now()}-${trimmedWord}`,
      word: trimmedWord,
      relation,
      aiValidated,
      aiReason,
    }

    setNodes((prev) => [...prev, newNode])
    setNewWord('')
    setRelation('Asocijacija')
    setChainMessage('')
  }

  const handleRemoveNode = (id) => {
    setNodes((prev) => prev.filter((item) => item.id !== id))
    setChainMessage('')
  }

  const handleClearChain = () => {
    setNodes(chainPreset.starterNodes)
    setChainMessage('')
  }

  const handleFinish = async () => {
    if (!nodes.length) {
      setChainMessage('Dodaj makar jednu rijec prije zavrsetka lanca.')
      return
    }

    if (!canFinishChain) {
      setChainMessage(`Lanac jos nije spreman: ${chainEvaluation.missingGoals.join(' ')}`)
      return
    }

    const answers = chainEvaluation.evaluatedNodes.map((node) => ({
      prompt: centerWord,
      answer: `${node.relation}: ${node.word}`,
      accepted: node.accepted,
      relation: node.relation,
      roundDifficulty: difficulty,
    }))

    const elapsedMs = new Date().getTime() - new Date(startedAt).getTime()
    const seconds = Math.max(1, Math.floor(elapsedMs / 1000))
    const currentUser = getCurrentUser()
    const performanceBonus = calculatePerformanceBonus({
      difficulty,
      total: Math.max(nodes.length, 4),
      correct: chainEvaluation.validNodes,
      time: seconds,
      hintCount: 0,
      type: 'word-chain',
    })
    const finalEarnedPoints = chainEvaluation.earnedPoints + performanceBonus

    const result = {
      type: 'word-chain',
      score: finalEarnedPoints,
      earnedPoints: finalEarnedPoints,
      performanceBonus,
      total: Math.max(nodes.length, 4),
      correct: chainEvaluation.validNodes,
      accuracy: chainEvaluation.accuracy,
      time: seconds,
      category,
      difficulty,
      answers,
    }

    const historyEntry = {
      type: 'word-chain',
      score: finalEarnedPoints,
      earnedPoints: result.earnedPoints,
      awardedPoints: result.earnedPoints,
      roundScore: finalEarnedPoints,
      performanceBonus,
      total: Math.max(nodes.length, 4),
      correct: chainEvaluation.validNodes,
      accuracy: chainEvaluation.accuracy,
      time: seconds,
      category,
      difficulty,
      username: currentUser?.username,
      hintCount: 0,
      isDaily: false,
      answers,
    }

    const submission = {
      gameType: 'Lanac rijeci',
      content: `${centerWord} -> ${nodes
        .map((item) => `${item.relation}:${item.word}`)
        .join(', ')}`,
      points: result.earnedPoints,
      time: seconds,
      isDaily: false,
    }

    const syncResult = await syncCompletedGame({ historyEntry, submission })
    const finalHistoryEntry = syncResult.historyEntry

    saveLastResult({
      ...result,
      score: finalHistoryEntry.score ?? result.score,
      earnedPoints: finalHistoryEntry.earnedPoints ?? result.earnedPoints,
      performanceBonus: finalHistoryEntry.performanceBonus ?? result.performanceBonus,
      total: finalHistoryEntry.total ?? result.total,
      correct: finalHistoryEntry.correct ?? result.correct,
      accuracy: finalHistoryEntry.accuracy ?? result.accuracy,
      time: finalHistoryEntry.time ?? result.time,
      dailyReward: finalHistoryEntry.dailyReward || 0,
      awardedPoints: finalHistoryEntry.awardedPoints || result.earnedPoints,
    })

    clearActiveSession()
    navigate('/results')
  }

  return (
    <div className="screen">
      <div className="phone-card app-shell">
        <Navbar
          title="Lanac rijeci"
          showBack
          rightText="!"
          onRightClick={() => setShowHelpModal(true)}
        />

        <div className="page-content word-chain-page">
          <div className="tag-row">
            <span className="tag purple-light">{category}</span>
            <span className="tag neutral">{difficulty}</span>
          </div>

          <div className="chain-stats-row">
            <div className="chain-stat-box">
              <small>VALIDNI CVOROVI</small>
              <strong>{chainEvaluation.validNodes}</strong>
            </div>

            <div className="chain-stat-box">
              <small>PROCJENJENI XP</small>
              <strong>{chainEvaluation.earnedPoints}</strong>
            </div>
          </div>

          <div className="chain-board">
            <div className="chain-center-card">
              <small className="center-mini-icon">CENTAR</small>
              <h2>{centerWord}</h2>
            </div>

            <div className="chain-guide-card">
              <strong>Kako radi</strong>
              <p>
                Napravi smislenu mrezu oko centralne rijeci. Dobar lanac ima razlicite
                pojmove, najmanje 4 cvora i bar po jedan sinonim, antonim i asocijaciju.
              </p>
              <div className="profile-info-box">
                <p>
                  <strong>Sinonim:</strong> unesi rijec koja je po znacenju bliska centru.
                </p>
                <p>
                  <strong>Antonim:</strong> unesi rijec koja ide kao suprotnost centru.
                </p>
                <p>
                  <strong>Asocijacija:</strong> unesi pojam koji se logicno veze za centar.
                </p>
              </div>
              {chainEvaluation.missingGoals.length > 0 ? (
                <ul className="chain-goal-list">
                  {chainEvaluation.missingGoals.map((goal) => (
                    <li key={goal}>{goal}</li>
                  ))}
                </ul>
              ) : (
                <p className="chain-good-state">Lanac je trenutno dobro izbalansiran.</p>
              )}
            </div>

            <div className="chain-nodes-grid">
              {chainEvaluation.evaluatedNodes.map((node) => (
                <div className="chain-node-card" key={node.id}>
                  <span className={`relation-badge ${relationStyles[node.relation]}`}>
                    {node.relation}
                  </span>

                  <h3>{node.word}</h3>
                  <p className={`chain-node-status ${node.accepted ? 'ok' : 'bad'}`}>
                    {node.reason}
                  </p>

                  <div className="node-actions">
                    <button
                      type="button"
                      className="node-action-btn delete"
                      onClick={() => handleRemoveNode(node.id)}
                    >
                      Obrisi
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="legend-box">
              <strong>Pregled veza</strong>

              <div className="legend-item">
                <span className="legend-dot green"></span>
                <span>Sinonim: {chainEvaluation.relationCounts.Sinonim}</span>
              </div>

              <div className="legend-item">
                <span className="legend-dot red"></span>
                <span>Antonim: {chainEvaluation.relationCounts.Antonim}</span>
              </div>

              <div className="legend-item">
                <span className="legend-dot yellow"></span>
                <span>Asocijacija: {chainEvaluation.relationCounts.Asocijacija}</span>
              </div>
            </div>

            <div className="chain-add-panel">
              <label htmlFor="word-chain-input">Dodaj rijec</label>
              <input
                id="word-chain-input"
                name="wordChainInput"
                type="text"
                placeholder="Dodaj novu povezanu rijec"
                value={newWord}
                onChange={(event) => setNewWord(event.target.value)}
              />

              <label htmlFor="word-chain-relation">Tip veze</label>
              <select
                id="word-chain-relation"
                name="wordChainRelation"
                className="styled-select"
                value={relation}
                onChange={(event) => setRelation(event.target.value)}
              >
                {RELATION_OPTIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              {chainMessage ? <p className="error chain-inline-error">{chainMessage}</p> : null}

              <button className="primary-btn full-btn" onClick={handleAddNode} type="button">
                Dodaj u lanac
              </button>
            </div>
          </div>

          <div className="chain-footer-actions">
            <button className="secondary-btn" type="button" onClick={handleClearChain}>
              Ocisti lanac
            </button>

            <button className="primary-btn" onClick={handleFinish} type="button">
              Zavrsi lanac
            </button>
          </div>
        </div>

        <GameHelpModal
          open={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          title="Lanac rijeci"
          subtitle="Povezi centralni pojam kroz sto smisleniju mrezu rijeci."
          sections={helpSections}
          footer="Pregled primera ispod centralne kartice moze ti pomoci da odrzis lanac dobro izbalansiranim."
        />
      </div>
    </div>
  )
}

export default WordChainPage
