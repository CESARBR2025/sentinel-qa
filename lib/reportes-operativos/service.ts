import {
    obtenerVehiculos, obtenerCateos, obtenerDetenidos,
    obtenerOrdenesAprehension, obtenerHidrocarburos,
    obtenerArmas, obtenerDrogas,
    obtenerExtorsiones,
} from './repository'

function parseJsonb(val: unknown): any[] {
    if (Array.isArray(val)) return val
    if (val === null || val === undefined) return []
    try {
        const parsed = typeof val === 'string' ? JSON.parse(val) : val
        return Array.isArray(parsed) ? parsed : []
    } catch { return [] }
}

function toStr(val: unknown) { return String(val ?? '—') }

export async function obtenerDatosOperativos(desde?: string, hasta?: string) {
    const d = desde ?? '2000-01-01'
    const h = hasta ?? new Date().toISOString().split('T')[0]

    const [vehRows, catRows, detRows, ordRows, hidRows, armRows, droRows] = await Promise.all([
        obtenerVehiculos(d, h),
        obtenerCateos(d, h),
        obtenerDetenidos(d, h),
        obtenerOrdenesAprehension(d, h),
        obtenerHidrocarburos(d, h),
        obtenerArmas(d, h),
        obtenerDrogas(d, h),
    ])

    // Vehículos — separar motos del resto
    const todosVeh = vehRows.flatMap(r => {
        const v = r.vehiculo as any
        return [{
            fecha: r.fecha instanceof Date
                ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : String(r.fecha ?? '—'),
            folio: toStr(r.folio),
            datos: `${v.tipo ?? ''} — Placas: ${v.placas ?? ''} — Color: ${v.color ?? ''}`,
            estatus: 'RECUPERADO',
            carpeta: '—',
            seguimiento: toStr(r.seguimiento),
            _tipo: toStr(v.tipo),
        }]
    })
    const motos = todosVeh.filter(v => v._tipo === 'motocicleta').map(({ _tipo, ...r }) => r)
    const vehiculos = todosVeh.filter(v => v._tipo !== 'motocicleta').map(({ _tipo, ...r }) => r)

    // Cateos
    const cateos = catRows.map(r => ({
        fecha: r.fecha instanceof Date
            ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : String(r.fecha ?? '—'),
        folio: toStr(r.folio),
        ubicacion: toStr(r.ubicacion),
        dependencia: toStr(r.dependencia),
        seguimiento: toStr(r.seguimiento),
    }))

    // Detenidos
    const detenidos = [
        ...detRows.ofi.flatMap(r =>
            parseJsonb(r.detenidos).map((d: any) => ({
                fecha: r.fecha instanceof Date
                    ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : String(r.fecha ?? '—'),
                folio: toStr(r.folio),
                nombre: toStr(d.nombre),
                observaciones: '—',
                fiscalia: toStr(r.fiscalia),
                seguimiento: toStr(r.seguimiento),
            }))
        ),
        ...detRows.inc.map(r => ({
            fecha: r.fecha instanceof Date
                ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : String(r.fecha ?? '—'),
            folio: toStr(r.folio),
            nombre: toStr(r.nombre),
            observaciones: '—',
            fiscalia: toStr(r.fiscalia),
            seguimiento: toStr(r.seguimiento),
        })),
    ]

    // Órdenes de aprehensión
    const ordenes = ordRows.flatMap(r =>
        parseJsonb(r.ordenes).map((o: any) => ({
            fecha: o.fecha || (r.fecha instanceof Date
                ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : String(r.fecha ?? '—')),
            folio: toStr(r.folio),
            nombre: toStr(o.nombrePersona),
            observaciones: toStr(o.observaciones),
            estatus: toStr(o.estatus),
            seguimiento: toStr(o.nombreSeguimiento || r.seguimiento_reporte),
        }))
    )

    // Hidrocarburos
    const hidrocarburo = hidRows.flatMap(r =>
        parseJsonb(r.hidrocarburos).map((h: any) => ({
            fecha: h.fecha || (r.fecha instanceof Date
                ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : String(r.fecha ?? '—')),
            folio: toStr(r.folio),
            nombre: toStr(h.nombrePersona),
            vehiculo: toStr(h.datosVehiculo),
            litros: toStr(h.litrosExtraccion),
            toma: toStr(h.nombreToma),
            observaciones: toStr(h.observaciones),
            seguimiento: toStr(h.nombreSeguimiento || r.seguimiento_reporte),
        }))
    )

    // Armas
    const armas = armRows.flatMap(r =>
        parseJsonb(r.armas).map((a: any) => ({
            fecha: a.fecha || (r.fecha instanceof Date
                ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : String(r.fecha ?? '—')),
            folio: toStr(r.folio),
            datos: toStr(a.datos),
            cartuchos: toStr(a.cartuchos),
            observaciones: toStr(a.observaciones),
            seguimiento: toStr(a.nombreSeguimiento || r.seguimiento_reporte),
        }))
    )

    // Drogas
    const droga = droRows.flatMap(r =>
        parseJsonb(r.drogas).map((d: any) => ({
            fecha: d.fecha || (r.fecha instanceof Date
                ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : String(r.fecha ?? '—')),
            folio: toStr(r.folio),
            cantidad: toStr(d.cantidad),
            nombre: toStr(d.nombre),
            observaciones: toStr(d.observaciones),
            seguimiento: toStr(d.nombreSeguimiento || r.seguimiento_reporte),
        }))
    )

    return { motos, vehiculos, cateos, detenidos, ordenes, hidrocarburo, armas, droga }
}

