# API Routes

Todas las rutas están bajo `/api/`. Autenticación requerida (sesión via better-auth) excepto donde se indique.

---

## Autenticación

### `GET|POST|PUT|DELETE /api/auth/[...all]`

Manejador genérico de better-auth. Todas las rutas de autenticación pasan por aquí:
- `POST /api/auth/sign-in/email` — Inicio de sesión
- `POST /api/auth/sign-up/email` — Registro
- `POST /api/auth/sign-out` — Cierre de sesión
- `GET /api/auth/get-session` — Obtener sesión actual
- `POST /api/auth/two-factor/verify` — Verificar 2FA
- `POST /api/auth/two-factor/enable` — Habilitar 2FA

---

## Salud del Sistema

### `GET /api/health`

Verifica conectividad con la base de datos.

**Response:**
```json
{ "ok": true, "db_time": "2026-06-25T12:00:00.000Z" }
```
o
```json
{ "ok": false, "error": "mensaje de error" }
```

---

## Incidentes

### `GET /api/incidentes`

Lista incidentes con filtros opcionales.

**Query params:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `canal` | string | `911`, `whatsapp`, `radio` |
| `estatus` | string | `sin_despachar`, `en_despacho`, `atendido` |
| `desde` | ISO date | Fecha inicio (>=) |
| `hasta` | ISO date | Fecha inicio (<=) |
| `folio` | string | Búsqueda parcial por folio (ILIKE) |

**Response:** `Incidente[]` (máx 200 registros)

---

### `GET /api/incidentes/pendientes-despacho`

Incidentes `sin_despachar` con `requiereDespacho = true`. Ordenados por prioridad.

---

### `GET /api/incidentes/en-despacho`

Incidentes en estado `en_despacho` con datos de despacho, unidades y elementos.

---

### `GET /api/incidentes/atendidos`

Incidentes `atendidos` con datos de despacho, unidades, elementos y resumen de reporte de campo.

---

### `GET /api/incidentes/[id]`

Detalle completo de un incidente con todas sus sub-entidades.

**Response:**
```json
{
  "id": "uuid",
  "folio": "SSPM/INC/001/2026",
  "canal": "911",
  "tipoReporte": "normal",
  "estatus": "sin_despachar",
  "...": "...",
  "personasAfectadas": [],
  "despacho": null,
  "reporteCampo": null,
  "extorsion": null,
  "alarmaEscolar": null
}
```

**Auditoría:** Cada `GET` registra un evento `VIEW` en `audit_log`.

---

### `GET /api/incidentes/[id]/despacho`

Obtiene el despacho asignado a un incidente con unidades y elementos.

---

### `GET /api/incidentes/[id]/reporte`

Obtiene el reporte de campo de un incidente.

---

## Prevención

### Medidas de Protección

#### `GET /api/prevencion/medidas`

Lista medidas de protección. Filtros opcionales:

| Parámetro | Descripción |
|-----------|-------------|
| `autoridad` | `FISCALIA`, `UMECA`, `JUZGADOS`, `SEC_MUJER` |
| `status` | `activa`, `por_vencer`, `vencida`, `cerrada` |

#### `POST /api/prevencion/medidas`

Crea una nueva medida de protección.

#### `GET /api/prevencion/medidas/[id]`

Detalle de medida con sus visitas domiciliarias.

#### `PUT /api/prevencion/medidas/[id]`

Actualiza campos de una medida.

#### `PATCH /api/prevencion/medidas/[id]`

Actualiza solo el `status` de una medida.

#### `GET /api/prevencion/medidas/[id]/visitas`

Lista visitas domiciliarias de una medida.

#### `POST /api/prevencion/medidas/[id]/visitas`

Registra una nueva visita domiciliaria.

---

### Búsquedas / Protocolo Alba

#### `GET /api/prevencion/busquedas`

Lista fichas de búsqueda. Filtros:

| Parámetro | Descripción |
|-----------|-------------|
| `tipo` | `PROTOCOLO_ALBA`, `BUSQUEDA_PERSONA` |
| `status` | `activa`, `cancelada` |

