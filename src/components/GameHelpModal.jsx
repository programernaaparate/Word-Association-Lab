import { useEffect } from 'react'
import AppIcon from './AppIcon'

function GameHelpModal({
  open = false,
  title = '',
  subtitle = '',
  sections = [],
  footer = '',
  onClose,
}) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <div className="help-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="help-modal-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-help-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="help-modal-header">
          <div>
            <small>Kako se igra</small>
            <h2 id="game-help-modal-title">{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>

          <button
            type="button"
            className="help-modal-close"
            onClick={onClose}
            aria-label="Zatvori pomoc"
          >
            <AppIcon name="close" size={18} />
          </button>
        </div>

        <div className="help-modal-body">
          {sections.map((section) => (
            <div className="help-modal-section" key={section.title}>
              <strong>{section.title}</strong>
              {section.text ? <p>{section.text}</p> : null}
              {section.items?.length ? (
                <ul className="help-modal-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}

          {footer ? <div className="help-modal-note">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}

export default GameHelpModal
