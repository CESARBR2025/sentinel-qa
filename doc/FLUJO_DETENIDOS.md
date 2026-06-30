# Flujo de Detenidos — Módulo Monitorista

## Fuente de datos

Los detenidos se obtienen de la tabla `ofi_reportes_campo`. Un registro se considera "con detenido" cuando la columna `ofi_detenidos` (JSONB) contiene datos distintos de `[]` y `'1'` (este último es data malformada que se excluye).

```
WHERE ofi_detenidos IS NOT NULL
  AND ofi_detenidos::text NOT IN ('[]', '1')
```

El nombre del detenido se extrae del JSON: `ofi_detenidos->0->>'nombre'`.

### JOIN con `ofi_reporte_denuncia`

Se hace LEFT JOIN con `ofi_reporte_denuncia` (`ord.reporte_campo_id = rc.id`) para obtener valores iniciales de `delito` y `marco_legal`. El Monitorista puede sobrescribir estos valores localmente en `ofi_reportes_campo`.

```sql
COALESCE(rc.delito, ord.delito)           -- preferir el valor local
COALESCE(rc.marco_legal, ord.marco_legal) -- preferir el valor local
```

### Columnas editables (en `ofi_reportes_campo`)

| Columna | Descripción |
|---------|-------------|
| `delito` | Delito tipificado |
| `marco_legal` | Artículos y fundamentos legales |
| `falta_administrativa` | Falta al Bando de Policía y Gobierno |
| `modus_operandi` | Forma en que se cometió |

---

## Tablas del módulo

### `solicitud_fotos`
Creada por nosotros. Cada fila representa **un tipo de foto** para un detenido. Por cada detenido se crean automáticamente **3 filas** (frontal, derecho, izquierdo).

| Columna | Descripción |
|---------|-------------|
| `id` | uuid PK |
| `reporte_campo_id` | FK → ofi_reportes_campo |
| `tipo_foto` | `'frontal'` \| `'derecho'` \| `'izquierdo'` |
| `enviado_a` | `'FISCALIA'` \| `'JUZGADO_CIVICO'` \| `'AMBOS'` (null si pendiente) |
| `estado` | `'pendiente'` \| `'enviado'` \| `'rechazado'` \| `'completado'` \| `'cancelado'` |

**Constraint:** `UNIQUE (reporte_campo_id, tipo_foto)`

### `evidencias_detenido`
Fotos subidas por Fiscalía/Juzgado. Relación 1:N con `solicitud_fotos` (vía `reporte_campo_id` + `tipo_foto`).

| Columna | Descripción |
|---------|-------------|
| `id` | int PK |
| `reporte_campo_id` | FK → ofi_reportes_campo |
| `tipo_foto` | `'frontal'` \| `'derecho'` \| `'izquierdo'` |
| `url_archivo` | URL en Expediente Digital |
| `nombre_archivo` | Nombre original |
| `subido_por` | FK → users |

### `monitorista_historial`
Registro de cada acción del monitorista.

### Destinos (catálogo)

Los destinos se cargan dinámicamente desde `cat_dependencias WHERE tipo = 'externa' AND clave IN ('FISCALIA','JUZGADO_CIVICO')`.

| Clave | Nombre |
|-------|--------|
| `FISCALIA` | Fiscalía General del Estado |
| `JUZGADO_CIVICO` | Juzgado Cívico |
| `AMBOS` | Opción virtual: envía a ambos, el primero que responda gana |

---

## Máquina de Estados (por foto)

```
           ┌───────────┐
           │ PENDIENTE │ ← Se crea automáticamente al ver el detalle
           └─────┬─────┘
                 │ Monitorista envía (individual o batch)
                 ▼
          ┌──────────────┐
          │   ENVIADO     │
          │ enviado_a:    │
          │ FISCALIA /    │
          │ JUZGADO /     │
          │ AMBOS         │
          └───┬────┬─────┘
              │    │
  ┌───────────┘    └─────────────┐
  ▼                              ▼
┌──────────────┐         ┌──────────────┐
│  RECHAZADO   │         │  COMPLETADO  │
│ (no tienen   │         │ (subieron    │
│  las fotos)  │         │  la foto)    │
└──────┬───────┘         └──────────────┘
       │ Monitorista re-envía
       │ (puede cambiar destino)
       └──────────→ ENVIADO
```

Cada foto es **independiente**: se puede enviar una a Fiscalía, otra a Juzgado, y otra a ambos al mismo tiempo.

---

## Formas de envío

### 1. Individual (CardEnvioFoto)
Cada foto tiene su propio selector de destino y botón **ENVIAR** / **REENVIAR**.

### 2. Batch (BatchEnvioFotos)
Al inicio de la sección "Solicitud de Fotos" aparece un recuadro que permite seleccionar un destino y enviar **todas las fotos pendientes** de una sola vez.

- Solo actúa sobre fotos en estado `pendiente`
- Las ya enviadas no se modifican
- Las rechazadas no se incluyen

---

## PPT (Reporte de Detenidos)

### Generación
Se usa `pptxgenjs` para generar un archivo PPTX con **una diapositiva por detenido**.

### Campos por diapositiva
1. Nombre del detenido
2. Folio (`folio_reporte_campo` o "Sin folio")
3. Fotos (Frontal, Derecho, Izquierdo) — cargadas desde Expediente Digital vía proxy
4. Evento/Incidente
5. Delitos
6. Falta Administrativa
7. Modus Operandi

