# Node Description Batch 82 of 93

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

- "oficial_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/oficial/permisos.ts:L12 | neighbors=[permisos.ts]
- "oficial_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/oficial/permisos.ts:L20 | neighbors=[permisos.ts]
- "oficial_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/oficial/permisos.ts:L16 | neighbors=[permisos.ts]
- "oficial_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/oficial/permisos.ts:L6 | neighbors=[permisos.ts]
- "oficial_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/oficial/permisos.ts:L4 | neighbors=[permisos.ts]
- "oficial_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/oficial/permisos.ts:L3 | neighbors=[permisos.ts]
- "oficial_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/oficial/permisos.ts:L8 | neighbors=[permisos.ts]
- "oficial_profiledropdown_props": "Props" | kind=code-symbol | source=components/oficial/ProfileDropdown.tsx:L8 | neighbors=[ProfileDropdown.tsx]
- "oficial_repository_cierrereportecamporow": "CierreReporteCampoRow" | kind=code-symbol | source=lib/oficial/repository.ts:L174 | neighbors=[repository.ts]
- "oficial_selectordestinolegal_destinos": "DESTINOS" | kind=code-symbol | source=components/oficial/SelectorDestinoLegal.tsx:L10 | neighbors=[SelectorDestinoLegal.tsx]
- "oficial_selectordestinolegal_props": "Props" | kind=code-symbol | source=components/oficial/SelectorDestinoLegal.tsx:L5 | neighbors=[SelectorDestinoLegal.tsx]
- "oficial_service_bool": "bool()" | kind=code-symbol | source=lib/oficial/service.ts:L37 | neighbors=[service.ts]
- "oficial_service_str": "str()" | kind=code-symbol | source=lib/oficial/service.ts:L33 | neighbors=[service.ts]
- "oficial_store_initialstate": "initialState" | kind=code-symbol | source=lib/oficial/store.ts:L83 | neighbors=[store.ts]
- "oficial_store_oficialformactions": "OficialFormActions" | kind=code-symbol | source=lib/oficial/store.ts:L66 | neighbors=[store.ts]
- "oficial_store_oficialformstate": "OficialFormState" | kind=code-symbol | source=lib/oficial/store.ts:L12 | neighbors=[store.ts]
- "oficial_store_oficialformstore": "OficialFormStore" | kind=code-symbol | source=lib/oficial/store.ts:L81 | neighbors=[store.ts]
- "oficial_store_vehiculostate": "VehiculoState" | kind=code-symbol | source=lib/oficial/store.ts:L4 | neighbors=[store.ts]
- "oficial_unidadasignadasection_props": "Props" | kind=code-symbol | source=components/oficial/UnidadAsignadaSection.tsx:L8 | neighbors=[UnidadAsignadaSection.tsx]
- "oficiales_mapper_ofioficialrow": "OfiOficialRow" | kind=code-symbol | source=features/via/oficiales/mapper.ts:L3 | neighbors=[mapper.ts]
- "oficiales_page_oficialespage": "OficialesPage()" | kind=code-symbol | source=app/admin-transito/oficiales/page.tsx:L8 | neighbors=[page.tsx]
- "oficiales_repository_oficialesviarepository_obteneroficialidporuserid": ".obtenerOficialIdPorUserId()" | kind=code-symbol | source=features/via/oficiales/repository.ts:L5 | neighbors=[OficialesViaRepository]
- "oficiales_repository_oficialesviarepository_obteneroficialporid": ".obtenerOficialPorId()" | kind=code-symbol | source=features/via/oficiales/repository.ts:L21 | neighbors=[OficialesViaRepository]
- "oficiales_repository_oficialesviarepository_obteneroficialporuserid": ".obtenerOficialPorUserId()" | kind=code-symbol | source=features/via/oficiales/repository.ts:L13 | neighbors=[OficialesViaRepository]
- "oficiales_service_oficialesviaservice_obtenermiperfil": ".obtenerMiPerfil()" | kind=code-symbol | source=features/via/oficiales/service.ts:L12 | neighbors=[OficialesViaService]
- "oficiales_service_oficialesviaservice_obteneroficialid": ".obtenerOficialId()" | kind=code-symbol | source=features/via/oficiales/service.ts:L4 | neighbors=[OficialesViaService]
- "oficiales_service_oficialesviaservice_obtenerporid": ".obtenerPorId()" | kind=code-symbol | source=features/via/oficiales/service.ts:L20 | neighbors=[OficialesViaService]
- "partials_header_dashboardheaderprops": "DashboardHeaderProps" | kind=code-symbol | source=components/partials/Header.tsx:L6 | neighbors=[Header.tsx]
- "partials_subheader_subheaderprops": "SubHeaderProps" | kind=code-symbol | source=components/partials/SubHeader.tsx:L8 | neighbors=[SubHeader.tsx]
- "path_route_get": "GET()" | kind=code-symbol | source=app/api/uploads/[...path]/route.ts:L16 | neighbors=[route.ts]
- "path_route_mime": "MIME" | kind=code-symbol | source=app/api/uploads/[...path]/route.ts:L7 | neighbors=[route.ts]
- "pendiente_analisis_page_analisispage": "AnalisisPage()" | kind=code-symbol | source=app/analisis/pendiente-analisis/page.tsx:L9 | neighbors=[page.tsx]
- "pendientes_despacho_route_get": "GET()" | kind=code-symbol | source=app/api/incidentes/pendientes-despacho/route.ts:L7 | neighbors=[route.ts]
- "permisos_core_accion": "Accion" | kind=code-symbol | source=lib/permisos/core.ts:L8 | neighbors=[core.ts]
- "permisos_core_listarpermisosporusuario": "listarPermisosPorUsuario()" | kind=code-symbol | source=lib/permisos/core.ts:L68 | neighbors=[core.ts]
- "permisos_core_permiso_completo": "PERMISO_COMPLETO" | kind=code-symbol | source=lib/permisos/core.ts:L23 | neighbors=[core.ts]
- "permisos_core_permiso_ninguno": "PERMISO_NINGUNO" | kind=code-symbol | source=lib/permisos/core.ts:L24 | neighbors=[core.ts]
- "permisos_core_permiso_total": "PERMISO_TOTAL" | kind=code-symbol | source=lib/permisos/core.ts:L22 | neighbors=[core.ts]
- "permisos_core_tieneplantillarol": "tienePlantillaRol()" | kind=code-symbol | source=lib/permisos/core.ts:L118 | neighbors=[core.ts]
- "permisos_registro_modulopermisos": "ModuloPermisos" | kind=code-symbol | source=lib/permisos/registro.ts:L10 | neighbors=[registro.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-081.json

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
