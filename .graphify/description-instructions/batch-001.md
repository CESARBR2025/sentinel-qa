# Node Description Batch 2 of 79

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ffcea0cb3f70ad7da3af26ca1425cb82a4090b69": "ffcea0c fase 1 completada" | kind=Commit | source=git | neighbors=[11be750 Fase 1 de correccion - completa…, page.tsx, layout.tsx, layout.tsx, route.ts, route.ts] | lang=en
- "monitorista_service": "service.ts" | kind=code-symbol | source=lib/monitorista/service.ts:L1 | neighbors=[c27a9ee fase prefinal, route.ts, page.tsx, denuncia-service.ts, detenido-service.ts, incidentes-camara-service.ts] | lang=en
- "prevencion_repository": "repository.ts" | kind=code-symbol | source=lib/prevencion/repository.ts:L1 | neighbors=[route.ts, page.tsx, route.ts, 514a705 refactorizacion sql, ad3ec5f mejorando esto, c27a9ee fase prefinal] | lang=en
- "agente_juzgado_repository": "repository.ts" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L1 | neighbors=[actions.ts, actualizarDetallesAsegurado(), actualizarEstadoSolicitud(), actualizarOficioJuzgado(), actualizarSolicitudConEvidencias(), finalizarProcesoJuzgado()] | lang=en
- "incidentes_page": "page.tsx" | kind=code-symbol | source=app/incidentes/page.tsx:L1 | neighbors=[133bb9d pages de listado de llamadas y …, 27dcb21 Merge branch 'feature/testing' …, 3b0e087 NAVEGACION, 44ebbc4 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a291695e8d20fda138e5330f5b80fd8cef6ab0cc": "a291695 Merge branch 'feature/testing' into feature/denuncias" | kind=Commit | source=git | neighbors=[8a59180 Form listo, page.tsx, Pagination.tsx, actions.ts, page.tsx, ProfileDropdown.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a7218bd27f8db074ada552213289bb91e8f8d096": "a7218bd Merge pull request #4 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[44ebbc4 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, actions.ts, actions.ts, CapturarDetallesForm.tsx, CerrarCasoModal.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@552d291f19c583fad6cee776f6210f266f8fabac": "552d291 Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[22b7b54 Merge branch 'feature/reportes'…, conexion, testing, 2db162a flujo de asegurados, 2dde720 Merge pull request #14 from pre…, D1Filters.tsx] | lang=en
- "agente_infracciones_repository": "repository.ts" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L1 | neighbors=[mapper.ts, inputToDbParams(), actualizarDatosInfractor(), actualizarDatosInfractorIniciarProceso(), actualizarEstatusDependenciaMesaControl…, actualizarEstatusPendientePagoInfraccio…] | lang=en
- "denuncias_formulariod1": "FormularioD1.tsx" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 11e8817 Merge branch 'testing' into juz…, 1e81ec8 Datos se autorellenan de denunc…, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed] | lang=en
- "dashboard_page": "page.tsx" | kind=code-symbol | source=app/dashboard/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 090c4dd vista de fiscalia, 0b210fa Merge pull request #12 from pre…, 0fe445e vista de oficial, 11e8817 Merge branch 'testing' into juz…, 126b4d1 Monitorista V1] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c95f412847e8915bbb91b5fbc2848cb64e57ebc2": "c95f412 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[06c55f5 Merge branch 'feature/testing' …, baae82f diseño de medidas de proteccion, conexion, testing, route.ts, c1ed4c3 cambios en busquedas] | lang=en
- "nueva_page": "page.tsx" | kind=code-symbol | source=app/prevencion/medidas/nueva/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 27dcb21 Merge branch 'feature/testing' …, 3800cab formulario de nueva medida de p…, 41ea169 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…] | lang=en
- "reportes_operativos_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-operativos/repository.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 07543de Conexion de reportes con d1 y l…, 16a63d4 Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, a2e0623 Consolidado de formatos N y Sub…] | lang=en
- "reportes_page": "page.tsx" | kind=code-symbol | source=app/reportes/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 0c31cc2 Merge branch 'testing' into juz…, 18f5bac llamada en card, 2516723 Modulo de permisos, 41ea169 Merge branch 'testing' into con…, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9faf222a5f0d4eaaea5805ee9b412b41b8fe3050": "9faf222 Merge branch 'feature/testing' into feature/reportes" | kind=Commit | source=git | neighbors=[8355ac0 Merge branch 'feature/testing' …, actions.ts, FormularioAseguradoJuzgado.tsx, page.tsx, repository.ts, service.ts] | lang=en
- "fiscalia_mapper": "mapper.ts" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L1 | neighbors=[repository.ts, 067c4de arreglando flujo de fiscalia  a…, 090c4dd vista de fiscalia, 0b210fa Merge pull request #12 from pre…, 16a63d4 Merge branch 'feature/testing' …, 1acddac Merge branch 'feature/testing' …] | lang=en
- "shared_detalleinfraccionview": "DetalleInfraccionView.tsx" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 06c55f5 Merge branch 'feature/testing' …, 0b210fa Merge pull request #12 from pre…, 16a63d4 Merge branch 'feature/testing' …, 1acddac Merge branch 'feature/testing' …, 2c128e5 test expediente vercel] | lang=en
- "agente_juzgado_types": "types.ts" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L1 | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, JuzgadoDashboard.tsx, mapper.ts, repository.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f5fac0b477199b12441fe512f50e6d38c133f060": "f5fac0b Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[5a1b5d5 empezando corralon, af993fb Fix/Monitorista, repository.ts, page.tsx, repository.ts, conexion] | lang=en
- "oficial_types": "types.ts" | kind=code-symbol | source=lib/oficial/types.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 0c31cc2 Merge branch 'testing' into juz…, 13f7f39 Reporte-incidentes, 16a63d4 Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@55587511b4ee8287ffcaf4b0c7723daeed5c0b5b": "5558751 feat: módulo Prevención del Delito completo + fix flujo autenticación 2…" | kind=Commit | source=git | neighbors=[route.ts, layout.tsx, main, page.tsx, route.ts, route.ts] | lang=en
- "rol_servicios_repository": "repository.ts" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L1 | neighbors=[c27a9ee fase prefinal, actions.ts, catalogos-actions.ts, db.ts, query(), mapper.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@067c4de0f888d71365929c30f7c50aacb9161dec": "067c4de arreglando flujo de fiscalia  a schema via" | kind=Commit | source=git | neighbors=[repository.ts, CargarOficioSection.tsx, mapper.ts, repository.ts, types.ts, actions.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@514a70512b9c2a0c6231575c83202e2d4f55f4c9": "514a705 refactorizacion sql" | kind=Commit | source=git | neighbors=[12aab65 fase 4, page.tsx, repository.ts, repository.ts, page.tsx, conexion] | lang=pt
- "reportes_operativos_service": "service.ts" | kind=code-symbol | source=lib/reportes-operativos/service.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 07543de Conexion de reportes con d1 y l…, 16a63d4 Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "detenidos_page": "page.tsx" | kind=code-symbol | source=app/monitorista/detenidos/page.tsx:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1acddacffcb1e329ce46331427b0b00ca45b65ec": "1acddac Merge branch 'feature/testing' into feature/reportes" | kind=Commit | source=git | neighbors=[07543de Conexion de reportes con d1 y l…, actions.ts, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx] | lang=en
- "agente_liberaciones_actions": "actions.ts" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L1 | neighbors=[capturarInfractorAction(), finalizarRevisionAction(), generarOrdenPagoAction(), obtenerDashboardLiberaciones(), obtenerDetalleInfraccionLiberaciones(), obtenerDocumentosLiberacion()] | lang=en
- "prevencion_permisos": "permisos.ts" | kind=code-symbol | source=lib/prevencion/permisos.ts:L1 | neighbors=[route.ts, page.tsx, route.ts, route.ts, route.ts, 27dcb21 Merge branch 'feature/testing' …] | lang=en
- "reportes_permisos": "permisos.ts" | kind=code-symbol | source=lib/reportes/permisos.ts:L1 | neighbors=[route.ts, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, page.tsx] | lang=en
- "shared_infracciones": "infracciones.ts" | kind=code-symbol | source=lib/shared/infracciones.ts:L1 | neighbors=[actions.ts, service.ts, types.ts, actions.ts, actions.ts, types.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4400923d4e9f8488412e5c6771f48e52f35aedb0": "4400923 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[actions.ts, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx, LiberacionesTable.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5d179c0781f151d3144b7f36607dd488f2d4cbd8": "5d179c0 Apartado de reportes" | kind=Commit | source=git | neighbors=[conexion, testing, 77a125d Merge branch 'feature/monitoris…, route.ts, route.ts, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8e6c8c679f186e64d153cc1602969fd5a1a88b03": "8e6c8c6 Apartado de reportes" | kind=Commit | source=git | neighbors=[44ebbc4 Merge branch 'feature/testing' …, conexion, testing, 77a125d Merge branch 'feature/monitoris…, route.ts, route.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bb10dcd3ff729120c088bc0aade7a65f5c7e48f0": "bb10dcd Formatos V1" | kind=Commit | source=git | neighbors=[adf0c3d vista de busqueda y juridico, conexion, testing, route.ts, 06c55f5 Merge branch 'feature/testing' …, module-cards.tsx] | lang=en
- "exportar_route": "route.ts" | kind=code-symbol | source=app/api/reportes-telefonicos/exportar/route.ts:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "modulo_incidentes_page": "page.tsx" | kind=code-symbol | source=app/modulo_incidentes/page.tsx:L1 | neighbors=[2516723 Modulo de permisos, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 4400923 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, 552d291 Merge branch 'testing' into con…] | lang=en
- "permisos_core": "core.ts" | kind=code-symbol | source=lib/permisos/core.ts:L1 | neighbors=[permisos.ts, permisos.ts, permisos.ts, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "monitorista_mapper": "mapper.ts" | kind=code-symbol | source=lib/monitorista/mapper.ts:L1 | neighbors=[c27a9ee fase prefinal, bool(), num(), parseDetenidos(), parseSolicitudesJson(), parseTurno()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-001.json

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
