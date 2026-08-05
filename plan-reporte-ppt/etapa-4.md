# Etapa 4 — Bóveda: documentar el cambio de criterio

Leer primero `00-contexto.md`. Requiere Etapas 1, 2 y 3 ya confirmadas por el usuario.

## Objetivo

Dejar registro en la bóveda de que el criterio de completitud cambió de `solicitud_fotos` (Monitorista) a `evidencias_detenido` (Fiscalía, flujo vigente), y de que la tabla base pasó a ser D1. Sin esto, el próximo agente que lea `boveda/🧩 Features/Reporte de Detenidos.md` va a asumir el flujo viejo (Monitorista) como vigente, que es exactamente el malentendido que causó este bug.

## Archivos a tocar

- `boveda/🧩 Features/Reporte de Detenidos.md`
- `boveda/🗺 Roadmap/Troubleshooting.md`
- `boveda/🏗 Arquitectura/Decisiones.md`

## Cambios

### `Reporte de Detenidos.md`

- En el diagrama de flujo (`mermaid`) y en el texto, reemplazar la referencia a "Monitorista revisa/aprueba fotos" → "Fiscalía sube las 3 fotos directo (`FotosExpedienteSection.tsx` → `evidencias_detenido`)".
- En la tabla de BD, actualizar la fila de `solicitud_fotos` para aclarar que **ya no es la fuente de completitud de este reporte** (sigue usándose en otros módulos: bandeja de Fiscalía/Juzgado en `lib/detenidos-compartido.ts`, edición de Monitorista).
- En "Reglas de negocio", reemplazar la regla 1 actual por:
  > Solo aparecen detenidos con denuncia D1 levantada (`ofi_reporte_denuncia.reporte_campo_id`) y exactamente 3 `evidencias_detenido` (`frontal`, `derecho`, `izquierdo`, `tipo_contenido = 'detenido'`, `detenido_index = 0`). El flujo de aprobación de Monitorista (`solicitud_fotos`) ya no es el criterio — quedó descartado para este reporte (decisión 2026-08-05).
- Agregar la columna `folio_denuncia`/`iph` de `ofi_reporte_denuncia` a la tabla de BD del documento.

### `Troubleshooting.md`

Agregar entrada nueva (no borres las existentes):

```markdown
## /reporte-detenidos no muestra denuncias D1 con fotos completas (2026-08-05)

**Síntoma**: una denuncia D1 con las 3 fotos del detenido subidas por Fiscalía no aparece en `/reporte-detenidos`.

**Causa**: `listarDetenidosCompletos()` filtraba por `solicitud_fotos.estado = 'completado'` (flujo Monitorista), pero las fotos de Fiscalía (`FotosExpedienteSection.tsx` → `insertarFotoFiscalia`) se guardan directo en `evidencias_detenido` sin pasar por `solicitud_fotos`. El flujo de Monitorista quedó descartado como criterio de completitud sin que el query se actualizara.

**Fix**: criterio de completitud movido a `COUNT(DISTINCT tipo_foto) FROM evidencias_detenido WHERE tipo_contenido='detenido' AND detenido_index=0` (ver `plan-reporte-ppt/`). De paso se corrigió un bug independiente en `ppt-service.ts`: el query de fotos del slide no filtraba `tipo_contenido`/`detenido_index` y ordenaba alfabéticamente, causando fotos mal etiquetadas (frontal↔derecho intercambiadas) o fotos de objetos (vehículo/arma) coladas en el slide.
```

### `Decisiones.md`

Agregar ADR corto:

```markdown
## ADR: Fuente de verdad de "fotos completas" en Reporte de Detenidos (2026-08-05)

**Contexto**: el reporte `/reporte-detenidos` (PPT de detenidos) usaba `solicitud_fotos` (flujo de aprobación de Monitorista) como criterio de "3 fotos completas". Ese flujo quedó descartado en la operación real — las fotos las sube Fiscalía directo a `evidencias_detenido`.

**Decisión**: el criterio pasa a ser `evidencias_detenido` (3 tipos: frontal/derecho/izquierdo, `tipo_contenido='detenido'`) y la tabla base pasa de `ofi_reportes_campo` a `ofi_reporte_denuncia` (D1) — solo se listan detenidos con denuncia D1 levantada.

**Consecuencia**: `solicitud_fotos` sigue existiendo y en uso por otros módulos (bandeja Fiscalía/Juzgado de solicitud de fotos, edición de Monitorista) — no se elimina del esquema, solo deja de ser leída por este reporte.
```

## Verificación

- Ninguna (solo documentación). No requiere `tsc` ni build.

## Criterios de aceptación

- Los 3 archivos de bóveda reflejan el flujo vigente (Fiscalía → `evidencias_detenido`), no el de Monitorista.
- Checklist general del plan completo (ver `README.md`).
