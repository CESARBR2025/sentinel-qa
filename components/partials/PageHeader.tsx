import Link from 'next/link'
import type { ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Encabezado de página (título + subtítulo a la izquierda, acciones a la derecha).
//
// REGLA DE DISEÑO: toda vista usa este componente (ver bóveda → Convenciones →
// "Encabezado de Página (PageHeader)"). No reimplementar el patrón inline.
//
//   <PageHeader
//     title="Gestión de"
//     accent="Oficiales"
//     subtitle="8 oficiales registrados"
//     actions={<>
//       <PageHeaderLink href="/dashboard/catalogos" variant="secondary">← Catálogos</PageHeaderLink>
//       <PageHeaderLink href="/dashboard/catalogos/oficiales/nuevo">+ Registrar Oficial</PageHeaderLink>
//     </>}
//   />
// ─────────────────────────────────────────────────────────────────────────────

export const pageHeaderTitleStyle: React.CSSProperties = {
  fontFamily: 'Barlow Condensed,sans-serif',
  fontWeight: 800,
  fontSize: 'clamp(22px, 6vw, 32px)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#0f172a',
  margin: '0 0 4px',
}

export const pageHeaderSubtitleStyle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono,monospace',
  fontSize: 10,
  color: '#64748b',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  margin: 0,
  wordBreak: 'break-word',
}

const btnBase: React.CSSProperties = {
  fontFamily: 'Barlow Condensed,sans-serif',
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-block',
}

const btnPrimario: React.CSSProperties = {
  ...btnBase,
  padding: '10px 24px',
  background: '#0f172a',
  color: '#fff',
  border: 'none',
}

const btnSecundario: React.CSSProperties = {
  ...btnBase,
  padding: '10px 20px',
  background: '#f1f5f9',
  color: '#475569',
  border: '1px solid #e2e8f0',
}

export function PageHeaderLink({
  href,
  variant = 'primary',
  children,
}: {
  href: string
  variant?: 'primary' | 'secondary'
  children: ReactNode
}) {
  return (
    <Link href={href} style={variant === 'primary' ? btnPrimario : btnSecundario}>
      {children}
    </Link>
  )
}

export function PageHeader({
  title,
  accent,
  accentColor = '#1f355a',
  subtitle,
  actions,
}: {
  title: string
  accent?: string
  accentColor?: string
  subtitle?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div
      style={{
        marginBottom: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        // Wrap siempre: en pantallas angostas el título y las acciones se
        // apilan en vez de desbordar. Parte de la regla responsive.
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div>
        <h2 style={pageHeaderTitleStyle}>
          {title}
          {accent && <span style={{ color: accentColor }}> {accent}</span>}
        </h2>
        {subtitle && <p style={pageHeaderSubtitleStyle}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  )
}
