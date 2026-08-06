# Etapa 4 — Guardia de permisos obligatorios (Oficial de Campo)

No depende de las Etapas 1-3 (usa `usePushSubscription` y `useUbicacionOficial`, ambos ya existentes de planes anteriores). Es la etapa central de este plan. Leer primero `00-contexto.md`.

**Alcance confirmado con el usuario**: solo rutas `/oficial/*`. Bloqueo total, sin botón de "continuar sin esto" — el oficial no puede usar nada del sistema sin ubicación y push activos.

## Archivo nuevo: `components/oficial/GuardiaPermisosOficial.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'
import { MapPin, MapPinOff, BellRing, BellOff, RefreshCw } from 'lucide-react'
import { useUbicacionOficial } from './OficialUbicacionTracker'
import { usePushSubscription } from '@/hooks/usePushSubscription'

const botonPrimario: React.CSSProperties = {
  marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6,
  background: '#fff', color: '#0f172a', border: 'none',
  padding: '9px 16px', borderRadius: 3, cursor: 'pointer',
  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700,
}

const botonSecundario: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)',
  padding: '8px 14px', borderRadius: 3, cursor: 'pointer',
  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
}

function FilaEstado({
  icono, label, ok, children,
}: { icono: React.ReactNode; label: string; ok: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <span style={{ flexShrink: 0, color: ok ? '#4ade80' : '#fca5a5', marginTop: 2 }}>{icono}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: ok ? '#4ade80' : '#fca5a5' }}>
          {label} — {ok ? 'Activo' : 'Pendiente'}
        </div>
        {children}
      </div>
    </div>
  )
}

export function GuardiaPermisosOficial({ children }: { children: React.ReactNode }) {
  const { posicionActual, permisoDenegado, soportado: ubicacionSoportada } = useUbicacionOficial()
  const { estado: estadoPush, activar } = usePushSubscription()

  // Colchón de seguridad: si por lo que sea el hook de push se queda pegado
  // en 'cargando' (ya pasó una vez en producción — ver conversación del
  // deploy en Vercel), este guard NO puede dejar al oficial atrapado sin
  // salida. A los 8s se ofrece "Activar" igual y un botón de recargar.
  const [tiempoExcedido, setTiempoExcedido] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setTiempoExcedido(true), 8000)
    return () => clearTimeout(t)
  }, [])

  const ubicacionOk = ubicacionSoportada && !permisoDenegado && posicionActual !== null
  const pushOk = estadoPush === 'activo'
  const bloqueado = !ubicacionOk || !pushOk

  if (!bloqueado) return <>{children}</>

  return (
    <>
      {children}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 2147483647,
        background: 'rgba(15, 23, 42, 0.97)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
        <div style={{ width: '100%', maxWidth: 420, maxHeight: '90vh', overflow: 'auto' }}>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 26, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>
            Permisos obligatorios
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#cbd5e1', margin: '0 0 20px', lineHeight: 1.5 }}>
            Para operar como Oficial de Campo, este dispositivo necesita compartir tu ubicación con el despacho y tener las notificaciones activas. No puedes continuar sin ambos.
          </p>

          <FilaEstado icono={ubicacionOk ? <MapPin size={18} /> : <MapPinOff size={18} />} label="Ubicación" ok={ubicacionOk}>
            {!ubicacionSoportada && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>
                Tu navegador no soporta geolocalización — usa un navegador compatible (Chrome, Safari, Edge actualizados).
              </p>
            )}
            {ubicacionSoportada && permisoDenegado && (
              <>
                <p style={{ margin: '4px 0 8px', fontSize: 12, color: '#cbd5e1' }}>
                  Bloqueaste el permiso de ubicación. Ábrelo desde el ícono de sitio junto a la barra de direcciones → Ubicación → Permitir, y recarga.
                </p>
                <button type="button" onClick={() => location.reload()} style={botonSecundario}>
                  <RefreshCw size={13} /> Ya lo activé, recargar
                </button>
              </>
            )}
            {ubicacionSoportada && !permisoDenegado && !posicionActual && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>Obteniendo señal GPS…</p>
            )}
          </FilaEstado>

          <FilaEstado icono={pushOk ? <BellRing size={18} /> : <BellOff size={18} />} label="Notificaciones" ok={pushOk}>
            {estadoPush === 'no-soportado' && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>
                Tu navegador no soporta notificaciones push — usa un navegador compatible.
              </p>
            )}
            {estadoPush === 'denegado' && (
              <>
                <p style={{ margin: '4px 0 8px', fontSize: 12, color: '#cbd5e1' }}>
                  Bloqueaste las notificaciones. Actívalas desde la configuración del sitio en tu navegador y recarga.
                </p>
                <button type="button" onClick={() => location.reload()} style={botonSecundario}>
                  <RefreshCw size={13} /> Ya las activé, recargar
                </button>
              </>
            )}
            {(estadoPush === 'inactivo' || (estadoPush === 'cargando' && tiempoExcedido)) && (
              <button type="button" onClick={() => void activar()} style={botonPrimario}>
                Activar notificaciones
              </button>
            )}
            {estadoPush === 'cargando' && !tiempoExcedido && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>Comprobando…</p>
            )}
          </FilaEstado>

          {tiempoExcedido && (
            <button type="button" onClick={() => location.reload()} style={{ ...botonSecundario, marginTop: 16 }}>
              <RefreshCw size={13} /> Recargar página
            </button>
          )}
        </div>
      </div>
    </>
  )
}
```

Notas de diseño (no cambiar sin razón):
- `{children}` se renderiza **siempre**, incluso bloqueado — el overlay solo cubre visualmente y captura los clicks (no se usa `pointer-events: none` en ningún punto). Esto deja que `OficialUbicacionProvider` (que envuelve a este guard desde el layout) siga con su `watchPosition` corriendo normalmente por debajo.
- `zIndex: 2147483647` (máximo entero de 32 bits) — por encima de absolutamente todo lo demás en la app, incluida la alerta crítica de la Etapa 2 (`2147483000`) y el dropdown de la campanita (`999999`). Es correcto que este guard gane sobre cualquier otra cosa.
- El botón "Activar notificaciones" reutiliza `usePushSubscription().activar()` tal cual — no se reimplementa el flujo de suscripción.
- Para ubicación, no hay botón de "Activar" en el caso "pendiente" (sin denegar) porque `OficialUbicacionProvider` ya dispara `watchPosition` (y por lo tanto el prompt del navegador) automáticamente al montar — no hace falta un gesto explícito del oficial para eso, a diferencia de push.

## Archivo a modificar: `app/oficial/layout.tsx`

```tsx
import { OficialUbicacionProvider } from '@/components/oficial/OficialUbicacionTracker'
import { GuardiaPermisosOficial } from '@/components/oficial/GuardiaPermisosOficial'

