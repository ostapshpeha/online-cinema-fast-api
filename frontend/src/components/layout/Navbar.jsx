import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const CartIcon = ({ count }) => (
  <div className="relative">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.6A1 1 0 006.6 20H19" />
      <circle cx="9" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
    </svg>
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-700 text-white text-[10px] font-bold
        rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 leading-none">
        {count > 99 ? '99+' : count}
      </span>
    )}
  </div>
)

const BellIcon = ({ hasUnread }) => (
  <div className="relative">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    {hasUnread && (
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[#070608]" />
    )}
  </div>
)

export default function Navbar({ cartCount = 0, hasUnread = false }) {
  const { user, isAuthenticated, isModerator, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery]       = useState(searchParams.get('search') || '')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('search', query.trim())
    navigate(`/?${params.toString()}`)
  }

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate('/login')
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-50"
      style={{ background: 'rgba(7,6,8,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>

      {/* Bottom gradient line instead of flat border */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(200,16,46,0.35) 30%, rgba(200,16,46,0.5) 50%, rgba(200,16,46,0.35) 70%, transparent 100%)',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-700 group-hover:text-red-500 transition-colors" style={{ flexShrink: 0 }}>
            <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M7 3v18M17 3v18M2 8h3M2 12h3M2 16h3M19 8h3M19 12h3M19 16h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '0.05em', lineHeight: 1 }}>
            <span className="text-white group-hover:text-white/90 transition-colors">CINEMA</span>
            <span style={{ color: 'var(--color-accent)' }}>HUB</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies…"
              className="w-full rounded-full pl-4 pr-10 py-2 text-sm
                text-[#f0eff4] placeholder-[#4d4c60]
                focus:outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onFocus={e => {
                e.target.style.background = 'rgba(255,255,255,0.08)'
                e.target.style.borderColor = 'rgba(200,16,46,0.5)'
              }}
              onBlur={e => {
                e.target.style.background = 'rgba(255,255,255,0.05)'
                e.target.style.borderColor = 'rgba(255,255,255,0.07)'
              }}
            />
            <button type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d4c60] hover:text-red-500 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>

        {/* Right nav */}
        <nav className="flex items-center gap-0.5 ml-auto shrink-0">
          <NavLink to="/">Movies</NavLink>

          {isAuthenticated && <NavLink to="/orders">Orders</NavLink>}

          {isAuthenticated ? (
            <>
              <Link to="/cart"
                className="p-2.5 text-[#8e8da0] hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <CartIcon count={cartCount} />
              </Link>

              <Link to="/notifications"
                className="p-2.5 text-[#8e8da0] hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <BellIcon hasUnread={hasUnread} />
              </Link>

              {/* Avatar */}
              <div className="relative ml-1" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-8 h-8 rounded-full text-white text-xs font-bold
                    flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #c8102e 0%, #8b0a1e 100%)',
                    boxShadow: menuOpen ? '0 0 0 2px rgba(200,16,46,0.6)' : '0 0 0 0px transparent',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(200,16,46,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = menuOpen ? '0 0 0 2px rgba(200,16,46,0.6)' : '0 0 0 0px transparent'}
                >
                  {initials}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden"
                    style={{
                      background: 'rgba(19,18,32,0.95)',
                      border: '1px solid rgba(37,35,54,0.8)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                    }}>
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(37,35,54,0.8)' }}>
                      <p className="text-[10px] text-[#4d4c60] uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm text-[#f0eff4] truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <DropLink to="/profile"      onClick={() => setMenuOpen(false)}>Profile</DropLink>
                      <DropLink to="/orders"       onClick={() => setMenuOpen(false)}>My Orders</DropLink>
                      {isModerator && (
                        <DropLink to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</DropLink>
                      )}
                    </div>
                    <div className="py-1" style={{ borderTop: '1px solid rgba(37,35,54,0.8)' }}>
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400
                          hover:bg-red-600/10 hover:text-red-300 transition-colors">
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"
                className="px-4 py-1.5 text-sm text-[#8e8da0] hover:text-white transition-colors rounded-lg hover:bg-white/5">
                Sign in
              </Link>
              <Link to="/register"
                className="btn-cinema px-5 py-2 text-sm ml-1">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function NavLink({ to, children }) {
  return (
    <Link to={to}
      className="hidden sm:block px-3 py-1.5 text-sm text-[#8e8da0] hover:text-white transition-colors rounded-lg hover:bg-white/5">
      {children}
    </Link>
  )
}

function DropLink({ to, onClick, children }) {
  return (
    <Link to={to} onClick={onClick}
      className="block px-4 py-2 text-sm text-[#f0eff4] hover:bg-white/5 transition-colors">
      {children}
    </Link>
  )
}
