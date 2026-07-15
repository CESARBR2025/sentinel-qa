# Node Description Batch 45 of 93

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

- "generar_route_tc": "tc()" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L36 | neighbors=[route.ts, GET()]
- "generar_route_ton": "toN()" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L59 | neighbors=[route.ts, tablaFiscalia()]
- "guardar_docs_route_subirarchivo": "subirArchivo()" | kind=code-symbol | source=app/api/via/exp-digital/guardar-docs/route.ts:L8 | neighbors=[route.ts, POST()]
- "guardar_docs_route_validararchivo": "validarArchivo()" | kind=code-symbol | source=app/api/via/exp-digital/guardar-docs/route.ts:L40 | neighbors=[route.ts, POST()]
- "health_repository_ping": "ping()" | kind=code-symbol | source=lib/health/repository.ts:L3 | neighbors=[repository.ts, route.ts]
- "hooks_useanalistaform_usedetenidoform": "useDetenidoForm()" | kind=code-symbol | source=hooks/useAnalistaForm.ts:L4 | neighbors=[formAnalisis.tsx, useAnalistaForm.ts]
- "hooks_usedespacho_usedespacho": "useDespacho()" | kind=code-symbol | source=hooks/useDespacho.ts:L36 | neighbors=[TablonDespacho.tsx, useDespacho.ts]
- "hooks_useflota_useflota": "useFlota()" | kind=code-symbol | source=hooks/useFlota.ts:L13 | neighbors=[DespachoForm.tsx, useFlota.ts]
- "hooks_usepolling_usepolling": "usePolling()" | kind=code-symbol | source=hooks/usePolling.ts:L4 | neighbors=[TablonDespacho.tsx, usePolling.ts]
- "hooks_useregistrodetenido_useregistrodetenido": "useRegistroDetenido()" | kind=code-symbol | source=hooks/useRegistroDetenido.ts:L4 | neighbors=[generarPresentacion.tsx, useRegistroDetenido.ts]
- "id_page_btnprimario": "btnPrimario()" | kind=code-symbol | source=app/monitorista/incidentes-camara/[id]/page.tsx:L159 | neighbors=[page.tsx, EditarIncidenteCamaraPage()]
- "id_page_detalleciudadanocompletopage": "DetalleCiudadanoCompletoPage()" | kind=code-symbol | source=app/agente_911/ciudadano/incidentes/[id]/page.tsx:L12 | neighbors=[page.tsx, getStatusBadgeStyle()]
- "id_page_detallerondincompletopage": "DetalleRondinCompletoPage()" | kind=code-symbol | source=app/agente_911/rondin/incidentes/[id]/page.tsx:L15 | neighbors=[page.tsx, getStatusBadgeStyle()]
- "id_page_detallesolicitudpage": "DetalleSolicitudPage()" | kind=code-symbol | source=app/monitorista/solicitudes/[id]/page.tsx:L12 | neighbors=[page.tsx, getStatusBadge()]
- "id_page_detallewhatsapppage": "DetalleWhatsAppPage()" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L15 | neighbors=[page.tsx, getStatusBadgeStyle()]
- "id_page_editarincidentecamarapage": "EditarIncidenteCamaraPage()" | kind=code-symbol | source=app/monitorista/incidentes-camara/[id]/page.tsx:L30 | neighbors=[page.tsx, btnPrimario()]
- "id_page_estadobadge": "estadoBadge()" | kind=code-symbol | source=app/monitorista/denuncias/[id]/page.tsx:L242 | neighbors=[page.tsx, DetalleDenunciaPage()]
- "id_page_getstatusbadge": "getStatusBadge()" | kind=code-symbol | source=app/monitorista/solicitudes/[id]/page.tsx:L107 | neighbors=[page.tsx, DetalleSolicitudPage()]
- "id_page_getstatusstyle": "getStatusStyle()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L58 | neighbors=[page.tsx, InfraccionCiudadanoPage()]
- "id_page_sanitize": "sanitize()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L53 | neighbors=[page.tsx, InfraccionCiudadanoPage()]
- "id_page_solicituddetailpage": "SolicitudDetailPage()" | kind=code-symbol | source=app/prevencion/juridico/solicitudes/[id]/page.tsx:L21 | neighbors=[page.tsx, fmtDT()]
- "id_page_statusbadge": "statusBadge()" | kind=code-symbol | source=app/monitorista/denuncias/[id]/page.tsx:L234 | neighbors=[page.tsx, DetalleDenunciaPage()]
- "id_page_todate": "toDate()" | kind=code-symbol | source=app/prevencion/juridico/solicitudes/[id]/page.tsx:L12 | neighbors=[page.tsx, fmtDT()]
- "id_page_toiso": "toISO()" | kind=code-symbol | source=app/prevencion/busquedas/[id]/page.tsx:L17 | neighbors=[page.tsx, FichaDetailPage()]
- "imprimir_page_fmtdt": "fmtDT()" | kind=code-symbol | source=app/prevencion/busquedas/[id]/imprimir/page.tsx:L11 | neighbors=[page.tsx, ImprimirFichaPage()]
- "imprimir_page_imprimirfichapage": "ImprimirFichaPage()" | kind=code-symbol | source=app/prevencion/busquedas/[id]/imprimir/page.tsx:L16 | neighbors=[page.tsx, fmtDT()]
- "incidentes_actions_cerrarpordetencion": "cerrarPorDetencion()" | kind=code-symbol | source=lib/incidentes/actions.ts:L664 | neighbors=[actions.ts, requireOperador()]
- "incidentes_actions_marcarensitio": "marcarEnSitio()" | kind=code-symbol | source=lib/incidentes/actions.ts:L642 | neighbors=[actions.ts, requireOperador()]
- "incidentes_camara_page_filtrobtn": "filtroBtn()" | kind=code-symbol | source=app/monitorista/incidentes-camara/page.tsx:L129 | neighbors=[page.tsx, IncidentesCamaraPage()]
- "incidentes_camara_page_incidentescamarapage": "IncidentesCamaraPage()" | kind=code-symbol | source=app/monitorista/incidentes-camara/page.tsx:L13 | neighbors=[page.tsx, filtroBtn()]
- "incidentes_filtrosincidencias_filtrosincidencias": "FiltrosIncidencias()" | kind=code-symbol | source=components/reportes/incidentes/FiltrosIncidencias.tsx:L7 | neighbors=[FiltrosIncidencias.tsx, page.tsx]
- "incidentes_mapper_rowtoincidentebasico": "rowToIncidenteBasico()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L197 | neighbors=[mapper.ts, repository.ts]
- "incidentes_permisos_accion": "Accion" | kind=code-symbol | source=lib/incidentes/permisos.ts:L6 | neighbors=[actions.ts, permisos.ts]
- "incidentes_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/incidentes/permisos.ts:L4 | neighbors=[permisos.ts, registro.ts]
- "incidentes_repository_insertarreportecampo": "insertarReporteCampo()" | kind=code-symbol | source=lib/incidentes/repository.ts:L164 | neighbors=[repository.ts, service.ts]
- "incidentes_repository_listarincidentesatendidos": "listarIncidentesAtendidos()" | kind=code-symbol | source=lib/incidentes/repository.ts:L30 | neighbors=[route.ts, repository.ts]
- "incidentes_repository_listarincidentesendespacho": "listarIncidentesEnDespacho()" | kind=code-symbol | source=lib/incidentes/repository.ts:L59 | neighbors=[route.ts, repository.ts]
- "incidentes_repository_listarincidentespendientesdespacho": "listarIncidentesPendientesDespacho()" | kind=code-symbol | source=lib/incidentes/repository.ts:L82 | neighbors=[repository.ts, route.ts]
- "incidentes_repository_tostr": "toStr()" | kind=code-symbol | source=lib/incidentes/repository.ts:L5 | neighbors=[repository.ts, obtenerDespachoDeIncidente()]
- "incidentes_repository_verificarreportecampo": "verificarReporteCampo()" | kind=code-symbol | source=lib/incidentes/repository.ts:L288 | neighbors=[repository.ts, service.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-044.json

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
