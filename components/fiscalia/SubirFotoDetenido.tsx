'use client'

import { useState, useRef } from 'react'
import { Upload, CheckCircle2, XCircle } from 'lucide-react'

function compressImage(file: File, maxW = 1920, quality = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file)
      return
    }
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let w = img.width, h = img.height
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW }
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('No se pudo comprimir')); return }
        const nombre = file.name.replace(/\.[^.]+$/, '.jpg')
        resolve(new File([blob], nombre, { type: 'image/jpeg' }))
      }, 'image/jpeg', quality)
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Error cargando imagen')) }
    img.src = url
  })
}

export function SubirFotoDetenido({
  reporteCampoId,
  tipoFoto,
  label,
  estado,
  enviadoA,
  urlArchivo,
  nombreArchivo,
}: {
  reporteCampoId: string
  tipoFoto: string
  label: string
  estado: string
  enviadoA: string | null
  urlArchivo: string | null
  nombreArchivo: string | null
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const isCompletado = estado === 'completado' || success

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const compressed = await compressImage(file)

      if (compressed.size > 25 * 1024 * 1024) {
        setError('El archivo es demasiado grande incluso después de comprimir (máx 25MB)')
        setUploading(false)
        return
      }

      const fd = new FormData()
      fd.append('file', compressed)
      fd.append('reporteCampoId', reporteCampoId)
      fd.append('tipoFoto', tipoFoto)

      const res = await fetch('/api/expediente/subir-foto-detenido', {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al subir')
      }
      setSuccess(true)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{
      border: isCompletado ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
      borderRadius: 2, padding: 16,
      background: isCompletado ? '#f0fdf4' : '#ffffff',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 16, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>
          {label}
        </div>
        <div>
          {isCompletado ? (
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, padding: '3px 10px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={12} /> COMPLETADO
            </span>
          ) : estado === 'rechazado' ? (
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, padding: '3px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
              <XCircle size={12} /> RECHAZADO
            </span>
          ) : (
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, padding: '3px 10px', background: '#fefce8', color: '#a16207', border: '1px solid #fef08a', borderRadius: 2 }}>
              {enviadoA === 'AMBOS' ? 'FISCALÍA / JUZGADO' : enviadoA}
            </span>
          )}
        </div>
      </div>

      {urlArchivo && (
        <div style={{ marginBottom: 8, fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#2563eb' }}>
          <a href={`/api/expediente/proxy?url=${encodeURIComponent(urlArchivo)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
            Ver foto actual
          </a>
          {nombreArchivo && <span style={{ color: '#64748b', marginLeft: 8 }}>({nombreArchivo})</span>}
        </div>
      )}

      {!isCompletado && (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: 9, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '8px 16px', background: uploading ? '#94a3b8' : '#7c3aed',
              color: '#ffffff', border: 'none', borderRadius: 2,
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Upload size={12} /> {uploading ? 'COMPRIMIENDO Y SUBIENDO...' : 'SUBIR FOTO'}
          </button>
          {error && (
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#dc2626', marginTop: 6 }}>
              ⚠ {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
