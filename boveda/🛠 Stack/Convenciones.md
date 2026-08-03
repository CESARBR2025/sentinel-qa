# Convenciones

**Propósito**: Patrones y reglas de código del proyecto.

---

## No Drizzle — raw pg only (except better-auth)

Never use Drizzle ORM (`drizzle-orm`, `db.insert`, `db.select`, etc.) in application code. All database access is via raw SQL with the `query` export from `@/lib/db`. The only exception is `lib/auth.ts` which uses Drizzle internally for `better-auth`. The `@/lib/db/index.ts` drizzle instance is used exclusively by better-auth and must never be imported in application code.

## Layered Domain Pattern

Every domain module follows a strict layered architecture in `lib/<module>/`:

```
lib/<module>/
├── types.ts      — TypeScript interfaces (camelCase properties)
├── mapper.ts     — rowTo* functions convert Record<string,unknown> → typed objects
├── repository.ts — raw SQL queries, returns typed objects via mappers
├── service.ts    — business logic / orchestration (optional, often thin)
└── actions.ts    — server actions (mutations only, reads go direct to pages)
```

### Rules
- **Page files (`app/**/page.tsx`)** must NOT import `query` from `@/lib/db` directly. All DB reads go through a `lib/<module>/repository.ts` or `lib/<module>/service.ts`.
- **Mapper functions** always accept `Record<string, unknown>` (the raw pg row) and return a typed interface with **camelCase** properties. DB columns are **snake_case**, mapper converts them.
- **Repository functions** never import mappers from other domains. Cross-domain data composition happens in service layer.
- **Service functions** re-export repository functions (thin pass-through) unless business logic is needed.

## camelCase in TS, snake_case in DB

TypeScript types use camelCase properties. Mapper functions (`rowTo*`) convert snake_case DB columns to camelCase. JSX components reference camelCase properties only.

## Never import `query` in page/layout/api files

