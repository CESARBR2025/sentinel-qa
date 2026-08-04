# Etapa 1 — Token opaco para `/monitorista/solicitudes/[id]` (solicitudes generales)

> Lee primero [`00-contexto.md`](./00-contexto.md). Independiente de la Etapa 2 (archivos distintos). Reusa `lib/recursos/token-recurso.ts` tal cual existe — no lo modifiques.

**Archivos a modificar:**
- `app/monitorista/solicitudes/page.tsx`
- `components/monitorista/BandejaSolicitudes.tsx`
- `app/monitorista/solicitudes/[id]/page.tsx`

## Objetivo

Que la URL de una solicitud general (`/monitorista/solicitudes/[id]`) muestre un token opaco persistente, igual que ya pasa con expediente/detenido/denuncia — sin tocar el id interno ni la lógica de permisos ya existente (`tienePermiso(..., 'solicitudes', 'ver')`, que se queda igual).

## Paso 1 — `app/monitorista/solicitudes/page.tsx`

Importar `obtenerOCrearToken` y volver `mapGral` async (agrega `token` a cada fila, con `tipo = 'solicitud'`):

```ts
import { obtenerOCrearToken } from '@/lib/recursos/token-recurso'

// ...

const mapGral = async (rows: SolicitudEvidencia[], origen: 'pendiente' | 'completada') =>
  Promise.all(rows.map(async r => ({
    id: String(r.id),
    token: await obtenerOCrearToken('solicitud', String(r.id)),
    origen: 'general' as const, entidadId: String(r.incidenteId), solicitudId: null as number | null,
    folio: String(r.folioIncidente ?? ''), solicitadoNombre: String(r.solicitadoNombre ?? ''),
    descripcion: String(r.descripcion ?? ''), status: origen, creadoEn: String(r.creadoEn ?? ''),
    completadoEn: r.completadoEn ? String(r.completadoEn) : null, totalEvidencias: Number(r.totalEvidencias ?? 0),
  })))
```

Y los dos call sites, ahora con `await`:

```ts
const pendientes  = [...denunciaItemsPend, ...(await mapGral(gralPend, 'pendiente'))]
const completadas = [...denunciaItemsAtend, ...(await mapGral(gralComp, 'completada'))]
```

## Paso 2 — `components/monitorista/BandejaSolicitudes.tsx`

Agregar el campo opcional a la interfaz:

```ts
interface SolicitudRow {
  id: string
  origen: 'denuncia' | 'general'
  entidadId: string
  denunciaToken?: string
  token?: string   // nuevo: token de la solicitud general (tipo 'solicitud')
  solicitudId: number | null
  folio: string
  solicitadoNombre: string | null
  // ... (resto igual)
}
```

Y el `Link` de la rama `general`:

```tsx
<Link href={`/monitorista/solicitudes/${s.token ?? s.id}`} style={btnDetalle}>
  <Eye size={14} /> VER
</Link>
```

## Paso 3 — `app/monitorista/solicitudes/[id]/page.tsx`

Resolver el token antes de consultar el recurso, mismo patrón que `app/monitorista/detenidos/[id]/page.tsx`:

```ts
import { resolverToken } from '@/lib/recursos/token-recurso'

export default async function DetalleSolicitudPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'ver'))) redirect('/monitorista')

  // El segmento de la URL es un token opaco persistente, no el id interno.
  const idReal = await resolverToken('solicitud', id)
  if (!idReal) notFound()

  const sol = await obtenerSolicitudEvidencia(idReal)
  if (!sol) notFound()

  const evidencias: Evidencia[] = await listarEvidencias(idReal)
  // ... resto igual, sin más referencias a `id` crudo
}
```

## Notas de diseño

- El archivo tiene `// @ts-nocheck` al inicio — no lo quites, no es parte de este plan.
- El orden es igual al de fiscalia/detenidos/denuncias: primero permiso de sección, después resolver token, después 404 si no existe. Ya se validó en `plan-auditoria-url` que este orden no genera un oráculo de información (el permiso es de sección, no por-recurso, así que el orden entre ambos checks no cambia qué puede inferir un atacante).
- `mapGral` pasa a ser async — revisa que no haya otro call site de `mapGral` en el archivo que siga usándola sin `await` (solo debe haber los dos ya señalados, para `pendientes` y `completadas`).

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores nuevos.
- [ ] La bandeja de solicitudes generales (`/monitorista/solicitudes`) genera links con token (uuid), no con el id interno.
- [ ] Visitar `/monitorista/solicitudes/[id]` con el id interno crudo (en vez del token) da 404, no el contenido.
- [ ] Visitar el token real de una solicitud sigue funcionando igual que antes (misma página, mismos datos).
- [ ] La rama `denuncia` de `BandejaSolicitudes.tsx` (ya usa `denunciaToken`) no se ve afectada.
