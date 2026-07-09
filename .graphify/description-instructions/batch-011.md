# Node Description Batch 12 of 79

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

- "sin_robos_reportesinrobos": "ReporteSinRobos.tsx" | kind=code-symbol | source=components/reportes/sin_robos/ReporteSinRobos.tsx:L1 | neighbors=[156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, e286619 Merge branch 'feature/testing' …] | lang=en
- "steps_pasociudadanoconductor": "PasoCiudadanoConductor.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadanoConductor.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, PasoCiudadano.tsx] | lang=en
- "steps_procesomodal": "ProcesoModal.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, types.ts] | lang=en
- "stores_useinfraccionstore_useinfraccionstore": "useInfraccionStore" | kind=code-symbol | source=stores/useInfraccionStore.ts:L130 | neighbors=[FormularioInfraccion.tsx, PasoCiudadano.tsx, PasoCiudadanoConductor.tsx, PasoConductor.tsx, PasoConfirmacion.tsx, PasoDescuentos.tsx] | lang=en
- "types_detalleinfraccion": "detalleInfraccion.ts" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection.tsx, ModalEntregarGarantia.tsx, DetalleCompleto] | lang=en
- "ui_cardtitle": "CardTitle.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/CardTitle.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadano.tsx, PasoConductor.tsx] | lang=en
- "ui_segmentedcontrol": "SegmentedControl.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/SegmentedControl.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionLiberacion.tsx, PasoCiudadano.tsx] | lang=en
- "911_mapper": "mapper.ts" | kind=code-symbol | source=lib/911/mapper.ts:L1 | neighbors=[rowToCatalogo(), rowToIncidenteDetalle(), rowToIncidenteResumen(), toNum(), toStr(), types.ts] | lang=en
- "agente_infracciones_page": "page.tsx" | kind=code-symbol | source=app/agente_infracciones/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardInfracciones(), obtenerInfracciones(), InfraccionesTable.tsx, InfraccionesDashboardPage(), ProfileDropdown.tsx] | lang=en
- "agente_liberaciones_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/agente_liberaciones/ProfileDropdown.tsx:L1 | neighbors=[page.tsx, ProfileDropdown(), Props, auth-client.ts, authClient, 0b210fa Merge pull request #12 from pre…] | lang=en
- "auxiliar_mapper": "mapper.ts" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L1 | neighbors=[rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), toStr(), types.ts, AuxChecklist] | lang=en
- "branch:repo:github.com/presidenciaSJR/seguridad_publica#main": "main" | kind=Branch | source=git | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 199ce68 Merge branch 'main' of https://…, 2e36377 Eliminar tutoriales de flujo in…, 4271f37 feat(doc): agregar manual de us…, 5558751 feat: módulo Prevención del Del…, 6a042cd feat: sistema de autenticación,…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4c9fa8a7d1d3d48ad71f2060e0954247edd23136": "4c9fa8a vista de reporte de d1 no iniciada" | kind=Commit | source=git | neighbors=[conexion, testing, 0c8695c Cambios en filtros, 5ef7cf3 Agregar los campos faltantes, DescargaFilters.tsx, DescargaPagination.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5311c242be0de7380641d9bb29e09f23c59744a0": "5311c24 Editar Registros" | kind=Commit | source=git | neighbors=[conexion, testing, caef6e8 Merge pull request #7 from pres…, page.tsx, route.ts, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@56b6577764c8633cb7ff4a2b701c2ac335c45204": "56b6577 FORMULARIO SE ENLAZO A LA TABLA DE DENUNCIAS" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, TablonAnalisis.tsx, conexion, testing, f7b1aac Merge branch 'feature/testing' …] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@98e7e6eb5f17a46e7f4c211ed1ddbac02e91c1f6": "98e7e6e vista de reportes de d1" | kind=Commit | source=git | neighbors=[6f8a089 Vista de estadisticos diarios, …, conexion, testing, 75ca4b2 Merge pull request #9 from pres…, b233bc7 Merge branch 'testing' into con…, D1Filters.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b233bc7cf4d1935110e3958ea3b735d12a90770f": "b233bc7 Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[8095bdb limpiando .env, 98e7e6e vista de reportes de d1, conexion, testing, 75e03e9 puliendo flujo de juzgado-liber…, D1Filters.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@de14b628c597751b2adddaebedd581c41690e8e2": "de14b62 Merge branch 'feature/reportes' into feature/testing" | kind=Commit | source=git | neighbors=[0b210fa Merge pull request #12 from pre…, conexion, testing, 4400923 Merge branch 'feature/testing' …, route.ts, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f6954ecab5cbc29333e7b5fa272233ed46d15b86": "f6954ec Conexion a la bd y la generacion de Excel" | kind=Commit | source=git | neighbors=[5ef7cf3 Agregar los campos faltantes, conexion, testing, 07543de Conexion de reportes con d1 y l…, de14b62 Merge branch 'feature/reportes'…, route.ts] | lang=es
- "components_modalentregargarantia": "ModalEntregarGarantia.tsx" | kind=code-symbol | source=features/via/infracciones/components/ModalEntregarGarantia.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection.tsx, getGarantiaInfo(), ModalEntregarGarantia()] | lang=en
- "corralon_repository": "repository.ts" | kind=code-symbol | source=lib/corralon/repository.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, ad3ec5f mejorando esto, finalizarInfraccionCorralon(), obtenerEstatusInfraccion(), obtenerSolicitudesFinalizadas()] | lang=en
- "d1_d1reportstable": "D1ReportsTable.tsx" | kind=code-symbol | source=components/reportes/d1/D1ReportsTable.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, D1Pagination.tsx] | lang=en
- "exportar_excel_route": "route.ts" | kind=code-symbol | source=app/api/reportes-operativos/exportar-excel/route.ts:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, de14b62 Merge branch 'feature/reportes'…, e286619 Merge branch 'feature/testing' …, f6954ec Conexion a la bd y la generacio…] | lang=en
- "incidentes_filtrosincidencias": "FiltrosIncidencias.tsx" | kind=code-symbol | source=components/reportes/incidentes/FiltrosIncidencias.tsx:L1 | neighbors=[13f7f39 Reporte-incidentes, 2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, 719b5ab cambio para generacion de repor…, e286619 Merge branch 'feature/testing' …, f7b1aac Merge branch 'feature/testing' …] | lang=en
- "login_desing_design_canvas": "design-canvas.jsx" | kind=code-symbol | source=login-desing/design-canvas.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, DC, DCArtboard(), DCArtboardFrame(), DCCtx, DCEditable()] | lang=en
- "login_desing_login_app": "login-app.jsx" | kind=code-symbol | source=login-desing/login-app.jsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, 6a042cd feat: sistema de autenticación,…, App(), IconArrow(), IconCheck(), IconLock()] | lang=en
- "modulo_incidentes_styles": "styles.ts" | kind=code-symbol | source=components/reportes/modulo_incidentes/styles.ts:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, bd1a223 Merge branch 'feature/vistas-re…, bf2e7ed Reportes del modulo de incident…, page.tsx, PhonePagination.tsx, PhoneReportsTable.tsx] | lang=en
- "monitorista_accionesdetenido": "AccionesDetenido.tsx" | kind=code-symbol | source=components/monitorista/AccionesDetenido.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "monitorista_botongenerarppt": "BotonGenerarPpt.tsx" | kind=code-symbol | source=components/monitorista/BotonGenerarPpt.tsx:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes, b170599 Merge branch 'feature/testing' …] | lang=en
- "monitorista_editarcampodetenido": "EditarCampoDetenido.tsx" | kind=code-symbol | source=components/monitorista/EditarCampoDetenido.tsx:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5ed311a Merge pull request #5 from pres…, 77ddf58 Merge branch 'feature/testing' …, b170599 Merge branch 'feature/testing' …] | lang=en
- "oficial_modalseleccionarunidad": "ModalSeleccionarUnidad.tsx" | kind=code-symbol | source=components/oficial/ModalSeleccionarUnidad.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, types.ts, PatrullaAsignacion] | lang=en
- "oficial_unidadasignadasection": "UnidadAsignadaSection.tsx" | kind=code-symbol | source=components/oficial/UnidadAsignadaSection.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, page.tsx, types.ts] | lang=en
- "prevencion_actions_requireacceso": "requireAcceso()" | kind=code-symbol | source=lib/prevencion/actions.ts:L13 | neighbors=[actions.ts, addAutoridadMedida(), cancelarFicha(), createContestacion(), createFicha(), createMedida()] | lang=en
- "prevencion_contestacionform": "ContestacionForm.tsx" | kind=code-symbol | source=components/prevencion/ContestacionForm.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, ea0242b vista de juridico, page.tsx] | lang=en
- "prevencion_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L3 | neighbors=[mapper.ts, rowToAutoridadAdicional(), rowToBusqueda(), rowToContestacion(), rowToFichaBusquedaDetalle(), rowToMedida()] | lang=en
- "reportes_form_styles_pagewrap": "pageWrap" | kind=code-symbol | source=components/reportes/form-styles.ts:L24 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "reportes_permisos_tieneaccesoformaton": "tieneAccesoFormatoN()" | kind=code-symbol | source=lib/reportes/permisos.ts:L29 | neighbors=[page.tsx, page.tsx, page.tsx, route.ts, page.tsx, page.tsx] | lang=en
- "reportes_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/reportes/permisos.ts:L10 | neighbors=[page.tsx, page.tsx, page.tsx, route.ts, page.tsx, page.tsx] | lang=en
- "reportes_repository": "repository.ts" | kind=code-symbol | source=lib/reportes/repository.ts:L1 | neighbors=[514a705 refactorizacion sql, ad3ec5f mejorando esto, page.tsx, page.tsx, db.ts, query()] | lang=en
- "retencion_placa_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/retencion-placa/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, b5233a8 implementando via como modulo d…, ede5a1d eliminado referencias a via_pru…, f7b1aac Merge branch 'feature/testing' …] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-011.json

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
