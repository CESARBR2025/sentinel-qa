// Catálogo de eventos que pueden generar una notificación.
//
// Los defaults viven aquí, en código, para que queden versionados y revisables.
// La tabla `notificaciones_suscripciones` sólo guarda los OVERRIDES que el
// administrador haga desde la matriz evento × rol: si un evento no tiene
// ninguna fila ahí, mandan los `rolesPorDefecto` de este archivo.
//
// Para agregar un evento nuevo basta con una entrada en EVENTOS y una llamada a
// emitir() en el punto del flujo correspondiente.

export type Severidad = 'info' | 'aviso' | 'critico'

export interface DefinicionEvento {
  /** Etiqueta legible; también es el título por defecto de la notificación. */
  label: string
  /** Agrupa los eventos en la matriz del panel de administración. */
  modulo: string
  severidad: Severidad
  /** Nombres de rol tal cual están en `roles.nombre`. */
  rolesPorDefecto: string[]
  /** Construye el destino del click a partir del id de la entidad. */
  href?: (entidadId: string) => string
}

export const EVENTOS = {
  // ── Incidentes / despacho ──────────────────────────────────────────────────
  'incidente.creado': {
    label: 'Incidente creado', modulo: 'Incidentes', severidad: 'aviso',
    // Destinatario es el rol agente_despacho — su tablón, no la vista ciudadano
    // (esa requiere permiso 911_ciudadano, que este rol no tiene).
    rolesPorDefecto: ['agente_despacho'],
    href: () => `/agente_911/despacho`,
  },
  'rondin.escalado': {
    label: 'Rondín escalado a incidente', modulo: 'Incidentes', severidad: 'aviso',
    rolesPorDefecto: ['agente_despacho'],
    href: () => `/agente_911/despacho`,
  },
  'despacho.asignado': {
    label: 'Despacho asignado', modulo: 'Incidentes', severidad: 'critico',
    rolesPorDefecto: ['Oficial de Campo'],
    href: id => `/oficial/despachos/${id}`,
  },
  'despacho.refuerzos': {
    label: 'Refuerzos solicitados', modulo: 'Incidentes', severidad: 'critico',
    rolesPorDefecto: ['Oficial de Campo'],
    href: id => `/oficial/despachos/${id}`,
  },
  'despacho.en_camino': {
    label: 'Unidad en camino', modulo: 'Incidentes', severidad: 'info',
    rolesPorDefecto: ['agente_despacho'],
    href: () => `/agente_911/despacho`,
  },
  'despacho.en_sitio': {
    label: 'Unidad en sitio', modulo: 'Incidentes', severidad: 'info',
    rolesPorDefecto: ['agente_despacho'],
    href: () => `/agente_911/despacho`,
  },
  'incidente.cerrado_detencion': {
    label: 'Incidente cerrado con detención', modulo: 'Incidentes', severidad: 'critico',
    rolesPorDefecto: ['Monitorista', 'agente_fiscalia'],
    href: () => `/monitorista/detenidos`,
  },

  // ── Oficial de campo ───────────────────────────────────────────────────────
  'reporte_campo.cerrado': {
    label: 'Reporte de campo cerrado', modulo: 'Oficial', severidad: 'info',
    rolesPorDefecto: ['agente_despacho'],
    href: id => `/oficial/reportes/${id}`,
  },

  // ── Fiscalía / juzgado ─────────────────────────────────────────────────────
  'd1.creada': {
    label: 'Denuncia D1 creada', modulo: 'Fiscalía', severidad: 'aviso',
    rolesPorDefecto: ['agente_fiscalia'],
    href: id => `/fiscalia/solicitudes/${id}`,
  },
  'expediente.tomado': {
    label: 'Expediente tomado por fiscal', modulo: 'Fiscalía', severidad: 'info',
    rolesPorDefecto: ['agente_fiscalia'],
    href: id => `/fiscalia/solicitudes/${id}`,
  },
  'puesta_disposicion.generada': {
    label: 'Puesta a disposición generada', modulo: 'Fiscalía', severidad: 'aviso',
    rolesPorDefecto: ['agente_juzgado', 'agente_liberaciones'],
    href: id => `/fiscalia/asegurados/puesta-disposicion/${id}`,
  },
  'oficio.emitido': {
    label: 'Oficio de liberación emitido', modulo: 'Fiscalía', severidad: 'aviso',
    rolesPorDefecto: ['agente_liberaciones'],
    href: id => `/fiscalia/liberaciones/${id}`,
  },
  'expediente.turnado': {
    label: 'Expediente turnado a juzgado', modulo: 'Juzgado', severidad: 'aviso',
    rolesPorDefecto: ['agente_juzgado'],
    href: id => `/agente_juzgado/solicitudes/${id}`,
  },
  'expediente.cerrado': {
    label: 'Expediente cerrado', modulo: 'Juzgado', severidad: 'info',
    rolesPorDefecto: ['agente_fiscalia'],
    href: id => `/agente_juzgado/solicitudes/${id}`,
  },
  'proceso.iniciado': {
    label: 'Proceso iniciado en juzgado', modulo: 'Juzgado', severidad: 'info',
    rolesPorDefecto: ['agente_liberaciones'],
    href: id => `/agente_juzgado/liberaciones/${id}`,
  },
  'proceso.finalizado': {
    label: 'Proceso finalizado en juzgado', modulo: 'Juzgado', severidad: 'aviso',
    rolesPorDefecto: ['agente_liberaciones', 'corralon_mw', 'corralon_mejia'],
    href: id => `/agente_juzgado/liberaciones/${id}`,
  },

  // ── Monitorista / evidencias ───────────────────────────────────────────────
  'evidencia.solicitada': {
    label: 'Evidencia solicitada', modulo: 'Monitorista', severidad: 'aviso',
    rolesPorDefecto: ['Monitorista'],
    href: () => `/monitorista/solicitudes`,
  },
  'evidencia.entregada': {
    label: 'Evidencia entregada', modulo: 'Monitorista', severidad: 'aviso',
    rolesPorDefecto: ['agente_fiscalia', 'agente_juzgado'],
    href: id => `/fiscalia/solicitudes/${id}`,
  },
  'foto.solicitada': {
    label: 'Fotos de detenido solicitadas', modulo: 'Monitorista', severidad: 'aviso',
    rolesPorDefecto: ['Oficial de Campo'],
    href: id => `/oficial/reportes/${id}/fotos`,
  },
  'foto.rechazada': {
    label: 'Foto de detenido rechazada', modulo: 'Monitorista', severidad: 'aviso',
    rolesPorDefecto: ['Oficial de Campo'],
    href: id => `/oficial/reportes/${id}/fotos`,
  },
  'iph.registrado': {
    label: 'IPH de detenido registrado', modulo: 'Análisis', severidad: 'info',
    rolesPorDefecto: ['Investigador', 'Analisis'],
    href: () => `/analisis/iph`,
  },

  // ── Liberaciones / infracciones / corralón ─────────────────────────────────
  'liberacion.solicitada': {
    label: 'Solicitud de liberación creada', modulo: 'Liberaciones', severidad: 'aviso',
    rolesPorDefecto: ['agente_liberaciones'],
    href: id => `/agente_liberaciones/revision-documental/${id}`,
  },
  'liberacion.documento_subido': {
    label: 'Documento de liberación subido', modulo: 'Liberaciones', severidad: 'info',
    rolesPorDefecto: ['agente_liberaciones'],
    href: id => `/agente_liberaciones/revision-documental/${id}`,
  },
  'revision.finalizada': {
    label: 'Revisión documental finalizada', modulo: 'Liberaciones', severidad: 'aviso',
    rolesPorDefecto: ['agente_infracciones'],
    href: id => `/agente_liberaciones/revision-documental/${id}`,
  },
  'orden_pago.generada': {
    label: 'Orden de pago generada', modulo: 'Liberaciones', severidad: 'info',
    rolesPorDefecto: ['agente_infracciones'],
    href: id => `/agente_liberaciones/revision-documental/${id}`,
  },
  'pago.confirmado': {
    label: 'Pago confirmado', modulo: 'Infracciones', severidad: 'aviso',
    rolesPorDefecto: ['agente_liberaciones', 'corralon_mw', 'corralon_mejia'],
    href: id => `/infracciones/${id}`,
  },
  'infraccion.cerrada': {
    label: 'Infracción cerrada', modulo: 'Infracciones', severidad: 'aviso',
    rolesPorDefecto: ['corralon_mw', 'corralon_mejia'],
    href: () => `/corralon/solicitudes`,
  },
  'corralon.finalizado': {
    label: 'Corralón finalizó la salida', modulo: 'Corralón', severidad: 'info',
    rolesPorDefecto: ['agente_liberaciones', 'agente_infracciones'],
    href: () => `/corralon/solicitudes`,
  },

  // ── Prevención ─────────────────────────────────────────────────────────────
  'medida.creada': {
    label: 'Medida de protección creada', modulo: 'Prevención', severidad: 'aviso',
    rolesPorDefecto: ['Operador Víctimas'],
    href: id => `/prevencion/medidas/${id}`,
  },
  'medida.estatus': {
    label: 'Cambio de estatus de medida', modulo: 'Prevención', severidad: 'info',
    rolesPorDefecto: ['Operador Víctimas', 'Jurídico'],
    href: id => `/prevencion/medidas/${id}`,
  },
  'medida.prorroga': {
    label: 'Prórroga otorgada', modulo: 'Prevención', severidad: 'info',
    rolesPorDefecto: ['Operador Víctimas'],
    href: id => `/prevencion/medidas/${id}`,
  },
  'ficha.creada': {
    label: 'Ficha de búsqueda creada', modulo: 'Prevención', severidad: 'critico',
    rolesPorDefecto: ['Operador Víctimas', 'Investigador'],
    href: id => `/prevencion/busquedas/${id}`,
  },
  'ficha.cancelada': {
    label: 'Ficha de búsqueda cancelada', modulo: 'Prevención', severidad: 'info',
    rolesPorDefecto: ['Operador Víctimas'],
    href: id => `/prevencion/busquedas/${id}`,
  },
  // Generado por el cron, no por una acción de usuario.
  'busqueda_plazo': {
    label: 'Plazo de ficha de búsqueda', modulo: 'Prevención', severidad: 'critico',
    rolesPorDefecto: ['Operador Víctimas'],
    href: id => `/prevencion/busquedas/${id}`,
  },
  'solicitud.creada': {
    label: 'Solicitud de información creada', modulo: 'Prevención', severidad: 'aviso',
    rolesPorDefecto: ['Jurídico'],
    href: id => `/prevencion/juridico/solicitudes/${id}`,
  },
  'solicitud.c4': {
    label: 'Solicitud interna a C4', modulo: 'Prevención', severidad: 'aviso',
    rolesPorDefecto: ['Monitorista'],
    href: id => `/prevencion/juridico/solicitudes/${id}`,
  },
  'solicitud.contestada': {
    label: 'Contestación entregada', modulo: 'Prevención', severidad: 'info',
    rolesPorDefecto: ['Jurídico'],
    href: id => `/prevencion/juridico/solicitudes/${id}`,
  },

  // ── Administración de personal ─────────────────────────────────────────────
  'oficial.alta': {
    label: 'Oficial dado de alta', modulo: 'Tránsito', severidad: 'info',
    rolesPorDefecto: ['admin_transito'],
    href: id => `/admin-transito/oficiales/${id}`,
  },
  'oficial.destituido': {
    label: 'Oficial destituido', modulo: 'Tránsito', severidad: 'aviso',
    rolesPorDefecto: ['admin_transito', 'agente_despacho'],
    href: id => `/admin-transito/oficiales/${id}`,
  },

  // ── Reportes / novedades ───────────────────────────────────────────────────
  'checklist.guardado': {
    label: 'Checklist de novedades guardado', modulo: 'Novedades', severidad: 'info',
    rolesPorDefecto: ['Auxiliar de Novedades'],
    href: id => `/auxiliar/checklist/${id}`,
  },
  'formato_n.capturado': {
    label: 'Formato N capturado', modulo: 'Reportes', severidad: 'info',
    rolesPorDefecto: ['agente_reportes'],
    href: () => `/agente_reportes`,
  },

  // ── Avisos manuales del administrador ──────────────────────────────────────
  'admin.aviso': {
    label: 'Aviso de la administración', modulo: 'Administración', severidad: 'aviso',
    rolesPorDefecto: [],
  },
} satisfies Record<string, DefinicionEvento>

export type ClaveEvento = keyof typeof EVENTOS

export const CLAVES_EVENTO = Object.keys(EVENTOS) as ClaveEvento[]

export function definicionEvento(clave: string): DefinicionEvento | null {
  return (EVENTOS as Record<string, DefinicionEvento>)[clave] ?? null
}

/** Agrupa el catálogo por módulo, para pintar la matriz del panel admin. */
export function eventosPorModulo(): { modulo: string; eventos: { clave: ClaveEvento; def: DefinicionEvento }[] }[] {
  const grupos = new Map<string, { clave: ClaveEvento; def: DefinicionEvento }[]>()
  for (const clave of CLAVES_EVENTO) {
    const def = EVENTOS[clave] as DefinicionEvento
    const lista = grupos.get(def.modulo) ?? []
    lista.push({ clave, def })
    grupos.set(def.modulo, lista)
  }
  return [...grupos.entries()].map(([modulo, eventos]) => ({ modulo, eventos }))
}
