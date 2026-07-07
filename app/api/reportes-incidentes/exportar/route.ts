import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { listarReporteDiario, listarReporteSemanal } from '@/lib/reportes-incidentes/service'
import ExcelJS from 'exceljs'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const p     = req.nextUrl.searchParams
  const tipo  = p.get('tipo') ?? 'diario'
  const desde = p.get('from') || undefined
  const hasta = p.get('to')   || undefined

  const data = tipo === 'semanal'
    ? await listarReporteSemanal(desde, hasta)
    : await listarReporteDiario(desde, hasta)

  const wb = new ExcelJS.Workbook()
  wb.creator = 'SENTINEL · SSPM'
  const ws = wb.addWorksheet(`Reporte ${tipo}`, { pageSetup: { orientation: 'landscape', fitToPage: true } })

  const COLS = tipo === 'semanal'
    ? [
        { header: 'Fecha',          key: 'fecha',        width: 14 },
        { header: 'Cárcel Mpal.',   key: 'carcel',       width: 14 },
        { header: 'Fiscalía',       key: 'fiscalia',     width: 14 },
        { header: 'Vehíc. Recup.',  key: 'vehiculos',    width: 14 },
        { header: 'Cateo FGE',      key: 'cateo_fge',    width: 12 },
        { header: 'Operativos',     key: 'operativos',   width: 12 },
        { header: 'Cateo FGR',      key: 'cateo_fgr',    width: 12 },
        { header: 'FGR',            key: 'fgr',          width: 10 },
        { header: 'Armas Fuego',    key: 'armas_fuego',  width: 14 },
        { header: 'Armas Blancas',  key: 'armas_blancas', width: 14 },
        { header: 'Droga',          key: 'drogas',       width: 12 },
        { header: 'Fiestas Pat.',   key: 'fiestas',      width: 14 },
      ]
    : [
        { header: 'Fecha',              key: 'fecha',    width: 14 },
        { header: 'Cárcel Municipal',   key: 'carcel',   width: 18 },
        { header: 'Detenidos Fiscalía', key: 'fiscalia', width: 18 },
        { header: 'Detenidos FGR',      key: 'fgr',      width: 16 },
      ]

  const lastCol = String.fromCharCode(64 + COLS.length)

  ws.mergeCells(`A1:${lastCol}1`)
  const inst = ws.getCell('A1')
  inst.value = 'SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL · SAN JUAN DEL RÍO, QRO.'
  inst.font  = { name: 'Arial', bold: true, size: 10, color: { argb: 'FFFFFFFF' } }
  inst.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }
  inst.alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(1).height = 24

  ws.mergeCells(`A2:${lastCol}2`)
  const titulo = ws.getCell('A2')
  titulo.value = `REPORTE DE INCIDENTES ${tipo.toUpperCase()}${desde ? ` — ${desde} AL ${hasta}` : ''}`
  titulo.font  = { name: 'Arial', bold: true, size: 11, color: { argb: 'FF0F172A' } }
  titulo.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
  titulo.alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(2).height = 18

  ws.mergeCells(`A3:${lastCol}3`)
  ws.getCell('A3').value = `Generado: ${new Date().toLocaleString('es-MX')} · Total registros: ${data.length}`
  ws.getCell('A3').font  = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF64748B' } }
  ws.getRow(3).height = 13

  COLS.forEach((col, i) => {
    ws.getColumn(i + 1).width = col.width
    const cell = ws.getCell(4, i + 1)
    cell.value = col.header
    cell.font  = { name: 'Arial', bold: true, size: 8, color: { argb: 'FFFFFFFF' } }
    cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
    cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
  })
  ws.getRow(4).height = 18

  const BORDER: Partial<ExcelJS.Borders> = {
    top: { style: 'hair', color: { argb: 'FFE2E8F0' } },
    bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
    left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
    right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
  }

  data.forEach((r, i) => {
    const row = i + 5
    const bg  = i % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC'
    const vals = COLS.map(c => (r as any)[c.key] ?? 0)
    vals.forEach((val, ci) => {
      const cell = ws.getCell(row, ci + 1)
      cell.value = val
      cell.font  = { name: 'Arial', size: 9, color: { argb: ci === 0 ? 'FF2563EB' : 'FF1E293B' }, bold: ci === 0 }
      cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
      cell.border = BORDER
      cell.alignment = { vertical: 'middle', horizontal: ci === 0 ? 'left' : 'center' }
    })
    ws.getRow(row).height = 15
  })

  // Totales
  const totalRow = data.length + 5
  ws.getCell(`A${totalRow}`).value = 'TOTAL'
  ws.getCell(`A${totalRow}`).font  = { name: 'Arial', bold: true, size: 9, color: { argb: 'FFFFFFFF' } }
  ws.getCell(`A${totalRow}`).fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }
  ws.getCell(`A${totalRow}`).alignment = { horizontal: 'center' }

  COLS.slice(1).forEach((col, i) => {
    const cell = ws.getCell(totalRow, i + 2)
    cell.value = data.reduce((acc, r) => acc + Number((r as any)[col.key] ?? 0), 0)
    cell.font  = { name: 'Arial', bold: true, size: 9 }
    cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
    cell.alignment = { horizontal: 'center' }
  })
  ws.getRow(totalRow).height = 18

  ws.views      = [{ state: 'frozen', xSplit: 0, ySplit: 4, activeCell: 'A5' }]
  ws.autoFilter = { from: 'A4', to: `${lastCol}4` }

  const buffer = await wb.xlsx.writeBuffer()
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type':        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="reporte_incidentes_${tipo}_${new Date().toISOString().split('T')[0]}.xlsx"`,
    }
  })
}