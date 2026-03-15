import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getMovies, getGenres } from '../api/movies'
import MovieCard from '../components/movies/MovieCard'
import Pagination from '../components/ui/Pagination'
import { useAuth } from '../context/AuthContext'

const LIMIT = 20

const SORT_OPTIONS = [
  { value: '',            label: 'Relevance' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'year_desc',  label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
]

// ─── guest landing ────────────────────────────────────────────────────────────
function GuestHero() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: 'calc(100vh - 4rem)' }}>

      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary red glow */}
        <div style={{
          position: 'absolute', top: '35%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(200,16,46,0.14) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />
        {/* Gold warmth at bottom */}
        <div style={{
          position: 'absolute', bottom: '10%', left: '40%',
          width: '500px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        {/* Horizontal scan line */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(200,16,46,0.12) 30%, rgba(200,16,46,0.2) 50%, rgba(200,16,46,0.12) 70%, transparent 100%)',
        }} />
      </div>

      {/* Decorative left strip */}
      <div className="absolute left-0 top-0 bottom-0 pointer-events-none overflow-hidden"
        style={{ width: 'clamp(48px, 8vw, 120px)' }}>
        {['hsl(0,55%,12%)', 'hsl(220,45%,10%)', 'hsl(45,50%,8%)', 'hsl(170,40%,8%)', 'hsl(280,45%,10%)', 'hsl(15,50%,11%)'].map((bg, i) => (
          <div key={i} style={{ height: '18%', background: bg, marginBottom: '2px', opacity: 0.7, filter: 'blur(1px)' }} />
        ))}
      </div>

      {/* Decorative right strip */}
      <div className="absolute right-0 top-0 bottom-0 pointer-events-none overflow-hidden"
        style={{ width: 'clamp(48px, 8vw, 120px)' }}>
        {['hsl(195,50%,9%)', 'hsl(330,55%,11%)', 'hsl(85,40%,8%)', 'hsl(255,45%,10%)', 'hsl(25,50%,9%)', 'hsl(150,40%,8%)'].map((bg, i) => (
          <div key={i} style={{ height: '18%', background: bg, marginBottom: '2px', opacity: 0.7, filter: 'blur(1px)' }} />
        ))}
      </div>

      {/* Fade inward from strips */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(90deg, var(--color-bg-base) 0%, transparent 18%, transparent 82%, var(--color-bg-base) 100%)',
      }} />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-7"
        style={{ maxWidth: '720px' }}>

        {/* Eyebrow */}
        <p className="anim-fade-up text-[11px] tracking-[0.4em] uppercase font-medium"
          style={{ color: 'var(--color-gold)', letterSpacing: '0.4em' }}>
          ◆&nbsp;&nbsp;Premium Cinema Experience&nbsp;&nbsp;◆
        </p>

        {/* Headline */}
        <h1 className="anim-fade-up anim-d1"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(72px, 14vw, 148px)',
            lineHeight: 0.88,
            letterSpacing: '0.025em',
            color: '#f0eff4',
          }}>
          DISCOVER<br />
          <span style={{ color: 'var(--color-accent)' }}>YOUR NEXT</span><br />
          GREAT FILM
        </h1>

        {/* Tagline */}
        <p className="anim-fade-up anim-d2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: '1.05rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '400px',
            lineHeight: 1.7,
          }}>
          Thousands of films to own forever — from timeless classics to the latest releases.
        </p>

        {/* Divider rule */}
        <div className="anim-fade-up anim-d3 flex items-center gap-4 w-full" style={{ maxWidth: '320px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-border))' }} />
          <span style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            OWN FOREVER
          </span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--color-border), transparent)' }} />
        </div>

        {/* CTAs */}
        <div className="anim-fade-up anim-d4 flex flex-col sm:flex-row gap-3">
          <Link to="/register" className="btn-cinema px-10 py-3.5 text-sm">
            Start Watching
          </Link>
          <Link to="/login" className="btn-ghost px-10 py-3.5 text-sm">
            Sign In
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 anim-fade-up anim-d5
        flex flex-col items-center gap-2" style={{ opacity: 0.35 }}>
        <span style={{ fontSize: '9px', letterSpacing: '0.35em', color: 'var(--color-text-secondary)' }}>
          EXPLORE
        </span>
        <div className="anim-bounce">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            style={{ width: '14px', height: '14px', color: 'var(--color-text-secondary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─── skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}>
      <div className="aspect-[2/3]" style={{ background: 'var(--color-bg-elevated)', animation: 'pulseRing 1.8s ease-in-out infinite' }} />
      <div className="p-3 space-y-2">
        <div className="h-5 w-3/4 rounded" style={{ background: 'var(--color-bg-elevated)' }} />
        <div className="h-3 w-full rounded" style={{ background: 'var(--color-border)' }} />
        <div className="h-3 w-1/2 rounded" style={{ background: 'var(--color-border)' }} />
        <div className="flex justify-between items-center pt-1">
          <div className="h-4 w-10 rounded" style={{ background: 'var(--color-bg-elevated)' }} />
          <div className="h-7 w-20 rounded-lg" style={{ background: 'var(--color-bg-elevated)' }} />
        </div>
      </div>
    </div>
  )
}

