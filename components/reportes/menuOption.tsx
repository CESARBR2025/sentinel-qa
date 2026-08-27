'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Stat {
  label: string;
  value: string;
}

interface OptionSquareProps {
  titulo: string;
  subtitulo: string;
  icono: React.ReactNode;
  enlace: string;
  estadisticas: Stat[];
}

export const OptionSquare = ({ titulo, subtitulo, icono, enlace, estadisticas }: OptionSquareProps) => {
  const [hover, setHover] = useState(false)
  const accentColor = '#1f355a'

  const cardStyle: React.CSSProperties = {
    background: hover ? 'rgba(255,255,255,0.85)' : 'var(--apple-glass-bg)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${hover ? 'rgba(31, 53, 90, 0.25)' : 'var(--apple-glass-border)'}`,
    padding: '24px',
    position: 'relative',
    textDecoration: 'none',
    transition: 'all 0.3s ease-out',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '200px',
    height: '100%',
    borderRadius: 'var(--radius-xl)',
    boxShadow: hover ? 'var(--apple-shadow-glass-hover)' : 'var(--apple-shadow-glass)',
    transform: hover ? 'translateY(-2px)' : 'translateY(0)',
    overflow: 'hidden',
    cursor: 'pointer',
    width: '100%',
  }

  return (
    <Link
      href={enlace}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={cardStyle}
    >
      {/* HEADER CARD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div style={{
          color: hover ? accentColor : '#64748b',
          transition: 'all 0.3s ease',
          transform: hover ? 'scale(1.1)' : 'scale(1)',
          transformOrigin: 'top left',
        }}>
          {icono}
        </div>
        {estadisticas.length > 0 && (
          <div style={{
            fontFamily: 'var(--apple-font-display)',
            fontSize: 12,
            fontWeight: 500,
            color: hover ? accentColor : '#94a3b8',
            transition: 'color 0.3s ease',
          }}>
            {estadisticas[0].value}
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{
          fontFamily: 'var(--apple-font-display)',
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: 'normal',
          textTransform: 'none',
          color: hover ? '#1f355a' : '#0f172a',
          margin: '0 0 8px 0',
          transition: 'color 0.3s ease',
        }}>
          {titulo}
        </h3>
        <p style={{
          fontFamily: 'var(--apple-font-display)',
          fontSize: 13,
          color: hover ? '#475569' : '#64748b',
          lineHeight: '1.5',
          margin: 0,
          transition: 'color 0.3s ease',
        }}>
          {subtitulo}
        </p>
      </div>

      {/* ESTADÍSTICAS */}
      {estadisticas.length > 0 && (
        <div style={{ display: 'flex', gap: '24px', marginTop: 16, paddingTop: 16, borderTop: '1px solid #eef2f7' }}>
          {estadisticas.map((stat, i) => (
            <div key={i} style={{ lineHeight: 1 }}>
              <div style={{
                fontFamily: 'var(--apple-font-display)',
                fontSize: 11,
                color: '#94a3b8',
                fontWeight: 500,
                marginBottom: 4,
                textTransform: 'none',
                letterSpacing: 'normal',
              }}>
                {stat.label}
              </div>
              <div style={{
                fontFamily: 'var(--apple-font-display)',
                fontSize: 18,
                fontWeight: 600,
                color: '#0f172a',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ACCIÓN */}
      <div style={{
        marginTop: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--apple-font-display)',
        fontSize: 13,
        fontWeight: 600,
        color: hover ? accentColor : '#94a3b8',
        textTransform: 'none',
        letterSpacing: 'normal',
        transition: 'color 0.3s ease',
      }}>
        Ingresar <ArrowRight size={14} style={{ transform: hover ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.3s ease' }} />
      </div>
    </Link>
  )
}
