# Node Description Batch 61 of 86

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

- "components_pagoinfraccion_pagoinfraccion": "PagoInfraccion()" | kind=code-symbol | source=features/via/infracciones/components/PagoInfraccion.tsx:L16 | neighbors=[PagoInfraccion.tsx]
- "components_pagoinfraccion_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/PagoInfraccion.tsx:L7 | neighbors=[PagoInfraccion.tsx]
- "components_revisiondocumentossection_doc_icons": "DOC_ICONS" | kind=code-symbol | source=features/liberaciones/components/RevisionDocumentosSection.tsx:L22 | neighbors=[RevisionDocumentosSection.tsx]
- "components_revisiondocumentossection_doc_labels": "DOC_LABELS" | kind=code-symbol | source=features/liberaciones/components/RevisionDocumentosSection.tsx:L34 | neighbors=[RevisionDocumentosSection.tsx]
- "components_revisiondocumentossection_documento": "Documento" | kind=code-symbol | source=features/liberaciones/components/RevisionDocumentosSection.tsx:L14 | neighbors=[RevisionDocumentosSection.tsx]
- "components_revisiondocumentossection_revisiondocumentossection": "RevisionDocumentosSection()" | kind=code-symbol | source=features/liberaciones/components/RevisionDocumentosSection.tsx:L46 | neighbors=[RevisionDocumentosSection.tsx]
- "components_seccionliberacion_docconfig": "DocConfig" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L24 | neighbors=[SeccionLiberacion.tsx]
- "components_seccionliberacion_docs_accidente": "DOCS_ACCIDENTE" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L52 | neighbors=[SeccionLiberacion.tsx]
- "components_seccionliberacion_docs_delito": "DOCS_DELITO" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L47 | neighbors=[SeccionLiberacion.tsx]
- "components_seccionliberacion_docs_empresa": "DOCS_EMPRESA" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L33 | neighbors=[SeccionLiberacion.tsx]
- "components_seccionliberacion_docs_infraccion": "DOCS_INFRACCION" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L40 | neighbors=[SeccionLiberacion.tsx]
- "components_seccionliberacion_docuploadrow": "DocUploadRow()" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L941 | neighbors=[SeccionLiberacion.tsx]
- "components_seccionliberacion_infoitem2": "InfoItem2()" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L1015 | neighbors=[SeccionLiberacion.tsx]
- "components_seccionliberacion_motivo_to_subtipo": "MOTIVO_TO_SUBTIPO" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L63 | neighbors=[SeccionLiberacion.tsx]
- "components_seccionliberacion_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L70 | neighbors=[SeccionLiberacion.tsx]
- "components_seccionliberacion_subtipos_titular": "SUBTIPOS_TITULAR" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L57 | neighbors=[SeccionLiberacion.tsx]
- "components_seccionliberacion_subtipotitular": "SubtipoTitular" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L31 | neighbors=[SeccionLiberacion.tsx]
- "configuracion_page_configuracionperfilpage": "ConfiguracionPerfilPage()" | kind=code-symbol | source=app/oficial/configuracion/page.tsx:L11 | neighbors=[page.tsx]
- "consolidar_page_arma": "Arma" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L64 | neighbors=[page.tsx]
- "consolidar_page_cardstyle": "cardStyle" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L84 | neighbors=[page.tsx]
- "consolidar_page_consolidado": "Consolidado" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L73 | neighbors=[page.tsx]
- "consolidar_page_consolidarformatonpage": "ConsolidarFormatoNPage()" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L98 | neighbors=[page.tsx]
- "consolidar_page_diaconsolidado": "DiaConsolidado()" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L178 | neighbors=[page.tsx]
- "consolidar_page_evento": "Evento" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L11 | neighbors=[page.tsx]
- "consolidar_page_fge": "Fge" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L35 | neighbors=[page.tsx]
- "consolidar_page_fgr": "Fgr" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L36 | neighbors=[page.tsx]
- "consolidar_page_linkbtn": "linkBtn" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L403 | neighbors=[page.tsx]
- "consolidar_page_medios": "Medios" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L46 | neighbors=[page.tsx]
- "consolidar_page_metric": "Metric()" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L408 | neighbors=[page.tsx]
- "consolidar_page_periodo": "Periodo" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L9 | neighbors=[page.tsx]
- "consolidar_page_periodometricas": "PeriodoMetricas" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L21 | neighbors=[page.tsx]
- "consolidar_page_periodometricasblocks": "PeriodoMetricasBlocks()" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L417 | neighbors=[page.tsx]
- "consolidar_page_rnd": "Rnd" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L38 | neighbors=[page.tsx]
- "consolidar_page_tagcapturado": "tagCapturado" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L88 | neighbors=[page.tsx]
- "consolidar_page_tagsincapturar": "tagSinCapturar" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L93 | neighbors=[page.tsx]
- "consolidar_page_tdstyle": "tdStyle" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L401 | neighbors=[page.tsx]
- "consolidar_page_thstyle": "thStyle" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L400 | neighbors=[page.tsx]
- "consolidar_page_victimas": "Victimas" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L54 | neighbors=[page.tsx]
- "contestacion_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/contestacion/route.ts:L7 | neighbors=[route.ts]
- "corralon_actions_tabsolicitudes": "TabSolicitudes" | kind=code-symbol | source=lib/corralon/actions.ts:L26 | neighbors=[actions.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-060.json

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
