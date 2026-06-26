'use client'

import { useState } from 'react'
import { TomarCasoBoton } from './TomarCasoModal'
import { PedirEvidenciasBoton } from './PedirEvidenciasModal'
import type { SolicitudEvidencia } from '@/lib/fiscalia/types'

interface Props {
  pendientes: SolicitudEvidencia[]
  enProceso: SolicitudEvidencia[]
  conMonitorista: SolicitudEvidencia[]
}

type Tab = 'pendientes' | 'en_proceso' | 'con_monitorista'

const tabs: { key: Tab; label: string; color: string }[] = [
  { key: 'pendientes',       label: 'Pendientes',         color: '#d97706' },
  { key: 'en_proceso',       label: 'En Proceso',         color: '#7c3aed' },
  { key: 'con_monitorista',  label: 'Con Monitorista',    color: '#0891b2' },
]

export function TabSolicitudes({ pendientes, enProceso, conMonitorista }: Props) {
  const [tab, setTab] = useState<Tab>('pendientes')

  const map: Record<Tab, SolicitudEvidencia[]> = { pendientes, en_proceso: enProceso, con_monitorista: conMonitorista }
  const data = map[tab]

  return (
    <>
      {/* Tabs */}
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
          <span>No hay solicitudes {tab === 'pendientes' ? 'pendientes' : tab === 'en_proceso' ? 'en proceso' : 'con monitorista'}</span>
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
                      background: s.estadoTramite === 'RECIBIDA' ? '#fef3c7' : '#e0e7ff',
                      color: s.estadoTramite === 'RECIBIDA' ? '#92400e' : '#3730a3',
                    }}>{s.estadoTramite ?? '—'}</span>
                  </td>
                  <td>
                    <span className="badge-estado" style={{
                      background: s.estadoEvidencia === 'PENDIENTE_MONITORISTA' ? '#cffafe' : '#f1f5f9',
                      color: s.estadoEvidencia === 'PENDIENTE_MONITORISTA' ? '#155e75' : '#475569',
                    }}>{s.estadoEvidencia ?? '—'}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {tab === 'pendientes' ? (
                      <TomarCasoBoton solicitudId={s.id} />
                    ) : tab === 'en_proceso' ? (
                      <PedirEvidenciasBoton solicitudId={s.id} />
                    ) : (
                      <span style={{
                        fontFamily: 'JetBrains Mono,monospace',
                        fontSize: 9,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#0891b2',
                      }}>
                        Enviado
                      </span>
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
