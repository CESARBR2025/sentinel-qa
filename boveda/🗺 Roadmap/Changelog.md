# Changelog

**Propósito**: Historial cronológico de cambios.

---

## 2026 — Julio

### — Navegación en vivo estilo DiDi para el oficial (plan-navegacion-oficial)
Reemplaza los botones manuales "VOY EN CAMINO"/"MARCAR EN SITIO" de `/oficial/despachos/[id]` por una vista de navegación en vivo. Pipeline de datos: `obtenerDespachosAsignados` ahora trae `latitud`/`longitud` del incidente; se agregó `'geometry'` a `GOOGLE_MAPS_LIBRARIES` (loader compartido). Nuevo componente `components/oficial/navegacion/NavegacionDespacho.tsx`: pantalla "INICIAR NAVEGACIÓN" que dispara `marcarEnCaminoOficial`, mapa con ruta real por **Google Directions API** desde un `watchPosition` propio de alta precisión, recálculo solo si hay desviación >150m y pasó ≥60s, detección de llegada por **geofence de 80m** (Haversine) + botón manual "✓ LLEGUÉ" que disparan `marcarEnSitioOficial`. Fallback: incidentes sin coordenadas conservan `MarcarEnCaminoButton`/`MarcarEnSitioButton` (badge "SIN COORDENADAS — REGISTRO MANUAL"). `FormularioRecorrido` prefill de `latitud`/`longitud`. `marcarEnCaminoOficial`/`marcarEnSitioOficial` emiten `despacho.en_camino`/`despacho.en_sitio` (eventos que eran huérfanos); backfill simétrico de `hora_llegada` en `insertarReporteCampo`. Layout de la página a ancho completo (Page Assembly Pattern, sin `maxWidth`).

### — Gradiente completo de prioridades (4 niveles) + nuevo ícono de rayo (Etapa 12)
Se agregó CRÍTICA a `PRIORIDAD_COLORES` con rojo intenso. ALTA cambió a naranja (`#f97316`) para crear un gradiente por urgencia: rojo (CRÍTICA) → naranja (ALTA) → amarillo (MEDIA) → azul (BAJA). El gris queda exclusivamente para prioridad no resuelta. El glifo interior del marcador del incidente cambió de signo de exclamación a rayo (lightning bolt polygon). `TablonDespacho.tsx` hereda el gradiente automáticamente sin cambios de código. Catálogo real verificado contra BD: 4 niveles activos (id 1 BAJA, 2 MEDIA, 3 ALTA, 4 CRITICA).

### — Etiqueta de prioridad en tarjetas + marcador del incidente más grande (Etapa 11)
Dos mejoras visuales: (1) etiqueta de texto "BAJA"/"MEDIA"/"ALTA" en cada tarjeta del tablón de despacho, coloreada con el mismo código de prioridad que el borde izquierdo — usando el nuevo campo `fondo` en `PrioridadColor`. (2) Marcador del incidente en el mapa escalado ×1.5 (36×36 → 54×54) con trazo más grueso (stroke-width 3) y halo blanco semi-transparente de fondo para mejor contraste contra el mapa. No se modificaron los marcadores de unidades.

### — Color del marcador del incidente según prioridad (Etapa 10)
Paleta de colores unificada para el marcador del incidente en el mapa de asignación y para el borde de las tarjetas del tablón de despacho: azul = BAJA, amarillo = MEDIA, rojo = ALTA. Nuevo módulo compartido `lib/incidentes/prioridad-colores.ts` con `colorPorPrioridad()`. Se eliminó el `PRIO_COLORS` local de `TablonDespacho.tsx`. El marcador del incidente en `AsignacionMapa.tsx` ahora se construye dinámicamente según `prioridad`. Gray neutro como fallback para incidentes sin prioridad resuelta (corrige bug previo donde el fallback reusaba color de BAJA).

### — Unidad prioritaria preseleccionada y deseleccionable con migración de BD (Etapa 9)
La unidad del oficial que reportó un rondín ya no es fija e inamovible — ahora aparece preseleccionada en el picker "Unidades cercanas al hecho" pero se puede deseleccionar. Migración: columna `atiende_caso` en `incidente_despacho_elementos` (booleano, NOT NULL DEFAULT true) separa "quién reportó" de "quién atiende". En `createDespacho`: UPDATE de `atiende_caso` según si la unidad prioritaria sigue entre las seleccionadas. En `DespachoForm`: se eliminó el filter que excluía la unidad prioritaria del modal, se añadió preselección, y la validación permite despachar con solo el prioritario. `UnidadCard` ahora acepta `esPrioritaria` y muestra badge índigo "PRIORITARIO". `UnidadResumenCard` renderiza badge y botón Quitar de forma independiente. `AsignacionMapa` agrega overlay "P" en el marcador de la unidad prioritaria.

