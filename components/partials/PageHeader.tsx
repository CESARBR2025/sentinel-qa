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
  fontFamily: 'var(--apple-font-display)',
  fontWeight: 600,
  fontSize: 'clamp(22px, 5vw, 32px)',
  letterSpacing: 'normal',
  textTransform: 'none',
  color: '#0f172a',
  margin: '0 0 4px',
}

export const pageHeaderSubtitleStyle: React.CSSProperties = {
  fontFamily: 'var(--apple-font-display)',
  fontWeight: 500,
  fontSize: 13,
  color: '#64748b',
  letterSpacing: 'normal',
  textTransform: 'none',
  margin: 0,
  wordBreak: 'break-word',
}

const btnBase: React.CSSProperties = {
  fontFamily: 'var(--apple-font-display)',
  fontWeight: 600,
  fontSize: 14,
  letterSpacing: 'normal',
  textTransform: 'none',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-block',
  borderRadius: 'var(--radius-lg)',
}

const btnPrimario: React.CSSProperties = {
  ...btnBase,
  padding: '10px 20px',
  background: '#0f172a',
  color: '#fff',
  border: 'none',
}

const btnSecundario: React.CSSProperties = {
  ...btnBase,
  padding: '10px 18px',
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
        marginBottom: 'clamp(20px, 5vw, 32px)',
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
