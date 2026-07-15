# Node Description Batch 48 of 93

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

- "monitorista_repository_obtenerregistroporfechaturnoraw": "obtenerRegistroPorFechaTurnoRaw()" | kind=code-symbol | source=lib/monitorista/repository.ts:L425 | neighbors=[repository.ts, service.ts]
- "monitorista_repository_obtenerregistroraw": "obtenerRegistroRaw()" | kind=code-symbol | source=lib/monitorista/repository.ts:L417 | neighbors=[repository.ts, service.ts]
- "monitorista_repository_obtenerreporteporidraw": "obtenerReportePorIdRaw()" | kind=code-symbol | source=lib/monitorista/repository.ts:L378 | neighbors=[repository.ts, service.ts]
- "monitorista_repository_obtenersolicitudconevidencias": "obtenerSolicitudConEvidencias()" | kind=code-symbol | source=lib/monitorista/repository.ts:L138 | neighbors=[route.ts, repository.ts]
- "monitorista_repository_obtenersolicitudconincidente": "obtenerSolicitudConIncidente()" | kind=code-symbol | source=lib/monitorista/repository.ts:L104 | neighbors=[route.ts, repository.ts]
- "monitorista_repository_obtenersolicitudevidencia": "obtenerSolicitudEvidencia()" | kind=code-symbol | source=lib/monitorista/repository.ts:L69 | neighbors=[page.tsx, repository.ts]
- "monitorista_repository_obtenersolicitudfotosraw": "obtenerSolicitudFotosRaw()" | kind=code-symbol | source=lib/monitorista/repository.ts:L397 | neighbors=[repository.ts, service.ts]
- "monitorista_repository_registrarfichainteligencia": "registrarFichaInteligencia()" | kind=code-symbol | source=lib/monitorista/repository.ts:L575 | neighbors=[repository.ts, route.ts]
- "monitorista_repository_registrariphdetenido": "registrarIphDetenido()" | kind=code-symbol | source=lib/monitorista/repository.ts:L533 | neighbors=[repository.ts, route.ts]
- "monitorista_repository_subirfotodetenido": "subirFotoDetenido()" | kind=code-symbol | source=lib/monitorista/repository.ts:L469 | neighbors=[repository.ts, route.ts]
- "monitorista_service_cameltosnake": "camelToSnake()" | kind=code-symbol | source=lib/monitorista/service.ts:L210 | neighbors=[service.ts, actualizarRegistro()]
- "monitorista_service_crearregistro": "crearRegistro()" | kind=code-symbol | source=lib/monitorista/service.ts:L142 | neighbors=[incidentes-camara-service.ts, service.ts]
- "monitorista_service_listarregistros": "listarRegistros()" | kind=code-symbol | source=lib/monitorista/service.ts:L127 | neighbors=[incidentes-camara-service.ts, service.ts]
- "monitorista_service_obtenerdenunciaporid": "obtenerDenunciaPorId()" | kind=code-symbol | source=lib/monitorista/service.ts:L35 | neighbors=[denuncia-service.ts, service.ts]
- "monitorista_service_obtenerdenunciasatendidas": "obtenerDenunciasAtendidas()" | kind=code-symbol | source=lib/monitorista/service.ts:L30 | neighbors=[denuncia-service.ts, service.ts]
- "monitorista_service_obtenerdenunciaspendientes": "obtenerDenunciasPendientes()" | kind=code-symbol | source=lib/monitorista/service.ts:L25 | neighbors=[denuncia-service.ts, service.ts]
- "monitorista_service_obtenerevidenciasdenuncia": "obtenerEvidenciasDenuncia()" | kind=code-symbol | source=lib/monitorista/service.ts:L40 | neighbors=[denuncia-service.ts, service.ts]
- "monitorista_service_obtenerregistro": "obtenerRegistro()" | kind=code-symbol | source=lib/monitorista/service.ts:L132 | neighbors=[incidentes-camara-service.ts, service.ts]
- "monitorista_service_obtenerregistroporfechaturno": "obtenerRegistroPorFechaTurno()" | kind=code-symbol | source=lib/monitorista/service.ts:L137 | neighbors=[incidentes-camara-service.ts, service.ts]
- "monitorista_service_parsedetenidos": "parseDetenidos()" | kind=code-symbol | source=lib/monitorista/service.ts:L104 | neighbors=[service.ts, listarReportesConDetenidos()]
- "monitorista_service_solicitudidtouuid": "solicitudIdToUuid()" | kind=code-symbol | source=lib/monitorista/service.ts:L45 | neighbors=[service.ts, subirEvidenciaDenuncia()]
- "monitorista_service_turnos": "TURNOS" | kind=code-symbol | source=lib/monitorista/service.ts:L21 | neighbors=[incidentes-camara-service.ts, service.ts]
- "monitorista_subirevidenciamodal_btnsubmit": "btnSubmit()" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L257 | neighbors=[SubirEvidenciaModal.tsx, SubirEvidenciaModal()]
- "monitorista_subirevidenciamodal_formatsize": "formatSize()" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L39 | neighbors=[SubirEvidenciaModal.tsx, SubirEvidenciaModal()]
- "monitorista_tabladetenidos_tabladetenidos": "TablaDetenidos()" | kind=code-symbol | source=components/monitorista/TablaDetenidos.tsx:L25 | neighbors=[TablaDetenidos.tsx, tabStyle()]
- "monitorista_tabladetenidos_tabstyle": "tabStyle()" | kind=code-symbol | source=components/monitorista/TablaDetenidos.tsx:L93 | neighbors=[TablaDetenidos.tsx, TablaDetenidos()]
- "monitorista_types_solicitudevidenciajson": "SolicitudEvidenciaJson" | kind=code-symbol | source=lib/monitorista/types.ts:L44 | neighbors=[mapper.ts, types.ts]
- "n_coordinacion_actions_num": "num()" | kind=code-symbol | source=lib/n-coordinacion/actions.ts:L7 | neighbors=[actions.ts, guardarDatosCoordinacion()]
- "n_coordinacion_repository_obtenerarmasdia": "obtenerArmasDia()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L73 | neighbors=[route.ts, repository.ts]
- "n_coordinacion_repository_obtenereventosdia": "obtenerEventosDia()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L3 | neighbors=[route.ts, repository.ts]
- "n_coordinacion_repository_obtenerrnd": "obtenerRND()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L58 | neighbors=[route.ts, repository.ts]
- "n_coordinacion_repository_upsertfge": "upsertFge()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L111 | neighbors=[actions.ts, repository.ts]
- "n_coordinacion_repository_upsertfgr": "upsertFgr()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L131 | neighbors=[actions.ts, repository.ts]
- "n_coordinacion_repository_upsertmasc": "upsertMasc()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L151 | neighbors=[actions.ts, repository.ts]
- "n_coordinacion_repository_upsertobservaciones": "upsertObservaciones()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L176 | neighbors=[actions.ts, repository.ts]
- "n_coordinacion_repository_upsertvictimas": "upsertVictimas()" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L163 | neighbors=[actions.ts, repository.ts]
- "ncoordinacion_profiledropdowncoordinacion_profiledropdowncoordinacion": "ProfileDropdownCoordinacion()" | kind=code-symbol | source=components/nCoordinacion/ProfileDropdownCoordinacion.tsx:L14 | neighbors=[page.tsx, ProfileDropdownCoordinacion.tsx]
- "notificaciones_actions_generaralertasdebug": "generarAlertasDebug()" | kind=code-symbol | source=lib/notificaciones/actions.ts:L32 | neighbors=[actions.ts, CampanillaNotificaciones.tsx]
- "notificaciones_actions_marcarleida": "marcarLeida()" | kind=code-symbol | source=lib/notificaciones/actions.ts:L10 | neighbors=[actions.ts, CampanillaNotificaciones.tsx]
- "notificaciones_actions_marcartodasleidas": "marcarTodasLeidas()" | kind=code-symbol | source=lib/notificaciones/actions.ts:L21 | neighbors=[actions.ts, CampanillaNotificaciones.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-047.json

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
