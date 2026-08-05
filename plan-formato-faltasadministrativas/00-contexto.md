# Contexto — Formato Faltas Administrativas (UDAI)

Análisis hecho por Claude (arquitecto) el 2026-08-05, contra el archivo oficial `FORMATO FALTAS ADMINISTRATIVAS.xlsx` (Downloads/Sistema SSPM/Formatos UDAI Sistema/Formatos UDAI) y contra la BD real de producción (esquema en `boveda/📦 Datos/Esquema BD.md`, código verificado directamente en `lib/monitorista/repository.ts`). A construir por DeepSeek (worker).

## Qué es el archivo fuente

`Hoja1`, **34 columnas (A:AH), una sola fila de encabezados, sin datos de ejemplo** — es una plantilla vacía, no un reporte con filas. El objetivo NO es capturar nada nuevo: es generar este Excel a partir de datos que **ya existen** en la tabla `iph_detenidos`, alimentada hoy por el formulario de Análisis (`components/analisis/formAnalisis.tsx` → `POST /api/detenidos/registrar` → `registrarIphDetenido()` en `lib/monitorista/repository.ts:533`).

## Hallazgo clave: ya existe casi todo el dato

La tabla `iph_detenidos` (73 columnas, ver `boveda/📦 Datos/Esquema BD.md:812-905`) replica casi 1:1 el formato oficial. Ya hay una bitácora de lectura parcial en `/analisis/iph` (`components/analisis/iph/BitacoraIPH.tsx`) que lista `iph_detenidos` vía `listarIphDetenidos()` — pero solo trae 6 columnas (`id, folio_iph, alias, delito, fecha_evento, genero`), no las 34 que necesitamos.

El JOIN completo que sí trae nombre/apellidos/domicilio (que **no** están en `iph_detenidos`, viven en `ofi_detalles_asegurados`) ya existe como precedente exacto en `obtenerPrellenadoCompleto()` (`lib/monitorista/repository.ts:253-285`):

```sql
FROM iph_detenidos iph
LEFT JOIN ofi_reporte_denuncia rd ON rd.id = iph.reporte_denuncia_id
LEFT JOIN ofi_reportes_campo rc ON rc.id = rd.reporte_campo_id
LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
```

Esta es la base para la Etapa 1. No inventar un join nuevo — calcar este patrón.

## Mapa completo: columna Excel → fuente real en BD

| # | Columna Excel | Fuente | Tipo |
|---|---|---|---|
| 1 | FECHA | `iph.fecha_reporte` (fallback `rd.fecha_reporte`) | date |
| 2 | HORA | `iph.hora_reporte` (fallback `rd.hora_reporte`) | time |
| 3 | RESPONSABLE DE TURNO | `iph.rt_responsable` | texto libre |
| 4 | HORA DE SALIDA | **GAP** — sin columna directa | — |
| 5 | IPH | `rd.iph` (fallback `iph.folio_iph`) | texto libre |
| 6 | FOLIO TABLET | **GAP** — solo existen booleanos (`ofi_reporte_denuncia.requirio_tablet/funcionaba_tablet/registro_tableta`), ningún folio | — |
| 7 | APELLIDO PATERNO | `da.ap_paterno_detenido` | texto libre |
| 8 | APELLIDO MATERNO | `da.ap_materno_detenido` | texto libre |
| 9 | NOMBRE | `da.nombre_detenido` | texto libre |
| 10 | FECHA DE NACIMIENTO | `iph.fecha_nacimiento` | date |
| 11 | EDAD | `iph.edad` | integer (ya capturado, no recalcular) |
| 12 | GÉNERO | `iph.genero` | texto libre |
| 13 | ALIAS | `iph.alias` | texto libre |
| 14 | CIUDAD DE ORIGEN DET | `iph.ciudad_origen` | texto libre |
| 15 | CALLE DET | `iph.calle_detenido` | texto libre |
| 16 | NUMERO | `iph.numero_detenido` | texto libre |
| 17 | COLONIA DET | `iph.colonia_detenido` | texto libre |
| 18 | ARTICULO | `iph.articulo` | texto libre (ver nota catálogos abajo) |
| 19 | TIPO DE FALTA ADMINISTRATIVA | `iph.tipo_falta` | texto libre |
| 20 | REGISTRO NACIONAL DE DETENIDOS | `iph.rnd` | texto libre |
| 21 | LUGAR DE ARRESTO, CALLE Y/O AVENIDA | `iph.calle_arresto` | texto libre |
| 22 | COLONIA | `iph.colonia_arresto` | texto libre |
| 23 | OFICIAL QUE REMITE (col W) | `iph.agente_aprehensor` | texto libre |
| 24 | OFICIAL QUE REMITE (col X, duplicada) | **GAP** — no hay segundo oficial/testigo en ningún módulo | — |
| 25 | SECTOR | `COALESCE(iph.sector_arresto, rd.sector)` | texto libre |
| 26 | AGRUPAMIENTO | `iph.agrupamiento_arresto` | texto libre |
| 27 | COORDENADAS LATITUD | `iph.latitud_arresto` | numeric |
| 28 | COORDENADAS LONGITUD | `iph.longitud_arresto` | numeric |
| 29 | PRESENCIA | `iph.presencia` | boolean |
| 30 | VERBALIZACION | `iph.verbalizacion` | boolean |
| 31 | CONTROL DE CONTACTO | `iph.control_contacto` | boolean |
| 32 | CONTROL FISICO | `iph.control_fisico` | boolean |
| 33 | TECNICAS DEFENSIVA NO LETALES | `iph.tecnicas_no_letales` | boolean |
| 34 | FUERZA POTENCIAL LETAL | `iph.fuerza_letal` | boolean |

