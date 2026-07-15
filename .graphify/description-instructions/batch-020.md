# Node Description Batch 21 of 93

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

- "gruas_route": "route.ts" | kind=code-symbol | source=app/api/complementos/gruas/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto, repository.ts] | lang=en
- "incidentes_actions_createincidentecliente": "createIncidenteCliente()" | kind=code-symbol | source=lib/incidentes/actions.ts:L165 | neighbors=[Formulario911.tsx, actions.ts, createAlarmaEscolar(), createExtorsion(), num(), req()] | lang=en
- "incidentes_folio": "folio.ts" | kind=code-symbol | source=lib/incidentes/folio.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 6feefe2 BackEnd completo para hacer la …, 863c575 Merge pull request #24 from pre…, actions.ts, generarFolioIncidente(), db.ts] | lang=en
- "infracciones_constants": "constants.ts" | kind=code-symbol | source=features/via/infracciones/constants.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, datosIniciales] | lang=en
- "lib_error_handler_tryaction": "tryAction()" | kind=code-symbol | source=lib/error-handler.ts:L46 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, actions.ts, actions.ts] | lang=en
- "lib_error_handler_tryactionraw": "tryActionRaw()" | kind=code-symbol | source=lib/error-handler.ts:L59 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, actions.ts, actions.ts] | lang=en
- "manual_migrations_0006_formato_n_public_formato_n_reportes": "public.formato_n_reportes" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L88 | neighbors=[0006_formato_n.sql, formato_n_armas_aseguradas, formato_n_atencion_victimas, formato_n_eventos, formato_n_fge, formato_n_fgr] | lang=en
- "modulo_incidentes_styles_styles": "styles" | kind=code-symbol | source=components/reportes/modulo_incidentes/styles.ts:L1 | neighbors=[page.tsx, PhonePagination.tsx, PhoneReportsTable.tsx, PhoneStatsCards.tsx, page.tsx, ReportesTabs.tsx] | lang=en
- "monitorista_filaincidentecamara": "FilaIncidenteCamara.tsx" | kind=code-symbol | source=components/monitorista/FilaIncidenteCamara.tsx:L1 | neighbors=[5311c24 Editar Registros, 863c575 Merge pull request #24 from pre…, b170599 Merge branch 'feature/testing' …, c27a9ee fase prefinal, caef6e8 Merge pull request #7 from pres…, page.tsx] | lang=en
- "ncoordinacion_profiledropdowncoordinacion": "ProfileDropdownCoordinacion.tsx" | kind=code-symbol | source=components/nCoordinacion/ProfileDropdownCoordinacion.tsx:L1 | neighbors=[67b1cb7 ReporteWord, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, page.tsx, auth-client.ts, authClient] | lang=en
- "oficial_selectordestinolegal": "SelectorDestinoLegal.tsx" | kind=code-symbol | source=components/oficial/SelectorDestinoLegal.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 863c575 Merge pull request #24 from pre…, FormularioRecorrido.tsx, DESTINOS] | lang=en
- "prevencion_busquedasfiltros": "BusquedasFiltros.tsx" | kind=code-symbol | source=components/prevencion/BusquedasFiltros.tsx:L1 | neighbors=[page.tsx, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, BusquedasFiltros(), ESTADOS, TIPOS] | lang=en
- "prevencion_searchbox": "SearchBox.tsx" | kind=code-symbol | source=components/prevencion/SearchBox.tsx:L1 | neighbors=[7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, BusquedasFiltros.tsx, JuridicoFiltros.tsx, MedidasFiltros.tsx, SearchBox()] | lang=en
- "prevencion_semaforo": "semaforo.ts" | kind=code-symbol | source=lib/prevencion/semaforo.ts:L1 | neighbors=[0caf5dd Fixes, 5558751 feat: módulo Prevención del Del…, 863c575 Merge pull request #24 from pre…, page.tsx, page.tsx, calcularSemaforoVigencia()] | lang=en
- "proxy": "proxy.ts" | kind=code-symbol | source=proxy.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, 6cb1055 Mejoras de UI/UIX, auth.ts, Session, config, isPublic()] | lang=en
- "reportes_welcomebanner": "welcomeBanner.tsx" | kind=code-symbol | source=components/reportes/welcomeBanner.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, page.tsx] | lang=en
- "rol_servicios_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L18 | neighbors=[mapper.ts, rowToBodyCam(), rowToEstadoFuerzaConcepto(), rowToMedioCanalizacion(), rowToRadio(), rowToSector()] | lang=en
- "rol_servicios_rolinputs": "RolInputs.tsx" | kind=code-symbol | source=components/rol_servicios/RolInputs.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, b68a2b7 Merge branch 'feature/testing' …, f9243ac Interfaz de formulario de rol d…, page.tsx, Props] | lang=en
- "rol_servicios_servicefooter": "ServiceFooter.tsx" | kind=code-symbol | source=components/rol_servicios/ServiceFooter.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, b68a2b7 Merge branch 'feature/testing' …, f9243ac Interfaz de formulario de rol d…, page.tsx, ServiceFooter()] | lang=en
- "ui_cardtitle_cardtitle": "CardTitle()" | kind=code-symbol | source=features/via/infracciones/components/ui/CardTitle.tsx:L1 | neighbors=[PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, PasoVehiculo.tsx, SeccionGarantia.tsx] | lang=en
- "utils_generateppt": "generatePPT.ts" | kind=code-symbol | source=lib/utils/generatePPT.ts:L1 | neighbors=[generarPresentacion.tsx, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 863c575 Merge pull request #24 from pre…, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis] | lang=en
- "911_modulecard": "ModuleCard.tsx" | kind=code-symbol | source=components/911/ModuleCard.tsx:L1 | neighbors=[ModuleCard(), ModuleCardProps, Stat, 0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, a24949a Merge branch 'feature/testing' …] | lang=en
- "agente_juzgado_confirmacionmodal": "ConfirmacionModal.tsx" | kind=code-symbol | source=components/agente_juzgado/ConfirmacionModal.tsx:L1 | neighbors=[ConfirmacionModal(), ConfirmacionModalProps, VARIANTES, JuzgadoDashboard.tsx, 75e03e9 puliendo flujo de juzgado-liber…, 863c575 Merge pull request #24 from pre…] | lang=en
- "agente_juzgado_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/agente_juzgado/ProfileDropdown.tsx:L14 | neighbors=[page.tsx, ProfileDropdown.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "analisis_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/analisis/permisos.ts:L9 | neighbors=[permisos.ts, tieneAccesoAnalisis(), verificarAccesoAnalisisApi(), page.tsx, page.tsx, page.tsx] | lang=en
- "auth_layout": "layout.tsx" | kind=code-symbol | source=app/(auth)/layout.tsx:L1 | neighbors=[AuthLayout(), metadata, 5aa5866 Cambio de colores en interfaz d…, 5f13b34 Merge branch 'feature/testing' …, 6a042cd feat: sistema de autenticación,…, 863c575 Merge pull request #24 from pre…] | lang=en
- "camara_types": "types.ts" | kind=code-symbol | source=lib/camara/types.ts:L1 | neighbors=[mapper.ts, repository.ts, IncidenteCamara, TotalesCamara, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0c8695c15b5c89d0871fbbc3841f5fc2a7f80bcf": "0c8695c Cambios en filtros" | kind=Commit | source=git | neighbors=[feature/testing, main, ef95840 Merge branch 'feature/testing' …, DescargaFilters.tsx, 4c9fa8a vista de reporte de d1 no inici…, conexion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@18f5bac124f7a516e4c794e54c13763523e60419": "18f5bac llamada en card" | kind=Commit | source=git | neighbors=[feature/testing, main, 22b7b54 Merge branch 'feature/reportes'…, page.tsx, 719b5ab cambio para generacion de repor…, conexion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3800cab22dfc4c9c5936d59d18ae8d7fc2d84b00": "3800cab formulario de nueva medida de proteccion" | kind=Commit | source=git | neighbors=[1970615 vista de medidas, feature/testing, main, adf0c3d vista de busqueda y juridico, page.tsx, conexion] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5641e69060dbea6d3d76670e3b0f4a08ae7873f3": "5641e69 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[4af36d9 Merge pull request #18 from pre…, feature/testing, main, ac9ad49 Merge branch 'feature/testing' …, c776b58 Integrar Alexandria (bóveda de …, conexion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6cdc6110fa47887931803c59793034338c936f8b": "6cdc611 Merge pull request #22 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[2233342 Fix/MarcarEnSitio, 4075365 actualizando ignore, feature/testing, main, 0068216 Mejora de Dashboard, Login y tr…, 1f7c0d7 Merge pull request #23 from pre…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7a1ae943a8b8690ef340cbbe435f562941ea99ef": "7a1ae94 911-rondin" | kind=Commit | source=git | neighbors=[3c12c41 cambios en flujo de 911-despacho, feature/testing, main, 22bf125 Merge pull request #20 from pre…, context-loader.js, ab-test.mjs] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7af0ca79d22e1999f9b6c50baed36ce9a260cb00": "7af0ca7 page de reportes actualizado" | kind=Commit | source=git | neighbors=[1acddac Merge branch 'feature/testing' …, feature/testing, main, 2fcba7b vista de reportes de incidentes…, page.tsx, conexion] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@dba1bfbdc2ce4fe738967eccad3d22a8439ba787": "dba1bfb color de boton" | kind=Commit | source=git | neighbors=[156c925 vista de reporte de sin robos, feature/testing, main, 1acddac Merge branch 'feature/testing' …, page.tsx, conexion] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@fe98642c55b564ea884be82ff0c7bc4bdfa8766b": "fe98642 modificando agents.md" | kind=Commit | source=git | neighbors=[ec3acf7 iniciando reset de testing, feature/testing, main, 03f8b2a implementado rbac, 4af36d9 Merge pull request #18 from pre…, conexion] | lang=en
- "complementos_repository": "repository.ts" | kind=code-symbol | source=lib/complementos/repository.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, GruaRow, listarGruasActivas(), db.ts, query()] | lang=en
- "components_pagoinfraccion": "PagoInfraccion.tsx" | kind=code-symbol | source=features/via/infracciones/components/PagoInfraccion.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, PagoInfraccion(), Props] | lang=en
- "corralon_layout": "layout.tsx" | kind=code-symbol | source=app/corralon/layout.tsx:L1 | neighbors=[5a1b5d5 empezando corralon, 863c575 Merge pull request #24 from pre…, CorralonLayout(), auth.ts, auth, core.ts] | lang=en
- "corralon_mapper": "mapper.ts" | kind=code-symbol | source=lib/corralon/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, rowToSolicitud(), toStr(), types.ts, SolicitudRow] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-020.json

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
