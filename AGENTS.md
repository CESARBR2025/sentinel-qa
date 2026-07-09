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
| `lib/admin/` | ✅ | ✅ | ✅ | ❌ | ⚠️ (inline query) | **YELLOW** |
| `lib/admin-transito/` | ✅ | ✅ | ⚠️ (no mapper use) | ❌ | ❌ (inline query) | **RED** |
| `lib/auxiliar/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/camara/` | ❌ | ❌ | ❌ (raw) | ⚠️ (inline map) | — | **RED** |
| `lib/corralon/` | ✅ | ⚠️ (inline in service) | ✅ | ✅ | ✅ | **GREEN** |
| `lib/d1/` | ❌ | ❌ | ⚠️ | ⚠️ (inline map) | — | **RED** |
| `lib/incidentes/` | ✅ | ✅ | ✅ | ✅ | ⚠️ | **GREEN** |
| `lib/fiscalia/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/flota/` | ✅ | ❌ | ⚠️ (class, raw) | ✅ | — | **YELLOW** |
| `lib/monitorista/` | ❌ | ❌ | ✅ | ⚠️ (split services) | ❌ (inline query) | **RED** |
| `lib/notificaciones/` | ✅ | ✅ | ✅ | — | ⚠️ | **YELLOW** |
| `lib/oficial/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/prevencion/` | ✅ | ✅ | ⚠️ (partial any[]) | ❌ | ⚠️ | **YELLOW** |
| `lib/reportes/` | ❌ | ❌ | ✅ | ❌ | — | **RED** |
| `lib/reportes-operativos/` | ❌ | ❌ | ❌ (raw) | ⚠️ (inline map) | — | **RED** |
| `lib/reportes-sin-d1/` | ❌ | ❌ | ❌ (raw) | ⚠️ (inline map) | — | **RED** |
| `lib/reportes-sin-novedad/` | ❌ | ❌ | ❌ (raw) | ⚠️ (inline map) | — | **RED** |
| `lib/reportes-incidentes/` | ❌ | ❌ | ❌ (raw) | ⚠️ (inline map) | — | **RED** |
| `lib/agente_juzgado/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/agente_liberaciones/` | ✅ | ✅ | ✅ | ✅ | ⚠️ (inline query) | **YELLOW** |
| `lib/agente_infracciones/` | ✅ | ✅ | ✅ | ✅ | ✅ | **GREEN** |
| `lib/rol-servicios/` + `lib/rol_servicios/` | ❌ | ❌ | ❌ | ❌ | ❌ (inline query) | **RED** |

### Current totals
- **GREEN**: 8 modules (911, auxiliar, corralon, incidentes, fiscalia, oficial, agente_juzgado, agente_infracciones)
- **YELLOW**: 5 modules (admin, flota, notificaciones, prevencion, agente_liberaciones)
- **RED**: 10 modules (admin-transito, camara, d1, monitorista, reportes, reportes-operativos, reportes-sin-d1, reportes-sin-novedad, reportes-incidentes, rol-servicios)

### Auth helper (`lib/auth/helpers.ts`)

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

# Page file rules
- **Never** import `query` from `@/lib/db` in `app/**/page.tsx`
- **Never** import `query` from `@/lib/db` in `app/**/layout.tsx`
- **Never** import `query` from `@/lib/db` in `app/api/**/route.ts`
- **Never** import `db` from `@/lib/db/index` (that's for better-auth only)
- **Never** import from `@/lib/db/schema` in app code (only used by better-auth in `lib/auth.ts`)
- For role checks: use `getUserWithRole()` from `@/lib/auth/helpers`
- For domain data: use the corresponding `lib/<module>/service.ts` or `repository.ts`
- JSX references must match the **camelCase** properties from the types/interfaces, NOT the snake_case DB columns

# Architectural compliance — Next steps
The following modules need types.ts + mapper.ts created to reach full compliance:
- `lib/camara/`, `lib/d1/`, `lib/monitorista/`, `lib/reportes/`, `lib/reportes-operativos/`, `lib/reportes-sin-d1/`, `lib/reportes-sin-novedad/`, `lib/reportes-incidentes/`, `lib/rol-servicios/`

The following modules need their actions.ts refactored to go through service/repository instead of using `query` directly:
- `lib/admin/actions.ts`, `lib/admin-transito/actions.ts`, `lib/monitorista/actions.ts`, `lib/agente_liberaciones/actions.ts`
