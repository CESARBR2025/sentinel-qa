# Etapa 0 — Prerrequisitos de datos

Sin esta etapa, tres secciones del Parte de Novedades no pueden autollenarse.
Es independiente de las etapas 1 y 2; puede correr en paralelo.

## 0.1 Consolidar el catálogo de sectores

**Problema.** Hay dos catálogos compitiendo:

| Catálogo | Filas | FKs |
|---|---|---|
| `via.sectores` (`id_sector`, `nombre_sector`, `activo`) | ORIENTE, PONIENTE, CENTRO | ninguna |
| `public.cat_sectores` (`id`, `nombre`, `clave`, `activo`, `creado_en`) | **vacío** | `roles_servicio.sector_id` |

**Decisión.** `public.cat_sectores` es el catálogo canónico — es el único con FK
real en el sistema y vive en el schema principal. `via.sectores` queda como
catálogo del subsistema VIA (infracciones), y se mapea por `clave`.

**Migración.**

```sql
INSERT INTO cat_sectores (nombre, clave, activo) VALUES
  ('ORIENTE',  'ORIENTE',  true),
  ('PONIENTE', 'PONIENTE', true),
  ('CENTRO',   'CENTRO',   true)
ON CONFLICT DO NOTHING;
```

La correspondencia con `via.sectores` se resuelve por `clave = nombre_sector`.
No se duplica el dato ni se crea texto libre.

## 0.2 Agregar sector al oficial

```sql
ALTER TABLE ofi_oficiales
  ADD COLUMN sector_id integer REFERENCES cat_sectores(id);

CREATE INDEX idx_ofi_oficiales_sector ON ofi_oficiales(sector_id);
```

- Se expone en el CRUD de oficiales (`lib/admin-transito/`), como select
  alimentado por `cat_sectores` — nunca input de texto.
- Los oficiales existentes quedan en `NULL` hasta que Administración los
  asigne. `NULL` no rompe nada: cae en "sin asignar" (ver 0.3).

## 0.3 Resolución del sector de un hecho

Helper único en `lib/novedades/sector.ts`:

```
sectorDeHecho(hecho) =
     sector del oficial que lo atendió        (ofi_oficiales.sector_id)
  ?? sector inferido por colonia del hecho    (fallback)
  ?? null  → "sin asignar"
```

El origen del oficial según la tabla:

| Tabla del hecho | Ruta al oficial |
|---|---|
| `ofi_reportes_campo` | `ofi_oficial_id` → `ofi_oficiales` |
| `ofi_reporte_denuncia` | `oficial_id` → `ofi_oficiales` |
| `iph_detenidos` | `agente_aprehensor` (texto) → resolver por `no_nomina` |
| `via.v2_infracciones` | `oficial_id` → `ofi_oficiales` |
| `incidentes` | vía `incidente_despacho_elementos.oficial_id` |

**Nota sobre `iph_detenidos.agente_aprehensor`:** es texto libre. Se resuelve
contra `ofi_oficiales.no_nomina`; si no matchea, el registro cae en "sin
asignar" y el stepper lo muestra para reasignación manual. No se adivina.

**CENTRO se agrega al documento como tercera columna** (decisión del usuario,
2026-08-10). Las tablas T0, T2 y T7 pasan de
`ORIENTE | PONIENTE | TOTALES` a `ORIENTE | PONIENTE | CENTRO | TOTALES`.

Es la única desviación estructural respecto del `.docx` original. Como el parte
va dirigido al Secretario de Seguridad Ciudadana, conviene socializar el cambio
de columna antes del primer envío — pero es decisión tomada y el plan la
implementa.

Los hechos que no resuelvan sector siguen cayendo en "sin asignar" y se
presentan en el paso 2 para distribución manual. **Nunca se reparten solos.**

## 0.4 Catálogo de clasificación de delitos

La tabla T25 del documento agrupa delitos en 4 familias:

