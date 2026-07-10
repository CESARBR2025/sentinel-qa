# Node Description Batch 47 of 82

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

- "prevencion_repository_obtenerfichadetalle": "obtenerFichaDetalle()" | kind=code-symbol | source=lib/prevencion/repository.ts:L183 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_obtenermedidadetalle": "obtenerMedidaDetalle()" | kind=code-symbol | source=lib/prevencion/repository.ts:L67 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_obtenermedidadetallecompleto": "obtenerMedidaDetalleCompleto()" | kind=code-symbol | source=lib/prevencion/repository.ts:L130 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_obtenersolicitud": "obtenerSolicitud()" | kind=code-symbol | source=lib/prevencion/repository.ts:L43 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_obtenersolicituddetalle": "obtenerSolicitudDetalle()" | kind=code-symbol | source=lib/prevencion/repository.ts:L213 | neighbors=[route.ts, repository.ts]
- "prevencion_seguimientotimeline_seguimientotimeline": "SeguimientoTimeline()" | kind=code-symbol | source=components/prevencion/SeguimientoTimeline.tsx:L15 | neighbors=[page.tsx, SeguimientoTimeline.tsx]
- "prevencion_semaforo_semaforocolor": "SemaforoColor" | kind=code-symbol | source=lib/prevencion/semaforo.ts:L3 | neighbors=[semaforo.ts, SemaforoVigencia.tsx]
- "prevencion_solicitudc4form_solicitudc4form": "SolicitudC4Form()" | kind=code-symbol | source=components/prevencion/SolicitudC4Form.tsx:L6 | neighbors=[page.tsx, SolicitudC4Form.tsx]
- "prevencion_timeline_tipos_seguimiento": "TIPOS_SEGUIMIENTO" | kind=code-symbol | source=lib/prevencion/timeline.ts:L3 | neighbors=[SeguimientoTimeline.tsx, timeline.ts]
- "prevencion_types_busquedaitem": "BusquedaItem" | kind=code-symbol | source=lib/prevencion/types.ts:L12 | neighbors=[mapper.ts, types.ts]
- "prevencion_types_medidaitem": "MedidaItem" | kind=code-symbol | source=lib/prevencion/types.ts:L1 | neighbors=[mapper.ts, types.ts]
- "prevencion_visitamodal_visitamodal": "VisitaModal()" | kind=code-symbol | source=components/prevencion/VisitaModal.tsx:L6 | neighbors=[page.tsx, VisitaModal.tsx]
- "proxy_ispublic": "isPublic()" | kind=code-symbol | source=proxy.ts:L8 | neighbors=[proxy.ts, proxy()]
- "proxy_proxy": "proxy()" | kind=code-symbol | source=proxy.ts:L12 | neighbors=[proxy.ts, isPublic()]
- "reportes_d1_route_generarfoliodenuncia": "generarFolioDenuncia()" | kind=code-symbol | source=app/api/reportes-d1/route.ts:L8 | neighbors=[route.ts, generarFolioDenunciaUnico()]
- "reportes_d1_route_post": "POST()" | kind=code-symbol | source=app/api/reportes-d1/route.ts:L31 | neighbors=[route.ts, generarFolioDenunciaUnico()]
- "reportes_form_styles_btntiny": "btnTiny" | kind=code-symbol | source=components/reportes/form-styles.ts:L9 | neighbors=[page.tsx, form-styles.ts]
- "reportes_formato_n_armas_aseguradas_service_actualizararmaasegurada": "actualizarArmaAsegurada()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L104 | neighbors=[route.ts, formato-n-armas-aseguradas-service.ts]
- "reportes_formato_n_armas_aseguradas_service_creararmaasegurada": "crearArmaAsegurada()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L95 | neighbors=[route.ts, formato-n-armas-aseguradas-service.ts]
- "reportes_formato_n_armas_aseguradas_service_formatfecha": "formatFecha()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L49 | neighbors=[formato-n-armas-aseguradas-service.ts, rowTo()]
- "reportes_formato_n_armas_aseguradas_service_formatonarmaasegurada": "FormatoNArmaAsegurada" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L37 | neighbors=[formato-n-armas-aseguradas-service.ts, formato-n-consolidado-service.ts]
- "reportes_formato_n_armas_aseguradas_service_obtenerarmasaseguradasporfecha": "obtenerArmasAseguradasPorFecha()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L80 | neighbors=[formato-n-armas-aseguradas-service.ts, formato-n-consolidado-service.ts]
- "reportes_formato_n_atencion_victimas_service_actualizaratencionvictimas": "actualizarAtencionVictimas()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L93 | neighbors=[route.ts, formato-n-atencion-victimas-service.ts]
- "reportes_formato_n_atencion_victimas_service_crearatencionvictimas": "crearAtencionVictimas()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L84 | neighbors=[route.ts, formato-n-atencion-victimas-service.ts]
- "reportes_formato_n_atencion_victimas_service_formatfecha": "formatFecha()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L25 | neighbors=[formato-n-atencion-victimas-service.ts, rowTo()]
- "reportes_formato_n_atencion_victimas_service_formatonatencionvictimas": "FormatoNAtencionVictimas" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L7 | neighbors=[formato-n-atencion-victimas-service.ts, formato-n-consolidado-service.ts]
- "reportes_formato_n_atencion_victimas_service_parseperiodo": "parsePeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L20 | neighbors=[formato-n-atencion-victimas-service.ts, rowTo()]
- "reportes_formato_n_atencion_victimas_service_periodos": "PERIODOS" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L3 | neighbors=[page.tsx, formato-n-atencion-victimas-service.ts]
- "reportes_formato_n_consolidado_service_enumerarfechas": "enumerarFechas()" | kind=code-symbol | source=lib/reportes/formato-n-consolidado-service.ts:L46 | neighbors=[formato-n-consolidado-service.ts, obtenerFormatoNConsolidadoRango()]
- "reportes_formato_n_consolidado_service_obtenerformatonconsolidado": "obtenerFormatoNConsolidado()" | kind=code-symbol | source=lib/reportes/formato-n-consolidado-service.ts:L32 | neighbors=[formato-n-consolidado-service.ts, porPeriodos()]
- "reportes_formato_n_consolidado_service_porperiodos": "porPeriodos()" | kind=code-symbol | source=lib/reportes/formato-n-consolidado-service.ts:L20 | neighbors=[formato-n-consolidado-service.ts, obtenerFormatoNConsolidado()]
- "reportes_formato_n_eventos_service_actualizarevento": "actualizarEvento()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L106 | neighbors=[route.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_eventos_service_buscarincidentesporrango": "buscarIncidentesPorRango()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L82 | neighbors=[route.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_eventos_service_crearevento": "crearEvento()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L64 | neighbors=[route.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_eventos_service_formatfecha": "formatFecha()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L16 | neighbors=[formato-n-eventos-service.ts, rowTo()]
- "reportes_formato_n_eventos_service_formatonevento": "FormatoNEvento" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L3 | neighbors=[formato-n-consolidado-service.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_eventos_service_obtenereventosporfecha": "obtenerEventosPorFecha()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L48 | neighbors=[formato-n-consolidado-service.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_fge_service_actualizarfge": "actualizarFge()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L141 | neighbors=[route.ts, formato-n-fge-service.ts]
- "reportes_formato_n_fge_service_calcularconteosporfecha": "calcularConteosPorFecha()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L94 | neighbors=[route.ts, formato-n-fge-service.ts]
- "reportes_formato_n_fge_service_crearfge": "crearFge()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L127 | neighbors=[route.ts, formato-n-fge-service.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-046.json

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
