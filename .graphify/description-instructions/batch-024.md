# Node Description Batch 25 of 86

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

- "monitorista_types_solicitudevidencia": "SolicitudEvidencia" | kind=code-symbol | source=lib/monitorista/types.ts:L10 | neighbors=[mapper.ts, repository.ts, types.ts, page.tsx]
- "monitorista_types_solicitudfoto": "SolicitudFoto" | kind=code-symbol | source=lib/monitorista/types.ts:L86 | neighbors=[detenido-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_turno": "Turno" | kind=code-symbol | source=lib/monitorista/types.ts:L111 | neighbors=[incidentes-camara-service.ts, mapper.ts, service.ts, types.ts]
- "notificaciones_checker_generaralertasbusquedas": "generarAlertasBusquedas()" | kind=code-symbol | source=lib/notificaciones/checker.ts:L7 | neighbors=[actions.ts, checker.ts, route.ts, layout.tsx]
- "notificaciones_types": "types.ts" | kind=code-symbol | source=lib/notificaciones/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, Notificacion]
- "oficial_mapper_rowtoreportecampo": "rowToReporteCampo()" | kind=code-symbol | source=lib/oficial/mapper.ts:L9 | neighbors=[mapper.ts, parseJsonField(), toStr(), rowToReporteDetalle()]
- "oficial_mapper_rowtoreportedetalle": "rowToReporteDetalle()" | kind=code-symbol | source=lib/oficial/mapper.ts:L137 | neighbors=[mapper.ts, rowToD1(), rowToReporteCampo(), repository.ts]
- "oficial_service_crearreporte": "crearReporte()" | kind=code-symbol | source=lib/oficial/service.ts:L97 | neighbors=[actions.ts, service.ts, generarFolioUnico(), num()]
- "oficial_service_obtenercatalogos": "obtenerCatalogos()" | kind=code-symbol | source=lib/oficial/service.ts:L83 | neighbors=[page.tsx, page.tsx, service.ts, page.tsx]
- "oficial_toastexito_toastexito": "ToastExito()" | kind=code-symbol | source=components/oficial/ToastExito.tsx:L6 | neighbors=[page.tsx, page.tsx, page.tsx, ToastExito.tsx]
- "oficial_types_despachoasignado": "DespachoAsignado" | kind=code-symbol | source=lib/oficial/types.ts:L149 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "oficial_types_ofidetenido": "OfiDetenido" | kind=code-symbol | source=lib/oficial/types.ts:L18 | neighbors=[mapper.ts, service.ts, store.ts, types.ts]
- "oficial_types_ofioficial": "OfiOficial" | kind=code-symbol | source=lib/oficial/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "oficial_types_ofireporteresumen": "OfiReporteResumen" | kind=code-symbol | source=lib/oficial/types.ts:L133 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "permisos_core_guardarpermisosseccionesaction": "guardarPermisosSeccionesAction()" | kind=code-symbol | source=lib/permisos/core.ts:L161 | neighbors=[page.tsx, core.ts, guardarPermiso(), requireAdmin()]
- "permisos_core_guardarplantillaseccionesaction": "guardarPlantillaSeccionesAction()" | kind=code-symbol | source=lib/permisos/core.ts:L184 | neighbors=[core.ts, guardarPlantillaSeccion(), requireAdmin(), page.tsx]
- "permisos_core_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/permisos/core.ts:L32 | neighbors=[page.tsx, core.ts, mapaDefault(), tienePermiso()]
- "permisos_registro_modulos_por_rol": "MODULOS_POR_ROL" | kind=code-symbol | source=lib/permisos/registro.ts:L18 | neighbors=[page.tsx, registro.ts, page.tsx, page.tsx]
- "prevencion_mapper_rowtomedidadetalle": "rowToMedidaDetalle()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L56 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "prevencion_mapper_rowtovisita": "rowToVisita()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L141 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "prevencion_prorrogaviewermodal": "ProrrogaViewerModal.tsx" | kind=code-symbol | source=components/prevencion/ProrrogaViewerModal.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, page.tsx, ProrrogaViewerModal(), ProrrogaViewerModalProps]
- "reportes_formato_n_atencion_victimas_service_obteneratencionvictimasporfechaperiodo": "obtenerAtencionVictimasPorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L64 | neighbors=[route.ts, formato-n-atencion-victimas-service.ts, rowTo(), formato-n-consolidado-service.ts]
- "reportes_formato_n_fge_service_obtenerfgeporfechaperiodo": "obtenerFgePorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L73 | neighbors=[route.ts, formato-n-consolidado-service.ts, formato-n-fge-service.ts, rowTo()]
- "reportes_formato_n_fgr_service_obtenerfgrporfechaperiodo": "obtenerFgrPorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L72 | neighbors=[route.ts, formato-n-consolidado-service.ts, formato-n-fgr-service.ts, rowTo()]
- "reportes_formato_n_medios_alternativos_service_obtenermediosalternativosporfechaperiodo": "obtenerMediosAlternativosPorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L60 | neighbors=[route.ts, formato-n-consolidado-service.ts, formato-n-medios-alternativos-service.ts, rowTo()]
- "reportes_incidentes_service_listarreportediario": "listarReporteDiario()" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L40 | neighbors=[route.ts, page.tsx, service.ts, combinar()]
- "reportes_incidentes_service_listarreportesemanal": "listarReporteSemanal()" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L47 | neighbors=[route.ts, page.tsx, service.ts, combinar()]
- "reportes_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, toBool(), toNum(), toStr()]
- "reportes_operativos_types_armarow": "ArmaRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L51 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_operativos_types_cateorow": "CateoRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L8 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_operativos_types_drogarow": "DrogaRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L58 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_operativos_types_extorsionrow": "ExtorsionRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L65 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_operativos_types_hidrocarburorow": "HidrocarburoRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L44 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_operativos_types_ordenaprehensionrow": "OrdenAprehensionRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L37 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_operativos_types_vehiculorow": "VehiculoRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_sin_d1_types_sind1row": "SinD1Row" | kind=code-symbol | source=lib/reportes-sin-d1/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "reportes_sin_novedad_types_sinnovedadrow": "SinNovedadRow" | kind=code-symbol | source=lib/reportes-sin-novedad/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "rol_servicios_mapper_rowtoestadofuerzaconcepto": "rowToEstadoFuerzaConcepto()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L123 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "rol_servicios_mapper_rowtoradio": "rowToRadio()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L104 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "rol_servicios_mapper_rowtorolasignacion": "rowToRolAsignacion()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L59 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-024.json

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
