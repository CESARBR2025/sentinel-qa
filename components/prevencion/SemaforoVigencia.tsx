import type { SemaforoColor } from '@/lib/prevencion/semaforo'

const CFG: Record<SemaforoColor, { color: string; label: string }> = {
  verde:    { color: '#4a9e6a', label: 'VIGENTE'    },
  amarillo: { color: '#d4a43a', label: 'POR VENCER' },
  rojo:     { color: '#c0223a', label: 'VENCIDA'    },
  gris:     { color: '#4a5878', label: 'SIN FECHA'  },
}

export function SemaforoVigencia({ color }: { color: SemaforoColor }) {
  const c = CFG[color]
  return (
    <span style={{
      display:       'inline-flex',
      alignItems:    'center',
      gap:           5,
      padding:       '3px 8px',
      border:        `1px solid ${c.color}`,
      color:         c.color,
      fontFamily:    'JetBrains Mono,monospace',
      fontSize:      9,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      whiteSpace:    'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
      {c.label}
    </span>
  )
}
