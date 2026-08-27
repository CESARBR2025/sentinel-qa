# Etapa 5 — Rediseñar la captura: consolidado por día (LISTO/PENDIENTE) + stepper único

## Problema (reportado por el usuario, no un bug — una mejora de UX)

Generar un reporte diario hoy requiere navegar 7 páginas sueltas
(`/formato-n-eventos`, `/formato-n-fge`, `/formato-n-fgr`, `/formato-n-rnd`,
`/formato-n-medios-alternativos`, `/formato-n-atencion-victimas`,
`/formato-n-armas-aseguradas`), cada una con su propio flujo de "nuevo
registro". Es confuso para algo que conceptualmente es un solo reporte del
día. El usuario pidió:

1. `/envio-de-formatos/consolidar` carga el día de hoy por defecto al entrar
   (hoy exige elegir manualmente un rango de fechas y dar clic en "CARGAR DATOS").
2. Por día, una sola card: **"Reporte del día"** con estatus **LISTO/PENDIENTE**
   (no 7 badges CAPTURADO/SIN CAPTURAR por sección).
3. Al entrar a un día PENDIENTE: **una sola página con stepper**, un paso por
   sección, cada paso precalculado donde el sistema puede calcular y libre
   donde no.
4. Al terminar el último paso: descargar el reporte completo ya generado.

**LISTO** se definió con el usuario como: **las 8 secciones** (las 7 páginas
actuales + Observaciones, que hoy no tiene página propia — ver
[README](README.md)) tienen su paso confirmado para esa fecha, aunque el
operador haya confirmado "sin novedad"/en cero. Un conteo de filas no basta
(Eventos, RND y Armas son de 0-a-N filas por día — cero filas no distingue
"nadie ha entrado a capturar" de "no hubo nada que reportar"). Por eso hace
falta un estado explícito por sección y por día, no solo mirar si hay filas.

Esta etapa depende de la Etapa 2 (generador ya corregido) y de la Etapa 3
(Flujo B retirado, `upsertObservaciones` conservada). Ejecutar después de
ambas.

## Cambio requerido

### 1. Tabla de estatus por día (migración nueva)

```sql
CREATE TABLE formato_n_estatus_dia (
  fecha                     date PRIMARY KEY,
  eventos_confirmado        boolean NOT NULL DEFAULT false,
  fge_confirmado            boolean NOT NULL DEFAULT false,
  fgr_confirmado            boolean NOT NULL DEFAULT false,
  rnd_confirmado            boolean NOT NULL DEFAULT false,
  medios_confirmado         boolean NOT NULL DEFAULT false,
  victimas_confirmado       boolean NOT NULL DEFAULT false,
  armas_confirmado          boolean NOT NULL DEFAULT false,
  observaciones_confirmado  boolean NOT NULL DEFAULT false,
  completado_en             timestamptz,
  actualizado_por           text,
  actualizado_en            timestamptz NOT NULL DEFAULT now()
);
```

`LISTO` = las 8 columnas `*_confirmado` en `true` para esa fecha.
`completado_en` se llena cuando las 8 quedan en `true` (informativo, para
mostrar "completado a las..." en la card). Seguir el patrón de capas del
proyecto: agregar `types.ts`/`mapper.ts`/`repository.ts` en un módulo nuevo
(sugerido: `lib/reportes/formato-n-estatus-service.ts`, junto a los demás
`formato-n-*-service.ts` — o `lib/n-coordinacion/repository.ts` si el equipo
prefiere mantenerlo ahí; decidir y ser consistente).

Actualizar `boveda/📦 Datos/Esquema BD.md` con esta tabla nueva (checklist T2
del `AGENTS.md` del repo).

### 2. `/envio-de-formatos/consolidar` — carga automática + card por día

- Al montar la página, si no hay `fechaInicio`/`fechaFin` en el estado,
  precargarlos con la fecha de hoy (`new Date().toISOString().slice(0,10)`
  para ambos) y disparar la carga automáticamente (mover la lógica de
  `cargar()` a un `useEffect` que corre al montar, en vez de esperar el clic
  en "CARGAR DATOS" — el selector de rango se conserva para revisar otros días).
