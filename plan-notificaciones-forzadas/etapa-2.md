# Etapa 2 — Alerta in-app de pantalla completa + contador en el título de pestaña

No depende de la Etapa 1. Leer primero `00-contexto.md`.

Hoy `CampanillaNotificaciones.tsx` poll ea cada 30s (`INTERVALO_MS`) contra `/api/notificaciones/contador`, que solo devuelve el conteo. Esta etapa extiende esa misma llamada (no agrega un segundo polling) para traer también la notificación crítica no leída más reciente, y con eso mostrar un banner de ancho completo que no depende de que el usuario tenga el dropdown abierto.

## 1. Archivo a modificar: `lib/notificaciones/repository.ts`

Agregar, junto a `contarNoLeidas` (reusa el mismo `SELECT_USUARIO` de arriba del archivo):

```ts
/** Para la alerta de pantalla completa: la crítica no leída más reciente, o null. */
export async function criticaMasRecienteSinLeer(
  userId: string,
  rolId: number | null,
): Promise<Notificacion | null> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_USUARIO}
       AND l.user_id IS NULL AND n.severidad = 'critico'
     ORDER BY n.creado_en DESC
     LIMIT 1`,
    [userId, rolId],
  )
  return result.rows[0] ? rowToNotificacion(result.rows[0]) : null
}
```

## 2. Archivo a modificar: `app/api/notificaciones/contador/route.ts`

```ts
import { NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { contarNoLeidas, criticaMasRecienteSinLeer } from '@/lib/notificaciones/repository'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const usuario = await getUserWithRole(session.user.id)
  const rolId = usuario?.rolId ?? null

  const [noLeidas, critica] = await Promise.all([
    contarNoLeidas(session.user.id, rolId),
    criticaMasRecienteSinLeer(session.user.id, rolId),
  ])

  return NextResponse.json({ noLeidas, critica })
}
```

Sigue siendo una sola consulta indexada adicional, barata, y se ejecuta en el mismo intervalo que ya corría — no se agrega un nuevo ciclo de polling.

## 3. Archivo nuevo: `components/notificaciones/AlertaCriticaBanner.tsx`

```tsx
'use client'

import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Siren, X } from 'lucide-react'

interface CriticaVisible {
  id: string
  titulo: string
  mensaje: string
  href: string | null
}

interface Props {
  critica: CriticaVisible
  onVer: () => void
  onDescartar: () => void
}

export function AlertaCriticaBanner({ critica, onVer, onDescartar }: Props) {
  const router = useRouter()

  function ver() {
    onVer()
    if (critica.href) router.push(critica.href)
  }

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2147483000,
      background: '#dc2626', color: '#fff',
      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    }}>
      <Siren size={20} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85 }}>
          Alerta crítica
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, fontWeight: 600 }}>
          {critica.titulo}
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, opacity: 0.9 }}>
          {critica.mensaje}
        </div>
      </div>
      <button type="button" onClick={ver} style={{
        flexShrink: 0, background: '#fff', color: '#dc2626', border: 'none',
        padding: '7px 14px', borderRadius: 3, cursor: 'pointer',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700,
      }}>
        Ver
      </button>
      <button type="button" onClick={onDescartar} aria-label="Descartar" style={{
        flexShrink: 0, background: 'transparent', border: 'none', color: '#fff', opacity: 0.85, cursor: 'pointer',
      }}>
        <X size={18} />
      </button>
    </div>,
    document.body,
  )
}
```

`onDescartar` solo oculta el banner (no marca leída la notificación) — el contador de la campanita sigue reflejando que hay algo pendiente; "Ver" sí marca leída y navega, mismo comportamiento que hacer click en un ítem del dropdown existente.

`zIndex: 2147483000` — deliberadamente por encima del dropdown de la campanita (`999999`), para que la alerta crítica nunca quede tapada por él.

## 4. Archivo a modificar: `components/notificaciones/CampanillaNotificaciones.tsx`

Import nuevo:

```tsx
import { AlertaCriticaBanner } from './AlertaCriticaBanner'
```

Nuevo estado + ref, junto a los existentes (`noLeidas`, `items`, etc.):

```tsx
const [alertaCritica, setAlertaCritica] = useState<Notificacion | null>(null)
const criticaVistaRef = useRef<string | null>(null)
```

Sonido distinto para crítico (junto a `sonarAlerta`, mismo archivo, arriba del componente):

```tsx
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
```

Modificar `refrescarContador` para leer el campo `critica` de la respuesta y actualizar el título de la pestaña:

```tsx
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

    if (critica && critica.id !== criticaVistaRef.current) {
      criticaVistaRef.current = critica.id
      setAlertaCritica(critica)
      sonarAlertaCritica()
    }
  } catch {
    // Sin red: se reintenta en el siguiente intervalo.
  }
}, [])
```

A diferencia del sonido normal (que se calla en la primera carga con `previoRef.current !== 0`), la alerta crítica **sí se muestra desde la primera carga** si ya hay una crítica sin leer pendiente — es justo el caso que se quiere resolver (que no pase desapercibida aunque el usuario acabe de entrar).

Renderizar el banner al final del JSX del componente, fuera del `return` del dropdown pero dentro del componente (no depende de `abierto`):

```tsx
{alertaCritica && (
  <AlertaCriticaBanner
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
```

No tocar la lógica del dropdown existente (`alternar`, `cargarLista`, `abrirNotificacion`, `marcarTodas`) — todo esto es aditivo.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Al haber una notificación crítica sin leer, el banner rojo aparece en la parte superior de **cualquier** página de la app (no solo con el dropdown abierto), con sonido distinto al normal.
3. "Ver" navega al `href` de la notificación y la marca como leída (el conteo de la campanita baja).
4. "Descartar" oculta el banner sin cambiar el conteo de no leídas.
5. El título de la pestaña del navegador muestra `(N)` cuando hay notificaciones sin leer, y vuelve al título normal cuando `N` llega a 0.
6. Notificaciones `info`/`aviso` no disparan el banner ni el sonido crítico — solo `severidad: 'critico'`.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 3.
