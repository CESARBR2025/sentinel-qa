# Plan de Corrección — Sentinel SSPM

> Análisis de duplicación de datos, deuda técnica arquitectónica y plan de acción por rol.
> Julio 2026

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Arquitectura Actual](#2-arquitectura-actual)
3. [Eliminación de Drizzle ORM — Análisis y Plan](#3-eliminación-de-drizzle-orm--análisis-y-plan)
4. [Rol: Oficial de Campo](#4-rol-oficial-de-campo)
5. [Rol: Monitorista / Operador C4](#5-rol-monitorista--operador-c4)
6. [Rol: Prevención](#6-rol-prevención)
7. [Rol: Administrador / Admin-Transito](#7-rol-administrador--admin-transito)
8. [Rol: Servicios](#8-rol-servicios)
9. [Roles: Agentes y Fiscalía](#9-roles-agentes-y-fiscalía)
10. [Rol: Auxiliar de Novedades](#10-rol-auxiliar-de-novedades)
11. [Módulos con Capas Incompletas](#11-módulos-con-capas-incompletas)
12. [Correcciones Transversales](#12-correcciones-transversales)
13. [Resumen de Prioridades](#13-resumen-de-prioridades)

---

## 1. Resumen Ejecutivo

Se realizó un análisis completo de los 16 módulos del proyecto Sentinel SSPM, validado contra el schema real de la BD (vía `information_schema`). Se detectaron:

| Hallazgo | Cantidad | Severidad |
|----------|----------|-----------|
| Columnas que duplican información obtenible por FK (nombres en varchar) | ~35 columnas en ~15 tablas | 🔴 Alta |
| Columnas que **ya fueron corregidas** en BD vs código desactualizado | 4 (`ofi_oficiales.nombre/ap_paterno/ap_materno`, `ofi_reportes_campo.ofi_oficial_nombre`) | ✅ Hecho |
| Nuevas tablas OFI normalizadas ya existentes en BD | 4 (`ofi_detalles_asegurados`, `ofi_puesta_disposicion`, `ofi_fichas_inteligencia`, `ofi_reporte_denuncia`) | ✅ Hecho |
| Campos JSONB que deberían ser tablas normalizadas | ~10 (algunos ya migrados a las tablas nuevas) | 🟡 Media |
| Columnas en BD que no existen en schema Drizzle (schema drift) | ~60+ | 🔴 Alta |
| Violaciones de regla "No Drizzle — raw pg only" | ~120+ ubicaciones | 🔴 Alta |
| Instancias duplicadas de Drizzle ORM | 2 (`lib/db.ts` y `lib/db/index.ts`) | 🟡 Media |
| API Routes que duplican Server Actions | ~20 rutas | 🟡 Media |
| Funciones duplicadas horizontalmente (helpers, queries, mappers) | ~15 | 🟡 Media |
| Problemas de seguridad (inyección SQL, credenciales en logs) | 2 | 🔴 Crítica |
| Race condition en generación de folios | 1 | 🔴 Crítica |
| Módulos con capas incompletas | 8 | 🟢 Baja |

> **Nota importante:** El análisis inicial se hizo sobre código fuente. Al contrastar con la BD real vía `information_schema`, se descubrió que ~4 columnas duplicadas ya fueron eliminadas en BD y que existen ~10 tablas que no aparecen en el código Drizzle ni en los módulos analizados (especialmente en el módulo OFI y el esquema `via`).

---

## 2. Arquitectura Actual

### 2.1 Mapa de capas por módulo

```
Estado: ✅ Completo | ◐ Parcial | ❌ Ausente

Módulo                    types  mapper  repo  service  actions  DB Access
──────────────────────    ─────  ──────  ────  ───────  ───────  ─────────
oficial                    ✅     ✅     ✅     ✅       ✅       Raw SQL
agente_infracciones        ✅     ✅     ✅     ✅       ✅       Raw SQL
agente_juzgado             ✅     ✅     ✅     ✅       ✅       Raw SQL
agente_liberaciones        ✅     ✅     ✅     ✅       ✅       Raw SQL
fiscalia                   ✅     ✅     ✅     ✅       ✅       Raw SQL
auxiliar                   ✅     ✅     ✅     ✅       ✅       Mixto *
corralon                   ✅     ❌     ✅     ✅       ✅       Raw SQL
flota                      ✅     ❌     ✅     ✅       ❌       Raw SQL
camara                     ❌     ❌     ✅     ✅       ❌       Raw SQL
d1                         ❌     ❌     ✅     ✅       ❌       Raw SQL
reportes-incidentes        ❌     ❌     ✅     ✅       ❌       Raw SQL
reportes-operativos        ❌     ❌     ✅     ✅       ❌       Raw SQL
reportes-sin-d1            ❌     ❌     ✅     ✅       ❌       Raw SQL
reportes-sin-novedad       ❌     ❌     ✅     ✅       ❌       Raw SQL
incidentes (C4)            ❌     ❌     ✅     ✅       ✅       Drizzle 🔴
prevencion                 ❌     ❌     ❌     ❌       ✅       Drizzle 🔴
admin                      ❌     ❌     ❌     ❌       ✅       Drizzle 🔴
admin-transito             ❌     ❌     ❌     ❌       ✅       Drizzle 🔴
rol-servicios              ❌     ❌     ❌     ❌       ✅       Drizzle 🔴
notificaciones             ❌     ❌     ❌     ❌       ✅       Drizzle 🔴
monitorista                ❌     ❌     ❌     ❌       ✅       Raw SQL
```

> \* `auxiliar/actions.ts` usa Drizzle, pero `auxiliar/repository.ts` usa Raw SQL.

### 2.2 Flujo de datos esperado (target)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Server      │     │  Service     │     │  Repository   │     │  PostgreSQL  │
│  Actions     │────▶│  (business   │────▶│  (raw SQL)    │────▶│  (query())   │
│  (use server)│     │   logic)     │     │               │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                    │                      │
       │                    │                      │
       ▼                    ▼                      ▼
   auth/session         types + mappers         catálogos via (query())
   redirects
   revalidatePath
```

---

## 3. Eliminación de Drizzle ORM — Análisis y Plan

### 3.1 ¿Qué es Drizzle ORM en este proyecto?

Actualmente hay **dos instancias de Drizzle**:

| Archivo | Instancia | Uso |
|---------|-----------|-----|
| `lib/db.ts:38` | `export const db = drizzle(pool, { schema })` | Importado por `@/lib/db` |
| `lib/db/index.ts:5` | `export const db = drizzle(pool, { schema })` | Importado por `@/lib/db/index` |

Adicionalmente:
- `lib/db/schema.ts` — define las tablas con sintaxis de Drizzle (`pgTable`, `varchar`, `uuid`, etc.)
- `drizzle/schema.ts` + `drizzle/relations.ts` — copias generadas automáticamente
- `drizzle/` — 5 migraciones históricas generadas con Drizzle Kit

### 3.2 Análisis Costo-Beneficio

#### ✅ Beneficio teórico de tener Drizzle

| Beneficio | ¿Se cumple en el proyecto? |
|-----------|---------------------------|
| **Documentación viva de la BD** — el schema es un solo archivo que describe todas las tablas, columnas, tipos, FKs y constraints. | ❌ **No.** Hay ~44 columnas en BD que no están en el schema (schema drift). El schema es incompleto y engañoso. |
| **Migraciones generadas automáticamente** — Drizzle Kit compara schema vs BD y genera `ALTER TABLE`. | ❌ **No se usa.** Las migraciones se hacen manualmente con SQL directo. Drizzle Kit no se ejecuta en el workflow actual. |
| **Tipado automático** — las queries Drizzle devuelven tipos infalibles. | ❌ **No aplica.** El proyecto usa raw SQL (`query()`) en lugar de Drizzle para consultas. El tipado se hace manualmente con mappers (`rowTo*`). |
| **Seguridad en inserts/updates** — Drizzle valida que los valores coincidan con el schema. | ❌ **No aplica.** Los INSERT/UPDATE se hacen con raw SQL. |

#### 🔴 Costo real de mantener Drizzle

| Costo | Impacto |
|-------|---------|
| **Schema drift masivo** — 44 columnas desincronizadas. El schema dice una cosa, la BD otra. | Alguien que confíe en el schema para entender la BD obtendrá información incorrecta. |
| **Falsa documentación** — el schema sugiere que ciertas columnas existen cuando no, y viceversa. | Pérdida de tiempo en debugging, decisiones erróneas de diseño. |
| **Dos instancias de Drizzle** (`lib/db.ts` y `lib/db/index.ts`) — imports inconsistentes. | 20+ archivos importan de una instancia distinta, generando confusión. |
| **package.json** — dependencias `drizzle-orm`, `drizzle-kit`, `@types/pg` innecesarias. | ~5-10 MB en `node_modules`, complejidad de build. |
| **Costo de sincronización** — cada cambio en BD requiere actualizar manualmente el schema Drizzle. | Si alguien ejecuta Drizzle Kit, regeneraría el schema y **podría borrar columnas** que no conoce (desastre). |
| **Falsa sensación de seguridad** — el equipo cree tener documentación, pero está desactualizada. | Se toman decisiones basadas en información incorrecta. |

#### Veredicto

> **Eliminar Drizzle ORM.** El schema no refleja la realidad, no se usa para consultas, y su mantenimiento genera más problemas de los que resuelve. La documentación real de la BD debe vivir en un archivo markdown (`docs/ESQUEMA-BD.md`) generado desde `information_schema`, que es la única fuente de verdad.

### 3.3 Orden de Eliminación

Cada paso depende del anterior. No se puede saltar al paso 5 sin haber completado los pasos 1-4, porque el proyecto no compilaría.

```
Paso 0 ─── PREPARACIÓN: Migrar todo el código que usa Drizzle a raw SQL
            (Este paso está detallado en las secciones por rol de este documento)
            ──────────────────────────────────────────────────────
            4   → Rol: Oficial de Campo    (ya está en raw SQL)
            5   → Rol: Monitorista/Operador C4  (actions.ts, audit.ts, folio.ts, 7 API routes)
            6   → Rol: Prevención          (actions.ts, 12 API routes)
            7   → Rol: Admin/Admin-Transito     (actions.ts, API routes)
            8   → Rol: Servicios           (actions.ts, catalogos-actions.ts)
            10  → Rol: Auxiliar            (actions.ts)
            ──────────────────────────────────────────────────────
            Una vez que NINGÚN archivo en el proyecto importe de:
              • drizzle-orm
              • @/lib/db/index
              • @/lib/db/schema
            Se procede con los pasos físicos:

Paso 1 ─── Limpiar lib/db.ts
  1.1  Eliminar: `import { drizzle } from 'drizzle-orm/node-postgres'`
  1.2  Eliminar: `import * as schema from './db/schema'`
  1.3  Eliminar: `export const db = drizzle(pool, { schema })`
   →    lib/db.ts queda solo como exportador de pool y query()

Paso 2 ─── Eliminar archivos Drizzle
  2.1  Eliminar: `lib/db/index.ts`     (instancia duplicada)
  2.2  Eliminar: `lib/db/schema.ts`    (definiciones de tablas Drizzle)
  2.3  Eliminar: `drizzle/schema.ts`   (generado)
  2.4  Eliminar: `drizzle/relations.ts` (generado)
  2.5  Eliminar: `drizzle/` completo   (migraciones históricas, ya aplicadas en BD)
  2.6  Eliminar: `drizzle.config.ts`   (configuración de Drizzle Kit)

Paso 3 ─── Limpiar package.json
  3.1  Eliminar dependencia: `drizzle-orm`
  3.2  Eliminar dependencia: `drizzle-kit`
  3.3  Eliminar dependencia: `@types/pg` (si ya no se necesita)
  3.4  Ejecutar: `npm uninstall drizzle-orm drizzle-kit`

Paso 4 ─── Documentar la BD real
  4.1  Generar esquema real desde information_schema:
       ```
       SELECT table_name, column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_schema = 'public'
       ORDER BY table_name, ordinal_position;
       ```
  4.2  Crear `docs/ESQUEMA-BD.md` con la documentación real
  4.3  Mantener este archivo como fuente de verdad (actualizar manualmente con cada cambio)

Paso 5 ─── Verificación
  5.1  `grep -r "drizzle-orm" . --include="*.ts" --include="*.tsx"` → 0 resultados
  5.2  `grep -r "from '@/lib/db/index'" . --include="*.ts" --include="*.tsx"` → 0 resultados
  5.3  `grep -r "from '@/lib/db/schema'" . --include="*.ts" --include="*.tsx"` → 0 resultados
  5.4  `npm run build` → exit 0
  5.5  Probar: crear incidente, crear reporte campo, crear medida protección
```

### 3.4 Fases del Paso 0 (Migración de Código)

La migración de cada módulo debe seguir este patrón:

```
Ejemplo: migrar lib/incidentes/actions.ts

ANTES (Drizzle):
  import { db } from '@/lib/db/index'
  import { incidentes } from '@/lib/db/schema'
  import { eq } from 'drizzle-orm'
  await db.insert(incidentes).values({ folio, ... })

DESPUÉS (Raw SQL):
  import { query } from '@/lib/db'
  await query(
    `INSERT INTO incidentes (folio, ...) VALUES ($1, ...) RETURNING id`,
    [folio, ...]
  )
```

| Módulo | Archivos | Esfuerzo | Depende de |
|--------|----------|----------|------------|
| `rol-servicios` | actions.ts, catalogos-actions.ts | 🟢 Bajo (solo INSERT/UPDATE/DELETE simples) | Nada |
| `admin` | actions.ts | 🟢 Bajo (solo INSERT/UPDATE/DELETE simples) | Nada |
| `admin-transito` | actions.ts | 🟢 Bajo | Nada |
| `auxiliar` | actions.ts | 🟢 Bajo (~5 líneas) | Nada |
| `notificaciones` | actions.ts, checker.ts | 🟡 Medio (incluye lógica de fechas) | Nada |
| `incidentes` | actions.ts, audit.ts, folio.ts, 7 API routes | 🔴 Alto (lógica compleja, transacciones) | Nada |
| `prevencion` | actions.ts, 12 API routes | 🔴 Alto (muchos archivos) | Nada |

> **Estrategia recomendada:** Atacar los módulos pequeños primero (`rol-servicios`, `admin`, `admin-transito`, `auxiliar`, `notificaciones`) para ganar práctica, luego los grandes (`incidentes`, `prevencion`).

---

## 4. Rol: Oficial de Campo

> **Nota sobre Drizzle:** Este módulo ya usa 100% raw SQL. No requiere migración de Drizzle.

### 4.1 Correcciones en BD

| # | Acción | SQL / Detalle | Estado |
|---|--------|---------------|--------|
| 1 | ~~Eliminar columna `ofi_reportes_campo.ofi_oficial_nombre`~~ | ~~Ya no existe en BD. El nombre se obtiene por JOIN a `ofi_oficiales` + `users` vía `ofi_oficial_id`.~~ | ✅ **Ya corregido en BD** |
| 2 | ~~Eliminar columnas `ofi_oficiales.ofi_nombre`, `ofi_ap_paterno`, `ofi_ap_materno`~~ | ~~Ya no existen en BD. `ofi_oficiales` ahora solo tiene `user_id`, `no_nomina`, `numero_empleado`, `telefono`, `patrulla_id`, `departamento_id`.~~ | ✅ **Ya corregido en BD** |
| 3 | **Agregar FK explícita** `ofi_reportes_campo.ofi_oficial_id → ofi_oficiales.id` | Ya existe en BD (relación implícita), verificar y declarar formalmente si no existe. | 🔍 Verificar |
| 4 | **Normalizar JSONB → tablas** (7 campos en `ofi_reportes_campo` + 4 en `ofi_reporte_denuncia`) | Evaluar si las tablas ya existentes (`ofi_detalles_asegurados`, `ofi_puesta_disposicion`, `ofi_fichas_inteligencia`) reemplazan parte del JSONB. Donde no exista tabla, crearla. | 🟡 Pendiente |
| 5 | **Agregar FKs en `ofi_reporte_denuncia`** | 6 columnas varchar con nombres: `policia_a_cargo`, `policia_denuncia`, `policia_firma_d1`, `policia_ingresa_cu`, `nomina_mando`, `capturado_por`. Reemplazar por FKs a `ofi_oficiales.id` o `users.id`. | 🔴 Alta |
| 6 | **Agregar FK** `ofi_reporte_denuncia.monitorista_fechas_requeridas` | Campo JSONB que cronometra fechas de monitorista. Evaluar si debe ser tabla separada. | 🟡 Media |
| 7 | ~~Sincronizar schema Drizzle~~ | **Ya no aplica** — Drizzle será eliminado. La documentación pasará a `docs/ESQUEMA-BD.md`. | ❌ No aplica |

### 4.2 Correcciones en Código

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `lib/oficial/types.ts` | Eliminar referencias a `ofi_oficial_nombre` (ya no existe en BD). Agregar interfaces para `ofi_reporte_denuncia` y sus relaciones, y para tablas OFI existentes (`ofi_detalles_asegurados`, `ofi_puesta_disposicion`, `ofi_fichas_inteligencia`). |
| 2 | `lib/oficial/mapper.ts` | Eliminar mapeo de `ofi_oficial_nombre`. Agregar mappers para `ofi_reporte_denuncia`. |
| 3 | `lib/oficial/repository.ts` | En `obtenerReporteDetalle`: cambiar `r.*` por columnas explícitas. Reemplazar subquery repetido `(SELECT id FROM ofi_oficiales WHERE user_id = $1)` por JOIN directo. Unificar 4 catálogos en 1 función genérica. **Agregar queries para `ofi_reporte_denuncia` y las nuevas tablas OFI.** |
| 4 | `lib/oficial/actions.ts` | Mover rutas hardcodeadas (`/denuncia/nuevo`, `/oficial/reportes/${id}/fotos`, etc.) a constantes. |
| 5 | `lib/oficial/store.ts` | Eliminar defaults hardcodeados (`'FISCALIA'`, `'S/C'`, `'0'`). Usar constantes. |

### 4.3 Plan de Fix (ordenado)

> **Nota:** `ofi_oficial_nombre`, `ofi_nombre`, `ofi_ap_paterno`, `ofi_ap_materno` **ya fueron eliminados de BD** ✅. No requieren acción.

```
Fase 1 ─── Normalizar JSONB restante
  1.1  Evaluar tablas existentes (ofi_detalles_asegurados, ofi_puesta_disposicion,
       ofi_fichas_inteligencia) vs JSONB en ofi_reportes_campo
  1.2  Crear tablas faltantes (donde no existan aún)
  1.3  Migrar datos existentes
  1.4  Eliminar columnas JSONB de ofi_reportes_campo

Fase 2 ─── Refactor ofi_reporte_denuncia
  2.1  Reemplazar 6 columnas varchar de nombres por FKs a ofi_oficiales / users
  2.2  Migrar datos existentes
  2.3  Agregar relaciones en código

Fase 3 ─── Refactor repository
  3.1  Eliminar subquery repetido, usar JOIN
  3.2  Cambiar SELECT * por columnas explícitas
  3.3  Unificar queries de catálogos
  3.4  Agregar queries para ofi_reporte_denuncia y nuevas tablas

Fase 4 ─── Actualizar tipos/mappers/store
  4.1  Interfaces, mappers para tablas existentes
  4.2  Store (defaults a constantes)
```

----

## 5. Rol: Monitorista / Operador C4

**Módulos:** `lib/incidentes/` + `lib/monitorista/`
**Estado actual:** `incidentes` 3/5 ❌ (usa Drizzle) | `monitorista` 2/5 ❌ (sin types/mapper)

### 5.1 Correcciones en BD

| # | Acción | SQL / Detalle | Estado |
|---|--------|---------------|--------|
| 1 | **Eliminar columna** `solicitudes_evidencia.solicitado_nombre` | `ALTER TABLE solicitudes_evidencia DROP COLUMN solicitado_nombre;` — es duplicado de `users.name + apellido` vía FK `solicitado_por`. | 🟡 Pendiente |
| 2 | **Eliminar columna** `solicitudes_evidencia.folio_incidente` | `ALTER TABLE solicitudes_evidencia DROP COLUMN folio_incidente;` — es duplicado de `incidentes.folio` vía FK `incidente_id`. | 🟡 Pendiente |
| 3 | **Agregar FK** `incidentes.nombre_oficial → ofi_oficiales.id` | Crear columna `oficial_id`, migrar datos con JOIN por nombre, luego eliminar `nombre_oficial`. | 🔴 Nueva |
| 4 | **Agregar FK** `incidente_despacho_elementos → ofi_oficiales.id` | Nueva columna `elemento_id`, migrar datos, eliminar `elemento_nombre` varchar. | 🔴 Nueva |
| 5 | **Agregar FK** `incidente_reporte_campo.policia_a_cargo → users.id` | Similar. | 🟡 Media |
| 6 | **Agregar FK** `incidente_reporte_campo.personal_ingreso_ci → users.id` | Similar. | 🟡 Media |
| 7 | **Normalizar JSONB** en `incidente_reporte_campo` | Crear tablas para `vehiculos`, `ordenes_aprehension`, `hidrocarburos`, `armas_fuego`, `drogas`. Migrar datos. | 🟡 Media |
| 8 | **Agregar FK** `incidentes_camara.registrado_por → users.id` y `incidentes_camara.turno → cat_turnos.id` | Columnas varchar existentes. Reemplazar por FKs. | 🟡 Media |
| 9 | **Agregar FK** `solicitudes_detenido.solicitado_por → users.id` | Varchar existente. Reemplazar por FK. | 🟡 Media |
| 10 | **Actualizar CHECK constraint** `monitorista_historial.accion` | Agregar: `'campo_editado'`, `'ppt_generado'`, `'incidente_creado'`, `'incidente_editado'`. | 🟢 Baja |
| 11 | **Eliminar columnas muertas** `incidente_reporte_campo.vehiculos_recuperados`, `tipo_vehiculo`, `destino_vehiculo` | Nunca se escriben. | 🟢 Baja |
| 12 | ~~Sincronizar schema Drizzle~~ | **Ya no aplica** — Drizzle será eliminado. | ❌ No aplica |
| 13 | **Race condition — folio de incidentes** | Usar secuencia BD o `SELECT COALESCE(MAX(folio_consecutivo), 0) + 1 ... FOR UPDATE` en vez de COUNT + 1. | 🔴 Crítica |

### 5.2 Correcciones en Código

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `lib/incidentes/actions.ts` | **Migrar TODO de Drizzle ORM → raw SQL.** Eliminar `import { db } from '@/lib/db/index'`. |
| 2 | `lib/incidentes/folio.ts` | Migrar a raw SQL + FOR UPDATE. |
| 3 | `lib/incidentes/audit.ts` | Migrar a raw SQL + transacciones (no fire-and-forget `.catch()`). |
| 4 | `app/api/incidentes/**/*.ts` (7 archivos) | Migrar Drizzle → raw SQL. Centralizar auth boilerplate en `requireSessionApi()`. Agregar paginación. |
| 5 | `lib/incidentes/permisos.ts` | Unificar `ROLES_PERMITIDOS` (duplicado en actions.ts y permisos.ts). |
| 6 | `lib/incidentes/actions.ts` | Unificar `createIncidente` e `insertarIncidente` (~40 líneas duplicadas). |
| 7 | `lib/incidentes/actions.ts` | Agregar try-catch a los 8 `JSON.parse` sin manejo de errores. |
| 8 | `lib/incidentes/actions.ts` | Eliminar `@ts-expect-error` en línea 139. |
| 9 | `lib/monitorista/actions.ts` | Agregar `requireMonitorista()` en `solicitarEvidencia`. |
| 10 | `lib/monitorista/detenido-service.ts` | Eliminar inyección SQL: `SET ${campo} = $1` → `SET modus_operandi = CASE WHEN $1 THEN ...` o prepared statements. |
| 11 | `lib/monitorista/detenido-service.ts` | Eliminar N+1: unificar query de fotos con JOIN lateral o subquery. |
| 12 | `lib/monitorista/ppt-service.ts` | Eliminar N+1 en evidencias. |
| 13 | `lib/monitorista/denuncia-service.ts` | Eliminar fragile UUID encoding (`solicitudIdToUuid`). Usar UUID real con secuencia separada. |
| 14 | `lib/monitorista/ppt-service.ts` | Eliminar `parseDetenidos()` duplicado — importar desde shared. |
| 15 | `lib/monitorista/*` | Centralizar patrón "upload expediente → INSERT evidencia → INSERT historial" (4 lugares). |
| 16 | `lib/monitorista/detenido-service.ts` | Eliminar filtro legacy `ofi_detenidos::text NOT IN ('[]', '1')` — limpiar datos corruptos primero. |

### 5.3 Plan de Fix (ordenado)

```
Fase 1 ─── Seguridad (urgente)
  1.1  Corregir inyección SQL en detenido-service.ts
  1.2  Agregar try-catch a JSON.parse
  1.3  Agregar requireMonitorista() en solicitarEvidencia

Fase 2 ─── Drizzle → Raw SQL (Paso 0 del plan de eliminación de Drizzle)
  2.1  Migrar folio.ts y audit.ts
  2.2  Migrar lib/incidentes/actions.ts
  2.3  Migrar las 7 API routes de incidentes
  2.4  Centralizar auth boilerplate

Fase 3 ─── N+1 queries
  3.1  Unificar query de fotos en detenido-service.ts
  3.2  Unificar query de evidencias en ppt-service.ts

Fase 4 ─── Refactor arquitectura
  4.1  Unificar createIncidente / insertarIncidente
  4.2  Centralizar pattern de upload
  4.3  Eliminar UUID encoding

Fase 5 ─── BD migrations
  5.1  Agregar FKs (oficial_id, elemento_id, policia_cargo, etc.)
  5.2  Eliminar columnas duplicadas
  5.3  Normalizar JSONB
  5.4  Actualizar CHECK constraint
  5.5  Corregir race condition en folio
```

---

## 6. Rol: Prevención

**Módulo:** `lib/prevencion/`
**Estado actual:** 2/5 ❌ (sin types, mapper, repository — solo actions con Drizzle)

### 6.1 Correcciones en BD

| # | Acción | SQL / Detalle | Estado |
|---|--------|---------------|--------|
| 1 | **Agregar FK** `medidas_proteccion.autoridad → cat_dependencias.id` | Nueva columna `autoridad_id`. También `nombre_autoridad` varchar existente. | 🟡 Media |
| 2 | **Agregar FK** `solicitudes_informacion.autoridad → cat_dependencias.id` | Nueva columna `autoridad_id`. | 🟡 Media |
| 3 | **Agregar FK** `medidas_proteccion.persona_recepciona → users.id` | Nueva columna `persona_recepciona_id`. | 🟡 Media |
| 4 | **Agregar FK** `fichas_busqueda.rt_atiende → users.id`, `elemento_novedades → users.id`, `fiscal_cancela → users.id` | Si esas personas son usuarios del sistema. | 🟡 Media |
| 5 | **Agregar FK** `solicitudes_informacion.fiscal_solicita → users.id` | | 🟡 Media |
| 6 | **Agregar FK** `seguimientos_busqueda.registrado_por → users.id` | Varchar existente. | 🟡 Media |
| 7 | **Agregar FK** `visitas_domiciliarias.registrado_por → users.id` | Varchar existente. | 🟡 Media |
| 8 | **Agregar FK** `contestaciones.nombre_quien_recibio → users.id` | Varchar existente. | 🟡 Media |
| 9 | **Agregar FK** `medida_autoridades_adicionales.autoridad → cat_dependencias.id` | Varchar existente. | 🟡 Media |
| 10 | **Agregar catálogos** | `cat_delitos`, `cat_tipos_medida`, `cat_status_prevencion`, `cat_tipos_apercibimiento` — para reemplazar varchar free-text. | 🟡 Media |
| 11 | **Migrar tipo** `visitas_domiciliarias.hora_visita` | De `varchar(10)` a `time`. | 🟢 Baja |

### 6.2 Correcciones en Código

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `lib/prevencion/actions.ts` | **Migrar TODO de Drizzle ORM → raw SQL.** |
| 2 | `app/api/prevencion/**/*.ts` (12 archivos) | Migrar Drizzle → raw SQL. **Agregar `creadoPor`/`registradoPor` en todos los CREATE** (actualmente se omiten). |
| 3 | `lib/prevencion/actions.ts:155` | Validar `parseInt(edadRaw)` que no retorne NaN. |
| 4 | `lib/prevencion/permisos.ts` | Eliminar `ROLES_PERMITIDOS` hardcodeados. Usar `core.tienePermiso()`. |
| 5 | `lib/prevencion/actions.ts` | Centralizar file upload (duplicado en `createProrroga` y `createSeguimiento`). |
| 6 | `lib/prevencion/permisos.ts` | Eliminar delegaciones boilerplate → `export { ... } from '@/lib/permisos/core'`. |

### 6.3 Decisión Arquitectura

| Opción | Recomendación |
|--------|---------------|
| Eliminar API routes (dejar solo Server Actions) | ✅ **Sí**. Las Server Actions ya existen, las API routes duplican lógica y además omiten campos de auditoría. |
| Mantener ambas sincronizadas | ❌ Costo de mantenimiento duplicado sin beneficio. |

### 6.4 Plan de Fix (ordenado)

```
Fase 1 ─── Drizzle → Raw SQL (Paso 0 del plan de eliminación de Drizzle)
  1.1  Migrar lib/prevencion/actions.ts
  1.2  Migrar 12 API routes (o eliminarlas)
  1.3  Agregar creadoPor en todos los CREATE

Fase 2 ─── BD migrations
  2.1  Agregar FKs a cat_dependencias y users
  2.2  Crear catálogos faltantes (cat_delitos, etc.)
  2.3  Migrar tipos (hora_visita → time)

Fase 3 ─── Refactor
  3.1  Centralizar file upload
  3.2  Simplificar permisos.ts
  3.3  Validar entrada de formularios
```

---

## 7. Rol: Administrador / Admin-Transito

**Módulos:** `lib/admin/` + `lib/admin-transito/`
**Estado actual:** 1/5 ❌ (solo actions, sin capas), Drizzle 🔴

### 7.1 Correcciones en BD

| # | Acción | SQL / Detalle | Estado |
|---|--------|---------------|--------|
| 1 | ~~Eliminar columnas muertas `ofi_oficiales.ofi_nombre`, `ofi_ap_paterno`, `ofi_ap_materno`~~ | ~~Nunca se escriben desde admin-transito.~~ | ✅ **Ya corregido en BD** — estas columnas no existen en la BD real. |
| 2 | ~~Agregar columnas al schema Drizzle~~ | **Ya no aplica** — Drizzle será eliminado. Las columnas se documentarán en `docs/ESQUEMA-BD.md`. | ❌ No aplica |

### 7.2 Correcciones en Código

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `lib/admin/actions.ts` | Migrar `db.update`, `db.delete`, `db.select` → raw SQL. |
| 2 | `lib/admin-transito/actions.ts` | Migrar Drizzle → raw SQL. |
| 3 | `lib/admin-transito/actions.ts:165,299` | Reemplazar `rolId: 39` con `SELECT id FROM roles WHERE nombre = 'Inhabilitado'`. |
| 4 | `app/api/admin/roles/route.ts:51` | **ELIMINAR** `console.log("DATABASE_URL =", process.env.DATABASE_URL)`. |
| 5 | `app/api/admin/roles/route.ts` | Migrar Drizzle → raw SQL. Eliminar casts `as any`. |

### 7.3 Plan de Fix

```
1.  ELIMINAR console.log(DATABASE_URL) — URGENTE (filtra credenciales)
2.  Migrar Drizzle → raw SQL en admin, admin-transito, API routes (Paso 0)
3.  Reemplazar rolId hardcodeado con query dinámica
```

---

## 8. Rol: Servicios

**Módulo:** `lib/rol-servicios/`
**Estado actual:** 2/5 ❌, Drizzle 🔴

### 8.1 Correcciones en BD

| # | Acción | Detalle | Estado |
|---|--------|---------|--------|
| 1 | **Agregar FK** `roles_servicio.turno → cat_turnos.id` | Nueva columna `turno_id`. | 🟡 Media |
| 2 | **Agregar FK** `roles_servicio.responsable_turno → users.id` | Actualmente varchar. También `firmado_por` varchar. | 🟡 Media |
| 3 | **Agregar FK** `rol_asignaciones.elemento_nombre → ofi_oficiales.id` | Nueva columna `elemento_id`. También `elemento_nomina` como varchar duplicado. | 🟡 Media |
| 4 | **Agregar FK** `rol_asignaciones.unidad_placa → v2_patrullas.id` (via) | Actualmente varchar duplicado. | 🟡 Media |
| 5 | **Agregar catálogo** `cat_secciones` | Para reemplazar `seccion` varchar free-text en `rol_asignaciones`. | 🟢 Baja |

### 8.2 Correcciones en Código

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `lib/rol-servicios/actions.ts` | Migrar Drizzle → raw SQL. |
| 2 | `lib/rol-servicios/catalogos-actions.ts` | Migrar Drizzle → raw SQL. |
| 3 | `lib/rol-servicios/catalogos-actions.ts` | Unificar **7 funciones `toggle*()`** idénticas en una función genérica `toggleCatalogo(tabla, revalidatePath)`. |

### 8.3 Plan de Fix

```
1.  Migrar Drizzle → raw SQL (Paso 0)
2.  Unificar toggle functions
3.  BD migrations para FKs y nuevos catálogos
```

---

## 9. Roles: Agentes y Fiscalía

**Módulos:** `lib/agente_infracciones/`, `lib/agente_juzgado/`, `lib/agente_liberaciones/`, `lib/fiscalia/`
**Estado actual:** 5/5 capas ✅, Raw SQL ✅

> **Nota sobre Drizzle:** Estos módulos ya usan 100% raw SQL. No requieren migración.

### 9.1 Correcciones

| # | Acción | Detalle |
|---|--------|---------|
| 1 | **Eliminar duplicado** `obtenerRolUsuario()` | Está en 4 repositorios. Mover a `@/lib/shared/`. |
| 2 | **Eliminar duplicado** `rowToLiberacion()` | Idéntico en `agente_infracciones` y `agente_liberaciones`. Mover a shared. |
| 3 | **Centralizar tipos** `LiberacionRow`, `UserInfo`, `RolRow` | Definir una vez en `@/lib/shared/types.ts`. |
| 4 | **Completar cross-import** | `agente_juzgado` ya importa de `fiscalia/types` — replicar patrón en los demás. |

### 9.2 Plan de Fix

```
1.  Crear @/lib/shared/ con tipos, helpers, y queries comunes
2.  Migrar obtenerRolUsuario() a shared
3.  Migrar rowToLiberacion() a shared
4.  Refactor imports en los 4 módulos
```

---

## 10. Rol: Auxiliar de Novedades

**Módulos:** `lib/auxiliar/` + tabla `auxiliar_checklist`
**Estado actual:** 5/5 capas ✅, DB Access: Mixto (actions Drizzle, repo Raw SQL)

### 10.1 Correcciones en BD

| # | Acción | SQL / Detalle | Estado |
|---|--------|---------------|--------|
| 1 | **Agregar FK** `auxiliar_checklist.capturado_por → users.id` | Varchar existente. Reemplazar por FK. | 🟡 Media |
| 2 | **Documentar tabla** `auxiliar_checklist` | Tabla que no existe en código Drizzle. Tiene 17 columnas con checklist de verificación vinculado a `reporte_campo_id` y `reporte_d1_id`. Crear types/mappers/repo. | 🔴 Alta |
| 3 | **Agregar FKs** `auxiliar_checklist.reporte_campo_id → ofi_reportes_campo.id` y `reporte_d1_id → ofi_reporte_denuncia.id` | Verificar que existan formalmente. | 🔍 Verificar |

### 10.2 Correcciones en Código

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `lib/auxiliar/actions.ts` | Migrar las ~5 líneas de Drizzle (`db.insert`, `db.select`) a raw SQL. |
| 2 | `lib/auxiliar/types.ts` | Agregar interfaces para `auxiliar_checklist` y sus relaciones. |
| 3 | `lib/auxiliar/repository.ts` | Agregar queries CRUD para `auxiliar_checklist`. |

### 10.3 Plan de Fix: Migrar actions.ts a raw SQL (Paso 0 del plan de eliminación de Drizzle). Documentar e integrar `auxiliar_checklist`.

---

## 11. Módulos con Capas Incompletas

| Módulo | Estado | Acción Requerida |
|--------|--------|------------------|
| `corralon` | 4/5 (falta mapper) | Extraer `rowToSolicitud()` de `service.ts` a `mapper.ts` |
| `flota` | 3/5 (falta mapper, actions) | Crear `mapper.ts` y `actions.ts` |
| `camara` | 2/5 (solo repo+service) | Crear `types.ts`, `mapper.ts` |
| `d1` | 2/5 (solo repo+service) | Crear `types.ts`, `mapper.ts` |
| `reportes-incidentes` | 2/5 | Crear `types.ts`, `mapper.ts` |
| `reportes-operativos` | 2/5 | Crear `types.ts`, `mapper.ts` |
| `reportes-sin-d1` | 2/5 | Crear `types.ts`, `mapper.ts` |
| `reportes-sin-novedad` | 2/5 | Crear `types.ts`, `mapper.ts` |

### Plan de Fix

```
1.  Identificar interfaces de datos en cada módulo (revisar service.ts)
2.  Crear types.ts con interfaces
3.  Crear mapper.ts con rowTo* functions
4.  Refactor repository/service para usar mappers
```

---

### 11.1 Tablas Huérfanas / Sin Dueño Claro

Las siguientes tablas existen en BD pero no tienen un módulo de código correspondiente. Requieren análisis para determinar su integración:

| Tabla | Schema | Posible Dueño | Acción |
|-------|--------|---------------|--------|
| `fichas_inteligencia_detenidos` | public | Oficial / Monitorista | **Evaluar si duplica a `ofi_fichas_inteligencia`.** Ambas tienen campos similares (foto_frontal_url, foto_objetos_url, escolaridad, etc.). Consolidar o eliminar. |
| `via.roles_permisos` | via | Admin-Transito | Esquema separado con su propio sistema de permisos. Documentar. |
| `via.sectores` | via | Admin-Transito | Catálogo de sectores Vía. Documentar. |
| `via.usuarios` | via | Admin-Transito | Usuarios del sistema Vía (independiente de `public.users`). |
| `via.v2_*` (7 tablas) | via | Agentes Vía | Subsistema completo de vialidad: infracciones, grúas, patrullas, liberaciones, permisos. Usa `query()` del pool principal (datos migrados de `via_prueba`). |

> **Decisión:** Las tablas `via.*` no requieren migración — son un subsistema independiente con su propia conexión a BD. Solo documentar en `docs/ESQUEMA-BD.md`.

---

## 12. Correcciones Transversales

### 12.1 Drizzle ORM → Raw SQL (por prioridad)

> Este es el **Paso 0** del plan de eliminación de Drizzle (ver [Sección 3.4](#34-fases-del-paso-0-migración-de-código)).

| Módulo | Archivos | Prioridad |
|--------|----------|-----------|
| `incidentes` | actions.ts, audit.ts, folio.ts, 7 API routes | 🔴 Alta |
| `prevencion` | actions.ts, 12 API routes | 🔴 Alta |
| `rol-servicios` | actions.ts, catalogos-actions.ts | 🟡 Media |
| `admin` | actions.ts | 🟡 Media |
| `admin-transito` | actions.ts | 🟡 Media |
| `auxiliar` | actions.ts | 🟢 Baja |
| `notificaciones` | actions.ts, checker.ts | 🟢 Baja |

### 12.2 Eliminar Instancia Duplicada de Drizzle

`lib/db/index.ts` es una copia exacta de `lib/db.ts`. Ambas crean `drizzle(pool, { schema })`.

> **Nota:** Esta acción se ejecutará en el **Paso 2** del plan de eliminación, una vez que ningún archivo importe de `@/lib/db/index`.

### 12.3 Centralizar Helpers Compartidos

Crear `@/lib/shared/` con:

```
lib/shared/
├── index.ts            # Re-exportaciones
├── types.ts            # Tipos compartidos (UserInfo, RolRow, LiberacionRow)
├── db.ts               # obtenerRolUsuario(userId), requireAdmin()
├── mapper.ts           # rowToLiberacion(), parseDetenidos()
├── upload.ts           # uploadArchivo(buffer, nombre, folio, categoria)
├── auth.ts             # requireSessionApi() (para API routes)
├── form.ts             # str(formData, key), num(formData, key)
├── errors.ts           # isDuplicateKeyError(err)
└── catalogo.ts         # toggleCatalogo(table, revalidatePath)
```

| Helper | Reemplaza duplicados en |
|--------|-------------------------|
| `obtenerRolUsuario(userId)` | agente_infracciones, agente_liberaciones, agente_juzgado, fiscalia |
| `requireAdmin()` | admin, admin-transito, rol-servicios, permisos/core |
| `requireSessionApi()` | incidentes (7 API routes) |
| `parseDetenidos(raw)` | monitorista/detenido-service, ppt-service, fiscalia |
| `uploadArchivo(...)` | monitorista (4 lugares) |
| `isDuplicateKeyError(err)` | monitorista/incidentes-camara (2 rutas) |
| `str(formData, key)` | prevencion, rol-servicios |
| `toggleCatalogo(table, path)` | rol-servicios (7 funciones) |
| `rowToLiberacion(row)` | agente_infracciones, agente_liberaciones |
| `calcularFechaEsperada(hito, fecha)` | prevencion (timeline, notifications checker, alertas API) |

### 12.4 Estándar de Capas para Todos los Módulos

```
lib/<modulo>/
├── types.ts          # Interfaces TypeScript de las entidades
├── mapper.ts         # rowTo* functions (Record<string,unknown> → tipos)
├── repository.ts     # Raw SQL queries (SELECT, INSERT, UPDATE, DELETE)
├── service.ts        # Lógica de negocio, orquestación
├── actions.ts        # Server Actions ('use server'), auth, redirects
└── permisos.ts       # (opcional) Secciones y permisos específicos
```

### 12.5 Buenas Prácticas

| # | Práctica | Descripción |
|---|----------|-------------|
| 1 | **No Drizzle** | Solo raw SQL vía `query()` de `@/lib/db`. |
| 2 | **No nombres duplicados** | Si existe FK, no almacenar el nombre. Usar JOIN. |
| 3 | **Transacciones** | Toda operación multi-paso debe usar `BEGIN/COMMIT/ROLLBACK`. |
| 4 | **No magic strings** | Roles, estatus, rutas → constantes importadas. |
| 5 | **Validación de entrada** | Validar tipos, rangos, sanitizar antes de INSERT. |
| 6 | **No `SELECT *`** | Listar columnas explícitamente. |
| 7 | **Paginación** | Endpoints de listado: offset/limit dinámicos. |
| 8 | **No datos sensibles en logs** | Nunca loggear `DATABASE_URL`, tokens, o contraseñas. |
| 9 | **JSONB solo si es necesario** | No usar JSONB para datos que se relacionan con otras tablas. |
| 10 | **`FOR UPDATE`** | En generación de folios/secuencias para evitar race conditions. |
| 11 | **`import type`** | En mapper/repository, usar `import type` para solo-tipos. |
| 12 | **Server Actions > API Routes** | Preferir Server Actions (más seguro, menos boilerplate). Si se necesita API Route, no duplicar lógica. |
| 13 | **Nombres de archivos y carpetas** | `kebab-case` para carpetas (`agente_infracciones/` ✅). `camelCase` en TypeScript. Consistencia: `repository.ts`, `service.ts`, `actions.ts` (no `repositorio.ts`). |
| 14 | **Módulo = carpeta en `lib/`** | No mezclar lógica en `features/` (duplicado de `lib/`). |
| 15 | **Una responsabilidad por archivo** | Repository solo hace queries. Service solo orquesta negocio. Actions solo maneja request/response, auth, redirects. |

## 13. Resumen de Prioridades

| Prioridad | Tarea | Tiempo Est. | Impacto | Depende de | Rol(es) |
|-----------|-------|-------------|---------|------------|---------|
| 🔴 Crítica | Corregir inyección SQL en `detenido-service.ts` | 1 día | Seguridad | Nada | Monitorista |
| 🔴 Crítica | Eliminar `console.log(DATABASE_URL)` | 1 hora | Seguridad | Nada | Admin |
| 🔴 Crítica | Race condition en folio de incidentes | 1 día | Integridad | Nada | Operador C4 |
| 🔴 Alta | **Paso 0:** Migrar Drizzle → raw SQL en incidentes | 4 días | Arquitectura | Nada | Operador C4 |
| 🔴 Alta | **Paso 0:** Migrar Drizzle → raw SQL en prevención | 4 días | Arquitectura | Nada | Prevención |
| 🔴 Alta | **Integrar `ofi_reporte_denuncia`** (6 FKs de nombres + JSONB) | 3 días | Datos | Nada | Oficial / Monitorista |
| 🔴 Alta | **Analizar/consolidar `fichas_inteligencia_detenidos` vs `ofi_fichas_inteligencia`** | 1 día | Datos | Nada | Oficial |
| 🔴 Alta | **Agregar FKs en incidentes** (`nombre_oficial`, `elemento_nombre`) | 1 día | Integridad | Nada | Operador C4 |
| 🟡 Media | **Paso 0:** Migrar Drizzle → raw SQL en admin, rol-servicios | 3 días | Arquitectura | Nada | Admin / Servicios |
| 🟡 Media | **Paso 0:** Migrar Drizzle → raw SQL en auxiliar, notificaciones | 1 día | Arquitectura | Nada | Auxiliar |
| 🟡 Media | **Pasos 1-3:** Eliminar archivos Drizzle físicos | 1 día | Arquitectura | Paso 0 completo | - |
| 🟡 Media | **Paso 4:** Documentar BD real en `docs/ESQUEMA-BD.md` | 1 día | Documentación | Pasos 1-3 | - |
| 🟡 Media | Eliminar columnas duplicadas restantes en BD | 1 día | Datos | Nada | Todos |
| 🟡 Media | Agregar FKs faltantes (prevención, servicios, auxiliar) | 3 días | Integridad | Nada | Prevención / Servicios |
| 🟡 Media | Normalizar JSONB a tablas | 3 días | Arquitectura | Nada | Oficial / Operador C4 |
| 🟡 Media | Centralizar helpers compartidos (`@/lib/shared/`) | 2 días | Mantenibilidad | Nada | Todos |
| 🟡 Media | Eliminar API routes redundantes (prevencion, incidentes) | 2 días | Simplificación | Paso 0 | Prevención / Operador C4 |
| 🟡 Media | Documentar esquema `via` en `docs/ESQUEMA-BD.md` | 1 día | Documentación | Nada | Admin-Transito |
| 🟢 Baja | Completar capas faltantes (8 módulos) | 5 días | Arquitectura | Nada | Todos |
| 🟢 Baja | Reemplazar `capturado_por` varchar en formato_n_* por FK | 1 día | Datos | Nada | Varios |
| 🟢 Baja | Actualizar CHECK constraint monitorista_historial | 1 hora | Datos | Nada | Monitorista |

### Estimación total

| Fase | Tiempo | % Proyecto |
|------|--------|------------|
| 🔴 Crítica (seguridad + integridad) | 3 días | 9% |
| 🔴 Alta (Paso 0 + integración ofi_reporte_denuncia + FKs incidentes) | 13 días | 35% |
| 🟡 Media (BD + refactor + eliminar Drizzle + shared) | 14 días | 38% |
| 🟢 Baja (capas + limpieza) | 7 días | 19% |
| **Total** | **~37 días hábiles** | |

## Apéndice A: Migraciones BD — Resumen de Cambios por Tabla

> ✅ = Ya corregido en BD | 🔴 = Pendiente (alta prioridad) | 🟡 = Pendiente (media) | 🟢 = Pendiente (baja)

| Tabla | Cambios | Estado |
|-------|---------|--------|
| `ofi_reportes_campo` | ~~Eliminar `ofi_oficial_nombre`~~, Normalizar 7 JSONB a tablas (algunas ya existen) | ✅ / 🟡 |
| `ofi_oficiales` | ~~Eliminar `ofi_nombre`, `ofi_ap_paterno`, `ofi_ap_materno`~~ | ✅ **Hecho** |
| `ofi_reporte_denuncia` | Reemplazar 6 varchars de nombres por FKs (`policia_a_cargo`, `policia_denuncia`, `policia_firma_d1`, `policia_ingresa_cu`, `nomina_mando`, `capturado_por`). Evaluar JSONB `monitorista_fechas_requeridas`. | 🔴 |
| `solicitudes_evidencia` | Eliminar `solicitado_nombre`, `folio_incidente` | 🟡 |
| `incidentes` | Reemplazar `nombre_oficial` por FK `oficial_id → users.id` | 🔴 |
| `incidente_despacho_elementos` | Reemplazar `elemento_nombre` por FK `elemento_id → ofi_oficiales.id` | 🔴 |
| `incidente_reporte_campo` | Eliminar `vehiculos_recuperados`, `tipo_vehiculo`, `destino_vehiculo`. Normalizar 7 JSONB. Reemplazar `policia_a_cargo`, `personal_ingreso_ci` por FKs. | 🟡 |
| `incidentes_camara` | Reemplazar `registrado_por → users.id`, `turno → cat_turnos.id` | 🟡 |
| `solicitudes_detenido` | Reemplazar `solicitado_por → users.id` | 🟡 |
| `medidas_proteccion` | Reemplazar `autoridad → cat_dependencias.id`, `persona_recepciona → users.id`, `nombre_autoridad → opcional` | 🟡 |
| `medida_autoridades_adicionales` | Reemplazar `autoridad → cat_dependencias.id` | 🟡 |
| `fichas_busqueda` | Reemplazar `rt_atiende`, `elemento_novedades`, `fiscal_cancela` por FKs a `users.id` | 🟡 |
| `seguimientos_busqueda` | Reemplazar `registrado_por → users.id` | 🟡 |
| `solicitudes_informacion` | Reemplazar `autoridad → cat_dependencias.id`, `fiscal_solicita → users.id` | 🟡 |
| `contestaciones` | Reemplazar `nombre_quien_recibio → users.id` | 🟡 |
| `visitas_domiciliarias` | Reemplazar `registrado_por → users.id`. Migrar `hora_visita` de varchar a time. | 🟡 |
| `roles_servicio` | Reemplazar `turno → cat_turnos.id`, `responsable_turno → users.id`, `firmado_por → users.id` | 🟡 |
| `rol_asignaciones` | Reemplazar `elemento_nombre`, `elemento_nomina` por FK `elemento_id → ofi_oficiales.id`. Reemplazar `unidad_placa → v2_patrullas.id`. | 🟡 |
| `auxiliar_checklist` | Reemplazar `capturado_por → users.id`. Verificar FKs a `ofi_reportes_campo` y `ofi_reporte_denuncia`. | 🟡 |
| `formato_n_*` (7 tablas) | `capturado_por` como varchar en todas. Evaluar si debe ser FK a `users.id`. | 🟢 |
| `fichas_inteligencia_detenidos` | **Evaluar si duplica a `ofi_fichas_inteligencia`**. Consolidar si aplica. | 🔴 Alta (análisis) |

## Apéndice B: Nuevos Catálogos a Crear

| Catálogo | Columnas | Reemplaza campo en |
|----------|----------|---------------------|
| `cat_delitos` | id, clave, nombre, activo | `solicitudes_informacion.delito`, `medidas_proteccion.delitos` |
| `cat_tipos_medida` | id, clave, nombre, activo | `medidas_proteccion.tipo_medida` |
| `cat_status_prevencion` | id, clave, nombre, activo | `medidas_proteccion.status`, `fichas_busqueda.status`, `solicitudes_informacion.status` |
| `cat_secciones` | id, clave, nombre, activo | `rol_asignaciones.seccion` |
| `cat_tipos_apercibimiento` | id, clave, nombre, activo | `medidas_proteccion.tipo_apercibimiento` |

---

*Documento generado a partir del análisis de código fuente del proyecto Sentinel SSPM, validado contra el schema real de la BD (vía `information_schema` el 2026-07-08).*
*Para dudas o aclaraciones, contactar al equipo de desarrollo.*
