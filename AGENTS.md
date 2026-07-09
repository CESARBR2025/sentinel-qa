<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# No Drizzle — raw pg only (except better-auth)

Never use Drizzle ORM (`drizzle-orm`, `db.insert`, `db.select`, etc.) in application code. All database access is via raw SQL with the `query` export from `@/lib/db`. The only exception is `lib/auth.ts` which uses Drizzle internally for `better-auth`. The `@/lib/db/index.ts` drizzle instance is used exclusively by better-auth and must never be imported in application code.

# Architecture — Layered Domain Pattern

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

# Existing Modules — Compliance Status

| Module | types.ts | mapper.ts | repository.ts | service.ts | actions.ts | Status |
|--------|----------|-----------|---------------|------------|------------|--------|
| `lib/auth/helpers.ts` | `UserWithRole` | `rowToUserWithRole` | `getUserWithRole` | — | — | ✅ |
| `lib/911/` | ✅ | ✅ | ✅ | ✅ | — (reads only) | **GREEN** |
| `lib/admin/` | ✅ | ✅ | ✅ | ❌ | ✅ | **GREEN** |
| `lib/admin-transito/` | ✅ | ✅ | ✅ | ❌ | ✅ | **GREEN** |
| `lib/auxiliar/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/camara/` | ✅ | ✅ | ✅ | ✅ | — | **GREEN** |
| `lib/corralon/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/d1/` | ✅ | ✅ | ✅ | ✅ | — | **GREEN** |
| `lib/incidentes/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/fiscalia/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/flota/` | ✅ | ✅ | ✅ | ✅ | — | **GREEN** |
| `lib/monitorista/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/notificaciones/` | ✅ | ✅ | ✅ | — | ✅ | **GREEN** |
| `lib/oficial/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/prevencion/` | ✅ | ✅ | ✅ | ❌ | ✅ | **GREEN** |
| `lib/reportes/` | ✅ | ✅ | ✅ | ❌ | — | **GREEN** |
| `lib/reportes-operativos/` | ✅ | ✅ | ✅ | ✅ | — | **GREEN** |
| `lib/reportes-sin-d1/` | ✅ | ✅ | ✅ | ✅ | — | **GREEN** |
| `lib/reportes-sin-novedad/` | ✅ | ✅ | ✅ | ✅ | — | **GREEN** |
| `lib/reportes-incidentes/` | ✅ | ✅ | ✅ | ✅ | — | **GREEN** |
| `lib/agente_juzgado/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/agente_liberaciones/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/agente_infracciones/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/rol-servicios/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |

### Current totals
- **GREEN**: 23 modules
- **YELLOW**: 0 modules
- **RED**: 0 modules

### Auth helper (`lib/auth/helpers.ts`)
The standard way to get the current user's role. Replaces the pattern of writing inline `query(...)` with `LEFT JOIN roles`:

```ts
import { getUserWithRole } from '@/lib/auth/helpers'

const userWithRole = await getUserWithRole(session.user.id)
// userWithRole.rolNombre === 'Administrador'
// userWithRole.rolId === 1
```

### Module example — `lib/911/`

**types.ts** — interfaces with camelCase:
```ts
export interface IncidenteDetalle {
  id: string
  folio: string
  tipoNombre: string | null  // camelCase, mapper reads tipo_nombre from DB
  fechaHoraInicio: string
}
```

**mapper.ts** — reads snake_case DB columns, returns camelCase interface:
```ts
function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

export function rowToIncidenteDetalle(row: Record<string, unknown>): IncidenteDetalle {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    tipoNombre: toStr(row.tipo_nombre),  // snake_case → camelCase
    fechaHoraInicio: toStr(row.fecha_hora_inicio) ?? '',
  }
}
```

**repository.ts** — SQL + mapper:
```ts
import { query } from '@/lib/db'
import { rowToIncidenteDetalle } from './mapper'

