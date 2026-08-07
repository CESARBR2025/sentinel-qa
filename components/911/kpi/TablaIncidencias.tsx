'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUp, ArrowDown, Search, Download, ChevronLeft, ChevronRight, X,
  Hash, Calendar, Tag, Zap, PhoneCall, MessageCircle, Radio, MapPin, MapPinOff, CircleDot, ListChecks, Inbox,
} from 'lucide-react'
import type { IncidenteGeo } from '@/lib/incidentes/types'
import { ETIQUETA_ESTATUS, COLOR_ESTATUS, BG_ESTATUS, formatearFechaHora, ubicacionTexto } from './formato'
import { colorPrioridad } from './useMapaIncidencias'

const PAGE_SIZE = 20

type ClaveSort = 'folio' | 'fecha' | 'prioridad' | 'estatus'
type DirSort = 'asc' | 'desc'

const CANALES_ICONO: Record<string, { icono: React.ReactNode; etiqueta: string }> = {
  '911': { icono: <PhoneCall size={13} strokeWidth={1.75} />, etiqueta: '911' },
  whatsapp: { icono: <MessageCircle size={13} strokeWidth={1.75} />, etiqueta: 'WhatsApp' },
  radio: { icono: <Radio size={13} strokeWidth={1.75} />, etiqueta: 'Radio' },
}

const th: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', fontFamily: 'var(--apple-font-display)',
  fontSize: 12, fontWeight: 600, color: '#64748b',
  borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  padding: '10px 12px', fontFamily: 'var(--apple-font-display)', fontSize: 13,
  color: '#334155', borderBottom: '1px solid #f1f5f9',
}

