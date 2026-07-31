'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { usePolling } from '@/hooks/usePolling'

const INTERVALO_MS = 30_000

export function ContadorAsignaciones() {
  const [asignados, setAsignados] = useState<number | null>(null)

  const refrescar = useCallback(async () => {
    try {
      const r = await fetch('/api/oficial/contador', { cache: 'no-store' })
      if (!r.ok) return
      const { asignados: n } = await r.json() as { asignados: number }
      setAsignados(n)
    } catch {
      // Sin red: se reintenta en el siguiente intervalo.
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => void refrescar(), 0)
    return () => clearTimeout(t)
  }, [refrescar])

  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  usePolling(() => { void refrescar() }, INTERVALO_MS, visible)

  if (asignados === null || asignados === 0) return null

  return (
    <div style={{ marginTop: 16 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2', borderRadius: 2 }}>
        <AlertTriangle size={11} />
        {asignados} ASIGNACIÓN{asignados !== 1 ? 'ES' : ''} ACTIVA{asignados !== 1 ? 'S' : ''}
      </span>
    </div>
  )
}
