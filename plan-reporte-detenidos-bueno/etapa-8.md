# Etapa 8 — Bóveda: documentar la ficha completa y sus limitaciones

Leer primero `00-contexto.md`. Requiere Etapas 1-7 confirmadas.

## Objetivo

Dejar registro de por qué la ficha tiene esta forma, de dónde sale cada dato, y qué limitaciones son conocidas y aceptadas (no bugs a corregir después por error).

## Archivos a tocar

- `boveda/🧩 Features/Reporte de Detenidos.md`
- `boveda/🏗 Arquitectura/Decisiones.md`

## Cambios

### `Reporte de Detenidos.md`

Reescribir la sección "BD" y "Reglas de negocio" para reflejar el modelo completo:

- Agregar `ofi_detalles_asegurados` (columnas biográficas nuevas: apodo, curp, fecha_nacimiento, género, originario, estado_civil, escolaridad, ocupación, rasgos_particulares) a la tabla de BD del documento.
- Agregar `antecedentes_externos_detenido` (nueva tabla).
- Documentar el origen de cada campo de la ficha con una tabla tipo:

  | Campo de la ficha | Fuente |
  |---|---|
  | Lugar de la detención | `ofi_reportes_campo.ofi_calle/ofi_colonia` (ubicación de cierre del recorrido, capturada por el Oficial) |
  | Zona de operación | `ofi_reporte_denuncia.sector` (prellenado del sector asignado al oficial, `obtenerSectorOficial`) |
  | Nexos delictivos | Siempre vacío — sin captura implementada (decisión de negocio) |
  | Antecedentes | Combinación de búsqueda local automática (CURP → nombre, excluyendo el reporte actual) + captura manual de Fiscalía para fuentes externas |

- Actualizar el diagrama de flujo (`mermaid`) para incluir el nuevo paso de Fiscalía capturando datos biográficos + antecedentes externos, y el ensamblado de la ficha completa antes de generar el PPT.
- Nota explícita de limitación: *"Los antecedentes locales dependen de que el nombre/CURP coincida exactamente entre reportes — no hay fuzzy matching. Los antecedentes de otros estados dependen 100% de captura manual, no hay integración con Plataforma México/RNPP."*

### `Decisiones.md` — nuevo ADR

```markdown
## ADR: Ficha de Detenidos alineada al formato oficial UDAI (2026-08-05)

**Contexto**: se comparó el PPT generado por el sistema contra el formato oficial real usado por UDAI (`FORMATO FICHA DE DETENIDOS.pptx`) y se encontraron 10 campos faltantes (biográficos del detenido, lugar de detención, zona de operación, antecedentes).

**Decisión**:
- Los campos biográficos (apodo, CURP, fecha nacimiento, género, originario, estado civil, escolaridad, ocupación, rasgos particulares) se agregan a `ofi_detalles_asegurados`, capturados por Fiscalía (mismo paso donde ya captura domicilio).
- Lugar de detención y zona de operación **no requirieron campos nuevos** — ya existían (`ofi_reportes_campo.ofi_calle/ofi_colonia` y `ofi_reporte_denuncia.sector` respectivamente), solo se expusieron en la ficha.
- Nexos delictivos queda sin implementar, se muestra vacío (igual que en el ejemplo real del formato oficial).
- Antecedentes: dos fuentes combinadas — búsqueda automática local (CURP con fallback a nombre completo, contra `ofi_reporte_denuncia`/`ofi_reportes_campo` propios) y captura manual en Fiscalía para antecedentes de otras entidades (tabla `antecedentes_externos_detenido`), ya que el sistema no tiene integración con fuentes estatales/nacionales externas.
- El PPT pasa de una página horizontal con tabla simple a una página vertical (7.5×10in) que replica la estructura de secciones del formato oficial.

**Consecuencia**: el módulo deja de ser un simple "listado + tabla" y pasa a depender de datos capturados en un paso adicional de Fiscalía (Etapa 2) — un detenido sin esos datos biográficos capturados igual aparece en `/reporte-detenidos` (el criterio de completitud sigue siendo las 3 fotos, ver `plan-reporte-ppt`), pero su ficha en el PPT mostrará esos campos vacíos.
```

## Verificación

- Ninguna (solo documentación). No requiere `tsc` ni build.

## Criterios de aceptación

- Bóveda refleja el modelo completo y las limitaciones conocidas.
- Checklist general del plan completo (ver `README.md`).
