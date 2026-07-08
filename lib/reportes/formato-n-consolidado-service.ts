import { obtenerEventosPorFecha, type FormatoNEvento } from '@/lib/reportes/formato-n-eventos-service'
import { obtenerFgePorFechaPeriodo, PERIODOS, type FormatoNFge } from '@/lib/reportes/formato-n-fge-service'
import { obtenerFgrPorFechaPeriodo, type FormatoNFgr } from '@/lib/reportes/formato-n-fgr-service'
import { obtenerRndPorFecha, type FormatoNRnd } from '@/lib/reportes/formato-n-rnd-service'
import { obtenerMediosAlternativosPorFechaPeriodo, type FormatoNMediosAlternativos } from '@/lib/reportes/formato-n-medios-alternativos-service'
import { obtenerAtencionVictimasPorFechaPeriodo, type FormatoNAtencionVictimas } from '@/lib/reportes/formato-n-atencion-victimas-service'
import { obtenerArmasAseguradasPorFecha, type FormatoNArmaAsegurada } from '@/lib/reportes/formato-n-armas-aseguradas-service'

export interface FormatoNConsolidado {
  fecha: string
  eventos: FormatoNEvento[]
  fge: FormatoNFge[]
  fgr: FormatoNFgr[]
  rnd: FormatoNRnd[]
  medios: FormatoNMediosAlternativos[]
  victimas: FormatoNAtencionVictimas[]
  armas: FormatoNArmaAsegurada[]
}

async function porPeriodos<T>(
  getter: (fecha: string, periodo: typeof PERIODOS[number]) => Promise<T | null>,
  fecha: string,
): Promise<T[]> {
  const results = await Promise.all(PERIODOS.map((p) => getter(fecha, p)))
  const rows: T[] = []
  for (const r of results) {
    if (r !== null) rows.push(r)
  }
  return rows
}

export async function obtenerFormatoNConsolidado(fecha: string): Promise<FormatoNConsolidado> {
  const [eventos, fge, fgr, rnd, medios, victimas, armas] = await Promise.all([
    obtenerEventosPorFecha(fecha),
    porPeriodos(obtenerFgePorFechaPeriodo, fecha),
    porPeriodos(obtenerFgrPorFechaPeriodo, fecha),
    obtenerRndPorFecha(fecha),
    porPeriodos(obtenerMediosAlternativosPorFechaPeriodo, fecha),
    porPeriodos(obtenerAtencionVictimasPorFechaPeriodo, fecha),
    obtenerArmasAseguradasPorFecha(fecha),
  ])

  return { fecha, eventos, fge, fgr, rnd, medios, victimas, armas }
}

function enumerarFechas(fechaInicio: string, fechaFin: string): string[] {
  const fechas: string[] = []
  const cursor = new Date(`${fechaInicio}T00:00:00Z`)
  const fin = new Date(`${fechaFin}T00:00:00Z`)
  while (cursor <= fin) {
    fechas.push(cursor.toISOString().slice(0, 10))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return fechas
}

export async function obtenerFormatoNConsolidadoRango(fechaInicio: string, fechaFin: string): Promise<FormatoNConsolidado[]> {
  const fechas = enumerarFechas(fechaInicio, fechaFin)
  return Promise.all(fechas.map(obtenerFormatoNConsolidado))
}
