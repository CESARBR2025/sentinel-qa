# Node Description Batch 14 of 79

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

- "oficial_mapaubicacion": "MapaUbicacion.tsx" | kind=code-symbol | source=components/oficial/MapaUbicacion.tsx:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 93dd3ea Merge pull request #1 from pres…, a291695 Merge branch 'feature/testing' …, aaddee5 Merge branch 'feature/testing' …] | lang=en
- "oficiales_repository": "repository.ts" | kind=code-symbol | source=features/via/oficiales/repository.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, db.ts, query()] | lang=en
- "ordensalida_generarordensalida": "generarOrdenSalida.ts" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, ac48eb1 Merge pull request #17 from pre…, route.ts, drawWatermark(), formatearFecha()] | lang=en
- "partials_footer_dashboardfooter": "DashboardFooter()" | kind=code-symbol | source=components/partials/Footer.tsx:L1 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "rol_servicios_catalogos_actions_togglecatalogo": "toggleCatalogo()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L27 | neighbors=[catalogos-actions.ts, toggleBodyCam(), req(), requireAdmin(), toggleConcepto(), toggleMedioCanalizacion()] | lang=en
- "rol_servicios_layout": "layout.tsx" | kind=code-symbol | source=app/rol_servicios/layout.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…, helpers.ts] | lang=en
- "sasiete_mapper": "mapper.ts" | kind=code-symbol | source=features/via/saSiete/mapper.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapRowToOrdenPago(), OrdenPagoRow] | lang=en
- "sin_robos_paginacionsinrobos": "PaginacionSinRobos.tsx" | kind=code-symbol | source=components/reportes/sin_robos/PaginacionSinRobos.tsx:L1 | neighbors=[156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, PaginacionSinRobos(), paginationButtonStyle] | lang=en
- "sin_robos_reportfilters": "ReportFilters.tsx" | kind=code-symbol | source=components/reportes/sin_robos/ReportFilters.tsx:L1 | neighbors=[156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, e286619 Merge branch 'feature/testing' …] | lang=en
- "steps_pasoconfirmacion": "PasoConfirmacion.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacion.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoConfirmacion(), PasoConfirmacionProps] | lang=en
- "steps_pasoubicacionevidencias": "PasoUbicacionEvidencias.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacionEvidencias.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, PasoEvidencias.tsx] | lang=en
- "templates_orden_liberacion": "orden-liberacion.ts" | kind=code-symbol | source=lib/emails/templates/orden-liberacion.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, ac48eb1 Merge pull request #17 from pre…, server.ts, layout.ts, emailLayout()] | lang=en
- "agente_infracciones_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/agente_infracciones/ProfileDropdown.tsx:L1 | neighbors=[page.tsx, ProfileDropdown(), Props, auth-client.ts, authClient, 06c55f5 Merge branch 'feature/testing' …] | lang=en
- "app_layout": "layout.tsx" | kind=code-symbol | source=app/layout.tsx:L1 | neighbors=[metadata, RootLayout(), LoadingProvider.tsx, 2db162a flujo de asegurados, 5558751 feat: módulo Prevención del Del…, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "auxiliar_types": "types.ts" | kind=code-symbol | source=lib/auxiliar/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, AuxChecklist, AuxCuestionarioRobo, AuxParReporte] | lang=en
- "buscar_orden_route": "route.ts" | kind=code-symbol | source=app/api/via/sa7/buscar-orden/route.ts:L1 | neighbors=[GET(), auth.ts, auth, repository.ts, SA7Repository, 23b7312 Merge pull request #16 from pre…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@156c925834f49f42390ead1b4c5b351bca392f35": "156c925 vista de reporte de sin robos" | kind=Commit | source=git | neighbors=[conexion, testing, dba1bfb color de boton, page.tsx, PaginacionSinRobos.tsx, ReporteSinRobos.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2c128e5934bc8823af4c4288617bed8102fc687a": "2c128e5 test expediente vercel" | kind=Commit | source=git | neighbors=[conexion, testing, 91c36bf validando orden de pago, abrirDocumento.ts, route.ts, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4d4a9b714485a6d376fdbde62ed20078b2e4aa8f": "4d4a9b7 formulario de notificaciones por radio" | kind=Commit | source=git | neighbors=[page.tsx, conexion, testing, 95b78c1 cambios de incidentes, ef9e0ea Formulario arreglado, FormSection.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@50101e2d3282e026715fc114d37ac180b4685370": "50101e2 Merge pull request #6 from presidenciaSJR/fix/incidentes-camara" | kind=Commit | source=git | neighbors=[conexion, testing, caef6e8 Merge pull request #7 from pres…, page.tsx, route.ts, incidentes-camara-service.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@51e682b4a77a674222e29c98761bac25baff6f72": "51e682b mejorando flujo de liberaciones" | kind=Commit | source=git | neighbors=[actions.ts, LiberacionesDashboard.tsx, mapper.ts, repository.ts, types.ts, conexion] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5d2b0640b03fd989c24c94e0bbbfe570c3ea2488": "5d2b064 fix vercel upload files" | kind=Commit | source=git | neighbors=[46f24f8 generica function for infractio…, actions.ts, LiberacionesDashboard.tsx, conexion, testing, da48f68 implementando flujo de aceptaci…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@74001357545900cbdfcb97dd271e360daac38e3d": "7400135 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[356d3a7 Subir rol agregado, falta darle…, 5d09f31 integración de componente de pa…, Pagination.tsx, conexion, testing, 997ef65 Merge pull request #2 from pres…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@810844a51b816f3d6139fbeb68243ec3e09d1fea": "810844a Cambios en la estructura de los incidentes de camara" | kind=Commit | source=git | neighbors=[5ed311a Merge pull request #5 from pres…, conexion, testing, 50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@83f48a2d52ed2283798d3a1362eba8544bfb0b24": "83f48a2 Merge branch 'feature/correcciones' into feature/testing" | kind=Commit | source=git | neighbors=[166a26b Merge branch 'feature/testing' …, 56a8ec4 Impkementacion de pa ay guardad…, conexion, testing, Formulario911.tsx, 133bb9d pages de listado de llamadas y …] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@95b78c1d99e3697b5e2349399de1c7adc38ec744": "95b78c1 cambios de incidentes" | kind=Commit | source=git | neighbors=[4d4a9b7 formulario de notificaciones po…, conexion, testing, 72e8913 cambio de diseño, page.tsx, actions.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9d67ddf4fb2eee14861eba2af608eb222dca0e86": "9d67ddf Cambios de formulario analisis" | kind=Commit | source=git | neighbors=[conexion, testing, 9550203 Cambios en presentacion, se gen…, BitacoraIPH.tsx, page.tsx, route.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b68a2b77559cba69587da44516c497087b7bf59c": "b68a2b7 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[testing, 8303881 Subida de header y footer, falt…, a667064 Page de seleccion de registro, page.tsx, RolInputs.tsx, ServiceFooter.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bf2e7ed1cd9bab700be7b07172fa6274b92da9c8": "bf2e7ed Reportes del modulo de incidentes" | kind=Commit | source=git | neighbors=[b403f89 Vista para reportes de incident…, conexion, testing, bd1a223 Merge branch 'feature/vistas-re…, page.tsx, ReportesTabs.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ed748a66d4165feeb638b671f565fd6afa2109ee": "ed748a6 fORMULARIO DE DENUNCIA CONCLUIDO" | kind=Commit | source=git | neighbors=[511fea4 Modulo de despacho, conexion, testing, aaddee5 Merge branch 'feature/testing' …, schema.ts, FormularioD1.tsx] | lang=en
- "components_loadingprovider": "LoadingProvider.tsx" | kind=code-symbol | source=components/LoadingProvider.tsx:L1 | neighbors=[layout.tsx, 11e8817 Merge branch 'testing' into juz…, 28da720 Cambio de colores en dashboard …, 44ebbc4 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "corralon_types": "types.ts" | kind=code-symbol | source=lib/corralon/types.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, actions.ts, mapper.ts, service.ts, SolicitudRow] | lang=en
- "d1_d1filters": "D1Filters.tsx" | kind=code-symbol | source=components/reportes/d1/D1Filters.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, D1Filters()] | lang=en
- "deteccion_camara_styles": "styles.ts" | kind=code-symbol | source=components/reportes/deteccion_camara/styles.ts:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, ReportFilters.tsx, ReportTables.tsx, styles] | lang=en
- "estadisticos_phonereportstable": "PhoneReportsTable.tsx" | kind=code-symbol | source=components/reportes/estadisticos/PhoneReportsTable.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 6f8a089 Vista de estadisticos diarios, …, e286619 Merge branch 'feature/testing' …, page.tsx, PhoneReport] | lang=en
- "fiscalia_tomarcasomodal": "TomarCasoModal.tsx" | kind=code-symbol | source=components/fiscalia/TomarCasoModal.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 997ef65 Merge pull request #2 from pres…, a291695 Merge branch 'feature/testing' …, f80d33f Merge branch 'feature/testing' …, TabSolicitudes.tsx] | lang=en
- "fiscalia_types_aseguradorow": "AseguradoRow" | kind=code-symbol | source=lib/fiscalia/types.ts:L28 | neighbors=[actions.ts, repository.ts, service.ts, actions.ts, mapper.ts, repository.ts] | lang=en
- "flota_mapper": "mapper.ts" | kind=code-symbol | source=lib/flota/mapper.ts:L1 | neighbors=[c27a9ee fase prefinal, rowToPatrulla(), rowToPatrullaAsignacion(), toBool(), toStr(), types.ts] | lang=en
- "flota_types_patrullaasignacion": "PatrullaAsignacion" | kind=code-symbol | source=lib/flota/types.ts:L21 | neighbors=[ModalReactivarOficial.tsx, NuevoOficialForm.tsx, OficialesTable.tsx, PatrullaSelector.tsx, mapper.ts, service.ts] | lang=en
- "hooks_useanalistaform": "useAnalistaForm.ts" | kind=code-symbol | source=hooks/useAnalistaForm.ts:L1 | neighbors=[formAnalisis.tsx, 2ca9f50 Formulario sin backend, 5618308 guardado e evidencias con ed, 56b6577 FORMULARIO SE ENLAZO A LA TABLA…, 5830570 Seccion de analista, uya con bd…, 9faf222 Merge branch 'feature/testing' …] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-013.json

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
