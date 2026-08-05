# Plan: Ficha de Detenidos alineada al formato oficial UDAI

Carpeta de trabajo para cerrar la brecha entre el PPT que genera hoy el sistema y el formato oficial real usado por UDAI (`FORMATO FICHA DE DETENIDOS.pptx`), agregando los datos biográficos, de ubicación y de antecedentes que hoy faltan, y rediseñando el layout del PPT para que calque la estructura oficial. Diseñado por Claude (arquitecto) tras analizar el .pptx real y verificar el modelo de datos contra la BD de producción. A construir por DeepSeek (worker).

## Prerrequisito

Este plan depende de `plan-reporte-ppt/` (carpeta hermana) — aplica primero sus Etapas 1 y 2 (fuente de verdad de "3 fotos completas" y fix del bug de fotos mal etiquetadas) si no se han corrido ya. Sin eso, ningún detenido llega a aparecer en `/reporte-detenidos` y no hay nada sobre qué construir este plan.

## Orden de trabajo

Las etapas son **secuenciales**. No avanzar a la siguiente sin validar los "Criterios de aceptación" de la anterior. Cada `etapa-N.md` es autocontenida: se puede pegar tal cual como instrucción de trabajo sin necesitar leer las demás (aunque todas parten del mismo contexto en `00-contexto.md`).

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Análisis completo del formato oficial, gap contra el modelo de datos real, y todas las decisiones de negocio ya confirmadas por el usuario.
2. [etapa-1.md](etapa-1.md) — Migración: campos biográficos + CURP en `ofi_detalles_asegurados`.
3. [etapa-2.md](etapa-2.md) — Fiscalía captura esos campos (`FormularioAsegurado.tsx` + capa de datos).
4. [etapa-3.md](etapa-3.md) — Tabla y backend de antecedentes externos (captura manual).
5. [etapa-4.md](etapa-4.md) — UI de captura de antecedentes externos, dentro de Fiscalía.
6. [etapa-5.md](etapa-5.md) — Antecedentes automáticos: búsqueda local por CURP/nombre.
7. [etapa-6.md](etapa-6.md) — Ensamblar la ficha completa (`obtenerFichaCompleta`).
8. [etapa-7.md](etapa-7.md) — Rediseñar el PPT para calcar la Ficha UDAI real.
9. [etapa-8.md](etapa-8.md) — Bóveda: documentar el modelo completo y sus limitaciones.

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior "porque ya se está ahí".
- No tocar archivos fuera de los listados explícitamente en cada etapa.
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo, y los criterios de aceptación específicos de esa etapa, antes de reportar la etapa como lista. **Detenerse y esperar confirmación del usuario antes de pasar a la siguiente etapa.**
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas, props, tipo real de una columna), priorizar el código real y ajustar la implementación al mismo patrón — este plan describe el estado del código al momento de diseñarlo (2026-08-05).
- Reutilizar patrones ya existentes en el proyecto (ver referencias de archivo en cada etapa) — no inventar convenciones nuevas de UI, permisos o capas de datos.
- Las migraciones (`lib/db/manual-migrations/*.sql`) se aplican de verdad contra `DATABASE_URL` como parte de la etapa que las introduce, no se dejan solo como archivo sin ejecutar.

## Fuera de alcance (no implementar salvo pedido explícito)

- Soporte multi-detenido real por reporte — ver `00-contexto.md`. Este plan asume un solo detenido por `ofi_reportes_campo`.
- Integración con `via.v2_infracciones` (infracciones de tránsito) como fuente de antecedentes.
- Cualquier integración real con una plataforma estatal/nacional de antecedentes — la captura externa es 100% manual.
- Fuzzy matching de nombres para la búsqueda de antecedentes locales cuando no hay CURP — es coincidencia exacta (normalizada a minúsculas/trim), documentado como limitación conocida en la Etapa 8.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update`.
3. Bóveda actualizada (Etapa 8).
4. Prueba manual end-to-end en navegador (la hace el usuario, no el agente): Fiscalía captura los datos biográficos + un antecedente externo de un detenido de prueba, y el PPT generado desde `/reporte-detenidos` muestra la ficha completa con la misma estructura que `FORMATO FICHA DE DETENIDOS.pptx` (foto frontal, datos generales, evento delictivo con lugar de detención y zona de operación, antecedentes).
