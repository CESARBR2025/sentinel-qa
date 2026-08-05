# Etapa 9 — Bóveda: ADR + actualización de Feature + checklist final

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

Cerrar el plan documentando las decisiones tomadas y dejando la bóveda alineada con el modelo ya saneado, más una verificación final de que no queda ningún rastro de los problemas originales.

## Archivos

- Modify: `boveda/🏗 Arquitectura/Decisiones.md` — agregar ADR
- Modify: `boveda/🧩 Features/Reporte Campo.md` — reflejar el modelo saneado
- Modify: `boveda/📦 Datos/Esquema BD.md` — regenerar una última vez (`npm run db:schema`)

## ADR a documentar en `Decisiones.md`

Seguir el formato ya usado en el archivo (título, contexto, decisión, consecuencias). Cubrir:

1. **Fuente única de reporte de campo**: `ofi_reportes_campo` es la única tabla viva; `incidente_reporte_campo` fue eliminada (0 filas, 9 archivos migrados). Motivo: dos tablas con el mismo propósito y datos duplicados eran fuente de bugs de sincronización.
2. **Fuente única de detenidos de reporte de campo**: `ofi_detalles_asegurados` (tabla relacional) es la fuente de lectura; la columna JSONB `ofi_reportes_campo.ofi_detenidos` sigue existiendo para la captura del formulario pero ya no se lee en `lib/detenidos-compartido.ts`.
3. **Resolución de `oficial_id` en el D1**: `ofi_reporte_denuncia.oficial_id` referencia `ofi_oficiales(id)`, no `users(id)` — documentar explícitamente la diferencia con `capturado_por` (que sí referencia `users(id)`, es el usuario de sesión que capturó el reporte) para que no se vuelva a confundir en el futuro.
4. **FK circular IPH↔Fichas de Inteligencia resuelta**: se dejó unidireccional (`ofi_fichas_inteligencia.iph_id → iph_detenidos`).
5. **FKs duplicadas eliminadas** en `ofi_reporte_denuncia.incidente_id` (de 3 a 1).
6. Mencionar que este saneamiento fue prerrequisito de `plan-formulario-d1` (carpeta hermana), que corre después sobre este modelo.

## Actualización de `Feature Reporte Campo.md`

Revisar el contenido actual del archivo y actualizar cualquier mención a `incidente_reporte_campo` o al flujo de detenidos vía JSONB que ya no aplique. Si el archivo no menciona estos detalles hoy, agregar una sección breve "Modelo de datos" con las tablas canónicas (`ofi_reportes_campo`, `ofi_detalles_asegurados`) y su relación.

## Checklist final (verificar TODO antes de cerrar el plan)

1. `npx tsc --noEmit` y `npm run build` verdes.
2. `npm run db:schema` corrido por última vez, `boveda/📦 Datos/Esquema BD.md` refleja el estado final (con índices y FKs, gracias a la Etapa 1).
3. `grep -rn "incidente_reporte_campo" lib app` → cero resultados.
4. `grep -rn "COALESCE.*incidente_id" lib app` → cero resultados.
5. `SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='ofi_reporte_denuncia' AND constraint_type='FOREIGN KEY'` → exactamente 4 filas (`fk_d1_incidente`, `reportes_d1_reporte_campo_id_fkey`, `fk_reportes_d1_usuario`, `ofi_reporte_denuncia_oficial_id_fkey`), sin duplicados.
6. `SELECT count(*) FROM information_schema.table_constraints WHERE table_name IN ('ofi_fichas_inteligencia','iph_detenidos') AND constraint_type='FOREIGN KEY'` → confirmar que la circularidad ya no existe (una sola dirección).
7. `ls lib/db/manual-migrations | sed -E 's/^([0-9]+)_.*/\1/' | sort | uniq -d` → vacío (sin colisiones de numeración).
8. ADR en `Decisiones.md` y `Feature Reporte Campo.md` actualizados.
9. `npx graphify update` corrido al cerrar (regla de `AGENTS.md`).
10. Prueba manual end-to-end en navegador (la hace el usuario, no el agente):
    - Crear un reporte de campo con detención → verificar que el detenido sigue apareciendo correctamente en Fiscalía/Juzgado Cívico (fotos pendientes).
    - Escalar un reporte de campo a D1 → verificar que el incidente asociado se resuelve igual en Fiscalía.
    - Navegar el detalle de un incidente, reportes operativos, reportes de incidentes, coordinación, formato N RND y 911 → confirmar que todos siguen mostrando datos tras el drop de `incidente_reporte_campo`.

**Con esto se cierra `plan-saneamiento-bd-d1`. `plan-formulario-d1` (ya existente en el repo) puede ejecutarse a continuación sobre este modelo saneado — no requiere reabrir ninguna etapa de este plan.**
