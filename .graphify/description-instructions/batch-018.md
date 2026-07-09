# Node Description Batch 19 of 79

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

- "fiscalia_actions_obtenerdashboardfiscalia": "obtenerDashboardFiscalia()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L16 | neighbors=[page.tsx, actions.ts, page.tsx, page.tsx, page.tsx, page.tsx]
- "fiscalia_confirmacionmodal": "ConfirmacionModal.tsx" | kind=code-symbol | source=components/fiscalia/ConfirmacionModal.tsx:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, ff6d3c2 juzgado, ConfirmacionModal(), ConfirmacionModalProps, VARIANTES, FiscaliaDashboard.tsx]
- "fiscalia_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/fiscalia/ProfileDropdown.tsx:L14 | neighbors=[page.tsx, page.tsx, ProfileDropdown.tsx, page.tsx, page.tsx, page.tsx]
- "fiscalia_subirfotodetenido": "SubirFotoDetenido.tsx" | kind=code-symbol | source=components/fiscalia/SubirFotoDetenido.tsx:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, compressImage(), SubirFotoDetenido(), page.tsx]
- "fiscalia_types_detalleasegurado": "DetalleAsegurado" | kind=code-symbol | source=lib/fiscalia/types.ts:L125 | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, repository.ts, service.ts, types.ts]
- "fiscalia_types_detenidodireccioninput": "DetenidoDireccionInput" | kind=code-symbol | source=lib/fiscalia/types.ts:L43 | neighbors=[actions.ts, actions.ts, FormularioAsegurado.tsx, repository.ts, service.ts, types.ts]
- "fiscalia_types_puestadisposicioninput": "PuestaDisposicionInput" | kind=code-symbol | source=lib/fiscalia/types.ts:L110 | neighbors=[actions.ts, actions.ts, FormularioPuestaDisposicion.tsx, repository.ts, service.ts, types.ts]
- "flota_service_listarpatrullasparaasignacion": "listarPatrullasParaAsignacion()" | kind=code-symbol | source=lib/flota/service.ts:L72 | neighbors=[page.tsx, service.ts, obtenerFlota(), page.tsx, page.tsx, page.tsx]
- "helpers_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=features/via/expediente/helpers/abrirDocumento.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, af993fb Fix/Monitorista, f5fac0b Merge branch 'testing' into con…, abrirDocumento()]
- "hooks_useempleado": "useEmpleado.ts" | kind=code-symbol | source=hooks/useEmpleado.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, a58a0f7 Despachos, DespachoForm.tsx, EmpleadoResult, useEmpleado(), FormSection.tsx]
- "hooks_useflota": "useFlota.ts" | kind=code-symbol | source=hooks/useFlota.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, a58a0f7 Despachos, DespachoForm.tsx, FiltrosFlota, useFlota(), VehiculoOption]
- "hooks_useregistrodetenido": "useRegistroDetenido.ts" | kind=code-symbol | source=hooks/useRegistroDetenido.ts:L1 | neighbors=[generarPresentacion.tsx, 06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5830570 Seccion de analista, uya con bd…, a353e63 Ya se enlazan datos pero no com…, useRegistroDetenido()]
- "incidentes_folio": "folio.ts" | kind=code-symbol | source=lib/incidentes/folio.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 6feefe2 BackEnd completo para hacer la …, actions.ts, generarFolioIncidente(), db.ts, query()]
- "incidentes_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L14 | neighbors=[actions.ts, page.tsx, page.tsx, permisos.ts, verificarAccesoIncidentesApi(), page.tsx]
- "infracciones_service_infraccionesservice": "InfraccionesService" | kind=code-symbol | source=features/via/infracciones/service.ts:L32 | neighbors=[page.tsx, route.ts, service.ts, .obtenerPorId(), .registrarNuevaInfraccionSV(), route.ts]
- "manual_migrations_0008_monitorista_permisos": "0008_monitorista_permisos.sql" | kind=code-symbol | source=lib/db/manual-migrations/0008_monitorista_permisos.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, monitorista_permisos, users]
- "manual_migrations_0011_permisos_plantillas": "0011_permisos_plantillas.sql" | kind=code-symbol | source=lib/db/manual-migrations/0011_permisos_plantillas.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, permisos_plantillas, roles]
- "prevencion_semaforo": "semaforo.ts" | kind=code-symbol | source=lib/prevencion/semaforo.ts:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, calcularSemaforoVigencia(), SemaforoColor, SemaforoVigencia.tsx]
- "reportes_sin_d1_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-d1/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToSinD1(), toStr(), types.ts, SinD1Row, repository.ts]
- "reportes_sin_novedad_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToSinNovedad(), toStr(), types.ts, SinNovedadRow, repository.ts]
- "reportes_welcomebanner": "welcomeBanner.tsx" | kind=code-symbol | source=components/reportes/welcomeBanner.tsx:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, page.tsx, page.tsx, SentinelHero()]
- "rol_servicios_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L7 | neighbors=[mapper.ts, rowToEstadoFuerzaConcepto(), rowToRadio(), rowToRolAsignacion(), rowToRolObservacion(), rowToRolServicio()]
- "sasiete_client": "client.ts" | kind=code-symbol | source=features/via/saSiete/client.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, generarOrdenPago()]
- "services_registrodetenidoservice": "registroDetenidoService.ts" | kind=code-symbol | source=services/registroDetenidoService.ts:L1 | neighbors=[generarPresentacion.tsx, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 9550203 Cambios en presentacion, se gen…, 9faf222 Merge branch 'feature/testing' …, registroDetenidoService]
- "shared_abrirdocumento_abrirdocumento": "abrirDocumento()" | kind=code-symbol | source=lib/shared/abrirDocumento.ts:L1 | neighbors=[DetallesAseguradoView.tsx, RevisionDocumentosSection.tsx, SeccionLiberacion.tsx, DetallesAseguradoView.tsx, abrirDocumento.ts, DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_sanitize": "sanitize()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L116 | neighbors=[DetalleInfraccionView.tsx, FundamentoLegalSection(), InfractorVehiculoSection(), mapGarantia(), MapSection(), OficialSection()]
- "shared_infracciones_obtenerdetalleinfraccionvia": "obtenerDetalleInfraccionVia()" | kind=code-symbol | source=lib/shared/infracciones.ts:L237 | neighbors=[actions.ts, actions.ts, actions.ts, actions.ts, infracciones.ts, rowToInfraccionDetalle()]
- "ui_segmentedcontrol_segmentedcontrol": "SegmentedControl()" | kind=code-symbol | source=features/via/infracciones/components/ui/SegmentedControl.tsx:L19 | neighbors=[SeccionLiberacion.tsx, PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, SegmentedControl.tsx]
- "ui_selectwrapper": "SelectWrapper.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/SelectWrapper.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionGarantia.tsx, SelectWrapper()]
- "via_sa7": "sa7.ts" | kind=code-symbol | source=lib/via/sa7.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, route.ts, pagos.ts, consultarEstatusSA7()]
- "admin_admin_styles_cardstyle": "cardStyle" | kind=code-symbol | source=app/admin/admin-styles.ts:L28 | neighbors=[admin-styles.ts, page.tsx, page.tsx, page.tsx, page.tsx]
- "admin_types": "types.ts" | kind=code-symbol | source=lib/admin/types.ts:L1 | neighbors=[mapper.ts, repository.ts, RolItem, UsuarioLista, 12aab65 fase 4]
- "agente_infracciones_types_capturainfractorinput": "CapturaInfractorInput" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L33 | neighbors=[actions.ts, mapper.ts, repository.ts, service.ts, types.ts]
- "agente_juzgado_botonverdetalle": "BotonVerDetalle.tsx" | kind=code-symbol | source=components/agente_juzgado/BotonVerDetalle.tsx:L1 | neighbors=[BotonVerDetalle(), BotonVerDetalleProps, JuzgadoDashboard.tsx, 75e03e9 puliendo flujo de juzgado-liber…, ff3622b Merge pull request #11 from pre…]
- "agente_juzgado_types_solicitudevidencia": "SolicitudEvidencia" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L135 | neighbors=[actions.ts, mapper.ts, service.ts, TabSolicitudes.tsx, types.ts]
- "agente_juzgado_types_viainfracciondetalle": "ViaInfraccionDetalle" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L125 | neighbors=[actions.ts, JuzgadoDashboard.tsx, mapper.ts, service.ts, types.ts]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0844e6e1c27168ffc88acbe2c2d8b6f4cfb6a8f6": "0844e6e Corregido" | kind=Commit | source=git | neighbors=[conexion, testing, Formulario911.tsx, 71912a4 Bitacora incluida, 7f3fe1a Formulariop de Rondines listo, …]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0c8695c15b5c89d0871fbbc3841f5fc2a7f80bcf": "0c8695c Cambios en filtros" | kind=Commit | source=git | neighbors=[conexion, testing, ef95840 Merge branch 'feature/testing' …, DescargaFilters.tsx, 4c9fa8a vista de reporte de d1 no inici…]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1265204bc97feaa6fb75df1806e9897fa23366a9": "1265204 paginacion por tablas" | kind=Commit | source=git | neighbors=[conexion, testing, 5bbdda8 Merge pull request #8 from pres…, ReportTables.tsx, 24626eb se agregan opciones de reportes]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@133bb9d68dd354e2a1b062f5d4f641bc8757a9ed": "133bb9d pages de listado de llamadas y de radio" | kind=Commit | source=git | neighbors=[conexion, testing, 3b0e087 NAVEGACION, page.tsx, 83f48a2 Merge branch 'feature/correccio…]

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
