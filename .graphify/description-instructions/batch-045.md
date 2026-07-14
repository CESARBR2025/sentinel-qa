# Node Description Batch 46 of 87

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

- "notificaciones_repository_marcarnotificacionleida": "marcarNotificacionLeida()" | kind=code-symbol | source=lib/notificaciones/repository.ts:L13 | neighbors=[actions.ts, repository.ts]
- "notificaciones_repository_marcartodasnotificacionesleidas": "marcarTodasNotificacionesLeidas()" | kind=code-symbol | source=lib/notificaciones/repository.ts:L20 | neighbors=[actions.ts, repository.ts]
- "nueva_page_btnprimario": "btnPrimario()" | kind=code-symbol | source=app/monitorista/detenidos/nueva/page.tsx:L95 | neighbors=[page.tsx, NuevaDetenidoPage()]
- "nueva_page_nuevadetenidopage": "NuevaDetenidoPage()" | kind=code-symbol | source=app/monitorista/detenidos/nueva/page.tsx:L11 | neighbors=[page.tsx, btnPrimario()]
- "nuevo_page_btnprimario": "btnPrimario()" | kind=code-symbol | source=app/monitorista/incidentes-camara/nuevo/page.tsx:L151 | neighbors=[page.tsx, NuevoIncidenteCamaraPage()]
- "nuevo_page_nuevoincidentecamarapage": "NuevoIncidenteCamaraPage()" | kind=code-symbol | source=app/monitorista/incidentes-camara/nuevo/page.tsx:L30 | neighbors=[page.tsx, btnPrimario()]
- "oficial_actions_asignarpatrulla": "asignarPatrulla()" | kind=code-symbol | source=lib/oficial/actions.ts:L69 | neighbors=[actions.ts, ModalSeleccionarUnidad.tsx]
- "oficial_actions_crearreportecampooficial": "crearReporteCampoOficial()" | kind=code-symbol | source=lib/oficial/actions.ts:L11 | neighbors=[actions.ts, FormularioRecorrido.tsx]
- "oficial_actions_marcarensitiooficial": "marcarEnSitioOficial()" | kind=code-symbol | source=lib/oficial/actions.ts:L45 | neighbors=[actions.ts, MarcarEnSitioButton.tsx]
- "oficial_mapapinfijo_mapapinfijo": "MapaPinFijo()" | kind=code-symbol | source=components/oficial/MapaPinFijo.tsx:L18 | neighbors=[page.tsx, MapaPinFijo.tsx]
- "oficial_mapaubicacion_mapaubicacion": "MapaUbicacion()" | kind=code-symbol | source=components/oficial/MapaUbicacion.tsx:L15 | neighbors=[FormularioRecorrido.tsx, MapaUbicacion.tsx]
- "oficial_mapper_parsejsonfield": "parseJsonField()" | kind=code-symbol | source=lib/oficial/mapper.ts:L3 | neighbors=[mapper.ts, rowToReporteCampo()]
- "oficial_mapper_rowtooficial": "rowToOficial()" | kind=code-symbol | source=lib/oficial/mapper.ts:L50 | neighbors=[mapper.ts, repository.ts]
- "oficial_marcarensitiobutton_marcarensitiobutton": "MarcarEnSitioButton()" | kind=code-symbol | source=components/oficial/MarcarEnSitioButton.tsx:L12 | neighbors=[page.tsx, MarcarEnSitioButton.tsx]
- "oficial_modalseleccionarunidad_modalseleccionarunidad": "ModalSeleccionarUnidad()" | kind=code-symbol | source=components/oficial/ModalSeleccionarUnidad.tsx:L14 | neighbors=[ModalSeleccionarUnidad.tsx, UnidadAsignadaSection.tsx]
- "oficial_repository_actualizarpatrullaoficial": "actualizarPatrullaOficial()" | kind=code-symbol | source=lib/oficial/repository.ts:L481 | neighbors=[actions.ts, repository.ts]
- "oficial_repository_contardenunciaspendientes": "contarDenunciasPendientes()" | kind=code-symbol | source=lib/oficial/repository.ts:L307 | neighbors=[repository.ts, service.ts]
- "oficial_repository_contardespachosasignados": "contarDespachosAsignados()" | kind=code-symbol | source=lib/oficial/repository.ts:L252 | neighbors=[repository.ts, service.ts]
- "oficial_repository_insertardetallesasegurados": "insertarDetallesAsegurados()" | kind=code-symbol | source=lib/oficial/repository.ts:L466 | neighbors=[repository.ts, service.ts]
- "oficial_repository_insertarreportecampo": "insertarReporteCampo()" | kind=code-symbol | source=lib/oficial/repository.ts:L41 | neighbors=[repository.ts, service.ts]
- "oficial_repository_listarreportescampo": "listarReportesCampo()" | kind=code-symbol | source=lib/oficial/repository.ts:L445 | neighbors=[repository.ts, route.ts]
- "oficial_repository_obtenercatalogocanalizaciones": "obtenerCatalogoCanalizaciones()" | kind=code-symbol | source=lib/oficial/repository.ts:L300 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenercatalogoemergencias": "obtenerCatalogoEmergencias()" | kind=code-symbol | source=lib/oficial/repository.ts:L286 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenercatalogoincidentes": "obtenerCatalogoIncidentes()" | kind=code-symbol | source=lib/oficial/repository.ts:L279 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenercatalogoprioridades": "obtenerCatalogoPrioridades()" | kind=code-symbol | source=lib/oficial/repository.ts:L293 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenercierreporincidente": "obtenerCierrePorIncidente()" | kind=code-symbol | source=lib/oficial/repository.ts:L182 | neighbors=[service.ts, repository.ts]
- "oficial_repository_obtenerdespachosasignados": "obtenerDespachosAsignados()" | kind=code-symbol | source=lib/oficial/repository.ts:L222 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obteneroficialporuserid": "obtenerOficialPorUserId()" | kind=code-symbol | source=lib/oficial/repository.ts:L18 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenerprellenado": "obtenerPrellenado()" | kind=code-symbol | source=lib/oficial/repository.ts:L403 | neighbors=[route.ts, repository.ts]
- "oficial_repository_obtenerreportecamposimple": "obtenerReporteCampoSimple()" | kind=code-symbol | source=lib/oficial/repository.ts:L395 | neighbors=[page.tsx, repository.ts]
- "oficial_repository_obtenerreportedetalle": "obtenerReporteDetalle()" | kind=code-symbol | source=lib/oficial/repository.ts:L354 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenerreportesoficial": "obtenerReportesOficial()" | kind=code-symbol | source=lib/oficial/repository.ts:L324 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/oficial/repository.ts:L265 | neighbors=[repository.ts, service.ts]
- "oficial_repository_verificarfolioexiste": "verificarFolioExiste()" | kind=code-symbol | source=lib/oficial/repository.ts:L33 | neighbors=[repository.ts, service.ts]
- "oficial_selectordestinolegal_selectordestinolegal": "SelectorDestinoLegal()" | kind=code-symbol | source=components/oficial/SelectorDestinoLegal.tsx:L40 | neighbors=[FormularioRecorrido.tsx, SelectorDestinoLegal.tsx]
- "oficial_service_contardenunciaspendientesoficial": "contarDenunciasPendientesOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L93 | neighbors=[page.tsx, service.ts]
- "oficial_service_contardespachosasignadosoficial": "contarDespachosAsignadosOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L214 | neighbors=[page.tsx, service.ts]
- "oficial_service_generarfolio": "generarFolio()" | kind=code-symbol | source=lib/oficial/service.ts:L40 | neighbors=[service.ts, generarFolioUnico()]
- "oficial_service_listarreportesoficial": "listarReportesOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L206 | neighbors=[service.ts, page.tsx]
- "oficial_service_num": "num()" | kind=code-symbol | source=lib/oficial/service.ts:L35 | neighbors=[service.ts, crearReporte()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-045.json

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
