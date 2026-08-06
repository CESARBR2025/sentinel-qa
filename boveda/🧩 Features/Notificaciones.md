# Sistema de Notificaciones — spec portable

Doc autocontenido para reimplementar este sistema en otro proyecto. Documenta el
estado **real del código** (no el plan original — hay diferencias, anotadas abajo).

**Stack asumido**: Next.js App Router + `pg` crudo (`query()` propio) + better-auth
+ tabla `roles`/`users` propia con `rol_id` en el usuario. Si el otro proyecto usa
otro ORM/auth, adaptar sólo las 4 piezas marcadas «⚠ adaptar».

---

## Idea central

Una notificación se dirige a un **rol** (todos sus miembros la ven) o a un
**usuario concreto**. El estado de "leída" **no** es una columna del evento —
vive en tabla aparte, una fila por (evento, persona). Así:

- Si Alicia marca leída una notificación de su rol, Bob (mismo rol) la sigue viendo sin leer.
- Si Carla entra al rol después de emitida, ve el historial completo igual.

Dos tablas separan **el evento** de **quién lo leyó**:

- `notificaciones_eventos` — una fila por (evento × destinatario).
- `notificaciones_lecturas` — quién leyó qué. Ausencia de fila = no leída.

---

## Por qué polling y no SSE/WebSockets

Contador vía polling **pausado cuando la pestaña no está visible**
(`document.visibilityState`), cada 30s, contra una única query indexada de sólo
lectura. La lista completa (para el dropdown/historial) sólo se pide al abrir el
dropdown o cuando el contador sube. Nada de escritura en la ruta caliente.

SSE mantendría una función serverless abierta por usuario conectado — carísimo en
plataformas serverless (Vercel, etc). Este modelo es más barato que polling ingenuo
y mucho más barato que SSE, sin perder "casi tiempo real" (30s).

---

## Esquema SQL

```sql
CREATE TABLE IF NOT EXISTS notificaciones_eventos (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Destinatario: rol o usuario concreto. Nunca ambos nulos (CHECK abajo).
  rol_id       integer     REFERENCES roles(id) ON DELETE CASCADE,
  user_id      text        REFERENCES users(id) ON DELETE CASCADE,
  evento       text        NOT NULL,
  titulo       text        NOT NULL,
  mensaje      text        NOT NULL,
  href         text,
  severidad    text        NOT NULL DEFAULT 'info',
  entidad_tipo text,
  entidad_id   text,
  emitida_por  text        REFERENCES users(id) ON DELETE SET NULL,
  -- Agrupa las filas emitidas en una misma llamada a emitir(): la auditoría
  -- muestra "1 evento → 3 roles" en vez de 3 registros sueltos.
  grupo_id     uuid,
  -- Idempotencia: con la misma clave sólo se inserta una vez aunque el
  -- flujo que la origina se reintente.
  clave_dedup  text,
  creado_en    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notificaciones_eventos_destinatario_chk
    CHECK (user_id IS NOT NULL OR rol_id IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS notificaciones_eventos_clave_dedup_uq
  ON notificaciones_eventos (clave_dedup) WHERE clave_dedup IS NOT NULL;
CREATE INDEX IF NOT EXISTS notificaciones_eventos_rol_creado_idx
  ON notificaciones_eventos (rol_id, creado_en DESC) WHERE rol_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS notificaciones_eventos_user_creado_idx
  ON notificaciones_eventos (user_id, creado_en DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS notificaciones_eventos_evento_idx
  ON notificaciones_eventos (evento, creado_en DESC);

-- Estado de lectura por persona.
CREATE TABLE IF NOT EXISTS notificaciones_lecturas (
  notificacion_id uuid        NOT NULL REFERENCES notificaciones_eventos(id) ON DELETE CASCADE,
  user_id         text        NOT NULL REFERENCES users(id)                 ON DELETE CASCADE,
  leida_en        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (notificacion_id, user_id)
);
CREATE INDEX IF NOT EXISTS notificaciones_lecturas_user_idx ON notificaciones_lecturas (user_id);

-- Matriz configurable evento × rol (panel admin). Los defaults viven en el
-- catálogo en código; aquí sólo se guardan los OVERRIDES que cambie el admin.
CREATE TABLE IF NOT EXISTS notificaciones_suscripciones (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento         text        NOT NULL,
  rol_id         integer     NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  activo         boolean     NOT NULL DEFAULT true,
  actualizado_en timestamptz NOT NULL DEFAULT now(),
  UNIQUE (evento, rol_id)
);

-- Configuración (retención de historial).
CREATE TABLE IF NOT EXISTS notificaciones_config (
  clave text PRIMARY KEY,
  valor text NOT NULL
);
INSERT INTO notificaciones_config (clave, valor) VALUES ('retencion_dias', '90')
ON CONFLICT (clave) DO NOTHING;
```

**⚠ adaptar**: `rol_id integer REFERENCES roles(id)` y `user_id text REFERENCES
users(id)` — usa los tipos/nombres de tu tabla de roles y usuarios reales. Si no
hay concepto de rol en el otro proyecto, se puede quitar `rol_id`/`notificaciones_suscripciones`
entero y notificar sólo por `user_id` (versión simplificada).

Si ya existe una tabla `notificaciones` vieja de un sistema previo, **no la
alteres** si no eres dueño de ella (permisos de owner en Postgres) — crea las
tablas nuevas con prefijo distinto y opcionalmente haz backfill con un `INSERT
... SELECT` desde la vieja, como se hizo aquí (ver `lib/db/manual-migrations/0026_notificaciones_por_rol.sql` en este repo).

---

## Capa de datos — `lib/notificaciones/`

### `types.ts`