### — Fix: primer reporte de ubicación inmediato al login del oficial (Etapa 8)
El oficial recién logueado tardaba hasta 30s en que se reportara su primera ubicación real, porque el envío solo ocurría cuando el contador del heartbeat llegaba a 0. Se extrajo `enviarUbicacion(lat, lng)` como función compartida, se agregó `primerEnvioRef` en el callback de `watchPosition`, y el primer fix de GPS ahora se envía de inmediato (en vez de esperar la cuenta regresiva). El heartbeat periódico (30s) sigue funcionando igual después del primer envío. Un solo archivo modificado (`OficialUbicacionTracker.tsx`).

### — Fix: fetch inmediato al abrir el modal de selección de unidades (Etapa 7)
El modal "Unidades cercanas al hecho" mostraba datos desactualizados al abrirse porque el polling (Etapa 5) usaba `setInterval` sin ejecutar el primer fetch de inmediato — tocaba esperar 18s. Se extrajo `fetchUnidades` como función nombrada, se llama una vez al montar el efecto, y `setInterval(fetchUnidades, 18000)` programa solo las repeticiones. Fix quirúrgico, un solo archivo modificado (`SeleccionarUnidadesModal.tsx`). No se afectaron la cadencia de 18s, el mapa, ni las validaciones de etapas previas.

### — Regla de negocio: bloquear unidades ocupadas en otro incidente activo
Validación en backend y frontend para evitar despachar la misma patrulla a dos incidentes activos simultáneamente. Defense-in-depth: `createDespacho`/`enviarRefuerzos` rechazan con `ValidationError`, y la UI (lista + mapa) muestra las unidades ocupadas como no seleccionables.
- **Tipos**: `UnidadConTripulacion.ocupada: boolean` agregado en `lib/flota/types.ts`; `mapper.ts` actualizado con valor default `false`.
- **Repo**: nueva función `listarIdsUnidadesOcupadas` en `lib/flota/repository.ts` — query DISTINCT via JOIN, devuelve `Set<string>`.
- **Service**: `listarUnidadesParaDespacho` recibe `incidenteIdActual` y agrega `ocupada` a cada unidad (no excluye del array).
- **API**: `/api/despacho/unidades-cercanas` acepta query param `incidenteId`.
- **UI lista**: badge "OCUPADA" rojo, opacidad 0.6, `cursor: not-allowed`, `onClick` condicional en `UnidadCard`.
- **UI mapa**: marcador rojo apagado (`#b91c1c`) en `AsignacionMapa`, sin `onClick`.
- **UI lógica**: `toggle` en `SeleccionarUnidadesModal` retorna temprano si `ocupada`.
- **Defense-in-depth**: validación con `ANY($2::text[])` en `createDespacho` y `enviarRefuerzos` (antes del `BEGIN`).
- **QA**: seed script (`scripts/seed-qa-despacho.ts`) y test script (`scripts/test-qa-ocupadas.ts`) ejecutados contra BD de desarrollo: 9/9 pruebas pasaron, limpieza completada sin registros huérfanos.
- Verificado: `npx tsc --noEmit` 0 errores, `npm run build` exitoso, `graphify update` actualizado.

### — Mapa de asignación de unidades en Despacho (tipo Uber)
Split-view con mapa Google Maps integrado en el modal "Unidades cercanas al hecho" de `SeleccionarUnidadesModal.tsx`, que muestra visualmente la posición del incidente y de todas las patrullas, con diferenciación por cercanía, frescura de ubicación y selección.
- **Mapa**: nuevo componente `components/911/despacho/AsignacionMapa.tsx` — `@react-google-maps/api`, marcadores SVG inline parametrizados por distancia/antigüedad/selección, `fitBounds` automático.
- **Backend**: `lib/flota/service.ts` — removido el truncado a `TOP_UNIDADES_CERCANAS = 10` en `listarUnidadesParaDespacho` para que el endpoint devuelva todas las unidades con ubicación.
- **Modal**: split-view `grid 55%/45%` (mapa izquierda, lista derecha) cuando el incidente tiene coordenadas; layout original (640px) sin coordenadas.
- **Polling**: `setInterval` de 18s dentro del modal que refresca posiciones vía `/api/despacho/unidades-cercanas`; se detiene al cerrar.
- **Diferenciación visual de marcadores**: verde (más cercana), azul (cercanas top 10), gris opacidad reducida (lejanas); borde discontinuo si ubicación >5 min; badge check si seleccionada.
- Verificado: `npx tsc --noEmit` 0 errores, `npm run build` exitoso, `graphify update` actualizado.

