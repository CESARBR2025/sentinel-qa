import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import {
    obtenerEventosDia, obtenerRND, obtenerArmasDia, obtenerDatosCapturados,
    obtenerConteosDetenidos,
} from '@/lib/n-coordinacion/repository'
import { tieneAccesoFormatoN } from '@/lib/reportes/permisos'
import {
    Document, Packer, Paragraph, Table, TableRow, TableCell, ImageRun,
    TextRun, WidthType, BorderStyle, AlignmentType, ShadingType,
} from 'docx'
import fs from 'fs'
import path from 'path'
import { Header } from 'docx'

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const THIN = { style: BorderStyle.SINGLE, size: 4, color: '000000' }
const allBorders = { top: THIN, bottom: THIN, left: THIN, right: THIN }
const noBorders = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER }

function r(text: string, opts: { bold?: boolean; size?: number } = {}) {
    return new TextRun({ text: String(text ?? ''), font: 'Calibri', size: 16, bold: false })
}

type Alignment = "start" | "center" | "end" | "both" | "mediumKashida" | "distribute" | "numTab" | "highKashida" | "lowKashida" | "thaiDistribute" | "left" | "right"

function p(children: TextRun | TextRun[], opts: { align?: Alignment; before?: number; after?: number } = {}) {
    return new Paragraph({
        alignment: opts.align,
        spacing: { before: opts.before ?? 0, after: opts.after ?? 60 },
        children: Array.isArray(children) ? children : [children],
    })
}

function tc(child: (Paragraph | Table) | (Paragraph | Table)[], opts: { width?: number; shade?: boolean; noBorder?: boolean } = {}) {
    return new TableCell({
        width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
        shading: opts.shade ? { type: ShadingType.CLEAR, color: 'auto', fill: 'D9D9D9' } : undefined,
        borders: opts.noBorder ? noBorders : allBorders,
        children: Array.isArray(child) ? child : [child],
    })
}

function tr(cells: TableCell[]) { return new TableRow({ children: cells }) }

function hRow(labels: string[], widths: number[], shade = true) {
    return tr(labels.map((l, i) =>
        tc(p(r(l), { align: AlignmentType.CENTER, after: 0 }), { width: widths[i], shade })
    ))
}

function dRow(values: string[], widths: number[]) {
    return tr(values.map((v, i) =>
        tc(p(r(String(v ?? ''), { size: 16 }), { align: AlignmentType.CENTER, after: 0 }), { width: widths[i] })
    ))
}

const toN = (v: unknown) => String(v ?? '00').padStart(2, '0')