```ts
export type Severidad = 'info' | 'aviso' | 'critico'

/** Notificación tal como la ve un usuario concreto (con SU estado de lectura). */
export interface Notificacion {
  id: string
  evento: string
  titulo: string
  mensaje: string
  href: string | null
  severidad: Severidad
  leida: boolean
  entidadTipo: string | null
  entidadId: string | null
  creadoEn: string
}

/** Fila de la auditoría del panel admin: el evento y a cuántos alcanzó. */
export interface NotificacionAuditoria {
  id: string
  grupoId: string | null
  evento: string
  titulo: string
  mensaje: string
  href: string | null
  severidad: Severidad
  rolId: number | null
  rolNombre: string | null
  userId: string | null
  usuarioNombre: string | null
  emitidaPor: string | null
  emitidaPorNombre: string | null
  creadoEn: string
  lecturas: number
}

export interface SuscripcionEventoRol {
  evento: string
  rolId: number
  activo: boolean
}

export interface FiltrosAuditoria {
  evento?: string | null
  rolId?: number | null
  desde?: string | null
  hasta?: string | null
  limite?: number
  offset?: number
}
```

### `catalogo.ts` — eventos versionados en código

Los defaults de audiencia viven en código (revisables en PR); la BD sólo guarda
los **overrides** que el admin cambie desde la matriz. Si un evento no tiene fila
en `notificaciones_suscripciones`, mandan `rolesPorDefecto`.

```ts
export type Severidad = 'info' | 'aviso' | 'critico'

export interface DefinicionEvento {
  label: string                // título por defecto
  modulo: string                // agrupa la matriz del panel admin
  severidad: Severidad
  rolesPorDefecto: string[]     // nombres de rol tal cual en roles.nombre
  href?: (entidadId: string) => string
}

export const EVENTOS = {
  'ejemplo.creado': {
    label: 'Ejemplo creado', modulo: 'Ejemplos', severidad: 'aviso',
    rolesPorDefecto: ['rol_destino'],
    href: id => `/modulo/ejemplos/${id}`,
  },
  // ... una entrada por evento del dominio
  'admin.aviso': {
    label: 'Aviso de la administración', modulo: 'Administración', severidad: 'aviso',
    rolesPorDefecto: [], // el admin elige roles al enviar
  },
} satisfies Record<string, DefinicionEvento>

export type ClaveEvento = keyof typeof EVENTOS
export const CLAVES_EVENTO = Object.keys(EVENTOS) as ClaveEvento[]

export function definicionEvento(clave: string): DefinicionEvento | null {
  return (EVENTOS as Record<string, DefinicionEvento>)[clave] ?? null
}

export function eventosPorModulo() {
  const grupos = new Map<string, { clave: ClaveEvento; def: DefinicionEvento }[]>()
  for (const clave of CLAVES_EVENTO) {
    const def = EVENTOS[clave] as DefinicionEvento
    const lista = grupos.get(def.modulo) ?? []
    lista.push({ clave, def })
    grupos.set(def.modulo, lista)
  }
  return [...grupos.entries()].map(([modulo, eventos]) => ({ modulo, eventos }))
}
```

Para agregar un evento nuevo: una entrada aquí + una llamada a `emitir()` en el
punto del flujo de negocio correspondiente. Nada más.

### `emisor.ts` — única función que emite

```ts
import { randomUUID } from 'node:crypto'
import { query } from '@/lib/db' // ⚠ adaptar: tu wrapper de BD
import { definicionEvento, type ClaveEvento } from './catalogo'
import { rolesSuscritos, idsRolesPorNombre } from './repository'

export interface DatosEmision {
  mensaje: string
  titulo?: string             // default: label del catálogo
  entidadId?: string
  entidadTipo?: string
  href?: string                // default: catalogo.href(entidadId)
  roles?: string[]             // override puntual de audiencia
  usuarios?: string[]          // destinatarios directos, además de los roles
  emitidaPor?: string
  dedup?: string                // idempotencia (evita duplicar en reintentos)
}

/**
 * IMPORTANTE — llamar siempre DESPUÉS del COMMIT de la transacción de negocio,
 * nunca dentro. Si tu acción corre con BEGIN/COMMIT explícito, emite fuera:
 * emitir dentro deja notificaciones fantasma si la transacción aborta.
 *
 * Nunca lanza: una notificación que falla no puede tumbar la operación de
 * negocio que la originó.
 */
export async function emitir(evento: ClaveEvento | string, datos: DatosEmision): Promise<void> {
  try {
    const def = definicionEvento(evento)
    if (!def) { console.error(`[notificaciones] evento desconocido: ${evento}`); return }

    let rolIds: number[]
    if (datos.roles) {
      rolIds = await idsRolesPorNombre(datos.roles)
    } else {
      const suscritos = await rolesSuscritos(evento)
      rolIds = suscritos ?? await idsRolesPorNombre(def.rolesPorDefecto)
    }

    const usuarios = datos.usuarios ?? []
    if (rolIds.length === 0 && usuarios.length === 0) return

    const titulo = datos.titulo ?? def.label
    const href = datos.href ?? (datos.entidadId && def.href ? def.href(datos.entidadId) : null)
    const grupoId = randomUUID()

    const filas = [
      ...rolIds.map(rolId => ({ rolId, userId: null as string | null })),
      ...usuarios.map(userId => ({ rolId: null as number | null, userId })),
    ]

    for (const fila of filas) {
      const claveDedup = datos.dedup
        ? `${datos.dedup}:r${fila.rolId ?? ''}:u${fila.userId ?? ''}`
        : null
      await query(
        `INSERT INTO notificaciones_eventos
           (user_id, rol_id, evento, titulo, mensaje, href, severidad,
            entidad_tipo, entidad_id, emitida_por, grupo_id, clave_dedup)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (clave_dedup) WHERE clave_dedup IS NOT NULL DO NOTHING`,
        [fila.userId, fila.rolId, evento, titulo, datos.mensaje, href, def.severidad,
         datos.entidadTipo ?? null, datos.entidadId ?? null,
         datos.emitidaPor ?? null, grupoId, claveDedup],
      )
    }
  } catch (e) {
    console.error(`[notificaciones] fallo al emitir "${evento}":`, e)
  }
}
```

**Uso en un flujo de negocio** — una línea después del commit:

```ts
await emitir('ejemplo.creado', { entidadId: id, mensaje: `Nuevo ejemplo ${folio}` })
```

### `repository.ts` — lectura, suscripciones, auditoría

