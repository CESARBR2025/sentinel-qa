// Tipos del Parte de Novedades C-4 — un tipo por sección.
// El jsonb de novedades_seccion / novedades_filas es el medio de almacenamiento;
// el contrato de verdad es este archivo. Los campos de catálogo guardan el id
// (sector_id, delito_id, grua_id, concepto_id, oficial_id), nunca texto libre.

// ==================== Secciones del stepper ====================

export type SeccionKey =
  | 'periodo'
  | 'resumen'
  | 'subsecretaria'
  | 'analisis'
  | 'c4'
  | 'transito'
  | 'prevencion'
  | 'delictivos'
  | 'operativos'
  | 'resumen_nov'
  | 'fuerza'

export const SECCIONES: SeccionKey[] = [
  'periodo',
  'resumen',
  'subsecretaria',
  'analisis',
  'c4',
  'transito',
  'prevencion',
  'delictivos',
  'operativos',
  'resumen_nov',
  'fuerza',
]

// ==================== Fila genérica de listados ====================

export interface FilaNovedad {
  id: string
  fecha: string
  seccion: string
  orden: number
  datos: Record<string, unknown>
}

// ==================== Paso 1 — Periodo (auto) ====================

export interface PeriodoNovedades {
  fecha: string
  /** 06:00 del día anterior */
  inicio: string
  /** 06:00 del día del parte */
  fin: string
  año: number
}

// ==================== Paso 2 — Resumen general (T0, T1, T2) ====================

export interface FilaAseguramiento {
  concepto: string
  concepto_id: string | null
  oriente: number
  poniente: number
  centro: number
  sin_asignar: number
  total: number
}

/** Infracciones T1: columnas operativas (SECTOR I, SECTOR II, TRÁNSITO, TÁCTICO, ATENCIÓN A VÍCTIMAS). */
export interface FilaInfraccion {
  columna: string
  cantidad: number
}

export interface ResumenNovedades {
  /** T0 — Aseguramientos × sector */
  aseguramientos: FilaAseguramiento[]
  /** T1 — Infracciones por columna operativa */
  infracciones: FilaInfraccion[]
  /** T2 — Vehículos a corralón por columna operativa */
  corralon: FilaInfraccion[]
}

// ==================== Paso 3 — Subsecretaría (T3, T4) ====================

export interface FilaPdFiscalia {
  hora: string | null
  lugar: string | null
  nombre: string | null
  fiscal: string | null
  motivo: string | null
  ci: string | null
  rnd: string | null
}

export interface FilaJuzgadoCivico {
  hora: string | null
  lugar: string | null
  nombre: string | null
  marco_legal: string | null
  oficial: string | null
  unidad: string | null
  sija: string | null
  remision: string | null
  iph: string | null
  rnd: string | null
}

export interface SubsecretariaNovedades {
  /** T3 — Puestas a disposición de la Fiscalía */
  pd_fiscalia: FilaPdFiscalia[]
  /** T4 — Remitidos a Juzgado Cívico */
  juzgado_civico: FilaJuzgadoCivico[]
}

// ==================== Paso 4 — Unidad de Análisis (T5) ====================

export interface AnalisisNovedades {
  consultas_personas: number
  ordenes_aprehension: number
  consultas_vehiculos: number
  vehiculos_reporte_robo: number
  detenidos_carcel: number
  detenidos_fiscalia: number
}

// ==================== Paso 5 — C-4 (T6a, T6b) ====================

export interface C4Novedades {
  /** T6a — Línea 9-1-1 */
  llamadas_recibidas: number
  improcedentes: number
  medico: number
  proteccion_civil: number
  seguridad: number
  servicios_publicos: number
  asistencia: number
  otros_servicios: number
  canalizadas: number
  /** T6b — Cámaras (suma de los 3 turnos de fecha = D-1) */
  personas_sin_novedad: number
  personas_con_antecedentes: number
  vehiculos_revisar: number
  vehiculos_repuve: number
  persecuciones: number
  asegurados_camara: number
  vehiculos_recuperados: number
  incendios: number
  hechos_transito_camara: number
}

// ==================== Paso 6 — Tránsito (T7 a T13) ====================

export interface FilaContadorSector {
  concepto: string
  concepto_id: string | null
  oriente: number
  poniente: number
  centro: number
  sin_asignar: number
  total: number
}

export interface FilaHechoTransito {
  hecho: string
  hora: string | null
  lugar: string | null
  vehiculo: string | null
  conductor: string | null
}

export interface FilaVehiculoCorralon {
  folio_motivo: string | null
  hora: string | null
  fecha: string | null
  lugar: string | null
  vehiculo: string | null
  grua: string | null
}

