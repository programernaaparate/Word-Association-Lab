import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'

const ROOT_ROUTES = new Set(['/home', '/login', '/register'])

function NativeAppShell() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return undefined
    }

    document.body.classList.add('native-app')

    StatusBar.setStyle({ style: Style.Light }).catch(() => {})
    StatusBar.setBackgroundColor({ color: '#5D9CF6' }).catch(() => {})
    Keyboard.setResizeMode({ mode: 'body' }).catch(() => {})
    SplashScreen.hide().catch(() => {})

    const keyboardShowPromise = Keyboard.addListener('keyboardDidShow', (event) => {
      document.body.classList.add('keyboard-open')
      document.documentElement.style.setProperty(
        '--keyboard-height',
        `${Math.max(0, Number(event?.keyboardHeight || 0))}px`
      )
    })

    const keyboardHidePromise = Keyboard.addListener('keyboardDidHide', () => {
      document.body.classList.remove('keyboard-open')
      document.documentElement.style.setProperty('--keyboard-height', '0px')
    })

    return () => {
      keyboardShowPromise.then((listener) => listener.remove()).catch(() => {})
      keyboardHidePromise.then((listener) => listener.remove()).catch(() => {})
      document.documentElement.style.setProperty('--keyboard-height', '0px')
      document.body.classList.remove('keyboard-open')
      document.body.classList.remove('native-app')
    }
  }, [])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return undefined
    }

    const listenerPromise = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      const currentPath = location.pathname || '/home'

      if (!ROOT_ROUTES.has(currentPath) && canGoBack) {
        navigate(-1)
        return
      }

      if (!ROOT_ROUTES.has(currentPath)) {
        navigate('/home', { replace: true })
        return
      }

      CapacitorApp.exitApp()
    })

    return () => {
      listenerPromise.then((listener) => listener.remove()).catch(() => {})
    }
  }, [location.pathname, navigate])

  return null
}

export default NativeAppShell