```ts
import { query } from '@/lib/db'
import type { Notificacion, NotificacionAuditoria, FiltrosAuditoria, SuscripcionEventoRol } from './types'
import { rowToNotificacion, rowToAuditoria } from './mapper'

const SELECT_USUARIO = `
  SELECT n.id, n.evento, n.titulo, n.mensaje, n.href, n.severidad,
         n.entidad_tipo, n.entidad_id, n.creado_en,
         (l.user_id IS NOT NULL) AS leida
    FROM notificaciones_eventos n
    LEFT JOIN notificaciones_lecturas l
           ON l.notificacion_id = n.id AND l.user_id = $1
   WHERE (n.user_id = $1 OR n.rol_id = $2)`

export async function listarParaUsuario(
  userId: string, rolId: number | null,
  opciones: { limite?: number; offset?: number; soloNoLeidas?: boolean } = {},
): Promise<Notificacion[]> {
  const { limite = 20, offset = 0, soloNoLeidas = false } = opciones
  const result = await query<Record<string, unknown>>(
    `${SELECT_USUARIO}
       ${soloNoLeidas ? 'AND l.user_id IS NULL' : ''}
     ORDER BY n.creado_en DESC LIMIT $3 OFFSET $4`,
    [userId, rolId, limite, offset],
  )
  return result.rows.map(rowToNotificacion)
}

/** Query del polling: una sola query indexada, sin escrituras. */
export async function contarNoLeidas(userId: string, rolId: number | null): Promise<number> {
  const result = await query<{ total: string }>(
    `SELECT count(*)::int AS total
       FROM notificaciones_eventos n
       LEFT JOIN notificaciones_lecturas l ON l.notificacion_id = n.id AND l.user_id = $1
      WHERE (n.user_id = $1 OR n.rol_id = $2) AND l.user_id IS NULL`,
    [userId, rolId],
  )
  return Number(result.rows[0]?.total ?? 0)
}

export async function contarTotal(userId: string, rolId: number | null): Promise<number> {
  const result = await query<{ total: string }>(
    `SELECT count(*)::int AS total FROM notificaciones_eventos n
      WHERE n.user_id = $1 OR n.rol_id = $2`,
    [userId, rolId],
  )
  return Number(result.rows[0]?.total ?? 0)
}

// Se valida que la notificación sea del usuario o de su rol: nadie marca las ajenas.
export async function marcarLeidaParaUsuario(notifId: string, userId: string, rolId: number | null) {
  await query(
    `INSERT INTO notificaciones_lecturas (notificacion_id, user_id)
     SELECT n.id, $2 FROM notificaciones_eventos n
      WHERE n.id = $1 AND (n.user_id = $2 OR n.rol_id = $3)
     ON CONFLICT DO NOTHING`,
    [notifId, userId, rolId],
  )
}

export async function marcarTodasLeidasParaUsuario(userId: string, rolId: number | null) {
  await query(
    `INSERT INTO notificaciones_lecturas (notificacion_id, user_id)
     SELECT n.id, $1 FROM notificaciones_eventos n
      WHERE (n.user_id = $1 OR n.rol_id = $2)
     ON CONFLICT DO NOTHING`,
    [userId, rolId],
  )
}

// ─── Suscripciones (matriz evento × rol del panel admin) ───
export async function listarSuscripciones(): Promise<SuscripcionEventoRol[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT evento, rol_id, activo FROM notificaciones_suscripciones`,
  )
  return result.rows.map(r => ({ evento: String(r.evento ?? ''), rolId: Number(r.rol_id), activo: Boolean(r.activo) }))
}

export async function guardarSuscripcion(evento: string, rolId: number, activo: boolean) {
  await query(
    `INSERT INTO notificaciones_suscripciones (evento, rol_id, activo, actualizado_en)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (evento, rol_id) DO UPDATE SET activo = EXCLUDED.activo, actualizado_en = now()`,
    [evento, rolId, activo],
  )
}

/** Roles suscritos a un evento. null = no hay override, manda el catálogo. */
export async function rolesSuscritos(evento: string): Promise<number[] | null> {
  const result = await query<{ rol_id: number }>(
    `SELECT rol_id FROM notificaciones_suscripciones WHERE evento = $1 AND activo = true`, [evento],
  )
  const hayOverride = await query<{ total: string }>(
    `SELECT count(*)::int AS total FROM notificaciones_suscripciones WHERE evento = $1`, [evento],
  )
  if (Number(hayOverride.rows[0]?.total ?? 0) === 0) return null
  return result.rows.map(r => Number(r.rol_id))
}

export async function idsRolesPorNombre(nombres: string[]): Promise<number[]> {
  if (nombres.length === 0) return []
  const result = await query<{ id: number }>(
    `SELECT id FROM roles WHERE nombre = ANY($1) AND activo = true`, [nombres],
  )
  return result.rows.map(r => Number(r.id))
}

