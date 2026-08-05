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
- **Páginas destino (regla de regreso).** Toda vista a la que se llega por clic en una tarjeta o por redirección desde otra vista (ej. `/oficial` → `/oficial/despachos`) debe incluir en `actions` un botón de regreso `variant="secondary"` (ej. `← Panel`) que apunte a la vista anterior. Este botón **reemplaza** la flecha `backHref`/`backLabel` del `DashboardHeader` (no usar ambos). Solo se agrega un botón `primary` si la vista tiene una acción especial (ej. `+ Registrar Nuevo`); si no existe tal acción, **no** se agrega primario. Referencia conforme: `app/dashboard/catalogos/oficiales/page.tsx` (usa `← Catálogos` secondary + `+ Registrar Oficial` primary). El hub por rol (ej. `/oficial`) no lleva botón de regreso.
- Los botones de **submit/cancelar de formularios** NO son `PageHeaderLink` (siguen usando `btnPrimario`/`btnSecundario` de `app/admin/admin-styles.ts`).
- `actions` acepta cualquier nodo (p. ej. `ImportarParqueButton`).
- `title` no debe llevar espacio final (el componente añade el espacio antes del acento).
- El contenedor y el bloque de `actions` hacen `flexWrap: wrap` de forma fija → **no se pasa prop `wrap`** (fue removida; ya no existe).

## Segmento de Página (SegmentPage) — REGLA DE DISEÑO

Toda vista con navegación por segmentos/tabs de estado (bandeja por estatus, filtros de estado de trámite, tabs de listado) usa el componente `components/partials/SegmentPage.tsx` (`SegmentPage`). **Prohibido reimplementar el patrón inline** (botones con borde + accent, barra de tabs con border-bottom, pills con track gris).

El estilo es el del **tablón de despacho** (`/agente_911/despacho`, `TablonDespacho`): cada segmento es un botón con borde `1px solid #e2e8f0`, que en activo se rellena con su `accent` (color semántico por estado) y en inactivo queda blanco con texto `#64748b`.

**Estructura:**

```tsx
<SegmentPage
  tabs={[
    { key: 'pendientes', label: 'Pendientes', icon: <AlertTriangle size={13} />, count: 4, accent: '#b45309' },
    { key: 'en_despacho', label: 'En Ruta', icon: <Shield size={13} />, count: 2, accent: '#1c3051' },
    { key: 'atendidos', label: 'Atendidos', icon: <CheckCircle2 size={13} />, count: 9, accent: '#15803d' },
  ]}
  activeKey={tab}
  onChange={setTab}
/>
```

**Tokens (no variar):**

| Elemento | Estilo |
|----------|--------|
| Contenedor | `flex; flexWrap: wrap; gap: 0; marginBottom: 24` (el wrap es **siempre**) |
| Botón | `Barlow Condensed, 700, 14px, letterSpacing 0.06em, uppercase; padding 10px 24px; border 1px solid #e2e8f0; borderBottom 2px accent cuando activo` |
| Botón activo | `background: accent; color: #fff` |
| Botón inactivo | `background: #fff; color: #64748b` |
| Icono | `size 13`, opcional, dentro del botón con `gap: 8` |
| Badge de conteo | `Inter, 700, 10px; padding 0 7px; borderRadius 8; lineHeight 18px; activo: rgba(255,255,255,.2)/#fff; inactivo: #f1f5f9/#64748b` |

**Reglas:**
- `onChange(key)` para estado local (componente cliente); alternativa `href` por tab → se renderiza `<Link>` (server-safe, navegación por query param).
- El `accent` de cada tab es su color semántico (estado/flujo); si no se define usa el default `#1f355a`.
- `count` opcional: si se omite no se dibuja el badge.
- `activeKey` es la key del segmento activo; el primer tab no es especial (a diferencia del `SegmentControl` de `/oficial`, aquí no hay track gris).
- Referencias conformes: `TablonDespacho.tsx` (origen del estilo), `Bitacora911.tsx`, `TabSolicitudes.tsx` (migrado a `SegmentPage`).

## Indicador de Pasos (StepIndicator) — REGLA DE DISEÑO

Toda vista multi-paso usa el componente `components/partials/StepIndicator.tsx` (`StepIndicator`). **Prohibido reimplementar el patrón inline.**

**Prohibido usar steppers**: círculos numerados con conectores, dots de progreso con etiquetas (`step-dot`), barras segmentadas por paso o cualquier indicador que liste todos los pasos en fila. En móvil estos desbordan y no escalan. La referencia es el indicador que reemplazó al stepper de `FormularioRecorrido`.

**Estructura:**

```tsx
<StepIndicator paso={step + 1} total={STEPS.length} nombre={STEPS[step]} />
```

`paso` es 1-based (para un array `STEPS` indexado en 0, `paso={step + 1}`; para `step` ya 1-based, `paso={step}`).

**Tokens (no variar):**

| Elemento | Estilo |
|----------|--------|
| "Paso N de M" | `Barlow Condensed, 800, 28px, letterSpacing 0.04em, uppercase, #1f355a` |
| Nombre del paso | `JetBrains Mono, 600, 11px, letterSpacing 0.18em, uppercase, #94a3b8` |
| Contenedor fila | `flex; alignItems: baseline; gap: 12; flexWrap: wrap` |
| Barra de progreso | `height 2px, borderRadius 1, track #e2e8f0, fill #1f355a, width = (paso/total)*100%, transition width .25s` |
| Contenedor total | `marginBottom: 32` |

**Reglas:**
- Sin hooks (SSR-safe): el indicador solo renderiza las props.
- Referencias conformes: `components/oficial/FormularioRecorrido.tsx` (STEPS de 7), `components/analisis/formAnalisis.tsx` (STEPS de 6, migrado desde `RegistroDetenidoStepper`).
- El componente `StepIndicator` de `components/partials/` es el único permitido; no crear variantes locales con el mismo nombre.

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
