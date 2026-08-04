# Contexto — leer antes de tocar cualquier etapa

## El pedido del cliente vs. el riesgo real

El cliente pidió: "que la URL cuando navego entre las pages del proyecto esté oculta o encriptada; que no muestre las rutas entre carpetas que se navegan", presentándolo como un problema de seguridad.

Diagnóstico verificado sobre el código real (no sobre la bóveda, que en la parte de auth estaba desactualizada):

- El proyecto es Next.js 16 (App Router). En Next 16 `middleware.ts` se renombró a `proxy.ts` — es el único gate global hoy.
- `proxy.ts` **solo verifica que exista sesión activa** (`session.user.activo`). No conoce roles ni permisos de sección.
- La autorización fina vive dispersa en cada `page.tsx`/`route.ts`, vía `tienePermiso(usuarioId, seccion, accion)` de `lib/permisos/core.ts`. **Solo 42 de 148 `page.tsx` la usan.** El resto solo depende de "¿hay sesión?" — cualquier usuario autenticado, de cualquier rol, entra por URL directa.
- Esto ya se explotó: `boveda/🗺 Roadmap/Troubleshooting.md` documenta que el 2026-07-15 `app/reportes_incidentes/page.tsx` y `app/api/reportes-incidentes/exportar/route.ts` carecían del check de permiso de sección.
- Las URLs de recursos exponen IDs numéricos secuenciales: `/fiscalia/expedientes/${id}`, `/monitorista/detenidos/${id}`, `?folio=`, `?id=`. Existe un precedente propio de token opaco — `app/api/expediente/vista/[token]/route.ts` — pero es de un solo uso (vista efímera de un documento), no sirve tal cual para una URL de recurso que se visita repetidamente.
- `app/dashboard/module-cards.tsx` es un array estático client-side que solo decide qué tarjetas se muestran — ocultar un botón en el menú no bloquea el acceso por URL directa a la página real.
- `next.config.ts` no tiene headers de seguridad, rewrites ni redirects.

**Conclusión que rige todo este plan:** "ocultar/encriptar la URL" es seguridad por oscuridad. El fix real es cerrar el hueco de autorización (Etapa 1) y volver no adivinables los IDs de recursos sensibles (Etapa 2). La parte cosmética que el cliente pidió literalmente (Etapa 3) es opcional y explícitamente no sustituye lo anterior.

## `proxy.ts` (raíz del proyecto) — código real completo

```ts
import { betterFetch } from '@better-fetch/fetch'
import type { Session } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/login',
  '/api/auth',
  // Página de caída de conexión: la sirve el service worker desde caché,
  // sin sesión (se muestra sin red).
  '/offline',
  // Flujo público de ciudadano (infracciones): protegido por su propio PIN/JWT
  // (verificarCookieCiudadano / verificarAccesoCiudadano), no por sesión de staff.
  '/infracciones/',
  '/api/via/infracciones',
  '/api/via/pagos',
  '/api/via/liberaciones',
  '/api/via/ciudadano',
]

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublic(pathname)) return NextResponse.next()

  const origin = request.nextUrl.origin.replace(/^https(?=:\/\/localhost)/, 'http')

  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL:  origin,
    headers:  { cookie: request.headers.get('cookie') ?? '' },
  })

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Bloquea usuarios inactivos
  if (session.user && !(session.user as { activo?: boolean }).activo) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'cuenta_inactiva')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Excluye: archivos Next internos, imágenes optimizadas, archivos estáticos con extensión
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|json|woff2?|ttf|otf|css|js|map)$).*)'],
}
```

La Etapa 1 agrega un paso nuevo **entre** el check de `activo` y el `return NextResponse.next()` final — sin tocar la estructura de `PUBLIC_PATHS` ni el matcher.

## `lib/permisos/core.ts` — piezas relevantes

```ts
export type Accion = 'ver' | 'crear' | 'editar' | 'eliminar'

export interface PermisoSeccion {
  puede_ver: boolean
  puede_crear: boolean
  puede_editar: boolean
  puede_eliminar: boolean
}

// Sin fila para un usuario+sección = SIN acceso a esa sección. Cada rol solo tiene
// fila para las secciones de su propio módulo — deny-by-default es lo que mantiene
// aislados a los roles entre sí. roles.es_admin es la única excepción.
export async function obtenerPermisosUsuario<S extends string>(usuarioId: string, secciones: readonly S[]): Promise<Record<S, PermisoSeccion>> {
  const usuario = await getUserWithRole(usuarioId)
  if (usuario?.esAdmin) return mapaBase(secciones, PERMISO_COMPLETO)

  const r = await query<Record<string, unknown>>(
    `SELECT seccion, puede_ver, puede_crear, puede_editar, puede_eliminar FROM permisos WHERE usuario_id = $1`,
    [usuarioId],
  )
  // ... arma el mapa seccion -> PermisoSeccion
}

export async function tienePermiso(usuarioId: string, seccion: string, accion: Accion): Promise<boolean> {
  const permisos = await obtenerPermisosUsuario(usuarioId, [seccion])
  const p = permisos[seccion]
  if (accion === 'ver') return p.puede_ver
  // ...
}
```

Importante: `obtenerPermisosUsuario` usa `query()` de `lib/db.ts`, que es el driver `pg` (TCP nativo a Postgres) — **no es compatible con Edge runtime**. Por eso la Etapa 1 no llama esto directamente desde `proxy.ts`; lo envuelve en un endpoint API que corre en Node.

## `lib/auth.ts` — better-auth

```ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema, usePlural: true }),
  emailAndPassword: { enabled: true, requireEmailVerification: false, minPasswordLength: 8 },
  session: {
    expiresIn: 60 * 60 * 8,   // 8 horas
    updateAge: 60 * 60,        // refresca cada hora
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  user: {
    additionalFields: {
      apellido: { type: 'string', required: false, input: true },
      rolId:    { type: 'number', required: false, input: false },
      activo:   { type: 'boolean', required: false, defaultValue: true, input: false },
    },
  },
  plugins: [twoFactor({ issuer: 'Seguridad Pública SJR', totpOptions: { digits: 6, period: 30 } })],
})
```

`rolId` y `activo` ya viajan en `session.user` gracias a `additionalFields` — pero son campos del usuario, no permisos (que están en la tabla `permisos`, separada, y cambian independientemente del usuario). Por eso NO se debe intentar meter los permisos ahí — se resuelven en vivo en el endpoint de la Etapa 1, no cacheados en el usuario.

## `app/api/expediente/vista/[token]/route.ts` — precedente de token opaco (NO reusar tal cual)

```ts
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { token } = await params
  const ref = consumeViewToken(token)   // <- consume: un solo uso, se invalida al leerlo
  if (!ref) return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
  // ...
}
```

`consumeViewToken` es de un solo uso — pensado para "generar un link de descarga temporal". Las URLs de recursos (expediente, detenido, denuncia) se abren y se vuelven a abrir muchas veces por el mismo usuario — la Etapa 2 necesita un token **persistente**, no consumible, resuelto por lookup en vez de por consumo.
