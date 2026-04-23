# Plan de Trabajo — Sistema C4 SSPM San Juan del Río

> Stack: Next.js App Router · TypeScript · PostgreSQL + PostGIS · Drizzle ORM · Socket.io · Leaflet · Whisper · Gemini/Ollama  
> Estado actual del repo: scaffold Next.js únicamente — cero implementación.

---

## Módulos identificados

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| **C4 Operativo** | 7 fases: 911 → despacho → campo → bitácora → novedades → análisis → salida | Flujo claro, campos sin definir |
| **Prevención del Delito** | 2 escenarios: Oficio (FM-01..04) + Alerta Ámbar (FM-05..09) | Flujo claro, **9 formatos pendientes** |

---

## 🚧 Bloqueadores críticos

No se puede avanzar en diseño de BD ni formularios sin resolver esto primero.

### 1. Formatos FM-01 a FM-09 — Prevención del Delito
El diagrama nombra 9 formatos pero **no define qué campos captura cada uno**. Sin esto es imposible:
- Diseñar el schema de base de datos
- Construir los formularios
- Definir validaciones y campos obligatorios

### 2. Formatos del C4 Operativo
El formulario de recepción 911 (Fase 1) y los reportes de campo (Fase 3) no tienen campos definidos.  
El pie del diagrama indica **16 formatos pendientes** en total entre ambos módulos.

### 3. Historias de usuario
Sin ellas no se puede determinar:
- Roles exactos (operador líneas, despachador, oficial campo, analista, jefatura prevención)
- Permisos por rol (quién ve qué, quién puede editar)
- Flujos de excepción (¿qué pasa si falla el despacho? ¿caso sin cierre?)

---

## Fase 0 — Prerequisitos (bloqueado)

```
[ ] Obtener FM-01..FM-09 completos (campos, validaciones, obligatoriedad)
[ ] Obtener formatos C4 operativo (recepción 911, despacho, campo, novedades)
[ ] Definir roles y permisos por área
[ ] Validar historias de usuario con operativos C4 y jefatura Prevención
```

**Acción recomendada:** Solicitar los formatos físicos/Excel que actualmente se usan en papel — ya existen, solo hay que digitalizarlos. Complementar con una sesión de levantamiento con cada área.

---

## Fase 1 — Infraestructura base ✅ PUEDE EMPEZAR YA

No depende de formatos ni historias de usuario.

```
[ ] Drizzle ORM: config + primera migración (tablas vacías de referencia)
[ ] NextAuth.js: autenticación base, estructura de roles skeleton
[ ] Layout general: navbar, sidebar por rol, tema institucional
[ ] CI básico: lint + typecheck en cada push
```

**Estimado:** 3–4 días

---

## Fase 2 — C4 Operativo (parcialmente bloqueado)

Requiere formatos de cada fase antes de construir los formularios.

```
[ ] Schema BD: incidents, folios UUID, bitácora_events
[ ] Fase 1 — Formulario recepción 911              ← NECESITA formato
[ ] Fase 2 — Despacho digital de unidades          ← NECESITA campos de asignación
[ ] Fase 3 — App campo responsive (tablet/laptop)  ← NECESITA campos de reporte
[ ] Fase 4 — Trigger bitácora automática (PostgreSQL) — puede diseñarse en paralelo
[ ] Fase 5 — Módulo Novedades + borrador IA (Gemini/Ollama)
[ ] Fase 6 — WebSocket dashboard tiempo real
[ ] Fase 7 — Generación PDF fichas institucionales
[ ] Fase 7 — Envío automático a Fiscalía (email < 24 h)
```

---

## Fase 3 — Prevención del Delito (bloqueado en FM-01..09)

```
[ ] Schema BD: casos_proteccion, alertas_amber, visitas_seguimiento
[ ] Escenario 1: CRUD caso + FM-01 (oficio entrante)
[ ] Escenario 1: FM-02 (apertura de caso)
[ ] Escenario 1: FM-03 (visita de seguimiento, repetible N veces)
[ ] Escenario 1: FM-04 (cierre de caso)
[ ] Escenario 2: FM-05 / FM-06 (registro alerta ámbar)
[ ] Escenario 2: FM-07 (reporte 12 h + recordatorio automático)
[ ] Escenario 2: FM-08 (reporte 24 h + recordatorio automático)
[ ] Escenario 2: FM-09 (reporte 72 h + recordatorio automático)
[ ] Subida a Sistema Conectar + acuse
[ ] Dashboard estadísticas del área (tipo, zona, origen, fecha)
```

---

## Fase 4 — Área de Análisis (Gustavo)

```
[ ] Dashboard consolidado (3 grupos C4)
[ ] Mapas PostGIS + Leaflet — incidencia geográfica
[ ] Fichas PDF institucionales de asegurados
[ ] Job nocturno: detección zonas calientes + alertas por umbral
[ ] Whisper STT: oficial dicta reporte por micrófono, revisa y guarda
```

---

## Fuentes externas (sin modificar)

| Sistema | Rol en el flujo |
|---------|----------------|
| CAD Federal | Origen del folio |
| Sistema 911 | Llamadas entrantes |
| Hikvision GPS | Alarmas y posición de unidades |
| Radio / Campo | Operación sin cambio (web app responsive) |
| Sistema Conectar | Alertas Ámbar (estado) |
| Fiscalía / Sec. de la Mujer | Emiten oficios de Medidas de Protección |

---

## Principio de IA — validación humana en todo

| Componente | Rol | Aprobación |
|------------|-----|-----------|
| Whisper STT | Transcribe audio del oficial | Oficial revisa antes de guardar |
| Gemini / Ollama | Redacta borrador en Novedades | Operador edita y aprueba |
| Job nocturno | Detecta patrones, zonas calientes | Analista interpreta las alertas |

> Ningún proceso crítico se ejecuta sin confirmación humana.

---

*Última actualización: abril 2026*
