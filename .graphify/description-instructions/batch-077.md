# Node Description Batch 78 of 89

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

- "nuevo_page_nuevoreporteoficialpage": "NuevoReporteOficialPage()" | kind=code-symbol | source=app/oficial/nuevo/page.tsx:L7 | neighbors=[page.tsx]
- "nuevo_page_nuevousuariopage": "NuevoUsuarioPage()" | kind=code-symbol | source=app/admin/usuarios/nuevo/page.tsx:L6 | neighbors=[page.tsx]
- "nuevo_page_periodos": "PERIODOS" | kind=code-symbol | source=app/formato-n-medios-alternativos/nuevo/page.tsx:L11 | neighbors=[page.tsx]
- "nuevo_page_turnos": "TURNOS" | kind=code-symbol | source=app/monitorista/incidentes-camara/nuevo/page.tsx:L10 | neighbors=[page.tsx]
- "oficial_formulariorecorrido_prefilldespacho": "PrefillDespacho" | kind=code-symbol | source=components/oficial/FormularioRecorrido.tsx:L55 | neighbors=[FormularioRecorrido.tsx]
- "oficial_formulariorecorrido_sentinelfield": "SentinelField()" | kind=code-symbol | source=components/oficial/FormularioRecorrido.tsx:L24 | neighbors=[FormularioRecorrido.tsx]
- "oficial_formulariorecorrido_steps": "STEPS" | kind=code-symbol | source=components/oficial/FormularioRecorrido.tsx:L14 | neighbors=[FormularioRecorrido.tsx]
- "oficial_mapapinfijo_pin_icons": "PIN_ICONS" | kind=code-symbol | source=components/oficial/MapaPinFijo.tsx:L12 | neighbors=[MapaPinFijo.tsx]
- "oficial_mapapinfijo_props": "Props" | kind=code-symbol | source=components/oficial/MapaPinFijo.tsx:L5 | neighbors=[MapaPinFijo.tsx]
- "oficial_mapaubicacion_locationdata": "LocationData" | kind=code-symbol | source=components/oficial/MapaUbicacion.tsx:L6 | neighbors=[MapaUbicacion.tsx]
- "oficial_marcarensitiobutton_props": "Props" | kind=code-symbol | source=components/oficial/MarcarEnSitioButton.tsx:L7 | neighbors=[MarcarEnSitioButton.tsx]
- "oficial_modalseleccionarunidad_props": "Props" | kind=code-symbol | source=components/oficial/ModalSeleccionarUnidad.tsx:L8 | neighbors=[ModalSeleccionarUnidad.tsx]
- "oficial_page_oficialdashboardpage": "OficialDashboardPage()" | kind=code-symbol | source=app/oficial/page.tsx:L10 | neighbors=[page.tsx]
- "oficial_permisos_accion": "Accion" | kind=code-symbol | source=lib/oficial/permisos.ts:L5 | neighbors=[permisos.ts]
- "oficial_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/oficial/permisos.ts:L12 | neighbors=[permisos.ts]
- "oficial_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/oficial/permisos.ts:L20 | neighbors=[permisos.ts]
- "oficial_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/oficial/permisos.ts:L16 | neighbors=[permisos.ts]
- "oficial_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/oficial/permisos.ts:L6 | neighbors=[permisos.ts]
- "oficial_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/oficial/permisos.ts:L4 | neighbors=[permisos.ts]
- "oficial_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/oficial/permisos.ts:L3 | neighbors=[permisos.ts]
- "oficial_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/oficial/permisos.ts:L8 | neighbors=[permisos.ts]
- "oficial_profiledropdown_props": "Props" | kind=code-symbol | source=components/oficial/ProfileDropdown.tsx:L8 | neighbors=[ProfileDropdown.tsx]
- "oficial_repository_cierrereportecamporow": "CierreReporteCampoRow" | kind=code-symbol | source=lib/oficial/repository.ts:L169 | neighbors=[repository.ts]
- "oficial_selectordestinolegal_destinos": "DESTINOS" | kind=code-symbol | source=components/oficial/SelectorDestinoLegal.tsx:L10 | neighbors=[SelectorDestinoLegal.tsx]
- "oficial_selectordestinolegal_props": "Props" | kind=code-symbol | source=components/oficial/SelectorDestinoLegal.tsx:L5 | neighbors=[SelectorDestinoLegal.tsx]
- "oficial_service_bool": "bool()" | kind=code-symbol | source=lib/oficial/service.ts:L32 | neighbors=[service.ts]
- "oficial_service_str": "str()" | kind=code-symbol | source=lib/oficial/service.ts:L28 | neighbors=[service.ts]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-077.json

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
