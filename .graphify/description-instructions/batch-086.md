# Node Description Batch 87 of 89

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

- "sin_robos_paginacionsinrobos_paginationbuttonstyle": "paginationButtonStyle" | kind=code-symbol | source=components/reportes/sin_robos/PaginacionSinRobos.tsx:L89 | neighbors=[PaginacionSinRobos.tsx]
- "sin_robos_paginacionsinrobos_paginationprops": "PaginationProps" | kind=code-symbol | source=components/reportes/sin_robos/PaginacionSinRobos.tsx:L5 | neighbors=[PaginacionSinRobos.tsx]
- "solicitudes_page_solicitudespage": "SolicitudesPage()" | kind=code-symbol | source=app/monitorista/solicitudes/page.tsx:L13 | neighbors=[page.tsx]
- "solicitudes_page_statcard": "StatCard()" | kind=code-symbol | source=app/monitorista/solicitudes/page.tsx:L86 | neighbors=[page.tsx]
- "solicitudes_route_get": "GET()" | kind=code-symbol | source=app/api/prevencion/solicitudes/route.ts:L8 | neighbors=[route.ts]
- "solicitudes_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/solicitudes/route.ts:L22 | neighbors=[route.ts]
- "solicitudes_solicitudes_client_estatusbg": "estatusBg()" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L344 | neighbors=[solicitudes-client.tsx]
- "solicitudes_solicitudes_client_estatuscolor": "estatusColor()" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L351 | neighbors=[solicitudes-client.tsx]
- "solicitudes_solicitudes_client_estatuslabels": "estatusLabels" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L8 | neighbors=[solicitudes-client.tsx]
- "solicitudes_solicitudes_client_formatdate": "formatDate()" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L18 | neighbors=[solicitudes-client.tsx]
- "solicitudes_solicitudes_client_tdstyle": "tdStyle" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L369 | neighbors=[solicitudes-client.tsx]
- "solicitudes_solicitudes_client_thstyle": "thStyle" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L358 | neighbors=[solicitudes-client.tsx]
- "solicitudes_subir_oficio_modal_props": "Props" | kind=code-symbol | source=app/corralon/solicitudes/subir-oficio-modal.tsx:L6 | neighbors=[subir-oficio-modal.tsx]
- "solicitudes_ver_documento_modal_props": "Props" | kind=code-symbol | source=app/corralon/solicitudes/ver-documento-modal.tsx:L5 | neighbors=[ver-documento-modal.tsx]
- "solicitudid_page_aseguradosfiscaliapage": "AseguradosFiscaliaPage()" | kind=code-symbol | source=app/fiscalia/solicitudes/[solicitudId]/page.tsx:L11 | neighbors=[page.tsx]
- "solicitudid_page_aseguradospage": "AseguradosPage()" | kind=code-symbol | source=app/agente_juzgado/solicitudes/[solicitudId]/page.tsx:L11 | neighbors=[page.tsx]
- "steps_pasociudadano_pasociudadano": "PasoCiudadano()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadano.tsx:L16 | neighbors=[PasoCiudadano.tsx]
- "steps_pasociudadano_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadano.tsx:L11 | neighbors=[PasoCiudadano.tsx]
- "steps_pasociudadanoconductor_pasociudadanoconductor": "PasoCiudadanoConductor()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadanoConductor.tsx:L14 | neighbors=[PasoCiudadanoConductor.tsx]
- "steps_pasociudadanoconductor_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadanoConductor.tsx:L6 | neighbors=[PasoCiudadanoConductor.tsx]
- "steps_pasoconductor_pasoconductor": "PasoConductor()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConductor.tsx:L21 | neighbors=[PasoConductor.tsx]
- "steps_pasoconductor_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConductor.tsx:L13 | neighbors=[PasoConductor.tsx]
- "steps_pasoconfirmacion_pasoconfirmacion": "PasoConfirmacion()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacion.tsx:L27 | neighbors=[PasoConfirmacion.tsx]
- "steps_pasoconfirmacion_pasoconfirmacionprops": "PasoConfirmacionProps" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacion.tsx:L15 | neighbors=[PasoConfirmacion.tsx]
- "steps_pasoconfirmacion_seccionestructurada": "SeccionEstructurada" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacion.tsx:L20 | neighbors=[PasoConfirmacion.tsx]
- "steps_pasoconfirmacionpago_pasoconfirmacionpago": "PasoConfirmacionPago()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacionPago.tsx:L8 | neighbors=[PasoConfirmacionPago.tsx]
- "steps_pasoconfirmacionpago_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacionPago.tsx:L3 | neighbors=[PasoConfirmacionPago.tsx]
- "steps_pasodescuentos_archivofield": "ArchivoField" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoDescuentos.tsx:L27 | neighbors=[PasoDescuentos.tsx]
- "steps_pasodescuentos_fileuploadzone": "FileUploadZone()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoDescuentos.tsx:L196 | neighbors=[PasoDescuentos.tsx]
- "steps_pasodescuentos_pasodecuentos": "PasoDecuentos()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoDescuentos.tsx:L32 | neighbors=[PasoDescuentos.tsx]
- "steps_pasodescuentos_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoDescuentos.tsx:L22 | neighbors=[PasoDescuentos.tsx]
- "steps_pasoevidencias_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoEvidencias.tsx:L8 | neighbors=[PasoEvidencias.tsx]
- "steps_pasoinfraccion_pasoinfraccion": "PasoInfraccion()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoInfraccion.tsx:L19 | neighbors=[PasoInfraccion.tsx]
- "steps_pasoinfraccion_pasoinfraccionprops": "PasoInfraccionProps" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoInfraccion.tsx:L9 | neighbors=[PasoInfraccion.tsx]
- "steps_pasopago_infraccioncreada": "InfraccionCreada" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoPago.tsx:L19 | neighbors=[PasoPago.tsx]
- "steps_pasopago_pasopago": "PasoPago()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoPago.tsx:L40 | neighbors=[PasoPago.tsx]
- "steps_pasopago_pasopagoprops": "PasoPagoProps" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoPago.tsx:L24 | neighbors=[PasoPago.tsx]
- "steps_pasoubicacion_pasoubicacion": "PasoUbicacion()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacion.tsx:L12 | neighbors=[PasoUbicacion.tsx]
- "steps_pasoubicacion_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacion.tsx:L8 | neighbors=[PasoUbicacion.tsx]
- "steps_pasoubicacionevidencias_pasoubicacionevidencias": "PasoUbicacionEvidencias()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacionEvidencias.tsx:L10 | neighbors=[PasoUbicacionEvidencias.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-086.json

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
