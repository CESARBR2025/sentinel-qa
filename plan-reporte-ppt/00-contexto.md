# Contexto — Por qué `/reporte-detenidos` no muestra denuncias D1 completas

Diseñado por Claude (arquitecto) tras diagnóstico contra la BD real. A construir por DeepSeek (worker).

## El síntoma reportado por el usuario

La denuncia D1 `SSPM/D1/20260805/AIO0V2` (IPH `IPH-2026-51248`, CU `CU-2026-87967`, delito "DETONACIÓN DE ARMA DE FUEGO", estatus trámite `EN_ANALISIS`, estatus evidencia `SIN_EVIDENCIA_REQUERIDA`) **no aparece** en la tabla de `/reporte-detenidos`, a pesar de que — según el usuario — el registro está completo y debería poder generar su slide de PPT.

## Diagnóstico (verificado contra BD real, no solo lectura de código)

Se consultó directo la BD de producción (`DATABASE_URL`) para esta denuncia:

```
ofi_reporte_denuncia:
  id = 09bfb8a5-c70c-4731-ac12-908e0afb3ec3
  folio_denuncia = SSPM/D1/20260805/AIO0V2
  reporte_campo_id = 83f0915a-e83b-4e38-9295-02e04c0de34e
  estado_tramite = EN_ANALISIS
  estado_evidencia = SIN_EVIDENCIA_REQUERIDA

ofi_reportes_campo (id = 83f0915a-...):
  folio_reporte_campo = SSPM/CAM/20260805/JHUI9E
  ofi_detenidos = [{ nombre: "URIEL", apellidoPaterno: "MARQUES", apellidoMaterno: "SANCHEZ" }]

solicitud_fotos WHERE reporte_campo_id = 83f0915a-...:
  → 0 filas (vacío)

evidencias_detenido WHERE reporte_campo_id = 83f0915a-...:
  → frontal   (tipo_contenido=detenido, detenido_index=0)  ✅
  → derecho   (tipo_contenido=detenido, detenido_index=0)  ✅
  → izquierdo (tipo_contenido=detenido, detenido_index=0)  ✅
  → vehiculo  (tipo_contenido=objeto,   detenido_index=null)
```

**Causa raíz**: `lib/reporte-detenidos/repository.ts::listarDetenidosCompletos()` filtra por:

```sql
(SELECT COUNT(*) FROM solicitud_fotos sf
 WHERE sf.reporte_campo_id = rc.id AND sf.estado = 'completado') = 3
```

`solicitud_fotos` es la tabla del flujo viejo de **Monitorista** (bandeja `/monitorista/detenidos`: crear solicitud → enviar a Fiscalía/Juzgado → marcar completado). Esa tabla existe en el esquema, pero el trabajo real de subir las 3 fotos hoy pasa por **Fiscalía subiendo directo** desde `FotosExpedienteSection.tsx` → `POST /api/fiscalia/expediente/subir-foto` → `insertarFotoFiscalia()` (`lib/fiscalia/repository.ts:533`), que escribe **solo** en `evidencias_detenido`, sin tocar `solicitud_fotos` en ningún momento.

Resultado: cualquier detenido cuyas 3 fotos se subieron por el flujo actual de Fiscalía (que es el único flujo vigente — el usuario confirma que el de Monitorista revisando/validando fotos **queda descartado**) tiene `solicitud_fotos` vacío → `COUNT(*) = 0 ≠ 3` → nunca aparece en `/reporte-detenidos`, sin importar que las fotos sí existan y estén completas.

## Decisión de negocio (confirmada por el usuario en esta conversación)

1. El flujo de "Monitorista revisa/valida fotos" (`solicitud_fotos`, bandeja `/monitorista/detenidos`) **queda descartado como criterio de completitud** para este reporte. No se borra el módulo de Monitorista (sigue existiendo para otros usos: editar delito/falta administrativa/modus operandi), pero deja de ser la fuente de verdad de "¿están las 3 fotos?".
2. La nueva fuente de verdad de completitud es `evidencias_detenido` (3 tipos: `frontal`, `derecho`, `izquierdo`, `tipo_contenido = 'detenido'`).
3. La tabla `/reporte-detenidos` debe partir de las denuncias D1 (`ofi_reporte_denuncia`), no directo de `ofi_reportes_campo` — es decir, solo debe listar detenidos que además de tener las 3 fotos, tengan una denuncia D1 levantada. Esto es un cambio de tabla base (hoy es `FROM ofi_reportes_campo`, pasa a ser `FROM ofi_reporte_denuncia INNER JOIN ofi_reportes_campo`).

