# Node Description Batch 85 of 86

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

- "subir_foto_route_post": "POST()" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/subir-foto/route.ts:L10 | neighbors=[route.ts]
- "tabladevinfracciones_detalleinfraccionmodal_detalleinfraccionmodal": "DetalleInfraccionModal()" | kind=code-symbol | source=features/depInfracciones/components/TablaDevInfracciones/DetalleInfraccionModal.tsx:L19 | neighbors=[DetalleInfraccionModal.tsx]
- "tabladevinfracciones_detalleinfraccionmodal_detalleinfraccionmodalprops": "DetalleInfraccionModalProps" | kind=code-symbol | source=features/depInfracciones/components/TablaDevInfracciones/DetalleInfraccionModal.tsx:L12 | neighbors=[DetalleInfraccionModal.tsx]
- "tabladevinfracciones_detalleinfraccionmodal_infracciondetalle": "InfraccionDetalle" | kind=code-symbol | source=features/depInfracciones/components/TablaDevInfracciones/DetalleInfraccionModal.tsx:L3 | neighbors=[DetalleInfraccionModal.tsx]
- "token_guest_route_post": "POST()" | kind=code-symbol | source=app/api/auth/token-guest/route.ts:L5 | neighbors=[route.ts]
- "token_route_get": "GET()" | kind=code-symbol | source=app/api/via/exp-digital/token/route.ts:L6 | neighbors=[route.ts]
- "types_detalleinfraccion_detallegarantia": "DetalleGarantia" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L47 | neighbors=[detalleInfraccion.ts]
- "types_detalleinfraccion_detalleheader": "DetalleHeader" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L1 | neighbors=[detalleInfraccion.ts]
- "types_detalleinfraccion_detalleinfraccion": "DetalleInfraccion" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L21 | neighbors=[detalleInfraccion.ts]
- "types_detalleinfraccion_detalleinfractor": "DetalleInfractor" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L28 | neighbors=[detalleInfraccion.ts]
- "types_detalleinfraccion_detalleubicacion": "DetalleUbicacion" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L51 | neighbors=[detalleInfraccion.ts]
- "types_detalleinfraccion_detallevehiculo": "DetalleVehiculo" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L38 | neighbors=[detalleInfraccion.ts]
- "ui_customselect_customselectprops": "CustomSelectProps" | kind=code-symbol | source=features/via/infracciones/components/ui/CustomSelect.tsx:L9 | neighbors=[CustomSelect.tsx]
- "ui_customselect_option": "Option" | kind=code-symbol | source=features/via/infracciones/components/ui/CustomSelect.tsx:L4 | neighbors=[CustomSelect.tsx]
- "ui_radioinput_radiooption": "RadioOption()" | kind=code-symbol | source=features/via/infracciones/components/ui/RadioInput.tsx:L1 | neighbors=[RadioInput.tsx]
- "ui_segmentedcontrol_option": "Option" | kind=code-symbol | source=features/via/infracciones/components/ui/SegmentedControl.tsx:L3 | neighbors=[SegmentedControl.tsx]
- "ui_segmentedcontrol_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/ui/SegmentedControl.tsx:L10 | neighbors=[SegmentedControl.tsx]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-084.json

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
