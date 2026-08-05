# Etapa 4 — API: `app/api/reporte-detenidos/generar-ppt/route.ts`

## Contexto (resumen — ver `00-contexto.md`)

Requiere las Etapas 1-3 ya construidas (permiso `reporte_detenidos`, `listarDetenidosCompletos()`, `generarPptAgrupado()`). Esta etapa expone un endpoint `POST` que genera el `.pptx` y lo devuelve como binario, igual que `app/api/monitorista/detenidos/generar-ppt/route.ts`, pero **sin body** (no hay filtros de fecha ni estado — siempre genera las 3 secciones).

## Objetivo

`POST /api/reporte-detenidos/generar-ppt` → valida sesión + permiso `reporte_detenidos`/`ver` → llama `generarPptAgrupado()` → responde el `.pptx` → registra auditoría.

## Archivo a crear: `app/api/reporte-detenidos/generar-ppt/route.ts`

Usa `registrarAudit()` de `lib/incidentes/audit.ts` (mecanismo genérico de auditoría del proyecto, tabla `audit_log`) en vez de `insertHistorial()` de Monitorista (esa función inserta en `monitorista_historial`, tabla específica de ese dominio, no aplica aquí):

```ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { generarPptAgrupado } from '@/lib/reporte-detenidos/ppt-service'
import { tienePermiso } from '@/lib/reporte-detenidos/permisos'
import { registrarAudit } from '@/lib/incidentes/audit'

export async function POST(_req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'reporte_detenidos', 'ver'))) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }

  try {
    const buf = await generarPptAgrupado()

    await registrarAudit({
      userId: session.user.id,
      accion: 'VIEW',
      entidad: 'reporte_detenidos',
      entidadId: 'ppt_generado',
    })

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="reporte_detenidos_${new Date().toISOString().split('T')[0]}.pptx"`,
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    console.error('[reporte-detenidos/generar-ppt]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
```

## Qué NO tocar en esta etapa

- No crear la página todavía (Etapa 5).
- No tocar `app/api/monitorista/detenidos/generar-ppt/route.ts` (se elimina en la Etapa 7, no antes).

## Criterios de aceptación

1. `npx tsc --noEmit` pasa sin errores nuevos.
2. Con un usuario sin permiso `reporte_detenidos`, un `POST` a `/api/reporte-detenidos/generar-ppt` responde `403`.
3. Con un usuario con permiso, y datos reales en la BD de desarrollo, el `POST` responde un binario `.pptx` descargable (probar con `curl -X POST ... -o test.pptx` o desde el navegador con la sesión activa).
4. Si no hay detenidos completos en ningún rango, responde `500` con el mensaje de error de `generarPptAgrupado()` (no un archivo corrupto).