export interface FilaVehiculoNotificado {
  folio: string | null
  hora: string | null
  lugar: string | null
  vehiculo: string | null
  motivo: string | null
}

export interface FilaOperativoDespeje {
  hora: string | null
  lugar: string | null
  operativo: string | null
  descripcion: string | null
}

export interface TransitoNovedades {
  /** T7 — Matriz de 19 conceptos × sector */
  matriz: FilaContadorSector[]
  /** T7 — Observaciones */
  observaciones: string
}

// ==================== Paso 7 — Prevención del Delito (T14 a T24) ====================

export interface AtencionVictimasNovedades {
  /** ~8 autollenables + el resto manuales */
  [concepto: string]: number
}

export interface FilaPersonaNoLocalizada {
  fecha: string | null
  hora: string | null
  lugar: string | null
  carpeta: string | null
  delito: string | null
  policia: string | null
  unidad: string | null
  observaciones: string | null
}

export interface FilaConvenio {
  fecha: string | null
  lugar: string | null
  involucrados: string | null
  policia: string | null
  unidad: string | null
  convenio: string | null
}

export interface FilaSegConvenio {
  fecha: string | null
  lugar: string | null
  involucrados: string | null
  elemento: string | null
  unidad: string | null
  convenio: string | null
}

export interface FilaPlatica {
  fecha: string | null
  platicas: string | null
  tema: string | null
  lugar: string | null
  elemento: string | null
  aforo: string | null
  unidad: string | null
}

export interface FilaJornadaTrabajo {
  fecha: string | null
  hora: string | null
  lugar: string | null
  elemento: string | null
  unidad: string | null
  complementarios: string | null
}

export interface FilaJornadaStand {
  fecha: string | null
  hora: string | null
  lugar: string | null
  elemento: string | null
  aforo: string | null
  unidad: string | null
}

export interface PrevencionNovedades {
  /** T14 — Matriz de Atención a Víctimas */
  atencion_victimas: AtencionVictimasNovedades
  /** T15 — Reporte de persona no localizada */
  persona_no_localizada: FilaPersonaNoLocalizada | null
}

// ==================== Paso 8 — Hechos delictivos (T25 a T28) ====================

export interface FilaDelito {
  delito: string
  delito_id: number | null
  familia: string
  delitos: number
  detenidos: number
}

export interface FilaDenunciaDigital {
  tipo_delito: string | null
  ubicacion: string | null
  nombre_denunciante: string | null
  crp: string | null
  cuestionario_unico: string | null
}

export interface FilaVehiculoRobado {
  marca: string | null
  tipo: string | null
  modelo: string | null
  color: string | null
  placas: string | null
  entidad: string | null
  serie: string | null
  ubicacion: string | null
  carpeta: string | null
  cuestionario_unico: string | null
}

export interface DelictivosNovedades {
  /** T25 — Delitos por familia */
  delitos: FilaDelito[]
  /** T26 — Denuncias digitales */
  denuncias_digitales: FilaDenunciaDigital[]
}

// ==================== Paso 9 — Supervisión y Operativos (T29, T30) ====================

export const OPERATIVOS_SUPERVISION = [
  'VIGILANCIA IGLESIAS SECTOR ORIENTE',
  'CAJEROS ZONA BANCARIA SECTOR ORIENTE',
  'PARQUES SEGUROS SECTOR ORIENTE',
  'VIGILANCIA COMERCIOS SECTOR ORIENTE',
  'ESCUELA SEGURA SECTOR ORIENTE',
  'SUPERVISIÓN CENTROS COMERCIALES SECTOR PONIENTE',
  'VIGILANCIA IGLESIAS SECTOR PONIENTE',
  'CAJEROS ZONA BANCARIA SECTOR PONIENTE',
  'PARQUES SEGUROS SECTOR PONIENTE',
  'ESCUELA SEGURA SECTOR PONIENTE',
] as const

export interface FilaSupervision {
  operativo: string
  total_unidades: number
  total_elementos: number
  vehiculos_revisados: number
  vehiculos_pd: number
  personas_revisadas: number
  remitidas_juzgado: number
  a_fge: number
  a_fgr: number
  revisiones: number
  inicio: string
  termino: string
}

export const OPERATIVOS_FIJOS = [
  'OPERATIVO ECO 8',
  'METROPOLITANO II',
  'INTERINSTITUCIONAL',
  'CATEO SSPM/FGE',
  'CATEO SSPM/FGR',
] as const

