# Node Description Batch 20 of 89

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

- "agente_juzgado_toastexito": "ToastExito.tsx" | kind=code-symbol | source=components/agente_juzgado/ToastExito.tsx:L1 | neighbors=[page.tsx, ToastExito(), 090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 997ef65 Merge pull request #2 from pres…, a291695 Merge branch 'feature/testing' …] | lang=en
- "analisis_permisos_tieneaccesoanalisis": "tieneAccesoAnalisis()" | kind=code-symbol | source=lib/analisis/permisos.ts:L25 | neighbors=[permisos.ts, tienePermiso(), page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "analisis_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/analisis/permisos.ts:L9 | neighbors=[permisos.ts, tieneAccesoAnalisis(), verificarAccesoAnalisisApi(), page.tsx, page.tsx, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1265204bc97feaa6fb75df1806e9897fa23366a9": "1265204 paginacion por tablas" | kind=Commit | source=git | neighbors=[feature/testing, fix/subir-fotografias, 5bbdda8 Merge pull request #8 from pres…, ReportTables.tsx, 24626eb se agregan opciones de reportes, conexion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@24626eb982afa43f645cacc5f1a4a61b73739a55": "24626eb se agregan opciones de reportes" | kind=Commit | source=git | neighbors=[feature/testing, fix/subir-fotografias, 1265204 paginacion por tablas, ReportesTabs.tsx, b170599 Merge branch 'feature/testing' …, conexion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4af36d9243dd6dd33472459b3792bbc43df81b0d": "4af36d9 Merge pull request #18 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[feature/testing, 046f18c Merge pull request #19 from pre…, 5641e69 Merge branch 'feature/testing' …, ec3acf7 iniciando reset de testing, fe98642 modificando agents.md, conexion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ec3acf726484fbb76f804cebaf190c461ef704f2": "ec3acf7 iniciando reset de testing" | kind=Commit | source=git | neighbors=[9d803f2 fix api maps, feature/testing, 4af36d9 Merge pull request #18 from pre…, c776b58 Integrar Alexandria (bóveda de …, fe98642 modificando agents.md, conexion] | lang=nl
- "corralon_profile_dropdown": "profile-dropdown.tsx" | kind=code-symbol | source=app/corralon/profile-dropdown.tsx:L1 | neighbors=[5a1b5d5 empezando corralon, page.tsx, ProfileDropdown(), Props, auth-client.ts, authClient] | lang=en
- "d1_d1pagination": "D1Pagination.tsx" | kind=code-symbol | source=components/reportes/d1/D1Pagination.tsx:L1 | neighbors=[98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…, D1Pagination(), PaginationProps, styles.ts, styles] | lang=en
- "d1_styles": "styles.ts" | kind=code-symbol | source=components/reportes/d1/styles.ts:L1 | neighbors=[98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…, D1Filters.tsx, D1Pagination.tsx, D1ReportsTable.tsx, page.tsx] | lang=en
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
- "incidentes_paginacion": "Paginacion.tsx" | kind=code-symbol | source=components/reportes/incidentes/Paginacion.tsx:L1 | neighbors=[2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, Pagination(), PaginationProps, styles.ts] | lang=en
- "infracciones_constants": "constants.ts" | kind=code-symbol | source=features/via/infracciones/constants.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, datosIniciales, useInfraccionStore.ts] | lang=en
- "infracciones_repository_infraccionesrepository": "InfraccionesRepository" | kind=code-symbol | source=features/via/infracciones/repository.ts:L4 | neighbors=[actions.ts, repository.ts, .eliminarInfraccion(), .obtenerDatosInfraccionCiudadanoRP(), .obtenerSiguienteSecuencia(), .registarNuevaInfraccionRP()] | lang=en
- "monitorista_buscadorevento": "BuscadorEvento.tsx" | kind=code-symbol | source=components/monitorista/BuscadorEvento.tsx:L1 | neighbors=[5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes, ce84893 Merge branch 'feature/testing' …, BuscadorEvento(), OPCIONES] | lang=en
- "monitorista_filaincidentecamara": "FilaIncidenteCamara.tsx" | kind=code-symbol | source=components/monitorista/FilaIncidenteCamara.tsx:L1 | neighbors=[5311c24 Editar Registros, b170599 Merge branch 'feature/testing' …, c27a9ee fase prefinal, caef6e8 Merge pull request #7 from pres…, page.tsx, FilaIncidenteCamara()] | lang=en
- "oficial_marcarensitiobutton": "MarcarEnSitioButton.tsx" | kind=code-symbol | source=components/oficial/MarcarEnSitioButton.tsx:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, page.tsx, actions.ts, marcarEnSitioOficial(), MarcarEnSitioButton()] | lang=en
- "ordensalida_generarordensalida_generarordensalidavehiculo": "generarOrdenSalidaVehiculo()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L61 | neighbors=[route.ts, generarOrdenSalida.ts, drawWatermark(), formatearFecha(), formatearOficio(), loadImageAsBase64()] | lang=en
- "prevencion_autoridadbadge": "AutoridadBadge.tsx" | kind=code-symbol | source=components/prevencion/AutoridadBadge.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, page.tsx, AgregarAutoridadForm.tsx, AutoridadBadge()] | lang=en
- "prevencion_cancelacionmodal": "CancelacionModal.tsx" | kind=code-symbol | source=components/prevencion/CancelacionModal.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, actions.ts, cancelarFicha(), CancelacionModal(), InputField()] | lang=en
- "prevencion_prorrogamodal": "ProrrogaModal.tsx" | kind=code-symbol | source=components/prevencion/ProrrogaModal.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, page.tsx, actions.ts, createProrroga(), I, L] | lang=en
- "prevencion_semaforo": "semaforo.ts" | kind=code-symbol | source=lib/prevencion/semaforo.ts:L1 | neighbors=[0caf5dd Fixes, 5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, calcularSemaforoVigencia(), SemaforoColor] | lang=en
- "prevencion_semaforovigencia": "SemaforoVigencia.tsx" | kind=code-symbol | source=components/prevencion/SemaforoVigencia.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, semaforo.ts, SemaforoColor, CFG] | lang=en
- "prevencion_timeline": "timeline.ts" | kind=code-symbol | source=lib/prevencion/timeline.ts:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, checker.ts, SeguimientoTimeline.tsx, calcularFechaEsperada(), getLabelSeguimiento(), TIPOS_SEGUIMIENTO] | lang=en
- "templates_layout": "layout.ts" | kind=code-symbol | source=lib/emails/templates/layout.ts:L1 | neighbors=[75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, asignacion-fiscalia.ts, emailLayout(), emailStyles, inlineStyles()] | lang=en
- "ui_toastauto_toastauto": "ToastAuto()" | kind=code-symbol | source=components/ui/ToastAuto.tsx:L7 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, ToastAuto.tsx] | lang=en
- "utils_generateppt": "generatePPT.ts" | kind=code-symbol | source=lib/utils/generatePPT.ts:L1 | neighbors=[generarPresentacion.tsx, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "via_expediente_getexpedientetoken": "getExpedienteToken()" | kind=code-symbol | source=lib/via/expediente.ts:L25 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, expediente.ts] | lang=en
- "911_permisos_obtenerrolnombre": "obtenerRolNombre()" | kind=code-symbol | source=lib/911/permisos.ts:L25 | neighbors=[permisos.ts, page.tsx, page.tsx, page.tsx, tieneAccesoHub(), tieneAccesoSeccion()] | lang=en
- "admin_admin_styles_btnprimario": "btnPrimario" | kind=code-symbol | source=app/admin/admin-styles.ts:L16 | neighbors=[admin-styles.ts, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "agente_juzgado_actions_obtenerdashboardjuzgado": "obtenerDashboardJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L36 | neighbors=[actions.ts, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-019.json

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
