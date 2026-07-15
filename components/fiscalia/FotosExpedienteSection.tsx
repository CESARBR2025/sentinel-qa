'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, Image } from 'lucide-react'

interface FotoRow {
  id: string
  url_archivo: string
  tipo_foto: string
  nombre_archivo: string | null
  detenido_index: number | null
  tipo_contenido: string | null
}

interface Props {
  detenidos: { nombre?: string; apellidoPaterno?: string; apellidoMaterno?: string }[]
  reporteCampoId: string
  hayArmaFuego?: boolean
  hayArmaBlanca?: boolean
  hayDroga?: boolean
  hayVehiculo?: boolean
  hayHidrocarburo?: boolean
  objetosRecuperados?: string
}

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

export function FotosExpedienteSection({ detenidos, reporteCampoId, hayArmaFuego, hayArmaBlanca, hayDroga, hayVehiculo, hayHidrocarburo, objetosRecuperados }: Props) {
  const [subiendo, setSubiendo] = useState<string | null>(null)
  const [fotos, setFotos] = useState<FotoRow[]>([])
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const subir = async (key: string, file: File, tipoFoto: string, tipoContenido: string, detenidoIndex?: number) => {
    setSubiendo(key)
    const compressed = await compressImage(file)
    if (compressed.size > 25 * 1024 * 1024) { alert('El archivo es demasiado grande (máx 25MB)'); setSubiendo(null); return }
    const fd = new FormData()
    fd.append('file', compressed)
    fd.append('reporteCampoId', reporteCampoId)
    fd.append('tipoFoto', tipoFoto)
    fd.append('tipoContenido', tipoContenido)
    if (detenidoIndex !== undefined) fd.append('detenidoIndex', String(detenidoIndex))
    try {
      const res = await fetch('/api/fiscalia/expediente/subir-foto', { method: 'POST', body: fd })
      if (!res.ok) { const err = await res.json(); alert(err.error || 'Error'); return }
      const data = await res.json()
      const nueva: FotoRow = { id: crypto.randomUUID(), url_archivo: data.url, tipo_foto: tipoFoto, nombre_archivo: file.name, detenido_index: detenidoIndex ?? null, tipo_contenido: tipoContenido }
      setFotos(prev => prev.filter(f => !(f.tipo_foto === tipoFoto && f.tipo_contenido === tipoContenido && f.detenido_index === (detenidoIndex ?? null))).concat(nueva))
    } catch { alert('Error al subir foto') }
    finally { setSubiendo(null) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Fotos de Detenidos */}
      {detenidos.length > 0 && (
        <div style={{ padding: '16px 20px', border: '1px solid #e2e8f0', borderLeft: '4px solid #dc2626' }}>
          <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Camera size={16} color="#dc2626" /> Fotos del Detenido
          </h3>
          {detenidos.map((det, di) => {
            const nombre = [det.nombre, det.apellidoPaterno, det.apellidoMaterno].filter(Boolean).join(' ') || 'Desconocido'
            return (
              <div key={di} style={{ marginBottom: di < detenidos.length - 1 ? 20 : 0, padding: 12, background: '#fef2f2', border: '1px solid #fecaca' }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, color: '#991b1b', marginBottom: 10 }}>
                  Detenido {di + 1}: {nombre}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['frontal', 'derecho', 'izquierdo'].map(tipo => {
                    const key = `det-${di}-${tipo}`
                    const existente = fotos.find(f => f.detenido_index === di && f.tipo_foto === tipo && f.tipo_contenido === 'detenido')
                    return (
                      <div key={tipo} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
                          {tipo === 'frontal' ? 'Frontal' : tipo === 'derecho' ? 'Lado Derecho' : 'Lado Izquierdo'}
                        </div>
                        {existente ? (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img src={`/api/monitorista/expediente-proxy?url=${encodeURIComponent(existente.url_archivo)}`} alt={tipo}
                              style={{ width: 100, height: 80, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                            <button onClick={() => fileRefs.current[key]?.click()} style={{
                              position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff',
                              border: 'none', padding: '2px 0', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 7,
                            }}>Reemplazar</button>
                          </div>
                        ) : (
                          <div onClick={() => fileRefs.current[key]?.click()} style={{
                            width: 100, height: 80, border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer', background: '#f8fafc',
                          }}>
                            <Upload size={16} color={subiendo === key ? '#16a34a' : '#94a3b8'} />
                          </div>
                        )}
                        <input ref={ref => { fileRefs.current[key] = ref }} type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={e => { const f = e.target.files?.[0]; if (f) { subir(key, f, tipo, 'detenido', di) } e.target.value = '' }} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Fotos de Objetos */}
      {(hayArmaFuego || hayArmaBlanca || hayDroga || hayVehiculo || hayHidrocarburo || objetosRecuperados) && (
      <div style={{ padding: '16px 20px', border: '1px solid #e2e8f0', borderLeft: '4px solid #0891b2' }}>
        <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image size={16} color="#0891b2" /> Fotos de Objetos y Armamento
        </h3>
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#64748b', marginBottom: 16 }}>
          {objetosRecuperados && <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', display: 'block', marginBottom: 8 }}>Objetos reportados: {objetosRecuperados}</span>}
          Sube fotografías de los objetos asegurados durante la detención.
        </div>
        {[
          hayArmaFuego && { key: 'arma', label: 'Arma de Fuego' },
          hayArmaBlanca && { key: 'arma_blanca', label: 'Arma Blanca' },
          hayDroga && { key: 'droga', label: 'Droga' },
          hayVehiculo && { key: 'vehiculo', label: 'Vehículo' },
          hayHidrocarburo && { key: 'hidrocarburo', label: 'Hidrocarburo' },
          (objetosRecuperados || (!hayArmaFuego && !hayArmaBlanca && !hayDroga && !hayVehiculo && !hayHidrocarburo)) && { key: 'otro', label: 'Otros Objetos' },
        ].filter(Boolean).map((item: any) => {
          const tipo = item.key
          const label = item.label
          const key = `obj-${tipo}`
          const existente = fotos.find(f => f.tipo_foto === tipo && f.tipo_contenido === 'objeto')
          return (
            <div key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: '#f8fafc', border: '1px solid #f1f5f9', marginBottom: 8 }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: '#1e293b', minWidth: 80 }}>
                {label}
              </span>
              {existente ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={`/api/monitorista/expediente-proxy?url=${encodeURIComponent(existente.url_archivo)}`} alt={tipo} style={{ width: 50, height: 40, objectFit: 'cover' }} />
                  <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#16a34a' }}>✓</span>
                  <button onClick={() => fileRefs.current[key]?.click()} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>Cambiar</button>
                </div>
              ) : (
                <button onClick={() => fileRefs.current[key]?.click()} style={{
                  fontFamily: 'JetBrains Mono,monospace', fontSize: 8, padding: '4px 12px',
                  border: '1px solid #0891b2', background: '#fff', color: '#0891b2', cursor: 'pointer',
                }}>
                  <Upload size={10} style={{ marginRight: 4 }} /> Subir Foto
                </button>
              )}
              <input ref={ref => { fileRefs.current[key] = ref }} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) { subir(key, f, tipo, 'objeto') } e.target.value = '' }} />
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}
