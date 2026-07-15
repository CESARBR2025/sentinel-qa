# Node Description Batch 28 of 93

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

- "reportes_operativos_types_hidrocarburorow": "HidrocarburoRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L44 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_operativos_types_ordenaprehensionrow": "OrdenAprehensionRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L37 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_operativos_types_vehiculorow": "VehiculoRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_sin_d1_types_sind1row": "SinD1Row" | kind=code-symbol | source=lib/reportes-sin-d1/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_sin_novedad_types_sinnovedadrow": "SinNovedadRow" | kind=code-symbol | source=lib/reportes-sin-novedad/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_types": "types.ts" | kind=code-symbol | source=lib/reportes/types.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, repository.ts, FormatoNStats]
- "rol_servicios_mapper_rowtoestadofuerzaconcepto": "rowToEstadoFuerzaConcepto()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L123 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "rol_servicios_mapper_rowtoradio": "rowToRadio()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L104 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "rol_servicios_mapper_rowtorolasignacion": "rowToRolAsignacion()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L59 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "rol_servicios_mapper_rowtorolservicio": "rowToRolServicio()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L36 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "rol_servicios_types_bodycam": "BodyCam" | kind=code-symbol | source=lib/rol-servicios/types.ts:L79 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "rol_servicios_types_estadofuerzaconcepto": "EstadoFuerzaConcepto" | kind=code-symbol | source=lib/rol-servicios/types.ts:L86 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "rol_servicios_types_mediocanalizacion": "MedioCanalizacion" | kind=code-symbol | source=lib/rol-servicios/types.ts:L109 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "rol_servicios_types_radio": "Radio" | kind=code-symbol | source=lib/rol-servicios/types.ts:L71 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "rol_servicios_types_rolasignacion": "RolAsignacion" | kind=code-symbol | source=lib/rol-servicios/types.ts:L34 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "rol_servicios_types_rolestadofuerza": "RolEstadoFuerza" | kind=code-symbol | source=lib/rol-servicios/types.ts:L50 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "rol_servicios_types_rolobservacion": "RolObservacion" | kind=code-symbol | source=lib/rol-servicios/types.ts:L57 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "rol_servicios_types_rolservicio": "RolServicio" | kind=code-symbol | source=lib/rol-servicios/types.ts:L13 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "rol_servicios_types_sector": "Sector" | kind=code-symbol | source=lib/rol-servicios/types.ts:L64 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "rol_servicios_types_tipoemergencia": "TipoEmergencia" | kind=code-symbol | source=lib/rol-servicios/types.ts:L102 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "rol_servicios_types_tipoobservacion": "TipoObservacion" | kind=code-symbol | source=lib/rol-servicios/types.ts:L95 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "sasiete_service_sa7service": "SA7Service" | kind=code-symbol | source=features/via/saSiete/service.ts:L8 | neighbors=[service.ts, .buscarOrdenPorInfraccion(), .generarOrdenPago(), .obtenerConceptoId()]
- "scripts_exportar_schema_main": "main()" | kind=code-symbol | source=scripts/exportar-schema.ts:L60 | neighbors=[exportar-schema.ts, getColumns(), getEnums(), getTables()]
- "scripts_session_checkpoint_formatevent": "formatEvent()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L26 | neighbors=[session-checkpoint.mjs, last(), pendingDecisions(), summary()]
- "scripts_session_checkpoint_getsessionid": "getSessionId()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L199 | neighbors=[session-checkpoint.mjs, addDecision(), parseEvent(), pendingDecisions()]
- "scripts_trace_server_findfunctionbody": "findFunctionBody()" | kind=code-symbol | source=scripts/trace-server.mjs:L97 | neighbors=[trace-server.mjs, findFunctionBodyFallback(), require, injectServerTrace()]
- "scripts_trace_server_findfunctionbodyfallback": "findFunctionBodyFallback()" | kind=code-symbol | source=scripts/trace-server.mjs:L128 | neighbors=[trace-server.mjs, findFunctionBody(), escapeRegex(), findMatchingBrace()]
- "scripts_trace_utils_checkdirtyfiles": "checkDirtyFiles()" | kind=code-symbol | source=scripts/trace-utils.mjs:L43 | neighbors=[trace-client.mjs, trace-components.mjs, trace-server.mjs, trace-utils.mjs]
- "scripts_trace_utils_findfunctionincontent": "findFunctionInContent()" | kind=code-symbol | source=scripts/trace-utils.mjs:L121 | neighbors=[trace-server.mjs, trace-utils.mjs, escapeRegex(), walkRecursive()]
- "scripts_trace_utils_restorebackups": "restoreBackups()" | kind=code-symbol | source=scripts/trace-utils.mjs:L69 | neighbors=[trace-client.mjs, trace-components.mjs, trace-server.mjs, trace-utils.mjs]
- "services_analisisservice_analisisservice": "analisisService" | kind=code-symbol | source=services/analisisService.ts:L2 | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, TablonAnalisis.tsx, analisisService.ts]
- "setup_2fa_page": "page.tsx" | kind=code-symbol | source=app/(auth)/login/setup-2fa/page.tsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, auth-client.ts, authClient, Setup2FAPage()]
- "shared_detalleinfraccionview_formatdate": "formatDate()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L102 | neighbors=[DetalleInfraccionView.tsx, DocumentacionSection(), SummaryBar(), timeAgo()]
- "shared_detalleinfraccionview_summarybar": "SummaryBar()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L478 | neighbors=[DetalleInfraccionView.tsx, formatCurrency(), formatDate(), timeAgo()]
- "shared_infracciones_rowtoinfracciondetalle": "rowToInfraccionDetalle()" | kind=code-symbol | source=lib/shared/infracciones.ts:L156 | neighbors=[infracciones.ts, obtenerDetalleInfraccionVia(), concatName(), parseEvidencias()]
- "shared_pedirevidenciasmodal_sharedpedirevidenciasboton": "SharedPedirEvidenciasBoton()" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L52 | neighbors=[TabSolicitudes.tsx, PedirEvidenciasModal.tsx, PedirEvidenciasModal.tsx, emptyItem()]
- "stores_usetoaststore_usetoaststore": "useToastStore" | kind=code-symbol | source=stores/useToastStore.ts:L21 | neighbors=[CapturarDatosTitularSection.tsx, CapturarInfractorSection.tsx, ModalEntregarGarantia.tsx, useToastStore.ts]
- "via_expediente_getexpedientehost": "getExpedienteHost()" | kind=code-symbol | source=lib/via/expediente.ts:L3 | neighbors=[route.ts, route.ts, expediente.ts, getExpedienteToken()]
- "911_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/911/mapper.ts:L3 | neighbors=[mapper.ts, rowToIncidenteDetalle(), rowToIncidenteResumen()]
- "911_types_incidentestats": "IncidenteStats" | kind=code-symbol | source=lib/911/types.ts:L55 | neighbors=[repository.ts, service.ts, types.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-027.json

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
