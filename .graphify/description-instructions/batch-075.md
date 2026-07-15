# Node Description Batch 76 of 89

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

- "monitorista_bandejasolicitudes_btnsuccess": "btnSuccess" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L148 | neighbors=[BandejaSolicitudes.tsx]
- "monitorista_bandejasolicitudes_origenbadge": "origenBadge" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L160 | neighbors=[BandejaSolicitudes.tsx]
- "monitorista_bandejasolicitudes_solicitudrow": "SolicitudRow" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L11 | neighbors=[BandejaSolicitudes.tsx]
- "monitorista_bandejasolicitudes_statusbadge": "statusBadge()" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L166 | neighbors=[BandejaSolicitudes.tsx]
- "monitorista_botongenerarppt_inputstyle": "inputStyle" | kind=code-symbol | source=components/monitorista/BotonGenerarPpt.tsx:L135 | neighbors=[BotonGenerarPpt.tsx]
- "monitorista_botongenerarppt_label": "Label()" | kind=code-symbol | source=components/monitorista/BotonGenerarPpt.tsx:L131 | neighbors=[BotonGenerarPpt.tsx]
- "monitorista_buscadorevento_opciones": "OPCIONES" | kind=code-symbol | source=components/monitorista/BuscadorEvento.tsx:L6 | neighbors=[BuscadorEvento.tsx]
- "monitorista_cardenviofoto_etiquetas": "ETIQUETAS" | kind=code-symbol | source=components/monitorista/CardEnvioFoto.tsx:L10 | neighbors=[CardEnvioFoto.tsx]
- "monitorista_filaincidentecamara_td": "Td()" | kind=code-symbol | source=components/monitorista/FilaIncidenteCamara.tsx:L61 | neighbors=[FilaIncidenteCamara.tsx]
- "monitorista_galeriaevidencias_cardstyle": "cardStyle" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L98 | neighbors=[GaleriaEvidencias.tsx]
- "monitorista_galeriaevidencias_evidenciarow": "EvidenciaRow" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L6 | neighbors=[GaleriaEvidencias.tsx]
- "monitorista_galeriaevidencias_itemstyle": "itemStyle" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L107 | neighbors=[GaleriaEvidencias.tsx]
- "monitorista_galeriaevidencias_sectiontitle": "sectionTitle" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L102 | neighbors=[GaleriaEvidencias.tsx]
- "monitorista_layout_monitoristalayout": "MonitoristaLayout()" | kind=code-symbol | source=app/monitorista/layout.tsx:L6 | neighbors=[layout.tsx]
- "monitorista_mapper_bool": "bool()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L19 | neighbors=[mapper.ts]
- "monitorista_mapper_str": "str()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L8 | neighbors=[mapper.ts]
- "monitorista_page_cardstyle": "cardStyle" | kind=code-symbol | source=app/monitorista/page.tsx:L110 | neighbors=[page.tsx]
- "monitorista_page_monitoristahubpage": "MonitoristaHubPage()" | kind=code-symbol | source=app/monitorista/page.tsx:L12 | neighbors=[page.tsx]
- "monitorista_page_onlinestyle": "onlineStyle" | kind=code-symbol | source=app/monitorista/page.tsx:L111 | neighbors=[page.tsx]
- "monitorista_permisos_accion": "Accion" | kind=code-symbol | source=lib/monitorista/permisos.ts:L5 | neighbors=[permisos.ts]
- "monitorista_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/monitorista/permisos.ts:L17 | neighbors=[permisos.ts]
- "monitorista_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/monitorista/permisos.ts:L27 | neighbors=[permisos.ts]
- "monitorista_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/monitorista/permisos.ts:L21 | neighbors=[permisos.ts]
- "monitorista_permisos_permisorow": "PermisoRow" | kind=code-symbol | source=lib/monitorista/permisos.ts:L7 | neighbors=[permisos.ts]
- "monitorista_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/monitorista/permisos.ts:L6 | neighbors=[permisos.ts]
- "monitorista_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/monitorista/permisos.ts:L4 | neighbors=[permisos.ts]
- "monitorista_ppt_service_descargarfoto": "descargarFoto()" | kind=code-symbol | source=lib/monitorista/ppt-service.ts:L22 | neighbors=[ppt-service.ts]
- "monitorista_ppt_service_normalizarurl": "normalizarUrl()" | kind=code-symbol | source=lib/monitorista/ppt-service.ts:L16 | neighbors=[ppt-service.ts]
- "monitorista_repository_rechazarfoto": "rechazarFoto()" | kind=code-symbol | source=lib/monitorista/repository.ts:L609 | neighbors=[repository.ts]
- "monitorista_subirevidenciamodal_btncancel": "btnCancel" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L252 | neighbors=[SubirEvidenciaModal.tsx]
- "monitorista_subirevidenciamodal_compressimage": "compressImage()" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L8 | neighbors=[SubirEvidenciaModal.tsx]
- "monitorista_subirevidenciamodal_limites": "LIMITES" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L45 | neighbors=[SubirEvidenciaModal.tsx]
- "monitorista_subirevidenciamodal_modal": "modal" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L247 | neighbors=[SubirEvidenciaModal.tsx]
- "monitorista_subirevidenciamodal_overlay": "overlay" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L242 | neighbors=[SubirEvidenciaModal.tsx]
- "monitorista_subirfotodetenido_compressimage": "compressImage()" | kind=code-symbol | source=components/monitorista/SubirFotoDetenido.tsx:L8 | neighbors=[SubirFotoDetenido.tsx]
- "monitorista_tabladetenidos_btndetalle": "btnDetalle" | kind=code-symbol | source=components/monitorista/TablaDetenidos.tsx:L104 | neighbors=[TablaDetenidos.tsx]
- "monitorista_tabladetenidos_detenidorow": "DetenidoRow" | kind=code-symbol | source=components/monitorista/TablaDetenidos.tsx:L14 | neighbors=[TablaDetenidos.tsx]
- "monitorista_tabladetenidos_fotobadge": "fotoBadge()" | kind=code-symbol | source=components/monitorista/TablaDetenidos.tsx:L111 | neighbors=[TablaDetenidos.tsx]
- "monitorista_tabladetenidos_fotoinfo": "FotoInfo" | kind=code-symbol | source=components/monitorista/TablaDetenidos.tsx:L8 | neighbors=[TablaDetenidos.tsx]
- "monitorista_types_fichainteligenciadata": "FichaInteligenciaData" | kind=code-symbol | source=lib/monitorista/types.ts:L172 | neighbors=[types.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-075.json

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
