'use client'

import { useState } from 'react'
import type { TabSolicitudes } from '@/lib/corralon/types'
import { SubirOficioModal } from './subir-oficio-modal'


const estatusLabels: Record<string, string> = {
  LIBERADA_POR_ACCIDENTE: 'Liberado por Accidente',
  DELITO: 'Por Delito',
  LIBERADA_POR_INFRACCION: 'Liberado por Infracción',
  LIBERADA_POR_DELITO: 'Liberado por Delito',
  FINALIZADA_ACCIDENTE: 'Finalizado Accidente',
  FINALIZADA_DELITO: 'Finalizado Delito',
  FINALIZADA_INFRACCION: 'Finalizado Infracción',
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

export function SolicitudesClient({ solicitudes }: { solicitudes: TabSolicitudes }) {
  const [tab, setTab] = useState<'pendientes' | 'finalizadas'>('pendientes')
  const [modalInfraccion, setModalInfraccion] = useState<{ id: string; folio: string } | null>(null)
  const baseUrl = process.env.NEXT_PUBLIC_WS_EXPEDIENTE ?? ''

  const { pendientes, finalizadas } = solicitudes

  return (
    <div>
      {modalInfraccion && (
        <SubirOficioModal
          infraccionId={modalInfraccion.id}
          folio={modalInfraccion.folio}
          onClose={() => setModalInfraccion(null)}
        />
      )}
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
        <button
          onClick={() => setTab('pendientes')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: tab === 'pendientes' ? '#d97706' : '#94a3b8',
            borderBottom: tab === 'pendientes' ? '2px solid #d97706' : '2px solid transparent',
            fontWeight: tab === 'pendientes' ? 600 : 400,
            transition: 'all 0.15s ease',
          }}
        >
          Pendientes ({pendientes.length})
        </button>
        <button
          onClick={() => setTab('finalizadas')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: tab === 'finalizadas' ? '#d97706' : '#94a3b8',
            borderBottom: tab === 'finalizadas' ? '2px solid #d97706' : '2px solid transparent',
            fontWeight: tab === 'finalizadas' ? 600 : 400,
            transition: 'all 0.15s ease',
          }}
        >
          Finalizadas ({finalizadas.length})
        </button>
      </div>

      {/* Table */}
      {tab === 'pendientes' && (
        <div style={{ overflowX: 'auto' }}>
          {pendientes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 48,
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 12,
              color: '#94a3b8',
            }}>
              No hay solicitudes pendientes
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <th style={thStyle}>Folio</th>
                  <th style={thStyle}>Placa</th>
                  <th style={thStyle}>Estatus</th>
                  <th style={thStyle}>Titular</th>
                  <th style={thStyle}>Fecha Recepción</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendientes.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#1f355a', fontWeight: 600 }}>
                        {row.folio}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>
                      {row.placa || '—'}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        fontFamily: 'JetBrains Mono,monospace',
                        fontSize: 10,
                        fontWeight: 600,
                        background: estatusBg(row.estatusDependencia),
                        color: estatusColor(row.estatusDependencia),
                        letterSpacing: '0.05em',
                      }}>
                        {estatusLabels[row.estatusDependencia] || row.estatusDependencia}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {row.nombreTitular ? (
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            {row.nombreTitular} {row.apellidoPaternoTitular ?? ''} {row.apellidoMaternoTitular ?? ''}
                          </div>
                          {row.correoTitular && (
                            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8' }}>
                              {row.correoTitular}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#64748b' }}>
                      {formatDate(row.createdAt)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <button
                          onClick={() => setModalInfraccion({ id: row.id, folio: row.folio })}
                          style={{
                            padding: '6px 14px',
                            border: '1px solid #d97706',
                            background: '#fffbeb',
                            cursor: 'pointer',
                            fontFamily: 'JetBrains Mono,monospace',
                            fontSize: 10,
                            fontWeight: 600,
                            color: '#d97706',
                            letterSpacing: '0.05em',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#d97706'; e.currentTarget.style.color = '#ffffff' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fffbeb'; e.currentTarget.style.color = '#d97706' }}
                        >
                          Subir Oficio
                        </button>
                        {row.urlOrdenSalida && (
                          <a
                            href={`/api/expediente/proxy?url=${encodeURIComponent(`${baseUrl}${row.urlOrdenSalida}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '6px 14px',
                              border: '1px solid #1f355a',
                              background: '#eff1f3',
                              cursor: 'pointer',
                              fontFamily: 'JetBrains Mono,monospace',
                              fontSize: 10,
                              fontWeight: 600,
                              color: '#1f355a',
                              letterSpacing: '0.05em',
                              transition: 'all 0.15s ease',
                              whiteSpace: 'nowrap',
                              textDecoration: 'none',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#1f355a'; e.currentTarget.style.color = '#ffffff' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#eff1f3'; e.currentTarget.style.color = '#1f355a' }}
                          >
                            Ver Orden
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'finalizadas' && (
        <div style={{ overflowX: 'auto' }}>
          {finalizadas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 48,
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 12,
              color: '#94a3b8',
            }}>
              No hay solicitudes finalizadas
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <th style={thStyle}>Folio</th>
                  <th style={thStyle}>Placa</th>
                  <th style={thStyle}>Estatus</th>
                  <th style={thStyle}>Titular</th>
                  <th style={thStyle}>Fecha Finalización</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {finalizadas.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#1f355a', fontWeight: 600 }}>
                        {row.folio}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>
                      {row.placa || '—'}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        fontFamily: 'JetBrains Mono,monospace',
                        fontSize: 10,
                        fontWeight: 600,
                        background: estatusBg(row.estatusDependencia),
                        color: estatusColor(row.estatusDependencia),
                        letterSpacing: '0.05em',
                      }}>
                        {estatusLabels[row.estatusDependencia] || row.estatusDependencia}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {row.nombreTitular ? (
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            {row.nombreTitular} {row.apellidoPaternoTitular ?? ''} {row.apellidoMaternoTitular ?? ''}
                          </div>
                          {row.correoTitular && (
                            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8' }}>
                              {row.correoTitular}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#64748b' }}>
                      {formatDate(row.createdAt)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        {row.urlOrdenSalida && (
                          <a
                            href={`/api/expediente/proxy?url=${encodeURIComponent(`${baseUrl}${row.urlOrdenSalida}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '6px 14px',
                              border: '1px solid #1f355a',
                              background: '#eff1f3',
                              cursor: 'pointer',
                              fontFamily: 'JetBrains Mono,monospace',
                              fontSize: 10,
                              fontWeight: 600,
                              color: '#1f355a',
                              letterSpacing: '0.05em',
                              transition: 'all 0.15s ease',
                              whiteSpace: 'nowrap',
                              textDecoration: 'none',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#1f355a'; e.currentTarget.style.color = '#ffffff' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#eff1f3'; e.currentTarget.style.color = '#1f355a' }}
                          >
                            Ver Orden
                          </a>
                        )}
                        {row.urlOficioPagoCorralon && (
                          <a
                            href={`/api/expediente/proxy?url=${encodeURIComponent(`${baseUrl}${row.urlOficioPagoCorralon}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '6px 14px',
                              border: '1px solid #059669',
                              background: '#f0fdf4',
                              cursor: 'pointer',
                              fontFamily: 'JetBrains Mono,monospace',
                              fontSize: 10,
                              fontWeight: 600,
                              color: '#059669',
                              letterSpacing: '0.05em',
                              transition: 'all 0.15s ease',
                              whiteSpace: 'nowrap',
                              textDecoration: 'none',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.color = '#ffffff' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#059669' }}
                          >
                            Ver Oficio
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

function estatusBg(estatus: string): string {
  if (estatus === 'LIBERADA_POR_ACCIDENTE' || estatus === 'FINALIZADA_ACCIDENTE') return '#fef2f2'
  if (estatus === 'DELITO' || estatus === 'LIBERADA_POR_DELITO' || estatus === 'FINALIZADA_DELITO') return '#faf5ff'
  if (estatus === 'FINALIZADA_INFRACCION') return '#f0fdf4'
  return '#f0fdf4'
}

function estatusColor(estatus: string): string {
  if (estatus === 'LIBERADA_POR_ACCIDENTE' || estatus === 'FINALIZADA_ACCIDENTE') return '#dc2626'
  if (estatus === 'DELITO' || estatus === 'LIBERADA_POR_DELITO' || estatus === 'FINALIZADA_DELITO') return '#7c3aed'
  if (estatus === 'FINALIZADA_INFRACCION') return '#16a34a'
  return '#16a34a'
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontFamily: 'JetBrains Mono,monospace',
  fontSize: 10,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#64748b',
  fontWeight: 600,
}

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  verticalAlign: 'middle',
}
