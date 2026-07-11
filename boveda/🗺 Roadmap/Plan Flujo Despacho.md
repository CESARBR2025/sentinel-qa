# Plan — Flujo Integral 911 → Despacho → Oficial → D1 → Legal

> Plan de implementación del ciclo operativo completo: generación de reporte en 911, derivación a despacho, asignación de unidades/elementos, reporte de campo del oficial (cierre), determinación de detenidos con D1 y activación del flujo legal (Fiscalía/Juzgado), más escalamiento de rondines a despacho.

## Decisiones de negocio (fijadas)

1. **Tabla única de reporte de campo: `ofi_reportes_campo`.** Se le agregan las columnas faltantes para que también cierre solicitudes de despacho. `incidente_reporte_campo` queda **deprecada** (solo lectura para datos históricos; no se escriben filas nuevas).
2. **El oficial que registra el reporte de campo se toma de `ofi_oficiales`** (resuelto vía `ofi_oficiales.user_id` = usuario de sesión). `ofi_reportes_campo.ofi_oficial_id` ya existe.
3. **D1 con cierre permitido**: si hay detenidos, el reporte de campo puede cerrarse sin D1; queda bandera visible "D1 pendiente" en Atendidos hasta que se vincule la denuncia.
4. **Rondín siempre escala a despacho** (sin toggle): todo reporte de rondín crea incidente `sin_despachar` que entra al tablón.

---

## 1. Estado actual (lo que YA existe)

### Ciclo base de incidentes (`lib/incidentes/`)
- Tabla `incidentes` con máquina de estados: `sin_despachar` → `en_despacho` → `atendido`, flag `requiere_despacho`, campo `canal` (ciudadano / whatsapp / rondin).
- `createDespacho` (`lib/incidentes/actions.ts:272`): valida estatus, inserta `incidente_despacho` + `incidente_despacho_unidades` + `incidente_despacho_elementos` en transacción, cambia estatus a `en_despacho`, registra audit.
- Repositorio con `listarIncidentesPendientesDespacho`, `listarIncidentesEnDespacho`, `listarIncidentesAtendidos`, `obtenerUnidadesDeDespacho`, `obtenerElementosDeDespacho`, `listarIncidentesConFiltros` (canal, estatus, desde, hasta, folio).

### Despacho UI (`app/agente_despacho/`, `components/911/despacho/TablonDespacho.tsx`)
- Tablón con 3 tabs: **Pendientes / En Despacho / Atendidos**, con polling en pendientes.

### 911 (`app/agente_911/`, `lib/911/`)
- Canales ciudadano, whatsapp y rondín, cada uno con listado y detalle de incidentes.
- Rondín actual: `createRecorridoCompleto` (`lib/incidentes/actions.ts:205`) crea incidente + reporte de campo **en un solo paso (auto-cerrado, NO pasa por despacho)** — se reemplaza por escalamiento obligatorio.

### Módulo Oficial (`lib/oficial/`, `app/oficial/`)
- `ofi_reportes_campo` (stepper Zustand): detenidos/vehículos/cateo/armas/drogas/hidrocarburos JSONB, `quiere_denuncia`, folios, apoyos operativos, `ofi_oficial_id`.
- `ofi_oficiales`: `user_id` (→ `users`), `no_nomina`, `numero_empleado`, `patrulla_id`, `departamento_id` — **vínculo sesión↔oficial ya resuelto en BD**.
- `quiere_denuncia=true` → genera D1 (`ofi_reporte_denuncia`) vinculada por `reporte_campo_id`; `ofi_reporte_denuncia.incidente_id` ya existe (nullable).
- Flujo legal ya operativo: `ofi_autoridad_recibe='FISCALIA'` → Fiscalía (`estado_tramite`); `'JUZGADO CIVICO'` → Juzgado. Evidencias vía Monitorista. Fotos de detenidos automáticas al haber detenidos.

### Convergencia
`ofi_reportes_campo` ya cubre casi todo lo que `incidente_reporte_campo` hacía, y además genera D1, fotos de detenidos y flujo legal. Solo le falta **el vínculo al incidente** (y 4 columnas menores) para poder cerrar solicitudes de despacho.

---

## 2. Gaps a implementar

