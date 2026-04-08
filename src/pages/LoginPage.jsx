import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppIcon from '../components/AppIcon'
import { loginUserRequest } from '../utils/api'
import { saveAuthSession } from '../utils/storage'

function LoginPage() {
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

  const handleLogin = async (event) => {
    event.preventDefault()

    const cleanUsername = form.username.trim()
    const cleanPassword = form.password

    if (!cleanUsername || !cleanPassword) {
      setError('Unesite korisnicko ime i lozinku.')
      return
    }

    try {
      setIsSubmitting(true)

      const response = await loginUserRequest({
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

  return (
    <div className="screen auth-screen">
      <div className="phone-card auth-layout">
        <div className="auth-hero">
          <div className="brand-logo">
            <AppIcon name="lab" size={34} />
          </div>
          <h1>Word Association Lab</h1>
          <p>Istrazuj moc rijeci i povezuj koncepte na kreativan nacin.</p>
        </div>

        <div className="auth-form-wrap">
          <h2>Dobrodosao nazad</h2>
          <p className="muted">Prijavi se i nastavi gdje si stao.</p>

          <form onSubmit={handleLogin} className="auth-form">
            <label htmlFor="login-username">KORISNICKO IME</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <AppIcon name="user" size={18} />
              </span>
              <input
                className="auth-input"
                id="login-username"
                name="username"
                type="text"
                placeholder="npr. danilo"
                value={form.username}
                onChange={(event) => handleChange('username', event.target.value)}
              />
            </div>

            <label htmlFor="login-password">LOZINKA</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <AppIcon name="lock" size={18} />
              </span>
              <input
                className="auth-input"
                id="login-password"
                name="password"
                type="password"
                placeholder="********"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="primary-btn full-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Prijava...' : 'Prijava'}
            </button>
          </form>

          <Link to="/register" className="secondary-btn full-btn text-center">
            Registracija
          </Link>

          <div className="divider">
            <span>ILI NASTAVI SA</span>
          </div>

          <div className="social-row">
            <button className="social-btn" type="button" aria-label="Google prijava">
              <AppIcon name="google" size={22} />
            </button>
            <button className="social-btn" type="button" aria-label="Apple prijava">
              <AppIcon name="apple" size={22} />
            </button>
            <button className="social-btn" type="button" aria-label="Facebook prijava">
              <AppIcon name="facebook" size={22} />
            </button>
          </div>

          <p className="legal-text">
            Koriscenjem aplikacije prihvatas uslove koriscenja i rad sa lokalnim
            podacima u browseru.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
