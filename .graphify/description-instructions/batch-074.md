# Node Description Batch 75 of 79

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

- "reportes_operativos_service_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-operativos/service.ts:L22 | neighbors=[service.ts]
- "reportes_page_gestionpage": "GestionPage()" | kind=code-symbol | source=app/reportes/page.tsx:L15 | neighbors=[page.tsx]
- "reportes_page_misreportespage": "MisReportesPage()" | kind=code-symbol | source=app/oficial/reportes/page.tsx:L8 | neighbors=[page.tsx]
- "reportes_permisos_accion": "Accion" | kind=code-symbol | source=lib/reportes/permisos.ts:L7 | neighbors=[permisos.ts]
- "reportes_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/reportes/permisos.ts:L14 | neighbors=[permisos.ts]
- "reportes_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/reportes/permisos.ts:L22 | neighbors=[permisos.ts]
- "reportes_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/reportes/permisos.ts:L18 | neighbors=[permisos.ts]
- "reportes_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/reportes/permisos.ts:L8 | neighbors=[permisos.ts]
- "reportes_permisos_roles_permitidos": "ROLES_PERMITIDOS" | kind=code-symbol | source=lib/reportes/permisos.ts:L27 | neighbors=[permisos.ts]
- "reportes_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/reportes/permisos.ts:L6 | neighbors=[permisos.ts]
- "reportes_sin_d1_service_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-sin-d1/service.ts:L4 | neighbors=[service.ts]
- "reportes_sin_novedad_service_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-sin-novedad/service.ts:L4 | neighbors=[service.ts]
- "retencion_placa_route_patch": "PATCH()" | kind=code-symbol | source=app/api/via/infracciones/retencion-placa/route.ts:L6 | neighbors=[route.ts]
- "revision_documental_page_revisiondocumentalpage": "RevisionDocumentalPage()" | kind=code-symbol | source=app/agente_liberaciones/revision-documental/page.tsx:L5 | neighbors=[page.tsx]
- "rh_route_get": "GET()" | kind=code-symbol | source=app/api/rol-servicios/externos/rh/route.ts:L8 | neighbors=[route.ts]
- "rol_servicios_actions_generarfolio": "generarFolio()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L18 | neighbors=[actions.ts]
- "rol_servicios_catalogos_actions_str": "str()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L18 | neighbors=[catalogos-actions.ts]
- "rol_servicios_catalogos_actions_tablacatalogo": "TablaCatalogo" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L23 | neighbors=[catalogos-actions.ts]
- "rol_servicios_layout_rolservicioslayout": "RolServiciosLayout()" | kind=code-symbol | source=app/rol_servicios/layout.tsx:L6 | neighbors=[layout.tsx]
- "rol_servicios_mapper_rowtoservicerow": "rowToServiceRow()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L24 | neighbors=[mapper.ts]
- "rol_servicios_page_modulorolzen": "ModuloRolZen()" | kind=code-symbol | source=app/rol_servicios/page.tsx:L10 | neighbors=[page.tsx]
- "rol_servicios_rolinputs_props": "Props" | kind=code-symbol | source=components/rol_servicios/RolInputs.tsx:L3 | neighbors=[RolInputs.tsx]
- "rol_servicios_servicetable_devicebox": "deviceBox" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L232 | neighbors=[ServiceTable.tsx]
- "rol_servicios_servicetable_inputstyle": "inputStyle" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L203 | neighbors=[ServiceTable.tsx]
- "rol_servicios_servicetable_labelmono": "labelMono" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L213 | neighbors=[ServiceTable.tsx]
- "rol_servicios_servicetable_props": "Props" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L6 | neighbors=[ServiceTable.tsx]
- "rol_servicios_servicetable_selectstyle": "selectStyle" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L220 | neighbors=[ServiceTable.tsx]
- "rol_servicios_servicetable_tdstyle": "tdStyle" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L198 | neighbors=[ServiceTable.tsx]
- "rol_servicios_servicetable_thstyle": "thStyle" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L187 | neighbors=[ServiceTable.tsx]
- "rol_servicios_signaturemodal_props": "Props" | kind=code-symbol | source=components/rol_servicios/SignatureModal.tsx:L6 | neighbors=[SignatureModal.tsx]
- "roles_formulariorol_btnsubmitstyle": "btnSubmitStyle" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L229 | neighbors=[FormularioRol.tsx]
- "roles_formulariorol_fieldcontainerstyle": "fieldContainerStyle" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L192 | neighbors=[FormularioRol.tsx]
- "roles_formulariorol_formulariorol": "FormularioRol()" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L27 | neighbors=[FormularioRol.tsx]
- "roles_formulariorol_grid2style": "grid2Style" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L191 | neighbors=[FormularioRol.tsx]
- "roles_formulariorol_iconstyle": "iconStyle" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L210 | neighbors=[FormularioRol.tsx]
- "roles_formulariorol_inputstyle": "inputStyle" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L201 | neighbors=[FormularioRol.tsx]
- "roles_formulariorol_labelstyle": "labelStyle" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L193 | neighbors=[FormularioRol.tsx]
- "roles_formulariorol_sectiontitlestyle": "sectionTitleStyle" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L218 | neighbors=[FormularioRol.tsx]
- "roles_formulariorol_sentinelfield": "SentinelField()" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L9 | neighbors=[FormularioRol.tsx]
- "roles_page_rolespage": "RolesPage()" | kind=code-symbol | source=app/admin/roles/page.tsx:L6 | neighbors=[page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-074.json

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
