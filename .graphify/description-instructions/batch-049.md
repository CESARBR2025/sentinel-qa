# Node Description Batch 50 of 93

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

- "oficial_repository_obteneroficialporuserid": "obtenerOficialPorUserId()" | kind=code-symbol | source=lib/oficial/repository.ts:L22 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenerprellenado": "obtenerPrellenado()" | kind=code-symbol | source=lib/oficial/repository.ts:L397 | neighbors=[route.ts, repository.ts]
- "oficial_repository_obtenerreportecampoparad1": "obtenerReporteCampoParaD1()" | kind=code-symbol | source=lib/oficial/repository.ts:L475 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenerreportedetalle": "obtenerReporteDetalle()" | kind=code-symbol | source=lib/oficial/repository.ts:L348 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenerreportesoficial": "obtenerReportesOficial()" | kind=code-symbol | source=lib/oficial/repository.ts:L318 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/oficial/repository.ts:L272 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenerrondinesoficial": "obtenerRondinesOficial()" | kind=code-symbol | source=lib/oficial/repository.ts:L516 | neighbors=[repository.ts, service.ts]
- "oficial_repository_obtenersectoroficial": "obtenerSectorOficial()" | kind=code-symbol | source=lib/oficial/repository.ts:L504 | neighbors=[repository.ts, service.ts]
- "oficial_repository_verificarfolioexiste": "verificarFolioExiste()" | kind=code-symbol | source=lib/oficial/repository.ts:L37 | neighbors=[repository.ts, service.ts]
- "oficial_selectordestinolegal_selectordestinolegal": "SelectorDestinoLegal()" | kind=code-symbol | source=components/oficial/SelectorDestinoLegal.tsx:L40 | neighbors=[FormularioRecorrido.tsx, SelectorDestinoLegal.tsx]
- "oficial_service_contardenunciaspendientesoficial": "contarDenunciasPendientesOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L97 | neighbors=[page.tsx, service.ts]
- "oficial_service_contardespachosasignadosoficial": "contarDespachosAsignadosOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L230 | neighbors=[page.tsx, service.ts]
- "oficial_service_generarfolio": "generarFolio()" | kind=code-symbol | source=lib/oficial/service.ts:L45 | neighbors=[service.ts, generarFolioUnico()]
- "oficial_service_listarreportesoficial": "listarReportesOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L210 | neighbors=[service.ts, page.tsx]
- "oficial_service_listarrondinesoficial": "listarRondinesOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L226 | neighbors=[service.ts, page.tsx]
- "oficial_service_num": "num()" | kind=code-symbol | source=lib/oficial/service.ts:L40 | neighbors=[service.ts, crearReporte()]
- "oficial_service_obtenerdatosparad1": "obtenerDatosParaD1()" | kind=code-symbol | source=lib/oficial/service.ts:L218 | neighbors=[page.tsx, service.ts]
- "oficial_service_obtenerplacapatrulla": "obtenerPlacaPatrulla()" | kind=code-symbol | source=lib/oficial/service.ts:L68 | neighbors=[page.tsx, service.ts]
- "oficial_service_obtenersectoroficialsvc": "obtenerSectorOficialSvc()" | kind=code-symbol | source=lib/oficial/service.ts:L222 | neighbors=[page.tsx, service.ts]
- "oficial_service_verreportedetalle": "verReporteDetalle()" | kind=code-symbol | source=lib/oficial/service.ts:L234 | neighbors=[page.tsx, service.ts]
- "oficial_types_ofiarmafuego": "OfiArmaFuego" | kind=code-symbol | source=lib/oficial/types.ts:L245 | neighbors=[store.ts, types.ts]
- "oficial_types_oficateo": "OfiCateo" | kind=code-symbol | source=lib/oficial/types.ts:L32 | neighbors=[mapper.ts, types.ts]
- "oficial_types_ofid1vinculada": "OfiD1Vinculada" | kind=code-symbol | source=lib/oficial/types.ts:L167 | neighbors=[mapper.ts, types.ts]
- "oficial_types_ofidroga": "OfiDroga" | kind=code-symbol | source=lib/oficial/types.ts:L253 | neighbors=[store.ts, types.ts]
- "oficial_types_ofihidrocarburo": "OfiHidrocarburo" | kind=code-symbol | source=lib/oficial/types.ts:L235 | neighbors=[store.ts, types.ts]
- "oficial_types_ofiordenaprehension": "OfiOrdenAprehension" | kind=code-symbol | source=lib/oficial/types.ts:L227 | neighbors=[store.ts, types.ts]
- "oficial_types_ofivehiculo": "OfiVehiculo" | kind=code-symbol | source=lib/oficial/types.ts:L24 | neighbors=[mapper.ts, types.ts]
- "oficial_unidadasignadasection_unidadasignadasection": "UnidadAsignadaSection()" | kind=code-symbol | source=components/oficial/UnidadAsignadaSection.tsx:L13 | neighbors=[page.tsx, UnidadAsignadaSection.tsx]
- "oficiales_mapper_maprowtooficialviadto": "mapRowToOficialViaDTO()" | kind=code-symbol | source=features/via/oficiales/mapper.ts:L20 | neighbors=[mapper.ts, repository.ts]
- "oficiales_types_ofioficialviadto": "OfiOficialViaDTO" | kind=code-symbol | source=features/via/oficiales/types.ts:L1 | neighbors=[mapper.ts, types.ts]
- "ordensalida_generarordensalida_drawwatermark": "drawWatermark()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L25 | neighbors=[generarOrdenSalida.ts, generarOrdenSalidaVehiculo()]
- "ordensalida_generarordensalida_formatearfecha": "formatearFecha()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L3 | neighbors=[generarOrdenSalida.ts, generarOrdenSalidaVehiculo()]
- "ordensalida_generarordensalida_formatearoficio": "formatearOficio()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L10 | neighbors=[generarOrdenSalida.ts, generarOrdenSalidaVehiculo()]
- "ordensalida_generarordensalida_loadimageasbase64": "loadImageAsBase64()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L14 | neighbors=[generarOrdenSalida.ts, generarOrdenSalidaVehiculo()]
- "ordensalida_generarordensalida_parrafomixtoconwrap": "parrafoMixtoConWrap()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L33 | neighbors=[generarOrdenSalida.ts, generarOrdenSalidaVehiculo()]
- "permisos_core_aplicarplantillarol": "aplicarPlantillaRol()" | kind=code-symbol | source=lib/permisos/core.ts:L140 | neighbors=[core.ts, guardarPermiso()]
- "permisos_core_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/permisos/core.ts:L124 | neighbors=[core.ts, guardarPlantillaSeccionesAction()]
- "permisos_core_permisorow": "PermisoRow" | kind=code-symbol | source=lib/permisos/core.ts:L17 | neighbors=[core.ts, PermisoSeccion]
- "permisos_core_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/permisos/core.ts:L10 | neighbors=[core.ts, PermisoRow]
- "plugins_context_loader_contextloaderplugin": "ContextLoaderPlugin()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L344 | neighbors=[context-loader.js, loadPluginState()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-049.json

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
