import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppIcon from '../components/AppIcon'
import GoogleIdentityButton from '../components/GoogleIdentityButton'
import { loginWithGoogleRequest, registerUserRequest } from '../utils/api'
import { saveAuthSession } from '../utils/storage'

function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (error) {
      setError('')
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()

    const cleanUsername = form.username.trim()
    const cleanPassword = form.password

    if (!cleanUsername || !cleanPassword) {
      setError('Unesite korisnicko ime i lozinku.')
      return
    }

    if (cleanPassword.length < 4) {
      setError('Lozinka mora imati najmanje 4 karaktera.')
      return
    }

    if (!/[A-Z]/.test(cleanPassword)) {
      setError('Lozinka mora imati bar jedno veliko slovo.')
      return
    }

    try {
      setIsSubmitting(true)

      const response = await registerUserRequest({
        username: cleanUsername,
        password: cleanPassword,
      })

      saveAuthSession({
        token: response.token,
        user: response.user,
      })

      navigate('/home')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async (credential) => {
    try {
      setIsSubmitting(true)
      setError('')

      const response = await loginWithGoogleRequest({ credential })

      saveAuthSession({
        token: response.token,
        user: response.user,
      })

      navigate('/home')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="screen auth-screen">
      <div className="phone-card auth-layout">
        <div className="auth-hero">
          <div className="brand-logo">
            <AppIcon name="lab" size={34} />
          </div>
          <h1>Word Association Lab</h1>
          <p>Napravi nalog i pokreni svoju prvu sesiju asocijacija.</p>
        </div>

        <div className="auth-form-wrap">
          <h2>Kreiraj nalog</h2>
          <p className="muted">Unesi osnovne podatke i udji u aplikaciju.</p>

          <form onSubmit={handleRegister} className="auth-form">
            <label htmlFor="register-username">KORISNICKO IME</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <AppIcon name="user" size={18} />
              </span>
              <input
                className="auth-input"
                id="register-username"
                name="username"
                type="text"
                placeholder="npr. danilo"
                value={form.username}
                onChange={(event) => handleChange('username', event.target.value)}
              />
            </div>

            <label htmlFor="register-password">LOZINKA</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <AppIcon name="lock" size={18} />
              </span>
              <input
                className="auth-input"
                id="register-password"
                name="password"
                type="password"
                placeholder="********"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="primary-btn full-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Registracija...' : 'Registruj se'}
            </button>
          </form>

          <Link to="/login" className="secondary-btn full-btn text-center auth-alt-link">
            Vec imam nalog
          </Link>

          <div className="divider">
            <span>ILI NASTAVI SA</span>
          </div>

          <div className="social-row">
            <GoogleIdentityButton
              onCredential={handleGoogleLogin}
              onError={setError}
              disabled={isSubmitting}
            />
            <button
              className="social-btn"
              type="button"
              aria-label="Apple prijava"
              onClick={() => setError('Apple prijava stize uskoro.')}
            >
              <AppIcon name="apple" size={22} />
            </button>
            <button
              className="social-btn"
              type="button"
              aria-label="Facebook prijava"
              onClick={() => setError('Facebook prijava stize uskoro.')}
            >
              <AppIcon name="facebook" size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
