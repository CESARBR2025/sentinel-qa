'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Shield, AlertTriangle, BarChart3, BookOpen, Settings, Camera } from 'lucide-react'

type Module = { 
  id: string;
  label: string; 
  sub: string; 
  icon: React.ReactNode; 
  href?: string;
  size?: 'large' | 'normal';
  status?: 'active' | 'building' | 'alert';
  stats?: { label: string; value: string }[];
}

const MODULES: Module[] = [
  { 
    id: 'prevencion',
    label: 'Prevención del Delito', 
    sub: 'Atención a víctimas · Jurídico', 
    icon: <Shield size={24} strokeWidth={1.5} />, 
    href: '/prevencion/medidas',
    size: 'large',
    status: 'active',
    stats: [{ label: 'Casos Activos', value: '14' }, { label: 'Prioridad Alta', value: '3' }]
  },
  { 
    id: 'monitorista',
    label: 'Monitorista', 
    sub: 'Solicitudes de evidencias · Cámaras', 
    icon: <Camera size={24} strokeWidth={1.5} />, 
    href: '/monitorista',
    size: 'large',
    status: 'active',
    stats: [{ label: 'Pendientes', value: '—' }, { label: 'Hoy', value: '—' }]
  },
  {
    id: 'incidentes',
    label: 'Incidentes',            
    sub: 'Registro y despacho',             
    icon: <AlertTriangle size={24} strokeWidth={1.5} />,
    status: 'building'
  },
  {
    id: 'reportes',
    label: 'Reportes',
    sub: 'Diario y estadístico · Formato N',
    icon: <BarChart3 size={24} strokeWidth={1.5} />,
    href: '/agente_reportes',
    status: 'active'
  },
  { 
    id: 'catalogos',
    label: 'Catálogos',             
    sub: 'Tipos y sectores',                
    icon: <BookOpen size={24} strokeWidth={1.5} />,
    status: 'building'
  },
  { 
    id: 'admin',
    label: 'Administración',        
    sub: 'Usuarios y permisos',             
    icon: <Settings size={24} strokeWidth={1.5} />, 
    href: '/admin/usuarios',
    status: 'active'
  },
]

function ModuleCard({ label, sub, icon, href, size, status, stats }: Module) {
  const [hover, setHover] = useState(false)

  const isLarge = size === 'large';
  const isActive = status === 'active';
  const isAlert = status === 'alert';
  const isBuilding = status === 'building';

  const accentColor = isAlert ? '#c0223a' : '#1f355a';
  const iconColor = hover ? accentColor : (isActive ? '#1f355a' : '#94a3b8');

  const inner = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isLarge ? 24 : 16 }}>
        <div style={{
          color:        iconColor,
          transition:   'all 0.3s ease',
          transform:    hover ? 'scale(1.1)' : 'scale(1)',
          transformOrigin: 'top left'
        }}>
          {icon}
        </div>
        
        {status === 'active' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--apple-font-display)',
            fontSize: 12,
            fontWeight: 500,
            color: '#10b981',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)' }}></span>
            En línea
          </div>
        )}

        {isBuilding && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500,
            color: '#64748b', border: '1px solid var(--apple-glass-border)',
            borderRadius: 'var(--radius-full)', padding: '4px 12px',
            background: 'rgba(255,255,255,0.5)',
          }}>
            En desarrollo
          </div>
        )}
      </div>

      {/* Content section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Nombre + contadores en línea, separados por divisor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 8 }}>
          <div style={{
            fontFamily:    'var(--apple-font-display)',
            fontWeight:    600,
            fontSize:      isLarge ? 36 : 26,
            letterSpacing: 'normal',
            textTransform: 'none',
            color:         hover ? '#1f355a' : '#0f172a',
            transition:    'color 0.3s ease',
          }}>
            {label}
          </div>

          {isLarge && stats && (
            <>
              {/* Separador */}
              <div style={{ width: 2, alignSelf: 'stretch', minHeight: 40, background: hover ? '#1f355a' : '#cbd5e1', transition: 'background 0.3s ease' }} />

              {/* Contadores */}
              <div style={{ display: 'flex', gap: 22 }}>
                {stats.map((stat, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
                    <div style={{
                      fontFamily:     'var(--apple-font-display)',
                      fontWeight:      600,
                      fontSize:        46,
                      letterSpacing:  '0.02em',
                      color:           '#0f172a',
                      lineHeight:      0.9,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, color: '#64748b', marginTop: 6 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{
          fontFamily:    'var(--apple-font-display)',
          fontSize:      13,
          color:         hover ? '#475569' : '#64748b',
          transition:    'color 0.3s ease',
          lineHeight:    1.4
        }}>
          {sub}
        </div>
      </div>

      {/* Footer action */}
      {isBuilding ? (
        <div style={{ marginTop: isLarge ? 24 : 16 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
            fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500,
            color: '#64748b',
          }}>
            <span>Construyendo módulo</span>
          </div>
          {/* Barra de progreso indeterminada */}
          <div style={{ position: 'relative', height: 3, background: '#e2e8f0', overflow: 'hidden', borderRadius: 2 }}>
            <div className="mc-progress" style={{
              position: 'absolute', top: 0, height: '100%', width: '40%',
              background: 'linear-gradient(90deg, transparent, rgba(31,53,90,0.4) 40%, rgba(31,53,90,0.6) 60%, transparent)',
            }} />
          </div>
        </div>
      ) : (
        <div style={{
          marginTop:     isLarge ? 24 : 16,
          fontFamily:    'var(--apple-font-display)',
          fontSize:      13,
          fontWeight:    600,
          color:         hover ? (href ? accentColor : '#64748b') : (href ? '#94a3b8' : '#2a3a5e'),
          transition:    'all 0.3s ease',
          display:       'flex',
          alignItems:    'center',
          gap:           8
        }}>
          {href ? (
             <>Acceder <span style={{ transform: hover ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}>→</span></>
          ) : 'En construcción'}
        </div>
      )}
    </div>
  )

  const sharedStyle: React.CSSProperties = {
    background: isBuilding
      ? 'rgba(241, 245, 249, 0.6)'
      : (hover ? 'rgba(255,255,255,0.85)' : 'var(--apple-glass-bg)'),
    backdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${hover ? 'rgba(31, 53, 90, 0.25)' : 'var(--apple-glass-border)'}`,
    padding: '24px',
    position: 'relative',
    cursor: href ? 'pointer' : 'default',
    transition: 'all 0.3s ease-out',
    boxShadow: hover ? 'var(--apple-shadow-glass-hover)' : 'var(--apple-shadow-glass)',
    transform: hover && href ? 'translateY(-2px)' : 'translateY(0)',
    textDecoration: 'none',
    gridColumn: isLarge ? '1 / -1' : 'auto',
    minHeight: isLarge ? '220px' : '160px',
    overflow: 'hidden',
    borderRadius: 'var(--radius-xl)',
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 20,
      width: '100%'
    }}>
      <style>{`
        @keyframes mc-progress { 0% { left: -45%; } 100% { left: 100%; } }
        .mc-progress { animation: mc-progress 1.6s cubic-bezier(0.65,0,0.35,1) infinite; }
      `}</style>
      <ModuleCard {...MODULES[0]} />
      {MODULES.slice(1).map(m => (
        <ModuleCard key={m.id} {...m} />
      ))}
    </div>
  )
}
