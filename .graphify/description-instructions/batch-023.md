# Node Description Batch 24 of 82

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

- "incidentes_mapper_rowtopersonaafectada": "rowToPersonaAfectada()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L92 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "legalidad_repository_articulosrepository": "ArticulosRepository" | kind=code-symbol | source=features/via/legalidad/repository.ts:L3 | neighbors=[repository.ts, .obtenerArticulos(), .obtenerFraccionesPorArticulo(), service.ts]
- "manual_migrations_0009_rename_permisos": "0009_rename_permisos.sql" | kind=code-symbol | source=lib/db/manual-migrations/0009_rename_permisos.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…]
- "manual_migrations_0010_permisos_seccion_libre": "0010_permisos_seccion_libre.sql" | kind=code-symbol | source=lib/db/manual-migrations/0010_permisos_seccion_libre.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…]
- "manual_migrations_0012_permisos_eliminar": "0012_permisos_eliminar.sql" | kind=code-symbol | source=lib/db/manual-migrations/0012_permisos_eliminar.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…]
- "monitorista_actions_requiremonitorista": "requireMonitorista()" | kind=code-symbol | source=lib/monitorista/actions.ts:L11 | neighbors=[actions.ts, cancelarSolicitud(), completarSolicitud(), subirEvidencia()]
- "monitorista_mapper_parsesolicitudesjson": "parseSolicitudesJson()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L31 | neighbors=[mapper.ts, rowToDenunciaDetalle(), repository.ts, service.ts]
- "monitorista_ppt_service_generarppt": "generarPpt()" | kind=code-symbol | source=lib/monitorista/ppt-service.ts:L75 | neighbors=[route.ts, ppt-service.ts, getAspectRatio(), parseDetenidos()]
- "monitorista_service_getdestinos": "getDestinos()" | kind=code-symbol | source=lib/monitorista/service.ts:L85 | neighbors=[route.ts, page.tsx, detenido-service.ts, service.ts]
- "monitorista_types_denunciadetalle": "DenunciaDetalle" | kind=code-symbol | source=lib/monitorista/types.ts:L55 | neighbors=[denuncia-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_dependencia": "Dependencia" | kind=code-symbol | source=lib/monitorista/types.ts:L80 | neighbors=[detenido-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_evidenciaarchivo": "EvidenciaArchivo" | kind=code-symbol | source=lib/monitorista/types.ts:L73 | neighbors=[denuncia-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_historialentry": "HistorialEntry" | kind=code-symbol | source=lib/monitorista/types.ts:L31 | neighbors=[page.tsx, mapper.ts, repository.ts, types.ts]
- "monitorista_types_reportedetenido": "ReporteDetenido" | kind=code-symbol | source=lib/monitorista/types.ts:L93 | neighbors=[detenido-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_solicitudevidencia": "SolicitudEvidencia" | kind=code-symbol | source=lib/monitorista/types.ts:L10 | neighbors=[mapper.ts, repository.ts, types.ts, page.tsx]
- "monitorista_types_solicitudfoto": "SolicitudFoto" | kind=code-symbol | source=lib/monitorista/types.ts:L86 | neighbors=[detenido-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_turno": "Turno" | kind=code-symbol | source=lib/monitorista/types.ts:L111 | neighbors=[incidentes-camara-service.ts, mapper.ts, service.ts, types.ts]
- "notificaciones_checker_generaralertasbusquedas": "generarAlertasBusquedas()" | kind=code-symbol | source=lib/notificaciones/checker.ts:L7 | neighbors=[actions.ts, checker.ts, route.ts, layout.tsx]
- "notificaciones_types": "types.ts" | kind=code-symbol | source=lib/notificaciones/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, Notificacion]
- "oficial_mapper_rowtoreportecampo": "rowToReporteCampo()" | kind=code-symbol | source=lib/oficial/mapper.ts:L9 | neighbors=[mapper.ts, parseJsonField(), toStr(), rowToReporteDetalle()]
- "oficial_mapper_rowtoreportedetalle": "rowToReporteDetalle()" | kind=code-symbol | source=lib/oficial/mapper.ts:L111 | neighbors=[mapper.ts, rowToD1(), rowToReporteCampo(), repository.ts]
- "oficial_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/oficial/mapper.ts:L64 | neighbors=[mapper.ts, rowToD1(), rowToReporteCampo(), rowToReporteResumen()]
- "oficial_service_crearreporte": "crearReporte()" | kind=code-symbol | source=lib/oficial/service.ts:L94 | neighbors=[actions.ts, service.ts, generarFolioUnico(), num()]
- "oficial_toastexito_toastexito": "ToastExito()" | kind=code-symbol | source=components/oficial/ToastExito.tsx:L6 | neighbors=[page.tsx, page.tsx, page.tsx, ToastExito.tsx]
- "oficial_types_ofidetenido": "OfiDetenido" | kind=code-symbol | source=lib/oficial/types.ts:L18 | neighbors=[mapper.ts, service.ts, store.ts, types.ts]
- "oficial_types_ofioficial": "OfiOficial" | kind=code-symbol | source=lib/oficial/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "oficial_types_ofireporteresumen": "OfiReporteResumen" | kind=code-symbol | source=lib/oficial/types.ts:L123 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "permisos_core_guardarpermisosseccionesaction": "guardarPermisosSeccionesAction()" | kind=code-symbol | source=lib/permisos/core.ts:L161 | neighbors=[page.tsx, core.ts, guardarPermiso(), requireAdmin()]
- "permisos_core_guardarplantillaseccionesaction": "guardarPlantillaSeccionesAction()" | kind=code-symbol | source=lib/permisos/core.ts:L184 | neighbors=[core.ts, guardarPlantillaSeccion(), requireAdmin(), page.tsx]
- "permisos_core_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/permisos/core.ts:L32 | neighbors=[page.tsx, core.ts, mapaDefault(), tienePermiso()]
- "permisos_registro_modulos_por_rol": "MODULOS_POR_ROL" | kind=code-symbol | source=lib/permisos/registro.ts:L18 | neighbors=[page.tsx, registro.ts, page.tsx, page.tsx]
- "prevencion_mapper_rowtomedidadetalle": "rowToMedidaDetalle()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L55 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "prevencion_mapper_rowtovisita": "rowToVisita()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L140 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "prevencion_prorrogaviewermodal": "ProrrogaViewerModal.tsx" | kind=code-symbol | source=components/prevencion/ProrrogaViewerModal.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, page.tsx, ProrrogaViewerModal(), ProrrogaViewerModalProps]
- "reportes_formato_n_atencion_victimas_service_obteneratencionvictimasporfechaperiodo": "obtenerAtencionVictimasPorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L64 | neighbors=[route.ts, formato-n-atencion-victimas-service.ts, rowTo(), formato-n-consolidado-service.ts]
- "reportes_formato_n_fge_service_obtenerfgeporfechaperiodo": "obtenerFgePorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L73 | neighbors=[route.ts, formato-n-consolidado-service.ts, formato-n-fge-service.ts, rowTo()]
- "reportes_formato_n_fgr_service_obtenerfgrporfechaperiodo": "obtenerFgrPorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L72 | neighbors=[route.ts, formato-n-consolidado-service.ts, formato-n-fgr-service.ts, rowTo()]
- "reportes_formato_n_medios_alternativos_service_obtenermediosalternativosporfechaperiodo": "obtenerMediosAlternativosPorFechaPeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L60 | neighbors=[route.ts, formato-n-consolidado-service.ts, formato-n-medios-alternativos-service.ts, rowTo()]
- "reportes_incidentes_service_listarreportediario": "listarReporteDiario()" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L40 | neighbors=[route.ts, page.tsx, service.ts, combinar()]
- "reportes_incidentes_service_listarreportesemanal": "listarReporteSemanal()" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L47 | neighbors=[route.ts, page.tsx, service.ts, combinar()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-023.json

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