- Reemplazar `DiaConsolidado` (hoy expande las 7 secciones completas por día)
  por una card compacta: fecha, badge **LISTO** (verde) o **PENDIENTE**
  (ámbar) leído de `formato_n_estatus_dia`, y un resumen corto (ej. "5/8
  secciones completas" cuando está pendiente).
  - Si LISTO: botón "Descargar Word" (→ `/api/nCoordinacion/generar?fecha=...`)
    y botón secundario "Editar" (→ el stepper, para corregir algo sin perder
    el estatus de las demás secciones).
  - Si PENDIENTE: botón "Completar reporte" (→ el stepper).
- El endpoint que alimenta esta vista debe traer, además de
  `obtenerFormatoNConsolidado(fecha)` (ya usado), el estatus de
  `formato_n_estatus_dia` para cada fecha del rango.

### 3. Stepper único — ruta nueva

Ruta sugerida: `/envio-de-formatos/reporte/[fecha]`. 8 pasos, en este orden
(mismo orden que las tablas A-H del documento):

1. Eventos Informados
2. Fiscalía General del Estado (FGE)
3. Fiscalía General de la República (FGR)
4. Registro Nacional de Detenciones (RND)
5. Medios Alternativos de Solución de Conflictos (MASC)
6. Atención a Víctimas
7. Armas de Fuego Aseguradas
8. Observaciones

Para cada paso:

- **Reutilizar el formulario y la lógica de cálculo que ya existe** en la
  página individual correspondiente (no reescribir `calcularConteosPorFecha`,
  `obtenerArmasParaFormatoN`, etc. — extraer el formulario a un componente
  compartido si hoy vive mezclado con la página, y montarlo dentro del paso
  del stepper). FGE y Armas ya tienen precálculo asistido ("calcular de
  reportes" / jalar de `ofi_reportes_campo`) — consérvalo igual. FGR sigue
  100% manual con su banner explicativo. Eventos y RND son de captura manual
  por fila (agregar N eventos/detenciones del día) — igual que hoy.
- Botón "Siguiente" en cada paso: guarda esa sección (usando las funciones ya
  existentes de Flujo A: `crearFge`/`actualizarFge`, `crearFgr`, etc. — o
  para Eventos/RND/Armas, que son listas, "confirmar" el paso no exige forzar
  una fila si el operador indica explícitamente "sin novedad" ese día) y hace
  upsert de la columna `*_confirmado` correspondiente en
  `formato_n_estatus_dia` a `true`.
- Navegación libre entre pasos ya confirmados (no forzar avance estrictamente
  lineal si el operador quiere volver a revisar un paso anterior).
- Último paso (Observaciones): al confirmar, si las 8 columnas quedan en
  `true`, marcar `completado_en` y mostrar de inmediato el botón "Descargar
  reporte completo" (mismo endpoint `/api/nCoordinacion/generar?fecha=...`,
  ya corregido en la Etapa 2).

### 4. Retirar las 7 páginas sueltas y simplificar el hub

- Eliminar las rutas `app/formato-n-eventos/`, `app/formato-n-fge/`,
  `app/formato-n-fgr/`, `app/formato-n-rnd/`, `app/formato-n-medios-alternativos/`,
  `app/formato-n-atencion-victimas/`, `app/formato-n-armas-aseguradas/`
  completas (listado + nuevo + `[id]`) — el stepper cubre crear y editar.
- En `app/envio-de-formatos/page.tsx`: quitar las 7 cards individuales que
  enlazaban a esas rutas. Queda como único destino
  `/envio-de-formatos/consolidar`. Evaluar si conviene que `/envio-de-formatos`
  redirija directo a `/envio-de-formatos/consolidar` (una sola pantalla de
  entrada) en vez de mantener un hub intermedio con una sola opción.
- `getFormatoNStats` ([lib/reportes/repository.ts](../lib/reportes/repository.ts))
  alimentaba los contadores de esas 7 cards — revisar si sigue teniendo uso
  en algún otro lado antes de tocarlo; si no, queda huérfano (limpiarlo aquí
  mismo, ya que es parte directa de este cambio, no de la Etapa 4).
- Los `service.ts` de `lib/reportes/formato-n-*-service.ts` (`crearFge`,
  `calcularConteosPorFecha`, `obtenerArmasParaFormatoN`, etc.) **no se tocan**
  — el stepper los sigue usando, solo cambia qué componente de UI los llama.

## Criterios de aceptación

1. Entrar a `/envio-de-formatos/consolidar` sin tocar nada muestra de
   inmediato los datos de hoy (sin clic previo en "CARGAR DATOS").
2. Cada día se ve como una sola card con badge LISTO o PENDIENTE — ya no hay
   7 bloques expandidos por día.
3. Un día PENDIENTE: clic en "Completar reporte" abre el stepper en
   `/envio-de-formatos/reporte/<fecha>`; completar los 8 pasos deja el día en
   LISTO en `/envio-de-formatos/consolidar` sin recargar manualmente.
4. Un paso con precálculo (FGE, Armas) muestra los valores calculados al
   entrar, editables antes de confirmar — igual que hoy en sus páginas
   individuales.
5. Al confirmar el último paso (Observaciones) de un día recién completado,
   aparece de inmediato la opción de descargar el `.docx`, y el documento
   descargado coincide con lo capturado en los 8 pasos.
6. Las rutas `/formato-n-eventos`, `/formato-n-fge`, `/formato-n-fgr`,
   `/formato-n-rnd`, `/formato-n-medios-alternativos`,
   `/formato-n-atencion-victimas`, `/formato-n-armas-aseguradas` ya no
   existen (404 o eliminadas del build).
7. `npx tsc --noEmit` y `npm run build` sin errores.
8. Actualizar `boveda/📦 Datos/Esquema BD.md` (tabla nueva) y
   `boveda/🧩 Features/Formato N.md` si existe (reflejar el flujo nuevo).
