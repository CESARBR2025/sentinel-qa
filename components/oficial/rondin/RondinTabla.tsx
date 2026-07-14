'use client'

import { Inbox, Shield, MapPin } from 'lucide-react'
import type { RondinOficialResumen } from '@/lib/oficial/types'

const ESTATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  sin_despachar: { label: 'SIN DESPACHAR', color: '#b45309', bg: '#fef3c7', border: '#fde68a' },
  en_despacho:   { label: 'EN DESPACHO',   color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  en_sitio:      { label: 'EN SITIO',      color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  atendido:      { label: 'ATENDIDO',      color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
  cerrado_detencion: { label: 'C/DETENCIÓN', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
}

function estatusBadge(estatus: string) {
  const cfg = ESTATUS_CONFIG[estatus] ?? { label: estatus, color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
      padding: '3px 8px',
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      borderRadius: 2,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
      {cfg.label}
    </span>
  )
}

function formatFecha(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const hora = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dia}/${mes} ${hora}:${min}`
}

export function RondinTabla({ rondines }: { rondines: RondinOficialResumen[] }) {
  const COLUMNS = ['FOLIO', 'FECHA', 'TIPO', 'UBICACIÓN', 'ESTATUS']

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {COLUMNS.map((col) => (
              <th key={col} style={{
                padding: '10px 14px', fontSize: 10, fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace', color: '#64748b',
                textAlign: 'left', textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: '1px solid #e2e8f0',
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rondines.length > 0 ? rondines.map((r, i) => (
            <tr
              key={r.id}
              style={{
                background: i % 2 === 0 ? '#ffffff' : '#fafbfc',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f1f5f9' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#ffffff' : '#fafbfc' }}
            >
              <td style={{
                padding: '10px 14px', fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                color: '#0f172a',
                borderBottom: '1px solid #f1f5f9',
              }}>
                {r.folio}
              </td>
              <td style={{
                padding: '10px 14px', fontSize: 12,
                fontFamily: 'Inter, sans-serif', color: '#475569',
                borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap',
              }}>
                {formatFecha(r.fechaHoraInicio)}
              </td>
              <td style={{
                padding: '10px 14px', fontSize: 12,
                fontFamily: 'Inter, sans-serif', color: '#334155',
                borderBottom: '1px solid #f1f5f9',
              }}>
                {r.tipoIncidente ?? '—'}
              </td>
              <td style={{
                padding: '10px 14px', fontSize: 12,
                fontFamily: 'Inter, sans-serif', color: '#64748b',
                borderBottom: '1px solid #f1f5f9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={11} color="#94a3b8" />
                  <span>{[r.calle, r.colonia].filter(Boolean).join(', ') || '—'}</span>
                </div>
              </td>
              <td style={{
                padding: '10px 14px', fontSize: 12,
                fontFamily: 'Inter, sans-serif',
                borderBottom: '1px solid #f1f5f9',
              }}>
                {estatusBadge(r.estatus)}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={COLUMNS.length} style={{
                padding: '60px 14px', textAlign: 'center', color: '#94a3b8',
                fontFamily: 'Inter, sans-serif', fontSize: 13,
                borderBottom: 'none',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <Inbox size={36} color="#cbd5e1" />
                  <span style={{ fontWeight: 500 }}>No hay reportes de rondín enviados</span>
                  <span style={{ fontSize: 11, color: '#b0b8c4' }}>
                    Los reportes que generes aparecerán aquí
                  </span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {rondines.length > 0 && (
        <div style={{
          padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10, color: '#94a3b8',
          borderTop: '1px solid #f1f5f9',
        }}>
          Mostrando {rondines.length} reporte{rondines.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
