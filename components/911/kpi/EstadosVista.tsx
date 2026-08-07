'use client'

import { MapPinOff } from 'lucide-react'

// Estados de carga y vacío de la vista KPI. Skeletons replican la silueta del
// layout real (franja de KPIs → grid mapa+panel → tabla) para que el cambio a
// contenido no desplace el layout. Respeta prefers-reduced-motion.

export function Skeletons() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes kpi-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .kpi-sk { border-radius: var(--radius-lg); background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: kpi-shimmer 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .kpi-sk { animation: none; background: #eef2f7; } }
        .kpi-sk-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
        .kpi-sk-grid2 { display: grid; grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); gap: 18px; align-items: stretch; }
        @media (max-width: 1000px) { .kpi-sk-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .kpi-sk-grid2 { grid-template-columns: minmax(0, 1fr); } }
      `}} />

      <div className="kpi-sk-grid" aria-hidden="true">
        {[0, 1, 2, 3].map(i => <div key={i} className="kpi-sk" style={{ height: 96 }} />)}
      </div>

      <div className="kpi-sk-grid2" aria-hidden="true">
        <div className="kpi-sk" style={{ height: 520 }} />
        <div className="kpi-sk" style={{ height: 520 }} />
      </div>

      <div className="kpi-sk" style={{ height: 380 }} aria-hidden="true" />
    </>
  )
}

export function EstadoVacio({ onAmpliar }: { onAmpliar: () => void }) {
  return (
    <section style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)', padding: '64px 24px', display: 'flex', justifyContent: 'center',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .kpi-btn-ampliar { padding: 10px 18px; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); background: #f1f5f9; color: #475569; cursor: pointer; font-family: var(--apple-font-display); font-weight: 600; font-size: 13px; transition: all 0.3s ease-out; }
        .kpi-btn-ampliar:hover { border-color: #1f355a; color: #1f355a; background: rgba(31, 53, 90, 0.05); }
        .kpi-btn-ampliar:active { transform: scale(0.97); transition: transform 0.12s ease-out, border-color 0.12s ease-out; }
        @media (prefers-reduced-motion: reduce) { .kpi-btn-ampliar:active { transform: none; } }
      `}} />
      <div style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 'var(--radius-full)',
          background: 'rgba(31,53,90,0.08)', color: '#64748b',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MapPinOff size={26} strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 17, color: '#0f172a' }}>
          Sin incidencias en el rango
        </div>
        <p style={{
          margin: 0, fontFamily: 'var(--apple-font-display)', fontSize: 13,
          color: '#64748b', lineHeight: 1.5,
        }}>
          No hay registros entre las fechas seleccionadas. Prueba con un rango más amplio.
        </p>
        <button type="button" onClick={onAmpliar} className="kpi-btn-ampliar">
          Ampliar a 7 días
        </button>
      </div>
    </section>
  )
}
