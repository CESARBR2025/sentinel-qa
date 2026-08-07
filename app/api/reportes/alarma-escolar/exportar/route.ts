import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerDatosAlarmasEscolares } from '@/lib/reportes-operativos/service'
import { tieneAccesoSeccion } from '@/lib/911/permisos'
import ExcelJS from 'exceljs'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  if (!(await tieneAccesoSeccion(session.user.id, '911_ciudadano'))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const from = req.nextUrl.searchParams.get('from') ?? undefined
  const to = req.nextUrl.searchParams.get('to') ?? undefined
  const data = await obtenerDatosAlarmasEscolares(from, to)

  const wb = new ExcelJS.Workbook()
  wb.creator = 'CENTINELA · SSPM'
  const ws = wb.addWorksheet('Alarmas Escolares', {
    pageSetup: { orientation: 'landscape', fitToPage: true },
  })

  const desdeEtiqueta = from ?? 'inicio'
  const hastaEtiqueta = to ?? new Date().toISOString().split('T')[0]

  ws.mergeCells('A1:Q1')
  const inst = ws.getCell('A1')
  inst.value = 'SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL · SAN JUAN DEL RÍO, QRO.'
  inst.font = { name: 'Arial', bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
  inst.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }
  inst.alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(1).height = 26

  ws.mergeCells('A2:Q2')
  const titulo = ws.getCell('A2')
  titulo.value = `ALARMAS ESCOLARES — ${desdeEtiqueta} AL ${hastaEtiqueta}`
  titulo.font = { name: 'Arial', bold: true, size: 12, color: { argb: 'FF0F172A' } }
  titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
  titulo.alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(2).height = 20

  ws.mergeCells('A3:P3')
  ws.getCell('A3').value = `Generado: ${new Date().toLocaleString('es-MX')}`
  ws.getCell('A3').font = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF64748B' } }
  ws.getCell('Q3').value = `Total: ${data.length}`
  ws.getCell('Q3').font = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF64748B' } }
  ws.getCell('Q3').alignment = { horizontal: 'right' }
  ws.getRow(3).height = 14

  const cols = [
    { header: 'Fecha', key: 'fecha', width: 12 },
    { header: 'Hora', key: 'hora', width: 10 },
    { header: 'Establecimiento', key: 'establecimiento', width: 28 },
    { header: 'Dirección', key: 'direccion', width: 32 },
    { header: 'Inmueble', key: 'inmueble', width: 14 },
    { header: 'Tipo de Señal', key: 'reporteDescripcion', width: 22 },
    { header: 'Prioridad', key: 'prioridad', width: 10 },
    { header: 'Activaciones', key: 'activaciones', width: 12 },
    { header: 'Falso', key: 'esFalso', width: 12 },
    { header: 'Responsable', key: 'responsable', width: 24 },
    { header: 'Nombre Responsable', key: 'nombreResponsable', width: 24 },
    { header: 'Hora Canalización', key: 'horaCanalizacion', width: 16 },
    { header: 'Unidad Arribo', key: 'unidadArribo', width: 14 },
    { header: 'Hora Arribo', key: 'horaArribo', width: 12 },
    { header: 'Oficial', key: 'oficial', width: 24 },
    { header: 'Verificador', key: 'nombreVerificador', width: 22 },
    { header: 'Folio de Reporte', key: 'folioReporte', width: 16 },
  ]
  cols.forEach((col, i) => {
    ws.getColumn(i + 1).width = col.width
    const cell = ws.getCell(4, i + 1)
    cell.value = col.header
    cell.font = { name: 'Arial', bold: true, size: 9, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
    cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
  })
  ws.getRow(4).height = 20

  const BORDER: Partial<ExcelJS.Borders> = {
    top: { style: 'hair', color: { argb: 'FFE2E8F0' } },
    bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
    left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
    right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
  }

  data.forEach((r, i) => {
    const row = i + 5
    const bg = i % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC'
    const vals = [
      r.fecha, r.hora, r.establecimiento, r.direccion, r.inmueble,
      r.reporteDescripcion, r.prioridad, r.activaciones, r.esFalso,
      r.responsable, r.nombreResponsable, r.horaCanalizacion, r.unidadArribo, r.horaArribo,
      r.oficial, r.nombreVerificador, r.folioReporte,
    ]
    vals.forEach((val, ci) => {
      const cell = ws.getCell(row, ci + 1)
      cell.value = val
      cell.font = { name: 'Arial', size: 9, color: { argb: ci === 2 ? 'FF15803D' : 'FF1E293B' }, bold: ci === 2 }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
      cell.border = BORDER
      cell.alignment = { vertical: 'middle', wrapText: true }
    })
    ws.getRow(row).height = 15
  })

  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4, activeCell: 'A5' }]
  ws.autoFilter = { from: 'A4', to: 'Q4' }

  const buffer = await wb.xlsx.writeBuffer()
  const fecha = new Date().toISOString().split('T')[0]

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="alarmas_escolares_${fecha}.xlsx"`,
    },
  })
}