export default function OficialLayout({ children }: { children: React.ReactNode }) {
  return (
    <OficialUbicacionProvider>
      <GuardiaPermisosOficial>
        {children}
      </GuardiaPermisosOficial>
    </OficialUbicacionProvider>
  )
}
```

El guard va **dentro** del provider (necesita consumir `useUbicacionOficial()`).

## Nota — no es un bug, es redundancia aceptada

`usePushSubscription` ya se usa también en `TogglePush.tsx` (dropdown de la campanita, que sigue montado globalmente incluso dentro de `/oficial/*` vía `Header`/`SubHeader`). Con este cambio habrá **dos instancias independientes** del hook corriendo a la vez en esas rutas — cada una hace su propio `navigator.serviceWorker.ready` y su propia llamada a `estadoSuscripcion`. Es redundante pero no conflictivo (React permite múltiples usos del mismo hook sin compartir estado). No optimizar esto en este plan — sería una abstracción (contexto compartido) para un costo marginal que no lo justifica todavía.

## Criterios de aceptación

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. En `/oficial/*` sin ubicación ni push activos, el overlay cubre toda la pantalla, sin manera de cerrarlo (sin botón X, sin click-outside) — confirmar que ningún elemento de detrás es clickeable.
3. Activar ubicación (aceptar el prompt del navegador) y push (botón dentro del modal) → el overlay desaparece automáticamente en cuanto ambos quedan en estado OK, sin necesidad de recargar.
4. Simular permiso de ubicación bloqueado a nivel navegador (chrome://settings o el equivalente) → el modal muestra las instrucciones correctas y el botón "Ya lo activé, recargar" funciona después de cambiar el permiso manualmente.
5. Confirmar que rutas fuera de `/oficial/*` (dashboard, fiscalía, admin, etc.) **no** se ven afectadas por este guard — sin cambios de comportamiento ahí.
6. Prueba del colchón de seguridad: forzar (con DevTools, limitando la red o simulando) que `usePushSubscription` tarde en resolver → confirmar que a los 8s aparece igual la opción de continuar en vez de quedar la pantalla congelada indefinidamente.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 5.
