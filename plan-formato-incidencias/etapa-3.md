# Etapa 3 — Vista de tabla `/formatos-udai/reportes-incidencias`

Depende de Etapa 1 (repository/types) y Etapa 2 (link desde el hub). **Leer `DESIGN.md` completo antes de tocar esta UI** (regla del proyecto) — en particular la sección de `SegmentPage`, `PageHeader` y `.card-o`/`.tabla-wrap`.

## Archivos a crear

- `app/formatos-udai/reportes-incidencias/page.tsx`
- `components/formatos-udai/DetalleReporteIncidenciaModal.tsx`
- `components/formatos-udai/DetallePuestaDisposicionModal.tsx`

No crear archivos de ruta nuevos por tab (`/incidencia`, `/puestas-disposicion`) — es **un solo** `page.tsx` con 2 segmentos vía `searchParams.tab`, igual al patrón documentado de `SegmentPage` (navegación por URL, server-safe, sin estado de cliente en la página).

## 1. Página — `app/formatos-udai/reportes-incidencias/page.tsx`

Estructura calcada de `app/formatos-udai/faltas-administrativas/page.tsx` (mismo `DashboardHeader`, `PageHeader`, `.tabla-wrap`), con `SegmentPage` insertado entre el `PageHeader` y la tabla, y la tabla condicionada por el tab activo.

```tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileWarning, UserCheck } from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { SegmentPage } from '@/components/partials/SegmentPage'
import { tienePermiso } from '@/lib/formatos-udai/permisos'
import { listarReportesIncidencia, listarPuestasDisposicion } from '@/lib/formatos-udai/repository'
import { BotonExportarExcel } from '@/components/formatos-udai/BotonExportarExcel' // ver nota abajo sobre reutilización
import { DetalleReporteIncidenciaModal } from '@/components/formatos-udai/DetalleReporteIncidenciaModal'
import { DetallePuestaDisposicionModal } from '@/components/formatos-udai/DetallePuestaDisposicionModal'
import type { ReporteIncidenciaRow, PuestaDisposicionRow } from '@/lib/formatos-udai/types'

function celda(valor: unknown): string {
  if (valor === null || valor === undefined || valor === '') return '—'
  return String(valor)
}

const COLUMNAS_INCIDENCIA: { header: string; key: keyof ReporteIncidenciaRow }[] = [
  { header: 'Fecha Evento', key: 'fechaEvento' },
  { header: 'IPH', key: 'iph' },
  { header: 'Delito', key: 'delito' },
  { header: 'Calle', key: 'calle' },
  { header: 'Colonia', key: 'colonia' },
  { header: 'Sector', key: 'sector' },
]

const COLUMNAS_PUESTA_DISPOSICION: { header: string; key: keyof PuestaDisposicionRow }[] = [
  { header: 'Fecha Evento', key: 'fechaEvento' },
  { header: 'IPH', key: 'iph' },
  { header: 'Detenido', key: 'detenido' },
  { header: 'Delito', key: 'delito' },
  { header: 'Sector', key: 'sector' },
  { header: 'Agrupamiento', key: 'agrupamiento' },
]

export default async function ReportesIncidenciasPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'formatos_udai', 'ver'))) redirect('/formatos-udai')

  const user = session.user as { name: string; apellido?: string; email: string }
  const { tab } = await searchParams
  const tabActivo = tab === 'puestas-disposicion' ? 'puestas-disposicion' : 'incidencia'

  const [incidencias, puestasDisposicion] = await Promise.all([
    listarReportesIncidencia(),
    listarPuestasDisposicion(),
  ])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <DashboardHeader user={user} roleLabel="Formatos UDAI" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Formato Reportes de"
          accent="Incidencias"
          subtitle="Bitácora de incidentes y puestas a disposición — formato oficial UDAI"
          actions={<>
            <PageHeaderLink href="/formatos-udai" variant="secondary">← Formatos UDAI</PageHeaderLink>
            <BotonExportarExcel /* ver nota: apunta a la nueva ruta de export, no a la de faltas administrativas */ />
          </>}
        />

        <SegmentPage
          activeKey={tabActivo}
          tabs={[
            { key: 'incidencia', label: 'Incidencia', icon: <FileWarning size={13} />, count: incidencias.length, href: '/formatos-udai/reportes-incidencias?tab=incidencia' },
            { key: 'puestas-disposicion', label: 'Puestas a Disposición', icon: <UserCheck size={13} />, count: puestasDisposicion.length, href: '/formatos-udai/reportes-incidencias?tab=puestas-disposicion' },
          ]}
        />

        {tabActivo === 'incidencia' ? (
          <div className="tabla-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 12, whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                  {COLUMNAS_INCIDENCIA.map(c => (
                    <th key={c.key} style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>{c.header}</th>
                  ))}
                  <th style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {incidencias.length === 0 && (
                  <tr><td colSpan={COLUMNAS_INCIDENCIA.length + 1} style={{ padding: 32, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#94a3b8' }}>No hay registros IPH capturados</td></tr>
                )}
                {incidencias.map(r => (
                  <tr key={r.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    {COLUMNAS_INCIDENCIA.map(c => (
                      <td key={c.key} style={{ padding: '10px 14px', fontFamily: c.key === 'iph' ? 'JetBrains Mono' : 'Inter', fontSize: c.key === 'iph' ? 11 : 12 }}>
                        {celda(r[c.key])}
                      </td>
                    ))}
                    <td style={{ padding: '10px 14px' }}>
                      <DetalleReporteIncidenciaModal row={r} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="tabla-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 12, whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                  {COLUMNAS_PUESTA_DISPOSICION.map(c => (
                    <th key={c.key} style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>{c.header}</th>
                  ))}
                  <th style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {puestasDisposicion.length === 0 && (
                  <tr><td colSpan={COLUMNAS_PUESTA_DISPOSICION.length + 1} style={{ padding: 32, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#94a3b8' }}>No hay registros IPH capturados</td></tr>
                )}
                {puestasDisposicion.map(r => (
                  <tr key={r.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    {COLUMNAS_PUESTA_DISPOSICION.map(c => (
                      <td key={c.key} style={{ padding: '10px 14px', fontFamily: c.key === 'iph' ? 'JetBrains Mono' : 'Inter', fontSize: c.key === 'iph' ? 11 : 12 }}>
                        {celda(r[c.key])}
                      </td>
                    ))}
                    <td style={{ padding: '10px 14px' }}>
                      <DetallePuestaDisposicionModal row={r} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <DashboardFooter />
      </main>
    </div>
  )
}
```

