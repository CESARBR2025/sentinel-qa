import type { Turno } from './types'

/**
 * Horarios de los turnos de C-4, fuente única (Etapa 0.6).
 *
 * `fecha` en `incidentes_camara` significa, sin ambigüedad, la fecha en que
 * inicia el turno. El turno NOCTURNO cruza la medianoche (22:00 → 07:00), por
 * eso lleva `cruzaMedianoche: true`: si el monitorista captura de madrugada
 * (00:00–07:00), la fecha que guarda es la de AYER, la de inicio del turno.
 *
 * Los horarios estaban escritos a mano en cinco archivos; todos pasan a leer
 * esta constante. Ver `lib/monitorista/service.ts` (re-export) y el ADR de la
 * Etapa 0.6: `turno` es un enum cerrado de tres valores, restringido por el
 * tipo `Turno` y el `<select>`, por lo que NO se convierte en tabla con FK.
 */
export const TURNOS = [
  { clave: 'MATUTINO',   nombre: 'Primer Turno',  inicio: '07:00', fin: '15:00', cruzaMedianoche: false },
  { clave: 'VESPERTINO', nombre: 'Segundo Turno', inicio: '15:00', fin: '22:00', cruzaMedianoche: false },
  { clave: 'NOCTURNO',   nombre: 'Tercer Turno',  inicio: '22:00', fin: '07:00', cruzaMedianoche: true  },
] as const

/** Claves válidas, para validar filtros/query params. */
export const TURNOS_CLAVE: readonly Turno[] = TURNOS.map(t => t.clave)

export function esTurnoValido(v: string | null | undefined): v is Turno {
  return !!v && (TURNOS_CLAVE as readonly string[]).includes(v)
}

export function turnoInfo(clave: string) {
  return TURNOS.find(t => t.clave === clave)
}

/** Etiqueta larga del selector: "Primer Turno (07:00 - 15:00 HRS)". */
export function etiquetaTurno(clave: string): string {
  const t = turnoInfo(clave)
  return t ? `${t.nombre} (${t.inicio} - ${t.fin} HRS)` : clave
}

/** Etiqueta corta de listados: "07-15 hrs". */
export function etiquetaRangoTurno(clave: string): string {
  const t = turnoInfo(clave)
  return t ? `${t.inicio.slice(0, 2)}-${t.fin.slice(0, 2)} hrs` : clave
}

function aLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dia}`
}

/**
 * Fecha de inicio del turno según la hora actual.
 * Si el turno cruza la medianoche (NOCTURNO) y son las 00:00–07:00, el turno
 * empezó ayer; en cualquier otro caso es hoy. Reemplaza el default anterior
 * `new Date().toISOString().slice(0,10)` que era UTC y rompía la fecha local.
 */
export function fechaInicioTurno(turno: Turno, ahora: Date = new Date()): string {
  const info = turnoInfo(turno)
  if (info?.cruzaMedianoche) {
    const h = ahora.getHours()
    if (h >= 0 && h < 7) {
      const ayer = new Date(ahora)
      ayer.setDate(ayer.getDate() - 1)
      return aLocal(ayer)
    }
  }
  return aLocal(ahora)
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function nombreMes(m: number): string {
  return MESES[m - 1] ?? ''
}

/**
 * Texto de la jornada que ve el monitorista antes de guardar, para que no
 * capture a ciegas: "Turno nocturno del 9 al 10 de agosto".
 * Usa la clave en minúsculas (nocturno/vespertino/matutino), igual que el
 * ejemplo del plan.
 */
export function jornadaTurnoTexto(fecha: string, turno: Turno): string {
  const [y, m, d] = fecha.split('-').map(Number)
  const info = turnoInfo(turno)
  const nombreClave = turno.toLowerCase()
  if (info?.cruzaMedianoche) {
    const fin = new Date(y, m - 1, d + 1)
    return `Turno ${nombreClave} del ${d} al ${fin.getDate()} de ${nombreMes(m)}`
  }
  return `Turno ${nombreClave} del ${d} de ${nombreMes(m)}`
}