- DELITOS PATRIMONIALES CU
- CONTRA LA SOCIEDAD
- CONTRA LAS PERSONAS
- OTROS

No existe catálogo que haga ese agrupamiento. (Se revisó
`MACHOTE DELITOS PATRIMONIALES.xlsx` de la carpeta de formatos: **no** trae la
clasificación, es la bitácora de D1 iniciadas / no iniciadas / reportes de robo
no confirmados, que ya está implementada en `/d1`, `/d1_noiniciada` y
`/sin_robos`.)

```sql
CREATE TABLE cat_clasificacion_delitos (
  id            serial PRIMARY KEY,
  delito        text NOT NULL UNIQUE,
  familia       text NOT NULL,   -- PATRIMONIALES_CU | SOCIEDAD | PERSONAS | OTROS
  activo        boolean NOT NULL DEFAULT true,
  creado_en     timestamp NOT NULL DEFAULT now()
);
```

Siembra inicial: `SELECT DISTINCT delito FROM ofi_reporte_denuncia UNION
SELECT DISTINCT delito FROM iph_detenidos`, clasificados con el criterio del
área de Análisis. Los delitos que aparezcan después y no estén en el catálogo
caen en `OTROS` y se listan en el paso 8 para que el capturista los clasifique
— así el catálogo crece solo y nunca se pierde un delito.

## 0.5 Sembrar `cat_estado_fuerza_conceptos`

La tabla existe con la estructura correcta (`id`, `nombre`, `codigo`, `grupo`,
`orden`, `activo`) pero está **vacía**, lo que deja la tabla T32 sin autollenado
pese a que `roles_servicio` + `rol_estado_fuerza` ya la alimentarían.

Los 12 conceptos del formato, en dos grupos:

| grupo | codigo | nombre |
|---|---|---|
| PERSONAL | SERVICIO | Servicio |
| PERSONAL | VACACIONES | Vacaciones |
| PERSONAL | INCAPACIDADES | Incapacidades |
| PERSONAL | DESCANSOS | Descansos |
| PERSONAL | COMISIONADOS | Comisionados |
| PERSONAL | ARRESTADOS | Arrestados |
| PARQUE | UNIDADES | Unidades |
| PARQUE | MOTOCICLETAS | Motocicletas |
| PARQUE | CUATRIMOTOS | Cuatrimotos |
| PARQUE | BICICLETAS | Bicicletas |
| PARQUE | OPER_ADMIN | Operativos / Administrativos |
| PARQUE | SUBESTACIONES | Subestaciones |

`OPER_ADMIN` se imprime como `operativos/administrativos` (el formato usa la
diagonal literal en esa celda).

## 0.6 Desambiguar la fecha del turno nocturno en `incidentes_camara`

**Se evaluó y se descartó** crear un catálogo `cat_turnos` y asignar turno a los
usuarios del C-4. La justificación está en el README, sección "Turnos: analizado
y descartado". Lo que sí hay que arreglar es un bug de captura, y es de un solo
archivo.

**El bug.** `incidentes_camara.fecha` es ambigua para el turno NOCTURNO, que
corre de 22:00 a 07:00 y por lo tanto cruza la medianoche. El formulario de alta
prellena la fecha con el día actual:

```tsx
// app/monitorista/incidentes-camara/nuevo/page.tsx:113
<input name="fecha" type="date" required style={inputStyle}
       defaultValue={new Date().toISOString().slice(0, 10)} />
```

y la columna tiene `DEFAULT CURRENT_DATE`. Resultado:

| Quién captura | Cuándo | Qué guarda |
|---|---|---|
| Monitorista nocturno | 23:00 del día D-1 | `fecha = D-1` |
| Monitorista nocturno | 02:00 del día D | `fecha = D` |

**La misma jornada queda con fecha distinta según a qué hora le dio guardar.**
Esto rompe cualquier regla de ventana —06→06 o la que sea— y también ensucia el
reporte de cámaras que ya existe y el export a xlsx. Es un bug preexistente que
este plan destapa, no uno que introduzca.

