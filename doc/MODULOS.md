# Módulos del Sistema — Contexto Completo

> **Leyenda:** ✅ = Implementado | 🚧 = En construcción | 📋 = Planificado (pendiente)

---

## 1. Módulo 911 — Centro de Atención de Llamadas de Emergencia

### 1.1 Recepción 911 (Bitacorista)

**Rol:** Bitacorista — Recibe llamadas de emergencia y registra incidentes.

**📋 Alta de Llamada 911 (Modal 4 vistas):**

| Campo | Estado |
|-------|--------|
| Folio del incidente | ✅ |
| Folio CAD | 📋 |
| Fecha y hora de inicio de llamada | ✅ |
| Fecha y hora de cierre de llamada | ✅ |
| Nombre del reportante u opcional anónimo | ✅ |
| Sexo | ✅ |
| Edad | ✅ |
| Domicilio (calle, colonia, entre calles) | ✅ |
| Ubicación / Referencia | ✅ |
| ¿Es usuario frecuente? | ✅ |
| ¿Es persona afectada? | ✅ |
| Agregar más de una persona afectada (nombre, sexo, edad) | ✅ |
| ¿Es migrante o paisano? | ✅ |
| Tipo de emergencia | ✅ |
| Tipo de incidente (select) | ✅ |
| Prioridad | ✅ |
| Observaciones | ✅ |
| Medio al que se canalizó (Protección Civil, Médicos, etc.) | ✅ |
| Quién capturó (sesión) | ✅ |
| Estatus: sin_despachar y se asigna a despacho | ✅ |

**Flujo:**
```
Llamada entrante → Bitacorista responde
  → Captura datos del reportante y ubicación
  → Clasifica tipo de emergencia e incidente
  → Asigna prioridad
  → Canaliza a despacho u otro medio
  → Estatus: sin_despachar
```

**📋 Según el tipo de incidente se cierra el folio** — Si no requiere despacho, pasa a atendido directo.

---

### 1.2 Recepción WhatsApp

**Rol:** Bitacorista — Incidentes reportados desde grupos de WhatsApp.

**📋 Modal (2 vistas):**

| Campo | Estado |
|-------|--------|
| Canal de origen: WHATSAPP | ✅ |
| Grupo de WhatsApp (solo si canal = whatsapp) | ✅ |
| Nombre del reportante u opcional anónimo | ✅ |
| Incidente (descripción) | ✅ |
| Tipo de incidente (select o abierto) | ✅ |
| Domicilio (calle, colonia, entre calles) | ✅ |
| Ubicación / Referencia | ✅ |
| Quién capturó (sesión) | ✅ |
| Se asigna unidad como canalizador | 📋 |
| Estatus: sin_despachar | ✅ |
| Fecha y hora de inicio | ✅ |
| Fecha y hora de fin | ✅ |

---

### 1.3 Despacho de Unidades

**Rol:** Despachador — Asigna unidades y elementos a incidentes.

**📋 Modal (2 vistas):**

| Campo | Estado |
|-------|--------|
| Folio del incidente | ✅ |
| Unidades que van a atender la incidencia | ✅ |
| Elementos policiacos que van a atender la incidencia | ✅ |
| Cambio de estatus a: en_despacho | ✅ |

**Flujo:**
```
Incidente en sin_despachar
  → Despachador selecciona unidades disponibles
  → Selecciona elementos (policías)
  → Confirma despacho
  → Estatus: en_despacho
```

---

## 2. Reportes desde Campo (Oficial)

### 2.1 Reporte de Recorrido / Incidente vía Radio

**Rol:** Oficial de Campo — Reporta novedades desde la patrulla vía radio.

**📋 Datos del Reporte (vista oficial):**

| Campo | Estado |
|-------|--------|
| Canal de origen: RADIO | ✅ |
| Folio CAD | ✅ (en `ofi_reportes_campo`; 📋 en schema `incidentes`) |
| Nombre del reportante u opcional anónimo | ✅ |
| Tipo reporte: RECORRIDO | 📋 (schema actual solo permite: normal, extorsion, alarma_escolar) |
| Incidente (descripción) | ✅ |
| Tipo de incidente | ✅ |
| Lugar de los hechos (calle, colonia, entre calles) | ✅ |
| Ubicación / Referencia | ✅ |
| Contenido del reporte | ✅ |
| Quién capturó (sesión) | ✅ |
| Estatus: en_despacho (automático en radio) | ✅ |
| Fecha y hora de inicio | ✅ |
| Fecha y hora de fin | ✅ |

