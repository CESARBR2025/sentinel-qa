# Base de Datos

**Motor:** PostgreSQL  
**ORM:** Drizzle ORM 0.45.2  
**Host:** `sanjuandelrio.sytes.net:5432`  
**Base:** `seguridad_publica`

---

## Diagrama de Tablas

```
                    ┌─────────────────────────┐
                    │         users            │
                    │  id (text) PK            │──┐
                    │  name, apellido, email   │  │
                    │  rol_id → roles.id       │──┼──→ roles
                    │  dependencia_id →        │  │    (id, nombre)
                    │    cat_dependencias.id   │  │
                    │  activo, two_factor       │  │
                    └─────────────────────────┘  │
                                                 │
    ┌──────────── sessions ───── accounts ─── verifications ── two_factors
    │
    │  ┌───────────────────┐  ┌───────────────────┐
    ├──│     modulos        │  │    permisos       │
    │  │  id (serial) PK    │  │  rol_id → roles   │
    │  │  clave, nombre,    │  │  modulo_id → mod  │
    │  │  ruta, padre_id    │  │  puede_{ver,crear,│
    │  │                    │  │   editar,eliminar}│
    │  └───────────────────┘  └───────────────────┘
    │
    │  ┌───────────────────┐  ┌───────────────────┐
    │  │  cat_dependencias │  │  usuario_modulos  │
    │  │  clave, nombre,   │  │  user_id → users  │
    │  │  tipo (interna/   │  │  modulo_id → mod  │
    │  │    externa)       │  │  puede_ver        │
    │  └───────────────────┘  └───────────────────┘
    │
    ├── [INCIDENTES] ──────────────────────────────────
    │
    │  incidentes
    │  ├── cat_tipos_emergencia    (catálogo)
    │  ├── cat_tipos_incidente     (catálogo)
    │  ├── cat_prioridades         (catálogo)
    │  ├── cat_medios_canalizacion  (catálogo)
    │  ├── cat_origenes_evento     (catálogo) [eventos]
    │  ├── cat_estatus_evento      (catálogo) [eventos]
    │  ├── cat_turnos              (catálogo)
    │  │
    │  ├── incidente_personas_afectadas (1:N)
    │  ├── incidente_despacho          (1:1)
    │  │   ├── incidente_despacho_unidades  (1:N)
    │  │   └── incidente_despacho_elementos (1:N)
    │  ├── incidente_reporte_campo    (1:1)
    │  ├── incidente_extorsion        (1:1) [opcional]
    │  └── incidente_alarma_escolar   (1:1) [opcional]
    │
    │  eventos (tabla legacy, paralela a incidentes)
    │
    ├── [PREVENCIÓN] ──────────────────────────────────
    │
    │  medidas_proteccion (1:N → visitas_domiciliarias)
    │  │   └── medida_autoridades_adicionales (1:N)
    │  │
    │  fichas_busqueda (1:N → seguimientos_busqueda)
    │  │
    │  solicitudes_informacion
    │      ├── solicitudes_c4_internas (1:N)
    │      └── contestaciones (1:1, unique)
    │
    ├── [ROL DE SERVICIOS] ────────────────────────────
    │
    │  roles_servicio
    │  ├── cat_sectores              (catálogo)
    │  ├── cat_radios                (catálogo)
    │  ├── cat_body_cams             (catálogo)
    │  ├── cat_estado_fuerza_conceptos (catálogo)
    │  ├── cat_tipos_observacion     (catálogo)
    │  │
    │  ├── rol_asignaciones  (1:N)
    │  ├── rol_estado_fuerza (1:N, unique por concepto)
    │  └── rol_observaciones (1:N)
    │
    ├── [OFICIAL DE CAMPO] ────────────────────────────
    │
    │  ofi_oficiales       (tabla raw SQL)
    │  ofi_reportes_campo  (tabla raw SQL, JSONB)
    │
    ├── [DENUNCIAS D1] ────────────────────────────────
    │
    │  ofi_reporte_denuncia (tabla raw SQL + stored procedure)
    │  └── moni_evidencias_denuncia (evidencias de denuncia, raw SQL)
    │
    ├── [MONITORISTA] ─────────────────────────────────
    │
    │  solicitudes_evidencia
    │  └── evidencias (1:N)
    │  monitorista_historial (contabilización)
    │
    ├── [AUDITORÍA] ───────────────────────────────────
    │
    │  audit_log (inmutable, INSERT-only)
    │
    └── [NOTIFICACIONES] ──────────────────────────────
       notificaciones (user_id → users, ficha_id → fichas_busqueda)
```

---

## Detalle de Tablas

### Autenticación (better-auth)

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios del sistema. `id` es TEXT (no UUID). FK a `roles` y `cat_dependencias` |
| `sessions` | Sesiones activas con fecha de expiración (8h) |
| `accounts` | Cuentas vinculadas (soporta múltiples providers) |
| `verifications` | Códigos de verificación |
| `two_factors` | Secretos TOTP y backup codes |

### Catálogos Compartidos

| Tabla | Descripción |
|-------|-------------|
| `roles` | Roles del sistema (Administrador, Operador, etc.) |
| `modulos` | Módulos del menú (jerárquicos, con `padre_id`) |
| `permisos` | Permisos CRUD por rol y módulo |
| `usuario_modulos` | Asignación directa de módulos a usuarios |
| `cat_dependencias` | Dependencias (internas/externas) |
| `cat_tipos_incidente` | Tipos de incidente (con `clasificacion_cad`) |
| `cat_prioridades` | Prioridades (con orden) |
| `cat_estatus_evento` | Estatus de eventos (con `es_estado_final`) |
| `cat_origenes_evento` | Orígenes de eventos |
| `cat_turnos` | Turnos (con hora_inicio, hora_fin) |