#### `POST /api/prevencion/busquedas`

Crea una nueva ficha de búsqueda.

#### `GET /api/prevencion/busquedas/[id]`

Detalle de ficha más sus seguimientos.

#### `PUT /api/prevencion/busquedas/[id]`

Actualiza una ficha de búsqueda.

#### `POST /api/prevencion/busquedas/[id]/seguimientos`

Registra un nuevo seguimiento (hito del timeline).

#### `POST /api/prevencion/busquedas/[id]/cancelar`

Cancela una ficha de búsqueda.

**Body:**
```json
{
  "fechaCancelacion": "2026-06-25T12:00:00.000Z",
  "fiscalCancela": "Fiscal Nombre",
  "motivoCancelacion": "Localizada"
}
```

#### `GET /api/prevencion/busquedas/alertas`

Devuelve conteo de búsquedas con hitos próximos (24h) o vencidos.

**Response:**
```json
{ "pendientes24h": 2, "vencidos": 1 }
```

---

### Área Jurídica

#### `GET /api/prevencion/solicitudes`

Lista solicitudes de información. Filtros:

| Parámetro | Descripción |
|-----------|-------------|
| `status` | `nuevo`, `en_juridico`, `completado` |
| `autoridad` | `FISCALIA`, `UMECA`, `JUZGADOS`, `SEC_MUJER` |

#### `POST /api/prevencion/solicitudes`

Crea una solicitud de información.

#### `GET /api/prevencion/solicitudes/[id]`

Detalle de solicitud con solicitudes C4 y contestación.

#### `PUT /api/prevencion/solicitudes/[id]`

Actualiza una solicitud.

#### `POST /api/prevencion/solicitudes/[id]/c4`

Crea una solicitud interna a C4 para una solicitud de información.

#### `POST /api/prevencion/solicitudes/[id]/contestacion`

Registra una contestación. Actualiza status de solicitud a `completado`.

---

## Notificaciones

### `GET /api/notificaciones`

Obtiene notificaciones no leídas del usuario autenticado. Ejecuta el generador de alertas de búsquedas antes de responder.

---

## Integraciones Externas

### `GET /api/rol-servicios/externos/flota`

Proxy a la API de Flota (vehículos). Requiere autenticación.

**Query params:** `placa`, `marca`, `modelo`, `color`

**Response:**
```json
[
  {
    "id": 1,
    "placa": "ABC-123",
    "marca": "Ford",
    "modelo": "F-150",
    "color": "Blanco",
    "tipo": "Patrulla",
    "label": "ABC-123 — Ford F-150 Blanco"
  }
]
```

### `GET /api/rol-servicios/externos/rh`

Proxy a la API de RH/Nómina (empleados). Requiere autenticación.

**Query params (mutuamente excluyentes):**
- Por ID: `trabajadorId`
- Por CURP: `curp` + `apellidoPaterno` + `apellidoMaterno`

**Response:**
```json
{
  "trabajadorId": "12345",
  "nombre": "JUAN PEREZ LOPEZ",
  "puesto": "POLICIA",
  "dependencia": "SEGURIDAD PUBLICA",
  "estatus": "ACTIVO"
}
```

---

## Denuncias D1

### `POST /api/reportes-d1`

Registra un reporte de denuncia formal D1 vía **stored procedure** `insertar_reporte_d1`. Autenticación requerida.

**Body:** ~40 campos incluyendo: folio_denuncia, IPH, delito, tipo_evento, fechas/horas de todo el flujo, datos del policía, ubicación, ofendidos, etc.

**Tabla:** `ofi_reporte_denuncia`

---

## Monitorista

### `GET /api/monitorista/solicitudes`

Lista solicitudes de evidencia. Query: `status` (pendiente|completada|cancelada).

### `POST /api/monitorista/solicitudes`

Crea una solicitud de evidencia.

### `GET /api/monitorista/solicitudes/[id]`

Detalle de solicitud con sus evidencias subidas.

### `POST /api/monitorista/solicitudes/[id]/completar`

