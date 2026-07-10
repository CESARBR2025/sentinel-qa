# Node Description Batch 40 of 82

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
- "guardar_docs_route_validararchivo": "validarArchivo()" | kind=code-symbol | source=app/api/via/exp-digital/guardar-docs/route.ts:L39 | neighbors=[route.ts, POST()]
- "health_repository_ping": "ping()" | kind=code-symbol | source=lib/health/repository.ts:L3 | neighbors=[repository.ts, route.ts]
- "hooks_useanalistaform_usedetenidoform": "useDetenidoForm()" | kind=code-symbol | source=hooks/useAnalistaForm.ts:L4 | neighbors=[formAnalisis.tsx, useAnalistaForm.ts]
- "hooks_usedespacho_usedespacho": "useDespacho()" | kind=code-symbol | source=hooks/useDespacho.ts:L33 | neighbors=[TablonDespacho.tsx, useDespacho.ts]
- "hooks_useflota_useflota": "useFlota()" | kind=code-symbol | source=hooks/useFlota.ts:L13 | neighbors=[DespachoForm.tsx, useFlota.ts]
- "hooks_usepolling_usepolling": "usePolling()" | kind=code-symbol | source=hooks/usePolling.ts:L4 | neighbors=[TablonDespacho.tsx, usePolling.ts]
- "hooks_useregistrodetenido_useregistrodetenido": "useRegistroDetenido()" | kind=code-symbol | source=hooks/useRegistroDetenido.ts:L4 | neighbors=[generarPresentacion.tsx, useRegistroDetenido.ts]
- "id_page_btnprimario": "btnPrimario()" | kind=code-symbol | source=app/monitorista/incidentes-camara/[id]/page.tsx:L159 | neighbors=[page.tsx, EditarIncidenteCamaraPage()]
- "id_page_detalleciudadanocompletopage": "DetalleCiudadanoCompletoPage()" | kind=code-symbol | source=app/agente_911/ciudadano/incidentes/[id]/page.tsx:L12 | neighbors=[page.tsx, getStatusBadgeStyle()]
- "id_page_detallerondincompletopage": "DetalleRondinCompletoPage()" | kind=code-symbol | source=app/agente_911/rondin/incidentes/[id]/page.tsx:L15 | neighbors=[page.tsx, getStatusBadgeStyle()]
- "id_page_detallesolicitudpage": "DetalleSolicitudPage()" | kind=code-symbol | source=app/monitorista/solicitudes/[id]/page.tsx:L12 | neighbors=[page.tsx, getStatusBadge()]
- "id_page_detallewhatsapppage": "DetalleWhatsAppPage()" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L15 | neighbors=[page.tsx, getStatusBadgeStyle()]
- "id_page_editarincidentecamarapage": "EditarIncidenteCamaraPage()" | kind=code-symbol | source=app/monitorista/incidentes-camara/[id]/page.tsx:L30 | neighbors=[page.tsx, btnPrimario()]
- "id_page_estadobadge": "estadoBadge()" | kind=code-symbol | source=app/monitorista/denuncias/[id]/page.tsx:L243 | neighbors=[page.tsx, DetalleDenunciaPage()]
- "id_page_getstatusbadge": "getStatusBadge()" | kind=code-symbol | source=app/monitorista/solicitudes/[id]/page.tsx:L107 | neighbors=[page.tsx, DetalleSolicitudPage()]
- "id_page_getstatusstyle": "getStatusStyle()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L58 | neighbors=[page.tsx, InfraccionCiudadanoPage()]
- "id_page_sanitize": "sanitize()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L53 | neighbors=[page.tsx, InfraccionCiudadanoPage()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-039.json

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
