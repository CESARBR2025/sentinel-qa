# Node Description Batch 22 of 93

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6cdc6110fa47887931803c59793034338c936f8b": "6cdc611 Merge pull request #22 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[2233342 Fix/MarcarEnSitio, 4075365 actualizando ignore, feature/testing, main, 0068216 Mejora de Dashboard, Login y tr…, 1f7c0d7 Merge pull request #23 from pre…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7a1ae943a8b8690ef340cbbe435f562941ea99ef": "7a1ae94 911-rondin" | kind=Commit | source=git | neighbors=[3c12c41 cambios en flujo de 911-despacho, feature/testing, main, 22bf125 Merge pull request #20 from pre…, context-loader.js, ab-test.mjs] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7af0ca79d22e1999f9b6c50baed36ce9a260cb00": "7af0ca7 page de reportes actualizado" | kind=Commit | source=git | neighbors=[1acddac Merge branch 'feature/testing' …, feature/testing, main, 2fcba7b vista de reportes de incidentes…, page.tsx, conexion] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@dba1bfbdc2ce4fe738967eccad3d22a8439ba787": "dba1bfb color de boton" | kind=Commit | source=git | neighbors=[156c925 vista de reporte de sin robos, feature/testing, main, 1acddac Merge branch 'feature/testing' …, page.tsx, conexion] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@fe98642c55b564ea884be82ff0c7bc4bdfa8766b": "fe98642 modificando agents.md" | kind=Commit | source=git | neighbors=[ec3acf7 iniciando reset de testing, feature/testing, main, 03f8b2a implementado rbac, 4af36d9 Merge pull request #18 from pre…, conexion] | lang=en
- "complementos_repository": "repository.ts" | kind=code-symbol | source=lib/complementos/repository.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, GruaRow, listarGruasActivas(), db.ts, query()] | lang=en
- "components_pagoinfraccion": "PagoInfraccion.tsx" | kind=code-symbol | source=features/via/infracciones/components/PagoInfraccion.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, PagoInfraccion(), Props] | lang=en
- "corralon_layout": "layout.tsx" | kind=code-symbol | source=app/corralon/layout.tsx:L1 | neighbors=[5a1b5d5 empezando corralon, 863c575 Merge pull request #24 from pre…, CorralonLayout(), auth.ts, auth, core.ts] | lang=en
- "corralon_mapper": "mapper.ts" | kind=code-symbol | source=lib/corralon/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, rowToSolicitud(), toStr(), types.ts, SolicitudRow] | lang=en
- "dashboard_sign_out_button": "sign-out-button.tsx" | kind=code-symbol | source=app/dashboard/sign-out-button.tsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, SignOutButton(), auth-client.ts, authClient, Header.tsx, SubHeader.tsx] | lang=en
- "fiscalia_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=lib/fiscalia/abrirDocumento.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5bbdda8 Merge pull request #8 from pres…, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…, ff6d3c2 juzgado] | lang=en
- "fiscalia_confirmacionmodal": "ConfirmacionModal.tsx" | kind=code-symbol | source=components/fiscalia/ConfirmacionModal.tsx:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, 863c575 Merge pull request #24 from pre…, ff6d3c2 juzgado, ConfirmacionModal(), ConfirmacionModalProps, VARIANTES] | lang=en
- "fiscalia_types_puestadisposicionrow": "PuestaDisposicionRow" | kind=code-symbol | source=lib/fiscalia/types.ts:L94 | neighbors=[actions.ts, actions.ts, FormularioPuestaDisposicion.tsx, mapper.ts, repository.ts, service.ts] | lang=en
- "helpers_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=features/via/expediente/helpers/abrirDocumento.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, af993fb Fix/Monitorista, f5fac0b Merge branch 'testing' into con…] | lang=en
- "hooks_useempleado": "useEmpleado.ts" | kind=code-symbol | source=hooks/useEmpleado.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, 863c575 Merge pull request #24 from pre…, a58a0f7 Despachos, DespachoForm.tsx, EmpleadoResult, useEmpleado()] | lang=en
- "hooks_useflota": "useFlota.ts" | kind=code-symbol | source=hooks/useFlota.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, 863c575 Merge pull request #24 from pre…, a58a0f7 Despachos, DespachoForm.tsx, FiltrosFlota, useFlota()] | lang=en
- "hooks_useregistrodetenido": "useRegistroDetenido.ts" | kind=code-symbol | source=hooks/useRegistroDetenido.ts:L1 | neighbors=[generarPresentacion.tsx, 06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5830570 Seccion de analista, uya con bd…, 863c575 Merge pull request #24 from pre…, a353e63 Ya se enlazan datos pero no com…] | lang=en
- "incidentes_actions_num": "num()" | kind=code-symbol | source=lib/incidentes/actions.ts:L31 | neighbors=[actions.ts, createIncidente(), createIncidenteCliente(), createRecorridoCompleto(), createReporteCampo(), createRondinEscalado()] | lang=en
- "incidentes_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L26 | neighbors=[mapper.ts, rowToAlarmaEscolar(), rowToIncidenteDetalleCompletoBase(), rowToIncidentePendiente(), rowToPersonaAfectada(), rowToReporteCampo()] | lang=en
- "incidentes_statincidencia": "StatIncidencia.tsx" | kind=code-symbol | source=components/reportes/incidentes/StatIncidencia.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …, IncidenteStat()] | lang=en
- "infracciones_repository_infraccionesrepository": "InfraccionesRepository" | kind=code-symbol | source=features/via/infracciones/repository.ts:L4 | neighbors=[actions.ts, repository.ts, .eliminarInfraccion(), .obtenerDatosInfraccionCiudadanoRP(), .obtenerSiguienteSecuencia(), .registarNuevaInfraccionRP()] | lang=en
- "manual_migrations_0008_monitorista_permisos": "0008_monitorista_permisos.sql" | kind=code-symbol | source=lib/db/manual-migrations/0008_monitorista_permisos.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, f2c66e6 Extender roles y permisos finos…, monitorista_permisos] | lang=en
- "manual_migrations_0011_permisos_plantillas": "0011_permisos_plantillas.sql" | kind=code-symbol | source=lib/db/manual-migrations/0011_permisos_plantillas.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, f2c66e6 Extender roles y permisos finos…, permisos_plantillas] | lang=en
- "oficial_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/oficial/mapper.ts:L69 | neighbors=[mapper.ts, rowToD1(), rowToDespachoAsignado(), rowToReporteCampo(), rowToReporteCampoParaD1(), rowToReporteResumen()] | lang=en
- "ordensalida_generarordensalida_generarordensalidavehiculo": "generarOrdenSalidaVehiculo()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L61 | neighbors=[route.ts, generarOrdenSalida.ts, drawWatermark(), formatearFecha(), formatearOficio(), loadImageAsBase64()] | lang=en
- "prevencion_autoridadbadge": "AutoridadBadge.tsx" | kind=code-symbol | source=components/prevencion/AutoridadBadge.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, page.tsx, AgregarAutoridadForm.tsx, AutoridadBadge()] | lang=en
- "prevencion_cancelacionmodal": "CancelacionModal.tsx" | kind=code-symbol | source=components/prevencion/CancelacionModal.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, actions.ts, cancelarFicha(), CancelacionModal(), InputField()] | lang=en
- "prevencion_juridicofiltros": "JuridicoFiltros.tsx" | kind=code-symbol | source=components/prevencion/JuridicoFiltros.tsx:L1 | neighbors=[7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, page.tsx, AUTORIDADES, JuridicoFiltros(), SearchBox.tsx] | lang=en
- "prevencion_paginate": "paginate.ts" | kind=code-symbol | source=lib/prevencion/paginate.ts:L1 | neighbors=[page.tsx, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, page.tsx, page.tsx, paginate()] | lang=en
- "prevencion_pagination": "Pagination.tsx" | kind=code-symbol | source=components/prevencion/Pagination.tsx:L1 | neighbors=[page.tsx, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, page.tsx, page.tsx, Pagination()] | lang=en
- "prevencion_prorrogamodal": "ProrrogaModal.tsx" | kind=code-symbol | source=components/prevencion/ProrrogaModal.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, page.tsx, actions.ts, createProrroga(), I, L] | lang=en
- "prevencion_semaforovigencia": "SemaforoVigencia.tsx" | kind=code-symbol | source=components/prevencion/SemaforoVigencia.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, semaforo.ts, SemaforoColor, CFG] | lang=en
- "prevencion_timeline": "timeline.ts" | kind=code-symbol | source=lib/prevencion/timeline.ts:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, checker.ts, SeguimientoTimeline.tsx, calcularFechaEsperada(), getLabelSeguimiento(), TIPOS_SEGUIMIENTO] | lang=en
- "reportes_sin_d1_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-d1/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, rowToSinD1(), toStr(), types.ts, SinD1Row] | lang=en
- "reportes_sin_novedad_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, rowToSinNovedad(), toStr(), types.ts, SinNovedadRow] | lang=en
- "sasiete_client": "client.ts" | kind=code-symbol | source=features/via/saSiete/client.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "services_registrodetenidoservice": "registroDetenidoService.ts" | kind=code-symbol | source=services/registroDetenidoService.ts:L1 | neighbors=[generarPresentacion.tsx, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 863c575 Merge pull request #24 from pre…, 9550203 Cambios en presentacion, se gen…, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "ui_selectwrapper": "SelectWrapper.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/SelectWrapper.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionGarantia.tsx] | lang=en
- "ui_toastauto_toastauto": "ToastAuto()" | kind=code-symbol | source=components/ui/ToastAuto.tsx:L7 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, ToastAuto.tsx] | lang=en
- "via_expediente_getexpedientetoken": "getExpedienteToken()" | kind=code-symbol | source=lib/via/expediente.ts:L25 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, expediente.ts] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-021.json

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
