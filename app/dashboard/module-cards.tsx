'use client'
import { useState } from 'react'
import Link from 'next/link'

type Module = { label: string; sub: string; icon: string; href?: string }

const MODULES: Module[] = [
  { label: 'Prevención del Delito', sub: 'Atención a víctimas · Jurídico', icon: '⬡', href: '/prevencion/medidas' },
  { label: 'Incidentes',            sub: 'Registro y despacho',             icon: '⬡' },
  { label: 'Reportes',              sub: 'Diario y estadístico',            icon: '⬡' },
  { label: 'Catálogos',             sub: 'Tipos y sectores',                icon: '⬡' },
  { label: 'Administración',        sub: 'Usuarios y permisos',             icon: '⬡' },
]

function ModuleCard({ label, sub, icon, href }: Module) {
  const [hover, setHover] = useState(false)

  const inner = (
    <>
      <div style={{
        position:   'absolute',
        top:        -1,
        left:       0,
        width:      hover ? 64 : 32,
        height:     2,
        background: '#d4a43a',
        transition: 'width .2s ease',
      }}/>

      <div style={{
        fontFamily:   'JetBrains Mono,monospace',
        fontSize:     20,
        color:        hover ? '#d4a43a' : '#2a3a5e',
        marginBottom: 12,
        transition:   'color .2s ease',
      }}>
        {icon}
      </div>

      <div style={{
        fontFamily:    'Barlow Condensed,sans-serif',
        fontWeight:    700,
        fontSize:      18,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color:         hover ? '#ffffff' : '#d8e0f0',
        marginBottom:  4,
        transition:    'color .2s ease',
      }}>
        {label}
      </div>

      <div style={{
        fontFamily:    'JetBrains Mono,monospace',
        fontSize:      10,
        color:         hover ? '#7f8faf' : '#4a5878',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        transition:    'color .2s ease',
      }}>
        {sub}
      </div>

      <div style={{
        marginTop:     16,
        fontFamily:    'JetBrains Mono,monospace',
        fontSize:      10,
        color:         hover ? (href ? '#4a9e6a' : '#d4a43a') : (href ? '#2a6a3e' : '#2a3a5e'),
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        transition:    'color .2s ease',
      }}>
        {href ? 'Acceder →' : 'En construcción'}
      </div>
    </>
  )

  const sharedStyle: React.CSSProperties = {
    border:      `1px solid ${hover ? '#d4a43a' : '#1b2742'}`,
    background:  hover ? 'linear-gradient(180deg, rgba(212,164,58,0.08) 0%, rgba(11,18,32,0) 100%)' : '#0b1220',
    padding:     '28px 24px',
    position:    'relative',
    cursor:      href ? 'pointer' : 'default',
    transition:  'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
    boxShadow:   hover ? 'inset 0 0 0 1px rgba(212,164,58,0.15), 0 12px 32px rgba(0,0,0,0.5)' : 'none',
    transform:   hover && href ? 'translateY(-4px)' : 'translateY(0)',
    textDecoration: 'none',
    display:     'flex',
    flexDirection: 'column',
    minHeight:   '150px',
  }

  if (href) {
    return (
      <Link
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={sharedStyle}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={sharedStyle}
    >
      {inner}
    </div>
  )
}

export function ModuleCards() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16, marginBottom:32 }}>
      {MODULES.map(m => <ModuleCard key={m.label} {...m} />)}
    </div>
  )
}
