# Node Description Batch 41 of 93

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

- "auxiliar_service_guardarchecklist": "guardarChecklist()" | kind=code-symbol | source=lib/auxiliar/service.ts:L13 | neighbors=[actions.ts, service.ts]
- "camara_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/camara/mapper.ts:L9 | neighbors=[mapper.ts, rowToIncidenteCamara()]
- "camara_mapper_tonumnullable": "toNumNullable()" | kind=code-symbol | source=lib/camara/mapper.ts:L15 | neighbors=[mapper.ts, rowToTotalesCamara()]
- "camara_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/camara/mapper.ts:L3 | neighbors=[mapper.ts, rowToIncidenteCamara()]
- "camara_repository_obtenerconcentradodiario": "obtenerConcentradoDiario()" | kind=code-symbol | source=lib/camara/repository.ts:L68 | neighbors=[repository.ts, route.ts]
- "camara_repository_obtenerincidentescamara": "obtenerIncidentesCamara()" | kind=code-symbol | source=lib/camara/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "camara_repository_obtenerporturno": "obtenerPorTurno()" | kind=code-symbol | source=lib/camara/repository.ts:L54 | neighbors=[repository.ts, route.ts]
- "camara_service_listarincidentescamara": "listarIncidentesCamara()" | kind=code-symbol | source=lib/camara/service.ts:L5 | neighbors=[service.ts, page.tsx]
- "complementos_repository_listargruasactivas": "listarGruasActivas()" | kind=code-symbol | source=lib/complementos/repository.ts:L9 | neighbors=[repository.ts, route.ts]
- "components_capturardatostitularsection_isnodata": "isNoData()" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L29 | neighbors=[CapturarDatosTitularSection.tsx, TitularForm()]
- "components_capturardatostitularsection_titularform": "TitularForm()" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L47 | neighbors=[CapturarDatosTitularSection.tsx, isNoData()]
- "components_filadetenidorol_filadetenidorol": "FilaDetenidoRol()" | kind=code-symbol | source=components/FilaDetenidoRol.tsx:L5 | neighbors=[FilaDetenidoRol.tsx, page.tsx]
- "components_mapadireccionregistro_extractaddress": "extractAddress()" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L111 | neighbors=[MapaDireccionRegistro.tsx, extractNeighborhoodFromComponents()]
- "components_mapadireccionregistro_getmunicipioestado": "getMunicipioEstado()" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L125 | neighbors=[MapaDireccionRegistro.tsx, normalizeUpper()]
- "components_mapadireccionregistro_mapadireccionregistro": "MapaDireccionRegistro()" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L141 | neighbors=[MapaDireccionRegistro.tsx, PasoUbicacion.tsx]
- "components_modalentregargarantia_getgarantiainfo": "getGarantiaInfo()" | kind=code-symbol | source=features/via/infracciones/components/ModalEntregarGarantia.tsx:L14 | neighbors=[ModalEntregarGarantia.tsx, ModalEntregarGarantia()]
- "components_modalentregargarantia_modalentregargarantia": "ModalEntregarGarantia()" | kind=code-symbol | source=features/via/infracciones/components/ModalEntregarGarantia.tsx:L22 | neighbors=[ModalEntregarGarantia.tsx, getGarantiaInfo()]
- "components_seccionliberacion_getestatusconfig": "getEstatusConfig()" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L87 | neighbors=[SeccionLiberacion.tsx, SeccionLiberacion()]
- "components_seccionliberacion_seccionliberacion": "SeccionLiberacion()" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L136 | neighbors=[SeccionLiberacion.tsx, getEstatusConfig()]
- "corralon_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/corralon/mapper.ts:L3 | neighbors=[mapper.ts, rowToSolicitud()]
- "corralon_module_card_modulecard": "ModuleCard()" | kind=code-symbol | source=app/corralon/module-card.tsx:L6 | neighbors=[module-card.tsx, page.tsx]
- "corralon_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/corralon/permisos.ts:L3 | neighbors=[permisos.ts, registro.ts]
- "corralon_repository_finalizarinfraccioncorralon": "finalizarInfraccionCorralon()" | kind=code-symbol | source=lib/corralon/repository.ts:L35 | neighbors=[repository.ts, route.ts]
- "corralon_repository_obtenerestatusinfraccion": "obtenerEstatusInfraccion()" | kind=code-symbol | source=lib/corralon/repository.ts:L27 | neighbors=[repository.ts, route.ts]
- "corralon_repository_obtenersolicitudesfinalizadas": "obtenerSolicitudesFinalizadas()" | kind=code-symbol | source=lib/corralon/repository.ts:L47 | neighbors=[repository.ts, service.ts]
- "corralon_repository_obtenersolicitudespendientes": "obtenerSolicitudesPendientes()" | kind=code-symbol | source=lib/corralon/repository.ts:L3 | neighbors=[repository.ts, service.ts]
- "corralon_service_listarsolicitudesfinalizadas": "listarSolicitudesFinalizadas()" | kind=code-symbol | source=lib/corralon/service.ts:L10 | neighbors=[actions.ts, service.ts]
- "corralon_service_listarsolicitudespendientes": "listarSolicitudesPendientes()" | kind=code-symbol | source=lib/corralon/service.ts:L5 | neighbors=[actions.ts, service.ts]
- "corralon_types_tabsolicitudes": "TabSolicitudes" | kind=code-symbol | source=lib/corralon/types.ts:L24 | neighbors=[types.ts, solicitudes-client.tsx]
- "corralon_types_userinfo": "UserInfo" | kind=code-symbol | source=lib/corralon/types.ts:L1 | neighbors=[actions.ts, types.ts]
- "d1_d1filters_d1filters": "D1Filters()" | kind=code-symbol | source=components/reportes/d1/D1Filters.tsx:L7 | neighbors=[D1Filters.tsx, page.tsx]
- "d1_d1pagination_d1pagination": "D1Pagination()" | kind=code-symbol | source=components/reportes/d1/D1Pagination.tsx:L14 | neighbors=[D1Pagination.tsx, D1ReportsTable.tsx]
- "d1_d1reportstable_d1reportstable": "D1ReportsTable()" | kind=code-symbol | source=components/reportes/d1/D1ReportsTable.tsx:L7 | neighbors=[D1ReportsTable.tsx, page.tsx]
- "d1_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/d1/mapper.ts:L15 | neighbors=[mapper.ts, rowToReporteD1()]
- "d1_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/d1/mapper.ts:L9 | neighbors=[mapper.ts, rowToReporteD1()]
- "d1_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/d1/mapper.ts:L3 | neighbors=[mapper.ts, rowToReporteD1()]
- "d1_noiniciada_descargafilters_descargafilters": "DescargaFilters()" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaFilters.tsx:L7 | neighbors=[DescargaFilters.tsx, page.tsx]
- "d1_noiniciada_descargapagination_descargapagination": "DescargaPagination()" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaPagination.tsx:L13 | neighbors=[DescargaPagination.tsx, DescargaTable.tsx]
- "d1_noiniciada_descargatable_descargatable": "DescargaTable()" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaTable.tsx:L7 | neighbors=[DescargaTable.tsx, page.tsx]
- "d1_repository_insertarreportedenuncia": "insertarReporteDenuncia()" | kind=code-symbol | source=lib/d1/repository.ts:L27 | neighbors=[repository.ts, route.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-040.json

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
