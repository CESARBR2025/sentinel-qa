# Node Description Batch 20 of 82

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
Write every description in Dutch (nl). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "prevencion_prorrogamodal": "ProrrogaModal.tsx" | kind=code-symbol | source=components/prevencion/ProrrogaModal.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, page.tsx, actions.ts, createProrroga(), I, L]
- "prevencion_semaforovigencia": "SemaforoVigencia.tsx" | kind=code-symbol | source=components/prevencion/SemaforoVigencia.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, semaforo.ts, SemaforoColor, CFG]
- "prevencion_timeline": "timeline.ts" | kind=code-symbol | source=lib/prevencion/timeline.ts:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, checker.ts, SeguimientoTimeline.tsx, calcularFechaEsperada(), getLabelSeguimiento(), TIPOS_SEGUIMIENTO]
- "templates_layout": "layout.ts" | kind=code-symbol | source=lib/emails/templates/layout.ts:L1 | neighbors=[75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, asignacion-fiscalia.ts, emailLayout(), emailStyles, inlineStyles()]
- "ui_toastauto_toastauto": "ToastAuto()" | kind=code-symbol | source=components/ui/ToastAuto.tsx:L7 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, ToastAuto.tsx]
- "utils_generateppt": "generatePPT.ts" | kind=code-symbol | source=lib/utils/generatePPT.ts:L1 | neighbors=[generarPresentacion.tsx, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …]
- "via_expediente_getexpedientetoken": "getExpedienteToken()" | kind=code-symbol | source=lib/via/expediente.ts:L25 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, expediente.ts]
- "911_permisos_obtenerrolnombre": "obtenerRolNombre()" | kind=code-symbol | source=lib/911/permisos.ts:L25 | neighbors=[permisos.ts, page.tsx, page.tsx, page.tsx, tieneAccesoHub(), tieneAccesoSeccion()]
- "admin_admin_styles_btnprimario": "btnPrimario" | kind=code-symbol | source=app/admin/admin-styles.ts:L16 | neighbors=[admin-styles.ts, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx]
- "agente_juzgado_actions_obtenerdashboardjuzgado": "obtenerDashboardJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L36 | neighbors=[actions.ts, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx]
- "agente_juzgado_confirmacionmodal": "ConfirmacionModal.tsx" | kind=code-symbol | source=components/agente_juzgado/ConfirmacionModal.tsx:L1 | neighbors=[ConfirmacionModal(), ConfirmacionModalProps, VARIANTES, JuzgadoDashboard.tsx, 75e03e9 puliendo flujo de juzgado-liber…, ff3622b Merge pull request #11 from pre…]
- "agente_juzgado_subirfotodetenido": "SubirFotoDetenido.tsx" | kind=code-symbol | source=components/agente_juzgado/SubirFotoDetenido.tsx:L1 | neighbors=[compressImage(), SubirFotoDetenido(), 388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, page.tsx]
- "agente_juzgado_types_detalleasegurado": "DetalleAsegurado" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L18 | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, repository.ts, service.ts, types.ts]
- "auth_layout": "layout.tsx" | kind=code-symbol | source=app/(auth)/layout.tsx:L1 | neighbors=[AuthLayout(), metadata, 5aa5866 Cambio de colores en interfaz d…, 5f13b34 Merge branch 'feature/testing' …, 6a042cd feat: sistema de autenticación,…, ce84893 Merge branch 'feature/testing' …]
- "camara_types": "types.ts" | kind=code-symbol | source=lib/camara/types.ts:L1 | neighbors=[mapper.ts, repository.ts, IncidenteCamara, TotalesCamara, ad3ec5f mejorando esto, route.ts]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0c8695c15b5c89d0871fbbc3841f5fc2a7f80bcf": "0c8695c Cambios en filtros" | kind=Commit | source=git | neighbors=[feature/testing, ef95840 Merge branch 'feature/testing' …, DescargaFilters.tsx, 4c9fa8a vista de reporte de d1 no inici…, conexion, testing]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@18f5bac124f7a516e4c794e54c13763523e60419": "18f5bac llamada en card" | kind=Commit | source=git | neighbors=[feature/testing, 22b7b54 Merge branch 'feature/reportes'…, page.tsx, 719b5ab cambio para generacion de repor…, conexion, testing]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3800cab22dfc4c9c5936d59d18ae8d7fc2d84b00": "3800cab formulario de nueva medida de proteccion" | kind=Commit | source=git | neighbors=[1970615 vista de medidas, feature/testing, adf0c3d vista de busqueda y juridico, page.tsx, conexion, testing]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7af0ca79d22e1999f9b6c50baed36ce9a260cb00": "7af0ca7 page de reportes actualizado" | kind=Commit | source=git | neighbors=[1acddac Merge branch 'feature/testing' …, feature/testing, 2fcba7b vista de reportes de incidentes…, page.tsx, conexion, testing]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@dba1bfbdc2ce4fe738967eccad3d22a8439ba787": "dba1bfb color de boton" | kind=Commit | source=git | neighbors=[156c925 vista de reporte de sin robos, feature/testing, 1acddac Merge branch 'feature/testing' …, page.tsx, conexion, testing]
- "complementos_repository": "repository.ts" | kind=code-symbol | source=lib/complementos/repository.ts:L1 | neighbors=[ad3ec5f mejorando esto, GruaRow, listarGruasActivas(), db.ts, query(), route.ts]
- "components_pagoinfraccion": "PagoInfraccion.tsx" | kind=code-symbol | source=features/via/infracciones/components/PagoInfraccion.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, PagoInfraccion(), Props, page.tsx]
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
- "hooks_useempleado": "useEmpleado.ts" | kind=code-symbol | source=hooks/useEmpleado.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, a58a0f7 Despachos, DespachoForm.tsx, EmpleadoResult, useEmpleado(), FormSection.tsx]
- "hooks_useflota": "useFlota.ts" | kind=code-symbol | source=hooks/useFlota.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, a58a0f7 Despachos, DespachoForm.tsx, FiltrosFlota, useFlota(), VehiculoOption]

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
