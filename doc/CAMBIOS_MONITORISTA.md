# Módulo Monitorista — Documentación del Sistema

## Arquitectura General

El Monitorista recibe solicitudes de evidencias de Fiscalía/Juzgado, sube fotos/PDFs al **Expediente Digital SJR** y los notifica cuando están listos. Soporta dos flujos:

| Flujo | Descripción | Tablas que usa |
|-------|-------------|----------------|
| **Denuncias D1** | Solicitudes de evidencia vinculadas a una denuncia formal | `ofi_reporte_denuncia` + `moni_evidencias_denuncia` |
| **Incidentes generales** | Solicitudes de evidencia para incidentes 911/WhatsApp/Radio | `solicitudes_evidencia` + `evidencias` (nuestras tablas) |

---

## Base de Datos

### Tablas que creamos (3)

#### `solicitudes_evidencia`
Solicitudes de evidencia para **incidentes generales** (no D1).

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | |
| `incidente_id` | uuid | Referencia lógica al incidente |
| `folio_incidente` | varchar(60) | Folio del incidente |
| `solicitado_por` | text FK→users | Quién solicitó |
| `solicitado_nombre` | varchar(200) | Nombre del solicitante |
| `descripcion` | text | Qué evidencias se necesitan |
| `status` | varchar(20) | `pendiente` \| `completada` \| `cancelada` |
| `creado_en` | timestamp | |
| `completado_en` | timestamp | |

#### `evidencias`
Archivos subidos para **incidentes generales**.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | |
| `solicitud_id` | uuid FK→solicitudes_evidencia | |
| `incidente_id` | uuid | |
| `tipo` | varchar(20) | `foto` \| `documento` |
| `nombre_original` | varchar(300) | |
| `url_expediente` | varchar(500) | URL absoluta del Expediente Digital |
| `subido_por` | text FK→users | |
| `creado_en` | timestamp | |

#### `monitorista_historial`
Contabilización de actividad del Monitorista.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid PK | |
| `monitorista_id` | text FK→users | |
| `accion` | varchar(50) | `evidencia_subida` \| `solicitud_completada` \| `solicitud_cancelada` |
| `solicitud_id` | uuid FK→solicitudes_evidencia | |
| `incidente_id` | uuid | |
| `creado_en` | timestamp | |

### Tablas existentes que usamos (solo lectura/escritura controlada)

#### `ofi_reporte_denuncia`
Denuncias D1. **Leemos** para mostrar solicitudes al Monitorista. **Escribimos** solo al completar:
- `monitorista_fechas_requeridas` (JSONB) — marcamos `atendida: true` en las solicitudes
- `estado_evidencia` → `'EVIDENCIA_ENVIADA'`
- `estado_tramite` → `'EN_ANALISIS'`

#### `moni_evidencias_denuncia`
Archivos subidos para denuncias D1. **Insertamos** registros. Cada evidencia se vincula a su `solicitud_id` (numérico del JSONB) mediante un UUID determinista.

| Columna | Cómo lo usamos |
|---------|----------------|
| `ofi_reporte_denuncia_id` | FK a la denuncia |
| `solicitud_id` | UUID determinista generado desde `denunciaId + solicitudId` |
| `url_archivo` | URL absoluta del Expediente Digital |
| `nombre_archivo` | Nombre original del archivo |

---

## Flujo de Evidencias por Tipo

### Denuncias D1 (2 tablas externas)

```
Fiscalía solicita evidencias
  → INSERT en monitorista_fechas_requeridas JSONB (solicitud_id: 1, 2...)
  → UPDATE estado_evidencia = 'PENDIENTE_MONITORISTA'

Monitorista ve en su bandeja
  → SUBIR archivo (foto/PDF)
    → Sube al Expediente Digital (POST /api/documents/upload-and-create)
    → INSERT en moni_evidencias_denuncia (con UUID determinista)
  → COMPLETAR (con confirmación)
    → UPDATE JSONB: atendida = true para esa solicitud
    → Si todas las solicitudes están atendidas:
      → UPDATE estado_evidencia = 'EVIDENCIA_ENVIADA'
      → UPDATE estado_tramite = 'EN_ANALISIS'
```

### Incidentes Generales (3 tablas propias)

