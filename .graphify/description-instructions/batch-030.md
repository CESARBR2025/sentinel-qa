# Node Description Batch 31 of 87

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

- "oficial_service_generarfoliounico": "generarFolioUnico()" | kind=code-symbol | source=lib/oficial/service.ts:L54 | neighbors=[service.ts, crearReporte(), generarFolio()]
- "oficial_service_listardespachosasignados": "listarDespachosAsignados()" | kind=code-symbol | source=lib/oficial/service.ts:L210 | neighbors=[page.tsx, page.tsx, service.ts]
- "oficial_service_obtenermiperfil": "obtenerMiPerfil()" | kind=code-symbol | source=lib/oficial/service.ts:L79 | neighbors=[page.tsx, service.ts, page.tsx]
- "oficial_store_useoficialformstore": "useOficialFormStore" | kind=code-symbol | source=lib/oficial/store.ts:L137 | neighbors=[FormularioD1.tsx, FormularioRecorrido.tsx, store.ts]
- "oficial_types_catalogoitem": "CatalogoItem" | kind=code-symbol | source=lib/oficial/types.ts:L193 | neighbors=[repository.ts, service.ts, types.ts]
- "oficial_types_crearreportecampoinput": "CrearReporteCampoInput" | kind=code-symbol | source=lib/oficial/types.ts:L79 | neighbors=[repository.ts, service.ts, types.ts]
- "oficial_types_ofireportecampo": "OfiReporteCampo" | kind=code-symbol | source=lib/oficial/types.ts:L40 | neighbors=[mapper.ts, types.ts, OfiReporteDetalle]
- "permisos_core_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/permisos/core.ts:L78 | neighbors=[core.ts, aplicarPlantillaRol(), guardarPermisosSeccionesAction()]
- "permisos_core_mapadefault": "mapaDefault()" | kind=code-symbol | source=lib/permisos/core.ts:L24 | neighbors=[core.ts, obtenerPermisosUsuario(), obtenerPlantillaRol()]
- "permisos_core_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/permisos/core.ts:L92 | neighbors=[core.ts, mapaDefault(), page.tsx]
- "permisos_core_requireadmin": "requireAdmin()" | kind=code-symbol | source=lib/permisos/core.ts:L149 | neighbors=[core.ts, guardarPermisosSeccionesAction(), guardarPlantillaSeccionesAction()]
- "prevencion_actions_addautoridadmedida": "addAutoridadMedida()" | kind=code-symbol | source=lib/prevencion/actions.ts:L72 | neighbors=[actions.ts, requireAcceso(), AgregarAutoridadForm.tsx]
- "prevencion_actions_cancelarficha": "cancelarFicha()" | kind=code-symbol | source=lib/prevencion/actions.ts:L188 | neighbors=[actions.ts, requireAcceso(), CancelacionModal.tsx]
- "prevencion_actions_createcontestacion": "createContestacion()" | kind=code-symbol | source=lib/prevencion/actions.ts:L256 | neighbors=[actions.ts, requireAcceso(), ContestacionForm.tsx]
- "prevencion_actions_createficha": "createFicha()" | kind=code-symbol | source=lib/prevencion/actions.ts:L130 | neighbors=[page.tsx, actions.ts, requireAcceso()]
- "prevencion_actions_createmedida": "createMedida()" | kind=code-symbol | source=lib/prevencion/actions.ts:L21 | neighbors=[page.tsx, actions.ts, requireAcceso()]
- "prevencion_actions_createprorroga": "createProrroga()" | kind=code-symbol | source=lib/prevencion/actions.ts:L89 | neighbors=[actions.ts, requireAcceso(), ProrrogaModal.tsx]
- "prevencion_actions_createseguimiento": "createSeguimiento()" | kind=code-symbol | source=lib/prevencion/actions.ts:L162 | neighbors=[actions.ts, requireAcceso(), SeguimientoTimeline.tsx]
- "prevencion_actions_createsolicitud": "createSolicitud()" | kind=code-symbol | source=lib/prevencion/actions.ts:L209 | neighbors=[page.tsx, actions.ts, requireAcceso()]
- "prevencion_actions_createsolicitudc4": "createSolicitudC4()" | kind=code-symbol | source=lib/prevencion/actions.ts:L238 | neighbors=[actions.ts, requireAcceso(), SolicitudC4Form.tsx]
- "prevencion_actions_createvisita": "createVisita()" | kind=code-symbol | source=lib/prevencion/actions.ts:L53 | neighbors=[actions.ts, requireAcceso(), VisitaModal.tsx]
- "prevencion_mapper_rowtoautoridadadicional": "rowToAutoridadAdicional()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L154 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_rowtocontestacion": "rowToContestacion()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L127 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_rowtofichabusquedadetalle": "rowToFichaBusquedaDetalle()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L84 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_rowtoseguimiento": "rowToSeguimiento()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L104 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_rowtosolicitud": "rowToSolicitud()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L40 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_rowtosolicitudc4": "rowToSolicitudC4()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L116 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L9 | neighbors=[mapper.ts, rowToMedidaDetalle(), rowToVisita()]
- "prevencion_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/prevencion/permisos.ts:L5 | neighbors=[registro.ts, actions.ts, permisos.ts]
- "prevencion_printbutton": "PrintButton.tsx" | kind=code-symbol | source=components/prevencion/PrintButton.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, PrintButton()]
- "prevencion_repository_obtenerfichabusqueda": "obtenerFichaBusqueda()" | kind=code-symbol | source=lib/prevencion/repository.ts:L101 | neighbors=[page.tsx, page.tsx, repository.ts]
- "prevencion_semaforo_calcularsemaforovigencia": "calcularSemaforoVigencia()" | kind=code-symbol | source=lib/prevencion/semaforo.ts:L5 | neighbors=[page.tsx, page.tsx, semaforo.ts]
- "prevencion_semaforovigencia_semaforovigencia": "SemaforoVigencia()" | kind=code-symbol | source=components/prevencion/SemaforoVigencia.tsx:L10 | neighbors=[page.tsx, page.tsx, SemaforoVigencia.tsx]
- "prevencion_timeline_calcularfechaesperada": "calcularFechaEsperada()" | kind=code-symbol | source=lib/prevencion/timeline.ts:L18 | neighbors=[checker.ts, SeguimientoTimeline.tsx, timeline.ts]
- "prevencion_timeline_getlabelseguimiento": "getLabelSeguimiento()" | kind=code-symbol | source=lib/prevencion/timeline.ts:L10 | neighbors=[checker.ts, SeguimientoTimeline.tsx, timeline.ts]
- "prevencion_types_autoridadadicional": "AutoridadAdicional" | kind=code-symbol | source=lib/prevencion/types.ts:L122 | neighbors=[mapper.ts, repository.ts, types.ts]
- "prevencion_types_contestacion": "Contestacion" | kind=code-symbol | source=lib/prevencion/types.ts:L99 | neighbors=[mapper.ts, repository.ts, types.ts]
- "prevencion_types_fichabusquedadetalle": "FichaBusquedaDetalle" | kind=code-symbol | source=lib/prevencion/types.ts:L62 | neighbors=[mapper.ts, repository.ts, types.ts]
- "prevencion_types_medidadetalle": "MedidaDetalle" | kind=code-symbol | source=lib/prevencion/types.ts:L36 | neighbors=[mapper.ts, repository.ts, types.ts]
- "prevencion_types_seguimientobusqueda": "SeguimientoBusqueda" | kind=code-symbol | source=lib/prevencion/types.ts:L80 | neighbors=[mapper.ts, repository.ts, types.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-030.json

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
