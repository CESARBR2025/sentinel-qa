import { obtenerIncidentesCamara, obtenerTotalesCamara } from './repository'

function toStr(val: unknown) { return String(val ?? '—') }

export async function listarIncidentesCamara(desde?: string, hasta?: string) {
  const [rows, totales] = await Promise.all([
    obtenerIncidentesCamara(desde, hasta),
    obtenerTotalesCamara(desde, hasta),
  ])

  return {
    registros: rows.map(r => ({
      fecha:                r.fecha ?? '—',
      turno:                r.turno ?? '—',
      persSinNovedad:       r.personasSinNovedad,
      persConAntecedentes:  r.conAntecedentes,
      vehiculosRevisar:     r.vehiculosRevisar,
      vehiculosRepuve:      r.vehiculosRepuve,
      persecuciones:        r.persecuciones,
      asegurados:           r.asegurados,
      recuperados:          r.recuperados,
      incendios:            r.incendios,
      hechosTransito:       r.hechosTransito,
      motosRevisadas:       r.motosRevisadas,
      totalPersonas:        r.totalPersonasRevisadas,
      registradoPor:        r.registradoPor ?? '—',
    })),
    totales: {
      sinNovedad:      totales?.totalSinNovedad ?? 0,
      conAntecedentes: totales?.totalConAntecedentes ?? 0,
      vehiculos:       totales?.totalVehiculos ?? 0,
      persecuciones:   totales?.totalPersecuciones ?? 0,
      asegurados:      totales?.totalAsegurados ?? 0,
      recuperados:     totales?.totalRecuperados ?? 0,
      totalPersonas:   totales?.totalPersonas ?? 0,
    }
  }
}
