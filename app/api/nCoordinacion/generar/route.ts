import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerObservacionesPorFecha } from '@/lib/n-coordinacion/repository'
import { obtenerFormatoNConsolidado } from '@/lib/reportes/formato-n-consolidado-service'
import type { FormatoNFge } from '@/lib/reportes/formato-n-fge-service'
import type { FormatoNFgr } from '@/lib/reportes/formato-n-fgr-service'
import { tieneAccesoFormatoN } from '@/lib/reportes/permisos'
import {
    Document, Packer, Table, AlignmentType, WidthType,
} from 'docx'
import {
    r, p, tc, tr, hRow, dRow, toN, lineaFirma, encabezadoConLogos,
} from '@/lib/reportes/docx-helpers'

function tablaFiscalia(
  domiciliosLabel: string,
  datos: (FormatoNFge | FormatoNFgr) | null,
) {
  const wFge = [1872, 1872, 1872, 1872, 1872]
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    rows: [
      hRow(['Carpetas iniciadas','Número de cateos','Vehículos asegurados', domiciliosLabel,'Personas aseguradas'], wFge, false),
      dRow([
        toN(datos?.carpetas_iniciadas),      // automático — D1s generadas
        toN(datos?.numero_cateos),            // automático — cateos BD
        toN(datos?.vehiculos_asegurados),     // automático — vehículos BD
        toN(datos?.domicilios_cateados),          // manual
        toN(datos?.personas_aseguradas),      // automático — detenidos BD
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

    const [consolidado, obs] = await Promise.all([
        obtenerFormatoNConsolidado(fecha),
        obtenerObservacionesPorFecha(fecha),
    ])

    const { eventos, rnd, armas } = consolidado
    const fge = consolidado.fge.find(f => f.periodo === 'diario') ?? null
    const fgr = consolidado.fgr.find(f => f.periodo === 'diario') ?? null
    const masc = consolidado.medios.find(m => m.periodo === 'diario') ?? null
    const victimas = consolidado.victimas.find(v => v.periodo === 'diario') ?? null

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
        ? rnd.map(row => dRow([String(row.hora_detencion ?? '').slice(0, 5), String(row.delito ?? ''), String(row.autoridad_que_realizo_detencion ?? ''), String(row.folio ?? '')], wRnd))
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
        ? armas.map(row => dRow([String(row.carpeta_investigacion ?? ''), String(row.tipo_arma ?? ''), String(row.matricula ?? ''), String(row.calibre ?? ''), String(row.observaciones ?? '')], wArmas))
        : [tr([tc(p(r('Sin Novedad', { size: 16 }), { after: 0 }), { width: wArmas[0] }), tc(p(r('', { size: 16 }), { after: 0 }), { width: wArmas[1] }), tc(p(r('', { size: 16 }), { after: 0 }), { width: wArmas[2] }), tc(p(r('', { size: 16 }), { after: 0 }), { width: wArmas[3] }), tc(p(r('', { size: 16 }), { after: 0 }), { width: wArmas[4] })])]

    const tablaArmas = new Table({
        width: { size: 9360, type: WidthType.DXA },
        rows: [hRow(['Carpeta de Investigación', 'Tipo de Arma', 'Matricula', 'Calibre', 'Observaciones (Corporación)'], wArmas, false), ...filasArmas],
    })

    // ── Firmas ────────────────────────────────────────────────────────────────
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

    // ── Documento ─────────────────────────────────────────────────────────────
    const doc = new Document({
        sections: [{
            headers: {
                default: encabezadoConLogos(),
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
                tablaFiscalia('Domicilios cateados',   fge),
                p(r(''), { after: 80 }),
                p([r('C.  ', { bold: true, size: 16 }), r('Eventos informados por la Fiscalía General de la República', { size: 16 })], { after: 60 }),
                tablaFiscalia('Domicilios asegurados', fgr),
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