Completa o cancela una solicitud. Body: `{ action: 'completar' | 'cancelar' }`.

### `POST /api/monitorista/evidencias/subir`

Sube un archivo como evidencia (base64). Body: `{ solicitudId, incidenteId, tipo, nombreOriginal, archivo, mime }`.

### `GET /api/monitorista/historial`

Historial de actividad del monitorista. Query: `monitoristaId`, `desde`, `hasta`.

---

## Archivos

### `GET /api/uploads/[...path]`

Sirve archivos estáticos subidos (PDFs de contestación, imágenes, etc.). Previene path traversal. Autenticación requerida.

---

## Server Actions (Mutaciones)

Las siguientes mutaciones se realizan mediante **Server Actions** (no API REST), definidas en `lib/*/actions.ts`:

### Incidentes (`lib/incidentes/actions.ts`)

| Action | Descripción |
|--------|-------------|
| `createIncidente` | Alta de incidente completo |
| `addPersonaAfectada` | Agrega persona afectada |
| `deletePersonaAfectada` | Elimina persona afectada |
| `createDespacho` | Asigna despacho a incidente |
| `createReporteCampo` | Registra reporte de campo y cierra incidente |
| `createExtorsion` | Datos adicionales de extorsión |
| `createAlarmaEscolar` | Datos adicionales de alarma escolar |
| `createRecorridoCompleto` | Flujo completo: incidente + reporte (para radio) |

### Prevención (`lib/prevencion/actions.ts`)

| Action | Descripción |
|--------|-------------|
| `createMedida` | Nueva medida de protección |
| `createVisita` | Registra visita domiciliaria |
| `addAutoridadMedida` | Agrega autoridad adicional |
| `createProrroga` | Extiende fecha de vencimiento |
| `createFicha` | Nueva ficha de búsqueda |
| `createSeguimiento` | Registra hito del timeline |
| `cancelarFicha` | Cancela búsqueda |
| `createSolicitud` | Nueva solicitud jurídica |
| `createSolicitudC4` | Solicitud interna a C4 |
| `createContestacion` | Registra contestación |

### Oficial de Campo (`lib/oficial/actions.ts`)

| Action | Descripción |
|--------|-------------|
| `crearReporteCampoOficial` | Reporte de campo desde app oficial |

### Rol de Servicios (`lib/rol-servicios/actions.ts`)

| Action | Descripción |
|--------|-------------|
| `createRol` | Nuevo rol de servicio |
| `updateEncabezadoRol` | Actualiza encabezado |
| `createAsignacion` | Asigna unidad/elemento |
| `deleteAsignacion` | Elimina asignación |
| `upsertEstadoFuerza` | Actualiza estado de fuerza |
| `createObservacion` | Agrega observación |
| `deleteObservacion` | Elimina observación |
| `guardarFirmas` | Firma y cierra rol |

### Administración (`lib/admin/actions.ts`)

| Action | Descripción |
|--------|-------------|
| `createUser` | Crear usuario |
| `updateUser` | Actualizar usuario |

### Notificaciones (`lib/notificaciones/actions.ts`)

| Action | Descripción |
|--------|-------------|
| `marcarLeida` | Marca notificación como leída |
| `marcarTodasLeidas` | Marca todas como leídas |
| `generarAlertasDebug` | Regenera alertas (debug) |

### Catálogos (`lib/rol-servicios/catalogos-actions.ts`)

| Action | Descripción |
|--------|-------------|
| `createSector` / `toggleSector` | CRUD sectores |
| `createRadio` / `toggleRadio` | CRUD radios |
| `createBodyCam` / `toggleBodyCam` | CRUD body cams |
| `createConcepto` / `toggleConcepto` | CRUD conceptos estado fuerza |
| `createTipoObservacion` / `toggleTipoObservacion` | CRUD tipos observación |
| `createTipoEmergencia` / `toggleTipoEmergencia` | CRUD tipos emergencia |
| `createMedioCanalizacion` / `toggleMedioCanalizacion` | CRUD medios canalización |
