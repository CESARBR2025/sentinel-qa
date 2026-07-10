# Node Description Batch 15 of 82

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

- "prevencion_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L3 | neighbors=[mapper.ts, rowToAutoridadAdicional(), rowToBusqueda(), rowToContestacion(), rowToFichaBusquedaDetalle(), rowToMedida()] | lang=en
- "reportes_form_styles_pagewrap": "pageWrap" | kind=code-symbol | source=components/reportes/form-styles.ts:L24 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "reportes_repository": "repository.ts" | kind=code-symbol | source=lib/reportes/repository.ts:L1 | neighbors=[514a705 refactorizacion sql, ad3ec5f mejorando esto, page.tsx, page.tsx, db.ts, query()] | lang=en
- "retencion_placa_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/retencion-placa/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, b5233a8 implementando via como modulo d…, ede5a1d eliminado referencias a via_pru…, f7b1aac Merge branch 'feature/testing' …] | lang=en
- "sasiete_types": "types.ts" | kind=code-symbol | source=features/via/saSiete/types.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapper.ts, repository.ts] | lang=en
- "scripts_load_context": "load-context.mjs" | kind=code-symbol | source=scripts/load-context.mjs:L1 | neighbors=[e6bffc9 boveda conectada, buildInstructions(), CONTEXT_MAP, __dirname, extractDomain(), GRAPH_JSON] | lang=en
- "steps_pasoinfraccion": "PasoInfraccion.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoInfraccion.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, PasoInfraccion()] | lang=en
- "steps_pasoubicacion": "PasoUbicacion.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacion.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, MapaDireccionRegistro.tsx, MapaDireccionRegistro()] | lang=en
- "via_pagos": "pagos.ts" | kind=code-symbol | source=lib/via/pagos.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ede5a1d eliminado referencias a via_pru…, route.ts, db.ts] | lang=en
- "wireframes_shared": "shared.jsx" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, Arrow(), Corner(), DarkFrame(), GridBG(), InputField()] | lang=en
- "admin_transito_patrullaselector": "PatrullaSelector.tsx" | kind=code-symbol | source=components/admin-transito/PatrullaSelector.tsx:L1 | neighbors=[NuevoOficialForm.tsx, PatrullaSelector(), Props, types.ts, PatrullaAsignacion, 16a63d4 Merge branch 'feature/testing' …] | lang=en
- "agente_infracciones_infraccionestable": "InfraccionesTable.tsx" | kind=code-symbol | source=components/agente_infracciones/InfraccionesTable.tsx:L1 | neighbors=[InfraccionesDashboard.tsx, columns, DataRow, InfraccionesTable(), InfraccionesTableProps, page.tsx] | lang=en
- "agente_infracciones_storecapturainfractor": "storeCapturaInfractor.ts" | kind=code-symbol | source=lib/agente_infracciones/storeCapturaInfractor.ts:L1 | neighbors=[CapturarDatosInfractorModal.tsx, CapturaInfractorActions, CapturaInfractorState, CapturaInfractorStore, initialState, useCapturaInfractorStore] | lang=en
- "camara_mapper": "mapper.ts" | kind=code-symbol | source=lib/camara/mapper.ts:L1 | neighbors=[rowToIncidenteCamara(), rowToTotalesCamara(), toNum(), toNumNullable(), toStr(), types.ts] | lang=en
- "camara_service": "service.ts" | kind=code-symbol | source=lib/camara/service.ts:L1 | neighbors=[repository.ts, obtenerIncidentesCamara(), obtenerTotalesCamara(), listarIncidentesCamara(), toStr(), 5618308 guardado e evidencias con ed] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@156c925834f49f42390ead1b4c5b351bca392f35": "156c925 vista de reporte de sin robos" | kind=Commit | source=git | neighbors=[feature/testing, dba1bfb color de boton, page.tsx, PaginacionSinRobos.tsx, ReporteSinRobos.tsx, ReportFilters.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@199ce68e039fafc9454c08a4d7e17170f45c7df0": "199ce68 Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publ…" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main, 2e36377 Eliminar tutoriales de flujo in…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@25de42811d8e92a9e713f5e451bfd1dc0c50f773": "25de428 Corrección para agregar el botón de cerrar sesion" | kind=Commit | source=git | neighbors=[page.tsx, ProfileDropdownAuxiliar.tsx, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@283f34200d56b11b1f2b38d62deeddc6d77e1f33": "283f342 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 3a00521 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2be4ca9ae4ff3a5d1b237b09267954a3b2df39fb": "2be4ca9 Cambio en header" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 3a00521 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2c128e5934bc8823af4c4288617bed8102fc687a": "2c128e5 test expediente vercel" | kind=Commit | source=git | neighbors=[feature/testing, 91c36bf validando orden de pago, abrirDocumento.ts, route.ts, route.ts, DetalleInfraccionView.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@49dca479f6546c67df478e85e13a41ece8cc067f": "49dca47 cambio" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 82ae6e9 Interfaz de llamada 911 cambios] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@51e682b4a77a674222e29c98761bac25baff6f72": "51e682b mejorando flujo de liberaciones" | kind=Commit | source=git | neighbors=[actions.ts, LiberacionesDashboard.tsx, mapper.ts, repository.ts, types.ts, feature/testing] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5d2b0640b03fd989c24c94e0bbbfe570c3ea2488": "5d2b064 fix vercel upload files" | kind=Commit | source=git | neighbors=[46f24f8 generica function for infractio…, actions.ts, LiberacionesDashboard.tsx, feature/testing, da48f68 implementando flujo de aceptaci…, CapturarInfractorSection.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5e458d61c890c8a4a9e8a990e5b1cc6d10496867": "5e458d6 navegacion" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6488a30d265406604e860f95a0a52143a16960c5": "6488a30 Formulario sin backend de 911 listo" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 283f342 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@77a125d75f6fc8bf59e520dfcdd575b65d0d1443": "77a125d Merge branch 'feature/monitorista-reportes' of https://github.com/presi…" | kind=Commit | source=git | neighbors=[5d179c0 Apartado de reportes, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8a59180baa7bce6e0d325fb3623bb7906d037f94": "8a59180 Form listo" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, a291695 Merge branch 'feature/testing' …] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9d67ddf4fb2eee14861eba2af608eb222dca0e86": "9d67ddf Cambios de formulario analisis" | kind=Commit | source=git | neighbors=[feature/testing, 9550203 Cambios en presentacion, se gen…, BitacoraIPH.tsx, page.tsx, route.ts, analistaService.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9d803f2b0cdcbfc7adad98132198efb5848f135e": "9d803f2 fix api maps" | kind=Commit | source=git | neighbors=[feature/testing, ec3acf7 iniciando reset de testing, page.tsx, page.tsx, FormularioRecorrido.tsx, repository.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a0ec8d2c2dfbfde9cb6ea5865a8732c2320f11aa": "a0ec8d2 topbar en 911" | kind=Commit | source=git | neighbors=[83f48a2 Merge branch 'feature/correccio…, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@aaab50d699cb73f927fb76c1cc49815d8080821b": "aaab50d Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publ…" | kind=Commit | source=git | neighbors=[2e36377 Eliminar tutoriales de flujo in…, 511fea4 Modulo de despacho, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ab3d8f668113174e104dae7ac21bde8f402d8626": "ab3d8f6 Formulario con stepper" | kind=Commit | source=git | neighbors=[a291695 Merge branch 'feature/testing' …, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c69454373882f48c57032868e9293749ba7b70cc": "c694543 cambio dee estatus" | kind=Commit | source=git | neighbors=[519716a Formulario para registro de wha…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ec57fd24ed14fc4836f80d87af0f99fc2146ea9f": "ec57fd2 Form actualizado" | kind=Commit | source=git | neighbors=[69a557f CAMBIO CORREGIDO, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "corralon_page": "page.tsx" | kind=code-symbol | source=app/corralon/page.tsx:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, actions.ts, obtenerDashboardCorralon(), obtenerSolicitudes(), module-card.tsx] | lang=en
- "d1_service": "service.ts" | kind=code-symbol | source=lib/d1/service.ts:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, page.tsx, repository.ts] | lang=en
- "deteccion_camara_reportfilters": "ReportFilters.tsx" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportFilters.tsx:L1 | neighbors=[5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, fa9df15 Reporte de cámaras] | lang=en
- "deteccion_camara_reporttables": "ReportTables.tsx" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportTables.tsx:L1 | neighbors=[5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, fa9df15 Reporte de cámaras] | lang=en
- "estadisticos_phonestatscards": "PhoneStatsCards.tsx" | kind=code-symbol | source=components/reportes/estadisticos/PhoneStatsCards.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 6f8a089 Vista de estadisticos diarios, …, e286619 Merge branch 'feature/testing' …, page.tsx, ReportStat.tsx] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-014.json

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
