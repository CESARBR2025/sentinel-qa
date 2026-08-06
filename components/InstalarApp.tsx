'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

function esIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream
}

function yaInstalada(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as unknown as { standalone?: boolean }).standalone === true
}

export default function InstalarApp() {
  const [prompt, setPrompt] = useState<Event | null>(null)
  const [mostrarIOS, setMostrarIOS] = useState(false)
  const [descartado, setDescartado] = useState(false)

  useEffect(() => {
    if (yaInstalada() || sessionStorage.getItem('pwa-instalar-descartado')) return

    if (esIOS()) {
      queueMicrotask(() => setMostrarIOS(true))
      return
    }

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  function descartar() {
    sessionStorage.setItem('pwa-instalar-descartado', '1')
    setDescartado(true)
  }

  async function instalar() {
    if (!prompt) return
    await (prompt as unknown as { prompt: () => Promise<void> }).prompt()
    setPrompt(null)
  }

  if (descartado || (!prompt && !mostrarIOS)) return null

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 9999,
      maxWidth: 420, margin: '0 auto',
      background: '#1f355a', color: '#fff', borderRadius: 4,
      padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 12px 30px -8px rgba(15,23,42,0.4)',
    }}>
      <Download size={18} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontFamily: 'Inter, sans-serif', fontSize: 12.5, lineHeight: 1.4 }}>
        {mostrarIOS
          ? <>Instala CENTINELA: toca <strong>Compartir</strong> y luego <strong>&quot;Agregar a inicio&quot;</strong>.</>
          : <>Instala CENTINELA en este dispositivo para acceso rápido y notificaciones.</>}
      </div>
      {!mostrarIOS && (
        <button type="button" onClick={() => void instalar()} style={{
          flexShrink: 0, background: '#fff', color: '#1f355a', border: 'none',
          padding: '6px 10px', borderRadius: 3, cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Instalar
        </button>
      )}
      <button type="button" onClick={descartar} aria-label="Cerrar" style={{
        flexShrink: 0, background: 'transparent', border: 'none', color: '#fff', opacity: 0.7, cursor: 'pointer',
      }}>
        <X size={16} />
      </button>
    </div>
  )
}
