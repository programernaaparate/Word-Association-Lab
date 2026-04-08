const getRequiredEnvValue = (key) => {
  const value = String(process.env[key] || '').trim()

  if (!value) {
    throw new Error(`${key} mora biti postavljen u .env fajlu.`)
  }

  return value
}

export const getJwtSecret = () => {
  const secret = getRequiredEnvValue('JWT_SECRET')

  if (secret === 'change-this-secret') {
    throw new Error('JWT_SECRET ne smije ostati na podrazumijevanoj vrijednosti.')
  }

  return secret
}

export const assertRequiredServerEnv = () => {
  getJwtSecret()
}
