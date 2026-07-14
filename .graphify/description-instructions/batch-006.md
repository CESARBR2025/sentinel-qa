# Node Description Batch 7 of 87

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ff6d3c2eb2a562855f19a14395c044964623a263": "ff6d3c2 juzgado" | kind=Commit | source=git | neighbors=[5f13b34 Merge branch 'feature/testing' …, conexion, testing, 5bbdda8 Merge pull request #8 from pres…, abrirDocumento.ts, actions.ts] | lang=en
- "components_revisiondocumentossection": "RevisionDocumentosSection.tsx" | kind=code-symbol | source=features/liberaciones/components/RevisionDocumentosSection.tsx:L1 | neighbors=[LiberacionesDashboard.tsx, 0b210fa Merge pull request #12 from pre…, 16a63d4 Merge branch 'feature/testing' …, 1acddac Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 4400923 Merge branch 'feature/testing' …] | lang=en
- "d1_repository": "repository.ts" | kind=code-symbol | source=lib/d1/repository.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 07543de Conexion de reportes con d1 y l…, 16a63d4 Merge branch 'feature/testing' …, 290d651 feat(despacho): flujo integral …, 552d291 Merge branch 'testing' into con…, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "fiscalia_tabsolicitudes": "TabSolicitudes.tsx" | kind=code-symbol | source=components/fiscalia/TabSolicitudes.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, 997ef65 Merge pull request #2 from pres…, a291695 Merge branch 'feature/testing' …] | lang=en
- "liberaciones_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/liberaciones/page.tsx:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 75e03e9 puliendo flujo de juzgado-liber…, 953d38a implementando vista de fiscalia, ff3622b Merge pull request #11 from pre…, ff6d3c2 juzgado] | lang=en
- "roles_route": "route.ts" | kind=code-symbol | source=app/api/admin/roles/route.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 27dcb21 Merge branch 'feature/testing' …, 356d3a7 Subir rol agregado, falta darle…, 44a01c3 fase 3-4-5, 44ebbc4 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed] | lang=en
- "scripts_session_checkpoint": "session-checkpoint.mjs" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, addDecision(), append(), args, budget(), budgetReport()] | lang=en
- "scripts_trace_server": "trace-server.mjs" | kind=code-symbol | source=scripts/trace-server.mjs:L1 | neighbors=[11ee4f2 mejorando flujo de 911, __dirname, dirty, escapeRegex(), EXTENSIONS, fileMap] | lang=en
- "steps_secciongarantia": "SeccionGarantia.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionGarantia.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "steps_seccionmotivo": "SeccionMotivo.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionMotivo.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoInfraccion.tsx, actions.ts] | lang=en
- "subir_archivo_route": "route.ts" | kind=code-symbol | source=app/api/via/ciudadano/subir-archivo/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 16df128 flujo de corralones listo, 1dbd480 flujo de liberaciones completado, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto] | lang=en
- "checklist_page": "page.tsx" | kind=code-symbol | source=app/auxiliar/checklist/page.tsx:L1 | neighbors=[permisos.ts, tienePermiso(), service.ts, listarParesReporte(), ChecklistPage(), auth.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1dbd48080de3d32ae2a09478a517c513f919bd3c": "1dbd480 flujo de liberaciones completado" | kind=Commit | source=git | neighbors=[067c4de arreglando flujo de fiscalia  a…, actions.ts, conexion, testing, fcb223f merge de testing, route.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@953d38a8785c865b6246509015755436900e1e6d": "953d38a implementando vista de fiscalia" | kind=Commit | source=git | neighbors=[6f8a089 Vista de estadisticos diarios, …, conexion, testing, 8095bdb limpiando .env, mailer.ts, server.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bd1a2232feea618e2956a3d5c0db185515c3a304": "bd1a223 Merge branch 'feature/vistas-reportes' into feature/testing" | kind=Commit | source=git | neighbors=[5ed311a Merge pull request #5 from pres…, conexion, testing, 50101e2 Merge pull request #6 from pres…, ReportFilters.tsx, ReportStat.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ede5a1dba726d7f39d03c50b028d77f38cd165d0": "ede5a1d eliminado referencias a via_prueba" | kind=Commit | source=git | neighbors=[16df128 flujo de corralones listo, conexion, testing, 11be750 Fase 1 de correccion - completa…, route.ts, repository.ts] | lang=pt
- "despacho_page": "page.tsx" | kind=code-symbol | source=app/agente_911/despacho/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, ac9ad49 Merge branch 'feature/testing' …, permisos.ts, obtenerRolNombre(), tieneAccesoSeccion()] | lang=en
- "editar_campo_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/editar-campo/route.ts:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 5ed311a Merge pull request #5 from pres…, 672bab5 libearciones para juzgado] | lang=en
- "enviar_foto_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/enviar-foto/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "formato_n_atencion_victimas_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-atencion-victimas/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_eventos_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-eventos/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fge_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-fge/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fgr_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-fgr/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_medios_alternativos_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-medios-alternativos/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_rnd_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formulario_ingreso_page": "page.tsx" | kind=code-symbol | source=app/analisis/formulario-ingreso/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 1e81ec8 Datos se autorellenan de denunc…, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "fuente_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/fuente/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "guardar_docs_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/guardar-docs/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5618308 guardado e evidencias con ed, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "historial_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/historial/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "infracciones_types": "types.ts" | kind=code-symbol | source=features/via/infracciones/types.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "monitorista_cardenviofoto": "CardEnvioFoto.tsx" | kind=code-symbol | source=components/monitorista/CardEnvioFoto.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 672bab5 libearciones para juzgado] | lang=en
- "oficial_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/oficial/ProfileDropdown.tsx:L1 | neighbors=[layout.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "roles_formulariorol": "FormularioRol.tsx" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L1 | neighbors=[page.tsx, 0c31cc2 Merge branch 'testing' into juz…, 27dcb21 Merge branch 'feature/testing' …, 356d3a7 Subir rol agregado, falta darle…, 44ebbc4 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed] | lang=en
- "stores_useinfraccionstore": "useInfraccionStore.ts" | kind=code-symbol | source=stores/useInfraccionStore.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, constants.ts] | lang=en
- "whatsapp_page": "page.tsx" | kind=code-symbol | source=app/agente_911/whatsapp/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, ac9ad49 Merge branch 'feature/testing' …, permisos.ts, tieneAccesoSeccion(), service.ts] | lang=en
- "agente_infracciones_infraccionesdashboard": "InfraccionesDashboard.tsx" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L1 | neighbors=[CapturarDatosInfractorModal.tsx, AVATAR_COLORS, EstatusInfracciones, getBadge(), getInitials(), hashColor()] | lang=en
- "agente_juzgado_capturardetallesform": "CapturarDetallesForm.tsx" | kind=code-symbol | source=components/agente_juzgado/CapturarDetallesForm.tsx:L1 | neighbors=[actions.ts, guardarDetallesAseguradoAction(), CapturarDetallesForm(), disabledSx, emptyItem(), EvidenciaItem] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@13f7f399992e81fb151dbac5fefc1deb171b965c": "13f7f39 Reporte-incidentes" | kind=Commit | source=git | neighbors=[conexion, testing, 27dcb21 Merge branch 'feature/testing' …, route.ts, actions.ts, FiltrosIncidencias.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@511fea4852dac57d7ddd8e358852e232259c8c75": "511fea4 Modulo de despacho" | kind=Commit | source=git | neighbors=[route.ts, testing, 0fe445e vista de oficial, aaab50d Merge branch 'main' of https://…, bf354f1 Nombre completo de quien captura, ed748a6 fORMULARIO DE DENUNCIA CONCLUIDO] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6109a7ac819aa22f0e87f9e6347104c452537239": "6109a7a replicando flujo para fiscalia" | kind=Commit | source=git | neighbors=[TabSolicitudes.tsx, conexion, testing, a7218bd Merge pull request #4 from pres…, actions.ts, CapturarDetallesForm.tsx] | lang=pt

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
