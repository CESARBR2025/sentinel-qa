# Contexto — Formato Reportes de Incidencias (UDAI)

Análisis hecho por Claude (arquitecto) el 2026-08-05, contra el archivo oficial `FORMATO INCIDENCIA.xlsx` (Downloads/Sistema SSPM/Formatos UDAI Sistema/Formatos UDAI) y contra la **BD real de producción, consultada en vivo por conexión directa** (`DATABASE_URL` de `.env`, Postgres), no solo contra `boveda/📦 Datos/Esquema BD.md`. A construir por DeepSeek (worker).

## Qué es el archivo fuente

`FORMATO INCIDENCIA.xlsx` tiene **2 hojas**, ambas plantillas vacías (solo fila de encabezados, sin filas de ejemplo):

1. **`INCIDENCIA`** — 38 columnas (A:AL). Bitácora general de incidentes/eventos.
2. **`PUESTAS A DISPOSICION`** — 52 columnas (A:AZ). Bitácora de detenidos puestos a disposición (superset de `INCIDENCIA` + datos del detenido + tramo administrativo de entrega).

**Decisión de alcance:** ambas hojas se construyen en la misma card/vista (`/formatos-udai/reportes-incidencias`), como dos segmentos (tabs) de una sola pantalla, y el botón "Exportar XLSX" genera **un solo archivo con las 2 hojas**, replicando la estructura exacta del original (mismos nombres de hoja, mismo orden de columnas). Esto porque el usuario pidió "generar el archivo tal cual te lo estoy pasando" y el archivo tal cual trae 2 hojas — no 1. Si se prefiere una sola hoja por ahora, avisar antes de la Etapa 3.

## Hallazgo clave: la tabla `iph_detenidos` ya fue diseñada para este formato

Igual que con `FORMATO FALTAS ADMINISTRATIVAS.xlsx` (ver `plan-formato-faltasadministrativas/00-contexto.md`), la tabla `iph_detenidos` (73 columnas) tiene columnas dedicadas y nombradas casi 1:1 con este Excel: `folio_911`, `dia_evento`, `hora_inicio_evento`, `hora_final_evento`, `hora_promedio`, `modus_operandi`, `calle_hecho`/`numero_hecho`/`colonia_hecho`/`sector_hecho`, `nombre_afectado`/`telefono_afectado`/`calle_afectado`/etc., `marca_vehiculo`...`modelo_vehiculo`, `ap_nuc`. Esto confirma que el esquema ya se diseñó pensando en `FORMATO INCIDENCIA.xlsx`, pero **el formulario de captura (`formAnalisis.tsx`) nunca llegó a llenar 8 de esas columnas** (ver hallazgo de "columnas fantasma" abajo). No es un problema de esquema, es un problema de UI de captura — y está fuera de alcance de este plan tocarlo.

## Hallazgo importante: "columnas fantasma" (existen en BD, siempre NULL hoy)

Verificado contra los 10 registros reales de `iph_detenidos` en producción:

| Columna BD | Valor NULL en | Motivo verificado |
|---|---|---|
| `folio_911` | 10/10 | Sin campo en `formAnalisis.tsx` que la escriba |
| `dia_evento` | 10/10 | Ídem |
| `hora_inicio_evento` | 10/10 | Ídem |
| `hora_final_evento` | 10/10 | Ídem |
| `hora_promedio` | 10/10 | Ídem (no se calcula ni se captura) |
| `modus_operandi` | 10/10 | Ídem |
| `telefono_afectado` | 10/10 | Ídem |
| `ap_nuc` | 10/10 | Ídem |

`registrarIphDetenido()` (`lib/monitorista/repository.ts:533-558`) sí incluye estas 8 columnas en el `INSERT`, pero quien la llama (el flujo de Análisis) nunca les pasa un valor — confirmado con `grep` en `app/` y `lib/monitorista/`: ningún archivo fuera de `repository.ts` menciona estos 8 nombres. Esto es distinto de un "GAP" real (columna inexistente): aquí la tubería de datos ya existe, solo falta que la UI de captura la use. **Fuera de alcance de este plan** (no se toca `formAnalisis.tsx`/`useAnalistaForm.ts`), pero se documenta explícitamente porque es la causa de que 8 columnas del Excel salgan vacías en el reporte a pesar de "tener el dato en la BD".

## Mapa completo — Hoja `INCIDENCIA` (38 columnas)

Todas tienen columna real en `iph_detenidos` (0 GAPs de esquema; 8 son "columna fantasma", ver arriba — se muestran igual, quedarán vacías hasta que se capturen).

