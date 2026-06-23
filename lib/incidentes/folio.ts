import { db }          from '@/lib/db/index'
import { incidentes }  from '@/lib/db/schema'
import { sql }         from 'drizzle-orm'

export async function generarFolioIncidente(): Promise<{ folio: string; consecutivo: number }> {
  const año = new Date().getFullYear()
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(incidentes)
    .where(sql`extract(year from creado_en) = ${año}`)
  const consecutivo = (count ?? 0) + 1
  const folio = `SSPM/INC/${String(consecutivo).padStart(3, '0')}/${año}`
  return { folio, consecutivo }
}