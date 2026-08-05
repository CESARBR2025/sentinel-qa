# Etapa 4 — Vista de tabla `/formatos-udai/faltas-administrativas`

Leer primero `00-contexto.md`. Depende de la Etapa 3.

## Objetivo

Página de solo lectura con las 34 columnas del formato oficial, calcando el patrón visual de `app/reporte-detenidos/page.tsx` (tabla dentro de contenedor con `overflow: auto`, `PageHeader` con acciones, `DashboardHeader`/`DashboardFooter`). Con 34 columnas la tabla es ancha — el contenedor ya tiene `overflow: auto`, eso resuelve el scroll horizontal, no hace falta nada especial.

## Archivo a crear: `app/formatos-udai/faltas-administrativas/page.tsx`

Mismo esqueleto que `app/reporte-detenidos/page.tsx`:

```tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { tienePermiso } from '@/lib/formatos-udai/permisos'
import { listarFaltasAdministrativas } from '@/lib/formatos-udai/repository'
import { BotonExportarExcel } from '@/components/formatos-udai/BotonExportarExcel'

const COLUMNAS: { header: string; key: string }[] = [
  { header: 'Fecha', key: 'fecha' },
  { header: 'Hora', key: 'hora' },
  { header: 'Responsable de Turno', key: 'responsableTurno' },
  { header: 'Hora de Salida', key: 'horaSalida' },
  { header: 'IPH', key: 'iph' },
  { header: 'Folio Tablet', key: 'folioTablet' },
  { header: 'Apellido Paterno', key: 'apellidoPaterno' },
  { header: 'Apellido Materno', key: 'apellidoMaterno' },
  { header: 'Nombre', key: 'nombre' },
  { header: 'Fecha de Nacimiento', key: 'fechaNacimiento' },
  { header: 'Edad', key: 'edad' },
  { header: 'Género', key: 'genero' },
  { header: 'Alias', key: 'alias' },
  { header: 'Ciudad de Origen Det.', key: 'ciudadOrigen' },
  { header: 'Calle Det.', key: 'calleDet' },
  { header: 'Número', key: 'numero' },
  { header: 'Colonia Det.', key: 'coloniaDet' },
  { header: 'Artículo', key: 'articulo' },
  { header: 'Tipo de Falta Administrativa', key: 'tipoFalta' },
  { header: 'Registro Nacional de Detenidos', key: 'rnd' },
  { header: 'Lugar de Arresto (Calle y/o Avenida)', key: 'lugarArresto' },
  { header: 'Colonia', key: 'colonia' },
  { header: 'Oficial que Remite', key: 'oficialQueRemite' },
  { header: 'Oficial que Remite (2)', key: 'oficialQueRemite2' },
  { header: 'Sector', key: 'sector' },
  { header: 'Agrupamiento', key: 'agrupamiento' },
  { header: 'Coordenadas Latitud', key: 'latitud' },
  { header: 'Coordenadas Longitud', key: 'longitud' },
  { header: 'Presencia', key: 'presencia' },
  { header: 'Verbalización', key: 'verbalizacion' },
  { header: 'Control de Contacto', key: 'controlContacto' },
  { header: 'Control Físico', key: 'controlFisico' },
  { header: 'Técnicas Defensivas No Letales', key: 'tecnicasNoLetales' },
  { header: 'Fuerza Potencial Letal', key: 'fuerzaLetal' },
]

const BOOLEAN_KEYS = new Set(['presencia', 'verbalizacion', 'controlContacto', 'controlFisico', 'tecnicasNoLetales', 'fuerzaLetal'])

function celda(valor: unknown, key: string): string {
  if (BOOLEAN_KEYS.has(key)) return valor ? 'SI' : ''
  if (valor === null || valor === undefined || valor === '') return '—'
  return String(valor)
}

export default async function FaltasAdministrativasPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'formatos_udai', 'ver'))) redirect('/formatos-udai')

  const user = session.user as { name: string; apellido?: string; email: string }
  const registros = await listarFaltasAdministrativas()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <DashboardHeader user={user} roleLabel="Formatos UDAI" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Formato"
          accent="Faltas Administrativas"
          subtitle="Bitácora de detenidos por falta administrativa — formato oficial UDAI"
          actions={<>
            <PageHeaderLink href="/formatos-udai" variant="secondary">← Formatos UDAI</PageHeaderLink>
            <BotonExportarExcel />
          </>}
        />

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 12, whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                {COLUMNAS.map(c => (
                  <th key={c.key} style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>{c.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 && (
                <tr><td colSpan={COLUMNAS.length} style={{ padding: 32, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#94a3b8' }}>No hay registros IPH capturados</td></tr>
              )}
              {registros.map(r => (
                <tr key={r.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  {COLUMNAS.map(c => (
                    <td key={c.key} style={{ padding: '10px 14px' }}>{celda((r as unknown as Record<string, unknown>)[c.key], c.key)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DashboardFooter />
      </main>
    </div>
  )
}
```

## Archivo a crear: `components/formatos-udai/BotonExportarExcel.tsx`

Calcar `components/reporte-detenidos/BotonGenerarPpt.tsx` (mismo patrón de fetch + blob + descarga), apuntando a `GET /api/formatos-udai/faltas-administrativas/exportar` (la Etapa 5 la crea) y con nombre de archivo `formato_faltas_administrativas_<fecha>.xlsx`. Cambia el ícono a `FileSpreadsheet` o `Download` y el texto del botón a "EXPORTAR XLSX" / "EXPORTANDO...".

## Verificación

1. `npx tsc --noEmit`.
2. En navegador (la hace el usuario): la tabla carga con los registros reales de `iph_detenidos`, scroll horizontal funciona, las columnas GAP (`Hora de Salida`, `Folio Tablet`, `Oficial que Remite (2)`) se ven vacías (`—`) sin romper el layout.

## Criterios de aceptación

- Las 34 columnas están presentes en el mismo orden que el Excel oficial.
- El botón de exportar existe en la UI aunque el endpoint aún no exista (fallará hasta la Etapa 5 — es esperado, no lo bloquees).
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 5.**
