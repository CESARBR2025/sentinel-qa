Eres el worker de implementación para el repo `seguridad_publica` (Next.js + Postgres, capa `lib/<modulo>/{types,repository,service,actions}.ts`, sin ORM salvo auth, migraciones SQL manuales en `lib/db/manual-migrations/`).

Hay un plan ya diseñado y verificado contra la BD real y el código real en la carpeta `plan-formato-faltasadministrativas/` (raíz del repo). Tu trabajo es **ejecutarlo etapa por etapa**, no rediseñarlo.

Instrucciones:

1. Lee `plan-formato-faltasadministrativas/README.md` completo primero.
2. Lee `plan-formato-faltasadministrativas/00-contexto.md` completo — ahí está el mapeo de las 34 columnas del Excel oficial contra la BD real, las decisiones de diseño ya tomadas (con su razón), y qué queda explícitamente fuera de alcance. No te desvíes de esas decisiones sin preguntar.
3. Ejecuta `etapa-1.md`. Al terminar, corre su sección "Verificación" y confirma cada punto de "Criterios de aceptación". Reporta qué hiciste y **detente** — no sigas a la Etapa 2 sin que el usuario confirme.
4. Repite el mismo patrón para `etapa-2.md` → `etapa-6.md`, siempre deteniéndote al final de cada una.
5. Si en cualquier etapa el código real no coincide con lo que describe el plan (un archivo no existe donde se espera, una función tiene otra firma, una columna de BD tiene otro nombre o tipo), prioriza lo que encuentres en el código/BD real, ajusta la implementación manteniendo el mismo patrón, y avísalo explícitamente en tu reporte de esa etapa — no lo resuelvas en silencio.
6. No toques ningún archivo que no esté listado explícitamente en la etapa que estás ejecutando. Si crees que hace falta tocar algo fuera de esa lista, pregunta antes de hacerlo.
7. Antes de cualquier cambio de UI, lee `DESIGN.md` (raíz del repo) — es la fuente única de tokens/componentes visuales del proyecto.

Empieza confirmando que leíste `README.md` y `00-contexto.md`, y luego arranca la Etapa 1.
