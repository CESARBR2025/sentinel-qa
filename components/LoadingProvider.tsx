'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

const MAIN_ROUTES = ['/dashboard', '/prevencion', '/incidentes', '/reportes', '/catalogos', '/admin']

function getBasePath(path: string): string {
  if (MAIN_ROUTES.includes(path)) return path
  for (const route of MAIN_ROUTES) {
    if (path.startsWith(route)) return route
  }
  return path
}

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname()
  const [loading,   setLoading]   = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [message,   setMessage]   = useState('')
  const prevPath    = useRef(pathname)
  const isInitial   = useRef(true)

  // ── Navegaciones internas entre secciones principales ───────────────────────
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      prevPath.current = pathname
      return
    }

    const fromBase = getBasePath(prevPath.current)
    const toBase   = getBasePath(pathname)

    // Actualizar SIEMPRE antes de decidir si mostrar loader
    prevPath.current = pathname

    if (fromBase !== toBase) {
      setLoading(true)
      setProgress(0)
      setMessage('Cargando...')
      let step = 0
      const iv = setInterval(() => {
        setProgress(p => Math.min(p + 33, 100))
        step++
        if (step >= 3) clearInterval(iv)
      }, 250)
      const t = setTimeout(() => setLoading(false), 750)
      return () => { clearInterval(iv); clearTimeout(t) }
    }
  }, [pathname])

  // ── API manual ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const api = (msg = 'Cargando...', time = 600) => {
      setLoading(true)
      setProgress(0)
      setMessage(msg)
      let step = 0
      const iv = setInterval(() => {
        setProgress(p => Math.min(p + 33, 100))
        step++
        if (step >= 3) clearInterval(iv)
      }, Math.max(time / 3, 200))
      setTimeout(() => setLoading(false), time)
    }
    ;(window as unknown as { __showLoader?: typeof api }).__showLoader = api
  }, [])

  if (!loading) return <>{children}</>

  return (
    <>
      {children}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#f8fafc',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <img
          src="/chaleco.png"
          alt="CENTINELA"
          style={{ height: 100, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(31, 53, 90, 0.55))' }}
        />
        <div style={{ width: 120, marginBottom: 12 }}>
          <div style={{ height: 3, background: '#1b2742', borderRadius: 2 }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: progress > 90 ? '#4a9e6a' : '#1f355a',
              transition: 'width 0.25s ease-out',
            }}/>
          </div>
        </div>
        <p style={{
          fontFamily: 'JetBrains Mono,monospace', fontSize: 9,
          color: progress > 90 ? '#4a9e6a' : '#8a9bc0',
          margin: 0,
        }}>
          {message}
        </p>
      </div>
    </>
  )
}