**El arreglo.** `fecha` pasa a significar, sin ambigüedad, **la fecha en que
inicia el turno**:

1. El formulario deja de usar `new Date()` como default y calcula la fecha de
   inicio según el turno elegido: si es NOCTURNO y la hora actual está entre
   00:00 y 07:00, el default es **ayer**; en cualquier otro caso, hoy.
2. Debajo del selector, el formulario **muestra la jornada resultante en texto**
   — "Turno nocturno del 9 al 10 de agosto" — para que el monitorista vea qué
   está guardando y pueda corregirlo. La fecha sigue siendo editable.
3. Se centralizan los horarios, que hoy están escritos a mano en cinco archivos:

| Archivo | Qué duplica |
|---|---|
| `app/monitorista/incidentes-camara/nuevo/page.tsx:12` | las 3 opciones con horario |
| `app/monitorista/incidentes-camara/[id]/page.tsx:12` | idem |
| `app/monitorista/incidentes-camara/page.tsx:97` | `07-15 hrs` / `15-22 hrs` / `22-07 hrs` |
| `components/monitorista/FilaIncidenteCamara.tsx:26` | idem |
| `app/api/camara/exportar/route.ts:151` | las 3 claves de las hojas del xlsx |

   Todos pasan a leer una única constante exportada, extendiendo la que ya
   existe en `lib/monitorista/service.ts:18`:

```ts
export const TURNOS = [
  { clave: 'MATUTINO',   nombre: 'Primer Turno',  inicio: '07:00', fin: '15:00', cruzaMedianoche: false },
  { clave: 'VESPERTINO', nombre: 'Segundo Turno', inicio: '15:00', fin: '22:00', cruzaMedianoche: false },
  { clave: 'NOCTURNO',   nombre: 'Tercer Turno',  inicio: '22:00', fin: '07:00', cruzaMedianoche: true  },
] as const
```

   Sin tabla, sin migración de columna, sin FK. El tipo `Turno` de
   `lib/monitorista/types.ts:71` sigue acotando los valores del lado de
   TypeScript y el `<select>` del lado del usuario.

**Por qué aquí no aplica la regla de "catálogos con FK".** Esa regla existe para
valores de dominio que los usuarios capturan y que derivan si no comparten tabla
—delito, sector, grúa, tipo de arma—. `turno` es un enum cerrado de tres valores,
sin atributos que el negocio edite, ya restringido por un tipo union y un
`<select>`. Convertirlo en tabla agregaría un JOIN a cada query de cámaras sin
eliminar ninguna inconsistencia posible. Es una excepción razonada, no un olvido;
queda como ADR en la Etapa 9.

**Backfill.** Antes de confiar en la regla `fecha = D-1`, revisar los registros
NOCTURNO existentes y corregir los que hayan quedado con la fecha de término en
vez de la de inicio. Detección:

```sql
SELECT id, fecha, creado_en
FROM incidentes_camara
WHERE turno = 'NOCTURNO'
  AND creado_en::time < '07:00'
  AND creado_en::date = fecha;   -- capturado de madrugada con la fecha del día que termina
```

En la BD actual `incidentes_camara` tiene **0 filas**, así que hoy el backfill es
vacío. Correrlo de todos modos antes de producción.

## Verificación

1. `npx tsc --noEmit`
2. `npm run db:schema` y confirmar que `boveda/📦 Datos/Esquema BD.md` refleja
   `ofi_oficiales.sector_id` y `cat_clasificacion_delitos`.
3. Query de humo: contar hechos del día con sector resuelto vs. sin asignar.
4. Regresión del módulo de cámaras: alta (con los 3 turnos, incluido nocturno
   capturado de madrugada), edición, listado por turno y exportación a xlsx.
5. ADRs en `boveda/🏗 Arquitectura/Decisiones.md`: por qué `cat_sectores` gana
   sobre `via.sectores`, y por qué `turno` se queda como enum sin tabla.