**📋 Datos del Reporte de Campo (vista oficial — 1.1):**

| Campo | Estado |
|-------|--------|
| Datos positivos/negativos | ✅ |
| Acciones realizadas | ✅ |
| **Detención:** | |
| - Nombre de los detenidos | ✅ |
| - Autoridad que recibe la puesta a disposición | ✅ |
| - Expediente CI | ✅ |
| - Delito / Falta administrativa | ✅ |
| - Monto (robo) | ✅ |
| - Objetos recuperados | ✅ |
| - Vehículos recuperados / Tipo / Destino | ✅ |
| **Cateo:** | |
| - Domicilio cateado | ✅ |
| - Resultado de cateo | ✅ |
| - Policía a cargo | ✅ |
| - Personal que lo ingresó a CI | ✅ |
| Estatus: atendido (automático al cerrar reporte) | ✅ |

**📋 Reporte de Recorrido Seguimiento (vista oficial — 1.2):**

Para cuando el oficial ya tiene un incidente abierto y solo complementa:

| Campo | Estado |
|-------|--------|
| Folio del incidente | ✅ |
| Tipo reporte: RECORRIDO | ✅ |
| Fecha / Hora | ✅ |
| Contenido del reporte | ✅ |
| Lugar de los hechos | ✅ |
| Quién capturó | ✅ |
| Datos positivos/negativos | ✅ |
| Acciones realizadas, Detención, Cateo | ✅ |
| Estatus: atendido | ✅ |

---

### 2.2 Reporte de Detenidos (puesto a disposición)

**📋 (Modal 5 vistas):**

| Campo | Estado |
|-------|--------|
| Folio del incidente | ✅ |
| Folio del reporte | 📋 |
| IPH | 📋 |
| Fecha / Hora | 📋 |
| Folio SIJA | 📋 |
| Nombre del detenido (se obtiene del reporte) | ✅ |
| Domicilio del detenido | 📋 |
| Placa unidad policial donde estuvo (del reporte) | 📋 |
| Nombre del policía (del reporte) | ✅ |
| Nómina del policía (del reporte) | ✅ |
| Registro de tableta | 📋 |
| Folio remisión | 📋 |
| Marco legal | 📋 |
| Lugar de la detención (del reporte) | ✅ |
| Nombre de quien ingresó el registro (del reporte) | ✅ |

---

### 2.3 Reporte de Alarma Escolar

**📋 (Modal — parcialmente implementado):**

| Campo | Estado |
|-------|--------|
| Fecha / Hora | ✅ |
| Establecimiento | ✅ |
| Dirección | ✅ |
| Inmueble | ✅ |
| Responsable | ✅ |
| Reporte (descripción) | ✅ |
| Prioridad | 📋 |
| Hora de canalización | ✅ |
| Unidad que arribó | ✅ |
| Hora de arribo | ✅ |
| Nombre del responsable | ✅ |
| Nombre del verificador | ✅ |
| Activaciones (contador) | ✅ |

---

## 3. Denuncias (D1)

**Rol:** Oficial de Campo — Toma de denuncia formal.

**Ruta:** `/denuncia/nuevo` | **API:** `POST /api/reportes-d1` | **Tabla:** `ofi_reporte_denuncia` (raw SQL)

### 3.1 Reporte de Denuncia D1

Implementado vía stored procedure `insertar_reporte_d1`. Formulario con todos los campos:

