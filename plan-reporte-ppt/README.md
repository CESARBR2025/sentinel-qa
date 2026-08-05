# Plan: Fuente de verdad de "3 fotos completas" en Reporte de Detenidos → D1 + Fiscalía (no Monitorista)

Carpeta de trabajo para corregir por qué denuncias D1 con las 3 fotos ya subidas por Fiscalía no aparecen en `/reporte-detenidos`, y por qué el PPT generado tendría fotos mal etiquetadas incluso si aparecieran. Diseñado por Claude (arquitecto) tras diagnóstico contra la BD real. A construir por DeepSeek (worker).

## Orden de trabajo

Las etapas son **secuenciales**. No avanzar a la siguiente sin validar los "Criterios de aceptación" de la anterior. Cada `etapa-N.md` es autocontenida: se puede pegar tal cual como instrucción de trabajo sin necesitar leer las demás (aunque todas parten del mismo contexto en `00-contexto.md`).

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Diagnóstico completo con evidencia real de BD, causa raíz, decisión de negocio confirmada por el usuario, y qué queda fuera de alcance.
2. [etapa-1.md](etapa-1.md) — `lib/reporte-detenidos/types.ts` + `repository.ts`: mover el criterio de completitud de `solicitud_fotos` a `evidencias_detenido`, y la tabla base de `ofi_reportes_campo` a `ofi_reporte_denuncia` (D1).
3. [etapa-2.md](etapa-2.md) — `lib/reporte-detenidos/ppt-service.ts`: corregir el bug de fotos mal etiquetadas/mezcladas en el slide del PPT.
4. [etapa-3.md](etapa-3.md) — `app/reporte-detenidos/page.tsx`: mostrar el folio D1 (`folio_denuncia`, `iph`) en la tabla en vez del folio interno de reporte de campo.
5. [etapa-4.md](etapa-4.md) — Bóveda: actualizar `Reporte de Detenidos.md`, `Troubleshooting.md`, `Decisiones.md`.

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior "porque ya se está ahí". El propósito de segmentar es poder revisar y detener el trabajo en cualquier punto con una superficie de cambio pequeña y clara.
- No tocar archivos fuera de los listados explícitamente en cada etapa.
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo, y los criterios de aceptación específicos de esa etapa, antes de reportar la etapa como lista. **Detenerse y esperar confirmación del usuario antes de pasar a la siguiente etapa.**
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas, props), priorizar el código real y ajustar la implementación al mismo patrón — este plan describe el estado del código al momento de diseñarlo (2026-08-05), puede haber cambiado.
- Reutilizar patrones ya existentes en el proyecto (ver referencias de archivo en cada etapa) — no inventar convenciones nuevas de UI, permisos o capas de datos.
- No borrar `solicitud_fotos` de la BD ni de ningún otro módulo que la use (`lib/detenidos-compartido.ts`, bandejas de Fiscalía/Juzgado, edición de Monitorista) — solo deja de ser leída por `lib/reporte-detenidos/`.

## Fuera de alcance (no implementar salvo pedido explícito)

- Soporte real para múltiples detenidos en un mismo `ofi_reportes_campo` (hoy solo se muestra/procesa el primero — `detenido_index = 0`). Ver detalle y por qué en `00-contexto.md`.
- Cualquier cambio a `/monitorista/detenidos`, `lib/detenidos-compartido.ts`, o al flujo de solicitud de fotos a Fiscalía/Juzgado vía `solicitud_fotos` — siguen intactos, son módulos distintos que no dependen de este reporte.
- No se agrega ninguna validación/bloqueo nuevo en la captura de Fiscalía (`FotosExpedienteSection.tsx`) — este plan es de solo lectura/reporte, no toca cómo se capturan las fotos.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update` (regla del proyecto, ver `AGENTS.md` en la raíz del repo).
3. Bóveda actualizada (Etapa 4).
4. Prueba manual end-to-end en navegador (la hace el usuario, no el agente): la denuncia `SSPM/D1/20260805/AIO0V2` aparece en `/reporte-detenidos` con su folio D1 e IPH visibles, y el botón "Generar PPT" produce un slide con las 3 fotos correctamente etiquetadas (sin la foto de vehículo colada).
