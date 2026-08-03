#!/usr/bin/env node
// Importador del parque vehicular (Excel) → via.v2_patrullas (CLI).
//
// Wrapper del núcleo compartido lib/catalogos/importar-parque.ts.
//
// Uso:
//   npx tsx scripts/importar-parque-vehicular.ts
//   npx tsx scripts/importar-parque-vehicular.ts <ruta.xlsx> [--dry-run]

import process from 'node:process'

async function main() {
  process.loadEnvFile('.env')

  const { Pool } = await import('pg')
  const { importarParqueVehicular } = await import('../lib/catalogos/importar-parque')

  const DRY_RUN = process.argv.includes('--dry-run')
  const ARCHIVO = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'public/files-xlsx/flota-vehicular-nuevo.xlsx'

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
  })

  const resultado = await importarParqueVehicular(ARCHIVO, pool, { dryRun: DRY_RUN })
  console.log(`Archivo: ${ARCHIVO}`)
  console.log(`A importar: ${resultado.importadas} | omitidas: ${resultado.omitidas} | sin placa real: ${resultado.sinPlaca}`)
  console.log('Omitidas por motivo:', JSON.stringify(resultado.motivos))
  console.log(DRY_RUN ? '\n[DRY RUN] no se escribió en la BD.' : `\nImportación completada: ${resultado.importadas} vehículos en via.v2_patrullas`)

  await pool.end()
}

main().catch((err) => {
  console.error('Error:', err instanceof Error ? err.message : err)
  process.exit(1)
})
