# Node Description Batch 17 of 79

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3249f00a89bf30e764b252bba8f76757f1664431": "3249f00 Cambios en rellenado de ppt!" | kind=Commit | source=git | neighbors=[conexion, testing, a6b7556 Formulario se puso a prueba, se…, route.ts, route.ts, analisisService.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@356d3a716d77e5bea2179a3cef18969daacd64dc": "356d3a7 Subir rol agregado, falta darle mejor vista" | kind=Commit | source=git | neighbors=[page.tsx, conexion, testing, 7400135 Merge branch 'feature/testing' …, FormularioRol.tsx, route.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3b10d723286e7aa7720e192c365c543dbbe70705": "3b10d72 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[testing, 283f342 Merge branch 'feature/testing' …, 2be4ca9 Cambio en header, Footer.tsx, Header.tsx, a24949a Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4d4a9b714485a6d376fdbde62ed20078b2e4aa8f": "4d4a9b7 formulario de notificaciones por radio" | kind=Commit | source=git | neighbors=[conexion, testing, 95b78c1 cambios de incidentes, ef9e0ea Formulario arreglado, FormSection.tsx, Input.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5aa5866f2596cb59e4321a860046e68b808e7e64": "5aa5866 Cambio de colores en interfaz de login" | kind=Commit | source=git | neighbors=[layout.tsx, conexion, testing, b403f89 Vista para reportes de incident…, ce84893 Merge branch 'feature/testing' …, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6cb1055d8e59375ddb1c1197a01d6216e7852ba8": "6cb1055 Mejoras de UI/UIX" | kind=Commit | source=git | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, main, d3e6d95 Update SeguimientoTimeline.tsx, module-cards.tsx, page.tsx, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@719b5ab1f902dba3e45bcca96bba340e0fe239fd": "719b5ab cambio para generacion de reportes semanal y diario" | kind=Commit | source=git | neighbors=[2fcba7b vista de reportes de incidentes…, conexion, testing, 18f5bac llamada en card, FiltrosIncidencias.tsx, TablaIncidentes.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@90da1ca35ab391d63a1adc4af5558ddd8250e0d2": "90da1ca Initial commit from Create Next App" | kind=Commit | source=git | neighbors=[layout.tsx, page.tsx, main, 6a042cd feat: sistema de autenticación,…, eslint.config.mjs, next.config.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@adf0c3d126c5fd3d93b18615951fdf522e3b70ff": "adf0c3d vista de busqueda y juridico" | kind=Commit | source=git | neighbors=[3800cab formulario de nueva medida de p…, conexion, testing, page.tsx, baae82f diseño de medidas de proteccion, bb10dcd Formatos V1] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@baae82f65f206f5ecab6b05963b359866b11ffee": "baae82f diseño de medidas de proteccion" | kind=Commit | source=git | neighbors=[adf0c3d vista de busqueda y juridico, conexion, testing, c95f412 Merge branch 'feature/testing' …, page.tsx, AgregarAutoridadForm.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c1ed4c3ec30f62f4a96e9c4c0eaa5a200909aa3f": "c1ed4c3 cambios en busquedas" | kind=Commit | source=git | neighbors=[conexion, testing, 41ea169 Merge branch 'testing' into con…, c471e9c Merge pull request #15 from pre…, page.tsx, page.tsx] | lang=en
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
- "ordensalida_generarordensalida_generarordensalidavehiculo": "generarOrdenSalidaVehiculo()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L61 | neighbors=[route.ts, generarOrdenSalida.ts, drawWatermark(), formatearFecha(), formatearOficio(), loadImageAsBase64()] | lang=en
- "prevencion_autoridadbadge": "AutoridadBadge.tsx" | kind=code-symbol | source=components/prevencion/AutoridadBadge.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, page.tsx, AgregarAutoridadForm.tsx, AutoridadBadge()] | lang=en
- "prevencion_cancelacionmodal": "CancelacionModal.tsx" | kind=code-symbol | source=components/prevencion/CancelacionModal.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, actions.ts, cancelarFicha(), CancelacionModal(), InputField()] | lang=en
- "prevencion_prorrogamodal": "ProrrogaModal.tsx" | kind=code-symbol | source=components/prevencion/ProrrogaModal.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, page.tsx, actions.ts, createProrroga(), I, L] | lang=en
- "prevencion_semaforovigencia": "SemaforoVigencia.tsx" | kind=code-symbol | source=components/prevencion/SemaforoVigencia.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, semaforo.ts, SemaforoColor, CFG] | lang=en
- "prevencion_timeline": "timeline.ts" | kind=code-symbol | source=lib/prevencion/timeline.ts:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, checker.ts, SeguimientoTimeline.tsx, calcularFechaEsperada(), getLabelSeguimiento(), TIPOS_SEGUIMIENTO] | lang=en
- "templates_layout": "layout.ts" | kind=code-symbol | source=lib/emails/templates/layout.ts:L1 | neighbors=[75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, asignacion-fiscalia.ts, emailLayout(), emailStyles, inlineStyles()] | lang=en
- "ui_toastauto_toastauto": "ToastAuto()" | kind=code-symbol | source=components/ui/ToastAuto.tsx:L7 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, ToastAuto.tsx] | lang=en
- "utils_generateppt": "generatePPT.ts" | kind=code-symbol | source=lib/utils/generatePPT.ts:L1 | neighbors=[generarPresentacion.tsx, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "via_expediente_getexpedientetoken": "getExpedienteToken()" | kind=code-symbol | source=lib/via/expediente.ts:L25 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, expediente.ts] | lang=en
- "admin_admin_styles_btnprimario": "btnPrimario" | kind=code-symbol | source=app/admin/admin-styles.ts:L16 | neighbors=[admin-styles.ts, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-016.json

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
