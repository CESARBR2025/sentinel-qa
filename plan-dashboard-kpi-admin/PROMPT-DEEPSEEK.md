Eres el worker de implementación para el repo `seguridad_publica` (Next.js + React, Postgres, `DESIGN.md` en la raíz es la fuente única de verdad visual del proyecto).

Hay un plan ya diseñado en la carpeta `plan-dashboard-kpi-admin/` (raíz del repo). Tu trabajo es **ejecutarlo etapa por etapa**, no rediseñarlo.

El usuario (admin de SSPM) necesita un dashboard de KPIs para supervisar los 3 flujos de reportes que pasan por 911: **normal**, **alarma escolar** y **extorsión**. Este plan construye el primer bloque: una card nueva **"KPIs Generales"** en `/dashboard` que lleva a una vista con dos segmentos (`SegmentPage`) — **SSPM** e **Infracciones** — y dentro de SSPM, el primer sub-módulo: **911**, con un panel de KPIs reales (volumen por tipo/canal, atención/despacho, tiempos de respuesta, falsas alarmas escolares, tendencia de extorsión). Infracciones y el resto de sub-módulos de SSPM quedan fuera de alcance por ahora — son planes futuros.

Son 7 etapas, estrictamente secuenciales (cada una depende de la anterior: repository/types → service → API route → componente cliente → página → card en el home → verificación).

Instrucciones:

1. Lee `plan-dashboard-kpi-admin/README.md` completo primero.
2. Lee `plan-dashboard-kpi-admin/00-contexto.md` completo — ahí está el modelo de datos verificado (tablas `incidentes`, `incidente_despacho`, `incidente_despacho_unidades`, `incidente_alarma_escolar`, `incidente_extorsion`) y la lista completa de piezas ya existentes que se **reusan, no se reinventan**: `obtenerKpiIncidencias` (`lib/incidentes/repository.ts:82`), el patrón de presets de fecha de `KpiIncidenciasView`/`FiltrosRangoKpi`, `SegmentPage`, y el layout admin-gated de `app/dashboard/catalogos/`.
3. Lee `DESIGN.md` completo (raíz del repo) antes de tocar cualquier archivo de UI — todo el UI nuevo de este plan va en Apple-style (igual que `/dashboard` ya lo es), **no** en el lenguaje táctico que todavía tiene `components/911/kpi/*` (ese módulo no ha sido migrado — se reusan solo un par de helpers puros de ahí, no su JSX ni sus estilos).
4. **Antes de escribir las queries SQL de la Etapa 1**, verificar los nombres reales de columnas contra la base de datos — lo que está en `00-contexto.md` y en `etapa-01.md` viene de leer el código existente (mappers, otras queries), no de inspeccionar la tabla directamente. Si algo no coincide, usar el nombre real y anotarlo al reportar la etapa.
5. La Etapa 1 (`obtenerKpiExtorsion`) deja una query a propósito sin resolver — antes de completarla, leer `obtenerExtorsionesDetalle` en `lib/reportes-operativos/repository.ts` y copiar exactamente su JOIN de resolución de "unidad real" (con default `'C4'`). No inventar esa lógica desde cero ni asumir una columna directa que no existe.
6. Ejecuta `etapa-01.md`. Al terminar, corre sus "Criterios de aceptación" (incluye `npx tsc --noEmit`, y `npm run build` cuando la etapa lo pida). Reporta qué hiciste y **detente** — no sigas a la siguiente etapa sin que el usuario confirme.
7. Repite el mismo patrón hasta `etapa-07.md`, siempre deteniéndote al final de cada una. El orden es estrictamente secuencial (1→2→3→4→5→6→7), no hay etapas paralelas en este plan.
8. No toques ningún archivo fuera de los listados en cada etapa, ni reconstruyas el mapa de `/agente_despacho/kpi-incidencias` (solo se enlaza desde el panel nuevo), ni agregues contenido real a "Infracciones", ni agregues dependencias nuevas (nada de librerías de charts — la tendencia diaria de extorsión se resuelve con barras CSS simples).
9. Al terminar la Etapa 7, corre el checklist general de `README.md`/`etapa-07.md` completo: build, verificación manual end-to-end (los 4 presets de fecha + rango custom, ambos segmentos SSPM/Infracciones, gate admin tanto en la página como en el API route), documentación en la bóveda (`Feature.md` nuevo + `Index.md` + `Changelog.md`), y `npx graphify update`.

Empieza confirmando que leíste `README.md`, `00-contexto.md` y `DESIGN.md`, y luego arranca la Etapa 1.
