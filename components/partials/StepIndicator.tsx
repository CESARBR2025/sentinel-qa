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
    <div style={{ marginBottom: 'clamp(20px, 5vw, 32px)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 'clamp(20px, 5vw, 28px)', letterSpacing: 'normal', textTransform: 'none', color: '#0f172a' }}>
          Paso {paso} de {total}
        </span>
        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 500, letterSpacing: 'normal', textTransform: 'none', color: '#64748b' }}>
          {nombre}
        </span>
      </div>
      <div style={{ marginTop: 10, height: 3, background: '#e2e8f0', borderRadius: 'var(--radius-full)' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#1f355a', borderRadius: 'var(--radius-full)', transition: 'width .25s ease' }} />
      </div>
    </div>
  )
}
