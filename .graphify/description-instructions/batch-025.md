# Node Description Batch 26 of 86

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
- "scripts_load_context_main": "main()" | kind=code-symbol | source=scripts/load-context.mjs:L116 | neighbors=[load-context.mjs, buildInstructions(), extractDomain(), queryGraph()]
- "scripts_session_checkpoint_formatevent": "formatEvent()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L26 | neighbors=[session-checkpoint.mjs, last(), pendingDecisions(), summary()]
- "scripts_session_checkpoint_getsessionid": "getSessionId()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L199 | neighbors=[session-checkpoint.mjs, addDecision(), parseEvent(), pendingDecisions()]
- "services_analisisservice_analisisservice": "analisisService" | kind=code-symbol | source=services/analisisService.ts:L2 | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, TablonAnalisis.tsx, analisisService.ts]
- "setup_2fa_page": "page.tsx" | kind=code-symbol | source=app/(auth)/login/setup-2fa/page.tsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, auth-client.ts, authClient, Setup2FAPage()]
- "shared_detalleinfraccionview_formatdate": "formatDate()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L102 | neighbors=[DetalleInfraccionView.tsx, DocumentacionSection(), SummaryBar(), timeAgo()]
- "shared_detalleinfraccionview_summarybar": "SummaryBar()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L478 | neighbors=[DetalleInfraccionView.tsx, formatCurrency(), formatDate(), timeAgo()]
- "shared_infracciones_rowtoinfracciondetalle": "rowToInfraccionDetalle()" | kind=code-symbol | source=lib/shared/infracciones.ts:L156 | neighbors=[infracciones.ts, obtenerDetalleInfraccionVia(), concatName(), parseEvidencias()]
- "shared_pedirevidenciasmodal_sharedpedirevidenciasboton": "SharedPedirEvidenciasBoton()" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L52 | neighbors=[TabSolicitudes.tsx, PedirEvidenciasModal.tsx, PedirEvidenciasModal.tsx, emptyItem()]
- "solicitudes_subir_oficio_modal": "subir-oficio-modal.tsx" | kind=code-symbol | source=app/corralon/solicitudes/subir-oficio-modal.tsx:L1 | neighbors=[16df128 flujo de corralones listo, solicitudes-client.tsx, Props, SubirOficioModal()]
- "solicitudes_ver_documento_modal": "ver-documento-modal.tsx" | kind=code-symbol | source=app/corralon/solicitudes/ver-documento-modal.tsx:L1 | neighbors=[16df128 flujo de corralones listo, getExtension(), Props, VerDocumentoModal()]
- "stores_usetoaststore_usetoaststore": "useToastStore" | kind=code-symbol | source=stores/useToastStore.ts:L21 | neighbors=[CapturarDatosTitularSection.tsx, CapturarInfractorSection.tsx, ModalEntregarGarantia.tsx, useToastStore.ts]
- "utils_generateiphppt": "generateIPHPPT.ts" | kind=code-symbol | source=lib/utils/generateIPHPPT.ts:L1 | neighbors=[5618308 guardado e evidencias con ed, 9550203 Cambios en presentacion, se gen…, 9faf222 Merge branch 'feature/testing' …, generateIPHPPT()]
- "via_expediente_getexpedientehost": "getExpedienteHost()" | kind=code-symbol | source=lib/via/expediente.ts:L3 | neighbors=[route.ts, route.ts, expediente.ts, getExpedienteToken()]
- "911_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/911/mapper.ts:L3 | neighbors=[mapper.ts, rowToIncidenteDetalle(), rowToIncidenteResumen()]
- "911_types_incidentestats": "IncidenteStats" | kind=code-symbol | source=lib/911/types.ts:L55 | neighbors=[repository.ts, service.ts, types.ts]
- "admin_actions_createuser": "createUser()" | kind=code-symbol | source=lib/admin/actions.ts:L21 | neighbors=[actions.ts, requireAdmin(), page.tsx]
- "admin_actions_requireadmin": "requireAdmin()" | kind=code-symbol | source=lib/admin/actions.ts:L12 | neighbors=[actions.ts, createUser(), updateUser()]
- "admin_actions_updateuser": "updateUser()" | kind=code-symbol | source=lib/admin/actions.ts:L55 | neighbors=[actions.ts, requireAdmin(), page.tsx]
- "admin_admin_styles_btnsecundario": "btnSecundario" | kind=code-symbol | source=app/admin/admin-styles.ts:L22 | neighbors=[admin-styles.ts, page.tsx, page.tsx]
- "admin_admin_styles_inputstyle": "inputStyle" | kind=code-symbol | source=app/admin/admin-styles.ts:L10 | neighbors=[admin-styles.ts, page.tsx, page.tsx]
- "admin_admin_styles_labelstyle": "labelStyle" | kind=code-symbol | source=app/admin/admin-styles.ts:L6 | neighbors=[admin-styles.ts, page.tsx, page.tsx]
- "admin_admin_styles_selectstyle": "selectStyle" | kind=code-symbol | source=app/admin/admin-styles.ts:L15 | neighbors=[admin-styles.ts, page.tsx, page.tsx]
- "admin_mapper_rowtorol": "rowToRol()" | kind=code-symbol | source=lib/admin/mapper.ts:L24 | neighbors=[mapper.ts, toStr(), repository.ts]
- "admin_mapper_rowtousuariolista": "rowToUsuarioLista()" | kind=code-symbol | source=lib/admin/mapper.ts:L8 | neighbors=[mapper.ts, toStr(), repository.ts]
- "admin_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/admin/mapper.ts:L3 | neighbors=[mapper.ts, rowToRol(), rowToUsuarioLista()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-025.json

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
