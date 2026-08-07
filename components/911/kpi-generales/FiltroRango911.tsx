'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { isoAInputLocal, inputLocalAIso } from '@/components/911/kpi/formato'

export interface RangoFechas { desde: string; hasta: string } // ISO

const PRESETS = [
  { key: '24h', etiqueta: '24 h', horas: 24 },
  { key: '7d', etiqueta: '7 días', horas: 24 * 7 },
  { key: '30d', etiqueta: '30 días', horas: 24 * 30 },
  { key: 'hoy', etiqueta: 'Hoy', horas: 0 },
]

const estiloPill: React.CSSProperties = {
  fontFamily: 'var(--apple-font-display)',
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 'normal',
  textTransform: 'none',
  whiteSpace: 'nowrap',
  padding: '9px 20px',
  borderRadius: 'var(--radius-full)',
  border: 'none',
  cursor: 'pointer',
  background: '#f1f5f9',
  color: '#64748b',
  transition: 'all 0.15s ease',
}

const estiloCampo: React.CSSProperties = {
  padding: '10px 14px',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 'var(--radius-lg)',
  fontFamily: 'var(--apple-font-display)',
  fontSize: 14,
  color: '#1e293b',
  width: '100%',
  minWidth: 0,
}

const ACCENT = '#1f355a'

export function FiltroRango911({ rango, onChange, onAplicar, cargando, acciones }: {
  rango: RangoFechas
  onChange: (r: RangoFechas) => void
  // Recibe el rango exacto a consultar: si el preset llamara a onAplicar() sin
  // argumento, leería el `rango` de la última render del padre (closure obsoleto
  // por el batching de React) y consultaría el rango viejo, no el calculado aquí.
  onAplicar: (r: RangoFechas) => void
  cargando: boolean
  // Acción secundaria (ej. link "Ver mapa de incidencias") — se alinea a la derecha.
  acciones?: React.ReactNode
}) {
  const [presetActivo, setPresetActivo] = useState<string | null>('24h')

  // Los presets consultan de inmediato: mismo comportamiento que FiltrosRangoKpi
  // (components/911/kpi/FiltrosRangoKpi.tsx) — no solo llenan los inputs.
  const aplicarPreset = (key: string, horas: number) => {
    const hasta = new Date()
    const desde = horas === 0
      ? (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d })()
      : new Date(hasta.getTime() - horas * 60 * 60 * 1000)
    const nuevo = { desde: desde.toISOString(), hasta: hasta.toISOString() }
    setPresetActivo(key)
    onChange(nuevo)
    onAplicar(nuevo)
  }

  const aplicarCustom = () => {
    setPresetActivo(null)
    onAplicar(rango)
  }

  return (
    <div style={{
      background: 'var(--apple-glass-bg)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid var(--apple-glass-border)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--apple-shadow-glass)',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {PRESETS.map(p => {
          const activo = presetActivo === p.key
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => aplicarPreset(p.key, p.horas)}
              aria-pressed={activo}
              style={{
                ...estiloPill,
                background: activo ? ACCENT : '#f1f5f9',
                color: activo ? '#ffffff' : '#64748b',
              }}
            >
              {p.key === 'hoy' ? 'Hoy' : `Últimas ${p.etiqueta}`}
            </button>
          )
        })}
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 14,
        alignItems: 'end',
      }}>
        <div style={{ flex: '1 1 190px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label htmlFor="kpi911-desde" style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, color: '#64748b' }}>
            Desde
          </label>
          <input
            id="kpi911-desde" type="datetime-local" style={estiloCampo}
            value={isoAInputLocal(rango.desde)}
            onChange={e => onChange({ ...rango, desde: inputLocalAIso(e.target.value) || rango.desde })}
          />
        </div>
        <div style={{ flex: '1 1 190px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label htmlFor="kpi911-hasta" style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, color: '#64748b' }}>
            Hasta
          </label>
          <input
            id="kpi911-hasta" type="datetime-local" style={estiloCampo}
            value={isoAInputLocal(rango.hasta)}
            onChange={e => onChange({ ...rango, hasta: inputLocalAIso(e.target.value) || rango.hasta })}
          />
        </div>
        <button
          type="button"
          onClick={aplicarCustom}
          disabled={cargando}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 20px',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            background: cargando ? '#94a3b8' : ACCENT,
            color: '#ffffff',
            cursor: cargando ? 'default' : 'pointer',
            fontFamily: 'var(--apple-font-display)',
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: 'normal',
            textTransform: 'none',
            height: '42px',
          }}
        >
          <RefreshCw size={14} className="kpi911-spin" style={cargando ? undefined : { animation: 'none' }} />
          {cargando ? 'Cargando' : 'Actualizar'}
        </button>
        {acciones && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', paddingBottom: 8 }}>
            {acciones}
          </div>
        )}
      </div>

      <style>{`
        @keyframes kpi911-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .kpi911-spin { animation: kpi911-spin 1s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .kpi911-spin { animation: none; } }
      `}</style>
    </div>
  )
}
