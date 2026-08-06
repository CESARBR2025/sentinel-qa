# Etapa 4 — Cliente: activar/desactivar push desde el dropdown de notificaciones

Depende de Etapa 2 (server actions `suscribirPush`/`desuscribirPush`/`estadoSuscripcion`) y Etapa 3 (SW ya sabe recibir push). Leer primero `00-contexto.md`.

No se crea una pantalla de configuración nueva — el toggle vive dentro del dropdown ya global de `CampanillaNotificaciones.tsx` (montado en `Header.tsx` y `SubHeader.tsx`, así que aparece en toda la app sin tocar rutas por rol).

## Archivo nuevo: `hooks/usePushSubscription.ts`

Hook que encapsula el ciclo completo: estado de permiso del navegador, alta/baja de la suscripción, llamada a las server actions.

```ts
'use client'

import { useCallback, useEffect, useState } from 'react'
import { suscribirPush, desuscribirPush, estadoSuscripcion } from '@/lib/push/actions'

type EstadoPush = 'no-soportado' | 'cargando' | 'inactivo' | 'activo' | 'denegado'

function urlBase64ToUint8Array(base64: string): Uint8Array {
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

  useEffect(() => { void refrescar() }, [refrescar])

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
```

Notas:
- `sub.toJSON()` en el navegador siempre trae `keys.p256dh`/`keys.auth` cuando la suscripción se creó con `userVisibleOnly: true` — no hace falta un cast más elaborado, pero TypeScript tipa `PushSubscriptionJSON.keys` como opcional (`Record<string, string> | undefined`); el `as` de arriba es aceptable porque en la práctica siempre vienen, revisar si `tsc --noEmit` se queja y ajustar el tipo si hace falta (no forzar un `any`).
- `Notification.requestPermission()` solo puede llamarse desde un gesto del usuario (click) en navegadores modernos — por eso `activar()` se expone como acción explícita del botón, nunca se llama automáticamente al montar.

## Archivo nuevo: `components/notificaciones/TogglePush.tsx`

```tsx
'use client'

import { BellPlus, BellOff, Loader2 } from 'lucide-react'
import { usePushSubscription } from '@/hooks/usePushSubscription'

const ESTILO_BASE: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, width: '100%',
  padding: '10px 14px', border: 'none', borderTop: '1px solid #e2e8f0',
  background: 'transparent', cursor: 'pointer', textAlign: 'left',
  fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b',
}

export function TogglePush() {
  const { estado, activar, desactivar } = usePushSubscription()

  if (estado === 'no-soportado') return null

  if (estado === 'denegado') {
    return (
      <div style={{ ...ESTILO_BASE, cursor: 'default', color: '#94a3b8' }}>
        <BellOff size={13} /> Notificaciones bloqueadas en el navegador
      </div>
    )
  }

  if (estado === 'cargando') {
    return (
      <div style={{ ...ESTILO_BASE, cursor: 'default' }}>
        <Loader2 size={13} className="animate-spin" /> Cargando…
      </div>
    )
  }

  if (estado === 'activo') {
    return (
      <button type="button" onClick={() => void desactivar()} style={ESTILO_BASE}>
        <BellOff size={13} /> Desactivar en este dispositivo
      </button>
    )
  }

  return (
    <button type="button" onClick={() => void activar()} style={{ ...ESTILO_BASE, color: '#1f355a' }}>
      <BellPlus size={13} /> Activar notificaciones en este dispositivo
    </button>
  )
}
```

Confirmar que la clase utilitaria `animate-spin` existe ya en el proyecto (Tailwind trae esa animación por defecto en `@theme`/config estándar — verificar en `app/globals.css` o el uso existente en otro loader del proyecto antes de asumir; si no existe, usar un `style` de rotación inline consistente con el resto del archivo).

## Archivo a modificar: `components/notificaciones/CampanillaNotificaciones.tsx`

Import nuevo junto a los existentes:

```tsx
import { TogglePush } from './TogglePush'
```

Renderizar `<TogglePush />` **antes** del `<Link href="/notificaciones">` que cierra el dropdown (línea ~354, justo después del `</div>` que cierra la lista de `items.map(...)`, dentro del mismo contenedor del dropdown). No tocar nada de la lógica de polling/lectura existente.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. En un navegador de escritorio con soporte (Chrome/Edge), abrir el dropdown de la campanita → aparece "Activar notificaciones en este dispositivo" → click → el navegador pide permiso → al conceder, el botón cambia a "Desactivar en este dispositivo" → verificar en la tabla `push_subscriptions` que se insertó una fila con el `user_id` correcto.
3. Click en "Desactivar" → el botón vuelve a "Activar…" → la fila correspondiente se borró de `push_subscriptions`.
4. En un navegador sin soporte (o con el permiso ya denegado a nivel de sistema), el toggle no rompe el dropdown — se oculta o muestra el mensaje de bloqueado, según corresponda.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 5.
