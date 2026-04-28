const CFG: Record<string, { label: string; color: string }> = {
  FISCALIA:  { label: 'Fiscalía',   color: '#c0223a' },
  UMECA:     { label: 'UMECA',      color: '#d4a43a' },
  JUZGADOS:  { label: 'Juzgados',   color: '#5a8fd4' },
  SEC_MUJER: { label: 'Sec. Mujer', color: '#9a6ad4' },
}

export function AutoridadBadge({ autoridad }: { autoridad: string }) {
  const c = CFG[autoridad] ?? { label: autoridad, color: '#4a5878' }
  return (
    <span style={{
      display:       'inline-block',
      padding:       '2px 8px',
      border:        `1px solid ${c.color}`,
      color:         c.color,
      fontFamily:    'JetBrains Mono,monospace',
      fontSize:      9,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      whiteSpace:    'nowrap',
    }}>
      {c.label}
    </span>
  )
}
