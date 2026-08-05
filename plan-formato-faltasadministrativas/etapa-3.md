# Etapa 3 — Navegación: carpeta "Formatos UDAI" en `/agente_reportes` + hub `/formatos-udai`

Leer primero `00-contexto.md`. Depende de la Etapa 2 (permisos ya registrados).

Antes de tocar cualquier UI, lee `DESIGN.md` completo (regla del proyecto) — reutiliza los tokens y componentes de ahí, no inventes estilos nuevos.

## Objetivo

1. Agregar una card "Formatos UDAI" en `/agente_reportes` (`app/agente_reportes/page.tsx`) que enlaza a `/formatos-udai`.
2. Crear `/formatos-udai` como un hub intermedio (la "carpeta") con una sola card por ahora: "Formato Faltas Administrativas", que enlaza a `/formatos-udai/faltas-administrativas`.

Ambas vistas reutilizan `OptionSquare` (`components/reportes/menuOption.tsx`) — es el mismo componente que ya arma toda la grilla de cards en `/agente_reportes`. No crear un componente de card nuevo.

## Archivo a modificar: `app/agente_reportes/page.tsx`

1. Agregar `'formatos_udai'` al array de `obtenerPermisosUsuario(...)` en la línea 36.
2. Agregar una nueva sección al array `secciones` (después de "Coordinación (Formato N)"):

```tsx
{
  titulo: 'Formatos UDAI',
  cards: [
    {
      titulo: 'Formatos UDAI',
      subtitulo: 'Formatos oficiales UDAI generados a partir de los registros IPH capturados en el sistema.',
      icono: <FolderClock size={28} />, // o el ícono lucide-react que prefieras; ya está importado
      enlace: '/formatos-udai',
      seccion: 'formatos_udai',
      estadisticas: [],
    },
  ],
},
```

(Revisa qué íconos ya están importados en la cabecera del archivo — reutiliza uno existente o agrega el import de `lucide-react` que corresponda, ej. `Folder` o `FileSpreadsheet`.)

## Archivo a crear: `app/formatos-udai/page.tsx`

Server component, mismo patrón que `app/agente_reportes/page.tsx` pero solo con una sección y una card:

```tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileSpreadsheet } from 'lucide-react'
import { OptionSquare } from '@/components/reportes/menuOption'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { DashboardFooter } from '@/components/partials/Footer'
import { tienePermiso } from '@/lib/formatos-udai/permisos'

export default async function FormatosUdaiPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'formatos_udai', 'ver'))) redirect('/agente_reportes')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader user={user} roleLabel="Formatos UDAI" backHref="/agente_reportes" />

      <main className="pad-dashboard" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <PageHeader
          title="Formatos"
          accent="UDAI"
          subtitle="Formatos oficiales generados a partir de los registros capturados en el sistema"
        />

        <div className="cat-cards-grid">
          <OptionSquare
            titulo="Formato Faltas Administrativas"
            subtitulo="Bitácora de detenidos por falta administrativa, en el formato oficial UDAI, exportable a Excel."
            icono={<FileSpreadsheet size={28} />}
            enlace="/formatos-udai/faltas-administrativas"
            estadisticas={[]}
          />
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
```

Verifica los props reales de `DashboardHeader` y `PageHeader` (algunos aceptan `backHref`/`backLabel`, otros no) leyendo `components/partials/Header.tsx` y `components/partials/PageHeader.tsx` antes de copiar esto tal cual — ajusta si algo no coincide.

## Verificación

1. `npx tsc --noEmit`.
2. En navegador (la hace el usuario): `/agente_reportes` muestra la card "Formatos UDAI"; al hacer clic entra a `/formatos-udai`; ahí se ve la card "Formato Faltas Administrativas" (el enlace a `/formatos-udai/faltas-administrativas` dará 404 hasta la Etapa 4, es esperado).

## Criterios de aceptación

- La navegación de dos niveles funciona: `/agente_reportes` → `/formatos-udai` → (Etapa 4) tabla.
- Se reutilizó `OptionSquare`, `PageHeader`, `DashboardHeader`, `DashboardFooter` tal cual existen — cero componentes de UI nuevos en esta etapa.
- El gate de permiso (`formatos_udai`) protege `/formatos-udai`.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 4.**
