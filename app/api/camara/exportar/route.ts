import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerPorTurno, obtenerConcentradoDiario, obtenerTotalesCamara } from '@/lib/camara/repository'
import type { IncidenteCamara } from '@/lib/camara/types'
import ExcelJS from 'exceljs'

const COLS = [
    'Fecha', 'Pers. S/N', 'Pers. C/A', 'Veh. Revisión', 'Veh. REPUVE',
    'Persec.', 'Asegurados', 'Recuperados', 'Incendios', 'H. Tránsito',
    'Motos', 'Total Personas'
]

const INST = 'SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL · SAN JUAN DEL RÍO, QRO.'
const WIDTHS = [14, 12, 12, 14, 14, 12, 12, 14, 12, 14, 12, 16]

function rowVals(r: IncidenteCamara) {
    return [
        r.fecha ?? '—',
        r.personasSinNovedad,
        r.conAntecedentes,
        r.vehiculosRevisar,
        r.vehiculosRepuve,
        r.persecuciones,
        r.asegurados,
        r.recuperados,
        r.incendios,
        r.hechosTransito,
        r.motosRevisadas,
        r.totalPersonasRevisadas,
    ]
}

function crearHoja(
    wb: ExcelJS.Workbook,
    nombre: string,
    subtitulo: string,
    filas: IncidenteCamara[],
    opts?: { conTurno?: boolean }
) {
    const ws = wb.addWorksheet(nombre, { pageSetup: { orientation: 'landscape', fitToPage: true } })
    const colCount = opts?.conTurno ? COLS.length + 1 : COLS.length
    const lastCol = String.fromCharCode(64 + colCount)

    // Fila 1
    ws.mergeCells(`A1:${lastCol}1`)
    const inst = ws.getCell('A1')
    inst.value = INST
    inst.font = { name: 'Arial', bold: true, size: 10, color: { argb: 'FFFFFFFF' } }
    inst.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }
    inst.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(1).height = 24

    // Fila 2
    ws.mergeCells(`A2:${lastCol}2`)
    const titulo = ws.getCell('A2')
    titulo.value = subtitulo
    titulo.font = { name: 'Arial', bold: true, size: 11, color: { argb: 'FF0F172A' } }
    titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
    titulo.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(2).height = 18

    // Fila 3 meta
    ws.mergeCells(`A3:${lastCol}3`)
    ws.getCell('A3').value = `Generado: ${new Date().toLocaleString('es-MX')} · Total registros: ${filas.length}`
    ws.getCell('A3').font = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF64748B' } }
    ws.getRow(3).height = 13

    // Cabeceras
    const headers = opts?.conTurno ? ['Fecha', 'Turno', ...COLS.slice(1)] : COLS
    const widths = opts?.conTurno ? [14, 12, ...WIDTHS.slice(1)] : WIDTHS
    headers.forEach((h, i) => {
        ws.getColumn(i + 1).width = widths[i]
        const cell = ws.getCell(4, i + 1)
        cell.value = h
        cell.font = { name: 'Arial', bold: true, size: 8, color: { argb: 'FFFFFFFF' } }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }
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

    filas.forEach((r, i) => {
        const rowNum = i + 5
        const bg = i % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC'
        const         vals = opts?.conTurno
            ? [r.fecha ?? '—', r.turno ?? '', ...rowVals(r).slice(1)]
            : rowVals(r)

        vals.forEach((val, ci) => {
            const cell = ws.getCell(rowNum, ci + 1)
            cell.value = val
            cell.font = { name: 'Arial', size: 8, color: { argb: ci === vals.length - 1 ? 'FF2563EB' : 'FF1E293B' }, bold: ci === vals.length - 1 }
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
            cell.border = BORDER
            cell.alignment = { vertical: 'middle', horizontal: ci > 1 ? 'center' : 'left' }
        })
        ws.getRow(rowNum).height = 15
    })

    // Totales
    const totalRow = filas.length + 5
    const numCols = opts?.conTurno ? COLS.length + 1 : COLS.length
    ws.mergeCells(`A${totalRow}:${opts?.conTurno ? 'B' : 'A'}${totalRow}`)
    ws.getCell(`A${totalRow}`).value = 'TOTAL'
    ws.getCell(`A${totalRow}`).font = { name: 'Arial', bold: true, size: 9, color: { argb: 'FFFFFFFF' } }
    ws.getCell(`A${totalRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }
    ws.getCell(`A${totalRow}`).alignment = { horizontal: 'center' }

    const startCol = opts?.conTurno ? 3 : 2
    for (let ci = startCol; ci <= numCols; ci++) {
        const cell = ws.getCell(totalRow, ci)
        // Calcular suma manualmente en lugar de fórmula
        const suma = filas.reduce((acc, r) => {
            const vals = opts?.conTurno
                ? [0, 0, ...rowVals(r).slice(1)]
                : rowVals(r)
            return acc + (Number(vals[ci - 1]) || 0)
        }, 0)
        cell.value = suma
        cell.font = { name: 'Arial', bold: true, size: 9 }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
        cell.alignment = { horizontal: 'center' }
    }
    ws.getRow(totalRow).height = 18

    ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4, activeCell: 'A5' }]
    ws.autoFilter = { from: 'A4', to: `${lastCol}4` }
}

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const p = req.nextUrl.searchParams
    const desde = p.get('from') || '2000-01-01'
    const hasta = p.get('to') || new Date().toISOString().split('T')[0]

    const [t1, t2, t3, concentrado] = await Promise.all([
        obtenerPorTurno('MATUTINO', desde, hasta),
        obtenerPorTurno('VESPERTINO', desde, hasta),
        obtenerPorTurno('NOCTURNO', desde, hasta),
        obtenerConcentradoDiario(desde, hasta),
    ])

    const wb = new ExcelJS.Workbook()
    wb.creator = 'CENTINELA · SSPM'

    crearHoja(wb, 'TURNO 1 MATUTINO', 'REGISTROS DIARIOS — TURNO 1 MATUTINO', t1)
    crearHoja(wb, 'TURNO 2 VESPERTINO', 'REGISTROS DIARIOS — TURNO 2 VESPERTINO', t2)
    crearHoja(wb, 'TURNO 3 NOCTURNO', 'REGISTROS DIARIOS — TURNO 3 NOCTURNO', t3)
    crearHoja(wb, 'CONCENTRADO', 'CONCENTRADO MENSUAL — TODOS LOS TURNOS', concentrado, { conTurno: true })

    const buffer = await wb.xlsx.writeBuffer()
    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="camara_${new Date().toISOString().split('T')[0]}.xlsx"`,
        }
    })
}