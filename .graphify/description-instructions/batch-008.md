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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a58a0f77049ab34a6a5b10e85183163716785b7d": "a58a0f7 Despachos" | kind=Commit | source=git | neighbors=[71912a4 Bitacora incluida, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "configuracion_page": "page.tsx" | kind=code-symbol | source=app/oficial/configuracion/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…] | lang=en
- "contestacion_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/contestacion/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …] | lang=en
- "d1_service": "service.ts" | kind=code-symbol | source=lib/d1/service.ts:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 1f7c0d7 Merge pull request #23 from pre…, 2e958e1 catalogo de grupo de incidencia, 552d291 Merge branch 'testing' into con…, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…] | lang=en
- "db_seed": "seed.ts" | kind=code-symbol | source=lib/db/seed.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 090c4dd vista de fiscalia, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 2dde720 Merge pull request #14 from pre…, 4400923 Merge branch 'feature/testing' …] | lang=en
- "expediente_client": "client.ts" | kind=code-symbol | source=lib/expediente/client.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "formato_n_armas_aseguradas_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-armas-aseguradas/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "iniciar_proceso_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/iniciar-proceso/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "iph_bitacoraiph": "BitacoraIPH.tsx" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 5618308 guardado e evidencias con ed, 56b6577 FORMULARIO SE ENLAZO A LA TABLA…, 863c575 Merge pull request #24 from pre…, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis] | lang=en
- "iph_page": "page.tsx" | kind=code-symbol | source=app/analisis/iph/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9d67ddf Cambios de formulario analisis] | lang=en
- "monitorista_botonsubirdenuncia": "BotonSubirDenuncia.tsx" | kind=code-symbol | source=components/monitorista/BotonSubirDenuncia.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "monitorista_subirevidenciamodal": "SubirEvidenciaModal.tsx" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "reportes_campo_route": "route.ts" | kind=code-symbol | source=app/api/analisis/reportes-campo/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 1e81ec8 Datos se autorellenan de denunc…, 27dcb21 Merge branch 'feature/testing' …, 3249f00 Cambios en rellenado de ppt!, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed] | lang=en
- "roles_page": "page.tsx" | kind=code-symbol | source=app/admin/roles/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0c31cc2 Merge branch 'testing' into juz…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 12aab65 fase 4, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "usuarios_page": "page.tsx" | kind=code-symbol | source=app/admin/usuarios/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 12aab65 fase 4, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "admin_transito_modalreactivaroficial": "ModalReactivarOficial.tsx" | kind=code-symbol | source=components/admin-transito/ModalReactivarOficial.tsx:L1 | neighbors=[actions.ts, reactivarOficialConDatos(), Departamento, inputStyle, labelStyle, ModalReactivarOficial()] | lang=en
- "agente_infracciones_types": "types.ts" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L1 | neighbors=[actions.ts, mapper.ts, ModalEntregarGarantia.tsx, repository.ts, service.ts, CapturaInfractorInput] | lang=en
- "agregar_page": "page.tsx" | kind=code-symbol | source=app/admin/roles/agregar/page.tsx:L1 | neighbors=[AgregarRolPage(), auth.ts, auth, Footer.tsx, DashboardFooter(), FormularioRol.tsx] | lang=en
- "busquedas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/route.ts:L1 | neighbors=[GET(), POST(), auth.ts, auth, actions.ts, createFichaApi()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@23a3b9db16f36971ecf13d363a5e05b58fbad045": "23a3b9d Cambios en la estructura de los reportes de los detenidos" | kind=Commit | source=git | neighbors=[feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main, 5ed311a Merge pull request #5 from pres…] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5ef7cf3542628cc5d6a4fb8cc32b9a2856a05bf5": "5ef7cf3 Agregar los campos faltantes" | kind=Commit | source=git | neighbors=[4c9fa8a vista de reporte de d1 no inici…, feature/testing, main, 0b210fa Merge pull request #12 from pre…, 712c116 Merge branch 'testing' into con…, ef95840 Merge branch 'feature/testing' …] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9ec605647493f07c106fc892f96cd7940d488318": "9ec6056 flujo de juzgado-monitorista completo" | kind=Commit | source=git | neighbors=[821abe0 replicando flujo de fiscalia-> …, actions.ts, repository.ts, service.ts, TabSolicitudes.tsx, feature/monitorista-reportes] | lang=nl
- "components_mapadireccionregistro": "MapaDireccionRegistro.tsx" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L1 | neighbors=[12aab65 fase 4, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a21f03f fix bugs reporte denuncia, b5233a8 implementando via como modulo d…] | lang=en
- "corralon_actions": "actions.ts" | kind=code-symbol | source=lib/corralon/actions.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, 863c575 Merge pull request #24 from pre…, obtenerDashboardCorralon(), obtenerSolicitudes(), TabSolicitudes] | lang=en
- "despacho_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/[id]/despacho/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a58a0f7 Despachos, ad3ec5f mejorando esto] | lang=en
- "fiscalia_formularioasegurado": "FormularioAsegurado.tsx" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L1 | neighbors=[2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, actions.ts] | lang=en
- "fiscalia_formulariopuestadisposicion": "FormularioPuestaDisposicion.tsx" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L1 | neighbors=[2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, actions.ts] | lang=en
- "fiscalia_pedirevidenciasmodal": "PedirEvidenciasModal.tsx" | kind=code-symbol | source=components/fiscalia/PedirEvidenciasModal.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 905531c trabajando en panel de fiscalia, 997ef65 Merge pull request #2 from pres…] | lang=en
- "flota_repository": "repository.ts" | kind=code-symbol | source=lib/flota/repository.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a21f03f fix bugs reporte denuncia, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…] | lang=en
- "generar_ppt_page": "page.tsx" | kind=code-symbol | source=app/analisis/generar-ppt/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "infracciones_repository": "repository.ts" | kind=code-symbol | source=features/via/infracciones/repository.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "medidas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/medidas/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto] | lang=en
- "monitorista_expediente": "expediente.ts" | kind=code-symbol | source=lib/monitorista/expediente.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …] | lang=en
- "n_coordinacion_repository": "repository.ts" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L1 | neighbors=[67b1cb7 ReporteWord, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, route.ts, actions.ts, db.ts] | lang=en
- "prevencion_agregarautoridadform": "AgregarAutoridadForm.tsx" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "reportes_incidentes_service": "service.ts" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L1 | neighbors=[13f7f39 Reporte-incidentes, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, f7b1aac Merge branch 'feature/testing' …, fcb223f merge de testing, route.ts] | lang=en
- "rol_servicios_page": "page.tsx" | kind=code-symbol | source=app/rol_servicios/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, a2e0623 Consolidado de formatos N y Sub…, b68a2b7 Merge branch 'feature/testing' …, c27a9ee fase prefinal, f5fac0b Merge branch 'testing' into con…] | lang=en
- "steps_pasoconductor": "PasoConductor.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConductor.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadanoConductor.tsx] | lang=en
- "steps_pasodescuentos": "PasoDescuentos.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoDescuentos.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadanoConductor.tsx] | lang=en
- "subir_foto_detenido_route": "route.ts" | kind=code-symbol | source=app/api/expediente/subir-foto-detenido/route.ts:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, c27a9ee fase prefinal, de5682f Merge pull request #10 from pre…] | lang=en

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
