# Plan: Saneamiento de Arquitectura de BD — Reporte de Campo / D1 / Detenidos

Carpeta de trabajo para dejar el modelo de datos del flujo reporte de campo → D1 → detenidos con una sola fuente de verdad por concepto, integridad referencial real e índices que soporten los dashboards, sin cambiar contratos de API. Diagnóstico original y primer borrador por DeepSeek; verificado y corregido por Claude (arquitecto) conectándose directamente a la BD real antes de aprobar. A construir por DeepSeek (worker).

`plan-formulario-d1` (carpeta hermana, ya existente en el repo) se ejecuta **después** de este plan, sobre el modelo ya saneado.

## Orden de trabajo

Las etapas son **secuenciales**. No avanzar a la siguiente sin validar los "Criterios de aceptación" de la anterior. Cada `etapa-N.md` es autocontenida: se puede pegar tal cual como instrucción de trabajo sin necesitar leer las demás (aunque todas parten del mismo contexto en `00-contexto.md`).

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Diagnóstico completo, las 4 correcciones hechas al borrador original de DeepSeek (verificadas contra la BD real), estado real de la BD, decisiones ya tomadas, mapa de archivos.
2. [etapa-1.md](etapa-1.md) — Gobernanza de esquema: renumerar la colisión `0026`, README de convención de migraciones, ampliar el exportador de esquema con índices/FKs.
3. [etapa-2.md](etapa-2.md) — Migrar a código los 9 archivos que leen la tabla muerta `incidente_reporte_campo` hacia `ofi_reportes_campo` (lista completa, verificada con grep — el borrador original tenía 3 archivos de menos).
4. [etapa-3.md](etapa-3.md) — DDL: índices en `ofi_reportes_campo` + `DROP TABLE incidente_reporte_campo`.
5. [etapa-4.md](etapa-4.md) — `ofi_detalles_asegurados` como fuente canónica de detenidos: índice + reescritura de `lib/detenidos-compartido.ts`.
6. [etapa-5.md](etapa-5.md) — Romper la FK circular IPH↔Fichas de Inteligencia + fix del join por folio en `lib/monitorista/repository.ts`.
7. [etapa-6.md](etapa-6.md) — D1: índices + conversión `oficial_id` a `uuid` con FK real a `ofi_oficiales` (corregido: **no** es `users`, ver `00-contexto.md`) + limpieza de 2 FKs duplicadas sobre `incidente_id`.
8. [etapa-7.md](etapa-7.md) — Eliminar el patrón `COALESCE(rd.incidente_id, rc.incidente_id)` en `lib/fiscalia/repository.ts`.
9. [etapa-8.md](etapa-8.md) — FK faltante en `evidencias_detenido` + índices horizontales de rendimiento.
10. [etapa-9.md](etapa-9.md) — Bóveda: ADR de las decisiones, actualizar `Feature Reporte Campo.md`, checklist final de verificación.

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior "porque ya se está ahí". Cada etapa deja la app compilando y funcionando — es la superficie de revisión.
- No tocar archivos fuera de los listados explícitamente en cada etapa.
- Las etapas 3, 4, 5, 6 y 8 tocan la BD real (migraciones SQL). Antes de aplicar cualquier `ALTER`/`DROP`, correr las queries de verificación que indica cada etapa contra la BD real — los números de filas/valores citados en este plan son de cuando se diseñó (2026-08-05), pueden haber cambiado.
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo (y `npm run build` en las etapas que lo piden explícitamente), más los criterios de aceptación específicos de esa etapa, antes de reportar la etapa como lista. **Detenerse y esperar confirmación del usuario antes de pasar a la siguiente etapa.**
- Si algo en el código o la BD real no coincide con lo descrito aquí (nombres de columna, valores, líneas), priorizar la realidad verificable (grep, `information_schema`, `psql`/consulta directa) y ajustar la implementación al mismo patrón — no asumir que el plan es infalible, es una guía verificada al momento de escribirla, no un contrato absoluto.
- Migraciones SQL: un archivo por etapa en `lib/db/manual-migrations/`, idempotentes (`IF NOT EXISTS`/`IF EXISTS`), numeración sin colisiones (ver `etapa-1.md`).
- Solo `lib/**/repository.ts` toca SQL; si una etapa cambia el shape de una query, actualizar `mapper.ts`/`types.ts` del mismo módulo en la misma etapa.
- No cambiar contratos de `app/api/**` ni nombres de columnas que expone.

## Checklist general al terminar TODAS las etapas

Ver el checklist detallado en [etapa-9.md](etapa-9.md) — incluye verificación de que no queda ningún rastro de los 7 problemas originales (tabla muerta, doble fuente de detenidos, FK circular, join por folio, `oficial_id` sin FK correcta, FKs duplicadas, `COALESCE` redundante), más prueba manual end-to-end en navegador (la hace el usuario, no el agente).