| # | Columna Excel | Fuente | Estado |
|---|---|---|---|
| 1 | IPH | `COALESCE(rd.iph, iph.folio_iph)` | OK |
| 2 | FOLIO 911 | `iph.folio_911` | 👻 fantasma |
| 3 | FECHA EVENTO | `iph.fecha_evento` | OK |
| 4 | FECHA REPORTE2 | `iph.fecha_reporte` | OK (mismo campo que "FECHA" en Faltas Adm.; el "2" es artefacto del template oficial) |
| 5 | DIA EVENTO | `iph.dia_evento` | 👻 fantasma |
| 6 | HORA REPORTE | `iph.hora_reporte` | OK |
| 7 | HORA INICIO EVENTO | `iph.hora_inicio_evento` | 👻 fantasma |
| 8 | HORA FINAL EVENTO | `iph.hora_final_evento` | 👻 fantasma |
| 9 | HORA PROMEDIO | `iph.hora_promedio` | 👻 fantasma |
| 10 | DELITO | `iph.delito` | OK |
| 11 | ARTICULOS U OBJETOS | `iph.articulos_objetos` | OK |
| 12 | MODUS | `iph.modus_operandi` | 👻 fantasma |
| 13 | CALLE | `iph.calle_hecho` | OK |
| 14 | NUMERO O REFERENCIA | `iph.numero_hecho` | OK |
| 15 | COLONIA | `iph.colonia_hecho` | OK |
| 16 | SECTOR | `COALESCE(iph.sector_hecho, iph.sector_arresto)` | OK (fallback — hoy solo `sector_arresto` se captura, `sector_hecho` está en 0/10) |
| 17 | RT | `iph.rt_responsable` | OK |
| 18 | TURNO | `iph.turno_responsable` | OK |
| 19 | CRP | `iph.crp_unidad` | OK |
| 20 | AFECTADO | `iph.nombre_afectado` | OK |
| 21 | CALLE AFEC | `iph.calle_afectado` | OK |
| 22 | NUMERO AFEC | `iph.numero_afectado` | OK |
| 23 | COLONIA AFEC | `iph.colonia_afectado` | OK |
| 24 | TELEFONO AFEC | `iph.telefono_afectado` | 👻 fantasma |
| 25 | MARCA | `iph.marca_vehiculo` | OK |
| 26 | SUBMARCA | `iph.submarca_vehiculo` | OK |
| 27 | TIPO | `iph.tipo_vehiculo` | OK |
| 28 | COLOR | `iph.color_vehiculo` | OK |
| 29 | PLACAS | `iph.placas_vehiculo` | OK |
| 30 | ESTADO | `iph.estado_vehiculo` | OK |
| 31 | NIV | `iph.niv_vehiculo` | OK |
| 32 | MOTOR | `iph.motor_vehiculo` | OK |
| 33 | MODELO | `iph.modelo_vehiculo` | OK |
| 34 | AP/NUC | `iph.ap_nuc` | 👻 fantasma |
| 35 | FUERO | `iph.fuero` | OK |
| 36 | LATITUD | `COALESCE(iph.latitud_hecho, iph.latitud_arresto)` | OK (fallback — hoy solo `latitud_arresto` se captura) |
| 37 | LONGITUD | `COALESCE(iph.longitud_hecho, iph.longitud_arresto)` | OK (mismo fallback) |
| 38 | AGENTE_APREHENSOR | `iph.agente_aprehensor` | OK |

No requiere JOIN a otras tablas — mismo patrón simple que la fila base de `iph_detenidos`, con fallback opcional a `ofi_reporte_denuncia` (`rd`) solo para IPH, igual que en Faltas Administrativas.

## Mapa completo — Hoja `PUESTAS A DISPOSICION` (52 columnas)

Superset de la anterior + datos del detenido (requiere el mismo JOIN que ya usa `formatos-udai/faltas-administrativas` hacia `ofi_detalles_asegurados`) + 2 columnas nuevas que requieren un JOIN adicional a `incidentes` (vía `ofi_reportes_campo.incidente_id`) que **no existe todavía** en el repository de `formatos-udai`.

