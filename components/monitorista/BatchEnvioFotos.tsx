'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import React from 'react'

export function BatchEnvioFotos({
  fotos,
  destinos,
  solicitudId,
}: {
  fotos: { id: string; tipo_foto: string; estado: string }[]
  destinos: { clave: string; nombre: string }[]
  solicitudId: string
}) {
  const pendientes = fotos.filter(f => f.estado === 'pendiente')
  if (pendientes.length === 0) return null

  const [destino, setDestino] = useState(destinos[0]?.clave || '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendAll = async () => {
    if (!destino) return
    setPending(true)
    setError(null)
    try {
      for (const f of pendientes) {
        const res = await fetch(`/api/monitorista/detenidos/${solicitudId}/enviar-foto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fotoId: f.id, destino }),
        })
        if (!res.ok) {
          const err = await res.json()
          if (err.error) throw new Error(err.error)
        }
      }
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 20, borderRadius: 2, marginBottom: 16 }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: '#15803d', textTransform: 'uppercase', marginBottom: 12 }}>
        Enviar todas las fotos pendientes
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <select
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          style={{ flex: 1, padding: '10px 12px', border: '1px solid #bbf7d0', borderRadius: 2, fontFamily: 'Inter', fontSize: 13, color: '#1e293b' }}
        >
          {destinos.map((d) => <option key={d.clave} value={d.clave}>{d.nombre}</option>)}
          {destinos.length >= 2 && <option value="AMBOS">Ambos</option>}
        </select>
        <button onClick={handleSendAll} disabled={pending || !destino}
          style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 20px', background: pending ? '#94a3b8' : '#15803d', color: '#ffffff', border: 'none', borderRadius: 2, cursor: pending || !destino ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <Send size={14} /> {pending ? 'ENVIANDO...' : `ENVIAR ${pendientes.length} FOTO${pendientes.length > 1 ? 'S' : ''}`}
        </button>
      </div>
      {error && <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#dc2626', marginTop: 8 }}>⚠ {error}</div>}
    </div>
  )
}