1. **911**: formulario de filtros en los listados de incidentes (backend `listarIncidentesConFiltros` ya existe, falta UI).
2. **Despacho**: tab "En Despacho" no muestra unidades/elementos asignados (queries ya existen, falta UI).
3. **`ofi_reportes_campo` sin `incidente_id`**: no puede cerrar solicitudes de despacho.
4. **Vínculo elemento despachado ↔ oficial**: `incidente_despacho_elementos` guarda `elemento_ext_id/nomina/nombre` (RH externo) sin FK a `ofi_oficiales`.
5. **Vista oficial "Mis Despachos"**: no existe; el oficial no ve sus asignaciones ni cierra desde su vista.
6. **Historial generativo**: el reporte de campo no incluye el timeline 911 → despacho → campo.
7. **Bandera "D1 pendiente"**: no existe (cierre con detenidos sin D1 debe quedar señalizado).
8. **Rondín**: hoy se auto-cierra; debe escalar SIEMPRE a despacho.

---

## 3. Cambios en BD (migración única, fase 0)

Todo sobre `ofi_reportes_campo` y el vínculo despacho↔oficial. **No se toca `incidente_reporte_campo`** (queda congelada como legacy).

```sql
-- 3.1 ofi_reportes_campo: columnas faltantes para cerrar despacho
ALTER TABLE ofi_reportes_campo
  ADD COLUMN incidente_id uuid REFERENCES incidentes(id),      -- vínculo a la solicitud; su INSERT dispara el cierre
  ADD COLUMN ofi_entre_calles varchar(255),                    -- ubicación fina (existía en incidente_reporte_campo)
  ADD COLUMN ofi_referencia varchar(255),                      -- referencia de lugar
  ADD COLUMN expediente_ci varchar(100),                       -- expediente / carpeta de investigación
  ADD COLUMN personal_ingreso_ci varchar(255);                 -- personal que ingresa a CI

-- Un solo reporte de cierre por incidente
CREATE UNIQUE INDEX uq_ofi_rc_incidente
  ON ofi_reportes_campo(incidente_id) WHERE incidente_id IS NOT NULL;

-- 3.2 Vincular elemento despachado con oficial del sistema (nullable: elementos sin cuenta)
ALTER TABLE incidente_despacho_elementos
  ADD COLUMN oficial_id uuid REFERENCES ofi_oficiales(id);

CREATE INDEX idx_despacho_elementos_oficial ON incidente_despacho_elementos(oficial_id);

-- 3.3 Trazabilidad de rondín escalado
ALTER TABLE incidentes
  ADD COLUMN origen_rondin boolean DEFAULT false;

CREATE INDEX idx_incidentes_estatus_canal ON incidentes(estatus, canal);
```

Notas:
- `hay_detencion` ≈ `ofi_hay_detencion` (ya existe). `delito_falta` ≈ `delito` + `falta_administrativa` (ya existen). `autoridad_recibe` ≈ `ofi_autoridad_recibe` (ya existe). No se duplican.
- Bandera "D1 pendiente" es **calculada**, no columna: `ofi_hay_detencion=true AND NOT EXISTS (SELECT 1 FROM ofi_reporte_denuncia d WHERE d.reporte_campo_id = rc.id)`.
- Post-migración: `npm run db:schema` para refrescar [[Esquema BD]].

---

## 4. Fases de implementación

### Fase 0 — Migración BD + tipos
- Ejecutar SQL de la sección 3.
- `lib/oficial/types.ts` + mapper: `incidenteId`, `entreCalles`, `referencia`, `expedienteCi`, `personalIngresoCi` en `OfiReporteCampo`.
- `lib/incidentes/types.ts` + mapper: `oficialId` en `DespachoElementoRow`, `origenRondin` en incidente.
- **Verificación**: `npx tsc --noEmit` + `npm run build`.

### Fase 1 — Formulario de filtros en 911
- Nuevo componente cliente `components/911/FiltrosIncidentes.tsx`: selects de canal/estatus, date-range, input folio; escribe searchParams en URL.
- Los listados (`app/agente_911/{ciudadano,whatsapp,rondin}/incidentes/page.tsx`, `app/incidentes/page.tsx`) leen `searchParams` y llaman `listarIncidentesConFiltros` vía service.
- Extender `IncidenteFiltros` con `tipoIncidenteId` y `prioridadId`.
- Regla AGENTS: pages nunca importan `query` directo — todo por `lib/incidentes/service.ts`.