| # | Campo | Tipo | Requerido |
|---|-------|------|-----------|
| 1 | Folio de denuncia | text | ✅ |
| 2 | Fecha de reporte | date | ✅ |
| 3 | Hora de reporte | time | ✅ |
| 4 | Corporación | varchar | ❌ (default SSPM) |
| 5 | IPH | varchar | ❌ |
| 6 | Delito | varchar | ✅ |
| 7 | Violencia (Sí/No) | boolean | ❌ (default false) |
| 8 | Fecha de despacho | date | ❌ |
| 9 | Hora de despacho | time | ❌ |
| 10 | Fecha de confirmación | date | ❌ |
| 11 | Hora de confirmación | time | ❌ |
| 12 | Tipo de evento: D1 / Flagrancia / Detenido c/elementos | varchar | ✅ |
| 13 | Lugar del hecho / Lugar de apoyo | text | ❌ |
| 14 | Colonia del hecho / Colonia de apoyo | varchar | ❌ |
| 15 | Municipio | varchar | ❌ (default San Juan del Río) |
| 16 | Latitud / Longitud | numeric | ❌ |
| 17 | Hora/cuando el ciudadano vio el hecho | time | ❌ |
| 18 | Fecha/cuando el ciudadano vio el hecho | date | ❌ |
| 19 | Día de llegada / Hora de llegada | date/time | ❌ |
| 20 | Hora inicio de toma de denuncia | time | ❌ |
| 21 | Hora término de toma de denuncia | time | ❌ |
| 22 | Hora término de la atención | time | ❌ |
| 23 | CRP (placa de patrulla) | varchar | ❌ |
| 24 | Nómina del mando / Policía a cargo | varchar | ❌ |
| 25 | Policía que levanta denuncia / firma D1 | varchar | ❌ |
| 26 | Policía que ingresa CU | varchar | ❌ |
| 27 | Grupo de adscripción | varchar | ❌ |
| 28 | Calle/avenida/número del apoyo | varchar | ❌ (en lugar_apoyo) |
| 29 | ¿Se requirió tablet? | boolean | ❌ (default false) |
| 30 | ¿Funcionaba la tablet? | boolean | ❌ (default false) |
| 31 | Folio de CU | varchar | ❌ |
| 32 | Ofendido hombre / mujer | integer | ❌ (default 0) |
| 33 | Número de cuestionarios enviados | integer | ❌ (default 0) |
| 34 | Intervino GS (Sí/No) | boolean | ❌ (default false) |
| 35 | Se generó D1 / Se va a generar D1 | boolean | ❌ (default false) |
| 36 | Observaciones | text | ❌ |

**Columnas adicionales de control:**
- `estado_tramite`: RECIBIDA (default)
- `estado_evidencia`: SIN_SOLICITUD (default) — cambia cuando se solicitan evidencias al Monitorista
- `monitorista_fechas_requeridas`: JSONB con fechas de solicitudes al Monitorista
- `num_carpeta_investigacion`: Número de carpeta de investigación
- `fecha_cierre`: Fecha de cierre del trámite

**Pendiente (checklist por reporte):**
- Denuncia CU-D1 (Sí, No y duración)
- Detenidos FGE / FGR / JC (Sí/No)
- Convenios / Trabajos en favor de la comunidad
- Coincide ubicación GPS / Se visualizó vía cámara / TI/PI

### 3.2 Cuestionario Único de Robo

**📋 Se elabora un cuestionario único en caso de robo (Modal 7):**

| Campo | Estado |
|-------|--------|
| Folio del incidente | ✅ |
| Folio del reporte | 📋 |
| Fecha / Hora | 📋 |
| Folio cuestionario único | 📋 |
| Robo | 📋 |
| Nombre del policía (del reporte) | ✅ |
| Nómina del policía (del reporte) | ✅ |
| Registro de tableta | 📋 |
| Sector | 📋 |
| Nombre de quien ingresó el registro (del reporte) | ✅ |

---

## 4. Módulo de Monitorista

**Rol:** Monitorista (id:27) — Gestión de solicitudes de evidencias.

### 4.1 Flujo de Evidencias para Denuncias D1

El Monitorista recibe solicitudes de Fiscalía/Juzgado para adjuntar fotos/videos a una denuncia D1.

**Bandeja:** `/monitorista`

```
Fiscalía solicita evidencias
  → ofi_reporte_denuncia.estado_evidencia = 'PENDIENTE_MONITORISTA'
  → Se agrega entrada a monitorista_fechas_requeridas (JSONB)
  → Aparece en "Solicitudes Pendientes" del Monitorista
    → Monitorista sube fotos/videos
      → Se insertan en moni_evidencias_denuncia
      → Presiona "Enviar a Fiscalía"
        → estado_evidencia = 'EVIDENCIA_ENVIADA'
        → Pasa a "Solicitudes Atendidas"
        → Fiscalía recibe notificación
          → Si necesita más → ciclo se repite
          → Si está conforme → Cierra con Carpeta de Investigación
            → estado_tramite = 'CERRADA'
            → estado_evidencia = 'FINALIZADO'
```

### 4.2 Tablas que utiliza

| Tabla | Propósito |
|-------|-----------|
| `ofi_reporte_denuncia` | Denuncia D1. Columnas: `estado_evidencia`, `estado_tramite`, `monitorista_fechas_requeridas` (JSONB) |
| `moni_evidencias_denuncia` | Archivos subidos por el Monitorista vinculados a una denuncia |
| `solicitudes_evidencia` | Solicitudes de evidencia para incidentes generales (no D1) |
| `evidencias` | Archivos subidos para incidentes generales |
| `monitorista_historial` | Contabilización de actividad del Monitorista |

