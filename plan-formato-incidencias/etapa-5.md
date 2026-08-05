# Etapa 5 — Bóveda y verificación final

Leer primero `00-contexto.md`. Depende de la Etapa 4. Última etapa.

## Objetivo

Cerrar el checklist T2 de `AGENTS.md`: documentar el sub-módulo nuevo en la bóveda (ya existe `boveda/🧩 Features/Formatos UDAI.md` de la feature "Faltas Administrativas" — **se amplía ese mismo archivo**, no se crea uno nuevo) y correr la verificación completa.

## Archivo a modificar: `boveda/🧩 Features/Formatos UDAI.md`

Agregar una segunda sección grande al final del archivo (después de "Limitaciones conocidas" de Faltas Administrativas), con el mismo nivel de detalle que la sección existente, cubriendo:

- **Propósito**: generar `FORMATO INCIDENCIA.xlsx` (2 hojas: `INCIDENCIA` e `PUESTAS A DISPOSICION`) a partir de `iph_detenidos`, sin captura nueva.
- **Flujo** (mermaid, igual estilo que el existente).
- **Quién lo usa**: mismo hub, mismos roles y permiso `formatos_udai` — no hay nada nuevo que registrar en `lib/permisos/registro.ts` (a diferencia de cuando se creó Faltas Administrativas, aquí no se agrega sección de permisos nueva).
- **Componentes involucrados**: `lib/formatos-udai/types.ts` (`ReporteIncidenciaRow`, `PuestaDisposicionRow` — agregados, no reemplazan `FaltaAdministrativaRow`), `lib/formatos-udai/repository.ts` (4 funciones nuevas), `app/formatos-udai/reportes-incidencias/page.tsx`, `app/api/formatos-udai/reportes-incidencias/exportar/route.ts`, `components/formatos-udai/DetalleReporteIncidenciaModal.tsx`, `components/formatos-udai/DetallePuestaDisposicionModal.tsx`.
- **Tabla de mapeo columna Excel → columna BD** para ambas hojas (copiar las 2 tablas de `00-contexto.md`).
- **Limitaciones conocidas (aceptadas, no bugs)** — copiar el hallazgo de "columnas fantasma" (8 columnas con dato en BD siempre `NULL` porque `formAnalisis.tsx` no las captura) y los 5 GAP reales de `PUESTAS A DISPOSICION` (`FECHA DE INGRESO`, `FECHA DE SALIDA`, `OTRO DELITO`, `MASC`, `UMECAS`) + las 4 decisiones best-fit (`HORA EVENTO`, `NUC/CU`, `LATITUD2`, `LONGITUD3`) tal como quedaron confirmadas o ajustadas durante la construcción.

## Archivo a modificar: `boveda/🧩 Features/Index.md`

Si la entrada "Formatos UDAI" ya menciona solo "Faltas Administrativas", ampliar la descripción de una línea para incluir "Reportes de Incidencias". No duplicar la entrada.

## Recomendación adicional para la bóveda (no bloqueante)

Dejar constancia en `boveda/🗺 Roadmap/Pendientes.md` de la oportunidad real detectada: 8 columnas de `iph_detenidos` (`folio_911`, `dia_evento`, `hora_inicio_evento`, `hora_final_evento`, `hora_promedio`, `modus_operandi`, `telefono_afectado`, `ap_nuc`) tienen `INSERT` listo en `registrarIphDetenido()` pero ningún campo de captura en `formAnalisis.tsx` las llena — si se agregaran esos campos al formulario, ambas hojas de este reporte (y no solo esta, cualquier reporte futuro sobre `iph_detenidos`) quedarían con 100% de columnas pobladas en vez del ~79-100% actual. Es una sola línea de anotación, no una tarea a ejecutar en este plan.

## Verificación final (todas las etapas juntas)

1. `npx tsc --noEmit` — sin errores en todo el proyecto.
2. `npm run build` — sin errores.
3. `npx graphify update`.
4. Confirmar en `git status` / `git diff` que no se tocó ningún archivo fuera de lo listado en las Etapas 1-5 (especialmente: no se tocó `formAnalisis.tsx`, `useAnalistaForm.ts`, ni nada de `faltas-administrativas/*` existente, ni `lib/permisos/registro.ts`).

## Criterios de aceptación

- Bóveda refleja el sub-módulo nuevo con las mismas convenciones que la sección existente de Faltas Administrativas.
- `npx tsc --noEmit` y `npm run build` limpios.
- El flujo completo funciona end-to-end en navegador (lo confirma el usuario): `/agente_reportes` → "Formatos UDAI" → "Formato Reportes de Incidencias" → tabs Incidencia/Puestas a Disposición con datos reales → "Exportar XLSX" → archivo descargado con 2 hojas de encabezados idénticos al oficial.
