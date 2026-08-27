# Etapa 3 — Capa de dominio `lib/novedades/`

Requiere etapas 0 y 2.

Sigue el Layered Domain Pattern de `AGENTS.md`.

```
lib/novedades/
├── types.ts       — un tipo por sección + tipos de fila de cada listado
├── ventana.ts     — ventana 06:00 → 06:00
├── sector.ts      — resolución de sector (viene de Etapa 0.3)
├── mapper.ts      — rowTo* : jsonb crudo → objeto tipado
├── repository.ts  — SQL sobre las 3 tablas de Etapa 2
├── estatus.ts     — semáforo del stepper
└── service.ts     — orquestación: cargar día completo, confirmar sección
```

## `ventana.ts` — el punto más delicado

Todo el documento se rige por **06:00 → 06:00**. Esto no es un detalle de
presentación: cambia qué filas entran en cada conteo.

```ts
/**
 * Ventana operativa del Parte de Novedades.
 * El parte del día D cubre de las 06:00 de D-1 a las 06:00 de D.
 */
export function ventanaNovedades(fecha: string): { inicio: string; fin: string }
```

**Regla dura: ninguna query de este módulo usa `::date` sobre una columna de
timestamp.** Ese fue exactamente el bug de timezone ya corregido en Formato N
(decisión registrada: `buscarIncidentesPorRango` / `buscarDetencionesPorRango`
ahora usan `::date` + `TO_CHAR` precisamente porque el filtro anterior recortaba
mal el día). Aquí el problema es distinto y peor: la ventana **no coincide con
un día natural**, así que `::date` es incorrecto por construcción.

Todas las queries filtran con `columna >= $inicio AND columna < $fin`, con los
límites calculados por este helper.

Las tablas que guardan fecha y hora en columnas separadas (`ofi_reporte_denuncia`
tiene `fecha_reporte date` + `hora_reporte time`; `iph_detenidos` tiene
`fecha_evento` + `hora_inicio_evento`) se filtran componiendo:
`(fecha_reporte + hora_reporte) >= $inicio AND (...) < $fin`.

**Nota sobre el documento:** la tabla T5 de Plataforma México trae impreso "DE
05:00 A 05:00 HORAS". Por decisión del usuario, todo el parte es 06:00→06:00, así
que ese literal se corrige a 06:00 en el generador (Etapa 8).

## `repository.ts`

Solo toca `novedades_seccion`, `novedades_filas` y `novedades_estatus_dia`.
**No consulta las tablas de origen** — eso es responsabilidad de los servicios de
cálculo (etapas 4-6).

```ts
obtenerSeccion(fecha, seccion): Promise<Record<string, unknown> | null>
upsertSeccion(fecha, seccion, datos, userId): Promise<void>
obtenerFilas(fecha, seccion): Promise<FilaNovedad[]>
reemplazarFilas(fecha, seccion, filas, userId): Promise<void>
agregarFila(fecha, seccion, datos, userId): Promise<FilaNovedad>
eliminarFila(id): Promise<void>
```

`reemplazarFilas` es transaccional (delete + insert en una transacción): el
stepper edita listados completos, no fila por fila.

## `estatus.ts`

Copia literal de `lib/reportes/formato-n-estatus-service.ts` con las 11 secciones
en vez de 8: `SECCIONES_ESTATUS`, `COLUMNA`, `contarConfirmadas`, `esListo`,
`obtenerEstatusDia`, `obtenerEstatusRango`, `confirmarSeccion`,
`desconfirmarSeccion`.

Mantener la misma semántica de `completado_en`: se sella cuando las 11 quedan en
`true`, y se limpia si alguna se desconfirma.

## `service.ts`

```ts
/** Carga el día completo: calcula lo automático, lee lo ya capturado. */
obtenerDiaNovedades(fecha: string): Promise<DiaNovedades>

/** Snapshot: congela lo calculado + lo capturado y confirma la sección. */
confirmarSeccionNovedades(fecha, seccion, datos, userId): Promise<EstatusDia>
```

`obtenerDiaNovedades` **no escribe**. El snapshot ocurre solo en
`confirmarSeccionNovedades`, y solo sobre la sección que se está confirmando —
esa acotación es lo que evita el bug de Formato N donde un guardado de una
pantalla sobreescribía con ceros los campos de otra.

Si la sección ya fue confirmada, `obtenerDiaNovedades` devuelve el snapshot
guardado, **no el recálculo**. El documento oficial no cambia retroactivamente.

## Verificación

`npx tsc --noEmit` + prueba de humo de `ventanaNovedades` en los tres casos
frontera: cambio de mes, cambio de año, y un hecho registrado a las 05:59 y otro
a las 06:01 (deben caer en partes distintos).
