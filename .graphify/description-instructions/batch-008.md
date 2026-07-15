# Node Description Batch 9 of 93

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ff9f8c2cf5f985441183c8ff42a3a0ae0fdc6baa": "ff9f8c2 Modulo de Auxiliares" | kind=Commit | source=git | neighbors=[160d1e1 Monitorista V1.1, actions.ts, mapper.ts, page.tsx, repository.ts, service.ts] | lang=nl
- "emails_server": "server.ts" | kind=code-symbol | source=lib/emails/server.ts:L1 | neighbors=[service.ts, actions.ts, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 75ca4b2 Merge pull request #9 from pres…, 863c575 Merge pull request #24 from pre…] | lang=en
- "fiscalia_detallesaseguradoview": "DetallesAseguradoView.tsx" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L1 | neighbors=[1f7c0d7 Merge pull request #23 from pre…, 375d265 flujo de fiscalia, 5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…] | lang=en
- "iph_page": "page.tsx" | kind=code-symbol | source=app/analisis/iph/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 27dcb21 Merge branch 'feature/testing' …, 3ec7484 Header y Footer Fix, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "monitorista_layout": "layout.tsx" | kind=code-symbol | source=app/monitorista/layout.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes] | lang=en
- "notificaciones_campanillanotificaciones": "CampanillaNotificaciones.tsx" | kind=code-symbol | source=components/notificaciones/CampanillaNotificaciones.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …, 863c575 Merge pull request #24 from pre…, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "rol_servicios_types": "types.ts" | kind=code-symbol | source=lib/rol-servicios/types.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, mapper.ts, page.tsx, repository.ts, service.ts] | lang=en
- "scripts_trace_client": "trace-client.mjs" | kind=code-symbol | source=scripts/trace-client.mjs:L1 | neighbors=[22bf125 Merge pull request #20 from pre…, 3c12c41 cambios en flujo de 911-despacho, 863c575 Merge pull request #24 from pre…, buildHelperCode(), components, __dirname] | lang=en
- "steps_pasovehiculo": "PasoVehiculo.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoVehiculo.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "agente_liberaciones_types": "types.ts" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L1 | neighbors=[actions.ts, mapper.ts, service.ts, LiberacionesResponse, LiberacionRow, RolRow] | lang=en
- "alertas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/alertas/route.ts:L1 | neighbors=[GET(), auth.ts, auth, permisos.ts, verificarAccesoPrevencionApi(), repository.ts] | lang=en
- "camara_repository": "repository.ts" | kind=code-symbol | source=lib/camara/repository.ts:L1 | neighbors=[mapper.ts, rowToIncidenteCamara(), rowToTotalesCamara(), obtenerConcentradoDiario(), obtenerIncidentesCamara(), obtenerPorTurno()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@07543deef08b193525fe36cc4a9e2572606ece35": "07543de Conexion de reportes con d1 y los diarios, mensuales y semanales" | kind=Commit | source=git | neighbors=[feature/testing, main, 1acddac Merge branch 'feature/testing' …, D1Filters.tsx, D1ReportsTable.tsx, page.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@11be750b77ec68eaf2e0a3a4c0446aa9a201a161": "11be750 Fase 1 de correccion - completada - pendiente testing" | kind=Commit | source=git | neighbors=[actions.ts, actions.ts, actions.ts, feature/testing, main, ffcea0c fase 1 completada] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@511fea4852dac57d7ddd8e358852e232259c8c75": "511fea4 Modulo de despacho" | kind=Commit | source=git | neighbors=[route.ts, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5a1b5d59c49de0856d3a09a05af0c3781d718690": "5a1b5d5 empezando corralon" | kind=Commit | source=git | neighbors=[feature/testing, main, f5fac0b Merge branch 'testing' into con…, actions.ts, layout.tsx, module-card.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5ed311a75808b99e806e1f6fae238fec714aaa6d": "5ed311a Merge pull request #5 from presidenciaSJR/fix/detenidos" | kind=Commit | source=git | neighbors=[23a3b9d Cambios en la estructura de los…, 5abc683 Merge branch 'feature/auxiliar'…, feature/testing, fix/incidentes-camara, fix/subir-fotografias, main] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8ce87da6e1c2a25c0e17adb97f5be3ce914db829": "8ce87da Cambios en todos los headers" | kind=Commit | source=git | neighbors=[3ec7484 Header y Footer Fix, layout.tsx, feature/testing, page.tsx, page.tsx, page.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a58a0f77049ab34a6a5b10e85183163716785b7d": "a58a0f7 Despachos" | kind=Commit | source=git | neighbors=[71912a4 Bitacora incluida, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "contestacion_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/contestacion/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …] | lang=en
- "d1_service": "service.ts" | kind=code-symbol | source=lib/d1/service.ts:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 1f7c0d7 Merge pull request #23 from pre…, 2e958e1 catalogo de grupo de incidencia, 552d291 Merge branch 'testing' into con…, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…] | lang=en
- "db_seed": "seed.ts" | kind=code-symbol | source=lib/db/seed.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 090c4dd vista de fiscalia, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 2dde720 Merge pull request #14 from pre…, 4400923 Merge branch 'feature/testing' …] | lang=en
- "expediente_client": "client.ts" | kind=code-symbol | source=lib/expediente/client.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "formato_n_armas_aseguradas_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-armas-aseguradas/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "fotos_page": "page.tsx" | kind=code-symbol | source=app/oficial/reportes/[id]/fotos/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 388b997 Apartados para subir fotografia…, 514a705 refactorizacion sql, 672bab5 libearciones para juzgado, 863c575 Merge pull request #24 from pre…, 8ce87da Cambios en todos los headers] | lang=en
- "generar_orden_pago_route": "route.ts" | kind=code-symbol | source=app/api/via/sa7/generar-orden-pago/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "generar_ppt_page": "page.tsx" | kind=code-symbol | source=app/analisis/generar-ppt/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 27dcb21 Merge branch 'feature/testing' …, 3ec7484 Header y Footer Fix, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "iph_bitacoraiph": "BitacoraIPH.tsx" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 5618308 guardado e evidencias con ed, 56b6577 FORMULARIO SE ENLAZO A LA TABLA…, 863c575 Merge pull request #24 from pre…, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis] | lang=en
- "monitorista_botonsubirdenuncia": "BotonSubirDenuncia.tsx" | kind=code-symbol | source=components/monitorista/BotonSubirDenuncia.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "monitorista_subirevidenciamodal": "SubirEvidenciaModal.tsx" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "reportes_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/reportes/permisos.ts:L9 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, route.ts, page.tsx] | lang=en
- "revision_documental_page": "page.tsx" | kind=code-symbol | source=app/agente_liberaciones/revision-documental/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 3ec7484 Header y Footer Fix, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…] | lang=en
- "rol_servicios_page": "page.tsx" | kind=code-symbol | source=app/rol_servicios/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 6adb8ad Correciones de versión y nombre, 863c575 Merge pull request #24 from pre…, a2e0623 Consolidado de formatos N y Sub…, b68a2b7 Merge branch 'feature/testing' …, c27a9ee fase prefinal] | lang=en
- "roles_page": "page.tsx" | kind=code-symbol | source=app/admin/roles/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0c31cc2 Merge branch 'testing' into juz…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 12aab65 fase 4, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "usuarios_page": "page.tsx" | kind=code-symbol | source=app/admin/usuarios/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 12aab65 fase 4, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "admin_transito_modalreactivaroficial": "ModalReactivarOficial.tsx" | kind=code-symbol | source=components/admin-transito/ModalReactivarOficial.tsx:L1 | neighbors=[actions.ts, reactivarOficialConDatos(), Departamento, inputStyle, labelStyle, ModalReactivarOficial()] | lang=en
- "agente_infracciones_types": "types.ts" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L1 | neighbors=[actions.ts, mapper.ts, ModalEntregarGarantia.tsx, repository.ts, service.ts, CapturaInfractorInput] | lang=en
- "agregar_page": "page.tsx" | kind=code-symbol | source=app/admin/roles/agregar/page.tsx:L1 | neighbors=[AgregarRolPage(), auth.ts, auth, Footer.tsx, DashboardFooter(), FormularioRol.tsx] | lang=en
- "busquedas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/route.ts:L1 | neighbors=[GET(), POST(), auth.ts, auth, actions.ts, createFichaApi()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@23a3b9db16f36971ecf13d363a5e05b58fbad045": "23a3b9d Cambios en la estructura de los reportes de los detenidos" | kind=Commit | source=git | neighbors=[feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main, 5ed311a Merge pull request #5 from pres…] | lang=es

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-008.json

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
