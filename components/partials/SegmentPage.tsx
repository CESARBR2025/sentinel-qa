import Link from 'next/link'
import type { ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Segmento de página (tabs/segmentos de estado) — estilo pill Apple.
//
// REGLA DE DISEÑO: toda vista con navegación por segmentos usa este componente
// (ver DESIGN.md §4 → SegmentPage). No reimplementar el patrón inline.
//
//   <SegmentPage
//     tabs={[
//       { key: 'pendientes', label: 'Pendientes', icon: <AlertTriangle size={14} />, count: 4, accent: '#b45309' },
//       { key: 'finalizadas', label: 'Finalizadas', icon: <CheckCircle2 size={14} />, count: 2, accent: '#15803d' },
//     ]}
//     activeKey={tab}
//     onChange={setTab}
//   />
//
// Navegación por URL (server-safe) en vez de estado local: cada tab puede
// llevar `href` → se renderiza un <Link> en vez de un <button>.
// El contenedor no hace wrap — tira horizontal con scroll oculto (.scrollbar-hide).
// ─────────────────────────────────────────────────────────────────────────────

export interface SegmentPageTab {
  key: string
  label: string
  icon?: ReactNode
  count?: number
  accent?: string
  href?: string
}

interface SegmentPageProps {
  tabs: SegmentPageTab[]
  activeKey: string
  onChange?: (key: string) => void
  marginBottom?: number
}

const DEFAULT_ACCENT = '#1f355a'

export function SegmentPage({ tabs, activeKey, onChange, marginBottom = 24 }: SegmentPageProps) {
  return (
    <div
      className="scrollbar-hide"
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        gap: 6,
        marginBottom,
      }}
    >
      {tabs.map(t => {
        const activo = t.key === activeKey
        const accent = t.accent ?? DEFAULT_ACCENT
        const content = (
          <>
            {t.icon}
            {t.label}
            {t.count !== undefined && (
              <span style={{
                fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600,
                background: activo ? 'rgba(255,255,255,.22)' : '#e2e8f0',
                color: activo ? '#ffffff' : '#64748b',
                padding: '0 7px', borderRadius: 'var(--radius-full)', lineHeight: '18px',
              }}>
                {t.count}
              </span>
            )}
          </>
        )
        const estilo: React.CSSProperties = {
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px clamp(14px, 4vw, 20px)',
          fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 14,
          letterSpacing: 'normal', textTransform: 'none', whiteSpace: 'nowrap', flexShrink: 0,
          borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'all .2s',
          background: activo ? accent : '#f1f5f9',
          color: activo ? '#ffffff' : '#64748b',
        }

        if (t.href) {
          return (
            <Link key={t.key} href={t.href} style={{ ...estilo, textDecoration: 'none' }}>
              {content}
            </Link>
          )
        }

        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange?.(t.key)}
            style={estilo}
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}
