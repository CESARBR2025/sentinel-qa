import Link from 'next/link'

// Sección "SSPM General" del dashboard: agrupa los catálogos base de la
// corporación (oficiales, patrullas). Solo se muestra a esAdmin — ver el uso
// en app/dashboard/page.tsx.
export function SspmGeneral() {
  return (
    <div className="cyber-reveal delay-1">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 4, height: 16, background: '#c0223a' }} />
        <h2
          style={{
            fontFamily: 'Barlow Condensed,sans-serif',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#0f172a',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          SSPM General
        </h2>
        <span
          style={{
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 9,
            color: '#94a3b8',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Administración de catálogos
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        <Link
          href="/dashboard/catalogos"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 160,
            padding: 24,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 2,
            textDecoration: 'none',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            transition: 'all 0.4s cubic-bezier(0.2,0.8,0.2,1)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 2,
              background: '#c0223a',
            }}
          />
          <div>
            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 30, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#0f172a' }}>
              Catálogos
            </div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 6, lineHeight: 1.4 }}>
              Oficiales y patrullas del parque vehicular
            </div>
          </div>
          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              fontWeight: 600,
              color: '#94a3b8',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginTop: 16,
            }}
          >
            ACCEDER →
          </div>
        </Link>
      </div>
    </div>
  )
}