export function TablaIncidencias({ incidentes, previewId, onSeleccionar, onVerDetalle }: {
  incidentes: IncidenteGeo[]
  previewId: string | null
  onSeleccionar: (id: string) => void
  onVerDetalle: (id: string) => void
}) {
  const [sort, setSort] = useState<{ clave: ClaveSort; dir: DirSort }>({ clave: 'fecha', dir: 'desc' })
  const [query, setQuery] = useState('')
  const [pagina, setPagina] = useState(1)

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase()
    let lista = incidentes
    if (q) {
      lista = incidentes.filter(i =>
        [i.folio, i.tipoIncidente, i.canal, i.calle, i.colonia]
          .filter(Boolean)
          .some(v => (v as string).toLowerCase().includes(q)),
      )
    }
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...lista].sort((a, b) => {
      switch (sort.clave) {
        case 'folio': return a.folio.localeCompare(b.folio) * dir
        case 'prioridad': return ((a.prioridadOrden ?? -1) - (b.prioridadOrden ?? -1)) * dir
        case 'estatus': return a.estatus.localeCompare(b.estatus) * dir
        default: return (new Date(a.fechaHoraInicio).getTime() - new Date(b.fechaHoraInicio).getTime()) * dir
      }
    })
  }, [incidentes, query, sort])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE))
  const paginaActual = Math.min(pagina, totalPaginas)
  const filas = filtrados.slice((paginaActual - 1) * PAGE_SIZE, paginaActual * PAGE_SIZE)

  const alternarSort = (clave: ClaveSort) => {
    setSort(prev => prev.clave === clave
      ? { clave, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { clave, dir: clave === 'prioridad' || clave === 'fecha' ? 'desc' : 'asc' })
    setPagina(1)
  }

  const exportarCsv = () => {
    const encabezados = ['Folio', 'Fecha', 'Tipo', 'Prioridad', 'Canal', 'Ubicación', 'Estatus']
    const filasCsv = filtrados.map(i => [
      i.folio,
      formatearFechaHora(i.fechaHoraInicio),
      i.tipoIncidente ?? '',
      i.prioridad ?? '',
      i.canal,
      ubicacionTexto(i),
      ETIQUETA_ESTATUS[i.estatus] ?? i.estatus,
    ])
    const csv = [encabezados, ...filasCsv]
      .map(f => f.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `incidencias-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)', overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .kpi-tabla { width: 100%; border-collapse: collapse; }
        .kpi-tabla thead th { position: sticky; top: 0; background: #f8fafc; z-index: 1; }
        .kpi-tabla tbody tr { transition: background-color 0.15s; cursor: pointer; }
        .kpi-tabla tbody tr:hover { background-color: #f8fafc; }
        .kpi-tabla tbody tr.kpi-fila-activa { background-color: #eff6ff; box-shadow: inset 3px 0 0 #1f355a; }
        .kpi-tabla-scroll { max-height: 560px; overflow-y: auto; }
        .kpi-th-btn { display: inline-flex; align-items: center; gap: 5px; border: none; background: none; padding: 0; font-family: var(--apple-font-display); font-size: 12px; font-weight: 600; color: #64748b; cursor: pointer; transition: color 0.15s ease; }
        .kpi-th-btn:hover { color: #1f355a; }
        .kpi-th-btn:hover .kpi-th-ico { color: #1f355a; }
        .kpi-th-btn.kpi-th-activa { color: #1f355a; }
        .kpi-th-btn.kpi-th-activa .kpi-th-ico { color: #1f355a; }
        .kpi-th-ico { display: flex; color: #94a3b8; transition: color 0.15s ease; }
        .kpi-search { padding: 8px 32px; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); background: #f8fafc; font-family: var(--apple-font-display); font-size: 13px; color: #1e293b; min-width: 0; width: 100%; transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease; }
        .kpi-search:hover { border-color: #cbd5e1; }
        .kpi-search:focus { outline: none; border-color: #1f355a; background: #fff; box-shadow: 0 0 0 3px rgba(31, 53, 90, 0.12); }
        .kpi-search-clear { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border: none; border-radius: var(--radius-full); background: transparent; color: #94a3b8; cursor: pointer; transition: all 0.15s ease; }
        .kpi-search-clear:hover { background: #e2e8f0; color: #475569; }
        .kpi-btn-export { display: inline-flex; align-items: center; gap: 6px; padding: 9px 14px; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); background: #fff; color: #475569; cursor: pointer; font-family: var(--apple-font-display); font-weight: 600; font-size: 13px; transition: all 0.3s ease-out; }
        .kpi-btn-export:hover:not(:disabled) { border-color: #1f355a; color: #1f355a; background: rgba(31, 53, 90, 0.05); }
        .kpi-btn-export:active:not(:disabled) { transform: scale(0.97); transition: transform 0.12s ease-out, border-color 0.12s ease-out; }
        .kpi-btn-export:disabled { opacity: 0.5; cursor: default; }
        @media (prefers-reduced-motion: reduce) { .kpi-btn-export:active:not(:disabled) { transform: none; } }
        .kpi-pag-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 1px solid #e2e8f0; border-radius: var(--radius-md); background: #fff; color: #475569; cursor: pointer; transition: all 0.2s ease; }
        .kpi-pag-btn:hover:not(:disabled) { border-color: #1f355a; color: #1f355a; background: rgba(31, 53, 90, 0.05); }
        .kpi-pag-btn:active:not(:disabled) { transform: scale(0.94); }
        .kpi-pag-btn:disabled { opacity: 0.35; cursor: default; }
        @media (prefers-reduced-motion: reduce) { .kpi-pag-btn:active:not(:disabled) { transform: none; } }
      `}} />

      <div style={{
        padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <h2 style={{
            margin: 0, fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 16,
            color: '#0f172a', whiteSpace: 'nowrap',
          }}>
            Incidencias del periodo
          </h2>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 11,
            color: '#64748b', background: '#f1f5f9', padding: '4px 12px', borderRadius: 'var(--radius-full)',
            whiteSpace: 'nowrap',
          }}>
            <ListChecks size={12} strokeWidth={2} />
            {filtrados.length} de {incidentes.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: 0, flex: '1 1 200px' }}>
            <Search size={14} style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: '#94a3b8', pointerEvents: 'none',
            }} />
            <input
              className="kpi-search"
              type="search"
              placeholder="Buscar folio, tipo, zona…"
              value={query}
              onChange={e => { setQuery(e.target.value); setPagina(1) }}
              aria-label="Buscar en resultados"
            />
            {query && (
              <button
                type="button" className="kpi-search-clear" aria-label="Limpiar búsqueda"
                onClick={() => { setQuery(''); setPagina(1) }}
              >
                <X size={13} />
              </button>
            )}
          </div>
          <button type="button" className="kpi-btn-export" onClick={exportarCsv} disabled={filtrados.length === 0}>
            <Download size={14} /> CSV
          </button>
        </div>
      </div>

      <div className="tabla-wrap kpi-tabla-scroll">
        <table className="kpi-tabla">
          <thead>
            <tr>
              <th style={th}>
                <ColumnaBoton etiqueta="Folio" icono={<Hash size={12} strokeWidth={2} />} clave="folio" sort={sort} onClick={() => alternarSort('folio')} />
              </th>
              <th style={th}>
                <ColumnaBoton etiqueta="Fecha / Hora" icono={<Calendar size={12} strokeWidth={2} />} clave="fecha" sort={sort} onClick={() => alternarSort('fecha')} />
              </th>
              <th style={th}><EtiquetaColumna etiqueta="Tipo" icono={<Tag size={12} strokeWidth={2} />} /></th>
              <th style={th}>
                <ColumnaBoton etiqueta="Prioridad" icono={<Zap size={12} strokeWidth={2} />} clave="prioridad" sort={sort} onClick={() => alternarSort('prioridad')} />
              </th>
              <th style={th}><EtiquetaColumna etiqueta="Canal" icono={<PhoneCall size={12} strokeWidth={2} />} /></th>
              <th style={th}><EtiquetaColumna etiqueta="Ubicación" icono={<MapPin size={12} strokeWidth={2} />} /></th>
              <th style={th}>
                <ColumnaBoton etiqueta="Estatus" icono={<CircleDot size={12} strokeWidth={2} />} clave="estatus" sort={sort} onClick={() => alternarSort('estatus')} />
              </th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr>
                <td style={{ ...td, padding: '40px 12px', textAlign: 'center' }} colSpan={7}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: '#94a3b8' }}>
                    <Inbox size={22} strokeWidth={1.5} />
                    <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13 }}>
                      {incidentes.length === 0
                        ? 'Sin incidencias en el rango seleccionado'
                        : 'Sin resultados para la búsqueda'}
                    </span>
                  </div>
                </td>
              </tr>
            )}
            {filas.map(inc => {
              const sinCoordenadas = inc.latitud == null || inc.longitud == null
              return (
                <tr
                  key={inc.id}
                  className={inc.id === previewId ? 'kpi-fila-activa' : ''}
                  onClick={() => {
                    const tieneCoord = inc.latitud != null && inc.longitud != null
                    if (tieneCoord) onSeleccionar(inc.id)
                    else onVerDetalle(inc.id)
                  }}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      const tieneCoord = inc.latitud != null && inc.longitud != null
                      if (tieneCoord) onSeleccionar(inc.id)
                      else onVerDetalle(inc.id)
                    }
                  }}
                >
                  <td style={{ ...td, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{inc.folio}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{formatearFechaHora(inc.fechaHoraInicio)}</td>
                  <td style={td}>{inc.tipoIncidente ?? '—'}</td>
                  <td style={td}>
                    <PrioridadChip prioridad={inc.prioridad} orden={inc.prioridadOrden} />
                  </td>
                  <td style={td}><CeldaCanal canal={inc.canal} /></td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {sinCoordenadas
                        ? <MapPinOff size={13} strokeWidth={1.75} color="#cbd5e1" aria-label="Sin coordenadas: no aparece en los mapas" />
                        : <MapPin size={13} strokeWidth={1.75} color="#cbd5e1" aria-label="Con coordenadas: aparece en el mapa" />}
                      {ubicacionTexto(inc)}
                    </span>
                  </td>
                  <td style={td}>
                    <EstatusBadge estatus={inc.estatus} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{
        padding: '12px 18px', borderTop: '1px solid #e2e8f0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b' }}>
          {filtrados.length === 0
            ? 'Sin resultados'
            : `${(paginaActual - 1) * PAGE_SIZE + 1}–${Math.min(paginaActual * PAGE_SIZE, filtrados.length)} de ${filtrados.length}`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button" className="kpi-pag-btn" aria-label="Página anterior"
            disabled={paginaActual <= 1} onClick={() => setPagina(p => p - 1)}
          >
            <ChevronLeft size={14} />
          </button>
          <span style={{
            fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 12, color: '#475569',
          }}>
            {paginaActual} / {totalPaginas}
          </span>
          <button
            type="button" className="kpi-pag-btn" aria-label="Página siguiente"
            disabled={paginaActual >= totalPaginas} onClick={() => setPagina(p => p + 1)}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}

function ColumnaBoton({ etiqueta, icono, clave, sort, onClick }: {
  etiqueta: string
  icono: React.ReactNode
  clave: ClaveSort
  sort: { clave: ClaveSort; dir: DirSort }
  onClick: () => void
}) {
  const activa = sort.clave === clave
  return (
    <button
      type="button"
      className={`kpi-th-btn${activa ? ' kpi-th-activa' : ''}`}
      onClick={onClick}
      aria-label={`Ordenar por ${etiqueta}${activa ? `, actualmente ${sort.dir === 'asc' ? 'ascendente' : 'descendente'}` : ''}`}
    >
      <span className="kpi-th-ico">{icono}</span>
      {etiqueta}
      {activa && (sort.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
    </button>
  )
}

function EtiquetaColumna({ etiqueta, icono }: { etiqueta: string; icono: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span className="kpi-th-ico">{icono}</span>
      {etiqueta}
    </span>
  )
}

function CeldaCanal({ canal }: { canal: string }) {
  const cfg = CANALES_ICONO[canal]
  if (cfg) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
        <span style={{ display: 'flex', color: '#94a3b8' }}>{cfg.icono}</span>
        {cfg.etiqueta}
      </span>
    )
  }
  return <span style={{ fontSize: 12, color: '#64748b' }}>{canal}</span>
}

function PrioridadChip({ prioridad, orden }: { prioridad: string | null; orden: number | null }) {
  const color = colorPrioridad(orden)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px', borderRadius: 'var(--radius-full)',
      background: `${color}14`, color, fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {prioridad ?? 'S/D'}
    </span>
  )
}

function EstatusBadge({ estatus }: { estatus: string }) {
  const color = COLOR_ESTATUS[estatus] ?? '#64748b'
  const bg = BG_ESTATUS[estatus] ?? '#f1f5f9'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 500,
      padding: '3px 10px', borderRadius: 'var(--radius-full)',
      background: bg, color, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {ETIQUETA_ESTATUS[estatus] ?? estatus}
    </span>
  )
}
