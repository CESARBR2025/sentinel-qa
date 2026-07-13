# Node Description Batch 42 of 84

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

- "incidentes_permisos_accion": "Accion" | kind=code-symbol | source=lib/incidentes/permisos.ts:L6 | neighbors=[actions.ts, permisos.ts]
- "incidentes_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/incidentes/permisos.ts:L4 | neighbors=[permisos.ts, registro.ts]
- "incidentes_repository_insertarreportecampo": "insertarReporteCampo()" | kind=code-symbol | source=lib/incidentes/repository.ts:L164 | neighbors=[repository.ts, service.ts]
- "incidentes_repository_listarincidentesatendidos": "listarIncidentesAtendidos()" | kind=code-symbol | source=lib/incidentes/repository.ts:L30 | neighbors=[route.ts, repository.ts]
- "incidentes_repository_listarincidentesendespacho": "listarIncidentesEnDespacho()" | kind=code-symbol | source=lib/incidentes/repository.ts:L59 | neighbors=[route.ts, repository.ts]
- "incidentes_repository_listarincidentespendientesdespacho": "listarIncidentesPendientesDespacho()" | kind=code-symbol | source=lib/incidentes/repository.ts:L82 | neighbors=[repository.ts, route.ts]
- "incidentes_repository_tostr": "toStr()" | kind=code-symbol | source=lib/incidentes/repository.ts:L5 | neighbors=[repository.ts, obtenerDespachoDeIncidente()]
- "incidentes_repository_verificarreportecampo": "verificarReporteCampo()" | kind=code-symbol | source=lib/incidentes/repository.ts:L288 | neighbors=[repository.ts, service.ts]
- "incidentes_service_crearreportecampo": "crearReporteCampo()" | kind=code-symbol | source=lib/incidentes/service.ts:L90 | neighbors=[actions.ts, service.ts]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-041.json

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
