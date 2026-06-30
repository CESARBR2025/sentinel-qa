'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { marcarLeida, marcarTodasLeidas, generarAlertasDebug } from '@/lib/notificaciones/actions'
interface Notificacion {
  id: string
  userId: string
  tipo: string
  titulo: string
  mensaje: string
  href: string | null
  leida: boolean
  fichaId: string | null
  hito: string | null
  creadoEn: string
}

const BellIcon = ({ hasUnread }: { hasUnread: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke={hasUnread ? '#d4a43a' : '#8a9bc0'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    {hasUnread && <circle cx="18" cy="6" r="4" fill="#c0223a" stroke="none" />}
  </svg>
)

function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const mins = Math.floor((Date.now() - d.getTime()) / 60000)
  if (mins < 1)  return 'ahora'
  if (mins < 60) return `hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `hace ${hrs}h`
  return `hace ${Math.floor(hrs / 24)}d`
}

function playAlertSound() {
  try {
    const ctx  = new AudioContext()
    const t    = ctx.currentTime
    const REPS = 4          // number of two-tone cycles
    const CYCLE = 0.22      // seconds per half-cycle

    for (let i = 0; i < REPS * 2; i++) {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'triangle'
      // Alternate between high and low tones
      osc.frequency.setValueAtTime(i % 2 === 0 ? 880 : 660, t + i * CYCLE)

      const on  = t + i * CYCLE
      const off = on + CYCLE
      gain.gain.setValueAtTime(0,    on)
      gain.gain.linearRampToValueAtTime(0.18, on + 0.04)  // softer attack
      gain.gain.setValueAtTime(0.18, off - 0.06)
      gain.gain.linearRampToValueAtTime(0,    off)         // smooth fade

      osc.start(on)
      osc.stop(off + 0.01)
    }
  } catch {
    // AudioContext blocked — silently skip
  }
}

interface ToastProps {
  count: number
  onClose: () => void
}

const KEYFRAMES_ID = 'sentinel-alert-kf'
const KEYFRAMES = `
  @keyframes sentinelIn {
    0%   { clip-path: inset(0 0 100% 0); opacity: 0.7; }
    8%   { opacity: 1; }
    100% { clip-path: inset(0 0 0%   0); opacity: 1; }
  }
  @keyframes sentinelOut {
    0%   { clip-path: inset(0 0 0%   0); opacity: 1; }
    85%  { opacity: 0.6; }
    100% { clip-path: inset(0 0 100% 0); opacity: 0; }
  }
`

function injectKeyframes() {
  if (typeof document === 'undefined') return
  if (document.getElementById(KEYFRAMES_ID)) return
  const el = document.createElement('style')
  el.id = KEYFRAMES_ID
  el.textContent = KEYFRAMES
  document.head.appendChild(el)
}

function AlertToast({ count, onClose }: ToastProps) {
  const [phase, setPhase] = useState<'in' | 'out'>('in')

  useEffect(() => {
    injectKeyframes()
    const toOut  = setTimeout(() => setPhase('out'), 9600)
    const toDone = setTimeout(onClose, 10000)
    return () => { clearTimeout(toOut); clearTimeout(toDone) }
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      display: 'flex', alignItems: 'stretch', gap: 0,
      background: 'rgba(7, 11, 22, 0.88)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(192, 34, 58, 0.5)',
      boxShadow: '0 0 24px rgba(192,34,58,0.14), 0 0 2px rgba(192,34,58,0.35), 0 24px 56px rgba(0,0,0,0.65)',
      minWidth: 360, maxWidth: 440,
      animation: phase === 'in'
        ? 'sentinelIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards'
        : 'sentinelOut 0.4s cubic-bezier(0.55, 0, 1, 0.45) forwards',
      overflow: 'hidden',
    }}>
      {/* neon accent bar */}
      <div style={{
        width: 3, flexShrink: 0,
        background: 'linear-gradient(180deg, #c0223a 0%, rgba(192,34,58,0.08) 100%)',
        boxShadow: '0 0 8px rgba(192,34,58,0.8)',
      }} />

      <div style={{ flex: 1, padding: '18px 20px' }}>
        {/* label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#c0223a',
            boxShadow: '0 0 6px #c0223a',
          }} />
          <span style={{
            fontFamily: 'JetBrains Mono,monospace', fontWeight: 700,
            fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: '#c0223a',
            textShadow: '0 0 10px rgba(192,34,58,0.7)',
          }}>
            Alerta del sistema
          </span>
        </div>

        {/* main message */}
        <div style={{
          fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800,
          fontSize: 20, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: '#d8e0f0', lineHeight: 1.15, marginBottom: 6,
        }}>
          {count} plazo{count !== 1 ? 's' : ''} pendiente{count !== 1 ? 's' : ''}
        </div>

        <div style={{
          fontFamily: 'Inter,sans-serif', fontSize: 12,
          color: 'rgba(138,155,192,0.85)', lineHeight: 1.5,
        }}>
          Revisa la campanilla para ver los detalles.
        </div>
      </div>

      {/* close */}
      <button
        onClick={() => { setPhase('out'); setTimeout(onClose, 650) }}
        style={{
          background: 'transparent', border: 'none', borderLeft: '1px solid rgba(27,39,66,0.6)',
          color: 'rgba(74,88,120,0.6)', cursor: 'pointer',
          padding: '0 16px', flexShrink: 0,
          fontFamily: 'JetBrains Mono,monospace', fontSize: 12,
          transition: 'color 0.15s, background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#d8e0f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(74,88,120,0.6)'; e.currentTarget.style.background = 'transparent' }}
      >✕</button>
    </div>,
    document.body,
  )
}

interface Props {
  initialNotifs: Notificacion[]
}

export function CampanillaNotificaciones({ initialNotifs }: Props) {
  const [open,    setOpen]    = useState(false)
  const [notifs,  setNotifs]  = useState<Notificacion[]>(initialNotifs)
  const [toast,   setToast]   = useState<{ id: number; count: number } | null>(null)
  const [pending, startTransition] = useTransition()
  const panelRef = useRef<HTMLDivElement>(null)
  const router   = useRouter()
  const isDev    = process.env.NODE_ENV === 'development'

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Refresh every 2 min
  useEffect(() => {
    const iv = setInterval(async () => {
      const res = await fetch('/api/notificaciones', { cache: 'no-store' })
      if (res.ok) setNotifs(await res.json())
    }, 120_000)
    return () => clearInterval(iv)
  }, [])

  function handleMarcarLeida(id: string) {
    startTransition(async () => {
      await marcarLeida(id)
      setNotifs(prev => prev.filter(n => n.id !== id))
    })
  }

  function handleMarcarTodas() {
    startTransition(async () => {
      await marcarTodasLeidas()
      setNotifs([])
      setOpen(false)
    })
  }

  function handleDebug() {
    startTransition(async () => {
      await generarAlertasDebug()
      const res = await fetch('/api/notificaciones', { cache: 'no-store' })
      if (res.ok) {
        const fresh: Notificacion[] = await res.json()
        setNotifs(fresh)
        setOpen(true)
        if (fresh.length > 0) {
          playAlertSound()
          setToast({ id: Date.now(), count: fresh.length })
        }
      }
    })
  }

  const count = notifs.length

  return (
    <>
      {toast && (
        <AlertToast
          key={toast.id}
          count={toast.count}
          onClose={() => setToast(null)}
        />
      )}

      <div ref={panelRef} style={{ position: 'relative' }}>
        {/* Bell button */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            position: 'relative', background: 'transparent',
            border: open ? '1px solid #1b2742' : '1px solid transparent',
            padding: '6px 10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
          }}
          title="Notificaciones"
        >
          <BellIcon hasUnread={count > 0} />
          {count > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              minWidth: 16, height: 16, borderRadius: 8,
              background: '#c0223a', color: '#fff',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 3px', lineHeight: 1,
            }}>
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 8px)',
            width: 360, maxHeight: 480,
            background: '#0b1220', border: '1px solid #1b2742',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            zIndex: 500, display: 'flex', flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid #1b2742',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d8e0f0' }}>
                Notificaciones {count > 0 && <span style={{ color: '#c0223a' }}>({count})</span>}
              </span>
              {count > 0 && (
                <button
                  onClick={handleMarcarTodas}
                  disabled={pending}
                  style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', background: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                >
                  Marcar todas
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: 360 }}>
              {count === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#2a3a5e', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  › Sin notificaciones pendientes
                </div>
              ) : notifs.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px', borderBottom: '1px solid #0f1a2e',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                    {n.titulo.startsWith('⚠') ? '🔴' : '🟡'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 12, color: '#d8e0f0', marginBottom: 3 }}>
                      {n.titulo}
                    </div>
                    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#8a9bc0', lineHeight: 1.4, marginBottom: 6 }}>
                      {n.mensaje}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#2a3a5e', letterSpacing: '0.1em' }}>
                        {timeAgo(n.creadoEn)}
                      </span>
                      {n.href && (
                        <button
                          onClick={() => { router.push(n.href!); setOpen(false) }}
                          style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#d4a43a', background: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', padding: 0 }}
                        >
                          Ir →
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarcarLeida(n.id)}
                    disabled={pending}
                    style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#2a3a5e', background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0, padding: '2px 4px', lineHeight: 1 }}
                    title="Marcar como leída"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Footer — debug button (dev only) */}
            {isDev && (
              <div style={{ padding: '10px 16px', borderTop: '1px solid #1b2742' }}>
                <button
                  onClick={handleDebug}
                  disabled={pending}
                  style={{
                    width: '100%', padding: '7px 0',
                    background: 'rgba(212,164,58,0.08)', border: '1px dashed #d4a43a',
                    color: '#d4a43a', fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                    cursor: pending ? 'not-allowed' : 'pointer',
                  }}
                >
                  {pending ? 'Generando…' : '⚡ Generar alertas de prueba'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
