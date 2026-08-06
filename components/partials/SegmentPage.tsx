import Link from 'next/link'
import type { ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Segmento de página (tabs de navegación/estado) — estilo tablón de despacho.
//
// REGLA DE DISEÑO: toda vista con navegación por segmentos usa este componente
// (ver bóveda → Convenciones → "Segmento de Página (SegmentPage)"). No
// reimplementar el patrón inline (botones con borde + accent).
//
//   <SegmentPage
//     tabs={[
//       { key: 'pendientes', label: 'Pendientes', icon: <AlertTriangle size={13} />, count: 4, accent: '#b45309' },
//       { key: 'finalizadas', label: 'Finalizadas', icon: <CheckCircle2 size={13} />, count: 2, accent: '#15803d' },
//     ]}
//     activeKey={tab}
//     onChange={setTab}
//   />
//
// Navegación por URL (server-safe) en vez de estado local: cada tab puede
// llevar `href` → se renderiza un <Link> en vez de un <button>.
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
      style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: 0, marginBottom }}
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
                fontFamily: 'Inter', fontSize: 10, fontWeight: 700,
                background: activo ? 'rgba(255,255,255,.2)' : '#f1f5f9',
                color: activo ? '#ffffff' : '#64748b',
                padding: '0 7px', borderRadius: 8, lineHeight: '18px',
              }}>
                {t.count}
              </span>
            )}
          </>
        )
        const estilo: React.CSSProperties = {
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px clamp(14px, 4vw, 24px)',
          fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14,
          letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0,
          border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all .15s',
          background: activo ? accent : '#ffffff',
          color: activo ? '#ffffff' : '#64748b',
          borderBottom: activo ? `2px solid ${accent}` : '2px solid transparent',
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