function tablaFiscalia(
  domiciliosLabel: string,
  datos: Record<string, unknown> | null,
  conteos: { carpetas_iniciadas: number; numero_cateos: number; vehiculos_asegurados: number; personas_aseguradas: number }
) {
  const wFge = [1872, 1872, 1872, 1872, 1872]
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    rows: [
      hRow(['Carpetas iniciadas','Número de cateos','Vehículos asegurados', domiciliosLabel,'Personas aseguradas'], wFge, false),
      dRow([
        String(conteos.carpetas_iniciadas),      // automático — D1s generadas
        String(conteos.numero_cateos),            // automático — cateos BD
        String(conteos.vehiculos_asegurados),     // automático — vehículos BD
        toN(datos?.domicilios_cateados),          // manual
        String(conteos.personas_aseguradas),      // automático — detenidos BD
      ], wFge),
      hRow(['Aprehensiones','Audiencias iniciales','Abreviados','Audiencias intermedias','Audiencias de juicio'], wFge, false),
      dRow([
        toN(datos?.aprehensiones),
        toN(datos?.audiencias_iniciales),
        toN(datos?.abreviados),
        toN(datos?.audiencias_intermedias),
        '00',
      ], wFge),
    ],
  })
}

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() })
    const usuario = session?.user as { name: string; apellido?: string }
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (!(await tieneAccesoFormatoN(session.user.id))) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const fecha = req.nextUrl.searchParams.get('fecha') ?? new Date().toISOString().split('T')[0]
    const [y, m, d] = fecha.split('-')
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    const fechaTexto = `${d} de ${meses[parseInt(m) - 1]} del ${y}`

    const [eventos, rnd, armas, datosCapturados, conteosFge, conteosFgr] = await Promise.all([
        obtenerEventosDia(fecha),
        obtenerRND(fecha),
        obtenerArmasDia(fecha),
        obtenerDatosCapturados(fecha),
        obtenerConteosDetenidos(fecha, 'FISCALIA'),
        obtenerConteosDetenidos(fecha, 'FGR'),
    ])

    const { fge, fgr, masc, victimas, obs } = datosCapturados

    // ── Tabla niveles ─────────────────────────────────────────────────────────
    const NIVELES = [
        ['NIVEL 1', 'Aquellas que requieren actuación inmediata y urgente por parte de los diversos niveles de gobierno y que representan un alto riesgo para la seguridad y la estabilidad sociopolítica. Deben ser atendidas en un tiempo estimado de 30 minutos a 1 hora.'],
        ['NIVEL 2', 'Aquellas que requieren atención prioritaria por los diversos niveles de gobierno y que representan situaciones que podrían derivar en un alerta nivel 1. Deben recibir respuesta en un tiempo estimado máximo de 12 horas.'],
        ['NIVEL 3', 'Aquellas que requieren atención a mediano plazo por los diversos niveles de gobierno. Recibirán respuesta en un tiempo estimado entre 24 horas a 1 semana.'],
        ['NIVEL 4', 'Aquellas que requieren de atención a largo plazo por alguno de los tres niveles de gobierno. Deberán recibir respuesta en un tiempo estimado de 1 a 4 semanas.'],
    ]
    const tablaNiveles = new Table({
        width: { size: 9360, type: WidthType.DXA },
        rows: NIVELES.map(([nivel, desc]) => tr([
            tc(p(r(nivel, { size: 16 }), { after: 0 }), { width: 1200 }),
            tc(p(r(desc, { size: 16 }), { align: AlignmentType.JUSTIFIED, after: 0 }), { width: 8160 }),
        ])),
    })

    // ── A. Eventos ────────────────────────────────────────────────────────────
    const wEv = [900, 2000, 1500, 1500, 2460, 1000]
    const filasEventos = eventos.length > 0
        ? eventos.map(e => dRow([
            String(e.hora ?? '--').slice(0, 5),
            `Región 3\n${String(e.region ?? 'San Juan del Río')},\nPolicía Municipal`,
            String(e.evento ?? '--'),
            String(e.ubicacion ?? '--'),
            String(e.descripcion ?? 'Sin Novedad'),
            String(e.atenciones ?? '--'),
        ], wEv))
        : [
            dRow(['--', 'Región 3\nSan Juan del Río,\nPolicía Municipal', '--', '--', 'Sin Novedad', '--'], wEv),
            dRow(['--', 'Región 3\nPedro Escobedo,\nPolicía Municipal', '--', '--', 'Sin Novedad', '--'], wEv),
            dRow(['--', 'Región 3\nEzequiel Montes,\nPolicía Municipal', '--', '--', 'Sin Novedad', '--'], wEv),
            dRow(['--', 'Región 3\nTequisquiapan,\nPolicía Municipal', '--', '--', 'Sin Novedad', '--'], wEv),
        ]

    const tablaEventos = new Table({
        width: { size: 9360, type: WidthType.DXA },
        rows: [hRow(['HORA', 'REGIÓN', 'EVENTO', 'UBICACIÓN', 'DESCRIPCIÓN', 'ATENCIONES'], wEv, false), ...filasEventos],
    })

    // ── D. RND ────────────────────────────────────────────────────────────────
    const wRnd = [1500, 3000, 2500, 2360]
    const filasRnd = rnd.length > 0
        ? rnd.map(row => dRow([String(row.hora_detencion ?? '').slice(0, 5), String(row.delito ?? ''), String(row.autoridad ?? ''), String(row.folio ?? '')], wRnd))
        : [tr([tc(p(r('', { size: 16 }), { after: 0 }), { width: wRnd[0] }), tc(p(r('Sin Novedad', { size: 16 }), { after: 0 }), { width: wRnd[1] }), tc(p(r('', { size: 16 }), { after: 0 }), { width: wRnd[2] }), tc(p(r('', { size: 16 }), { after: 0 }), { width: wRnd[3] })])]

    const tablaRnd = new Table({
        width: { size: 9360, type: WidthType.DXA },
        rows: [hRow(['HORA DE DETENCIÓN', 'DELITO', 'AUTORIDAD QUE REALIZÓ LA DETENCIÓN', 'FOLIO'], wRnd, false), ...filasRnd],
    })

    // ── E. MASC ───────────────────────────────────────────────────────────────
    const wMasc = [3120, 2120, 4120]
    const tablaMasc = new Table({
        width: { size: 9360, type: WidthType.DXA },
        rows: [
            hRow(['Asuntos canalizados por Fiscalía', 'Acuerdos', 'Monto de reparación del daño'], wMasc, false),
            tr([
                tc(p(r(masc ? String(masc.asuntos_canalizados_por_fiscalia) : 'Sin Novedad', { size: 16 }), { align: AlignmentType.CENTER, after: 0 }), { width: wMasc[0] }),
                tc(p(r(masc ? String(masc.acuerdos) : '', { size: 16 }), { align: AlignmentType.CENTER, after: 0 }), { width: wMasc[1] }),
                tc(p(r(masc ? `$${Number(masc.monto_reparacion_danos).toLocaleString('es-MX')}` : '', { size: 16 }), { align: AlignmentType.CENTER, after: 0 }), { width: wMasc[2] }),
            ]),
        ],
    })

    // ── F. Víctimas ───────────────────────────────────────────────────────────
    const wVic = [2340, 2340, 2340, 2340]
    const tablaVictimas = new Table({
        width: { size: 9360, type: WidthType.DXA },
        rows: [
            hRow(['Número de atenciones', 'Atenciones médicas', 'Atenciones psicológicas', 'Asesorías jurídicas'], wVic, false),
            dRow([
                victimas ? String(victimas.numero_atenciones) : 'Sin Novedad',
                victimas ? String(victimas.atenciones_medicas) : '',
                victimas ? String(victimas.atenciones_psicologicas) : '',
                victimas ? String(victimas.asesorias_juridicas) : '',
            ], wVic),
        ],
    })

    // ── G. Observaciones ─────────────────────────────────────────────────────
    const tablaObs = new Table({
        width: { size: 9360, type: WidthType.DXA },
        rows: [
            tr([tc(p(r('Observaciones'), { align: AlignmentType.CENTER, after: 0 }))]),
            tr([tc(p(r(String(obs?.observaciones ?? 'Sin Novedad')), { align: AlignmentType.CENTER, after: 0 }))]),
        ],
    })

    // ── H. Armas ──────────────────────────────────────────────────────────────
    const wArmas = [2000, 1560, 1800, 1500, 2500]
    const filasArmas = armas.length > 0
        ? armas.map(row => {
            const a = row.arma as Record<string, string>
            return dRow([String(row.carpeta ?? ''), String(a.tipo ?? ''), String(a.serie ?? a.matricula ?? ''), String(a.calibre ?? ''), String(a.observaciones ?? '')], wArmas)
        })
        : [tr([tc(p(r('Sin Novedad', { size: 16 }), { after: 0 }), { width: wArmas[0] }), tc(p(r('', { size: 16 }), { after: 0 }), { width: wArmas[1] }), tc(p(r('', { size: 16 }), { after: 0 }), { width: wArmas[2] }), tc(p(r('', { size: 16 }), { after: 0 }), { width: wArmas[3] }), tc(p(r('', { size: 16 }), { after: 0 }), { width: wArmas[4] })])]

    const tablaArmas = new Table({
        width: { size: 9360, type: WidthType.DXA },
        rows: [hRow(['Carpeta de Investigación', 'Tipo de Arma', 'Matricula', 'Calibre', 'Observaciones (Corporación)'], wArmas, false), ...filasArmas],
    })

    // ── Firmas ────────────────────────────────────────────────────────────────
    function lineaFirma() {
        return new Table({
            width: { size: 3000, type: WidthType.DXA },
            alignment: AlignmentType.CENTER,
            rows: [tr([new TableCell({
                borders: { top: NO_BORDER, left: NO_BORDER, right: NO_BORDER, bottom: THIN },
                children: [new Paragraph({ children: [new TextRun({ text: ' ', size: 16 })] })],
            })])],
        })
    }

    const tablaFirmas = new Table({
        width: { size: 9360, type: WidthType.DXA },
        rows: [tr([
            tc([
                lineaFirma(),
                p(r(String(obs?.elaboro ?? `${usuario.name} ${usuario.apellido ?? ''}`.trim())), { align: AlignmentType.CENTER, after: 0 }), p(r('Elaboró'), { align: AlignmentType.CENTER, after: 0 }),
            ], { width: 4680, noBorder: true }),
            tc([
                lineaFirma(),
                p(r('Pol. 3° José Concepción Uribe Olvera.'), { align: AlignmentType.CENTER, after: 0 }),
                p(r('Jefe C4'), { align: AlignmentType.CENTER, after: 0 }),
            ], { width: 4680, noBorder: true }),
        ])],
    })

    const logoMx = fs.readFileSync(path.join(process.cwd(), 'public', 'logo_gobierno_mx.png'))
    const logoQro = fs.readFileSync(path.join(process.cwd(), 'public', 'logo_queretaro.jpeg'))

    // ── Documento ─────────────────────────────────────────────────────────────
    const doc = new Document({
        sections: [{
            headers: {
                default: new Header({
                    children: [
                        new Table({
                            width: { size: 9360, type: WidthType.DXA },
                            borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
                            rows: [tr([
                                tc([new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    children: [new ImageRun({ data: logoMx, transformation: { width: 80, height: 80 }, type: 'png' })],
                                })], { width: 2000, noBorder: true }),
                                tc([
                                    p(r(''), { after: 0 }),
                                ], { width: 5360, noBorder: true }),
                                tc([new Paragraph({
                                    alignment: AlignmentType.RIGHT,
                                    children: [new ImageRun({ data: logoQro, transformation: { width: 80, height: 80 }, type: 'jpg' })],
                                })], { width: 2000, noBorder: true }),
                            ])],
                        }),
                    ],
                }),
            },
            properties: {
                page: {
                    size: { width: 12240, height: 15840 },
                    margin: { top: 1440, bottom: 720, left: 1080, right: 720 },
                },
            },
            children: [
                p(r('PARTE DE NOVEDADES DEL GRUPO DE COORDINACIÓN QUERÉTARO', { bold: true, size: 28 }), { align: AlignmentType.CENTER, after: 60 }),
                p(r('EN EL MARCO DEL PLAN NACIONAL DE PAZ Y SEGURIDAD.', { bold: true, size: 24 }), { align: AlignmentType.CENTER, after: 120 }),
                p(r(`San Juan del Río; Querétaro; a ${fechaTexto}`, { size: 16 }), { align: AlignmentType.RIGHT, after: 80 }),
                new Table({
                    width: { size: 5500, type: WidthType.DXA },
                    alignment: AlignmentType.RIGHT,
                    rows: [tr([tc(p(r(`EVENTOS DE LAS 24 HORAS DE LAS 05:00 HORAS DEL ${d} DEL ${y} A LAS 05:00 HORAS DEL ${d} DEL ${y}`, { bold: true, size: 14 }), { align: AlignmentType.CENTER, after: 0 }))])],
                }),
                p(r(''), { after: 120 }),
                p(r('A continuación, se informan los eventos relevantes ocurridos en el Estado de Querétaro, y que se consideran que atentan contra el bienestar social, así como eventos ocurridos con violencia o probablemente relacionados con delincuencia organizada, tales como los aseguramientos de armas de fuego o hidrocarburo, delitos contra la salud, homicidios, robos cometidos con violencia, delitos sexuales, delitos contra la libertad personal y delitos contra el estado.', { size: 16 }), { align: AlignmentType.JUSTIFIED, after: 80 }),
                p(r('Asimismo, los niveles de alerta de cada uno de los eventos deberán establecerse de conformidad con los siguientes criterios:', { size: 16 }), { align: AlignmentType.JUSTIFIED, after: 80 }),
                tablaNiveles,
                p(r(''), { after: 80 }),
                p([r('A.  ', { bold: true, size: 16 }), r('Eventos informados', { size: 16 })], { after: 60 }),
                tablaEventos,
                p(r(''), { after: 80 }),
                p([r('B.  ', { bold: true, size: 16 }), r('Eventos informados por la Fiscalía General del Estado', { size: 16 })], { after: 60 }),
                tablaFiscalia('Domicilios cateados',   fge, conteosFge),
                p(r(''), { after: 80 }),
                p([r('C.  ', { bold: true, size: 16 }), r('Eventos informados por la Fiscalía General de la República', { size: 16 })], { after: 60 }),
                tablaFiscalia('Domicilios asegurados', fgr, conteosFgr),
                p(r(''), { after: 80 }),
                p([r('D.  ', { bold: true, size: 16 }), r('Inscripciones en el Registro Nacional de Detenciones', { size: 16 })], { after: 60 }),
                tablaRnd,
                p(r(''), { after: 80 }),
                p([r('E.  ', { bold: true, size: 16 }), r('Medios Alternativos de Solución de Conflictos', { size: 16 })], { after: 60 }),
                tablaMasc,
                p(r(''), { after: 80 }),
                p([r('F.  ', { bold: true, size: 16 }), r('Atención a Victimas', { size: 16 })], { after: 60 }),
                tablaVictimas,
                p(r(''), { after: 80 }),
                p([r('G.  ', { bold: true, size: 16 }), r('Observaciones', { size: 16 })], { after: 60 }),
                tablaObs,
                p(r(''), { after: 80 }),
                p([r('H.  ', { bold: true, size: 16 }), r('Armas de fuego aseguradas', { size: 16 })], { after: 60 }),
                tablaArmas,
                p(r(''), { after: 200 }),
                tablaFirmas,
                p(r(''), { after: 80 }),
                lineaFirma(),
                p(r('Mtro. En D.P.A. Orlando Chávez Landaverde'), { align: AlignmentType.CENTER, after: 0 }),
                p(r('Secretario de Seguridad Pública de San Juan del Río, Qro.'), { align: AlignmentType.CENTER }),
            ],
        }],
    })

    const buffer = await Packer.toBuffer(doc)
    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="parte_novedades_${fecha}.docx"`,
        }
    })
}