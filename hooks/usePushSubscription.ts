'use client'

import { useCallback, useEffect, useState } from 'react'
import { suscribirPush, desuscribirPush, estadoSuscripcion } from '@/lib/push/actions'

type EstadoPush = 'no-soportado' | 'cargando' | 'inactivo' | 'activo' | 'denegado'

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Segura = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64Segura)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

export function usePushSubscription() {
  const [estado, setEstado] = useState<EstadoPush>('cargando')

  const refrescar = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setEstado('no-soportado')
      return
    }
    if (Notification.permission === 'denied') {
      setEstado('denegado')
      return
    }
    try {
      const registro = await navigator.serviceWorker.ready
      const sub = await registro.pushManager.getSubscription()
      if (!sub) {
        setEstado('inactivo')
        return
      }
      const activa = await estadoSuscripcion(sub.endpoint)
      setEstado(activa ? 'activo' : 'inactivo')
    } catch {
      setEstado('inactivo')
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => { void refrescar() }, 0)
    return () => clearTimeout(t)
  }, [refrescar])

  const activar = useCallback(async () => {
    setEstado('cargando')
    try {
      const permiso = await Notification.requestPermission()
      if (permiso !== 'granted') {
        setEstado(permiso === 'denied' ? 'denegado' : 'inactivo')
        return
      }
      const registro = await navigator.serviceWorker.ready
      const clave = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      const sub = await registro.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(clave),
      })
      await suscribirPush(sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } })
      setEstado('activo')
    } catch (e) {
      console.error('[push] fallo al activar:', e)
      setEstado('inactivo')
    }
  }, [])

  const desactivar = useCallback(async () => {
    setEstado('cargando')
    try {
      const registro = await navigator.serviceWorker.ready
      const sub = await registro.pushManager.getSubscription()
      if (sub) {
        await desuscribirPush(sub.endpoint)
        await sub.unsubscribe()
      }
      setEstado('inactivo')
    } catch (e) {
      console.error('[push] fallo al desactivar:', e)
      setEstado('inactivo')
    }
  }, [])

  return { estado, activar, desactivar }
}
