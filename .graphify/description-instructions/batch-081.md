# Node Description Batch 82 of 82

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

- "usuarios_page_usuariospage": "UsuariosPage()" | kind=code-symbol | source=app/admin/usuarios/page.tsx:L7 | neighbors=[page.tsx]
- "utils_generateiphppt_generateiphppt": "generateIPHPPT()" | kind=code-symbol | source=lib/utils/generateIPHPPT.ts:L4 | neighbors=[generateIPHPPT.ts]
- "via_expediente_limpiarcachetoken": "limpiarCacheToken()" | kind=code-symbol | source=lib/via/expediente.ts:L88 | neighbors=[expediente.ts]
- "via_online_getsnapshot": "getSnapshot()" | kind=code-symbol | source=lib/via/online.ts:L3 | neighbors=[online.ts]
- "via_online_subscribe": "subscribe()" | kind=code-symbol | source=lib/via/online.ts:L7 | neighbors=[online.ts]
- "via_pagos_resultadopago": "ResultadoPago" | kind=code-symbol | source=lib/via/pagos.ts:L4 | neighbors=[pagos.ts]
- "visitas_route_get": "GET()" | kind=code-symbol | source=app/api/prevencion/medidas/[id]/visitas/route.ts:L8 | neighbors=[route.ts]
- "visitas_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/medidas/[id]/visitas/route.ts:L22 | neighbors=[route.ts]
- "whatsapp_formsection_formsection": "FormSection()" | kind=code-symbol | source=components/911/whatsapp/FormSection.tsx:L6 | neighbors=[FormSection.tsx]
- "whatsapp_formsection_sectionprops": "SectionProps" | kind=code-symbol | source=components/911/whatsapp/FormSection.tsx:L1 | neighbors=[FormSection.tsx]
- "whatsapp_page_registroincidentepage": "RegistroIncidentePage()" | kind=code-symbol | source=app/agente_911/whatsapp/page.tsx:L9 | neighbors=[page.tsx]
- "whatsapp_registroincidenteform_libraries": "libraries" | kind=code-symbol | source=components/911/whatsapp/RegistroIncidenteForm.tsx:L13 | neighbors=[RegistroIncidenteForm.tsx]
- "whatsapp_registroincidenteform_registroincidentezen": "RegistroIncidenteZen()" | kind=code-symbol | source=components/911/whatsapp/RegistroIncidenteForm.tsx:L15 | neighbors=[RegistroIncidenteForm.tsx]
- "wireframes_shared_arrow": "Arrow()" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L65 | neighbors=[shared.jsx]
- "wireframes_shared_corner": "Corner()" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L138 | neighbors=[shared.jsx]
- "wireframes_shared_darkframe": "DarkFrame()" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L123 | neighbors=[shared.jsx]
- "wireframes_shared_gridbg": "GridBG()" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L152 | neighbors=[shared.jsx]
- "wireframes_shared_inputfield": "InputField()" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L81 | neighbors=[shared.jsx]
- "wireframes_shared_primarybutton": "PrimaryButton()" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L105 | neighbors=[shared.jsx]
- "wireframes_shared_scribble": "Scribble()" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L50 | neighbors=[shared.jsx]
- "wireframes_shared_shieldmark": "ShieldMark()" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L28 | neighbors=[shared.jsx]
- "wireframes_shared_statusbar": "StatusBar()" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L166 | neighbors=[shared.jsx]
- "wireframes_shared_wf": "WF" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L5 | neighbors=[shared.jsx]
- "wireframes_wf_a_wireframea": "WireframeA()" | kind=code-symbol | source=login-desing/wireframes/wf-a.jsx:L6 | neighbors=[wf-a.jsx]
- "wireframes_wf_b_wireframeb": "WireframeB()" | kind=code-symbol | source=login-desing/wireframes/wf-b.jsx:L4 | neighbors=[wf-b.jsx]
- "wireframes_wf_c_wireframec": "WireframeC()" | kind=code-symbol | source=login-desing/wireframes/wf-c.jsx:L4 | neighbors=[wf-c.jsx]
- "wireframes_wf_d_wireframed": "WireframeD()" | kind=code-symbol | source=login-desing/wireframes/wf-d.jsx:L4 | neighbors=[wf-d.jsx]
- "wireframes_wf_e_wireframee": "WireframeE()" | kind=code-symbol | source=login-desing/wireframes/wf-e.jsx:L4 | neighbors=[wf-e.jsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-081.json

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
