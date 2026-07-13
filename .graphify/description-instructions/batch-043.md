# Node Description Batch 44 of 87

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

- "monitorista_buscadorevento_buscadorevento": "BuscadorEvento()" | kind=code-symbol | source=components/monitorista/BuscadorEvento.tsx:L24 | neighbors=[BuscadorEvento.tsx, page.tsx]
- "monitorista_cardenviofoto_estadobadge": "estadoBadge()" | kind=code-symbol | source=components/monitorista/CardEnvioFoto.tsx:L137 | neighbors=[CardEnvioFoto.tsx, CardEnvioFoto()]
- "monitorista_editarcampodetenido_editarcampodetenido": "EditarCampoDetenido()" | kind=code-symbol | source=components/monitorista/EditarCampoDetenido.tsx:L9 | neighbors=[page.tsx, EditarCampoDetenido.tsx]
- "monitorista_filaincidentecamara_filaincidentecamara": "FilaIncidenteCamara()" | kind=code-symbol | source=components/monitorista/FilaIncidenteCamara.tsx:L5 | neighbors=[page.tsx, FilaIncidenteCamara.tsx]
- "monitorista_galeriaevidencias_galeriaevidencias": "GaleriaEvidencias()" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L15 | neighbors=[page.tsx, GaleriaEvidencias.tsx]
- "monitorista_mapper_parsedetenidos": "parseDetenidos()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L139 | neighbors=[mapper.ts, rowToReporteDetenido()]
- "monitorista_mapper_parseturno": "parseTurno()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L25 | neighbors=[mapper.ts, rowToIncidenteCamara()]
- "monitorista_mapper_rowtodependencia": "rowToDependencia()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L122 | neighbors=[mapper.ts, service.ts]
- "monitorista_mapper_rowtoevidencia": "rowToEvidencia()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L65 | neighbors=[mapper.ts, repository.ts]
- "monitorista_mapper_rowtoevidenciaarchivo": "rowToEvidenciaArchivo()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L111 | neighbors=[mapper.ts, service.ts]
- "monitorista_mapper_rowtoevidenciadetenido": "rowToEvidenciaDetenido()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L211 | neighbors=[mapper.ts, repository.ts]
- "monitorista_mapper_rowtohistorialentry": "rowToHistorialEntry()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L76 | neighbors=[mapper.ts, repository.ts]
- "monitorista_mapper_rowtoiphdetenido": "rowToIphDetenido()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L200 | neighbors=[mapper.ts, repository.ts]
- "monitorista_mapper_rowtoprellenadocompleto": "rowToPrellenadoCompleto()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L222 | neighbors=[mapper.ts, repository.ts]
- "monitorista_mapper_rowtosolicitudfotos": "rowToSolicitudFotos()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L130 | neighbors=[mapper.ts, service.ts]
- "monitorista_permisos_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/monitorista/permisos.ts:L9 | neighbors=[page.tsx, permisos.ts]
- "monitorista_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/monitorista/permisos.ts:L3 | neighbors=[permisos.ts, registro.ts]
- "monitorista_ppt_service_getaspectratio": "getAspectRatio()" | kind=code-symbol | source=lib/monitorista/ppt-service.ts:L54 | neighbors=[ppt-service.ts, generarPpt()]
- "monitorista_ppt_service_parsedetenidos": "parseDetenidos()" | kind=code-symbol | source=lib/monitorista/ppt-service.ts:L7 | neighbors=[ppt-service.ts, generarPpt()]
- "monitorista_repository_actualizarcampo": "actualizarCampo()" | kind=code-symbol | source=lib/monitorista/repository.ts:L433 | neighbors=[route.ts, repository.ts]
- "monitorista_repository_actualizarsolicitudfotoestado": "actualizarSolicitudFotoEstado()" | kind=code-symbol | source=lib/monitorista/repository.ts:L526 | neighbors=[repository.ts, route.ts]
- "monitorista_repository_completarsolicitudfoto": "completarSolicitudFoto()" | kind=code-symbol | source=lib/monitorista/repository.ts:L483 | neighbors=[repository.ts, route.ts]
- "monitorista_repository_crearsolicitudfotos": "crearSolicitudFotos()" | kind=code-symbol | source=lib/monitorista/repository.ts:L448 | neighbors=[page.tsx, repository.ts]
- "monitorista_repository_enviarfoto": "enviarFoto()" | kind=code-symbol | source=lib/monitorista/repository.ts:L462 | neighbors=[route.ts, repository.ts]
- "monitorista_repository_getdestinosraw": "getDestinosRaw()" | kind=code-symbol | source=lib/monitorista/repository.ts:L351 | neighbors=[repository.ts, service.ts]
- "monitorista_repository_gethistorialcount": "getHistorialCount()" | kind=code-symbol | source=lib/monitorista/repository.ts:L44 | neighbors=[repository.ts, page.tsx]
- "monitorista_repository_getmonitoristastats": "getMonitoristaStats()" | kind=code-symbol | source=lib/monitorista/repository.ts:L12 | neighbors=[page.tsx, repository.ts]
- "monitorista_repository_insertarevidenciadetenido": "insertarEvidenciaDetenido()" | kind=code-symbol | source=lib/monitorista/repository.ts:L512 | neighbors=[repository.ts, route.ts]
- "monitorista_repository_listarevidencias": "listarEvidencias()" | kind=code-symbol | source=lib/monitorista/repository.ts:L78 | neighbors=[page.tsx, repository.ts]
- "monitorista_repository_listarevidenciasdetenido": "listarEvidenciasDetenido()" | kind=code-symbol | source=lib/monitorista/repository.ts:L287 | neighbors=[page.tsx, repository.ts]
- "monitorista_repository_listarhistorial": "listarHistorial()" | kind=code-symbol | source=lib/monitorista/repository.ts:L52 | neighbors=[page.tsx, repository.ts]
- "monitorista_repository_listarhistorialconfiltros": "listarHistorialConFiltros()" | kind=code-symbol | source=lib/monitorista/repository.ts:L187 | neighbors=[route.ts, repository.ts]
- "monitorista_repository_listariphdetenidos": "listarIphDetenidos()" | kind=code-symbol | source=lib/monitorista/repository.ts:L246 | neighbors=[route.ts, repository.ts]
- "monitorista_repository_listarregistrosraw": "listarRegistrosRaw()" | kind=code-symbol | source=lib/monitorista/repository.ts:L405 | neighbors=[repository.ts, service.ts]
- "monitorista_repository_listarreportescondetenidosraw": "listarReportesConDetenidosRaw()" | kind=code-symbol | source=lib/monitorista/repository.ts:L358 | neighbors=[repository.ts, service.ts]
- "monitorista_repository_listarsolicitudesconfiltro": "listarSolicitudesConFiltro()" | kind=code-symbol | source=lib/monitorista/repository.ts:L127 | neighbors=[repository.ts, route.ts]
- "monitorista_repository_listarsolicitudesevidencia": "listarSolicitudesEvidencia()" | kind=code-symbol | source=lib/monitorista/repository.ts:L31 | neighbors=[repository.ts, page.tsx]
- "monitorista_repository_marcarsolicitudatendida": "marcarSolicitudAtendida()" | kind=code-symbol | source=lib/monitorista/repository.ts:L616 | neighbors=[repository.ts, service.ts]
- "monitorista_repository_obtenerdenunciaporidraw": "obtenerDenunciaPorIdRaw()" | kind=code-symbol | source=lib/monitorista/repository.ts:L328 | neighbors=[repository.ts, service.ts]
- "monitorista_repository_obtenerdenunciasatendidasraw": "obtenerDenunciasAtendidasRaw()" | kind=code-symbol | source=lib/monitorista/repository.ts:L316 | neighbors=[repository.ts, service.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-043.json

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
