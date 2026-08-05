# Contexto: Saneamiento de arquitectura de BD — Reporte de Campo / D1 / Detenidos

## Problema

El flujo reporte de campo → D1 → detenidos acumuló deuda de esquema a lo largo de varias features construidas en paralelo:

1. **Tabla muerta con lectores activos**: `incidente_reporte_campo` tiene 0 filas y nadie inserta en ella, pero 9 archivos de `lib/**` todavía la leen vía `LEFT JOIN`/`SELECT` (más una referencia en `lib/admin/sistema-constants.ts`). La fuente real y viva es `ofi_reportes_campo`.
2. **Dos fuentes de "detenido" para el mismo reporte de campo**: la columna JSONB `ofi_reportes_campo.ofi_detenidos` y la tabla relacional `ofi_detalles_asegurados` (la que se llena siempre al crear el reporte, vía `lib/oficial/service.ts:209`). `lib/detenidos-compartido.ts` lee la JSONB en vez de la tabla relacional.
3. **FK circular real**: `ofi_fichas_inteligencia.iph_id → iph_detenidos.id` (`fk_ficha_iph`) y `iph_detenidos.ficha_inteligencia_id → ofi_fichas_inteligencia.id` (`fk_iph_vinculo_inteligencia`) se referencian mutuamente.
4. **Join fragil por folio en vez de FK**: `lib/monitorista/repository.ts:277` hace `JOIN ofi_reporte_denuncia rd ON rd.folio_denuncia = iph.folio_911`, cuando `iph_detenidos` ya tiene la columna `reporte_denuncia_id` con FK real a `ofi_reporte_denuncia(id)` (`fk_iph_denuncia`).
5. **`oficial_id` de D1 sin FK** y de tipo `text` en vez de `uuid`.
6. **`ofi_reporte_denuncia.incidente_id` tiene 3 FKs duplicadas** apuntando al mismo destino (`incidentes.id`): `fk_d1_incidente`, `fk_denuncia_incidente`, `ord_incidente_fk` — deuda de migraciones históricas superpuestas, no capturada en el diagnóstico original.
7. **Patrón `COALESCE(rd.incidente_id, rc.incidente_id)`** en `lib/fiscalia/repository.ts:637` — innecesario porque el insert del D1 ya hereda `incidente_id` de `ofi_reportes_campo` cuando falta.
8. **Colisión de numeración de migraciones**: dos archivos `0026_*.sql`.
9. **Faltan índices** en columnas usadas por los dashboards (`ofi_reportes_campo.ofi_oficial_id`/`created_at`, `ofi_detalles_asegurados.reporte_campo_id`, `ofi_reporte_denuncia.fecha_reporte`/`reporte_campo_id`/`oficial_id`) y **falta FK** en `evidencias_detenido.reporte_campo_id` (la columna existe, la constraint no).

## Origen de este plan

Diagnóstico y primer borrador de plan generados por DeepSeek. Verificado por Claude (arquitecto) **conectándose directamente a la BD real** (`sanjuandelrio.sytes.net`, credenciales en `.env` / `Variables de Entorno.md`) antes de aprobar — no se confió solo en la documentación. Se encontraron y corrigieron 4 errores del borrador original:

### Corrección 1 — `oficial_id` NO referencia `users.id`

El borrador de DeepSeek asumía (con duda explícita) que `ofi_reporte_denuncia.oficial_id` referencia `users.id`. **Falso.** Verificado en BD real: el único valor existente (`37324db5-5ede-478e-a617-769cf9967eec`) coincide exactamente con `ofi_oficiales.id` y no existe en `users.id`. Además `ofi_reporte_denuncia` ya tiene una columna separada, `capturado_por` (FK real `fk_reportes_d1_usuario → users.id`), que es la que representa al usuario de sesión. Confirmado también en código: `lib/oficial/service.ts:185,212` propaga `oficial.id` (de `ofi_oficiales`, resuelto vía `obtenerOficialPorUserId`) como el valor que llega a `oficialId`, nunca el `userId` de sesión.

