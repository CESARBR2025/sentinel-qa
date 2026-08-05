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

## Diseño visual (UI) — fuente única en DESIGN.md

**Toda la información visual (tokens, tipografía, componentes, layout, responsive, do's/don'ts) vive en el archivo raíz `DESIGN.md`.** Esta es la fuente de verdad única para diseño. Si el código difiere de `DESIGN.md`, el código se corrige.

Las REGLAs de UI antes documentadas aquí (Page Assembly Pattern, PageHeader, SegmentPage, StepIndicator, responsive) **se movieron a `DESIGN.md`** (§4 Component Stylings, §5 Layout, §8 Responsive). **Prohibido duplicar tokens o reglas visuales en este archivo.**

Para trabajar UI: leer `DESIGN.md` completo antes de codificar. Este archivo solo conserva las convenciones de código y vocabulario de dominio.

Resumen de componentes de diseño (detalles en `DESIGN.md`):
- **PageHeader** (`components/partials/PageHeader.tsx`): toda vista usa este componente. Incluye la **regla de regreso** (botón `secondary` `← Panel` en vistas destino, reemplaza `backHref` del `DashboardHeader`).
- **SegmentPage** (`components/partials/SegmentPage.tsx`): navegación por segmentos/tabs de estado estilo tablón de despacho.
- **StepIndicator** (`components/partials/StepIndicator.tsx`): indicador multi-paso. **Prohibido steppers.**
- **`.card-o`**: tarjetas hub con esquinas animadas (referencia `app/oficial/page.tsx`).
- Acentos por módulo: default `#1f355a` · catálogos/patrullas `#c0223a` · fiscalía `#7c3aed`.

## Vocabulario de estados del incidente (C4/CNI)

Las etiquetas de estado mostradas en la UI usan el vocabulario de la **bóveda canónica C4/CNI** (flu-001, form-001, form-003), NO los valores internos de la BD. Los valores internos de `incidentes.estatus` **no cambian**; solo se estandariza su presentación.

**Fuente única:** `lib/911/estatus-c4.ts` (`ESTATUS_C4`, `labelEstatus()`, `tooltipEstatus()`). Prohibido hardcodear etiquetas de estado en la UI (ej. `SIN DESPACHAR`, `EN DESPACHO`, `ATENDIDO`, `C/DETENCIÓN`) o renderizar `estatus.replace('_',' ').toUpperCase()` — usar siempre `labelEstatus(estatus)`.

| Interno (BD) | Etiqueta C4 | Tooltip |
|---|---|---|
| `sin_despachar` | **Nuevo** | Esperando a que una unidad tome el caso |
| `en_despacho` | **En Ruta** | Una unidad fue asignada y se dirige al lugar |
| `en_sitio` | **En Sitio** | La unidad llegó y está atendiendo la emergencia |
| `atendido` | **Cerrado** | Incidente resuelto y servicio concluido |
| `cerrado_detencion` | **Cerrado · Detención** | Caso cerrado con una detención realizada |

**Reglas:**
- `labelEstatus(estatus, uppercase=true)` devuelve la etiqueta C4 (por defecto en mayúsculas para badges; `uppercase=false` para textos/filtros).
- Los colores de badges y el agrupamiento de tabs (Pendientes/En Ruta/Cerrados) son decisión de cada vista; el texto siempre viene del mapa central.
- Para agregar un estado nuevo: actualizar `ESTATUS_C4` y este mapeo (no inventar etiquetas sueltas).

## Responsive (REGLA)

Toda vista debe funcionar en **móvil ≤720px, tablet 721–1200px y desktop >1200px**. Los breakpoints, clases CSS (`.pad-pagina`, `.pad-dashboard`, `.grid-2/3`, `.cat-cards-grid`, `.tabla-wrap`, `.panel-lateral`) y reglas de tablas/formularios/modales están en **`DESIGN.md` §5 y §8** (fuente única). **No duplicar esas reglas aquí.**

**Reglas de nivel código (hooks):**
- Componentes cliente: usar `useResponsive()` de `hooks/useResponsive.ts` → `{ esMovil, esTablet, esDesktop }` (SSR-safe). `useMediaQuery(query)` para casos puntuales.
- Componentes servidor: sin hooks → usar las clases CSS de `DESIGN.md`.

## Key architectural decisions

1. **No Drizzle in app code** — raw SQL only, keeps control over queries and avoids ORM complexity
2. **camelCase in TypeScript, snake_case in DB** — mapper layer handles conversion, never leaks DB naming to components
3. **Pages never query DB directly** — all data flows through lib/ modules, making testing and auditing possible
4. **Server actions as the mutation API** — mutations go through 'use server' actions, reads go directly to pages from server components
5. **Functional over class-based** — all repositories and services are plain functions (except external API wrappers)
