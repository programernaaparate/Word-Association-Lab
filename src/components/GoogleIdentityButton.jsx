import { useEffect, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
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
  const isNativePlatform = Capacitor.isNativePlatform()
  const [renderMode, setRenderMode] = useState(
    clientId && !isNativePlatform ? 'google' : 'fallback'
  )
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    credentialHandlerRef.current = onCredential
    errorHandlerRef.current = onError
  }, [onCredential, onError])

  useEffect(() => {
    if (!clientId || disabled || !containerRef.current || isNativePlatform) {
      return undefined
    }

    let cancelled = false

    const renderGoogleButton = async () => {
      try {
        setRenderMode('google')
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
          locale: 'sr',
          logo_alignment: 'center',
          width: containerRef.current.offsetWidth || 108,
        })

        window.setTimeout(() => {
          if (cancelled || !containerRef.current) {
            return
          }

          if (!containerRef.current.childElementCount) {
            setRenderMode('fallback')
            errorHandlerRef.current?.('Google prijava trenutno nije dostupna.')
          }
        }, 500)
      } catch (error) {
        setRenderMode('fallback')
        errorHandlerRef.current?.(error.message || 'Google prijava trenutno nije dostupna.')
      }
    }

    renderGoogleButton()

    return () => {
      cancelled = true
    }
  }, [clientId, compact, disabled, isNativePlatform, retryKey])

  const handleFallbackClick = () => {
    if (!clientId) {
      errorHandlerRef.current?.(
        'Google prijava jos nije konfigurirana. Dodaj Google Client ID u .env.'
      )
      return
    }

    if (isNativePlatform) {
      errorHandlerRef.current?.(
        'Google prijava u tester APK-u trenutno nije podrzana. Koristi korisnicko ime i lozinku.'
      )
      return
    }

    setRenderMode('google')
    setRetryKey((prev) => prev + 1)
  }

  if (!clientId || renderMode === 'fallback') {
    return (
      <button
        className={`google-auth-fallback-btn ${disabled ? 'disabled' : ''}`}
        type="button"
        onClick={handleFallbackClick}
        disabled={disabled}
      >
        <span className="google-auth-fallback-icon">
          <AppIcon name="google" size={18} />
        </span>
        <span className="google-auth-fallback-copy">
          {isNativePlatform
            ? 'Google prijava nije dostupna u testeru'
            : 'Nastavi sa Google'}
        </span>
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
