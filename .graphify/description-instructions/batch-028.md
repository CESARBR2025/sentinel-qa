# Node Description Batch 29 of 87

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

- "fiscalia_service_verificarrolfiscalia": "verificarRolFiscalia()" | kind=code-symbol | source=lib/fiscalia/service.ts:L25 | neighbors=[actions.ts, service.ts, page.tsx]
- "fiscalia_types_detalledetenidoguardado": "DetalleDetenidoGuardado" | kind=code-symbol | source=lib/fiscalia/types.ts:L81 | neighbors=[mapper.ts, repository.ts, types.ts]
- "fiscalia_types_evidenciamonitorista": "EvidenciaMonitorista" | kind=code-symbol | source=lib/fiscalia/types.ts:L11 | neighbors=[DetallesAseguradoView.tsx, repository.ts, types.ts]
- "fiscalia_types_liberacionrow": "LiberacionRow" | kind=code-symbol | source=lib/fiscalia/types.ts:L206 | neighbors=[actions.ts, repository.ts, types.ts]
- "flota_service_obtenerflota": "obtenerFlota()" | kind=code-symbol | source=lib/flota/service.ts:L47 | neighbors=[service.ts, listarPatrullasParaAsignacion(), extraerVehiculos()]
- "flota_types_flotavehiculoraw": "FlotaVehiculoRaw" | kind=code-symbol | source=lib/flota/types.ts:L1 | neighbors=[repository.ts, service.ts, types.ts]
- "flota_types_patrulla": "Patrulla" | kind=code-symbol | source=lib/flota/types.ts:L12 | neighbors=[mapper.ts, repository.ts, types.ts]
- "guardar_docs_route_post": "POST()" | kind=code-symbol | source=app/api/via/exp-digital/guardar-docs/route.ts:L48 | neighbors=[route.ts, subirArchivo(), validarArchivo()]
- "hooks_useempleado_useempleado": "useEmpleado()" | kind=code-symbol | source=hooks/useEmpleado.ts:L12 | neighbors=[DespachoForm.tsx, useEmpleado.ts, FormSection.tsx]
- "hooks_useincidente": "useIncidente.ts" | kind=code-symbol | source=hooks/useIncidente.ts:L1 | neighbors=[IncidenteDetalle, useIncidente(), 6feefe2 BackEnd completo para hacer la …]
- "hooks_usepolling": "usePolling.ts" | kind=code-symbol | source=hooks/usePolling.ts:L1 | neighbors=[511fea4 Modulo de despacho, TablonDespacho.tsx, usePolling()]
- "hooks_usereportecampo": "useReporteCampo.ts" | kind=code-symbol | source=hooks/useReporteCampo.ts:L1 | neighbors=[a58a0f7 Despachos, ReporteCampoDetalle, useReporteCampo()]
- "id_page_detalledenunciapage": "DetalleDenunciaPage()" | kind=code-symbol | source=app/monitorista/denuncias/[id]/page.tsx:L10 | neighbors=[page.tsx, estadoBadge(), statusBadge()]
- "id_page_fichadetailpage": "FichaDetailPage()" | kind=code-symbol | source=app/prevencion/busquedas/[id]/page.tsx:L26 | neighbors=[page.tsx, fmtDT(), toISO()]
- "id_page_formatdate": "formatDate()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L28 | neighbors=[page.tsx, InfraccionCiudadanoPage(), timeAgo()]
- "id_page_timeago": "timeAgo()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L38 | neighbors=[page.tsx, InfraccionCiudadanoPage(), formatDate()]
- "incidentes_actions_deletepersonaafectada": "deletePersonaAfectada()" | kind=code-symbol | source=lib/incidentes/actions.ts:L288 | neighbors=[actions.ts, req(), requireOperador()]
- "incidentes_audit_registraraudit": "registrarAudit()" | kind=code-symbol | source=lib/incidentes/audit.ts:L6 | neighbors=[route.ts, actions.ts, audit.ts]
- "incidentes_mapper_rowtodespacho": "rowToDespacho()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L105 | neighbors=[mapper.ts, toStr(), repository.ts]
- "incidentes_mapper_rowtodespachoelemento": "rowToDespachoElemento()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L183 | neighbors=[mapper.ts, toStr(), repository.ts]
- "incidentes_mapper_rowtodespachounidad": "rowToDespachoUnidad()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L175 | neighbors=[mapper.ts, toStr(), repository.ts]
- "incidentes_mapper_rowtoextorsion": "rowToExtorsion()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L142 | neighbors=[mapper.ts, toStr(), repository.ts]
- "incidentes_mapper_rowtoincidentelistitem": "rowToIncidenteListItem()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L39 | neighbors=[mapper.ts, toStr(), repository.ts]
- "incidentes_repository_listarincidentesconfiltros": "listarIncidentesConFiltros()" | kind=code-symbol | source=lib/incidentes/repository.ts:L10 | neighbors=[repository.ts, route.ts, service.ts]
- "incidentes_repository_obtenerelementosdedespacho": "obtenerElementosDeDespacho()" | kind=code-symbol | source=lib/incidentes/repository.ts:L148 | neighbors=[route.ts, repository.ts, service.ts]
- "incidentes_repository_obtenerincidentecompleto": "obtenerIncidenteCompleto()" | kind=code-symbol | source=lib/incidentes/repository.ts:L89 | neighbors=[route.ts, repository.ts, service.ts]
- "incidentes_repository_obtenerreportecampodeincidente": "obtenerReporteCampoDeIncidente()" | kind=code-symbol | source=lib/incidentes/repository.ts:L156 | neighbors=[repository.ts, service.ts, route.ts]
- "incidentes_repository_obtenerunidadesdedespacho": "obtenerUnidadesDeDespacho()" | kind=code-symbol | source=lib/incidentes/repository.ts:L140 | neighbors=[route.ts, repository.ts, service.ts]
- "incidentes_toastonload": "ToastOnLoad.tsx" | kind=code-symbol | source=app/agente_911/ciudadano/incidentes/ToastOnLoad.tsx:L1 | neighbors=[eacfdaf mostrando toast de guardado, page.tsx, ToastOnLoad()]
- "incidentes_types_alarmaescolarrow": "AlarmaEscolarRow" | kind=code-symbol | source=lib/incidentes/types.ts:L116 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_despachocompleto": "DespachoCompleto" | kind=code-symbol | source=lib/incidentes/types.ts:L192 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_despachoelementorow": "DespachoElementoRow" | kind=code-symbol | source=lib/incidentes/types.ts:L178 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_despachorow": "DespachoRow" | kind=code-symbol | source=lib/incidentes/types.ts:L71 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_despachounidadrow": "DespachoUnidadRow" | kind=code-symbol | source=lib/incidentes/types.ts:L172 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_extorsionrow": "ExtorsionRow" | kind=code-symbol | source=lib/incidentes/types.ts:L104 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_historialincidente": "HistorialIncidente" | kind=code-symbol | source=lib/incidentes/types.ts:L281 | neighbors=[HistorialIncidente.tsx, service.ts, types.ts]
- "incidentes_types_incidentebasico": "IncidenteBasico" | kind=code-symbol | source=lib/incidentes/types.ts:L186 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_incidentecondespacho": "IncidenteConDespacho" | kind=code-symbol | source=lib/incidentes/types.ts:L24 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_incidentedetallecompleto": "IncidenteDetalleCompleto" | kind=code-symbol | source=lib/incidentes/types.ts:L133 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_incidentefiltros": "IncidenteFiltros" | kind=code-symbol | source=lib/incidentes/types.ts:L1 | neighbors=[repository.ts, service.ts, types.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-028.json

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
