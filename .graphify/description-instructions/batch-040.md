# Node Description Batch 41 of 84

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
- "id_page_solicituddetailpage": "SolicitudDetailPage()" | kind=code-symbol | source=app/prevencion/juridico/solicitudes/[id]/page.tsx:L21 | neighbors=[page.tsx, fmtDT()]
- "id_page_statusbadge": "statusBadge()" | kind=code-symbol | source=app/monitorista/denuncias/[id]/page.tsx:L235 | neighbors=[page.tsx, DetalleDenunciaPage()]
- "id_page_todate": "toDate()" | kind=code-symbol | source=app/prevencion/juridico/solicitudes/[id]/page.tsx:L12 | neighbors=[page.tsx, fmtDT()]
- "id_page_toiso": "toISO()" | kind=code-symbol | source=app/prevencion/busquedas/[id]/page.tsx:L17 | neighbors=[page.tsx, FichaDetailPage()]
- "imprimir_page_fmtdt": "fmtDT()" | kind=code-symbol | source=app/prevencion/busquedas/[id]/imprimir/page.tsx:L10 | neighbors=[page.tsx, ImprimirFichaPage()]
- "imprimir_page_imprimirfichapage": "ImprimirFichaPage()" | kind=code-symbol | source=app/prevencion/busquedas/[id]/imprimir/page.tsx:L15 | neighbors=[page.tsx, fmtDT()]
- "incidentes_actions_cerrarpordetencion": "cerrarPorDetencion()" | kind=code-symbol | source=lib/incidentes/actions.ts:L523 | neighbors=[actions.ts, requireOperador()]
- "incidentes_actions_marcarensitio": "marcarEnSitio()" | kind=code-symbol | source=lib/incidentes/actions.ts:L501 | neighbors=[actions.ts, requireOperador()]
- "incidentes_camara_page_filtrobtn": "filtroBtn()" | kind=code-symbol | source=app/monitorista/incidentes-camara/page.tsx:L129 | neighbors=[page.tsx, IncidentesCamaraPage()]
- "incidentes_camara_page_incidentescamarapage": "IncidentesCamaraPage()" | kind=code-symbol | source=app/monitorista/incidentes-camara/page.tsx:L13 | neighbors=[page.tsx, filtroBtn()]
- "incidentes_filtrosincidencias_filtrosincidencias": "FiltrosIncidencias()" | kind=code-symbol | source=components/reportes/incidentes/FiltrosIncidencias.tsx:L7 | neighbors=[FiltrosIncidencias.tsx, page.tsx]
- "incidentes_folio_generarfolioincidente": "generarFolioIncidente()" | kind=code-symbol | source=lib/incidentes/folio.ts:L3 | neighbors=[actions.ts, folio.ts]
- "incidentes_historialincidente_historialincidente": "HistorialIncidente()" | kind=code-symbol | source=components/incidentes/HistorialIncidente.tsx:L10 | neighbors=[page.tsx, HistorialIncidente.tsx]
- "incidentes_mapper_rowtoincidentebasico": "rowToIncidenteBasico()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L193 | neighbors=[mapper.ts, repository.ts]

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
