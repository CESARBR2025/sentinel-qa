# Node Description Batch 70 of 84

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

- "incidentes_camara_route_post": "POST()" | kind=code-symbol | source=app/api/monitorista/incidentes-camara/route.ts:L20 | neighbors=[route.ts]
- "incidentes_camaras_page_reportesdeteccioncamarapage": "ReportesDeteccionCamaraPage()" | kind=code-symbol | source=app/incidentes_camaras/page.tsx:L13 | neighbors=[page.tsx]
- "incidentes_historialincidente_badge": "Badge()" | kind=code-symbol | source=components/incidentes/HistorialIncidente.tsx:L138 | neighbors=[HistorialIncidente.tsx]
- "incidentes_historialincidente_dato": "Dato()" | kind=code-symbol | source=components/incidentes/HistorialIncidente.tsx:L129 | neighbors=[HistorialIncidente.tsx]
- "incidentes_historialincidente_fmt": "fmt()" | kind=code-symbol | source=components/incidentes/HistorialIncidente.tsx:L5 | neighbors=[HistorialIncidente.tsx]
- "incidentes_historialincidente_pendiente": "Pendiente()" | kind=code-symbol | source=components/incidentes/HistorialIncidente.tsx:L146 | neighbors=[HistorialIncidente.tsx]
- "incidentes_page_bitacoraincidentespage": "BitacoraIncidentesPage()" | kind=code-symbol | source=app/incidentes/page.tsx:L23 | neighbors=[page.tsx]
- "incidentes_page_btnnuevostyle": "btnNuevoStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/page.tsx:L167 | neighbors=[page.tsx]
- "incidentes_page_btnviewstyle": "btnViewStyle" | kind=code-symbol | source=app/incidentes/page.tsx:L165 | neighbors=[page.tsx]
- "incidentes_page_cardstyle": "cardStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/page.tsx:L143 | neighbors=[page.tsx]
- "incidentes_page_decoratorstyle": "decoratorStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/page.tsx:L154 | neighbors=[page.tsx]
- "incidentes_page_footerstyle": "footerStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/page.tsx:L180 | neighbors=[page.tsx]
- "incidentes_page_getstatusbadgestyle": "getStatusBadgeStyle()" | kind=code-symbol | source=app/incidentes/page.tsx:L167 | neighbors=[page.tsx]
- "incidentes_page_headerinnerstyle": "headerInnerStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/page.tsx:L161 | neighbors=[page.tsx]
- "incidentes_page_listado911page": "Listado911Page()" | kind=code-symbol | source=app/agente_911/ciudadano/incidentes/page.tsx:L11 | neighbors=[page.tsx]
- "incidentes_page_listadorondinpage": "ListadoRondinPage()" | kind=code-symbol | source=app/agente_911/rondin/incidentes/page.tsx:L11 | neighbors=[page.tsx]
- "incidentes_page_listadowhatsapppage": "ListadoWhatsAppPage()" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/page.tsx:L11 | neighbors=[page.tsx]
- "incidentes_page_roles_permitidos": "ROLES_PERMITIDOS" | kind=code-symbol | source=app/incidentes/page.tsx:L16 | neighbors=[page.tsx]
- "incidentes_page_searchparams": "SearchParams" | kind=code-symbol | source=app/incidentes/page.tsx:L13 | neighbors=[page.tsx]
- "incidentes_page_sectiontitlestyle": "sectionTitleStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/page.tsx:L148 | neighbors=[page.tsx]
- "incidentes_page_tablewrapperstyle": "tableWrapperStyle" | kind=code-symbol | source=app/incidentes/page.tsx:L162 | neighbors=[page.tsx]
- "incidentes_page_tdstyle": "tdStyle" | kind=code-symbol | source=app/incidentes/page.tsx:L164 | neighbors=[page.tsx]
- "incidentes_page_thstyle": "thStyle" | kind=code-symbol | source=app/incidentes/page.tsx:L163 | neighbors=[page.tsx]
- "incidentes_page_titlestyle": "titleStyle" | kind=code-symbol | source=app/incidentes/page.tsx:L161 | neighbors=[page.tsx]
- "incidentes_page_toplabelstyle": "topLabelStyle" | kind=code-symbol | source=app/incidentes/page.tsx:L160 | neighbors=[page.tsx]
- "incidentes_paginacion_pagination": "Pagination()" | kind=code-symbol | source=components/reportes/incidentes/Paginacion.tsx:L14 | neighbors=[Paginacion.tsx]
- "incidentes_paginacion_paginationprops": "PaginationProps" | kind=code-symbol | source=components/reportes/incidentes/Paginacion.tsx:L6 | neighbors=[Paginacion.tsx]
- "incidentes_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L17 | neighbors=[permisos.ts]
- "incidentes_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L25 | neighbors=[permisos.ts]
- "incidentes_permisos_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L9 | neighbors=[permisos.ts]
- "incidentes_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L21 | neighbors=[permisos.ts]
- "incidentes_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/incidentes/permisos.ts:L7 | neighbors=[permisos.ts]
- "incidentes_permisos_roles_permitidos": "ROLES_PERMITIDOS" | kind=code-symbol | source=lib/incidentes/permisos.ts:L30 | neighbors=[permisos.ts]
- "incidentes_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/incidentes/permisos.ts:L5 | neighbors=[permisos.ts]
- "incidentes_repository_obtenerunidadeselementos": "obtenerUnidadesElementos()" | kind=code-symbol | source=lib/incidentes/repository.ts:L71 | neighbors=[repository.ts]
- "incidentes_route_get": "GET()" | kind=code-symbol | source=app/api/incidentes/route.ts:L7 | neighbors=[route.ts]
- "incidentes_tablaincidentes_props": "Props" | kind=code-symbol | source=components/reportes/incidentes/TablaIncidentes.tsx:L18 | neighbors=[TablaIncidentes.tsx]
- "incidentes_tablaincidentes_rowdata": "RowData" | kind=code-symbol | source=components/reportes/incidentes/TablaIncidentes.tsx:L3 | neighbors=[TablaIncidentes.tsx]
- "incidentes_types_historialcierre": "HistorialCierre" | kind=code-symbol | source=lib/incidentes/types.ts:L264 | neighbors=[types.ts]
- "incidentes_types_historiald1": "HistorialD1" | kind=code-symbol | source=lib/incidentes/types.ts:L275 | neighbors=[types.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-069.json

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
