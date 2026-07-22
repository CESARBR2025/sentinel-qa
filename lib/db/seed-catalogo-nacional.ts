import { loadEnvConfig } from '@next/env'
import { Pool } from 'pg'

loadEnvConfig(process.cwd())

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

interface IncidenteJSON {
  codigo: string
  incidente: string
  prioridad: string
}

interface SubtipoJSON {
  codigo_subtipo: string
  incidentes: IncidenteJSON[]
}

interface TipoJSON {
  nombre: string
  subtipos: Record<string, SubtipoJSON>
}

interface CatalogoJSON {
  catalogo: Record<string, TipoJSON>
}

async function main() {
  // Leer el JSON de la bóveda canónica
  const fs = await import('fs')
  const path = await import('path')
  const bovedaPath = path.resolve('/Users/cesarbr/Documents/boveda-test/05-Fuentes/Catálogo Nacional de Incidentes de Emergencias.md')

  const mdContent = fs.readFileSync(bovedaPath, 'utf-8')

  // Extraer el JSON del bloque ```json ... ```
  const jsonMatch = mdContent.match(/```json\n([\s\S]*?)\n```/)
  if (!jsonMatch) {
    console.error('No se encontró el bloque JSON en el archivo markdown')
    process.exit(1)
  }

  const catalogo: CatalogoJSON = JSON.parse(jsonMatch[1])

  // Mapeo de nombres de tipo a códigos (1-7)
  const tipoCodigoMap: Record<string, string> = {
    'Médico': '1',
    'Protección Civil': '2',
    'Seguridad': '3',
    'Servicios Públicos': '4',
    'Servicios Publicos': '4',
    'Asistencia': '5',
    'Otros Servicios': '6',
    'Improcedentes': '7',
  }

  // Mapeo de claves actuales a códigos del catálogo (para datos legacy)
  // ACCIDENTE e INCENDIO no tienen un tipo_emergencia directo en el catálogo
  // nacional (son subtipos/incidentes, no tipos). Se dejan sin código para
  // desactivarlos y que el operador use los nuevos tipos canónicos.
  const CLAVE_A_CODIGO: Record<string, string> = {
    SEGURIDAD: '3',
    MEDICA: '1',
    OTRO: '7',
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // 0. Mapear filas existentes a sus códigos del catálogo antes de insertar nuevas
    for (const [claveActual, codigo] of Object.entries(CLAVE_A_CODIGO)) {
      await client.query(
        `UPDATE cat_tipos_emergencia SET codigo = $1 WHERE clave = $2 AND codigo IS NULL`,
        [codigo, claveActual]
      )
    }
    // Las filas legacy que no coincidan se dejan con NULL y se desactivan
    // después de insertar los 7 tipos canónicos

    // 1. Actualizar/insertar tipos de emergencia
    for (const [tipoKey, tipoData] of Object.entries(catalogo.catalogo)) {
      const codigo = tipoCodigoMap[tipoData.nombre]
      if (!codigo) {
        console.warn(`Tipo sin código: ${tipoData.nombre} (key: ${tipoKey})`)
        continue
      }

      // Upsert tipo — generar clave a partir del nombre
      const clave = tipoData.nombre
        .toUpperCase()
        .replace(/[ÁÀÄÂ]/g, 'A').replace(/[ÉÈËÊ]/g, 'E')
        .replace(/[ÍÌÏÎ]/g, 'I').replace(/[ÓÒÖÔ]/g, 'O')
        .replace(/[ÚÙÜÛ]/g, 'U').replace(/Ñ/g, 'N')
        .replace(/[^A-Z0-9\s]/g, '').replace(/\s+/g, '_')
        .replace(/^_|_$/g, '') || 'TIPO_' + codigo
      const tipoResult = await client.query(
        `INSERT INTO cat_tipos_emergencia (codigo, clave, nombre, activo)
         VALUES ($1, $2, $3, true)
         ON CONFLICT (codigo) DO UPDATE SET nombre = EXCLUDED.nombre, clave = EXCLUDED.clave
         RETURNING id`,
        [codigo, clave, tipoData.nombre]
      )
      const tipoId = tipoResult.rows[0].id

      // 2. Insertar subtipos
      for (const [subKey, subData] of Object.entries(tipoData.subtipos)) {
        const subResult = await client.query(
          `INSERT INTO cat_subtipos_emergencia (tipo_emergencia_id, codigo, nombre)
           VALUES ($1, $2, $3)
           ON CONFLICT (tipo_emergencia_id, codigo) DO UPDATE SET nombre = EXCLUDED.nombre
           RETURNING id`,
          [tipoId, subData.codigo_subtipo, subKey]
        )
        const subtipoId = subResult.rows[0].id

        // 3. Insertar/actualizar incidentes
        for (const inc of subData.incidentes) {
          await client.query(
            `INSERT INTO cat_tipos_incidente (clave, nombre, subtipo_emergencia_id, codigo_catalogo, prioridad_catalogo, activo)
             VALUES ($1, $2, $3, $4, $5, true)
             ON CONFLICT (clave) DO UPDATE SET
               nombre = EXCLUDED.nombre,
               subtipo_emergencia_id = EXCLUDED.subtipo_emergencia_id,
               codigo_catalogo = EXCLUDED.codigo_catalogo,
               prioridad_catalogo = EXCLUDED.prioridad_catalogo`,
            [inc.codigo, inc.incidente, subtipoId, inc.codigo, inc.prioridad]
          )
        }
      }
    }

    // 4. Desactivar filas legacy que no se mapearon a ningún código
    const legacyResult = await client.query(
      `UPDATE cat_tipos_emergencia SET activo = false WHERE codigo IS NULL`
    )
    if (legacyResult.rowCount && legacyResult.rowCount > 0) {
      console.log(`  ${legacyResult.rowCount} fila(s) legacy desactivada(s)`)
    }

    await client.query('COMMIT')
    console.log('✓ Catálogo Nacional de Incidentes poblado exitosamente')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }

  // Resumen
  const stats = await pool.query(`
    SELECT
      (SELECT count(*) FROM cat_tipos_emergencia WHERE activo) AS tipos,
      (SELECT count(*) FROM cat_subtipos_emergencia WHERE activo) AS subtipos,
      (SELECT count(*) FROM cat_tipos_incidente WHERE activo AND subtipo_emergencia_id IS NOT NULL) AS incidentes
  `)
  const s = stats.rows[0]
  console.log(`  Tipos: ${s.tipos} | Subtipos: ${s.subtipos} | Incidentes catalogados: ${s.incidentes}`)

  await pool.end()
}

main().catch(e => {
  console.error('Error poblando catálogo:', e)
  process.exit(1)
})
