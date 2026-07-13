# Node Description Batch 39 of 84

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

- "despacho_tablondespacho_tablondespacho": "TablonDespacho()" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L29 | neighbors=[page.tsx, TablonDespacho.tsx]
- "deteccion_camara_reportfilters_reportfilters": "ReportFilters()" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportFilters.tsx:L7 | neighbors=[ReportFilters.tsx, page.tsx]
- "deteccion_camara_reporttables_reporttable": "ReportTable()" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportTables.tsx:L4 | neighbors=[ReportTables.tsx, page.tsx]
- "emails_mailer_sendmail": "sendMail()" | kind=code-symbol | source=lib/emails/mailer.ts:L28 | neighbors=[mailer.ts, server.ts]
- "emails_server_enviarcorreoasignacionfiscalia": "enviarCorreoAsignacionFiscalia()" | kind=code-symbol | source=lib/emails/server.ts:L12 | neighbors=[server.ts, actions.ts]
- "emails_server_enviarcorreoordenliberacion": "enviarCorreoOrdenLiberacion()" | kind=code-symbol | source=lib/emails/server.ts:L39 | neighbors=[server.ts, route.ts]
- "eslint_config": "eslint.config.mjs" | kind=code-symbol | source=eslint.config.mjs:L1 | neighbors=[90da1ca Initial commit from Create Next…, eslintConfig]
- "estadisticos_phonereportstable_phonereportstable": "PhoneReportsTable()" | kind=code-symbol | source=components/reportes/estadisticos/PhoneReportsTable.tsx:L13 | neighbors=[page.tsx, PhoneReportsTable.tsx]
- "estadisticos_phonestatscards_phonestatscards": "PhoneStatsCards()" | kind=code-symbol | source=components/reportes/estadisticos/PhoneStatsCards.tsx:L5 | neighbors=[page.tsx, PhoneStatsCards.tsx]
- "estadisticos_reportfilters_reportfilters": "ReportFilters()" | kind=code-symbol | source=components/reportes/estadisticos/ReportFilters.tsx:L7 | neighbors=[page.tsx, ReportFilters.tsx]
- "expediente_client_limpiarcachetoken": "limpiarCacheToken()" | kind=code-symbol | source=lib/expediente/client.ts:L62 | neighbors=[client.ts, expediente.ts]
- "exportar_route_crearhoja": "crearHoja()" | kind=code-symbol | source=app/api/camara/exportar/route.ts:L34 | neighbors=[route.ts, GET()]
- "exportar_route_getrango": "getRango()" | kind=code-symbol | source=app/api/reportes-telefonicos/exportar/route.ts:L7 | neighbors=[route.ts, GET()]
- "fiscalia_actions_acciontomarcaso": "accionTomarCaso()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L56 | neighbors=[actions.ts, TomarCasoModal.tsx]
- "fiscalia_actions_guardardetallesaseguradoaction": "guardarDetallesAseguradoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L120 | neighbors=[actions.ts, CapturarDetallesForm.tsx]
- "fiscalia_actions_guardardetallesaseguradosaction": "guardarDetallesAseguradosAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L218 | neighbors=[actions.ts, FormularioAsegurado.tsx]
- "fiscalia_actions_guardaroficioaction": "guardarOficioAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L304 | neighbors=[actions.ts, CargarOficioSection.tsx]
- "fiscalia_actions_guardarpuestadisposicionaction": "guardarPuestaDisposicionAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L263 | neighbors=[actions.ts, FormularioPuestaDisposicion.tsx]
- "fiscalia_actions_obteneraseguradosaction": "obtenerAseguradosAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L184 | neighbors=[page.tsx, actions.ts]
- "fiscalia_actions_obtenerdetalleaseguradocompletoaction": "obtenerDetalleAseguradoCompletoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L199 | neighbors=[actions.ts, page.tsx]
- "fiscalia_actions_obtenerliberacionesaction": "obtenerLiberacionesAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L167 | neighbors=[actions.ts, page.tsx]
- "fiscalia_actions_obtenerpuestadisposicionaction": "obtenerPuestaDisposicionAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L244 | neighbors=[actions.ts, page.tsx]
- "fiscalia_actions_obtenersolicitudes": "obtenerSolicitudes()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L39 | neighbors=[actions.ts, page.tsx]
- "fiscalia_buttonverdetalles_botonverdetalle": "BotonVerDetalle()" | kind=code-symbol | source=components/fiscalia/ButtonVerDetalles.tsx:L10 | neighbors=[ButtonVerDetalles.tsx, FiscaliaDashboard.tsx]
- "fiscalia_capturardetallesform_emptyitem": "emptyItem()" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L53 | neighbors=[CapturarDetallesForm.tsx, CapturarDetallesForm()]
- "fiscalia_detallesaseguradoview_detallesaseguradoview": "DetallesAseguradoView()" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L40 | neighbors=[DetallesAseguradoView.tsx, page.tsx]
- "fiscalia_expediente_obtenertokenfiscalia": "obtenerTokenFiscalia()" | kind=code-symbol | source=lib/fiscalia/expediente.ts:L10 | neighbors=[expediente.ts, subirArchivoFiscalia()]
- "fiscalia_formularioasegurado_displayval": "displayVal()" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L59 | neighbors=[FormularioAsegurado.tsx, FormularioAsegurado()]
- "fiscalia_formulariopuestadisposicion_formulariopuestadisposicion": "FormularioPuestaDisposicion()" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L45 | neighbors=[FormularioPuestaDisposicion.tsx, page.tsx]
- "fiscalia_mapper_num": "num()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L15 | neighbors=[mapper.ts, rowToSolicitud()]
- "fiscalia_mapper_rowtodetalledetenidoguardado": "rowToDetalleDetenidoGuardado()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L186 | neighbors=[mapper.ts, repository.ts]
- "fiscalia_mapper_rowtopuestadisposicion": "rowToPuestaDisposicion()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L201 | neighbors=[mapper.ts, repository.ts]
- "fiscalia_repository_actualizardetallesasegurado": "actualizarDetallesAsegurado()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L214 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_actualizarestadosolicitud": "actualizarEstadoSolicitud()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L109 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_actualizarsolicitudconevidencias": "actualizarSolicitudConEvidencias()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L271 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_guardardetenidosdirecciones": "guardarDetenidosDirecciones()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L435 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_guardarpuestadisposicion": "guardarPuestaDisposicion()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L582 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_listarasegurados": "listarAsegurados()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L361 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_listaraseguradoscondisposicion": "listarAseguradosConDisposicion()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L544 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_listarliberaciones": "listarLiberaciones()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L505 | neighbors=[repository.ts, service.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-038.json

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
