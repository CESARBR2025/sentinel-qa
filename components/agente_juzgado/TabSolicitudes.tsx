'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TomarCasoBoton } from './TomarCasoModal'
import { SharedPedirEvidenciasBoton } from '@/components/shared/PedirEvidenciasModal'
import { accionPedirEvidencias } from '@/lib/agente_juzgado/actions'
import type { SolicitudEvidencia } from '@/lib/agente_juzgado/types'

interface Props {
  recepcionadas: SolicitudEvidencia[]
  enRevision: SolicitudEvidencia[]
  conMonitorista: SolicitudEvidencia[]
  completadas: SolicitudEvidencia[]
}

type Tab = 'recepcionadas' | 'en_revision' | 'con_monitorista' | 'completadas'

const tabs: { key: Tab; label: string; color: string }[] = [
  { key: 'recepcionadas',    label: 'Recepcionadas',    color: '#d97706' },
  { key: 'en_revision',      label: 'En Revisión',      color: '#059669' },
  { key: 'con_monitorista',  label: 'Con Monitorista',  color: '#0891b2' },
  { key: 'completadas',      label: 'Completadas',      color: '#6b7280' },
]

function parseEvidencias(raw: string | null): { solicitud_id: number; fecha_peticion: string; colonia: string; calle: string; numero: string; hora_inicio: string; hora_fin: string; atendida: boolean }[] {
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function TabSolicitudes({ recepcionadas, enRevision, conMonitorista, completadas }: Props) {
  const [tab, setTab] = useState<Tab>('recepcionadas')

  const map: Record<Tab, SolicitudEvidencia[]> = { recepcionadas, en_revision: enRevision, con_monitorista: conMonitorista, completadas }
  const data = map[tab]

  return (
    <>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e2e8f0' }}>
        {tabs.map(t => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '12px 28px',
                border: 'none',
                borderBottom: active ? `2px solid ${t.color}` : '2px solid transparent',
                background: active ? '#ffffff' : 'transparent',
                color: active ? t.color : '#94a3b8',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, display: 'inline-block' }}></span>
              {t.label}
              <span style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: 10,
                background: active ? '#f1f5f9' : '#f8fafc',
                color: active ? t.color : '#94a3b8',
                padding: '1px 8px',
                borderRadius: 10,
              }}>
                {map[t.key].length}
              </span>
            </button>
          )
        })}
      </div>

      {data.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 12, color: '#94a3b8', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, padding: 80,
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <span>No hay solicitudes {tab === 'recepcionadas' ? 'recepcionadas' : tab === 'en_revision' ? 'en revisión' : tab === 'con_monitorista' ? 'con monitorista' : 'completadas'}</span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead className="st-h">
              <tr>
                <th>Folio Denuncia</th>
                <th>IPH</th>
                <th>Folio CU</th>
                <th>Corporación</th>
                <th>Delito</th>
                <th>Fecha Reporte</th>
                <th>Estado Trámite</th>
                <th>Estado Evidencia</th>
                <th style={{ textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {data.map(s => (
                <tr key={s.id} className="st-r">
                  <td style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 600, color: '#0f172a' }}>{s.folioDenuncia ?? '—'}</td>
                  <td>{s.iph ?? '—'}</td>
                  <td>{s.folioCu ?? '—'}</td>
                  <td>{s.corporacion ?? '—'}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.delito ?? '—'}</td>
                  <td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>{s.fechaReporte ?? '—'}</td>
                  <td>
                    <span className="badge-estado" style={{
                      background: s.estadoTramite === 'EN_ANALISIS' ? '#fef3c7' :
                                   s.estadoTramite === 'EN_REVISION_JUZGADO' ? '#d1fae5' :
                                   s.estadoTramite === 'CERRADO' ? '#f1f5f9' :
                                   '#f1f5f9',
                      color: s.estadoTramite === 'EN_ANALISIS' ? '#92400e' :
                             s.estadoTramite === 'EN_REVISION_JUZGADO' ? '#065f46' :
                             s.estadoTramite === 'CERRADO' ? '#475569' :
                             '#475569',
                    }}>{s.estadoTramite ?? '—'}</span>
                  </td>
                  <td>
                    <span className="badge-estado" style={{
                      background: s.estadoEvidencia === 'EVIDENCIA_ENVIADA' ? '#d1fae5' :
                                   s.estadoEvidencia === 'SIN_EVIDENCIA_REQUERIDA' ? '#d1fae5' :
                                   s.estadoEvidencia === 'PENDIENTE_MONITORISTA' ? '#fef3c7' :
                                   '#f1f5f9',
                      color: s.estadoEvidencia === 'EVIDENCIA_ENVIADA' ? '#065f46' :
                             s.estadoEvidencia === 'SIN_EVIDENCIA_REQUERIDA' ? '#065f46' :
                             s.estadoEvidencia === 'PENDIENTE_MONITORISTA' ? '#92400e' :
                             '#475569',
                    }}>{s.estadoEvidencia ?? '—'}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {tab === 'recepcionadas' ? (
                      <TomarCasoBoton solicitudId={s.id} />
                    ) : tab === 'en_revision' ? (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <Link href={`/agente_juzgado/solicitudes/${s.id}`} style={{
                          fontFamily: 'JetBrains Mono,monospace',
                          fontSize: 9,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '5px 14px',
                          border: `1px solid ${s.folioSija ? '#059669' : '#7c3aed'}`,
                          background: '#ffffff',
                          color: s.folioSija ? '#059669' : '#7c3aed',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = s.folioSija ? '#059669' : '#7c3aed'; e.currentTarget.style.color = '#ffffff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = s.folioSija ? '#059669' : '#7c3aed'; }}
                        >
                          {s.folioSija ? 'Detalles' : 'Capturar'}
                        </Link>
                      </div>
                    ) : tab === 'con_monitorista' ? (
                      <SharedPedirEvidenciasBoton
                        solicitudId={s.id}
                        existingEvidencias={parseEvidencias(s.monitoristaFechasRequeridas)}
                        accion={accionPedirEvidencias}
                      />
                    ) : (
                      <Link href={`/agente_juzgado/solicitudes/${s.id}`} style={{
                        fontFamily: 'JetBrains Mono,monospace',
                        fontSize: 9,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '5px 14px',
                        border: '1px solid #6b7280',
                        background: '#ffffff',
                        color: '#6b7280',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#6b7280'; e.currentTarget.style.color = '#ffffff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#6b7280'; }}
                      >
                        Detalles
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
