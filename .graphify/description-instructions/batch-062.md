# Node Description Batch 63 of 86

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

- "db_schema_users": "users" | kind=code-symbol | source=lib/db/schema.ts:L8 | neighbors=[schema.ts]
- "db_schema_verifications": "verifications" | kind=code-symbol | source=lib/db/schema.ts:L65 | neighbors=[schema.ts]
- "db_seed_main": "main()" | kind=code-symbol | source=lib/db/seed.ts:L12 | neighbors=[seed.ts]
- "db_seed_pool": "pool" | kind=code-symbol | source=lib/db/seed.ts:L10 | neighbors=[seed.ts]
- "denuncias_formulariod1_btnbackstyle": "btnBackStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L478 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_btnnextstyle": "btnNextStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L477 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_btnsubmitstyle": "btnSubmitStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L480 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_center": "center" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L18 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_fieldcontainerstyle": "fieldContainerStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L433 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_formulariod1": "FormularioD1()" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L63 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_generarfoliodenuncia": "generarFolioDenuncia()" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L49 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_grid2style": "grid2Style" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L432 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_grid3style": "grid3Style" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L431 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_grid4style": "grid4Style" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L430 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_iconstyle": "iconStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L436 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_inputstyle": "inputStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L435 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_labelstyle": "labelStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L434 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_loaderstyle": "loaderStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L467 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_mapcontainerstyle": "mapContainerStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L17 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_mapwrapperstyle": "mapWrapperStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L459 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_prefill": "Prefill" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L38 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_sectiontitlestyle": "sectionTitleStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L437 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_sentinelfield": "SentinelField()" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L20 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_subpanelstyle": "subPanelStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L438 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_subtitlestyle": "subTitleStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L448 | neighbors=[FormularioD1.tsx]
- "denuncias_stored1_ahora": "ahora" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L3 | neighbors=[storeD1.ts]
- "denuncias_stored1_center": "center" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L40 | neighbors=[storeD1.ts]
- "denuncias_stored1_coord": "Coord" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L7 | neighbors=[storeD1.ts]
- "denuncias_stored1_d1formactions": "D1FormActions" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L27 | neighbors=[storeD1.ts]
- "denuncias_stored1_d1formstate": "D1FormState" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L17 | neighbors=[storeD1.ts]
- "denuncias_stored1_d1formstore": "D1FormStore" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L38 | neighbors=[storeD1.ts]
- "denuncias_stored1_dir": "Dir" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L12 | neighbors=[storeD1.ts]
- "denuncias_stored1_horaactual": "horaActual" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L5 | neighbors=[storeD1.ts]
- "denuncias_stored1_initialstate": "initialState" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L42 | neighbors=[storeD1.ts]
- "despacho_despachoform_btn": "BTN" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L13 | neighbors=[DespachoForm.tsx]
- "despacho_despachoform_btn_sm": "BTN_SM" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L14 | neighbors=[DespachoForm.tsx]
- "despacho_despachoform_elemento": "Elemento" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L10 | neighbors=[DespachoForm.tsx]
- "despacho_despachoform_err": "ERR" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L16 | neighbors=[DespachoForm.tsx]
- "despacho_despachoform_i": "I" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L12 | neighbors=[DespachoForm.tsx]
- "despacho_despachoform_lbl": "LBL" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L17 | neighbors=[DespachoForm.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-062.json

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
