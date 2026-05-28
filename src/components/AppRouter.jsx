import { BrowserRouter, HashRouter } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import ScrollToTop from './ScrollToTop'

function AppRouter({ children }) {
  const Router = Capacitor.isNativePlatform() ? HashRouter : BrowserRouter

  return (
    <Router>
      <ScrollToTop />
      {children}
    </Router>
  )
}

export default AppRouter
