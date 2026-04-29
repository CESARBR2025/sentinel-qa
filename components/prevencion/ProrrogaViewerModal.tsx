'use client'

import { useState } from 'react'

interface ProrrogaViewerModalProps {
  archivoProrrogaUrl: string | null
}

export function ProrrogaViewerModal({ archivoProrrogaUrl }: ProrrogaViewerModalProps) {
  const [open, setOpen] = useState(false)

  if (!archivoProrrogaUrl) return null

  const nomArchivo = archivoProrrogaUrl.split('/').pop() || 'documento'
  const ext = nomArchivo.split('.').pop()?.toLowerCase() || ''
  const esImagen = ['jpg', 'jpeg', 'png'].includes(ext)
  const esPdf = ext === 'pdf'

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = `/api/uploads/${archivoProrrogaUrl.replace(/^uploads\//, '')}`
    a.download = nomArchivo
    a.target = '_blank'
    a.rel = 'noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '4px 10px', background: 'rgba(212,164,58,0.08)',
          border: '1px solid rgba(212,164,58,0.35)', textDecoration: 'none',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: 13 }}>📎</span>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#d4a43a', letterSpacing: '0.08em' }}>
          {nomArchivo}
        </span>
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(7,11,22,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div style={{
            background: '#0b1220', border: '1px solid #1b2742',
            width: '90vw', height: '90vh', maxWidth: 900,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', borderBottom: '1px solid #1b2742',
            }}>
              <div style={{
                fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800,
                fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d8e0f0',
              }}>
                Documento de <span style={{ color: '#d4a43a' }}>Prórroga</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleDownload}
                  style={{
                    padding: '8px 16px', background: 'rgba(212,164,58,0.15)',
                    border: '1px solid #d4a43a', color: '#d4a43a',
                    fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700,
                    fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  ⬇ Descargar
                </button>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    padding: '8px 16px', background: 'transparent',
                    border: '1px solid #1b2742', color: '#8a9bc0',
                    fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700,
                    fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', background: '#070b16' }}>
              {esPdf && (
                <iframe
                  src={`/api/uploads/${archivoProrrogaUrl.replace(/^uploads\//, '')}`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              )}
              {esImagen && (
                <img
                  src={`/api/uploads/${archivoProrrogaUrl.replace(/^uploads\//, '')}`}
                  alt="Documento de prorrogue"
                  style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', margin: '0 auto' }}
                />
              )}
              {!esPdf && !esImagen && (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: '100%', gap: 16,
                }}>
                  <span style={{ fontSize: 48 }}>📄</span>
                  <p style={{
                    fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#8a9bc0',
                    textAlign: 'center', maxWidth: 300,
                  }}>
                    Este tipo de archivo no se puede previsualizar. Use el botón descargar para abrirlo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}