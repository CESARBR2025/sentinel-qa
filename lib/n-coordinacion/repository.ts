import { query } from '@/lib/db'

export async function obtenerEventosDia(fecha: string) {
  const result = await query<Record<string, unknown>>(`
    SELECT
      fecha_hora_inicio::time   AS hora,
      colonia                   AS region,
      folio                     AS evento,
      calle || ', ' || COALESCE(colonia,'') AS ubicacion,
      descripcion               AS descripcion,
      canal                     AS atenciones
    FROM incidentes
    WHERE fecha_hora_inicio::date = $1
    ORDER BY fecha_hora_inicio
  `, [fecha])
  return result.rows
}

export async function obtenerConteosDetenidos(fecha: string, autoridad: string) {
  const campoFge = autoridad === 'FISCALIA' ? 'ofi_apoyo_cateos_fge' : 'ofi_apoyo_cateos_fgr'
  const campoIncFge = autoridad === 'FISCALIA' ? 'apoyo_cateos_fge' : 'apoyo_cateos_fgr'

  const ofi = await query<Record<string, unknown>>(`
    SELECT
      COUNT(*) FILTER (WHERE ofi_hay_detencion AND ofi_autoridad_recibe = $2) AS personas_aseguradas,
      COALESCE(SUM(jsonb_array_length(ofi_vehiculos)) FILTER (WHERE ofi_autoridad_recibe = $2), 0) AS vehiculos_asegurados,
      COUNT(*) FILTER (WHERE ${campoFge} = true) AS numero_cateos
    FROM ofi_reportes_campo
    WHERE created_at::date = $1
  `, [fecha, autoridad])

  const inc = await query<Record<string, unknown>>(`
    SELECT
      COUNT(*) FILTER (WHERE hay_detencion AND autoridad_recibe = $2) AS personas_aseguradas,
      COALESCE(SUM(jsonb_array_length(vehiculos)) FILTER (WHERE autoridad_recibe = $2), 0) AS vehiculos_asegurados,
      COUNT(*) FILTER (WHERE ${campoIncFge} = true) AS numero_cateos
    FROM incidente_reporte_campo
    WHERE creado_en::date = $1
  `, [fecha, autoridad])

  const carpetas = await query<Record<string, unknown>>(`
    SELECT COUNT(*) AS carpetas_iniciadas
    FROM ofi_reporte_denuncia d
    JOIN ofi_reportes_campo r ON r.id = d.reporte_campo_id
    WHERE d.se_genero_d1 = true
      AND r.ofi_autoridad_recibe = $2
      AND r.created_at::date = $1
  `, [fecha, autoridad])

  return {
    carpetas_iniciadas:  Number(carpetas.rows[0]?.carpetas_iniciadas ?? 0),
    numero_cateos:       Number(ofi.rows[0]?.numero_cateos ?? 0) + Number(inc.rows[0]?.numero_cateos ?? 0),
    vehiculos_asegurados: Number(ofi.rows[0]?.vehiculos_asegurados ?? 0) + Number(inc.rows[0]?.vehiculos_asegurados ?? 0),
    personas_aseguradas: Number(ofi.rows[0]?.personas_aseguradas ?? 0) + Number(inc.rows[0]?.personas_aseguradas ?? 0),
  }
}

export async function obtenerRND(fecha: string) {
  const result = await query<Record<string, unknown>>(`
    SELECT
      hora_reporte          AS hora_detencion,
      delito,
      rt_responsable        AS autoridad,
      rnd                   AS folio
    FROM iph_detenidos
    WHERE fecha_reporte = $1
      AND es_rnd = true
    ORDER BY hora_reporte
  `, [fecha])
  return result.rows
}