- **Never** import `query` from `@/lib/db` in `app/**/page.tsx`
- **Never** import `query` from `@/lib/db` in `app/**/layout.tsx`
- **Never** import `query` from `@/lib/db` in `app/api/**/route.ts`
- **Never** import `db` from `@/lib/db/index` (that's for better-auth only)
- **Never** import from `@/lib/db/schema` in app code (only used by better-auth in `lib/auth.ts`)
- For role checks: use `getUserWithRole()` from `@/lib/auth/helpers`
- For domain data: use the corresponding `lib/<module>/service.ts` or `repository.ts`

## Error handling — centralized

All server actions use `tryAction` / `tryActionRaw` from `@/lib/error-handler`:

```ts
import { tryAction, tryActionRaw, ValidationError, NotFoundError } from '@/lib/error-handler'

// For data-fetching actions (returns { success, data } | { success, error }):
export async function obtenerAlgo(id: string) {
  return tryAction(async () => {
    const data = await repositoryFn(id)
    if (!data) throw new NotFoundError('Algo no encontrado')
    return data
  })
}

// For mutation actions (re-throws, caller must handle):
export async function crearAlgo(formData: FormData) {
  return tryActionRaw(async () => {
    const val = formData.get('campo')
    if (!val) throw new ValidationError('Campo requerido')
    await repositoryInsert(val)
    revalidatePath('/ruta')
  })
}
```

Error classes: `AppError`, `NotFoundError` (404), `ValidationError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `ConflictError` (409).

API routes should use `apiHandler`, `apiSuccess`, `apiError` from the same module.

## Role checks with `getUserWithRole()`

The standard way to get the current user's role:

```ts
import { getUserWithRole } from '@/lib/auth/helpers'

const userWithRole = await getUserWithRole(session.user.id)
// userWithRole.rolNombre === 'Administrador'
// userWithRole.rolId === 1
```

This replaces inline `query(...)` with `LEFT JOIN roles`.

## Mapper conventions

- `toStr(val)` — converts any value to `string | null` (Dates → ISO string)
- `toNum(val)` — converts to `number | null` (NaN → null)
- `toBool(val)` — converts to `boolean` (string `"true"` → `true`)
- All mappers accept `Record<string, unknown>` and return typed interfaces
- Mapper functions are pure — no side effects, no async

## Page Assembly Pattern (UI)

Toda page/view se arma con el patrón de secciones, sin tamaños fijos:

1. **Contenedor de página**: `display: flex; flexDirection: column; width: 100%; minHeight: 100vh`
2. **Sección `<header>`**: `width: 100%`, flex column — navegación + título de la vista
3. **Sección `<main>` (body)**: `flex: 1; width: 100%`, flex column — contenido
4. **Interior**: subdividir con flex (`flex: 1`, `gap`) para layout dinámico
5. **Prohibido**: `maxWidth`/anchos o altos fijos en contenedores de página; solo paddings internos de espaciado
6. **Prohibido**: anidar componentes que rendericen su propio layout completo (minHeight 100vh + `<style>`) dentro de otra vista — el armado header+body se hace una sola vez en la página

## Encabezado de Página (PageHeader) — REGLA DE DISEÑO

Toda vista usa el componente `components/partials/PageHeader.tsx` (`PageHeader` + `PageHeaderLink`). **Prohibido reimplementar el patrón inline** (título/subtítulo/botones).

**Estructura:** título + subtítulo a la izquierda; botones de acción a la derecha.

```tsx
<PageHeader
  title="Gestión de"
  accent="Oficiales"                 // palabra resaltada en accentColor
  accentColor="#1f355a"              // default; catálogos/patrullas usa #c0223a
  subtitle="8 oficiales registrados" // texto opcional en mono
  actions={<>
    <PageHeaderLink href="/dashboard/catalogos" variant="secondary">← Catálogos</PageHeaderLink>
    <PageHeaderLink href="/dashboard/catalogos/oficiales/nuevo">+ Registrar Oficial</PageHeaderLink>
  </>}
/>
```

**Tokens (no variar):**

| Elemento | Estilo |
|----------|--------|
| Contenedor | `flex; justifyContent: space-between; alignItems: flex-end; marginBottom: 32; flexWrap: wrap; gap: 16` (el wrap es **siempre**, no depende de prop) |
| Título `<h2>` | `Barlow Condensed, 800, 32px, letterSpacing 0.06em, uppercase, #0f172a`; acento en `accentColor` |
| Subtítulo `<p>` | `JetBrains Mono, 10px, letterSpacing 0.15em, uppercase, #64748b` |
| Botón primario | `Barlow Condensed, 700, 13px, 0.15em, uppercase; padding 10px 24px; bg #0f172a; color #fff; sin borde` |
| Botón secundario | mismo texto; `padding 10px 20px; bg #f1f5f9; color #475569; border 1px solid #e2e8f0` |

**Reglas:**
- Los botones de navegación del header usan `PageHeaderLink` (variant `primary`/`secondary`).
- Los botones de **submit/cancelar de formularios** NO son `PageHeaderLink` (siguen usando `btnPrimario`/`btnSecundario` de `app/admin/admin-styles.ts`).
- `actions` acepta cualquier nodo (p. ej. `ImportarParqueButton`).
- `title` no debe llevar espacio final (el componente añade el espacio antes del acento).
- El contenedor y el bloque de `actions` hacen `flexWrap: wrap` de forma fija → **no se pasa prop `wrap`** (fue removida; ya no existe).

## Responsive (REGLA)

Toda vista debe funcionar en **móvil ≤720px, tablet 721–1200px y desktop >1200px** (breakpoints alineados con `.fk-grid` y `.dashboard-grid`).

**Hooks:**
- Componentes cliente: usar `useResponsive()` de `hooks/useResponsive.ts` → `{ esMovil, esTablet, esDesktop }` (SSR-safe). `useMediaQuery(query)` para casos puntuales.
- Componentes servidor: no hay hooks → usar las clases CSS de abajo.

**Utilitarios CSS (en `app/globals.css`) — usar en vez de estilos inline:**
| Clase | Uso |
|-------|-----|
| `.pad-pagina` / `.pad-dashboard` | Padding del contenedor de página por nivel (desktop 48/64 · tablet 32/48 · móvil 20/16) |
| `.panel-lateral` | Panel sticky del dashboard (offset según header; estático en móvil) |
| `.grid-2` / `.grid-3` | Grids de formularios: 2/3 columnas → 1 en móvil |
| `.cat-cards-grid` | Grid de tarjetas de índice → 1 col en móvil |
| `.tabla-wrap` | Envolver tablas → `overflow-x: auto` (scroll horizontal en móvil) |

**Reglas:**
1. **Tablas**: envolver siempre en contenedor con `overflow-x: auto` (`.tabla-wrap` o tailwind `overflow-x-auto`). Nunca `overflow: hidden` en el contenedor de una tabla (recorta columnas en móvil). Dar `minWidth` a la `<table>` para que el scroll sea horizontal y no se comprima.
2. **Formularios**: usar `.grid-2`/`.grid-3` (nunca `gridTemplateColumns: '1fr 1fr'` inline) y `flexWrap: 'wrap'` en las filas de botones de acción.
3. **Encabezados/headers**: `PageHeader` ya hace wrap; `DashboardHeader`/`SubHeader`/`SignOutButton` ya son responsivos por nivel (no reimplementar).
4. **Modales**: mantener `maxWidth: 90vw/100%` + `maxHeight: 90vh` + `overflow: auto`; botones con `flexWrap: 'wrap'`.
5. **Prohibido** contenedores con ancho fijo que no quepan en 375px sin opción de scroll (ver regla de Page Assembly).

## Key architectural decisions

1. **No Drizzle in app code** — raw SQL only, keeps control over queries and avoids ORM complexity
2. **camelCase in TypeScript, snake_case in DB** — mapper layer handles conversion, never leaks DB naming to components
3. **Pages never query DB directly** — all data flows through lib/ modules, making testing and auditing possible
4. **Server actions as the mutation API** — mutations go through 'use server' actions, reads go directly to pages from server components
5. **Functional over class-based** — all repositories and services are plain functions (except external API wrappers)
