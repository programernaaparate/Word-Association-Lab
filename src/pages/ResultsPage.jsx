import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import Navbar from '../components/Navbar'
import { buildResultBadges, getDifficultyMultiplier } from '../utils/gameRewards'
import { getCurrentUser, getLastResult, getLevelProgress } from '../utils/storage'
import { getLevelTheme } from '../utils/levelTheme'

function ResultsPage() {
  const navigate = useNavigate()
  const result = getLastResult()
  const currentUser = getCurrentUser()

  const accuracy = result?.accuracy ?? 80
  const correct = result?.correct ?? 0
  const total = result?.total ?? 0
  const time = result?.time ?? 0
  const type = result?.type ?? 'association'
  const answers = result?.answers ?? []
  const dailyReward = result?.dailyReward ?? 0
  const hintCount = result?.hintCount ?? 0
  const difficulty = result?.difficulty || 'Lako'
  const category = result?.category || 'Sve'
  const performanceBonus = Math.max(0, result?.performanceBonus ?? 0)
  const wrongAttempts = Math.max(0, Number(result?.wrongAttempts ?? 0) || 0)
  const partialCount = Math.max(0, Number(result?.partialCount ?? 0) || 0)
  const totalUserPoints = currentUser?.points ?? 0
  const levelData = getLevelProgress(totalUserPoints)
  const levelTheme = getLevelTheme(levelData.level)
  const earnedPoints = Math.max(0, result?.earnedPoints ?? 0)
  const totalAwardedPoints = earnedPoints + dailyReward
  const displayScore = Math.max(0, result?.awardedPoints ?? totalAwardedPoints)
  const difficultyMultiplier = getDifficultyMultiplier(difficulty)
  const earnedBadges = buildResultBadges(result)
  const hasAnyCorrectAnswer = correct > 0
  const hasAnyPartialAnswer =
    partialCount > 0 || answers.some((item) => Boolean(item.partialAccepted))
  const hasSubmittedAnswer = answers.some(
    (item) => item.answer && item.answer.trim() && item.answer !== '(bez odgovora)'
  )
  const resultTitle = hasAnyCorrectAnswer
    ? 'Svaka cast!'
    : hasAnyPartialAnswer
      ? 'Blizu si'
    : hasSubmittedAnswer
      ? 'Pokusaj ponovo'
      : 'Nema unesenog odgovora'
  const resultSubtitle = hasAnyCorrectAnswer
    ? 'Zavrsio si tip igre:'
    : hasAnyPartialAnswer
      ? 'Odgovor je bio povezan, ali ne i najprecizniji za tip igre:'
    : hasSubmittedAnswer
      ? 'Ova partija nije imala tacan odgovor za tip igre:'
      : 'Partija je zavrsena bez unesenog odgovora za tip igre:'

  const minutes = String(Math.floor(time / 60)).padStart(2, '0')
  const seconds = String(time % 60).padStart(2, '0')

  let formattedType = 'Asocijacije'
  if (type === 'logic') {
    formattedType = 'Logicki test'
  } else if (type === 'logic-odd-one-out') {
    formattedType = 'Ne pripada'
  } else if (type === 'relation') {
    formattedType = 'Sinonim / Antonim'
  } else if (type === 'word-chain') {
    formattedType = 'Lanac rijeci'
  }

  const handleRetry = () => {
    if (type === 'logic' || type === 'logic-odd-one-out') {
      navigate('/logic-challenge')
      return
    }

    if (type === 'word-chain') {
      navigate('/word-chain')
      return
    }

    if (type === 'relation') {
      navigate('/relation-game')
      return
    }

    navigate('/association-game')
  }

  const getAnswerPrompt = (item) => {
    const prompt = String(item?.prompt || '').trim()
    if (prompt) {
      return prompt
    }

    const solution = String(item?.solution || '').trim()
    if (solution) {
      return solution
    }

    return formattedType
  }

  return (
    <div className="screen">
      <div className="phone-card app-shell">
        <Navbar title="Rezultati" rightText="X" onRightClick={() => navigate('/home')} />

        <div className="page-content results-page">
          <div className="results-desktop-layout">
            <aside className="results-sidebar">
              <div className="result-circle-wrap">
                <div className="result-circle">
                  <span className="result-score">{displayScore}</span>
                  <small>XP</small>
                </div>
                <div className="xp-pill">+{totalAwardedPoints} XP</div>
              </div>

              <div className="results-headline">
                <h2 className="results-title">{resultTitle}</h2>
                <p className="muted center-text">
                  {resultSubtitle} <strong>{formattedType}</strong>
                  {result?.isDaily ? ' - Dnevni izazov' : ''}
                </p>
              </div>

              <div className="mini-stats-grid results-stats-grid">
                <div className="mini-stat-card">
                  <small>VRIJEME</small>
                  <strong>
                    {minutes}:{seconds}
                  </strong>
                </div>

                <div className="mini-stat-card">
                  <small>TACNOST</small>
                  <strong>{accuracy}%</strong>
                </div>

                <div className="mini-stat-card">
                  <small>TACNIH</small>
                  <strong>
                    {correct}/{total}
                  </strong>
                </div>
              </div>
            </aside>

            <section className="results-main">
              <div className="section-row">
                <h3 className="section-title">REZIME ODGOVORA</h3>
                <span className="link-text">Poslednja partija</span>
              </div>

              <div className="answer-cards">
                {answers.length > 0 ? (
                  answers.slice(0, 3).map((item, index) => (
                    <div
                      className="answer-card"
                      key={`${getAnswerPrompt(item)}-${item.answer}-${index}`}
                    >
                      <small>TRAGOVI / POJAM</small>
                      <strong>{getAnswerPrompt(item)}</strong>
                      <small>TVOJ ODGOVOR</small>
                      <span
                        className={
                          item.accepted
                            ? ''
                            : item.partialAccepted
                              ? 'link-text'
                              : item.accepted === false
                                ? 'wrong-text'
                                : ''
                        }
                      >
                        {item.answer}
                      </span>
                      {item.partialAccepted ? (
                        <>
                          <small>PROCJENA</small>
                          <span>Djelimicno tacno</span>
                        </>
                      ) : null}
                      {item.solution ? (
                        <>
                          <small>TACNO RJESENJE</small>
                          <span>{item.solution}</span>
                        </>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="answer-card">
                      <small>TIP IGRE</small>
                      <strong>{formattedType}</strong>
                      <small>UKUPNO</small>
                      <span>{total}</span>
                    </div>

                    <div className="answer-card">
                      <small>TACNIH</small>
                      <strong>{correct}</strong>
                      <small>TACNOST</small>
                      <span>{accuracy}%</span>
                    </div>

                    <div className="answer-card">
                      <small>VRIJEME</small>
                      <strong>
                        {minutes}:{seconds}
                      </strong>
                      <small>XP</small>
                      <span>{displayScore}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="badges-card">
                <h3>OSVOJENI BEDZEVI</h3>
                <div className="badge-row">
                  {earnedBadges.map((badge) => (
                    <div className="badge-item" key={badge.key}>
                      <div className={`badge-circle ${badge.tone}`}></div>
                      <span>{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`level-card level-hero-card ${levelTheme.tier}`}>
                <div className="section-row">
                  <h3>Nivo progres</h3>
                  <span>
                    {levelData.currentXp} / {levelData.neededXp} XP
                  </span>
                </div>

                <div className="level-progress">
                  <span style={{ width: `${levelData.progressPercent}%` }}></span>
                </div>

                <p className="muted small-text">
                  Jos {levelData.remainingXp} XP do sledeceg nivoa.
                </p>
              </div>

              <div className="profile-info-box">
                <p><strong>Kategorija:</strong> {category}</p>
                <p><strong>Izabrana tezina:</strong> {difficulty}</p>
                <p><strong>Tezinski bonus:</strong> x{difficultyMultiplier.toFixed(2)}</p>
                <p><strong>Netacnih pokusaja:</strong> {wrongAttempts}</p>
                <p><strong>Djelimicno tacnih:</strong> {partialCount}</p>
                <p><strong>Iskoriscenih hintova:</strong> {hintCount}</p>
                <p><strong>Zaradjen XP u partiji:</strong> +{earnedPoints}</p>
                <p><strong>Bonus performansi:</strong> +{performanceBonus}</p>
                <p><strong>Bonus dnevnog izazova:</strong> +{dailyReward}</p>
                <p><strong>Ukupni poeni korisnika:</strong> {totalUserPoints}</p>
              </div>

              <div className="results-actions">
                <button className="secondary-btn" onClick={handleRetry} type="button">
                  Pokusaj ponovo
                </button>

                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => navigate('/home')}
                >
                  Nazad
                </button>
              </div>

              <button
                className="primary-btn full-btn"
                onClick={() => navigate('/home')}
                type="button"
              >
                Nastavi
              </button>
            </section>
          </div>
        </div>

        <BottomNav current="history" />
      </div>
    </div>
  )
}

export default ResultsPage