// ─── Auditoría / mantenimiento (panel admin) ───
export async function listarAuditoria(filtros: FiltrosAuditoria = {}): Promise<NotificacionAuditoria[]> {
  const { evento, rolId, desde, hasta, limite = 100, offset = 0 } = filtros
  const cond: string[] = []; const params: unknown[] = []
  if (evento) { cond.push(`n.evento = $${params.length + 1}`); params.push(evento) }
  if (rolId)  { cond.push(`n.rol_id = $${params.length + 1}`); params.push(rolId) }
  if (desde)  { cond.push(`n.creado_en >= $${params.length + 1}`); params.push(desde) }
  if (hasta)  { cond.push(`n.creado_en <= $${params.length + 1}`); params.push(hasta) }
  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : ''
  const result = await query<Record<string, unknown>>(
    `SELECT n.id, n.grupo_id, n.evento, n.titulo, n.mensaje, n.href, n.severidad,
            n.rol_id, r.nombre AS rol_nombre, n.user_id, u.name AS usuario_nombre,
            n.emitida_por, e.name AS emitida_por_nombre, n.creado_en,
            (SELECT count(*)::int FROM notificaciones_lecturas l WHERE l.notificacion_id = n.id) AS lecturas
       FROM notificaciones_eventos n
       LEFT JOIN roles r ON r.id = n.rol_id
       LEFT JOIN users u ON u.id = n.user_id
       LEFT JOIN users e ON e.id = n.emitida_por
       ${where}
      ORDER BY n.creado_en DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limite, offset],
  )
  return result.rows.map(rowToAuditoria)
}

export async function obtenerRetencionDias(): Promise<number> {
  const result = await query<{ valor: string }>(`SELECT valor FROM notificaciones_config WHERE clave = 'retencion_dias'`)
  return Number(result.rows[0]?.valor ?? 90)
}

export async function guardarRetencionDias(dias: number) {
  await query(
    `INSERT INTO notificaciones_config (clave, valor) VALUES ('retencion_dias', $1)
     ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor`, [String(dias)],
  )
}

export async function purgarAntiguas(dias: number): Promise<number> {
  const result = await query<{ id: string }>(
    `DELETE FROM notificaciones_eventos WHERE creado_en < now() - ($1 || ' days')::interval RETURNING id`,
    [String(dias)],
  )
  return result.rowCount ?? 0
}
```

### `mapper.ts`

```ts
import type { Severidad } from './catalogo'
import type { Notificacion, NotificacionAuditoria } from './types'

function txt(v: unknown): string { return v === null || v === undefined ? '' : String(v) }
function txtNull(v: unknown): string | null { return v === null || v === undefined ? null : String(v) }
function severidad(v: unknown): Severidad {
  const s = txt(v); return s === 'critico' || s === 'aviso' ? s : 'info'
}

export function rowToNotificacion(row: Record<string, unknown>): Notificacion {
  return {
    id: txt(row.id), evento: txt(row.evento), titulo: txt(row.titulo), mensaje: txt(row.mensaje),
    href: txtNull(row.href), severidad: severidad(row.severidad), leida: Boolean(row.leida),
    entidadTipo: txtNull(row.entidad_tipo), entidadId: txtNull(row.entidad_id), creadoEn: txt(row.creado_en),
  }
}

export function rowToAuditoria(row: Record<string, unknown>): NotificacionAuditoria {
  return {
    id: txt(row.id), grupoId: txtNull(row.grupo_id), evento: txt(row.evento), titulo: txt(row.titulo),
    mensaje: txt(row.mensaje), href: txtNull(row.href), severidad: severidad(row.severidad),
    rolId: row.rol_id == null ? null : Number(row.rol_id), rolNombre: txtNull(row.rol_nombre),
    userId: txtNull(row.user_id), usuarioNombre: txtNull(row.usuario_nombre),
    emitidaPor: txtNull(row.emitida_por), emitidaPorNombre: txtNull(row.emitida_por_nombre),
    creadoEn: txt(row.creado_en), lecturas: Number(row.lecturas ?? 0),
  }
}
```

### `actions.ts` — server actions del lado usuario

```ts
'use server'
import { auth } from '@/lib/auth'                 // ⚠ adaptar a tu sistema de auth
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers' // ⚠ adaptar: debe devolver { rolId }
import { marcarLeidaParaUsuario, marcarTodasLeidasParaUsuario } from './repository'

export async function sesionConRol(): Promise<{ userId: string; rolId: number | null } | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  const usuario = await getUserWithRole(session.user.id)
  return { userId: session.user.id, rolId: usuario?.rolId ?? null }
}

export async function marcarLeida(notifId: string) {
  const ctx = await sesionConRol(); if (!ctx) return
  await marcarLeidaParaUsuario(notifId, ctx.userId, ctx.rolId)
}

export async function marcarTodasLeidas() {
  const ctx = await sesionConRol(); if (!ctx) return
  await marcarTodasLeidasParaUsuario(ctx.userId, ctx.rolId)
}
```

### `checker.ts` — alertas generadas por cron (opcional)

Patrón para notificaciones que no nacen de una acción de usuario sino de una
condición de tiempo/plazo (ej. vencimientos). Se dispara desde el cron, **nunca**
desde la ruta de lectura — así la campanita no dispara escaneos de tabla en cada
poll.

```ts
import { query } from '@/lib/db'
import { emitir } from './emisor'

export async function generarAlertasDePlazo(): Promise<number> {
  const pendientes = await query(/* tu condición de negocio */`SELECT id, ... FROM tabla WHERE ...`)
  let emitidas = 0
  for (const item of pendientes.rows) {
    await emitir('evento.plazo', {
      titulo: `Plazo próximo`,
      mensaje: `...`,
      entidadId: String(item.id),
      dedup: `evento.plazo:${item.id}`, // idempotente: el cron puede correr muchas veces sin duplicar
    })
    emitidas++
  }
  return emitidas
}
```

### `admin-actions.ts` — panel de administración

```ts
'use server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getUserWithRole } from '@/lib/auth/helpers'
import { CLAVES_EVENTO } from './catalogo'
import { emitir } from './emisor'
import { guardarSuscripcion, guardarRetencionDias, purgarAntiguas, obtenerRetencionDias } from './repository'

async function requerirAdmin(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const u = await getUserWithRole(session.user.id)
  if (!u?.esAdmin) redirect('/dashboard') // ⚠ adaptar: tu check de admin
  return session.user.id
}

// El form manda un checkbox por celda: sub__<evento>__<rolId>. Los desmarcados
// NO viajan en el FormData, así que hay que recorrer TODO el producto
// evento×rol y guardar explícitamente cada estado — si sólo se guardaran los
// presentes, desmarcar una celda nunca tendría efecto.
export async function guardarMatrizAction(formData: FormData) {
  await requerirAdmin()
  const rolIds = String(formData.get('roles') ?? '').split(',').map(Number).filter(n => Number.isFinite(n) && n > 0)
  for (const evento of CLAVES_EVENTO) {
    for (const rolId of rolIds) {
      const activo = formData.get(`sub__${evento}__${rolId}`) === 'on'
      await guardarSuscripcion(evento, rolId, activo)
    }
  }
  revalidatePath('/admin/notificaciones/matriz')
  redirect('/admin/notificaciones/matriz?exito=1')
}

export async function enviarAvisoAction(formData: FormData) {
  const adminId = await requerirAdmin()
  const titulo = String(formData.get('titulo') ?? '').trim()
  const mensaje = String(formData.get('mensaje') ?? '').trim()
  const href = String(formData.get('href') ?? '').trim()
  const roles = formData.getAll('roles').map(String).filter(Boolean)
  if (!titulo || !mensaje || roles.length === 0) redirect('/admin/notificaciones/enviar?error=faltan-datos')
  await emitir('admin.aviso', { titulo, mensaje, href: href || undefined, roles, emitidaPor: adminId })
  revalidatePath('/admin/notificaciones')
  redirect('/admin/notificaciones?exito=aviso')
}

export async function guardarRetencionAction(formData: FormData) {
  await requerirAdmin()
  const dias = Number(formData.get('dias'))
  if (Number.isFinite(dias) && dias >= 1) await guardarRetencionDias(Math.floor(dias))
  revalidatePath('/admin/notificaciones/mantenimiento')
  redirect('/admin/notificaciones/mantenimiento?exito=retencion')
}

export async function purgarAction() {
  await requerirAdmin()
  const dias = await obtenerRetencionDias()
  const borradas = await purgarAntiguas(dias)
  revalidatePath('/admin/notificaciones/mantenimiento')
  redirect(`/admin/notificaciones/mantenimiento?exito=purga&n=${borradas}`)
}
```

---

## API routes

| Ruta | Método | Uso |
|---|---|---|
| `/api/notificaciones/contador` | GET | Sólo `{noLeidas}`. Es lo único que se pollea. |
| `/api/notificaciones` | GET | Lista paginada (`?limite=5` para el dropdown, `?soloNoLeidas=true`, `?offset=`). |
| `/api/notificaciones/leer` | POST | `{id}` marca una; `{todas:true}` marca todas. |
| `/api/cron/notificaciones` | GET | Genera alertas de plazo + purga por retención. Protegido con `CRON_SECRET`. |

```ts
// app/api/notificaciones/contador/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { contarNoLeidas } from '@/lib/notificaciones/repository'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const usuario = await getUserWithRole(session.user.id)
  const noLeidas = await contarNoLeidas(session.user.id, usuario?.rolId ?? null)
  return NextResponse.json({ noLeidas })
}
```

```ts
// app/api/notificaciones/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { listarParaUsuario, contarNoLeidas } from '@/lib/notificaciones/repository'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const usuario = await getUserWithRole(session.user.id)
  const rolId = usuario?.rolId ?? null
  const p = req.nextUrl.searchParams
  const limite = Math.min(Math.max(Number(p.get('limite') ?? 20), 1), 100)
  const offset = Math.max(Number(p.get('offset') ?? 0), 0)
  const soloNoLeidas = p.get('soloNoLeidas') === 'true'
  const [notificaciones, noLeidas] = await Promise.all([
    listarParaUsuario(session.user.id, rolId, { limite, offset, soloNoLeidas }),
    contarNoLeidas(session.user.id, rolId),
  ])
  return NextResponse.json({ notificaciones, noLeidas })
}
```

```ts
// app/api/notificaciones/leer/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { marcarLeidaParaUsuario, marcarTodasLeidasParaUsuario } from '@/lib/notificaciones/repository'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const usuario = await getUserWithRole(session.user.id)
  const rolId = usuario?.rolId ?? null
  const body = await req.json().catch(() => ({})) as { id?: string; todas?: boolean }
  if (body.todas) {
    await marcarTodasLeidasParaUsuario(session.user.id, rolId)
    return NextResponse.json({ ok: true })
  }
  if (!body.id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })
  await marcarLeidaParaUsuario(body.id, session.user.id, rolId)
  return NextResponse.json({ ok: true })
}
```

```ts
// app/api/cron/notificaciones/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generarAlertasDePlazo } from '@/lib/notificaciones/checker'
import { obtenerRetencionDias, purgarAntiguas } from '@/lib/notificaciones/repository'

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    if (req.headers.get('authorization') !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 503 })
  }
  const alertas = await generarAlertasDePlazo()
  const dias = await obtenerRetencionDias()
  const purgadas = await purgarAntiguas(dias)
  return NextResponse.json({ alertasGeneradas: alertas, purgadas, retencionDias: dias })
}
```

---

## Configuración

### 1. Variables de entorno

```bash
# .env
DATABASE_URL=postgresql://user:password@host:5432/db_name   # ya debe existir en el proyecto
CRON_SECRET=<string aleatorio largo>                          # protege /api/cron/notificaciones
```

Genera `CRON_SECRET` con algo tipo `openssl rand -hex 32`. Sin esta variable, en
`NODE_ENV=production` la ruta de cron responde `503` (falla cerrado, no abierto);
en dev corre sin protección.

### 2. Migración

```bash
psql "$DATABASE_URL" -f lib/db/manual-migrations/00XX_notificaciones.sql
```

o el mecanismo de migraciones que use el proyecto destino (Drizzle, Prisma, SQL
manual). Verifica antes con `\dt roles` / `\dt users` que esas tablas existen y
que los tipos de PK coinciden con las `REFERENCES` del esquema (aquí `roles.id`
es `integer`, `users.id` es `text` porque better-auth genera IDs de texto — ajusta
si tu auth usa `uuid` o `serial`).

Si no eres dueño (owner) de una tabla `notificaciones` preexistente y no tienes
permiso de `ALTER`, no lo pidas ni escales a superusuario: crea las tablas nuevas
con otro nombre (`notificaciones_eventos` en vez de reusar `notificaciones`) — de
eso trata la nota al pie de "Esquema SQL" arriba. Postgres deja crear y alterar
libremente tablas de las que sí eres dueño, sin tocar privilegios de nadie.

### 3. Cron de mantenimiento

El endpoint `/api/cron/notificaciones` **no se autoinvoca** — necesita un
scheduler externo. En Vercel, vía `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/notificaciones", "schedule": "*/20 * * * *" }
  ]
}
```

(o el equivalente en `vercel.ts` con `crons: [{ path: '/api/cron/notificaciones', schedule: '*/20 * * * *' }]`
— ver skill `vercel:vercel-functions`). Frecuencia sugerida: cada 15-30 min: es
sólo mantenimiento (alertas de plazo + purga por retención), no la ruta caliente
de lectura.

Vercel Cron manda automáticamente `Authorization: Bearer $CRON_SECRET` si la
variable está configurada en el proyecto — no hay que pasarlo a mano. Fuera de
Vercel (cron de sistema, GitHub Actions, etc.), la llamada debe incluir ese header:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://tu-dominio.com/api/cron/notificaciones
```

### 4. Datos previos requeridos

- Tabla `roles` con las filas de rol que usará `rolesPorDefecto` en el catálogo
  **ya sembradas** (`nombre` debe hacer match exacto — `idsRolesPorNombre` filtra
  además por `activo = true`).
- `notificaciones_config.retencion_dias` ya trae default `90` desde la migración;
  no hace falta sembrarlo a mano.
- Nada más: `notificaciones_suscripciones` empieza vacía a propósito (sin
  overrides, manda el catálogo).

### 5. Verificación post-instalación

```bash
npx tsc --noEmit && npm run build
curl -s http://localhost:3000/api/notificaciones/contador -H "Cookie: <sesión>" # {"noLeidas":0}
curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/notificaciones
```

Luego dispara un evento real (`emitir('tu.evento', {...})` desde algún flujo) y
confirma que aparece en la campanita sin recargar (espera al siguiente poll, 30s,
o abre el dropdown para forzar el fetch).

---

## Hook de polling — `hooks/usePolling.ts`

```ts
'use client'
import { useEffect, useRef } from 'react'

export function usePolling(fn: () => void, intervalMs: number, activo = true) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    if (!activo) return
    const id = setInterval(() => fnRef.current(), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, activo])
}
```

---

## Componente — `components/notificaciones/CampanillaNotificaciones.tsx`

Campanita con badge de conteo, dropdown vía `createPortal` (evita bugs de
`z-index`/`overflow` de contenedores padre con `backdrop-filter`), sonido de
alerta al subir el contador, y polling pausado con pestaña oculta.

Puntos de diseño a preservar si se porta:
- **Portal a `document.body`**, no `position:absolute` anidado — evita que el
  dropdown quede tapado por tarjetas con `backdrop-filter`/`overflow` en la página.
- Posición calculada con `getBoundingClientRect()` del botón al abrir.
- `usePolling` sólo trae el **contador**; la lista completa (`MAX_DROPDOWN = 5`)
  se pide sólo al abrir el dropdown o si el contador sube.
- Optimistic UI: al hacer click en una notificación se marca leída en el estado
  local antes de que responda el POST.
- `sonarAlerta()` usa Web Audio API directo (osciladores), sin archivo de audio —
  evita depender de un asset; se degrada en silencio si `AudioContext` está bloqueado.

Código completo: ver `components/notificaciones/CampanillaNotificaciones.tsx`
de este repo (307 líneas, cópialo tal cual y ajusta sólo la paleta de colores
inline al tema del proyecto destino).

**Montaje**: se monta **dentro** de los componentes de header compartidos
(`Header.tsx`/`SubHeader.tsx` en este repo), no en cada página — así una sola
edición cubre todas las rutas. No necesita props, se autoabastece por fetch.

---

## Historial — `app/notificaciones/page.tsx`

Server component que arma la lista paginada (`listarParaUsuario` + `contarTotal`)
y la pasa a un client component (`ListaHistorial`) con filtro "sólo no leídas" y
botón "marcar todas". Usa `definicionEvento(n.evento)?.modulo` para mostrar el
módulo de origen de cada notificación.

---

## Panel de administrador (4 páginas)

| Página | Qué hace |
|---|---|
| `app/admin/notificaciones/page.tsx` | Auditoría global: tabla de eventos emitidos (`listarAuditoria`), filtros evento/rol/fecha, cuántas personas la han leído. |
| `app/admin/notificaciones/matriz/page.tsx` | Matriz evento × rol (filas = `eventosPorModulo()`, columnas = roles activos), checkbox por celda → `guardarMatrizAction`. |
| `app/admin/notificaciones/enviar/page.tsx` | Aviso manual: título, mensaje, href opcional, selector de roles → `enviarAvisoAction` (evento `admin.aviso`). |
| `app/admin/notificaciones/mantenimiento/page.tsx` | Editar `retencion_dias` y botón de purga inmediata → `guardarRetencionAction` / `purgarAction`. |

---

## Cómo instrumentar un flujo de negocio nuevo (agregar `emitir()` a otras acciones)

> **2026-07-31 — eventos que dejaron de ser configuración huérfana:** `despacho.en_camino` y `despacho.en_sitio` ya tienen emisor real. Antes estaban definidos en `catalogo.ts` (con `rolesPorDefecto: ['agente_despacho']` y `href: /agente_911/despacho`) pero ningún `emitir()` los usaba. Ahora `lib/oficial/actions.ts::marcarEnCaminoOficial`/`marcarEnSitioOficial` los emiten después de su `UPDATE` (disparo automático de la navegación en vivo del oficial — ver [[Reporte Campo]]), con audiencia por defecto del catálogo (rol, sin `usuarios`), `entidadTipo: 'incidente'` y `dedup: despacho.en_camino|en_sitio:{incidenteId}`. Si la acción lanza (ej. estatus ya no es `en_despacho`), corta antes del `emitir` — no se notifica nada.

Instrumentar = hacer que una acción existente (crear, actualizar, cerrar algo)
dispare una notificación. Son 3 pasos, siempre los mismos:

**1. Dar de alta el evento en `catalogo.ts`** (si no existe ya):

```ts
'expediente.turnado': {
  label: 'Expediente turnado a juzgado', modulo: 'Juzgado', severidad: 'aviso',
  rolesPorDefecto: ['agente_juzgado'],
  href: id => `/agente_juzgado/solicitudes/${id}`,
},
```

**2. Llamar `emitir()` justo después de que la operación de negocio haya
terminado** — después del `INSERT`/`UPDATE`, y si la función usa
`BEGIN/COMMIT` explícito, **después del `COMMIT`**, nunca entre medio:

```ts
// ejemplo real de este repo — lib/incidentes/actions.ts
const despachadorId = str(formData, 'despachadorId')
if (despachadorId) {
  // Destinatario directo (no por rol): el despacho es de una persona concreta.
  await emitir('despacho.asignado', {
    titulo: `🚨 Nuevo despacho — ${folio}`,
    mensaje: `Se te ha asignado el incidente ${folio}. Revisa el tablón de despacho.`,
    href: '/agente_911/despacho',
    entidadTipo: 'incidente',
    entidadId: incidenteId,
    usuarios: [despachadorId],   // destinatario directo
    roles: [],                    // sin audiencia de rol en este caso
    emitidaPor: session.user.id,
  })
} else {
  // Sin destinatario concreto: usa la audiencia por defecto del catálogo (rol).
  await emitir('incidente.creado', {
    mensaje: `Incidente ${folio} sin despachar.`,
    href: '/agente_911/despacho',
    entidadTipo: 'incidente',
    entidadId: incidenteId,
    emitidaPor: session.user.id,
  })
}
```

Nota los dos patrones de audiencia:
- **Por rol** (lo normal): no mandes `roles`/`usuarios`, `emitir()` resuelve la
  audiencia sola (override de BD → `rolesPorDefecto` del catálogo).
- **A una persona concreta** (ej. "se te asignó a ti"): pasa `usuarios: [id]` y
  `roles: []` para no avisarle también a todo el rol.

**⚠ Una misma clave de evento puede tener varios call-sites con audiencias distintas.**
En este repo, `'despacho.asignado'` se emite en **tres** puntos de
`lib/incidentes/actions.ts` con destinatarios distintos:
- `createIncidente` / `createIncidenteCliente` → notifican al **despachador
  humano** (`usuarios: [despachadorId]`, `href: '/agente_911/despacho'`) — es
  el ejemplo de arriba.
- `createDespacho` / `enviarRefuerzos` → notifican al **oficial de campo**
  asignado (`usuarios: [...]` resuelto por `no_nomina` → `ofi_oficiales.user_id`,
  `href` default del catálogo `/oficial/despachos/{id}`). Ver [[911]] regla 18,
  [[Reporte Campo]].

El nombre del evento describe *qué pasó* ("se asignó un despacho"), no *a
quién* — cada call-site decide la audiencia explícita con `usuarios`/`roles`.
Si agregas un call-site nuevo a un evento existente, documenta la audiencia en
el catálogo o en un comentario junto al `emitir()`, para que no se asuma que
todos los usos comparten destinatario.

**3. Si el flujo puede reintentarse** (retry de red, doble click, cron que
corre cada N minutos), agrega `dedup` para no duplicar la notificación:

```ts
await emitir('busqueda_plazo', {
  mensaje: `...`,
  entidadId: String(ficha.id),
  dedup: `busqueda_plazo:${ficha.id}:${hito}`, // única por (evento, ficha, hito)
})
```

Sin `dedup`, cada llamada inserta una fila nueva aunque el mensaje sea idéntico.

### Dónde NO instrumentar

Evita `emitir()` en operaciones de alto volumen sin valor humano: telemetría GPS,
sincronizaciones masivas periódicas, updates de campo trivial (`actualizarCampo`
genérico). Cada llamada es una fila nueva en `notificaciones_eventos` × N
destinatarios del rol — instrumentar algo que corre cada pocos segundos por
usuario satura la campanita de todos y ensucia la auditoría.

### Extracción a servicio compartido si hay rutas gemelas

Si una entidad tiene dos caminos que hacen el mismo `INSERT`/`UPDATE` (p. ej.
una server action y un endpoint de API que hacen lo mismo para dos clientes
distintos), pon `emitir()` en una función de servicio que ambas llamen — nunca
en las dos por separado, o la notificación se duplica.

---

## Checklist de integración en proyecto nuevo

1. Correr la migración SQL (adaptar tipos de `rol_id`/`user_id` a tu esquema).
2. Copiar `lib/notificaciones/{types,catalogo,emisor,repository,mapper,actions,admin-actions}.ts`.
3. Adaptar `catalogo.ts`: reemplazar `EVENTOS` por los del dominio nuevo.
4. Adaptar `⚠` en `actions.ts`/`admin-actions.ts`/rutas API: import de `auth`, `getUserWithRole`, check de admin.
5. Copiar `hooks/usePolling.ts` si no existe ya.
6. Copiar rutas API (`contador`, listado, `leer`, `cron`).
7. Copiar `CampanillaNotificaciones.tsx`, ajustar paleta de colores inline.
8. Montarla en el/los componente(s) de header compartido del proyecto destino.
9. Crear `app/notificaciones/page.tsx` (historial) si se quiere esa vista.
10. Crear las 4 páginas de admin si el proyecto tiene panel de administración; si no, omitir y dejar sólo `emitir()` + campanita.
11. Instrumentar: una llamada a `emitir(evento, {...})` **después del commit** en cada punto de negocio relevante. Nunca dentro de una transacción explícita.
12. Configurar `CRON_SECRET` y el cron en la plataforma de hosting.
13. Verificar: `tsc --noEmit`, build, y el escenario de "leído por persona" (dos usuarios del mismo rol, uno marca leída, el otro sigue viendo sin leer).

## Riesgos / trampas conocidas

- **Emitir dentro de una transacción `BEGIN/COMMIT` explícita** deja notificaciones fantasma si la tx aborta — emitir siempre después del commit.
- **Doble emisión**: si una entidad de negocio tiene dos rutas que hacen el mismo INSERT (server action + endpoint API gemelo), pon `emitir()` en un servicio compartido, no en ambas, o duplicarás la notificación.
- **Ruido**: instrumentar muchos eventos de golpe puede saturar al usuario. Defaults del catálogo conservadores; la matriz del admin es la válvula de ajuste.
- **Roles de prueba/basura**: filtra `activo = true` en cualquier query de roles usada por la matriz.

---

# Push a dispositivo (Web Push / VAPID)

Las notificaciones in-app de arriba llegan solo si la pestaña está abierta y
visible (polling 30s). El **push** replica el mismo evento como notificación
del sistema operativo al celular/laptop, aun con la pestaña cerrada. Se
implementa con **Web Push estándar (VAPID)** — **no** Firebase Cloud
Messaging: el `sw.js` ya era manual y sin dependencias, y el modelo de
audiencia (rol/usuario resuelto en `emisor.ts`) ya resuelve lo que FCM daría
vía "topics". No hay cuenta/SDK externo.

## Arquitectura

- **Un solo punto de integración en `emisor.ts`**: dentro de `emitir()`,
  después del `INSERT` exitoso en `notificaciones_eventos`, se dispara
  `enviarPush(fila.rolId, fila.userId, payload)` **sin `await`**
  (fire-and-forget — seguro porque el deploy es un servidor Node persistente
  `next start`, no serverless; en serverless este supuesto habría que
  revisarlo). Con esto **todos** los eventos del catálogo heredan push
  automáticamente — no se toca ningún call site de negocio
  (`lib/incidentes/`, `lib/fiscalia/`, `lib/agente_juzgado/`, etc.).
- **`RETURNING id` + `ON CONFLICT ... DO NOTHING`**: el push solo se dispara
  cuando la fila se insertó de verdad. Los eventos con `dedup` (`despacho.
  asignado`, `despacho.en_camino`/`en_sitio`, `busqueda_plazo`) no re-notifican
  por push en un reintento ya deduplicado.
- **Payload mínimo**: `{ titulo, mensaje, href, severidad }` — mismos campos
  que la campanita in-app. Sin acciones enriquecidas ni imágenes.
- **Suscripciones muertas**: un envío que responde 404/410 (usuario revocó el
  permiso o desinstaló) borra esa suscripción en el momento.

## Tabla `push_subscriptions`

```sql
CREATE TABLE push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  creado_en timestamptz NOT NULL DEFAULT NOW(),
  ultimo_uso timestamptz
);
```

- `endpoint` es **único por dispositivo+navegador+origen** (lo asigna el push
  service del navegador) → `UNIQUE` evita duplicar la misma suscripción si el
  usuario repite el toggle.
- Un usuario puede tener **varias filas** (celular + laptop + tablet) — el
  fan-out de un evento manda a todas.
- `ON DELETE CASCADE`: borrar un usuario borra sus suscripciones.
- `user_id` es `text` porque así es `users.id` en better-auth.

## Módulo nuevo `lib/push/` (mismo patrón de capas)

```
lib/push/
├── types.ts       — PushSubscriptionRow, PayloadPush, SuscripcionCliente
├── repository.ts  — guardarSuscripcion, eliminarSuscripcion, tieneSuscripcion, suscripcionesParaAudiencia
├── service.ts     — enviarPush(rolId, userId, payload): web-push + limpieza 404/410
└── actions.ts     — 'use server': suscribirPush/desuscribirPush/estadoSuscripcion (reusan sesionConRol())
```

- `suscripcionesParaAudiencia(rolId, userId)` expande el rol a personas reales
  (`JOIN users ON rol_id = $1 AND activo = true` O `user_id = $2`) porque el
  push va por dispositivo, no por rol.
- `enviarPush` **nunca lanza** (mismo contrato que `emitir()`).
- `service.ts` configura VAPID en módulo (`setVapidDetails`) con
  `VAPID_SUBJECT`/`VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY`.

## Cliente

- `hooks/usePushSubscription.ts` — ciclo completo: detección de soporte
  (`PushManager`/`serviceWorker`), permiso (`Notification.requestPermission`,
  solo desde un gesto del usuario), alta/baja (`pushManager.subscribe` con
  `applicationServerKey` = `NEXT_PUBLIC_VAPID_PUBLIC_KEY` decodificada de
  base64url), estado reflejado contra `estadoSuscripcion()`.
- `components/notificaciones/TogglePush.tsx` — ítem dentro del dropdown de
  `CampanillaNotificaciones.tsx` (antes del link "Ver todas"). Estados:
  activar / desactivar / cargando / denegado / no-soportado (este último se
  oculta). No se creó pantalla de configuración nueva.

## Service worker (`public/sw.js`)

2 listeners **agregados** (no se tocó la lógica offline `install`/`activate`/
`fetch`; `VERSION` bump a `centinela-offline-v2` para forzar actualización):

- `push` — `event.data.json()` con fallback a texto plano (un JSON inválido
  nunca debe tirar excepción dentro del SW). Muestra `showNotification` con
  `tag: href` (varias notificaciones al mismo destino se colapsan si el
  dispositivo estuvo offline) y `requireInteraction: severidad === 'critico'`.
- `notificationclick` — cierra, enfoca/`navigate` a `data.href` si hay una
  ventana del mismo origen, o `openWindow` si no.

## Variables de entorno (ver `Variables de Entorno.md`)

`VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` (par servidor, secreto),
`NEXT_PUBLIC_VAPID_PUBLIC_KEY` (la misma pública, expuesta al cliente para
`pushManager.subscribe`), `VAPID_SUBJECT` (mailto: de contacto, requerido por
el protocolo).

## Limitación de plataforma (no es bug del sistema)

- **Android** (Chrome/Edge/Firefox): push funciona sin instalar la PWA, basta
  el permiso de notificaciones.
- **iOS/iPadOS Safari**: push **solo funciona con la PWA instalada al Home
  Screen** (Safari 16.4+). En pestaña normal Safari no soporta Push API. Por
  eso la instalabilidad (ver `PWA Offline.md`) es requisito del push en
  iPhone/iPad — hardware real de oficiales de campo.
- **Safari desktop** (macOS 13+): soporta push con matices; no se optimiza
  para ese caso, degrada con gracia (toggle oculto / denegado).
- **Fue un decisión de arquitectura previa que push NO existía** (modelo
  serverless); ahora el deploy es Node persistente y sí se puede disparar
  fire-and-forget. Documentación histórica del "sin push" sigue en `911.md`
  regla 18 / `Reporte Campo.md` — obsoleta para este punto.
- Si notificas por **permiso** en vez de por **rol**, cambia `idsRolesPorNombre`/`rolesSuscritos` por su equivalente de permisos — pero perderás la matriz simple evento×rol y ganarás granularidad.
