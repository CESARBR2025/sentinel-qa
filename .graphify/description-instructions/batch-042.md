# Node Description Batch 43 of 87

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

- "incidentes_service_listarconfiltros": "listarConFiltros()" | kind=code-symbol | source=lib/incidentes/service.ts:L15 | neighbors=[page.tsx, service.ts]
- "incidentes_service_obtenerhistorialcompleto": "obtenerHistorialCompleto()" | kind=code-symbol | source=lib/incidentes/service.ts:L19 | neighbors=[page.tsx, service.ts]
- "incidentes_statincidencia_incidentestat": "IncidenteStat()" | kind=code-symbol | source=components/reportes/incidentes/StatIncidencia.tsx:L3 | neighbors=[StatIncidencia.tsx, page.tsx]
- "incidentes_tablaincidentes_tablaincidentes": "TablaIncidentes()" | kind=code-symbol | source=components/reportes/incidentes/TablaIncidentes.tsx:L23 | neighbors=[TablaIncidentes.tsx, page.tsx]
- "incidentes_types_despachodetalleresponse": "DespachoDetalleResponse" | kind=code-symbol | source=lib/incidentes/types.ts:L202 | neighbors=[mapper.ts, types.ts]
- "incidentes_types_reportedetalleresponse": "ReporteDetalleResponse" | kind=code-symbol | source=lib/incidentes/types.ts:L236 | neighbors=[mapper.ts, types.ts]
- "infracciones_actions_eliminarinfraccionaction": "eliminarInfraccionAction()" | kind=code-symbol | source=features/via/infracciones/actions.ts:L5 | neighbors=[FormularioInfraccion.tsx, actions.ts]
- "infracciones_mapper_mapcrearinfracciontodb": "mapCrearInfraccionToDB()" | kind=code-symbol | source=features/via/infracciones/mapper.ts:L3 | neighbors=[mapper.ts, service.ts]
- "infracciones_mapper_mapinfracciondetalle": "mapInfraccionDetalle()" | kind=code-symbol | source=features/via/infracciones/mapper.ts:L54 | neighbors=[mapper.ts, service.ts]
- "infracciones_service_infraccionesservice_registrarnuevainfraccionsv": ".registrarNuevaInfraccionSV()" | kind=code-symbol | source=features/via/infracciones/service.ts:L33 | neighbors=[InfraccionesService, generarFolioInfraccion()]
- "infracciones_service_randombase36char": "randomBase36Char()" | kind=code-symbol | source=features/via/infracciones/service.ts:L7 | neighbors=[service.ts, rellenarBase36()]
- "infracciones_service_sanitizecrearinfraccionpayload": "sanitizeCrearInfraccionPayload()" | kind=code-symbol | source=features/via/infracciones/service.ts:L69 | neighbors=[service.ts, route.ts]
- "infracciones_types_infracciondb": "InfraccionDB" | kind=code-symbol | source=features/via/infracciones/types.ts:L45 | neighbors=[repository.ts, types.ts]
- "infracciones_types_infracciondetalledto": "InfraccionDetalleDTO" | kind=code-symbol | source=features/via/infracciones/types.ts:L94 | neighbors=[mapper.ts, types.ts]
- "infracciones_types_viewarticuloslista": "ViewArticulosLista" | kind=code-symbol | source=features/via/infracciones/types.ts:L179 | neighbors=[FormularioInfraccion.tsx, types.ts]
- "legalidad_actions_obtenerarticulosaction": "obtenerArticulosAction()" | kind=code-symbol | source=features/via/legalidad/actions.ts:L5 | neighbors=[FormularioInfraccion.tsx, actions.ts]
- "legalidad_actions_obtenerfraccionesaction": "obtenerFraccionesAction()" | kind=code-symbol | source=features/via/legalidad/actions.ts:L10 | neighbors=[actions.ts, SeccionMotivo.tsx]
- "legalidad_types_articuloley": "ArticuloLey" | kind=code-symbol | source=features/via/legalidad/types.ts:L11 | neighbors=[mapper.ts, types.ts]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-042.json

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
