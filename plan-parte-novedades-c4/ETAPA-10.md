# Etapa 10 — Deuda técnica en BD

Independiente del resto del plan; puede correr en cualquier momento.

Auditoría hecha el 2026-08-10 sobre la BD real: para cada tabla se contaron
**filas** y **referencias en código** (`grep -rw` sobre `lib app components
features scripts`, excluyendo `lib/admin/sistema-constants.ts`, que solo lista
nombres de tabla y produce falsos positivos), más las **FKs entrantes y
salientes**.

Criterio: una tabla es candidata a eliminar solo si tiene **0 filas Y 0
referencias en código Y ninguna FK entrante**. Cualquiera de las tres cosas la
saca de la lista.

## 10.1 Eliminar — evidencia completa

| Tabla | Filas | Refs código | FKs entrantes |
|---|---|---|---|
| `novedades_captura` | 0 | 0 | ninguna |
| `ofi_fichas_inteligencia` | 0 | 0 | ninguna |
| `solicitudes_detenido` | 0 | 0 | ninguna |

- **`novedades_captura`** — intento previo de este mismo Parte de Novedades,
  abandonado. Lo reemplazan las tres tablas de la Etapa 2. Ya estaba contemplado
  ahí; se consolida aquí.
- **`ofi_fichas_inteligencia`** — apunta a `iph_detenidos` y `ofi_reportes_campo`,
  pero nadie la lee ni la escribe.
- **`solicitudes_detenido`** — apunta a `users`, sin uso.

Las tres salen también de la lista en `lib/admin/sistema-constants.ts`.

## 10.2 Requieren tu decisión antes de tocarlas

### La feature "fichas de inteligencia" quedó a medias, en tres pedazos

| Artefacto | Estado |
|---|---|
| `ofi_fichas_inteligencia` | 0 filas, 0 refs → muerta |
| `fichas_inteligencia_detenidos` | 0 filas, **1 ref**: un `INSERT` en `lib/monitorista/repository.ts:393` |
| `iph_detenidos.ficha_inteligencia_id` | columna `uuid` **sin FK a ninguna tabla** |
| `iph_detenidos.ficha_inteligencia_completa` | columna `boolean` acompañante |

Hay una tabla muerta, una tabla con escritura pero sin lectura, y dos columnas
colgadas sin integridad referencial. **¿La feature sigue en el roadmap o se
abandona?**

- Si sigue → hay que cerrarla: decidir cuál de las dos tablas es la buena,
  ponerle FK a `ficha_inteligencia_id`, y escribir la lectura.
- Si se abandona → se van las dos tablas y las dos columnas.

No lo decido yo: hay código que escribe, y borrar eso pierde una intención.

### `solicitud_fotos` — 3 filas, 0 referencias en código

Tiene datos pero nada los lee. Puede ser una feature retirada que dejó datos
huérfanos, o una que se dejó a medias. **Revisar las 3 filas antes de decidir**;
si son de prueba, se va con las demás.

## 10.3 No son deuda — no tocar

### Catálogos vacíos pero cableados

Están en 0 filas porque **falta sembrarlos**, no porque sobren. Todos tienen FK
entrante:

| Catálogo | Lo referencia |
|---|---|
| `cat_body_cams` | `rol_asignaciones.body_cam_id` |
| `cat_radios` | `rol_asignaciones.radio_id` |
| `cat_tipos_observacion` | `rol_observaciones.tipo_id` |
| `cat_sectores` | `roles_servicio.sector_id` |
| `cat_estado_fuerza_conceptos` | `rol_estado_fuerza.concepto_id` |

Los dos últimos los siembra la Etapa 0 de este plan. Los otros tres pertenecen
al módulo de Rol de Servicios y se siembran cuando ese módulo entre a producción.

### Tablas vacías con código que las usa

Feature construida, sin datos en desarrollo. Vaciar ≠ sobrar:

`contestaciones`, `medida_autoridades_adicionales`, `rol_observaciones`,
`moni_evidencias_denuncia`, `solicitudes_c4_internas`, `auxiliar_checklist`,
`rol_estado_fuerza`, `rol_asignaciones`, `roles_servicio`, `fichas_busqueda`,
`medidas_proteccion`, `visitas_domiciliarias`, `incidentes_camara`.

Varias de estas son justamente **fuentes del Parte de Novedades** — borrarlas
rompería el reporte que este plan construye.

## 10.4 Deuda anotada, fuera de alcance

No se toca en este plan, pero queda registrado para no volver a descubrirlo:

1. **`turno` como texto libre en cuatro tablas** — `incidentes_camara.turno`,
   `roles_servicio.turno`, `iph_detenidos.turno_responsable`,
   `formato_incidencia_complemento.turno`. Cuatro columnas con el mismo enum de
   tres valores, sin restricción en BD. Consolidarlas es un refactor
   transversal; ver el razonamiento en el README ("Turnos: analizado y
   descartado") sobre por qué no entra aquí.
2. **`iph_detenidos.agente_aprehensor` es texto libre** en vez de FK a
   `ofi_oficiales`. Obliga a resolver por `no_nomina` con match difuso en la
   Etapa 0.3, y es la razón de que algunos hechos queden "sin sector".
3. **Dos catálogos de sector** — `via.sectores` (poblado, sin FKs) vs
   `public.cat_sectores` (vacío, con FK). La Etapa 0.1 consolida en el segundo;
   `via.sectores` queda como catálogo del subsistema VIA, mapeado por clave.
4. **`incidentes_camara` sin FK a `users`** en algunos flujos y con
   `registrado_por` como `text` — consistente con el resto del esquema
   (better-auth usa `text` para `users.id`), pero conviene verificar que todos
   los `registrado_por` tengan FK declarada.

## Verificación

1. Reconfirmar `count(*) = 0` y `grep` en 0 **inmediatamente antes** de cada
   `DROP` — la auditoría es del 2026-08-10 y el código se mueve.
2. Respaldo de la BD antes de ejecutar los `DROP`.
3. `npx tsc --noEmit` y `npm run build` tras editar
   `lib/admin/sistema-constants.ts`.
4. `npm run db:schema` → actualizar `boveda/📦 Datos/Esquema BD.md`.
5. ADR en `boveda/🏗 Arquitectura/Decisiones.md` con la lista de lo eliminado y
   el criterio usado, para que la próxima auditoría no repita el trabajo.
