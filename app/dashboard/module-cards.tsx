'use client'
import { useState } from 'react'

const MODULES = [
  { label: 'Incidentes',     sub: 'Registro y despacho',    icon: '⬡' },
  { label: 'Reportes',       sub: 'Diario y estadístico',   icon: '⬡' },
  { label: 'Catálogos',      sub: 'Tipos y sectores',       icon: '⬡' },
  { label: 'Administración', sub: 'Usuarios y permisos',    icon: '⬡' },
]

function ModuleCard({ label, sub, icon }: { label: string; sub: string; icon: string }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border:     `1px solid ${hover ? '#d4a43a' : '#1b2742'}`,
        background: hover ? 'rgba(212,164,58,0.05)' : '#0b1220',
        padding:    '24px 20px',
        position:   'relative',
        cursor:     'pointer',
        transition: 'border-color .2s ease, background .2s ease, box-shadow .2s ease',
        boxShadow:  hover ? '0 0 0 1px rgba(212,164,58,0.2), 0 8px 24px rgba(0,0,0,0.4)' : 'none',
        transform:  hover ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Barra dorada superior */}
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
        fontFamily:    'JetBrains Mono,monospace',
        fontSize:      20,
        color:         hover ? '#d4a43a' : '#2a3a5e',
        marginBottom:  12,
        transition:    'color .2s ease',
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
        color:         hover ? '#d4a43a' : '#2a3a5e',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        transition:    'color .2s ease',
      }}>
        En construcción
      </div>
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
