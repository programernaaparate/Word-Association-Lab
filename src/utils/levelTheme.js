const clampLevel = (level = 1) => Math.max(1, Number(level || 1))

export const getLevelTheme = (level = 1) => {
  const safeLevel = clampLevel(level)

  if (safeLevel >= 10) {
    return {
      tier: 'master',
      title: 'Majstor laboratorije',
      accentLabel: 'Zlatna faza',
    }
  }

  if (safeLevel >= 6) {
    return {
      tier: 'elite',
      title: 'Elitni asocijator',
      accentLabel: 'Elitna faza',
    }
  }

  if (safeLevel >= 3) {
    return {
      tier: 'rising',
      title: 'Povezivac u usponu',
      accentLabel: 'Faza uspona',
    }
  }

  return {
    tier: 'rookie',
    title: 'Lab istrazivac',
    accentLabel: 'Pocetna faza',
  }
}

export const getLevelThemeClass = (level = 1) => `level-theme-${getLevelTheme(level).tier}`
