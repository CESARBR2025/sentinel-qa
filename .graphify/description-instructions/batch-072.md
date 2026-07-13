# Node Description Batch 73 of 86

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

- "liberar_garantia_route_patch": "PATCH()" | kind=code-symbol | source=app/api/via/infracciones/liberar-garantia/route.ts:L4 | neighbors=[route.ts]
- "listar_route_get": "GET()" | kind=code-symbol | source=app/api/detenidos/listar/route.ts:L6 | neighbors=[route.ts]
- "login_desing_app_app": "App()" | kind=code-symbol | source=login-desing/app.jsx:L9 | neighbors=[app.jsx]
- "login_desing_app_applyglobaltweaks": "applyGlobalTweaks()" | kind=code-symbol | source=login-desing/app.jsx:L211 | neighbors=[app.jsx]
- "login_desing_app_appwitheffects": "AppWithEffects()" | kind=code-symbol | source=login-desing/app.jsx:L223 | neighbors=[app.jsx]
- "login_desing_app_nextstepscard": "NextStepsCard()" | kind=code-symbol | source=login-desing/app.jsx:L139 | neighbors=[app.jsx]
- "login_desing_app_palettecard": "PaletteCard()" | kind=code-symbol | source=login-desing/app.jsx:L87 | neighbors=[app.jsx]
- "login_desing_app_tweaks": "TWEAKS" | kind=code-symbol | source=login-desing/app.jsx:L3 | neighbors=[app.jsx]
- "login_desing_app_tweakspanel": "TweaksPanel()" | kind=code-symbol | source=login-desing/app.jsx:L167 | neighbors=[app.jsx]
- "login_desing_app_typecard": "TypeCard()" | kind=code-symbol | source=login-desing/app.jsx:L115 | neighbors=[app.jsx]
- "login_desing_design_canvas_dc": "DC" | kind=code-symbol | source=login-desing/design-canvas.jsx:L17 | neighbors=[design-canvas.jsx]
- "login_desing_design_canvas_dcartboard": "DCArtboard()" | kind=code-symbol | source=login-desing/design-canvas.jsx:L372 | neighbors=[design-canvas.jsx]
- "login_desing_design_canvas_dcartboardframe": "DCArtboardFrame()" | kind=code-symbol | source=login-desing/design-canvas.jsx:L374 | neighbors=[design-canvas.jsx]
- "login_desing_design_canvas_dcctx": "DCCtx" | kind=code-symbol | source=login-desing/design-canvas.jsx:L57 | neighbors=[design-canvas.jsx]
- "login_desing_design_canvas_dceditable": "DCEditable()" | kind=code-symbol | source=login-desing/design-canvas.jsx:L464 | neighbors=[design-canvas.jsx]
- "login_desing_design_canvas_dcfocusoverlay": "DCFocusOverlay()" | kind=code-symbol | source=login-desing/design-canvas.jsx:L480 | neighbors=[design-canvas.jsx]
- "login_desing_design_canvas_dcpostit": "DCPostIt()" | kind=code-symbol | source=login-desing/design-canvas.jsx:L607 | neighbors=[design-canvas.jsx]
- "login_desing_design_canvas_dcsection": "DCSection()" | kind=code-symbol | source=login-desing/design-canvas.jsx:L333 | neighbors=[design-canvas.jsx]
- "login_desing_design_canvas_dcviewport": "DCViewport()" | kind=code-symbol | source=login-desing/design-canvas.jsx:L182 | neighbors=[design-canvas.jsx]
- "login_desing_design_canvas_designcanvas": "DesignCanvas()" | kind=code-symbol | source=login-desing/design-canvas.jsx:L71 | neighbors=[design-canvas.jsx]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-072.json

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
