# Node Description Batch 15 of 87

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

- "exportar_excel_route": "route.ts" | kind=code-symbol | source=app/api/reportes-operativos/exportar-excel/route.ts:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, de14b62 Merge branch 'feature/reportes'…, e286619 Merge branch 'feature/testing' …, f6954ec Conexion a la bd y la generacio…] | lang=en
- "incidentes_actions_req": "req()" | kind=code-symbol | source=lib/incidentes/actions.ts:L26 | neighbors=[actions.ts, addPersonaAfectada(), createAlarmaEscolar(), createDespacho(), createExtorsion(), createIncidente()] | lang=en
- "incidentes_filtrosincidencias": "FiltrosIncidencias.tsx" | kind=code-symbol | source=components/reportes/incidentes/FiltrosIncidencias.tsx:L1 | neighbors=[13f7f39 Reporte-incidentes, 2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, 719b5ab cambio para generacion de repor…, e286619 Merge branch 'feature/testing' …, f7b1aac Merge branch 'feature/testing' …] | lang=en
- "lib_error_handler_notfounderror": "NotFoundError" | kind=code-symbol | source=lib/error-handler.ts:L12 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, AppError, .constructor()] | lang=en
- "lib_error_handler_validationerror": "ValidationError" | kind=code-symbol | source=lib/error-handler.ts:L18 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, AppError, .constructor()] | lang=en
- "login_desing_design_canvas": "design-canvas.jsx" | kind=code-symbol | source=login-desing/design-canvas.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, DC, DCArtboard(), DCArtboardFrame(), DCCtx, DCEditable()] | lang=en
- "login_desing_login_app": "login-app.jsx" | kind=code-symbol | source=login-desing/login-app.jsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, 6a042cd feat: sistema de autenticación,…, App(), IconArrow(), IconCheck(), IconLock()] | lang=en
- "modulo_incidentes_styles": "styles.ts" | kind=code-symbol | source=components/reportes/modulo_incidentes/styles.ts:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, bd1a223 Merge branch 'feature/vistas-re…, bf2e7ed Reportes del modulo de incident…, page.tsx, PhonePagination.tsx, PhoneReportsTable.tsx] | lang=en
- "monitorista_accionesdetenido": "AccionesDetenido.tsx" | kind=code-symbol | source=components/monitorista/AccionesDetenido.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "monitorista_botongenerarppt": "BotonGenerarPpt.tsx" | kind=code-symbol | source=components/monitorista/BotonGenerarPpt.tsx:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes, b170599 Merge branch 'feature/testing' …] | lang=en
- "monitorista_editarcampodetenido": "EditarCampoDetenido.tsx" | kind=code-symbol | source=components/monitorista/EditarCampoDetenido.tsx:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5ed311a Merge pull request #5 from pres…, 77ddf58 Merge branch 'feature/testing' …, b170599 Merge branch 'feature/testing' …] | lang=en
- "oficial_modalseleccionarunidad": "ModalSeleccionarUnidad.tsx" | kind=code-symbol | source=components/oficial/ModalSeleccionarUnidad.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, types.ts, PatrullaAsignacion] | lang=en
- "oficial_service_verificarroloficial": "verificarRolOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L74 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "oficial_unidadasignadasection": "UnidadAsignadaSection.tsx" | kind=code-symbol | source=components/oficial/UnidadAsignadaSection.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, page.tsx, types.ts] | lang=en
- "prevencion_actions_requireacceso": "requireAcceso()" | kind=code-symbol | source=lib/prevencion/actions.ts:L13 | neighbors=[actions.ts, addAutoridadMedida(), cancelarFicha(), createContestacion(), createFicha(), createMedida()] | lang=en
- "prevencion_contestacionform": "ContestacionForm.tsx" | kind=code-symbol | source=components/prevencion/ContestacionForm.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, ea0242b vista de juridico, page.tsx] | lang=en
- "prevencion_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L3 | neighbors=[mapper.ts, rowToAutoridadAdicional(), rowToBusqueda(), rowToContestacion(), rowToFichaBusquedaDetalle(), rowToMedida()] | lang=en
- "radio_formrondinescalado": "FormRondinEscalado.tsx" | kind=code-symbol | source=components/911/radio/FormRondinEscalado.tsx:L1 | neighbors=[290d651 feat(despacho): flujo integral …, actions.ts, createRondinEscalado(), ahoraLocal(), Campo(), CatalogoItem] | lang=en
- "reportes_form_styles_pagewrap": "pageWrap" | kind=code-symbol | source=components/reportes/form-styles.ts:L24 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "reportes_repository": "repository.ts" | kind=code-symbol | source=lib/reportes/repository.ts:L1 | neighbors=[514a705 refactorizacion sql, ad3ec5f mejorando esto, page.tsx, page.tsx, db.ts, query()] | lang=en
- "retencion_placa_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/retencion-placa/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, b5233a8 implementando via como modulo d…, ede5a1d eliminado referencias a via_pru…, f7b1aac Merge branch 'feature/testing' …] | lang=en
- "sasiete_types": "types.ts" | kind=code-symbol | source=features/via/saSiete/types.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapper.ts, repository.ts] | lang=en
- "steps_pasoinfraccion": "PasoInfraccion.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoInfraccion.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, PasoInfraccion()] | lang=en
- "steps_pasoubicacion": "PasoUbicacion.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacion.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, MapaDireccionRegistro.tsx, MapaDireccionRegistro()] | lang=en
- "via_pagos": "pagos.ts" | kind=code-symbol | source=lib/via/pagos.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ede5a1d eliminado referencias a via_pru…, route.ts, db.ts] | lang=en
- "wireframes_shared": "shared.jsx" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, Arrow(), Corner(), DarkFrame(), GridBG(), InputField()] | lang=en
- "admin_transito_patrullaselector": "PatrullaSelector.tsx" | kind=code-symbol | source=components/admin-transito/PatrullaSelector.tsx:L1 | neighbors=[NuevoOficialForm.tsx, PatrullaSelector(), Props, types.ts, PatrullaAsignacion, 16a63d4 Merge branch 'feature/testing' …] | lang=en
- "agente_infracciones_infraccionestable": "InfraccionesTable.tsx" | kind=code-symbol | source=components/agente_infracciones/InfraccionesTable.tsx:L1 | neighbors=[InfraccionesDashboard.tsx, columns, DataRow, InfraccionesTable(), InfraccionesTableProps, page.tsx] | lang=en
- "agente_infracciones_storecapturainfractor": "storeCapturaInfractor.ts" | kind=code-symbol | source=lib/agente_infracciones/storeCapturaInfractor.ts:L1 | neighbors=[CapturarDatosInfractorModal.tsx, CapturaInfractorActions, CapturaInfractorState, CapturaInfractorStore, initialState, useCapturaInfractorStore] | lang=en
- "camara_mapper": "mapper.ts" | kind=code-symbol | source=lib/camara/mapper.ts:L1 | neighbors=[rowToIncidenteCamara(), rowToTotalesCamara(), toNum(), toNumNullable(), toStr(), types.ts] | lang=en
- "camara_service": "service.ts" | kind=code-symbol | source=lib/camara/service.ts:L1 | neighbors=[repository.ts, obtenerIncidentesCamara(), obtenerTotalesCamara(), listarIncidentesCamara(), toStr(), 5618308 guardado e evidencias con ed] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@156c925834f49f42390ead1b4c5b351bca392f35": "156c925 vista de reporte de sin robos" | kind=Commit | source=git | neighbors=[conexion, testing, dba1bfb color de boton, page.tsx, PaginacionSinRobos.tsx, ReporteSinRobos.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@199ce68e039fafc9454c08a4d7e17170f45c7df0": "199ce68 Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publ…" | kind=Commit | source=git | neighbors=[main, 2e36377 Eliminar tutoriales de flujo in…, 4271f37 feat(doc): agregar manual de us…, deb4649 eLIMINE CARPETA, feature/monitorista-reportes, fix/detenidos] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@25de42811d8e92a9e713f5e451bfd1dc0c50f773": "25de428 Corrección para agregar el botón de cerrar sesion" | kind=Commit | source=git | neighbors=[page.tsx, ProfileDropdownAuxiliar.tsx, conexion, testing, 5abc683 Merge branch 'feature/auxiliar'…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@283f34200d56b11b1f2b38d62deeddc6d77e1f33": "283f342 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 3a00521 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2be4ca9ae4ff3a5d1b237b09267954a3b2df39fb": "2be4ca9 Cambio en header" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 3a00521 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2c128e5934bc8823af4c4288617bed8102fc687a": "2c128e5 test expediente vercel" | kind=Commit | source=git | neighbors=[conexion, testing, 91c36bf validando orden de pago, abrirDocumento.ts, route.ts, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@44a01c3e9031adf0c6ddd327f8c7833726e4c464": "44a01c3 fase 3-4-5" | kind=Commit | source=git | neighbors=[conexion, testing, 12aab65 fase 4, route.ts, db.ts, route.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@49dca479f6546c67df478e85e13a41ece8cc067f": "49dca47 cambio" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 82ae6e9 Interfaz de llamada 911 cambios] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@51e682b4a77a674222e29c98761bac25baff6f72": "51e682b mejorando flujo de liberaciones" | kind=Commit | source=git | neighbors=[actions.ts, LiberacionesDashboard.tsx, mapper.ts, repository.ts, types.ts, conexion] | lang=nl

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-014.json

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
