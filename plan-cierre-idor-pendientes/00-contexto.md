# Contexto — leer antes de tocar cualquier etapa

## De dónde vienen estos dos huecos

Al revisar la implementación de `plan-auditoria-url/` (ya construido, verificado contra la BD real, `tsc`/`build` limpios) se encontraron dos casos con el mismo patrón de riesgo (id/recurso adivinable o sin check de sección) que quedaron fuera del alcance original:

1. `/monitorista/solicitudes/[id]` (solicitudes **generales**, no las de denuncia) sigue mostrando el id interno en la URL — la Etapa 2 de `plan-auditoria-url` solo tokenizó expediente/detenido/denuncia.
2. `app/api/uploads/[...path]/route.ts` solo exige que haya sesión, sin verificar que el usuario tenga permiso sobre el módulo dueño del archivo — cualquier usuario autenticado de cualquier rol puede pedir cualquier archivo subido si conoce/adivina la ruta.

Investigado el código real: **todos los archivos bajo `uploads/` hoy los escribe únicamente `lib/prevencion/actions.ts`**, con dos prefijos:

```
uploads/medidas_proteccion/${folio}/prorroga/${filename}
uploads/busquedas/${fichaId}/seguimientos/${filename}
```

Y los únicos consumidores de `/api/uploads/...` en el frontend son `components/prevencion/SeguimientoTimeline.tsx` y `components/prevencion/ProrrogaViewerModal.tsx`. Esto acota la Etapa 2 a un mapa de solo 2 entradas (`busquedas` → sección `busquedas`, `medidas_proteccion` → sección `medidas`), no a un sistema genérico.

## `lib/recursos/token-recurso.ts` — ya existe, no lo reinventes

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

La tabla `tokens_recurso` ya está migrada en la BD real (verificado: columnas `token uuid PK`, `tipo text`, `recurso_id text`, `creado_en`, `UNIQUE(tipo, recurso_id)`). La Etapa 1 solo llama a estas dos funciones con `tipo = 'solicitud'` — no toca este archivo.

## `app/monitorista/solicitudes/page.tsx` — bandeja, genera los links

```ts
const mapGral = (rows: SolicitudEvidencia[], origen: 'pendiente' | 'completada') =>
  rows.map(r => ({
    id: String(r.id), origen: 'general' as const, entidadId: String(r.incidenteId), solicitudId: null as number | null,
    folio: String(r.folioIncidente ?? ''), solicitadoNombre: String(r.solicitadoNombre ?? ''),
    descripcion: String(r.descripcion ?? ''), status: origen, creadoEn: String(r.creadoEn ?? ''),
    completadoEn: r.completadoEn ? String(r.completadoEn) : null, totalEvidencias: Number(r.totalEvidencias ?? 0),
  }))

// ...
const pendientes = [...denunciaItemsPend, ...mapGral(gralPend, 'pendiente')]
const completadas = [...denunciaItemsAtend, ...mapGral(gralComp, 'completada')]
```

Nota: `mapGral` hoy es **síncrona** (`.map` normal). La Etapa 1 la vuelve async porque `obtenerOCrearToken` hace una consulta a la BD — hay que await-ear también en los dos call sites (`pendientes`/`completadas`). El patrón exacto ya existe en `lib/fiscalia/actions.ts` (función `conToken` agregada por `plan-auditoria-url`, Etapa 2) — mismo estilo, no lo reinventes.

## `components/monitorista/BandejaSolicitudes.tsx` — renderiza los links

```tsx
interface SolicitudRow {
  id: string
  origen: 'denuncia' | 'general'
  entidadId: string
  denunciaToken?: string
  solicitudId: number | null
  folio: string
  solicitadoNombre: string | null
  // ...
}

// ...
{s.origen === 'denuncia' ? (
  <Link href={`/monitorista/denuncias/${s.denunciaToken ?? s.entidadId}`} style={btnDetalle}>
    <Eye size={14} /> VER DENUNCIA
  </Link>
) : (
  <Link href={`/monitorista/solicitudes/${s.id}`} style={btnDetalle}>
    <Eye size={14} /> VER
  </Link>
)}
```

La rama `s.origen === 'denuncia'` ya usa `denunciaToken` (hecho por `plan-auditoria-url`). La Etapa 1 de este plan hace lo mismo para la rama `else` (general), agregando un campo `token?: string` a `SolicitudRow`.

## `app/monitorista/solicitudes/[id]/page.tsx` — página de detalle

```ts
export default async function DetalleSolicitudPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'ver'))) redirect('/monitorista')

  const sol = await obtenerSolicitudEvidencia(id)
  if (!sol) notFound()

  const evidencias: Evidencia[] = await listarEvidencias(id)
  // ...
}
```

Ya tiene el check de sección (`tienePermiso(..., 'solicitudes', 'ver')`) — el único problema es que `id` es el id interno crudo. La Etapa 1 agrega la resolución de token antes de las consultas, mismo patrón que `app/monitorista/detenidos/[id]/page.tsx` (ya hecho en `plan-auditoria-url`).

## `app/api/uploads/[...path]/route.ts` — código real completo

```ts
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const MIME: Record<string, string> = {
  '.pdf':  'application/pdf',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.doc':  'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { path: segments } = await params
  // Prevent path traversal
  const safe = segments.map(s => s.replace(/\.\./g, '')).filter(Boolean)
  const filePath = path.join(process.cwd(), 'uploads', ...safe)

  try {
    const buffer = await fs.readFile(filePath)
    const ext    = path.extname(filePath).toLowerCase()
    const mime   = MIME[ext] ?? 'application/octet-stream'
    return new NextResponse(buffer, {
      headers: {
        'Content-Type':        mime,
        'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 })
  }
}
```

El check de sesión ya existe y el saneamiento de `../` en el path también — lo único que falta es el check de **sección** sobre el primer segmento de la ruta.

## `lib/prevencion/permisos.ts` — wrapper a reusar en la Etapa 2

```ts
export const SECCIONES = ['busquedas', 'medidas', 'solicitudes'] as const
export type Seccion = typeof SECCIONES[number]

export async function tienePermiso(usuarioId: string, seccion: Seccion, accion: Accion): Promise<boolean> {
  return core.tienePermiso(usuarioId, seccion, accion)
}
```

La Etapa 2 importa `tienePermiso` de aquí (no de `lib/permisos/core` directo) — mismo patrón que ya usan `app/prevencion/busquedas/page.tsx` y `app/prevencion/medidas/page.tsx`.
