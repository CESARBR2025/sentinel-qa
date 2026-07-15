# Node Description Batch 49 of 93

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

- "n_coordinacion_repository_obtenerrnd": "obtenerRND()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L58 | neighbors=[route.ts, repository.ts]
- "n_coordinacion_repository_upsertfge": "upsertFge()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L111 | neighbors=[actions.ts, repository.ts]
- "n_coordinacion_repository_upsertfgr": "upsertFgr()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L131 | neighbors=[actions.ts, repository.ts]
- "n_coordinacion_repository_upsertmasc": "upsertMasc()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L151 | neighbors=[actions.ts, repository.ts]
- "n_coordinacion_repository_upsertobservaciones": "upsertObservaciones()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L176 | neighbors=[actions.ts, repository.ts]
- "n_coordinacion_repository_upsertvictimas": "upsertVictimas()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L163 | neighbors=[actions.ts, repository.ts]
- "ncoordinacion_profiledropdowncoordinacion_profiledropdowncoordinacion": "ProfileDropdownCoordinacion()" | kind=code-symbol | source=components/nCoordinacion/ProfileDropdownCoordinacion.tsx:L14 | neighbors=[ProfileDropdownCoordinacion.tsx, page.tsx]
- "notificaciones_actions_generaralertasdebug": "generarAlertasDebug()" | kind=code-symbol | source=lib/notificaciones/actions.ts:L32 | neighbors=[actions.ts, CampanillaNotificaciones.tsx]
- "notificaciones_actions_marcarleida": "marcarLeida()" | kind=code-symbol | source=lib/notificaciones/actions.ts:L10 | neighbors=[actions.ts, CampanillaNotificaciones.tsx]
- "notificaciones_actions_marcartodasleidas": "marcarTodasLeidas()" | kind=code-symbol | source=lib/notificaciones/actions.ts:L21 | neighbors=[actions.ts, CampanillaNotificaciones.tsx]
- "notificaciones_campanillanotificaciones_campanillanotificaciones": "CampanillaNotificaciones()" | kind=code-symbol | source=components/notificaciones/CampanillaNotificaciones.tsx:L191 | neighbors=[CampanillaNotificaciones.tsx, layout.tsx]
- "notificaciones_mapper_rowtonotificacion": "rowToNotificacion()" | kind=code-symbol | source=lib/notificaciones/mapper.ts:L3 | neighbors=[mapper.ts, repository.ts]
- "notificaciones_repository_eliminaralertasbusqueda": "eliminarAlertasBusqueda()" | kind=code-symbol | source=lib/notificaciones/repository.ts:L27 | neighbors=[actions.ts, repository.ts]
- "notificaciones_repository_marcarnotificacionleida": "marcarNotificacionLeida()" | kind=code-symbol | source=lib/notificaciones/repository.ts:L13 | neighbors=[actions.ts, repository.ts]
- "notificaciones_repository_marcartodasnotificacionesleidas": "marcarTodasNotificacionesLeidas()" | kind=code-symbol | source=lib/notificaciones/repository.ts:L20 | neighbors=[actions.ts, repository.ts]
- "nueva_page_btnprimario": "btnPrimario()" | kind=code-symbol | source=app/monitorista/detenidos/nueva/page.tsx:L95 | neighbors=[page.tsx, NuevaDetenidoPage()]
- "nueva_page_nuevadetenidopage": "NuevaDetenidoPage()" | kind=code-symbol | source=app/monitorista/detenidos/nueva/page.tsx:L11 | neighbors=[page.tsx, btnPrimario()]
- "nuevo_page_btnprimario": "btnPrimario()" | kind=code-symbol | source=app/monitorista/incidentes-camara/nuevo/page.tsx:L151 | neighbors=[page.tsx, NuevoIncidenteCamaraPage()]
- "nuevo_page_nuevoincidentecamarapage": "NuevoIncidenteCamaraPage()" | kind=code-symbol | source=app/monitorista/incidentes-camara/nuevo/page.tsx:L30 | neighbors=[page.tsx, btnPrimario()]
- "oficial_actions_asignarpatrulla": "asignarPatrulla()" | kind=code-symbol | source=lib/oficial/actions.ts:L70 | neighbors=[actions.ts, ModalSeleccionarUnidad.tsx]
- "oficial_actions_crearreportecampooficial": "crearReporteCampoOficial()" | kind=code-symbol | source=lib/oficial/actions.ts:L11 | neighbors=[actions.ts, FormularioRecorrido.tsx]
- "oficial_actions_marcarensitiooficial": "marcarEnSitioOficial()" | kind=code-symbol | source=lib/oficial/actions.ts:L45 | neighbors=[actions.ts, MarcarEnSitioButton.tsx]
- "oficial_despachocontent_despachocontent": "DespachoContent()" | kind=code-symbol | source=components/oficial/DespachoContent.tsx:L26 | neighbors=[page.tsx, DespachoContent.tsx]
- "oficial_mapapinfijo_mapapinfijo": "MapaPinFijo()" | kind=code-symbol | source=components/oficial/MapaPinFijo.tsx:L19 | neighbors=[page.tsx, MapaPinFijo.tsx]
- "oficial_mapaubicacion_mapaubicacion": "MapaUbicacion()" | kind=code-symbol | source=components/oficial/MapaUbicacion.tsx:L15 | neighbors=[FormularioRecorrido.tsx, MapaUbicacion.tsx]
- "oficial_mapper_parsejsonfield": "parseJsonField()" | kind=code-symbol | source=lib/oficial/mapper.ts:L3 | neighbors=[mapper.ts, rowToReporteCampo()]
- "oficial_mapper_rowtooficial": "rowToOficial()" | kind=code-symbol | source=lib/oficial/mapper.ts:L50 | neighbors=[mapper.ts, repository.ts]
- "oficial_modalseleccionarunidad_modalseleccionarunidad": "ModalSeleccionarUnidad()" | kind=code-symbol | source=components/oficial/ModalSeleccionarUnidad.tsx:L14 | neighbors=[ModalSeleccionarUnidad.tsx, UnidadAsignadaSection.tsx]
- "oficial_repository_actualizarpatrullaoficial": "actualizarPatrullaOficial()" | kind=code-symbol | source=lib/oficial/repository.ts:L537 | neighbors=[actions.ts, repository.ts]
- "oficial_repository_contardenunciaspendientes": "contarDenunciasPendientes()" | kind=code-symbol | source=lib/oficial/repository.ts:L301 | neighbors=[repository.ts, service.ts]
- "oficial_repository_contardespachosasignados": "contarDespachosAsignados()" | kind=code-symbol | source=lib/oficial/repository.ts:L258 | neighbors=[repository.ts, service.ts]
- "oficial_repository_insertardetallesasegurados": "insertarDetallesAsegurados()" | kind=code-symbol | source=lib/oficial/repository.ts:L460 | neighbors=[repository.ts, service.ts]
- "oficial_repository_insertarreportecampo": "insertarReporteCampo()" | kind=code-symbol | source=lib/oficial/repository.ts:L45 | neighbors=[repository.ts, service.ts]
- "oficial_repository_listarreportescampo": "listarReportesCampo()" | kind=code-symbol | source=lib/oficial/repository.ts:L439 | neighbors=[repository.ts, route.ts]
- "oficial_repository_obtenercatalogocanalizaciones": "obtenerCatalogoCanalizaciones()" | kind=code-symbol | source=lib/oficial/repository.ts:L294 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenercatalogoemergencias": "obtenerCatalogoEmergencias()" | kind=code-symbol | source=lib/oficial/repository.ts:L280 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenercatalogoincidentes": "obtenerCatalogoIncidentes()" | kind=code-symbol | source=lib/oficial/repository.ts:L273 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenercatalogoprioridades": "obtenerCatalogoPrioridades()" | kind=code-symbol | source=lib/oficial/repository.ts:L287 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenercierreporincidente": "obtenerCierrePorIncidente()" | kind=code-symbol | source=lib/oficial/repository.ts:L187 | neighbors=[service.ts, repository.ts]
- "oficial_repository_obtenerdespachosasignados": "obtenerDespachosAsignados()" | kind=code-symbol | source=lib/oficial/repository.ts:L227 | neighbors=[repository.ts, service.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-048.json

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
