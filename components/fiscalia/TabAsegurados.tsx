'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Calendar, Users, ArrowRight, Shield, Clock } from 'lucide-react'
import type { AseguradoRow } from '@/lib/fiscalia/types'

interface Props {
  pendientes: AseguradoRow[]
  completados: (AseguradoRow & { puestaDisposicionId: string | null })[]
  basePath?: string
}

const tabBase: React.CSSProperties = {
  fontFamily: 'JetBrains Mono,monospace',
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  padding: '10px 24px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
}

const thSx: React.CSSProperties = {
  fontFamily: 'JetBrains Mono,monospace',
  fontSize: 10,
  color: '#64748b',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: 600,
  borderBottom: '1px solid #e2e8f0',
}

const tdSx: React.CSSProperties = {
  fontFamily: 'Inter,sans-serif',
  fontSize: 12,
  color: '#334155',
  padding: '14px 16px',
  borderBottom: '1px solid #f1f5f9',
}

export function TabAsegurados({ pendientes, completados, basePath = '/fiscalia/asegurados' }: Props) {
  const pendientesDisposicion = completados.filter(r => !r.puestaDisposicionId)
  const completadosDisposicion = completados.filter(r => r.puestaDisposicionId)

  const [tab, setTab] = useState<'pendientes' | 'completados' | 'disposicion'>('pendientes')
  const rows = tab === 'pendientes' ? pendientes : tab === 'completados' ? pendientesDisposicion : completadosDisposicion

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
        <button
          onClick={() => setTab('pendientes')}
          style={{
            ...tabBase,
            background: tab === 'pendientes' ? '#7c3aed' : 'transparent',
            color: tab === 'pendientes' ? '#ffffff' : '#94a3b8',
          }}
        >
          Pendientes ({pendientes.length})
        </button>
        <button
          onClick={() => setTab('completados')}
          style={{
            ...tabBase,
            background: tab === 'completados' ? '#059669' : 'transparent',
            color: tab === 'completados' ? '#ffffff' : '#94a3b8',
          }}
        >
          Completados ({completados.length})
        </button>
        <button
          onClick={() => setTab('disposicion')}
          style={{
            ...tabBase,
            background: tab === 'disposicion' ? '#d97706' : 'transparent',
            color: tab === 'disposicion' ? '#ffffff' : '#94a3b8',
          }}
        >
          <Clock size={12} style={{ marginRight: 6 }} />
          Puesta a Disposición ({completadosDisposicion.length})
        </button>
      </div>

      {rows.length === 0 ? (
        <div style={{
          fontFamily: 'Inter,sans-serif',
          fontSize: 13,
          color: '#94a3b8',
          textAlign: 'center',
          padding: '48px 0',
        }}>
          {tab === 'pendientes' && 'No hay asegurados pendientes'}
          {tab === 'completados' && 'No hay asegurados completados pendientes de disposición'}
          {tab === 'disposicion' && 'No hay registros con puesta a disposición'}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thSx}><FileText size={12} style={{ marginRight: 6 }} />Folio Reporte</th>
                <th style={thSx}><FileText size={12} style={{ marginRight: 6 }} />Folio Denuncia</th>
                <th style={thSx}><Calendar size={12} style={{ marginRight: 6 }} />Fecha</th>
                <th style={thSx}><Users size={12} style={{ marginRight: 6 }} />Detenidos</th>
                <th style={thSx}><Shield size={12} style={{ marginRight: 6 }} />Oficial</th>
                {tab !== 'pendientes' && (
                  <th style={thSx}><FileText size={12} style={{ marginRight: 6 }} />Folio Asegurados</th>
                )}
                <th style={{ ...thSx, textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} style={{ transition: 'background 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={tdSx}>{row.folioReporteCampo}</td>
                  <td style={tdSx}>{row.folioDenuncia ?? '—'}</td>
                  <td style={tdSx}>
                    {new Date(row.createdAt).toLocaleDateString('es-MX', {
                      year: 'numeric', month: '2-digit', day: '2-digit'
                    })}
                  </td>
                  <td style={tdSx}>
                    <span style={{
                      fontFamily: 'JetBrains Mono,monospace',
                      fontSize: 11,
                      background: '#f1f5f9',
                      padding: '2px 8px',
                    }}>
                      {row.cantidadDetenidos}
                    </span>
                  </td>
                  <td style={tdSx}>{row.oficialNombre ?? '—'}</td>
                  {tab !== 'pendientes' && (
                    <td style={tdSx}>
                      <span style={{
                        fontFamily: 'JetBrains Mono,monospace',
                        fontSize: 10,
                        color: '#059669',
                      }}>
                        {row.folioReporteAsegurados}
                      </span>
                    </td>
                  )}
                  <td style={{ ...tdSx, textAlign: 'center' }}>
                    {tab === 'pendientes' ? (
                      <Link
                        href={`${basePath}/${row.id}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          padding: '6px 16px', background: '#7c3aed',
                          color: '#ffffff', textDecoration: 'none',
                          transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                      >
                        Completar <ArrowRight size={12} />
                      </Link>
                    ) : tab === 'completados' ? (
                      <Link
                        href={`${basePath}/puesta-disposicion/${row.id}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          padding: '6px 16px', background: '#d97706',
                          color: '#ffffff', textDecoration: 'none',
                          transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                      >
                        Puesta a Disposición <ArrowRight size={12} />
                      </Link>
                    ) : (
                      <Link
                        href={`${basePath}/${row.id}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          padding: '6px 16px', background: '#059669',
                          color: '#ffffff', textDecoration: 'none',
                          transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                      >
                        Ver Detalle <ArrowRight size={12} />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
