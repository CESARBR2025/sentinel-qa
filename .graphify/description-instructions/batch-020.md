# Node Description Batch 21 of 86

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
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "corralon_layout": "layout.tsx" | kind=code-symbol | source=app/corralon/layout.tsx:L1 | neighbors=[5a1b5d5 empezando corralon, CorralonLayout(), auth.ts, auth, core.ts, tienePermiso()]
- "corralon_mapper": "mapper.ts" | kind=code-symbol | source=lib/corralon/mapper.ts:L1 | neighbors=[c27a9ee fase prefinal, rowToSolicitud(), toStr(), types.ts, SolicitudRow, service.ts]
- "dashboard_sign_out_button": "sign-out-button.tsx" | kind=code-symbol | source=app/dashboard/sign-out-button.tsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, page.tsx, SignOutButton(), auth-client.ts, authClient, SubHeader.tsx]
- "deteccion_camara_styles_styles": "styles" | kind=code-symbol | source=components/reportes/deteccion_camara/styles.ts:L1 | neighbors=[ReportFilters.tsx, ReportTables.tsx, styles.ts, ReportFilters.tsx, page.tsx, ReportFilters.tsx]
- "estadisticos_phonepagination": "PhonePagination.tsx" | kind=code-symbol | source=components/reportes/estadisticos/PhonePagination.tsx:L1 | neighbors=[6f8a089 Vista de estadisticos diarios, …, paginationButtonStyle, PaginationProps, PhonePagination(), styles.ts, styles]
- "expediente_client_subirarchivoexpediente": "subirArchivoExpediente()" | kind=code-symbol | source=lib/expediente/client.ts:L28 | neighbors=[client.ts, actions.ts, expediente.ts, route.ts, route.ts, route.ts]
- "fiscalia_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=lib/fiscalia/abrirDocumento.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5bbdda8 Merge pull request #8 from pres…, ac48eb1 Merge pull request #17 from pre…, ff6d3c2 juzgado, abrirDocumento()]
- "fiscalia_actions_obtenerdashboardfiscalia": "obtenerDashboardFiscalia()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L16 | neighbors=[page.tsx, actions.ts, page.tsx, page.tsx, page.tsx, page.tsx]
- "fiscalia_confirmacionmodal": "ConfirmacionModal.tsx" | kind=code-symbol | source=components/fiscalia/ConfirmacionModal.tsx:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, ff6d3c2 juzgado, ConfirmacionModal(), ConfirmacionModalProps, VARIANTES, FiscaliaDashboard.tsx]
- "fiscalia_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/fiscalia/ProfileDropdown.tsx:L14 | neighbors=[page.tsx, page.tsx, ProfileDropdown.tsx, page.tsx, page.tsx, page.tsx]
- "fiscalia_subirfotodetenido": "SubirFotoDetenido.tsx" | kind=code-symbol | source=components/fiscalia/SubirFotoDetenido.tsx:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, compressImage(), SubirFotoDetenido(), page.tsx]
- "fiscalia_types_detalleasegurado": "DetalleAsegurado" | kind=code-symbol | source=lib/fiscalia/types.ts:L125 | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, repository.ts, service.ts, types.ts]
- "fiscalia_types_detenidodireccioninput": "DetenidoDireccionInput" | kind=code-symbol | source=lib/fiscalia/types.ts:L43 | neighbors=[actions.ts, actions.ts, FormularioAsegurado.tsx, repository.ts, service.ts, types.ts]
- "fiscalia_types_puestadisposicioninput": "PuestaDisposicionInput" | kind=code-symbol | source=lib/fiscalia/types.ts:L110 | neighbors=[actions.ts, actions.ts, FormularioPuestaDisposicion.tsx, repository.ts, service.ts, types.ts]
- "flota_service_listarpatrullasparaasignacion": "listarPatrullasParaAsignacion()" | kind=code-symbol | source=lib/flota/service.ts:L90 | neighbors=[page.tsx, service.ts, obtenerFlota(), page.tsx, page.tsx, page.tsx]
- "helpers_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=features/via/expediente/helpers/abrirDocumento.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, af993fb Fix/Monitorista, f5fac0b Merge branch 'testing' into con…, abrirDocumento()]
- "hooks_useempleado": "useEmpleado.ts" | kind=code-symbol | source=hooks/useEmpleado.ts:L1 | neighbors=[a58a0f7 Despachos, DespachoForm.tsx, EmpleadoResult, useEmpleado(), FormSection.tsx, 6feefe2 BackEnd completo para hacer la …]
- "hooks_useflota": "useFlota.ts" | kind=code-symbol | source=hooks/useFlota.ts:L1 | neighbors=[a58a0f7 Despachos, DespachoForm.tsx, FiltrosFlota, useFlota(), VehiculoOption, 6feefe2 BackEnd completo para hacer la …]
- "hooks_useregistrodetenido": "useRegistroDetenido.ts" | kind=code-symbol | source=hooks/useRegistroDetenido.ts:L1 | neighbors=[generarPresentacion.tsx, 06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5830570 Seccion de analista, uya con bd…, a353e63 Ya se enlazan datos pero no com…, useRegistroDetenido()]
- "incidentes_actions_num": "num()" | kind=code-symbol | source=lib/incidentes/actions.ts:L27 | neighbors=[actions.ts, createIncidente(), createIncidenteCliente(), createRecorridoCompleto(), createReporteCampo(), insertarIncidente()]
- "incidentes_folio": "folio.ts" | kind=code-symbol | source=lib/incidentes/folio.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, actions.ts, generarFolioIncidente(), db.ts, query(), 6feefe2 BackEnd completo para hacer la …]
- "incidentes_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L13 | neighbors=[actions.ts, page.tsx, page.tsx, permisos.ts, verificarAccesoIncidentesApi(), page.tsx]
- "infracciones_service_infraccionesservice": "InfraccionesService" | kind=code-symbol | source=features/via/infracciones/service.ts:L32 | neighbors=[page.tsx, route.ts, service.ts, .obtenerPorId(), .registrarNuevaInfraccionSV(), route.ts]
- "manual_migrations_0008_monitorista_permisos": "0008_monitorista_permisos.sql" | kind=code-symbol | source=lib/db/manual-migrations/0008_monitorista_permisos.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, monitorista_permisos, users]
- "manual_migrations_0011_permisos_plantillas": "0011_permisos_plantillas.sql" | kind=code-symbol | source=lib/db/manual-migrations/0011_permisos_plantillas.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, permisos_plantillas, roles]
- "oficial_marcarensitiobutton": "MarcarEnSitioButton.tsx" | kind=code-symbol | source=components/oficial/MarcarEnSitioButton.tsx:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, page.tsx, actions.ts, marcarEnSitioOficial(), MarcarEnSitioButton(), Props]
- "reportes_sin_d1_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-d1/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToSinD1(), toStr(), types.ts, SinD1Row, repository.ts]
- "reportes_sin_novedad_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToSinNovedad(), toStr(), types.ts, SinNovedadRow, repository.ts]
- "reportes_welcomebanner": "welcomeBanner.tsx" | kind=code-symbol | source=components/reportes/welcomeBanner.tsx:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, page.tsx, page.tsx, SentinelHero()]
- "rol_servicios_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L7 | neighbors=[mapper.ts, rowToEstadoFuerzaConcepto(), rowToRadio(), rowToRolAsignacion(), rowToRolObservacion(), rowToRolServicio()]
- "rol_servicios_rolinputs": "RolInputs.tsx" | kind=code-symbol | source=components/rol_servicios/RolInputs.tsx:L1 | neighbors=[page.tsx, Props, RolField(), RegistroIncidenteForm.tsx, b68a2b7 Merge branch 'feature/testing' …, f9243ac Interfaz de formulario de rol d…]
- "rol_servicios_servicefooter": "ServiceFooter.tsx" | kind=code-symbol | source=components/rol_servicios/ServiceFooter.tsx:L1 | neighbors=[page.tsx, ServiceFooter(), SignatureModal.tsx, SignatureModal(), b68a2b7 Merge branch 'feature/testing' …, f9243ac Interfaz de formulario de rol d…]
- "sasiete_client": "client.ts" | kind=code-symbol | source=features/via/saSiete/client.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, generarOrdenPago()]
- "services_registrodetenidoservice": "registroDetenidoService.ts" | kind=code-symbol | source=services/registroDetenidoService.ts:L1 | neighbors=[generarPresentacion.tsx, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 9550203 Cambios en presentacion, se gen…, 9faf222 Merge branch 'feature/testing' …, registroDetenidoService]
- "shared_abrirdocumento_abrirdocumento": "abrirDocumento()" | kind=code-symbol | source=lib/shared/abrirDocumento.ts:L1 | neighbors=[DetallesAseguradoView.tsx, RevisionDocumentosSection.tsx, SeccionLiberacion.tsx, DetallesAseguradoView.tsx, abrirDocumento.ts, DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_sanitize": "sanitize()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L116 | neighbors=[DetalleInfraccionView.tsx, FundamentoLegalSection(), InfractorVehiculoSection(), mapGarantia(), MapSection(), OficialSection()]
- "shared_infracciones_obtenerdetalleinfraccionvia": "obtenerDetalleInfraccionVia()" | kind=code-symbol | source=lib/shared/infracciones.ts:L237 | neighbors=[actions.ts, actions.ts, actions.ts, actions.ts, infracciones.ts, rowToInfraccionDetalle()]
- "ui_segmentedcontrol_segmentedcontrol": "SegmentedControl()" | kind=code-symbol | source=features/via/infracciones/components/ui/SegmentedControl.tsx:L19 | neighbors=[SeccionLiberacion.tsx, PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, SegmentedControl.tsx]
- "ui_selectwrapper": "SelectWrapper.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/SelectWrapper.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionGarantia.tsx, SelectWrapper()]
- "via_sa7": "sa7.ts" | kind=code-symbol | source=lib/via/sa7.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, route.ts, pagos.ts, consultarEstatusSA7()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-020.json

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
