<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Bóveda de Conocimiento

**Antes de cualquier cambio, leer `boveda/Home.md` para contexto completo del proyecto.**
La bóveda en `boveda/` es la única fuente de documentación. No crear documentación suelta fuera de ella.

El archivo `.opencode/context-map.yaml` mapea cada dominio del proyecto a sus archivos relevantes, documentación y query de Graphify. Usarlo para cargar contexto en una tarea nueva.

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

# Checklist post-cambio

Al completar cualquier cambio (nueva feature, bugfix, refactor):

1. **TypeCheck**: `npx tsc --noEmit` — 0 errores
2. **Build**: `npm run build` — exit 0
3. **Si el módulo es nuevo**: seguir [Crear Modulo.md](boveda/🏗%20Arquitectura/Crear%20Modulo.md)
4. **Actualizar bóveda**:
   - Feature nueva → `boveda/🧩 Features/[nombre].md` + actualizar `Index.md`
   - Bug fix → agregar entrada en `boveda/🗺 Roadmap/Troubleshooting.md`
   - Cambio en BD → actualizar `boveda/📦 Datos/Esquema BD.md`
   - Decisión técnica → ADR en `boveda/🏗 Arquitectura/Decisiones.md`
   - Cambio en dependencias → `boveda/🛠 Stack/Librerias.md`
5. **Verificar nomenclatura**:
   - JSX props en camelCase (no snake_case de BD)
   - Pages sin `import { query }` directo
   - Role checks con `getUserWithRole()`
   - Errores con AppError/tryAction
6. **Graphify**: `npx graphify update` para mantener el grafo sincronizado
7. **Si hay cambios en BD**: `npm run db:schema` para refrescar `boveda/📦 Datos/Esquema BD.md`

## graphify

This project has a graphify knowledge graph at .graphify/.

Rules:
- For codebase or architecture questions, when `.graphify/graph.json` exists, first run `graphify query "<question>"` (or `graphify path "<A>" "<B>"` / `graphify explain "<concept>"`); these return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output
- If .graphify/wiki/index.md exists, navigate it instead of reading raw files
- If .graphify/graph.json is missing but graphify-out/graph.json exists, run `graphify migrate-state --dry-run` first; if tracked legacy artifacts are reported, ask before using the recommended `git mv -f graphify-out .graphify` and commit message
- If .graphify/needs_update exists or .graphify/branch.json has stale=true, warn before relying on semantic results and run the graphify skill with --update when appropriate
- If the user asks to build, update, query, path, or explain the graph, use the installed `graphify` skill instead of ad-hoc file traversal
- Before proposing or committing .graphify artifacts, run `graphify portable-check .graphify`; commit-safe graph artifacts must use repo-relative paths, and never commit .graphify/branch.json, .graphify/worktree.json, .graphify/needs_update, or .graphify/cache/. If a repo already tracks any of them, first add them to .gitignore, then propose `git rm --cached .graphify/branch.json .graphify/worktree.json .graphify/needs_update` and `git rm -r --cached .graphify/cache`; never mutate git state without asking
- Before deep graph traversal, prefer `graphify summary --graph .graphify/graph.json` for compact first-hop orientation
- For review impact on changed files, use `graphify review-delta --graph .graphify/graph.json` instead of generic traversal
- Read `.graphify/GRAPH_REPORT.md` only for broad architecture review or when `query` / `path` / `explain` do not surface enough context
- After modifying code files in this session, run `npx graphify hook-rebuild` to keep the graph current
