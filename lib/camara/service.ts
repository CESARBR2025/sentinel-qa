import { obtenerIncidentesCamara, obtenerTotalesCamara } from './repository'

function toNum(val: unknown) { return Number(val ?? 0) }
function toStr(val: unknown) { return String(val ?? '—') }

export async function listarIncidentesCamara(desde?: string, hasta?: string) {
  const [rows, totales] = await Promise.all([
    obtenerIncidentesCamara(desde, hasta),
    obtenerTotalesCamara(desde, hasta),
  ])

  return {
    registros: rows.map(r => ({
      fecha:                r.fecha instanceof Date
        ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : toStr(r.fecha),
      turno:                toStr(r.turno),
      persSinNovedad:       toNum(r.personas_sin_novedad),
      persConAntecedentes:  toNum(r.personas_con_antecedentes),
      vehiculosRevisar:     toNum(r.vehiculos_revisar),
      vehiculosRepuve:      toNum(r.vehiculos_repuve),
      persecuciones:        toNum(r.persecuciones),
      asegurados:           toNum(r.asegurados_camara),
      recuperados:          toNum(r.vehiculos_recuperados),
      incendios:            toNum(r.incendios),
      hechosTransito:       toNum(r.hechos_transito),
      motosRevisadas:       toNum(r.motos_revisadas),
      totalPersonas:        toNum(r.total_personas_revisadas),
      registradoPor:        toStr(r.registrado_por),
    })),
    totales: {
      sinNovedad:      toNum(totales?.total_sin_novedad),
      conAntecedentes: toNum(totales?.total_con_antecedentes),
      vehiculos:       toNum(totales?.total_vehiculos),
      persecuciones:   toNum(totales?.total_persecuciones),
      asegurados:      toNum(totales?.total_asegurados),
      recuperados:     toNum(totales?.total_recuperados),
      totalPersonas:   toNum(totales?.total_personas),
    }
  }
}