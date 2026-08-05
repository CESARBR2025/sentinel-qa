# Etapa 4 — Exportación `.xlsx` (2 hojas, idénticas al oficial)

Depende de Etapa 1 (repository). Calcar `app/api/formatos-udai/faltas-administrativas/exportar/route.ts` — mismo patrón de `ExcelJS`, pero **una sola ruta que agrega 2 `worksheet`s** al mismo `Workbook`, en el mismo orden y con los mismos nombres de hoja que el archivo oficial: primero `PUESTAS A DISPOSICION`, después `INCIDENCIA`.

## Archivo a crear

`app/api/formatos-udai/reportes-incidencias/exportar/route.ts`

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import ExcelJS from 'exceljs'
import { tienePermiso } from '@/lib/formatos-udai/permisos'
import {
  listarPuestasDisposicionParaExportar,
  listarReportesIncidenciaParaExportar,
} from '@/lib/formatos-udai/repository'
import type { PuestaDisposicionRow, ReporteIncidenciaRow } from '@/lib/formatos-udai/types'

const HEADERS_PUESTA_DISPOSICION = [
  'IPH', 'FOLIO 911', 'FECHA EVENTO', 'DIA EVENTO', 'HORA EVENTO', 'DELITO',
  'ARTICULOS U OBJETOS', 'MODUS', 'CALLE', 'NÚMERO O REFERENCIA', 'COLONIA', 'SECTOR',
  'RT', 'TURNO', 'CRP', 'AGRUPAMIENTO', 'AFECTADO', 'CALLE AFEC', 'NUMERO AFEC',
  'COLONIA AFEC', 'MARCA', 'SUBMARCA', 'TIPO', 'COLOR', 'PLACAS', 'ESTADO', 'NIV',
  'MOTOR', 'MODELO', 'DETENIDO', 'ALIAS', 'FECHA DE NAC', 'EDAD', 'SEXO', 'CALLE DET',
  'NUMERO DET', 'COLONIA DET', 'LATITUD', 'LONGITUD', 'MUNICIPIO', 'ORIGINARIO',
  'NUC / CU', 'FUERO', 'FOLIO RND', 'LATITUD2', 'LONGITUD3', 'AGENTE_APREHENSOR',
  'FECHA DE INGRESO', 'FECHA DE SALIDA', 'OTRO DELITO', 'MASC', 'UMECAS',
]

const HEADERS_INCIDENCIA = [
  'IPH', 'FOLIO 911', 'FECHA EVENTO', 'FECHA REPORTE2', 'DIA EVENTO', 'HORA REPORTE',
  'HORA INICIO EVENTO', 'HORA FINAL EVENTO', 'HORA PROMEDIO', 'DELITO',
  'ARTICULOS U OBJETOS', 'MODUS', 'CALLE', 'NÚMERO O REFERENCIA', 'COLONIA', 'SECTOR',
  'RT', 'TURNO', 'CRP', 'AFECTADO', 'CALLE AFEC', 'NUMERO AFEC', 'COLONIA AFEC',
  'TELEFONO AFEC', 'MARCA', 'SUBMARCA', 'TIPO', 'COLOR', 'PLACAS', 'ESTADO', 'NIV',
  'MOTOR', 'MODELO', 'AP/NUC', 'FUERO', 'LATITUD', 'LONGITUD', 'AGENTE_APREHENSOR',
]

function formatFecha(iso: string | null): string {
  if (!iso) return ''
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  return `${m[3]}/${m[2]}/${m[1]}`
}

function formatHora(time: string | null): string {
  if (!time) return ''
  return time.slice(0, 5)
}

function filaPuestaDisposicion(r: PuestaDisposicionRow): unknown[] {
  return [
    r.iph ?? '', r.folio911 ?? '', formatFecha(r.fechaEvento), r.diaEvento ?? '', r.horaEvento ?? '',
    r.delito ?? '', r.articulosObjetos ?? '', r.modus ?? '', r.calle ?? '', r.numeroReferencia ?? '',
    r.colonia ?? '', r.sector ?? '', r.rt ?? '', r.turno ?? '', r.crp ?? '', r.agrupamiento ?? '',
    r.afectado ?? '', r.calleAfec ?? '', r.numeroAfec ?? '', r.coloniaAfec ?? '',
    r.marca ?? '', r.submarca ?? '', r.tipo ?? '', r.color ?? '', r.placas ?? '', r.estado ?? '',
    r.niv ?? '', r.motor ?? '', r.modelo ?? '',
    r.detenido ?? '', r.alias ?? '', formatFecha(r.fechaNacimiento), r.edad ?? '', r.sexo ?? '',
    r.calleDet ?? '', r.numeroDet ?? '', r.coloniaDet ?? '',
    r.latitud ?? '', r.longitud ?? '', r.municipio ?? '', r.originario ?? '', r.nucCu ?? '',
    r.fuero ?? '', r.folioRnd ?? '', r.latitud2 ?? '', r.longitud3 ?? '', r.agenteAprehensor ?? '',
    r.fechaIngreso ?? '', r.fechaSalida ?? '', r.otroDelito ?? '', r.masc ?? '', r.umecas ?? '',
  ]
}

