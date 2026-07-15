# Node Description Batch 27 of 93

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

- "monitorista_types_evidenciaarchivo": "EvidenciaArchivo" | kind=code-symbol | source=lib/monitorista/types.ts:L73 | neighbors=[denuncia-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_historialentry": "HistorialEntry" | kind=code-symbol | source=lib/monitorista/types.ts:L31 | neighbors=[page.tsx, mapper.ts, repository.ts, types.ts]
- "monitorista_types_reportedetenido": "ReporteDetenido" | kind=code-symbol | source=lib/monitorista/types.ts:L93 | neighbors=[detenido-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_solicitudevidencia": "SolicitudEvidencia" | kind=code-symbol | source=lib/monitorista/types.ts:L10 | neighbors=[mapper.ts, repository.ts, types.ts, page.tsx]
- "monitorista_types_solicitudfoto": "SolicitudFoto" | kind=code-symbol | source=lib/monitorista/types.ts:L86 | neighbors=[detenido-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_turno": "Turno" | kind=code-symbol | source=lib/monitorista/types.ts:L111 | neighbors=[incidentes-camara-service.ts, mapper.ts, service.ts, types.ts]
- "notificaciones_checker_generaralertasbusquedas": "generarAlertasBusquedas()" | kind=code-symbol | source=lib/notificaciones/checker.ts:L7 | neighbors=[actions.ts, checker.ts, route.ts, layout.tsx]
- "oficial_formulariorecorrido_formulariorecorrido": "FormularioRecorrido()" | kind=code-symbol | source=components/oficial/FormularioRecorrido.tsx:L64 | neighbors=[page.tsx, DespachoContent.tsx, FormularioRecorrido.tsx, page.tsx]
- "oficial_mapper_rowtoreportecampo": "rowToReporteCampo()" | kind=code-symbol | source=lib/oficial/mapper.ts:L9 | neighbors=[mapper.ts, parseJsonField(), toStr(), rowToReporteDetalle()]
- "oficial_mapper_rowtoreportedetalle": "rowToReporteDetalle()" | kind=code-symbol | source=lib/oficial/mapper.ts:L170 | neighbors=[mapper.ts, rowToD1(), rowToReporteCampo(), repository.ts]
- "oficial_service_crearreporte": "crearReporte()" | kind=code-symbol | source=lib/oficial/service.ts:L102 | neighbors=[actions.ts, service.ts, generarFolioUnico(), num()]
- "oficial_service_obtenercatalogos": "obtenerCatalogos()" | kind=code-symbol | source=lib/oficial/service.ts:L88 | neighbors=[page.tsx, page.tsx, service.ts, page.tsx]
- "oficial_types_catalogoitem": "CatalogoItem" | kind=code-symbol | source=lib/oficial/types.ts:L222 | neighbors=[repository.ts, service.ts, types.ts, RondinPageClient.tsx]
- "oficial_types_despachoasignado": "DespachoAsignado" | kind=code-symbol | source=lib/oficial/types.ts:L149 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "oficial_types_ofidetenido": "OfiDetenido" | kind=code-symbol | source=lib/oficial/types.ts:L18 | neighbors=[mapper.ts, service.ts, store.ts, types.ts]
- "oficial_types_ofioficial": "OfiOficial" | kind=code-symbol | source=lib/oficial/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "oficial_types_ofireporteresumen": "OfiReporteResumen" | kind=code-symbol | source=lib/oficial/types.ts:L133 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "oficial_types_reportecampoparad1": "ReporteCampoParaD1" | kind=code-symbol | source=lib/oficial/types.ts:L193 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "permisos_core_guardarpermisosseccionesaction": "guardarPermisosSeccionesAction()" | kind=code-symbol | source=lib/permisos/core.ts:L165 | neighbors=[page.tsx, core.ts, guardarPermiso(), requireAdmin()]
- "permisos_core_guardarplantillaseccionesaction": "guardarPlantillaSeccionesAction()" | kind=code-symbol | source=lib/permisos/core.ts:L188 | neighbors=[core.ts, guardarPlantillaSeccion(), requireAdmin(), page.tsx]
- "permisos_core_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/permisos/core.ts:L35 | neighbors=[page.tsx, core.ts, mapaDefault(), tienePermiso()]
- "permisos_registro_modulos_por_rol": "MODULOS_POR_ROL" | kind=code-symbol | source=lib/permisos/registro.ts:L18 | neighbors=[page.tsx, registro.ts, page.tsx, page.tsx]
- "plugins_context_loader_cacheget": "cacheGet()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L79 | neighbors=[context-loader.js, cacheKey(), graphifyQuery(), graphifySummary()]
- "plugins_context_loader_cacheset": "cacheSet()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L90 | neighbors=[context-loader.js, cacheKey(), graphifyQuery(), graphifySummary()]
- "plugins_context_loader_graphifyquery": "graphifyQuery()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L179 | neighbors=[context-loader.js, cacheGet(), cacheSet(), isGraphifyAvailable()]
- "plugins_context_loader_graphifysummary": "graphifySummary()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L202 | neighbors=[context-loader.js, cacheGet(), cacheSet(), isGraphifyAvailable()]
- "prevencion_mapper_rowtomedidadetalle": "rowToMedidaDetalle()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L56 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "prevencion_mapper_rowtovisita": "rowToVisita()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L141 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "prevencion_prorrogaviewermodal": "ProrrogaViewerModal.tsx" | kind=code-symbol | source=components/prevencion/ProrrogaViewerModal.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, page.tsx, ProrrogaViewerModal(), ProrrogaViewerModalProps]
- "radio_formrondinescalado_formrondinescalado": "FormRondinEscalado()" | kind=code-symbol | source=components/911/radio/FormRondinEscalado.tsx:L32 | neighbors=[FormRondinEscalado.tsx, ahoraLocal(), page.tsx, RondinPageClient.tsx]
- "reportes_formato_n_atencion_victimas_service_obteneratencionvictimasporfechaperiodo": "obtenerAtencionVictimasPorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L64 | neighbors=[route.ts, formato-n-atencion-victimas-service.ts, rowTo(), formato-n-consolidado-service.ts]
- "reportes_formato_n_fge_service_obtenerfgeporfechaperiodo": "obtenerFgePorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L73 | neighbors=[route.ts, formato-n-consolidado-service.ts, formato-n-fge-service.ts, rowTo()]
- "reportes_formato_n_fgr_service_obtenerfgrporfechaperiodo": "obtenerFgrPorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L72 | neighbors=[route.ts, formato-n-consolidado-service.ts, formato-n-fgr-service.ts, rowTo()]
- "reportes_formato_n_medios_alternativos_service_obtenermediosalternativosporfechaperiodo": "obtenerMediosAlternativosPorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L60 | neighbors=[route.ts, formato-n-consolidado-service.ts, formato-n-medios-alternativos-service.ts, rowTo()]
- "reportes_incidentes_service_listarreportediario": "listarReporteDiario()" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L40 | neighbors=[route.ts, page.tsx, service.ts, combinar()]
- "reportes_incidentes_service_listarreportesemanal": "listarReporteSemanal()" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L47 | neighbors=[route.ts, page.tsx, service.ts, combinar()]
- "reportes_operativos_types_armarow": "ArmaRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L51 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_operativos_types_cateorow": "CateoRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L8 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_operativos_types_drogarow": "DrogaRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L58 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_operativos_types_extorsionrow": "ExtorsionRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L65 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-026.json

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
