# Node Description Batch 7 of 79

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

- "guardar_docs_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/guardar-docs/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5618308 guardado e evidencias con ed, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "historial_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/historial/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "incidentes_types": "types.ts" | kind=code-symbol | source=lib/incidentes/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, AlarmaEscolarRow, DespachoCompleto, DespachoDetalleResponse] | lang=en
- "infracciones_types": "types.ts" | kind=code-symbol | source=features/via/infracciones/types.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "monitorista_cardenviofoto": "CardEnvioFoto.tsx" | kind=code-symbol | source=components/monitorista/CardEnvioFoto.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 672bab5 libearciones para juzgado] | lang=en
- "roles_formulariorol": "FormularioRol.tsx" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L1 | neighbors=[page.tsx, 0c31cc2 Merge branch 'testing' into juz…, 27dcb21 Merge branch 'feature/testing' …, 356d3a7 Subir rol agregado, falta darle…, 44ebbc4 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed] | lang=en
- "stores_useinfraccionstore": "useInfraccionStore.ts" | kind=code-symbol | source=stores/useInfraccionStore.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, constants.ts] | lang=en
- "agente_infracciones_infraccionesdashboard": "InfraccionesDashboard.tsx" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L1 | neighbors=[CapturarDatosInfractorModal.tsx, AVATAR_COLORS, EstatusInfracciones, getBadge(), getInitials(), hashColor()] | lang=en
- "agente_juzgado_capturardetallesform": "CapturarDetallesForm.tsx" | kind=code-symbol | source=components/agente_juzgado/CapturarDetallesForm.tsx:L1 | neighbors=[actions.ts, guardarDetallesAseguradoAction(), CapturarDetallesForm(), disabledSx, emptyItem(), EvidenciaItem] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1dbd48080de3d32ae2a09478a517c513f919bd3c": "1dbd480 flujo de liberaciones completado" | kind=Commit | source=git | neighbors=[067c4de arreglando flujo de fiscalia  a…, actions.ts, conexion, testing, fcb223f merge de testing, route.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b79a96a842f6bd73adff22de0f9a6a8c547ad549": "b79a96a Conexión entre ambos modulos" | kind=Commit | source=git | neighbors=[conexion, testing, f2d7c18 logica de redirección dinamica, FormularioD1.tsx, page.tsx, page.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ff6d3c2eb2a562855f19a14395c044964623a263": "ff6d3c2 juzgado" | kind=Commit | source=git | neighbors=[5f13b34 Merge branch 'feature/testing' …, conexion, testing, 5bbdda8 Merge pull request #8 from pres…, abrirDocumento.ts, actions.ts] | lang=en
- "cuestionario_robo_page": "page.tsx" | kind=code-symbol | source=app/auxiliar/cuestionario-robo/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…] | lang=en
- "emails_server": "server.ts" | kind=code-symbol | source=lib/emails/server.ts:L1 | neighbors=[service.ts, actions.ts, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia] | lang=en
- "fiscalia_capturardetallesform": "CapturarDetallesForm.tsx" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L1 | neighbors=[5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, actions.ts, guardarDetallesAseguradoAction()] | lang=en
- "guardar_evidencias_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/guardar-evidencias/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5618308 guardado e evidencias con ed, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "imprimir_page": "page.tsx" | kind=code-symbol | source=app/prevencion/busquedas/[id]/imprimir/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…] | lang=en
- "notificaciones_campanillanotificaciones": "CampanillaNotificaciones.tsx" | kind=code-symbol | source=components/notificaciones/CampanillaNotificaciones.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, actions.ts] | lang=en
- "plantilla_permisos_page": "page.tsx" | kind=code-symbol | source=app/admin/roles/[id]/plantilla-permisos/page.tsx:L1 | neighbors=[12aab65 fase 4, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, ffcea0c fase 1 completada] | lang=en
- "rol_servicios_types": "types.ts" | kind=code-symbol | source=lib/rol-servicios/types.ts:L1 | neighbors=[c27a9ee fase prefinal, mapper.ts, page.tsx, repository.ts, service.ts, ServiceTable.tsx] | lang=en
- "steps_pasovehiculo": "PasoVehiculo.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoVehiculo.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, COLORES] | lang=en
- "whatsapp_registroincidenteform": "RegistroIncidenteForm.tsx" | kind=code-symbol | source=components/911/whatsapp/RegistroIncidenteForm.tsx:L1 | neighbors=[166a26b Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 519716a Formulario para registro de wha…, 95b78c1 cambios de incidentes, a291695 Merge branch 'feature/testing' …, aaddee5 Merge branch 'feature/testing' …] | lang=en
- "agente_liberaciones_types": "types.ts" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L1 | neighbors=[actions.ts, mapper.ts, repository.ts, service.ts, LiberacionesResponse, LiberacionRow] | lang=en
- "alertas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/alertas/route.ts:L1 | neighbors=[GET(), auth.ts, auth, permisos.ts, verificarAccesoPrevencionApi(), repository.ts] | lang=en
- "asegurados_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/asegurados/page.tsx:L1 | neighbors=[actions.ts, obtenerAseguradosJuzgadoAction(), obtenerDashboardJuzgado(), ProfileDropdown.tsx, ProfileDropdown(), AseguradosPage()] | lang=en
- "camara_repository": "repository.ts" | kind=code-symbol | source=lib/camara/repository.ts:L1 | neighbors=[mapper.ts, rowToIncidenteCamara(), rowToTotalesCamara(), obtenerConcentradoDiario(), obtenerIncidentesCamara(), obtenerPorTurno()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@13f7f399992e81fb151dbac5fefc1deb171b965c": "13f7f39 Reporte-incidentes" | kind=Commit | source=git | neighbors=[conexion, testing, 27dcb21 Merge branch 'feature/testing' …, route.ts, actions.ts, FiltrosIncidencias.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6feefe2a8d4977f5ea14360db1048683e0cd411d": "6feefe2 BackEnd completo para hacer la conección con la BD" | kind=Commit | source=git | neighbors=[conexion, testing, 4d4a9b7 formulario de notificaciones po…, schema.ts, route.ts, useEmpleado.ts] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@953d38a8785c865b6246509015755436900e1e6d": "953d38a implementando vista de fiscalia" | kind=Commit | source=git | neighbors=[6f8a089 Vista de estadisticos diarios, …, conexion, testing, 8095bdb limpiando .env, mailer.ts, server.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bd1a2232feea618e2956a3d5c0db185515c3a304": "bd1a223 Merge branch 'feature/vistas-reportes' into feature/testing" | kind=Commit | source=git | neighbors=[5ed311a Merge pull request #5 from pres…, conexion, testing, 50101e2 Merge pull request #6 from pres…, ReportFilters.tsx, ReportStat.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ede5a1dba726d7f39d03c50b028d77f38cd165d0": "ede5a1d eliminado referencias a via_prueba" | kind=Commit | source=git | neighbors=[16df128 flujo de corralones listo, conexion, 11be750 Fase 1 de correccion - completa…, route.ts, repository.ts, route.ts] | lang=pt
- "contestacion_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/contestacion/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …] | lang=en
- "db_seed": "seed.ts" | kind=code-symbol | source=lib/db/seed.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 090c4dd vista de fiscalia, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 2dde720 Merge pull request #14 from pre…, 4400923 Merge branch 'feature/testing' …] | lang=en
- "expediente_client": "client.ts" | kind=code-symbol | source=lib/expediente/client.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "formato_n_armas_aseguradas_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-armas-aseguradas/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "iniciar_proceso_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/iniciar-proceso/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto] | lang=en
- "monitorista_botonsubirdenuncia": "BotonSubirDenuncia.tsx" | kind=code-symbol | source=components/monitorista/BotonSubirDenuncia.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "monitorista_subirevidenciamodal": "SubirEvidenciaModal.tsx" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "prevencion_layout": "layout.tsx" | kind=code-symbol | source=app/prevencion/layout.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 1970615 vista de medidas, 41ea169 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "reportes_campo_route": "route.ts" | kind=code-symbol | source=app/api/analisis/reportes-campo/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 1e81ec8 Datos se autorellenan de denunc…, 27dcb21 Merge branch 'feature/testing' …, 3249f00 Cambios en rellenado de ppt!, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-006.json

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
