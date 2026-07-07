'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'

function compressImage(file: File, maxW = 1920, quality = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) { resolve(file); return }
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
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
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
  onSuccess,
}: {
  reporteCampoId: string
  tipoFoto: string
  label: string
  onSuccess?: () => void
}) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const compressed = await compressImage(file)
      if (compressed.size > 25 * 1024 * 1024) {
        setError('El archivo es demasiado grande (máx 25MB)')
        setUploading(false)
        return
      }
      const fd = new FormData()
      fd.append('file', compressed)
      fd.append('tipoFoto', tipoFoto)
      const res = await fetch(`/api/monitorista/detenidos/${reporteCampoId}/subir-foto`, {
        method: 'POST', body: fd,
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Error al subir') }
      onSuccess?.()
      setToast(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir')
    } finally { setUploading(false) }
  }

  return (
    <div>
      <Toast show={toast} mensaje={`${label} subida exitosamente`} onClose={() => setToast(false)} />
      <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        style={{
          fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          padding: '6px 12px', background: uploading ? '#94a3b8' : '#2563eb',
          color: '#ffffff', border: 'none', borderRadius: 2,
          cursor: uploading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
        }}
      >
        <Upload size={12} /> {uploading ? 'SUBIR...' : 'SUBIR DIRECTO'}
      </button>
      {error && <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#dc2626', marginTop: 4 }}>⚠ {error}</div>}
    </div>
  )
}
