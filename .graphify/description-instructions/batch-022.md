# Node Description Batch 23 of 93

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

- "via_sa7": "sa7.ts" | kind=code-symbol | source=lib/via/sa7.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, route.ts, pagos.ts] | lang=en
- "911_permisos_obtenerrolnombre": "obtenerRolNombre()" | kind=code-symbol | source=lib/911/permisos.ts:L25 | neighbors=[permisos.ts, page.tsx, page.tsx, page.tsx, tieneAccesoHub(), tieneAccesoSeccion()] | lang=en
- "admin_admin_styles_btnprimario": "btnPrimario" | kind=code-symbol | source=app/admin/admin-styles.ts:L16 | neighbors=[admin-styles.ts, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "admin_transito_page": "page.tsx" | kind=code-symbol | source=app/admin-transito/page.tsx:L1 | neighbors=[AdminTransitoDashboardPage(), 0068216 Mejora de Dashboard, Login y tr…, 16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…, dc063f3 gestion de oficiales correctame…] | lang=en
- "admin_types": "types.ts" | kind=code-symbol | source=lib/admin/types.ts:L1 | neighbors=[mapper.ts, repository.ts, RolItem, UsuarioLista, 12aab65 fase 4, 863c575 Merge pull request #24 from pre…] | lang=en
- "agente_juzgado_actions_obtenerdashboardjuzgado": "obtenerDashboardJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L36 | neighbors=[actions.ts, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "agente_juzgado_botonverdetalle": "BotonVerDetalle.tsx" | kind=code-symbol | source=components/agente_juzgado/BotonVerDetalle.tsx:L1 | neighbors=[BotonVerDetalle(), BotonVerDetalleProps, JuzgadoDashboard.tsx, 75e03e9 puliendo flujo de juzgado-liber…, 863c575 Merge pull request #24 from pre…, ff3622b Merge pull request #11 from pre…] | lang=en
- "agente_juzgado_types_detalleasegurado": "DetalleAsegurado" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L18 | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, repository.ts, service.ts, types.ts] | lang=en
- "agente_liberaciones_service_verificarrolliberaciones": "verificarRolLiberaciones()" | kind=code-symbol | source=lib/agente_liberaciones/service.ts:L6 | neighbors=[actions.ts, service.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@09a02d502a750446d4922959aaa026119b734fe0": "09a02d5 Fix Reporte Rondin" | kind=Commit | source=git | neighbors=[feature/testing, main, 435348e corrigiendo flujo de rondin, f0089cf Merge pull request #21 from pre…, actions.ts, f4cf76c Actualización Rondin] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@54a87f1d329f459f1b266afb4b406706c78f8e78": "54a87f1 Fix oficial/despachos" | kind=Commit | source=git | neighbors=[feature/testing, main, 2233342 Fix/MarcarEnSitio, page.tsx, FormularioRecorrido.tsx, dd2f306 Fix Mapa] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@54d7324d5800f2fc2db384689934b3f092a82bb5": "54d7324 chore: dejar de versionar config MCP local de Alexandria" | kind=Commit | source=git | neighbors=[feature/testing, main, 0caf5dd Fixes, fcdb169 chore(graphify): actualiza graf…, conexion, testing] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6594f4a7d3f2e0fa3674302b4ae412dfd576f203": "6594f4a Flujos por Rol" | kind=Commit | source=git | neighbors=[feature/testing, main, 290d651 feat(despacho): flujo integral …, ac9ad49 Merge branch 'feature/testing' …, conexion, testing] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6c646afab60d76cab6a76094a1892433957f5f20": "6c646af fix loader bug en login" | kind=Commit | source=git | neighbors=[11ee4f2 mejorando flujo de 911, feature/testing, main, de6da3e mejorando despacho, page.tsx, conexion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a7a7f2e084cd75996841e4eeb0019d3671cacfde": "a7a7f2e boveda" | kind=Commit | source=git | neighbors=[feature/testing, main, a21f03f fix bugs reporte denuncia, e6bffc9 boveda conectada, conexion, testing] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c776b5881c43c8a0acbc67cb9696f9b9a77735b3": "c776b58 Integrar Alexandria (bóveda de conocimiento local vía MCP)" | kind=Commit | source=git | neighbors=[feature/testing, main, 5641e69 Merge branch 'feature/testing' …, ec3acf7 iniciando reset de testing, conexion, testing] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@e211eefd572dbc8a9bedcdde8eb32d55fe19b171": "e211eef upload AGENTS" | kind=Commit | source=git | neighbors=[514a705 refactorizacion sql, feature/testing, main, ad3ec5f mejorando esto, conexion, testing] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@fcdb169e76940c47bc1f42e7975ee8fc19a49bed": "fcdb169 chore(graphify): actualiza grafo tras flujo integral de despacho" | kind=Commit | source=git | neighbors=[290d651 feat(despacho): flujo integral …, feature/testing, main, 54d7324 chore: dejar de versionar confi…, conexion, testing] | lang=nl
- "components_filadetenidorol": "FilaDetenidoRol.tsx" | kind=code-symbol | source=components/FilaDetenidoRol.tsx:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, 863c575 Merge pull request #24 from pre…, de5682f Merge pull request #10 from pre…, FilaDetenidoRol(), page.tsx] | lang=en
- "components_pagetransition": "PageTransition.tsx" | kind=code-symbol | source=components/PageTransition.tsx:L1 | neighbors=[layout.tsx, 0068216 Mejora de Dashboard, Login y tr…, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, PageTransition(), Stage] | lang=en
- "curp_route": "route.ts" | kind=code-symbol | source=app/api/via/curp/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, POST()] | lang=en
- "db_create_admin": "create-admin.ts" | kind=code-symbol | source=lib/db/create-admin.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, 863c575 Merge pull request #24 from pre…, ffcea0c fase 1 completada, ADMIN, main(), pool] | lang=en
- "deteccion_camara_styles_styles": "styles" | kind=code-symbol | source=components/reportes/deteccion_camara/styles.ts:L1 | neighbors=[ReportFilters.tsx, ReportTables.tsx, styles.ts, ReportFilters.tsx, page.tsx, ReportFilters.tsx] | lang=en
- "expediente_client_subirarchivoexpediente": "subirArchivoExpediente()" | kind=code-symbol | source=lib/expediente/client.ts:L28 | neighbors=[client.ts, actions.ts, expediente.ts, route.ts, route.ts, route.ts] | lang=en
- "fiscalia_actions_obtenerdashboardfiscalia": "obtenerDashboardFiscalia()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L16 | neighbors=[page.tsx, actions.ts, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "fiscalia_printbutton": "PrintButton.tsx" | kind=code-symbol | source=components/fiscalia/PrintButton.tsx:L1 | neighbors=[1f7c0d7 Merge pull request #23 from pre…, 375d265 flujo de fiscalia, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, PrintButton(), page.tsx] | lang=en
- "fiscalia_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/fiscalia/ProfileDropdown.tsx:L14 | neighbors=[ProfileDropdown.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "fiscalia_types_detalleasegurado": "DetalleAsegurado" | kind=code-symbol | source=lib/fiscalia/types.ts:L131 | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, repository.ts, service.ts, types.ts] | lang=en
- "fiscalia_types_detenidodireccioninput": "DetenidoDireccionInput" | kind=code-symbol | source=lib/fiscalia/types.ts:L43 | neighbors=[actions.ts, actions.ts, FormularioAsegurado.tsx, repository.ts, service.ts, types.ts] | lang=en
- "fiscalia_types_puestadisposicioninput": "PuestaDisposicionInput" | kind=code-symbol | source=lib/fiscalia/types.ts:L110 | neighbors=[actions.ts, actions.ts, FormularioPuestaDisposicion.tsx, repository.ts, service.ts, types.ts] | lang=en
- "flota_service_listarpatrullasparaasignacion": "listarPatrullasParaAsignacion()" | kind=code-symbol | source=lib/flota/service.ts:L90 | neighbors=[page.tsx, service.ts, obtenerFlota(), page.tsx, page.tsx, page.tsx] | lang=en
- "health_repository": "repository.ts" | kind=code-symbol | source=lib/health/repository.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, ping(), db.ts, query(), route.ts] | lang=en
- "health_route": "route.ts" | kind=code-symbol | source=app/api/health/route.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, repository.ts, ping(), GET()] | lang=en
- "infracciones_service_infraccionesservice": "InfraccionesService" | kind=code-symbol | source=features/via/infracciones/service.ts:L32 | neighbors=[page.tsx, route.ts, service.ts, .obtenerPorId(), .registrarNuevaInfraccionSV(), route.ts] | lang=en
- "next_config": "next.config.ts" | kind=code-symbol | source=next.config.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, 75ca4b2 Merge pull request #9 from pres…, 863c575 Merge pull request #24 from pre…, 90da1ca Initial commit from Create Next…, 953d38a implementando vista de fiscalia, nextConfig] | lang=en
- "notificaciones_mapper": "mapper.ts" | kind=code-symbol | source=lib/notificaciones/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, rowToNotificacion(), types.ts, Notificacion, repository.ts] | lang=en
- "oficial_toastexito_toastexito": "ToastExito()" | kind=code-symbol | source=components/oficial/ToastExito.tsx:L6 | neighbors=[page.tsx, page.tsx, page.tsx, ToastExito.tsx, page.tsx, page.tsx] | lang=en
- "oficial_types_rondinoficialresumen": "RondinOficialResumen" | kind=code-symbol | source=lib/oficial/types.ts:L210 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts, RondinPageClient.tsx, RondinTabla.tsx] | lang=en
- "reportes_sin_d1_types": "types.ts" | kind=code-symbol | source=lib/reportes-sin-d1/types.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, SinD1Row] | lang=en
- "reportes_sin_novedad_types": "types.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/types.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, SinNovedadRow] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-022.json

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
