# Graph Report - .  (2026-06-23)

## Corpus Check
- 71 files · ~28,848 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 319 nodes · 543 edges · 21 communities (13 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Medidas Protección UI|Medidas Protección UI]]
- [[_COMMUNITY_Admin & Alertas API|Admin & Alertas API]]
- [[_COMMUNITY_Autenticación 2FA|Autenticación 2FA]]
- [[_COMMUNITY_Auth Library & Notificaciones|Auth Library & Notificaciones]]
- [[_COMMUNITY_Formularios Nuevos Registros|Formularios Nuevos Registros]]
- [[_COMMUNITY_Esquema Base de Datos|Esquema Base de Datos]]
- [[_COMMUNITY_Búsquedas API Routes|Búsquedas API Routes]]
- [[_COMMUNITY_Detalle Búsqueda & Timeline|Detalle Búsqueda & Timeline]]
- [[_COMMUNITY_Detalle Solicitud Jurídica|Detalle Solicitud Jurídica]]
- [[_COMMUNITY_Solicitudes API & Schema|Solicitudes API & Schema]]
- [[_COMMUNITY_Medidas API Routes|Medidas API Routes]]
- [[_COMMUNITY_Navegación Prevención|Navegación Prevención]]
- [[_COMMUNITY_Layout App & Providers|Layout App & Providers]]
- [[_COMMUNITY_Script Admin BD|Script Admin BD]]
- [[_COMMUNITY_Visitas Domiciliarias|Visitas Domiciliarias]]
- [[_COMMUNITY_Script Seed BD|Script Seed BD]]
- [[_COMMUNITY_Layout Autenticación|Layout Autenticación]]
- [[_COMMUNITY_Solicitudes C4 Internas|Solicitudes C4 Internas]]
- [[_COMMUNITY_Auth Client SDK|Auth Client SDK]]

## God Nodes (most connected - your core abstractions)
1. `db` - 21 edges
2. `db` - 12 edges
3. `auth` - 11 edges
4. `fichasBusqueda` - 10 edges
5. `generarAlertasBusquedas()` - 9 edges
6. `roles` - 8 edges
7. `users` - 7 edges
8. `seguimientosBusqueda` - 7 edges
9. `solicitudesInformacion` - 7 edges
10. `AutoridadBadge()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `generarAlertasBusquedas()`  [EXTRACTED]
  app/api/notificaciones/route.ts → lib/notificaciones/checker.ts
- `PrevencionLayout()` --calls--> `generarAlertasBusquedas()`  [EXTRACTED]
  app/prevencion/layout.tsx → lib/notificaciones/checker.ts
- `MedidaDetailPage()` --calls--> `calcularSemaforoVigencia()`  [INFERRED]
  app/prevencion/medidas/[id]/page.tsx → lib/prevencion/semaforo.ts
- `SeguimientoTimeline()` --calls--> `getLabelSeguimiento()`  [EXTRACTED]
  components/prevencion/SeguimientoTimeline.tsx → lib/prevencion/timeline.ts
- `generarAlertasBusquedas()` --calls--> `getLabelSeguimiento()`  [EXTRACTED]
  lib/notificaciones/checker.ts → lib/prevencion/timeline.ts

## Import Cycles
- None detected.

## Communities (21 total, 8 thin omitted)

### Community 0 - "Medidas Protección UI"
Cohesion: 0.06
Nodes (27): medidaAutoridadesAdicionales, MedidaDetailPage(), COLOR_MAP, addAutoridadMedida(), createProrroga(), createVisita(), AgregarAutoridadForm(), Autoridad (+19 more)

### Community 1 - "Admin & Alertas API"
Cohesion: 0.09
Nodes (20): createUser(), requireAdmin(), updateUser(), TIPO_CFG, db, fichasBusqueda, roles, sessions (+12 more)

### Community 2 - "Autenticación 2FA"
Cohesion: 0.07
Nodes (10): Enable2FA(), s, Step, Module, ModuleCards(), MODULES, SignOutButton(), authClient (+2 more)

### Community 3 - "Auth Library & Notificaciones"
Cohesion: 0.11
Nodes (18): { GET, POST }, Notificacion, notificaciones, auth, AuthUser, Session, generarAlertasDebug(), marcarLeida() (+10 more)

### Community 4 - "Formularios Nuevos Registros"
Cohesion: 0.07
Nodes (7): AUTORIDADES, AUTORIDADES, TIPOS, cancelarFicha(), createFicha(), createMedida(), createSolicitud()

### Community 5 - "Esquema Base de Datos"
Cohesion: 0.06
Nodes (30): accounts, Contestacion, contestacionesRelations, FichaBusqueda, fichasBusquedaRelations, MedidaAutoridadAdicional, medidaAutoridadesAdicionalesRelations, MedidaProteccion (+22 more)

### Community 6 - "Búsquedas API Routes"
Cohesion: 0.16
Nodes (3): seguimientosBusqueda, db, query()

### Community 7 - "Detalle Búsqueda & Timeline"
Cohesion: 0.17
Nodes (11): fmtDT(), FichaDetailPage(), TIPO_CFG, toISO(), createSeguimiento(), CancelacionModal(), Props, SeguimientoTimeline() (+3 more)

### Community 8 - "Detalle Solicitud Jurídica"
Cohesion: 0.19
Nodes (8): fmtDT(), SolicitudDetailPage(), toDate(), createContestacion(), createSolicitudC4(), ContestacionForm(), inputStyle, SolicitudC4Form()

### Community 11 - "Navegación Prevención"
Cohesion: 0.25
Nodes (3): Alertas, ICONS, NAV

### Community 13 - "Script Admin BD"
Cohesion: 0.40
Nodes (3): ADMIN, db, pool

## Knowledge Gaps
- **84 isolated node(s):** `metadata`, `LogType`, `LogLine`, `L`, `I` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `db` connect `Admin & Alertas API` to `Medidas Protección UI`, `Auth Library & Notificaciones`, `Formularios Nuevos Registros`, `Detalle Búsqueda & Timeline`, `Detalle Solicitud Jurídica`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `auth` connect `Auth Library & Notificaciones` to `Medidas Protección UI`, `Admin & Alertas API`, `Autenticación 2FA`, `Formularios Nuevos Registros`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `metadata`, `LogType`, `LogLine` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Medidas Protección UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06363636363636363 - nodes in this community are weakly interconnected._
- **Should `Admin & Alertas API` be split into smaller, more focused modules?**
  _Cohesion score 0.08771929824561403 - nodes in this community are weakly interconnected._
- **Should `Autenticación 2FA` be split into smaller, more focused modules?**
  _Cohesion score 0.06756756756756757 - nodes in this community are weakly interconnected._
- **Should `Auth Library & Notificaciones` be split into smaller, more focused modules?**
  _Cohesion score 0.10685483870967742 - nodes in this community are weakly interconnected._