# Changelog

**Propósito**: Historial cronológico de cambios.

---

## 2026 — Julio

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
