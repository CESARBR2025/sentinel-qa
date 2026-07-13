# Node Description Batch 51 of 86

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

- "rol_servicios_servicefooter_servicefooter": "ServiceFooter()" | kind=code-symbol | source=components/rol_servicios/ServiceFooter.tsx:L6 | neighbors=[page.tsx, ServiceFooter.tsx]
- "rol_servicios_servicetable_servicetable": "ServiceTable()" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L12 | neighbors=[page.tsx, ServiceTable.tsx]
- "rol_servicios_signaturemodal_signaturemodal": "SignatureModal()" | kind=code-symbol | source=components/rol_servicios/SignatureModal.tsx:L13 | neighbors=[ServiceFooter.tsx, SignatureModal.tsx]
- "rol_servicios_types_turno": "Turno" | kind=code-symbol | source=lib/rol-servicios/types.ts:L1 | neighbors=[service.ts, types.ts]
- "sasiete_client_generarordenpago": "generarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/client.ts:L1 | neighbors=[FormularioInfraccion.tsx, client.ts]
- "sasiete_types_generarordenpagodto": "GenerarOrdenPagoDTO" | kind=code-symbol | source=features/via/saSiete/types.ts:L29 | neighbors=[service.ts, types.ts]
- "sasiete_types_resultadosa7": "ResultadoSA7" | kind=code-symbol | source=features/via/saSiete/types.ts:L40 | neighbors=[service.ts, types.ts]
- "scripts_export_schema_getcolumns": "getColumns()" | kind=code-symbol | source=scripts/export-schema.mjs:L39 | neighbors=[export-schema.mjs, main()]
- "scripts_export_schema_getenums": "getEnums()" | kind=code-symbol | source=scripts/export-schema.mjs:L51 | neighbors=[export-schema.mjs, main()]
- "scripts_export_schema_getschemas": "getSchemas()" | kind=code-symbol | source=scripts/export-schema.mjs:L20 | neighbors=[export-schema.mjs, main()]
- "scripts_export_schema_gettables": "getTables()" | kind=code-symbol | source=scripts/export-schema.mjs:L29 | neighbors=[export-schema.mjs, main()]
- "scripts_exportar_schema_getcolumns": "getColumns()" | kind=code-symbol | source=scripts/exportar-schema.ts:L23 | neighbors=[exportar-schema.ts, main()]
- "scripts_exportar_schema_getenums": "getEnums()" | kind=code-symbol | source=scripts/exportar-schema.ts:L35 | neighbors=[exportar-schema.ts, main()]
- "scripts_exportar_schema_gettables": "getTables()" | kind=code-symbol | source=scripts/exportar-schema.ts:L13 | neighbors=[exportar-schema.ts, main()]
- "scripts_load_context_extractdomain": "extractDomain()" | kind=code-symbol | source=scripts/load-context.mjs:L30 | neighbors=[load-context.mjs, main()]
- "scripts_load_context_querygraph": "queryGraph()" | kind=code-symbol | source=scripts/load-context.mjs:L63 | neighbors=[load-context.mjs, main()]
- "scripts_load_context_resolvepath": "resolvePath()" | kind=code-symbol | source=scripts/load-context.mjs:L43 | neighbors=[load-context.mjs, buildInstructions()]
- "scripts_session_checkpoint_append": "append()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L39 | neighbors=[session-checkpoint.mjs, ensureDir()]
- "scripts_session_checkpoint_budget": "budget()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L130 | neighbors=[session-checkpoint.mjs, budgetReport()]
- "scripts_session_checkpoint_formatnum": "formatNum()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L182 | neighbors=[session-checkpoint.mjs, budgetReport()]
- "scripts_session_checkpoint_summary": "summary()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L74 | neighbors=[session-checkpoint.mjs, formatEvent()]
- "services_registrodetenidoservice_registrodetenidoservice": "registroDetenidoService" | kind=code-symbol | source=services/registroDetenidoService.ts:L4 | neighbors=[generarPresentacion.tsx, registroDetenidoService.ts]
- "shared_detalleinfraccionview_detalleinfraccionview": "DetalleInfraccionView()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L147 | neighbors=[page.tsx, DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_documentacionsection": "DocumentacionSection()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L661 | neighbors=[DetalleInfraccionView.tsx, formatDate()]
- "shared_detalleinfraccionview_formatcurrency": "formatCurrency()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L110 | neighbors=[DetalleInfraccionView.tsx, SummaryBar()]
- "shared_detalleinfraccionview_fundamentolegalsection": "FundamentoLegalSection()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L580 | neighbors=[DetalleInfraccionView.tsx, sanitize()]
- "shared_detalleinfraccionview_infractorvehiculosection": "InfractorVehiculoSection()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L521 | neighbors=[DetalleInfraccionView.tsx, sanitize()]
- "shared_detalleinfraccionview_mapgarantia": "mapGarantia()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L121 | neighbors=[DetalleInfraccionView.tsx, sanitize()]
- "shared_detalleinfraccionview_mapsection": "MapSection()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L207 | neighbors=[DetalleInfraccionView.tsx, sanitize()]
- "shared_detalleinfraccionview_oficialsection": "OficialSection()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L617 | neighbors=[DetalleInfraccionView.tsx, sanitize()]
- "shared_infracciones_concatname": "concatName()" | kind=code-symbol | source=lib/shared/infracciones.ts:L152 | neighbors=[infracciones.ts, rowToInfraccionDetalle()]
- "shared_infracciones_parseevidencias": "parseEvidencias()" | kind=code-symbol | source=lib/shared/infracciones.ts:L138 | neighbors=[infracciones.ts, rowToInfraccionDetalle()]
- "shared_pedirevidenciasmodal_emptyitem": "emptyItem()" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L26 | neighbors=[PedirEvidenciasModal.tsx, SharedPedirEvidenciasBoton()]
- "sin_robos_paginacionsinrobos_paginacionsinrobos": "PaginacionSinRobos()" | kind=code-symbol | source=components/reportes/sin_robos/PaginacionSinRobos.tsx:L12 | neighbors=[PaginacionSinRobos.tsx, ReporteSinRobos.tsx]
- "sin_robos_reportesinrobos_tablareporteslimpios": "TablaReportesLimpios()" | kind=code-symbol | source=components/reportes/sin_robos/ReporteSinRobos.tsx:L7 | neighbors=[page.tsx, ReporteSinRobos.tsx]
- "sin_robos_reportfilters_reportfilters": "ReportFilters()" | kind=code-symbol | source=components/reportes/sin_robos/ReportFilters.tsx:L7 | neighbors=[page.tsx, ReportFilters.tsx]
- "solicitudes_solicitudes_client_solicitudesclient": "SolicitudesClient()" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L27 | neighbors=[page.tsx, solicitudes-client.tsx]
- "solicitudes_subir_oficio_modal_subiroficiomodal": "SubirOficioModal()" | kind=code-symbol | source=app/corralon/solicitudes/subir-oficio-modal.tsx:L12 | neighbors=[solicitudes-client.tsx, subir-oficio-modal.tsx]
- "solicitudes_ver_documento_modal_getextension": "getExtension()" | kind=code-symbol | source=app/corralon/solicitudes/ver-documento-modal.tsx:L11 | neighbors=[ver-documento-modal.tsx, VerDocumentoModal()]
- "solicitudes_ver_documento_modal_verdocumentomodal": "VerDocumentoModal()" | kind=code-symbol | source=app/corralon/solicitudes/ver-documento-modal.tsx:L17 | neighbors=[ver-documento-modal.tsx, getExtension()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-050.json

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
