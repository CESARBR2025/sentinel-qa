# Node Description Batch 29 of 89

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

- "corralon_module_card": "module-card.tsx" | kind=code-symbol | source=app/corralon/module-card.tsx:L1 | neighbors=[5a1b5d5 empezando corralon, ModuleCard(), page.tsx]
- "corralon_profile_dropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=app/corralon/profile-dropdown.tsx:L14 | neighbors=[page.tsx, profile-dropdown.tsx, page.tsx]
- "d1_service_listarreportesd1": "listarReportesD1()" | kind=code-symbol | source=lib/d1/service.ts:L5 | neighbors=[page.tsx, service.ts, route.ts]
- "d1_types_reported1": "ReporteD1" | kind=code-symbol | source=lib/d1/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts]
- "dashboard_sign_out_button_signoutbutton": "SignOutButton()" | kind=code-symbol | source=app/dashboard/sign-out-button.tsx:L6 | neighbors=[page.tsx, sign-out-button.tsx, SubHeader.tsx]
- "exportar_route_get": "GET()" | kind=code-symbol | source=app/api/reportes-telefonicos/exportar/route.ts:L60 | neighbors=[route.ts, crearHoja(), getRango()]
- "fiscalia_actions_accionpedirevidencias": "accionPedirEvidencias()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L78 | neighbors=[actions.ts, PedirEvidenciasModal.tsx, PedirEvidenciasModal.tsx]
- "fiscalia_actions_obtenerdetalleinfraccionviaaction": "obtenerDetalleInfraccionViaAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L285 | neighbors=[actions.ts, FiscaliaDashboard.tsx, page.tsx]
- "fiscalia_capturardetallesform_capturardetallesform": "CapturarDetallesForm()" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L62 | neighbors=[CapturarDetallesForm.tsx, emptyItem(), page.tsx]
- "fiscalia_expediente_subirarchivofiscalia": "subirArchivoFiscalia()" | kind=code-symbol | source=lib/fiscalia/expediente.ts:L42 | neighbors=[actions.ts, expediente.ts, obtenerTokenFiscalia()]
- "fiscalia_formularioasegurado_formularioasegurado": "FormularioAsegurado()" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L63 | neighbors=[FormularioAsegurado.tsx, displayVal(), page.tsx]
- "fiscalia_mapper_rowtoasegurado": "rowToAsegurado()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L165 | neighbors=[repository.ts, mapper.ts, repository.ts]
- "fiscalia_mapper_rowtosolicitud": "rowToSolicitud()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L21 | neighbors=[mapper.ts, num(), service.ts]
- "fiscalia_service_guardardetallesaseguradosservice": "guardarDetallesAseguradosService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L134 | neighbors=[actions.ts, actions.ts, service.ts]
- "fiscalia_service_guardarpuestadisposicionservice": "guardarPuestaDisposicionService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L159 | neighbors=[actions.ts, actions.ts, service.ts]
- "fiscalia_service_listaraseguradoscondisposicionservice": "listarAseguradosConDisposicionService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L151 | neighbors=[actions.ts, actions.ts, service.ts]
- "fiscalia_service_obtenerdatosasegurado": "obtenerDatosAsegurado()" | kind=code-symbol | source=lib/fiscalia/service.ts:L63 | neighbors=[actions.ts, service.ts, page.tsx]
- "fiscalia_service_obtenerpuestadisposicionservice": "obtenerPuestaDisposicionService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L155 | neighbors=[actions.ts, actions.ts, service.ts]
- "fiscalia_service_verificarrolfiscalia": "verificarRolFiscalia()" | kind=code-symbol | source=lib/fiscalia/service.ts:L25 | neighbors=[actions.ts, service.ts, page.tsx]
- "fiscalia_types_detalledetenidoguardado": "DetalleDetenidoGuardado" | kind=code-symbol | source=lib/fiscalia/types.ts:L81 | neighbors=[mapper.ts, repository.ts, types.ts]
- "fiscalia_types_evidenciamonitorista": "EvidenciaMonitorista" | kind=code-symbol | source=lib/fiscalia/types.ts:L11 | neighbors=[DetallesAseguradoView.tsx, repository.ts, types.ts]
- "fiscalia_types_liberacionrow": "LiberacionRow" | kind=code-symbol | source=lib/fiscalia/types.ts:L206 | neighbors=[actions.ts, repository.ts, types.ts]
- "flota_service_obtenerflota": "obtenerFlota()" | kind=code-symbol | source=lib/flota/service.ts:L47 | neighbors=[service.ts, listarPatrullasParaAsignacion(), extraerVehiculos()]
- "flota_types_flotavehiculoraw": "FlotaVehiculoRaw" | kind=code-symbol | source=lib/flota/types.ts:L1 | neighbors=[repository.ts, service.ts, types.ts]
- "flota_types_patrulla": "Patrulla" | kind=code-symbol | source=lib/flota/types.ts:L12 | neighbors=[mapper.ts, repository.ts, types.ts]
- "guardar_docs_route_post": "POST()" | kind=code-symbol | source=app/api/via/exp-digital/guardar-docs/route.ts:L48 | neighbors=[route.ts, subirArchivo(), validarArchivo()]
- "hooks_useempleado_useempleado": "useEmpleado()" | kind=code-symbol | source=hooks/useEmpleado.ts:L12 | neighbors=[DespachoForm.tsx, useEmpleado.ts, FormSection.tsx]
- "hooks_useincidente": "useIncidente.ts" | kind=code-symbol | source=hooks/useIncidente.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, IncidenteDetalle, useIncidente()]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-028.json

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