### Fase 2 — Despacho: visibilidad de asignaciones
- `listarIncidentesEnDespacho` → enriquecer con agregación de unidades/elementos (JOIN + `json_agg`), evitar N+1.
- Al asignar elementos en `createDespacho`: match automático `elemento_nomina` ↔ `ofi_oficiales.no_nomina` para poblar `oficial_id` (si no hay match, queda NULL — elemento externo sin cuenta).
- `TablonDespacho.tsx`: fila expandida del tab "En Despacho" muestra chips de unidades (placa) y elementos (nombre + nómina + ✓ si tiene cuenta).
- Tab "Atendidos": cambiar el JOIN de `incidente_reporte_campo` → `ofi_reportes_campo` (por `incidente_id`); mostrar resumen del cierre (`ofi_acciones`, `ofi_hay_detencion`) y **bandera "D1 pendiente"** cuando aplique.

### Fase 3 — Cierre de despacho con `ofi_reportes_campo` + vista "Mis Despachos"
**Corazón del flujo.**
- Nueva función en `lib/oficial/repository.ts`: `obtenerDespachosAsignados(userId)` — resuelve `ofi_oficiales.user_id = userId` → JOIN `incidente_despacho_elementos.oficial_id` → `incidente_despacho` → `incidentes WHERE estatus='en_despacho'`.
- Nueva página `app/oficial/despachos/page.tsx`: lista de asignaciones activas (prioridad, ubicación, descripción 911, hora de despacho).
- Nueva página `app/oficial/despachos/[id]/page.tsx`:
  - Historial generativo (Fase 4) arriba.
  - **Reutiliza el stepper existente de `ofi_reportes_campo`** (store Zustand, `app/oficial/nuevo`), prellenado desde el incidente (lugar, descripción, folio CAD = folio del incidente) y con `incidente_id` fijo.
- Modificar `insertarReporteCampo` (`lib/oficial/repository.ts`): si viene `incidenteId`, en la misma transacción `UPDATE incidentes SET estatus='atendido'`. Validar que el incidente esté `en_despacho` y que no exista ya un reporte para ese incidente (índice único respalda).
- El oficial se resuelve de `ofi_oficiales` por sesión — **nunca** se captura a mano.
- Al cerrar: el incidente aparece automáticamente en "Atendidos" de despacho (el tab ya consulta por estatus).
- Card "Mis Despachos" en `app/oficial/page.tsx` con contador.
- Se conservan intactos los flujos ya existentes del reporte (detenidos → fotos automáticas, `quiere_denuncia` → D1, asegurados, estatus `registrado`→`en_fiscalia`→`cerrado`).

### Fase 4 — Historial generativo (timeline)
- Componente `components/incidentes/HistorialIncidente.tsx` (server): timeline con
  1. **Generación 911 / Rondín**: folio, canal, reportante, descripción, fecha (`incidentes`).
  2. **Despacho**: quién despachó, cuándo, unidades y elementos (`incidente_despacho*`).
  3. **Reporte de campo**: acciones, detención, cierre (`ofi_reportes_campo` vía `incidente_id`).
  4. **D1 / legal** (si aplica): folio denuncia, estado trámite (`ofi_reporte_denuncia`).
- Service: `obtenerHistorialCompleto(incidenteId)` en `lib/incidentes/service.ts` componiendo repos de incidentes + oficial (composición cross-dominio en service, per AGENTS).
- Montar en: detalle de incidente, `/oficial/despachos/[id]`, tab Atendidos expandido, detalle D1.

### Fase 5 — Detenidos → D1 → Fiscalía/Juzgado (cierre permitido)
- Cierre con `ofi_hay_detencion=true` **no bloquea**: el reporte se guarda y el incidente pasa a `atendido`.
- Tras el cierre con detenidos, el flujo existente ya opera: `quiere_denuncia=true` genera D1; fotos de detenidos se solicitan automático.
- Nueva bandera calculada **"D1 pendiente"** (`ofi_hay_detencion=true` sin `ofi_reporte_denuncia` vinculada):
  - Visible en tab Atendidos de despacho y en la lista de reportes del oficial.
  - Al generar la D1 después: se setea también `ofi_reporte_denuncia.incidente_id` (heredado del reporte de campo) — la bandera desaparece sola.
- Routing legal sin cambios: `ofi_autoridad_recibe` decide Fiscalía vs Juzgado Cívico; evidencias por Monitorista; puesta a disposición ya existente.

