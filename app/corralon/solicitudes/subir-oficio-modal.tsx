'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  infraccionId: string
  folio: string
  onClose: () => void
}

export function SubirOficioModal({ infraccionId, folio, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleSubmit() {
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('infraccionId', infraccionId)
      formData.append('file', file)

      const res = await fetch('/api/corralon/subir-archivo', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al subir archivo')
        setUploading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.refresh()
        onClose()
      }, 1200)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado')
      setUploading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !uploading) onClose() }}
    >
      <div
        style={{
          background: '#ffffff',
          width: 480,
          maxWidth: '90vw',
          padding: 32,
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: 'Barlow Condensed,sans-serif',
            fontSize: 22,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#0f172a',
            marginBottom: 4,
          }}>
            Subir Oficio de Corralón
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 11,
            color: '#64748b',
          }}>
            {folio}
          </div>
        </div>

        {success ? (
          <div style={{
            textAlign: 'center',
            padding: 32,
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 13,
            color: '#16a34a',
            fontWeight: 600,
          }}>
            ✓ Documento subido correctamente
          </div>
        ) : (
          <>
            {/* File input */}
            <div
              style={{
                border: `2px dashed ${file ? '#d97706' : '#e2e8f0'}`,
                padding: 32,
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: 16,
                transition: 'border-color 0.2s',
              }}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <div>
                  <div style={{
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 12,
                    color: '#d97706',
                    fontWeight: 600,
                    marginBottom: 4,
                  }}>
                    {file.name}
                  </div>
                  <div style={{
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 10,
                    color: '#94a3b8',
                  }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" style={{ marginBottom: 8 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#64748b' }}>
                    Seleccionar archivo
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                    PDF o imagen
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '8px 12px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 11,
                color: '#dc2626',
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                disabled={uploading}
                style={{
                  padding: '8px 20px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 11,
                  color: '#64748b',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!file || uploading}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  background: !file || uploading ? '#94a3b8' : '#d97706',
                  cursor: !file || uploading ? 'not-allowed' : 'pointer',
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 11,
                  color: '#ffffff',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {uploading ? (
                  <>
                    <span style={{
                      width: 12,
                      height: 12,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.6s linear infinite',
                    }}></span>
                    Subiendo...
                  </>
                ) : (
                  'Subir y Finalizar'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
