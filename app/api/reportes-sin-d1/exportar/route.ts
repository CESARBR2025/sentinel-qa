import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { listarSinD1 } from '@/lib/reportes-sin-d1/service'
import ExcelJS from 'exceljs'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const p      = req.nextUrl.searchParams
  const data   = await listarSinD1(p.get('from') || undefined, p.get('to') || undefined, p.get('nombre') || undefined)

  const wb = new ExcelJS.Workbook()
  wb.creator = 'CENTINELA · SSPM'
  const ws = wb.addWorksheet('Sin D1', { pageSetup: { orientation: 'portrait', fitToPage: true } })

  const COLS = [
    { header: 'Folio',              key: 'folio',          width: 22 },
    { header: 'Fecha',              key: 'fecha',          width: 16 },
    { header: 'Nombre Afectado',    key: 'nombreAfectado', width: 34 },
    { header: 'Teléfono',           key: 'telefono',       width: 18 },
    { header: 'Documentación',      key: 'documentacion',  width: 30 },
  ]

  ws.mergeCells('A1:E1')
  const inst = ws.getCell('A1')
  inst.value = 'SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL · SAN JUAN DEL RÍO, QRO.'
  inst.font  = { name: 'Arial', bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
  inst.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }
  inst.alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(1).height = 26

  ws.mergeCells('A2:E2')
  const titulo = ws.getCell('A2')
  titulo.value = 'REPORTES SIN D1 INICIADA'
  titulo.font  = { name: 'Arial', bold: true, size: 12, color: { argb: 'FF0F172A' } }
  titulo.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
  titulo.alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(2).height = 20

  ws.mergeCells('A3:C3')
  ws.getCell('A3').value = `Generado: ${new Date().toLocaleString('es-MX')}`
  ws.getCell('A3').font  = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF64748B' } }
  ws.getCell('E3').value = `Total: ${data.length}`
  ws.getCell('E3').font  = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF64748B' } }
  ws.getCell('E3').alignment = { horizontal: 'right' }
  ws.getRow(3).height = 14

  COLS.forEach((col, i) => {
    ws.getColumn(i + 1).width = col.width
    const cell = ws.getCell(4, i + 1)
    cell.value     = col.header
    cell.font      = { name: 'Arial', bold: true, size: 9, color: { argb: 'FFFFFFFF' } }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
    cell.border    = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
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
    const bg  = i % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC'
    const vals = [r.folio, r.fecha, r.nombreAfectado, r.telefono, r.documentacion]
    vals.forEach((val, ci) => {
      const cell = ws.getCell(row, ci + 1)
      cell.value     = val
      cell.font      = { name: 'Arial', size: 9, color: { argb: ci === 0 ? 'FF2563EB' : 'FF1E293B' }, bold: ci === 0 }
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
      cell.border    = BORDER
      cell.alignment = { vertical: 'middle', wrapText: true }
    })
    ws.getRow(row).height = 30
  })

  ws.views      = [{ state: 'frozen', xSplit: 0, ySplit: 4, activeCell: 'A5' }]
  ws.autoFilter = { from: 'A4', to: 'E4' }

  const buffer = await wb.xlsx.writeBuffer()
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type':        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="sin_d1_${new Date().toISOString().split('T')[0]}.xlsx"`,
    }
  })
}