# Contexto — Alinear la Ficha de Detenidos al formato oficial UDAI

Diseñado por Claude (arquitecto) tras analizar el archivo real `FORMATO FICHA DE DETENIDOS.pptx` (UDAI) y compararlo campo por campo contra el modelo de datos vigente. A construir por DeepSeek (worker).

## Prerrequisito — leer y aplicar primero

Este plan asume que **`plan-reporte-ppt/`** (carpeta hermana, ya diseñada) está aplicada: mueve el criterio de "3 fotos completas" de `solicitud_fotos` (flujo Monitorista descartado) a `evidencias_detenido` (flujo real de Fiscalía), y corrige el bug de fotos mal etiquetadas en el PPT. Sin eso, ningún detenido aparece en `/reporte-detenidos` y este plan no tiene sobre qué construir. Si `plan-reporte-ppt/` no se ha ejecutado, ejecútalo primero (sus propias etapas 1 y 2 son suficientes como base; sus etapas 3-4 de la tabla simple quedan **reemplazadas** por este plan, ver Etapa 6-7 más abajo).

## El formato oficial (evidencia real, extraída del .pptx)

Se analizó `~/Downloads/Sistema SSPM/Formatos UDAI Sistema/Formatos UDAI/FORMATO FICHA DE DETENIDOS.pptx` (1 slide, tabla de 14 filas + 4 imágenes). Estructura completa:

**Encabezado**: logo + nombre completo + apodo + folio de ficha + rubro del caso + 1 foto frontal del detenido (no 3 ángulos) + foto(s) de objetos asegurados.

**DATOS GENERALES DETENIDO**: fecha nacimiento (+edad), género, originario (estado), estado civil, escolaridad, ocupación, domicilio, rasgos particulares.

**EVENTO DELICTIVO**: fecha/hora, RND (folio radio/CAD), expediente (carpeta investigación), lugar del evento, **lugar de la detención** (distinto del lugar del evento), IPH, nexos delictivos, zona de operación, puesta a disposición, modus operandi, información adicional.

**ANTECEDENTES**: dos columnas — delitos previos de la persona (fecha + delito + lugar) y faltas administrativas previas (fecha + falta + lugar), incluyendo entradas de otros estados.

## Gap encontrado vs. el modelo de datos real (verificado contra BD, no solo código)

| Campo del formato | Estado | Fuente |
|---|---|---|
| Nombre, domicilio | ✅ ya existe | `ofi_detalles_asegurados` |
| Foto frontal, foto de objetos | ✅ ya existe (de sobra) | `evidencias_detenido` |
| Fecha/hora, RND, expediente, IPH | ✅ ya existe | `ofi_reportes_campo` / `ofi_reporte_denuncia` |
| Puesta a disposición | ✅ ya existe | `ofi_puesta_disposicion` |
| Modus operandi | ✅ ya existe (parcial) | `ofi_reportes_campo.modus_operandi` |
| **Lugar de la detención** | ✅ **ya existe, solo falta exponerlo aquí** | `ofi_reportes_campo.ofi_calle/ofi_colonia` — confirmado en `lib/fiscalia/repository.ts:347` (`obtenerDetalleAseguradoCompleto`, alias `lugar_calle`/`lugar_colonia`), ya usado y etiquetado "Lugar de la Detención" en el formulario de Fiscalía. Es el lugar donde el oficial cerró el recorrido (`FormularioRecorrido.tsx`, paso "Ubicación"), distinto de `lugar_hecho` (dónde ocurrió el delito). **No se crea nada nuevo, solo se reutiliza.** |
| **Zona de operación** | ✅ **ya existe, solo falta exponerlo** | `ofi_reporte_denuncia.sector` — ya se prellena en `app/denuncia/nuevo/page.tsx` con `obtenerSectorOficialSvc(oficialId)` (`lib/oficial/repository.ts::obtenerSectorOficial`, que resuelve `ofi_oficiales.departamento_id → via.v2_departamentos.nombre`, es decir Poniente/Oriente/Centro). El oficial puede editarlo manualmente en `FormularioD1.tsx` (`SentinelField name="sector"`) si el arresto ocurrió fuera de su zona habitual. **No se crea nada nuevo.** |
| Apodo, fecha nacimiento, género, originario, estado civil, escolaridad, ocupación, rasgos particulares | ❌ no existe | Nuevo — decisión del usuario: los captura **Fiscalía** |
| Nexos delictivos | ❌ no existe | Decisión del usuario: **se deja en blanco**, sin captura por ahora (el layout del PPT lo muestra siempre vacío, igual que en el ejemplo real) |
| Antecedentes (delitos/faltas previos, locales) | ❌ no existe | Nuevo — se calculan por búsqueda de identidad (ver abajo) |
| Antecedentes (otro estado / fuente externa) | ❌ no existe | Nuevo — captura manual en Fiscalía (ver abajo) |

