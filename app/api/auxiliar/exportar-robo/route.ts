import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarCuestionariosRobo } from '@/lib/auxiliar/service'
import ExcelJS from 'exceljs'

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const formato = req.nextUrl.searchParams.get('formato') ?? 'xlsx'
    const datos = await listarCuestionariosRobo()

    // ── PDF: HTML imprimible ──────────────────────────────────────────────────
    if (formato === 'pdf') {
        const jsPDF = (await import('jspdf')).default

        const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' })
        const W = doc.internal.pageSize.getWidth()
        const H = doc.internal.pageSize.getHeight()
        const M = 30 // margen

        // ── Encabezado institucional ──────────────────────────────────────────
        doc.setFillColor(15, 23, 42)
        doc.rect(0, 0, W, 50, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(13)
        doc.text('SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL', W / 2, 20, { align: 'center' })
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(148, 163, 184)
        doc.text('San Juan del Río, Querétaro · Sistema SENTINEL', W / 2, 34, { align: 'center' })

        // ── Barra título ──────────────────────────────────────────────────────
        doc.setFillColor(30, 41, 59)
        doc.rect(0, 50, W, 24, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('CUESTIONARIO ÚNICO DE ROBO — ROL DE AUXILIAR DE NOVEDADES', W / 2, 66, { align: 'center' })

        // ── Metadatos ─────────────────────────────────────────────────────────
        doc.setTextColor(100, 116, 139)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7)
        doc.text(`Generado: ${new Date().toLocaleString('es-MX')}`, M, 88)
        doc.text(`Total de registros: ${datos.length}`, W - M, 88, { align: 'right' })

        // ── Definición de columnas ────────────────────────────────────────────
        const tableW = W - M * 2
        const cols = [
            { label: 'Folio Reporte', w: 0.10 },
            { label: 'Fecha', w: 0.08 },
            { label: 'Hora', w: 0.06 },
            { label: 'Folio Cuest.', w: 0.11 },
            { label: 'Robo / Delito', w: 0.13 },
            { label: 'Nombre Policía', w: 0.16 },
            { label: 'Nómina', w: 0.08 },
            { label: 'Reg. Tableta', w: 0.09 },
            { label: 'Sector', w: 0.08 },
            { label: 'Quien Ingresó', w: 0.11 },
        ]

        const colX: number[] = []
        let xAcc = M
        cols.forEach(c => { colX.push(xAcc); xAcc += c.w * tableW })

        const ROW_H = 14
        const HEADER_H = 16
        let y = 96

        const drawHeader = () => {
            doc.setFillColor(30, 41, 59)
            doc.rect(M, y, tableW, HEADER_H, 'F')
            doc.setTextColor(255, 255, 255)
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(6.5)
            cols.forEach((c, i) => {
                doc.text(c.label, colX[i] + 3, y + 11, { maxWidth: c.w * tableW - 6 })
            })
            y += HEADER_H
        }

        drawHeader()

        // ── Filas de datos ────────────────────────────────────────────────────
        datos.forEach((r, idx) => {
            if (y + ROW_H > H - 40) {
                doc.addPage()
                y = 30
                drawHeader()
            }

            const bg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252]
            doc.setFillColor(bg[0], bg[1], bg[2])
            doc.rect(M, y, tableW, ROW_H, 'F')

            doc.setDrawColor(226, 232, 240)
            doc.setLineWidth(0.3)
            doc.line(M, y + ROW_H, M + tableW, y + ROW_H)

            const valores = [
                r.folioReporte ?? '—',
                r.fecha ?? '—',
                r.hora ?? '—',
                r.folioCuestionario ?? '—',
                r.robo ?? '—',
                r.nombrePolicia ?? '—',
                r.nominaPolicia ?? '—',
                r.registroTableta ?? '—',
                r.sector ?? '—',
                r.nombreIngreso ?? '—',
            ]

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(6.5)
            valores.forEach((val, i) => {
                doc.setTextColor(i === 3 ? 37 : 30, i === 3 ? 99 : 41, i === 3 ? 235 : 59)
                doc.text(String(val), colX[i] + 3, y + 10, { maxWidth: cols[i].w * tableW - 6 })
            })

            y += ROW_H
        })

        // ── Fila total ────────────────────────────────────────────────────────
        y += 4
        doc.setFillColor(226, 232, 240)
        doc.rect(M, y, tableW, 16, 'F')
        doc.setTextColor(15, 23, 42)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.text(`TOTAL DE REGISTROS: ${datos.length}`, W - M, y + 11, { align: 'right' })

        // ── Pie de página ─────────────────────────────────────────────────────
        const footerY = H - 20
        doc.setDrawColor(226, 232, 240)
        doc.setLineWidth(0.5)
        doc.line(M, footerY - 5, W - M, footerY - 5)
        doc.setTextColor(148, 163, 184)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(6.5)
        doc.text('SSPM · San Juan del Río · SENTINEL v0.1', M, footerY)
        doc.text(`${new Date().toLocaleDateString('es-MX')}`, W - M, footerY, { align: 'right' })

        const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
        const fecha = new Date().toISOString().split('T')[0]

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="cuestionario_robo_${fecha}.pdf"`,
            }
        })
    }

    // ── XLSX ──────────────────────────────────────────────────────────────────
    const wb = new ExcelJS.Workbook()
    wb.creator = 'SENTINEL · SSPM'
    wb.created = new Date()
    wb.modified = new Date()

    const ws = wb.addWorksheet('Cuestionario Robo', {
        pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
        properties: { defaultRowHeight: 18 },
    })

    // Fila 1: Institución
    ws.mergeCells('A1:K1')
    const inst = ws.getCell('A1')
    inst.value = 'SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL · SAN JUAN DEL RÍO, QRO.'
    inst.font = { name: 'Arial', bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
    inst.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }
    inst.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(1).height = 28

    // Fila 2: Título
    ws.mergeCells('A2:K2')
    const titulo = ws.getCell('A2')
    titulo.value = 'CUESTIONARIO ÚNICO DE ROBO — ROL DE AUXILIAR DE NOVEDADES'
    titulo.font = { name: 'Arial', bold: true, size: 13, color: { argb: 'FF0F172A' } }
    titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
    titulo.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(2).height = 24

    // Fila 3: Metadatos
    ws.mergeCells('A3:F3')
    ws.getCell('A3').value = `Fecha de generación: ${new Date().toLocaleString('es-MX')}`
    ws.getCell('A3').font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF64748B' } }
    ws.mergeCells('G3:K3')
    ws.getCell('G3').value = `Total de registros: ${datos.length}`
    ws.getCell('G3').font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF64748B' } }
    ws.getCell('G3').alignment = { horizontal: 'right' }
    ws.getRow(3).height = 16

    // Fila 4: Cabeceras
    const COLS = [
        { header: 'Folio Incidente', width: 18 },
        { header: 'Folio Reporte', width: 16 },
        { header: 'Fecha', width: 13 },
        { header: 'Hora', width: 10 },
        { header: 'Folio Cuestionario', width: 20 },
        { header: 'Robo / Delito', width: 22 },
        { header: 'Nombre del Policía', width: 26 },
        { header: 'Nómina', width: 14 },
        { header: 'Reg. Tableta', width: 14 },
        { header: 'Sector', width: 14 },
        { header: 'Quien Ingresó', width: 26 },
    ]

    COLS.forEach((col, i) => {
        ws.getColumn(i + 1).width = col.width
        const cell = ws.getCell(4, i + 1)
        cell.value = col.header
        cell.font = { name: 'Arial', bold: true, size: 9, color: { argb: 'FFFFFFFF' } }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
        cell.border = {
            top: { style: 'thin', color: { argb: 'FF334155' } },
            bottom: { style: 'thin', color: { argb: 'FF334155' } },
            left: { style: 'thin', color: { argb: 'FF334155' } },
            right: { style: 'thin', color: { argb: 'FF334155' } },
        }
    })
    ws.getRow(4).height = 22

    // Filas de datos
    const BORDER: Partial<ExcelJS.Borders> = {
        top: { style: 'hair', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
        left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
        right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
    }

    datos.forEach((r, i) => {
        const rowNum = i + 5
        const bg = i % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC'

        const valores = [
            r.folioIncidente,
            r.folioReporte ?? '—',
            r.fecha ?? '—',
            r.hora ?? '—',
            r.folioCuestionario ?? '—',
            r.robo ?? '—',
            r.nombrePolicia ?? '—',
            r.nominaPolicia ?? '—',
            r.registroTableta ?? '—',
            r.sector ?? '—',
            r.nombreIngreso ?? '—',
        ]

        valores.forEach((val, col) => {
            const cell = ws.getCell(rowNum, col + 1)
            cell.value = val
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
            cell.border = BORDER
            cell.alignment = { vertical: 'middle' }
            cell.font = { name: 'Arial', size: 9 }
            if (col === 0) cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF2563EB' } }
            if (col === 4) cell.font = { name: 'Arial', size: 9, bold: true }
        })

        ws.getRow(rowNum).height = 16
    })

    // Fila total
    const totalRow = datos.length + 5
    ws.mergeCells(`A${totalRow}:J${totalRow}`)
    ws.getCell(`A${totalRow}`).value = 'TOTAL DE REGISTROS:'
    ws.getCell(`A${totalRow}`).font = { name: 'Arial', bold: true, size: 9, color: { argb: 'FF64748B' } }
    ws.getCell(`A${totalRow}`).alignment = { horizontal: 'right' }
    ws.getCell(`K${totalRow}`).value = datos.length
    ws.getCell(`K${totalRow}`).font = { name: 'Arial', bold: true, size: 10 }
    ws.getCell(`K${totalRow}`).alignment = { horizontal: 'center' }
    ws.getCell(`K${totalRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
    ws.getRow(totalRow).height = 18

    // Freeze y autofilter
    ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4, activeCell: 'A5' }]
    ws.autoFilter = { from: 'A4', to: 'K4' }

    const fecha = new Date().toISOString().split('T')[0]

    const buffer = await wb.xlsx.writeBuffer()
    const uint8 = new Uint8Array(buffer)

    return new NextResponse(uint8, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="cuestionario_robo_${fecha}.xlsx"`,
        }
    })
}