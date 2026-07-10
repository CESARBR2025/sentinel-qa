# Node Description Batch 62 of 79

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

- "fiscalia_fiscaliadashboard_avatar_colors": "AVATAR_COLORS" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L13 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_estatusfiscalia": "EstatusFiscalia" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L43 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_fiscaliadashboard": "FiscaliaDashboard()" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L70 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_getbadge": "getBadge()" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L64 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_getinitials": "getInitials()" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L24 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_hashcolor": "hashColor()" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L31 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_props": "Props" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L37 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_sortable_keys": "SORTABLE_KEYS" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L68 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_status_badge": "STATUS_BADGE" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L52 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_status_tabs": "STATUS_TABS" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L47 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliatable_columns": "columns" | kind=code-symbol | source=components/fiscalia/FiscaliaTable.tsx:L23 | neighbors=[FiscaliaTable.tsx]
- "fiscalia_fiscaliatable_datarow": "DataRow" | kind=code-symbol | source=components/fiscalia/FiscaliaTable.tsx:L5 | neighbors=[FiscaliaTable.tsx]
- "fiscalia_fiscaliatable_fiscaliatable": "FiscaliaTable()" | kind=code-symbol | source=components/fiscalia/FiscaliaTable.tsx:L31 | neighbors=[FiscaliaTable.tsx]
- "fiscalia_fiscaliatable_fiscaliatableprops": "FiscaliaTableProps" | kind=code-symbol | source=components/fiscalia/FiscaliaTable.tsx:L16 | neighbors=[FiscaliaTable.tsx]
- "fiscalia_formularioasegurado_disabledsx": "disabledSx" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L30 | neighbors=[FormularioAsegurado.tsx]
- "fiscalia_formularioasegurado_inputsx": "inputSx" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L42 | neighbors=[FormularioAsegurado.tsx]
- "fiscalia_formularioasegurado_labelsx": "labelSx" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L20 | neighbors=[FormularioAsegurado.tsx]
- "fiscalia_formularioasegurado_props": "Props" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L13 | neighbors=[FormularioAsegurado.tsx]
- "fiscalia_formulariopuestadisposicion_disabledsx": "disabledSx" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L38 | neighbors=[FormularioPuestaDisposicion.tsx]
- "fiscalia_formulariopuestadisposicion_inputsx": "inputSx" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L27 | neighbors=[FormularioPuestaDisposicion.tsx]
- "fiscalia_formulariopuestadisposicion_labelsx": "labelSx" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L17 | neighbors=[FormularioPuestaDisposicion.tsx]
- "fiscalia_formulariopuestadisposicion_props": "Props" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L10 | neighbors=[FormularioPuestaDisposicion.tsx]
- "fiscalia_mapper_bool": "bool()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L8 | neighbors=[mapper.ts]
- "fiscalia_mapper_rowtoinfracciondetalle": "rowToInfraccionDetalle()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L87 | neighbors=[mapper.ts]
- "fiscalia_mapper_str": "str()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L3 | neighbors=[mapper.ts]
- "fiscalia_page_fiscaliadashboardpage": "FiscaliaDashboardPage()" | kind=code-symbol | source=app/fiscalia/page.tsx:L7 | neighbors=[page.tsx]
- "fiscalia_profiledropdown_props": "Props" | kind=code-symbol | source=components/fiscalia/ProfileDropdown.tsx:L8 | neighbors=[ProfileDropdown.tsx]
- "fiscalia_service_obtenerdetalleinfraccionviaservice": "obtenerDetalleInfraccionViaService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L147 | neighbors=[service.ts]
- "fiscalia_subirfotodetenido_compressimage": "compressImage()" | kind=code-symbol | source=components/fiscalia/SubirFotoDetenido.tsx:L6 | neighbors=[SubirFotoDetenido.tsx]
- "fiscalia_tabasegurados_props": "Props" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L8 | neighbors=[TabAsegurados.tsx]
- "fiscalia_tabasegurados_tabbase": "tabBase" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L14 | neighbors=[TabAsegurados.tsx]
- "fiscalia_tabasegurados_tdsx": "tdSx" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L37 | neighbors=[TabAsegurados.tsx]
- "fiscalia_tabasegurados_thsx": "thSx" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L25 | neighbors=[TabAsegurados.tsx]
- "fiscalia_tabsolicitudes_props": "Props" | kind=code-symbol | source=components/fiscalia/TabSolicitudes.tsx:L9 | neighbors=[TabSolicitudes.tsx]
- "fiscalia_tabsolicitudes_tab": "Tab" | kind=code-symbol | source=components/fiscalia/TabSolicitudes.tsx:L16 | neighbors=[TabSolicitudes.tsx]
- "fiscalia_tabsolicitudes_tabs": "tabs" | kind=code-symbol | source=components/fiscalia/TabSolicitudes.tsx:L18 | neighbors=[TabSolicitudes.tsx]
- "fiscalia_types_aseguradocondisposicion": "AseguradoConDisposicion" | kind=code-symbol | source=lib/fiscalia/types.ts:L121 | neighbors=[types.ts]
- "fiscalia_types_detallegarantia": "DetalleGarantia" | kind=code-symbol | source=lib/fiscalia/types.ts:L338 | neighbors=[types.ts]
- "fiscalia_types_detalleheader": "DetalleHeader" | kind=code-symbol | source=lib/fiscalia/types.ts:L292 | neighbors=[types.ts]
- "fiscalia_types_detalleinfraccion": "DetalleInfraccion" | kind=code-symbol | source=lib/fiscalia/types.ts:L312 | neighbors=[types.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-061.json

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