```
Usuario solicita evidencias
  → INSERT en solicitudes_evidencia

Monitorista sube archivo
  → Sube al Expediente Digital
  → INSERT en evidencias
  → INSERT en monitorista_historial
```

---

## Expediente Digital

### Endpoint usado
```
POST /api/documents/upload-and-create
  Headers: Authorization: Bearer {guest_token}
  Body: multipart/form-data (file)
  Query: id_usuario_general=SSPM_SISTEMA&tipo_documento=EVIDENCIA_{TIPO}&folio={folio}&tipo_tramite=EVIDENCIA_MONITORISTA
  Response: { success, documento: { url_archivo } }
```

### Guest Token
```
POST /api/auth/guest-token
  Body: { "codigo_invitacion": "INV-2026-001", "nombre_invitado": "Monitorista X" }
  Response: { token, expires_in: "8h" }
```

### Límites conocidos del servidor
- **Foto**: máx 50MB · se comprime a 1920px JPEG 0.7
- **Documento (PDF)**: máx 50MB · sin compresión
- **Video**: ❌ No soportado por el Expediente Digital (rechaza archivos >~25MB)

### Visualización de documentos
Los documentos se sirven a través de un proxy interno que añade el token:
```
GET /api/monitorista/expediente-proxy?url={url_del_expediente}
```

---

## Archivos del Módulo

### Backend (8)

| Archivo | Propósito |
|---------|-----------|
| `lib/monitorista/expediente.ts` | Cliente HTTP para Expediente Digital (token + upload) |
| `lib/monitorista/actions.ts` | Server Actions para incidentes generales |
| `lib/monitorista/denuncia-service.ts` | Lógica para denuncias D1 (queries + upload + completar) |
| `app/api/monitorista/denuncias/subir/route.ts` | POST subir evidencia a denuncia |
| `app/api/monitorista/denuncias/[id]/completar-solicitud/route.ts` | POST completar solicitud de denuncia |
| `app/api/monitorista/solicitudes/route.ts` | GET/POST solicitudes generales |
| `app/api/monitorista/evidencias/subir/route.ts` | POST subir evidencia general |
| `app/api/monitorista/expediente-proxy/route.ts` | Proxy para visualizar docs con token |

### Frontend (6)

| Archivo | Propósito |
|---------|-----------|
| `app/monitorista/layout.tsx` | Verifica rol (Monitorista/Administrador) |
| `app/monitorista/page.tsx` | Bandeja: KPIs + tabs pendientes/completadas |
| `app/monitorista/denuncias/[id]/page.tsx` | Detalle de denuncia con solicitudes y evidencias |
| `components/monitorista/BandejaSolicitudes.tsx` | Lista de solicitudes con SUBIR/COMPLETAR/VER |
| `components/monitorista/SubirEvidenciaModal.tsx` | Modal con compresión, barra de progreso, selector foto/PDF |
| `components/monitorista/BotonSubirDenuncia.tsx` | Botón SUBIR + COMPLETAR para cards de denuncia |

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `lib/db/schema.ts` | +3 tablas (solicitudes_evidencia, evidencias, monitorista_historial) |
| `app/dashboard/module-cards.tsx` | +Card "Monitorista" en el dashboard |
| `app/dashboard/page.tsx` | +Redirección rol Monitorista → `/monitorista` |
| `.env` | +`EXPEDIENTE_DIGITAL_URL` |
| `drizzle/0005_monitorista.sql` | Migración de las 3 tablas |

---

## Variables de Entorno

```env
EXPEDIENTE_DIGITAL_URL=https://sanjuandelrio.sytes.net:3044
NEXT_PUBLIC_WS_EXPEDIENTE=https://sanjuandelrio.sytes.net:3044
```

---

## Estados de Evidencia (Denuncias D1)

| estado_evidencia | Significado | Visible en Monitorista |
|-----------------|-------------|----------------------|
| `SIN_SOLICITUD` | Denuncia creada, sin pedir evidencias | ❌ |
| `PENDIENTE_MONITORISTA` | Fiscalía solicitó evidencias | ✅ PENDIENTES |
| `EVIDENCIA_ENVIADA` | Monitorista subió todo y envió | ✅ COMPLETADAS |
| `FINALIZADO` | Fiscalía cerró el caso | ✅ COMPLETADAS |
