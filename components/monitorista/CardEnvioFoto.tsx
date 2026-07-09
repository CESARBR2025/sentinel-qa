'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, RefreshCw, ExternalLink, CheckCircle, XCircle } from 'lucide-react'
import React from 'react'
import { SubirFotoDetenido } from './SubirFotoDetenido'
import { Toast } from '@/components/ui/Toast'

const ETIQUETAS: Record<string, string> = {
  frontal: 'Foto Frontal',
  derecho: 'Lado Derecho',
  izquierdo: 'Lado Izquierdo',
}

export function CardEnvioFoto({
  solicitudId,
  tipo,
  foto,
  destinos,
  evidencias,
}: {
  solicitudId: string
  tipo: string
  foto: { id: string; tipoFoto: string; enviadoA: string | null; estado: string } | undefined
  destinos: { clave: string; nombre: string }[]
  evidencias: { id: string; url: string; nombre: string; subidoPor: string | null }[]
}) {
  const router = useRouter()
  const [destino, setDestino] = useState(foto?.enviadoA || destinos[0]?.clave || '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState(false)

  const puedeEnviar = !foto || foto.estado === 'pendiente' || foto.estado === 'rechazado'
  const puedeSubirDirecto = !foto || foto.estado !== 'completado'
  const estaRechazado = foto?.estado === 'rechazado'

  const handleSend = async () => {
    if (!foto?.id) return
    setPending(true)
    setError(null)
    try {
      const res = await fetch(`/api/monitorista/detenidos/${solicitudId}/enviar-foto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fotoId: foto.id, destino }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      setToast(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally { setPending(false) }
  }

  const label = ETIQUETAS[tipo] || tipo
  const estado = foto?.estado ?? 'pendiente'

  return (
      <div style={{ background: '#f8fafc', border: `1px solid ${estado === 'completado' ? '#bbf7d0' : estado === 'rechazado' ? '#fecaca' : '#e2e8f0'}`, padding: 20, borderRadius: 2 }}>
      <Toast show={toast} mensaje={`Solicitud de ${label} enviada`} onClose={() => setToast(false)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600, color: '#1e40af', textTransform: 'uppercase' }}>{label}</span>
          <span style={estadoBadge(estado)}>{estado.toUpperCase()}</span>
        </div>
        {foto?.enviadoA && estado !== 'completado' && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b' }}>
            Enviado a: {destinos.find(d => d.clave === foto.enviadoA)?.nombre || foto.enviadoA}
          </span>
        )}
        {estado === 'completado' && evidencias.length > 0 && evidencias[0]?.subidoPor && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#059669', fontWeight: 600 }}>
            Subida por: {evidencias[0].subidoPor === 'agente_fiscalia' ? 'Fiscalía' : evidencias[0].subidoPor === 'agente_juzgado' ? 'Juzgado' : evidencias[0].subidoPor === 'Monitorista' ? 'Monitorista' : evidencias[0].subidoPor === 'Oficial de Campo' ? 'Oficial' : evidencias[0].subidoPor}
          </span>
        )}
      </div>

      {puedeEnviar && (
        <>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Solicitar a</label>
              <select value={destino} onChange={(e) => setDestino(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter', fontSize: 12, color: '#1e293b' }}>
                {destinos.map((d) => <option key={d.clave} value={d.clave}>{d.nombre}</option>)}
                {destinos.length >= 2 && <option value="AMBOS">Ambos</option>}
              </select>
            </div>
            <button onClick={handleSend} disabled={pending || !destino}
              style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 16px', background: pending ? '#94a3b8' : '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2, cursor: pending || !destino ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <Send size={12} /> {estaRechazado ? 'REENVIAR' : 'ENVIAR'}
            </button>
          </div>
          {error && <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#dc2626', marginBottom: 8 }}>⚠ {error}</div>}
          {estaRechazado && (
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#dc2626', marginBottom: 8 }}>
              ⚠ Rechazado — selecciona otro destino y re-envía
            </div>
          )}
        </>
      )}

      {puedeSubirDirecto && (
        <div style={{ marginTop: 8 }}>
          <SubirFotoDetenido reporteCampoId={solicitudId} tipoFoto={tipo} label={label} />
        </div>
      )}

      {estado === 'enviado' && (
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Send size={12} /> Esperando fotos
        </div>
      )}

      {estado === 'completado' && (
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#059669', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <CheckCircle size={12} /> Foto recibida
        </div>
      )}

      {evidencias.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {evidencias.map((ev) => (
            <a key={ev.id} href={`/api/expediente/proxy?url=${encodeURIComponent(ev.url)}`} target="_blank" rel="noreferrer"
              style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#2563eb', textDecoration: 'none', padding: '4px 10px', border: '1px solid #bfdbfe', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4, background: '#eff6ff' }}>
              <ExternalLink size={10} /> {ev.nombre || `Foto ${ev.id.substring(0, 8)}`}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function estadoBadge(estado: string): React.CSSProperties {
  const base: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', padding: '2px 6px', borderRadius: 2, letterSpacing: '0.08em' }
  if (estado === 'pendiente') return { ...base, background: '#fffbeb', color: '#b45309', border: '1px solid #fef3c7' }
  if (estado === 'enviado') return { ...base, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe' }
  if (estado === 'rechazado') return { ...base, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
  if (estado === 'completado') return { ...base, background: '#f0fdf4', color: '#15803d', border: '1px solid #dcfce7' }
  return { ...base }
}
