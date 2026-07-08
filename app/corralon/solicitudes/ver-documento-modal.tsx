'use client'

import { useState } from 'react'

interface Props {
  url: string
  titulo: string
  onClose: () => void
}

function getExtension(url: string): string {
  const clean = url.split('?')[0].split('#')[0]
  const parts = clean.split('.')
  return parts.length > 1 ? (parts.pop() ?? '').toLowerCase() : ''
}

export function VerDocumentoModal({ url, titulo, onClose }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_WS_EXPEDIENTE ?? ''
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
  const proxyUrl = `/api/expediente/proxy?url=${encodeURIComponent(fullUrl)}`
  const [imgError, setImgError] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 32,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#ffffff',
          width: 700,
          maxWidth: '95vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div>
            <div style={{
              fontFamily: 'Barlow Condensed,sans-serif',
              fontSize: 20,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#0f172a',
            }}>
              {titulo}
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              color: '#94a3b8',
              marginTop: 4,
              wordBreak: 'break-all',
            }}>
              {getExtension(url).toUpperCase()}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 4,
              color: '#94a3b8',
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          minHeight: 200,
        }}>
          {!imgError ? (
            <img
              src={proxyUrl}
              alt={titulo}
              style={{
                maxWidth: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
                border: '1px solid #e2e8f0',
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              padding: 40,
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <div style={{
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 11,
                color: '#64748b',
                textAlign: 'center',
              }}>
                Vista previa no disponible
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
        }}>
          <a
            href={proxyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 20px',
              border: '1px solid #d97706',
              background: '#fffbeb',
              cursor: 'pointer',
              textDecoration: 'none',
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 11,
              fontWeight: 600,
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#d97706'; e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fffbeb'; e.currentTarget.style.color = '#d97706' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Abrir en nueva pestaña
          </a>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              cursor: 'pointer',
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 11,
              color: '#64748b',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
