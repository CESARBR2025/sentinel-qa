'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Upload, X, Image, FileText, Loader2 } from 'lucide-react'
import React from 'react'

function compressImage(file: File, maxW = 1920, quality = 0.7): Promise<{ base64: string; mime: string; nombre: string; originalSize: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => resolve({ base64: (reader.result as string).split(',')[1], mime: file.type, nombre: file.name, originalSize: file.size, compressedSize: file.size })
      reader.onerror = reject
      reader.readAsDataURL(file)
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
        const reader = new FileReader()
        reader.onload = () => resolve({ base64: (reader.result as string).split(',')[1], mime: 'image/jpeg', nombre: file.name.replace(/\.[^.]+$/, '.jpg'), originalSize: file.size, compressedSize: blob.size })
        reader.readAsDataURL(blob)
      }, 'image/jpeg', quality)
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Error cargando imagen')) }
    img.src = url
  })
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

const LIMITES: Record<string, { maxMB: number; label: string }> = {
  foto:      { maxMB: 50, label: 'JPG/PNG · máx 50MB · se comprime a 1920px' },
  documento: { maxMB: 50, label: 'PDF · máx 50MB · no se comprime' },
}

export function SubirEvidenciaModal({
  solicitudId,
  incidenteId,
  origen = 'general',
  denunciaSolicitudId = null,
  onClose,
}: {
  solicitudId: string
  incidenteId: string
  origen?: 'denuncia' | 'general'
  denunciaSolicitudId?: number | null
  onClose: () => void
}) {
  const [tipo, setTipo] = useState<'foto' | 'documento'>('foto')
  const [archivos, setArchivos] = useState<{ nombre: string; base64: string; mime: string; originalSize: number; compressedSize: number; file?: File }[]>([])
  const [subiendo, setSubiendo] = useState(false)
  const [comprimiendo, setComprimiendo] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true); return () => setMounted(false) }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setError(null)

    const MAX_MB = LIMITES[tipo].maxMB
    for (const f of Array.from(files)) {
      if (f.size > MAX_MB * 1024 * 1024) {
        setError(`"${f.name}" pesa ${formatSize(f.size)}. Máximo: ${MAX_MB}MB`)
        return
      }
    }

    setComprimiendo(true)
    try {
      const resultado = await Promise.all(Array.from(files).map(async f => {
        if (tipo === 'foto') {
          return compressImage(f)
        }
        return { nombre: f.name, base64: '', mime: f.type, originalSize: f.size, compressedSize: f.size, file: f }
      }))
      setArchivos(resultado as any)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar archivo')
    } finally {
      setComprimiendo(false)
    }
  }

  const handleSubmit = async () => {
    if (archivos.length === 0) return
    setSubiendo(true)
    setError(null)
    setProgreso(0)
    try {
      const total = archivos.length
      const baseUrl = origen === 'denuncia' && denunciaSolicitudId
        ? '/api/monitorista/denuncias/subir'
        : '/api/monitorista/evidencias/subir'

      for (let i = 0; i < total; i++) {
        setProgreso(Math.round((i / total) * 100))
        const a = archivos[i]
        const fd = new FormData()
        if (a.file) {
          fd.append('file', a.file)
        } else if (a.base64) {
          const decoded = Uint8Array.from(atob(a.base64), c => c.charCodeAt(0))
          fd.append('file', new Blob([decoded], { type: a.mime }), a.nombre)
        }

        const params = new URLSearchParams({ tipo, nombreOriginal: a.nombre, solicitudId, incidenteId })
        if (origen === 'denuncia' && denunciaSolicitudId) {
          params.set('solicitudId', String(denunciaSolicitudId))
          params.set('denunciaId', incidenteId)
        }

        const res = await fetch(`${baseUrl}?${params}`, { method: 'POST', body: fd })
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Error') }
      }
      setProgreso(100)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setSubiendo(false)
    }
  }

  const tipoIcon = tipo === 'documento' ? <FileText size={16} /> : <Image size={16} />
  const sizeTotal = archivos.reduce((s, a) => s + a.compressedSize, 0)
  const sizeOriginal = archivos.reduce((s, a) => s + a.originalSize, 0)

  if (!mounted) return null

  return createPortal(
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget && !subiendo) onClose() }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 700, color: '#ffffff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subir Evidencias</h2>
          {!subiendo && <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5c74a1', cursor: 'pointer' }}><X size={20} /></button>}
        </div>

        {!subiendo && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              {(['foto', 'documento'] as const).map((t) => (
                <button key={t} onClick={() => { setTipo(t); setArchivos([]); setError(null) }}
                  style={{
                    fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                    padding: '10px 20px', borderRadius: 2, cursor: 'pointer', letterSpacing: '0.1em', border: '1px solid',
                    background: tipo === t ? 'rgba(212,164,58,0.1)' : 'transparent',
                    color: tipo === t ? '#d4a43a' : '#4a5878',
                    borderColor: tipo === t ? 'rgba(212,164,58,0.3)' : 'rgba(27,39,66,0.8)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >{t === 'foto' ? <Image size={14} /> : <FileText size={14} />}{t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <input ref={inputRef} type="file" multiple={origen !== 'denuncia'}
                accept={tipo === 'foto' ? 'image/*' : 'application/pdf'}
                onChange={handleFileSelect} style={{ display: 'none' }} />
              <button onClick={() => inputRef.current?.click()} disabled={comprimiendo}
                style={{ width: '100%', padding: 48, textAlign: 'center', background: 'rgba(11,18,32,0.4)',
                  border: '2px dashed rgba(27,39,66,0.8)', borderRadius: 2, cursor: comprimiendo ? 'wait' : 'pointer',
                  color: comprimiendo ? '#4a5878' : '#5c74a1', fontFamily: 'JetBrains Mono', fontSize: 12,
                  textTransform: 'uppercase', letterSpacing: '0.15em', opacity: comprimiendo ? 0.5 : 1 }}>
                {comprimiendo ? <><Loader2 size={28} style={{ display: 'block', margin: '0 auto 10px', animation: 'spin 1s linear infinite' }} />COMPRIMIENDO...</> : <><Upload size={28} style={{ display: 'block', margin: '0 auto 10px' }} />SELECCIONAR ARCHIVO{origen === 'general' ? 'S' : ''}</>}
              </button>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5878', textAlign: 'center', marginTop: 10, letterSpacing: '0.05em' }}>
                {LIMITES[tipo].label}
              </div>
            </div>
          </>
        )}

        {archivos.length > 0 && !subiendo && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4a5878', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.1em' }}>
              {archivos.length} archivo{archivos.length > 1 ? 's' : ''} · {formatSize(sizeTotal)}
              {sizeOriginal !== sizeTotal && <span style={{ color: '#4a9e6a', marginLeft: 8 }}>(comprimido de {formatSize(sizeOriginal)})</span>}
            </div>
            {archivos.map((a, i) => (
              <div key={i} style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#8f9fbf', padding: '4px 0', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: 8 }}>
                {tipoIcon} {a.nombre}
                {a.originalSize !== a.compressedSize && (
                  <span style={{ fontSize: 10, color: '#4a9e6a' }}>{formatSize(a.compressedSize)}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {subiendo && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, gap: 8 }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: '#d4a43a' }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#d4a43a' }}>SUBIENDO {progreso}%</span>
            </div>
            <div style={{ width: '100%', height: 4, background: 'rgba(27,39,66,0.8)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${progreso}%`, height: '100%', background: '#d4a43a', borderRadius: 2, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 16, padding: 12, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#ef4444' }}>⚠ {error}</div>
        )}

        {!subiendo && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={btnCancel}>Cancelar</button>
            <button onClick={handleSubmit} disabled={archivos.length === 0} style={btnSubmit(archivos.length === 0)}>
              SUBIR EVIDENCIAS
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

const overlay: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
  zIndex: 99999, overflow: 'auto', padding: '60px 20px',
}
const modal: React.CSSProperties = {
  background: '#0b1220', border: '1px solid rgba(212,164,58,0.2)',
  padding: 40, maxWidth: 580, width: '100%', boxShadow: '0 25px 80px rgba(0,0,0,0.7)',
  borderRadius: 2, position: 'relative',
}
const btnCancel: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.1em', padding: '10px 24px', background: 'transparent',
  color: '#4a5878', border: '1px solid rgba(27,39,66,0.8)', borderRadius: 2, cursor: 'pointer',
}
const btnSubmit = (disabled: boolean): React.CSSProperties => ({
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.1em', padding: '10px 24px', background: disabled ? '#2a3a5e' : '#d4a43a',
  color: disabled ? '#4a5878' : '#050810', border: 'none', borderRadius: 2, cursor: disabled ? 'not-allowed' : 'pointer',
})
