import { BrowserRouter, HashRouter } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'

function AppRouter({ children }) {
  const Router = Capacitor.isNativePlatform() ? HashRouter : BrowserRouter
  return <Router>{children}</Router>
}

export default AppRouter
