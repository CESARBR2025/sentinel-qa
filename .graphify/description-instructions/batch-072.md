# Node Description Batch 73 of 87

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

- "legalidad_repository_articulosrepository_obtenerfraccionesporarticulo": ".obtenerFraccionesPorArticulo()" | kind=code-symbol | source=features/via/legalidad/repository.ts:L27 | neighbors=[ArticulosRepository]
- "legalidad_service_articulosservice_obtenerfraccionesporarticulo": ".obtenerFraccionesPorArticulo()" | kind=code-symbol | source=features/via/legalidad/service.ts:L16 | neighbors=[ArticulosService]
- "lib_auth_authuser": "AuthUser" | kind=code-symbol | source=lib/auth.ts:L63 | neighbors=[auth.ts]
- "lib_db_createpool": "createPool()" | kind=code-symbol | source=lib/db.ts:L7 | neighbors=[db.ts]
- "lib_detenidos_compartido_detenidofotodetalle": "DetenidoFotoDetalle" | kind=code-symbol | source=lib/detenidos-compartido.ts:L17 | neighbors=[detenidos-compartido.ts]
- "lib_detenidos_compartido_detenidofotopendiente": "DetenidoFotoPendiente" | kind=code-symbol | source=lib/detenidos-compartido.ts:L3 | neighbors=[detenidos-compartido.ts]
- "lib_error_handler_actionresult": "ActionResult" | kind=code-symbol | source=lib/error-handler.ts:L42 | neighbors=[error-handler.ts]
- "lib_error_handler_apierror": "apiError()" | kind=code-symbol | source=lib/error-handler.ts:L75 | neighbors=[error-handler.ts]
- "lib_error_handler_apihandler": "ApiHandler" | kind=code-symbol | source=lib/error-handler.ts:L87 | neighbors=[error-handler.ts]
- "lib_error_handler_apiresponse": "ApiResponse" | kind=code-symbol | source=lib/error-handler.ts:L67 | neighbors=[error-handler.ts]
- "lib_error_handler_apisuccess": "apiSuccess()" | kind=code-symbol | source=lib/error-handler.ts:L71 | neighbors=[error-handler.ts]
- "lib_error_handler_apperror_constructor": ".constructor()" | kind=code-symbol | source=lib/error-handler.ts:L2 | neighbors=[AppError]
- "lib_error_handler_conflicterror_constructor": ".constructor()" | kind=code-symbol | source=lib/error-handler.ts:L37 | neighbors=[ConflictError]
- "lib_error_handler_forbiddenerror_constructor": ".constructor()" | kind=code-symbol | source=lib/error-handler.ts:L31 | neighbors=[ForbiddenError]
- "lib_error_handler_notfounderror_constructor": ".constructor()" | kind=code-symbol | source=lib/error-handler.ts:L13 | neighbors=[NotFoundError]
- "lib_error_handler_unauthorizederror_constructor": ".constructor()" | kind=code-symbol | source=lib/error-handler.ts:L25 | neighbors=[UnauthorizedError]
- "lib_error_handler_validationerror_constructor": ".constructor()" | kind=code-symbol | source=lib/error-handler.ts:L19 | neighbors=[ValidationError]
- "liberaciones_page_liberacionesjuzgadopage": "LiberacionesJuzgadoPage()" | kind=code-symbol | source=app/agente_juzgado/liberaciones/page.tsx:L5 | neighbors=[page.tsx]
- "liberaciones_page_liberacionespage": "LiberacionesPage()" | kind=code-symbol | source=app/fiscalia/liberaciones/page.tsx:L5 | neighbors=[page.tsx]
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
