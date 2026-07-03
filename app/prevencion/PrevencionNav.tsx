'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/prevencion/medidas', label: 'Medidas de Protección' },
  { href: '/prevencion/busquedas', label: 'Búsquedas / Alba' },
  { href: '/prevencion/juridico', label: 'Área Jurídica' },
]

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

const ScaleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
    <path d="M7 21h10"/>
    <path d="M12 3v18"/>
    <path d="M3 7h2c2 0 5-1 7-2 2-1 5-2 5-2"/>
    <path d="M17 7h2c2 0 5-1 7-2 2-1 5-2 5-2"/>
  </svg>
)

const ICONS = [<ShieldIcon />, <SearchIcon />, <ScaleIcon />]

interface Alertas { pendientes24h: number; vencidos: number }

export default function PrevencionNav() {
  const pathname = usePathname()
  const [alertas, setAlertas] = useState<Alertas>({ pendientes24h: 0, vencidos: 0 })

  useEffect(() => {
    async function fetchAlertas() {
      try {
        const res = await fetch('/api/prevencion/busquedas/alertas')
        if (res.ok) {
          const data = await res.json()
          setAlertas(data)
        }
      } catch { /* ignore */ }
    }
    fetchAlertas()
    const interval = setInterval(fetchAlertas, 60000) // cada 60s
    return () => clearInterval(interval)
  }, [])

  const totalAlertas = alertas.pendientes24h + alertas.vencidos

  return (
    <nav style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 48px', display: 'flex', gap: 0 }}>
      {NAV.map(({ href, label }, i) => {
        const isActive = pathname.startsWith(href)
        const showBadge = href === '/prevencion/busquedas' && totalAlertas > 0

        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 24px',
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: isActive ? '#2563eb' : '#64748b',
              textDecoration: 'none',
              borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
              transition: 'color 0.15s, border-color 0.15s',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 14, color: isActive ? '#2563eb' : '#94a3b8' }}>
              {ICONS[i]}
            </span>
            {label}
            {showBadge && (
              <span style={{
                position: 'absolute',
                top: 8,
                right: 8,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                background: alertas.vencidos > 0 ? '#991b1b' : '#854d0e',
                color: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 9,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
              }}>
                {totalAlertas}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}