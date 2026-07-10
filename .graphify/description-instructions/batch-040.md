# Node Description Batch 41 of 79

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

- "lib_auth_session": "Session" | kind=code-symbol | source=lib/auth.ts:L62 | neighbors=[auth.ts, proxy.ts]
- "manual_migrations_0006_formato_n_formato_n_armas_aseguradas": "formato_n_armas_aseguradas" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L78 | neighbors=[0006_formato_n.sql, public.formato_n_reportes]
- "manual_migrations_0006_formato_n_formato_n_atencion_victimas": "formato_n_atencion_victimas" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L68 | neighbors=[0006_formato_n.sql, public.formato_n_reportes]
- "manual_migrations_0006_formato_n_formato_n_eventos": "formato_n_eventos" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L12 | neighbors=[0006_formato_n.sql, public.formato_n_reportes]
- "manual_migrations_0006_formato_n_formato_n_fge": "formato_n_fge" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L23 | neighbors=[0006_formato_n.sql, public.formato_n_reportes]
- "manual_migrations_0006_formato_n_formato_n_fgr": "formato_n_fgr" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L37 | neighbors=[0006_formato_n.sql, public.formato_n_reportes]
- "manual_migrations_0006_formato_n_formato_n_medios_alternativos": "formato_n_medios_alternativos" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L60 | neighbors=[0006_formato_n.sql, public.formato_n_reportes]
- "manual_migrations_0006_formato_n_formato_n_rnd": "formato_n_rnd" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L51 | neighbors=[0006_formato_n.sql, public.formato_n_reportes]
- "manual_migrations_0008_monitorista_permisos_monitorista_permisos": "monitorista_permisos" | kind=code-symbol | source=lib/db/manual-migrations/0008_monitorista_permisos.sql:L1 | neighbors=[0008_monitorista_permisos.sql, users]
- "manual_migrations_0008_monitorista_permisos_users": "users" | kind=code-symbol | source=lib/db/manual-migrations/0008_monitorista_permisos.sql:L3 | neighbors=[0008_monitorista_permisos.sql, monitorista_permisos]
- "manual_migrations_0011_permisos_plantillas_permisos_plantillas": "permisos_plantillas" | kind=code-symbol | source=lib/db/manual-migrations/0011_permisos_plantillas.sql:L4 | neighbors=[0011_permisos_plantillas.sql, roles]
- "manual_migrations_0011_permisos_plantillas_roles": "roles" | kind=code-symbol | source=lib/db/manual-migrations/0011_permisos_plantillas.sql:L6 | neighbors=[0011_permisos_plantillas.sql, permisos_plantillas]
- "modulo_incidentes_reportestabs_reportestabs": "ReportesTabs()" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportesTabs.tsx:L10 | neighbors=[page.tsx, ReportesTabs.tsx]
- "modulo_incidentes_reportfilters_reportfilters": "ReportFilters()" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportFilters.tsx:L7 | neighbors=[page.tsx, ReportFilters.tsx]
- "modulo_incidentes_reporttables_operationaltable": "OperationalTable()" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportTables.tsx:L12 | neighbors=[ReportesTabs.tsx, ReportTables.tsx]
- "monitorista_actions_cancelarsolicitud": "cancelarSolicitud()" | kind=code-symbol | source=lib/monitorista/actions.ts:L77 | neighbors=[actions.ts, requireMonitorista()]
- "monitorista_actions_completarsolicitud": "completarSolicitud()" | kind=code-symbol | source=lib/monitorista/actions.ts:L64 | neighbors=[actions.ts, requireMonitorista()]
- "monitorista_actions_subirevidencia": "subirEvidencia()" | kind=code-symbol | source=lib/monitorista/actions.ts:L35 | neighbors=[actions.ts, requireMonitorista()]
- "monitorista_bandejasolicitudes_tabstyle": "tabStyle()" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L130 | neighbors=[BandejaSolicitudes.tsx, BandejaSolicitudes()]
- "monitorista_batchenviofotos_batchenviofotos": "BatchEnvioFotos()" | kind=code-symbol | source=components/monitorista/BatchEnvioFotos.tsx:L9 | neighbors=[page.tsx, BatchEnvioFotos.tsx]
- "monitorista_botongenerarppt_botongenerarppt": "BotonGenerarPpt()" | kind=code-symbol | source=components/monitorista/BotonGenerarPpt.tsx:L7 | neighbors=[page.tsx, BotonGenerarPpt.tsx]
- "monitorista_botonsubirdenuncia_botonsubirdenuncia": "BotonSubirDenuncia()" | kind=code-symbol | source=components/monitorista/BotonSubirDenuncia.tsx:L10 | neighbors=[page.tsx, BotonSubirDenuncia.tsx]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-040.json

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
