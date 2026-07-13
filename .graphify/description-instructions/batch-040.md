# Node Description Batch 41 of 87

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

- "fiscalia_repository_obtenersolicitudesenproceso": "obtenerSolicitudesEnProceso()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L70 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudespendientes": "obtenerSolicitudesPendientes()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L25 | neighbors=[repository.ts, service.ts]
- "fiscalia_service_guardardetallesasegurado": "guardarDetallesAsegurado()" | kind=code-symbol | source=lib/fiscalia/service.ts:L67 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listaraseguradoscompletados": "listarAseguradosCompletados()" | kind=code-symbol | source=lib/fiscalia/service.ts:L83 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listaraseguradospendientes": "listarAseguradosPendientes()" | kind=code-symbol | source=lib/fiscalia/service.ts:L79 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudescompletadas": "listarSolicitudesCompletadas()" | kind=code-symbol | source=lib/fiscalia/service.ts:L54 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudesconmonitorista": "listarSolicitudesConMonitorista()" | kind=code-symbol | source=lib/fiscalia/service.ts:L49 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudesenproceso": "listarSolicitudesEnProceso()" | kind=code-symbol | source=lib/fiscalia/service.ts:L40 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudespendientes": "listarSolicitudesPendientes()" | kind=code-symbol | source=lib/fiscalia/service.ts:L35 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_obtenerliberaciones": "obtenerLiberaciones()" | kind=code-symbol | source=lib/fiscalia/service.ts:L143 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_parsedetenidos": "parseDetenidos()" | kind=code-symbol | source=lib/fiscalia/service.ts:L71 | neighbors=[service.ts, obtenerDetalleAseguradoCompletoService()]
- "fiscalia_service_pedirevidencias": "pedirEvidencias()" | kind=code-symbol | source=lib/fiscalia/service.ts:L59 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_tomarcaso": "tomarCaso()" | kind=code-symbol | source=lib/fiscalia/service.ts:L45 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_verificarroljuzgado": "verificarRolJuzgado()" | kind=code-symbol | source=lib/fiscalia/service.ts:L30 | neighbors=[actions.ts, service.ts]
- "fiscalia_subirfotodetenido_subirfotodetenido": "SubirFotoDetenido()" | kind=code-symbol | source=components/fiscalia/SubirFotoDetenido.tsx:L33 | neighbors=[SubirFotoDetenido.tsx, page.tsx]
- "fiscalia_tabasegurados_tabasegurados": "TabAsegurados()" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L45 | neighbors=[page.tsx, TabAsegurados.tsx]
- "fiscalia_tabsolicitudes_tabsolicitudes": "TabSolicitudes()" | kind=code-symbol | source=components/fiscalia/TabSolicitudes.tsx:L25 | neighbors=[TabSolicitudes.tsx, page.tsx]
- "fiscalia_toastexito_toastexito": "ToastExito()" | kind=code-symbol | source=components/fiscalia/ToastExito.tsx:L6 | neighbors=[page.tsx, ToastExito.tsx]
- "fiscalia_tomarcasomodal_tomarcasoboton": "TomarCasoBoton()" | kind=code-symbol | source=components/fiscalia/TomarCasoModal.tsx:L6 | neighbors=[TabSolicitudes.tsx, TomarCasoModal.tsx]
- "fiscalia_types_detallecompleto": "DetalleCompleto" | kind=code-symbol | source=lib/fiscalia/types.ts:L352 | neighbors=[FiscaliaDashboard.tsx, types.ts]
- "fiscalia_types_rolrow": "RolRow" | kind=code-symbol | source=lib/fiscalia/types.ts:L7 | neighbors=[repository.ts, types.ts]
- "fiscalia_types_userinfo": "UserInfo" | kind=code-symbol | source=lib/fiscalia/types.ts:L1 | neighbors=[actions.ts, types.ts]
- "fiscalia_usetoaststore_usetoaststore": "useToastStore" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L21 | neighbors=[CargarOficioSection.tsx, useToastStore.ts]
- "flota_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/flota/mapper.ts:L8 | neighbors=[mapper.ts, rowToPatrulla()]
- "flota_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/flota/mapper.ts:L3 | neighbors=[mapper.ts, rowToPatrulla()]
- "flota_repository_estastale": "estaStale()" | kind=code-symbol | source=lib/flota/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "flota_repository_listaractivas": "listarActivas()" | kind=code-symbol | source=lib/flota/repository.ts:L41 | neighbors=[repository.ts, service.ts]
- "flota_repository_obtenerporid": "obtenerPorId()" | kind=code-symbol | source=lib/flota/repository.ts:L51 | neighbors=[repository.ts, service.ts]
- "flota_repository_upsertpatrullas": "upsertPatrullas()" | kind=code-symbol | source=lib/flota/repository.ts:L16 | neighbors=[repository.ts, service.ts]
- "flota_service_extraervehiculos": "extraerVehiculos()" | kind=code-symbol | source=lib/flota/service.ts:L15 | neighbors=[service.ts, obtenerFlota()]
- "flota_service_obtenerpatrullaporid": "obtenerPatrullaPorId()" | kind=code-symbol | source=lib/flota/service.ts:L111 | neighbors=[page.tsx, service.ts]
- "formato_n_atencion_victimas_page_filtrobtn": "filtroBtn()" | kind=code-symbol | source=app/formato-n-atencion-victimas/page.tsx:L102 | neighbors=[page.tsx, FormatoNAtencionVictimasPage()]
- "formato_n_atencion_victimas_page_formatonatencionvictimaspage": "FormatoNAtencionVictimasPage()" | kind=code-symbol | source=app/formato-n-atencion-victimas/page.tsx:L12 | neighbors=[page.tsx, filtroBtn()]
- "formato_n_fge_page_filtrobtn": "filtroBtn()" | kind=code-symbol | source=app/formato-n-fge/page.tsx:L112 | neighbors=[page.tsx, FormatoNFgePage()]
- "formato_n_fge_page_formatonfgepage": "FormatoNFgePage()" | kind=code-symbol | source=app/formato-n-fge/page.tsx:L12 | neighbors=[page.tsx, filtroBtn()]
- "formato_n_fgr_page_filtrobtn": "filtroBtn()" | kind=code-symbol | source=app/formato-n-fgr/page.tsx:L112 | neighbors=[page.tsx, FormatoNFgrPage()]
- "formato_n_fgr_page_formatonfgrpage": "FormatoNFgrPage()" | kind=code-symbol | source=app/formato-n-fgr/page.tsx:L12 | neighbors=[page.tsx, filtroBtn()]
- "formato_n_medios_alternativos_page_filtrobtn": "filtroBtn()" | kind=code-symbol | source=app/formato-n-medios-alternativos/page.tsx:L100 | neighbors=[page.tsx, FormatoNMediosAlternativosPage()]
- "formato_n_medios_alternativos_page_formatonmediosalternativospage": "FormatoNMediosAlternativosPage()" | kind=code-symbol | source=app/formato-n-medios-alternativos/page.tsx:L12 | neighbors=[page.tsx, filtroBtn()]
- "guardar_docs_route_subirarchivo": "subirArchivo()" | kind=code-symbol | source=app/api/via/exp-digital/guardar-docs/route.ts:L7 | neighbors=[route.ts, POST()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-040.json

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
