'use client'

import { useState } from 'react'
import { Send, ArrowLeft, RefreshCw } from 'lucide-react'
import React from 'react'

export function AccionesDetenido({ id, estado, enviadoA, destinos }: { id: string; estado: string; enviadoA: string; destinos: { clave: string; nombre: string }[] }) {
  const [destino, setDestino] = useState(enviadoA || destinos[0]?.clave || '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const puedeEnviar = estado === 'pendiente' || estado === 'rechazado'
  const estaRechazado = estado === 'rechazado'

  const handleSend = async () => {
    setPending(true)
    setError(null)
    try {
      const res = await fetch(`/api/monitorista/detenidos/${id}/enviar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destino }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally { setPending(false) }
  }

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
      <h3 style={{ fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em' }}>
        <Send size={18} /> ENVIAR SOLICITUD
      </h3>

      {estaRechazado && (
        <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#dc2626', marginBottom: 16 }}>
          ⚠ La solicitud fue rechazada por <strong>{destinos.find(d => d.clave === enviadoA)?.nombre || enviadoA}</strong>. Selecciona un nuevo destino y re-envía.
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'block', marginBottom: 6 }}>Solicitar fotos a</label>
          <select
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          disabled={!puedeEnviar}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter', fontSize: 13, color: '#1e293b', background: puedeEnviar ? '#ffffff' : '#f8fafc', cursor: puedeEnviar ? 'pointer' : 'not-allowed' }}
        >
          {destinos.map((d) => (
            <option key={d.clave} value={d.clave}>{d.nombre}</option>
          ))}
          {destinos.length >= 2 && <option value="AMBOS">Ambos (el primero que responda)</option>}
        </select>
      </div>

      {error && <div style={{ padding: 8, fontFamily: 'JetBrains Mono', fontSize: 10, color: '#dc2626', marginBottom: 8 }}>⚠ {error}</div>}

      {puedeEnviar && (
        <button onClick={handleSend} disabled={pending} style={{
          fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.1em', padding: '10px 24px',
          background: pending ? '#94a3b8' : '#0f172a', color: '#ffffff',
          border: 'none', borderRadius: 2, cursor: pending ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {estaRechazado ? <RefreshCw size={14} /> : <Send size={14} />}
          {pending ? 'ENVIANDO...' : estaRechazado ? 'REENVIAR A OTRO DESTINO' : 'ENVIAR SOLICITUD'}
        </button>
      )}

      {!puedeEnviar && estado === 'enviado' && (
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#2563eb', padding: '10px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Send size={14} /> Solicitud enviada a <strong>{destinos.find(d => d.clave === enviadoA)?.nombre || enviadoA}</strong> — esperando fotos
        </div>
      )}
    </div>
  )
}
