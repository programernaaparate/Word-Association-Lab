import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const location = useLocation()

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !('scrollRestoration' in window.history)) {
      return undefined
    }

    const previousValue = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previousValue
    }
  }, [])

  useLayoutEffect(() => {
    const resetScrollPosition = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      document.querySelectorAll('.screen, .page-content').forEach((element) => {
        element.scrollTop = 0
      })
    }

    resetScrollPosition()
    const frameId = window.requestAnimationFrame(resetScrollPosition)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [location.pathname])

  return null
}

export default ScrollToTop
