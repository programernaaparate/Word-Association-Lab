import { useEffect, useRef } from 'react'
import AppIcon from './AppIcon'
import { getGoogleClientId, loadGoogleIdentityScript } from '../utils/googleAuth'

function GoogleIdentityButton({
  onCredential,
  onError,
  disabled = false,
  compact = true,
}) {
  const containerRef = useRef(null)
  const credentialHandlerRef = useRef(onCredential)
  const errorHandlerRef = useRef(onError)
  const clientId = getGoogleClientId()

  useEffect(() => {
    credentialHandlerRef.current = onCredential
    errorHandlerRef.current = onError
  }, [onCredential, onError])

  useEffect(() => {
    if (!clientId || disabled || !containerRef.current) {
      return undefined
    }

    let cancelled = false

    const renderGoogleButton = async () => {
      try {
        const google = await loadGoogleIdentityScript()

        if (cancelled || !containerRef.current || !google?.accounts?.id) {
          return
        }

        containerRef.current.innerHTML = ''

        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            const credential = String(response?.credential || '').trim()

            if (!credential) {
              errorHandlerRef.current?.('Google nije vratio validan credential.')
              return
            }

            credentialHandlerRef.current?.(credential)
          },
        })

        google.accounts.id.renderButton(containerRef.current, {
          type: compact ? 'icon' : 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          logo_alignment: 'center',
          width: containerRef.current.offsetWidth || 108,
        })
      } catch (error) {
        errorHandlerRef.current?.(error.message || 'Google prijava trenutno nije dostupna.')
      }
    }

    renderGoogleButton()

    return () => {
      cancelled = true
    }
  }, [clientId, compact, disabled])

  if (!clientId) {
    return (
      <button
        className="social-btn"
        type="button"
        onClick={() =>
          errorHandlerRef.current?.(
            'Google prijava jos nije konfigurirana. Dodaj Google Client ID u .env.'
          )
        }
      >
        <AppIcon name="google" size={22} />
      </button>
    )
  }

  return (
    <div
      className={`google-auth-button-host ${disabled ? 'disabled' : ''}`}
      ref={containerRef}
      aria-label="Google prijava"
    ></div>
  )
}

export default GoogleIdentityButton
