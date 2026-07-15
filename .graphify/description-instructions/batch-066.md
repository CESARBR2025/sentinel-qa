# Node Description Batch 67 of 93

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

- "dashboard_module_cards_charticon": "ChartIcon()" | kind=code-symbol | source=app/dashboard/module-cards.tsx:L18 | neighbors=[module-cards.tsx]
- "dashboard_module_cards_module": "Module" | kind=code-symbol | source=app/dashboard/module-cards.tsx:L5 | neighbors=[module-cards.tsx]
- "dashboard_module_cards_modulecard": "ModuleCard()" | kind=code-symbol | source=app/dashboard/module-cards.tsx:L76 | neighbors=[module-cards.tsx]
- "dashboard_module_cards_modules": "MODULES" | kind=code-symbol | source=app/dashboard/module-cards.tsx:L23 | neighbors=[module-cards.tsx]
- "dashboard_module_cards_settingsicon": "SettingsIcon()" | kind=code-symbol | source=app/dashboard/module-cards.tsx:L20 | neighbors=[module-cards.tsx]
- "dashboard_module_cards_shieldicon": "ShieldIcon()" | kind=code-symbol | source=app/dashboard/module-cards.tsx:L16 | neighbors=[module-cards.tsx]
- "dashboard_page_dashboardpage": "DashboardPage()" | kind=code-symbol | source=app/dashboard/page.tsx:L9 | neighbors=[page.tsx]
- "db_create_admin_admin": "ADMIN" | kind=code-symbol | source=lib/db/create-admin.ts:L14 | neighbors=[create-admin.ts]
- "db_create_admin_main": "main()" | kind=code-symbol | source=lib/db/create-admin.ts:L21 | neighbors=[create-admin.ts]
- "db_create_admin_pool": "pool" | kind=code-symbol | source=lib/db/create-admin.ts:L12 | neighbors=[create-admin.ts]
- "db_schema_accounts": "accounts" | kind=code-symbol | source=lib/db/schema.ts:L43 | neighbors=[schema.ts]
- "db_schema_sessions": "sessions" | kind=code-symbol | source=lib/db/schema.ts:L25 | neighbors=[schema.ts]
- "db_schema_twofactors": "twoFactors" | kind=code-symbol | source=lib/db/schema.ts:L74 | neighbors=[schema.ts]
- "db_schema_users": "users" | kind=code-symbol | source=lib/db/schema.ts:L8 | neighbors=[schema.ts]
- "db_schema_verifications": "verifications" | kind=code-symbol | source=lib/db/schema.ts:L65 | neighbors=[schema.ts]
- "db_seed_main": "main()" | kind=code-symbol | source=lib/db/seed.ts:L12 | neighbors=[seed.ts]
- "db_seed_pool": "pool" | kind=code-symbol | source=lib/db/seed.ts:L10 | neighbors=[seed.ts]
- "denuncias_formulariod1_btnbackstyle": "btnBackStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L550 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_btnnextstyle": "btnNextStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L549 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_btnsubmitstyle": "btnSubmitStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L552 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_center": "center" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L18 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_fieldcontainerstyle": "fieldContainerStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L505 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_formulariod1": "FormularioD1()" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L80 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_generarfoliodenuncia": "generarFolioDenuncia()" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L59 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_grid2style": "grid2Style" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L504 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_grid3style": "grid3Style" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L503 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_grid4style": "grid4Style" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L502 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_grupoadscripcionoption": "GrupoAdscripcionOption" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L73 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_iconstyle": "iconStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L508 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_inputstyle": "inputStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L507 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_labelstyle": "labelStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L506 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_loaderstyle": "loaderStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L539 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_mapcontainerstyle": "mapContainerStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L17 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_mapwrapperstyle": "mapWrapperStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L531 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_prefill": "Prefill" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L38 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_sectiontitlestyle": "sectionTitleStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L509 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_sentinelfield": "SentinelField()" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L20 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_subpanelstyle": "subPanelStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L510 | neighbors=[FormularioD1.tsx]
- "denuncias_formulariod1_subtitlestyle": "subTitleStyle" | kind=code-symbol | source=components/denuncias/FormularioD1.tsx:L520 | neighbors=[FormularioD1.tsx]
- "denuncias_stored1_ahora": "ahora" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L3 | neighbors=[storeD1.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-066.json

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
