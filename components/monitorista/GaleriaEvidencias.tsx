'use client'

import { Camera, Image, Film, FileText, ExternalLink } from 'lucide-react'
import React from 'react'

interface EvidenciaRow {
  id: string
  tipo: string
  nombreOriginal: string | null
  urlExpediente: string
  subidoPorNombre: string | null
  creadoEn: string
}

export function GaleriaEvidencias({ evidencias }: { evidencias: EvidenciaRow[] }) {
  if (evidencias.length === 0) {
    return (
      <section style={cardStyle}>
        <h2 style={sectionTitle}><Camera size={18} /> EVIDENCIAS</h2>
        <div style={{
          padding: 40, textAlign: 'center', border: '1px dashed rgba(27,39,66,0.5)',
          borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#4a5878',
        }}>
          No hay evidencias registradas
        </div>
      </section>
    )
  }

  return (
    <section style={cardStyle}>
      <h2 style={sectionTitle}>
        <Camera size={18} /> EVIDENCIAS ({evidencias.length})
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {evidencias.map((ev) => {
          const icon = ev.tipo === 'foto' ? <Image size={16} /> : ev.tipo === 'video' ? <Film size={16} /> : <FileText size={16} />
          const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
            ev.urlExpediente.split('.').pop()?.toLowerCase() ?? '',
          )

          return (
            <div key={ev.id} style={itemStyle}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1 }}>
                {isImage && (
                  <div style={{
                    width: 56, height: 56, background: 'rgba(27,39,66,0.4)', borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(27,39,66,0.5)',
                  }}>
                    <img
                      src={`/api/monitorista/expediente-proxy?url=${encodeURIComponent(ev.urlExpediente)}`}
                      alt={ev.nombreOriginal || ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                {!isImage && (
                  <div style={{
                    width: 56, height: 56, background: 'rgba(27,39,66,0.4)', borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, border: '1px solid rgba(27,39,66,0.5)', color: '#5c74a1',
                  }}>
                    {icon}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#d8e0f0', marginBottom: 4 }}>
                    {ev.nombreOriginal || ev.tipo.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5878' }}>
                    {new Date(ev.creadoEn).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    {ev.subidoPorNombre ? ` · ${ev.subidoPorNombre}` : ''}
                  </div>
                </div>
              </div>
              <a
                href={`/api/monitorista/expediente-proxy?url=${encodeURIComponent(ev.urlExpediente)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: 'JetBrains Mono', fontSize: 10, color: '#d4a43a',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                  padding: '6px 12px', border: '1px solid rgba(212,164,58,0.3)', borderRadius: 2,
                  flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.1em',
                }}
              >
                <ExternalLink size={12} /> Ver
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(11,18,32,0.6)', backdropFilter: 'blur(10px)',
  border: '1px solid rgba(27,39,66,0.8)', padding: 32, borderRadius: 2,
}
const sectionTitle: React.CSSProperties = {
  fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: 700,
  textTransform: 'uppercase', color: '#ffffff', marginBottom: 20,
  display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em',
}
const itemStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
  padding: 16, background: 'rgba(11,18,32,0.4)', border: '1px solid rgba(27,39,66,0.4)',
  borderRadius: 2,
}