**Nota sobre `BotonExportarExcel`**: el componente existente en `components/formatos-udai/BotonExportarExcel.tsx` tiene la ruta `/api/formatos-udai/faltas-administrativas/exportar` **hardcodeada** dentro del componente (línea 12) y el nombre de archivo de descarga también hardcodeado (línea 21). No es reutilizable tal cual. Dos opciones — elegir una, no las dos:

- **(a) Recomendada:** generalizar `BotonExportarExcel` para que reciba `href` y `nombreArchivo` como props (`BotonExportarExcel({ href, nombreArchivo })`), con defaults iguales a los actuales para no romper `faltas-administrativas/page.tsx`. Cambio de 2 líneas en el componente + 1 línea en su único caller actual (opcional, puede quedar sin props ahí).
- **(b)** Crear un componente nuevo `components/formatos-udai/BotonExportarReportesIncidencias.tsx`, copia del existente apuntando a la ruta nueva.

Tomar (a) salvo que se prefiera no tocar el componente existente.

## 2. Modales de detalle

Calcar `components/formatos-udai/DetalleFaltaAdministrativaModal.tsx` (mismo patrón: `createPortal`, overlay, secciones con `Seccion`/`Grid`/`Campo`). Crear:

- `DetalleReporteIncidenciaModal.tsx` — secciones sugeridas: "Identificación y tiempos" (iph, folio911, fechaEvento, fechaReporte2, diaEvento, horaReporte, horaInicioEvento, horaFinalEvento, horaPromedio), "Hecho" (delito, articulosObjetos, modus, calle, numeroReferencia, colonia, sector, rt, turno, crp), "Afectado" (afectado, calleAfec, numeroAfec, coloniaAfec, telefonoAfec), "Vehículo" (marca...modelo), "Cierre" (apNuc, fuero, latitud, longitud, agenteAprehensor).
- `DetallePuestaDisposicionModal.tsx` — mismas secciones de "Hecho"/"Afectado"/"Vehículo" + secciones nuevas "Detenido" (detenido, alias, fechaNacimiento, edad, sexo, calleDet, numeroDet, coloniaDet, municipio, originario, nucCu) y "Administrativo" (folioRnd, latitud2, longitud3, fechaIngreso, fechaSalida, otroDelito, masc, umecas).

Para los campos "fantasma"/GAP (ver `00-contexto.md`), no ocultar el campo del modal — mostrarlo igual con el guion `—` que ya produce `Campo` cuando el valor es `null`. Es información legítima ("este dato no se captura hoy"), no un error de UI.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. `/formatos-udai/reportes-incidencias` carga sin redirect para un usuario con permiso `formatos_udai:ver`.
3. Cambiar entre tabs vía los links de `SegmentPage` mantiene el resto de la página (no hay flash de layout, la URL refleja el tab activo).
4. Los 10 registros de `iph_detenidos` aparecen en ambas tablas.
5. El modal de detalle abre y muestra las columnas fantasma/GAP como `—`, no como error ni como `undefined`.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 4.
