# Etapa 2 — Autorización por sección en `/api/uploads/[...path]`

> Lee primero [`00-contexto.md`](./00-contexto.md). Independiente de la Etapa 1 (archivo distinto).

**Archivo a modificar:** `app/api/uploads/[...path]/route.ts`

## Objetivo

Que `/api/uploads/...` no sirva un archivo solo porque hay sesión — debe verificar que el usuario tenga permiso de **ver** sobre la sección dueña de ese archivo. Hoy todo lo que hay bajo `uploads/` lo escribe `lib/prevencion/actions.ts` en dos carpetas: `uploads/busquedas/...` (sección `busquedas`) y `uploads/medidas_proteccion/...` (sección `medidas`) — ver `00-contexto.md`.

## Cambio completo

```ts
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { tienePermiso } from '@/lib/prevencion/permisos'

const MIME: Record<string, string> = {
  '.pdf':  'application/pdf',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.doc':  'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

// Primer segmento de la ruta bajo uploads/ -> sección requerida para verla.
// Deny-by-default: cualquier carpeta no listada aquí se rechaza con 403, no
// se asume acceso libre. Si un módulo nuevo empieza a escribir en uploads/,
// agregar su entrada aquí.
const SECCION_POR_CARPETA: Record<string, 'busquedas' | 'medidas'> = {
  busquedas:          'busquedas',
  medidas_proteccion: 'medidas',
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

  const carpeta = safe[0]
  const seccion = carpeta ? SECCION_POR_CARPETA[carpeta] : undefined
  if (!seccion || !(await tienePermiso(session.user.id, seccion, 'ver'))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

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

## Notas de diseño

- El check de sección se hace **antes** de tocar el filesystem — evita gastar una lectura de disco en una request que de todos modos se va a rechazar, y evita que el mensaje de error distinga "no tienes permiso" de "no existe" por temporización (ambos casos devuelven rápido).
- No se agrega control por-recurso (ej. "solo tu propia ficha de búsqueda") — el modelo de permisos del proyecto es por sección, no por registro individual (el mismo criterio que ya aplican `busquedas`/`medidas` en sus páginas: cualquier usuario con `puede_ver` en la sección ve todos los registros de esa sección). Este check deja `/api/uploads` consistente con ese modelo, no le inventa uno más estricto.
- `tienePermiso` se importa de `lib/prevencion/permisos` (wrapper ya existente, `SECCIONES = ['busquedas', 'medidas', 'solicitudes']`), no de `lib/permisos/core` directo — mismo patrón que ya usan `app/prevencion/busquedas/page.tsx` y `app/prevencion/medidas/page.tsx`.
- Si `safe` queda vacío (`segments` vacío o solo `..`), `carpeta` es `undefined` y cae directo al 403 — no intenta leer un archivo con path inválido.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores.
- [ ] Un usuario con sección `busquedas` puede seguir abriendo adjuntos de seguimiento de búsquedas (`SeguimientoTimeline.tsx`) sin regresión.
- [ ] Un usuario con sección `medidas` puede seguir abriendo el documento de prórroga (`ProrrogaViewerModal.tsx`) sin regresión.
- [ ] Un usuario SIN ninguna de las dos secciones, pidiendo la misma URL de archivo (copiada/compartida), recibe 403.
- [ ] Una ruta con un primer segmento inventado (ej. `/api/uploads/no-existe/algo.pdf`) da 403, no 404 ni 500.
