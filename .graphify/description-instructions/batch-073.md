# Node Description Batch 74 of 87

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

- "login_desing_login_app_app": "App()" | kind=code-symbol | source=login-desing/login-app.jsx:L180 | neighbors=[login-app.jsx]
- "login_desing_login_app_iconarrow": "IconArrow()" | kind=code-symbol | source=login-desing/login-app.jsx:L21 | neighbors=[login-app.jsx]
- "login_desing_login_app_iconcheck": "IconCheck()" | kind=code-symbol | source=login-desing/login-app.jsx:L24 | neighbors=[login-app.jsx]
- "login_desing_login_app_iconlock": "IconLock()" | kind=code-symbol | source=login-desing/login-app.jsx:L15 | neighbors=[login-app.jsx]
- "login_desing_login_app_iconshield": "IconShield()" | kind=code-symbol | source=login-desing/login-app.jsx:L18 | neighbors=[login-app.jsx]
- "login_desing_login_app_iconuser": "IconUser()" | kind=code-symbol | source=login-desing/login-app.jsx:L12 | neighbors=[login-app.jsx]
- "login_desing_login_app_otpinput": "OtpInput()" | kind=code-symbol | source=login-desing/login-app.jsx:L125 | neighbors=[login-app.jsx]
- "login_desing_login_app_terminal": "Terminal()" | kind=code-symbol | source=login-desing/login-app.jsx:L29 | neighbors=[login-app.jsx]
- "login_desing_login_app_tweaks": "TWEAKS" | kind=code-symbol | source=login-desing/login-app.jsx:L6 | neighbors=[login-app.jsx]
- "login_page_iconarrow": "IconArrow()" | kind=code-symbol | source=app/(auth)/login/page.tsx:L16 | neighbors=[page.tsx]
- "login_page_iconcheck": "IconCheck()" | kind=code-symbol | source=app/(auth)/login/page.tsx:L19 | neighbors=[page.tsx]
- "login_page_iconlock": "IconLock()" | kind=code-symbol | source=app/(auth)/login/page.tsx:L10 | neighbors=[page.tsx]
- "login_page_iconshield": "IconShield()" | kind=code-symbol | source=app/(auth)/login/page.tsx:L13 | neighbors=[page.tsx]
- "login_page_iconuser": "IconUser()" | kind=code-symbol | source=app/(auth)/login/page.tsx:L7 | neighbors=[page.tsx]
- "login_page_logincontent": "LoginContent()" | kind=code-symbol | source=app/(auth)/login/page.tsx:L180 | neighbors=[page.tsx]
- "login_page_loginpage": "LoginPage()" | kind=code-symbol | source=app/(auth)/login/page.tsx:L172 | neighbors=[page.tsx]
- "login_page_logline": "LogLine" | kind=code-symbol | source=app/(auth)/login/page.tsx:L25 | neighbors=[page.tsx]
- "login_page_logtype": "LogType" | kind=code-symbol | source=app/(auth)/login/page.tsx:L24 | neighbors=[page.tsx]
- "login_page_otpinput": "OtpInput()" | kind=code-symbol | source=app/(auth)/login/page.tsx:L103 | neighbors=[page.tsx]
- "login_page_terminal": "Terminal()" | kind=code-symbol | source=app/(auth)/login/page.tsx:L27 | neighbors=[page.tsx]
- "manual_migrations_0006_formato_n_formato_n_reportes": "formato_n_reportes" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L1 | neighbors=[0006_formato_n.sql]
- "manual_migrations_0007_formato_n_split_formato_n_armas_aseguradas": "formato_n_armas_aseguradas" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L113 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_atencion_victimas": "formato_n_atencion_victimas" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L98 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_eventos": "formato_n_eventos" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L23 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_fge": "formato_n_fge" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L36 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_fgr": "formato_n_fgr" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L55 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_medios_alternativos": "formato_n_medios_alternativos" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L85 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_rnd": "formato_n_rnd" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L74 | neighbors=[0007_formato_n_split.sql]
- "maps_googlemappicker_center": "center" | kind=code-symbol | source=components/maps/GoogleMapPicker.tsx:L8 | neighbors=[GoogleMapPicker.tsx]
- "maps_googlemappicker_containerstyle": "containerStyle" | kind=code-symbol | source=components/maps/GoogleMapPicker.tsx:L7 | neighbors=[GoogleMapPicker.tsx]
- "maps_googlemappicker_googlemappicker": "GoogleMapPicker()" | kind=code-symbol | source=components/maps/GoogleMapPicker.tsx:L18 | neighbors=[GoogleMapPicker.tsx]
- "maps_googlemappicker_props": "Props" | kind=code-symbol | source=components/maps/GoogleMapPicker.tsx:L10 | neighbors=[GoogleMapPicker.tsx]
- "medidas_page_color_map": "COLOR_MAP" | kind=code-symbol | source=app/prevencion/medidas/page.tsx:L13 | neighbors=[page.tsx]
- "medidas_page_medidaspage": "MedidasPage()" | kind=code-symbol | source=app/prevencion/medidas/page.tsx:L20 | neighbors=[page.tsx]
- "medidas_route_get": "GET()" | kind=code-symbol | source=app/api/prevencion/medidas/route.ts:L8 | neighbors=[route.ts]
- "medidas_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/medidas/route.ts:L22 | neighbors=[route.ts]
- "modulo_incidentes_page_reportesoperativospage": "ReportesOperativosPage()" | kind=code-symbol | source=app/modulo_incidentes/page.tsx:L13 | neighbors=[page.tsx]
- "modulo_incidentes_reporttables_operationaltableprops": "OperationalTableProps" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportTables.tsx:L6 | neighbors=[ReportTables.tsx]
- "monitorista_accionesdetenido_accionesdetenido": "AccionesDetenido()" | kind=code-symbol | source=components/monitorista/AccionesDetenido.tsx:L9 | neighbors=[AccionesDetenido.tsx]
- "monitorista_actions_solicitarevidencia": "solicitarEvidencia()" | kind=code-symbol | source=lib/monitorista/actions.ts:L19 | neighbors=[actions.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-073.json

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
