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
  const blueAccent = '#1f355a'

  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'rgba(255,255,255,0.85)' : 'var(--apple-glass-bg)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${hover ? 'rgba(31, 53, 90, 0.25)' : 'var(--apple-glass-border)'}`,
        padding: '32px',
        position: 'relative',
        textDecoration: 'none',
        transition: 'all 0.3s ease-out',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '280px',
        borderRadius: 'var(--radius-xl)',
        boxShadow: hover ? 'var(--apple-shadow-glass-hover)' : 'var(--apple-shadow-glass)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        overflow: 'hidden'
      }}
    >
      {/* HEADER CARD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div style={{ color: hover ? blueAccent : '#64748b', transition: 'all 0.3s ease', transform: hover ? 'scale(1.1)' : 'scale(1)', transformOrigin: 'top left' }}>
          {icon}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--apple-font-display)', fontSize: '12px', fontWeight: 500, color: '#10b981' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)' }} />
          En línea
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ flexGrow: 1 }}>
        <h3 style={{ fontFamily: 'var(--apple-font-display)', fontSize: '26px', fontWeight: 600, textTransform: 'none', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: 'normal' }}>
          {label}
        </h3>
        <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
          {sub}
        </p>
      </div>

      {/* STATS */}
      <div style={{ display: 'flex', gap: '24px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
        {stats.map((stat, i) => (
          <div key={i}>
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: '12px', fontWeight: 500, color: '#94a3b8', textTransform: 'none', letterSpacing: 'normal', marginBottom: '4px' }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ACCIÓN */}
      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--apple-font-display)', fontSize: '14px', fontWeight: 600, color: hover ? blueAccent : '#94a3b8', textTransform: 'none', letterSpacing: 'normal' }}>
        Ingresar <ArrowRight size={14} style={{ transform: hover ? 'translateX(5px)' : 'translateX(0)', transition: 'transform 0.3s' }} />
      </div>
    </Link>
  )
}