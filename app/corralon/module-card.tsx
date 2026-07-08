'use client'

import { useState } from 'react'
import Link from 'next/link'

export function ModuleCard({ pendientesCount }: { pendientesCount: number }) {
  const [hover, setHover] = useState(false)

  return (
    <Link
      href="/corralon/solicitudes"
      style={{
        textDecoration: 'none',
        display: 'block',
        maxWidth: 500,
      }}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: '#ffffff',
          border: `1px solid ${hover ? '#d97706' : '#e2e8f0'}`,
          padding: 32,
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: hover ? '0 4px 12px rgba(217,119,6,0.15)' : 'none',
          transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: 32, height: 3, background: '#d97706' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            color: '#059669',
            letterSpacing: '0.1em',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', boxShadow: '0 0 8px rgba(5,150,105,0.4)' }}></span>
            ONLINE
          </span>
        </div>

        <div style={{
          fontFamily: 'Barlow Condensed,sans-serif',
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#0f172a',
          marginBottom: 8,
        }}>
          Liberación / Cierre de Vehículos
        </div>

        <div style={{
          fontFamily: 'JetBrains Mono,monospace',
          fontSize: 11,
          color: '#64748b',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 24,
        }}>
          Solicitudes de recepción de vehículos liberados
        </div>

        <div style={{
          display: 'flex',
          gap: 24,
          paddingTop: 16,
          borderTop: '1px solid #e2e8f0'
        }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
              Pendientes
            </div>
            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 700, color: '#d97706' }}>
              {pendientesCount}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 24,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          fontWeight: 600,
          color: '#d97706',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          ACCEDER →
        </div>
      </div>
    </Link>
  )
}
