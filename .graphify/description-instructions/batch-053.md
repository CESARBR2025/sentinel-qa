# Node Description Batch 54 of 89

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

- "wireframes_wf_e": "wf-e.jsx" | kind=code-symbol | source=login-desing/wireframes/wf-e.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, WireframeE()]
- "2fa_page_twofactorpage": "TwoFactorPage()" | kind=code-symbol | source=app/(auth)/login/2fa/page.tsx:L6 | neighbors=[page.tsx]
- "911_filtrosincidentes_btnbuscarstyle": "btnBuscarStyle" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L128 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_btnlimpiarstyle": "btnLimpiarStyle" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L129 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_canales": "CANALES" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L15 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_catalogoitem": "CatalogoItem" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L8 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_estatus": "ESTATUS" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L21 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_fieldstyle": "fieldStyle" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L125 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_inputstyle": "inputStyle" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L127 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_labelstyle": "labelStyle" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L126 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_props": "Props" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L10 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_wrapperstyle": "wrapperStyle" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L124 | neighbors=[FiltrosIncidentes.tsx]
- "911_modulecard_modulecard": "ModuleCard()" | kind=code-symbol | source=components/911/ModuleCard.tsx:L19 | neighbors=[ModuleCard.tsx]
- "911_modulecard_modulecardprops": "ModuleCardProps" | kind=code-symbol | source=components/911/ModuleCard.tsx:L11 | neighbors=[ModuleCard.tsx]
- "911_modulecard_stat": "Stat" | kind=code-symbol | source=components/911/ModuleCard.tsx:L6 | neighbors=[ModuleCard.tsx]
- "911_pagination_arrowbtnstyle": "arrowBtnStyle" | kind=code-symbol | source=components/911/Pagination.tsx:L130 | neighbors=[Pagination.tsx]
- "911_pagination_containerstyle": "containerStyle" | kind=code-symbol | source=components/911/Pagination.tsx:L109 | neighbors=[Pagination.tsx]
- "911_pagination_infostyle": "infoStyle" | kind=code-symbol | source=components/911/Pagination.tsx:L118 | neighbors=[Pagination.tsx]
- "911_pagination_labelstyle": "labelStyle" | kind=code-symbol | source=components/911/Pagination.tsx:L127 | neighbors=[Pagination.tsx]
- "911_pagination_pagenumberstyle": "pageNumberStyle" | kind=code-symbol | source=components/911/Pagination.tsx:L140 | neighbors=[Pagination.tsx]
- "911_pagination_paginationprops": "PaginationProps" | kind=code-symbol | source=components/911/Pagination.tsx:L5 | neighbors=[Pagination.tsx]
- "911_pagination_valuestyle": "valueStyle" | kind=code-symbol | source=components/911/Pagination.tsx:L128 | neighbors=[Pagination.tsx]
- "911_permisos_accion": "Accion" | kind=code-symbol | source=lib/911/permisos.ts:L6 | neighbors=[permisos.ts]
- "911_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/911/permisos.ts:L13 | neighbors=[permisos.ts]
- "911_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/911/permisos.ts:L21 | neighbors=[permisos.ts]
- "911_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/911/permisos.ts:L17 | neighbors=[permisos.ts]
- "911_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/911/permisos.ts:L7 | neighbors=[permisos.ts]
- "911_permisos_roles_permitidos": "ROLES_PERMITIDOS" | kind=code-symbol | source=lib/911/permisos.ts:L26 | neighbors=[permisos.ts]
- "911_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/911/permisos.ts:L5 | neighbors=[permisos.ts]
- "911_service_getincidente": "getIncidente()" | kind=code-symbol | source=lib/911/service.ts:L21 | neighbors=[service.ts]
- "admin_admin_styles_pagewrap": "pageWrap" | kind=code-symbol | source=app/admin/admin-styles.ts:L3 | neighbors=[admin-styles.ts]
- "admin_layout_adminlayout": "AdminLayout()" | kind=code-symbol | source=app/admin/layout.tsx:L7 | neighbors=[layout.tsx]
- "admin_page_adminpage": "AdminPage()" | kind=code-symbol | source=app/admin/page.tsx:L3 | neighbors=[page.tsx]
- "admin_transito_layout_admintransitolayout": "AdminTransitoLayout()" | kind=code-symbol | source=app/admin-transito/layout.tsx:L7 | neighbors=[layout.tsx]
- "admin_transito_mapper_rowtouserwithrole": "rowToUserWithRole()" | kind=code-symbol | source=lib/admin-transito/mapper.ts:L8 | neighbors=[mapper.ts]
- "admin_transito_modaldestituiroficial_modaldestituiroficial": "ModalDestituirOficial()" | kind=code-symbol | source=components/admin-transito/ModalDestituirOficial.tsx:L14 | neighbors=[ModalDestituirOficial.tsx]
- "admin_transito_modaldestituiroficial_props": "Props" | kind=code-symbol | source=components/admin-transito/ModalDestituirOficial.tsx:L7 | neighbors=[ModalDestituirOficial.tsx]
- "admin_transito_modalreactivaroficial_departamento": "Departamento" | kind=code-symbol | source=components/admin-transito/ModalReactivarOficial.tsx:L9 | neighbors=[ModalReactivarOficial.tsx]
- "admin_transito_modalreactivaroficial_inputstyle": "inputStyle" | kind=code-symbol | source=components/admin-transito/ModalReactivarOficial.tsx:L38 | neighbors=[ModalReactivarOficial.tsx]
- "admin_transito_modalreactivaroficial_labelstyle": "labelStyle" | kind=code-symbol | source=components/admin-transito/ModalReactivarOficial.tsx:L28 | neighbors=[ModalReactivarOficial.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-053.json

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