**Implicación técnica adicional** (no vista en el borrador): `oficial_id` es `text` pero `ofi_oficiales.id` es `uuid` — son tipos incompatibles para una FK directa en Postgres. Hay que convertir la columna a `uuid` antes de crear la constraint. Verificado: los valores existentes ya tienen formato UUID válido y no hay `NULL`s, así que el cast es seguro hoy.

### Corrección 2 — lista de archivos de la Fase 1 incompleta

El borrador listaba 7 archivos leyendo `incidente_reporte_campo`. `grep` real encontró **10 referencias en 9 archivos** (2 de ellas son comentarios, no SQL activo):

| Archivo | Líneas | Tipo |
|---|---|---|
| `lib/reportes-operativos/repository.ts` | 34, 66, 97, 129, 158, 187, 216 | SQL activo (7 queries) |
| `lib/reportes-operativos/service.ts` | 212 | SQL activo |
| `lib/reportes/formato-n-rnd-service.ts` | 79 | SQL activo |
| `lib/reportes-incidentes/repository.ts` | 23, 68 | SQL activo |
| `lib/n-coordinacion/repository.ts` | 37, 86 | SQL activo |
| `lib/incidentes/repository.ts` | 137, 224, 281 | SQL activo (3 queries) |
| `lib/911/repository.ts` | 143 | SQL activo |
| `lib/admin/sistema-constants.ts` | 20 | referencia a nombre de tabla (registro/lista) |
| `lib/reportes/formato-n-armas-aseguradas-service.ts` | 11 | solo comentario |
| `lib/incidentes/service.ts` | 65 | solo comentario |
| `lib/incidentes/repository.ts` | 120 | solo comentario |

Si se hace `DROP TABLE` sin migrar los 9 archivos con SQL activo, esos módulos rompen en runtime — `tsc`/`build` no lo detecta porque son queries SQL crudas.

### Corrección 3 — FKs duplicadas no estaban en el diagnóstico

`ofi_reporte_denuncia.incidente_id` tiene 3 constraints FK apuntando a `incidentes.id`: `fk_d1_incidente`, `fk_denuncia_incidente`, `ord_incidente_fk`. Se añade limpieza de esto a la Fase 3 (ya se está tocando esa tabla).

### Corrección 4 — numeración de migraciones del propio borrador tenía colisión

El borrador de DeepSeek proponía renumerar `0026_notificaciones_por_rol.sql` → `0031_*` y luego crear otra migración también como `0031_reportes_campo_integridad.sql` — colisión consigo mismo. Además, se verificó con `git log --diff-filter=A --follow` cuál `0026` se creó primero: **`0026_notificaciones_por_rol.sql` es el original (2026-07-29 11:00), `0026_incidente_despacho_elementos_atiende_caso.sql` es el duplicado posterior (2026-07-29 13:33)**. Es este último el que se renumera, no el primero (al revés de lo que asumía el borrador). Numeración final sin colisiones:

| Archivo final | Contenido |
|---|---|
| `0031_incidente_despacho_elementos_atiende_caso.sql` | renombrado desde `0026_*` (el duplicado posterior) |
| `0032_reportes_campo_integridad.sql` | índices + `DROP TABLE incidente_reporte_campo` |
| `0033_detenidos_asegurados_idx.sql` | índice en `ofi_detalles_asegurados.reporte_campo_id` |
| `0034_iph_romper_circular.sql` | rompe FK circular ficha↔iph |
| `0035_d1_integridad.sql` | índices D1 + FK `oficial_id`→`ofi_oficiales` + dedupe FKs de `incidente_id` |
| `0036_fks_faltantes_e_indices.sql` | FK `evidencias_detenido.reporte_campo_id` + índices horizontales |

## Estado real de la BD (verificado, no asumido)

