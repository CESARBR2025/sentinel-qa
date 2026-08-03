// ─────────────────────────────────────────────────────────────────────────────
// Vocabulario canónico de estados del incidente (alineado a la bóveda C4/CNI).
//
// Los VALORES internos de `incidentes.estatus` NO cambian (sin_despachar, etc.);
// este mapa solo estandariza las ETIQUETAS mostradas en la UI con el vocabulario
// de la bóveda canónica (flu-001 / form-001 / form-003):
//
//   SSPM interno        →  C4 (etiqueta)
//   sin_despachar       →  Nuevo
//   en_despacho         →  En Ruta
//   en_sitio            →  En Sitio
//   atendido            →  Cerrado
//   cerrado_detencion   →  Cerrado · Detención
//
// Ver bóveda de SSPM → Convenciones → "Vocabulario de estados".
// ─────────────────────────────────────────────────────────────────────────────

export const ESTATUS_C4: Record<string, { label: string; tooltip: string }> = {
  sin_despachar: {
    label: 'Nuevo',
    tooltip: 'Esperando a que una unidad tome el caso',
  },
  en_despacho: {
    label: 'En Ruta',
    tooltip: 'Una unidad fue asignada y se dirige al lugar',
  },
  en_sitio: {
    label: 'En Sitio',
    tooltip: 'La unidad llegó al lugar y está atendiendo la emergencia',
  },
  atendido: {
    label: 'Cerrado',
    tooltip: 'El incidente fue resuelto y el servicio concluyó',
  },
  cerrado_detencion: {
    label: 'Cerrado · Detención',
    tooltip: 'Caso cerrado con una detención realizada',
  },
}

export function labelEstatus(estatus: string | null | undefined, uppercase = true): string {
  if (!estatus) return ''
  const base = ESTATUS_C4[estatus]?.label ?? estatus.replace(/_/g, ' ')
  return uppercase ? base.toUpperCase() : base
}

export function tooltipEstatus(estatus: string | null | undefined): string | undefined {
  return estatus ? ESTATUS_C4[estatus]?.tooltip : undefined
}