### Fase 6 — Rondín SIEMPRE escala a despacho
- **Regla de negocio: todo reporte de rondín genera solicitud de despacho.** Sin toggle, sin auto-cierre.
- Reemplazar `createRecorridoCompleto` por `createRondinEscalado`:
  - Inserta incidente `canal='rondin'`, `requiere_despacho=true`, `estatus='sin_despachar'`, `origen_rondin=true`.
  - **No** crea reporte de campo (lo capturará el oficial despachado al cerrar, Fase 3).
  - Entra automáticamente al tab Pendientes del tablón.
- Deprecar el flujo de auto-cierre: el form de rondín (`ReporteRecorridoZen`) se recorta a los datos del avistamiento (qué, dónde, prioridad); las secciones de resultado (acciones, detenidos, cateo) migran al cierre del oficial.
- **Oficial captura rondín**: nueva página `app/oficial/rondin/page.tsx` con el mismo form recortado y la action escalada; card en el hub del oficial. Permiso `oficial_rondin` en `lib/permisos/registro.ts`.
- El rondín escalado hereda el historial generativo completo: rondín → despacho → reporte de campo → (D1 si aplica).

---

## 5. Diagrama del flujo final

```
[911 ciudadano/whatsapp]──┐
[Rondín (SIEMPRE escala)]─┤
                          ▼
              incidentes (sin_despachar)
                          ▼
        DESPACHO asigna unidades + elementos
        (match nómina → ofi_oficiales.oficial_id)
              incidentes (en_despacho)
                          ▼
        OFICIAL (ofi_oficiales por sesión) ve "Mis Despachos"
        → acude → captura ofi_reportes_campo (incidente_id)
              incidentes (atendido)  ← cierra solicitud
                          ▼
              ┌── ofi_hay_detencion? ──┐
             NO                        SÍ
              │                         ▼
      cierre administrativo    cierre permitido + bandera "D1 pendiente"
                                        ▼
                        D1 (ofi_reporte_denuncia ← reporte_campo_id
                            + incidente_id heredado) — bandera se limpia
                                        ▼
                          detención física + resguardo
                                        ▼
                    ofi_autoridad_recibe: FISCALIA | JUZGADO CIVICO
                                        ▼
                    flujo legal existente (evidencias monitorista,
                    estado_tramite, puesta a disposición)
```

---

## 6. Orden de ejecución y dependencias

| Fase | Depende de | Esfuerzo | Riesgo |
|---|---|---|---|
| 0. Migración BD | — | Bajo | Bajo |
| 1. Filtros 911 | — | Bajo | Bajo |
| 2. Visibilidad despacho + match nómina | 0 | Medio | Bajo |
| 3. Cierre con ofi_reportes_campo + Mis Despachos | 0, 2 | Alto | Medio (transacción cierre) |
| 4. Historial generativo | 0 | Medio | Bajo |
| 5. Bandera D1 pendiente | 0, 3 | Bajo | Bajo |
| 6. Rondín escalado | 0, 3, 4 | Medio | Bajo |

Fases 1, 2 y 4 paralelizables. Ruta crítica: 0 → 2 → 3 → 5 → 6.

---

## 7. Checklist por fase (per AGENTS.md)

- [ ] `npx tsc --noEmit` — 0 errores
- [ ] `npm run build` — exit 0
- [ ] Pages sin `import { query }` directo; todo por service/repository
- [ ] Mappers snake_case → camelCase; JSX solo camelCase
- [ ] Mutaciones con `tryActionRaw` + clases de error de `@/lib/error-handler`
- [ ] Cambio BD → actualizar [[Esquema BD]] (`npm run db:schema`)
- [ ] Feature nueva → nota en `🧩 Features/` + [[Index]]
- [ ] `npx graphify update`

## 8. Deprecación de `incidente_reporte_campo`

- No se escriben filas nuevas a partir de Fase 3 (las actions `createReporteCampo` y `createRecorridoCompleto` de `lib/incidentes/actions.ts` se retiran o marcan deprecated).
- Lecturas históricas: los detalles de incidentes viejos siguen leyendo de ella (fallback en `obtenerHistorialCompleto`: si no hay `ofi_reportes_campo.incidente_id`, buscar en legacy).
- Eliminación física de la tabla: fuera de alcance de este plan (evaluar tras periodo de convivencia).

---

Ver [[Feature - 911]] · [[Feature - Reporte Campo]] · [[Feature - Fiscalia]] · [[Feature - Juzgado]] · [[Pendientes]]
