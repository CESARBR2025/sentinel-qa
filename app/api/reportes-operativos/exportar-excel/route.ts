import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerDatosExcel } from '@/lib/reportes-operativos/service'
import { tienePermiso } from '@/lib/incidentes/permisos'
import ExcelJS from 'exceljs'

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (!(await tienePermiso(session.user.id, 'modulo_incidentes', 'ver'))) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const p = req.nextUrl.searchParams
    const desde = p.get('from') ?? '2000-01-01'
    const hasta = p.get('to') ?? new Date().toISOString().split('T')[0]

    const { general, motos, vehiculos, cateos, detenidos, ordenes, hidrocarburo, armas, droga } =
        await obtenerDatosExcel(desde, hasta)

    const wb = new ExcelJS.Workbook()
    wb.creator = 'CENTINELA · SSPM'
    wb.created = new Date()
    wb.modified = new Date()

    // ── Estilos comunes ───────────────────────────────────────────────────────
    const HEADER_FILL: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }
    const SUBHEADER_FILL: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }
    const ALT_FILL: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } }
    const WHITE_FILL: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }
    const ACCENT_FILL: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }

    const BORDER: Partial<ExcelJS.Borders> = {
        top: { style: 'hair', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
        left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
        right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
    }

    const WHITE_TEXT: Partial<ExcelJS.Font> = { name: 'Arial', bold: true, size: 9, color: { argb: 'FFFFFFFF' } }
    const DARK_TEXT: Partial<ExcelJS.Font> = { name: 'Arial', size: 9, color: { argb: 'FF1E293B' } }
    const BLUE_TEXT: Partial<ExcelJS.Font> = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF2563EB' } }
    const CENTER: Partial<ExcelJS.Alignment> = { horizontal: 'center', vertical: 'middle', wrapText: true }
    const LEFT: Partial<ExcelJS.Alignment> = { horizontal: 'left', vertical: 'middle', wrapText: true }

    // ── Helper: crear hoja con diseño institucional ───────────────────────────
    function crearHoja(nombre: string, columnas: { header: string; width: number; key: string }[], filas: Record<string, unknown>[]) {
        const ws = wb.addWorksheet(nombre, {
            pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
        })

        // Fila 1: Institución
        ws.mergeCells(`A1:${String.fromCharCode(64 + columnas.length)}1`)
        const inst = ws.getCell('A1')
        inst.value = 'SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL · SAN JUAN DEL RÍO, QRO.'
        inst.font = { name: 'Arial', bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
        inst.fill = HEADER_FILL
        inst.alignment = CENTER
        ws.getRow(1).height = 26

        // Fila 2: Título de la hoja
        ws.mergeCells(`A2:${String.fromCharCode(64 + columnas.length)}2`)
        const titulo = ws.getCell('A2')
        titulo.value = nombre.toUpperCase()
        titulo.font = { name: 'Arial', bold: true, size: 12, color: { argb: 'FF0F172A' } }
        titulo.fill = ACCENT_FILL
        titulo.alignment = CENTER
        ws.getRow(2).height = 22

        // Fila 3: Fecha generación
        ws.mergeCells(`A3:${String.fromCharCode(64 + Math.floor(columnas.length / 2))}3`)
        ws.getCell('A3').value = `Generado: ${new Date().toLocaleString('es-MX')}`
        ws.getCell('A3').font = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF64748B' } }
        const colMid = Math.floor(columnas.length / 2) + 1
        ws.mergeCells(`${String.fromCharCode(64 + colMid)}3:${String.fromCharCode(64 + columnas.length)}3`)
        ws.getCell(`${String.fromCharCode(64 + colMid)}3`).value = `Total: ${filas.length} registros`
        ws.getCell(`${String.fromCharCode(64 + colMid)}3`).font = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF64748B' } }
        ws.getCell(`${String.fromCharCode(64 + colMid)}3`).alignment = { horizontal: 'right' }
        ws.getRow(3).height = 14

        // Fila 4: Cabeceras
        columnas.forEach((col, i) => {
            ws.getColumn(i + 1).width = col.width
            if (ws.getColumn(i + 1).width! < 18 && col.key === 'fecha') {
                ws.getColumn(i + 1).width = 18
            }
            const cell = ws.getCell(4, i + 1)
            cell.value = col.header
            cell.font = WHITE_TEXT
            cell.fill = SUBHEADER_FILL
            cell.alignment = CENTER
            cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
        })
        ws.getRow(4).height = 20

        // Filas de datos
        filas.forEach((fila, idx) => {
            const rowNum = idx + 5
            const fill = idx % 2 === 0 ? WHITE_FILL : ALT_FILL
            columnas.forEach((col, ci) => {
                const cell = ws.getCell(rowNum, ci + 1)
                cell.value = (fila[col.key] as any) ?? '—'
                cell.font = ci === 0 ? BLUE_TEXT : DARK_TEXT
                cell.fill = fill
                cell.border = BORDER
                cell.alignment = LEFT
            })
            const maxLen = Math.max(...columnas.map(col => String((fila[col.key] as any) ?? '').length))
            ws.getRow(rowNum).height = maxLen > 50 ? 40 : maxLen > 25 ? 22 : 15
        })

        // Fila total
        const totalRow = filas.length + 5
        ws.mergeCells(`A${totalRow}:${String.fromCharCode(64 + columnas.length - 1)}${totalRow}`)
        ws.getCell(`A${totalRow}`).value = 'TOTAL DE REGISTROS:'
        ws.getCell(`A${totalRow}`).font = { name: 'Arial', bold: true, size: 9, color: { argb: 'FF64748B' } }
        ws.getCell(`A${totalRow}`).alignment = { horizontal: 'right' }
        ws.getCell(`${String.fromCharCode(64 + columnas.length)}${totalRow}`).value = filas.length
        ws.getCell(`${String.fromCharCode(64 + columnas.length)}${totalRow}`).font = { name: 'Arial', bold: true, size: 10 }
        ws.getCell(`${String.fromCharCode(64 + columnas.length)}${totalRow}`).fill = ACCENT_FILL
        ws.getCell(`${String.fromCharCode(64 + columnas.length)}${totalRow}`).alignment = CENTER
        ws.getRow(totalRow).height = 16

        // Freeze y autofilter
        ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4, activeCell: 'A5' }]
        ws.autoFilter = { from: `A4`, to: `${String.fromCharCode(64 + columnas.length)}4` }
    }

    // ── Hoja General ──────────────────────────────────────────────────────────
    crearHoja('GENERAL', [
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'Folio', key: 'folio', width: 18 },
        { header: 'Oficial / Mando', key: 'oficial', width: 24 },
        { header: 'Cateo', key: 'cateo', width: 28 },
        { header: 'Detenidos', key: 'detenidos', width: 30 },
        { header: 'Vehículos', key: 'vehiculos', width: 32 },
        { header: 'Armas', key: 'armas', width: 28 },
        { header: 'Droga', key: 'droga', width: 28 },
        { header: 'Hidrocarburo', key: 'hidrocarburo', width: 28 },
        { header: 'Órdenes Apreh.', key: 'ordenes', width: 28 },
        { header: 'Robo (Monto)', key: 'robo', width: 16 },
        { header: 'Objetos Recup.', key: 'objetos', width: 28 },
    ], general)

    // ── Hojas específicas ─────────────────────────────────────────────────────
    crearHoja('MOTOS', [
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'Folio', key: 'folio', width: 18 },
        { header: 'Datos', key: 'datos', width: 36 },
        { header: 'Estatus', key: 'estatus', width: 14 },
        { header: 'Carpeta', key: 'carpeta', width: 18 },
        { header: 'Seguimiento', key: 'seguimiento', width: 28 },
    ], motos)

    crearHoja('VEHÍCULOS', [
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'Folio', key: 'folio', width: 18 },
        { header: 'Datos', key: 'datos', width: 36 },
        { header: 'Estatus', key: 'estatus', width: 14 },
        { header: 'Carpeta', key: 'carpeta', width: 18 },
        { header: 'Seguimiento', key: 'seguimiento', width: 28 },
    ], vehiculos)

    crearHoja('CATEOS', [
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'Folio', key: 'folio', width: 18 },
        { header: 'Ubicación', key: 'ubicacion', width: 36 },
        { header: 'Dependencia', key: 'dependencia', width: 16 },
        { header: 'Seguimiento', key: 'seguimiento', width: 28 },
    ], cateos)

    crearHoja('DETENIDOS', [
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'Folio', key: 'folio', width: 18 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Observaciones', key: 'observaciones', width: 32 },
        { header: 'Fiscalía', key: 'fiscalia', width: 20 },
        { header: 'Seguimiento', key: 'seguimiento', width: 28 },
    ], detenidos)

    crearHoja('ÓRDENES APREHENSIÓN', [
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'Folio', key: 'folio', width: 18 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Observaciones', key: 'observaciones', width: 32 },
        { header: 'Estatus', key: 'estatus', width: 16 },
        { header: 'Seguimiento', key: 'seguimiento', width: 28 },
    ], ordenes)

    crearHoja('HIDROCARBURO', [
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'Folio', key: 'folio', width: 18 },
        { header: 'Nombre', key: 'nombre', width: 28 },
        { header: 'Vehículo', key: 'vehiculo', width: 28 },
        { header: 'Litros', key: 'litros', width: 12 },
        { header: 'Toma Clandestina', key: 'toma', width: 24 },
        { header: 'Observaciones', key: 'observaciones', width: 32 },
        { header: 'Seguimiento', key: 'seguimiento', width: 28 },
    ], hidrocarburo)

    crearHoja('ARMAS DE FUEGO', [
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'Folio', key: 'folio', width: 18 },
        { header: 'Datos Arma', key: 'datos', width: 32 },
        { header: 'Cartuchos', key: 'cartuchos', width: 14 },
        { header: 'Observaciones', key: 'observaciones', width: 32 },
        { header: 'Seguimiento', key: 'seguimiento', width: 28 },
    ], armas)

    crearHoja('DOSIS DROGA', [
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'Folio', key: 'folio', width: 18 },
        { header: 'Cantidad', key: 'cantidad', width: 14 },
        { header: 'Nombre/Tipo', key: 'nombre', width: 24 },
        { header: 'Observaciones', key: 'observaciones', width: 32 },
        { header: 'Seguimiento', key: 'seguimiento', width: 28 },
    ], droga)

    const buffer = await wb.xlsx.writeBuffer()
    const fecha = new Date().toISOString().split('T')[0]

    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="reporte_operativo_${fecha}.xlsx"`,
        }
    })
}