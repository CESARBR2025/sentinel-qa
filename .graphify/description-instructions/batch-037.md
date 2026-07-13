# Node Description Batch 38 of 86

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

- "agente_liberaciones_service_verificarrolliberaciones": "verificarRolLiberaciones()" | kind=code-symbol | source=lib/agente_liberaciones/service.ts:L5 | neighbors=[actions.ts, service.ts]
- "agente_liberaciones_types_liberacionesresponse": "LiberacionesResponse" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L24 | neighbors=[actions.ts, types.ts]
- "agente_liberaciones_types_rolrow": "RolRow" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L7 | neighbors=[repository.ts, types.ts]
- "agente_liberaciones_types_userinfo": "UserInfo" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L1 | neighbors=[actions.ts, types.ts]
- "analisis_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/analisis/permisos.ts:L4 | neighbors=[permisos.ts, registro.ts]
- "auth_helpers_rowtouserwithrole": "rowToUserWithRole()" | kind=code-symbol | source=lib/auth/helpers.ts:L13 | neighbors=[helpers.ts, getUserWithRole()]
- "auxiliar_actions_requireauxiliar": "requireAuxiliar()" | kind=code-symbol | source=lib/auxiliar/actions.ts:L10 | neighbors=[actions.ts, upsertChecklistAction()]
- "auxiliar_permisos_accion": "Accion" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L6 | neighbors=[actions.ts, permisos.ts]
- "auxiliar_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L4 | neighbors=[permisos.ts, registro.ts]
- "auxiliar_profiledropdownauxiliar_profiledropdownauxiliar": "ProfileDropdownAuxiliar()" | kind=code-symbol | source=components/auxiliar/ProfileDropdownAuxiliar.tsx:L14 | neighbors=[page.tsx, ProfileDropdownAuxiliar.tsx]
- "auxiliar_repository_obtenercuestionariosrobo": "obtenerCuestionariosRobo()" | kind=code-symbol | source=lib/auxiliar/repository.ts:L47 | neighbors=[repository.ts, service.ts]
- "auxiliar_repository_obtenerparesreporte": "obtenerParesReporte()" | kind=code-symbol | source=lib/auxiliar/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "auxiliar_repository_upsertchecklist": "upsertChecklist()" | kind=code-symbol | source=lib/auxiliar/repository.ts:L72 | neighbors=[repository.ts, service.ts]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-037.json

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
