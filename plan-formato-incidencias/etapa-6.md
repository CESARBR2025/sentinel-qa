# Etapa 6 — Bóveda y verificación final

Leer primero `00-contexto.md`. Depende de la Etapa 5. Última etapa.

## Objetivo

Cerrar el checklist T2 de `AGENTS.md`: documentar el sub-módulo nuevo en la bóveda (ya existe `boveda/🧩 Features/Formatos UDAI.md` de la feature "Faltas Administrativas" — **se amplía ese mismo archivo**, no se crea uno nuevo) y correr la verificación completa.

## Archivo a modificar: `boveda/🧩 Features/Formatos UDAI.md`

Agregar una segunda sección grande al final, con el mismo nivel de detalle que la sección existente, cubriendo:

- **Propósito**: generar `FORMATO INCIDENCIA.xlsx` (2 hojas) a partir del flujo real 911 → reporte de campo → reporte de denuncia (`incidentes`/`ofi_reportes_campo`/`ofi_reporte_denuncia`), acotado a incidentes ya resueltos (`estatus IN ('atendido','cerrado_detencion')`), con un paso de captura manual explícito para lo que no tiene fuente automática. **No usa `iph_detenidos`** — se investigó y esa tabla está desconectada de la cadena real 911 en los datos actuales.
- **Flujo** (mermaid), incluyendo el paso de completar/marcar como completa antes de poder exportar, y que los incidentes "en curso" nunca entran al reporte.
- **Quién lo usa**: mismo hub, mismos roles, permiso `formatos_udai` (acción `ver` para listar/exportar, `editar` para guardar el complemento — confirmar que `editar` ya está cubierto por la plantilla de permisos de los roles `Reportante`/`agente_reportes`; si no lo está, es un ajuste de una línea en `lib/permisos/registro.ts`, no una sección nueva).
- **Componentes involucrados**: `lib/formatos-udai/types.ts` (`ReporteIncidenciaCompleto`), `lib/formatos-udai/repository.ts` (2 funciones nuevas, ancladas en `incidentes`), `lib/formatos-udai/actions.ts` (nuevo), `app/formatos-udai/reportes-incidencias/page.tsx`, `app/api/formatos-udai/reportes-incidencias/exportar/route.ts`, `components/formatos-udai/CompletarDatosModal.tsx`, `components/formatos-udai/DetalleReporteIncidenciaModal.tsx`, `lib/db/manual-migrations/0039_formato_incidencia_complemento.sql`.
- **Tabla de mapeo columna Excel → fuente final** para ambas hojas (copiar de `00-contexto.md`), incluyendo qué columnas son 100% automáticas (`FOLIO 911`, `MUNICIPIO`, coordenadas, `AGENTE_APREHENSOR` vía `ofi_oficiales`→`users`), cuáles tienen JOIN de respaldo, cuáles se resuelven desde el JSON sin esquema fijo de `ofi_reportes_campo.ofi_detenidos`/`ofi_vehiculos`, y cuáles dependen del complemento manual (`incidente_id` como llave, no `iph_detenido_id`).
- **Modelo de completitud**: explicar que `formato_incidencia_complemento.completado_en` es el único criterio de "Pendiente"/"Completa", decisión explícita del usuario (no se fuerza que cada columna tenga valor).
- **Limitaciones conocidas (aceptadas, no bugs)**: `OTRO DELITO`/`MASC`/`UMECAS` sin fuente automática y como texto libre; `RT`/`TURNO`/`ARTICULOS U OBJETOS`/`AP-NUC`/`FOLIO RND`/`AGRUPAMIENTO` sin fuente automática desde que se sacó `iph_detenidos` de la cadena (antes las resolvía esa tabla); `FECHA DE INGRESO`/`FECHA DE SALIDA` con fuente automática real pero muy escasa hoy (`ofi_puesta_disposicion` con 1 sola fila en la BD); `HORA FINAL EVENTO` casi siempre vacía en la práctica; `LATITUD2`/`LONGITUD3` son un duplicado deliberado de `LATITUD`/`LONGITUD` (sin segunda coordenada real distinta); el JSON de `ofi_vehiculos`/`ofi_detenidos` no tiene esquema fijo (llaves inconsistentes entre reportes); se asume 1 reporte de campo y 1 detenido por incidente (cardinalidad 1:1 verificada en datos actuales, no garantizada a futuro).

## Archivo a modificar: `boveda/🧩 Features/Index.md`

Ampliar la descripción de la entrada "Formatos UDAI" para incluir "Reportes de Incidencias". No duplicar la entrada.

## Verificación final (todas las etapas juntas)

1. `npx tsc --noEmit` — sin errores en todo el proyecto.
2. `npm run build` — sin errores.
3. `npx graphify update`.
4. Confirmar en `git status` / `git diff` que no se tocó ningún archivo fuera de lo listado en las Etapas 1-6 (especialmente: no se tocó `formAnalisis.tsx`, `useAnalistaForm.ts`, nada de `faltas-administrativas/*` existente, ni `lib/permisos/registro.ts` salvo el posible ajuste de acción `editar` señalado arriba).

## Criterios de aceptación

- Bóveda refleja el sub-módulo nuevo con las mismas convenciones que la sección existente de Faltas Administrativas.
- `npx tsc --noEmit` y `npm run build` limpios.
- Flujo completo end-to-end en navegador (lo confirma el usuario): `/formatos-udai` → "Formato Reportes de Incidencias" → tab "Pendientes" con datos reales → "Completar datos" en un registro → llenar y "Guardar y marcar como completa" → el registro se mueve a "Completas" → "Exportar XLSX" descarga 2 hojas con ese registro y no con los pendientes.
