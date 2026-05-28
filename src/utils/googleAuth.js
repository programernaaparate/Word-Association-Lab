const GOOGLE_SCRIPT_ID = 'google-identity-services-script'
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

let googleScriptPromise = null

export const getGoogleClientId = () =>
  String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()

export const loadGoogleIdentityScript = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Google prijava je dostupna samo u browseru.')
  }

  if (window.google?.accounts?.id) {
    return window.google
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(GOOGLE_SCRIPT_ID)

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.google), { once: true })
        existingScript.addEventListener(
          'error',
          () => reject(new Error('Google prijava trenutno nije dostupna.')),
          { once: true }
        )
        return
      }

      const script = document.createElement('script')
      script.id = GOOGLE_SCRIPT_ID
      script.src = GOOGLE_SCRIPT_SRC
      script.async = true
      script.defer = true
      script.onload = () => resolve(window.google)
      script.onerror = () => reject(new Error('Google prijava trenutno nije dostupna.'))
      document.head.appendChild(script)
    })
  }

  return googleScriptPromise
}
