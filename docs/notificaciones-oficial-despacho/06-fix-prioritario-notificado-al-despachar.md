# Etapa 6 — Notificar al oficial prioritario de rondín cuando despacho confirma la asignación

> Lee primero [`00-contexto.md`](./00-contexto.md) y
> [`01-backend-despacho-asignado.md`](./01-backend-despacho-asignado.md)
> si no tienes el contexto del sistema de notificaciones y del flujo
> rondín → despacho.

**Archivo a modificar:** `lib/incidentes/actions.ts` (función `createDespacho`)

## El bug (reportado por el usuario con un caso real)

Un oficial escala un rondín desde `/oficial/rondin`. `createRondinEscalado`
crea el incidente en `sin_despachar` + `incidente_despacho` + el elemento
del propio oficial con `es_prioritario = true`. **Pero no emite ninguna
notificación `despacho.asignado` para ese oficial** — solo emite
`rondin.escalado` (dirigido al rol `agente_despacho`).

Después, el despacho abre el tablón y confirma la asignación vía
`createDespacho` (que **reutiliza** el despacho del rondín). Ahí el
incidente pasa a `en_despacho` y **aparece el badge** "N ASIGNACIONES
ACTIVAS" en la card del oficial. Sin embargo, `createDespacho` resolvía los
destinatarios de la notificación **solo** a partir de los `elementos` de la
llamada actual (`elementos.map(e => e.nomina)`), excluyendo al prioritario
ya pre-asignado.

Resultado verificado en BD: folio `SSPM/INC/2026/003` (canal `radio`,
`en_despacho`) tenía 3 oficiales asignados — el prioritario (`123-123`, el
que escaló el rondín) **sin notificación**, y los dos agregados después
(`205-205`, `206-206`) **sí notificados**. El oficial ve el badge pero la
campanita nunca suena.

## Decisión (confirmada)

- La notificación debe llegar **en el momento en que el despacho confirma
  la asignación** (`createDespacho`, estatus → `en_despacho`) — que es
  exactamente cuando el badge aparece. Notificar antes (en el
  escalamiento) sería prematuro: el incidente está `sin_despachar` y el
  despacho aún puede cambiar la asignación.
- Se notifica también al **prioritario pre-asignado del rondín**, no solo
  a los elementos de la llamada.
- No se toca `createRondinEscalado` (no emite notificación al oficial en
  el escalamiento) ni `enviarRefuerzos` (ese flujo sí notifica a los
  refuerzos de cada llamada; el prioritario ya quedó notificado en el
  `createDespacho` que activó el folio).
- Si el prioritario no tiene cuenta (`oficial_id`/`user_id` NULL), la
  query simplemente no lo agrega — mismo gap silencioso ya documentado
  para elementos externos.

## Cambio — `lib/incidentes/actions.ts`, función `createDespacho`

### Código actual (localízalo por coincidencia de texto — puede haber cambiado de línea)

Dentro del `try` de la transacción, justo antes del `COMMIT`, después del
`UPDATE incidentes SET estatus = 'en_despacho'`:

```ts
      const resultado = elementos.length > 0
        ? await cliente.query<{ user_id: string }>(
            `SELECT DISTINCT o.user_id FROM ofi_oficiales o
             WHERE o.no_nomina = ANY($1::text[]) AND o.ofi_estatus = 'activo' AND o.user_id IS NOT NULL`,
            [elementos.map(e => e.nomina)],
          )
        : { rows: [] as { user_id: string }[] }
      usuariosNotificar = resultado.rows
```

### Reemplázalo por

```ts
      const resultado = await cliente.query<{ user_id: string }>(
        `SELECT DISTINCT o.user_id FROM ofi_oficiales o
          WHERE o.ofi_estatus = 'activo' AND o.user_id IS NOT NULL
            AND (o.no_nomina = ANY($1::text[])
                 OR o.id = (SELECT ide.oficial_id FROM incidente_despacho_elementos ide
                            WHERE ide.despacho_id = $2 AND ide.es_prioritario = true LIMIT 1))`,
        [elementos.map(e => e.nomina), despachoId],
      )
      usuariosNotificar = resultado.rows
```

La subquery del `OR` rescata el `oficial_id` del elemento prioritario del
despacho que se está reutilizando (el del rondín). En un incidente nuevo
(sin despacho previo) no hay fila `es_prioritario` y el `OR` no aporta
nada — el comportamiento queda idéntico al actual.

`despachoId` ya está en scope (declarado en el `if/else` anterior dentro
del mismo `try`), por lo que no hay que mover declaraciones.

El bloque `emitir('despacho.asignado', ...)` que está después de
`registrarAudit` no cambia: recibe `usuarios: usuariosNotificar.map(r =>
r.user_id)`, `roles: []` y `dedup: 'despacho.asignado:${incidenteId}'`. El
`dedup` evita duplicados si el prioritario fuera notificado dos veces para
el mismo incidente.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` y `npm run build` sin errores nuevos.
- [ ] **Caso rondín**: un incidente escalado por rondín (con prioritario
      pre-asignado) que luego se confirma en el tablón → se insertan filas
      `despacho.asignado` en `notificaciones_eventos` para el prioritario
      Y para los elementos nuevos de la llamada, todas con `user_id`
      resuelto y `href` → `/oficial/despachos/{incidenteId}`.
- [ ] **Caso incidente nuevo (no rondín)**: `createDespacho` se comporta
      exactamente igual que antes — solo notifica a los `elementos` de la
      llamada.
- [ ] **Prioritario sin cuenta** (`oficial_id` NULL): no se inserta
      notificación para él, sin error.
- [ ] El `dedup` no genera filas duplicadas si `createDespacho` se
      reintenta para el mismo incidente.

## Cierre según convenciones del repo

```bash
npx graphify update
```

Y actualizar la regla #18 de `boveda/🧩 Features/911.md` y el
`boveda/🗺 Roadmap/Changelog.md` para reflejar que el oficial prioritario
de un rondín ahora recibe `despacho.asignado` cuando el despacho confirma
la asignación.
