# Proxy y Flujo de Autenticación

**Propósito**: Cómo se protegen las rutas y se gestiona la autenticación.

---

## Next.js 16: `proxy.ts`, no `middleware.ts`

Este proyecto corre **Next.js 16** (`package.json` → `"next": "16.2.4"`, desde el
commit inicial `90da1ca` "Initial commit from Create Next App", 2026-04-21 — no
es una migración ni una regresión, "latest" ya era v16 el día que se scaffoldeó
el proyecto).

En Next 16, la convención `middleware.ts` está **deprecada y renombrada a
`proxy.ts`** (mismo comportamiento: archivo en la raíz del proyecto, función
exportada `proxy` en vez de `middleware`, mismo `config.matcher`). Ver
`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
→ sección "Migration to Proxy". Un archivo `middleware.ts` en esta versión
**no se ejecuta** — si algún día se ve uno junto a `proxy.ts`, es código muerto,
no el gate real.

**El gate real de toda la app es [`proxy.ts`](../../../proxy.ts)** (raíz del proyecto).

## Cómo funciona

```ts
const PUBLIC_PATHS = [
  '/login',
  '/api/auth',
  '/infracciones/',
  '/api/via/infracciones',
  '/api/via/pagos',
  '/api/via/liberaciones',
  '/api/via/ciudadano',
]
```

1. Si el `pathname` empieza con alguno de `PUBLIC_PATHS` → pasa sin más (`NextResponse.next()`).
2. Si no, hace `betterFetch` a `/api/auth/get-session` reenviando la cookie de la request para resolver la sesión de staff (`better-auth`).
3. Sin sesión → `redirect('/login?from=<pathname>')`.
4. Con sesión pero `session.user.activo === false` → `redirect('/login?error=cuenta_inactiva')`.
5. Con sesión activa → pasa.
6. `config.matcher` excluye estáticos de Next (`_next/static`, `_next/image`, extensiones de archivo comunes) — todo lo demás pasa por el proxy.

Este gate solo resuelve **sesión de staff**. La autorización fina por rol/permiso
(`tienePermiso(...)`, `verificarRolLiberaciones(...)`, etc.) se hace después,
dentro de cada página/route handler — el proxy nunca conoce roles, solo "hay
sesión de staff activa o no".

## Excepción: flujo público de ciudadano (Infracciones)

`/infracciones/[id]` (`InfraccionCiudadanoPage`) y su API asociada
(`/api/via/infracciones`, `/api/via/pagos`, `/api/via/liberaciones`,
`/api/via/ciudadano`) están en `PUBLIC_PATHS` **a propósito**: un ciudadano real
nunca tiene sesión de staff, y este flujo ya tiene su propio mecanismo de
autorización — un JWT de corta vida (`{ infraccionId }`, 1h) emitido tras
verificar el PIN de 6 dígitos de la infracción (ver `Infracciones.md` → sección
"API pública para app móvil"). Sin esta excepción en `PUBLIC_PATHS`, el proxy
redirigía a `/login` **antes** de que el PIN entrara en juego — confirmado con
`curl` contra `/infracciones/[id]` y `/api/via/infracciones/[id]` (ambos
regresaban 307 → `/login`) el 2026-07-28. Ver `Troubleshooting.md`.

**Regla al agregar rutas nuevas bajo estos prefijos**: si la ruta es
verdaderamente pública (accesible sin sesión de staff), debe validar acceso
por sí misma (`verificarAccesoCiudadano`/`verificarCookieCiudadano`, o el
mecanismo que corresponda) — el proxy ya no lo hace por ella.

## Autenticación de staff (`lib/auth.ts`)

Better-auth, sesión por cookie. Login con email/password + 2FA
(`app/login/2fa`, `app/login/setup-2fa`). El helper de autorización fina por
rol/permiso vive en `lib/permisos/core.ts` (`tienePermiso`) — cada
página/route handler de staff debe llamarlo explícitamente; el proxy no lo
hace.
