import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'

const QUOTES = [
  { text: "Every great film should seem new every time you see it.", author: "Roger Ebert" },
  { text: "The cinema is not a craft. It is an art. It does not mean teamwork. One is always alone.", author: "François Truffaut" },
  { text: "Film is the art of the present tense.", author: "Orson Welles" },
]
const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

const RULES = [
  { label: 'At least 8 characters',       test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',         test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter',         test: (p) => /[a-z]/.test(p) },
  { label: 'One digit',                    test: (p) => /\d/.test(p) },
  { label: 'One special char (@$!%*?#&)',  test: (p) => /[@$!%*?#&]/.test(p) },
]

function StrengthHints({ password }) {
  if (!password) return null
  return (
    <ul className="mt-2 space-y-0.5">
      {RULES.map((r) => {
        const ok = r.test(password)
        return (
          <li key={r.label}
            className="flex items-center gap-1.5 text-[11px]"
            style={{ color: ok ? '#4ade80' : 'var(--color-text-muted)' }}>
            <span>{ok ? '✓' : '○'}</span>
            {r.label}
          </li>
        )
      })}
    </ul>
  )
}

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

export default function Register() {
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  const allRulesPass   = RULES.every((r) => r.test(password))
  const passwordsMatch = password === confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!allRulesPass)   { setError('Password does not meet the requirements below.'); return }
    if (!passwordsMatch) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      await register(email.trim(), password)
      setSuccess(true)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── success state ────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex items-center justify-center px-4 py-16" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="text-center space-y-6" style={{ maxWidth: '400px' }}>
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8" style={{ color: '#4ade80' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: '#f0eff4' }}>
              ACCOUNT CREATED
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              We sent an activation link to{' '}
              <span style={{ color: '#f0eff4', fontWeight: 500 }}>{email}</span>.
              Click the link to activate your account.
            </p>
          </div>
          <Link to="/login" className="btn-cinema inline-flex px-8 py-3 text-sm">
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  // ── form ─────────────────────────────────────────────────────────────────────
  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 4rem)' }}>

      {/* ── Left panel ── */}
      <div className="hidden md:flex md:w-[46%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a0710 0%, #070608 60%, #080a0d 100%)' }}>

        <div style={{
          position: 'absolute', top: '40%', left: '30%',
          transform: 'translate(-50%, -50%)',
          width: '500px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 65%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        <Link to="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '0.06em', color: '#f0eff4', zIndex: 1 }}>
          CINEMA<span style={{ color: 'var(--color-accent)' }}>HUB</span>
        </Link>

        <div className="relative z-10 space-y-6">
          <div style={{ width: '40px', height: '2px', background: 'var(--color-gold)' }} />
          <blockquote style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.3rem, 2.5vw, 1.65rem)',
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

        <div className="relative z-10 flex gap-1" style={{ opacity: 0.12 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '36px',
              background: `hsl(${i * 45 + 20},45%,11%)`,
              borderRadius: '2px',
            }} />
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-y-auto">

        {/* Mobile logo */}
        <div className="md:hidden mb-8 text-center">
          <Link to="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', letterSpacing: '0.06em', color: '#f0eff4' }}>
            CINEMA<span style={{ color: 'var(--color-accent)' }}>HUB</span>
          </Link>
        </div>

        <div className="w-full" style={{ maxWidth: '400px' }}>

          <div className="mb-8">
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '0.04em', color: '#f0eff4', lineHeight: 1 }}>
              CREATE ACCOUNT
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Join thousands of film lovers today.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl px-4 py-3 text-sm"
              style={{ background: 'rgba(200,16,46,0.08)', border: '1px solid rgba(200,16,46,0.25)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <FormField label="Email">
              <input
                type="email" required autoComplete="email" autoFocus
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-200"
                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(200,16,46,0.6)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              />
            </FormField>

            {/* Password */}
            <FormField label="Password">
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="new-password"
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
              <StrengthHints password={password} />
            </FormField>

            {/* Confirm */}
            <FormField label="Confirm Password">
              <input
                type={showPw ? 'text' : 'password'} required autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-200"
                style={{
                  background: 'var(--color-bg-elevated)',
                  border: `1px solid ${confirm && !passwordsMatch ? 'rgba(200,16,46,0.6)' : 'var(--color-border)'}`,
                  color: 'var(--color-text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = confirm && !passwordsMatch ? 'rgba(200,16,46,0.8)' : 'rgba(200,16,46,0.6)'}
                onBlur={e => e.target.style.borderColor = confirm && !passwordsMatch ? 'rgba(200,16,46,0.6)' : 'var(--color-border)'}
              />
              {confirm && !passwordsMatch && (
                <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>Passwords don't match.</p>
              )}
            </FormField>

            <button type="submit" disabled={loading}
              className="btn-cinema w-full py-3.5 text-sm mt-2"
              style={{ opacity: loading ? 0.65 : 1, cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--color-accent)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-medium uppercase tracking-wider"
        style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
