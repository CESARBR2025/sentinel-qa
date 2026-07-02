import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerDatosTelefonicos } from '@/lib/reportes-operativos/service'
import ExcelJS from 'exceljs'

function getRango(req: NextRequest) {
    const tipo = req.nextUrl.searchParams.get('tipo') ?? 'diario'
    const semana = req.nextUrl.searchParams.get('semana') // formato: 2026-W27
    const mes = req.nextUrl.searchParams.get('mes')    // formato: 2026-06
    const hoy = new Date()
    const diaParam = req.nextUrl.searchParams.get('dia')

    if (diaParam) {
        return { desde: diaParam, hasta: diaParam, tipo: `DÍA ${diaParam}` }
    }

    if (semana) {
        const [year, week] = semana.split('-W').map(Number)
        const jan1 = new Date(year, 0, 1)
        const diasHastaLunes = (1 - jan1.getDay() + 7) % 7
        const primerLunes = new Date(year, 0, 1 + diasHastaLunes)
        const lunes = new Date(primerLunes)
        lunes.setDate(primerLunes.getDate() + (week - 1) * 7)
        const domingo = new Date(lunes)
        domingo.setDate(lunes.getDate() - 8) // una semana antes
        const sabado = new Date(domingo)
        sabado.setDate(domingo.getDate() + 6)
        return {
            desde: domingo.toISOString().split('T')[0],
            hasta: sabado.toISOString().split('T')[0],
            tipo: `SEMANA ${semana}`
        }
    }

    if (mes) {
        const [year, month] = mes.split('-').map(Number)
        const primero = new Date(year, month - 1, 1)
        const ultimo = new Date(year, month, 0)
        return { desde: primero.toISOString().split('T')[0], hasta: ultimo.toISOString().split('T')[0], tipo: `MES ${mes}` }
    }

    if (tipo === 'semanal') {
        const dia = hoy.getDay()
        const domingo = new Date(hoy); domingo.setDate(hoy.getDate() - dia)
        const sabado = new Date(domingo); sabado.setDate(domingo.getDate() + 6)
        return { desde: domingo.toISOString().split('T')[0], hasta: sabado.toISOString().split('T')[0], tipo: 'SEMANAL' }
    }

    if (tipo === 'mensual') {
        const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        const ultimo = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
        return { desde: primero.toISOString().split('T')[0], hasta: ultimo.toISOString().split('T')[0], tipo: 'MENSUAL' }
    }

    const hoyStr = hoy.toISOString().split('T')[0]
    return { desde: hoyStr, hasta: hoyStr, tipo: 'DIARIO' }
}

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const tipo = req.nextUrl.searchParams.get('tipo') ?? 'diario'
    const { desde, hasta, tipo: tipoLabel } = getRango(req)
    const data = await obtenerDatosTelefonicos(desde, hasta)

    const wb = new ExcelJS.Workbook()
    wb.creator = 'SENTINEL · SSPM'
    const ws = wb.addWorksheet('Reportes Telefónicos', {
        pageSetup: { orientation: 'portrait', fitToPage: true },
    })

    // Fila 1 — institución
    ws.mergeCells('A1:C1')
    const inst = ws.getCell('A1')
    inst.value = 'SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL · SAN JUAN DEL RÍO, QRO.'
    inst.font = { name: 'Arial', bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
    inst.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }
    inst.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(1).height = 26

    // Fila 2 — título
    ws.mergeCells('A2:C2')
    const titulo = ws.getCell('A2')
    titulo.value = `REPORTE TELEFÓNICO ${tipoLabel} — ${desde} AL ${hasta}`
    titulo.font = { name: 'Arial', bold: true, size: 12, color: { argb: 'FF0F172A' } }
    titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
    titulo.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(2).height = 20

    // Fila 3 — meta
    ws.mergeCells('A3:B3')
    ws.getCell('A3').value = `Generado: ${new Date().toLocaleString('es-MX')}`
    ws.getCell('A3').font = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF64748B' } }
    ws.getCell('C3').value = `Total: ${data.length}`
    ws.getCell('C3').font = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF64748B' } }
    ws.getCell('C3').alignment = { horizontal: 'right' }
    ws.getRow(3).height = 14

    // Cabeceras
    const cols = [
        { header: 'Número Telefónico', key: 'telefono', width: 24 },
        { header: 'Fecha de Reporte', key: 'fecha', width: 18 },
        { header: 'Tipo de Incidencia', key: 'incidencia', width: 40 },
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
        const vals = [r.telefono, r.fecha, r.incidencia]
        vals.forEach((val, ci) => {
            const cell = ws.getCell(row, ci + 1)
            cell.value = val
            cell.font = { name: 'Arial', size: 9, color: { argb: ci === 0 ? 'FF2563EB' : 'FF1E293B' }, bold: ci === 0 }
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
            cell.border = BORDER
            cell.alignment = { vertical: 'middle', wrapText: true }
        })
        ws.getRow(row).height = 15
    })

    ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4, activeCell: 'A5' }]
    ws.autoFilter = { from: 'A4', to: 'C4' }

    const buffer = await wb.xlsx.writeBuffer()
    const fecha = new Date().toISOString().split('T')[0]

    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="reporte_telefonico_${tipo}_${fecha}.xlsx"`,
        }
    })
}