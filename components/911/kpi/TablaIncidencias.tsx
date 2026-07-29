'use client'

import { MapPinOff } from 'lucide-react'
import type { IncidenteGeo } from '@/lib/incidentes/types'
import { ETIQUETA_ESTATUS, COLOR_ESTATUS, formatearFechaHora, ubicacionTexto } from './formato'
import { colorPrioridad } from './useMapaIncidencias'

const th: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace',
  fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b',
  borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  padding: '10px 12px', fontFamily: 'Inter, sans-serif', fontSize: 12,
  color: '#334155', borderBottom: '1px solid #f1f5f9',
}

export function TablaIncidencias({ incidentes, previewId, onSeleccionar, onVerDetalle }: {
  incidentes: IncidenteGeo[]
  previewId: string | null
  onSeleccionar: (id: string) => void
  onVerDetalle: (id: string) => void
}) {
  return (
    <section style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .kpi-tabla tbody tr { transition: background-color 0.15s; cursor: pointer; }
        .kpi-tabla tbody tr:hover { background-color: #f1f5f9; }
        .kpi-tabla tbody tr.kpi-fila-activa { background-color: #eff6ff; box-shadow: inset 3px 0 0 #1f355a; }
      `}} />
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <h2 style={{
          margin: 0, fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0f172a',
        }}>
          Incidencias del periodo
        </h2>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.1em' }}>
          {incidentes.length} REGISTRO{incidentes.length === 1 ? '' : 'S'}
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="kpi-tabla" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Folio</th>
              <th style={th}>Fecha / Hora</th>
              <th style={th}>Tipo</th>
              <th style={th}>Prioridad</th>
              <th style={th}>Canal</th>
              <th style={th}>Ubicación</th>
              <th style={th}>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {incidentes.length === 0 && (
              <tr>
                <td style={{ ...td, textAlign: 'center', padding: '32px 12px', color: '#94a3b8' }} colSpan={7}>
                  Sin incidencias en el rango seleccionado
                </td>
              </tr>
            )}
            {incidentes.map(inc => {
              const sinCoordenadas = inc.latitud == null || inc.longitud == null
              return (
                <tr
                  key={inc.id}
                  className={inc.id === previewId ? 'kpi-fila-activa' : ''}
                  onClick={() => {
                    const tieneCoord = inc.latitud != null && inc.longitud != null
                    if (tieneCoord) {
                      onSeleccionar(inc.id)
                    } else {
                      onVerDetalle(inc.id)
                    }
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
                  <td style={{ ...td, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#0f172a' }}>
                    {inc.folio}
                  </td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>{formatearFechaHora(inc.fechaHoraInicio)}</td>
                  <td style={td}>{inc.tipoIncidente ?? '—'}</td>
                  <td style={td}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      color: colorPrioridad(inc.prioridadOrden), fontWeight: 600,
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: colorPrioridad(inc.prioridadOrden) }} />
                      {inc.prioridad ?? 'S/D'}
                    </span>
                  </td>
                  <td style={{ ...td, textTransform: 'uppercase', fontSize: 11 }}>{inc.canal}</td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {sinCoordenadas && (
                        <MapPinOff size={13} color="#94a3b8" aria-label="Sin coordenadas: no aparece en los mapas" />
                      )}
                      {ubicacionTexto(inc)}
                    </span>
                  </td>
                  <td style={td}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.08em',
                      textTransform: 'uppercase', padding: '3px 8px',
                      color: COLOR_ESTATUS[inc.estatus] ?? '#64748b',
                      border: `1px solid ${COLOR_ESTATUS[inc.estatus] ?? '#cbd5e1'}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {ETIQUETA_ESTATUS[inc.estatus] ?? inc.estatus}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
