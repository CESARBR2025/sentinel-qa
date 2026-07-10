# Node Description Batch 76 of 79

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

- "sasiete_service_sa7service_obtenerconceptoid": ".obtenerConceptoId()" | kind=code-symbol | source=features/via/saSiete/service.ts:L9 | neighbors=[SA7Service]
- "sasiete_types_catalogoconceptosa7": "CatalogoConceptoSA7" | kind=code-symbol | source=features/via/saSiete/types.ts:L1 | neighbors=[types.ts]
- "scripts_exportar_schema_columninfo": "ColumnInfo" | kind=code-symbol | source=scripts/exportar-schema.ts:L6 | neighbors=[exportar-schema.ts]
- "scripts_exportar_schema_schemas": "SCHEMAS" | kind=code-symbol | source=scripts/exportar-schema.ts:L4 | neighbors=[exportar-schema.ts]
- "scripts_exportar_schema_typetoreadable": "typeToReadable()" | kind=code-symbol | source=scripts/exportar-schema.ts:L53 | neighbors=[exportar-schema.ts]
- "scripts_extract_domain_dirname": "__dirname" | kind=code-symbol | source=scripts/extract-domain.mjs:L7 | neighbors=[extract-domain.mjs]
- "scripts_extract_domain_extractdomain": "extractDomain()" | kind=code-symbol | source=scripts/extract-domain.mjs:L26 | neighbors=[extract-domain.mjs]
- "scripts_extract_domain_keywords": "KEYWORDS" | kind=code-symbol | source=scripts/extract-domain.mjs:L10 | neighbors=[extract-domain.mjs]
- "scripts_extract_domain_root": "ROOT" | kind=code-symbol | source=scripts/extract-domain.mjs:L8 | neighbors=[extract-domain.mjs]
- "scripts_load_context_context_map": "CONTEXT_MAP" | kind=code-symbol | source=scripts/load-context.mjs:L11 | neighbors=[load-context.mjs]
- "scripts_load_context_dirname": "__dirname" | kind=code-symbol | source=scripts/load-context.mjs:L9 | neighbors=[load-context.mjs]
- "scripts_load_context_graph_json": "GRAPH_JSON" | kind=code-symbol | source=scripts/load-context.mjs:L12 | neighbors=[load-context.mjs]
- "scripts_load_context_keywords": "KEYWORDS" | kind=code-symbol | source=scripts/load-context.mjs:L14 | neighbors=[load-context.mjs]
- "scripts_load_context_root": "ROOT" | kind=code-symbol | source=scripts/load-context.mjs:L10 | neighbors=[load-context.mjs]
- "seguimientos_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/seguimientos/route.ts:L7 | neighbors=[route.ts]
- "setup_2fa_page_setup2fapage": "Setup2FAPage()" | kind=code-symbol | source=app/(auth)/login/setup-2fa/page.tsx:L7 | neighbors=[page.tsx]
- "shared_detalleinfraccionview_fieldwithicon": "FieldWithIcon()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L464 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_getstatusstyle": "getStatusStyle()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L96 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infracciondetalle": "InfraccionDetalle" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L77 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infracciongarantia": "InfraccionGarantia" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L63 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionheader": "InfraccionHeader" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L15 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccioninfractor": "InfraccionInfractor" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L41 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionlegal": "InfraccionLegal" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L31 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionoficial": "InfraccionOficial" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L47 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionubicacion": "InfraccionUbicacion" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L67 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionvehiculo": "InfraccionVehiculo" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L54 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_props": "Props" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L142 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_section": "Section()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L440 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_status_styles": "STATUS_STYLES" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L89 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_streetviewmap": "StreetViewMap()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L400 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_timelinenode": "TimelineNode()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L731 | neighbors=[DetalleInfraccionView.tsx]
- "shared_direcciongooglemaps_props": "Props" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L13 | neighbors=[DireccionGoogleMaps.tsx]
- "shared_infracciones_bool": "bool()" | kind=code-symbol | source=lib/shared/infracciones.ts:L48 | neighbors=[infracciones.ts]
- "shared_infracciones_num": "num()" | kind=code-symbol | source=lib/shared/infracciones.ts:L55 | neighbors=[infracciones.ts]
- "shared_infracciones_str": "str()" | kind=code-symbol | source=lib/shared/infracciones.ts:L43 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfracciongarantia": "ViaInfraccionGarantia" | kind=code-symbol | source=lib/shared/infracciones.ts:L114 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionheader": "ViaInfraccionHeader" | kind=code-symbol | source=lib/shared/infracciones.ts:L63 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccioninfractor": "ViaInfraccionInfractor" | kind=code-symbol | source=lib/shared/infracciones.ts:L90 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionlegal": "ViaInfraccionLegal" | kind=code-symbol | source=lib/shared/infracciones.ts:L80 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionoficial": "ViaInfraccionOficial" | kind=code-symbol | source=lib/shared/infracciones.ts:L98 | neighbors=[infracciones.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-075.json

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
