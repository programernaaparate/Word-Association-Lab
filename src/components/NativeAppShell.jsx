import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
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
    SplashScreen.hide().catch(() => {})

    return () => {
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
