# Node Description Batch 56 of 82

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

- "agente_liberaciones_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/agente_liberaciones/permisos.ts:L4 | neighbors=[permisos.ts]
- "agente_liberaciones_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/agente_liberaciones/permisos.ts:L3 | neighbors=[permisos.ts]
- "agente_liberaciones_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/agente_liberaciones/permisos.ts:L8 | neighbors=[permisos.ts]
- "agente_liberaciones_profiledropdown_props": "Props" | kind=code-symbol | source=components/agente_liberaciones/ProfileDropdown.tsx:L8 | neighbors=[ProfileDropdown.tsx]
- "agente_liberaciones_repository_actualizarinfraccionestatus": "actualizarInfraccionEstatus()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L155 | neighbors=[repository.ts]
- "agente_liberaciones_repository_actualizarinfractor": "actualizarInfractor()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L39 | neighbors=[repository.ts]
- "agente_liberaciones_repository_actualizarrevisiondocumento": "actualizarRevisionDocumento()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L105 | neighbors=[repository.ts]
- "agente_liberaciones_repository_actualizarsolicitudestatus": "actualizarSolicitudEstatus()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L166 | neighbors=[repository.ts]
- "agente_liberaciones_repository_insertarordenpago": "insertarOrdenPago()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L175 | neighbors=[repository.ts]
- "agente_liberaciones_repository_obtenerconceptoporfraccion": "obtenerConceptoPorFraccion()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L68 | neighbors=[repository.ts]
- "agente_liberaciones_repository_obtenerdocumentosporsolicitud": "obtenerDocumentosPorSolicitud()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L91 | neighbors=[repository.ts]
- "agente_liberaciones_repository_obtenerestatusdocumentosporsolicitud": "obtenerEstatusDocumentosPorSolicitud()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L132 | neighbors=[repository.ts]
- "agente_liberaciones_repository_obtenerinfracciondetalleporid": "obtenerInfraccionDetallePorId()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L143 | neighbors=[repository.ts]
- "agente_liberaciones_repository_obtenersolicitudidporinfraccion": "obtenerSolicitudIdPorInfraccion()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L122 | neighbors=[repository.ts]
- "agente_liberaciones_repository_obtenersolicitudporinfraccion": "obtenerSolicitudPorInfraccion()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L81 | neighbors=[repository.ts]
- "agregar_page_agregarrolpage": "AgregarRolPage()" | kind=code-symbol | source=app/admin/roles/agregar/page.tsx:L9 | neighbors=[page.tsx]
- "alertas_route_get": "GET()" | kind=code-symbol | source=app/api/prevencion/busquedas/alertas/route.ts:L8 | neighbors=[route.ts]
- "all_route_get_post": "{ GET, POST }" | kind=code-symbol | source=app/api/auth/[...all]/route.ts:L4 | neighbors=[route.ts]
- "analisis_formanalisis_btnbackstyle": "btnBackStyle" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L804 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_btnfinishstyle": "btnFinishStyle" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L814 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_btngeostyle": "btnGeoStyle" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L809 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_btnnextstyle": "btnNextStyle" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L799 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_cardstyle": "cardStyle" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L794 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_footeractions": "footerActions" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L820 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_forceleveltoggle": "ForceLevelToggle()" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L44 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_grid3": "grid3" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L821 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_labelstyle": "labelStyle" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L796 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_linestyle": "lineStyle" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L797 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_registrodetenidostepper": "RegistroDetenidoStepper()" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L83 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_sentinelfield": "SentinelField()" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L15 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_stepindicator": "StepIndicator()" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L779 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_subcard": "subCard" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L827 | neighbors=[formAnalisis.tsx]
- "analisis_formanalisis_titlestyle": "titleStyle" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L795 | neighbors=[formAnalisis.tsx]
- "analisis_generarpresentacion_btnbackstyle": "btnBackStyle" | kind=code-symbol | source=components/analisis/generarPresentacion.tsx:L306 | neighbors=[generarPresentacion.tsx]
- "analisis_generarpresentacion_btnfinishstyle": "btnFinishStyle" | kind=code-symbol | source=components/analisis/generarPresentacion.tsx:L311 | neighbors=[generarPresentacion.tsx]
- "analisis_generarpresentacion_btnnextstyle": "btnNextStyle" | kind=code-symbol | source=components/analisis/generarPresentacion.tsx:L300 | neighbors=[generarPresentacion.tsx]
- "analisis_generarpresentacion_cardstyle": "cardStyle" | kind=code-symbol | source=components/analisis/generarPresentacion.tsx:L296 | neighbors=[generarPresentacion.tsx]
- "analisis_generarpresentacion_labelstyle": "labelStyle" | kind=code-symbol | source=components/analisis/generarPresentacion.tsx:L298 | neighbors=[generarPresentacion.tsx]
- "analisis_generarpresentacion_mapboxstyle": "mapBoxStyle" | kind=code-symbol | source=components/analisis/generarPresentacion.tsx:L305 | neighbors=[generarPresentacion.tsx]
- "analisis_generarpresentacion_registrodetenidoform": "RegistroDetenidoForm()" | kind=code-symbol | source=components/analisis/generarPresentacion.tsx:L13 | neighbors=[generarPresentacion.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-055.json

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