### Filtros
- **Fechas**: selector Desde / Hasta (si ambos vacíos, incluye todas las fechas)
- **Estado de fotos**: Todos / Pendientes / Completados

---

## Flujo de Subida de Evidencias

El Monitorista **solicita** las fotos, pero **no las sube**. Quien sube es el rol destino (Fiscalía/Juzgado) desde su propio módulo.

> **Nota:** El Monitorista **solicita** las fotos de detenidos, pero **no las sube** — eso lo hace el rol destino.
> En cambio, en **Solicitudes de Evidencia** (abajo), el Monitorista **sí sube** los archivos directamente.

```
Monitorista crea solicitud (automático al ver detalle)
  → INSERT solicitud_fotos x3 (frontal, derecho, izquierdo)

Monitorista envía (individual o batch)
  → UPDATE solicitud_fotos SET estado='enviado', enviado_a='FISCALIA'

Fiscalía/Juzgado recibe en su bandeja
  → Toma la foto
  → Sube a Expediente Digital (POST /api/expediente/subir)
  → INSERT evidencias_detenido (reporte_campo_id, tipo_foto, url_archivo, nombre_archivo)
  → UPDATE solicitud_fotos SET estado='completado'

Monitorista ve el resultado
  → Card de la foto cambia a COMPLETADO + link para ver vía proxy
```

---

## Solicitudes de Evidencia (Sub-módulo de Evidencias)

A diferencia de las fotos de detenidos (donde el Monitorista solo solicita), en **Solicitudes de Evidencia** el Monitorista **sí sube** los archivos directamente.

### Origen de datos

| Origen | Tabla | Descripción |
|--------|-------|-------------|
| Denuncia D1 | `ofi_reporte_denuncia` | Reportes con estatus `'EN PROCESO'` o `'ASIGNADO'` |
| General | `solicitudes_evidencia` | Solicitudes creadas manualmente |

### Flujo de subida

```
Monitorista selecciona solicitud pendiente
  → Abre modal de subida (SubirEvidenciaModal)
  → Selecciona archivo: Foto (JPG/PNG) o Documento (PDF)
  → Si es foto, se comprime al cliente:
      - Redimensiona a 1920px (manteniendo ratio)
      - Convierte a JPEG calidad 0.7
  → Envía a POST /api/monitorista/evidencias/subir
      - Multipart form: file + solicitudId + incidenteId + tipo
  → El servidor:
      1. Obtiene guest token de Expediente Digital
      2. Sube archivo vía POST /api/documents/upload-and-create
      3. INSERT en evidencias (solicitud_id, incidente_id, tipo, url_expediente)
      4. Registra en monitorista_historial
```

### Tabla `evidencias`

| Columna | Descripción |
|---------|-------------|
| `id` | serial PK |
| `solicitud_id` | FK → solicitudes_evidencia |
| `incidente_id` | ID del reporte de denuncia |
| `tipo` | `'foto'` \| `'documento'` |
| `nombre_original` | Nombre del archivo |
| `url_expediente` | URL en Expediente Digital |
| `subido_por` | FK → users |

### Endpoints

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | `/api/monitorista/solicitudes` | Listar solicitudes (pendientes + completadas) |
| GET | `/api/monitorista/solicitudes/{id}` | Detalle de solicitud + evidencias |
| POST | `/api/monitorista/evidencias/subir` | Subir archivo (multipart) |

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | `/api/monitorista/detenidos` | Listar detenidos desde ofi_reportes_campo |
| GET | `/api/monitorista/detenidos/{id}` | Detalle + fotos + solicitud_fotos |
| POST | `/api/monitorista/detenidos/{id}/enviar-foto` | Enviar una foto a un destino |
| POST | `/api/monitorista/detenidos/{id}/editar-campo` | Editar delito/marco_legal/falta_admin/modus_operandi |
| POST | `/api/monitorista/detenidos/generar-ppt` | Generar PPT |

---

## Expediente Digital

### Conexión — Guest Token

```
POST /api/auth/guest-token
Body: { "codigo_invitacion": "INV-2026-001", "nombre_invitado": "Monitorista X" }
Response: { token: "eyJ...", expires_in: "8h" }
```

Formato del código de invitación: `INV-{year}-{###}` (ej. `INV-2026-001`).

### Subida

```
POST /api/documents/upload-and-create
  Headers: Authorization: Bearer {guest_token}
  Body: multipart/form-data (file)
  Query: id_usuario_general=SSPM_SISTEMA&tipo_documento=EVIDENCIA_{TIPO}&folio={folio}
  Response: { documento: { url_archivo: "/documentos_generales/SSPM_SISTEMA/..." } }
```

### Visualización (proxy)

```
GET /api/expediente/proxy?url={url_del_documento}
```

### Código compartido (`lib/expediente/client.ts`)

| Función | Descripción |
|---------|-------------|
| `obtenerGuestToken(nombre)` | Obtiene y cachea el token de invitado |
| `subirArchivoExpediente(token, archivo, folio, tipoDoc)` | Sube archivo al Expediente Digital |
| `limpiarCacheToken()` | Limpia el caché del token |

### Límites

- **Tamaño máximo**: ~25MB por archivo
- **Formatos**: Fotos (JPG/PNG) y PDFs
- **Videos**: ❌ No soportados
- **Tokens**: expiran cada 8h, se renuevan automáticamente