`ofi_reportes_campo`=6 filas, `incidentes`=6, `ofi_reporte_denuncia`=1, `iph_detenidos`=0, `incidente_reporte_campo`=0, `ofi_fichas_inteligencia`=0, `fichas_inteligencia_detenidos`=0, `evidencias_detenido`=0, `ofi_oficiales`=11, `users`=39. BD de desarrollo prácticamente vacía — migrar ahora es gratis, sin riesgo de pérdida de datos reales.

## Decisiones ya tomadas

1. **No cambiar contratos de API** ni nombres de columnas expuestas en `app/api/**`.
2. **Migraciones SQL manuales** en `lib/db/manual-migrations/`, un archivo por cambio, idempotentes (`IF NOT EXISTS`/`IF EXISTS`).
3. **`fichas_inteligencia_detenidos`** (legacy, `id` integer, 29 columnas) se marca legacy y no se toca en este plan — no se escribe más, no se elimina.
4. **`ofi_reportes_campo.ofi_detenidos`** (columna JSONB) se mantiene como está — este plan solo cambia qué tabla lee `lib/detenidos-compartido.ts`, no toca el modelo de captura del formulario de campo.
5. **`plan-formulario-d1`** (precarga + fix botón, carpeta hermana ya existente en el repo) se ejecuta **después** de este plan, sobre el modelo ya saneado.
6. **Fuera de alcance**: reescribir el D1 en subtablas, migrar JSONB de `ofi_reportes_campo` a tablas hijas normalizadas, cambios en el módulo VIA.

## Archivos y tablas ya identificados (mapa completo)

| Archivo/Tabla | Rol |
|---|---|
| `lib/db/manual-migrations/` | destino de las migraciones nuevas |
| `lib/reportes-operativos/repository.ts`, `service.ts` | leen `incidente_reporte_campo` → migrar a `ofi_reportes_campo` |
| `lib/reportes/formato-n-rnd-service.ts` | ídem |
| `lib/reportes-incidentes/repository.ts` | ídem |
| `lib/n-coordinacion/repository.ts` | ídem |
| `lib/incidentes/repository.ts`, `service.ts` | ídem + comentarios a limpiar |
| `lib/911/repository.ts` | ídem |
| `lib/admin/sistema-constants.ts:20` | quitar `'incidente_reporte_campo'` de la lista tras el DROP |
| `lib/detenidos-compartido.ts` | cambiar de `ofi_reportes_campo.ofi_detenidos` (JSONB) a `ofi_detalles_asegurados` |
| `lib/oficial/repository.ts` | ya inserta en `ofi_detalles_asegurados` simultáneamente (línea ~563), no requiere cambio |
| `lib/monitorista/repository.ts:277` | join por folio → cambiar a `reporte_denuncia_id` |
| `lib/fiscalia/repository.ts:637` | `COALESCE(rd.incidente_id, rc.incidente_id)` → `rd.incidente_id` |
| `lib/d1/repository.ts` | consumidor de `oficial_id`/`incidente_id`, no requiere cambio de lógica, solo se beneficia de los índices/FK nuevos |
| `boveda/📦 Datos/Esquema BD.md` | regenerar con `npm run db:schema` al cerrar cada fase con DDL |
| `boveda/🧩 Features/Reporte Campo.md` | actualizar al cerrar el plan |
| `boveda/🏗 Arquitectura/Decisiones.md` | ADR nuevo al cerrar el plan |

## Fuera de alcance (no implementar salvo pedido explícito)

- Reescribir el D1 como tabla estrecha / partir en subtablas.
- Migrar JSONB de `ofi_reportes_campo` (vehículos, cateo, armas, drogas) a tablas hijas normalizadas.
- Cambios en el módulo VIA (`via.*`).
- `plan-formulario-d1` (corre después, sobre el modelo ya saneado).
- Eliminar o migrar `fichas_inteligencia_detenidos` (legacy, solo se deja de escribir).
