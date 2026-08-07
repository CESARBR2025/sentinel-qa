# Etapa 5 — Página `/dashboard/kpis` (layout + segmentos SSPM/Infracciones + tab 911)

Depende de la Etapa 4 (`Panel911`).

## Objetivo

Nueva ruta admin-gated con dos niveles de `SegmentPage` (`components/partials/SegmentPage.tsx` — prohibido reimplementar, `DESIGN.md §4`):
- **Nivel 1**: `SSPM` / `Infracciones`.
- **Nivel 2** (solo dentro de SSPM): `911` (único tab por ahora).

Navegación por **query param** (server-safe, mismo patrón que otras vistas con `SegmentPage` + `href`), no estado de cliente — así el rango de fecha y el tab seleccionado son bookmarkeables.

## Archivo nuevo: `app/dashboard/kpis/layout.tsx`

Copiar **exactamente** el patrón de `app/dashboard/catalogos/layout.tsx` (gate `esAdmin`, `DashboardHeader`, footer):

```tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/auth/helpers'
import { DashboardHeader } from '@/components/partials/Header'
import { APP_VERSION } from '@/lib/constants'

export default async function KpisLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const u = await getUserWithRole(session.user.id)
  if (!u?.esAdmin) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>
      <DashboardHeader user={user} variant="apple" backHref="/dashboard" roleLabel="KPIs Generales" />
      <div className="pad-dashboard" style={{ maxWidth: 1600, margin: '0 auto' }}>
        {children}
      </div>
    </main>
  )
}
```

Nota: `app/dashboard/page.tsx` usa `variant="apple"` en `DashboardHeader` (línea 42) — seguir el mismo, **no** el patrón táctico de `catalogos/layout.tsx` (ese sigue en Barlow/JetBrains porque no se ha migrado). Verificar en `components/partials/Header.tsx` qué props acepta `DashboardHeader` (`variant`, `backHref`, `roleLabel`) antes de asumir que existen tal cual — están confirmados en `app/dashboard/page.tsx:42` y `app/agente_despacho/kpi-incidencias/page.tsx`, pero revisar la firma completa.

## Archivo nuevo: `app/dashboard/kpis/page.tsx`

Server component. Recibe `searchParams` con `seccion` (`'sspm' | 'infracciones'`, default `'sspm'`) y `modulo` (default `'911'`, sin otros valores válidos por ahora).

```tsx
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { SegmentPage } from '@/components/partials/SegmentPage'
import { Panel911 } from '@/components/911/kpi-generales/Panel911'

export default async function KpisPage({ searchParams }: { searchParams: Promise<{ seccion?: string }> }) {
  const { seccion = 'sspm' } = await searchParams

  return (
    <div>
      <PageHeader
        title="KPIs Generales"
        accent="SSPM"
        subtitle="Indicadores operativos por área"
        actions={<PageHeaderLink href="/dashboard" variant="secondary">← Dashboard</PageHeaderLink>}
      />

      <SegmentPage
        tabs={[
          { key: 'sspm', label: 'SSPM', href: '/dashboard/kpis?seccion=sspm' },
          { key: 'infracciones', label: 'Infracciones', href: '/dashboard/kpis?seccion=infracciones' },
        ]}
        activeKey={seccion}
      />

      {seccion === 'sspm' && <SeccionSspm />}
      {seccion === 'infracciones' && <SeccionInfraccionesPlaceholder />}
    </div>
  )
}

function SeccionSspm() {
  return (
    <div style={{ marginTop: 24 }}>
      <SegmentPage
        tabs={[{ key: '911', label: '911' }]}
        activeKey="911"
        marginBottom={20}
      />
      <Panel911 />
    </div>
  )
}

function SeccionInfraccionesPlaceholder() {
  return (
    <div style={{
      marginTop: 24, padding: 48, textAlign: 'center',
      background: 'var(--apple-glass-bg)', backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid var(--apple-glass-border)', borderRadius: 'var(--radius-xl)',
      fontFamily: 'var(--apple-font-display)', color: '#64748b',
    }}>
      Próximamente
    </div>
  )
}
```

El tab de nivel 2 (`911`) queda con un solo elemento a propósito (`00-contexto.md`, "fuera de alcance") — no agregar tabs para módulos que aún no se construyen, ni un `href` que dispare navegación (es el único tab, no necesita ser clickeable a otra parte).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. `npm run build` sin errores.
3. Login como admin → `/dashboard/kpis` → tab SSPM activo por default → tab 911 visible con `Panel911` renderizado.
4. Click en "Infracciones" → cambia la URL a `?seccion=infracciones` → muestra placeholder "Próximamente".
5. Login como no-admin → intentar entrar directo a `/dashboard/kpis` → redirige a `/dashboard`.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 6.
