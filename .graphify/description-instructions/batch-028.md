# Node Description Batch 29 of 93

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

- "services_analisisservice_analisisservice": "analisisService" | kind=code-symbol | source=services/analisisService.ts:L2 | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, TablonAnalisis.tsx, analisisService.ts]
- "setup_2fa_page": "page.tsx" | kind=code-symbol | source=app/(auth)/login/setup-2fa/page.tsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, auth-client.ts, authClient, Setup2FAPage()]
- "shared_detalleinfraccionview_formatdate": "formatDate()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L102 | neighbors=[DetalleInfraccionView.tsx, DocumentacionSection(), SummaryBar(), timeAgo()]
- "shared_detalleinfraccionview_summarybar": "SummaryBar()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L478 | neighbors=[DetalleInfraccionView.tsx, formatCurrency(), formatDate(), timeAgo()]
- "shared_infracciones_rowtoinfracciondetalle": "rowToInfraccionDetalle()" | kind=code-symbol | source=lib/shared/infracciones.ts:L156 | neighbors=[infracciones.ts, obtenerDetalleInfraccionVia(), concatName(), parseEvidencias()]
- "shared_pedirevidenciasmodal_sharedpedirevidenciasboton": "SharedPedirEvidenciasBoton()" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L52 | neighbors=[TabSolicitudes.tsx, PedirEvidenciasModal.tsx, PedirEvidenciasModal.tsx, emptyItem()]
- "stores_usetoaststore_usetoaststore": "useToastStore" | kind=code-symbol | source=stores/useToastStore.ts:L21 | neighbors=[CapturarDatosTitularSection.tsx, CapturarInfractorSection.tsx, ModalEntregarGarantia.tsx, useToastStore.ts]
- "via_expediente_getexpedientehost": "getExpedienteHost()" | kind=code-symbol | source=lib/via/expediente.ts:L3 | neighbors=[route.ts, route.ts, expediente.ts, getExpedienteToken()]
- "911_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/911/mapper.ts:L3 | neighbors=[mapper.ts, rowToIncidenteDetalle(), rowToIncidenteResumen()]
- "911_permisos_tienealgunacceso": "tieneAlgunAcceso()" | kind=code-symbol | source=lib/911/permisos.ts:L38 | neighbors=[permisos.ts, service.ts, service.ts]
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
- "admin_repository_listarrolesactivos": "listarRolesActivos()" | kind=code-symbol | source=lib/admin/repository.ts:L29 | neighbors=[repository.ts, page.tsx, page.tsx]
- "admin_transito_actions_actualizaroficial": "actualizarOficial()" | kind=code-symbol | source=lib/admin-transito/actions.ts:L253 | neighbors=[actions.ts, requireAdminTransito(), page.tsx]
- "admin_transito_actions_crearoficial": "crearOficial()" | kind=code-symbol | source=lib/admin-transito/actions.ts:L26 | neighbors=[actions.ts, requireAdminTransito(), NuevoOficialForm.tsx]
- "admin_transito_actions_destituiroficial": "destituirOficial()" | kind=code-symbol | source=lib/admin-transito/actions.ts:L157 | neighbors=[actions.ts, requireAdminTransito(), ModalDestituirOficial.tsx]
- "admin_transito_actions_obteneroficialeslista": "obtenerOficialesLista()" | kind=code-symbol | source=lib/admin-transito/actions.ts:L120 | neighbors=[actions.ts, requireAdminTransito(), page.tsx]
- "admin_transito_actions_obteneroficialporid": "obtenerOficialPorId()" | kind=code-symbol | source=lib/admin-transito/actions.ts:L211 | neighbors=[actions.ts, requireAdminTransito(), page.tsx]
- "admin_transito_actions_reactivaroficialcondatos": "reactivarOficialConDatos()" | kind=code-symbol | source=lib/admin-transito/actions.ts:L174 | neighbors=[actions.ts, requireAdminTransito(), ModalReactivarOficial.tsx]
- "admin_transito_mapper_rowtodepartamento": "rowToDepartamento()" | kind=code-symbol | source=lib/admin-transito/mapper.ts:L20 | neighbors=[mapper.ts, toStr(), repository.ts]
- "admin_transito_mapper_rowtooficiallista": "rowToOficialLista()" | kind=code-symbol | source=lib/admin-transito/mapper.ts:L28 | neighbors=[mapper.ts, toStr(), repository.ts]
- "admin_transito_mapper_rowtouserbasico": "rowToUserBasico()" | kind=code-symbol | source=lib/admin-transito/mapper.ts:L48 | neighbors=[mapper.ts, toStr(), repository.ts]
- "admin_transito_types_departamento": "Departamento" | kind=code-symbol | source=lib/admin-transito/types.ts:L11 | neighbors=[mapper.ts, repository.ts, types.ts]
- "admin_transito_types_oficiallista": "OficialLista" | kind=code-symbol | source=lib/admin-transito/types.ts:L17 | neighbors=[mapper.ts, repository.ts, types.ts]
- "admin_transito_types_userbasico": "UserBasico" | kind=code-symbol | source=lib/admin-transito/types.ts:L35 | neighbors=[mapper.ts, repository.ts, types.ts]
- "admin_types_rolitem": "RolItem" | kind=code-symbol | source=lib/admin/types.ts:L15 | neighbors=[mapper.ts, repository.ts, types.ts]
- "admin_types_usuariolista": "UsuarioLista" | kind=code-symbol | source=lib/admin/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts]
- "agente_infracciones_actions_obtenerdetalleinfraccioninfracciones": "obtenerDetalleInfraccionInfracciones()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L37 | neighbors=[actions.ts, ModalEntregarGarantia.tsx, page.tsx]
- "agente_infracciones_mapper_inputtodbparams": "inputToDbParams()" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L28 | neighbors=[mapper.ts, nvl(), repository.ts]
- "agente_infracciones_types_capturainfractorresult": "CapturaInfractorResult" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L48 | neighbors=[actions.ts, service.ts, types.ts]
- "agente_infracciones_types_liberacionrow": "LiberacionRow" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L11 | neighbors=[mapper.ts, service.ts, types.ts]

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
