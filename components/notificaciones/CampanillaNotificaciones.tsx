'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePolling } from '@/hooks/usePolling'

// Cuántas notificaciones se muestran en el dropdown. El resto vive en /notificaciones.
const MAX_DROPDOWN = 5
const INTERVALO_MS = 45_000
const ANCHO_DROPDOWN = 360

interface Notificacion {
  id: string
  evento: string
  titulo: string
  mensaje: string
  href: string | null
  severidad: 'info' | 'aviso' | 'critico'
  leida: boolean
  creadoEn: string
}

const COLOR_SEVERIDAD: Record<string, string> = {
  info: '#0284c7',
  aviso: '#ea580c',
  critico: '#dc2626',
}

function haceCuanto(fecha: string): string {
  const d = new Date(fecha)
  if (Number.isNaN(d.getTime())) return ''
  const mins = Math.floor((Date.now() - d.getTime()) / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs} h`
  return `hace ${Math.floor(hrs / 24)} d`
}

function sonarAlerta() {
  try {
    const ctx = new AudioContext()
    const t = ctx.currentTime
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'triangle'
      const on = t + i * 0.18
      const off = on + 0.18
      osc.frequency.setValueAtTime(i % 2 === 0 ? 880 : 660, on)
      gain.gain.setValueAtTime(0, on)
      gain.gain.linearRampToValueAtTime(0.14, on + 0.04)
      gain.gain.setValueAtTime(0.14, off - 0.06)
      gain.gain.linearRampToValueAtTime(0, off)
      osc.start(on); osc.stop(off + 0.01)
    }
  } catch {
    // AudioContext bloqueado por el navegador — se omite el sonido.
  }
}

export function CampanillaNotificaciones() {
  const [abierto, setAbierto] = useState(false)
  const [noLeidas, setNoLeidas] = useState(0)
  const [items, setItems] = useState<Notificacion[]>([])
  const [cargando, setCargando] = useState(false)
  // Posición calculada del botón, para pintar el dropdown vía portal.
  const [posicion, setPosicion] = useState<{ top: number; right: number } | null>(null)
  const botonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const previoRef = useRef(0)
  const router = useRouter()

  // Sólo el conteo: una query indexada, sin traer la lista completa. Es lo
  // único que corre en cada intervalo del polling.
  const refrescarContador = useCallback(async () => {
    try {
      const r = await fetch('/api/notificaciones/contador', { cache: 'no-store' })
      if (!r.ok) return
      const { noLeidas: n } = await r.json() as { noLeidas: number }
      setNoLeidas(n)
      if (n > previoRef.current && previoRef.current !== 0) sonarAlerta()
      previoRef.current = n
    } catch {
      // Sin red: se reintenta en el siguiente intervalo.
    }
  }, [])

  const cargarLista = useCallback(async () => {
    setCargando(true)
    try {
      const r = await fetch(`/api/notificaciones?limite=${MAX_DROPDOWN}`, { cache: 'no-store' })
      if (!r.ok) return
      const data = await r.json() as { notificaciones: Notificacion[]; noLeidas: number }
      setItems(data.notificaciones)
      setNoLeidas(data.noLeidas)
      previoRef.current = data.noLeidas
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { void refrescarContador() }, [refrescarContador])

  // El polling se detiene con la pestaña oculta: no tiene sentido consultar
  // mientras nadie mira, y evita acumular peticiones en pestañas de fondo.
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  usePolling(() => { void refrescarContador() }, INTERVALO_MS, visible)

  // Cerrar al hacer click fuera. El dropdown vive en un portal (document.body,
  // ver más abajo por qué), así que "fuera" significa fuera del botón Y fuera
  // del propio dropdown — ambos comprobados por ref.
  useEffect(() => {
    if (!abierto) return
    const handler = (e: MouseEvent) => {
      const objetivo = e.target as Node
      if (botonRef.current?.contains(objetivo)) return
      if (dropdownRef.current?.contains(objetivo)) return
      setAbierto(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [abierto])

  async function alternar() {
    const nuevo = !abierto
    if (nuevo && botonRef.current) {
      const r = botonRef.current.getBoundingClientRect()
      setPosicion({ top: r.bottom + 8, right: window.innerWidth - r.right })
    }
    setAbierto(nuevo)
    if (nuevo) await cargarLista()
  }

  async function abrirNotificacion(n: Notificacion) {
    setAbierto(false)
    if (!n.leida) {
      setNoLeidas(c => Math.max(0, c - 1))
      setItems(prev => prev.map(x => x.id === n.id ? { ...x, leida: true } : x))
      void fetch('/api/notificaciones/leer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: n.id }),
      })
    }
    if (n.href) router.push(n.href)
  }

  async function marcarTodas() {
    setNoLeidas(0)
    setItems(prev => prev.map(x => ({ ...x, leida: true })))
    await fetch('/api/notificaciones/leer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todas: true }),
    })
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={botonRef}
        type="button"
        onClick={() => void alternar()}
        aria-label={`Notificaciones${noLeidas > 0 ? ` (${noLeidas} sin leer)` : ''}`}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 38, height: 38, border: '1px solid #e2e8f0', background: '#fff',
          cursor: 'pointer', color: noLeidas > 0 ? '#1f355a' : '#64748b',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {noLeidas > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, padding: '0 4px',
            borderRadius: 9, background: '#dc2626', color: '#fff',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {noLeidas > 99 ? '99+' : noLeidas}
          </span>
        )}
      </button>

      {/*
        Portal a document.body en vez de un <div position:absolute> anidado
        dentro del header. Se probó con z-index altísimo (999999) y el
        dropdown seguía quedando tapado por tarjetas de la página en /dashboard
        (con backdropFilter:blur en el header, un descendiente que se desborda
        de la caja del header puede pintarse mal en algunos motores, sin
        importar el z-index). Con un portal, el dropdown ya no es descendiente
        del header ni de ningún contenedor con overflow/backdrop-filter propio
        — se posiciona con `fixed` calculado desde el botón, así que el bug
        queda eliminado de raíz en vez de perseguido con más z-index.
      */}
      {abierto && posicion && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed', top: posicion.top, right: posicion.right,
            width: ANCHO_DROPDOWN, zIndex: 999999,
            background: '#fff', border: '1px solid #e2e8f0',
            boxShadow: '0 16px 40px -12px rgba(15,23,42,0.35)',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderBottom: '1px solid #e2e8f0',
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#1f355a',
            }}>
              Notificaciones{noLeidas > 0 ? ` · ${noLeidas}` : ''}
            </span>
            {noLeidas > 0 && (
              <button type="button" onClick={() => void marcarTodas()} style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#64748b',
              }}>
                Marcar todas
              </button>
            )}
          </div>

          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {cargando && items.length === 0 && (
              <p style={{ margin: 0, padding: '22px 14px', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
                Cargando…
              </p>
            )}
            {!cargando && items.length === 0 && (
              <p style={{ margin: 0, padding: '22px 14px', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
                Sin notificaciones
              </p>
            )}
            {items.map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => void abrirNotificacion(n)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                  padding: '11px 14px', border: 'none', borderBottom: '1px solid #f1f5f9',
                  background: n.leida ? '#fff' : '#f8fafc',
                  borderLeft: `3px solid ${n.leida ? 'transparent' : COLOR_SEVERIDAD[n.severidad] ?? '#0284c7'}`,
                }}
              >
                <span style={{
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8,
                }}>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 12.5,
                    fontWeight: n.leida ? 500 : 700, color: '#0f172a',
                    minWidth: 0, overflowWrap: 'break-word',
                  }}>
                    {n.titulo}
                  </span>
                  <span style={{
                    flexShrink: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#94a3b8',
                  }}>
                    {haceCuanto(n.creadoEn)}
                  </span>
                </span>
                <span style={{
                  display: 'block', marginTop: 3, fontFamily: 'Inter, sans-serif',
                  fontSize: 11.5, color: '#64748b', lineHeight: 1.45,
                }}>
                  {n.mensaje}
                </span>
              </button>
            ))}
          </div>

          <Link
            href="/notificaciones"
            onClick={() => setAbierto(false)}
            style={{
              display: 'block', padding: '11px 14px', borderTop: '1px solid #e2e8f0',
              textAlign: 'center', textDecoration: 'none', color: '#1f355a',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}
          >
            Ver todas
          </Link>
        </div>,
        document.body,
      )}
    </div>
  )
}