| # | Columna Excel | Fuente | Estado |
|---|---|---|---|
| 1 | IPH | `COALESCE(rd.iph, iph.folio_iph)` | OK |
| 2 | FOLIO 911 | `iph.folio_911` | 👻 fantasma |
| 3 | FECHA EVENTO | `iph.fecha_evento` | OK |
| 4 | DIA EVENTO | `iph.dia_evento` | 👻 fantasma |
| 5 | HORA EVENTO | — | ❌ GAP — no hay columna única "hora del evento" (existen 3 candidatas: inicio/final/promedio, todas fantasma hoy). Se deja vacío. |
| 6 | DELITO | `iph.delito` | OK |
| 7 | ARTICULOS U OBJETOS | `iph.articulos_objetos` | OK |
| 8 | MODUS | `iph.modus_operandi` | 👻 fantasma |
| 9 | CALLE | `iph.calle_hecho` | OK |
| 10 | NUMERO O REFERENCIA | `iph.numero_hecho` | OK |
| 11 | COLONIA | `iph.colonia_hecho` | OK |
| 12 | SECTOR | `COALESCE(iph.sector_hecho, iph.sector_arresto)` | OK |
| 13 | RT | `iph.rt_responsable` | OK |
| 14 | TURNO | `iph.turno_responsable` | OK |
| 15 | CRP | `iph.crp_unidad` | OK |
| 16 | AGRUPAMIENTO | `iph.agrupamiento_arresto` | OK |
| 17 | AFECTADO | `iph.nombre_afectado` | OK |
| 18 | CALLE AFEC | `iph.calle_afectado` | OK |
| 19 | NUMERO AFEC | `iph.numero_afectado` | OK |
| 20 | COLONIA AFEC | `iph.colonia_afectado` | OK |
| 21 | MARCA | `iph.marca_vehiculo` | OK |
| 22 | SUBMARCA | `iph.submarca_vehiculo` | OK |
| 23 | TIPO | `iph.tipo_vehiculo` | OK |
| 24 | COLOR | `iph.color_vehiculo` | OK |
| 25 | PLACAS | `iph.placas_vehiculo` | OK |
| 26 | ESTADO | `iph.estado_vehiculo` | OK |
| 27 | NIV | `iph.niv_vehiculo` | OK |
| 28 | MOTOR | `iph.motor_vehiculo` | OK |
| 29 | MODELO | `iph.modelo_vehiculo` | OK |
| 30 | DETENIDO | `CONCAT_WS(' ', da.nombre_detenido, da.ap_paterno_detenido, da.ap_materno_detenido)` | OK — requiere `JOIN ofi_detalles_asegurados da` |
| 31 | ALIAS | `iph.alias` | OK |
| 32 | FECHA DE NAC | `iph.fecha_nacimiento` | OK |
| 33 | EDAD | `iph.edad` | OK |
| 34 | SEXO | `iph.genero` | OK |
| 35 | CALLE DET | `iph.calle_detenido` | OK |
| 36 | NUMERO DET | `iph.numero_detenido` | OK |
| 37 | COLONIA DET | `iph.colonia_detenido` | OK |
| 38 | LATITUD | `iph.latitud_arresto` | OK |
| 39 | LONGITUD | `iph.longitud_arresto` | OK |
| 40 | MUNICIPIO | `inc.municipio` | ⚠️ OK estructuralmente (requiere `JOIN incidentes inc ON inc.id = rc.incidente_id`), pero en los datos actuales `ofi_reportes_campo.incidente_id` no está enlazado en ninguno de los 10 IPH existentes → sale vacío hoy, no es un problema de la query |
| 41 | ORIGINARIO | `da.originario` | ⚠️ OK (columna real en `ofi_detalles_asegurados`), pero solo 2/14 registros de `ofi_detalles_asegurados` la tienen capturada hoy — dato escaso, no ausente |
| 42 | NUC / CU | `da.curp` (propuesta) | ❓ Ambiguo — confirmar. Candidatos: `da.curp` (existe, 2/14 poblado) o `iph.ap_nuc` (ya usado para la columna "AP/NUC" de la hoja `INCIDENCIA`, y está fantasma/siempre NULL). Se recomienda `da.curp` por ser el campo semánticamente más cercano a un identificador único de persona ("NUC" = Número Único de Causa/Carpeta también es plausible, no hay columna para eso). Ver decisión abajo. |
| 43 | FUERO | `iph.fuero` | OK |
| 44 | FOLIO RND | `iph.rnd` | OK (8/10 poblado) |
| 45 | LATITUD2 | `iph.latitud_hecho` (propuesta) | ❓ Best-fit — segunda coordenada = la del hecho (vs. arresto en col. 38). Hoy `latitud_hecho` está en 0/10 (fantasma), sale vacío igual, pero la query es correcta a futuro |
| 46 | LONGITUD3 | `iph.longitud_hecho` (propuesta) | ❓ Best-fit — mismo caso que `LATITUD2` |
| 47 | AGENTE_APREHENSOR | `iph.agente_aprehensor` | OK |
| 48 | FECHA DE INGRESO | — | ❌ GAP — no hay columna "fecha" de ingreso a la sede. Existe `ofi_puesta_disposicion.hora_puesta_disposicion` (solo hora, no fecha) pero la tabla tiene 1 sola fila en toda la BD (19 `ofi_reportes_campo`, 1 `ofi_puesta_disposicion`) — insuficiente para ser fuente confiable hoy. Se deja vacío. |
| 49 | FECHA DE SALIDA | — | ❌ GAP — mismo caso que arriba |
| 50 | OTRO DELITO | — | ❌ GAP — no existe ninguna columna equivalente en ningún módulo revisado |
| 51 | MASC | — | ❌ GAP — sin columna. Significado no confirmado (posible referencia a "Mecanismos Alternativos de Solución de Controversias"); no se adivina |
| 52 | UMECAS | — | ❌ GAP — sin columna. Significado no confirmado (posible "Unidad de Medidas Cautelares y Suspensión Condicional del Proceso"); no se adivina |

