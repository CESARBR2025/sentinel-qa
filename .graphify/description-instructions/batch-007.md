# Node Description Batch 8 of 93

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

- "enviar_foto_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/enviar-foto/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "formato_n_atencion_victimas_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-atencion-victimas/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_eventos_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-eventos/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fge_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-fge/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fgr_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-fgr/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_medios_alternativos_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-medios-alternativos/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_rnd_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "fuente_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/fuente/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "guardar_docs_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/guardar-docs/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5618308 guardado e evidencias con ed, 863c575 Merge pull request #24 from pre…] | lang=en
- "historial_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/historial/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "infracciones_types": "types.ts" | kind=code-symbol | source=features/via/infracciones/types.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "plantilla_permisos_page": "page.tsx" | kind=code-symbol | source=app/admin/roles/[id]/plantilla-permisos/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 12aab65 fase 4, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "stores_useinfraccionstore": "useInfraccionStore.ts" | kind=code-symbol | source=stores/useInfraccionStore.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "whatsapp_page": "page.tsx" | kind=code-symbol | source=app/agente_911/whatsapp/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 863c575 Merge pull request #24 from pre…, ac9ad49 Merge branch 'feature/testing' …, permisos.ts, tieneAccesoSeccion()] | lang=en
- "whatsapp_registroincidenteform": "RegistroIncidenteForm.tsx" | kind=code-symbol | source=components/911/whatsapp/RegistroIncidenteForm.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 166a26b Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 519716a Formulario para registro de wha…, 863c575 Merge pull request #24 from pre…, 95b78c1 cambios de incidentes] | lang=en
- "agente_juzgado_capturardetallesform": "CapturarDetallesForm.tsx" | kind=code-symbol | source=components/agente_juzgado/CapturarDetallesForm.tsx:L1 | neighbors=[actions.ts, guardarDetallesAseguradoAction(), CapturarDetallesForm(), disabledSx, emptyItem(), EvidenciaItem] | lang=en
- "asegurados_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/asegurados/page.tsx:L1 | neighbors=[actions.ts, obtenerAseguradosJuzgadoAction(), obtenerDashboardJuzgado(), ProfileDropdown.tsx, ProfileDropdown(), AseguradosPage()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@13f7f399992e81fb151dbac5fefc1deb171b965c": "13f7f39 Reporte-incidentes" | kind=Commit | source=git | neighbors=[feature/testing, main, 27dcb21 Merge branch 'feature/testing' …, route.ts, actions.ts, FiltrosIncidencias.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@375d2657a5c629dff4f13417b2728ca31ed7ae71": "375d265 flujo de fiscalia" | kind=Commit | source=git | neighbors=[2e958e1 catalogo de grupo de incidencia, feature/testing, main, 1f7c0d7 Merge pull request #23 from pre…, repository.ts, actions.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6109a7ac819aa22f0e87f9e6347104c452537239": "6109a7a replicando flujo para fiscalia" | kind=Commit | source=git | neighbors=[TabSolicitudes.tsx, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ec1b6584fcf4cc89f42581bdcc1f53587a5c5aaa": "ec1b658 implementando layaredArchitecture para rol de oficial" | kind=Commit | source=git | neighbors=[9ec6056 flujo de juzgado-monitorista co…, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ff9f8c2cf5f985441183c8ff42a3a0ae0fdc6baa": "ff9f8c2 Modulo de Auxiliares" | kind=Commit | source=git | neighbors=[160d1e1 Monitorista V1.1, actions.ts, mapper.ts, page.tsx, repository.ts, service.ts] | lang=nl
- "emails_server": "server.ts" | kind=code-symbol | source=lib/emails/server.ts:L1 | neighbors=[service.ts, actions.ts, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 75ca4b2 Merge pull request #9 from pres…, 863c575 Merge pull request #24 from pre…] | lang=en
- "fiscalia_detallesaseguradoview": "DetallesAseguradoView.tsx" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L1 | neighbors=[1f7c0d7 Merge pull request #23 from pre…, 375d265 flujo de fiscalia, 5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…] | lang=en
- "guardar_evidencias_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/guardar-evidencias/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5618308 guardado e evidencias con ed, 863c575 Merge pull request #24 from pre…] | lang=en
- "imprimir_page": "page.tsx" | kind=code-symbol | source=app/prevencion/busquedas/[id]/imprimir/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "monitorista_layout": "layout.tsx" | kind=code-symbol | source=app/monitorista/layout.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes] | lang=en
- "notificaciones_campanillanotificaciones": "CampanillaNotificaciones.tsx" | kind=code-symbol | source=components/notificaciones/CampanillaNotificaciones.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …, 863c575 Merge pull request #24 from pre…, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "rol_servicios_types": "types.ts" | kind=code-symbol | source=lib/rol-servicios/types.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, mapper.ts, page.tsx, repository.ts, service.ts] | lang=en
- "scripts_trace_client": "trace-client.mjs" | kind=code-symbol | source=scripts/trace-client.mjs:L1 | neighbors=[22bf125 Merge pull request #20 from pre…, 3c12c41 cambios en flujo de 911-despacho, 863c575 Merge pull request #24 from pre…, buildHelperCode(), components, __dirname] | lang=en
- "steps_pasovehiculo": "PasoVehiculo.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoVehiculo.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "agente_liberaciones_service": "service.ts" | kind=code-symbol | source=lib/agente_liberaciones/service.ts:L1 | neighbors=[actions.ts, mapper.ts, rowToLiberacion(), permisos.ts, tienePermiso(), repository.ts] | lang=en
- "agente_liberaciones_types": "types.ts" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L1 | neighbors=[actions.ts, mapper.ts, repository.ts, service.ts, LiberacionesResponse, LiberacionRow] | lang=en
- "alertas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/alertas/route.ts:L1 | neighbors=[GET(), auth.ts, auth, permisos.ts, verificarAccesoPrevencionApi(), repository.ts] | lang=en
- "camara_repository": "repository.ts" | kind=code-symbol | source=lib/camara/repository.ts:L1 | neighbors=[mapper.ts, rowToIncidenteCamara(), rowToTotalesCamara(), obtenerConcentradoDiario(), obtenerIncidentesCamara(), obtenerPorTurno()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@07543deef08b193525fe36cc4a9e2572606ece35": "07543de Conexion de reportes con d1 y los diarios, mensuales y semanales" | kind=Commit | source=git | neighbors=[feature/testing, main, 1acddac Merge branch 'feature/testing' …, D1Filters.tsx, D1ReportsTable.tsx, page.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@11be750b77ec68eaf2e0a3a4c0446aa9a201a161": "11be750 Fase 1 de correccion - completada - pendiente testing" | kind=Commit | source=git | neighbors=[actions.ts, actions.ts, actions.ts, feature/testing, main, ffcea0c fase 1 completada] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@511fea4852dac57d7ddd8e358852e232259c8c75": "511fea4 Modulo de despacho" | kind=Commit | source=git | neighbors=[route.ts, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5a1b5d59c49de0856d3a09a05af0c3781d718690": "5a1b5d5 empezando corralon" | kind=Commit | source=git | neighbors=[feature/testing, main, f5fac0b Merge branch 'testing' into con…, actions.ts, layout.tsx, module-card.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5ed311a75808b99e806e1f6fae238fec714aaa6d": "5ed311a Merge pull request #5 from presidenciaSJR/fix/detenidos" | kind=Commit | source=git | neighbors=[23a3b9d Cambios en la estructura de los…, 5abc683 Merge branch 'feature/auxiliar'…, feature/testing, fix/incidentes-camara, fix/subir-fotografias, main] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-007.json

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
