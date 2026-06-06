import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import AppIcon from './AppIcon'
import { hydrateNativeAppStorage } from '../utils/storage'

function MobileAppBootstrap({ children }) {
  const [isReady, setIsReady] = useState(!Capacitor.isNativePlatform())

  useEffect(() => {
    let isMounted = true

    const bootstrapNativeApp = async () => {
      if (!Capacitor.isNativePlatform()) {
        return
      }

      try {
        await hydrateNativeAppStorage()
      } finally {
        if (isMounted) {
          setIsReady(true)
        }
      }
    }

    bootstrapNativeApp()

    return () => {
      isMounted = false
    }
  }, [])

  if (isReady) {
    return children
  }

  return (
    <div className="screen auth-screen">
      <div className="phone-card auth-layout mobile-bootstrap-card">
        <div className="mobile-bootstrap-body">
          <div className="brand-logo">
            <AppIcon name="lab" size={34} />
          </div>
          <h1>Word Association Lab</h1>
          <p>Pripremamo Android aplikaciju i obnavljamo tvoju lokalnu sesiju.</p>
          <div className="page-loading-card mobile-bootstrap-status">
            Ucitavanje aplikacije...
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileAppBootstrap
