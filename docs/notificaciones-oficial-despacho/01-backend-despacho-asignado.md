# Etapa 1 — Emitir `despacho.asignado` al oficial en `createDespacho()`

> Lee primero [`00-contexto.md`](./00-contexto.md) si no tienes el contexto
> del sistema de notificaciones y del módulo de despacho.

**Archivo a modificar:** `lib/incidentes/actions.ts`

## Objetivo

Cuando despacho asigna oficiales a un incidente vía `createDespacho()`, cada
oficial con cuenta en el sistema (fila en `ofi_oficiales` con `user_id` no
nulo) debe recibir una notificación (`evento = 'despacho.asignado'`) que,
al hacer click, lo lleve a `/oficial/despachos/{incidenteId}`.

## Código actual (localízalo por coincidencia de texto, no por número de línea — puede haber cambiado)

```ts
export async function createDespacho(formData: FormData) {
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
      if (inc.rows[0].estatus !== 'sin_despachar') throw new ValidationError('El incidente no está en estado sin_despachar')

      const existe = await cliente.query<{ id: string }>(
        `SELECT id FROM incidente_despacho WHERE incidente_id = $1 LIMIT 1`,
        [incidenteId],
      )

      const unidades: { extId: string; placa: string }[] = JSON.parse(formData.get('unidades') as string ?? '[]')
      const elementos: { extId: string; nomina: string; nombre: string }[] = JSON.parse(formData.get('elementos') as string ?? '[]')

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
          throw new ValidationError(`No se puede despachar: unidad(es) ya asignada(s) a otro incidente activo: ${detalle}`)
        }
      }

      await cliente.query('BEGIN')

      // Si ya existe un despacho (rondín con prioritario), reusarlo; si no, crear uno nuevo
      let despachoId: string
      if (existe.rows[0]) {
        despachoId = existe.rows[0].id
      } else {
        if (unidades.length === 0) throw new ValidationError('Se requiere al menos una unidad')
        if (elementos.length === 0) throw new ValidationError('Se requiere al menos un elemento')
        const despacho = await cliente.query<{ id: string }>(
          `INSERT INTO incidente_despacho (incidente_id, despachado_por) VALUES ($1, $2) RETURNING id`,
          [incidenteId, session.user.id],
        )
        despachoId = despacho.rows[0].id
      }

      // Ajustar atiende_caso del elemento prioritario del rondín (si existe)
      // según si su unidad sigue entre las seleccionadas ahora
      const prioritario = await cliente.query<{ id: string; patrulla_id: string | null }>(
        `SELECT ide.id, o.patrulla_id
         FROM incidente_despacho_elementos ide
         LEFT JOIN ofi_oficiales o ON o.no_nomina = ide.elemento_nomina AND o.ofi_estatus = 'activo'
         WHERE ide.despacho_id = $1 AND ide.es_prioritario = true
         LIMIT 1`,
        [despachoId],
      )
      if (prioritario.rows[0]) {
        const sigueSeleccionada = prioritario.rows[0].patrulla_id != null &&
          unidades.some(u => u.extId === prioritario.rows[0].patrulla_id)
        await cliente.query(
          `UPDATE incidente_despacho_elementos SET atiende_caso = $2 WHERE id = $1`,
          [prioritario.rows[0].id, sigueSeleccionada],
        )
      }

      for (const u of unidades) {
        await cliente.query(
          `INSERT INTO incidente_despacho_unidades (despacho_id, unidad_ext_id, unidad_placa) VALUES ($1, $2, $3)`,
          [despachoId, u.extId, u.placa],
        )
      }

      for (const e of elementos) {
        // Match automático nómina → oficial con cuenta en el sistema (NULL si es elemento externo)
        await cliente.query(
          `INSERT INTO incidente_despacho_elementos (despacho_id, elemento_ext_id, elemento_nomina, elemento_nombre, oficial_id)
           VALUES ($1, $2, $3, $4, (SELECT id FROM ofi_oficiales WHERE no_nomina = $5 AND ofi_estatus = 'activo' LIMIT 1))`,
          [despachoId, e.extId, e.nomina, e.nombre, e.nomina],
        )
      }

      await cliente.query(
        `UPDATE incidentes SET estatus = 'en_despacho', actualizado_en = NOW() WHERE id = $1`,
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

  await registrarAudit({ userId: session.user.id, accion: 'UPDATE', entidad: 'incidentes', entidadId: incidenteId, payload: { estatus_anterior: 'sin_despachar', estatus_nuevo: 'en_despacho' } })
  revalidatePath('/incidentes')
  revalidatePath('/agente_911/despacho')
}
```

`emitir` ya está importado en la parte superior del archivo:
`import { emitir } from '@/lib/notificaciones/emisor'`. No hace falta
agregar el import.

## Cambios a aplicar

### 1. Ampliar el primer `SELECT` para traer `folio` y el tipo de incidente

Reemplaza:

```ts
      const inc = await cliente.query<{ estatus: string }>(
        `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
        [incidenteId],
      )
      if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
      if (inc.rows[0].estatus !== 'sin_despachar') throw new ValidationError('El incidente no está en estado sin_despachar')
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
      if (inc.rows[0].estatus !== 'sin_despachar') throw new ValidationError('El incidente no está en estado sin_despachar')
      const { folio, tipo_nombre: tipoNombre } = inc.rows[0]
```

### 2. Resolver los `user_id` a notificar, antes del `COMMIT`

Justo antes de `await cliente.query('COMMIT')` (después del loop `for (const e of elementos)` que inserta en `incidente_despacho_elementos`, y después del `UPDATE incidentes SET estatus = 'en_despacho'`), agrega:

```ts
      const usuariosNotificar = elementos.length > 0
        ? await cliente.query<{ user_id: string }>(
            `SELECT DISTINCT o.user_id FROM ofi_oficiales o
             WHERE o.no_nomina = ANY($1::text[]) AND o.ofi_estatus = 'activo' AND o.user_id IS NOT NULL`,
            [elementos.map(e => e.nomina)],
          )
        : { rows: [] as { user_id: string }[] }

      await cliente.query('COMMIT')
```

(Sustituye el `await cliente.query('COMMIT')` existente por el bloque de
arriba, que lo incluye al final.)

### 3. Declarar `despachoId` fuera del `try` para poder usarlo después

`despachoId` y `usuariosNotificar` se declaran dentro del `try { ... }` del
`cliente`, pero se necesitan **después**, fuera de ese bloque, para emitir la
notificación (la regla del proyecto es "emitir siempre después del COMMIT").
Declara variables en el scope de la función, antes de `await tryActionRaw`, y
asígnalas dentro:

```ts
export async function createDespacho(formData: FormData) {
  const session = await requireOperador()
  const incidenteId = req(formData, 'incidenteId')

  let usuariosNotificar: { user_id: string }[] = []
  let folioNotificar = ''
  let tipoNombreNotificar: string | null = null

  await tryActionRaw(async () => {
    const cliente = await pool.connect()
    try {
      // ... (código existente, con el SELECT ampliado del paso 1) ...
      const { folio, tipo_nombre: tipoNombre } = inc.rows[0]
      folioNotificar = folio
      tipoNombreNotificar = tipoNombre

      // ... resto del código existente sin cambios ...

      // (paso 2, antes del COMMIT)
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

  await registrarAudit({ userId: session.user.id, accion: 'UPDATE', entidad: 'incidentes', entidadId: incidenteId, payload: { estatus_anterior: 'sin_despachar', estatus_nuevo: 'en_despacho' } })

  if (usuariosNotificar.length > 0) {
    await emitir('despacho.asignado', {
      titulo: `🚨 Nuevo despacho — ${folioNotificar}`,
      mensaje: `Se te asignó el incidente ${folioNotificar}${tipoNombreNotificar ? ` — ${tipoNombreNotificar}` : ''}. Revisa el detalle.`,
      entidadTipo: 'incidente',
      entidadId: incidenteId,
      usuarios: usuariosNotificar.map(r => r.user_id),
      roles: [],
      emitidaPor: session.user.id,
      dedup: `despacho.asignado:${incidenteId}`,
    })
  }

  revalidatePath('/incidentes')
  revalidatePath('/agente_911/despacho')
}
```

Puntos clave a respetar:
- `roles: []` es obligatorio — si se omite, `emitir()` además notificaría a
  **todo** el rol `Oficial de Campo` por el default del catálogo, no solo a
  los oficiales recién asignados.
- El bloque `emitir(...)` va **después** de `await tryActionRaw(...)` y
  **después** de `registrarAudit(...)`, nunca dentro del `try`/`BEGIN`/`COMMIT`.
- No pases `href` explícito — deja que use el default del catálogo
  (`/oficial/despachos/${incidenteId}`).
- Si `tryActionRaw` lanza (incidente no encontrado, estado inválido, unidad
  ocupada, etc.), la función corta antes de llegar al bloque de `emitir()` —
  correcto, no debe notificarse nada si la operación falló.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` no reporta errores nuevos en `lib/incidentes/actions.ts`.
- [ ] Al llamar `createDespacho` con al menos un elemento cuya nómina
      coincide con un `ofi_oficiales.user_id` activo, aparece una fila nueva
      en `notificaciones_eventos` con `evento = 'despacho.asignado'`,
      `user_id` = el `user_id` de ese oficial, `entidad_id` = el
      `incidenteId`, y `href` resuelto a `/oficial/despachos/{incidenteId}`.
- [ ] Si ningún elemento tiene `user_id` (todos externos sin cuenta), no se
      inserta ninguna fila en `notificaciones_eventos` para este evento (no
      debe lanzar error).
- [ ] Si `createDespacho` lanza un error de validación (ej. incidente ya
      despachado), no se emite ninguna notificación.
- [ ] No se modificó el comportamiento existente de `createDespacho` para
      unidades, elementos, `atiende_caso` del prioritario, ni el cambio de
      `estatus` del incidente.
