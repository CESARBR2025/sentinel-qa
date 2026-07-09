# Node Description Batch 8 of 79

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

- "agente_infracciones_types": "types.ts" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L1 | neighbors=[actions.ts, mapper.ts, ModalEntregarGarantia.tsx, repository.ts, service.ts, CapturaInfractorInput] | lang=en
- "busquedas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/route.ts:L1 | neighbors=[GET(), POST(), auth.ts, auth, actions.ts, createFichaApi()] | lang=en
- "checklist_page": "page.tsx" | kind=code-symbol | source=app/auxiliar/checklist/page.tsx:L1 | neighbors=[helpers.ts, getUserWithRole(), permisos.ts, tienePermiso(), service.ts, listarParesReporte()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@07543deef08b193525fe36cc4a9e2572606ece35": "07543de Conexion de reportes con d1 y los diarios, mensuales y semanales" | kind=Commit | source=git | neighbors=[conexion, testing, 1acddac Merge branch 'feature/testing' …, D1Filters.tsx, D1ReportsTable.tsx, page.tsx] | lang=es
- "configuracion_page": "page.tsx" | kind=code-symbol | source=app/oficial/configuracion/page.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, ConfiguracionPerfilPage(), service.ts] | lang=en
- "corralon_actions": "actions.ts" | kind=code-symbol | source=lib/corralon/actions.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, obtenerDashboardCorralon(), obtenerSolicitudes(), TabSolicitudes, service.ts] | lang=en
- "despacho_despachoform": "DespachoForm.tsx" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L1 | neighbors=[511fea4 Modulo de despacho, BTN, BTN_SM, DespachoForm(), Elemento, ERR] | lang=en
- "despacho_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/[id]/despacho/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, a58a0f7 Despachos, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "fiscalia_formularioasegurado": "FormularioAsegurado.tsx" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L1 | neighbors=[2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, actions.ts, guardarDetallesAseguradosAction()] | lang=en
- "fiscalia_formulariopuestadisposicion": "FormularioPuestaDisposicion.tsx" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L1 | neighbors=[2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, actions.ts, guardarPuestaDisposicionAction()] | lang=en
- "infracciones_repository": "repository.ts" | kind=code-symbol | source=features/via/infracciones/repository.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 91c36bf validando orden de pago] | lang=en
- "iph_bitacoraiph": "BitacoraIPH.tsx" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L1 | neighbors=[5618308 guardado e evidencias con ed, 56b6577 FORMULARIO SE ENLAZO A LA TABLA…, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …, fcb223f merge de testing] | lang=en
- "iph_page": "page.tsx" | kind=code-symbol | source=app/analisis/iph/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…] | lang=en
- "medidas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/medidas/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "monitorista_expediente": "expediente.ts" | kind=code-symbol | source=lib/monitorista/expediente.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …] | lang=en
- "partials_subheader_subheader": "SubHeader()" | kind=code-symbol | source=components/partials/SubHeader.tsx:L18 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "reportes_incidentes_service": "service.ts" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L1 | neighbors=[13f7f39 Reporte-incidentes, ad3ec5f mejorando esto, f7b1aac Merge branch 'feature/testing' …, fcb223f merge de testing, route.ts, page.tsx] | lang=en
- "roles_page": "page.tsx" | kind=code-symbol | source=app/admin/roles/page.tsx:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 12aab65 fase 4, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed] | lang=en
- "steps_pasoconductor": "PasoConductor.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConductor.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadanoConductor.tsx, PasoConductor()] | lang=en
- "steps_pasodescuentos": "PasoDescuentos.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoDescuentos.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadanoConductor.tsx, ArchivoField] | lang=en
- "subir_foto_detenido_route": "route.ts" | kind=code-symbol | source=app/api/expediente/subir-foto-detenido/route.ts:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, ad3ec5f mejorando esto, c27a9ee fase prefinal, de5682f Merge pull request #10 from pre…, client.ts] | lang=en
- "usuarios_page": "page.tsx" | kind=code-symbol | source=app/admin/usuarios/page.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 12aab65 fase 4, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…] | lang=en
- "visitas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/medidas/[id]/visitas/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "whatsapp_page": "page.tsx" | kind=code-symbol | source=app/911/whatsapp/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, 519716a Formulario para registro de wha…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 95b78c1 cambios de incidentes] | lang=en
- "admin_admin_styles": "admin-styles.ts" | kind=code-symbol | source=app/admin/admin-styles.ts:L1 | neighbors=[btnPrimario, btnSecundario, cardStyle, inputStyle, labelStyle, pageWrap] | lang=en
- "admin_transito_modalreactivaroficial": "ModalReactivarOficial.tsx" | kind=code-symbol | source=components/admin-transito/ModalReactivarOficial.tsx:L1 | neighbors=[actions.ts, reactivarOficialConDatos(), Departamento, inputStyle, labelStyle, ModalReactivarOficial()] | lang=en
- "agente_infracciones_capturardatosinfractormodal": "CapturarDatosInfractorModal.tsx" | kind=code-symbol | source=components/agente_infracciones/CapturarDatosInfractorModal.tsx:L1 | neighbors=[actions.ts, capturarInfractorInfraccionesAction(), CapturarDatosInfractorModal(), DatosForm(), Field(), FieldName] | lang=en
- "agregar_page": "page.tsx" | kind=code-symbol | source=app/admin/roles/agregar/page.tsx:L1 | neighbors=[AgregarRolPage(), auth.ts, auth, Footer.tsx, DashboardFooter(), FormularioRol.tsx] | lang=en
- "auxiliar_service": "service.ts" | kind=code-symbol | source=lib/auxiliar/service.ts:L1 | neighbors=[actions.ts, repository.ts, obtenerCuestionariosRobo(), obtenerParesReporte(), upsertChecklist(), guardarChecklist()] | lang=en
- "calcular_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-fge/calcular/route.ts:L1 | neighbors=[GET(), auth.ts, auth, formato-n-fge-service.ts, calcularConteosPorFecha(), permisos.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@11be750b77ec68eaf2e0a3a4c0446aa9a201a161": "11be750 Fase 1 de correccion - completada - pendiente testing" | kind=Commit | source=git | neighbors=[actions.ts, actions.ts, actions.ts, conexion, ffcea0c fase 1 completada, actions.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@458bbfbbbb8506645773d87e6588d25115f17d1c": "458bbfb registro de reporte de campo - oficial" | kind=Commit | source=git | neighbors=[0fe445e vista de oficial, conexion, testing, 93dd3ea Merge pull request #1 from pres…, schema.ts, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5a1b5d59c49de0856d3a09a05af0c3781d718690": "5a1b5d5 empezando corralon" | kind=Commit | source=git | neighbors=[conexion, f5fac0b Merge branch 'testing' into con…, actions.ts, layout.tsx, module-card.tsx, page.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5ef7cf3542628cc5d6a4fb8cc32b9a2856a05bf5": "5ef7cf3 Agregar los campos faltantes" | kind=Commit | source=git | neighbors=[4c9fa8a vista de reporte de d1 no inici…, conexion, testing, 0b210fa Merge pull request #12 from pre…, 712c116 Merge branch 'testing' into con…, ef95840 Merge branch 'feature/testing' …] | lang=es
- "components_capturardatostitularsection": "CapturarDatosTitularSection.tsx" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection(), Field()] | lang=en
- "components_mapadireccionregistro": "MapaDireccionRegistro.tsx" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L1 | neighbors=[12aab65 fase 4, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, cleanColoniaName()] | lang=en
- "despacho_page": "page.tsx" | kind=code-symbol | source=app/911/despacho/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 511fea4 Modulo de despacho, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, permisos.ts] | lang=en
- "despacho_tablondespacho": "TablonDespacho.tsx" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L1 | neighbors=[511fea4 Modulo de despacho, page.tsx, DespachoForm.tsx, DespachoForm(), btnBackStyle, CanalBadge()] | lang=en
- "fiscalia_cargaroficiosection": "CargarOficioSection.tsx" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "fiscalia_pedirevidenciasmodal": "PedirEvidenciasModal.tsx" | kind=code-symbol | source=components/fiscalia/PedirEvidenciasModal.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 5f13b34 Merge branch 'feature/testing' …, 905531c trabajando en panel de fiscalia, 997ef65 Merge pull request #2 from pres…, 9ec6056 flujo de juzgado-monitorista co…] | lang=en

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