export async function obtenerIncidente(id: string): Promise<IncidenteDetalle | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT i.*, cti.nombre AS tipo_nombre
     FROM incidentes i
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     WHERE i.id = $1 LIMIT 1`,
    [id],
  )
  return result.rows.length ? rowToIncidenteDetalle(result.rows[0]) : null
}
```

### Mapper conventions
- `toStr(val)` — converts any value to `string | null` (Dates → ISO string)
- `toNum(val)` — converts to `number | null` (NaN → null)
- `toBool(val)` — converts to `boolean` (string `"true"` → `true`)
- All mappers accept `Record<string, unknown>` and return typed interfaces
- Mapper functions are pure — no side effects, no async

# Error handling — centralized

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

# Page file rules
- **Never** import `query` from `@/lib/db` in `app/**/page.tsx`
- **Never** import `query` from `@/lib/db` in `app/**/layout.tsx`
- **Never** import `query` from `@/lib/db` in `app/api/**/route.ts`
- **Never** import `db` from `@/lib/db/index` (that's for better-auth only)
- **Never** import from `@/lib/db/schema` in app code (only used by better-auth in `lib/auth.ts`)
- For role checks: use `getUserWithRole()` from `@/lib/auth/helpers`
- For domain data: use the corresponding `lib/<module>/service.ts` or `repository.ts`
- JSX references must match the **camelCase** properties from the types/interfaces, NOT the snake_case DB columns

# Architectural compliance — Full Compliance
All 23 modules are **GREEN**. Every module follows the standard layered pattern:
- `types.ts` — camelCase interfaces
- `mapper.ts` — snake_case → camelCase conversion
- `repository.ts` — raw SQL via `query()`, returns typed objects via mappers
- `service.ts` — orchestration / pass-through (optional)
- `actions.ts` — server actions (optional)

# Refactoring History

This project underwent a complete architectural overhaul. Key milestones:

## Phase 1 — Drizzle elimination
- Migrated ALL `lib/` server actions from Drizzle ORM to raw SQL via `query()`
- Migrated ALL `app/api/` routes (58+ files) from Drizzle to raw SQL
- Reduced `lib/db/schema.ts` to only 5 better-auth tables
- Removed `drizzle-kit`, kept `drizzle-orm` (required by better-auth)
- Deleted auto-generated `drizzle/` directory

## Phase 2 — Page files refactoring
- Removed inline `query()` calls from ALL `app/**/page.tsx` (52 files)
- Removed inline role-check queries → centralized `getUserWithRole()`
- Every page now reads data through `lib/<module>/repository.ts` or `service.ts`

## Phase 3 — API routes refactoring
- Removed inline `query()` from ALL `app/api/**/route.ts` (58+ files)
- Every route now delegates to repository/actions modules

## Phase 4 — Layout files refactoring
- Removed inline `query()` from ALL `app/**/layout.tsx` (3 files)

## Phase 5 — Architecture standardization
- Created types.ts + mapper.ts for all RED modules (camara, d1, monitorista, reportes*, prevencion, rol-servicios)
- Fixed all `any` types in repository functions
- Consolidated duplicated directories (`lib/rol_servicios/` → `lib/rol-servicios/`)
- Converted class-based repos to functional (`lib/flota/`)
- Extracted inline mappers to dedicated files (`lib/corralon/`)
- Fixed dead mapper code (`lib/admin-transito/`)

## Phase 6 — Error handling
- Created `lib/error-handler.ts` with AppError classes + tryAction/tryActionRaw wrappers
- Updated all 14 `actions.ts` files to use structured error handling
- Replaced all `throw new Error(...)` with typed AppError subclasses

# Key architectural decisions
1. **No Drizzle in app code** — raw SQL only, keeps control over queries and avoids ORM complexity
2. **camelCase in TypeScript, snake_case in DB** — mapper layer handles conversion, never leaks DB naming to components
3. **Pages never query DB directly** — all data flows through lib/ modules, making testing and auditing possible
4. **Server actions as the mutation API** — mutations go through 'use server' actions, reads go directly to pages from server components
5. **Functional over class-based** — all repositories and services are plain functions (except external API wrappers)
