export default function Footer() {
  return (
    <footer className="mt-auto relative" style={{ background: 'rgba(7,6,8,0.85)', backdropFilter: 'blur(12px)' }}>
      {/* Top gradient line */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(200,16,46,0.25) 25%, rgba(200,16,46,0.45) 50%, rgba(200,16,46,0.25) 75%, transparent 100%)',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '0.06em' }}>
            <span style={{ color: '#f0eff4' }}>CINEMA</span>
            <span style={{ color: 'var(--color-accent)' }}>HUB</span>
          </span>
          <span style={{ width: '1px', height: '14px', background: 'var(--color-border)', display: 'inline-block' }} />
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}>
            Your cinema, anytime.
          </span>
        </div>

        {/* Copyright + film strip dots */}
        <div className="flex items-center gap-3">
          {/* Decorative film strip */}
          <div className="hidden sm:flex gap-1 items-center" style={{ opacity: 0.3 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{
                width: i % 2 === 0 ? '7px' : '3px',
                height: '3px',
                borderRadius: '1px',
                background: 'var(--color-text-muted)',
              }} />
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} CinemaHub
          </p>
        </div>
      </div>
    </footer>
  )
}