export async function obtenerArmasDia(fecha: string) {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      folio_reporte_campo AS carpeta,
      jsonb_array_elements(ofi_armas_fuego) AS arma
    FROM ofi_reportes_campo
    WHERE created_at::date = $1 AND ofi_hay_arma_fuego = true
  `, [fecha])

  const inc = await query<Record<string, unknown>>(`
    SELECT
      i.folio AS carpeta,
      jsonb_array_elements(rc.armas_fuego) AS arma
    FROM incidente_reporte_campo rc
    JOIN incidentes i ON i.id = rc.incidente_id
    WHERE rc.creado_en::date = $1 AND rc.hay_arma_fuego = true
  `, [fecha])

  return [...ofi.rows, ...inc.rows]
}

export async function obtenerDatosCapturados(fecha: string) {
  const [fge, fgr, masc, victimas, obs] = await Promise.all([
    query<Record<string, unknown>>(`SELECT * FROM formato_n_fge WHERE fecha = $1 LIMIT 1`, [fecha]),
    query<Record<string, unknown>>(`SELECT * FROM formato_n_fgr WHERE fecha = $1 LIMIT 1`, [fecha]),
    query<Record<string, unknown>>(`SELECT * FROM formato_n_medios_alternativos WHERE fecha = $1 LIMIT 1`, [fecha]),
    query<Record<string, unknown>>(`SELECT * FROM formato_n_atencion_victimas WHERE fecha = $1 LIMIT 1`, [fecha]),
    query<Record<string, unknown>>(`SELECT * FROM formato_n_observaciones WHERE fecha = $1 LIMIT 1`, [fecha]),
  ])
  return {
    fge:      fge.rows[0]      ?? null,
    fgr:      fgr.rows[0]      ?? null,
    masc:     masc.rows[0]     ?? null,
    victimas: victimas.rows[0] ?? null,
    obs:      obs.rows[0]      ?? null,
  }
}

export async function upsertFge(fecha: string, userId: string, data: Record<string, number>) {
  await query(`
    INSERT INTO formato_n_fge (fecha, periodo, capturado_por,
      carpetas_iniciadas, numero_cateos, vehiculos_asegurados, domicilios_cateados,
      personas_aseguradas, aprehensiones, audiencias_iniciales, abreviados, audiencias_intermedias)
    VALUES ($1, 'diario', $2, $3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (fecha) DO UPDATE SET
      carpetas_iniciadas = EXCLUDED.carpetas_iniciadas,
      numero_cateos = EXCLUDED.numero_cateos,
      vehiculos_asegurados = EXCLUDED.vehiculos_asegurados,
      domicilios_cateados = EXCLUDED.domicilios_cateados,
      personas_aseguradas = EXCLUDED.personas_aseguradas,
      aprehensiones = EXCLUDED.aprehensiones,
      audiencias_iniciales = EXCLUDED.audiencias_iniciales,
      abreviados = EXCLUDED.abreviados,
      audiencias_intermedias = EXCLUDED.audiencias_intermedias
  `, [fecha, userId, data.carpetas, data.cateos, data.vehiculos, data.domicilios,
      data.personas, data.aprehensiones, data.audiencias, data.abreviados, data.intermedias])
}

export async function upsertFgr(fecha: string, userId: string, data: Record<string, number>) {
  await query(`
    INSERT INTO formato_n_fgr (fecha, periodo, capturado_por,
      carpetas_iniciadas, numero_cateos, vehiculos_asegurados, domicilios_cateados,
      personas_aseguradas, aprehensiones, audiencias_iniciales, abreviados, audiencias_intermedias)
    VALUES ($1, 'diario', $2, $3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (fecha) DO UPDATE SET
      carpetas_iniciadas = EXCLUDED.carpetas_iniciadas,
      numero_cateos = EXCLUDED.numero_cateos,
      vehiculos_asegurados = EXCLUDED.vehiculos_asegurados,
      domicilios_cateados = EXCLUDED.domicilios_cateados,
      personas_aseguradas = EXCLUDED.personas_aseguradas,
      aprehensiones = EXCLUDED.aprehensiones,
      audiencias_iniciales = EXCLUDED.audiencias_iniciales,
      abreviados = EXCLUDED.abreviados,
      audiencias_intermedias = EXCLUDED.audiencias_intermedias
  `, [fecha, userId, data.carpetas, data.cateos, data.vehiculos, data.domicilios,
      data.personas, data.aprehensiones, data.audiencias, data.abreviados, data.intermedias])
}

export async function upsertMasc(fecha: string, userId: string, data: Record<string, unknown>) {
  await query(`
    INSERT INTO formato_n_medios_alternativos (fecha, periodo, capturado_por,
      asuntos_canalizados_por_fiscalia, acuerdos, monto_reparacion_danos)
    VALUES ($1, 'diario', $2, $3, $4, $5)
    ON CONFLICT (fecha) DO UPDATE SET
      asuntos_canalizados_por_fiscalia = EXCLUDED.asuntos_canalizados_por_fiscalia,
      acuerdos = EXCLUDED.acuerdos,
      monto_reparacion_danos = EXCLUDED.monto_reparacion_danos
  `, [fecha, userId, data.asuntos, data.acuerdos, data.monto])
}

export async function upsertVictimas(fecha: string, userId: string, data: Record<string, number>) {
  await query(`
    INSERT INTO formato_n_atencion_victimas (fecha, periodo, capturado_por,
      numero_atenciones, atenciones_medicas, atenciones_psicologicas, asesorias_juridicas)
    VALUES ($1, 'diario', $2, $3, $4, $5, $6)
    ON CONFLICT (fecha) DO UPDATE SET
      numero_atenciones = EXCLUDED.numero_atenciones,
      atenciones_medicas = EXCLUDED.atenciones_medicas,
      atenciones_psicologicas = EXCLUDED.atenciones_psicologicas,
      asesorias_juridicas = EXCLUDED.asesorias_juridicas
  `, [fecha, userId, data.atenciones, data.medicas, data.psicologicas, data.juridicas])
}

export async function upsertObservaciones(fecha: string, userId: string, observaciones: string) {
  await query(`
    INSERT INTO formato_n_observaciones (fecha, observaciones, capturado_por)
    VALUES ($1, $2, $3)
    ON CONFLICT (fecha) DO UPDATE SET
      observaciones = EXCLUDED.observaciones
  `, [fecha, observaciones, userId])
}
