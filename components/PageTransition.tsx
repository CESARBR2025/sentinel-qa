'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Transición futurista entre páginas — compuerta blindada táctica.
 * En cada cambio de ruta: dos hojas blindadas se cierran (IN), el núcleo HUD
 * carga el logo animado (~2s) con radar / escaneo / progreso, luego las hojas
 * se abren (OUT). Se dispara en cualquier navegación.
 */

// 0 = inactivo | 1 = montado (hojas abiertas) | 2 = cerrado + HUD | 3 = abriendo
type Stage = 0 | 1 | 2 | 3

const T_CLOSE = 700
const T_HOLD  = 2000
const T_OPEN  = 700

const DOOR_EASE = 'cubic-bezier(0.45, 0.05, 0.2, 1)'

export default function PageTransition() {
  const pathname  = usePathname()
  const [stage, setStage] = useState<Stage>(0)
  const [pct, setPct]     = useState(0)
  const prevPath  = useRef(pathname)
  const isInitial = useRef(true)
  const running   = useRef(false)
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([])
  const rafs      = useRef<number[]>([])

  // ── Secuencia de la compuerta ────────────────────────────────────────────────
  const startTransition = useCallback(() => {
    if (running.current) return
    running.current = true

    timers.current.forEach(clearTimeout); timers.current = []
    rafs.current.forEach(cancelAnimationFrame); rafs.current = []

    setStage(1) // monta con hojas abiertas (fuera de pantalla) + blur inmediato
    // Doble rAF: paint del estado abierto antes de cerrar → dispara la transición IN
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => setStage(2))
      rafs.current.push(r2)
    })
    rafs.current.push(r1)

    timers.current.push(setTimeout(() => setStage(3), T_CLOSE + T_HOLD))
    timers.current.push(setTimeout(() => { setStage(0); running.current = false }, T_CLOSE + T_HOLD + T_OPEN))
  }, [])

  // ── Disparo TEMPRANO al hacer clic en un enlace interno (antes de navegar) ────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement)?.closest?.('a')
      if (!a) return
      const target = a.getAttribute('target')
      if ((target && target !== '_self') || a.hasAttribute('download')) return
      const raw = a.getAttribute('href')
      if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return
      let url: URL
      try { url = new URL(a.href, location.href) } catch { return }
      if (url.origin !== location.origin) return
      if (url.pathname === location.pathname) return // misma página (hash/query) → sin transición
      startTransition()
    }
    document.addEventListener('click', onClick, true) // fase de captura → antes que Next
    return () => document.removeEventListener('click', onClick, true)
  }, [startTransition])

  // ── Fallback: navegaciones no originadas por clic (router.push, back/forward) ─
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      prevPath.current = pathname
      return
    }
    if (prevPath.current === pathname) return
    prevPath.current = pathname
    if (running.current) return // ya iniciada por el clic
    startTransition()
  }, [pathname, startTransition])

  // ── Contador de carga durante el hold ────────────────────────────────────────
  useEffect(() => {
    if (stage !== 2) { setPct(0); return }
    const start = performance.now()
    const dur = T_HOLD + T_CLOSE * 0.4
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      // ease-out para que el número desacelere al final
      setPct(Math.round((1 - Math.pow(1 - p, 2)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stage])

  useEffect(() => () => {
    timers.current.forEach(clearTimeout)
    rafs.current.forEach(cancelAnimationFrame)
  }, [])

  if (stage === 0) return null

  const closed   = stage === 2
  const showHUD  = stage === 2
  const doorTx   = `transform ${T_CLOSE}ms ${DOOR_EASE}`

  const panelBase: React.CSSProperties = {
    position: 'fixed', left: 0, right: 0, height: '50vh', zIndex: 1,
    background: 'radial-gradient(120% 140% at 50% 100%, #12203a 0%, #0a1120 45%, #05070f 100%)',
    transition: doorTx,
    overflow: 'hidden',
    willChange: 'transform',
  }

  const TICKS = 28

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 2147483000, pointerEvents: 'auto' }}>
      <style>{`
        @keyframes pt-spin { to { transform: rotate(360deg); } }
        @keyframes pt-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes pt-scan { 0% { top: -10%; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { top: 110%; opacity: 0; } }
        @keyframes pt-pulse { 0%,100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(77,146,240,0.55)); } 50% { transform: scale(1.05); filter: drop-shadow(0 0 40px rgba(77,146,240,0.95)); } }
        @keyframes pt-radar { 0% { transform: scale(0.45); opacity: 0; } 12% { opacity: 0.85; } 100% { transform: scale(1.75); opacity: 0; } }
        @keyframes pt-seam { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes pt-seamscan { 0% { left: -25%; } 100% { left: 125%; } }
        @keyframes pt-bar { 0% { transform: translateX(-120%); } 100% { transform: translateX(560%); } }
        @keyframes pt-flick { 0%,100% { opacity: 1; } 47% { opacity: 1; } 48% { opacity: 0.72; } 49% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.85; } 94% { opacity: 1; } }
        @keyframes pt-tickblink { 0%,100% { opacity: 0.85; } 50% { opacity: 0.35; } }
        .pt-gridtex { position: absolute; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(77,146,240,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(77,146,240,0.10) 1px, transparent 1px);
          background-size: 46px 46px; }
        .pt-scanlines { position: fixed; inset: 0; pointer-events: none; z-index: 5; opacity: 0.5;
          background: repeating-linear-gradient(0deg, rgba(10,20,40,0.0) 0px, rgba(10,20,40,0.0) 2px, rgba(0,0,0,0.16) 3px, rgba(0,0,0,0.16) 3px); }
        .pt-vignette { position: fixed; inset: 0; pointer-events: none; z-index: 5;
          background: radial-gradient(120% 120% at 50% 50%, transparent 52%, rgba(2,4,10,0.7) 100%); }
        .pt-hz { position: absolute; left: 0; right: 0; height: 14px; pointer-events: none;
          background: repeating-linear-gradient(-45deg, rgba(77,146,240,0.16) 0 10px, transparent 10px 20px); }
      `}</style>

      {/* ── Capa de bloqueo: difumina y desactiva toda la app durante la transición ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'rgba(5, 8, 16, 0.4)',
        backdropFilter: 'blur(9px)', WebkitBackdropFilter: 'blur(9px)',
      }} />

      {/* ── Hoja superior ── */}
      <div style={{ ...panelBase, top: 0, transform: closed ? 'translateY(0)' : 'translateY(-100.5%)' }}>
        <div className="pt-gridtex" style={{ maskImage: 'linear-gradient(180deg, transparent, #000 92%)', WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 92%)' }} />
        <div className="pt-hz" style={{ bottom: 3 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(77,146,240,0.55), transparent)' }} />
        {/* Brackets */}
        <div style={{ position: 'absolute', top: 26, left: 26, width: 30, height: 30, borderTop: '2px solid rgba(77,146,240,0.7)', borderLeft: '2px solid rgba(77,146,240,0.7)', opacity: showHUD ? 1 : 0, transition: 'opacity 0.4s ease 0.15s' }} />
        <div style={{ position: 'absolute', top: 26, right: 26, width: 30, height: 30, borderTop: '2px solid rgba(77,146,240,0.7)', borderRight: '2px solid rgba(77,146,240,0.7)', opacity: showHUD ? 1 : 0, transition: 'opacity 0.4s ease 0.15s' }} />
        <div style={{ position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.4em', color: 'rgba(143,180,232,0.65)', textTransform: 'uppercase', opacity: showHUD ? 1 : 0, transition: 'opacity 0.4s ease 0.2s' }}>SSPM · SJR · C4</div>
      </div>

      {/* ── Hoja inferior ── */}
      <div style={{ ...panelBase, bottom: 0, transform: closed ? 'translateY(0)' : 'translateY(100.5%)' }}>
        <div className="pt-gridtex" style={{ maskImage: 'linear-gradient(0deg, transparent, #000 92%)', WebkitMaskImage: 'linear-gradient(0deg, transparent, #000 92%)' }} />
        <div className="pt-hz" style={{ top: 3 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(77,146,240,0.55), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 26, left: 26, width: 30, height: 30, borderBottom: '2px solid rgba(77,146,240,0.7)', borderLeft: '2px solid rgba(77,146,240,0.7)', opacity: showHUD ? 1 : 0, transition: 'opacity 0.4s ease 0.15s' }} />
        <div style={{ position: 'absolute', bottom: 26, right: 26, width: 30, height: 30, borderBottom: '2px solid rgba(77,146,240,0.7)', borderRight: '2px solid rgba(77,146,240,0.7)', opacity: showHUD ? 1 : 0, transition: 'opacity 0.4s ease 0.15s' }} />
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.4em', color: 'rgba(143,180,232,0.65)', textTransform: 'uppercase', opacity: showHUD ? 1 : 0, transition: 'opacity 0.4s ease 0.2s' }}>ENLACE CIFRADO · TLS 1.3</div>
      </div>

      {/* ── Costura central energizada ── */}
      <div style={{
        position: 'fixed', left: 0, right: 0, top: '50%', height: 2, zIndex: 3, transform: 'translateY(-1px)',
        background: 'linear-gradient(90deg, transparent, #4d92f0 25%, #bcd6ff 50%, #4d92f0 75%, transparent)',
        boxShadow: '0 0 26px rgba(77,146,240,0.8), 0 0 60px rgba(77,146,240,0.35)',
        opacity: closed ? 1 : 0, transition: 'opacity 0.3s ease',
        animation: closed ? 'pt-seam 1.6s ease-in-out infinite' : 'none', pointerEvents: 'none',
      }}>
        {/* Escáner que viaja por la costura */}
        {closed && (
          <div style={{ position: 'absolute', top: -3, width: 120, height: 8, borderRadius: 8,
            background: 'radial-gradient(closest-side, rgba(210,230,255,0.95), rgba(77,146,240,0.2), transparent)',
            filter: 'blur(1px)', animation: 'pt-seamscan 1.9s cubic-bezier(0.5,0,0.5,1) infinite' }} />
        )}
      </div>

      {/* ── Efectos de pantalla ── */}
      {closed && <div className="pt-scanlines" />}
      {closed && <div className="pt-vignette" />}

      {/* ── Núcleo HUD ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 6,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30,
        pointerEvents: 'none',
        opacity: showHUD ? 1 : 0,
        transform: showHUD ? 'scale(1)' : 'scale(0.92)',
        transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.2,0.9,0.2,1)',
      }}>
        {/* Logo + anillos + radar */}
        <div style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Radar: anillos concéntricos expansivos */}
          {showHUD && [0, 0.6, 1.2].map((d, i) => (
            <div key={i} style={{
              position: 'absolute', width: 220, height: 220, borderRadius: '50%',
              border: '1px solid rgba(77,146,240,0.5)',
              animation: `pt-radar 1.8s ease-out ${d}s infinite`,
            }} />
          ))}
          {/* Hexágono exterior girando */}
          <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: 'absolute', animation: showHUD ? 'pt-spin 9s linear infinite' : 'none' }}>
            <polygon points="120,14 212,67 212,173 120,226 28,173 28,67" fill="none" stroke="rgba(77,146,240,0.28)" strokeWidth="1.5" strokeDasharray="4 9" />
          </svg>
          {/* Anillo de ticks girando inverso */}
          <svg width="196" height="196" viewBox="0 0 196 196" style={{ position: 'absolute', animation: showHUD ? 'pt-spin-rev 6s linear infinite' : 'none' }}>
            <circle cx="98" cy="98" r="92" fill="none" stroke="rgba(77,146,240,0.55)" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" />
          </svg>
          {/* Arco de progreso */}
          <svg width="168" height="168" viewBox="0 0 168 168" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <circle cx="84" cy="84" r="80" fill="none" stroke="rgba(77,146,240,0.12)" strokeWidth="3" />
            <circle cx="84" cy="84" r="80" fill="none" stroke="#4d92f0" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={2 * Math.PI * 80 * (1 - pct / 100)}
              style={{ filter: 'drop-shadow(0 0 6px rgba(77,146,240,0.8))', transition: 'stroke-dashoffset 0.15s linear' }} />
          </svg>
          {/* Logo (sin overflow:hidden para no cortar el glow) */}
          <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/chaleco.png" alt="CENTINELA" style={{ height: 108, objectFit: 'contain', position: 'relative', zIndex: 1, animation: showHUD ? 'pt-pulse 1.7s ease-in-out infinite' : 'none' }} />
            {/* La línea de escaneo sí se recorta a su propia caja para no desbordar */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
              <div style={{ position: 'absolute', left: '4%', right: '4%', height: 2,
                background: 'linear-gradient(90deg, transparent, #bcd6ff, transparent)',
                boxShadow: '0 0 14px rgba(77,146,240,0.9)',
                animation: showHUD ? 'pt-scan 1.9s cubic-bezier(0.45,0,0.55,1) infinite' : 'none' }} />
            </div>
          </div>
        </div>

        {/* Título */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, animation: showHUD ? 'pt-flick 3.2s ease-in-out infinite' : 'none' }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 46,
            letterSpacing: '0.36em', textTransform: 'uppercase', color: '#eef3fb', paddingLeft: '0.36em',
            textShadow: '0 0 34px rgba(77,146,240,0.6)',
          }}>CENTINELA</div>
          <div style={{ width: 200, height: 1, background: 'linear-gradient(90deg, transparent, rgba(77,146,240,0.8), transparent)' }} />
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(143,180,232,0.8)' }}>
            Sistema de Seguridad Pública Municipal
          </div>
        </div>

        {/* Estado + progreso segmentado + porcentaje */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 340 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            <span style={{ color: 'rgba(143,180,232,0.85)' }}>Inicializando enlace seguro</span>
            <span style={{ color: '#8fc0ff', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{String(pct).padStart(3, '0')}%</span>
          </div>
          {/* Barra segmentada */}
          <div style={{ position: 'relative', display: 'flex', gap: 3, width: '100%', height: 6, overflow: 'hidden' }}>
            {Array.from({ length: TICKS }).map((_, i) => {
              const on = (i / TICKS) * 100 <= pct
              return (
                <div key={i} style={{
                  flex: 1, height: '100%',
                  background: on ? '#4d92f0' : 'rgba(77,146,240,0.14)',
                  boxShadow: on ? '0 0 8px rgba(77,146,240,0.7)' : 'none',
                  transition: 'background 0.15s ease, box-shadow 0.15s ease',
                }} />
              )
            })}
            {/* Barrido de brillo */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, width: 60,
              background: 'linear-gradient(90deg, transparent, rgba(210,230,255,0.55), transparent)',
              animation: showHUD ? 'pt-bar 1.5s linear infinite' : 'none', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
