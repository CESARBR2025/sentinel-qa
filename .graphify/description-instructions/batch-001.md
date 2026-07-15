# Node Description Batch 2 of 93

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

- "incidentes_page": "page.tsx" | kind=code-symbol | source=app/incidentes/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 27dcb21 Merge branch 'feature/testing' …] | lang=en
- "incidentes_repository": "repository.ts" | kind=code-symbol | source=lib/incidentes/repository.ts:L1 | neighbors=[route.ts, 0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 22bf125 Merge pull request #20 from pre…, 290d651 feat(despacho): flujo integral …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@23b73129c2f870345a5ea9ae06130efd4edb9c3d": "23b7312 Merge pull request #16 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[route.ts, feature/testing, main, route.ts, page.tsx, 27dcb21 Merge branch 'feature/testing' …] | lang=en
- "agente_juzgado_service": "service.ts" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L1 | neighbors=[actions.ts, mapper.ts, rowToInfraccionDetalle(), rowToSolicitud(), permisos.ts, tienePermiso()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@41ea1699ac40a99ef356a334546660dfaefff011": "41ea169 Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[2db162a flujo de asegurados, formAnalisis.tsx, generarPresentacion.tsx, page.tsx, TablonAnalisis.tsx, feature/testing] | lang=en
- "lib_db_query": "query()" | kind=code-symbol | source=lib/db.ts:L31 | neighbors=[permisos.ts, repository.ts, repository.ts, actions.ts, repository.ts, repository.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b5233a82ff6cdaa44445eeadb60b9a8f8233d459": "b5233a8 implementando via como modulo de oficial" | kind=Commit | source=git | neighbors=[41ea169 Merge branch 'testing' into con…, route.ts, feature/testing, main, route.ts, page.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c27a9eeb8dc1ad2c66bb4fb64ab58a8f2dccc584": "c27a9ee fase prefinal" | kind=Commit | source=git | neighbors=[ad3ec5f mejorando esto, actions.ts, repository.ts, mapper.ts, ModalReactivarOficial.tsx, PatrullaSelector.tsx] | lang=pt
- "solicitudes_page": "page.tsx" | kind=code-symbol | source=app/monitorista/solicitudes/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 090c4dd vista de fiscalia, 1f7c0d7 Merge pull request #23 from pre…, 27dcb21 Merge branch 'feature/testing' …, 375d265 flujo de fiscalia, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "prevencion_actions": "actions.ts" | kind=code-symbol | source=lib/prevencion/actions.ts:L1 | neighbors=[route.ts, route.ts, route.ts, 0e33bf6 feat: módulo Admin, Prórroga, F…, 11be750 Fase 1 de correccion - completa…, 27dcb21 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a291695e8d20fda138e5330f5b80fd8cef6ab0cc": "a291695 Merge branch 'feature/testing' into feature/denuncias" | kind=Commit | source=git | neighbors=[8a59180 Form listo, Pagination.tsx, actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a7218bd27f8db074ada552213289bb91e8f8d096": "a7218bd Merge pull request #4 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[44ebbc4 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, actions.ts, actions.ts, CapturarDetallesForm.tsx, CerrarCasoModal.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ffcea0cb3f70ad7da3af26ca1425cb82a4090b69": "ffcea0c fase 1 completada" | kind=Commit | source=git | neighbors=[11be750 Fase 1 de correccion - completa…, layout.tsx, layout.tsx, route.ts, route.ts, page.tsx] | lang=en
- "oficial_types": "types.ts" | kind=code-symbol | source=lib/oficial/types.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 16a63d4 Merge branch 'feature/testing' …, 1f7c0d7 Merge pull request #23 from pre…] | lang=en
- "prevencion_repository": "repository.ts" | kind=code-symbol | source=lib/prevencion/repository.ts:L1 | neighbors=[route.ts, page.tsx, route.ts, 0caf5dd Fixes, 514a705 refactorizacion sql, 863c575 Merge pull request #24 from pre…] | lang=en
- "monitorista_service": "service.ts" | kind=code-symbol | source=lib/monitorista/service.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, route.ts, page.tsx, denuncia-service.ts, detenido-service.ts] | lang=en
- "reportes_page": "page.tsx" | kind=code-symbol | source=app/reportes/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 06c55f5 Merge branch 'feature/testing' …, 0c31cc2 Merge branch 'testing' into juz…, 18f5bac llamada en card] | lang=en
- "dashboard_page": "page.tsx" | kind=code-symbol | source=app/dashboard/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 06c55f5 Merge branch 'feature/testing' …, 090c4dd vista de fiscalia, 0b210fa Merge pull request #12 from pre…] | lang=en
- "denuncias_formulariod1": "FormularioD1.tsx" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0c31cc2 Merge branch 'testing' into juz…, 11e8817 Merge branch 'testing' into juz…, 1e81ec8 Datos se autorellenan de denunc…, 1f7c0d7 Merge pull request #23 from pre…, 27dcb21 Merge branch 'feature/testing' …] | lang=en
- "agente_juzgado_repository": "repository.ts" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L1 | neighbors=[actions.ts, actualizarDetallesAsegurado(), actualizarEstadoSolicitud(), actualizarOficioJuzgado(), actualizarSolicitudConEvidencias(), finalizarProcesoJuzgado()] | lang=en
- "nueva_page": "page.tsx" | kind=code-symbol | source=app/prevencion/medidas/nueva/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 27dcb21 Merge branch 'feature/testing' …, 3800cab formulario de nueva medida de p…, 41ea169 Merge branch 'testing' into con…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@552d291f19c583fad6cee776f6210f266f8fabac": "552d291 Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[22b7b54 Merge branch 'feature/reportes'…, feature/testing, main, 2db162a flujo de asegurados, 2dde720 Merge pull request #14 from pre…, D1Filters.tsx] | lang=en
- "agente_infracciones_repository": "repository.ts" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L1 | neighbors=[mapper.ts, inputToDbParams(), actualizarDatosInfractor(), actualizarDatosInfractorIniciarProceso(), actualizarEstatusDependenciaMesaControl…, actualizarEstatusPendientePagoInfraccio…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@046f18c8b7b4263a66e0652a8b26b7d81b5036b4": "046f18c Merge pull request #19 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[03f8b2a implementado rbac, permisos.ts, permisos.ts, page.tsx, service.ts, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ac9ad49cfd85b1cf312265350039fa1e9891241f": "ac9ad49 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[046f18c Merge pull request #19 from pre…, 5641e69 Merge branch 'feature/testing' …, permisos.ts, permisos.ts, page.tsx, service.ts] | lang=en
- "permisos_core": "core.ts" | kind=code-symbol | source=lib/permisos/core.ts:L1 | neighbors=[permisos.ts, permisos.ts, permisos.ts, permisos.ts, permisos.ts, permisos.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@03f8b2a0f704f60c437edc742d964aae35445ff0": "03f8b2a implementado rbac" | kind=Commit | source=git | neighbors=[permisos.ts, permisos.ts, page.tsx, service.ts, page.tsx, service.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7e395260a4f05728c3b733f9c2c9fb048358cc07": "7e39526 Mejoras UI/UX" | kind=Commit | source=git | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 67b1cb7 ReporteWord, not-found.tsx, feature/testing, main, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@22bf1257dbe4384179fa69ba831bdee048b50169": "22bf125 Merge pull request #20 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[0caf5dd Fixes, FiltrosIncidentes.tsx, Pagination.tsx, repository.ts, service.ts, layout.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c95f412847e8915bbb91b5fbc2848cb64e57ebc2": "c95f412 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[06c55f5 Merge branch 'feature/testing' …, baae82f diseño de medidas de proteccion, feature/testing, main, route.ts, c1ed4c3 cambios en busquedas] | lang=en
- "reportes_permisos": "permisos.ts" | kind=code-symbol | source=lib/reportes/permisos.ts:L1 | neighbors=[route.ts, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@55587511b4ee8287ffcaf4b0c7723daeed5c0b5b": "5558751 feat: módulo Prevención del Delito completo + fix flujo autenticación 2…" | kind=Commit | source=git | neighbors=[route.ts, layout.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=en
- "oficial_mapper": "mapper.ts" | kind=code-symbol | source=lib/oficial/mapper.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 16a63d4 Merge branch 'feature/testing' …, 1f7c0d7 Merge pull request #23 from pre…, 22bf125 Merge pull request #20 from pre…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9faf222a5f0d4eaaea5805ee9b412b41b8fe3050": "9faf222 Merge branch 'feature/testing' into feature/reportes" | kind=Commit | source=git | neighbors=[8355ac0 Merge branch 'feature/testing' …, actions.ts, FormularioAseguradoJuzgado.tsx, page.tsx, repository.ts, service.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f5fac0b477199b12441fe512f50e6d38c133f060": "f5fac0b Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[5a1b5d5 empezando corralon, af993fb Fix/Monitorista, repository.ts, page.tsx, repository.ts, feature/testing] | lang=en
- "reportes_operativos_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-operativos/repository.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 07543de Conexion de reportes con d1 y l…, 16a63d4 Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…] | lang=en
- "shared_detalleinfraccionview": "DetalleInfraccionView.tsx" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 06c55f5 Merge branch 'feature/testing' …, 0b210fa Merge pull request #12 from pre…, 16a63d4 Merge branch 'feature/testing' …, 1acddac Merge branch 'feature/testing' …, 2c128e5 test expediente vercel] | lang=en
- "fiscalia_mapper": "mapper.ts" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L1 | neighbors=[repository.ts, 067c4de arreglando flujo de fiscalia  a…, 090c4dd vista de fiscalia, 0b210fa Merge pull request #12 from pre…, 16a63d4 Merge branch 'feature/testing' …, 1acddac Merge branch 'feature/testing' …] | lang=en
- "oficial_formulariorecorrido": "FormularioRecorrido.tsx" | kind=code-symbol | source=components/oficial/FormularioRecorrido.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 067c4de arreglando flujo de fiscalia  a…, 0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 16a63d4 Merge branch 'feature/testing' …] | lang=en
- "agente_juzgado_types": "types.ts" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L1 | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, JuzgadoDashboard.tsx, mapper.ts, repository.ts] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-001.json

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
