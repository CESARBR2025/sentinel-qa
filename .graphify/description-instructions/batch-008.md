# Node Description Batch 9 of 79

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

- "flota_repository": "repository.ts" | kind=code-symbol | source=lib/flota/repository.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, mapper.ts, rowToPatrulla()] | lang=en
- "flota_types": "types.ts" | kind=code-symbol | source=lib/flota/types.ts:L1 | neighbors=[ModalReactivarOficial.tsx, NuevoOficialForm.tsx, OficialesTable.tsx, PatrullaSelector.tsx, 16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "generar_ppt_page": "page.tsx" | kind=code-symbol | source=app/analisis/generar-ppt/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, generarPresentacion.tsx] | lang=en
- "notificaciones_checker": "checker.ts" | kind=code-symbol | source=lib/notificaciones/checker.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 11be750 Fase 1 de correccion - completa…, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "prevencion_agregarautoridadform": "AgregarAutoridadForm.tsx" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, baae82f diseño de medidas de proteccion, page.tsx] | lang=en
- "reportes_operativos_types": "types.ts" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, ArmaRow, CateoRow] | lang=en
- "rondin_page": "page.tsx" | kind=code-symbol | source=app/911/rondin/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 4d4a9b7 formulario de notificaciones po…, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 7f3fe1a Formulariop de Rondines listo, …] | lang=en
- "sasiete_repository": "repository.ts" | kind=code-symbol | source=features/via/saSiete/repository.ts:L1 | neighbors=[route.ts, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, ede5a1d eliminado referencias a via_pru…, f7b1aac Merge branch 'feature/testing' …] | lang=en
- "admin_transito_nuevooficialform": "NuevoOficialForm.tsx" | kind=code-symbol | source=components/admin-transito/NuevoOficialForm.tsx:L1 | neighbors=[actions.ts, crearOficial(), Departamento, inputStyle, labelStyle, NuevoOficialForm()] | lang=en
- "agente_juzgado_detallesaseguradoview": "DetallesAseguradoView.tsx" | kind=code-symbol | source=components/agente_juzgado/DetallesAseguradoView.tsx:L1 | neighbors=[DetallesAseguradoView(), disabledSx, esImagen(), labelSx, Props, types.ts] | lang=en
- "agente_juzgado_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/agente_juzgado/ProfileDropdown.tsx:L1 | neighbors=[page.tsx, ProfileDropdown(), Props, auth-client.ts, authClient, page.tsx] | lang=en
- "agente_liberaciones_service": "service.ts" | kind=code-symbol | source=lib/agente_liberaciones/service.ts:L1 | neighbors=[actions.ts, mapper.ts, rowToLiberacion(), repository.ts, obtenerLiberaciones(), obtenerRolUsuario()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5ed311a75808b99e806e1f6fae238fec714aaa6d": "5ed311a Merge pull request #5 from presidenciaSJR/fix/detenidos" | kind=Commit | source=git | neighbors=[23a3b9d Cambios en la estructura de los…, 5abc683 Merge branch 'feature/auxiliar'…, conexion, testing, 810844a Cambios en la estructura de los…, bd1a223 Merge branch 'feature/vistas-re…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ff9f8c2cf5f985441183c8ff42a3a0ae0fdc6baa": "ff9f8c2 Modulo de Auxiliares" | kind=Commit | source=git | neighbors=[160d1e1 Monitorista V1.1, actions.ts, mapper.ts, page.tsx, repository.ts, service.ts] | lang=nl
- "components_capturarinfractorsection": "CapturarInfractorSection.tsx" | kind=code-symbol | source=features/liberaciones/components/CapturarInfractorSection.tsx:L1 | neighbors=[LiberacionesDashboard.tsx, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…, 5d2b064 fix vercel upload files] | lang=en
- "denuncias_stored1": "storeD1.ts" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L1 | neighbors=[5f13b34 Merge branch 'feature/testing' …, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, FormularioD1.tsx, ahora] | lang=en
- "exportar_robo_route": "route.ts" | kind=code-symbol | source=app/api/auxiliar/exportar-robo/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…] | lang=en
- "finalizarproceso_route": "route.ts" | kind=code-symbol | source=app/api/agente_juzgado/finalizarProceso/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 75e03e9 puliendo flujo de juzgado-liber…, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "fiscalia_detallesaseguradoview": "DetallesAseguradoView.tsx" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L1 | neighbors=[5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, DetallesAseguradoView(), disabledSx] | lang=en
- "incidentes_service": "service.ts" | kind=code-symbol | source=lib/incidentes/service.ts:L1 | neighbors=[13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 5ef7cf3 Agregar los campos faltantes, 712c116 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…] | lang=en
- "iniciarproceso_route": "route.ts" | kind=code-symbol | source=app/api/agente_juzgado/iniciarProceso/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 75e03e9 puliendo flujo de juzgado-liber…, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "lib_auth_client": "auth-client.ts" | kind=code-symbol | source=lib/auth-client.ts:L1 | neighbors=[page.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdownAuxiliar.tsx, 6a042cd feat: sistema de autenticación,…] | lang=en
- "monitorista_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/monitorista/permisos.ts:L13 | neighbors=[route.ts, page.tsx, route.ts, route.ts, route.ts, page.tsx] | lang=en
- "oficial_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/oficial/ProfileDropdown.tsx:L1 | neighbors=[layout.tsx, page.tsx, 0fe445e vista de oficial, 16a63d4 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 93dd3ea Merge pull request #1 from pres…] | lang=en
- "oficiales_page": "page.tsx" | kind=code-symbol | source=app/admin-transito/oficiales/page.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, actions.ts] | lang=en
- "reporte_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/[id]/reporte/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, a58a0f7 Despachos, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "reportes_incidentes_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-incidentes/repository.ts:L1 | neighbors=[13f7f39 Reporte-incidentes, ad3ec5f mejorando esto, f7b1aac Merge branch 'feature/testing' …, fcb223f merge de testing, db.ts, query()] | lang=en
- "rol_servicios_page": "page.tsx" | kind=code-symbol | source=app/rol_servicios/page.tsx:L1 | neighbors=[a2e0623 Consolidado de formatos N y Sub…, b68a2b7 Merge branch 'feature/testing' …, c27a9ee fase prefinal, f5fac0b Merge branch 'testing' into con…, SubHeader.tsx, SubHeader()] | lang=en
- "steps_pasociudadano": "PasoCiudadano.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadano.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadano(), Props] | lang=en
- "via_expediente": "expediente.ts" | kind=code-symbol | source=lib/via/expediente.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5618308 guardado e evidencias con ed, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "911_pagination": "Pagination.tsx" | kind=code-symbol | source=components/911/Pagination.tsx:L1 | neighbors=[arrowBtnStyle, containerStyle, infoStyle, labelStyle, pageNumberStyle, Pagination()] | lang=en
- "agente_juzgado_formularioaseguradojuzgado": "FormularioAseguradoJuzgado.tsx" | kind=code-symbol | source=components/agente_juzgado/FormularioAseguradoJuzgado.tsx:L1 | neighbors=[concatNombre(), disabledSx, displayVal(), FormularioAseguradoJuzgado(), labelSx, Props] | lang=en
- "atendidos_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/atendidos/route.ts:L1 | neighbors=[GET(), permisos.ts, verificarAccesoIncidentesApi(), repository.ts, listarIncidentesAtendidos(), auth.ts] | lang=en
- "c4_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/c4/route.ts:L1 | neighbors=[POST(), auth.ts, auth, actions.ts, createSolicitudC4Api(), permisos.ts] | lang=en
- "cancelar_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/cancelar/route.ts:L1 | neighbors=[POST(), auth.ts, auth, actions.ts, cancelarFichaApi(), permisos.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@511fea4852dac57d7ddd8e358852e232259c8c75": "511fea4 Modulo de despacho" | kind=Commit | source=git | neighbors=[page.tsx, route.ts, conexion, testing, 0fe445e vista de oficial, aaab50d Merge branch 'main' of https://…] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6109a7ac819aa22f0e87f9e6347104c452537239": "6109a7a replicando flujo para fiscalia" | kind=Commit | source=git | neighbors=[TabSolicitudes.tsx, conexion, testing, a7218bd Merge pull request #4 from pres…, actions.ts, CapturarDetallesForm.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@da48f68a11b31923ca37285ae8882363e6bb81dd": "da48f68 implementando flujo de aceptacion de documentos" | kind=Commit | source=git | neighbors=[5d2b064 fix vercel upload files, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx, conexion] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ec1b6584fcf4cc89f42581bdcc1f53587a5c5aaa": "ec1b658 implementando layaredArchitecture para rol de oficial" | kind=Commit | source=git | neighbors=[9ec6056 flujo de juzgado-monitorista co…, conexion, testing, 92393e7 flujo completado de juzgado, FormularioD1.tsx, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ef95840b5ad7ebf42d66485abca37a97c02d16d9": "ef95840 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[0c8695c Cambios en filtros, 5ef7cf3 Agregar los campos faltantes, conexion, testing, 4400923 Merge branch 'feature/testing' …, actions.ts] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-008.json

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
