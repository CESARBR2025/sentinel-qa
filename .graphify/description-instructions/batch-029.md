# Node Description Batch 30 of 87

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

- "incidentes_types_incidentependiente": "IncidentePendiente" | kind=code-symbol | source=lib/incidentes/types.ts:L46 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_personaafectadarow": "PersonaAfectadaRow" | kind=code-symbol | source=lib/incidentes/types.ts:L62 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_reportecampodetalle": "ReporteCampoDetalle" | kind=code-symbol | source=lib/incidentes/types.ts:L207 | neighbors=[mapper.ts, repository.ts, types.ts]
- "incidentes_types_reportecamporow": "ReporteCampoRow" | kind=code-symbol | source=lib/incidentes/types.ts:L79 | neighbors=[mapper.ts, repository.ts, types.ts]
- "infracciones_service_generarfolioinfraccion": "generarFolioInfraccion()" | kind=code-symbol | source=features/via/infracciones/service.ts:L22 | neighbors=[service.ts, rellenarBase36(), .registrarNuevaInfraccionSV()]
- "infracciones_service_rellenarbase36": "rellenarBase36()" | kind=code-symbol | source=features/via/infracciones/service.ts:L12 | neighbors=[service.ts, generarFolioInfraccion(), randomBase36Char()]
- "infracciones_types_crearinfracciondto": "CrearInfraccionDTO" | kind=code-symbol | source=features/via/infracciones/types.ts:L1 | neighbors=[mapper.ts, service.ts, types.ts]
- "infracciones_types_procesoestado": "ProcesoEstado" | kind=code-symbol | source=features/via/infracciones/types.ts:L160 | neighbors=[FormularioInfraccion.tsx, types.ts, ProcesoModal.tsx]
- "legalidad_mapper_articulosmapper": "ArticulosMapper" | kind=code-symbol | source=features/via/legalidad/mapper.ts:L16 | neighbors=[mapper.ts, .toDomain(), service.ts]
- "legalidad_service_articulosservice": "ArticulosService" | kind=code-symbol | source=features/via/legalidad/service.ts:L6 | neighbors=[actions.ts, service.ts, .obtenerFraccionesPorArticulo()]
- "legalidad_types_fraccionley": "FraccionLey" | kind=code-symbol | source=features/via/legalidad/types.ts:L1 | neighbors=[mapper.ts, service.ts, types.ts]
- "lib_detenidos_compartido_listardetenidospararol": "listarDetenidosParaRol()" | kind=code-symbol | source=lib/detenidos-compartido.ts:L47 | neighbors=[page.tsx, detenidos-compartido.ts, nombreDetenido()]
- "lib_detenidos_compartido_nombredetenido": "nombreDetenido()" | kind=code-symbol | source=lib/detenidos-compartido.ts:L39 | neighbors=[detenidos-compartido.ts, listarDetenidosParaRol(), obtenerDetenidoParaRol()]
- "lib_detenidos_compartido_obtenerdetenidopararol": "obtenerDetenidoParaRol()" | kind=code-symbol | source=lib/detenidos-compartido.ts:L111 | neighbors=[page.tsx, detenidos-compartido.ts, nombreDetenido()]
- "lib_error_handler_conflicterror": "ConflictError" | kind=code-symbol | source=lib/error-handler.ts:L36 | neighbors=[error-handler.ts, AppError, .constructor()]
- "monitorista_bandejasolicitudes_bandejasolicitudes": "BandejaSolicitudes()" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L25 | neighbors=[BandejaSolicitudes.tsx, tabStyle(), page.tsx]
- "monitorista_cardenviofoto_cardenviofoto": "CardEnvioFoto()" | kind=code-symbol | source=components/monitorista/CardEnvioFoto.tsx:L16 | neighbors=[page.tsx, CardEnvioFoto.tsx, estadoBadge()]
- "monitorista_mapper_num": "num()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L13 | neighbors=[mapper.ts, rowToIncidenteCamara(), rowToSolicitudEvidencia()]
- "monitorista_mapper_rowtodenunciadetalle": "rowToDenunciaDetalle()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L91 | neighbors=[mapper.ts, parseSolicitudesJson(), service.ts]
- "monitorista_mapper_rowtoreportedetenido": "rowToReporteDetenido()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L152 | neighbors=[mapper.ts, parseDetenidos(), service.ts]
- "monitorista_mapper_rowtosolicitudevidencia": "rowToSolicitudEvidencia()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L51 | neighbors=[mapper.ts, num(), repository.ts]
- "monitorista_repository_actualizarestadosolicitud": "actualizarEstadoSolicitud()" | kind=code-symbol | source=lib/monitorista/repository.ts:L117 | neighbors=[route.ts, actions.ts, repository.ts]
- "monitorista_repository_crearsolicitudevidencia": "crearSolicitudEvidencia()" | kind=code-symbol | source=lib/monitorista/repository.ts:L155 | neighbors=[actions.ts, repository.ts, route.ts]
- "monitorista_repository_getrolusuario": "getRolUsuario()" | kind=code-symbol | source=lib/monitorista/repository.ts:L601 | neighbors=[actions.ts, repository.ts, route.ts]
- "monitorista_repository_insertarevidencia": "insertarEvidencia()" | kind=code-symbol | source=lib/monitorista/repository.ts:L223 | neighbors=[actions.ts, repository.ts, route.ts]
- "monitorista_repository_obtenersolicitudfolioincidente": "obtenerSolicitudFolioIncidente()" | kind=code-symbol | source=lib/monitorista/repository.ts:L178 | neighbors=[actions.ts, repository.ts, route.ts]
- "monitorista_service_actualizarregistro": "actualizarRegistro()" | kind=code-symbol | source=lib/monitorista/service.ts:L179 | neighbors=[incidentes-camara-service.ts, service.ts, camelToSnake()]
- "monitorista_service_listarreportescondetenidos": "listarReportesConDetenidos()" | kind=code-symbol | source=lib/monitorista/service.ts:L90 | neighbors=[detenido-service.ts, service.ts, parseDetenidos()]
- "monitorista_service_obtenerreporteporid": "obtenerReportePorId()" | kind=code-symbol | source=lib/monitorista/service.ts:L117 | neighbors=[page.tsx, detenido-service.ts, service.ts]
- "monitorista_service_subirevidenciadenuncia": "subirEvidenciaDenuncia()" | kind=code-symbol | source=lib/monitorista/service.ts:L51 | neighbors=[denuncia-service.ts, service.ts, solicitudIdToUuid()]
- "monitorista_subirfotodetenido_subirfotodetenido": "SubirFotoDetenido()" | kind=code-symbol | source=components/monitorista/SubirFotoDetenido.tsx:L31 | neighbors=[page.tsx, CardEnvioFoto.tsx, SubirFotoDetenido.tsx]
- "monitorista_types_evidencia": "Evidencia" | kind=code-symbol | source=lib/monitorista/types.ts:L22 | neighbors=[mapper.ts, repository.ts, types.ts]
- "monitorista_types_evidenciadetenido": "EvidenciaDetenido" | kind=code-symbol | source=lib/monitorista/types.ts:L140 | neighbors=[mapper.ts, repository.ts, types.ts]
- "monitorista_types_iphdetenido": "IphDetenido" | kind=code-symbol | source=lib/monitorista/types.ts:L131 | neighbors=[mapper.ts, repository.ts, types.ts]
- "monitorista_types_prellenadocompleto": "PrellenadoCompleto" | kind=code-symbol | source=lib/monitorista/types.ts:L149 | neighbors=[mapper.ts, repository.ts, types.ts]
- "notificaciones_repository_listarnotificacionesnoleidas": "listarNotificacionesNoLeidas()" | kind=code-symbol | source=lib/notificaciones/repository.ts:L5 | neighbors=[repository.ts, route.ts, layout.tsx]
- "notificaciones_types_notificacion": "Notificacion" | kind=code-symbol | source=lib/notificaciones/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts]
- "oficial_formulariorecorrido_formulariorecorrido": "FormularioRecorrido()" | kind=code-symbol | source=components/oficial/FormularioRecorrido.tsx:L64 | neighbors=[page.tsx, page.tsx, FormularioRecorrido.tsx]
- "oficial_mapper_rowtod1": "rowToD1()" | kind=code-symbol | source=lib/oficial/mapper.ts:L113 | neighbors=[mapper.ts, toStr(), rowToReporteDetalle()]
- "oficial_mapper_rowtodespachoasignado": "rowToDespachoAsignado()" | kind=code-symbol | source=lib/oficial/mapper.ts:L93 | neighbors=[mapper.ts, toStr(), repository.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-029.json

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