export interface FilaOperativo {
  operativo: string
  unidades: number
  elementos: number
  pd_juzgado: number
  pd_fge: number
  pd_fgr: number
  inicio: string
  termino: string
  afluencia: string
}

export interface OperativosNovedades {
  /** T29 — Matriz de supervisión */
  supervision: FilaSupervision[]
  /** T30 — Matriz de operativos */
  operativos: FilaOperativo[]
}

// ==================== Paso 10 — Resumen de novedades (T31) ====================

export interface FilaResumenNovedad {
  hora: string | null
  evento: string | null
  descripcion: string | null
  ti: string | null
  iph: string | null
  pi: string | null
}

export interface PlantillaInformativoEco8 {
  folio: string
  hora: string
  policia_municipal: number
  policias_a_cargo: number
  unidades: number
  complementarias: string
  vehiculos_revisados: number
  personas_entrevistadas: number
  personas_inspeccionadas: number
  juzgado_civico: number
  pd_fge: number
  pd_fgr: number
  reportes_atendidos: number
  vehiculos_corralon: number
  infracciones: number
  termino_hora: string
}

export interface PlantillaInformativoInterinstitucional {
  folio: string
  hora: string
  tactico_policias: number
  tactico_unidades: number
  policia_municipal_policias: number
  policia_municipal_unidades: number
  sedena_policias: number
  sedena_unidades: number
  guardia_nacional_policias: number
  guardia_nacional_unidades: number
  zonas: string
  vehiculos_revisados: number
  personas_entrevistadas: number
  personas_inspeccionadas: number
  juzgado_civico: number
  pd_fge: number
  pd_fgr: number
  reportes_atendidos: number
  vehiculos_corralon: number
  infracciones: number
  termino_hora: string
}

export interface PlantillaInformativoMetropolitano {
  folio: string
  hora: string
  /** Policías a cargo, Unidades, Armas cortas, Armas largas, Chalecos por corporación */
  policia_estatal: { policias: number; unidades: number; armas_cortas: number; armas_largas: number; chalecos: number }
  policia_municipal: { policias: number; unidades: number; armas_cortas: number; armas_largas: number; chalecos: number }
  tequisquiapan: { policias: number; unidades: number; armas_cortas: number; armas_largas: number; chalecos: number }
  pedro_escobedo: { policias: number; unidades: number; armas_cortas: number; armas_largas: number; chalecos: number }
  amealco: { policias: number; unidades: number; armas_cortas: number; armas_largas: number; chalecos: number }
  zonas: string
  vehiculos_revisados: number
  personas_entrevistadas: number
  personas_inspeccionadas: number
  juzgado_civico: number
  pd_fge: number
  pd_fgr: number
  reportes_atendidos: number
  vehiculos_corralon: number
  infracciones: number
  termino_hora: string
}

export interface ResumenNovedadesNovedades {
  /** filas normales de la tabla RESUMEN DE NOVEDADES */
  filas: FilaResumenNovedad[]
  /** plantillas INFORMATIVOS */
  eco8: PlantillaInformativoEco8 | null
  interinstitucional: PlantillaInformativoInterinstitucional | null
  metropolitano: PlantillaInformativoMetropolitano | null
}

// ==================== Paso 11 — Estado de fuerza (T32) ====================

export interface FilaEstadoFuerza {
  concepto: string
  concepto_id: number | null
  codigo: string | null
  cantidad: number
}

export interface FuerzaNovedades {
  /** T32 — estado de fuerza por concepto */
  conceptos: FilaEstadoFuerza[]
}

// ==================== Día completo ====================

export interface DiaNovedades {
  fecha: string
  estatus: EstatusNovedadesDia | null
  /** Draft editable por sección (snapshot si confirmada, cálculo si no) */
  secciones: Partial<Record<SeccionKey, Record<string, unknown>>>
  /** Draft editable de listados por sección */
  filas: Record<string, FilaNovedad[]>
  /** Lo calculado desde BD, para mostrar el "antes" junto al editable */
  calculado: Partial<Record<SeccionKey, Record<string, unknown>>>
}

// ==================== Estatus ====================

export interface EstatusNovedadesDia {
  fecha: string
  periodo_confirmado: boolean
  resumen_confirmado: boolean
  subsecretaria_confirmado: boolean
  analisis_confirmado: boolean
  c4_confirmado: boolean
  transito_confirmado: boolean
  prevencion_confirmado: boolean
  delictivos_confirmado: boolean
  operativos_confirmado: boolean
  resumen_nov_confirmado: boolean
  fuerza_confirmado: boolean
  completado_en: string | null
  actualizado_por: string | null
  actualizado_en: string
}
