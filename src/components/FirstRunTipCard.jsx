import { useState } from 'react'
import { dismissFirstRunTip, shouldShowFirstRunTip } from '../utils/uiFeedback'

function FirstRunTipCard({
  storageKey = '',
  eyebrow = 'Brzi savjet',
  title = '',
  description = '',
  items = [],
  tone = 'blue',
  actionLabel = 'Razumijem',
}) {
  const [visible, setVisible] = useState(() => shouldShowFirstRunTip(storageKey))

  if (!visible) {
    return null
  }

  const handleDismiss = () => {
    dismissFirstRunTip(storageKey)
    setVisible(false)
  }

  return (
    <div className={`first-run-tip-card ${tone}`}>
      <div className="first-run-tip-copy">
        <small>{eyebrow}</small>
        <strong>{title}</strong>
        <p>{description}</p>
        {items.length ? (
          <ul className="first-run-tip-list">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <button className="tip-dismiss-btn" type="button" onClick={handleDismiss}>
        {actionLabel}
      </button>
    </div>
  )
}

export default FirstRunTipCard