### 4.3 Filtros en Bandeja

| Pestaña | Filtro |
|---------|--------|
| Pendientes | `ofi_reporte_denuncia.estado_evidencia = 'PENDIENTE_MONITORISTA'` + `solicitudes_evidencia.status = 'pendiente'` |
| Atendidas | `ofi_reporte_denuncia.estado_evidencia IN ('EVIDENCIA_ENVIADA','FINALIZADO')` + `solicitudes_evidencia.status IN ('completada','cancelada')` |

### 4.4 Estados de Evidencia en Denuncia

| Estado | Significado |
|--------|-------------|
| `SIN_SOLICITUD` | Denuncia recién creada, no se ha pedido apoyo |
| `PENDIENTE_MONITORISTA` | Fiscalía solicitó evidencias, esperando al Monitorista |
| `EVIDENCIA_ENVIADA` | Monitorista subió y envió, Fiscalía debe revisar |
| `FINALIZADO` | Denuncia cerrada, evidencia concluida |

---

## 5. Área de Análisis (Cosmos)

**Rol:** Analista — Reportes estratégicos y dashboards.

### 5.1 Reporte de Detenidos (PPT)

**📋 Diario, semanal y mensual por cada hoja:**

| # | Campo |
|---|-------|
| 1 | Nombre del detenido |
| 2 | Folio |
| 3 | Fotografía frontal |
| 4 | Fotografía lado derecho |
| 5 | Fotografía lado izquierdo |
| 6 | Evento o incidente |
| 7 | Delitos |
| 8 | Falta administrativa |
| 9 | Modus operandi |

### 5.2 Reporte Detallado de Detenidos (PPT)

**📋 Diario, semanal y mensual por cada hoja:**

| # | Campo |
|---|-------|
| 1 | Nombre del detenido |
| 2 | Folio |
| 3 | Fotografía frontal |
| 4 | Fotografía con armas u objeto encontrado |
| 5 | Fecha de nacimiento |
| 6 | Origen |
| 7 | Género |
| 8 | Escolaridad |
| 9 | Estado civil |
| 10 | Ocupación |
| 11 | Domicilio |
| 12 | Rasgos particulares |
| 13 | Eventos delictivos |
| 14 | Fecha y hora |
| 15 | RND |
| 16 | Expediente |
| 17 | Lugar del evento |
| 18 | Lugar de la detención |
| 19 | IPH |
| 20 | Nexos delictivos |
| 21 | Zona de operación |
| 22 | Puesta a disposición |
| 23 | Modus operandi |
| 24 | Información adicional |
| 25 | Delitos (antecedentes) |
| 26 | Faltas administrativas |

### 5.3 Módulo de Resumen de Incidentes

**📋 Por cada clasificación:**

**Motos robadas y recuperadas:**
- Fecha, Datos, Estatus, Carpeta, Folio (de incidencia con seguimiento), Nombre de quien da seguimiento

**Vehículos robados y recuperados:**
- Fecha, Datos, Estatus, Carpeta, Folio, Nombre de quien da seguimiento

**Cateos FGE-FGR:**
- Fecha, Folio, Ubicación, Dependencia, Nombre de quien da seguimiento

**Detenidos a Fiscalía:**
- Fecha, Folio, Nombre del detenido, Observaciones, Fiscalía (si es otra), Nombre de quien da seguimiento

**Faltas Administrativas:**
- Fecha, Folio, Nombre de la persona, Observaciones, Marca si tiene ficha, Comentario de novedades, Nombre de quien da seguimiento

**Órdenes de Aprehensión:**
- Fecha, Folio, Nombre, Observaciones, Estatus, Nombre de quien da seguimiento

**Detenciones Delito Hidrocarburo:**
- Fecha, Folio, Nombre, Datos del vehículo, Litros de extracción, Toma clandestina, Observaciones

**Armas de Fuego:**
- Fecha, Folio, Datos, Cartuchos, Observaciones

**Dosis de Droga:**
- Fecha, Folio, Cantidad, Nombre, Observaciones

---

## 6. Reportes Estadísticos

### 6.1 Reportes de Incidentes

**📋 Diario:**
- Número de Cárcel Municipal
- Número de Detenidos a Fiscalía
- Número de Detenidos a FGR