## Bug adicional encontrado que rompe la corrección del PPT (no solo la visibilidad en la tabla)

Al revisar `lib/reporte-detenidos/ppt-service.ts::addDetenidoSlide()` para confirmar que, una vez visible, el registro generaría el PPT bien, se encontró un bug independiente:

```sql
SELECT url_archivo, tipo_foto FROM (
   SELECT url_archivo, tipo_foto, ROW_NUMBER() OVER (PARTITION BY tipo_foto ORDER BY creado_en DESC) as rn
   FROM evidencias_detenido
   WHERE reporte_campo_id = $1
 ) sub WHERE rn = 1
 ORDER BY tipo_foto
```

Este query **no filtra `tipo_contenido = 'detenido'`** (puede traer fotos de `objeto`, ej. `vehiculo`, `arma`) **ni filtra `detenido_index`** (si hubiera 2+ detenidos, mezclaría fotos de personas distintas). Además ordena `ORDER BY tipo_foto` alfabético (`derecho`, `frontal`, `izquierdo`, `vehiculo`) y luego asigna etiquetas fijas por posición (`{0: 'Frontal', 1: 'Derecho', 2: 'Izquierdo'}`) — con el caso real de arriba, el slide mostraría la foto `derecho` **etiquetada como "Frontal"** y la foto `frontal` etiquetada como "Derecho". El PPT saldría con las fotos mal rotuladas incluso después de arreglar la visibilidad en la tabla. Esto cae directo en el pedido del usuario de "que esté todo completo para que se pueda generar el PPT correctamente" — se corrige en la Etapa 2.

## Fuera de alcance (no implementar salvo pedido explícito)

- **Soporte multi-detenido real** (un `ofi_reportes_campo` con 2+ personas en `ofi_detenidos`): hoy `parseNombreDetenido()` en `lib/reporte-detenidos/repository.ts` solo toma el primer elemento del arreglo, y el PPT no filtra por `detenido_index`. Es un bug preexistente, ya documentado como "fuera de alcance" en el plan original (`plan-reporte-detenidos/README.md`). Este plan fija `detenido_index = 0` de forma explícita (antes no se filtraba en absoluto, lo cual era peor — mezclaba detenidos), pero no construye slides por cada detenido. Si el usuario quiere esto, es un plan aparte (toca también la captura en Fiscalía).
- No se modifica la bandeja `/monitorista/detenidos` ni se elimina `solicitud_fotos` del esquema — otros módulos (`lib/detenidos-compartido.ts`, bandejas de Fiscalía/Juzgado) siguen usándola para su propio flujo de solicitud de fotos, que es independiente de este reporte.
- No se decide aquí si una denuncia D1 sin `reporte_campo_id` vinculado (D1 levantada sin pasar por un reporte de campo con detención) debe o no aparecer — por definición no puede tener fotos de detenido, así que queda fuera naturalmente (no hay `evidencias_detenido` posible sin `reporte_campo_id`).

## Componentes involucrados (mapa completo, ya verificado en código)

| Archivo | Rol actual | Cambia en este plan |
|---|---|---|
| `lib/reporte-detenidos/types.ts` | `DetenidoCompleto` | Sí (Etapa 1) |
| `lib/reporte-detenidos/repository.ts` | `listarDetenidosCompletos()` | Sí (Etapa 1) |
| `lib/reporte-detenidos/ppt-service.ts` | `generarPptAgrupado()` / `addDetenidoSlide()` | Sí (Etapa 2) |
| `app/reporte-detenidos/page.tsx` | Tabla de solo lectura | Sí (Etapa 3) |
| `app/api/reporte-detenidos/generar-ppt/route.ts` | POST → genera .pptx | No |
| `components/reporte-detenidos/BotonGenerarPpt.tsx` | Cliente, descarga blob | No |
| `lib/fiscalia/repository.ts::insertarFotoFiscalia` | Escribe `evidencias_detenido` | No (ya es correcto, es la fuente) |
| `lib/monitorista/repository.ts` (`solicitud_fotos`) | Flujo viejo, deja de usarse aquí | No se toca el archivo, solo deja de ser leído por este módulo |
