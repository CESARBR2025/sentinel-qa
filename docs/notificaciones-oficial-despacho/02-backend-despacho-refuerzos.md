# Etapa 2 — Emitir `despacho.refuerzos` al oficial en `enviarRefuerzos()`

> Lee primero [`00-contexto.md`](./00-contexto.md). Esta etapa aplica el
> mismo patrón que [`01-backend-despacho-asignado.md`](./01-backend-despacho-asignado.md)
> pero en otra función del mismo archivo. Puede ejecutarse en paralelo a la
> etapa 1 si tienes cuidado de no pisar el mismo diff (son funciones
> distintas, pero viven en el mismo archivo).

**Archivo a modificar:** `lib/incidentes/actions.ts`

## Objetivo

Cuando despacho agrega oficiales de **refuerzo** a un incidente ya activo vía
`enviarRefuerzos()`, cada oficial de refuerzo con cuenta en el sistema debe
recibir una notificación (`evento = 'despacho.refuerzos'`) que, al hacer
click, lo lleve a `/oficial/despachos/{incidenteId}`.

## Código actual (localízalo por coincidencia de texto)

```ts
// ─── Refuerzos ────────────────────────────────────────────────────────────────
/** Agrega unidades/elementos ADICIONALES a un folio ya activo (911 o rondín) sin re-despachar ni cerrar. */
export async function enviarRefuerzos(formData: FormData) {
  const session = await requireOperador()
  const incidenteId = req(formData, 'incidenteId')

  await tryActionRaw(async () => {
    const cliente = await pool.connect()
    try {
      const inc = await cliente.query<{ estatus: string }>(
        `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
        [incidenteId],
      )
      if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
      if (inc.rows[0].estatus !== 'en_despacho' && inc.rows[0].estatus !== 'en_sitio')
        throw new ValidationError('Solo se pueden enviar refuerzos a un folio activo (en despacho o en sitio)')

      const desp = await cliente.query<{ id: string }>(
        `SELECT id FROM incidente_despacho WHERE incidente_id = $1 LIMIT 1`,
        [incidenteId],
      )
      if (!desp.rows[0]) throw new ValidationError('El incidente no tiene despacho para reforzar')
      const despachoId = desp.rows[0].id

      const unidades: { extId: string; placa: string }[] = JSON.parse(formData.get('unidades') as string ?? '[]')
      const elementos: { extId: string; nomina: string; nombre: string }[] = JSON.parse(formData.get('elementos') as string ?? '[]')

      if (unidades.length === 0 && elementos.length === 0)
        throw new ValidationError('Agrega al menos una unidad o un elemento de refuerzo')

      if (unidades.length > 0) {
        const ocupadas = await cliente.query<{ unidad_ext_id: string; folio: string }>(
          `SELECT DISTINCT idu.unidad_ext_id, i.folio
           FROM incidente_despacho_unidades idu
           JOIN incidente_despacho id2 ON id2.id = idu.despacho_id
           JOIN incidentes i ON i.id = id2.incidente_id
           WHERE i.estatus IN ('en_despacho', 'en_sitio')
             AND i.id != $1
             AND idu.unidad_ext_id = ANY($2::text[])`,
          [incidenteId, unidades.map(u => u.extId)],
        )
        if (ocupadas.rows.length > 0) {
          const detalle = ocupadas.rows.map(r => `${r.unidad_ext_id} (folio ${r.folio})`).join(', ')
          throw new ValidationError(`No se puede enviar refuerzo: unidad(es) ya asignada(s) a otro incidente activo: ${detalle}`)
        }
      }

      await cliente.query('BEGIN')

      for (const u of unidades) {
        await cliente.query(
          `INSERT INTO incidente_despacho_unidades (despacho_id, unidad_ext_id, unidad_placa, es_refuerzo) VALUES ($1, $2, $3, true)`,
          [despachoId, u.extId, u.placa],
        )
      }
      for (const e of elementos) {
        await cliente.query(
          `INSERT INTO incidente_despacho_elementos (despacho_id, elemento_ext_id, elemento_nomina, elemento_nombre, oficial_id, es_refuerzo)
           VALUES ($1, $2, $3, $4, (SELECT id FROM ofi_oficiales WHERE no_nomina = $5 AND ofi_estatus = 'activo' LIMIT 1), true)`,
          [despachoId, e.extId, e.nomina, e.nombre, e.nomina],
        )
      }

      await cliente.query(
        `UPDATE incidentes SET actualizado_en = NOW() WHERE id = $1`,
        [incidenteId],
      )

      await cliente.query('COMMIT')
    } catch (err) {
      await cliente.query('ROLLBACK')
      throw err
    } finally {
      cliente.release()
    }
  })

  await registrarAudit({ userId: session.user.id, accion: 'UPDATE', entidad: 'incidente_despacho', entidadId: incidenteId, payload: { refuerzo: true } })
  revalidatePath(`/incidentes/${incidenteId}`)
}
```

## Cambios a aplicar

### 1. Ampliar el primer `SELECT` para traer `folio` y el tipo de incidente

Reemplaza:

```ts
      const inc = await cliente.query<{ estatus: string }>(
        `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
        [incidenteId],
      )
      if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
      if (inc.rows[0].estatus !== 'en_despacho' && inc.rows[0].estatus !== 'en_sitio')
        throw new ValidationError('Solo se pueden enviar refuerzos a un folio activo (en despacho o en sitio)')
```

Por:

```ts
      const inc = await cliente.query<{ estatus: string; folio: string; tipo_nombre: string | null }>(
        `SELECT i.estatus, i.folio, cti.nombre AS tipo_nombre
         FROM incidentes i
         LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
         WHERE i.id = $1 LIMIT 1`,
        [incidenteId],
      )
      if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
      if (inc.rows[0].estatus !== 'en_despacho' && inc.rows[0].estatus !== 'en_sitio')
        throw new ValidationError('Solo se pueden enviar refuerzos a un folio activo (en despacho o en sitio)')
      const { folio, tipo_nombre: tipoNombre } = inc.rows[0]
```

### 2. Resolver los `user_id` a notificar, antes del `COMMIT`

Justo antes de `await cliente.query('COMMIT')` (después del loop
`for (const e of elementos)` que inserta en `incidente_despacho_elementos`, y
después del `UPDATE incidentes SET actualizado_en = NOW()`), agrega la misma
query de la etapa 1, mapeando a una variable temporal dentro del `try`.

### 3. Declarar variables fuera del `try` y emitir después del `tryActionRaw`

Aplica el mismo patrón de la etapa 1 (declarar `let usuariosNotificar`,
`let folioNotificar`, `let tipoNombreNotificar` antes de `await
tryActionRaw(...)`, asignarlas dentro, y emitir después de
`registrarAudit`). El resultado final:

```ts
export async function enviarRefuerzos(formData: FormData) {
  const session = await requireOperador()
  const incidenteId = req(formData, 'incidenteId')

  let usuariosNotificar: { user_id: string }[] = []
  let folioNotificar = ''
  let tipoNombreNotificar: string | null = null

  await tryActionRaw(async () => {
    const cliente = await pool.connect()
    try {
      const inc = await cliente.query<{ estatus: string; folio: string; tipo_nombre: string | null }>(
        `SELECT i.estatus, i.folio, cti.nombre AS tipo_nombre
         FROM incidentes i
         LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
         WHERE i.id = $1 LIMIT 1`,
        [incidenteId],
      )
      if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
      if (inc.rows[0].estatus !== 'en_despacho' && inc.rows[0].estatus !== 'en_sitio')
        throw new ValidationError('Solo se pueden enviar refuerzos a un folio activo (en despacho o en sitio)')
      const { folio, tipo_nombre: tipoNombre } = inc.rows[0]
      folioNotificar = folio
      tipoNombreNotificar = tipoNombre

      const desp = await cliente.query<{ id: string }>(
        `SELECT id FROM incidente_despacho WHERE incidente_id = $1 LIMIT 1`,
        [incidenteId],
      )
      if (!desp.rows[0]) throw new ValidationError('El incidente no tiene despacho para reforzar')
      const despachoId = desp.rows[0].id

      const unidades: { extId: string; placa: string }[] = JSON.parse(formData.get('unidades') as string ?? '[]')
      const elementos: { extId: string; nomina: string; nombre: string }[] = JSON.parse(formData.get('elementos') as string ?? '[]')

      if (unidades.length === 0 && elementos.length === 0)
        throw new ValidationError('Agrega al menos una unidad o un elemento de refuerzo')

      if (unidades.length > 0) {
        const ocupadas = await cliente.query<{ unidad_ext_id: string; folio: string }>(
          `SELECT DISTINCT idu.unidad_ext_id, i.folio
           FROM incidente_despacho_unidades idu
           JOIN incidente_despacho id2 ON id2.id = idu.despacho_id
           JOIN incidentes i ON i.id = id2.incidente_id
           WHERE i.estatus IN ('en_despacho', 'en_sitio')
             AND i.id != $1
             AND idu.unidad_ext_id = ANY($2::text[])`,
          [incidenteId, unidades.map(u => u.extId)],
        )
        if (ocupadas.rows.length > 0) {
          const detalle = ocupadas.rows.map(r => `${r.unidad_ext_id} (folio ${r.folio})`).join(', ')
          throw new ValidationError(`No se puede enviar refuerzo: unidad(es) ya asignada(s) a otro incidente activo: ${detalle}`)
        }
      }

      await cliente.query('BEGIN')

      for (const u of unidades) {
        await cliente.query(
          `INSERT INTO incidente_despacho_unidades (despacho_id, unidad_ext_id, unidad_placa, es_refuerzo) VALUES ($1, $2, $3, true)`,
          [despachoId, u.extId, u.placa],
        )
      }
      for (const e of elementos) {
        await cliente.query(
          `INSERT INTO incidente_despacho_elementos (despacho_id, elemento_ext_id, elemento_nomina, elemento_nombre, oficial_id, es_refuerzo)
           VALUES ($1, $2, $3, $4, (SELECT id FROM ofi_oficiales WHERE no_nomina = $5 AND ofi_estatus = 'activo' LIMIT 1), true)`,
          [despachoId, e.extId, e.nomina, e.nombre, e.nomina],
        )
      }

      await cliente.query(
        `UPDATE incidentes SET actualizado_en = NOW() WHERE id = $1`,
        [incidenteId],
      )

      const resultado = elementos.length > 0
        ? await cliente.query<{ user_id: string }>(
            `SELECT DISTINCT o.user_id FROM ofi_oficiales o
             WHERE o.no_nomina = ANY($1::text[]) AND o.ofi_estatus = 'activo' AND o.user_id IS NOT NULL`,
            [elementos.map(e => e.nomina)],
          )
        : { rows: [] as { user_id: string }[] }
      usuariosNotificar = resultado.rows

      await cliente.query('COMMIT')
    } catch (err) {
      await cliente.query('ROLLBACK')
      throw err
    } finally {
      cliente.release()
    }
  })

  await registrarAudit({ userId: session.user.id, accion: 'UPDATE', entidad: 'incidente_despacho', entidadId: incidenteId, payload: { refuerzo: true } })

  if (usuariosNotificar.length > 0) {
    await emitir('despacho.refuerzos', {
      titulo: `🚨 Refuerzo solicitado — ${folioNotificar}`,
      mensaje: `Se solicitó tu apoyo en el incidente ${folioNotificar}${tipoNombreNotificar ? ` — ${tipoNombreNotificar}` : ''}. Revisa el detalle.`,
      entidadTipo: 'incidente',
      entidadId: incidenteId,
      usuarios: usuariosNotificar.map(r => r.user_id),
      roles: [],
      emitidaPor: session.user.id,
    })
  }

  revalidatePath(`/incidentes/${incidenteId}`)
}
```

Puntos clave a respetar:
- `roles: []` obligatorio, igual que en la etapa 1.
- **No** se pasa `dedup` aquí — a diferencia de `createDespacho` (que solo
  puede correr una vez por incidente porque el estado pasa de
  `sin_despachar` a `en_despacho`), `enviarRefuerzos` es una acción que se
  puede repetir legítimamente varias veces sobre el mismo incidente, y cada
  vez son elementos nuevos. Un `dedup` fijo bloquearía notificaciones
  legítimas de refuerzos posteriores.
- El bloque `emitir(...)` va después de `tryActionRaw` y de `registrarAudit`,
  nunca dentro de la transacción.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` no reporta errores nuevos en `lib/incidentes/actions.ts`.
- [ ] Al llamar `enviarRefuerzos` con al menos un elemento cuya nómina
      coincide con un `ofi_oficiales.user_id` activo, aparece una fila nueva
      en `notificaciones_eventos` con `evento = 'despacho.refuerzos'`,
      `user_id` del oficial de refuerzo, `entidad_id` = `incidenteId`, y
      `href` resuelto a `/oficial/despachos/{incidenteId}`.
- [ ] Llamar `enviarRefuerzos` dos veces seguidas sobre el mismo incidente,
      con oficiales distintos cada vez, genera notificaciones para ambos
      (no se bloquean por dedup).
- [ ] No se modificó el comportamiento existente de `enviarRefuerzos` para
      unidades ni elementos.
