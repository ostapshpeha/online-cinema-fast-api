import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addToCart, addLocalCartItem } from '../../api/cart'
import { useAuth } from '../../context/AuthContext'

// Deterministic poster gradient from movie id
const HUES = [0, 25, 200, 260, 290, 340, 160, 220]

function posterStyle(id) {
  const hue = HUES[id % HUES.length]
  return {
    background: `linear-gradient(160deg, hsl(${hue} 55% 11%) 0%, hsl(${hue} 25% 5%) 100%)`,
  }
}

function CartPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.6A1 1 0 006.6 20H19" />
      <circle cx="9" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m2-2H10" />
    </svg>
  )
}

export default function MovieCard({ movie, onAdded }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle')

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { navigate('/login'); return }
    if (status === 'adding' || status === 'added' || status === 'owned') return

    setStatus('adding')
    try {
      await addToCart(movie.id)
      addLocalCartItem(movie)
      setStatus('added')
      window.dispatchEvent(new CustomEvent('cinemahub:cart', { detail: { delta: 1 } }))
      onAdded?.()
      setTimeout(() => setStatus('idle'), 2200)
    } catch (err) {
      const detail = err?.response?.data?.detail ?? ''
      if (detail.toLowerCase().includes('already in cart')) {
        // Backend has it — sync localStorage and show as added
        addLocalCartItem(movie)
        setStatus('added')
        setTimeout(() => setStatus('idle'), 2200)
      } else if (detail.toLowerCase().includes('already bought') || detail.toLowerCase().includes('already purchased')) {
        setStatus('owned')
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 2200)
      }
    }
  }

  const primaryGenre = movie.genres?.[0]?.name ?? ''

  const btnLabel = { idle: 'Add to Cart', adding: 'Adding…', added: 'Added!', owned: 'You own this', error: 'Failed' }

  const btnStyle = {
    idle:   { background: 'var(--color-accent)', color: '#fff' },
    adding: { background: 'rgba(200,16,46,0.4)', color: 'rgba(255,255,255,0.6)', cursor: 'wait' },
    added:  { background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)', cursor: 'default' },
    owned:  { background: 'rgba(201,168,76,0.15)', color: 'var(--color-gold)', border: '1px solid rgba(201,168,76,0.25)', cursor: 'default' },
    error:  { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', cursor: 'default' },
  }

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="card-lift group relative flex flex-col rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}
    >
      {/* ── Poster ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '2/3', ...posterStyle(movie.id) }}>

        {/* Cert badge — top left */}
        {movie.certification && (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-bold rounded z-10"
            style={{
              background: 'rgba(0,0,0,0.65)',
              color: 'var(--color-text-secondary)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(4px)',
            }}>
            {movie.certification.name}
          </span>
        )}

        {/* IMDb badge — top right */}
        {movie.imdb && (
          <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded z-10 text-[11px] font-semibold"
            style={{
              background: 'rgba(0,0,0,0.65)',
              color: 'var(--color-gold)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(201,168,76,0.2)',
            }}>
            ★ {movie.imdb.toFixed(1)}
          </span>
        )}

        {/* Genre watermark */}
        {primaryGenre && (
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2
            text-[10px] font-medium tracking-widest uppercase whitespace-nowrap"
            style={{ color: 'rgba(255,255,255,0.15)' }}>
            {primaryGenre}
          </span>
        )}

        {/* Hover overlay — slides up from bottom */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 transition-all duration-350"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
            opacity: 0,
          }}
          ref={el => {
            if (!el) return
            const card = el.closest('.group')
            if (!card) return
            const show = () => { el.style.opacity = '1' }
            const hide = () => { el.style.opacity = '0' }
            card.addEventListener('mouseenter', show)
            card.addEventListener('mouseleave', hide)
          }}
        >
          <p className="text-xs line-clamp-4 leading-relaxed" style={{ color: 'rgba(240,239,244,0.8)' }}>
            {movie.description}
          </p>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 p-3 gap-2">

        {/* Title */}
        <h3 className="leading-tight line-clamp-2"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.05rem',
            letterSpacing: '0.03em',
            color: 'var(--color-text-primary)',
          }}>
          {movie.name}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
          <span>{movie.year}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{movie.time}m</span>
          {movie.genres?.length > 0 && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>{movie.genres[0].name}</span>
            </>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="font-bold" style={{ color: 'var(--color-gold)', fontSize: '0.95rem' }}>
            ${Number(movie.price).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{ ...btnStyle[status], transform: 'scale(1)' }}
            onMouseEnter={e => { if (status === 'idle') e.currentTarget.style.boxShadow = '0 4px 16px rgba(200,16,46,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
            onMouseDown={e => { if (status === 'idle') e.currentTarget.style.transform = 'scale(0.95)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            {status === 'idle' && <CartPlusIcon />}
            {btnLabel[status]}
          </button>
        </div>
      </div>
    </Link>
  )
}
