'use client'

import { Gavel, Shield, Scale } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
}

const DESTINOS = [
  {
    value: 'FISCALIA',
    label: 'Fiscalía General del Estado (FGE)',
    description: 'Delitos del fuero común: robo, lesiones, violencia de género, allanamiento, etc.',
    icon: Gavel,
    color: '#1c3051',
    bg: '#eff1f3',
    border: '#c3c8d2',
  },
  {
    value: 'FGR',
    label: 'Fiscalía General de la República (FGR)',
    description: 'Delitos del fuero federal: portación de armas de uso exclusivo, delitos contra la salud (posesión mayor), etc.',
    icon: Shield,
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff',
  },
  {
    value: 'JUZGADO_CIVICO',
    label: 'Juzgado Cívico',
    description: 'Faltas administrativas: consumo de sustancias en vía pública, escandalizar, alteración al orden público, etc.',
    icon: Scale,
    color: '#a16207',
    bg: '#fefce8',
    border: '#fef08a',
  },
]

export function SelectorDestinoLegal({ value, onChange }: Props) {
  return (
    <div style={{ gridColumn: 'span 3' }}>
      <label style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600,
        color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.1em',
        display: 'block', marginBottom: 12,
      }}>
        * SELECCIONA EL DESTINO LEGAL DEL DETENIDO
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DESTINOS.map(d => {
          const Icon = d.icon
          const selected = value === d.value
          return (
            <button
              key={d.value}
              type="button"
              onClick={() => onChange(d.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: 13,
                textAlign: 'left', lineHeight: 1.4,
                border: `2px solid ${selected ? d.color : '#e2e8f0'}`,
                borderRadius: 4,
                background: selected ? d.bg : '#ffffff',
                color: selected ? d.color : '#475569',
                transition: 'all .15s',
                width: '100%',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: 4,
                background: selected ? d.color : '#f8fafc',
                flexShrink: 0,
              }}>
                <Icon size={18} color={selected ? '#ffffff' : '#94a3b8'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700, fontSize: 14, letterSpacing: '0.03em',
                  marginBottom: 2,
                }}>
                  {d.label}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: selected ? d.color : '#64748b', opacity: 0.8 }}>
                  {d.description}
                </div>
              </div>
              {selected && (
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', background: d.color, color: '#ffffff', borderRadius: 2,
                  flexShrink: 0,
                }}>
                  SELECCIONADO
                </span>
              )}
            </button>
          )
        })}
      </div>
      <input type="hidden" name="ofi_autoridad_recibe" value={value} />
    </div>
  )
}