## Decisiones de negocio (confirmadas por el usuario en esta conversación)

1. Los campos biográficos faltantes (apodo, fecha nacimiento, género, originario, estado civil, escolaridad, ocupación, rasgos particulares) se agregan a `ofi_detalles_asegurados` y se capturan en el mismo formulario donde Fiscalía ya captura domicilio: `FormularioAsegurado.tsx`.
2. "Lugar de la detención" **no es un campo nuevo** — se extrae de `ofi_reportes_campo` (ya lo hace Fiscalía, ver tabla arriba). Este plan solo lo expone en el nuevo reporte/ficha.
3. "Zona de operación" **no es un campo nuevo** — se deriva de `ofi_reporte_denuncia.sector` (ya prellenado desde el sector del oficial). "Nexos delictivos" queda en blanco, sin columna nueva.
4. Antecedentes:
   - **Automáticos (locales)**: se agrega `curp` a `ofi_detalles_asegurados` (captura en Fiscalía, mismo formulario). La búsqueda de historial usa CURP cuando existe; como la CURP es un campo nuevo, los detenidos históricos no la tendrán — la búsqueda cae a coincidencia por nombre completo (`nombre + ap_paterno + ap_materno`, normalizado) como respaldo mientras se adopta CURP hacia adelante. Se busca en `ofi_reporte_denuncia` + `ofi_reportes_campo` (delitos y faltas administrativas ya capturados en el sistema), excluyendo el reporte actual.
   - **Manuales (fuente externa / otro estado)**: Fiscalía ya usa una plataforma externa (estatal/nacional) para consultar antecedentes de otras entidades — el sistema no tiene acceso a esa fuente. Se agrega una tabla nueva (`antecedentes_externos_detenido`) y una vista de captura **dentro de Fiscalía** (confirmado con el usuario vía pregunta directa: el botón/vista vive en el expediente de Fiscalía, no en la tabla de solo lectura `/reporte-detenidos`, para no romper la regla de negocio ya documentada de que ese reporte es 100% de lectura).

## Limitación explícita a documentar (no a resolver en este plan)

Los antecedentes "locales" solo cubren delitos/faltas ya capturados **en esta misma base de datos** (San Juan del Río). No hay integración con Plataforma México / RNPP ni con otros estados — de ahí la necesidad de la captura manual. Esto debe quedar explícito en la ficha/PPT (ej. nota al pie "Antecedentes locales + registro manual" para que nadie asuma que es un historial nacional verificado).

## Fuera de alcance (no implementar salvo pedido explícito)

- Soporte multi-detenido real por reporte (ver limitación ya documentada en `plan-reporte-ppt/00-contexto.md`). Este plan asume **un solo detenido por `ofi_reportes_campo`** (el primero de `ofi_detalles_asegurados`, `ORDER BY created_at LIMIT 1`), igual que el resto del módulo.
- Cruce automático contra `via.v2_infracciones` (infracciones de tránsito) para antecedentes — el ejemplo del formato muestra faltas administrativas tipo "alterar el orden público", que en este sistema se capturan como `ofi_reportes_campo.falta_administrativa`, no como infracción de tránsito. Si el usuario quiere incluir infracciones de tránsito como antecedente, es una ampliación posterior.
- Ninguna integración con una plataforma estatal/nacional real — la captura de antecedentes externos es 100% manual (texto), no hay scraping ni API.

## Componentes involucrados (mapa completo)

| Archivo | Cambia |
|---|---|
| `lib/db/manual-migrations/0037_*.sql` | Nuevo (Etapa 1) |
| `lib/db/manual-migrations/0038_*.sql` | Nuevo (Etapa 3) |
| `lib/fiscalia/types.ts` | Sí (Etapas 2, 4) |
| `lib/fiscalia/mapper.ts` | Sí (Etapa 2) |
| `lib/fiscalia/repository.ts` | Sí (Etapas 2, 3) |
| `lib/fiscalia/service.ts` | Sí (Etapas 2, 3) |
| `lib/fiscalia/actions.ts` | Sí (Etapas 2, 3) |
| `components/fiscalia/FormularioAsegurado.tsx` | Sí (Etapa 2) |
| `components/fiscalia/AntecedentesExternos.tsx` | Nuevo (Etapa 4) |
| `components/fiscalia/DetallesAseguradoView.tsx` | Sí (Etapa 4, modo lectura) |
| `lib/reporte-detenidos/types.ts` | Sí (Etapas 5, 6) |
| `lib/reporte-detenidos/repository.ts` | Sí (Etapas 5, 6) |
| `lib/reporte-detenidos/ppt-service.ts` | Reescrito (Etapa 7) |
| `boveda/🧩 Features/Reporte de Detenidos.md`, `Decisiones.md` | Sí (Etapa 8) |
