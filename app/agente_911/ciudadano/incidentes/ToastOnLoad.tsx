'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ToastOnLoad() {
  const params = useSearchParams()
  const shown = useRef(false)

  useEffect(() => {
    if (shown.current) return
    const creado = params.get('creado')
    if (creado === 'true') {
      shown.current = true
      const folio = params.get('folio')

      const el = document.createElement('div')
      el.textContent = `✓ Reporte generado: ${folio}`
      Object.assign(el.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '2147483647',
        background: '#16a34a',
        color: '#fff',
        padding: '16px 24px',
        borderRadius: '4px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '13px',
        fontWeight: '600',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      })
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 5000)

      window.history.replaceState(null, '', '/agente_911/ciudadano/incidentes')
    }
  }, [params])

  return null
}
