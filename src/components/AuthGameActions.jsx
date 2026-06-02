import { useMemo, useState } from 'react'
import AppIcon from './AppIcon'
import GameHelpModal from './GameHelpModal'

const AUTH_GAME_ACTIONS = [
  {
    id: 'how-to-play',
    eyebrow: 'Brzi vodic',
    icon: 'guide',
    label: 'Kako se igra',
    description: 'Pregled modova i ritma partije prije prvog ulaska.',
    title: 'Udji spreman u prvu rundu',
    subtitle: 'Svaki mod traje kratko, ali nagradjuje dobar tempo i precizne odgovore.',
    sections: [
      {
        title: 'Asocijacije',
        text: 'Povezi tragove sa skrivenim pojmom i juri sto bolju tacnost prije isteka vremena.',
      },
      {
        title: 'Logicki izazov i relacije',
        text: 'Prepoznaj uljeza, nadji zajednicki pojam ili objasni vezu izmedju dvije rijeci.',
      },
      {
        title: 'Lanac rijeci',
        text: 'Nastavljaj niz smisleno i bez zastoja. Dobar ritam donosi stabilan skor.',
      },
      {
        title: 'Najbolji start',
        items: [
          'Kreni od poznate kategorije i lakse tezine.',
          'Pomoc koristi samo kad zapnes, jer brzina pravi razliku.',
          'Jedna dobra kratka sesija je bolja od brzog nasumicnog klikanja.',
        ],
      },
    ],
    footer: 'Kad udjes u aplikaciju, mozes odmah birati mod koji ti najvise lezi.',
  },
  {
    id: 'points-and-levels',
    eyebrow: 'Napredak',
    icon: 'trophy',
    label: 'Poeni i nivoi',
    description: 'Sta dobijas kad igras redovno i zavrsavas dnevne izazove.',
    title: 'Svaka runda ti gradi profil',
    subtitle: 'Nalog nije samo za prijavu, vec i za cuvanje napretka kroz cijelu igru.',
    sections: [
      {
        title: 'Dnevni izazov',
        text: 'Svaki dan te ceka poseban zadatak sa bonus poenima kad ga zavrsis kako treba.',
      },
      {
        title: 'Level sistem',
        text: 'Osvojeni poeni pune XP progres i otvaraju osjecaj stalnog napretka iz runde u rundu.',
      },
      {
        title: 'Rang lista',
        text: 'Najbolji rezultati te guraju ka vrhu tabele i daju dodatni motiv za povratak.',
      },
      {
        title: 'Istorija partija',
        items: [
          'Rezultati ostaju sacuvani na profilu.',
          'Mozes pratiti formu i rast poena kroz vrijeme.',
          'Lakse vidis koji tip zadataka ti najvise odgovara.',
        ],
      },
    ],
    footer: 'Prijava ili registracija imaju smisla jer ti cuvaju skor, nivo i dnevni progres.',
  },
]

function AuthGameActions() {
  const [activeActionId, setActiveActionId] = useState('')

  const activeAction = useMemo(
    () => AUTH_GAME_ACTIONS.find((item) => item.id === activeActionId) || null,
    [activeActionId]
  )

  return (
    <>
      <div className="auth-actions-row">
        {AUTH_GAME_ACTIONS.map((action) => (
          <button
            key={action.id}
            className="auth-action-btn"
            type="button"
            onClick={() => setActiveActionId(action.id)}
          >
            <span className="auth-action-icon" aria-hidden="true">
              <AppIcon name={action.icon} size={18} />
            </span>

            <span className="auth-action-copy">
              <strong>{action.label}</strong>
              <small>{action.description}</small>
            </span>
          </button>
        ))}
      </div>

      <GameHelpModal
        open={Boolean(activeAction)}
        eyebrow={activeAction?.eyebrow || 'Brzi vodic'}
        title={activeAction?.title || ''}
        subtitle={activeAction?.subtitle || ''}
        sections={activeAction?.sections || []}
        footer={activeAction?.footer || ''}
        onClose={() => setActiveActionId('')}
      />
    </>
  )
}

export default AuthGameActions
