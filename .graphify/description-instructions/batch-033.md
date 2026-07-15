# Node Description Batch 34 of 93

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
- "prevencion_types_solicitudc4": "SolicitudC4" | kind=code-symbol | source=lib/prevencion/types.ts:L90 | neighbors=[mapper.ts, repository.ts, types.ts]
- "prevencion_types_solicitudinformacion": "SolicitudInformacion" | kind=code-symbol | source=lib/prevencion/types.ts:L22 | neighbors=[mapper.ts, repository.ts, types.ts]
- "prevencion_types_visitadomiciliaria": "VisitaDomiciliaria" | kind=code-symbol | source=lib/prevencion/types.ts:L111 | neighbors=[mapper.ts, repository.ts, types.ts]
- "reportes_d1_route_generarfoliodenunciaunico": "generarFolioDenunciaUnico()" | kind=code-symbol | source=app/api/reportes-d1/route.ts:L23 | neighbors=[route.ts, generarFolioDenuncia(), POST()]
- "reportes_form_styles_btnprimario": "btnPrimario()" | kind=code-symbol | source=components/reportes/form-styles.ts:L7 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_btnsecundario": "btnSecundario" | kind=code-symbol | source=components/reportes/form-styles.ts:L5 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_inputstyle": "inputStyle" | kind=code-symbol | source=components/reportes/form-styles.ts:L3 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_label": "Label()" | kind=code-symbol | source=components/reportes/form-styles.ts:L13 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_sectionbody": "sectionBody" | kind=code-symbol | source=components/reportes/form-styles.ts:L22 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_sectioncard": "sectionCard" | kind=code-symbol | source=components/reportes/form-styles.ts:L19 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_sectionheader": "sectionHeader" | kind=code-symbol | source=components/reportes/form-styles.ts:L20 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_sectiontitlestyle": "sectionTitleStyle" | kind=code-symbol | source=components/reportes/form-styles.ts:L21 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_formato_n_armas_aseguradas_service_listararmasaseguradas": "listarArmasAseguradas()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L69 | neighbors=[page.tsx, route.ts, formato-n-armas-aseguradas-service.ts]
- "reportes_formato_n_armas_aseguradas_service_obtenerarmaasegurada": "obtenerArmaAsegurada()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L74 | neighbors=[route.ts, formato-n-armas-aseguradas-service.ts, rowTo()]
- "reportes_formato_n_armas_aseguradas_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L55 | neighbors=[formato-n-armas-aseguradas-service.ts, obtenerArmaAsegurada(), formatFecha()]
- "reportes_formato_n_atencion_victimas_service_listaratencionvictimas": "listarAtencionVictimas()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L46 | neighbors=[page.tsx, route.ts, formato-n-atencion-victimas-service.ts]
- "reportes_formato_n_atencion_victimas_service_obteneratencionvictimas": "obtenerAtencionVictimas()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L58 | neighbors=[route.ts, formato-n-atencion-victimas-service.ts, rowTo()]
- "reportes_formato_n_atencion_victimas_service_periodo": "Periodo" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L4 | neighbors=[page.tsx, route.ts, formato-n-atencion-victimas-service.ts]
- "reportes_formato_n_consolidado_service_obtenerformatonconsolidadorango": "obtenerFormatoNConsolidadoRango()" | kind=code-symbol | source=lib/reportes/formato-n-consolidado-service.ts:L57 | neighbors=[route.ts, formato-n-consolidado-service.ts, enumerarFechas()]
- "reportes_formato_n_eventos_service_listareventos": "listarEventos()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L37 | neighbors=[page.tsx, route.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_eventos_service_obtenerevento": "obtenerEvento()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L42 | neighbors=[route.ts, formato-n-eventos-service.ts, rowTo()]
- "reportes_formato_n_eventos_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L22 | neighbors=[formato-n-eventos-service.ts, obtenerEvento(), formatFecha()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-033.json

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
