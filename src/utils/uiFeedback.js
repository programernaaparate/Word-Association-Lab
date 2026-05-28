const SOUND_ENABLED_KEY = 'wal:sound-enabled'
const FIRST_RUN_TIP_PREFIX = 'wal:first-run-tip:'

let sharedAudioContext = null

const canUseBrowserApis = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const getAudioContext = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext

  if (!AudioContextClass) {
    return null
  }

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContextClass()
  }

  return sharedAudioContext
}

const scheduleTone = (context, { frequency, duration = 0.08, delay = 0, gain = 0.035, type = 'sine' }) => {
  const oscillator = context.createOscillator()
  const gainNode = context.createGain()
  const startAt = context.currentTime + delay
  const endAt = startAt + duration

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, startAt)
  gainNode.gain.setValueAtTime(0.0001, startAt)
  gainNode.gain.linearRampToValueAtTime(gain, startAt + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt)

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)
  oscillator.start(startAt)
  oscillator.stop(endAt + 0.02)
}

const playSequence = async (tones = []) => {
  if (!getSoundEnabled()) {
    return
  }

  const context = getAudioContext()

  if (!context) {
    return
  }

  if (context.state === 'suspended') {
    try {
      await context.resume()
    } catch {
      return
    }
  }

  tones.forEach((tone) => {
    scheduleTone(context, tone)
  })
}

export const getSoundEnabled = () => {
  if (!canUseBrowserApis()) {
    return true
  }

  const savedValue = window.localStorage.getItem(SOUND_ENABLED_KEY)
  return savedValue === null ? true : savedValue === 'true'
}

export const saveSoundEnabled = (enabled) => {
  if (!canUseBrowserApis()) {
    return enabled
  }

  window.localStorage.setItem(SOUND_ENABLED_KEY, String(Boolean(enabled)))
  return Boolean(enabled)
}

export const playSuccessSound = () =>
  playSequence([
    { frequency: 660, duration: 0.07, gain: 0.03, type: 'triangle' },
    { frequency: 880, duration: 0.09, delay: 0.07, gain: 0.04, type: 'triangle' },
  ])

export const playErrorSound = () =>
  playSequence([
    { frequency: 240, duration: 0.09, gain: 0.03, type: 'sawtooth' },
    { frequency: 180, duration: 0.11, delay: 0.06, gain: 0.025, type: 'sawtooth' },
  ])

export const playHintSound = () =>
  playSequence([
    { frequency: 520, duration: 0.05, gain: 0.02, type: 'sine' },
    { frequency: 620, duration: 0.06, delay: 0.04, gain: 0.02, type: 'sine' },
  ])

export const playCelebrateSound = () =>
  playSequence([
    { frequency: 523, duration: 0.08, gain: 0.03, type: 'triangle' },
    { frequency: 659, duration: 0.09, delay: 0.08, gain: 0.035, type: 'triangle' },
    { frequency: 784, duration: 0.12, delay: 0.17, gain: 0.04, type: 'triangle' },
  ])

const buildFirstRunTipKey = (key = '') => `${FIRST_RUN_TIP_PREFIX}${key}`

export const shouldShowFirstRunTip = (key = '') => {
  if (!canUseBrowserApis() || !key) {
    return false
  }

  return window.localStorage.getItem(buildFirstRunTipKey(key)) !== 'dismissed'
}

export const dismissFirstRunTip = (key = '') => {
  if (!canUseBrowserApis() || !key) {
    return
  }

  window.localStorage.setItem(buildFirstRunTipKey(key), 'dismissed')
}
