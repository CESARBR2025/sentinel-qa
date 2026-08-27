import { Document, Paragraph, Table } from 'docx'
import { encabezadoConLogos } from '@/lib/reportes/docx-helpers'
import { encabezado } from './encabezado'
import { resumen } from './resumen'
import { subsecretaria } from './subsecretaria'
import { analisis } from './analisis'
import { c4 } from './c4'
import { transito } from './transito'
import { prevencion } from './prevencion'
import { delictivos } from './delictivos'
import { operativos } from './operativos'
import { resumenNovedades } from './resumen-nov'
import { fuerza } from './fuerza'
import type { DiaNovedades } from '../types'

/**
 * Arma el Document del Parte de Novedades C-4 completo.
 * Requiere el día cargado con `obtenerDiaNovedades` (secciones + filas ya
 * resueltas: snapshot si confirmada, recálculo si no).
 */
export function armarDocumentoNovedades(dia: DiaNovedades): Document {
  const s = dia.secciones
  const f = dia.filas

  const children: (Paragraph | Table)[] = [
    ...encabezado(dia.fecha),
    ...resumen((s.resumen ?? {}) as never),
    ...subsecretaria((s.subsecretaria ?? {}) as never),
    ...analisis((s.analisis ?? {}) as never),
    ...c4((s.c4 ?? {}) as never),
    ...transito((s.transito ?? {}) as never, f),
    ...prevencion((s.prevencion ?? {}) as never, f),
    ...delictivos((s.delictivos ?? {}) as never, f),
    ...operativos((s.operativos ?? {}) as never),
    ...resumenNovedades((s.resumen_nov ?? {}) as never),
    ...fuerza((s.fuerza ?? {}) as never),
  ]

  return new Document({
    sections: [{
      headers: { default: encabezadoConLogos() },
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, bottom: 720, left: 1080, right: 720 },
        },
      },
      children,
    }],
  })
}
