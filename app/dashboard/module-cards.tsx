'use client'
import { useState } from 'react'
import Link from 'next/link'

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

const ShieldIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>);
const AlertIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const ChartIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>);
const BookIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>);
const SettingsIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>);
const CameraIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>);

const MODULES: Module[] = [
  { 
    id: 'prevencion',
    label: 'Prevención del Delito', 
    sub: 'Atención a víctimas · Jurídico', 
    icon: <ShieldIcon />, 
    href: '/prevencion/medidas',
    size: 'large',
    status: 'active',
    stats: [{ label: 'Casos Activos', value: '14' }, { label: 'Prioridad Alta', value: '3' }]
  },
  { 
    id: 'monitorista',
    label: 'Monitorista', 
    sub: 'Solicitudes de evidencias · Cámaras', 
    icon: <CameraIcon />, 
    href: '/monitorista',
    size: 'large',
    status: 'active',
    stats: [{ label: 'Pendientes', value: '—' }, { label: 'Hoy', value: '—' }]
  },
  {
    id: 'incidentes',
    label: 'Incidentes',            
    sub: 'Registro y despacho',             
    icon: <AlertIcon />,
    status: 'building'
  },
  {
    id: 'reportes',
    label: 'Reportes',
    sub: 'Diario y estadístico · Formato N',
    icon: <ChartIcon />,
    href: '/reportes',
    status: 'active'
  },
  { 
    id: 'catalogos',
    label: 'Catálogos',             
    sub: 'Tipos y sectores',                
    icon: <BookIcon />,
    status: 'building'
  },
  { 
    id: 'admin',
    label: 'Administración',        
    sub: 'Usuarios y permisos',             
    icon: <SettingsIcon />, 
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

  const accentColor = isAlert ? '#c0223a' : '#3e5171';
  const iconColor = hover ? accentColor : (isActive ? '#3e5171' : '#94a3b8');

  const inner = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      {/* ── Overlays "en construcción" — futurismo táctico ── */}
      {isBuilding && (
        <>
          {/* Grid blueprint pulsante */}
          <div className="mc-grid" style={{
            position: 'absolute', inset: -24, zIndex: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(62,81,113,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(62,81,113,0.6) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(circle at 80% 15%, #000 0%, transparent 65%)',
            WebkitMaskImage: 'radial-gradient(circle at 80% 15%, #000 0%, transparent 65%)',
          }} />
          {/* Línea de escaneo de seguridad */}
          <div className="mc-scan" style={{
            position: 'absolute', left: -24, right: -24, height: 2, zIndex: 1, pointerEvents: 'none',
            background: 'linear-gradient(90deg, transparent, #3e5171 45%, #1f355a 55%, transparent)',
            boxShadow: '0 0 12px rgba(62,81,113,0.6)',
          }} />
        </>
      )}

      {/* Decorative top bar */}
      <div style={{
        position:   'absolute',
        top:        -24,
        left:       -24,
        width:      hover ? '100%' : '32px',
        height:     2,
        background: accentColor,
        transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}/>
      <div style={{
        position:   'absolute',
        top:        -24,
        left:       -24,
        width:      2,
        height:     hover ? '24px' : '8px',
        background: accentColor,
        transition: 'height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}/>

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
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            color: '#10b981',
            letterSpacing: '0.1em'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)' }}></span>
            ONLINE
          </div>
        )}

        {isBuilding && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            color: '#3e5171', letterSpacing: '0.14em',
            border: '1px solid rgba(62,81,113,0.35)', padding: '4px 8px',
            background: 'rgba(62,81,113,0.04)',
          }}>
            {/* Núcleo escaneando */}
            <span style={{ position: 'relative', width: 10, height: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mc-ping" style={{ position: 'absolute', inset: 0, border: '1px solid #3e5171', borderRadius: '50%' }} />
              <span className="mc-blink" style={{ width: 4, height: 4, borderRadius: '50%', background: '#3e5171' }} />
            </span>
            EN DESARROLLO
          </div>
        )}
      </div>

      {/* Content section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Nombre + contadores en línea, separados por divisor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 8 }}>
          <div style={{
            fontFamily:    'Barlow Condensed,sans-serif',
            fontWeight:    700,
            fontSize:      isLarge ? 36 : 26,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
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
                      fontFamily:     'Barlow Condensed, sans-serif',
                      fontWeight:      700,
                      fontSize:        46,
                      letterSpacing:  '0.02em',
                      color:           '#0f172a',
                      lineHeight:      0.9,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 6 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{
          fontFamily:    'JetBrains Mono,monospace',
          fontSize:      11,
          color:         hover ? '#475569' : '#64748b',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
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
            fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 600,
            color: '#3e5171', letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            <span>Construyendo módulo</span>
            <span className="mc-blink" style={{ letterSpacing: '0.05em' }}>▚▚▚</span>
          </div>
          {/* Barra de progreso indeterminada */}
          <div style={{ position: 'relative', height: 3, background: '#e2e8f0', overflow: 'hidden' }}>
            <div className="mc-progress" style={{
              position: 'absolute', top: 0, height: '100%', width: '40%',
              background: 'linear-gradient(90deg, transparent, #3e5171 40%, #1f355a 60%, transparent)',
            }} />
          </div>
        </div>
      ) : (
        <div style={{
          marginTop:     isLarge ? 24 : 16,
          fontFamily:    'JetBrains Mono,monospace',
          fontSize:      10,
          fontWeight:    600,
          color:         hover ? (href ? accentColor : '#64748b') : (href ? '#94a3b8' : '#2a3a5e'),
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          transition:    'all 0.3s ease',
          display:       'flex',
          alignItems:    'center',
          gap:           8
        }}>
          {href ? (
             <>ACCEDER <span style={{ transform: hover ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}>→</span></>
          ) : 'EN CONSTRUCCIÓN'}
        </div>
      )}
    </div>
  )

  const sharedStyle: React.CSSProperties = {
    background: isBuilding ? (hover ? '#e5eaf1' : '#e9edf3') : (hover ? '#f8faff' : '#ffffff'),
    backdropFilter: 'blur(10px)',
    border:      `1px solid ${hover ? 'rgba(62, 81, 113, 0.5)' : '#e2e8f0'}`,
    padding:     '24px',
    position:    'relative',
    cursor:      href ? 'pointer' : 'default',
    transition:  'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
    boxShadow:   hover ? `0 4px 6px -1px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(212,164,58,0.1)` : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transform:   hover && href ? 'translateY(-4px)' : 'translateY(0)',
    textDecoration: 'none',
    gridColumn:  isLarge ? '1 / -1' : 'auto',
    minHeight:   isLarge ? '220px' : '160px',
    overflow:    'hidden',
    borderRadius: '2px'
  }

  // Hover glow effect
  const glowStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: `radial-gradient(circle at 50% 0%, ${accentColor}15 0%, transparent 70%)`,
    opacity: hover ? 1 : 0,
    transition: 'opacity 0.4s ease',
    pointerEvents: 'none',
    zIndex: 0
  };

  if (href) {
    return (
      <Link
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={sharedStyle}
      >
        <div style={glowStyle} />
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
      <div style={glowStyle} />
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
        @keyframes mc-scan {
          0%   { top: -6%; opacity: 0; }
          12%  { opacity: 0.95; }
          88%  { opacity: 0.95; }
          100% { top: 106%; opacity: 0; }
        }
        .mc-scan { animation: mc-scan 2.6s cubic-bezier(0.45,0,0.55,1) infinite; }
        @keyframes mc-gridpulse { 0%,100% { opacity: 0.05; } 50% { opacity: 0.16; } }
        .mc-grid { animation: mc-gridpulse 3.2s ease-in-out infinite; }
        @keyframes mc-progress { 0% { left: -45%; } 100% { left: 100%; } }
        .mc-progress { animation: mc-progress 1.6s cubic-bezier(0.65,0,0.35,1) infinite; }
        @keyframes mc-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
        .mc-blink { animation: mc-blink 1.1s step-end infinite; }
        @keyframes mc-ping { 0% { transform: scale(0.6); opacity: 0.8; } 100% { transform: scale(1.8); opacity: 0; } }
        .mc-ping { animation: mc-ping 1.6s cubic-bezier(0,0,0.2,1) infinite; }
      `}</style>
      <ModuleCard {...MODULES[0]} />
      {MODULES.slice(1).map(m => (
        <ModuleCard key={m.id} {...m} />
      ))}
    </div>
  )
}