// ─── genre chip bar ───────────────────────────────────────────────────────────
function GenreBar({ genres, activeId, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      <Chip active={!activeId} onClick={() => onChange(null)}>All</Chip>
      {genres.map((g) => (
        <Chip key={g.id} active={activeId === g.id} onClick={() => onChange(g.id)}>
          {g.name}
          <span className="ml-1 opacity-40 text-[10px]">{g.movie_count}</span>
        </Chip>
      ))}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap"
      style={active ? {
        background: 'var(--color-accent)',
        color: '#fff',
        boxShadow: '0 2px 12px rgba(200,16,46,0.4)',
      } : {
        background: 'rgba(255,255,255,0.04)',
        color: 'var(--color-text-secondary)',
        border: '1px solid var(--color-border)',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(200,16,46,0.4)'; e.currentTarget.style.color = '#f0eff4' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)' } }}
    >
      {children}
    </button>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const search  = searchParams.get('search')   || ''
  const sortBy  = searchParams.get('sort_by')  || ''
  const genreId = searchParams.get('genre_id') ? Number(searchParams.get('genre_id')) : null
  const page    = searchParams.get('page')     ? Number(searchParams.get('page')) : 1

  const [genres,  setGenres]  = useState([])
  const [movies,  setMovies]  = useState([])
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!isAuthenticated) return
    getGenres()
      .then(({ data }) => setGenres(data))
      .catch(() => {})
  }, [isAuthenticated])

  const fetchMovies = useCallback(() => {
    if (!isAuthenticated) return
    setLoading(true)
    setError(null)

    const params = {
      skip:  (page - 1) * LIMIT,
      limit: LIMIT,
      ...(search  && { search }),
      ...(sortBy  && { sort_by: sortBy }),
      ...(genreId && { genre_id: genreId }),
    }

    getMovies(params)
      .then(({ data }) => {
        setMovies(data.items ?? [])
        setTotal(data.total  ?? 0)
      })
      .catch(() => setError('Failed to load movies. Please try again.'))
      .finally(() => setLoading(false))
  }, [isAuthenticated, search, sortBy, genreId, page])

  useEffect(() => { fetchMovies() }, [fetchMovies])

  const totalPages = Math.ceil(total / LIMIT)

  function setParam(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value != null && value !== '') next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    })
  }

  function handlePageChange(p) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (p > 1) next.set('page', p)
      else next.delete('page')
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (authLoading) return null
  if (!isAuthenticated) return <GuestHero />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6 anim-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', letterSpacing: '0.04em', color: 'var(--color-text-primary)', lineHeight: 1 }}>
            {search ? `RESULTS FOR "${search.toUpperCase()}"` : 'BROWSE FILMS'}
          </h1>
          {!loading && (
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {total.toLocaleString()} {total === 1 ? 'title' : 'titles'}
            </p>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setParam('sort_by', e.target.value)}
          className="rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors cursor-pointer self-start sm:self-auto"
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Genre chips */}
      {genres.length > 0 && (
        <GenreBar genres={genres} activeId={genreId} onChange={(id) => setParam('genre_id', id)} />
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm"
          style={{ background: 'rgba(200,16,46,0.08)', border: '1px solid rgba(200,16,46,0.25)', color: '#f87171' }}>
          {error}{' '}
          <button onClick={fetchMovies} className="underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: LIMIT }, (_, i) => <SkeletonCard key={i} />)
          : movies.map((m) => <MovieCard key={m.id} movie={m} />)
        }
      </div>

      {/* Empty state */}
      {!loading && movies.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
            className="w-14 h-14" style={{ color: 'var(--color-border)' }}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
          </svg>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No titles found.</p>
          {(search || genreId || sortBy) && (
            <button
              onClick={() => setSearchParams({})}
              className="text-xs transition-colors"
              style={{ color: 'var(--color-accent)' }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
    </div>
  )
}
