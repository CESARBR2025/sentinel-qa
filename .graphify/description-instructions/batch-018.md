# Node Description Batch 19 of 89

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@deb4649e9609d3371eda8b082dfbd3121ea108d4": "deb4649 eLIMINE CARPETA" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main, 199ce68 Merge branch 'main' of https://…]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ea040d6534df9613a15a08a709ea1fc01bb0800b": "ea040d6 Carpeta creada" | kind=Commit | source=git | neighbors=[d3e6d95 Update SeguimientoTimeline.tsx, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@eacfdaf17cb7ed00add221d47a22bdb792e4b5da": "eacfdaf mostrando toast de guardado" | kind=Commit | source=git | neighbors=[0d9172a mejorando flujo de 911-despacho, layout.tsx, feature/testing, Formulario911.tsx, ac5d42f cerrando flujo de 911-despacho-, page.tsx]
- "components_mapsectionciudadano": "MapSectionCiudadano.tsx" | kind=code-symbol | source=features/via/infracciones/components/MapSectionCiudadano.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, a21f03f fix bugs reporte denuncia, ac48eb1 Merge pull request #17 from pre…, containerStyle, MapSectionCiudadano()]
- "d1_mapper": "mapper.ts" | kind=code-symbol | source=lib/d1/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToReporteD1(), toBool(), toNum(), toStr(), types.ts]
- "d1_noiniciada_descargapagination": "DescargaPagination.tsx" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaPagination.tsx:L1 | neighbors=[4c9fa8a vista de reporte de d1 no inici…, 712c116 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, DescargaPagination(), PaginationProps, styles.ts]
- "d1_noiniciada_styles": "styles.ts" | kind=code-symbol | source=components/reportes/d1_noiniciada/styles.ts:L1 | neighbors=[4c9fa8a vista de reporte de d1 no inici…, 712c116 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, DescargaFilters.tsx, DescargaPagination.tsx, DescargaTable.tsx]
- "expediente_client_obtenerguesttoken": "obtenerGuestToken()" | kind=code-symbol | source=lib/expediente/client.ts:L7 | neighbors=[client.ts, actions.ts, expediente.ts, ppt-service.ts, route.ts, route.ts]
- "fiscalia_types_detalleaseguradocompleto": "DetalleAseguradoCompleto" | kind=code-symbol | source=lib/fiscalia/types.ts:L55 | neighbors=[actions.ts, FormularioAseguradoJuzgado.tsx, actions.ts, FormularioAsegurado.tsx, FormularioPuestaDisposicion.tsx, mapper.ts]
- "fiscalia_usetoaststore": "useToastStore.ts" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, ff6d3c2 juzgado, CargarOficioSection.tsx, generateId(), Toast, ToastStore]
- "incidentes_actions_createincidentecliente": "createIncidenteCliente()" | kind=code-symbol | source=lib/incidentes/actions.ts:L161 | neighbors=[Formulario911.tsx, actions.ts, createAlarmaEscolar(), createExtorsion(), num(), req()]
- "incidentes_audit": "audit.ts" | kind=code-symbol | source=lib/incidentes/audit.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 6feefe2 BackEnd completo para hacer la …, route.ts, actions.ts, Accion, registrarAudit()]
- "incidentes_styles": "styles.ts" | kind=code-symbol | source=components/reportes/incidentes/styles.ts:L1 | neighbors=[2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, FiltrosIncidencias.tsx, Paginacion.tsx, styles]
- "infracciones_actions": "actions.ts" | kind=code-symbol | source=features/via/infracciones/actions.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, eliminarInfraccionAction()]
- "legalidad_types": "types.ts" | kind=code-symbol | source=features/via/legalidad/types.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapper.ts, service.ts]
- "lib_error_handler_tryaction": "tryAction()" | kind=code-symbol | source=lib/error-handler.ts:L46 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, actions.ts, actions.ts]
- "lib_error_handler_tryactionraw": "tryActionRaw()" | kind=code-symbol | source=lib/error-handler.ts:L59 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, actions.ts, actions.ts]
- "liberar_garantia_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/liberar-garantia/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto, ede5a1d eliminado referencias a via_pru…, repository.ts]
- "manual_migrations_0006_formato_n_public_formato_n_reportes": "public.formato_n_reportes" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L88 | neighbors=[0006_formato_n.sql, formato_n_armas_aseguradas, formato_n_atencion_victimas, formato_n_eventos, formato_n_fge, formato_n_fgr]
- "modulo_incidentes_styles_styles": "styles" | kind=code-symbol | source=components/reportes/modulo_incidentes/styles.ts:L1 | neighbors=[page.tsx, PhonePagination.tsx, PhoneReportsTable.tsx, PhoneStatsCards.tsx, page.tsx, ReportesTabs.tsx]
- "oficial_mapapinfijo": "MapaPinFijo.tsx" | kind=code-symbol | source=components/oficial/MapaPinFijo.tsx:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 44ebbc4 Merge branch 'feature/testing' …, a291695 Merge branch 'feature/testing' …, b79a96a Conexión entre ambos modulos, page.tsx, MapaPinFijo()]
- "oficial_toastexito": "ToastExito.tsx" | kind=code-symbol | source=components/oficial/ToastExito.tsx:L1 | neighbors=[page.tsx, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 93dd3ea Merge pull request #1 from pres…, aaddee5 Merge branch 'feature/testing' …, page.tsx]
- "oficiales_service": "service.ts" | kind=code-symbol | source=features/via/oficiales/service.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, repository.ts, OficialesViaRepository]
- "plugins_graphify": "graphify.js" | kind=code-symbol | source=.opencode/plugins/graphify.js:L1 | neighbors=[e6bffc9 boveda conectada, CONTEXT_MAP_PATH, __dirname, GRAPH_JSON, GraphifyPlugin(), LOADER_SCRIPT]
- "proxy": "proxy.ts" | kind=code-symbol | source=proxy.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, 6cb1055 Mejoras de UI/UIX, auth.ts, Session, config, isPublic()]
- "reportes_incidentes_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-incidentes/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToReporteDiario(), rowToReporteSemanal(), toNum(), types.ts, ReporteDiarioRow]
- "reportes_incidentes_types": "types.ts" | kind=code-symbol | source=lib/reportes-incidentes/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, ReporteDiarioRow, ReporteIncidenteCombinado]
- "reportes_menuoption": "menuOption.tsx" | kind=code-symbol | source=components/reportes/menuOption.tsx:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, page.tsx, OptionSquare(), OptionSquareProps]
- "rol_servicios_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L18 | neighbors=[mapper.ts, rowToBodyCam(), rowToEstadoFuerzaConcepto(), rowToMedioCanalizacion(), rowToRadio(), rowToSector()]
- "services_analistaservice": "analistaService.ts" | kind=code-symbol | source=services/analistaService.ts:L1 | neighbors=[formAnalisis.tsx, 2ca9f50 Formulario sin backend, 5618308 guardado e evidencias con ed, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …]
- "steps_pasoconfirmacionpago": "PasoConfirmacionPago.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacionPago.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, PasoConfirmacion.tsx]
- "tabladevinfracciones_detalleinfraccionmodal": "DetalleInfraccionModal.tsx" | kind=code-symbol | source=features/depInfracciones/components/TablaDevInfracciones/DetalleInfraccionModal.tsx:L1 | neighbors=[0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…, e286619 Merge branch 'feature/testing' …, DetalleInfraccionModal()]
- "ui_cardtitle_cardtitle": "CardTitle()" | kind=code-symbol | source=features/via/infracciones/components/ui/CardTitle.tsx:L1 | neighbors=[PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, PasoVehiculo.tsx, SeccionGarantia.tsx]
- "ui_customselect": "CustomSelect.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/CustomSelect.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionMotivo.tsx, CustomSelect()]
- "via_online": "online.ts" | kind=code-symbol | source=lib/via/online.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, getSnapshot()]
- "agente_911_service": "service.ts" | kind=code-symbol | source=lib/agente_911/service.ts:L1 | neighbors=[page.tsx, verificarRolAgente911(), db.ts, query(), 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…]
- "agente_bitacorista_service": "service.ts" | kind=code-symbol | source=lib/agente_bitacorista/service.ts:L1 | neighbors=[page.tsx, verificarRolAgenteBitacorista(), db.ts, query(), 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…]
- "agente_despacho_service": "service.ts" | kind=code-symbol | source=lib/agente_despacho/service.ts:L1 | neighbors=[page.tsx, verificarRolAgenteDespacho(), db.ts, query(), 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…]
- "agente_juzgado_cerrarcasomodal": "CerrarCasoModal.tsx" | kind=code-symbol | source=components/agente_juzgado/CerrarCasoModal.tsx:L1 | neighbors=[actions.ts, accionCerrarCaso(), CerrarCasoBoton(), 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …, a7218bd Merge pull request #4 from pres…]
- "agente_juzgado_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/agente_juzgado/ProfileDropdown.tsx:L14 | neighbors=[page.tsx, ProfileDropdown.tsx, page.tsx, page.tsx, page.tsx, page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-018.json

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
