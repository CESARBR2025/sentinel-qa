# Node Description Batch 60 of 79

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
- "despacho_despachoform_tag": "TAG" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L15 | neighbors=[DespachoForm.tsx]
- "despacho_despachoform_unidad": "Unidad" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L9 | neighbors=[DespachoForm.tsx]
- "despacho_route_get": "GET()" | kind=code-symbol | source=app/api/incidentes/[id]/despacho/route.ts:L7 | neighbors=[route.ts]
- "despacho_tablondespacho_btnbackstyle": "btnBackStyle" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L246 | neighbors=[TablonDespacho.tsx]
- "despacho_tablondespacho_canalbadge": "CanalBadge()" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L230 | neighbors=[TablonDespacho.tsx]
- "despacho_tablondespacho_incrow": "IncRow" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L15 | neighbors=[TablonDespacho.tsx]
- "despacho_tablondespacho_labelstyle": "labelStyle" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L247 | neighbors=[TablonDespacho.tsx]
- "despacho_tablondespacho_labeltopstyle": "labelTopStyle" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L244 | neighbors=[TablonDespacho.tsx]
- "despacho_tablondespacho_tab": "Tab" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L13 | neighbors=[TablonDespacho.tsx]
- "despacho_tablondespacho_tablondespacho": "TablonDespacho()" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L27 | neighbors=[TablonDespacho.tsx]
- "despacho_tablondespacho_titlestyle": "titleStyle" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L245 | neighbors=[TablonDespacho.tsx]
- "detenidos_page_btndetalle": "btnDetalle" | kind=code-symbol | source=app/monitorista/detenidos/page.tsx:L112 | neighbors=[page.tsx]
- "detenidos_page_detenidosfiscaliapage": "DetenidosFiscaliaPage()" | kind=code-symbol | source=app/fiscalia/detenidos/page.tsx:L9 | neighbors=[page.tsx]
- "detenidos_page_detenidosjuzgadopage": "DetenidosJuzgadoPage()" | kind=code-symbol | source=app/agente_juzgado/detenidos/page.tsx:L10 | neighbors=[page.tsx]
- "detenidos_page_detenidospage": "DetenidosPage()" | kind=code-symbol | source=app/monitorista/detenidos/page.tsx:L12 | neighbors=[page.tsx]
- "detenidos_page_fotobadge": "fotoBadge()" | kind=code-symbol | source=app/monitorista/detenidos/page.tsx:L119 | neighbors=[page.tsx]
- "detenidos_page_pagbtn": "pagBtn" | kind=code-symbol | source=app/fiscalia/detenidos/page.tsx:L165 | neighbors=[page.tsx]
- "editar_campo_route_post": "POST()" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/editar-campo/route.ts:L8 | neighbors=[route.ts]
- "emails_mailer_mailattachment": "MailAttachment" | kind=code-symbol | source=lib/emails/mailer.ts:L13 | neighbors=[mailer.ts]
- "emails_mailer_mailoptions": "MailOptions" | kind=code-symbol | source=lib/emails/mailer.ts:L20 | neighbors=[mailer.ts]
- "emails_mailer_transporter": "transporter" | kind=code-symbol | source=lib/emails/mailer.ts:L3 | neighbors=[mailer.ts]
- "en_despacho_route_get": "GET()" | kind=code-symbol | source=app/api/incidentes/en-despacho/route.ts:L7 | neighbors=[route.ts]
- "enviar_foto_route_post": "POST()" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/enviar-foto/route.ts:L9 | neighbors=[route.ts]
- "envio_de_formatos_page_enviodeformatospage": "EnvioDeFormatosPage()" | kind=code-symbol | source=app/envio-de-formatos/page.tsx:L13 | neighbors=[page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-059.json

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
