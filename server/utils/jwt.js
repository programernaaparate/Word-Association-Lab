import jwt from 'jsonwebtoken'
import { getJwtSecret } from './env.js'

export const signUserToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  )
}