### Resumen de la hoja `PUESTAS A DISPOSICION`

- **41/52 columnas (79%)** con fuente real confirmada (aunque 6 de esas están "fantasma", sin dato capturado hoy).
- **4 columnas (8%)** con mapeo *best-fit* que hay que confirmar antes de construir (`HORA EVENTO`* con nota de ambigüedad real, `NUC/CU`, `LATITUD2`, `LONGITUD3`) — *`HORA EVENTO` en realidad es GAP puro, no best-fit, se lista arriba como tal.
- **5 columnas (~10%)** son GAP real, sin ninguna fuente hoy: `FECHA DE INGRESO`, `FECHA DE SALIDA`, `OTRO DELITO`, `MASC`, `UMECAS`.

## Decisiones que requieren confirmación antes de Etapa 1

1. **¿Confirmar `NUC / CU` → `da.curp`?** Si no, decir cuál es la fuente correcta o dejarlo como GAP.
2. **¿Confirmar `LATITUD2`/`LONGITUD3` → `latitud_hecho`/`longitud_hecho`?** (coherente con el patrón fallback de la hoja `INCIDENCIA`, pero es una decisión de diseño, no un hecho verificado).
3. **¿1 archivo con 2 hojas, o 2 exportaciones separadas?** Default de este plan: 1 archivo, 2 hojas (ver "Decisión de alcance" arriba).
4. **`MASC` y `UMECAS`**: si el usuario sabe qué son (probablemente checkboxes de a qué autoridad se turnó al detenido), decirlo — hoy quedan como columna vacía sin captura posible.

Si no hay respuesta, DeepSeek debe seguir los defaults marcados arriba y continuar — no bloquear la construcción por estas 4 preguntas, solo dejarlas anotadas en el código (comentario corto) donde aplique.

## Nomenclatura elegida (consistente con `plan-formato-faltasadministrativas`)

- Reusa el módulo de datos existente: `lib/formatos-udai/` (agrega funciones y tipos, no crea módulo nuevo)
- Reusa la sección de permisos existente: `formatos_udai` (no se crea ninguna nueva — mismos roles que ya ven `/formatos-udai`)
- Ruta hub: `/formatos-udai` (ya existe, solo se agrega una card)
- Ruta tabla nueva: `/formatos-udai/reportes-incidencias` (un solo `page.tsx`, 2 segmentos vía `?tab=incidencia|puestas-disposicion`, usando `SegmentPage` — ver `DESIGN.md`)
- Ruta export nueva: `GET /api/formatos-udai/reportes-incidencias/exportar` (1 sola ruta, produce 1 `.xlsx` con las 2 hojas)

## Roles que deben ver esto

Los mismos que ya ven `/formatos-udai` hoy — no cambia nada de permisos, se reusa `formatos_udai` tal cual está registrada en `lib/permisos/registro.ts`.

## Fuera de alcance (no implementar salvo pedido explícito)

- Tocar `formAnalisis.tsx` / `useAnalistaForm.ts` para capturar las 8 columnas "fantasma" — es la mejora de mayor impacto real, pero es un cambio de formulario de captura, no de reporte, y no se pidió.
- Agregar columnas nuevas a `iph_detenidos` para `OTRO DELITO`, `MASC`, `UMECAS`, `FECHA DE INGRESO`/`FECHA DE SALIDA` — cambio de esquema fuera de "generar el reporte con lo que ya tenemos".
- Construir captura para `ofi_puesta_disposicion` más allá de lo que ya existe (solo 1 fila en producción) — módulo hermano, no se toca.
- Tocar `/formatos-udai/faltas-administrativas` o su capa de datos existente — solo se le agregan funciones nuevas al mismo `repository.ts`/`types.ts`, sin modificar las existentes.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update`.
3. Bóveda actualizada (Etapa 5).
4. Prueba manual en navegador (la hace el usuario, no el agente): `/agente_reportes` → "Formatos UDAI" → nueva card "Formato Reportes de Incidencias" → tabla con datos reales de `iph_detenidos`, tabs Incidencia/Puestas a Disposición → botón exportar → abrir el `.xlsx` descargado, verificar 2 hojas con encabezados idénticos al oficial columna por columna.
