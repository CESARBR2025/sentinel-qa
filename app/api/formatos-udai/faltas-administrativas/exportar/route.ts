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

function filaValores(r: FaltaAdministrativaRow): unknown[] {
  const campos: { key: keyof FaltaAdministrativaRow; fecha?: boolean; hora?: boolean }[] = [
    { key: 'fecha', fecha: true }, { key: 'hora', hora: true }, { key: 'responsableTurno' }, { key: 'horaSalida' },
    { key: 'iph' }, { key: 'folioTablet' },
    { key: 'apellidoPaterno' }, { key: 'apellidoMaterno' }, { key: 'nombre' },
    { key: 'fechaNacimiento', fecha: true }, { key: 'edad' },
    { key: 'genero' }, { key: 'alias' }, { key: 'ciudadOrigen' }, { key: 'calleDet' }, { key: 'numero' }, { key: 'coloniaDet' },
    { key: 'articulo' }, { key: 'tipoFalta' }, { key: 'rnd' },
    { key: 'lugarArresto' }, { key: 'colonia' }, { key: 'oficialQueRemite' },
    { key: 'oficialQueRemite2' }, { key: 'sector' }, { key: 'agrupamiento' }, { key: 'latitud' },
    { key: 'longitud' }, { key: 'presencia' }, { key: 'verbalizacion' }, { key: 'controlContacto' },
    { key: 'controlFisico' }, { key: 'tecnicasNoLetales' }, { key: 'fuerzaLetal' },
  ]
  return campos.map(({ key, fecha, hora }) => {
    const v = r[key]
    if (BOOLEAN_KEYS.has(key)) return v ? 'SI' : ''
    if (fecha) return formatFecha(v as string | null)
    if (hora) return formatHora(v as string | null)
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
