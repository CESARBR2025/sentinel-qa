# Etapa 5 — Exportación `.xlsx` idéntica al formato oficial

Leer primero `00-contexto.md`. Depende de la Etapa 4.

## Objetivo

`GET /api/formatos-udai/faltas-administrativas/exportar` debe generar un `.xlsx` que **replique exactamente** `FORMATO FALTAS ADMINISTRATIVAS.xlsx`: una sola hoja, **una sola fila de encabezados** con estos 34 textos literales en este orden exacto (columna A a AH) — **no uses el patrón de `crearHoja()` de `app/api/reportes-operativos/exportar-excel/route.ts`** (ese agrega 3 filas de banner institucional antes del encabezado; el formato oficial UDAI no las lleva, es un formato normado que debe verse igual, no con el theming interno de Centinela).

```
FECHA | HORA | RESPONSABLE DE TURNO | HORA DE SALIDA | IPH | FOLIO TABLET |
APELLIDO PATERNO | APELLIDO MATERNO | NOMBRE | FECHA DE NACIMIENTO | EDAD |
GÉNERO | ALIAS | CIUDAD DE ORIGEN DET | CALLE DET | NUMERO | COLONIA DET |
ARTICULO | TIPO DE FALTA ADMINISTRATIVA | REGISTRO NACIONAL DE DETENIDOS |
LUGAR DE ARRESTO, CALLE Y/O AVENIDA | COLONIA | OFICIAL QUE REMITE |
OFICIAL QUE REMITE | SECTOR | AGRUPAMIENTO | COORDENADAS LATITUD |
COORDENADAS LONGITUD | PRESENCIA | VERBALIZACION | CONTROL DE CONTACTO |
CONTROL FISICO | TECNICAS DEFENSIVA NO LETALES | FUERZA PONTENCIAL LETAL
```

**Importante**: la columna AH dice literalmente `FUERZA PONTENCIAL LETAL` (typo "PONTENCIAL" del archivo oficial, no "POTENCIAL") y la columna AG tiene un espacio final en `"TECNICAS DEFENSIVA NO LETALES "`. Cópialas tal cual — el objetivo es que el archivo generado sea indistinguible del oficial para quien lo reciba, typos incluidos.

## Archivo a crear: `app/api/formatos-udai/faltas-administrativas/exportar/route.ts`

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import ExcelJS from 'exceljs'
import { tienePermiso } from '@/lib/formatos-udai/permisos'
import { listarFaltasAdministrativasParaExportar } from '@/lib/formatos-udai/repository'
import type { FaltaAdministrativaRow } from '@/lib/formatos-udai/types'

const HEADERS = [
  'FECHA', 'HORA', 'RESPONSABLE DE TURNO', 'HORA DE SALIDA', 'IPH', 'FOLIO TABLET',
  'APELLIDO PATERNO', 'APELLIDO MATERNO', 'NOMBRE', 'FECHA DE NACIMIENTO', 'EDAD',
  'GÉNERO', 'ALIAS', 'CIUDAD DE ORIGEN DET', 'CALLE DET', 'NUMERO', 'COLONIA DET',
  'ARTICULO', 'TIPO DE FALTA ADMINISTRATIVA', 'REGISTRO NACIONAL DE DETENIDOS',
  'LUGAR DE ARRESTO, CALLE Y/O AVENIDA', 'COLONIA', 'OFICIAL QUE REMITE',
  'OFICIAL QUE REMITE', 'SECTOR', 'AGRUPAMIENTO', 'COORDENADAS LATITUD',
  'COORDENADAS LONGITUD', 'PRESENCIA', 'VERBALIZACION', 'CONTROL DE CONTACTO',
  'CONTROL FISICO', 'TECNICAS DEFENSIVA NO LETALES ', 'FUERZA PONTENCIAL LETAL',
]

const BOOLEAN_KEYS = new Set(['presencia', 'verbalizacion', 'controlContacto', 'controlFisico', 'tecnicasNoLetales', 'fuerzaLetal'])

function filaValores(r: FaltaAdministrativaRow): unknown[] {
  const campos: (keyof FaltaAdministrativaRow)[] = [
    'fecha', 'hora', 'responsableTurno', 'horaSalida', 'iph', 'folioTablet',
    'apellidoPaterno', 'apellidoMaterno', 'nombre', 'fechaNacimiento', 'edad',
    'genero', 'alias', 'ciudadOrigen', 'calleDet', 'numero', 'coloniaDet',
    'articulo', 'tipoFalta', 'rnd',
    'lugarArresto', 'colonia', 'oficialQueRemite',
    'oficialQueRemite2', 'sector', 'agrupamiento', 'latitud',
    'longitud', 'presencia', 'verbalizacion', 'controlContacto',
    'controlFisico', 'tecnicasNoLetales', 'fuerzaLetal',
  ]
  return campos.map(k => {
    const v = r[k]
    if (BOOLEAN_KEYS.has(k)) return v ? 'SI' : ''
    return v ?? ''
  })
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'formatos_udai', 'ver'))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const registros = await listarFaltasAdministrativasParaExportar()

  const wb = new ExcelJS.Workbook()
  wb.creator = 'CENTINELA · SSPM'
  wb.created = new Date()

  const ws = wb.addWorksheet('Hoja1')
  ws.addRow(HEADERS)
  ws.getRow(1).font = { bold: true }
  ws.getRow(1).height = 30
  HEADERS.forEach((_, i) => { ws.getColumn(i + 1).width = 20 })

  registros.forEach(r => ws.addRow(filaValores(r)))

  const buffer = await wb.xlsx.writeBuffer()
  const fecha = new Date().toISOString().split('T')[0]

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="FORMATO_FALTAS_ADMINISTRATIVAS_${fecha}.xlsx"`,
    },
  })
}
```

Nota sobre `es_rnd`/formatos de fecha: `exceljs` escribe strings tal cual llegan (los valores `fecha`/`fechaNacimiento` que trae `pg` ya vienen como objetos `Date` o strings ISO según el driver — revisa qué devuelve realmente `query()` en este proyecto, ver cómo se maneja en `lib/monitorista/repository.ts`, y ajusta `filaValores` para formatear a `dd/mm/yyyy` con un helper simple si hace falta, en vez de dejar pasar un ISO completo con hora).

## Verificación

1. `npx tsc --noEmit`.
2. Descargar el `.xlsx` desde el botón de la Etapa 4 y abrirlo — comparar los 34 encabezados de la fila 1, en orden y texto exacto (incluyendo el typo "PONTENCIAL"), contra `FORMATO FALTAS ADMINISTRATIVAS.xlsx` original. Esto lo hace el usuario en su propio Excel/navegador — no lo valides tú por captura de pantalla.

## Criterios de aceptación

- Encabezados idénticos carácter por carácter al archivo oficial (34, en orden, con el typo incluido).
- Sin filas de banner institucional — la fila 1 son los encabezados, la fila 2 en adelante son datos.
- Columnas GAP se exportan como celda vacía, no `"null"`/`"undefined"`.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 6.**
