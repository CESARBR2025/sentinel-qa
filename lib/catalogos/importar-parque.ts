import ExcelJS from 'exceljs'
import type { Pool } from 'pg'
import type { ImportarResultado } from './types'

// Núcleo del importador del parque vehicular (Excel) → via.v2_patrullas.
// Lo usan tanto la server action `importarParqueVehicular` de lib/catalogos como
// el script CLI scripts/importar-parque-vehicular.ts. Upsert por num_serie (VIN).

const HOJA = 'PARQUE VEHICULAR'
const FILA_INICIO = 6 // fila 5 = headers, 1–4 = título del documento

const PLACAS_NO_REALES = new Set(['S/P', 'REMOLQUE'])

function texto(valor: unknown): string {
  if (valor === null || valor === undefined) return ''
  return String(valor).trim()
}

function esPlacaValida(placa: string, departamento: string): boolean {
  if (!placa) return false
  if (PLACAS_NO_REALES.has(placa.toUpperCase())) return false
  if (departamento === 'BICICLETA') return false
  return true
}

function sn(valor: unknown): string | null {
  const v = texto(valor).toUpperCase()
  return v === 'SI' || v === 'NO' ? v : null
}

interface FilaImportable {
  placa: string | null
  numSerie: string
  departamento: string | null
  caracteristicas: string | null
  marca: string | null
  modelo: string | null
  gps: string | null
  radio: string | null
  camaras: string | null
}

export async function importarParqueVehicular(
  archivo: string,
  pool: Pool,
  opciones: { dryRun?: boolean } = {},
): Promise<ImportarResultado> {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(archivo)

  const ws = wb.getWorksheet(HOJA)
  if (!ws) throw new Error(`No existe la hoja "${HOJA}" en ${archivo}`)

  const filas: FilaImportable[] = []
  let saltadas = 0
  const motivosSaltada = new Map<string, number>()

  for (let r = FILA_INICIO; r <= ws.rowCount; r++) {
    const raw = ws.getRow(r).values
    const v = Array.isArray(raw) ? (raw as unknown[]).slice(1) : []
    const departamento = texto(v[1])
    const caracteristicas = texto(v[2])
    const placa = texto(v[3])
    const marca = texto(v[4])
    const modeloAnio = v[5]
    const serie = texto(v[6])
    const gps = sn(v[7])
    const radio = sn(v[8])
    const camaras = sn(v[9])

    const tieneAlgo = departamento || caracteristicas || placa || marca || serie || gps || radio || camaras
    if (!tieneAlgo) {
      saltadas++
      const motivo = texto(v[0]).length > 0 ? 'encabezado de sección' : 'fila en blanco'
      motivosSaltada.set(motivo, (motivosSaltada.get(motivo) ?? 0) + 1)
      continue
    }

    // num_serie: SERIE, o el serial WTU de las bicicletas (vive en la columna MARCA).
    let numSerie = serie
    if (!numSerie && departamento === 'BICICLETA') numSerie = marca

    if (!numSerie) {
      saltadas++
      motivosSaltada.set('sin serial', (motivosSaltada.get('sin serial') ?? 0) + 1)
      continue
    }

    const placaValida = esPlacaValida(placa, departamento)
    const esBicicleta = departamento === 'BICICLETA'
    // Bicicletas: marca=TREK, modelo="MARILN 4 GEN 3" (celda PLACA) y el serial (WTU…) en la celda MARCA.
    const marcaFinal = esBicicleta ? 'TREK' : marca
    const modeloFinal = esBicicleta ? placa : modeloAnio

    filas.push({
      placa: placaValida ? placa : null,
      numSerie,
      departamento: departamento || null,
      caracteristicas: caracteristicas || null,
      marca: marcaFinal || null,
      modelo: modeloFinal === undefined || modeloFinal === null || modeloFinal === '' ? null : String(modeloFinal),
      gps,
      radio,
      camaras,
    })
  }

  if (opciones.dryRun) {
    return {
      importadas: filas.length,
      omitidas: saltadas,
      motivos: Object.fromEntries(motivosSaltada),
      sinPlaca: filas.filter((f) => !f.placa).length,
    }
  }

  const cliente = await pool.connect()
  try {
    await cliente.query('BEGIN')
    for (const f of filas) {
      await cliente.query(
        `INSERT INTO via.v2_patrullas
           (placa, activo, sincronizado_en,
            num_serie, departamento, caracteristicas, marca, modelo, gps, radio, camaras)
         VALUES ($1, true, NOW(), $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (num_serie) DO UPDATE SET
           placa = EXCLUDED.placa,
           departamento = EXCLUDED.departamento,
           caracteristicas = EXCLUDED.caracteristicas,
           marca = EXCLUDED.marca,
           modelo = EXCLUDED.modelo,
           gps = EXCLUDED.gps,
           radio = EXCLUDED.radio,
           camaras = EXCLUDED.camaras,
           sincronizado_en = NOW()`,
        [f.placa, f.numSerie, f.departamento,
         f.caracteristicas, f.marca, f.modelo, f.gps, f.radio, f.camaras],
      )
    }
    await cliente.query('COMMIT')
  } catch (err) {
    await cliente.query('ROLLBACK')
    throw err
  } finally {
    cliente.release()
  }

  return {
    importadas: filas.length,
    omitidas: saltadas,
    motivos: Object.fromEntries(motivosSaltada),
    sinPlaca: filas.filter((f) => !f.placa).length,
  }
}