### Incidentes (nuevo schema)

| Tabla | Descripción |
|-------|-------------|
| `incidentes` | Tabla principal. Canal: 911/whatsapp/radio. Estatus: sin_despachar/en_despacho/atendido. Con restricciones CHECK |
| `incidente_personas_afectadas` | Personas afectadas adicionales (N por incidente) |
| `incidente_despacho` | Despacho (1:1 con incidente) |
| `incidente_despacho_unidades` | Unidades asignadas al despacho |
| `incidente_despacho_elementos` | Elementos (policías) asignados |
| `incidente_reporte_campo` | Reporte de campo (1:1). Campos: detención, cateo, vehículos, etc. |
| `incidente_extorsion` | Datos específicos de extorsión (1:1) |
| `incidente_alarma_escolar` | Datos específicos de alarma escolar (1:1) |
| `cat_tipos_emergencia` | Tipos de emergencia |
| `cat_medios_canalizacion` | Medios de canalización |

### Eventos (legacy)

| Tabla | Descripción |
|-------|-------------|
| `eventos` | Tabla legacy con folio CAD, paralela a `incidentes` |

### Prevención del Delito

| Tabla | Descripción |
|-------|-------------|
| `medidas_proteccion` | Expedientes de medidas de protección. Status: activa/por_vencer/vencida/cerrada |
| `visitas_domiciliarias` | Visitas de seguimiento (N por medida) |
| `medida_autoridades_adicionales` | Notificaciones a autoridades adicionales |
| `fichas_busqueda` | Fichas de búsqueda de personas. Status: activa/cancelada |
| `seguimientos_busqueda` | Timeline de plazos (24 tipos: CONTESTACION_INICIAL, 24H, 48H, 72H, MENSUAL_1..20) |
| `solicitudes_informacion` | Solicitudes de información. Status: nuevo/en_juridico/completado |
| `solicitudes_c4_internas` | Solicitudes internas a C4 (N por solicitud) |
| `contestaciones` | Contestación (1:1 con solicitud, unique constraint) |

### Rol de Servicios

| Tabla | Descripción |
|-------|-------------|
| `roles_servicio` | Rol del día. Status: borrador/cerrado. Folio: `SSPM/SS/{consecutivo}/{año}` |
| `rol_asignaciones` | Asignaciones de unidades y elementos por sección |
| `rol_estado_fuerza` | Conteo de personal por concepto (unique por rol+concepto) |
| `rol_observaciones` | Observaciones del rol |
| `cat_sectores` | Sectores operativos |
| `cat_radios` | Radios (código, tipo, estado) |
| `cat_body_cams` | Body cams (código, estado) |
| `cat_estado_fuerza_conceptos` | Conceptos para estado de fuerza (con grupo y orden) |
| `cat_tipos_observacion` | Tipos de observación |

### Oficial de Campo (raw SQL, no Drizzle)

| Tabla | Descripción |
|-------|-------------|
| `ofi_oficiales` | Registro de oficiales de campo |
| `ofi_reportes_campo` | Reportes de campo con columnas JSONB (`ofi_detenidos`, `ofi_vehiculos`, `ofi_cateo`) |

### Denuncias D1 (raw SQL + stored procedure, no Drizzle)

| Tabla | Descripción |
|-------|-------------|
| `ofi_reporte_denuncia` | Reportes de denuncia formal D1. ~45 columnas: folio_denuncia, IPH, delito, tipo_evento, policía a cargo, fechas/horas, ubicación, ofendidos, etc. |
| `moni_evidencias_denuncia` | Evidencias (fotos/videos) adjuntas a una denuncia D1. FK → `ofi_reporte_denuncia.id`. Columna `solicitud_id` como referencia lógica a `solicitudes_evidencia`. |

### Monitorista

| Tabla | Descripción |
|-------|-------------|
| `solicitudes_evidencia` | Solicitudes de evidencias: un usuario solicita al Monitorista adjuntar fotos/videos a un incidente. Status: pendiente/completada/cancelada. |
| `evidencias` | Archivos subidos como evidencia. FK → `solicitudes_evidencia`. Tipo: foto/video/documento. URL apunta al Expediente Digital. |
| `monitorista_historial` | Contabilización de actividad del Monitorista. Registra cada acción con timestamp. |

### Auditoría

| Tabla | Descripción |
|-------|-------------|
| `audit_log` | Registro inmutable de operaciones sobre datos sensibles. Columnas: userId, accion (CREATE/UPDATE/DELETE/VIEW), entidad, entidadId, payload (JSON), ip, userAgent |

### Notificaciones

| Tabla | Descripción |
|-------|-------------|
| `notificaciones` | Notificaciones push internas. Unique constraint por (userId, fichaId, hito) para evitar duplicados |

---

## Convenios

- **UUIDs** para IDs de tablas de negocio (excepto `users` que usa `text` de better-auth)
- **Serial** para IDs de catálogos
- **Timestamps** con `withTimezone: true` en tablas nuevas; `mode: 'string'` para legacy
- **Fechas** (`date()`) retornan string `'YYYY-MM-DD'`
- **Timestamps** (`timestamp()`) retornan `Date` objeto JavaScript
- **Soft delete**: tablas con columna `activo` (boolean) donde aplica
- **Auditoría**: vía `audit_log` para operaciones sobre datos sensibles
