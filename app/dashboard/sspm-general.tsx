import Link from 'next/link'
import { FadeIn } from './fade-in'

// Sección "SSPM General" del dashboard: agrupa los catálogos base de la
// corporación (oficiales, patrullas). Solo se muestra a esAdmin — ver el uso
// en app/dashboard/page.tsx.
// Piloto Apple-style (DESIGN.md §10) — mismo lenguaje que el resto del hub.
export function SspmGeneral() {
  return (
    <FadeIn>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 4, height: 16, background: '#c0223a' }} />
        <h2
          style={{
            fontFamily: 'var(--apple-font-display)',
            fontSize: 22,
            fontWeight: 600,
            color: '#0f172a',
            margin: 0,
          }}
        >
          SSPM General
        </h2>
        <span
          style={{
            fontFamily: 'var(--apple-font-display)',
            fontSize: 13,
            color: '#64748b',
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
            background: 'var(--apple-glass-bg)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid var(--apple-glass-border)',
            borderRadius: 'var(--radius-xl)',
            textDecoration: 'none',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--apple-shadow-glass)',
            transition: 'all 0.3s ease-out',
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
            <div style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 30, color: '#0f172a' }}>
              Catálogos
            </div>
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', marginTop: 6, lineHeight: 1.4 }}>
              Oficiales y patrullas del parque vehicular
            </div>
          </div>
          <div
            style={{
              fontFamily: 'var(--apple-font-display)',
              fontSize: 13,
              fontWeight: 600,
              color: '#c0223a',
              marginTop: 16,
            }}
          >
            Acceder →
          </div>
        </Link>
      </div>
    </FadeIn>
  )
}
