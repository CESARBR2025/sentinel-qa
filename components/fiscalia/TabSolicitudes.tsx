'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TomarCasoBoton } from './TomarCasoModal'
import { SegmentPage } from '@/components/partials/SegmentPage'
import type { SolicitudEvidencia } from '@/lib/fiscalia/types'
import { Eye, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface Props {
  pendientes: SolicitudEvidencia[]
  finalizadas: SolicitudEvidencia[]
}

type Tab = 'pendientes' | 'finalizadas'

export function TabSolicitudes({ pendientes, finalizadas }: Props) {
  const [tab, setTab] = useState<Tab>('pendientes')

  const map: Record<Tab, SolicitudEvidencia[]> = { pendientes, finalizadas }
  const data = map[tab]

  return (
    <>
      {/* Segmento de estatus */}
      <SegmentPage
        tabs={[
          { key: 'pendientes', label: 'Pendientes', icon: <AlertTriangle size={13} />, count: pendientes.length, accent: '#b45309' },
          { key: 'finalizadas', label: 'Finalizadas', icon: <CheckCircle2 size={13} />, count: finalizadas.length, accent: '#475569' },
        ]}
        activeKey={tab}
        onChange={k => setTab(k as Tab)}
      />

      {/* Table */}
      {data.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 12, color: '#94a3b8', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, padding: 80
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <span>No hay solicitudes {tab === 'pendientes' ? 'pendientes' : 'finalizadas'}</span>
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
                  <td>{s.delito ?? '—'}</td>
                  <td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>{s.fechaReporte ?? '—'}</td>
                  <td>
                    <span className="badge-estado" style={{
                      background: s.estadoTramite === 'RECIBIDA' ? '#fef3c7' : '#e0e7ff',
                      color: s.estadoTramite === 'RECIBIDA' ? '#92400e' : '#3730a3',
                    }}>{s.estadoTramite ?? '—'}</span>
                  </td>
                  <td>
                    <span className="badge-estado" style={{
                      background: s.estadoEvidencia === 'PENDIENTE_MONITORISTA' ? '#cffafe' :
                                   s.estadoEvidencia === 'EVIDENCIA_ENVIADA' ? '#d1fae5' :
                                   s.estadoEvidencia === 'SIN_EVIDENCIA_REQUERIDA' ? '#d1fae5' :
                                   '#f1f5f9',
                      color: s.estadoEvidencia === 'PENDIENTE_MONITORISTA' ? '#155e75' :
                             s.estadoEvidencia === 'EVIDENCIA_ENVIADA' ? '#065f46' :
                             s.estadoEvidencia === 'SIN_EVIDENCIA_REQUERIDA' ? '#065f46' :
                             '#475569',
                    }}>{s.estadoEvidencia ?? '—'}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {tab === 'pendientes' ? (
                      <TomarCasoBoton solicitudId={s.id} />
                    ) : (
                      <Link href={`/fiscalia/expedientes/${s.token ?? s.id}`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontFamily: 'JetBrains Mono,monospace', fontSize: 9,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        padding: '5px 14px', border: '1px solid #475569',
                        background: '#ffffff', color: '#475569',
                        cursor: 'pointer', textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#475569'; e.currentTarget.style.color = '#ffffff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#475569'; }}
                      >
                        <Eye size={12} /> Ver Expediente
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
