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
    <nav style={{
      background: 'linear-gradient(180deg, #eef2f7 0%, #e8edf3 100%)',
      borderBottom: '1px solid #d5dde7',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
      padding: '12px 48px',
      display: 'flex',
      alignItems: 'center',
      gap: 20,
    }}>
      <style>{`
        .pvnav-chip { position: relative; display: inline-flex; align-items: center; gap: 9px;
          padding: 9px 18px; border-radius: 7px; text-decoration: none;
          font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.14em;
          text-transform: uppercase; color: #5b6b82; white-space: nowrap;
          transition: color .16s ease, background .16s ease, box-shadow .16s ease, transform .16s ease; }
        .pvnav-chip:not(.is-active):hover { color: #1f355a; background: rgba(31,53,90,0.06); }
        .pvnav-chip.is-active { color: #ffffff; background: linear-gradient(180deg, #274268 0%, #1f355a 100%);
          box-shadow: 0 3px 10px rgba(31,53,90,0.32), inset 0 1px 0 rgba(255,255,255,0.18); }
        .pvnav-chip .pvnav-ico { display: inline-flex; opacity: 0.9; }
      `}</style>

      {/* Etiqueta identificadora del sub-menú */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ width: 3, height: 22, background: '#1f355a', borderRadius: 2 }} />
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#8393a8', lineHeight: 1.2 }}>
          Secciones
        </span>
      </div>

      {/* Control segmentado */}
      <div style={{
        display: 'inline-flex', gap: 4, padding: 5,
        background: '#ffffff', border: '1px solid #dbe3ec', borderRadius: 11,
        boxShadow: '0 1px 2px rgba(15,23,42,0.05)',
      }}>
        {NAV.map(({ href, label }, i) => {
          const isActive = pathname.startsWith(href)
          const showBadge = href === '/prevencion/busquedas' && totalAlertas > 0

          return (
            <Link key={href} href={href} className={`pvnav-chip${isActive ? ' is-active' : ''}`}>
              <span className="pvnav-ico" style={{ color: isActive ? '#9ec3ff' : '#94a3b8' }}>
                {ICONS[i]}
              </span>
              {label}
              {showBadge && (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 9,
                  background: alertas.vencidos > 0 ? '#991b1b' : '#854d0e',
                  color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  fontFamily: 'JetBrains Mono,monospace', fontSize: 9, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
                  marginLeft: 2,
                }}>
                  {totalAlertas}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}