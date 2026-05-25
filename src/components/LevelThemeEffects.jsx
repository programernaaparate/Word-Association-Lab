import { useEffect, useMemo, useState } from 'react'
import AppIcon from './AppIcon'
import { getLevelTheme, getLevelThemeClass } from '../utils/levelTheme'

const THEME_CLASSES = [
  'level-theme-rookie',
  'level-theme-rising',
  'level-theme-elite',
  'level-theme-master',
]

function LevelThemeEffects({ currentUser }) {
  const currentLevel = Math.max(1, Number(currentUser?.level || 1))
  const theme = useMemo(() => getLevelTheme(currentLevel), [currentLevel])
  const themeClassName = useMemo(() => getLevelThemeClass(currentLevel), [currentLevel])
  const [levelToast, setLevelToast] = useState(null)

  useEffect(() => {
    document.body.classList.remove(...THEME_CLASSES)
    document.body.classList.add(themeClassName)

    return () => {
      document.body.classList.remove(themeClassName)
    }
  }, [themeClassName])

  useEffect(() => {
    if (!currentUser?.id) {
      return undefined
    }

    const storageKey = `wal:last-seen-level:${currentUser.id}`
    const previousLevel = Number(localStorage.getItem(storageKey) || 0)

    if (!previousLevel) {
      localStorage.setItem(storageKey, String(currentLevel))
      return undefined
    }

    if (currentLevel <= previousLevel) {
      localStorage.setItem(storageKey, String(currentLevel))
      return undefined
    }

    const previousTheme = getLevelTheme(previousLevel)
    const unlockedTheme = previousTheme.tier !== theme.tier

    const openToastTimeoutId = window.setTimeout(() => {
      setLevelToast({
        level: currentLevel,
        title: theme.title,
        unlockedTheme,
      })
    }, 0)

    localStorage.setItem(storageKey, String(currentLevel))

    const timeoutId = window.setTimeout(() => {
      setLevelToast(null)
    }, 4200)

    return () => {
      window.clearTimeout(openToastTimeoutId)
      window.clearTimeout(timeoutId)
    }
  }, [currentLevel, currentUser?.id, theme])

  if (!levelToast) {
    return null
  }

  return (
    <div className={`level-up-toast ${levelToast.unlockedTheme ? 'milestone' : ''}`}>
      <div className="level-up-toast-icon">
        <AppIcon name={levelToast.unlockedTheme ? 'trophy' : 'lab'} size={18} />
      </div>

      <div className="level-up-toast-text">
        <strong>Novi nivo {levelToast.level}</strong>
        <span>{levelToast.title}</span>
        {levelToast.unlockedTheme ? <small>Otkljucan je novi vizuelni stil.</small> : null}
      </div>
    </div>
  )
}

export default LevelThemeEffects
