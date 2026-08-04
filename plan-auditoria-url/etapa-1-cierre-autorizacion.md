# Etapa 1 — Cerrar el hueco de autorización desde el proxy

> Lee primero [`00-contexto.md`](./00-contexto.md). Depende del CSV producido en [`etapa-0-auditoria.md`](./etapa-0-auditoria.md) — no llenes el mapa de secciones sin haber corrido ese script.

**Archivos a crear:**
- `lib/permisos/mapa-secciones.ts` (nuevo)
- `app/api/auth/secciones-permitidas/route.ts` (nuevo)

**Archivo a modificar:**
- `proxy.ts`

## Objetivo

Que ningún `page.tsx`/`route.ts` dependa *solo* del gate de sesión del proxy. En vez de migrar 106 páginas una por una a `tienePermiso`, se agrega un check **grueso** de sección en el proxy: por prefijo de ruta, ¿el rol del usuario tiene `puede_ver` en la sección correspondiente? Los checks finos por acción (crear/editar/eliminar) siguen exactamente igual, página por página, sin tocarlos.

## Paso 1 — `lib/permisos/mapa-secciones.ts`

Estructura del archivo (los valores concretos de `RUTA_PREFIX -> seccion` se completan con la columna `seccionDetectada` del CSV de la Etapa 0 — **no adivines nombres de sección**, usa exactamente los strings que ya existen en la tabla `permisos`/`permisos_plantillas`):

```ts
// Mapa de prefijo de ruta -> sección requerida para el check GRUESO del proxy.
// Generado a partir de scripts/reportes/auditoria-permisos.csv (Etapa 0) —
// los nombres de sección deben coincidir exactamente con los valores reales
// en la tabla `permisos`, no son libres.
//
// Reglas:
// - Un prefijo de ruta puede mapear a MÁS DE UNA sección válida (array) si esa
//   rama de carpetas cubre más de un módulo de permiso (ej. app/agente_911
//   tiene sub-rutas de distintas secciones — no asumas 1 prefijo = 1 sección
//   sin revisar el CSV).
// - Rutas que no calzan con ningún prefijo de este mapa NO se bloquean por
//   sección en el proxy (siguen dependiendo solo del check de sesión + lo que
//   ya tengan implementado en la propia página). Amplía el mapa con cautela,
//   agregando prefijos según el CSV, no todos de una vez sin verificar.
export const MAPA_SECCIONES: Record<string, string[]> = {
  // ejemplo (reemplazar con los valores reales del CSV):
  // '/fiscalia': ['fiscalia'],
  // '/monitorista/detenidos': ['detenidos'],
  // '/monitorista': ['monitorista', 'incidentes-camara', 'solicitudes', 'historial'],
}

export function seccionesRequeridasPara(pathname: string): string[] | null {
  // match por el prefijo MÁS ESPECÍFICO (más largo) que matchee, no el primero del objeto
  const prefijos = Object.keys(MAPA_SECCIONES).sort((a, b) => b.length - a.length)
  const prefijo = prefijos.find(p => pathname === p || pathname.startsWith(p + '/'))
  return prefijo ? MAPA_SECCIONES[prefijo] : null
}
```

## Paso 2 — `app/api/auth/secciones-permitidas/route.ts`

Endpoint Node (no Edge) que resuelve, para el usuario de la sesión actual, qué secciones puede `ver`. Reutiliza `obtenerPermisosUsuario` sin modificarlo:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerPermisosUsuario } from '@/lib/permisos/core'
import { MAPA_SECCIONES } from '@/lib/permisos/mapa-secciones'

// Corre en runtime Node (default de los route handlers) porque
// obtenerPermisosUsuario usa el driver pg de lib/db.ts, no compatible con Edge.
export async function GET(_req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ secciones: [] }, { status: 401 })

  const todasLasSecciones = [...new Set(Object.values(MAPA_SECCIONES).flat())]
  const permisos = await obtenerPermisosUsuario(session.user.id, todasLasSecciones)
  const secciones = todasLasSecciones.filter(s => permisos[s]?.puede_ver)

  return NextResponse.json({ secciones })
}
```

Nota: este endpoint devuelve la lista de secciones con `puede_ver`, no el objeto completo de permisos — es lo único que el proxy necesita para el check grueso. Si `MAPA_SECCIONES` está vacío o incompleto, esto simplemente no bloquea nada todavía (comportamiento actual sin cambios) — se activa incrementalmente a medida que se llena el mapa.

## Paso 3 — Modificar `proxy.ts`

Insertar el check **entre** la validación de `activo` y el `return NextResponse.next()` final (ver código completo en `00-contexto.md`):

```ts
  // Bloquea usuarios inactivos
  if (session.user && !(session.user as { activo?: boolean }).activo) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'cuenta_inactiva')
    return NextResponse.redirect(loginUrl)
  }

  // Check grueso de sección: ¿esta ruta requiere alguna sección específica?
  const requeridas = seccionesRequeridasPara(pathname)
  if (requeridas) {
    const { data } = await betterFetch<{ secciones: string[] }>('/api/auth/secciones-permitidas', {
      baseURL: origin,
      headers: { cookie: request.headers.get('cookie') ?? '' },
    })
    const permitidas = data?.secciones ?? []
    const tieneAcceso = requeridas.some(s => permitidas.includes(s))
    if (!tieneAcceso) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
```

Y agregar el import correspondiente:

```ts
import { seccionesRequeridasPara } from '@/lib/permisos/mapa-secciones'
```

**No cambia:** `PUBLIC_PATHS`, el matcher, ni la lógica de sesión/`activo` ya existente. Este es un paso adicional, no un reemplazo.

## Notas de diseño

- Dos llamadas HTTP en cadena (`get-session` + `secciones-permitidas`) por request de página añaden latencia. Si se vuelve un problema medible, la optimización es fusionar ambos endpoints en uno solo (`get-session` devuelve también `secciones` embebidas) — pero eso es una optimización posterior, no bloquea esta etapa. No la implementes salvo que se pida explícitamente.
- El check es **grueso** a propósito: solo `puede_ver` de sección, no acción. No reemplaza los `tienePermiso` finos que ya existen ni obliga a agregarlos donde falten para acciones de escritura — eso se decide caso por caso con el CSV de la Etapa 0, fuera de esta etapa salvo que el cliente lo priorice explícitamente.
- Completa `MAPA_SECCIONES` de forma incremental: agrega primero los prefijos de las rutas que el CSV marcó `NO` (son las que hoy dependen solo de sesión), en particular `reportes_incidentes` como caso de regresión ya conocido.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores nuevos.
- [ ] Con `MAPA_SECCIONES` poblado con al menos la sección de `reportes_incidentes`: un usuario autenticado sin esa sección que visita `/reportes_incidentes` es redirigido a `/dashboard` (regresión del incidente de 2026-07-15, ahora cerrada).
- [ ] Un usuario con `puede_ver` en la sección correspondiente sigue entrando normalmente (no hay falso positivo de bloqueo).
- [ ] Rutas fuera del mapa siguen funcionando exactamente igual que antes (sin regresión de acceso para módulos no listados todavía).
- [ ] Reejecutar `scripts/auditoria-permisos.mjs` (Etapa 0) para confirmar avance de cobertura.
