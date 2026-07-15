# Node Description Batch 6 of 93

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
For a code symbol (kind=code-symbol — a function, class, or constant),
describe what the function/symbol does based on its name, source location
and neighbors — e.g. "Resolves the configured ontology profile from graphify.yaml.".
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
LANGUAGE: each entry has a `lang=` marker giving the language of its source.
Write that entry's description in EXACTLY that language. Do not translate to
a single common language — match each node's source language individually.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "formato_n_armas_aseguradas_page": "page.tsx" | kind=code-symbol | source=app/formato-n-armas-aseguradas/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "formato_n_eventos_page": "page.tsx" | kind=code-symbol | source=app/formato-n-eventos/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "formato_n_rnd_page": "page.tsx" | kind=code-symbol | source=app/formato-n-rnd/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "login_page": "page.tsx" | kind=code-symbol | source=app/(auth)/login/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 1acddac Merge branch 'feature/testing' …, 22bf125 Merge pull request #20 from pre…, 552d291 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 5aa5866 Cambio de colores en interfaz d…] | lang=en
- "monitorista_bandejasolicitudes": "BandejaSolicitudes.tsx" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed] | lang=en
- "reportes_formato_n_armas_aseguradas_service": "formato-n-armas-aseguradas-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a2e0623 Consolidado de formatos N y Sub…, bb10dcd Formatos V1] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@12aab6527c481f0a0f3dbcfd73aec6fcb2f63a87": "12aab65 fase 4" | kind=Commit | source=git | neighbors=[mapper.ts, repository.ts, service.ts, types.ts, layout.tsx, mapper.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@46f24f8bbb4f596344886fe268f93459a7242df2": "46f24f8 generica function for infraction detail" | kind=Commit | source=git | neighbors=[actions.ts, actions.ts, LiberacionesDashboard.tsx, LiberacionesTable.tsx, mapper.ts, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@97a156c6bb4fc1be73d35d05c168219b02bdfa84": "97a156c Reportes con D1, sin D1 y sin robo" | kind=Commit | source=git | neighbors=[1acddac Merge branch 'feature/testing' …, feature/testing, main, 22b7b54 Merge branch 'feature/reportes'…, DescargaFilters.tsx, DescargaTable.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b79a96a842f6bd73adff22de0f9a6a8c547ad549": "b79a96a Conexión entre ambos modulos" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "fiscalia_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/page.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 2db162a flujo de asegurados, 388b997 Apartados para subir fotografia…, 44ebbc4 Merge branch 'feature/testing' …, 5bbdda8 Merge pull request #8 from pres…, 672bab5 libearciones para juzgado] | lang=en
- "monitorista_types": "types.ts" | kind=code-symbol | source=lib/monitorista/types.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, page.tsx, denuncia-service.ts, detenido-service.ts, incidentes-camara-service.ts] | lang=en
- "partials_header_dashboardheader": "DashboardHeader()" | kind=code-symbol | source=components/partials/Header.tsx:L17 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "partials_subheader": "SubHeader.tsx" | kind=code-symbol | source=components/partials/SubHeader.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, a2e0623 Consolidado de formatos N y Sub…, f5fac0b Merge branch 'testing' into con…, page.tsx, page.tsx] | lang=en
- "reportes_formato_n_eventos_service": "formato-n-eventos-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a2e0623 Consolidado de formatos N y Sub…, bb10dcd Formatos V1] | lang=en
- "reportes_formato_n_rnd_service": "formato-n-rnd-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a2e0623 Consolidado de formatos N y Sub…, bb10dcd Formatos V1] | lang=en
- "agente_juzgado_mapper": "mapper.ts" | kind=code-symbol | source=lib/agente_juzgado/mapper.ts:L1 | neighbors=[bool(), num(), rowToInfraccionDetalle(), rowToSolicitud(), str(), types.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2db162a35e85541990e7bebb64d390272cdcdd51": "2db162a flujo de asegurados" | kind=Commit | source=git | neighbors=[actions.ts, FormularioAseguradoJuzgado.tsx, page.tsx, repository.ts, service.ts, layout.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@91c36bfc0feedd37a66fb0c7e072f7f1c4cf67a0": "91c36bf validando orden de pago" | kind=Commit | source=git | neighbors=[2c128e5 test expediente vercel, feature/testing, main, dc063f3 gestion de oficiales correctame…, route.ts, CapturarDatosTitularSection.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c471e9c8cb121c2df42cf794f92379e038368fb1": "c471e9c Merge pull request #15 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[2db162a flujo de asegurados, c1ed4c3 cambios en busquedas, actions.ts, FormularioAseguradoJuzgado.tsx, page.tsx, repository.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f0089cf91c0f7dd267da3f7a5f81bcd6df1d9c2a": "f0089cf Merge pull request #21 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[09a02d5 Fix Reporte Rondin, 435348e corrigiendo flujo de rondin, page.tsx, feature/testing, main, cd92b01 Update .gitignore] | lang=en
- "db_schema": "schema.ts" | kind=code-symbol | source=lib/db/schema.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 126b4d1 Monitorista V1, 166a26b Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 46b2c89 Merge branch 'testing' into juz…] | lang=en
- "fiscalia_tabsolicitudes": "TabSolicitudes.tsx" | kind=code-symbol | source=components/fiscalia/TabSolicitudes.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 1f7c0d7 Merge pull request #23 from pre…, 375d265 flujo de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia] | lang=en
- "flota_service": "service.ts" | kind=code-symbol | source=lib/flota/service.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a21f03f fix bugs reporte denuncia, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…] | lang=en
- "generar_ppt_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/generar-ppt/route.ts:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…] | lang=en
- "generar_route": "route.ts" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L1 | neighbors=[67b1cb7 ReporteWord, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, Alignment, allBorders, dRow()] | lang=en
- "monitorista_denuncia_service": "denuncia-service.ts" | kind=code-symbol | source=lib/monitorista/denuncia-service.ts:L1 | neighbors=[126b4d1 Monitorista V1, 160d1e1 Monitorista V1.1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "monitorista_detenido_service": "detenido-service.ts" | kind=code-symbol | source=lib/monitorista/detenido-service.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 11be750 Fase 1 de correccion - completa…, 16a63d4 Merge branch 'feature/testing' …, 23a3b9d Cambios en la estructura de los…, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…] | lang=en
- "notificaciones_actions": "actions.ts" | kind=code-symbol | source=lib/notificaciones/actions.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 11be750 Fase 1 de correccion - completa…, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, c27a9ee fase prefinal, auth.ts] | lang=en
- "scripts_ab_test": "ab-test.mjs" | kind=code-symbol | source=scripts/ab-test.mjs:L1 | neighbors=[22bf125 Merge pull request #20 from pre…, 7a1ae94 911-rondin, 863c575 Merge pull request #24 from pre…, a, AGENTS_PATH, agentsSize] | lang=en
- "scripts_trace_server": "trace-server.mjs" | kind=code-symbol | source=scripts/trace-server.mjs:L1 | neighbors=[11ee4f2 mejorando flujo de 911, 22bf125 Merge pull request #20 from pre…, 3c12c41 cambios en flujo de 911-despacho, 863c575 Merge pull request #24 from pre…, __dirname, dirty] | lang=en
- "911_repository": "repository.ts" | kind=code-symbol | source=lib/911/repository.ts:L1 | neighbors=[mapper.ts, rowToCatalogo(), rowToIncidenteDetalle(), contarPorEstatus(), listarIncidentes(), listarIncidentesRecientes()] | lang=en
- "analisis_tablonanalisis": "TablonAnalisis.tsx" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L1 | neighbors=[btnStyle, containerStyle, headerRowStyle, loadingStyle, pageButtonStyle, paginationContainerStyle] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@435348e3012477655543c7931641d5046f6f947e": "435348e corrigiendo flujo de rondin" | kind=Commit | source=git | neighbors=[09a02d5 Fix Reporte Rondin, page.tsx, feature/testing, main, f0089cf Merge pull request #21 from pre…, DespachoForm.tsx] | lang=nl
- "completar_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/solicitudes/[id]/completar/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "completar_solicitud_route": "route.ts" | kind=code-symbol | source=app/api/via/ciudadano/completar-solicitud/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes] | lang=en
- "components_seccionliberacion": "SeccionLiberacion.tsx" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "cuestionario_robo_page": "page.tsx" | kind=code-symbol | source=app/auxiliar/cuestionario-robo/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 27dcb21 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed] | lang=en
- "despacho_tablondespacho": "TablonDespacho.tsx" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 290d651 feat(despacho): flujo integral …, 435348e corrigiendo flujo de rondin, 511fea4 Modulo de despacho] | lang=en
- "monitorista_incidentes_camara_service": "incidentes-camara-service.ts" | kind=code-symbol | source=lib/monitorista/incidentes-camara-service.ts:L1 | neighbors=[50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 810844a Cambios en la estructura de los…, 863c575 Merge pull request #24 from pre…] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-005.json

Keep each description factual and concise (one sentence). No markdown, no prose
outside the JSON object. It is acceptable to omit a node if context is
insufficient — but include every node you can ground confidently.

Example answer format:
```json
{
  "node_id_1": "Resolves the configured ontology profile from graphify.yaml.",
  "node_id_2": "Colonel James Barclay, an antagonist in The Crooked Man."
}
```
