# Etapa 2 — Tokens opacos para recursos sensibles (IDOR hardening)

> Lee primero [`00-contexto.md`](./00-contexto.md), en particular la nota sobre `consumeViewToken` (no reusar ese mecanismo, es de un solo uso). Conviene hacer esta etapa **después** de la Etapa 1 — endurecer un id que igual es accesible por cualquier usuario autenticado no cierra el riesgo real, solo lo esconde.

**Archivo a crear:** `lib/recursos/token-recurso.ts` (nuevo, helper genérico reusable)

**Archivos a modificar:** las páginas/routes que hoy exponen id numérico secuencial en la URL de un recurso sensible — según el CSV de la Etapa 0 y la exploración inicial, al menos:
- `app/fiscalia/expedientes/[id]/...`
- `app/monitorista/detenidos/[id]/...`
- rutas de denuncias (`?entidadId=`/`[id]` en monitorista)

No se limita esta lista de antemano sin confirmar contra el código real — el CSV/grep de la Etapa 0 puede revelar más rutas con `[id]` numérico sobre datos sensibles que conviene incluir.

## Objetivo

Que el id que aparece en la URL de un recurso sensible no sea adivinable (`id+1` no debe dar acceso al recurso de otro caso), **sin** cambiar las PKs internas de la base de datos (evita migración de esquema/FKs en cascada).

## Diseño: tabla de mapeo, no columna nueva en cada tabla

Una sola tabla nueva, reusable para cualquier tipo de recurso:

```sql
CREATE TABLE tokens_recurso (
  token       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo        text NOT NULL,       -- 'expediente' | 'detenido' | 'denuncia' | ...
  recurso_id  text NOT NULL,       -- id interno real (puede ser numérico o uuid ya existente)
  creado_en   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tipo, recurso_id)
);
CREATE INDEX idx_tokens_recurso_tipo_id ON tokens_recurso (tipo, recurso_id);
```

`UNIQUE (tipo, recurso_id)` garantiza que un mismo recurso siempre tenga el mismo token (no se genera uno nuevo cada vez que se pide) — así el link se puede compartir/guardar sin que expire, a diferencia de `consumeViewToken`.

## Paso 1 — `lib/recursos/token-recurso.ts`

```ts
import { query } from '@/lib/db'

export async function obtenerOCrearToken(tipo: string, recursoId: string): Promise<string> {
  const existente = await query<{ token: string }>(
    `SELECT token FROM tokens_recurso WHERE tipo = $1 AND recurso_id = $2`,
    [tipo, recursoId],
  )
  if (existente.rows[0]) return existente.rows[0].token

  const creado = await query<{ token: string }>(
    `INSERT INTO tokens_recurso (tipo, recurso_id) VALUES ($1, $2)
     ON CONFLICT (tipo, recurso_id) DO UPDATE SET tipo = EXCLUDED.tipo
     RETURNING token`,
    [tipo, recursoId],
  )
  return creado.rows[0].token
}

export async function resolverToken(tipo: string, token: string): Promise<string | null> {
  const r = await query<{ recurso_id: string }>(
    `SELECT recurso_id FROM tokens_recurso WHERE tipo = $1 AND token = $2`,
    [tipo, token],
  )
  return r.rows[0]?.recurso_id ?? null
}
```

`ON CONFLICT ... DO UPDATE SET tipo = EXCLUDED.tipo` es un no-op intencional (evita duplicar la lógica de INSERT vs UPDATE) que aprovecha `RETURNING` para devolver el token existente si ya había uno — patrón estándar de upsert-y-devolver en Postgres.

## Paso 2 — Uso en las páginas de recurso

Ejemplo para `app/fiscalia/expedientes/[id]/page.tsx` (el patrón se repite igual en detenidos/denuncias):

- **Generación del link** (donde hoy se construye `/fiscalia/expedientes/${s.id}`): reemplazar por `/fiscalia/expedientes/${await obtenerOCrearToken('expediente', s.id)}`.
- **Resolución en la página** (`[id]` ahora recibe el token, no el id real): al inicio del `page.tsx`, antes de cualquier query de negocio:

```ts
const idReal = await resolverToken('expediente', paramsToken)
if (!idReal) notFound()   // token inválido o de otro tipo -> 404, no 403 (no revela si el recurso existe)
```

- El check de `tienePermiso`/sección (Etapa 1) sigue aplicando **sobre el recurso ya resuelto** — son controles independientes, ambos deben pasar. El orden correcto es: resolver token → 404 si no existe → verificar permiso sobre el recurso real → 403/redirect si no tiene acceso.

## Notas de diseño

- Se usa `uuid` (128 bits, no adivinable por fuerza bruta práctica) en vez de un token corto tipo `consumeViewToken` — este es persistente y no expira, así que necesita más entropía que un token de un solo uso de corta vida.
- No se borra ni se oculta el id real en ningún lado del backend (repository/service siguen usando el id real internamente) — el token solo existe en la capa de URL/routing.
- Si un recurso no tiene token todavía (dato creado antes de esta migración), `obtenerOCrearToken` lo crea la primera vez que se genera un link — no hace falta backfill masivo, se resuelve perezosamente.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores.
- [ ] Migración SQL de `tokens_recurso` aplicada (usar el mecanismo de migraciones que ya use el proyecto — revisar cómo se versionan cambios de esquema existentes antes de escribir la migración a mano).
- [ ] Un link generado desde la UI para un expediente/detenido/denuncia usa el token en la URL, no el id numérico.
- [ ] Visitar la URL con un uuid inventado (no existente en `tokens_recurso`) da 404, no 500 ni información sobre si el recurso existe.
- [ ] Visitar el token real de un recurso al que el usuario NO tiene permiso de sección sigue dando el bloqueo de la Etapa 1 (los dos controles son independientes y ambos se ejercitan).
- [ ] El mismo recurso siempre resuelve al mismo token (no se genera uno distinto en cada visita).
