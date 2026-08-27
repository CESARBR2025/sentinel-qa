import type {
  AnalisisNovedades, C4Novedades, FilaNovedad, FuerzaNovedades, OperativosNovedades,
  PeriodoNovedades, PrevencionNovedades, ResumenNovedades, ResumenNovedadesNovedades,
  SeccionKey, SubsecretariaNovedades, TransitoNovedades, DelictivosNovedades,
} from './types'

// Mappers: jsonb crudo de novedades_seccion / novedades_filas → objetos tipados.
// El jsonb es el medio de almacenamiento; el contrato de verdad es types.ts.

function num(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null
  return String(v)
}

// ─── Paso 1 — Periodo ───
export function rowToPeriodo(datos: Record<string, unknown> | null): PeriodoNovedades | null {
  if (!datos) return null
  return {
    fecha: str(datos.fecha) ?? '',
    inicio: str(datos.inicio) ?? '',
    fin: str(datos.fin) ?? '',
    año: num(datos.año),
  }
}

// ─── Paso 2 — Resumen general ───
export function rowToResumen(datos: Record<string, unknown> | null): ResumenNovedades | null {
  if (!datos) return null
  return {
    aseguramientos: Array.isArray(datos.aseguramientos) ? datos.aseguramientos as ResumenNovedades['aseguramientos'] : [],
    infracciones: Array.isArray(datos.infracciones) ? datos.infracciones as ResumenNovedades['infracciones'] : [],
    corralon: Array.isArray(datos.corralon) ? datos.corralon as ResumenNovedades['corralon'] : [],
  }
}

// ─── Paso 3 — Subsecretaría ───
export function rowToSubsecretaria(datos: Record<string, unknown> | null): SubsecretariaNovedades | null {
  if (!datos) return null
  return {
    pd_fiscalia: Array.isArray(datos.pd_fiscalia) ? datos.pd_fiscalia as SubsecretariaNovedades['pd_fiscalia'] : [],
    juzgado_civico: Array.isArray(datos.juzgado_civico) ? datos.juzgado_civico as SubsecretariaNovedades['juzgado_civico'] : [],
  }
}

// ─── Paso 4 — Análisis ───
export function rowToAnalisis(datos: Record<string, unknown> | null): AnalisisNovedades | null {
  if (!datos) return null
  return {
    consultas_personas: num(datos.consultas_personas),
    ordenes_aprehension: num(datos.ordenes_aprehension),
    consultas_vehiculos: num(datos.consultas_vehiculos),
    vehiculos_reporte_robo: num(datos.vehiculos_reporte_robo),
    detenidos_carcel: num(datos.detenidos_carcel),
    detenidos_fiscalia: num(datos.detenidos_fiscalia),
  }
}

// ─── Paso 5 — C-4 ───
export function rowToC4(datos: Record<string, unknown> | null): C4Novedades | null {
  if (!datos) return null
  return {
    llamadas_recibidas: num(datos.llamadas_recibidas),
    improcedentes: num(datos.improcedentes),
    medico: num(datos.medico),
    proteccion_civil: num(datos.proteccion_civil),
    seguridad: num(datos.seguridad),
    servicios_publicos: num(datos.servicios_publicos),
    asistencia: num(datos.asistencia),
    otros_servicios: num(datos.otros_servicios),
    canalizadas: num(datos.canalizadas),
    personas_sin_novedad: num(datos.personas_sin_novedad),
    personas_con_antecedentes: num(datos.personas_con_antecedentes),
    vehiculos_revisar: num(datos.vehiculos_revisar),
    vehiculos_repuve: num(datos.vehiculos_repuve),
    persecuciones: num(datos.persecuciones),
    asegurados_camara: num(datos.asegurados_camara),
    vehiculos_recuperados: num(datos.vehiculos_recuperados),
    incendios: num(datos.incendios),
    hechos_transito_camara: num(datos.hechos_transito_camara),
  }
}

// ─── Paso 6 — Tránsito ───
export function rowToTransito(datos: Record<string, unknown> | null): TransitoNovedades | null {
  if (!datos) return null
  return {
    matriz: Array.isArray(datos.matriz) ? datos.matriz as TransitoNovedades['matriz'] : [],
    observaciones: str(datos.observaciones) ?? 'SIN NOVEDAD',
  }
}

