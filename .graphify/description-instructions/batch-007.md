# Node Description Batch 8 of 84

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

- "guardar_evidencias_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/guardar-evidencias/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5618308 guardado e evidencias con ed, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "imprimir_page": "page.tsx" | kind=code-symbol | source=app/prevencion/busquedas/[id]/imprimir/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…] | lang=en
- "monitorista_layout": "layout.tsx" | kind=code-symbol | source=app/monitorista/layout.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes] | lang=en
- "notificaciones_campanillanotificaciones": "CampanillaNotificaciones.tsx" | kind=code-symbol | source=components/notificaciones/CampanillaNotificaciones.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, actions.ts] | lang=en
- "plantilla_permisos_page": "page.tsx" | kind=code-symbol | source=app/admin/roles/[id]/plantilla-permisos/page.tsx:L1 | neighbors=[12aab65 fase 4, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, ffcea0c fase 1 completada] | lang=en
- "rol_servicios_types": "types.ts" | kind=code-symbol | source=lib/rol-servicios/types.ts:L1 | neighbors=[c27a9ee fase prefinal, mapper.ts, page.tsx, repository.ts, service.ts, ServiceTable.tsx] | lang=en
- "steps_pasovehiculo": "PasoVehiculo.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoVehiculo.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, COLORES] | lang=en
- "whatsapp_registroincidenteform": "RegistroIncidenteForm.tsx" | kind=code-symbol | source=components/911/whatsapp/RegistroIncidenteForm.tsx:L1 | neighbors=[166a26b Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, a291695 Merge branch 'feature/testing' …, aaddee5 Merge branch 'feature/testing' …, bf354f1 Nombre completo de quien captura, d2a4a5e guardado de nuemro exterior, in…] | lang=en
- "agente_liberaciones_types": "types.ts" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L1 | neighbors=[actions.ts, mapper.ts, repository.ts, service.ts, LiberacionesResponse, LiberacionRow] | lang=en
- "alertas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/alertas/route.ts:L1 | neighbors=[GET(), auth.ts, auth, permisos.ts, verificarAccesoPrevencionApi(), repository.ts] | lang=en
- "asegurados_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/asegurados/page.tsx:L1 | neighbors=[actions.ts, obtenerAseguradosJuzgadoAction(), obtenerDashboardJuzgado(), ProfileDropdown.tsx, ProfileDropdown(), AseguradosPage()] | lang=en
- "camara_repository": "repository.ts" | kind=code-symbol | source=lib/camara/repository.ts:L1 | neighbors=[mapper.ts, rowToIncidenteCamara(), rowToTotalesCamara(), obtenerConcentradoDiario(), obtenerIncidentesCamara(), obtenerPorTurno()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@07543deef08b193525fe36cc4a9e2572606ece35": "07543de Conexion de reportes con d1 y los diarios, mensuales y semanales" | kind=Commit | source=git | neighbors=[conexion, testing, 1acddac Merge branch 'feature/testing' …, D1Filters.tsx, D1ReportsTable.tsx, page.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@11be750b77ec68eaf2e0a3a4c0446aa9a201a161": "11be750 Fase 1 de correccion - completada - pendiente testing" | kind=Commit | source=git | neighbors=[actions.ts, actions.ts, actions.ts, conexion, testing, ffcea0c fase 1 completada] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5a1b5d59c49de0856d3a09a05af0c3781d718690": "5a1b5d5 empezando corralon" | kind=Commit | source=git | neighbors=[conexion, testing, f5fac0b Merge branch 'testing' into con…, actions.ts, layout.tsx, module-card.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5ed311a75808b99e806e1f6fae238fec714aaa6d": "5ed311a Merge pull request #5 from presidenciaSJR/fix/detenidos" | kind=Commit | source=git | neighbors=[23a3b9d Cambios en la estructura de los…, 5abc683 Merge branch 'feature/auxiliar'…, conexion, testing, 810844a Cambios en la estructura de los…, bd1a223 Merge branch 'feature/vistas-re…] | lang=en
- "contestacion_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/contestacion/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …] | lang=en
- "db_seed": "seed.ts" | kind=code-symbol | source=lib/db/seed.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 090c4dd vista de fiscalia, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 2dde720 Merge pull request #14 from pre…, 4400923 Merge branch 'feature/testing' …] | lang=en
- "expediente_client": "client.ts" | kind=code-symbol | source=lib/expediente/client.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "formato_n_armas_aseguradas_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-armas-aseguradas/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "iniciar_proceso_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/iniciar-proceso/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto] | lang=en
- "monitorista_botonsubirdenuncia": "BotonSubirDenuncia.tsx" | kind=code-symbol | source=components/monitorista/BotonSubirDenuncia.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "monitorista_subirevidenciamodal": "SubirEvidenciaModal.tsx" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "oficial_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/oficial/ProfileDropdown.tsx:L1 | neighbors=[layout.tsx, page.tsx, page.tsx, page.tsx, page.tsx, 0fe445e vista de oficial] | lang=en
- "prevencion_layout": "layout.tsx" | kind=code-symbol | source=app/prevencion/layout.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 1970615 vista de medidas, 41ea169 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "reportes_campo_route": "route.ts" | kind=code-symbol | source=app/api/analisis/reportes-campo/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 1e81ec8 Datos se autorellenan de denunc…, 27dcb21 Merge branch 'feature/testing' …, 3249f00 Cambios en rellenado de ppt!, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed] | lang=en
- "agente_infracciones_types": "types.ts" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L1 | neighbors=[actions.ts, mapper.ts, ModalEntregarGarantia.tsx, repository.ts, service.ts, CapturaInfractorInput] | lang=en
- "busquedas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/route.ts:L1 | neighbors=[GET(), POST(), auth.ts, auth, actions.ts, createFichaApi()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@23a3b9db16f36971ecf13d363a5e05b58fbad045": "23a3b9d Cambios en la estructura de los reportes de los detenidos" | kind=Commit | source=git | neighbors=[conexion, testing, 5ed311a Merge pull request #5 from pres…, page.tsx, route.ts, route.ts] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5ef7cf3542628cc5d6a4fb8cc32b9a2856a05bf5": "5ef7cf3 Agregar los campos faltantes" | kind=Commit | source=git | neighbors=[4c9fa8a vista de reporte de d1 no inici…, conexion, testing, 0b210fa Merge pull request #12 from pre…, 712c116 Merge branch 'testing' into con…, ef95840 Merge branch 'feature/testing' …] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9ec605647493f07c106fc892f96cd7940d488318": "9ec6056 flujo de juzgado-monitorista completo" | kind=Commit | source=git | neighbors=[821abe0 replicando flujo de fiscalia-> …, actions.ts, repository.ts, service.ts, TabSolicitudes.tsx, conexion] | lang=nl
- "components_mapadireccionregistro": "MapaDireccionRegistro.tsx" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L1 | neighbors=[12aab65 fase 4, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, a21f03f fix bugs reporte denuncia, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …] | lang=en
- "configuracion_page": "page.tsx" | kind=code-symbol | source=app/oficial/configuracion/page.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, ConfiguracionPerfilPage(), service.ts] | lang=en
- "corralon_actions": "actions.ts" | kind=code-symbol | source=lib/corralon/actions.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, obtenerDashboardCorralon(), obtenerSolicitudes(), TabSolicitudes, service.ts] | lang=en
- "despacho_despachoform": "DespachoForm.tsx" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L1 | neighbors=[511fea4 Modulo de despacho, BTN, BTN_SM, DespachoForm(), Elemento, ERR] | lang=en
- "despacho_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/[id]/despacho/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, a58a0f7 Despachos, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "despacho_tablondespacho": "TablonDespacho.tsx" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L1 | neighbors=[290d651 feat(despacho): flujo integral …, 511fea4 Modulo de despacho, page.tsx, DespachoForm.tsx, DespachoForm(), btnBackStyle] | lang=en
- "fiscalia_formularioasegurado": "FormularioAsegurado.tsx" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L1 | neighbors=[2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, actions.ts, guardarDetallesAseguradosAction()] | lang=en
- "fiscalia_formulariopuestadisposicion": "FormularioPuestaDisposicion.tsx" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L1 | neighbors=[2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, actions.ts, guardarPuestaDisposicionAction()] | lang=en
- "flota_repository": "repository.ts" | kind=code-symbol | source=lib/flota/repository.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, a21f03f fix bugs reporte denuncia, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, mapper.ts] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-007.json

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
