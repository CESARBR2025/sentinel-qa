# Etapa 3 — API route admin-only

Depende de la Etapa 2 (`obtenerKpisGenerales911`).

## Objetivo

Endpoint `GET /api/incidentes/kpi-911-generales` que expone `obtenerKpisGenerales911(desde, hasta)`, protegido por `esAdmin` (no por permiso de sección — decisión ya tomada en `00-contexto.md`).

## Archivo nuevo: `app/api/incidentes/kpi-911-generales/route.ts`

Gate admin: copiar exactamente el patrón de `app/api/admin/roles/route.ts:1-21` (sesión + `getUserWithRole` + `esAdmin`). Parseo de query params: copiar el estilo de `app/api/incidentes/kpi-geo/route.ts` (validación básica, 400 si falta algo).

```ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { obtenerKpisGenerales911 } from '@/lib/911/service'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const user = await getUserWithRole(session.user.id)
  if (!user?.esAdmin) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const p = req.nextUrl.searchParams
  const desde = p.get('desde')
  const hasta = p.get('hasta')
  if (!desde || !hasta) {
    return NextResponse.json({ error: 'desde y hasta son requeridos' }, { status: 400 })
  }

  const data = await obtenerKpisGenerales911(desde, hasta)
  return NextResponse.json(data)
}
```

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Probar manualmente con `curl` (o el navegador logueado como admin) `GET /api/incidentes/kpi-911-generales?desde=2026-01-01&hasta=2026-12-31` → 200 con el JSON esperado.
3. Con sesión de un usuario no-admin (o sin sesión) → 403 / 401 respectivamente.
4. Sin `desde`/`hasta` → 400.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 4.
