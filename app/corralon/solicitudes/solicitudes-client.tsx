'use client'

import { useState } from 'react'
import type { SolicitudesResponse } from '@/lib/corralon/types'

const estatusLabels: Record<string, string> = {
  LIBERADA_POR_ACCIDENTE: 'Liberado por Accidente',
  DELITO: 'Por Delito',
  LIBERADA_POR_INFRACCION: 'Liberado por Infracción',
  LIBERADA_POR_DELITO: 'Liberado por Delito',
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

export function SolicitudesClient({ solicitudes }: { solicitudes: SolicitudesResponse }) {
  const [tab, setTab] = useState<'pendientes' | 'finalizadas'>('pendientes')

  const data = solicitudes.data
  const pendientes = data
  const finalizadas: typeof data = []

  return (
    <div>
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
                  <th style={thStyle}>Infractor</th>
                  <th style={thStyle}>Fecha Recepción</th>
                </tr>
              </thead>
              <tbody>
                {pendientes.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#2563eb', fontWeight: 600 }}>
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
                      {row.nombreInfractor ? (
                        <div>
                          <div style={{ fontWeight: 500 }}>{row.nombreInfractor}</div>
                          {row.correoInfractor && (
                            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8' }}>
                              {row.correoInfractor}
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'finalizadas' && (
        <div style={{
          textAlign: 'center',
          padding: 48,
          fontFamily: 'JetBrains Mono,monospace',
          fontSize: 12,
          color: '#94a3b8',
        }}>
          No hay solicitudes finalizadas
        </div>
      )}
    </div>
  )
}

function estatusBg(estatus: string): string {
  if (estatus === 'LIBERADA_POR_ACCIDENTE') return '#fef2f2'
  if (estatus === 'DELITO' || estatus === 'LIBERADA_POR_DELITO') return '#faf5ff'
  return '#f0fdf4'
}

function estatusColor(estatus: string): string {
  if (estatus === 'LIBERADA_POR_ACCIDENTE') return '#dc2626'
  if (estatus === 'DELITO' || estatus === 'LIBERADA_POR_DELITO') return '#7c3aed'
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
