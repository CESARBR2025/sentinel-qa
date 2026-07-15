# Node Description Batch 3 of 93

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9faf222a5f0d4eaaea5805ee9b412b41b8fe3050": "9faf222 Merge branch 'feature/testing' into feature/reportes" | kind=Commit | source=git | neighbors=[8355ac0 Merge branch 'feature/testing' …, actions.ts, FormularioAseguradoJuzgado.tsx, page.tsx, repository.ts, service.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f5fac0b477199b12441fe512f50e6d38c133f060": "f5fac0b Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[5a1b5d5 empezando corralon, af993fb Fix/Monitorista, repository.ts, page.tsx, repository.ts, feature/testing] | lang=en
- "shared_detalleinfraccionview": "DetalleInfraccionView.tsx" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 06c55f5 Merge branch 'feature/testing' …, 0b210fa Merge pull request #12 from pre…, 16a63d4 Merge branch 'feature/testing' …, 1acddac Merge branch 'feature/testing' …, 2c128e5 test expediente vercel] | lang=en
- "fiscalia_mapper": "mapper.ts" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L1 | neighbors=[repository.ts, 067c4de arreglando flujo de fiscalia  a…, 090c4dd vista de fiscalia, 0b210fa Merge pull request #12 from pre…, 16a63d4 Merge branch 'feature/testing' …, 1acddac Merge branch 'feature/testing' …] | lang=en
- "oficial_formulariorecorrido": "FormularioRecorrido.tsx" | kind=code-symbol | source=components/oficial/FormularioRecorrido.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 067c4de arreglando flujo de fiscalia  a…, 0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 16a63d4 Merge branch 'feature/testing' …] | lang=en
- "agente_juzgado_types": "types.ts" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L1 | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, JuzgadoDashboard.tsx, mapper.ts, repository.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6adb8adbc05423d2a2d84466198dc7b23b9b4cd5": "6adb8ad Correciones de versión y nombre" | kind=Commit | source=git | neighbors=[ModuleCard.tsx, layout.tsx, layout.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "oficial_actions": "actions.ts" | kind=code-symbol | source=lib/oficial/actions.ts:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 16a63d4 Merge branch 'feature/testing' …, 2233342 Fix/MarcarEnSitio, 22bf125 Merge pull request #20 from pre…, 290d651 feat(despacho): flujo integral …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@067c4de0f888d71365929c30f7c50aacb9161dec": "067c4de arreglando flujo de fiscalia  a schema via" | kind=Commit | source=git | neighbors=[repository.ts, CargarOficioSection.tsx, mapper.ts, repository.ts, types.ts, actions.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@514a70512b9c2a0c6231575c83202e2d4f55f4c9": "514a705 refactorizacion sql" | kind=Commit | source=git | neighbors=[12aab65 fase 4, repository.ts, repository.ts, page.tsx, feature/testing, main] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5d179c0781f151d3144b7f36607dd488f2d4cbd8": "5d179c0 Apartado de reportes" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8e6c8c679f186e64d153cc1602969fd5a1a88b03": "8e6c8c6 Apartado de reportes" | kind=Commit | source=git | neighbors=[44ebbc4 Merge branch 'feature/testing' …, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "exportar_route": "route.ts" | kind=code-symbol | source=app/api/reportes-telefonicos/exportar/route.ts:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 6adb8ad Correciones de versión y nombre] | lang=en
- "oficial_page": "page.tsx" | kind=code-symbol | source=app/oficial/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0c31cc2 Merge branch 'testing' into juz…, 0fe445e vista de oficial, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …] | lang=en
- "prevencion_permisos": "permisos.ts" | kind=code-symbol | source=lib/prevencion/permisos.ts:L1 | neighbors=[route.ts, page.tsx, route.ts, route.ts, route.ts, 03f8b2a implementado rbac] | lang=en
- "reportes_operativos_service": "service.ts" | kind=code-symbol | source=lib/reportes-operativos/service.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 07543de Conexion de reportes con d1 y l…, 16a63d4 Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…] | lang=en
- "rol_servicios_repository": "repository.ts" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, actions.ts, db.ts, query(), mapper.ts] | lang=en
- "modulo_incidentes_page": "page.tsx" | kind=code-symbol | source=app/modulo_incidentes/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 2516723 Modulo de permisos, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…] | lang=en
- "monitorista_page": "page.tsx" | kind=code-symbol | source=app/monitorista/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 126b4d1 Monitorista V1, 23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 3ec7484 Header y Footer Fix] | lang=en
- "plugins_context_loader": "context-loader.js" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 3c12c41 cambios en flujo de 911-despacho, 7a1ae94 911-rondin, 863c575 Merge pull request #24 from pre…, BUDGET_WARN_MSG()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1acddacffcb1e329ce46331427b0b00ca45b65ec": "1acddac Merge branch 'feature/testing' into feature/reportes" | kind=Commit | source=git | neighbors=[07543de Conexion de reportes con d1 y l…, actions.ts, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx] | lang=en
- "incidentes_mapper": "mapper.ts" | kind=code-symbol | source=lib/incidentes/mapper.ts:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 290d651 feat(despacho): flujo integral …, 435348e corrigiendo flujo de rondin, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto] | lang=en
- "auth_helpers_getuserwithrole": "getUserWithRole()" | kind=code-symbol | source=lib/auth/helpers.ts:L29 | neighbors=[actions.ts, layout.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "monitorista_permisos": "permisos.ts" | kind=code-symbol | source=lib/monitorista/permisos.ts:L1 | neighbors=[actions.ts, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, f2c66e6 Extender roles y permisos finos…] | lang=en
- "agente_liberaciones_actions": "actions.ts" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L1 | neighbors=[capturarInfractorAction(), finalizarRevisionAction(), generarOrdenPagoAction(), obtenerDashboardLiberaciones(), obtenerDetalleInfraccionLiberaciones(), obtenerDocumentosLiberacion()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4400923d4e9f8488412e5c6771f48e52f35aedb0": "4400923 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[actions.ts, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx, LiberacionesTable.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bb10dcd3ff729120c088bc0aade7a65f5c7e48f0": "bb10dcd Formatos V1" | kind=Commit | source=git | neighbors=[adf0c3d vista de busqueda y juridico, feature/testing, main, route.ts, 06c55f5 Merge branch 'feature/testing' …, module-cards.tsx] | lang=en
- "radio_formsection": "FormSection.tsx" | kind=code-symbol | source=components/911/radio/FormSection.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 13f7f39 Reporte-incidentes, 14fd73a Update FormSection.tsx, 22b7b54 Merge branch 'feature/reportes'…, 305b0bd se quitan campos, 3ec7484 Header y Footer Fix] | lang=en
- "shared_infracciones": "infracciones.ts" | kind=code-symbol | source=lib/shared/infracciones.ts:L1 | neighbors=[actions.ts, service.ts, types.ts, actions.ts, actions.ts, types.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b1705997d7fe67b40632f6213447975cc693a3b9": "b170599 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[5830570 Seccion de analista, uya con bd…, page.tsx, ProfileDropdownAuxiliar.tsx, feature/testing, fix/subir-fotografias, main] | lang=en
- "incidentes_camaras_page": "page.tsx" | kind=code-symbol | source=app/incidentes_camaras/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 2516723 Modulo de permisos, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…] | lang=en
- "incidentes_permisos": "permisos.ts" | kind=code-symbol | source=lib/incidentes/permisos.ts:L1 | neighbors=[service.ts, route.ts, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed] | lang=en
- "juridico_page": "page.tsx" | kind=code-symbol | source=app/prevencion/juridico/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…] | lang=en
- "medidas_page": "page.tsx" | kind=code-symbol | source=app/prevencion/medidas/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 1970615 vista de medidas, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…] | lang=en
- "monitorista_actions": "actions.ts" | kind=code-symbol | source=lib/monitorista/actions.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "agente_juzgado_page": "page.tsx" | kind=code-symbol | source=app/agente_juzgado/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardJuzgado(), JuzgadoDashboardPage(), ToastExito.tsx, ToastExito(), helpers.ts] | lang=en
- "analisis_formanalisis": "formAnalisis.tsx" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L1 | neighbors=[btnBackStyle, btnFinishStyle, btnGeoStyle, btnNextStyle, cardStyle, footerActions] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6a042cd667d49fb424004538d0489dc9a7462329": "6a042cd feat: sistema de autenticación, dashboard y esquema de base de datos" | kind=Commit | source=git | neighbors=[page.tsx, route.ts, page.tsx, layout.tsx, feature/monitorista, feature/monitorista-reportes] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2e062304ce5eefae0e6963f20b03b7948764cfc": "a2e0623 Consolidado de formatos N y SubHeader, ajustes en servicios de reportes" | kind=Commit | source=git | neighbors=[page.tsx, feature/testing, main, 16a63d4 Merge branch 'feature/testing' …, page.tsx, page.tsx] | lang=nl
- "monitorista_mapper": "mapper.ts" | kind=code-symbol | source=lib/monitorista/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, bool(), num(), parseDetenidos(), parseSolicitudesJson()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-002.json

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
