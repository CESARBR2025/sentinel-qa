# Node Description Batch 72 of 93

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

- "formato_n_armas_aseguradas_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-armas-aseguradas/route.ts:L7 | neighbors=[route.ts]
- "formato_n_armas_aseguradas_route_post": "POST()" | kind=code-symbol | source=app/api/reportes/formato-n-armas-aseguradas/route.ts:L17 | neighbors=[route.ts]
- "formato_n_atencion_victimas_page_td": "Td()" | kind=code-symbol | source=app/formato-n-atencion-victimas/page.tsx:L98 | neighbors=[page.tsx]
- "formato_n_atencion_victimas_page_th": "Th()" | kind=code-symbol | source=app/formato-n-atencion-victimas/page.tsx:L94 | neighbors=[page.tsx]
- "formato_n_atencion_victimas_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-atencion-victimas/route.ts:L7 | neighbors=[route.ts]
- "formato_n_atencion_victimas_route_post": "POST()" | kind=code-symbol | source=app/api/reportes/formato-n-atencion-victimas/route.ts:L20 | neighbors=[route.ts]
- "formato_n_consolidado_route_post": "POST()" | kind=code-symbol | source=app/api/reportes/formato-n-consolidado/route.ts:L9 | neighbors=[route.ts]
- "formato_n_eventos_page_formatoneventospage": "FormatoNEventosPage()" | kind=code-symbol | source=app/formato-n-eventos/page.tsx:L12 | neighbors=[page.tsx]
- "formato_n_eventos_page_td": "Td()" | kind=code-symbol | source=app/formato-n-eventos/page.tsx:L78 | neighbors=[page.tsx]
- "formato_n_eventos_page_th": "Th()" | kind=code-symbol | source=app/formato-n-eventos/page.tsx:L74 | neighbors=[page.tsx]
- "formato_n_eventos_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-eventos/route.ts:L7 | neighbors=[route.ts]
- "formato_n_eventos_route_post": "POST()" | kind=code-symbol | source=app/api/reportes/formato-n-eventos/route.ts:L17 | neighbors=[route.ts]
- "formato_n_fge_page_td": "Td()" | kind=code-symbol | source=app/formato-n-fge/page.tsx:L108 | neighbors=[page.tsx]
- "formato_n_fge_page_th": "Th()" | kind=code-symbol | source=app/formato-n-fge/page.tsx:L104 | neighbors=[page.tsx]
- "formato_n_fge_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-fge/route.ts:L7 | neighbors=[route.ts]
- "formato_n_fge_route_post": "POST()" | kind=code-symbol | source=app/api/reportes/formato-n-fge/route.ts:L20 | neighbors=[route.ts]
- "formato_n_fgr_page_td": "Td()" | kind=code-symbol | source=app/formato-n-fgr/page.tsx:L108 | neighbors=[page.tsx]
- "formato_n_fgr_page_th": "Th()" | kind=code-symbol | source=app/formato-n-fgr/page.tsx:L104 | neighbors=[page.tsx]
- "formato_n_fgr_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-fgr/route.ts:L7 | neighbors=[route.ts]
- "formato_n_fgr_route_post": "POST()" | kind=code-symbol | source=app/api/reportes/formato-n-fgr/route.ts:L20 | neighbors=[route.ts]
- "formato_n_medios_alternativos_page_td": "Td()" | kind=code-symbol | source=app/formato-n-medios-alternativos/page.tsx:L96 | neighbors=[page.tsx]
- "formato_n_medios_alternativos_page_th": "Th()" | kind=code-symbol | source=app/formato-n-medios-alternativos/page.tsx:L92 | neighbors=[page.tsx]
- "formato_n_medios_alternativos_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-medios-alternativos/route.ts:L7 | neighbors=[route.ts]
- "formato_n_medios_alternativos_route_post": "POST()" | kind=code-symbol | source=app/api/reportes/formato-n-medios-alternativos/route.ts:L20 | neighbors=[route.ts]
- "formato_n_rnd_page_formatonrndpage": "FormatoNRndPage()" | kind=code-symbol | source=app/formato-n-rnd/page.tsx:L12 | neighbors=[page.tsx]
- "formato_n_rnd_page_td": "Td()" | kind=code-symbol | source=app/formato-n-rnd/page.tsx:L76 | neighbors=[page.tsx]
- "formato_n_rnd_page_th": "Th()" | kind=code-symbol | source=app/formato-n-rnd/page.tsx:L72 | neighbors=[page.tsx]
- "formato_n_rnd_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/route.ts:L7 | neighbors=[route.ts]
- "formato_n_rnd_route_post": "POST()" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/route.ts:L17 | neighbors=[route.ts]
- "forms_formkit_label": "Label()" | kind=code-symbol | source=components/forms/FormKit.tsx:L38 | neighbors=[FormKit.tsx]
- "formulario_ingreso_page_despachopage": "DespachoPage()" | kind=code-symbol | source=app/analisis/formulario-ingreso/page.tsx:L9 | neighbors=[page.tsx]
- "fotos_page_fotosdetenidopage": "FotosDetenidoPage()" | kind=code-symbol | source=app/oficial/reportes/[id]/fotos/page.tsx:L10 | neighbors=[page.tsx]
- "fuente_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/fuente/route.ts:L7 | neighbors=[route.ts]
- "generar_orden_pago_route_post": "POST()" | kind=code-symbol | source=app/api/via/sa7/generar-orden-pago/route.ts:L9 | neighbors=[route.ts]
- "generar_ppt_page_registrointeligenciapage": "RegistroInteligenciaPage()" | kind=code-symbol | source=app/analisis/generar-ppt/page.tsx:L9 | neighbors=[page.tsx]
- "generar_ppt_route_post": "POST()" | kind=code-symbol | source=app/api/monitorista/detenidos/generar-ppt/route.ts:L8 | neighbors=[route.ts]
- "generar_route_alignment": "Alignment" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L25 | neighbors=[route.ts]
- "generar_route_allborders": "allBorders" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L18 | neighbors=[route.ts]
- "generar_route_no_border": "NO_BORDER" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L16 | neighbors=[route.ts]
- "generar_route_noborders": "noBorders" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L19 | neighbors=[route.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-071.json

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
