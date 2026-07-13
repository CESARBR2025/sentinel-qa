# Node Description Batch 19 of 84

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

- "oficial_toastexito": "ToastExito.tsx" | kind=code-symbol | source=components/oficial/ToastExito.tsx:L1 | neighbors=[page.tsx, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 93dd3ea Merge pull request #1 from pres…, aaddee5 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "oficiales_service": "service.ts" | kind=code-symbol | source=features/via/oficiales/service.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, repository.ts, OficialesViaRepository] | lang=en
- "plugins_graphify": "graphify.js" | kind=code-symbol | source=.opencode/plugins/graphify.js:L1 | neighbors=[e6bffc9 boveda conectada, CONTEXT_MAP_PATH, __dirname, GRAPH_JSON, GraphifyPlugin(), LOADER_SCRIPT] | lang=en
- "proxy": "proxy.ts" | kind=code-symbol | source=proxy.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, 6cb1055 Mejoras de UI/UIX, auth.ts, Session, config, isPublic()] | lang=en
- "reportes_incidentes_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-incidentes/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToReporteDiario(), rowToReporteSemanal(), toNum(), types.ts, ReporteDiarioRow] | lang=en
- "reportes_incidentes_types": "types.ts" | kind=code-symbol | source=lib/reportes-incidentes/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, ReporteDiarioRow, ReporteIncidenteCombinado] | lang=en
- "reportes_menuoption": "menuOption.tsx" | kind=code-symbol | source=components/reportes/menuOption.tsx:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, page.tsx, OptionSquare(), OptionSquareProps] | lang=en
- "rol_servicios_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L18 | neighbors=[mapper.ts, rowToBodyCam(), rowToEstadoFuerzaConcepto(), rowToMedioCanalizacion(), rowToRadio(), rowToSector()] | lang=en
- "services_analistaservice": "analistaService.ts" | kind=code-symbol | source=services/analistaService.ts:L1 | neighbors=[formAnalisis.tsx, 2ca9f50 Formulario sin backend, 5618308 guardado e evidencias con ed, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "steps_pasoconfirmacionpago": "PasoConfirmacionPago.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacionPago.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, PasoConfirmacion.tsx] | lang=en
- "tabladevinfracciones_detalleinfraccionmodal": "DetalleInfraccionModal.tsx" | kind=code-symbol | source=features/depInfracciones/components/TablaDevInfracciones/DetalleInfraccionModal.tsx:L1 | neighbors=[0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…, e286619 Merge branch 'feature/testing' …, DetalleInfraccionModal()] | lang=en
- "ui_cardtitle_cardtitle": "CardTitle()" | kind=code-symbol | source=features/via/infracciones/components/ui/CardTitle.tsx:L1 | neighbors=[PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, PasoVehiculo.tsx, SeccionGarantia.tsx] | lang=en
- "ui_customselect": "CustomSelect.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/CustomSelect.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionMotivo.tsx, CustomSelect()] | lang=en
- "via_online": "online.ts" | kind=code-symbol | source=lib/via/online.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, getSnapshot()] | lang=en
- "agente_911_service": "service.ts" | kind=code-symbol | source=lib/agente_911/service.ts:L1 | neighbors=[page.tsx, verificarRolAgente911(), db.ts, query(), 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…] | lang=en
- "agente_bitacorista_service": "service.ts" | kind=code-symbol | source=lib/agente_bitacorista/service.ts:L1 | neighbors=[page.tsx, verificarRolAgenteBitacorista(), db.ts, query(), 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…] | lang=en
- "agente_despacho_service": "service.ts" | kind=code-symbol | source=lib/agente_despacho/service.ts:L1 | neighbors=[page.tsx, verificarRolAgenteDespacho(), db.ts, query(), 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…] | lang=en
- "agente_juzgado_cerrarcasomodal": "CerrarCasoModal.tsx" | kind=code-symbol | source=components/agente_juzgado/CerrarCasoModal.tsx:L1 | neighbors=[actions.ts, accionCerrarCaso(), CerrarCasoBoton(), 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …, a7218bd Merge pull request #4 from pres…] | lang=en
- "agente_juzgado_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/agente_juzgado/ProfileDropdown.tsx:L14 | neighbors=[page.tsx, ProfileDropdown.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "agente_juzgado_toastexito": "ToastExito.tsx" | kind=code-symbol | source=components/agente_juzgado/ToastExito.tsx:L1 | neighbors=[page.tsx, ToastExito(), 090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 997ef65 Merge pull request #2 from pres…, a291695 Merge branch 'feature/testing' …] | lang=en
- "analisis_permisos_tieneaccesoanalisis": "tieneAccesoAnalisis()" | kind=code-symbol | source=lib/analisis/permisos.ts:L25 | neighbors=[permisos.ts, tienePermiso(), page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "analisis_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/analisis/permisos.ts:L9 | neighbors=[permisos.ts, tieneAccesoAnalisis(), verificarAccesoAnalisisApi(), page.tsx, page.tsx, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1265204bc97feaa6fb75df1806e9897fa23366a9": "1265204 paginacion por tablas" | kind=Commit | source=git | neighbors=[conexion, testing, 5bbdda8 Merge pull request #8 from pres…, ReportTables.tsx, 24626eb se agregan opciones de reportes, feature/testing] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@24626eb982afa43f645cacc5f1a4a61b73739a55": "24626eb se agregan opciones de reportes" | kind=Commit | source=git | neighbors=[conexion, testing, 1265204 paginacion por tablas, ReportesTabs.tsx, b170599 Merge branch 'feature/testing' …, feature/testing] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4af36d9243dd6dd33472459b3792bbc43df81b0d": "4af36d9 Merge pull request #18 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[conexion, testing, 046f18c Merge pull request #19 from pre…, 5641e69 Merge branch 'feature/testing' …, ec3acf7 iniciando reset de testing, fe98642 modificando agents.md] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ec3acf726484fbb76f804cebaf190c461ef704f2": "ec3acf7 iniciando reset de testing" | kind=Commit | source=git | neighbors=[9d803f2 fix api maps, conexion, testing, 4af36d9 Merge pull request #18 from pre…, c776b58 Integrar Alexandria (bóveda de …, fe98642 modificando agents.md] | lang=nl
- "corralon_profile_dropdown": "profile-dropdown.tsx" | kind=code-symbol | source=app/corralon/profile-dropdown.tsx:L1 | neighbors=[5a1b5d5 empezando corralon, page.tsx, ProfileDropdown(), Props, auth-client.ts, authClient] | lang=en
- "d1_d1pagination": "D1Pagination.tsx" | kind=code-symbol | source=components/reportes/d1/D1Pagination.tsx:L1 | neighbors=[98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…, D1Pagination(), PaginationProps, styles.ts, styles] | lang=en
- "d1_styles": "styles.ts" | kind=code-symbol | source=components/reportes/d1/styles.ts:L1 | neighbors=[98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…, D1Filters.tsx, D1Pagination.tsx, D1ReportsTable.tsx, page.tsx] | lang=en
- "despachos_page": "page.tsx" | kind=code-symbol | source=app/oficial/despachos/page.tsx:L1 | neighbors=[290d651 feat(despacho): flujo integral …, MisDespachosPage(), auth.ts, auth, service.ts, listarDespachosAsignados()] | lang=en
- "deteccion_camara_reportstat": "ReportStat.tsx" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportStat.tsx:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, ReportStat(), PhoneStatsCards.tsx, page.tsx] | lang=en
- "emails_mailer": "mailer.ts" | kind=code-symbol | source=lib/emails/mailer.ts:L1 | neighbors=[75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, MailAttachment, MailOptions, sendMail(), transporter] | lang=en
- "estadisticos_reportfilters": "ReportFilters.tsx" | kind=code-symbol | source=components/reportes/estadisticos/ReportFilters.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, page.tsx, styles.ts, styles] | lang=en
- "fiscalia_buttonverdetalles": "ButtonVerDetalles.tsx" | kind=code-symbol | source=components/fiscalia/ButtonVerDetalles.tsx:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, ff6d3c2 juzgado, BotonVerDetalle(), BotonVerDetalleProps] | lang=en
- "fiscalia_expediente": "expediente.ts" | kind=code-symbol | source=lib/fiscalia/expediente.ts:L1 | neighbors=[actions.ts, 75ca4b2 Merge pull request #9 from pres…, 8095bdb limpiando .env, 953d38a implementando vista de fiscalia, actions.ts, obtenerTokenFiscalia()] | lang=en
- "fiscalia_toastexito": "ToastExito.tsx" | kind=code-symbol | source=components/fiscalia/ToastExito.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 997ef65 Merge pull request #2 from pres…, a291695 Merge branch 'feature/testing' …, f80d33f Merge branch 'feature/testing' …, page.tsx] | lang=en
- "fiscalia_types_puestadisposicionrow": "PuestaDisposicionRow" | kind=code-symbol | source=lib/fiscalia/types.ts:L94 | neighbors=[actions.ts, actions.ts, FormularioPuestaDisposicion.tsx, mapper.ts, repository.ts, service.ts] | lang=en
- "gruas_route": "route.ts" | kind=code-symbol | source=app/api/complementos/gruas/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto, repository.ts, listarGruasActivas()] | lang=en
- "hooks_usedespacho": "useDespacho.ts" | kind=code-symbol | source=hooks/useDespacho.ts:L1 | neighbors=[a58a0f7 Despachos, TablonDespacho.tsx, DespachoDetalle, EmpleadoResult, IncidentePendiente, useDespacho()] | lang=en
- "incidentes_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L26 | neighbors=[mapper.ts, rowToAlarmaEscolar(), rowToIncidenteDetalleCompletoBase(), rowToIncidentePendiente(), rowToPersonaAfectada(), rowToReporteCampo()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-018.json

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