**📋 Semanal:**
- Cárcel Municipal, Detenidos a Fiscalía
- Vehículos Recuperados, Apoyos Cateo FGE
- Operativos (Metropolitano, Eco 8, Alcoholimetría, Motocicletas, Apoyo Actuarios)
- Apoyo a Cateos FGR
- Detenido FGR
- Armas de Fuego, Armas Blancas, Dosis de Droga
- Apoyos a Fiestas Patronales

### 6.2 Reporte de Coordinación (formato a Coordinación)

**📋 Datos:**

| Campo |
|-------|
| Número telefónico reportado |
| Fecha de reporte |
| Tipo de incidencia |
| Envío de formato a Coordinación |

### 6.3 Eventos Informados

**📋 Por FGE:**
- Carpetas iniciadas, Cateos, Vehículos asegurados, Domicilios cateados
- Personas aseguradas, Aprehensiones
- Audiencias (iniciales, abreviados, intermedias)

**📋 Por FGR:** (misma estructura que FGE)

### 6.4 Inscripciones en el Registro Nacional de Detenciones

**📋:** Hora de detención, Delito, Autoridad que realizó la detención, Folio

### 6.5 Medios Alternativos de Solución de Conflictos

**📋:** Asuntos canalizados por Fiscalía, Acuerdos, Monto de reparación de daños

### 6.6 Atención a Víctimas

**📋:** Número de atenciones, Atenciones médicas, Atenciones psicológicas, Asesorías jurídicas, Observaciones

### 6.7 Armas de Fuego Aseguradas

**📋:** Carpeta de investigación, Tipo de arma, Matrícula, Calibre, Observaciones

---

## 7. Caso de Uso: Ciudadano Denuncia

**Ruta:** `/denuncia/nuevo` | **Tablas:** `ofi_reporte_denuncia` + `moni_evidencias_denuncia`

**✅ Implementado completo con stored procedure.**

### 7.1 Flujo de Denuncia D1

```
Oficial levanta reporte en campo
  → Pregunta: ¿ciudadano quiere denunciar?
    → Sí → Captura denuncia completa en formulario D1
      → POST /api/reportes-d1 → stored procedure insertar_reporte_d1
      → Nace ofi_reporte_denuncia (estado_tramite: RECIBIDA, estado_evidencia: SIN_SOLICITUD)
      → Aparece en bandeja de entrada de Fiscalía
```

### 7.2 Máquina de Estados (estado_tramite + estado_evidencia)

```
                          ┌──────────────────────┐
                          │      RECIBIDA         │
                          │  estado_evidencia:     │
                          │  SIN_SOLICITUD        │
                          └──────────┬───────────┘
                                     │ Fiscalía toma caso
                                     ▼
                          ┌──────────────────────┐
                          │    EN_ANALISIS        │
                          │  estado_evidencia:     │
                          │  SIN_SOLICITUD        │
                          └──────────┬───────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  │                                     │
       ┌──────────▼──────────┐              ┌──────────▼──────────┐
       │ CAMINO A            │              │ CAMINO B            │
       │ Requiere evidencias │              │ No requiere         │
       └──────────┬──────────┘              └──────────┬──────────┘
                  │                                     │
                  ▼                                     │
   ┌─────────────────────────────┐                      │
   │ estado_evidencia:           │                      │
   │ PENDIENTE_MONITORISTA       │                      │
   │ (aparece en panel           │                      │
   │  de Monitorista)            │                      │
   └─────────────┬───────────────┘                      │
                 │ Monitorista sube fotos               │
                 ▼                                      │
   ┌─────────────────────────────┐                      │
   │ estado_evidencia:           │                      │
   │ EVIDENCIA_ENVIADA           │                      │
   │ (notificación a Fiscalía)   │                      │
   └─────────────┬───────────────┘                      │
                 │ Fiscalía revisa                      │
                 │   ¿Necesita más? ──→ PENDIENTE...    │
                 │   (ciclo N veces)                    │
                 │                                      │
                 ▼                                      ▼
          ┌──────────────────────────────────────────────────┐
          │              CERRADA                             │
          │  estado_evidencia: FINALIZADO                    │
          │  num_carpeta_investigacion + fecha_cierre       │
          │  (solo lectura)                                  │
          └──────────────────────────────────────────────────┘
```

### 7.3 Solicitudes Múltiples al Monitorista

Si Fiscalía necesita más evidencias después de recibir las primeras, el ciclo se repite:

