import { AlignmentType, Paragraph } from 'docx'
import { r, p } from '@/lib/reportes/docx-helpers'

// Carta de presentación + párrafo de fundamento legal del Parte de Novedades.
// Texto fijo verificado contra el .docx original (Etapa 8).

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export function encabezado(fecha: string): Paragraph[] {
  const [y, m, d] = fecha.split('-').map(Number)
  const d1 = new Date(Date.UTC(y, m - 1, d - 1))
  const diaAnterior = d1.getUTCDate()
  const mesAnterior = MESES[d1.getUTCMonth()]

  return [
    p(r(`San Juan del Río, Querétaro ${d} de ${MESES[m - 1]} del ${y}`, { size: 16 }), { align: AlignmentType.LEFT, after: 80 }),
    p(r('SECRETARIO DE SEGURIDAD CIUDADANA.', { bold: true, size: 16 }), { align: AlignmentType.LEFT, after: 0 }),
    p(r('QUERÉTARO, QRO.', { bold: true, size: 16 }), { align: AlignmentType.LEFT, after: 0 }),
    p(r('PRESENTE.', { bold: true, size: 16 }), { align: AlignmentType.LEFT, after: 120 }),
    p(r('Con fundamento legal en lo dispuesto por los artículos 21 con relación al 115 de la Constitución Política de los Estados Unidos Mexicanos, artículo 24, 34, 35 fracción V, VII, VIII, XI, XIII, XIV, XV, XVIII, XIX, XX, XXII y XXIII del Reglamento Interior de la Secretaría de Seguridad Pública Municipal de San Juan del Río, Querétaro., me permito informar a usted el Parte Informativo de las Novedades ocurridas en el Municipio de San Juan del Río, Qro., durante las 24 horas anteriores al día de la fecha, elaborado por el Centro de Control, Comando, Comunicaciones y Computo C-4, dependiente de ésta Secretaría de Seguridad Pública Municipal.', { size: 16 }), { align: AlignmentType.JUSTIFIED, after: 80 }),
    p(r(`Las novedades correspondientes de las 06:00 horas del día ${diaAnterior} de ${mesAnterior} a las 06:00 horas del día ${d} de ${MESES[m - 1]} del ${y}.`, { size: 16, bold: true }), { align: AlignmentType.JUSTIFIED, after: 120 }),
  ]
}
