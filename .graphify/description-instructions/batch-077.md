# Node Description Batch 78 of 82

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
- "roles_route_post": "POST()" | kind=code-symbol | source=app/api/admin/roles/route.ts:L7 | neighbors=[route.ts]
- "rondin_page_reporterecorridopage": "ReporteRecorridoPage()" | kind=code-symbol | source=app/agente_911/rondin/page.tsx:L9 | neighbors=[page.tsx]
- "sasiete_mapper_ordenpagorow": "OrdenPagoRow" | kind=code-symbol | source=features/via/saSiete/mapper.ts:L3 | neighbors=[mapper.ts]
- "sasiete_repository_sa7repository_actualizarordenpago": ".actualizarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L65 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_buscarordenporinfraccionid": ".buscarOrdenPorInfraccionId()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L57 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_insertarordenpago": ".insertarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L14 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_obtenerconceptoidporclasificacion": ".obtenerConceptoIdPorClasificacion()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L6 | neighbors=[SA7Repository]
- "sasiete_service_sa7service_buscarordenporinfraccion": ".buscarOrdenPorInfraccion()" | kind=code-symbol | source=features/via/saSiete/service.ts:L87 | neighbors=[SA7Service]
- "sasiete_service_sa7service_generarordenpago": ".generarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/service.ts:L13 | neighbors=[SA7Service]
- "sasiete_service_sa7service_obtenerconceptoid": ".obtenerConceptoId()" | kind=code-symbol | source=features/via/saSiete/service.ts:L9 | neighbors=[SA7Service]
- "sasiete_types_catalogoconceptosa7": "CatalogoConceptoSA7" | kind=code-symbol | source=features/via/saSiete/types.ts:L1 | neighbors=[types.ts]
- "scripts_exportar_schema_columninfo": "ColumnInfo" | kind=code-symbol | source=scripts/exportar-schema.ts:L6 | neighbors=[exportar-schema.ts]
- "scripts_exportar_schema_schemas": "SCHEMAS" | kind=code-symbol | source=scripts/exportar-schema.ts:L4 | neighbors=[exportar-schema.ts]
- "scripts_exportar_schema_typetoreadable": "typeToReadable()" | kind=code-symbol | source=scripts/exportar-schema.ts:L53 | neighbors=[exportar-schema.ts]
- "scripts_extract_domain_dirname": "__dirname" | kind=code-symbol | source=scripts/extract-domain.mjs:L7 | neighbors=[extract-domain.mjs]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-077.json

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
