'use client'

import { User } from 'lucide-react'

export function FilaDetenidoRol({
  detenido,
  basePath,
}: {
  detenido: {
    id: string
    nombre_detenido: string
    folio_reporte_campo: string | null
    fotos: { tipo_foto: string; estado: string; enviado_a: string | null }[]
    completadas: number
    total_fotos: number
  }
  basePath: string
}) {
  const labelFoto: Record<string, string> = { frontal: 'F', derecho: 'D', izquierdo: 'I' }

  return (
    <tr className="det-row" style={{ cursor: 'pointer' }}
      onClick={() => window.location.href = `${basePath}/${detenido.id}`}
      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
      onMouseLeave={e => (e.currentTarget.style.background = '')}
    >
      <td style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 600, color: '#0f172a', padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <User size={14} color="#64748b" /> {detenido.nombre_detenido}
        </div>
      </td>
      <td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#64748b', padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>{detenido.folio_reporte_campo || '—'}</td>
      <td style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {detenido.fotos.map(f => {
            const completada = f.estado === 'completado'
            return (
              <span key={f.tipo_foto} style={{
                fontFamily: 'JetBrains Mono,monospace', fontSize: 9, fontWeight: 600,
                padding: '3px 8px', borderRadius: 2,
                background: completada ? '#f0fdf4' : '#fefce8',
                color: completada ? '#15803d' : '#a16207',
                border: completada ? '1px solid #bbf7d0' : '1px solid #fef08a',
              }}>
                {labelFoto[f.tipo_foto] || f.tipo_foto}
              </span>
            )
          })}
        </div>
      </td>
      <td style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#64748b' }}>
          {detenido.completadas}/{detenido.total_fotos}
        </span>
      </td>
    </tr>
  )
}
