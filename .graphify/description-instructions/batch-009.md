# Node Description Batch 10 of 79

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
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
LANGUAGE: each entry has a `lang=` marker giving the language of its source.
Write that entry's description in EXACTLY that language. Do not translate to
a single common language — match each node's source language individually.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "manual_migrations_0006_formato_n": "0006_formato_n.sql" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, formato_n_armas_aseguradas] | lang=en
- "modulo_incidentes_reporttables": "ReportTables.tsx" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportTables.tsx:L1 | neighbors=[1265204 paginacion por tablas, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, b170599 Merge branch 'feature/testing' …, bd1a223 Merge branch 'feature/vistas-re…, bf2e7ed Reportes del modulo de incident…] | lang=en
- "monitorista_layout": "layout.tsx" | kind=code-symbol | source=app/monitorista/layout.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "notificaciones_repository": "repository.ts" | kind=code-symbol | source=lib/notificaciones/repository.ts:L1 | neighbors=[ad3ec5f mejorando esto, actions.ts, db.ts, query(), mapper.ts, rowToNotificacion()] | lang=en
- "pendientes_despacho_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/pendientes-despacho/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, a58a0f7 Despachos, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "prevencion_types": "types.ts" | kind=code-symbol | source=lib/prevencion/types.ts:L1 | neighbors=[514a705 refactorizacion sql, c27a9ee fase prefinal, mapper.ts, repository.ts, AutoridadAdicional, BusquedaItem] | lang=en
- "seguimientos_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/seguimientos/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "shared_pedirevidenciasmodal": "PedirEvidenciasModal.tsx" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L1 | neighbors=[TabSolicitudes.tsx, 5f13b34 Merge branch 'feature/testing' …, 9ec6056 flujo de juzgado-monitorista co…, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, PedirEvidenciasModal.tsx] | lang=en
- "solicitudes_solicitudes_client": "solicitudes-client.tsx" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, page.tsx, types.ts, TabSolicitudes, estatusBg()] | lang=en
- "steps_pasopago": "PasoPago.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoPago.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, InfraccionCreada] | lang=en
- "ui_toast": "Toast.tsx" | kind=code-symbol | source=components/ui/Toast.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, AccionesDetenido.tsx, BandejaSolicitudes.tsx] | lang=en
- "ui_toastauto": "ToastAuto.tsx" | kind=code-symbol | source=components/ui/ToastAuto.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, page.tsx, page.tsx] | lang=en
- "admin_transito_mapper": "mapper.ts" | kind=code-symbol | source=lib/admin-transito/mapper.ts:L1 | neighbors=[rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), rowToUserWithRole(), toStr(), types.ts] | lang=en
- "admin_transito_oficialestable": "OficialesTable.tsx" | kind=code-symbol | source=components/admin-transito/OficialesTable.tsx:L1 | neighbors=[ModalDestituirOficial.tsx, ModalReactivarOficial.tsx, AccionModal, Departamento, Oficial, OficialesTable()] | lang=en
- "agente_infracciones_mapper": "mapper.ts" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L1 | neighbors=[inputToDbParams(), nvl(), rowToLiberacion(), str(), types.ts, CapturaInfractorInput] | lang=en
- "agente_liberaciones_mapper": "mapper.ts" | kind=code-symbol | source=lib/agente_liberaciones/mapper.ts:L1 | neighbors=[rowToLiberacion(), str(), types.ts, LiberacionRow, service.ts, 06c55f5 Merge branch 'feature/testing' …] | lang=en
- "captura_page": "page.tsx" | kind=code-symbol | source=app/infracciones/captura/page.tsx:L1 | neighbors=[CapturaPage(), FormularioInfraccion.tsx, auth.ts, auth, ProfileDropdown.tsx, ProfileDropdown()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@16df1286eab91ffb1ff2955737ba9e4abc42cd47": "16df128 flujo de corralones listo" | kind=Commit | source=git | neighbors=[conexion, testing, ede5a1d eliminado referencias a via_pru…, actions.ts, page.tsx, repository.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@23a3b9db16f36971ecf13d363a5e05b58fbad045": "23a3b9d Cambios en la estructura de los reportes de los detenidos" | kind=Commit | source=git | neighbors=[conexion, testing, 5ed311a Merge pull request #5 from pres…, page.tsx, route.ts, route.ts] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@25167235624891e98af3080d98f97e1a435923e6": "2516723 Modulo de permisos" | kind=Commit | source=git | neighbors=[22b7b54 Merge branch 'feature/reportes'…, conexion, testing, 06c55f5 Merge branch 'feature/testing' …, page.tsx, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9550203776dbe9f8ba3e1e21c447ef64c9b2713a": "9550203 Cambios en presentacion, se genera" | kind=Commit | source=git | neighbors=[generarPresentacion.tsx, conexion, testing, 8355ac0 Merge branch 'feature/testing' …, FormularioD1.tsx, route.ts] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a353e637487c27079ab15d1a99ef2193ae58c0bc": "a353e63 Ya se enlazan datos pero no completos, un problema en la consulta sql q…" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, page.tsx, TablonAnalisis.tsx, conexion, testing] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a58a0f77049ab34a6a5b10e85183163716785b7d": "a58a0f7 Despachos" | kind=Commit | source=git | neighbors=[71912a4 Bitacora incluida, conexion, testing, 511fea4 Modulo de despacho, route.ts, route.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@af993fbd3820fa58b8d79213c4f60e3ae79001ce": "af993fb Fix/Monitorista" | kind=Commit | source=git | neighbors=[16a63d4 Merge branch 'feature/testing' …, repository.ts, repository.ts, conexion, testing, f5fac0b Merge branch 'testing' into con…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b403f89a497d4ec089c09c8fcdb3f51ae3c3157b": "b403f89 Vista para reportes de incidentes por camaras y cambio den header" | kind=Commit | source=git | neighbors=[5aa5866 Cambio de colores en interfaz d…, conexion, testing, bf2e7ed Reportes del modulo de incident…, ReportFilters.tsx, ReportStat.tsx] | lang=es
- "corralon_permisos": "permisos.ts" | kind=code-symbol | source=lib/corralon/permisos.ts:L1 | neighbors=[5a1b5d5 empezando corralon, Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPermisosUsuario(), obtenerPlantillaRol()] | lang=en
- "corralon_service": "service.ts" | kind=code-symbol | source=lib/corralon/service.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, c27a9ee fase prefinal, actions.ts, mapper.ts, rowToSolicitud()] | lang=en
- "incidentes_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L20 | neighbors=[mapper.ts, rowToAlarmaEscolar(), rowToDespacho(), rowToDespachoElemento(), rowToDespachoUnidad(), rowToExtorsion()] | lang=en
- "infracciones_mapper": "mapper.ts" | kind=code-symbol | source=features/via/infracciones/mapper.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "maps_googlemappicker": "GoogleMapPicker.tsx" | kind=code-symbol | source=components/maps/GoogleMapPicker.tsx:L1 | neighbors=[FormularioAseguradoJuzgado.tsx, formAnalisis.tsx, generarPresentacion.tsx, 2ca9f50 Formulario sin backend, 2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "monitorista_batchenviofotos": "BatchEnvioFotos.tsx" | kind=code-symbol | source=components/monitorista/BatchEnvioFotos.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "monitorista_repository_inserthistorial": "insertHistorial()" | kind=code-symbol | source=lib/monitorista/repository.ts:L91 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "monitorista_subirfotodetenido": "SubirFotoDetenido.tsx" | kind=code-symbol | source=components/monitorista/SubirFotoDetenido.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 672bab5 libearciones para juzgado, 77ddf58 Merge branch 'feature/testing' …, de5682f Merge pull request #10 from pre…] | lang=en
- "pendiente_analisis_page": "page.tsx" | kind=code-symbol | source=app/analisis/pendiente-analisis/page.tsx:L1 | neighbors=[a6b7556 Formulario se puso a prueba, se…, fcb223f merge de testing, permisos.ts, tieneAccesoAnalisis(), tienePermiso(), TablonAnalisis.tsx] | lang=en
- "prevencion_permisos_verificaraccesoprevencionapi": "verificarAccesoPrevencionApi()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L50 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "prevencion_prevencionnav": "PrevencionNav.tsx" | kind=code-symbol | source=app/prevencion/PrevencionNav.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 1970615 vista de medidas, 41ea169 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 8355ac0 Merge branch 'feature/testing' …, layout.tsx] | lang=en
- "reportes_permisos_verificaraccesoformatonapi": "verificarAccesoFormatoNApi()" | kind=code-symbol | source=lib/reportes/permisos.ts:L36 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "reportes_sin_d1_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-sin-d1/repository.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, db.ts] | lang=en
- "reportes_sin_d1_service": "service.ts" | kind=code-symbol | source=lib/reportes-sin-d1/service.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "reportes_sin_novedad_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/repository.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, db.ts] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-009.json

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
