import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const QUOTES = [
  { text: "Cinema is a mirror by which we often see ourselves.", author: "Martin Scorsese" },
  { text: "Film is a disease. When it infects your bloodstream, it takes over as the number one hormone.", author: "Frank Capra" },
  { text: "A story should have a beginning, a middle, and an end, but not necessarily in that order.", author: "Jean-Luc Godard" },
]

const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      const detail = err?.response?.data?.detail
      if (err?.response?.status === 403) {
        setError('Your account is not activated yet. Check your email.')
      } else {
        setError(detail || 'Incorrect email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 4rem)' }}>

      {/* ── Left atmospheric panel (hidden on small screens) ── */}
      <div className="hidden md:flex md:w-[46%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0f0710 0%, #070608 60%, #0d060a 100%)' }}>

        {/* Glow */}
        <div style={{
          position: 'absolute', top: '40%', left: '30%',
          transform: 'translate(-50%, -50%)',
          width: '500px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(200,16,46,0.1) 0%, transparent 65%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        {/* Top logo */}
        <Link to="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '0.06em', color: '#f0eff4', zIndex: 1 }}>
          CINEMA<span style={{ color: 'var(--color-accent)' }}>HUB</span>
        </Link>

        {/* Center quote */}
        <div className="relative z-10 space-y-6">
          <div style={{ width: '40px', height: '2px', background: 'var(--color-accent)' }} />
          <blockquote style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
            lineHeight: 1.5,
            color: '#f0eff4',
            maxWidth: '360px',
          }}>
            "{quote.text}"
          </blockquote>
          <cite style={{ fontStyle: 'normal', fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--color-gold)', display: 'block' }}>
            — {quote.author}
          </cite>
        </div>

        {/* Bottom decorative film strip */}
        <div className="relative z-10 flex gap-1" style={{ opacity: 0.15 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '36px',
              background: `hsl(${i * 45},50%,12%)`,
              borderRadius: '2px',
            }} />
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">

        {/* Mobile logo */}
        <div className="md:hidden mb-8 text-center">
          <Link to="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', letterSpacing: '0.06em', color: '#f0eff4' }}>
            CINEMA<span style={{ color: 'var(--color-accent)' }}>HUB</span>
          </Link>
        </div>

        <div className="w-full" style={{ maxWidth: '400px' }}>

          {/* Heading */}
          <div className="mb-8">
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '0.04em', color: '#f0eff4', lineHeight: 1 }}>
              SIGN IN
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Welcome back — your cinema awaits.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl px-4 py-3 text-sm"
              style={{ background: 'rgba(200,16,46,0.08)', border: '1px solid rgba(200,16,46,0.25)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <Field label="Email">
              <input
                type="email" required autoComplete="email" autoFocus
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-200"
                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(200,16,46,0.6)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              />
            </Field>

            {/* Password */}
            <Field
              label="Password"
              right={
                <Link to="/forgot-password"
                  className="text-xs transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-text-muted)' }}>
                  Forgot password?
                </Link>
              }
            >
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none transition-all duration-200"
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(200,16,46,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </Field>

            <button type="submit" disabled={loading}
              className="btn-cinema w-full py-3.5 text-sm mt-2"
              style={{ opacity: loading ? 0.65 : 1, cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register"
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--color-accent)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, right, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-medium uppercase tracking-wider"
          style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </label>
        {right}
      </div>
      {children}
    </div>
  )
}
