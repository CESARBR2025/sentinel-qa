'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Stat {
  label: string;
  value: string;
}

interface ModuleCardProps {
  label: string;
  sub: string;
  icon: React.ReactNode;
  href: string;
  stats: Stat[];
}

export const ModuleCard = ({ label, sub, icon, href, stats }: ModuleCardProps) => {
  const [hover, setHover] = useState(false)
  const blueAccent = '#2563eb'

  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#ffffff',
        border: `1px solid ${hover ? blueAccent : '#e2e8f0'}`,
        padding: '32px',
        position: 'relative',
        textDecoration: 'none',
        transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '280px',
        borderRadius: '2px',
        boxShadow: hover ? '0 20px 40px -12px rgba(37, 99, 235, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        transform: hover ? 'translateY(-5px)' : 'translateY(0)',
        overflow: 'hidden'
      }}
    >
      {/* ADORNOS SENTINEL */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: hover ? '100%' : '24px', height: '2px', background: blueAccent, transition: 'width 0.4s ease' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '2px', height: hover ? '100%' : '24px', background: blueAccent, transition: 'height 0.4s ease' }} />

      {/* HEADER CARD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div style={{ color: hover ? blueAccent : '#64748b', transition: 'all 0.3s ease', transform: hover ? 'scale(1.1)' : 'scale(1)' }}>
          {icon}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: hover ? blueAccent : '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: hover ? blueAccent : '#cbd5e1' }} />
          SISTEMA ACTIVO
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ flexGrow: 1 }}>
        <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '0.02em' }}>
          {label}
        </h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
          {sub}
        </p>
      </div>

      {/* STATS */}
      <div style={{ display: 'flex', gap: '24px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
        {stats.map((stat, i) => (
          <div key={i}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ACCIÓN */}
      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600, color: hover ? blueAccent : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        Ingresar <ArrowRight size={14} style={{ transform: hover ? 'translateX(5px)' : 'translateX(0)', transition: 'transform 0.3s' }} />
      </div>
    </Link>
  )
}