// ─── Paso 7 — Prevención ───
export function rowToPrevencion(datos: Record<string, unknown> | null): PrevencionNovedades | null {
  if (!datos) return null
  return {
    atencion_victimas: (datos.atencion_victimas as Record<string, number>) ?? {},
    persona_no_localizada: datos.persona_no_localizada
      ? datos.persona_no_localizada as PrevencionNovedades['persona_no_localizada']
      : null,
  }
}

// ─── Paso 8 — Delictivos ───
export function rowToDelictivos(datos: Record<string, unknown> | null): DelictivosNovedades | null {
  if (!datos) return null
  return {
    delitos: Array.isArray(datos.delitos) ? datos.delitos as DelictivosNovedades['delitos'] : [],
    denuncias_digitales: Array.isArray(datos.denuncias_digitales)
      ? datos.denuncias_digitales as DelictivosNovedades['denuncias_digitales']
      : [],
  }
}

// ─── Paso 9 — Operativos ───
export function rowToOperativos(datos: Record<string, unknown> | null): OperativosNovedades | null {
  if (!datos) return null
  return {
    supervision: Array.isArray(datos.supervision) ? datos.supervision as OperativosNovedades['supervision'] : [],
    operativos: Array.isArray(datos.operativos) ? datos.operativos as OperativosNovedades['operativos'] : [],
  }
}

// ─── Paso 10 — Resumen de novedades ───
export function rowToResumenNovedades(datos: Record<string, unknown> | null): ResumenNovedadesNovedades | null {
  if (!datos) return null
  return {
    filas: Array.isArray(datos.filas) ? datos.filas as ResumenNovedadesNovedades['filas'] : [],
    eco8: (datos.eco8 as ResumenNovedadesNovedades['eco8']) ?? null,
    interinstitucional: (datos.interinstitucional as ResumenNovedadesNovedades['interinstitucional']) ?? null,
    metropolitano: (datos.metropolitano as ResumenNovedadesNovedades['metropolitano']) ?? null,
  }
}

// ─── Paso 11 — Fuerza ───
export function rowToFuerza(datos: Record<string, unknown> | null): FuerzaNovedades | null {
  if (!datos) return null
  return {
    conceptos: Array.isArray(datos.conceptos) ? datos.conceptos as FuerzaNovedades['conceptos'] : [],
  }
}

export function rowToSeccion(seccion: SeccionKey, datos: Record<string, unknown> | null): Record<string, unknown> | null {
  switch (seccion) {
    case 'periodo': return (rowToPeriodo(datos) as unknown as Record<string, unknown>) ?? null
    case 'resumen': return (rowToResumen(datos) as unknown as Record<string, unknown>) ?? null
    case 'subsecretaria': return (rowToSubsecretaria(datos) as unknown as Record<string, unknown>) ?? null
    case 'analisis': return (rowToAnalisis(datos) as unknown as Record<string, unknown>) ?? null
    case 'c4': return (rowToC4(datos) as unknown as Record<string, unknown>) ?? null
    case 'transito': return (rowToTransito(datos) as unknown as Record<string, unknown>) ?? null
    case 'prevencion': return (rowToPrevencion(datos) as unknown as Record<string, unknown>) ?? null
    case 'delictivos': return (rowToDelictivos(datos) as unknown as Record<string, unknown>) ?? null
    case 'operativos': return (rowToOperativos(datos) as unknown as Record<string, unknown>) ?? null
    case 'resumen_nov': return (rowToResumenNovedades(datos) as unknown as Record<string, unknown>) ?? null
    case 'fuerza': return (rowToFuerza(datos) as unknown as Record<string, unknown>) ?? null
  }
}

export function rowToFilaNovedad(row: Record<string, unknown>): FilaNovedad {
  return {
    id: String(row.id),
    fecha: String(row.fecha).slice(0, 10),
    seccion: String(row.seccion),
    orden: Number(row.orden ?? 0),
    datos: (row.datos as Record<string, unknown>) ?? {},
  }
}
