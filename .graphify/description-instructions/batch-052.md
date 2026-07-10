# Node Description Batch 53 of 79

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

- "agente_juzgado_formularioaseguradojuzgado_props": "Props" | kind=code-symbol | source=components/agente_juzgado/FormularioAseguradoJuzgado.tsx:L13 | neighbors=[FormularioAseguradoJuzgado.tsx]
- "agente_juzgado_juzgadodashboard_avatar_colors": "AVATAR_COLORS" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L13 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_estatusjuzgado": "EstatusJuzgado" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L43 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_getbadge": "getBadge()" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L65 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_getinitials": "getInitials()" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L24 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_hashcolor": "hashColor()" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L31 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_juzgadodashboard": "JuzgadoDashboard()" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L71 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_props": "Props" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L37 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_sortable_keys": "SORTABLE_KEYS" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L69 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_status_badge": "STATUS_BADGE" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L52 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_status_tabs": "STATUS_TABS" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L47 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadotable_columns": "columns" | kind=code-symbol | source=components/agente_juzgado/JuzgadoTable.tsx:L23 | neighbors=[JuzgadoTable.tsx]
- "agente_juzgado_juzgadotable_datarow": "DataRow" | kind=code-symbol | source=components/agente_juzgado/JuzgadoTable.tsx:L5 | neighbors=[JuzgadoTable.tsx]
- "agente_juzgado_juzgadotable_juzgadotableprops": "JuzgadoTableProps" | kind=code-symbol | source=components/agente_juzgado/JuzgadoTable.tsx:L16 | neighbors=[JuzgadoTable.tsx]
- "agente_juzgado_mapper_bool": "bool()" | kind=code-symbol | source=lib/agente_juzgado/mapper.ts:L8 | neighbors=[mapper.ts]
- "agente_juzgado_mapper_str": "str()" | kind=code-symbol | source=lib/agente_juzgado/mapper.ts:L3 | neighbors=[mapper.ts]
- "agente_juzgado_page_juzgadodashboardpage": "JuzgadoDashboardPage()" | kind=code-symbol | source=app/agente_juzgado/page.tsx:L8 | neighbors=[page.tsx]
- "agente_juzgado_profiledropdown_props": "Props" | kind=code-symbol | source=components/agente_juzgado/ProfileDropdown.tsx:L8 | neighbors=[ProfileDropdown.tsx]
- "agente_juzgado_repository_actualizaroficiojuzgado": "actualizarOficioJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L408 | neighbors=[repository.ts]
- "agente_juzgado_service_listarsolicitudescerradas": "listarSolicitudesCerradas()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L47 | neighbors=[service.ts]
- "agente_juzgado_service_obtenerdetalleinfraccionviaservicejuzgado": "obtenerDetalleInfraccionViaServiceJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L80 | neighbors=[service.ts]
- "agente_juzgado_subirfotodetenido_compressimage": "compressImage()" | kind=code-symbol | source=components/agente_juzgado/SubirFotoDetenido.tsx:L6 | neighbors=[SubirFotoDetenido.tsx]
- "agente_juzgado_tabsolicitudes_parseevidencias": "parseEvidencias()" | kind=code-symbol | source=components/agente_juzgado/TabSolicitudes.tsx:L26 | neighbors=[TabSolicitudes.tsx]
- "agente_juzgado_tabsolicitudes_props": "Props" | kind=code-symbol | source=components/agente_juzgado/TabSolicitudes.tsx:L10 | neighbors=[TabSolicitudes.tsx]
- "agente_juzgado_tabsolicitudes_tab": "Tab" | kind=code-symbol | source=components/agente_juzgado/TabSolicitudes.tsx:L17 | neighbors=[TabSolicitudes.tsx]
- "agente_juzgado_tabsolicitudes_tabs": "tabs" | kind=code-symbol | source=components/agente_juzgado/TabSolicitudes.tsx:L19 | neighbors=[TabSolicitudes.tsx]
- "agente_juzgado_types_viainfracciongarantia": "ViaInfraccionGarantia" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L111 | neighbors=[types.ts]
- "agente_juzgado_types_viainfraccionheader": "ViaInfraccionHeader" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L62 | neighbors=[types.ts]
- "agente_juzgado_types_viainfraccioninfractor": "ViaInfraccionInfractor" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L87 | neighbors=[types.ts]
- "agente_juzgado_types_viainfraccionlegal": "ViaInfraccionLegal" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L77 | neighbors=[types.ts]
- "agente_juzgado_types_viainfraccionoficial": "ViaInfraccionOficial" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L95 | neighbors=[types.ts]
- "agente_juzgado_types_viainfraccionubicacion": "ViaInfraccionUbicacion" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L115 | neighbors=[types.ts]
- "agente_juzgado_types_viainfraccionvehiculo": "ViaInfraccionVehiculo" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L102 | neighbors=[types.ts]
- "agente_liberaciones_liberacionesdashboard_avatar_colors": "AVATAR_COLORS" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesDashboard.tsx:L10 | neighbors=[LiberacionesDashboard.tsx]
- "agente_liberaciones_liberacionesdashboard_estatusliberaciones": "EstatusLiberaciones" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesDashboard.tsx:L40 | neighbors=[LiberacionesDashboard.tsx]
- "agente_liberaciones_liberacionesdashboard_getbadge": "getBadge()" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesDashboard.tsx:L68 | neighbors=[LiberacionesDashboard.tsx]
- "agente_liberaciones_liberacionesdashboard_getinitials": "getInitials()" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesDashboard.tsx:L21 | neighbors=[LiberacionesDashboard.tsx]
- "agente_liberaciones_liberacionesdashboard_hashcolor": "hashColor()" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesDashboard.tsx:L28 | neighbors=[LiberacionesDashboard.tsx]
- "agente_liberaciones_liberacionesdashboard_liberacionesdashboard": "LiberacionesDashboard()" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesDashboard.tsx:L81 | neighbors=[LiberacionesDashboard.tsx]
- "agente_liberaciones_liberacionesdashboard_props": "Props" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesDashboard.tsx:L34 | neighbors=[LiberacionesDashboard.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-052.json

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
