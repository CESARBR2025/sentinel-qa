# Node Description Batch 11 of 93

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

- "reportes_operativos_types": "types.ts" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, ArmaRow] | lang=en
- "sasiete_repository": "repository.ts" | kind=code-symbol | source=features/via/saSiete/repository.ts:L1 | neighbors=[route.ts, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, ede5a1d eliminado referencias a via_pru…] | lang=en
- "scripts_trace_components": "trace-components.mjs" | kind=code-symbol | source=scripts/trace-components.mjs:L1 | neighbors=[11ee4f2 mejorando flujo de 911, 22bf125 Merge pull request #20 from pre…, 863c575 Merge pull request #24 from pre…, components, __dirname, dirty] | lang=en
- "911_filtrosincidentes": "FiltrosIncidentes.tsx" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L1 | neighbors=[btnBuscarStyle, btnLimpiarStyle, CANALES, CatalogoItem, ESTATUS, fieldStyle] | lang=en
- "admin_transito_nuevooficialform": "NuevoOficialForm.tsx" | kind=code-symbol | source=components/admin-transito/NuevoOficialForm.tsx:L1 | neighbors=[actions.ts, crearOficial(), Departamento, inputStyle, labelStyle, NuevoOficialForm()] | lang=en
- "agente_juzgado_detallesaseguradoview": "DetallesAseguradoView.tsx" | kind=code-symbol | source=components/agente_juzgado/DetallesAseguradoView.tsx:L1 | neighbors=[DetallesAseguradoView(), disabledSx, esImagen(), labelSx, Props, types.ts] | lang=en
- "agente_juzgado_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/agente_juzgado/ProfileDropdown.tsx:L1 | neighbors=[ProfileDropdown(), Props, auth-client.ts, authClient, 090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "app_layout": "layout.tsx" | kind=code-symbol | source=app/layout.tsx:L1 | neighbors=[metadata, RootLayout(), PageTransition.tsx, SmoothScroll.tsx, 0068216 Mejora de Dashboard, Login y tr…, 0d9172a mejorando flujo de 911-despacho] | lang=en
- "buscar_orden_route": "route.ts" | kind=code-symbol | source=app/api/via/sa7/buscar-orden/route.ts:L1 | neighbors=[service.ts, verificarRolInfracciones(), service.ts, verificarRolLiberaciones(), GET(), auth.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@11e88171582a012ea2cb786bb80b8ec3072123c6": "11e8817 Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@166a26b4031cf3f06e37d03445612176f0458ede": "166a26b Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 83f48a2 Merge branch 'feature/correccio…] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@74001357545900cbdfcb97dd271e360daac38e3d": "7400135 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[356d3a7 Subir rol agregado, falta darle…, 5d09f31 integración de componente de pa…, Pagination.tsx, feature/monitorista, feature/monitorista-reportes, feature/testing] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@86e93197ed0a6a560d8b403e68ef1883ab444a4e": "86e9319 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[5e458d6 navegacion, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b403f89a497d4ec089c09c8fcdb3f51ae3c3157b": "b403f89 Vista para reportes de incidentes por camaras y cambio den header" | kind=Commit | source=git | neighbors=[5aa5866 Cambio de colores en interfaz d…, feature/testing, fix/subir-fotografias, main, bf2e7ed Reportes del modulo de incident…, ReportFilters.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@da48f68a11b31923ca37285ae8882363e6bb81dd": "da48f68 implementando flujo de aceptacion de documentos" | kind=Commit | source=git | neighbors=[5d2b064 fix vercel upload files, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx, feature/testing] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ef95840b5ad7ebf42d66485abca37a97c02d16d9": "ef95840 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[0c8695c Cambios en filtros, 5ef7cf3 Agregar los campos faltantes, feature/testing, main, 4400923 Merge branch 'feature/testing' …, actions.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f7573dd0e86dd7c4c5da20b2ea194db4d3ce5d73": "f7573dd Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[72e8913 cambio de diseño, ef9e0ea Formulario arreglado, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=en
- "components_capturarinfractorsection": "CapturarInfractorSection.tsx" | kind=code-symbol | source=features/liberaciones/components/CapturarInfractorSection.tsx:L1 | neighbors=[LiberacionesDashboard.tsx, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…, 5d2b064 fix vercel upload files] | lang=en
- "denuncias_stored1": "storeD1.ts" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L1 | neighbors=[5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, FormularioD1.tsx] | lang=en
- "lib_auth_client": "auth-client.ts" | kind=code-symbol | source=lib/auth-client.ts:L1 | neighbors=[page.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdownAuxiliar.tsx, 6a042cd feat: sistema de autenticación,…] | lang=en
- "modulo_incidentes_reporttables": "ReportTables.tsx" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportTables.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 1265204 paginacion por tablas, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, b170599 Merge branch 'feature/testing' …] | lang=en
- "pendiente_analisis_page": "page.tsx" | kind=code-symbol | source=app/analisis/pendiente-analisis/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 3ec7484 Header y Footer Fix, 863c575 Merge pull request #24 from pre…, a6b7556 Formulario se puso a prueba, se…, fcb223f merge de testing, permisos.ts] | lang=en
- "prevencion_prevencionnav": "PrevencionNav.tsx" | kind=code-symbol | source=app/prevencion/PrevencionNav.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 1970615 vista de medidas, 41ea169 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 7e39526 Mejoras UI/UX] | lang=en
- "reporte_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/[id]/reporte/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a58a0f7 Despachos, ad3ec5f mejorando esto] | lang=en
- "reportes_incidentes_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-incidentes/repository.ts:L1 | neighbors=[13f7f39 Reporte-incidentes, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, f7b1aac Merge branch 'feature/testing' …, fcb223f merge de testing, db.ts] | lang=en
- "rol_servicios_servicetable": "ServiceTable.tsx" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, b68a2b7 Merge branch 'feature/testing' …, c27a9ee fase prefinal, f9243ac Interfaz de formulario de rol d…, page.tsx] | lang=en
- "scripts_populate_vault": "populate-vault.mjs" | kind=code-symbol | source=scripts/populate-vault.mjs:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 3c12c41 cambios en flujo de 911-despacho, 863c575 Merge pull request #24 from pre…, CWD, __dirname] | lang=en
- "solicitudes_solicitudes_client": "solicitudes-client.tsx" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, 863c575 Merge pull request #24 from pre…, page.tsx, types.ts] | lang=en
- "steps_pasociudadano": "PasoCiudadano.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadano.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadano()] | lang=en
- "ui_toast": "Toast.tsx" | kind=code-symbol | source=components/ui/Toast.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, f2c66e6 Extender roles y permisos finos…, AccionesDetenido.tsx] | lang=en
- "via_expediente": "expediente.ts" | kind=code-symbol | source=lib/via/expediente.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5618308 guardado e evidencias con ed, 863c575 Merge pull request #24 from pre…] | lang=en
- "admin_transito_oficialestable": "OficialesTable.tsx" | kind=code-symbol | source=components/admin-transito/OficialesTable.tsx:L1 | neighbors=[ModalDestituirOficial.tsx, ModalReactivarOficial.tsx, AccionModal, Departamento, Oficial, OficialesTable()] | lang=en
- "agente_juzgado_formularioaseguradojuzgado": "FormularioAseguradoJuzgado.tsx" | kind=code-symbol | source=components/agente_juzgado/FormularioAseguradoJuzgado.tsx:L1 | neighbors=[concatNombre(), disabledSx, displayVal(), FormularioAseguradoJuzgado(), labelSx, Props] | lang=en
- "atendidos_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/atendidos/route.ts:L1 | neighbors=[GET(), permisos.ts, verificarAccesoIncidentesApi(), repository.ts, listarIncidentesAtendidos(), auth.ts] | lang=en
- "auth_helpers_obtenerhubrol": "obtenerHubRol()" | kind=code-symbol | source=lib/auth/helpers.ts:L65 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "c4_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/c4/route.ts:L1 | neighbors=[POST(), auth.ts, auth, actions.ts, createSolicitudC4Api(), permisos.ts] | lang=en
- "cancelar_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/cancelar/route.ts:L1 | neighbors=[POST(), auth.ts, auth, actions.ts, cancelarFichaApi(), permisos.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@16df1286eab91ffb1ff2955737ba9e4abc42cd47": "16df128 flujo de corralones listo" | kind=Commit | source=git | neighbors=[feature/testing, main, ede5a1d eliminado referencias a via_pru…, actions.ts, page.tsx, repository.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@25167235624891e98af3080d98f97e1a435923e6": "2516723 Modulo de permisos" | kind=Commit | source=git | neighbors=[22b7b54 Merge branch 'feature/reportes'…, feature/testing, main, 06c55f5 Merge branch 'feature/testing' …, page.tsx, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2ca9f50c34a034d79d53d0a1a8971bf85be26d26": "2ca9f50 Formulario sin backend" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, page.tsx, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-010.json

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
