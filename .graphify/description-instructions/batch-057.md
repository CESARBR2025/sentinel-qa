# Node Description Batch 58 of 84

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

- "analisis_generarpresentacion_titlestyle": "titleStyle" | kind=code-symbol | source=components/analisis/generarPresentacion.tsx:L297 | neighbors=[generarPresentacion.tsx]
- "analisis_page_actiontextstyle": "actionTextStyle" | kind=code-symbol | source=app/analisis/page.tsx:L161 | neighbors=[page.tsx]
- "analisis_page_cardcontentstyle": "cardContentStyle" | kind=code-symbol | source=app/analisis/page.tsx:L144 | neighbors=[page.tsx]
- "analisis_page_carddescstyle": "cardDescStyle" | kind=code-symbol | source=app/analisis/page.tsx:L159 | neighbors=[page.tsx]
- "analisis_page_cardstyle": "cardStyle" | kind=code-symbol | source=app/analisis/page.tsx:L135 | neighbors=[page.tsx]
- "analisis_page_cardtitlestyle": "cardTitleStyle" | kind=code-symbol | source=app/analisis/page.tsx:L158 | neighbors=[page.tsx]
- "analisis_page_decoratorline": "decoratorLine" | kind=code-symbol | source=app/analisis/page.tsx:L172 | neighbors=[page.tsx]
- "analisis_page_iconboxstyle": "iconBoxStyle" | kind=code-symbol | source=app/analisis/page.tsx:L146 | neighbors=[page.tsx]
- "analisis_page_menuanalisispage": "MenuAnalisisPage()" | kind=code-symbol | source=app/analisis/page.tsx:L9 | neighbors=[page.tsx]
- "analisis_page_systemstatusstyle": "systemStatusStyle" | kind=code-symbol | source=app/analisis/page.tsx:L174 | neighbors=[page.tsx]
- "analisis_page_titlestyle": "titleStyle" | kind=code-symbol | source=app/analisis/page.tsx:L133 | neighbors=[page.tsx]
- "analisis_page_toplabelstyle": "topLabelStyle" | kind=code-symbol | source=app/analisis/page.tsx:L132 | neighbors=[page.tsx]
- "analisis_permisos_accion": "Accion" | kind=code-symbol | source=lib/analisis/permisos.ts:L6 | neighbors=[permisos.ts]
- "analisis_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/analisis/permisos.ts:L13 | neighbors=[permisos.ts]
- "analisis_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/analisis/permisos.ts:L21 | neighbors=[permisos.ts]
- "analisis_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/analisis/permisos.ts:L17 | neighbors=[permisos.ts]
- "analisis_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/analisis/permisos.ts:L7 | neighbors=[permisos.ts]
- "analisis_permisos_roles_permitidos": "ROLES_PERMITIDOS" | kind=code-symbol | source=lib/analisis/permisos.ts:L26 | neighbors=[permisos.ts]
- "analisis_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/analisis/permisos.ts:L5 | neighbors=[permisos.ts]
- "analisis_tablonanalisis_btnstyle": "btnStyle" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L159 | neighbors=[TablonAnalisis.tsx]
- "analisis_tablonanalisis_containerstyle": "containerStyle" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L153 | neighbors=[TablonAnalisis.tsx]
- "analisis_tablonanalisis_headerrowstyle": "headerRowStyle" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L154 | neighbors=[TablonAnalisis.tsx]
- "analisis_tablonanalisis_loadingstyle": "loadingStyle" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L158 | neighbors=[TablonAnalisis.tsx]
- "analisis_tablonanalisis_pagebuttonstyle": "pageButtonStyle" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L168 | neighbors=[TablonAnalisis.tsx]
- "analisis_tablonanalisis_paginationcontainerstyle": "paginationContainerStyle" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L161 | neighbors=[TablonAnalisis.tsx]
- "analisis_tablonanalisis_resultbadge": "ResultBadge()" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L140 | neighbors=[TablonAnalisis.tsx]
- "analisis_tablonanalisis_tablonanalisis": "TablonAnalisis()" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L8 | neighbors=[TablonAnalisis.tsx]
- "analisis_tablonanalisis_tdstyle": "tdStyle" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L156 | neighbors=[TablonAnalisis.tsx]
- "analisis_tablonanalisis_thstyle": "thStyle" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L155 | neighbors=[TablonAnalisis.tsx]
- "analisis_tablonanalisis_trstyle": "trStyle" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L157 | neighbors=[TablonAnalisis.tsx]
- "app_layout_metadata": "metadata" | kind=code-symbol | source=app/layout.tsx:L6 | neighbors=[layout.tsx]
- "app_layout_rootlayout": "RootLayout()" | kind=code-symbol | source=app/layout.tsx:L11 | neighbors=[layout.tsx]
- "app_page_rootpage": "RootPage()" | kind=code-symbol | source=app/page.tsx:L3 | neighbors=[page.tsx]
- "asegurados_page_aseguradospage": "AseguradosPage()" | kind=code-symbol | source=app/fiscalia/asegurados/page.tsx:L5 | neighbors=[page.tsx]
- "asegurados_page_juzgadoaseguradospage": "JuzgadoAseguradosPage()" | kind=code-symbol | source=app/agente_juzgado/asegurados/page.tsx:L5 | neighbors=[page.tsx]
- "atendidos_route_get": "GET()" | kind=code-symbol | source=app/api/incidentes/atendidos/route.ts:L7 | neighbors=[route.ts]
- "auth_helpers_userwithrole": "UserWithRole" | kind=code-symbol | source=lib/auth/helpers.ts:L3 | neighbors=[helpers.ts]
- "auth_layout_authlayout": "AuthLayout()" | kind=code-symbol | source=app/(auth)/layout.tsx:L7 | neighbors=[layout.tsx]
- "auth_layout_metadata": "metadata" | kind=code-symbol | source=app/(auth)/layout.tsx:L3 | neighbors=[layout.tsx]
- "auxiliar_actions_bool": "bool()" | kind=code-symbol | source=lib/auxiliar/actions.ts:L17 | neighbors=[actions.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-057.json

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
