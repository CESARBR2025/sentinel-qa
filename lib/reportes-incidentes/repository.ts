import { query } from '@/lib/db'

export async function obtenerReporteDiario(desde: string, hasta: string) {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      created_at::date AS fecha,
      SUM(CASE WHEN ofi_autoridad_recibe = 'JUZGADO CIVICO' AND ofi_hay_detencion THEN 1 ELSE 0 END) AS carcel,
      SUM(CASE WHEN ofi_autoridad_recibe = 'FISCALIA' AND ofi_hay_detencion THEN 1 ELSE 0 END) AS fiscalia,
      0 AS fgr
    FROM ofi_reportes_campo
    WHERE created_at::date BETWEEN $1 AND $2
    GROUP BY created_at::date ORDER BY created_at::date
  `, [desde, hasta])

  const inc = await query<Record<string, unknown>>(`
    SELECT
      creado_en::date AS fecha,
      SUM(CASE WHEN autoridad_recibe = 'JUZGADO CIVICO' AND hay_detencion THEN 1 ELSE 0 END) AS carcel,
      SUM(CASE WHEN autoridad_recibe = 'FISCALIA' AND hay_detencion THEN 1 ELSE 0 END) AS fiscalia,
      0 AS fgr
    FROM incidente_reporte_campo
    WHERE creado_en::date BETWEEN $1 AND $2
    GROUP BY creado_en::date ORDER BY creado_en::date
  `, [desde, hasta])

  return { ofi: ofi.rows, inc: inc.rows }
}

export async function obtenerReporteSemanal(desde: string, hasta: string) {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      created_at::date AS fecha,
      SUM(CASE WHEN ofi_autoridad_recibe = 'JUZGADO CIVICO' AND ofi_hay_detencion THEN 1 ELSE 0 END) AS carcel,
      SUM(CASE WHEN ofi_autoridad_recibe = 'FISCALIA' AND ofi_hay_detencion THEN 1 ELSE 0 END) AS fiscalia,
      SUM(CASE WHEN ofi_apoyo_cateos_fge THEN 1 ELSE 0 END) AS cateo_fge,
      SUM(CASE WHEN ofi_apoyo_cateos_fgr THEN 1 ELSE 0 END) AS cateo_fgr,
      SUM(CASE WHEN ofi_operativos_metropolitano OR ofi_eco8 OR ofi_alcoholimetria OR ofi_motocicletas OR ofi_apoyo_actuarios THEN 1 ELSE 0 END) AS operativos,
      SUM(CASE WHEN ofi_apoyo_fiestas_patronales THEN 1 ELSE 0 END) AS fiestas,
      SUM(jsonb_array_length(ofi_vehiculos)) AS vehiculos,
      SUM(jsonb_array_length(ofi_armas_fuego)) AS armas_fuego,
      SUM(jsonb_array_length(ofi_armas_blancas)) AS armas_blancas,
      SUM(jsonb_array_length(ofi_drogas)) AS drogas,
      0 AS fgr
    FROM ofi_reportes_campo
    WHERE created_at::date BETWEEN $1 AND $2
    GROUP BY created_at::date ORDER BY created_at::date
  `, [desde, hasta])

  const inc = await query<Record<string, unknown>>(`
    SELECT
      creado_en::date AS fecha,
      SUM(CASE WHEN autoridad_recibe = 'JUZGADO CIVICO' AND hay_detencion THEN 1 ELSE 0 END) AS carcel,
      SUM(CASE WHEN autoridad_recibe = 'FISCALIA' AND hay_detencion THEN 1 ELSE 0 END) AS fiscalia,
      SUM(CASE WHEN apoyo_cateos_fge THEN 1 ELSE 0 END) AS cateo_fge,
      SUM(CASE WHEN apoyo_cateos_fgr THEN 1 ELSE 0 END) AS cateo_fgr,
      SUM(CASE WHEN operativos_metropolitano OR eco8 OR alcoholimetria OR motocicletas OR apoyo_actuarios THEN 1 ELSE 0 END) AS operativos,
      SUM(CASE WHEN apoyo_fiestas_patronales THEN 1 ELSE 0 END) AS fiestas,
      SUM(jsonb_array_length(vehiculos)) AS vehiculos,
      SUM(jsonb_array_length(armas_fuego)) AS armas_fuego,
      SUM(jsonb_array_length(armas_blancas)) AS armas_blancas,
      SUM(jsonb_array_length(drogas)) AS drogas,
      0 AS fgr
    FROM incidente_reporte_campo
    WHERE creado_en::date BETWEEN $1 AND $2
    GROUP BY creado_en::date ORDER BY creado_en::date
  `, [desde, hasta])

  return { ofi: ofi.rows, inc: inc.rows }
}