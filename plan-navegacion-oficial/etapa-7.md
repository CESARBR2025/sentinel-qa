# Etapa 7 — Layout: corregir Page Assembly Pattern en `/oficial/despachos/[id]`

> Lee primero [`00-contexto.md`](./00-contexto.md). Independiente de las demás etapas en términos de código (solo toca el contenedor de la página), pero tiene más sentido aplicarla después de la Etapa 4, porque el mapa de `NavegacionDespacho` es lo que realmente necesita el ancho completo.

**Archivo a modificar:** `app/oficial/despachos/[id]/page.tsx`

## Objetivo

`boveda/🛠 Stack/Convenciones.md` documenta el "Page Assembly Pattern": contenedor de página en flex, sin `maxWidth`/anchos fijos — solo paddings internos. Hoy esta página viola esa regla con un `<main>` de `maxWidth: 900px` centrado, lo cual además le corta el ancho disponible al mapa de navegación de las etapas anteriores.

## Código actual completo del archivo

```tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { verificarRolOficial, listarDespachosAsignados } from '@/lib/oficial/service'
import { getCatalogos } from '@/lib/911/service'
import { obtenerHistorialCompleto } from '@/lib/incidentes/service'
import { obtenerIncidenteBasico } from '@/lib/incidentes/repository'
import { DashboardHeader } from '@/components/partials/Header'
import { DespachoContent } from '@/components/oficial/DespachoContent'
import { APP_VERSION } from "@/lib/constants"

export default async function AtenderDespachoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  // Solo puede atender incidentes asignados a él y aún en despacho
  const asignados = await listarDespachosAsignados(session.user.id)
  const asignacion = asignados.find(d => d.incidenteId === id)
  if (!asignacion) notFound()

  const [historial, catalogos, incidenteBasico] = await Promise.all([
    obtenerHistorialCompleto(id),
    getCatalogos(),
    obtenerIncidenteBasico(id),
  ])
  if (!historial || !incidenteBasico) notFound()

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        backHref="/oficial/despachos"
        backLabel="Mis despachos"
      />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 48px 64px' }}>

        <DespachoContent
          historial={historial}
          estatusInicial={incidenteBasico.estatus}
          incidenteId={id}
          asignacion={asignacion}
          catalogos={catalogos}
          user={session.user}
        />

        <footer style={{ padding: '24px 0 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 40 }}>
          SSPM · SAN JUAN DEL RÍO · CENTINELA {APP_VERSION} · OFICIAL
        </footer>
      </main>
    </div>
  )
}
```

## Cambio a aplicar

Reemplaza el contenedor raíz y el `<main>` para seguir el patrón documentado (contenedor de página en flex column, `<main>` con `flex:1, width:100%`, sin `maxWidth` fijo). El padding se mantiene (es espaciado interno, permitido por la convención), solo se elimina el ancho fijo y el centrado por margen:

```tsx
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        backHref="/oficial/despachos"
        backLabel="Mis despachos"
      />

      <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', padding: '40px 48px 64px', boxSizing: 'border-box' }}>

        <DespachoContent
          historial={historial}
          estatusInicial={incidenteBasico.estatus}
          incidenteId={id}
          asignacion={asignacion}
          catalogos={catalogos}
          user={session.user}
        />

        <footer style={{ padding: '24px 0 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 40 }}>
          SSPM · SAN JUAN DEL RÍO · CENTINELA {APP_VERSION} · OFICIAL
        </footer>
      </main>
    </div>
  )
```

Nada más del archivo cambia (imports, data fetching, guardas de sesión/rol quedan idénticos).

**No toques el interior de `DespachoContent.tsx`** en esta etapa — ya quedó en `flex` por dentro (Etapa 4). El `<main flex:1>` le da el ancho completo disponible; `DespachoContent` decide cómo repartirlo (el mapa a `flex:1`, el fallback de botones en una fila normal).

## Criterios de aceptación

- [ ] `npx tsc --noEmit` y `npm run build` sin errores.
- [ ] En pantallas anchas (desktop), el mapa de `NavegacionDespacho` ahora ocupa el ancho disponible completo del viewport (menos el padding), no queda acotado a 900px centrados.
- [ ] El `HistorialIncidente` y el `FormularioRecorrido embedded` (rama `en_sitio`) se siguen viendo correctamente — si alguno de esos dos componentes ya maneja su propio ancho de lectura interno (padding/max-width local), no hace falta tocarlos; si se ven "demasiado anchos" de forma clramente incorrecta, repórtalo como hallazgo antes de improvisar un ajuste no descrito aquí.
- [ ] El footer sigue centrado (`textAlign: 'center'`) y visible al final de la página.
- [ ] Verificar en mobile/viewport angosto que el padding (`48px` horizontal) no rompe el layout en pantallas pequeñas — si se ve mal, es un hallazgo a reportar, no está en el alcance de esta etapa ajustar breakpoints responsive nuevos.
