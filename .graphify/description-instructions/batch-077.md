# Node Description Batch 78 of 79

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

- "steps_pasopago_pasopagoprops": "PasoPagoProps" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoPago.tsx:L24 | neighbors=[PasoPago.tsx]
- "steps_pasoubicacion_pasoubicacion": "PasoUbicacion()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacion.tsx:L12 | neighbors=[PasoUbicacion.tsx]
- "steps_pasoubicacion_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacion.tsx:L8 | neighbors=[PasoUbicacion.tsx]
- "steps_pasoubicacionevidencias_pasoubicacionevidencias": "PasoUbicacionEvidencias()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacionEvidencias.tsx:L10 | neighbors=[PasoUbicacionEvidencias.tsx]
- "steps_pasoubicacionevidencias_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacionEvidencias.tsx:L5 | neighbors=[PasoUbicacionEvidencias.tsx]
- "steps_pasovehiculo_colores": "COLORES" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoVehiculo.tsx:L46 | neighbors=[PasoVehiculo.tsx]
- "steps_pasovehiculo_estados_mexico": "ESTADOS_MEXICO" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoVehiculo.tsx:L11 | neighbors=[PasoVehiculo.tsx]
- "steps_pasovehiculo_marcas": "MARCAS" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoVehiculo.tsx:L70 | neighbors=[PasoVehiculo.tsx]
- "steps_pasovehiculo_modelos_por_marca": "MODELOS_POR_MARCA" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoVehiculo.tsx:L136 | neighbors=[PasoVehiculo.tsx]
- "steps_pasovehiculo_pasovehiculo": "PasoVehiculo()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoVehiculo.tsx:L856 | neighbors=[PasoVehiculo.tsx]
- "steps_pasovehiculo_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoVehiculo.tsx:L848 | neighbors=[PasoVehiculo.tsx]
- "steps_procesomodal_config": "config" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L10 | neighbors=[ProcesoModal.tsx]
- "steps_procesomodal_procesomodalprops": "ProcesoModalProps" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L4 | neighbors=[ProcesoModal.tsx]
- "steps_procesomodal_steps": "STEPS" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L68 | neighbors=[ProcesoModal.tsx]
- "steps_secciongarantia_mapa_garantias": "MAPA_GARANTIAS" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionGarantia.tsx:L17 | neighbors=[SeccionGarantia.tsx]
- "steps_secciongarantia_secciongarantiaprops": "SeccionGarantiaProps" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionGarantia.tsx:L10 | neighbors=[SeccionGarantia.tsx]
- "steps_seccionmotivo_articulo": "Articulo" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionMotivo.tsx:L20 | neighbors=[SeccionMotivo.tsx]
- "steps_seccionmotivo_fraccion": "Fraccion" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionMotivo.tsx:L12 | neighbors=[SeccionMotivo.tsx]
- "steps_seccionmotivo_seccionmotivoprops": "SeccionMotivoProps" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionMotivo.tsx:L26 | neighbors=[SeccionMotivo.tsx]
- "stores_useinfraccionstore_datosiniciales": "datosIniciales" | kind=code-symbol | source=stores/useInfraccionStore.ts:L54 | neighbors=[useInfraccionStore.ts]
- "stores_useinfraccionstore_infraccionstore": "InfraccionStore" | kind=code-symbol | source=stores/useInfraccionStore.ts:L105 | neighbors=[useInfraccionStore.ts]
- "stores_usetoaststore_generateid": "generateId()" | kind=code-symbol | source=stores/useToastStore.ts:L19 | neighbors=[useToastStore.ts]
- "stores_usetoaststore_toast": "Toast" | kind=code-symbol | source=stores/useToastStore.ts:L7 | neighbors=[useToastStore.ts]
- "stores_usetoaststore_toaststore": "ToastStore" | kind=code-symbol | source=stores/useToastStore.ts:L13 | neighbors=[useToastStore.ts]
- "stores_usetoaststore_toasttype": "ToastType" | kind=code-symbol | source=stores/useToastStore.ts:L5 | neighbors=[useToastStore.ts]
- "subir_foto_detenido_route_post": "POST()" | kind=code-symbol | source=app/api/expediente/subir-foto-detenido/route.ts:L8 | neighbors=[route.ts]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-077.json

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
