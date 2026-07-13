# Graph Report - .  (2026-07-13)

## Corpus Check
- Large corpus: 768 files · ~544,543 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 3320 nodes · 11112 edges · 119 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: MODIFIES: 3711 · contains: 2482 · imports: 1811 · imports_from: 1210 · ON_BRANCH: 1162 · calls: 335 · PARENT_OF: 304 · re_exports: 52 · method: 29 · references: 9 · inherits: 7


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 768 · Candidates: 821
- Excluded: 1 untracked · 71246 ignored · 0 sensitive · 30 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `54d7324`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `auth` - 135 edges
2. `query()` - 63 edges
3. `DashboardHeader()` - 25 edges
4. `getUserWithRole()` - 25 edges
5. `SubHeader()` - 17 edges
6. `tienePermiso()` - 17 edges
7. `tienePermiso()` - 16 edges
8. `authClient` - 14 edges
9. `AppError` - 14 edges
10. `toStr()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `crearHoja()`  [EXTRACTED]
  app/api/reportes-telefonicos/exportar/route.ts → app/api/camara/exportar/route.ts
- `DetalleCiudadanoCompletoPage()` --calls--> `getStatusBadgeStyle()`  [EXTRACTED]
  app/agente_911/ciudadano/incidentes/[id]/page.tsx → app/agente_911/whatsapp/incidentes/[id]/page.tsx
- `DetalleRondinCompletoPage()` --calls--> `getStatusBadgeStyle()`  [EXTRACTED]
  app/agente_911/rondin/incidentes/[id]/page.tsx → app/agente_911/whatsapp/incidentes/[id]/page.tsx
- `FichaDetailPage()` --calls--> `fmtDT()`  [EXTRACTED]
  app/prevencion/busquedas/[id]/page.tsx → app/prevencion/juridico/solicitudes/[id]/page.tsx
- `POST()` --calls--> `mapearEstatusFinal()`  [EXTRACTED]
  app/api/via/ciudadano/subir-archivo/route.ts → app/api/corralon/subir-archivo/route.ts

## Communities

### Community 99 - "Community 99"
Cohesion: 0.25
Nodes (6): __dirname, ROOT, CONTEXT_MAP_PATH, GRAPH_JSON, LOADER_SCRIPT, SKILL_PATH

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (52): metadata, generarFolioDenuncia(), generarFolioDenunciaUnico(), POST(), labelSx, inputSx, disabledSx, EvidenciaItem (+44 more)

### Community 46 - "Community 46"
Cohesion: 0.10
Nodes (7): Step, Enable2FA(), s, Props, ProfileDropdownAuxiliar(), authClient, 6a042cd feat: sistema de autenticación, dashboard y esquema de base de datos

### Community 82 - "Community 82"
Cohesion: 0.17
Nodes (2): LogType, LogLine

### Community 56 - "Community 56"
Cohesion: 0.14
Nodes (9): Props, ProfileDropdown(), containerStyle, Props, Props, GruaRow, listarGruasActivas(), 16a63d4 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.02
Nodes (61): labelStyle, inputStyle, selectStyle, btnPrimario(), btnSecundario, DetalleCiudadanoCompletoPage(), cardStyle, sectionTitleStyle (+53 more)

### Community 21 - "Community 21"
Cohesion: 0.06
Nodes (31): pageWrap, labelStyle, inputStyle, selectStyle, btnPrimario, btnSecundario, PERIODOS, FuenteIncidente (+23 more)

### Community 73 - "Community 73"
Cohesion: 0.24
Nodes (9): Props, requireAdminTransito(), crearOficial(), obtenerOficialesLista(), destituirOficial(), reactivarOficialConDatos(), obtenerOficialPorId(), actualizarOficial() (+1 more)

### Community 41 - "Community 41"
Cohesion: 0.12
Nodes (20): cardStyle, ToastAuto(), toStr(), rowToUsuarioLista(), rowToRol(), listarUsuarios(), obtenerUsuario(), listarRolesActivos() (+12 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (43): fmtDT(), ImprimirFichaPage(), TIPO_CFG, COLOR_MAP, ContestacionForm(), inputStyle, PrintButton(), ToastTipo (+35 more)

### Community 23 - "Community 23"
Cohesion: 0.16
Nodes (39): eslintConfig, config, 0e33bf6 feat: módulo Admin, Prórroga, Filtros medidas, Autoridades adicionales y Notificaciones/Alertas, 0fe445e vista de oficial, 133bb9d pages de listado de llamadas y de radio, 199ce68 Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publica, 2e36377 Eliminar tutoriales de flujo innecesarios, 356d3a7 Subir rol agregado, falta darle mejor vista (+31 more)

### Community 17 - "Community 17"
Cohesion: 0.07
Nodes (23): topLabelStyle, titleStyle, cardStyle, cardContentStyle, iconBoxStyle, cardTitleStyle, cardDescStyle, actionTextStyle (+15 more)

### Community 37 - "Community 37"
Cohesion: 0.11
Nodes (26): libraries, InputProps, SectionProps, libraries, 0844e6e Corregido, 166a26b Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, 23a3b9d Cambios en la estructura de los reportes de los detenidos, 25de428 Corrección para agregar el botón de cerrar sesion (+18 more)

### Community 61 - "Community 61"
Cohesion: 0.10
Nodes (14): cardStyle, sectionTitleStyle, decoratorStyle, thStyle, headerInnerStyle, tdStyle, btnNuevoStyle, btnViewStyle (+6 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (50): TH, TD, FilaIncidenteCamara(), DashboardHeaderProps, DashboardHeader(), ReportFilters(), ReportStat(), ReportTable() (+42 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (28): DataRow, InfraccionesTableProps, columns, Props, getGarantiaInfo(), ModalEntregarGarantia(), Props, ProfileDropdown() (+20 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (24): Props, ProfileDropdown(), ToastExito(), Props, ProfileDropdown(), TabAsegurados(), Props, Tab (+16 more)

### Community 26 - "Community 26"
Cohesion: 0.09
Nodes (19): pagBtn, btnDetalle, FilaDetenidoRol(), SubirFotoDetenido(), SubirFotoDetenido(), ETIQUETAS, CardEnvioFoto(), estadoBadge() (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (43): DataRow, LiberacionesTableProps, columns, Props, ProfileDropdown(), BotonVerDetalleProps, InfraccionDetalle, DetalleInfraccionModalProps (+35 more)

### Community 5 - "Community 5"
Cohesion: 0.04
Nodes (58): query(), Accion, registrarAudit(), obtenerSolicitudConEvidencias(), obtenerIphDetenido(), obtenerPrellenadoCompleto(), obtenerPrellenado(), FormatoNAtencionVictimas (+50 more)

### Community 28 - "Community 28"
Cohesion: 0.07
Nodes (21): BotonVerDetalleProps, BotonVerDetalle(), CargarOficioSectionProps, ConfirmacionModalProps, VARIANTES, AVATAR_COLORS, Props, EstatusJuzgado (+13 more)

### Community 69 - "Community 69"
Cohesion: 0.22
Nodes (6): QueryRow, ArticulosMapper, ArticulosRepository, FraccionLey, ArticuloLey, 27dcb21 Merge branch 'feature/testing' into feature/reportes

### Community 59 - "Community 59"
Cohesion: 0.14
Nodes (10): requireAuxiliar(), upsertChecklistAction(), Seccion, Accion, PermisoSeccion, tienePermiso(), tieneAccesoAuxiliar(), verificarAccesoAuxiliarApi() (+2 more)

### Community 40 - "Community 40"
Cohesion: 0.11
Nodes (21): COLS, WIDTHS, crearHoja(), GET(), getRango(), toStr(), toNum(), toNumNullable() (+13 more)

### Community 13 - "Community 13"
Cohesion: 0.06
Nodes (36): mapearEstatusFinal(), POST(), ModuleCard(), Props, ProfileDropdown(), estatusLabels, SolicitudesClient(), thStyle (+28 more)

### Community 42 - "Community 42"
Cohesion: 0.12
Nodes (16): mapCrearInfraccionToDB(), mapInfraccionDetalle(), InfraccionesRepository, randomBase36Char(), rellenarBase36(), generarFolioInfraccion(), InfraccionesService, sanitizeCrearInfraccionPayload() (+8 more)

### Community 38 - "Community 38"
Cohesion: 0.11
Nodes (21): POST(), detectarMime(), BotonGenerarPpt(), inputStyle, OPCIONES, BuscadorEvento(), obtenerGuestToken(), subirArchivoExpediente() (+13 more)

### Community 44 - "Community 44"
Cohesion: 0.09
Nodes (11): ping(), insertHistorial(), obtenerFolioReporteCampo(), enviarFoto(), subirFotoDetenido(), completarSolicitudFoto(), obtenerObtenerSolicitudFoto(), insertarEvidenciaDetenido() (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (35): cardStyle, onlineStyle, SolicitudRow, BandejaSolicitudes(), tabStyle(), btnPrimary, btnSuccess, btnDetalle (+27 more)

### Community 31 - "Community 31"
Cohesion: 0.09
Nodes (21): Notificacion, ToastProps, Props, CampanillaNotificaciones(), Props, SeguimientoTimeline(), marcarLeida(), marcarTodasLeidas() (+13 more)

### Community 103 - "Community 103"
Cohesion: 0.38
Nodes (5): obtenerDatosOperativos(), obtenerDatosExcel(), 07543de Conexion de reportes con d1 y los diarios, mensuales y semanales, de14b62 Merge branch 'feature/reportes' into feature/testing, f6954ec Conexion a la bd y la generacion de Excel

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (64): SignOutButton(), FormatoNAtencionVictimasPage(), filtroBtn(), FormatoNFgePage(), filtroBtn(), FormatoNFgrPage(), filtroBtn(), FormatoNMediosAlternativosPage() (+56 more)

### Community 72 - "Community 72"
Cohesion: 0.21
Nodes (11): PERIODOS, Periodo, parsePeriodo(), formatFecha(), rowTo(), listarAtencionVictimas(), obtenerAtencionVictimas(), obtenerAtencionVictimasPorFechaPeriodo() (+3 more)

### Community 71 - "Community 71"
Cohesion: 0.13
Nodes (7): IncidenteDetalle, IncidenteResumen, Filtros, ReporteCampoDetalle, 6feefe2 BackEnd completo para hacer la conección con la BD, 71912a4 Bitacora incluida, a58a0f7 Despachos

### Community 29 - "Community 29"
Cohesion: 0.08
Nodes (28): obtenerRolUsuario(), obtenerLiberaciones(), InfraccionUpdateRow, actualizarDatosInfractor(), obtenerConceptoId(), liberarGarantia(), insertarOrdenPagoSa7(), marcarOrdenPagoPagada() (+20 more)

### Community 60 - "Community 60"
Cohesion: 0.13
Nodes (6): OfiOficialRow, mapRowToOficialViaDTO(), OficialesViaRepository, OficialesViaService, OfiOficialViaDTO, b5233a8 implementando via como modulo de oficial

### Community 62 - "Community 62"
Cohesion: 0.19
Nodes (8): subirArchivo(), validarArchivo(), POST(), getExpedienteHost(), getExpedienteToken(), 2c128e5 test expediente vercel, ede5a1d eliminado referencias a via_prueba, f7b1aac Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing

### Community 51 - "Community 51"
Cohesion: 0.14
Nodes (9): OrdenPagoRow, mapRowToOrdenPago(), SA7Repository, SA7Service, CatalogoConceptoSA7, OrdenPagoSA7, GenerarOrdenPagoDTO, ResultadoSA7 (+1 more)

### Community 85 - "Community 85"
Cohesion: 0.18
Nodes (3): Module, MODULES, ModuleCards()

### Community 58 - "Community 58"
Cohesion: 0.10
Nodes (16): Periodo, Evento, PeriodoMetricas, Fge, Fgr, Rnd, Medios, Victimas (+8 more)

### Community 110 - "Community 110"
Cohesion: 0.50
Nodes (5): formatDate(), timeAgo(), sanitize(), getStatusStyle(), InfraccionCiudadanoPage()

### Community 57 - "Community 57"
Cohesion: 0.12
Nodes (11): eliminarInfraccionAction(), ProcesoModalProps, config, STEPS, getStepIndex(), ProcesoModal(), ProcesoEstado, ViewArticulosLista (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.05
Nodes (47): metadata, Props, labelSx, disabledSx, displayVal(), concatNombre(), FormularioAseguradoJuzgado(), Props (+39 more)

### Community 32 - "Community 32"
Cohesion: 0.06
Nodes (21): NuevaDetenidoPage(), btnSecundario, btnPrimario(), TIPOS, AUTORIDADES, AUTORIDADES, Autoridad, Props (+13 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (76): thStyle, tdStyle, num(), parseTurno(), parseSolicitudesJson(), rowToSolicitudEvidencia(), rowToEvidencia(), rowToHistorialEntry() (+68 more)

### Community 49 - "Community 49"
Cohesion: 0.13
Nodes (17): UnidadAsignadaSection(), toStr(), toBool(), rowToPatrulla(), estaStale(), upsertPatrullas(), listarActivas(), obtenerPorId() (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (47): parseJsonField(), rowToReporteCampo(), rowToOficial(), toStr(), rowToReporteResumen(), rowToDespachoAsignado(), rowToD1(), rowToReporteDetalle() (+39 more)

### Community 25 - "Community 25"
Cohesion: 0.10
Nodes (31): STEPS, PrefillDespacho, LocationData, MapaUbicacion(), ToastExito(), users, sessions, accounts (+23 more)

### Community 100 - "Community 100"
Cohesion: 0.25
Nodes (3): NAV, ICONS, Alertas

### Community 64 - "Community 64"
Cohesion: 0.25
Nodes (10): FiltrosIncidencias(), PaginationProps, IncidenteStat(), RowData, Props, TablaIncidentes(), styles, 2fcba7b vista de reportes de incidentes diarios y semanales (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.10
Nodes (28): Stat, ModuleCardProps, Props, RolField(), ServiceFooter(), Props, ServiceTable(), thStyle (+20 more)

### Community 34 - "Community 34"
Cohesion: 0.14
Nodes (19): PaginationProps, PaginacionSinRobos(), paginationButtonStyle, ReportFilters(), TablaReportesLimpios(), styles, toStr(), rowToSinD1() (+11 more)

### Community 80 - "Community 80"
Cohesion: 0.17
Nodes (11): CatalogoItem, Props, CANALES, ESTATUS, FiltrosIncidentes(), wrapperStyle, fieldStyle, labelStyle (+3 more)

### Community 95 - "Community 95"
Cohesion: 0.22
Nodes (8): PaginationProps, Pagination(), containerStyle, infoStyle, labelStyle, valueStyle, arrowBtnStyle, pageNumberStyle

### Community 39 - "Community 39"
Cohesion: 0.07
Nodes (25): Unidad, Elemento, I, BTN, BTN_SM, TAG, ERR, LBL (+17 more)

### Community 101 - "Community 101"
Cohesion: 0.29
Nodes (5): CatalogoItem, Props, ahoraLocal(), FormRondinEscalado(), inputStyle

### Community 74 - "Community 74"
Cohesion: 0.22
Nodes (10): EmpleadoResult, useEmpleado(), 14fd73a Update FormSection.tsx, 305b0bd se quitan campos, 5795f74 Búsqueda de nombre de policía por nómina, 81b9829 Cambios para guardado de persinas afectadas, 917002a Guardado de policia a cargo, bf354f1 Nombre completo de quien captura (+2 more)

### Community 114 - "Community 114"
Cohesion: 0.50
Nodes (1): MAIN_ROUTES

### Community 36 - "Community 36"
Cohesion: 0.09
Nodes (22): Departamento, Props, labelStyle, inputStyle, selectStyle, Departamento, Props, labelStyle (+14 more)

### Community 92 - "Community 92"
Cohesion: 0.20
Nodes (7): grid2Style, fieldContainerStyle, labelStyle, inputStyle, iconStyle, sectionTitleStyle, btnSubmitStyle

### Community 68 - "Community 68"
Cohesion: 0.14
Nodes (8): Props, FieldName, capturarInfractorInfraccionesAction(), CapturaInfractorState, CapturaInfractorActions, CapturaInfractorStore, initialState, useCapturaInfractorStore

### Community 50 - "Community 50"
Cohesion: 0.08
Nodes (14): AVATAR_COLORS, Props, EstatusInfracciones, STATUS_TABS, STATUS_BADGE, SORTABLE_KEYS, AVATAR_COLORS, Props (+6 more)

### Community 66 - "Community 66"
Cohesion: 0.14
Nodes (13): Props, Tab, tabs, TabSolicitudes(), TomarCasoBoton(), ExistingEvidencia, EvidenciaItem, emptyItem() (+5 more)

### Community 19 - "Community 19"
Cohesion: 0.05
Nodes (34): containerStyle, headerRowStyle, thStyle, tdStyle, trStyle, loadingStyle, btnStyle, paginationContainerStyle (+26 more)

### Community 75 - "Community 75"
Cohesion: 0.20
Nodes (10): containerStyle, headerRowStyle, thStyle, tdStyle, trStyle, btnStyle, btnPPTStyle, analistaService (+2 more)

### Community 52 - "Community 52"
Cohesion: 0.08
Nodes (20): mapContainerStyle, center, Prefill, grid4Style, grid3Style, grid2Style, fieldContainerStyle, labelStyle (+12 more)

### Community 70 - "Community 70"
Cohesion: 0.17
Nodes (8): BotonVerDetalleProps, ConfirmacionModalProps, VARIANTES, DataRow, FiscaliaTableProps, columns, 5bbdda8 Merge pull request #8 from presidenciaSJR/juzgado, ff6d3c2 juzgado

### Community 78 - "Community 78"
Cohesion: 0.14
Nodes (9): BotonVerDetalle(), AVATAR_COLORS, Props, EstatusFiscalia, STATUS_TABS, STATUS_BADGE, SORTABLE_KEYS, obtenerDetalleInfraccionViaAction() (+1 more)

### Community 81 - "Community 81"
Cohesion: 0.18
Nodes (6): CargarOficioSectionProps, guardarOficioAction(), ToastType, Toast, ToastStore, useToastStore

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (55): HistorialIncidente(), toStr(), toNum(), toBool(), rowToIncidenteListItem(), rowToIncidenteConDespachoBase(), rowToIncidentePendiente(), rowToPersonaAfectada() (+47 more)

### Community 104 - "Community 104"
Cohesion: 0.33
Nodes (5): FotoInfo, DetenidoRow, TablaDetenidos(), tabStyle(), btnDetalle

### Community 116 - "Community 116"
Cohesion: 0.50
Nodes (3): Props, PIN_ICONS, MapaPinFijo()

### Community 111 - "Community 111"
Cohesion: 0.40
Nodes (2): CancelacionModal(), cancelarFicha()

### Community 112 - "Community 112"
Cohesion: 0.40
Nodes (4): ProrrogaModal(), L, I, createProrroga()

### Community 118 - "Community 118"
Cohesion: 0.67
Nodes (2): ProrrogaViewerModalProps, ProrrogaViewerModal()

### Community 108 - "Community 108"
Cohesion: 0.40
Nodes (4): CFG, SemaforoVigencia(), SemaforoColor, calcularSemaforoVigencia()

### Community 83 - "Community 83"
Cohesion: 0.40
Nodes (7): D1Filters(), PaginationProps, D1Pagination(), D1ReportsTable(), styles, 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into conexion

### Community 89 - "Community 89"
Cohesion: 0.38
Nodes (6): DescargaFilters(), PaginationProps, DescargaPagination(), DescargaTable(), styles, 4c9fa8a vista de reporte de d1 no iniciada

### Community 77 - "Community 77"
Cohesion: 0.21
Nodes (8): PaginationProps, paginationButtonStyle, PhoneReport, PhoneReportsTable(), OperationalTableProps, OperationalTable(), ReportesTabs(), styles

### Community 43 - "Community 43"
Cohesion: 0.10
Nodes (22): InfraccionHeader, InfraccionLegal, InfraccionInfractor, InfraccionOficial, InfraccionVehiculo, InfraccionGarantia, InfraccionUbicacion, InfraccionDetalle (+14 more)

### Community 53 - "Community 53"
Cohesion: 0.11
Nodes (16): DetalleHeader, DetalleInfraccion, DetalleInfractor, DetalleVehiculo, DetalleGarantia, DetalleUbicacion, DetalleCompleto, Props (+8 more)

### Community 76 - "Community 76"
Cohesion: 0.15
Nodes (11): DocConfig, SubtipoTitular, DOCS_EMPRESA, DOCS_INFRACCION, DOCS_DELITO, DOCS_ACCIDENTE, SUBTIPOS_TITULAR, MOTIVO_TO_SUBTIPO (+3 more)

### Community 35 - "Community 35"
Cohesion: 0.10
Nodes (18): Props, Props, Props, Props, ArchivoField, InfraccionCreada, PasoPagoProps, ESTADOS_MEXICO (+10 more)

### Community 106 - "Community 106"
Cohesion: 0.29
Nodes (3): PasoConfirmacionProps, SeccionEstructurada, Props

### Community 45 - "Community 45"
Cohesion: 0.10
Nodes (19): Props, PasoEvidencias(), Props, Props, datosIniciales, DEFAULT_CENTER, LIBRARIES, containerStyle (+11 more)

### Community 93 - "Community 93"
Cohesion: 0.24
Nodes (6): PasoInfraccionProps, SeccionGarantiaProps, MAPA_GARANTIAS, SeccionGarantia(), SeccionMotivo(), SelectWrapper()

### Community 79 - "Community 79"
Cohesion: 0.18
Nodes (9): Fraccion, Articulo, SeccionMotivoProps, Option, CustomSelectProps, CustomSelect(), obtenerArticulosAction(), obtenerFraccionesAction() (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (50): 0c8695c Cambios en filtros, 1265204 paginacion por tablas, 160d1e1 Monitorista V1.1, 18f5bac llamada en card, 1970615 vista de medidas, 24626eb se agregan opciones de reportes, 28da720 Cambio de colores en dashboard y loader (correccion de imagen), 2ca9f50 Formulario sin backend (+42 more)

### Community 94 - "Community 94"
Cohesion: 0.39
Nodes (7): toStr(), toNum(), rowToIncidenteResumen(), rowToIncidenteDetalle(), IncidenteResumen, IncidenteDetalle, CatalogoItem

### Community 67 - "Community 67"
Cohesion: 0.20
Nodes (12): rowToCatalogo(), obtenerCatalogos(), obtenerStats(), listarIncidentes(), obtenerIncidente(), obtenerIncidenteConExtras(), listarIncidentesRecientes(), obtenerTiposIncidente() (+4 more)

### Community 47 - "Community 47"
Cohesion: 0.12
Nodes (11): toStr(), rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), listarDepartamentosActivos(), obtenerOficialExistente(), upsertOficial(), UserWithRole (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.04
Nodes (30): SECCIONES, Seccion, Accion, PermisoSeccion, SECCIONES, Seccion, Accion, PermisoSeccion (+22 more)

### Community 33 - "Community 33"
Cohesion: 0.11
Nodes (23): requireAdmin(), createUser(), updateUser(), AppError, NotFoundError, ValidationError, UnauthorizedError, ForbiddenError (+15 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (50): SolicitudesData, obtenerSolicitudes(), accionTomarCaso(), accionCerrarCaso(), LiberacionesData, AseguradosJuzgadoData, num(), rowToSolicitud() (+42 more)

### Community 54 - "Community 54"
Cohesion: 0.11
Nodes (8): rowToLiberacion(), obtenerRolUsuario(), obtenerLiberaciones(), verificarRolLiberaciones(), listarLiberaciones(), RolRow, LiberacionRow, 51e682b mejorando flujo de liberaciones

### Community 107 - "Community 107"
Cohesion: 0.40
Nodes (5): Session, PUBLIC_PATHS, isPublic(), proxy(), config

### Community 65 - "Community 65"
Cohesion: 0.26
Nodes (13): toStr(), rowToChecklist(), rowToParReporte(), rowToCuestionarioRobo(), obtenerParesReporte(), obtenerCuestionariosRobo(), upsertChecklist(), listarParesReporte() (+5 more)

### Community 84 - "Community 84"
Cohesion: 0.31
Nodes (8): toStr(), toNum(), toBool(), rowToReporteD1(), verificarFolioDenunciaUnico(), insertarReporteDenuncia(), ReporteD1, af993fb Fix/Monitorista

### Community 115 - "Community 115"
Cohesion: 0.50
Nodes (2): pool, ADMIN

### Community 91 - "Community 91"
Cohesion: 0.36
Nodes (9): formato_n_reportes, formato_n_eventos, formato_n_fge, formato_n_fgr, formato_n_rnd, formato_n_medios_alternativos, formato_n_atencion_victimas, formato_n_armas_aseguradas (+1 more)

### Community 55 - "Community 55"
Cohesion: 0.17
Nodes (16): transporter, MailAttachment, MailOptions, sendMail(), enviarCorreoAsignacionFiscalia(), enviarCorreoOrdenLiberacion(), EnviarCorreoAsignacionFiscaliaParams, templateAsignacionFiscalia() (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (58): SolicitudesData, LiberacionesData, AseguradosData, num(), rowToSolicitud(), rowToAsegurado(), rowToDetalleDetenidoGuardado(), rowToPuestaDisposicion() (+50 more)

### Community 117 - "Community 117"
Cohesion: 1.00
Nodes (2): obtenerTokenFiscalia(), subirArchivoFiscalia()

### Community 96 - "Community 96"
Cohesion: 0.22
Nodes (4): SECCIONES, Seccion, Accion, PermisoSeccion

### Community 48 - "Community 48"
Cohesion: 0.18
Nodes (21): requireOperador(), req(), num(), CANALES, TIPOS_REPORTE, ESTATUS, SEXOS, validarEnum() (+13 more)

### Community 98 - "Community 98"
Cohesion: 0.22
Nodes (4): SECCIONES, Seccion, Accion, PermisoSeccion

### Community 105 - "Community 105"
Cohesion: 0.52
Nodes (6): formatearFecha(), formatearOficio(), loadImageAsBase64(), drawWatermark(), parrafoMixtoConWrap(), generarOrdenSalidaVehiculo()

### Community 20 - "Community 20"
Cohesion: 0.08
Nodes (44): toStr(), toBool(), rowToMedida(), rowToBusqueda(), rowToSolicitud(), rowToMedidaDetalle(), rowToFichaBusquedaDetalle(), rowToSeguimiento() (+36 more)

### Community 63 - "Community 63"
Cohesion: 0.20
Nodes (15): toNum(), rowToReporteDiario(), rowToReporteSemanal(), obtenerReporteDiario(), obtenerReporteSemanal(), toNum(), toStr(), COMBO_KEYS (+7 more)

### Community 27 - "Community 27"
Cohesion: 0.13
Nodes (32): toStr(), rowToVehiculo(), rowToCateo(), rowToDetencionOfi(), rowToDetencionInc(), rowToOrdenAprehension(), rowToHidrocarburo(), rowToArma() (+24 more)

### Community 109 - "Community 109"
Cohesion: 0.40
Nodes (4): getFormatoNStats(), getIncidentesCount(), getEnvioFormatosCount(), FormatoNStats

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (57): requireAdmin(), req(), TablaCatalogo, toggleCatalogo(), createSector(), toggleSector(), createRadio(), toggleRadio() (+49 more)

### Community 97 - "Community 97"
Cohesion: 0.22
Nodes (1): TWEAKS

### Community 86 - "Community 86"
Cohesion: 0.18
Nodes (2): DC, DCCtx

### Community 90 - "Community 90"
Cohesion: 0.20
Nodes (1): TWEAKS

### Community 88 - "Community 88"
Cohesion: 0.18
Nodes (1): WF

### Community 102 - "Community 102"
Cohesion: 0.36
Nodes (6): SCHEMAS, ColumnInfo, getTables(), getColumns(), getEnums(), main()

### Community 113 - "Community 113"
Cohesion: 0.40
Nodes (3): __dirname, ROOT, KEYWORDS

### Community 87 - "Community 87"
Cohesion: 0.25
Nodes (10): __dirname, ROOT, CONTEXT_MAP, GRAPH_JSON, KEYWORDS, extractDomain(), resolvePath(), queryGraph() (+2 more)

## Knowledge Gaps
- **698 isolated node(s):** `__dirname`, `ROOT`, `CONTEXT_MAP_PATH`, `GRAPH_JSON`, `LOADER_SCRIPT` (+693 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 82`** (2 nodes): `LogType`, `LogLine`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 114`** (1 nodes): `MAIN_ROUTES`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 111`** (2 nodes): `CancelacionModal()`, `cancelarFicha()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 118`** (2 nodes): `ProrrogaViewerModalProps`, `ProrrogaViewerModal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 115`** (2 nodes): `pool`, `ADMIN`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 117`** (2 nodes): `obtenerTokenFiscalia()`, `subirArchivoFiscalia()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (2 nodes): `DC`, `DCCtx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (1 nodes): `WF`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `auth` connect `Community 17` to `Community 33`, `Community 2`, `Community 73`, `Community 56`, `Community 1`, `Community 24`, `Community 11`, `Community 8`, `Community 59`, `Community 51`, `Community 0`, `Community 57`, `Community 12`, `Community 49`, `Community 13`, `Community 15`, `Community 26`, `Community 44`, `Community 103`, `Community 40`, `Community 28`, `Community 6`, `Community 71`, `Community 72`, `Community 5`, `Community 62`, `Community 4`, `Community 3`, `Community 48`, `Community 61`, `Community 38`, `Community 31`, `Community 32`, `Community 21`, `Community 25`, `Community 16`, `Community 42`, `Community 7`, `Community 64`, `Community 10`, `Community 34`, `Community 22`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `query()` connect `Community 5` to `Community 1`, `Community 67`, `Community 41`, `Community 73`, `Community 47`, `Community 29`, `Community 11`, `Community 8`, `Community 54`, `Community 65`, `Community 40`, `Community 56`, `Community 13`, `Community 84`, `Community 6`, `Community 49`, `Community 44`, `Community 48`, `Community 9`, `Community 42`, `Community 69`, `Community 26`, `Community 38`, `Community 4`, `Community 31`, `Community 15`, `Community 60`, `Community 16`, `Community 2`, `Community 20`, `Community 0`, `Community 72`, `Community 63`, `Community 27`, `Community 109`, `Community 34`, `Community 33`, `Community 10`, `Community 51`, `Community 17`, `Community 59`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `SA7Repository` connect `Community 51` to `Community 62`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `__dirname`, `ROOT`, `CONTEXT_MAP_PATH` to the rest of the system?**
  _698 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.05093167701863354 - nodes in this community are weakly interconnected._
- **Should `Community 46` be split into smaller, more focused modules?**
  _Cohesion score 0.10461538461538461 - nodes in this community are weakly interconnected._
- **Should `Community 56` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._