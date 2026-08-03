'use client'

import { useEffect } from 'react'

/**
 * Registra el service worker de offline en producción.
 * En desarrollo se omite para evitar cachés que interfieran con el dev server.
 */
export default function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return
    const onLoad = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => {})
    }
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return null
}
