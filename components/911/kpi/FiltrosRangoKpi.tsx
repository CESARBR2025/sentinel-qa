'use client'

import { useState } from 'react'
import { RefreshCw, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { ETIQUETA_ESTATUS, isoAInputLocal, inputLocalAIso } from './formato'

export interface FiltrosKpi {
  desde: string          // ISO
  hasta: string          // ISO
  estatus: string
  canal: string
  prioridadId: string
  tipoIncidenteId: string
}

export interface CatalogoSimple { id: number; nombre: string }

const CANALES = [
  { valor: '911', etiqueta: '911' },
  { valor: 'whatsapp', etiqueta: 'WhatsApp' },
  { valor: 'radio', etiqueta: 'Radio / Rondín' },
]

const PRESETS = [
  { etiqueta: '24 h', horas: 24 },
  { etiqueta: '7 días', horas: 24 * 7 },
  { etiqueta: '30 días', horas: 24 * 30 },
]

const estiloEtiqueta: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--apple-font-display)', fontWeight: 500,
  fontSize: 12, color: '#64748b', marginBottom: 6,
}

// Toolbar de rango compacto + filtros avanzados en un disclosure. Los presets
// consultan de inmediato; los filtros avanzados solo se aplican con "Actualizar".
export function FiltrosRangoKpi({ filtros, onChange, onAplicar, cargando, tiposIncidente, prioridades }: {
  filtros: FiltrosKpi
  onChange: (filtros: FiltrosKpi) => void
  // Recibe el filtro exacto a consultar: si el preset llamara a onAplicar() sin
  // argumento, éste leería el `filtros` de la última render del padre (closure
  // obsoleto por el batching de React) y consultaría el rango viejo, no el que
  // se acaba de calcular aquí.
  onAplicar: (filtros: FiltrosKpi) => void
  cargando: boolean
  tiposIncidente: CatalogoSimple[]
  prioridades: CatalogoSimple[]
}) {
  const [avanzado, setAvanzado] = useState(false)

  // Al tocar un campo de filtro avanzado, el disclosure se abre solo (no hace
  // falta un effect: se abre en el handler del evento).
  const set = <K extends keyof FiltrosKpi>(clave: K, valor: FiltrosKpi[K]) => {
    onChange({ ...filtros, [clave]: valor })
    if (valor && ['estatus', 'canal', 'prioridadId', 'tipoIncidenteId'].includes(clave)) setAvanzado(true)
  }

  const filtrosActivos = [filtros.estatus, filtros.canal, filtros.prioridadId, filtros.tipoIncidenteId].filter(Boolean).length

  const aplicarPreset = (horas: number) => {
    const hasta = new Date()
    const desde = new Date(hasta.getTime() - horas * 60 * 60 * 1000)
    const nuevos = { ...filtros, desde: desde.toISOString(), hasta: hasta.toISOString() }
    onChange(nuevos)
    onAplicar(nuevos)
  }

  const aplicarHoy = () => {
    const desde = new Date()
    desde.setHours(0, 0, 0, 0)
    const nuevos = { ...filtros, desde: desde.toISOString(), hasta: new Date().toISOString() }
    onChange(nuevos)
    onAplicar(nuevos)
  }

  return (
    <section style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)', padding: '14px 18px',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .kpi-filtros-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .kpi-presets { display: flex; gap: 6px; flex-wrap: wrap; }
        .kpi-preset { padding: 8px 14px; border: 1px solid transparent; border-radius: var(--radius-full); background: #f1f5f9; color: #64748b; cursor: pointer; font-family: var(--apple-font-display); font-weight: 600; font-size: 13px; transition: all 0.3s ease-out; }
        .kpi-preset:hover { background-color: #e2e8f0; color: #475569; }
        .kpi-preset:active { transform: scale(0.97); transition: transform 0.12s ease-out, background-color 0.12s ease-out; }
        @media (prefers-reduced-motion: reduce) { .kpi-preset:active { transform: none; } }
        .kpi-filtros-acciones { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .kpi-btn-avanzado { display: inline-flex; align-items: center; gap: 7px; padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); background: #fff; color: #475569; cursor: pointer; font-family: var(--apple-font-display); font-weight: 600; font-size: 13px; transition: all 0.3s ease-out; }
        .kpi-btn-avanzado:hover { border-color: #1f355a; color: #1f355a; background: rgba(31, 53, 90, 0.05); }
        .kpi-btn-avanzado:active { transform: scale(0.97); transition: transform 0.12s ease-out, border-color 0.12s ease-out; }
        @media (prefers-reduced-motion: reduce) { .kpi-btn-avanzado:active { transform: none; } }
        .kpi-btn-avanzado .kpi-chevron { transition: transform 0.2s ease; }
        .kpi-btn-avanzado[aria-expanded='true'] .kpi-chevron { transform: rotate(180deg); }
        @media (prefers-reduced-motion: reduce) { .kpi-btn-avanzado .kpi-chevron { transition: none; } }
        .kpi-badge-activos { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; border-radius: var(--radius-full); background: #1f355a; color: #fff; font-size: 11px; font-weight: 600; line-height: 1; }
        .kpi-btn-cargar { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border: none; border-radius: var(--radius-lg); background: #1f355a; color: #fff; cursor: pointer; font-family: var(--apple-font-display); font-weight: 600; font-size: 14px; transition: all 0.3s ease-out; }
        .kpi-btn-cargar:hover:not(:disabled) { background: #132138; }
        .kpi-btn-cargar:active:not(:disabled) { transform: scale(0.97); transition: transform 0.12s ease-out, background-color 0.12s ease-out; }
        .kpi-btn-cargar:disabled { background: #94a3b8; cursor: default; }
        @media (prefers-reduced-motion: reduce) { .kpi-btn-cargar:active:not(:disabled) { transform: none; } }
        .kpi-filtros-avanzados { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; align-items: end; margin-top: 14px; padding-top: 14px; border-top: 1px solid #eef2f7; }
        .kpi-filtro-campo { display: flex; flex-direction: column; min-width: 0; }
        .kpi-input { border: 1px solid #e2e8f0; background: #f8fafc; padding: 11px 13px; border-radius: var(--radius-lg); font-family: var(--apple-font-display); font-size: 14px; color: #1e293b; min-width: 0; width: 100%; transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease; }
        .kpi-input:hover { border-color: #cbd5e1; }
        .kpi-input:focus { outline: none; border-color: #1f355a; background: #fff; box-shadow: 0 0 0 3px rgba(31, 53, 90, 0.12); }
      `}} />

      <div className="kpi-filtros-toolbar">
        <div className="kpi-presets">
          {PRESETS.map(p => (
            <button key={p.etiqueta} type="button" onClick={() => aplicarPreset(p.horas)} className="kpi-preset">
              Últimas {p.etiqueta}
            </button>
          ))}
          <button type="button" onClick={aplicarHoy} className="kpi-preset">Hoy</button>
        </div>

        <div className="kpi-filtros-acciones">
          <button
            type="button"
            className="kpi-btn-avanzado"
            aria-expanded={avanzado}
            onClick={() => setAvanzado(v => !v)}
          >
            <SlidersHorizontal size={14} />
            Filtros
            {filtrosActivos > 0 && <span className="kpi-badge-activos">{filtrosActivos}</span>}
            <ChevronDown size={14} className="kpi-chevron" />
          </button>
          <button
            type="button" onClick={() => onAplicar(filtros)} disabled={cargando}
            className="kpi-btn-cargar"
          >
            <RefreshCw size={15} style={cargando ? { animation: 'kpi-spin 1s linear infinite' } : undefined} />
            {cargando ? 'Cargando' : 'Actualizar'}
          </button>
        </div>
      </div>

      {avanzado && (
        <div className="kpi-filtros-avanzados">
          <div className="kpi-filtro-campo">
            <label style={estiloEtiqueta} htmlFor="kpi-desde">Desde</label>
            <input
              id="kpi-desde" type="datetime-local" className="kpi-input"
              value={isoAInputLocal(filtros.desde)}
              onChange={e => set('desde', inputLocalAIso(e.target.value) || filtros.desde)}
            />
          </div>
          <div className="kpi-filtro-campo">
            <label style={estiloEtiqueta} htmlFor="kpi-hasta">Hasta</label>
            <input
              id="kpi-hasta" type="datetime-local" className="kpi-input"
              value={isoAInputLocal(filtros.hasta)}
              onChange={e => set('hasta', inputLocalAIso(e.target.value) || filtros.hasta)}
            />
          </div>
          <div className="kpi-filtro-campo">
            <label style={estiloEtiqueta} htmlFor="kpi-estatus">Estatus</label>
            <select id="kpi-estatus" className="kpi-input" value={filtros.estatus} onChange={e => set('estatus', e.target.value)}>
              <option value="">Todos</option>
              {Object.entries(ETIQUETA_ESTATUS).map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>{etiqueta}</option>
              ))}
            </select>
          </div>
          <div className="kpi-filtro-campo">
            <label style={estiloEtiqueta} htmlFor="kpi-canal">Canal</label>
            <select id="kpi-canal" className="kpi-input" value={filtros.canal} onChange={e => set('canal', e.target.value)}>
              <option value="">Todos</option>
              {CANALES.map(c => <option key={c.valor} value={c.valor}>{c.etiqueta}</option>)}
            </select>
          </div>
          <div className="kpi-filtro-campo">
            <label style={estiloEtiqueta} htmlFor="kpi-prioridad">Prioridad</label>
            <select id="kpi-prioridad" className="kpi-input" value={filtros.prioridadId} onChange={e => set('prioridadId', e.target.value)}>
              <option value="">Todas</option>
              {prioridades.map(p => <option key={p.id} value={String(p.id)}>{p.nombre}</option>)}
            </select>
          </div>
          <div className="kpi-filtro-campo">
            <label style={estiloEtiqueta} htmlFor="kpi-tipo">Tipo de incidente</label>
            <select id="kpi-tipo" className="kpi-input" value={filtros.tipoIncidenteId} onChange={e => set('tipoIncidenteId', e.target.value)}>
              <option value="">Todos</option>
              {tiposIncidente.map(t => <option key={t.id} value={String(t.id)}>{t.nombre}</option>)}
            </select>
          </div>
        </div>
      )}
    </section>
  )
}