export async function obtenerDatosExcel(desde: string, hasta: string) {
    const datos = await obtenerDatosOperativos(desde, hasta)

    // Hoja general — una query que cruza ambas tablas
    const { query } = await import('@/lib/db')

    const ofiGen = await query<Record<string, unknown>>(`
    SELECT
      created_at::date          AS fecha,
      ofi_folio_cad             AS folio,
      CONCAT(o.ofi_nombre, ' ', o.ofi_ap_paterno) AS oficial,
      ofi_hay_cateo             AS hay_cateo,
      ofi_cateo                 AS cateo_data,
      ofi_hay_detencion         AS hay_detencion,
      ofi_detenidos             AS detenidos_data,
      ofi_hay_vehiculo          AS hay_vehiculo,
      ofi_vehiculos             AS vehiculos_data,
      ofi_hay_arma_fuego        AS hay_arma,
      ofi_armas_fuego           AS armas_data,
      ofi_hay_droga             AS hay_droga,
      ofi_drogas                AS drogas_data,
      ofi_hay_hidrocarburo      AS hay_hidro,
      ofi_hidrocarburos         AS hidro_data,
      ofi_hay_orden_aprehension AS hay_orden,
      ofi_ordenes_aprehension   AS ordenes_data,
      ofi_hay_robo              AS hay_robo,
      ofi_monto_robo            AS monto_robo,
      ofi_objetos_recuperados   AS objetos
    FROM ofi_reportes_campo
    LEFT JOIN ofi_oficiales o ON o.id = ofi_reportes_campo.ofi_oficial_id
    WHERE created_at::date BETWEEN $1 AND $2
    ORDER BY created_at DESC
  `, [desde, hasta])

    const incGen = await query<Record<string, unknown>>(`
    SELECT
      rc.creado_en::date          AS fecha,
      i.folio                     AS folio,
      rc.policia_a_cargo          AS oficial,
      rc.hay_cateo                AS hay_cateo,
      rc.cateo_calle              AS cateo_calle,
      rc.cateo_colonia            AS cateo_colonia,
      rc.hay_detencion            AS hay_detencion,
      rc.nombre_detenidos         AS detenidos_data,
      rc.hay_vehiculo             AS hay_vehiculo,
      rc.vehiculos                AS vehiculos_data,
      rc.hay_arma_fuego           AS hay_arma,
      rc.armas_fuego              AS armas_data,
      rc.hay_droga                AS hay_droga,
      rc.drogas                   AS drogas_data,
      rc.hay_hidrocarburo         AS hay_hidro,
      rc.hidrocarburos            AS hidro_data,
      rc.hay_orden_aprehension    AS hay_orden,
      rc.ordenes_aprehension      AS ordenes_data,
      rc.hay_robo                 AS hay_robo,
      rc.monto_robo               AS monto_robo,
      rc.objetos_recuperados      AS objetos
    FROM incidente_reporte_campo rc
    JOIN incidentes i ON i.id = rc.incidente_id
    WHERE rc.creado_en::date BETWEEN $1 AND $2
    ORDER BY rc.creado_en DESC
  `, [desde, hasta])

    const general = [
        ...ofiGen.rows.map(r => ({
            fecha: r.fecha instanceof Date
                ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : String(r.fecha ?? '—'),
            folio: toStr(r.folio),
            oficial: toStr(r.oficial),
            cateo: r.hay_cateo
                ? (() => { const c = parseJsonb(r.cateo_data); return Array.isArray(c) ? `${c[0]?.calle ?? '—'}, ${c[0]?.colonia ?? ''}` : `${(c as any)?.calle ?? '—'}, ${(c as any)?.colonia ?? ''}` })()
                : 'NO',
            detenidos: r.hay_detencion
                ? parseJsonb(r.detenidos_data).map((d: any) => d.nombre).filter(Boolean).join(' / ') || '—'
                : 'NO',
            vehiculos: r.hay_vehiculo
                ? parseJsonb(r.vehiculos_data).map((v: any) => `${v.tipo ?? ''} ${v.placas ?? ''} ${v.color ?? ''}`.trim()).join(' | ') || '—'
                : 'NO',
            armas: r.hay_arma
                ? parseJsonb(r.armas_data).map((a: any) => `${a.datos ?? ''} · ${a.cartuchos ?? ''} carts.`).join(' | ') || '—'
                : 'NO',
            droga: r.hay_droga
                ? parseJsonb(r.drogas_data).map((d: any) => `${d.nombre ?? ''} ${d.cantidad ?? ''}`).join(' | ') || '—'
                : 'NO',
            hidrocarburo: r.hay_hidro
                ? parseJsonb(r.hidro_data).map((h: any) => `${h.nombrePersona ?? ''} · ${h.litrosExtraccion ?? ''} L`).join(' | ') || '—'
                : 'NO',
            ordenes: r.hay_orden
                ? parseJsonb(r.ordenes_data).map((o: any) => `${o.nombrePersona ?? ''} (${o.estatus ?? ''})`).join(' | ') || '—'
                : 'NO',
            robo: r.hay_robo ? `$${Number(r.monto_robo ?? 0).toLocaleString('es-MX')}` : 'NO',
            objetos: toStr(r.objetos),
        })),
        ...incGen.rows.map(r => ({
            fecha: r.fecha instanceof Date
                ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : String(r.fecha ?? '—'),
            folio: toStr(r.folio),
            oficial: toStr(r.oficial),
            cateo: r.hay_cateo ? `${toStr(r.cateo_calle)}, ${toStr(r.cateo_colonia)}` : 'NO',
            detenidos: r.hay_detencion ? toStr(r.detenidos_data) : 'NO',
            vehiculos: r.hay_vehiculo
                ? parseJsonb(r.vehiculos_data).map((v: any) => `${v.tipo ?? ''} ${v.placas ?? ''} ${v.color ?? ''}`.trim()).join(' | ') || '—'
                : 'NO',
            armas: r.hay_arma
                ? parseJsonb(r.armas_data).map((a: any) => `${a.datos ?? ''} · ${a.cartuchos ?? ''} carts.`).join(' | ') || '—'
                : 'NO',
            droga: r.hay_droga
                ? parseJsonb(r.drogas_data).map((d: any) => `${d.nombre ?? ''} ${d.cantidad ?? ''}`).join(' | ') || '—'
                : 'NO',
            hidrocarburo: r.hay_hidro
                ? parseJsonb(r.hidro_data).map((h: any) => `${h.nombrePersona ?? ''} · ${h.litrosExtraccion ?? ''} L`).join(' | ') || '—'
                : 'NO',
            ordenes: r.hay_orden
                ? parseJsonb(r.ordenes_data).map((o: any) => `${o.nombrePersona ?? ''} (${o.estatus ?? ''})`).join(' | ') || '—'
                : 'NO',
            robo: r.hay_robo ? `$${Number(r.monto_robo ?? 0).toLocaleString('es-MX')}` : 'NO',
            objetos: toStr(r.objetos),
        })),
    ].sort((a, b) => b.fecha.localeCompare(a.fecha))

    return { general, ...datos }
}

export async function obtenerDatosTelefonicos(desde?: string, hasta?: string) {
    const d = desde ?? '2000-01-01'
    const h = hasta ?? new Date().toISOString().split('T')[0]
    const rows = await obtenerExtorsiones(d, h)
    return rows.map(r => ({
        folio: toStr(r.folio),
        telefono: toStr(r.telefono),
        fecha: r.fecha instanceof Date
            ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : toStr(r.fecha),
        incidencia: toStr(r.incidencia) || '—',
    }))
}