# Cómo Crear un Nuevo Módulo

**Propósito**: Paso a paso para agregar un nuevo dominio al sistema siguiendo la arquitectura estándar.

---

## Vista general

```
lib/<modulo>/
├── types.ts      — Interfaces camelCase
├── mapper.ts     — rowTo* convierten snake_case DB → camelCase TS
├── repository.ts — SQL parametrizado, retorna objetos tipados vía mapper
├── service.ts    — Pass-through / orquestación (opcional)
└── actions.ts    — Server actions para mutaciones (opcional)

app/<modulo>/     — Páginas (opcional)
app/api/<modulo>/ — API routes (opcional)
```

---

## Paso 1: Crear `lib/<modulo>/types.ts`

Interfaces con **camelCase**. Cada propiedad debe coincidir con lo que el componente JSX va a leer.

```ts
export interface Usuario {
  id: string
  nombreCompleto: string   // mapper leerá nombre_completo de la BD
  email: string
  activo: boolean
  createdAt: string
}
```

Reglas:
- NUNCA usar snake_case en propiedades TS
- Fechas como `string` (ISO 8601), no `Date`
- `null` explícito para columnas opcionales (ej: `telefono: string | null`)

## Paso 2: Crear `lib/<modulo>/mapper.ts`

Funciones `rowTo*` que convierten `Record<string, unknown>` (lo que devuelve pg) a las interfaces.

```ts
import type { Usuario } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

function toBool(val: unknown): boolean {
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') return val === 'true'
  return Boolean(val)
}

export function rowToUsuario(row: Record<string, unknown>): Usuario {
  return {
    id: String(row.id ?? ''),
    nombreCompleto: String(row.nombre_completo ?? ''),  // snake_case → camelCase
    email: String(row.email ?? ''),
    activo: toBool(row.activo),
    createdAt: toStr(row.created_at) ?? '',
  }
}
```

Reglas:
- Los mappers son **puros** — sin async, sin side effects
- Siempre aceptan `Record<string, unknown>` como primer parámetro
- `toStr()` maneja Dates automáticamente
- `toBool()` maneja tanto `true` literal como string `"true"`

## Paso 3: Crear `lib/<modulo>/repository.ts`

SQL parametrizado con `query()` de `@/lib/db`. Usa el mapper para convertir los rows.

```ts
import { query } from '@/lib/db'
import type { Usuario } from './types'
import { rowToUsuario } from './mapper'

export async function listarUsuarios(): Promise<Usuario[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, nombre_completo, email, activo, created_at
     FROM usuarios
     ORDER BY created_at DESC`,
  )
  return result.rows.map(rowToUsuario)
}

export async function obtenerUsuario(id: string): Promise<Usuario | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, nombre_completo, email, activo, created_at
     FROM usuarios
     WHERE id = $1 LIMIT 1`,
    [id],
  )
  return result.rows.length ? rowToUsuario(result.rows[0]) : null
}
```

Reglas:
- Siempre `query<Record<string, unknown>>(...)` — el mapper se encarga del tipo
- NUNCA importar mappers de otros módulos (la composición va en service)
- Parámetros con `$1`, `$2`, etc. (escapados por pg, no concatenar strings)

## Paso 4: Crear `lib/<modulo>/service.ts` (opcional, a menudo thin)

Pass-through simple o lógica de orquestación:

```ts
import { listarUsuarios, obtenerUsuario } from './repository'

export async function getUsuarios() {
  return listarUsuarios()
}

export async function getUsuario(id: string) {
  return obtenerUsuario(id)
}
```

Si hay lógica multi-módulo, aquí se compone. Ej: un service de dashboard que une datos de 3 repos distintos.

## Paso 5: Crear `lib/<modulo>/actions.ts` (solo para mutaciones)

Server actions con `tryAction` o `tryActionRaw`:

```ts
'use server'

import { tryAction, tryActionRaw, ValidationError } from '@/lib/error-handler'
import { revalidatePath } from 'next/cache'
import { query } from '@/lib/db'

export async function crearUsuario(formData: FormData) {
  return tryActionRaw(async () => {
    const nombre = formData.get('nombre')
    if (!nombre) throw new ValidationError('Nombre requerido')

    await query(
      `INSERT INTO usuarios (nombre_completo, email) VALUES ($1, $2)`,
      [nombre, formData.get('email')],
    )

    revalidatePath('/usuarios')
  })
}

export async function obtenerUsuarios() {
  return tryAction(async () => {
    const { listarUsuarios } = await import('./repository')
    return listarUsuarios()
  })
}
```

Usar:
- `tryAction(fn)` — cuando el caller espera `{ success: true, data } | { success: false, error }`
- `tryActionRaw(fn)` — cuando la acción usa `redirect()` o el error debe propagarse

## Paso 6: Crear página en `app/`

```tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/auth/helpers'
import { listarUsuarios } from '@/lib/<modulo>/repository'

export default async function UsuariosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = await getUserWithRole(session.user.id)
  if (user?.rolNombre !== 'Administrador') redirect('/dashboard')

  const usuarios = await listarUsuarios()

  return (
    <div>
      {usuarios.map(u => (
        <div key={u.id}>{u.nombreCompleto}</div>  {/* camelCase ✓ */}
      ))}
    </div>
  )
}
```

Reglas:
- **NUNCA** importar `query` de `@/lib/db` en pages
- **NUNCA** importar `db` de `@/lib/db/index`
- **Siempre** usar `getUserWithRole()` para role checks
- **Siempre** leer datos de `repository` o `service`, nunca directo de BD

## Paso 7: Registrar en la bóveda

- Agregar feature en `boveda/🧩 Features/Index.md`
- Crear `boveda/🧩 Features/<Modulo>.md` con diagrama Mermaid
- Si aplica API routes, agregar en `boveda/📡 API/API Routes.md`

---

## Checklist post-creación

- [ ] `lib/<modulo>/types.ts` — interfaces camelCase
- [ ] `lib/<modulo>/mapper.ts` — `rowTo*` con `toStr/toNum/toBool`
- [ ] `lib/<modulo>/repository.ts` — SQL con `query()`, retorna objetos tipados
- [ ] `lib/<modulo>/service.ts` — pass-through (opcional)
- [ ] `lib/<modulo>/actions.ts` — `tryAction/tryActionRaw` (solo mutaciones)
- [ ] Pages en `app/` — sin `import { query }`, sin `import { db }`
- [ ] Role checks con `getUserWithRole()`
- [ ] JSX referencias camelCase, no snake_case
- [ ] Errores con `ValidationError`, `NotFoundError`, etc.
- [ ] `npx tsc --noEmit` — 0 errores
- [ ] Bóveda actualizada (Features/Index + Feature + API)
