'use client'

import { RefreshCw } from 'lucide-react'
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

const estiloCampo: React.CSSProperties = {
  border: '1px solid #cbd5e1', background: '#fff', padding: '7px 9px',
  fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#0f172a', minWidth: 0,
}

const estiloEtiqueta: React.CSSProperties = {
  display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 5,
}

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
  const set = <K extends keyof FiltrosKpi>(clave: K, valor: FiltrosKpi[K]) => onChange({ ...filtros, [clave]: valor })

  // Los presets consultan de inmediato: antes sólo tocaban los inputs y había
  // que acordarse de presionar "Actualizar" — si no, se seguía viendo el
  // resultado del rango anterior aunque los campos ya mostraran el nuevo.
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
    <section style={{ background: '#fff', border: '1px solid #e2e8f0', padding: 20 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {PRESETS.map(p => (
          <button key={p.etiqueta} type="button" onClick={() => aplicarPreset(p.horas)} style={botonPreset}>
            Últimas {p.etiqueta}
          </button>
        ))}
        <button type="button" onClick={aplicarHoy} style={botonPreset}>Hoy</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, alignItems: 'end' }}>
        <div>
          <label style={estiloEtiqueta} htmlFor="kpi-desde">Desde</label>
          <input
            id="kpi-desde" type="datetime-local" style={{ ...estiloCampo, width: '100%' }}
            value={isoAInputLocal(filtros.desde)}
            onChange={e => set('desde', inputLocalAIso(e.target.value) || filtros.desde)}
          />
        </div>
        <div>
          <label style={estiloEtiqueta} htmlFor="kpi-hasta">Hasta</label>
          <input
            id="kpi-hasta" type="datetime-local" style={{ ...estiloCampo, width: '100%' }}
            value={isoAInputLocal(filtros.hasta)}
            onChange={e => set('hasta', inputLocalAIso(e.target.value) || filtros.hasta)}
          />
        </div>
        <div>
          <label style={estiloEtiqueta} htmlFor="kpi-estatus">Estatus</label>
          <select id="kpi-estatus" style={{ ...estiloCampo, width: '100%' }} value={filtros.estatus} onChange={e => set('estatus', e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(ETIQUETA_ESTATUS).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>{etiqueta}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={estiloEtiqueta} htmlFor="kpi-canal">Canal</label>
          <select id="kpi-canal" style={{ ...estiloCampo, width: '100%' }} value={filtros.canal} onChange={e => set('canal', e.target.value)}>
            <option value="">Todos</option>
            {CANALES.map(c => <option key={c.valor} value={c.valor}>{c.etiqueta}</option>)}
          </select>
        </div>
        <div>
          <label style={estiloEtiqueta} htmlFor="kpi-prioridad">Prioridad</label>
          <select id="kpi-prioridad" style={{ ...estiloCampo, width: '100%' }} value={filtros.prioridadId} onChange={e => set('prioridadId', e.target.value)}>
            <option value="">Todas</option>
            {prioridades.map(p => <option key={p.id} value={String(p.id)}>{p.nombre}</option>)}
          </select>
        </div>
        <div>
          <label style={estiloEtiqueta} htmlFor="kpi-tipo">Tipo de incidente</label>
          <select id="kpi-tipo" style={{ ...estiloCampo, width: '100%' }} value={filtros.tipoIncidenteId} onChange={e => set('tipoIncidenteId', e.target.value)}>
            <option value="">Todos</option>
            {tiposIncidente.map(t => <option key={t.id} value={String(t.id)}>{t.nombre}</option>)}
          </select>
        </div>
        <button
          type="button" onClick={() => onAplicar(filtros)} disabled={cargando}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '9px 16px', border: 'none', background: cargando ? '#94a3b8' : '#1f355a',
            color: '#fff', cursor: cargando ? 'default' : 'pointer',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}
        >
          <RefreshCw size={13} style={cargando ? { animation: 'kpi-spin 1s linear infinite' } : undefined} />
          {cargando ? 'Cargando' : 'Actualizar'}
        </button>
      </div>
    </section>
  )
}

const botonPreset: React.CSSProperties = {
  padding: '5px 11px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer',
  fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: '#475569',
}