```
Fiscalía pide evidencias (1ra tanda)
  → solicitud_id: 1 agregado a monitorista_fechas_requeridas (JSONB)
  → estado_evidencia: PENDIENTE_MONITORISTA
  → Monitorista sube → envía
  → estado_evidencia: EVIDENCIA_ENVIADA

Fiscalía revisa y necesita más (2da tanda)
  → solicitud_id: 2 agregado al JSONB
  → estado_evidencia: PENDIENTE_MONITORISTA (reactivado)
  → Monitorista sube → envía
  → estado_evidencia: EVIDENCIA_ENVIADA

... (N iteraciones)

Fiscalía cierra
  → estado_tramite: CERRADA, estado_evidencia: FINALIZADO
```

### 7.4 Filtros por Rol

| Rol | Vista | Filtro |
|-----|-------|--------|
| **Monitorista** | Solicitudes Pendientes | `estado_evidencia = 'PENDIENTE_MONITORISTA'` |
| **Monitorista** | Solicitudes Atendidas (Historial) | `estado_evidencia IN ('EVIDENCIA_ENVIADA','FINALIZADO') AND monitorista_fechas_requeridas IS NOT NULL` |
| **Fiscalía** | Casos en Curso | `estado_tramite = 'EN_ANALISIS'` |
| **Fiscalía** | Casos Archivados | `estado_tramite = 'CERRADA'` |

---

## 8. Prevención del Delito

### 8.1 Medidas de Protección (`/prevencion/medidas`) ✅

| Funcionalidad | Estado |
|---------------|--------|
| HU-1.1 — Nueva Medida | ✅ |
| HU-1.2 — Visitas Domiciliarias | ✅ |
| HU-1.3 — Libro Digital (semáforo) | ✅ |
| Prórrogas | ✅ |
| Autoridades adicionales | ✅ |

### 8.2 Búsquedas / Protocolo Alba (`/prevencion/busquedas`) ✅

| Funcionalidad | Estado |
|---------------|--------|
| HU-2.1 — Alta de Ficha + Hoja de Difusión | ✅ |
| HU-2.2 — Timeline 24/48/72h + Mensuales | ✅ |
| HU-2.3 — Cancelación de búsqueda | ✅ |
| Alertas automáticas | ✅ |

### 8.3 Área Jurídica (`/prevencion/juridico`) ✅

| Funcionalidad | Estado |
|---------------|--------|
| HU-3.1 — Nueva Solicitud → en_juridico | ✅ |
| HU-3.2 — Bandeja Jurídica + Solicitudes C4 | ✅ |
| HU-3.3 — Contestación + Acuse de Entrega | ✅ |

---

## 9. Rol de Servicios (`/rol_servicios`) ✅

| Funcionalidad | Estado |
|---------------|--------|
| Creación de Rol (folio automático) | ✅ |
| Encabezado (turno, horario, sector) | ✅ |
| Asignaciones (unidades y elementos) | ✅ |
| Estado de Fuerza | ✅ |
| Observaciones | ✅ |
| Firmas Digitales | ✅ |
| Cierre | ✅ |
| Catálogos (sectores, radios, body cams) | ✅ |

---

## 10. Administración (`/admin`) ✅

| Funcionalidad | Estado |
|---------------|--------|
| Usuarios (CRUD) | ✅ |
| Roles | ✅ |
| Catálogos varios | ✅ |

---

## Resumen de Roles del Sistema

| Rol | Descripción | Estado |
|-----|-------------|--------|
| **Bitacorista** | Recepción de llamadas 911 y WhatsApp | ✅ |
| **Despachador** | Asignación de unidades a incidentes | ✅ |
| **Oficial de Campo** | Reportes de campo, recorridos, detenidos | ✅ |
| **Monitorista** | Solicitudes de evidencias, subida de fotos/videos | ✅ |
| **Operador 911** | Captura inicial de eventos desde líneas | ✅ |
| **Supervisor** | Supervisión y autorización de eventos | ✅ |
| **Operador de Novedades** | Consolidación y generación de reportes | ✅ |
| **Auxiliar de Novedades** | Clasificación de delitos y hechos | ✅ |
| **Investigador** | Análisis, fichas y georreferenciación | ✅ |
| **Monitoreo de Cámaras** | Registro de actividad de cámaras | ✅ |
| **Analista** | Reportes estadísticos, dashboards, PPT | 📋 |
| **Operador Víctimas** | Medidas de protección, búsquedas | ✅ |
| **Jurídico** | Bandeja legal, solicitudes C4, contestaciones | ✅ |
| **Administrador** | Gestión de usuarios, roles, catálogos | ✅ |
| **Consultor** | Acceso de solo lectura/consulta | ✅ |