### Nota sobre catálogos (importante, no te desvíes)

`articulo`, `tipo_falta`, `agrupamiento_arresto`, `sector_arresto` son **texto libre en producción hoy**, capturados por un formulario que ya existe (`formAnalisis.tsx`) y que **este plan no toca**. La regla del proyecto de "no texto libre para catálogos, siempre FK" aplica cuando *nosotros* introducimos un campo persistido nuevo — aquí solo estamos **leyendo y reportando** datos que ya existen tal cual fueron capturados. No conviertas estas columnas a catálogo ni toques `formAnalisis.tsx`/`useAnalistaForm.ts` — está fuera de alcance de este plan.

## Decisiones de diseño (defaults aplicados — revisar antes de la Etapa 1)

1. **Universo de filas**: se listan **todos** los registros de `iph_detenidos` (no solo los que tienen 3 fotos, a diferencia de `/reporte-detenidos` — esto es una bitácora administrativa, no depende de evidencia fotográfica).
2. **Orden**: tabla en pantalla, más reciente primero (`ORDER BY iph.fecha_reporte DESC, iph.hora_reporte DESC`); el Excel exportado en orden cronológico ascendente (`ASC`), como se espera de una bitácora entregable.
3. **Columna 23 vs 24 (OFICIAL QUE REMITE duplicada)**: se llena solo la columna W con `agente_aprehensor`; la columna X (duplicada en el formato oficial) se deja vacía. Si el usuario confirma que existe un segundo oficial/testigo en algún otro lado, ajustar antes de construir.
4. **Columnas 29-34 (escala de uso de la fuerza)**: se renderizan como `'SI'` cuando el booleano es `true`, celda vacía cuando es `false` (no `TRUE`/`FALSE` crudo) — más legible y más cercano a cómo se llenaría a mano.
5. **Gaps (col. 4, 6, 24)**: se dejan vacíos (`''`) tanto en la tabla como en el Excel. No se inventa dato ni se bloquea el reporte por su ausencia.
6. **Fecha/Hora con fallback**: si `iph.fecha_reporte`/`hora_reporte` es NULL, se usa `rd.fecha_reporte`/`hora_reporte` (mismo patrón de `obtenerPrellenadoCompleto`).

## Nomenclatura elegida

- Módulo de datos: `lib/formatos-udai/`
- Sección de permisos: `formatos_udai`
- Ruta hub (la "carpeta"): `/formatos-udai`
- Ruta tabla: `/formatos-udai/faltas-administrativas`
- Ruta export: `GET /api/formatos-udai/faltas-administrativas/exportar`

Se eligió `/formatos-udai` como ruta de nivel superior (no anidada bajo `/agente_reportes`) porque es el patrón consistente en todo el proyecto: todas las cards de `/agente_reportes` enlazan a rutas top-level (`/reporte-detenidos`, `/nCoordinacion`, `/d1`, etc.), nunca a subrutas de `/agente_reportes/*`.

## Roles que deben ver esto

Los mismos dos roles que ya usan `/agente_reportes` (`lib/auth/helpers.ts` → `HUB_POR_ROL`): `Reportante` (id 35) y `agente_reportes` (id 47). Se registra la sección `formatos_udai` en la plantilla de ambos en `lib/permisos/registro.ts`, igual que `reporte_detenidos` y `formato_n_coordinacion` ya están registradas ahí.

## Fuera de alcance (no implementar salvo pedido explícito)

- Cualquier catálogo nuevo para `articulo`/`tipo_falta`/`agrupamiento`/`sector` (ver nota arriba).
- Capturar `HORA DE SALIDA` real vía join con `incidente_despacho_unidades` — es posible pero opcional, no se hace en este plan.
- Capturar `FOLIO TABLET` o un segundo oficial — no hay fuente, no se agrega columna nueva a `iph_detenidos` sin que el usuario lo pida explícitamente (eso sería un cambio de esquema fuera del alcance de "generar el reporte con lo que ya tenemos").
- Tocar `formAnalisis.tsx`, `useAnalistaForm.ts` o el flujo de captura de Análisis.
- Tocar `/reporte-detenidos` o `/analisis/iph` — son módulos hermanos, no se modifican.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update`.
3. Bóveda actualizada (Etapa 6).
4. Prueba manual en navegador (la hace el usuario, no el agente): abrir `/agente_reportes` → carpeta "Formatos UDAI" → card "Formato Faltas Administrativas" → tabla con datos reales de `iph_detenidos` → botón exportar → abrir el `.xlsx` descargado y comparar encabezados contra el oficial columna por columna.
