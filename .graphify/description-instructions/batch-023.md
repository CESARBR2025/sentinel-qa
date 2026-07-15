# Node Description Batch 24 of 93

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

- "rol_servicios_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L7 | neighbors=[mapper.ts, rowToEstadoFuerzaConcepto(), rowToRadio(), rowToRolAsignacion(), rowToRolObservacion(), rowToRolServicio()]
- "rol_servicios_signaturemodal": "SignatureModal.tsx" | kind=code-symbol | source=components/rol_servicios/SignatureModal.tsx:L1 | neighbors=[863c575 Merge pull request #24 from pre…, b68a2b7 Merge branch 'feature/testing' …, f9243ac Interfaz de formulario de rol d…, ServiceFooter.tsx, Props, SignatureModal()]
- "shared_abrirdocumento_abrirdocumento": "abrirDocumento()" | kind=code-symbol | source=lib/shared/abrirDocumento.ts:L1 | neighbors=[DetallesAseguradoView.tsx, RevisionDocumentosSection.tsx, SeccionLiberacion.tsx, DetallesAseguradoView.tsx, abrirDocumento.ts, DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_sanitize": "sanitize()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L116 | neighbors=[DetalleInfraccionView.tsx, FundamentoLegalSection(), InfractorVehiculoSection(), mapGarantia(), MapSection(), OficialSection()]
- "shared_infracciones_obtenerdetalleinfraccionvia": "obtenerDetalleInfraccionVia()" | kind=code-symbol | source=lib/shared/infracciones.ts:L237 | neighbors=[actions.ts, actions.ts, actions.ts, actions.ts, infracciones.ts, rowToInfraccionDetalle()]
- "stores_userondinformstore": "useRondinFormStore.ts" | kind=code-symbol | source=stores/useRondinFormStore.ts:L1 | neighbors=[435348e corrigiendo flujo de rondin, 863c575 Merge pull request #24 from pre…, f0089cf Merge pull request #21 from pre…, FormRondinEscalado.tsx, RondinFormState, useRondinFormStore]
- "token_guest_route": "route.ts" | kind=code-symbol | source=app/api/auth/token-guest/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, POST()]
- "ui_radioinput": "RadioInput.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/RadioInput.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, RadioOption()]
- "ui_segmentedcontrol_segmentedcontrol": "SegmentedControl()" | kind=code-symbol | source=features/via/infracciones/components/ui/SegmentedControl.tsx:L19 | neighbors=[SeccionLiberacion.tsx, PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, SegmentedControl.tsx]
- "admin_admin_styles_cardstyle": "cardStyle" | kind=code-symbol | source=app/admin/admin-styles.ts:L28 | neighbors=[admin-styles.ts, page.tsx, page.tsx, page.tsx, page.tsx]
- "agente_infracciones_types_capturainfractorinput": "CapturaInfractorInput" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L33 | neighbors=[actions.ts, mapper.ts, repository.ts, service.ts, types.ts]
- "agente_juzgado_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/agente_juzgado/permisos.ts:L8 | neighbors=[permisos.ts, service.ts, route.ts, service.ts, route.ts]
- "agente_juzgado_types_solicitudevidencia": "SolicitudEvidencia" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L135 | neighbors=[actions.ts, mapper.ts, service.ts, TabSolicitudes.tsx, types.ts]
- "agente_juzgado_types_viainfracciondetalle": "ViaInfraccionDetalle" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L125 | neighbors=[actions.ts, JuzgadoDashboard.tsx, mapper.ts, service.ts, types.ts]
- "analisis_permisos_verificaraccesoanalisisapi": "verificarAccesoAnalisisApi()" | kind=code-symbol | source=lib/analisis/permisos.ts:L29 | neighbors=[permisos.ts, tienePermiso(), route.ts, route.ts, tieneAccesoAnalisis()]
- "d1_mapper_rowtoreported1": "rowToReporteD1()" | kind=code-symbol | source=lib/d1/mapper.ts:L21 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts]
- "d1_noiniciada_styles_styles": "styles" | kind=code-symbol | source=components/reportes/d1_noiniciada/styles.ts:L1 | neighbors=[DescargaFilters.tsx, DescargaPagination.tsx, DescargaTable.tsx, page.tsx, styles.ts]
- "d1_styles_styles": "styles" | kind=code-symbol | source=components/reportes/d1/styles.ts:L3 | neighbors=[D1Filters.tsx, D1Pagination.tsx, D1ReportsTable.tsx, page.tsx, styles.ts]
- "db_index": "index.ts" | kind=code-symbol | source=lib/db/index.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, db, schema.ts, db.ts, auth.ts]
- "fiscalia_expedienteview_expedienteview": "ExpedienteView()" | kind=code-symbol | source=components/fiscalia/ExpedienteView.tsx:L49 | neighbors=[ExpedienteView.tsx, dsp(), fmtFecha(), parseDetenidos(), page.tsx]
- "fiscalia_types_solicitudevidencia": "SolicitudEvidencia" | kind=code-symbol | source=lib/fiscalia/types.ts:L234 | neighbors=[actions.ts, mapper.ts, service.ts, TabSolicitudes.tsx, types.ts]
- "generar_route_tablafiscalia": "tablaFiscalia()" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L61 | neighbors=[route.ts, GET(), dRow(), hRow(), toN()]
- "hooks_useincidentes": "useIncidentes.ts" | kind=code-symbol | source=hooks/useIncidentes.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, 863c575 Merge pull request #24 from pre…, Filtros, IncidenteResumen, useIncidentes()]
- "id_page_infraccionciudadanopage": "InfraccionCiudadanoPage()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L64 | neighbors=[page.tsx, formatDate(), getStatusStyle(), sanitize(), timeAgo()]
- "incidentes_actions_createalarmaescolar": "createAlarmaEscolar()" | kind=code-symbol | source=lib/incidentes/actions.ts:L843 | neighbors=[actions.ts, req(), requireOperador(), createIncidente(), createIncidenteCliente()]
- "incidentes_actions_createextorsion": "createExtorsion()" | kind=code-symbol | source=lib/incidentes/actions.ts:L811 | neighbors=[actions.ts, req(), requireOperador(), createIncidente(), createIncidenteCliente()]
- "incidentes_actions_createrondinescalado": "createRondinEscalado()" | kind=code-symbol | source=lib/incidentes/actions.ts:L320 | neighbors=[actions.ts, num(), req(), requireOperador(), FormRondinEscalado.tsx]
- "incidentes_actions_validarenum": "validarEnum()" | kind=code-symbol | source=lib/incidentes/actions.ts:L41 | neighbors=[actions.ts, addPersonaAfectada(), createIncidente(), createIncidenteCliente(), insertarIncidente()]
- "incidentes_mapper_rowtoincidentedetallecompletobase": "rowToIncidenteDetalleCompletoBase()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L205 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts]
- "incidentes_mapper_rowtoreportecampo": "rowToReporteCampo()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L119 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts]
- "incidentes_mapper_rowtoreportecampodetalle": "rowToReporteCampoDetalle()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L241 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts]
- "incidentes_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L32 | neighbors=[mapper.ts, rowToIncidenteConDespachoBase(), rowToIncidenteDetalleCompletoBase(), rowToReporteCampo(), rowToReporteCampoDetalle()]
- "incidentes_styles_styles": "styles" | kind=code-symbol | source=components/reportes/incidentes/styles.ts:L1 | neighbors=[FiltrosIncidencias.tsx, Paginacion.tsx, styles.ts, TablaIncidentes.tsx, page.tsx]
- "incidentes_toastonload": "ToastOnLoad.tsx" | kind=code-symbol | source=app/agente_911/ciudadano/incidentes/ToastOnLoad.tsx:L1 | neighbors=[22bf125 Merge pull request #20 from pre…, 863c575 Merge pull request #24 from pre…, eacfdaf mostrando toast de guardado, page.tsx, ToastOnLoad()]
- "manual_migrations_0009_rename_permisos": "0009_rename_permisos.sql" | kind=code-symbol | source=lib/db/manual-migrations/0009_rename_permisos.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, f2c66e6 Extender roles y permisos finos…]
- "manual_migrations_0010_permisos_seccion_libre": "0010_permisos_seccion_libre.sql" | kind=code-symbol | source=lib/db/manual-migrations/0010_permisos_seccion_libre.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, f2c66e6 Extender roles y permisos finos…]
- "manual_migrations_0012_permisos_eliminar": "0012_permisos_eliminar.sql" | kind=code-symbol | source=lib/db/manual-migrations/0012_permisos_eliminar.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, f2c66e6 Extender roles y permisos finos…]
- "maps_loadgooglemaps_loadgooglemaps": "loadGoogleMaps()" | kind=code-symbol | source=lib/maps/loadGoogleMaps.ts:L52 | neighbors=[loadGoogleMaps.ts, getMapsWindow(), waitForGoogle(), MapaPinFijo.tsx, FormRondinEscalado.tsx]
- "monitorista_mapper_rowtoincidentecamara": "rowToIncidenteCamara()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L175 | neighbors=[mapper.ts, num(), parseTurno(), repository.ts, service.ts]
- "monitorista_subirevidenciamodal_subirevidenciamodal": "SubirEvidenciaModal()" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L50 | neighbors=[BandejaSolicitudes.tsx, BotonSubirDenuncia.tsx, SubirEvidenciaModal.tsx, btnSubmit(), formatSize()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-023.json

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
