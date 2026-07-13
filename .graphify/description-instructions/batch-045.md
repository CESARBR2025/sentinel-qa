# Node Description Batch 46 of 86

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
- "oficial_service_obtenerplacapatrulla": "obtenerPlacaPatrulla()" | kind=code-symbol | source=lib/oficial/service.ts:L63 | neighbors=[page.tsx, service.ts]
- "oficial_service_verreportedetalle": "verReporteDetalle()" | kind=code-symbol | source=lib/oficial/service.ts:L218 | neighbors=[page.tsx, service.ts]
- "oficial_types_ofiarmafuego": "OfiArmaFuego" | kind=code-symbol | source=lib/oficial/types.ts:L216 | neighbors=[store.ts, types.ts]
- "oficial_types_oficateo": "OfiCateo" | kind=code-symbol | source=lib/oficial/types.ts:L32 | neighbors=[mapper.ts, types.ts]
- "oficial_types_ofid1vinculada": "OfiD1Vinculada" | kind=code-symbol | source=lib/oficial/types.ts:L167 | neighbors=[mapper.ts, types.ts]
- "oficial_types_ofidroga": "OfiDroga" | kind=code-symbol | source=lib/oficial/types.ts:L224 | neighbors=[store.ts, types.ts]
- "oficial_types_ofihidrocarburo": "OfiHidrocarburo" | kind=code-symbol | source=lib/oficial/types.ts:L206 | neighbors=[store.ts, types.ts]
- "oficial_types_ofiordenaprehension": "OfiOrdenAprehension" | kind=code-symbol | source=lib/oficial/types.ts:L198 | neighbors=[store.ts, types.ts]
- "oficial_types_ofivehiculo": "OfiVehiculo" | kind=code-symbol | source=lib/oficial/types.ts:L24 | neighbors=[mapper.ts, types.ts]
- "oficial_unidadasignadasection_unidadasignadasection": "UnidadAsignadaSection()" | kind=code-symbol | source=components/oficial/UnidadAsignadaSection.tsx:L13 | neighbors=[page.tsx, UnidadAsignadaSection.tsx]
- "oficiales_mapper_maprowtooficialviadto": "mapRowToOficialViaDTO()" | kind=code-symbol | source=features/via/oficiales/mapper.ts:L20 | neighbors=[mapper.ts, repository.ts]
- "oficiales_types_ofioficialviadto": "OfiOficialViaDTO" | kind=code-symbol | source=features/via/oficiales/types.ts:L1 | neighbors=[mapper.ts, types.ts]

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
