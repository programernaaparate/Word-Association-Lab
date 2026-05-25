import AppIcon from '../components/AppIcon'
import BottomNav from '../components/BottomNav'
import Navbar from '../components/Navbar'

const gameGuides = [
  {
    icon: 'lab',
    title: 'Asocijacije',
    subtitle: 'Pogodi konacno rjesenje iz tragova i simbola.',
    points: [
      'Pokusaj da pogodis pojam sto ranije, sa manje otvorenih tragova.',
      'Otvaranje novih tragova i pomoc smanjuju osvajanje XP-a.',
      'Ako ne uneses odgovor, runda se zavrsava bez tacnog pogotka.',
    ],
  },
  {
    icon: 'logic',
    title: 'Zajednicki pojam',
    subtitle: 'Pronadji pojam koji povezuje ponudjene rijeci.',
    points: [
      'Upisi rijec ili pojam koji logicno spaja sve ponudjene pojmove.',
      'Velika i mala slova nijesu bitna, a prolaze i normalne varijacije odgovora.',
      'Kod moda Ne pripada biras klikom karticu koja ne pripada grupi.',
    ],
  },
  {
    icon: 'relation',
    title: 'Sinonim / Antonim / Asocijacija',
    subtitle: 'Odredi kakva je veza izmedju dvije rijeci.',
    points: [
      'Izaberi da li su rijeci sinonimi, antonimi ili samo smislena asocijacija.',
      'Pomoc moze da objasni odnos, ali smanjuje poene.',
      'Tacan odgovor brzo donosi vise XP-a nego spor i uz pomoc.',
    ],
  },
  {
    icon: 'chain',
    title: 'Lanac rijeci',
    subtitle: 'Gradi smislene veze oko centralne rijeci.',
    points: [
      'Dodaj rijeci koje imaju jasan odnos sa centrom ili postojecim cvorovima.',
      'Ne prolaze duplikati, ista rijec kao centar ili potpuno besmislene veze.',
      'Sto je lanac logicniji i raznovrsniji, to je rezultat bolji.',
    ],
  },
]

const scoringRules = [
  'Teze runde daju vise XP-a od lakih.',
  'Tacni odgovori, brzina i igra bez pomoci donose bonus.',
  'Pogresan odgovor moze da skine poene, a prazan odgovor ih ne dodaje.',
  'Daily challenge daje dodatni bonus samo jednom, kada je uspjesno zavrsen.',
]

const quickStartSteps = [
  'Izaberi tezinu i kategoriju na pocetnoj.',
  'Pokreni novu sesiju ili dnevni izazov.',
  'Odigraj rundu i proveri rezultate, XP i bedzeve.',
  'U Napretku i Profilu prati istoriju, nivo i najbolje partije.',
]

function GuidePage() {
  return (
    <div className="screen">
      <div className="phone-card app-shell">
        <Navbar title="Uputstvo" showBack />

        <div className="page-content guide-page">
          <section className="guide-hero-card">
            <div className="guide-hero-icon">
              <AppIcon name="guide" size={24} />
            </div>

            <div>
              <small>Kako se igra</small>
              <h2>Brzo uputstvo za cijelu aplikaciju</h2>
              <p>
                Ovdje imas kratko objasnjenje svakog moda, kako rade poeni, pomoc i
                dnevni izazov.
              </p>
            </div>
          </section>

          <section className="leaderboard-card">
            <div className="section-row">
              <h2>Brzi pocetak</h2>
              <span className="muted">4 koraka</span>
            </div>

            <div className="guide-steps">
              {quickStartSteps.map((step, index) => (
                <div className="guide-step-card" key={step}>
                  <span className="guide-step-index">{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="leaderboard-card">
            <div className="section-row">
              <h2>Modovi igre</h2>
              <span className="muted">Sta koji radi</span>
            </div>

            <div className="guide-grid">
              {gameGuides.map((guide) => (
                <article className="guide-game-card" key={guide.title}>
                  <div className="guide-game-head">
                    <div className="mini-icon soft-blue-box">
                      <AppIcon name={guide.icon} size={20} />
                    </div>

                    <div>
                      <h3>{guide.title}</h3>
                      <p>{guide.subtitle}</p>
                    </div>
                  </div>

                  <ul className="guide-list">
                    {guide.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="leaderboard-card">
            <div className="section-row">
              <h2>Poeni i napredak</h2>
              <span className="muted">XP, nivo i bonusi</span>
            </div>

            <div className="guide-info-stack">
              {scoringRules.map((rule) => (
                <div className="guide-info-row" key={rule}>
                  <AppIcon name="chart" size={18} />
                  <p>{rule}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="leaderboard-card">
            <div className="section-row">
              <h2>Pomoc i daily challenge</h2>
              <span className="muted">Bitne stvari</span>
            </div>

            <div className="guide-callout-grid">
              <div className="guide-callout guide-callout-blue">
                <strong>Pomoc i tragovi</strong>
                <p>
                  Kad otvoris pomoc ili dodatne tragove, to se racuna i smanjuje finalni
                  rezultat. Pomoc mozes da koristis jednom po rundi.
                </p>
              </div>

              <div className="guide-callout guide-callout-green">
                <strong>Dnevni izazov</strong>
                <p>
                  Daily se mijenja svaki dan u 12 AM i daje bonus samo ako je tacno
                  zavrsen. Kad je uspjesno odradjen, prikazuje se kao 100%.
                </p>
              </div>
            </div>
          </section>
        </div>

        <BottomNav current="home" />
      </div>
    </div>
  )
}

export default GuidePage
