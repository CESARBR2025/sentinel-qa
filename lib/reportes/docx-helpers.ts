import {
    Table, TableRow, TableCell, ImageRun, TextRun, WidthType,
    BorderStyle, AlignmentType, ShadingType, Paragraph, Header,
} from 'docx'
import fs from 'fs'
import path from 'path'

// Helpers compartidos de construcción de .docx (Etapa 1 del Parte de Novedades).
// Extraídos de app/api/nCoordinacion/generar/route.ts — refactor puro, cero
// cambio funcional: nCoordinación y NOVEDADES comparten estos constructores.
// La lógica de negocio de cada tabla de cada formato NO vive aquí.

export const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
export const THIN = { style: BorderStyle.SINGLE, size: 4, color: '000000' }
export const allBorders = { top: THIN, bottom: THIN, left: THIN, right: THIN }
export const noBorders = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER }

export function r(text: string, opts: { bold?: boolean; size?: number } = {}) {
    return new TextRun({ text: String(text ?? ''), font: 'Calibri', size: opts.size ?? 16, bold: opts.bold ?? false })
}

export type Alignment = "start" | "center" | "end" | "both" | "mediumKashida" | "distribute" | "numTab" | "highKashida" | "lowKashida" | "thaiDistribute" | "left" | "right"

export function p(children: TextRun | TextRun[], opts: { align?: Alignment; before?: number; after?: number } = {}) {
    return new Paragraph({
        alignment: opts.align,
        spacing: { before: opts.before ?? 0, after: opts.after ?? 60 },
        children: Array.isArray(children) ? children : [children],
    })
}

export function tc(child: (Paragraph | Table) | (Paragraph | Table)[], opts: { width?: number; shade?: boolean; noBorder?: boolean } = {}) {
    return new TableCell({
        width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
        shading: opts.shade ? { type: ShadingType.CLEAR, color: 'auto', fill: 'D9D9D9' } : undefined,
        borders: opts.noBorder ? noBorders : allBorders,
        children: Array.isArray(child) ? child : [child],
    })
}

export function tr(cells: TableCell[]) { return new TableRow({ children: cells }) }

export function hRow(labels: string[], widths: number[], shade = true) {
    return tr(labels.map((l, i) =>
        tc(p(r(l), { align: AlignmentType.CENTER, after: 0 }), { width: widths[i], shade })
    ))
}

export function dRow(values: string[], widths: number[]) {
    return tr(values.map((v, i) =>
        tc(p(r(String(v ?? ''), { size: 16 }), { align: AlignmentType.CENTER, after: 0 }), { width: widths[i] })
    ))
}

export const toN = (v: unknown) => String(v ?? '00').padStart(2, '0')

/** Línea de firma: tabla de 1 celda con borde inferior (espacio para firmar). */
export function lineaFirma() {
    return new Table({
        width: { size: 3000, type: WidthType.DXA },
        alignment: AlignmentType.CENTER,
        rows: [tr([new TableCell({
            borders: { top: NO_BORDER, left: NO_BORDER, right: NO_BORDER, bottom: THIN },
            children: [new Paragraph({ children: [new TextRun({ text: ' ', size: 16 })] })],
        })])],
    })
}

/**
 * Header del documento con los dos logos institucionales (gobierno de México a
 * la izquierda, Querétaro a la derecha). Lee de public/ con fs.readFileSync.
 */
export function encabezadoConLogos(): Header {
    const logoMx = fs.readFileSync(path.join(process.cwd(), 'public', 'logo_gobierno_mx.png'))
    const logoQro = fs.readFileSync(path.join(process.cwd(), 'public', 'logo_queretaro.jpeg'))
    return new Header({
        children: [
            new Table({
                width: { size: 9360, type: WidthType.DXA },
                borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
                rows: [tr([
                    tc([new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [new ImageRun({ data: logoMx, transformation: { width: 80, height: 80 }, type: 'png' })],
                    })], { width: 2000, noBorder: true }),
                    tc([p(r(''), { after: 0 })], { width: 5360, noBorder: true }),
                    tc([new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new ImageRun({ data: logoQro, transformation: { width: 80, height: 80 }, type: 'jpg' })],
                    })], { width: 2000, noBorder: true }),
                ])],
            }),
        ],
    })
}

/**
 * Patrón "Sin Novedad": encabezado + una fila con "Sin Novedad" en la primera
 * celda y el resto vacías. Es el comportamiento por defecto de 17 de las 34
 * tablas del Parte de Novedades cuando el listado viene vacío.
 */
export function tablaSinNovedad(headers: string[], widths: number[]): Table {
    return new Table({
        width: { size: 9360, type: WidthType.DXA },
        rows: [
            hRow(headers, widths, false),
            tr([
                tc(p(r('Sin Novedad', { size: 16 }), { align: AlignmentType.CENTER, after: 0 }), { width: widths[0] }),
                ...widths.slice(1).map(w => tc(p(r('', { size: 16 }), { align: AlignmentType.CENTER, after: 0 }), { width: w })),
            ]),
        ],
    })
}
