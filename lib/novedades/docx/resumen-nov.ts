import { AlignmentType, Paragraph, Table, WidthType } from 'docx'
import { r, p, hRow, dRow, tablaSinNovedad } from '@/lib/reportes/docx-helpers'
import type { ResumenNovedadesNovedades } from '../types'

// Paso 10 — Resumen de novedades (T31) + plantillas INFORMATIVOS.

export function resumenNovedades(
  datos: ResumenNovedadesNovedades,
): (Paragraph | Table)[] {
  const filasT31 = datos.filas ?? []

  const w = [1000, 1400, 3600, 1200, 1080, 1080]
  const out: (Paragraph | Table)[] = [
    p(r('T31. RESUMEN DE NOVEDADES', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
  ]
  out.push(
    filasT31.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [
          hRow(['HORA', 'EVENTO', 'DESCRIPCIÓN', 'TI', 'IPH', 'PI'], w, true),
          ...filasT31.map(f => dRow([String(f.hora ?? '—'), String(f.evento ?? '—'), String(f.descripcion ?? '—'), String(f.ti ?? '—'), String(f.iph ?? '—'), String(f.pi ?? '—')], w)),
        ] })
      : tablaSinNovedad(['HORA', 'EVENTO', 'DESCRIPCIÓN', 'TI', 'IPH', 'PI'], w),
  )

  // INFORMATIVOS — plantillas de texto con estructura fija alimentadas por el
  // estado de fuerza capturado (paso 9) y este paso. No son textarea libre.
  if (datos.eco8) {
    out.push(p(r(''), { after: 60 }))
    out.push(p(r('INFORMATIVO OPERATIVO ECO 8', { bold: true, size: 16 }), { align: AlignmentType.LEFT, after: 40 }))
    out.push(...plantillaP([`FOLIO BITÁCORA ${datos.eco8.folio} OPERATIVO ECO 8 ${datos.eco8.hora} horas, se brindó apoyó con seguridad y vigilancia con el siguiente estado de fuerza:`]))
    out.push(...plantillaP([`Policía Municipal ${datos.eco8.policia_municipal} Policías a cargo ${datos.eco8.policias_a_cargo} Unidades`, `Complementarias ${datos.eco8.complementarias}`, 'Novedades:']))
    out.push(...plantillaP([
      `${datos.eco8.vehiculos_revisados} Vehículos revisados`,
      `${datos.eco8.personas_entrevistadas} Personas entrevistadas`,
      `${datos.eco8.personas_inspeccionadas} Personas inspeccionadas`,
      `${datos.eco8.juzgado_civico} Juzgado Cívico`,
      `${datos.eco8.pd_fge} Puestas a disposición de Fiscalía General del Estado`,
      `${datos.eco8.pd_fgr} Puestas a disposición de Fiscalía General de la República`,
      `${datos.eco8.reportes_atendidos} Reportes atendidos`,
      `${datos.eco8.vehiculos_corralon} Vehículos a Corralón`,
      `${datos.eco8.infracciones} Infracciones`,
      `Dándole término a las ${datos.eco8.termino_hora} horas.`,
    ]))
  }

  if (datos.metropolitano) {
    out.push(p(r(''), { after: 60 }))
    out.push(p(r('INFORMATIVO METROPOLITANO II', { bold: true, size: 16 }), { align: AlignmentType.LEFT, after: 40 }))
    const m = datos.metropolitano
    out.push(...plantillaP([`FOLIO BITÁCORA ${m.folio} OPERATIVO METROPOLITANO II ${m.hora} horas, se brindó apoyó con seguridad y vigilancia con el siguiente estado de fuerza:`]))
    for (const [nombre, c] of [
      ['Policía Estatal Base San Juan del Río', m.policia_estatal],
      ['Policía Municipal San Juan del Río', m.policia_municipal],
      ['Tequisquiapan', m.tequisquiapan],
      ['Pedro Escobedo', m.pedro_escobedo],
      ['Amealco', m.amealco],
    ] as const) {
      out.push(...plantillaP([`${nombre}: Policías a cargo ${c.policias} Unidades ${c.unidades} Armas Cortas ${c.armas_cortas} Armas Largas ${c.armas_largas} Chalecos ${c.chalecos}`]))
    }
    out.push(...plantillaP([
      `Se realizaron recorridos en ${m.zonas}.`,
      `${m.vehiculos_revisados} Vehículos revisados`, `${m.personas_entrevistadas} Personas entrevistadas`,
      `${m.personas_inspeccionadas} Personas inspeccionadas`, `${m.juzgado_civico} Juzgado Cívico`,
      `${m.pd_fge} Puestas a disposición de Fiscalía General del Estado (Vehículo recuperado)`,
      `${m.pd_fgr} Puestas a disposición de Fiscalía General de la República`,
      `${m.reportes_atendidos} Reportes atendidos`, `${m.vehiculos_corralon} Vehículos a Corralón`,
      `${m.infracciones} Infracciones`, `Dándole término a las ${m.termino_hora} horas.`,
    ]))
  }

  if (datos.interinstitucional) {
    out.push(p(r(''), { after: 60 }))
    out.push(p(r('INFORMATIVO INTERINSTITUCIONAL', { bold: true, size: 16 }), { align: AlignmentType.LEFT, after: 40 }))
    const i = datos.interinstitucional
    out.push(...plantillaP([`FOLIO BITÁCORA ${i.folio} OPERATIVO INTERINSTITUCIONAL ${i.hora} horas, se brindó apoyó con seguridad y vigilancia con el siguiente estado de fuerza:`]))
    out.push(...plantillaP([
      `Táctico Policías a cargo ${i.tactico_policias} Unidades ${i.tactico_unidades}`,
      `Policía Municipal Policías a cargo ${i.policia_municipal_policias} Unidades ${i.policia_municipal_unidades}`,
      `SEDENA Policías a cargo ${i.sedena_policias} Unidades ${i.sedena_unidades}`,
      `Guardia Nacional Policías a cargo ${i.guardia_nacional_policias} Unidades ${i.guardia_nacional_unidades}`,
      `Se realizaron recorridos en ${i.zonas}.`,
      `${i.vehiculos_revisados} Vehículos revisados`, `${i.personas_entrevistadas} Personas entrevistadas`,
      `${i.personas_inspeccionadas} Personas inspeccionadas`, `${i.juzgado_civico} Juzgado Cívico`,
      `${i.pd_fge} Puestas a disposición de Fiscalía General del Estado`,
      `${i.pd_fgr} Puestas a disposición de Fiscalía General de la República`,
      `${i.reportes_atendidos} Reportes atendidos`, `${i.vehiculos_corralon} Vehículos a Corralón`,
      `${i.infracciones} Infracciones`, `Dándole término a las ${i.termino_hora} horas.`,
    ]))
  }

  return out
}

function plantillaP(lineas: string[]): Paragraph[] {
  return lineas.map((l, i) => p(r(l, { size: 16 }), { align: AlignmentType.JUSTIFIED, after: i === lineas.length - 1 ? 80 : 0 }))
}
