import { db }  from '@/lib/db/index'
import { fichasBusqueda, seguimientosBusqueda, notificaciones } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { calcularFechaEsperada, getLabelSeguimiento } from '@/lib/prevencion/timeline'

const HITOS_ALERTAR = ['CONTESTACION_INICIAL', '24H', '48H', '72H'] as const
const UNA_HORA_MS   = 60 * 60 * 1000

export async function generarAlertasBusquedas(userId: string, debug = false) {
  const fichas = await db
    .select()
    .from(fichasBusqueda)
    .where(eq(fichasBusqueda.status, 'activa'))

  for (const ficha of fichas) {
    const fechaActivacion = ficha.fechaActivacion instanceof Date
      ? ficha.fechaActivacion
      : new Date(String(ficha.fechaActivacion))

    // In debug mode skip the registered-check so we alert for ALL hitos
    let registrados = new Set<string>()
    if (!debug) {
      const segs = await db
        .select({ tipo: seguimientosBusqueda.tipo })
        .from(seguimientosBusqueda)
        .where(eq(seguimientosBusqueda.fichaId, ficha.id))
      registrados = new Set(segs.map(s => s.tipo))
    }

    for (const hito of HITOS_ALERTAR) {
      if (!debug && registrados.has(hito)) continue

      const fechaEsperada = calcularFechaEsperada(fechaActivacion, hito)
      const ahora         = new Date()
      const msRestantes   = fechaEsperada.getTime() - ahora.getTime()

      // Production: only alert within 1h window or overdue
      if (!debug && msRestantes > UNA_HORA_MS) continue

      const vencido = msRestantes < 0
      const label   = getLabelSeguimiento(hito)

      await db.insert(notificaciones).values({
        userId,
        tipo:    'busqueda_plazo',
        titulo:  `${vencido ? '⚠ VENCIDO' : '⏰ Próximo'} — ${label}`,
        mensaje: `${ficha.nombreDesaparecida} — reporte de ${label} ${vencido ? 'VENCIDO' : 'vence en menos de 1 hora'}.`,
        href:    `/prevencion/busquedas/${ficha.id}`,
        fichaId: ficha.id,
        hito,
      }).onConflictDoNothing()
    }
  }
}
