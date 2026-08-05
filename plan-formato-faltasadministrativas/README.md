# Plan: Formato Faltas Administrativas (UDAI)

Carpeta de trabajo para construir la nueva vista `/agente_reportes` → "Formatos UDAI" → "Formato Faltas Administrativas": una tabla de solo lectura + exportación a `.xlsx` que replica **exactamente** el archivo oficial `FORMATO FALTAS ADMINISTRATIVAS.xlsx` (34 columnas, UDAI), alimentada con datos que **ya existen** en la tabla `iph_detenidos`. Diseñado por Claude (arquitecto) tras analizar el `.xlsx` oficial y verificar el modelo de datos contra la BD real de producción. A construir por DeepSeek (worker).

## Hallazgo que cambia el alcance

No hay que capturar nada nuevo. La tabla `iph_detenidos` (alimentada hoy por el formulario de Análisis, `components/analisis/formAnalisis.tsx`) ya tiene el 91% de las 34 columnas del formato oficial. Solo faltan 3 columnas sin ninguna fuente hoy (`HORA DE SALIDA`, `FOLIO TABLET`, segundo `OFICIAL QUE REMITE`) — se dejan vacías, documentadas como limitación conocida, no bloquean el reporte. Ver el detalle completo en `00-contexto.md`.

## Orden de trabajo

Las etapas son **secuenciales**. No avanzar a la siguiente sin validar los "Criterios de aceptación" de la anterior. Cada `etapa-N.md` es autocontenida (aunque todas parten del mismo contexto en `00-contexto.md`).

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Mapa completo de las 34 columnas contra la BD real, decisiones de diseño con default aplicado, y qué queda fuera de alcance.
2. [etapa-1.md](etapa-1.md) — Capa de datos: `lib/formatos-udai/{types,repository}.ts` (JOIN `iph_detenidos` + `ofi_reporte_denuncia` + `ofi_reportes_campo` + `ofi_detalles_asegurados`).
3. [etapa-2.md](etapa-2.md) — Permisos: sección `formatos_udai` (mismo patrón que `reporte_detenidos`).
4. [etapa-3.md](etapa-3.md) — Navegación: card "Formatos UDAI" en `/agente_reportes` + hub `/formatos-udai` con la card "Formato Faltas Administrativas".
5. [etapa-4.md](etapa-4.md) — Vista de tabla `/formatos-udai/faltas-administrativas` (34 columnas, solo lectura).
6. [etapa-5.md](etapa-5.md) — Exportación `.xlsx` idéntica al oficial (`GET /api/formatos-udai/faltas-administrativas/exportar`).
7. [etapa-6.md](etapa-6.md) — Bóveda (`🧩 Features/Formatos UDAI.md`) + verificación final (typecheck, build, graphify).

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior "porque ya se está ahí".
- No tocar archivos fuera de los listados explícitamente en cada etapa.
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo, y los criterios de aceptación específicos de esa etapa, antes de reportar la etapa como lista. **Detenerse y esperar confirmación del usuario antes de pasar a la siguiente etapa.**
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas, props, tipo real de una columna), priorizar el código real y ajustar la implementación al mismo patrón — este plan describe el estado del código al momento de diseñarlo (2026-08-05).
- Reutilizar patrones ya existentes en el proyecto (`OptionSquare`, `PageHeader`, el patrón de `BotonGenerarPpt.tsx`, el JOIN de `obtenerPrellenadoCompleto()`) — no inventar convenciones nuevas de UI, permisos o capas de datos.
- Antes de tocar cualquier UI, leer `DESIGN.md` completo (regla del proyecto).

## Fuera de alcance (no implementar salvo pedido explícito)

- Convertir `articulo`, `tipo_falta`, `agrupamiento_arresto`, `sector_arresto` en catálogos FK — hoy son texto libre capturado por un formulario que este plan no toca.
- Capturar `HORA DE SALIDA` real vía `incidente_despacho_unidades` — queda como mejora futura opcional.
- Agregar columnas nuevas a `iph_detenidos` para `FOLIO TABLET` o un segundo oficial — no hay fuente hoy, y agregar captura nueva es un cambio de esquema fuera de "generar el reporte con lo que ya tenemos".
- Tocar `formAnalisis.tsx`, `useAnalistaForm.ts`, `/reporte-detenidos` o `/analisis/iph`.

## Checklist general al terminar TODAS las etapas

Ver la sección final de `00-contexto.md` y los criterios de aceptación de `etapa-6.md`.

---

## Prompt para DeepSeek

Ver [PROMPT-DEEPSEEK.md](PROMPT-DEEPSEEK.md) — pégalo tal cual como primer mensaje.
