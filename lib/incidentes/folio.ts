import { query } from '@/lib/db'

export async function generarFolioIncidente(): Promise<{ folio: string; consecutivo: number }> {
  const año = new Date().getFullYear()

  await query(`SELECT pg_advisory_xact_lock($1)`, [año])

  const result = await query<{ next: number }>(
    `SELECT COALESCE(MAX(folio_consecutivo), 0) + 1 AS next
     FROM incidentes
     WHERE EXTRACT(YEAR FROM creado_en) = $1`,
    [año],
  )
  const consecutivo = result.rows[0].next
  const folio = `SSPM/INC/${String(consecutivo).padStart(3, '0')}/${año}`
  return { folio, consecutivo }
}