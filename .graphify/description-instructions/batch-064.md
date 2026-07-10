# Node Description Batch 65 of 82

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

- "fiscalia_types_aseguradocondisposicion": "AseguradoConDisposicion" | kind=code-symbol | source=lib/fiscalia/types.ts:L121 | neighbors=[types.ts]
- "fiscalia_types_detallegarantia": "DetalleGarantia" | kind=code-symbol | source=lib/fiscalia/types.ts:L338 | neighbors=[types.ts]
- "fiscalia_types_detalleheader": "DetalleHeader" | kind=code-symbol | source=lib/fiscalia/types.ts:L292 | neighbors=[types.ts]
- "fiscalia_types_detalleinfraccion": "DetalleInfraccion" | kind=code-symbol | source=lib/fiscalia/types.ts:L312 | neighbors=[types.ts]
- "fiscalia_types_detalleinfractor": "DetalleInfractor" | kind=code-symbol | source=lib/fiscalia/types.ts:L319 | neighbors=[types.ts]
- "fiscalia_types_detalleubicacion": "DetalleUbicacion" | kind=code-symbol | source=lib/fiscalia/types.ts:L342 | neighbors=[types.ts]
- "fiscalia_types_detallevehiculo": "DetalleVehiculo" | kind=code-symbol | source=lib/fiscalia/types.ts:L329 | neighbors=[types.ts]
- "fiscalia_types_detenidobase": "DetenidoBase" | kind=code-symbol | source=lib/fiscalia/types.ts:L39 | neighbors=[types.ts]
- "fiscalia_types_viainfracciongarantia": "ViaInfraccionGarantia" | kind=code-symbol | source=lib/fiscalia/types.ts:L267 | neighbors=[types.ts]
- "fiscalia_types_viainfraccionheader": "ViaInfraccionHeader" | kind=code-symbol | source=lib/fiscalia/types.ts:L218 | neighbors=[types.ts]
- "fiscalia_types_viainfraccioninfractor": "ViaInfraccionInfractor" | kind=code-symbol | source=lib/fiscalia/types.ts:L243 | neighbors=[types.ts]
- "fiscalia_types_viainfraccionlegal": "ViaInfraccionLegal" | kind=code-symbol | source=lib/fiscalia/types.ts:L233 | neighbors=[types.ts]
- "fiscalia_types_viainfraccionoficial": "ViaInfraccionOficial" | kind=code-symbol | source=lib/fiscalia/types.ts:L251 | neighbors=[types.ts]
- "fiscalia_types_viainfraccionubicacion": "ViaInfraccionUbicacion" | kind=code-symbol | source=lib/fiscalia/types.ts:L271 | neighbors=[types.ts]
- "fiscalia_types_viainfraccionvehiculo": "ViaInfraccionVehiculo" | kind=code-symbol | source=lib/fiscalia/types.ts:L258 | neighbors=[types.ts]
- "fiscalia_usetoaststore_generateid": "generateId()" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L19 | neighbors=[useToastStore.ts]
- "fiscalia_usetoaststore_toast": "Toast" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L7 | neighbors=[useToastStore.ts]
- "fiscalia_usetoaststore_toaststore": "ToastStore" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L13 | neighbors=[useToastStore.ts]
- "fiscalia_usetoaststore_toasttype": "ToastType" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L5 | neighbors=[useToastStore.ts]
- "flota_mapper_rowtopatrullaasignacion": "rowToPatrullaAsignacion()" | kind=code-symbol | source=lib/flota/mapper.ts:L25 | neighbors=[mapper.ts]
- "flota_route_get": "GET()" | kind=code-symbol | source=app/api/rol-servicios/externos/flota/route.ts:L8 | neighbors=[route.ts]
- "flota_service_apirowtoflotavehiculo": "apiRowToFlotaVehiculo()" | kind=code-symbol | source=lib/flota/service.ts:L26 | neighbors=[service.ts]
- "flota_service_flotaapiresponse": "FlotaApiResponse" | kind=code-symbol | source=lib/flota/service.ts:L8 | neighbors=[service.ts]
- "flota_service_invalidarcache": "invalidarCache()" | kind=code-symbol | source=lib/flota/service.ts:L86 | neighbors=[service.ts]
- "formato_n_armas_aseguradas_page_formatonarmasaseguradaspage": "FormatoNArmasAseguradasPage()" | kind=code-symbol | source=app/formato-n-armas-aseguradas/page.tsx:L12 | neighbors=[page.tsx]
- "formato_n_armas_aseguradas_page_td": "Td()" | kind=code-symbol | source=app/formato-n-armas-aseguradas/page.tsx:L76 | neighbors=[page.tsx]
- "formato_n_armas_aseguradas_page_th": "Th()" | kind=code-symbol | source=app/formato-n-armas-aseguradas/page.tsx:L72 | neighbors=[page.tsx]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-064.json

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
