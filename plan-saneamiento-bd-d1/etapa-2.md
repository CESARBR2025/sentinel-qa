# Etapa 2 — Migrar lecturas de `incidente_reporte_campo` hacia `ofi_reportes_campo`

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

`incidente_reporte_campo` tiene 0 filas y nadie inserta en ella (verificado en BD real). La fuente viva es `ofi_reportes_campo`. Antes de poder dropear la tabla muerta (Etapa 3), hay que migrar los 9 archivos que todavía la leen. Esta etapa **no toca la BD**, solo código — así se puede verificar con build+navegación antes de ejecutar el `DROP TABLE`.

## Archivos (lista completa verificada con grep, no la del borrador original que estaba incompleta)

- `lib/reportes-operativos/repository.ts` — líneas 34, 66, 97, 129, 158, 187, 216 (7 queries)
- `lib/reportes-operativos/service.ts` — línea 212
- `lib/reportes/formato-n-rnd-service.ts` — línea 79
- `lib/reportes-incidentes/repository.ts` — líneas 23, 68
- `lib/n-coordinacion/repository.ts` — líneas 37, 86
- `lib/incidentes/repository.ts` — líneas 120 (comentario), 137, 224, 281
- `lib/incidentes/service.ts` — línea 65 (comentario)
- `lib/911/repository.ts` — línea 143
- `lib/admin/sistema-constants.ts` — línea 20
- `lib/reportes/formato-n-armas-aseguradas-service.ts` — línea 11 (comentario)

## Mapeo de columnas (`incidente_reporte_campo` → `ofi_reportes_campo`)

| `incidente_reporte_campo` | `ofi_reportes_campo` | Nota |
|---|---|---|
| `id` | `id` | |
| `incidente_id` | `incidente_id` | ya existe FK real + índice único parcial `uq_ofi_rc_incidente` |
| `contenido_reporte` | `ofi_contenido_reporte` | |
| `lugar_calle` | `ofi_calle` | |
| `lugar_colonia` | `ofi_colonia` | |
| `lugar_entre_calles` | `ofi_entre_calles` | |
| `lugar_referencia` | `ofi_referencia` | |
| `datos_positivos_negativos` | `ofi_datos_pn` | |
| `acciones_realizadas` | `ofi_acciones` | |
| `hay_detencion` | `ofi_hay_detencion` | |
| `nombre_detenidos` | `ofi_detenidos` | ¡tipo distinto! `nombre_detenidos` era `text`, `ofi_detenidos` es `jsonb` (array de objetos `{nombre, ...}`). No copiar el valor crudo — ver nota abajo. |
| `autoridad_recibe` | `ofi_autoridad_recibe` | |
| `expediente_ci` | `expediente_ci` | mismo nombre en ambas (columna ya existe también en `ofi_reportes_campo`, verificar antes de asumir) |
| `delito_falta` | `delito` | |
| `monto_robo` | `ofi_monto_robo` | |
| `objetos_recuperados` | `ofi_objetos_recuperados` | |
| `vehiculos_recuperados`/`tipo_vehiculo`/`destino_vehiculo` | `ofi_vehiculos` (jsonb) | `ofi_hay_vehiculo` indica si hay datos |
| `hay_cateo` | `ofi_hay_cateo` | |
| `domicilio_cateado` | `ofi_cateo` (jsonb: `calle`/`colonia`/`numero`) | |
| `resultado_cateo` | `ofi_resultado_cateo` | |
| `policia_a_cargo` | **no existe en `ofi_reportes_campo`** (verificado en BD) | Resolver vía `ofi_oficial_id → ofi_oficiales → users.name` (join, igual patrón que usa `lib/incidentes/repository.ts:281` hoy para `capturado_por_nombre`) o, si el consumidor real (`lib/n-coordinacion/repository.ts:86`) solo lo usa como texto de display, verificar si puede quedar como el nombre del oficial de campo. No inventar el mapeo sin revisar cómo lo consume la UI. |
| `personal_ingreso_ci` | `personal_ingreso_ci` | confirmado, mismo nombre en ambas tablas |
| `capturado_por` | `ofi_oficial_id → ofi_oficiales.user_id → users.id/name` | `ofi_reportes_campo` no tiene columna `capturado_por` de texto libre, tiene `ofi_oficial_id` (uuid, FK a `ofi_oficiales`), confirmado en BD |
| `creado_en` | `created_at` | |

**Nota sobre `nombre_detenidos` → `ofi_detenidos`**: donde el código actual arma un string `nombre_detenidos` (texto libre), reconstruirlo a partir del jsonb `ofi_detenidos` (array de detenidos) — usar el mismo patrón que ya usa `lib/detenidos-compartido.ts` para extraer nombres de esa columna (`nombreDetenido()` o equivalente, revisar esa función antes de duplicar lógica).

## Cambios

Para cada archivo de la lista:

1. Reemplazar `FROM incidente_reporte_campo` (o `LEFT JOIN incidente_reporte_campo`) por `FROM ofi_reportes_campo` / `LEFT JOIN ofi_reportes_campo`, con el alias que ya use la query (`rc`, `r`, `irc`, etc. — mantener el alias existente para no tocar el resto del SQL).
2. Reemplazar cada columna seleccionada según la tabla de mapeo de arriba.
3. Actualizar `mapper.ts`/`types.ts` del módulo correspondiente **solo si el shape de salida cambia** (por ejemplo si `nombre_detenidos` deja de ser un string plano). Si el shape se mantiene igual (mismo nombre de propiedad en el objeto TS, mismo tipo), no tocar mapper/types.
4. En `lib/incidentes/repository.ts` y `lib/incidentes/service.ts`, limpiar además los comentarios que mencionan el fallback legacy (líneas 120 y 65) — ya no aplica, `ofi_reportes_campo` es la única fuente.
5. En `lib/reportes/formato-n-armas-aseguradas-service.ts:11`, actualizar el comentario para que ya no mencione `incidente_reporte_campo`.
6. En `lib/admin/sistema-constants.ts:20`, quitar el string `'incidente_reporte_campo'` de la lista/registro (revisar para qué se usa esa lista antes de quitarlo — probablemente un catálogo de tablas del sistema para alguna pantalla de admin; confirmar que quitar la tabla de ahí no rompe una referencia esperada por otra parte del código).

## Verificación funcional (antes de dar la etapa por cerrada)

Con datos reales en la BD de desarrollo (`ofi_reportes_campo` tiene 6 filas hoy), navegar y confirmar que muestran datos:
- Detalle de incidente (usa `lib/incidentes/repository.ts`)
- Reportes operativos (`lib/reportes-operativos/**`)
- Reportes de incidentes (`lib/reportes-incidentes/**`)
- Coordinación (`lib/n-coordinacion/**`)
- Formato N RND (`lib/reportes/formato-n-rnd-service.ts`)
- 911 (`lib/911/repository.ts`)

## Criterios de aceptación

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `grep -rn "incidente_reporte_campo" lib app --include="*.ts" --include="*.tsx"` devuelve **cero coincidencias de SQL activo** (comentarios ya deberían estar limpios también, así que idealmente cero coincidencias totales).
3. Verificación funcional de la lista de arriba con datos reales — confirmar en navegador (el usuario, no el agente) que las páginas siguen mostrando los mismos datos que antes del cambio.
4. No se toca la BD en esta etapa (sin `CREATE`/`DROP`/`ALTER`).
5. No modificar archivos fuera de la lista.

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-3.md`.**
