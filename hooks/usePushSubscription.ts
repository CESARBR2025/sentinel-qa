'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { suscribirPush, desuscribirPush, estadoSuscripcion } from '@/lib/push/actions'

type EstadoPush = 'no-soportado' | 'cargando' | 'inactivo' | 'activo' | 'denegado'

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Segura = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64Segura)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

class ServiceWorkerTimeoutError extends Error {}

// navigator.serviceWorker.ready nunca resuelve si el SW no llegó a
// registrarse (ej. en desarrollo, ver sw-register.tsx que solo registra en
// producción) — sin este timeout, activar()/refrescar() se quedan colgados
// para siempre, sin éxito ni error, dejando al usuario sin ningún feedback.
async function serviceWorkerListo(timeoutMs = 6000): Promise<ServiceWorkerRegistration> {
  return await Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new ServiceWorkerTimeoutError('El service worker no respondió a tiempo')), timeoutMs),
    ),
  ])
}

export function usePushSubscription() {
  const [estado, setEstado] = useState<EstadoPush>('cargando')

  const refrescar = useCallback(async () => {
    console.debug('[push] refrescar: inicio — permission =', typeof Notification !== 'undefined' ? Notification.permission : 'n/a')
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.debug('[push] refrescar: serviceWorker/PushManager no soportados en este navegador')
      setEstado('no-soportado')
      return
    }
    if (Notification.permission === 'denied') {
      console.debug('[push] refrescar: permiso de notificación ya denegado por el navegador')
      setEstado('denegado')
      return
    }
    try {
      const registro = await serviceWorkerListo()
      console.debug('[push] refrescar: SW listo — scope =', registro.scope, 'active =', registro.active?.state)
      const sub = await registro.pushManager.getSubscription()
      console.debug('[push] refrescar: getSubscription() =', sub?.endpoint ?? null)
      if (!sub) {
        setEstado('inactivo')
        return
      }
      const activa = await estadoSuscripcion(sub.endpoint)
      console.debug('[push] refrescar: estadoSuscripcion() en BD =', activa)
      setEstado(activa ? 'activo' : 'inactivo')
    } catch (e) {
      console.error('[push] refrescar: excepción —', e instanceof Error ? `${e.name}: ${e.message}` : e)
      setEstado('inactivo')
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => { void refrescar() }, 0)
    return () => clearTimeout(t)
  }, [refrescar])

  const activar = useCallback(async () => {
    console.debug('[push] activar: inicio')
    setEstado('cargando')
    try {
      const permiso = await Notification.requestPermission()
      console.debug('[push] activar: Notification.requestPermission() =', permiso)
      if (permiso !== 'granted') {
        setEstado(permiso === 'denied' ? 'denegado' : 'inactivo')
        return
      }

      const registro = await serviceWorkerListo()
      console.debug('[push] activar: SW listo — scope =', registro.scope, 'active =', registro.active?.state)

      const clave = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      console.debug('[push] activar: NEXT_PUBLIC_VAPID_PUBLIC_KEY presente =', !!clave, clave ? `(${clave.length} chars)` : '(vacía/undefined)')
      if (!clave) throw new Error('NEXT_PUBLIC_VAPID_PUBLIC_KEY no está definida en el bundle del cliente')

      const suscripcionPrevia = await registro.pushManager.getSubscription()
      console.debug('[push] activar: suscripción ya existente en el navegador =', suscripcionPrevia?.endpoint ?? null)

      const sub = await registro.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(clave),
      })
      console.debug('[push] activar: pushManager.subscribe() OK — endpoint =', sub.endpoint)

      await suscribirPush(sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } })
      console.debug('[push] activar: suscribirPush() (server action) completó sin lanzar error')

      setEstado('activo')
      console.debug('[push] activar: estado -> activo')
    } catch (e) {
      const detalle = e instanceof Error ? `${e.name}: ${e.message}` : String(e)
      console.error('[push] fallo al activar —', detalle, e)
      toast.error(
        e instanceof ServiceWorkerTimeoutError
          ? 'No se pudo activar: el service worker no respondió. Recarga la página e intenta de nuevo.'
          : `No se pudieron activar las notificaciones (${detalle}).`
      )
      setEstado('inactivo')
    }
  }, [])

  const desactivar = useCallback(async () => {
    setEstado('cargando')
    try {
      const registro = await serviceWorkerListo()
      const sub = await registro.pushManager.getSubscription()
      if (sub) {
        await desuscribirPush(sub.endpoint)
        await sub.unsubscribe()
      }
      setEstado('inactivo')
    } catch (e) {
      console.error('[push] fallo al desactivar:', e)
      toast.error('No se pudieron desactivar las notificaciones. Intenta de nuevo.')
      setEstado('inactivo')
    }
  }, [])

  return { estado, activar, desactivar }
}
