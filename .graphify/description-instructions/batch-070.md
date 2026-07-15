# Node Description Batch 71 of 93

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

- "fiscalia_mapper_str": "str()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L3 | neighbors=[mapper.ts]
- "fiscalia_page_fiscaliadashboardpage": "FiscaliaDashboardPage()" | kind=code-symbol | source=app/fiscalia/page.tsx:L11 | neighbors=[page.tsx]
- "fiscalia_permisos_accion": "Accion" | kind=code-symbol | source=lib/fiscalia/permisos.ts:L5 | neighbors=[permisos.ts]
- "fiscalia_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/fiscalia/permisos.ts:L12 | neighbors=[permisos.ts]
- "fiscalia_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/fiscalia/permisos.ts:L20 | neighbors=[permisos.ts]
- "fiscalia_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/fiscalia/permisos.ts:L16 | neighbors=[permisos.ts]
- "fiscalia_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/fiscalia/permisos.ts:L6 | neighbors=[permisos.ts]
- "fiscalia_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/fiscalia/permisos.ts:L4 | neighbors=[permisos.ts]
- "fiscalia_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/fiscalia/permisos.ts:L3 | neighbors=[permisos.ts]
- "fiscalia_profiledropdown_props": "Props" | kind=code-symbol | source=components/fiscalia/ProfileDropdown.tsx:L8 | neighbors=[ProfileDropdown.tsx]
- "fiscalia_service_obtenerdetalleinfraccionviaservice": "obtenerDetalleInfraccionViaService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L146 | neighbors=[service.ts]
- "fiscalia_subirfotodetenido_compressimage": "compressImage()" | kind=code-symbol | source=components/fiscalia/SubirFotoDetenido.tsx:L6 | neighbors=[SubirFotoDetenido.tsx]
- "fiscalia_tabasegurados_props": "Props" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L8 | neighbors=[TabAsegurados.tsx]
- "fiscalia_tabasegurados_tabbase": "tabBase" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L14 | neighbors=[TabAsegurados.tsx]
- "fiscalia_tabasegurados_tdsx": "tdSx" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L37 | neighbors=[TabAsegurados.tsx]
- "fiscalia_tabasegurados_thsx": "thSx" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L25 | neighbors=[TabAsegurados.tsx]
- "fiscalia_tabsolicitudes_props": "Props" | kind=code-symbol | source=components/fiscalia/TabSolicitudes.tsx:L10 | neighbors=[TabSolicitudes.tsx]
- "fiscalia_tabsolicitudes_tab": "Tab" | kind=code-symbol | source=components/fiscalia/TabSolicitudes.tsx:L17 | neighbors=[TabSolicitudes.tsx]
- "fiscalia_tabsolicitudes_tabs": "tabs" | kind=code-symbol | source=components/fiscalia/TabSolicitudes.tsx:L19 | neighbors=[TabSolicitudes.tsx]
- "fiscalia_types_aseguradocondisposicion": "AseguradoConDisposicion" | kind=code-symbol | source=lib/fiscalia/types.ts:L121 | neighbors=[types.ts]
- "fiscalia_types_detallegarantia": "DetalleGarantia" | kind=code-symbol | source=lib/fiscalia/types.ts:L425 | neighbors=[types.ts]
- "fiscalia_types_detalleheader": "DetalleHeader" | kind=code-symbol | source=lib/fiscalia/types.ts:L379 | neighbors=[types.ts]
- "fiscalia_types_detalleinfraccion": "DetalleInfraccion" | kind=code-symbol | source=lib/fiscalia/types.ts:L399 | neighbors=[types.ts]
- "fiscalia_types_detalleinfractor": "DetalleInfractor" | kind=code-symbol | source=lib/fiscalia/types.ts:L406 | neighbors=[types.ts]
- "fiscalia_types_detalleubicacion": "DetalleUbicacion" | kind=code-symbol | source=lib/fiscalia/types.ts:L429 | neighbors=[types.ts]
- "fiscalia_types_detallevehiculo": "DetalleVehiculo" | kind=code-symbol | source=lib/fiscalia/types.ts:L416 | neighbors=[types.ts]
- "fiscalia_types_detenidobase": "DetenidoBase" | kind=code-symbol | source=lib/fiscalia/types.ts:L39 | neighbors=[types.ts]
- "fiscalia_types_detenidonombre": "DetenidoNombre" | kind=code-symbol | source=lib/fiscalia/types.ts:L125 | neighbors=[types.ts]
- "fiscalia_types_expedientecompleto": "ExpedienteCompleto" | kind=code-symbol | source=lib/fiscalia/types.ts:L182 | neighbors=[types.ts]
- "fiscalia_types_fotodetenido": "FotoDetenido" | kind=code-symbol | source=lib/fiscalia/types.ts:L168 | neighbors=[types.ts]
- "fiscalia_types_viainfracciongarantia": "ViaInfraccionGarantia" | kind=code-symbol | source=lib/fiscalia/types.ts:L354 | neighbors=[types.ts]
- "fiscalia_types_viainfraccionheader": "ViaInfraccionHeader" | kind=code-symbol | source=lib/fiscalia/types.ts:L305 | neighbors=[types.ts]
- "fiscalia_types_viainfraccioninfractor": "ViaInfraccionInfractor" | kind=code-symbol | source=lib/fiscalia/types.ts:L330 | neighbors=[types.ts]
- "fiscalia_types_viainfraccionlegal": "ViaInfraccionLegal" | kind=code-symbol | source=lib/fiscalia/types.ts:L320 | neighbors=[types.ts]
- "fiscalia_types_viainfraccionoficial": "ViaInfraccionOficial" | kind=code-symbol | source=lib/fiscalia/types.ts:L338 | neighbors=[types.ts]
- "fiscalia_types_viainfraccionubicacion": "ViaInfraccionUbicacion" | kind=code-symbol | source=lib/fiscalia/types.ts:L358 | neighbors=[types.ts]
- "fiscalia_types_viainfraccionvehiculo": "ViaInfraccionVehiculo" | kind=code-symbol | source=lib/fiscalia/types.ts:L345 | neighbors=[types.ts]
- "fiscalia_usetoaststore_generateid": "generateId()" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L19 | neighbors=[useToastStore.ts]
- "fiscalia_usetoaststore_toast": "Toast" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L7 | neighbors=[useToastStore.ts]
- "fiscalia_usetoaststore_toaststore": "ToastStore" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L13 | neighbors=[useToastStore.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-070.json

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
