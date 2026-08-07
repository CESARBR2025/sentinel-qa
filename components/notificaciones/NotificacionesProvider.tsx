'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePolling } from '@/hooks/usePolling'
import { authClient } from '@/lib/auth-client'
import type { Notificacion } from '@/lib/notificaciones/types'
import { AlertaCriticaToast } from './AlertaCriticaToast'

// Cuántas notificaciones se muestran en el dropdown. El resto vive en /notificaciones.
const MAX_DROPDOWN = 5
const INTERVALO_MS = 30_000

interface NotificacionesState {
  noLeidas: number
  items: Notificacion[]
  cargando: boolean
  sacudir: boolean
  cargarLista: () => Promise<void>
  abrirNotificacion: (n: Notificacion) => Promise<void>
  marcarTodas: () => Promise<void>
}

const Ctx = createContext<NotificacionesState | null>(null)

export function useNotificaciones(): NotificacionesState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useNotificaciones debe usarse dentro de <NotificacionesProvider>')
  return ctx
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

function sonarAlertaCritica() {
  try {
    const ctx = new AudioContext()
    const t = ctx.currentTime
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'square'
      const on = t + i * 0.22
      const off = on + 0.16
      osc.frequency.setValueAtTime(i % 2 === 0 ? 1046 : 784, on)
      gain.gain.setValueAtTime(0, on)
      gain.gain.linearRampToValueAtTime(0.18, on + 0.03)
      gain.gain.setValueAtTime(0.18, off - 0.04)
      gain.gain.linearRampToValueAtTime(0, off)
      osc.start(on); osc.stop(off + 0.01)
    }
  } catch {
    // AudioContext bloqueado por el navegador — se omite el sonido.
  }
}

// Dueño único del polling de notificaciones — se monta una sola vez en el
// layout raíz (app/layout.tsx) y sobrevive a la navegación entre páginas.
// Antes este estado (interval, conteo previo, id de la última crítica vista)
// vivía dentro de CampanillaNotificaciones, que se remonta en cada page.tsx
// que importa DashboardHeader (~76 páginas) — cada navegación reiniciaba el
// polling de 30s y "olvidaba" qué crítica ya se había mostrado. Con el estado
// aquí arriba, CampanillaNotificaciones queda como componente de UI puro que
// solo consume el contexto.
export function NotificacionesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const autenticado = !!session?.user

  const [noLeidas, setNoLeidas] = useState(0)
  const [items, setItems] = useState<Notificacion[]>([])
  const [cargando, setCargando] = useState(false)
  const [sacudir, setSacudir] = useState(false)
  const previoRef = useRef(0)
  const [alertaCritica, setAlertaCritica] = useState<Notificacion | null>(null)
  const criticaVistaRef = useRef<string | null>(null)

  // Sólo el conteo (+ la crítica no leída más reciente, si hay una nueva):
  // dos queries indexadas, sin traer la lista completa. Es lo único que corre
  // en cada intervalo del polling.
  const refrescarContador = useCallback(async () => {
    try {
      const r = await fetch('/api/notificaciones/contador', { cache: 'no-store' })
      if (!r.ok) return
      const { noLeidas: n, critica } = await r.json() as { noLeidas: number; critica: Notificacion | null }
      setNoLeidas(n)
      if (n > previoRef.current && previoRef.current !== 0) {
        sonarAlerta()
        setSacudir(true)
        setTimeout(() => setSacudir(false), 600)
      }
      previoRef.current = n

      document.title = n > 0
        ? `(${n > 99 ? '99+' : n}) ${document.title.replace(/^\(\d+\+?\)\s/, '')}`
        : document.title.replace(/^\(\d+\+?\)\s/, '')

      // A diferencia del sonido normal, la alerta crítica sí se muestra desde
      // la primera carga si ya hay una pendiente — es justo el caso que se
      // quiere resolver (que no pase desapercibida aunque el usuario acabe de entrar).
      if (critica && critica.id !== criticaVistaRef.current) {
        criticaVistaRef.current = critica.id
        setAlertaCritica(critica)
        sonarAlertaCritica()
      }
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

  useEffect(() => {
    if (!autenticado) return
    const t = setTimeout(() => void refrescarContador(), 0)
    return () => clearTimeout(t)
  }, [autenticado, refrescarContador])

  // Puente near-instant: cuando llega un push mientras la pestaña está
  // abierta, el SW manda un postMessage — refresca de inmediato en vez de
  // esperar al próximo tick del polling de 30s. Si el navegador no soporta
  // service workers (o no hay uno registrado, ej. en dev), no pasa nada.
  useEffect(() => {
    if (!autenticado) return
    if (!('serviceWorker' in navigator)) return
    const onMessage = (e: MessageEvent) => {
      if (e.data?.tipo === 'notificacion-push') void refrescarContador()
    }
    navigator.serviceWorker.addEventListener('message', onMessage)
    return () => navigator.serviceWorker.removeEventListener('message', onMessage)
  }, [autenticado, refrescarContador])

  // El polling se detiene con la pestaña oculta: no tiene sentido consultar
  // mientras nadie mira, y evita acumular peticiones en pestañas de fondo.
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  usePolling(() => { void refrescarContador() }, INTERVALO_MS, autenticado && visible)

  async function abrirNotificacion(n: Notificacion) {
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
    <Ctx.Provider value={{ noLeidas, items, cargando, sacudir, cargarLista, abrirNotificacion, marcarTodas }}>
      {children}
      {alertaCritica && (
        <AlertaCriticaToast
          critica={alertaCritica}
          onVer={() => {
            setNoLeidas(c => Math.max(0, c - 1))
            void fetch('/api/notificaciones/leer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: alertaCritica.id }),
            })
            setAlertaCritica(null)
          }}
          onDescartar={() => setAlertaCritica(null)}
        />
      )}
    </Ctx.Provider>
  )
}
