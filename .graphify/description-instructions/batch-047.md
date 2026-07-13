# Node Description Batch 48 of 87

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

- "prevencion_permisos_accion": "Accion" | kind=code-symbol | source=lib/prevencion/permisos.ts:L6 | neighbors=[actions.ts, permisos.ts]
- "prevencion_permisos_obtenerrolnombre": "obtenerRolNombre()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L38 | neighbors=[permisos.ts, tieneAccesoSeccion()]
- "prevencion_printbutton_printbutton": "PrintButton()" | kind=code-symbol | source=components/prevencion/PrintButton.tsx:L3 | neighbors=[page.tsx, PrintButton.tsx]
- "prevencion_prorrogamodal_prorrogamodal": "ProrrogaModal()" | kind=code-symbol | source=components/prevencion/ProrrogaModal.tsx:L6 | neighbors=[page.tsx, ProrrogaModal.tsx]
- "prevencion_prorrogaviewermodal_prorrogaviewermodal": "ProrrogaViewerModal()" | kind=code-symbol | source=components/prevencion/ProrrogaViewerModal.tsx:L9 | neighbors=[page.tsx, ProrrogaViewerModal.tsx]
- "prevencion_repository_getfichasactivas": "getFichasActivas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L162 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getfichasbusqueda": "getFichasBusqueda()" | kind=code-symbol | source=lib/prevencion/repository.ts:L40 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_getfichasbusquedafiltradas": "getFichasBusquedaFiltradas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L177 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getmedidas": "getMedidas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L5 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_getmedidasfiltradas": "getMedidasFiltradas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L124 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getmedidasstats": "getMedidasStats()" | kind=code-symbol | source=lib/prevencion/repository.ts:L28 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_getseguimientotipos": "getSeguimientoTipos()" | kind=code-symbol | source=lib/prevencion/repository.ts:L169 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getvisitamedidaids": "getVisitaMedidaIds()" | kind=code-symbol | source=lib/prevencion/repository.ts:L23 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarautoridadesadicionales": "listarAutoridadesAdicionales()" | kind=code-symbol | source=lib/prevencion/repository.ts:L93 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarseguimientos": "listarSeguimientos()" | kind=code-symbol | source=lib/prevencion/repository.ts:L109 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarsolicitudesc4": "listarSolicitudesC4()" | kind=code-symbol | source=lib/prevencion/repository.ts:L61 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarsolicitudesfiltradas": "listarSolicitudesFiltradas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L207 | neighbors=[repository.ts, route.ts]
- "prevencion_repository_listarsolicitudesjuridico": "listarSolicitudesJuridico()" | kind=code-symbol | source=lib/prevencion/repository.ts:L45 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarvisitas": "listarVisitas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L85 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarvisitasconalias": "listarVisitasConAlias()" | kind=code-symbol | source=lib/prevencion/repository.ts:L154 | neighbors=[repository.ts, route.ts]
- "prevencion_repository_obtenercontestacion": "obtenerContestacion()" | kind=code-symbol | source=lib/prevencion/repository.ts:L69 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_obtenerfichadetalle": "obtenerFichaDetalle()" | kind=code-symbol | source=lib/prevencion/repository.ts:L193 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_obtenermedidadetalle": "obtenerMedidaDetalle()" | kind=code-symbol | source=lib/prevencion/repository.ts:L77 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_obtenermedidadetallecompleto": "obtenerMedidaDetalleCompleto()" | kind=code-symbol | source=lib/prevencion/repository.ts:L140 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_obtenersolicitud": "obtenerSolicitud()" | kind=code-symbol | source=lib/prevencion/repository.ts:L53 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_obtenersolicituddetalle": "obtenerSolicitudDetalle()" | kind=code-symbol | source=lib/prevencion/repository.ts:L223 | neighbors=[route.ts, repository.ts]
- "prevencion_seguimientotimeline_seguimientotimeline": "SeguimientoTimeline()" | kind=code-symbol | source=components/prevencion/SeguimientoTimeline.tsx:L15 | neighbors=[page.tsx, SeguimientoTimeline.tsx]
- "prevencion_semaforo_semaforocolor": "SemaforoColor" | kind=code-symbol | source=lib/prevencion/semaforo.ts:L3 | neighbors=[semaforo.ts, SemaforoVigencia.tsx]
- "prevencion_solicitudc4form_solicitudc4form": "SolicitudC4Form()" | kind=code-symbol | source=components/prevencion/SolicitudC4Form.tsx:L6 | neighbors=[page.tsx, SolicitudC4Form.tsx]
- "prevencion_timeline_tipos_seguimiento": "TIPOS_SEGUIMIENTO" | kind=code-symbol | source=lib/prevencion/timeline.ts:L3 | neighbors=[SeguimientoTimeline.tsx, timeline.ts]
- "prevencion_types_busquedaitem": "BusquedaItem" | kind=code-symbol | source=lib/prevencion/types.ts:L12 | neighbors=[mapper.ts, types.ts]
- "prevencion_types_medidaitem": "MedidaItem" | kind=code-symbol | source=lib/prevencion/types.ts:L1 | neighbors=[mapper.ts, types.ts]
- "prevencion_visitamodal_visitamodal": "VisitaModal()" | kind=code-symbol | source=components/prevencion/VisitaModal.tsx:L6 | neighbors=[page.tsx, VisitaModal.tsx]
- "proxy_ispublic": "isPublic()" | kind=code-symbol | source=proxy.ts:L8 | neighbors=[proxy.ts, proxy()]
- "proxy_proxy": "proxy()" | kind=code-symbol | source=proxy.ts:L12 | neighbors=[proxy.ts, isPublic()]
- "radio_formrondinescalado_ahoralocal": "ahoraLocal()" | kind=code-symbol | source=components/911/radio/FormRondinEscalado.tsx:L21 | neighbors=[FormRondinEscalado.tsx, FormRondinEscalado()]
- "reportes_d1_route_generarfoliodenuncia": "generarFolioDenuncia()" | kind=code-symbol | source=app/api/reportes-d1/route.ts:L9 | neighbors=[route.ts, generarFolioDenunciaUnico()]
- "reportes_d1_route_post": "POST()" | kind=code-symbol | source=app/api/reportes-d1/route.ts:L32 | neighbors=[route.ts, generarFolioDenunciaUnico()]
- "reportes_form_styles_btntiny": "btnTiny" | kind=code-symbol | source=components/reportes/form-styles.ts:L9 | neighbors=[page.tsx, form-styles.ts]
- "reportes_formato_n_armas_aseguradas_service_actualizararmaasegurada": "actualizarArmaAsegurada()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L104 | neighbors=[route.ts, formato-n-armas-aseguradas-service.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-047.json

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
