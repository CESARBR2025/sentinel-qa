# Node Description Batch 62 of 87

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

- "consolidar_page_consolidado": "Consolidado" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L73 | neighbors=[page.tsx]
- "consolidar_page_consolidarformatonpage": "ConsolidarFormatoNPage()" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L98 | neighbors=[page.tsx]
- "consolidar_page_diaconsolidado": "DiaConsolidado()" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L178 | neighbors=[page.tsx]
- "consolidar_page_evento": "Evento" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L11 | neighbors=[page.tsx]
- "consolidar_page_fge": "Fge" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L35 | neighbors=[page.tsx]
- "consolidar_page_fgr": "Fgr" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L36 | neighbors=[page.tsx]
- "consolidar_page_linkbtn": "linkBtn" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L403 | neighbors=[page.tsx]
- "consolidar_page_medios": "Medios" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L46 | neighbors=[page.tsx]
- "consolidar_page_metric": "Metric()" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L408 | neighbors=[page.tsx]
- "consolidar_page_periodo": "Periodo" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L9 | neighbors=[page.tsx]
- "consolidar_page_periodometricas": "PeriodoMetricas" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L21 | neighbors=[page.tsx]
- "consolidar_page_periodometricasblocks": "PeriodoMetricasBlocks()" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L417 | neighbors=[page.tsx]
- "consolidar_page_rnd": "Rnd" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L38 | neighbors=[page.tsx]
- "consolidar_page_tagcapturado": "tagCapturado" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L88 | neighbors=[page.tsx]
- "consolidar_page_tagsincapturar": "tagSinCapturar" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L93 | neighbors=[page.tsx]
- "consolidar_page_tdstyle": "tdStyle" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L401 | neighbors=[page.tsx]
- "consolidar_page_thstyle": "thStyle" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L400 | neighbors=[page.tsx]
- "consolidar_page_victimas": "Victimas" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L54 | neighbors=[page.tsx]
- "contestacion_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/contestacion/route.ts:L7 | neighbors=[route.ts]
- "corralon_actions_tabsolicitudes": "TabSolicitudes" | kind=code-symbol | source=lib/corralon/actions.ts:L26 | neighbors=[actions.ts]
- "corralon_layout_corralonlayout": "CorralonLayout()" | kind=code-symbol | source=app/corralon/layout.tsx:L6 | neighbors=[layout.tsx]
- "corralon_page_corralondashboardpage": "CorralonDashboardPage()" | kind=code-symbol | source=app/corralon/page.tsx:L5 | neighbors=[page.tsx]
- "corralon_permisos_accion": "Accion" | kind=code-symbol | source=lib/corralon/permisos.ts:L5 | neighbors=[permisos.ts]
- "corralon_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/corralon/permisos.ts:L17 | neighbors=[permisos.ts]
- "corralon_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/corralon/permisos.ts:L27 | neighbors=[permisos.ts]
- "corralon_permisos_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/corralon/permisos.ts:L9 | neighbors=[permisos.ts]
- "corralon_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/corralon/permisos.ts:L21 | neighbors=[permisos.ts]
- "corralon_permisos_permisorow": "PermisoRow" | kind=code-symbol | source=lib/corralon/permisos.ts:L7 | neighbors=[permisos.ts]
- "corralon_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/corralon/permisos.ts:L6 | neighbors=[permisos.ts]
- "corralon_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/corralon/permisos.ts:L4 | neighbors=[permisos.ts]
- "corralon_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/corralon/permisos.ts:L13 | neighbors=[permisos.ts]
- "corralon_profile_dropdown_props": "Props" | kind=code-symbol | source=app/corralon/profile-dropdown.tsx:L8 | neighbors=[profile-dropdown.tsx]
- "cuestionario_robo_page_cuestionariorobopage": "CuestionarioRoboPage()" | kind=code-symbol | source=app/auxiliar/cuestionario-robo/page.tsx:L12 | neighbors=[page.tsx]
- "cuestionario_robo_page_td": "TD" | kind=code-symbol | source=app/auxiliar/cuestionario-robo/page.tsx:L10 | neighbors=[page.tsx]
- "cuestionario_robo_page_th": "TH" | kind=code-symbol | source=app/auxiliar/cuestionario-robo/page.tsx:L9 | neighbors=[page.tsx]
- "curp_route_post": "POST()" | kind=code-symbol | source=app/api/via/curp/route.ts:L3 | neighbors=[route.ts]
- "d1_d1pagination_paginationprops": "PaginationProps" | kind=code-symbol | source=components/reportes/d1/D1Pagination.tsx:L5 | neighbors=[D1Pagination.tsx]
- "d1_noiniciada_descargapagination_paginationprops": "PaginationProps" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaPagination.tsx:L4 | neighbors=[DescargaPagination.tsx]
- "d1_noiniciada_page_descargaspage": "DescargasPage()" | kind=code-symbol | source=app/d1_noiniciada/page.tsx:L13 | neighbors=[page.tsx]
- "d1_page_reportesd1page": "ReportesD1Page()" | kind=code-symbol | source=app/d1/page.tsx:L13 | neighbors=[page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-061.json

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
