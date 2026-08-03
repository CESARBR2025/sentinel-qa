// ─────────────────────────────────────────────────────────────────────────────
// Indicador de pasos (Paso N de M + nombre + barra de progreso).
//
// REGLA DE DISEÑO: prohibido usar steppers (círculos numerados con conectores,
// dots de progreso o barras segmentadas por paso). Toda vista multi-paso usa
// este componente (ver bóveda → Convenciones → "Indicador de Pasos").
//
//   <StepIndicator paso={step + 1} total={STEPS.length} nombre={STEPS[step]} />
// ─────────────────────────────────────────────────────────────────────────────

export function StepIndicator({
  paso,
  total,
  nombre,
}: {
  paso: number
  total: number
  nombre: string
}) {
  const pct = Math.min(100, Math.max(0, (paso / total) * 100))

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#1f355a' }}>
          Paso {paso} de {total}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8' }}>
          {nombre}
        </span>
      </div>
      <div style={{ marginTop: 10, height: 2, background: '#e2e8f0', borderRadius: 1 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#1f355a', transition: 'width .25s ease' }} />
      </div>
    </div>
  )
}
