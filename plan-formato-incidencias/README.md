# Plan: Formato Reportes de Incidencias (UDAI)

Carpeta de trabajo para construir la nueva vista `/formatos-udai` → card **"Formato Reportes de Incidencias"** → `/formatos-udai/reportes-incidencias`: una tabla segmentada en **Pendientes / Completas**, con un paso explícito de captura manual para lo que no tiene fuente automática, y exportación a `.xlsx` que replica **exactamente** el archivo oficial `FORMATO INCIDENCIA.xlsx` (2 hojas, 38 y 52 columnas) — **solo con los registros marcados como "Completa"**. Diseñado por Claude (arquitecto), verificado varias veces contra la BD real de producción por conexión directa (`pg` + `DATABASE_URL`). A construir por DeepSeek (worker).

Reutiliza el módulo `lib/formatos-udai/` que ya existe (de `plan-formato-faltasadministrativas/`, ya implementado) — pero **este plan NO usa `iph_detenidos`**, a diferencia del hermano. Es la diferencia más importante a tener presente.

## Cómo llegó a esta forma (importante para entender las etapas)

Este plan pasó por 3 revisiones antes de esta versión final:

1. **Rev. 1**: ancló el reporte en `iph_detenidos` (igual que Faltas Administrativas), con varias columnas marcadas como "sin fuente".
2. **Rev. 2**: el usuario señaló que varias de esas columnas sí tenían dato, solo faltaba el JOIN correcto a `incidentes`.
3. **Rev. 3 (esta)**: el usuario aclaró que la **única** ruta legítima para que un caso entre a este reporte es el flujo real 911 → reporte de campo del oficial → reporte de denuncia — y que `iph_detenidos`/Análisis debía **salir por completo** de la cadena. Se investigó de nuevo y se confirmó: los 10 registros de `iph_detenidos` (y los 7 incidentes reales que existen hoy) están completamente desconectados entre sí. El dato de detenido/vehículo para los casos reales con detención vive en el JSON que el propio oficial captura en su reporte de campo (`ofi_reportes_campo.ofi_detenidos`/`ofi_vehiculos`), no en Análisis.

El resultado: el reporte ahora se ancla en `incidentes`, filtrado a los que ya tienen solución (`estatus IN ('atendido','cerrado_detencion')`), y solo lo que de verdad no tiene ninguna fuente en `incidentes`/`ofi_reportes_campo`/`ofi_reporte_denuncia`/`ofi_detalles_asegurados` pasa por el "paso extra" de captura manual. Ver `00-contexto.md` completo para el mapeo columna por columna.

## Orden de trabajo

1. [00-contexto.md](00-contexto.md) — leer primero, siempre.
2. [etapa-1.md](etapa-1.md) — Migración: tabla `formato_incidencia_complemento`, llave `incidente_id`.
3. [etapa-2.md](etapa-2.md) — Capa de datos: `ReporteIncidenciaCompleto` anclado en `incidentes`, consulta con toda la cadena JOIN, y `guardarComplementoIncidencia()`.
4. [etapa-3.md](etapa-3.md) — Navegación: card en el hub `/formatos-udai`.
5. [etapa-4.md](etapa-4.md) — Vista de tabla, tabs Pendientes/Completas, modal "Completar datos".
6. [etapa-5.md](etapa-5.md) — Exportación `.xlsx`, solo "Completa".
7. [etapa-6.md](etapa-6.md) — Bóveda + verificación final.

## Decisiones ya tomadas por el usuario (no volver a preguntar)

1. Ancla del reporte: `incidentes`, no `iph_detenidos`. La cadena de verdad es 911 → reporte de campo → reporte de denuncia.
2. Universo: solo `incidentes.estatus IN ('atendido', 'cerrado_detencion')` — los incidentes en curso quedan **totalmente fuera** del reporte, ni como "Pendientes" ni como "Completas".
3. `MASC`/`UMECAS` → texto libre, no catálogo.
4. `FUERO` se deriva automáticamente de `ofi_reporte_denuncia.grupo_adscripcion` (contiene "FEDERAL" → `FEDERAL`, si no → `COMÚN`), con posibilidad de corregirlo a mano si el mapeo falla en un caso puntual.
5. Llave de la tabla de complemento manual: `incidente_id` (no `iph_detenido_id`) — porque no todo incidente tiene detenido.
6. Un registro es "Completa" únicamente cuando alguien lo revisó y lo guardó marcándolo así (`completado_en`) — no se exige que cada columna tenga valor.
7. La tabla se segmenta por completitud (Pendientes/Completas), no por hoja del Excel.
8. Exportar XLSX solo incluye registros "Completa".

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior.
- No tocar nada de Faltas Administrativas, salvo el único cambio de la Etapa 4 (generalizar `BotonExportarExcel` con props `href`/`nombreArchivo`, con defaults que no rompen el caller existente).
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo y los criterios de aceptación específicos, antes de reportarla como lista. **Detenerse y esperar confirmación del usuario antes de seguir.**
- Si el código o la BD real no coinciden con lo descrito aquí, priorizar lo real, ajustar manteniendo el mismo patrón, y avisarlo explícitamente.
- Antes de tocar cualquier UI, leer `DESIGN.md` completo.
- Los encabezados del Excel exportado se copian carácter por carácter del archivo oficial — no corregirlos.
- La migración de la Etapa 1 sigue la convención de `lib/db/manual-migrations/README.md`.
- El JSON de `ofi_reportes_campo.ofi_detenidos`/`ofi_vehiculos` no tiene esquema fijo — leer con variantes de llave (`v.placas ?? v.placa`), nunca asumir que todas las llaves están presentes.

## Fuera de alcance (no implementar salvo pedido explícito)

- Tocar `formAnalisis.tsx` / `useAnalistaForm.ts` / el módulo de Análisis — quedó fuera de la cadena de este reporte.
- Estandarizar las llaves del JSON de `ofi_detenidos`/`ofi_vehiculos` en origen.
- Convertir `MASC`/`UMECAS` a catálogo con FK.
- Tocar `/formatos-udai/faltas-administrativas`, `/reporte-detenidos` o `/analisis/iph`.
- Soportar más de 1 reporte de campo o más de 1 detenido por incidente.
- Una acción para "desmarcar" un registro completo — no se pidió.

## Checklist general al terminar TODAS las etapas

Ver la sección final de `00-contexto.md` y los criterios de aceptación de `etapa-6.md`.

---

## Prompt para DeepSeek

Ver [PROMPT-DEEPSEEK.md](PROMPT-DEEPSEEK.md) — pégalo tal cual como primer mensaje.