function filaIncidencia(r: ReporteIncidenciaRow): unknown[] {
  return [
    r.iph ?? '', r.folio911 ?? '', formatFecha(r.fechaEvento), formatFecha(r.fechaReporte2), r.diaEvento ?? '',
    formatHora(r.horaReporte), formatHora(r.horaInicioEvento), formatHora(r.horaFinalEvento), formatHora(r.horaPromedio),
    r.delito ?? '', r.articulosObjetos ?? '', r.modus ?? '', r.calle ?? '', r.numeroReferencia ?? '', r.colonia ?? '',
    r.sector ?? '', r.rt ?? '', r.turno ?? '', r.crp ?? '',
    r.afectado ?? '', r.calleAfec ?? '', r.numeroAfec ?? '', r.coloniaAfec ?? '', r.telefonoAfec ?? '',
    r.marca ?? '', r.submarca ?? '', r.tipo ?? '', r.color ?? '', r.placas ?? '', r.estado ?? '', r.niv ?? '',
    r.motor ?? '', r.modelo ?? '', r.apNuc ?? '', r.fuero ?? '',
    r.latitud ?? '', r.longitud ?? '', r.agenteAprehensor ?? '',
  ]
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'formatos_udai', 'ver'))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const [puestasDisposicion, incidencias] = await Promise.all([
    listarPuestasDisposicionParaExportar(),
    listarReportesIncidenciaParaExportar(),
  ])

  const wb = new ExcelJS.Workbook()
  wb.creator = 'CENTINELA · SSPM'
  wb.created = new Date()

  const wsPuesta = wb.addWorksheet('PUESTAS A DISPOSICION')
  wsPuesta.addRow(HEADERS_PUESTA_DISPOSICION)
  wsPuesta.getRow(1).font = { bold: true }
  wsPuesta.getRow(1).height = 30
  HEADERS_PUESTA_DISPOSICION.forEach((_, i) => { wsPuesta.getColumn(i + 1).width = 20 })
  puestasDisposicion.forEach(r => wsPuesta.addRow(filaPuestaDisposicion(r)))

  const wsIncidencia = wb.addWorksheet('INCIDENCIA')
  wsIncidencia.addRow(HEADERS_INCIDENCIA)
  wsIncidencia.getRow(1).font = { bold: true }
  wsIncidencia.getRow(1).height = 30
  HEADERS_INCIDENCIA.forEach((_, i) => { wsIncidencia.getColumn(i + 1).width = 20 })
  incidencias.forEach(r => wsIncidencia.addRow(filaIncidencia(r)))

  const buffer = await wb.xlsx.writeBuffer()
  const fecha = new Date().toISOString().split('T')[0]

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="FORMATO_INCIDENCIA_${fecha}.xlsx"`,
    },
  })
}
```

## Notas

- Los encabezados están copiados **carácter por carácter** del archivo oficial (incluye `Ñ` en `NÚMERO O REFERENCIA`, `/` en `AP/NUC` y `NUC / CU` con espacios alrededor de la barra, `_` en `AGENTE_APREHENSOR`). No "normalizar" ni corregir mayúsculas/acentos — el objetivo es que el archivo exportado sea diff-comparable columna por columna contra el oficial.
- El orden de hojas (`PUESTAS A DISPOSICION` primero, `INCIDENCIA` después) replica el orden real del archivo original — verificado al abrirlo con `openpyxl` (`wb.sheetnames`).
- No se aplica el formato `'SI'`/vacío de booleanos que sí usa la exportación de Faltas Administrativas — ninguna columna de estas 2 hojas es booleana.
- Conectar el `BotonExportarExcel` de la Etapa 3 a `/api/formatos-udai/reportes-incidencias/exportar`.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Descargar el `.xlsx` y abrirlo: debe tener exactamente 2 hojas nombradas `PUESTAS A DISPOSICION` e `INCIDENCIA`, con el mismo número de columnas y mismos encabezados (en el mismo orden) que `FORMATO INCIDENCIA.xlsx` original.
3. Las filas exportadas coinciden en cantidad con `iph_detenidos` (10 en este momento).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 5.
