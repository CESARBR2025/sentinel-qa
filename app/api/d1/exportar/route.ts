import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarReportesD1 } from '@/lib/d1/service'
import { tienePermiso } from '@/lib/reportes/permisos'
import ExcelJS from 'exceljs'

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (!(await tienePermiso(session.user.id, 'reportes_ciudadano', 'ver'))) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const p = req.nextUrl.searchParams
    const desde = p.get('from') || undefined
    const hasta = p.get('to') || undefined
    const folio = p.get('folio') || undefined

    const data = await listarReportesD1(desde, hasta, folio)

    const wb = new ExcelJS.Workbook()
    wb.creator = 'CENTINELA · SSPM'
    const ws = wb.addWorksheet('Reportes D1', {
        pageSetup: { orientation: 'landscape', fitToPage: true },
    })

    const COLS = [
        { header: 'Folio Denuncia', key: 'folioDenuncia', width: 20 },
        { header: 'IPH', key: 'iph', width: 20 },
        { header: 'Folio CU', key: 'folioCu', width: 20 },
        { header: 'Folio SIJA', key: 'folioSija', width: 20 },
        { header: 'Delito', key: 'delito', width: 30 },
        { header: 'Violencia', key: 'violencia', width: 12 },
        { header: 'Fecha Reporte', key: 'fechaReporte', width: 16 },
        { header: 'Hora Reporte', key: 'horaReporte', width: 14 },
        { header: 'Lugar Hecho', key: 'lugarHecho', width: 30 },
        { header: 'Colonia', key: 'coloniaHecho', width: 20 },
        { header: 'Municipio', key: 'municipio', width: 18 },
        { header: 'Policía a Cargo', key: 'policiaACargo', width: 28 },
        { header: 'CRP', key: 'crp', width: 12 },
        { header: 'Oficial', key: 'oficialNombre', width: 28 },
        { header: 'Estado Trámite', key: 'estadoTramite', width: 22 },
        { header: 'D1 Generada', key: 'seGeneroD1', width: 14 },
    ]

    // Fila 1 institución
    ws.mergeCells(`A1:${String.fromCharCode(64 + COLS.length)}1`)
    const inst = ws.getCell('A1')
    inst.value = 'SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL · SAN JUAN DEL RÍO, QRO.'
    inst.font = { name: 'Arial', bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
    inst.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }
    inst.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(1).height = 26

    // Fila 2 título
    ws.mergeCells(`A2:${String.fromCharCode(64 + COLS.length)}2`)
    const titulo = ws.getCell('A2')
    titulo.value = `REGISTRO OPERATIVO D1${desde ? ` — ${desde} AL ${hasta}` : ''}`
    titulo.font = { name: 'Arial', bold: true, size: 12, color: { argb: 'FF0F172A' } }
    titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
    titulo.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(2).height = 20

    // Fila 3 meta
    ws.mergeCells('A3:H3')
    ws.getCell('A3').value = `Generado: ${new Date().toLocaleString('es-MX')}`
    ws.getCell('A3').font = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF64748B' } }
    ws.getRow(3).height = 14

    // Cabeceras
    COLS.forEach((col, i) => {
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
            r.folioDenuncia, r.iph, r.folioCu, r.folioSija,
            r.delito, r.violencia ? 'SÍ' : 'NO',
            r.fechaReporte, r.horaReporte,
            r.lugarHecho, r.coloniaHecho, r.municipio,
            r.policiaACargo, r.crp, r.oficialNombre,
            r.estadoTramite, r.seGeneroD1 ? 'SÍ' : 'NO',
        ]
        vals.forEach((val, ci) => {
            const cell = ws.getCell(row, ci + 1)
            cell.value = val
            cell.font = { name: 'Arial', size: 9, color: { argb: ci === 0 ? 'FF2563EB' : 'FF1E293B' }, bold: ci === 0 }
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
            cell.border = BORDER
            cell.alignment = { vertical: 'middle', wrapText: true }
        })
        const maxLen = Math.max(...vals.map(v => String(v ?? '').length))
        ws.getRow(row).height = maxLen > 50 ? 35 : maxLen > 25 ? 30 : 15
    })

    ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4, activeCell: 'A5' }]
    ws.autoFilter = { from: 'A4', to: `${String.fromCharCode(64 + COLS.length)}4` }

    const buffer = await wb.xlsx.writeBuffer()
    const fecha = new Date().toISOString().split('T')[0]

    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="reportes_d1_${fecha}.xlsx"`,
        }
    })
}