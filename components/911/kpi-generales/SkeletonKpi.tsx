// Skeleton del panel de KPIs — replica la forma final (hero strip + grid de
// secciones con placeholders de donut/barras) para evitar layout shift y dar
// percepción de velocidad. Presentacional, sin hooks. Shimmer con
// prefers-reduced-motion anulado (§6 motion con propósito).
export function SkeletonKpi() {
  return (
    <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`
        .kpi-sk { position: relative; overflow: hidden; background: #eef2f6; border-radius: var(--radius-md); }
        .kpi-sk::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: translateX(-100%);
          animation: kpi-sk-shimmer 1.4s infinite;
        }
        @keyframes kpi-sk-shimmer { 100% { transform: translateX(100%); } }
        @media (prefers-reduced-motion: reduce) { .kpi-sk::after { animation: none; } }
        .kpi-sk-hero { display: flex; flex-wrap: wrap; background: #fff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
        .kpi-sk-hero > div { flex: 1 1 180px; padding: 22px 24px; min-width: 0; }
        .kpi-sk-hero > div + div { border-left: 1px solid #f1f5f9; }
        .kpi-sk-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 900px) { .kpi-sk-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        .kpi-sk-card { background: #fff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); padding: 24px 28px; }
        .kpi-sk-line { height: 12px; }
        .kpi-sk-title { height: 18px; width: 40%; margin-bottom: 24px; }
        .kpi-sk-donut { width: 160px; height: 160px; border-radius: 50%; margin: 0 auto; }
        .kpi-sk-bars { display: flex; flex-direction: column; gap: 14px; padding-top: 4px; }
        @media (max-width: 720px) {
          .kpi-sk-hero > div { flex: 1 1 50%; padding: 14px 12px; }
          .kpi-sk-hero > div + div { border-left: none; }
          .kpi-sk-hero > div:nth-child(even) { border-left: 1px solid #f1f5f9; }
        }
      `}</style>

      <div className="kpi-sk-hero">
        {[0, 1, 2, 3].map(i => (
          <div key={i}>
            <div className="kpi-sk kpi-sk-line" style={{ width: '70%', marginBottom: 10 }} />
            <div className="kpi-sk" style={{ height: 34, width: '45%' }} />
          </div>
        ))}
      </div>

      <div className="kpi-sk-grid">
        <div className="kpi-sk-card">
          <div className="kpi-sk kpi-sk-title" />
          <div className="kpi-sk kpi-sk-donut" />
          <div className="kpi-sk kpi-sk-line" style={{ width: '80%', marginTop: 20 }} />
        </div>
        <div className="kpi-sk-card">
          <div className="kpi-sk kpi-sk-title" />
          <div className="kpi-sk-bars">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="kpi-sk" style={{ height: 16, width: `${85 - i * 12}%` }} />
            ))}
          </div>
        </div>
        <div className="kpi-sk-card" style={{ gridColumn: '1 / -1' }}>
          <div className="kpi-sk kpi-sk-title" />
          <div className="kpi-sk" style={{ height: 160 }} />
        </div>
      </div>
    </div>
  )
}