### — Ubicación GPS de oficiales y asignación unidad-céntrica en Despacho
Rediseño del modal "Asignar unidades" de `DespachoForm.tsx` para poder ver qué unidad está más cerca del incidente al despachar. Ver [[911]] regla #10.
- **BD**: `ofi_oficiales` += `ultima_lat`, `ultima_lng`, `ultima_ubicacion_en` (migration `0025_ubicacion_oficiales.sql`).
- **Tracking**: `components/oficial/OficialUbicacionTracker.tsx` (montado en `app/oficial/layout.tsx`) reporta la posición del oficial cada 30s vía `watchPosition` mientras tenga sesión abierta (foreground únicamente, sin background sync) → `reportarUbicacionOficial` (`lib/oficial/actions.ts`).
- **Query de tripulación**: `lib/flota/service.ts::listarUnidadesParaDespacho` agrupa `ofi_oficiales` por `patrulla_id` (ya era N:1 sin constraint) y calcula distancia Haversine (`lib/shared/geo.ts`) al incidente; expuesto en `/api/despacho/unidades-cercanas`.
- **DespachoForm**: reemplaza los buscadores sueltos de placa (`useFlota`) y nómina (`useEmpleado`, ambos contra APIs externas admin-only) por cards de unidad (unidad + tripulación + distancia + antigüedad del dato) ordenadas por cercanía; seleccionar una unidad asigna a toda su tripulación. Elemento suelto sin patrulla ahora busca en `ofi_oficiales` local (`buscarOficialesPorNominaONombre`, `/api/despacho/buscar-oficial`) en vez del proxy externo de RH.
- **Fix**: `listarIncidentesPendientesDespacho` restaurado a `ORDER BY cp.orden DESC NULLS LAST, i.fecha_hora_inicio DESC` (se había revertido a solo cronológico durante el rediseño visual del tablón).
- Verificado: `npx tsc --noEmit` 0 errores, `npm run build` exit 0, migración aplicada contra BD real, `npm run db:schema` refrescado.

### — Flujo integral 911 → Despacho → Oficial → D1 → Legal
Ciclo operativo completo unificado sobre `ofi_reportes_campo` como única tabla de reporte de campo (`incidente_reporte_campo` queda legacy read-only). Ver [[Plan Flujo Despacho]].
- **BD**: `ofi_reportes_campo` += `incidente_id` (FK + índice único parcial; su INSERT cierra el despacho), `ofi_entre_calles`, `ofi_referencia`, `expediente_ci`, `personal_ingreso_ci`; `incidente_despacho_elementos` += `oficial_id` (FK → `ofi_oficiales`); `incidentes` += `origen_rondin`.
- **Filtros 911**: `FiltrosIncidentes` (canal, estatus, tipo, prioridad, rango fechas, folio) sobre `listarIncidentesConFiltros`; bitácora general (`/incidentes`) reescrita.
- **Despacho**: match automático `elemento_nomina` ↔ `ofi_oficiales.no_nomina` al asignar; tab Atendidos ahora lee de `ofi_reportes_campo`; bandera "D1 pendiente".
- **Oficial**: nueva vista `/oficial/despachos` (+`[id]`) — ve asignaciones, captura reporte y cierra en transacción (`insertarReporteCampo` con `incidenteId` → `estatus='atendido'`). Cards "Mis Despachos" y "Rondín" en el hub.
- **Historial generativo**: `HistorialIncidente` (timeline 911/rondín → despacho → campo → D1) vía `obtenerHistorialCompleto` (composición cross-dominio en service, con fallback legacy).
- **D1**: cierre permitido con detenidos; al crear la D1 se hereda `incidente_id` del reporte de campo (limpia la bandera).
- **Rondín**: SIEMPRE escala a despacho — `createRondinEscalado` crea incidente `sin_despachar` sin auto-cierre; `createRecorridoCompleto` deprecada. Nuevo `FormRondinEscalado` (avistamiento) en 911 y en `/oficial/rondin`.
- Verificado: `npx tsc --noEmit` 0 errores, `npm run build` exit 0, queries validadas contra BD real.

### — Normalización de detenidos en Reporte Campo
- `OfiDetenido` expandido: ahora almacena `nombre`, `apellidoPaterno`, `apellidoMaterno` en vez de solo `nombre`
- UI de Step 3 (Intervención y Detenciones) cambiada de 1 input a 3 inputs por detenido
- Inserción automática en `ofi_detalles_asegurados` al crear el reporte
- Serialización de detenidos vía `JSON.stringify` en vez de `join(',')`
- Todos los consumidores (detalle reporte, fotos, store) actualizados para mostrar nombre completo
- 0 errores TypeScript, build exitoso

### — Refactorización arquitectónica completa
- Migración de Drizzle ORM a raw SQL en toda la aplicación
- Creación de arquitectura en capas para 23 módulos (types, mapper, repository, service, actions)
- Eliminación de imports directos de query en pages, layouts y API routes
- Centralización de role checks con getUserWithRole()
- Implementación de manejo de errores centralizado (tryAction/tryActionRaw)
- Conversión de repos class-based a funcionales
- Eliminación de directorios duplicados (rol_servicios → rol-servicios)
- Creación de bóveda de conocimiento como única fuente de documentación
- 0 errores TypeScript, build exitoso
