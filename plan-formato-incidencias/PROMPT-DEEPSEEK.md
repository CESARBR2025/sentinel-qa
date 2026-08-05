Eres el worker de implementación para el repo `seguridad_publica` (Next.js + Postgres, capa `lib/<modulo>/{types,repository,service,actions}.ts`, sin ORM salvo auth, migraciones SQL manuales en `lib/db/manual-migrations/`).

Hay un plan ya diseñado y verificado contra la BD real (conexión directa por `pg`/`DATABASE_URL`, no solo documentación) y el código real, en la carpeta `plan-formato-incidencias/` (raíz del repo). Tu trabajo es **ejecutarlo etapa por etapa**, no rediseñarlo.

Este plan **reutiliza** el módulo `lib/formatos-udai/` que ya existe en el repo (construido para el plan hermano `plan-formato-faltasadministrativas/`, ya implementado). No es un módulo nuevo: vas a agregar tipos/funciones/rutas nuevas al lado de lo que ya está, sin tocar lo existente.

Instrucciones:

1. Lee `plan-formato-incidencias/README.md` completo primero.
2. Lee `plan-formato-incidencias/00-contexto.md` completo — ahí está el mapeo de las 38 columnas de la hoja `INCIDENCIA` y las 52 columnas de la hoja `PUESTAS A DISPOSICION` contra la BD real, incluyendo el hallazgo de 8 "columnas fantasma" (existen en el esquema, siempre `NULL` porque ningún formulario las captura hoy) y 5 GAP reales sin ninguna fuente. También hay 4 decisiones de diseño con un default marcado que requieren confirmación del usuario (`NUC/CU`, `LATITUD2`/`LONGITUD3`, 1 archivo vs. 2 en la exportación, `MASC`/`UMECAS`) — si el usuario no responde, sigue los defaults documentados y no te bloquees.
3. Antes de escribir código, revisa con tus propios ojos los archivos existentes que este plan reutiliza y extiende: `lib/formatos-udai/types.ts`, `lib/formatos-udai/repository.ts`, `app/formatos-udai/page.tsx`, `app/formatos-udai/faltas-administrativas/page.tsx`, `app/api/formatos-udai/faltas-administrativas/exportar/route.ts`, `components/formatos-udai/BotonExportarExcel.tsx`, `components/formatos-udai/DetalleFaltaAdministrativaModal.tsx`, `components/partials/SegmentPage.tsx`. El plan describe su estado al 2026-08-05; si algo cambió, prioriza lo que encuentres.
4. Ejecuta `etapa-1.md`. Al terminar, corre sus "Criterios de aceptación". Reporta qué hiciste y **detente** — no sigas a la Etapa 2 sin que el usuario confirme.
5. Repite el mismo patrón para `etapa-2.md` → `etapa-5.md`, siempre deteniéndote al final de cada una.
6. Si en cualquier etapa el código real no coincide con lo que describe el plan (un archivo no existe donde se espera, una función tiene otra firma, una columna de BD tiene otro nombre o tipo), prioriza lo que encuentres en el código/BD real, ajusta la implementación manteniendo el mismo patrón, y avísalo explícitamente en tu reporte de esa etapa — no lo resuelvas en silencio.
7. No toques ningún archivo que no esté listado explícitamente en la etapa que estás ejecutando — en particular, nada de lo ya construido para "Faltas Administrativas" (`FaltaAdministrativaRow`, `SELECT_BASE`, `listarFaltasAdministrativas*`, sus rutas y componentes) salvo el único cambio opcional de la Etapa 3 (generalizar `BotonExportarExcel` con props `href`/`nombreArchivo`). Si crees que hace falta tocar algo fuera de esa lista, pregunta antes de hacerlo.
8. Antes de cualquier cambio de UI, lee `DESIGN.md` (raíz del repo) — es la fuente única de tokens/componentes visuales del proyecto.
9. Los encabezados del Excel exportado (Etapa 4) se copian carácter por carácter del archivo oficial `FORMATO INCIDENCIA.xlsx` (acentos, `/`, `_`, espacios) — no los "corrijas" ni normalices.

Empieza confirmando que leíste `README.md` y `00-contexto.md`, y luego arranca la Etapa 1.
