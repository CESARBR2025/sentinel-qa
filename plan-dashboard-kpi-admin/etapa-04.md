# Etapa 4 — Componente cliente `Panel911`

Depende de la Etapa 3 (consume el endpoint `/api/incidentes/kpi-911-generales`).

## Objetivo

Componente cliente que muestra el filtro de rango + las 5 secciones de KPI descritas en `00-contexto.md`. Vive bajo `/dashboard`, que ya es 100% Apple-style (`app/dashboard/page.tsx`, `sspm-general.tsx`) — **no usar el lenguaje táctico** (JetBrains Mono, uppercase, bordes duros) que todavía tiene `components/911/kpi/*` (ese módulo no ha sido migrado, ver `DESIGN.md §10`).

## Filtro de fecha — replicar lógica, no el componente

`components/911/kpi/FiltrosRangoKpi.tsx` ya resuelve los presets 24h/7d/30d/Hoy + rango custom, pero:
- Está en estilo táctico (no Apple-style).
- Trae filtros que no aplican aquí (estatus/canal/prioridad/tipo de incidente — en este panel esos ya están desglosados como secciones de KPI, no como filtro).

**Reusar tal cual** (import directo, son utilidades puras): `isoAInputLocal`, `inputLocalAIso` de `components/911/kpi/formato.ts`.

**Replicar la lógica** (no el JSX) de `aplicarPreset(horas)` / `aplicarHoy()` (líneas 56-70 de `FiltrosRangoKpi.tsx`): mismo cálculo de `desde`/`hasta`, mismo patrón de "el preset aplica de inmediato, no solo llena los inputs".

## Archivo nuevo: `components/911/kpi-generales/FiltroRango911.tsx`

```tsx
'use client'

import { isoAInputLocal, inputLocalAIso } from '@/components/911/kpi/formato'

export interface RangoFechas { desde: string; hasta: string } // ISO

const PRESETS = [
  { etiqueta: '24 h', horas: 24 },
  { etiqueta: '7 días', horas: 24 * 7 },
  { etiqueta: '30 días', horas: 24 * 30 },
]

export function FiltroRango911({ rango, onChange, onAplicar, cargando }: {
  rango: RangoFechas
  onChange: (r: RangoFechas) => void
  onAplicar: (r: RangoFechas) => void // recibe el rango exacto, no cierre viejo (mismo motivo que FiltrosRangoKpi)
  cargando: boolean
}) {
  const aplicarPreset = (horas: number) => {
    const hasta = new Date()
    const desde = new Date(hasta.getTime() - horas * 60 * 60 * 1000)
    const nuevo = { desde: desde.toISOString(), hasta: hasta.toISOString() }
    onChange(nuevo)
    onAplicar(nuevo)
  }

  const aplicarHoy = () => {
    const desde = new Date()
    desde.setHours(0, 0, 0, 0)
    const nuevo = { desde: desde.toISOString(), hasta: new Date().toISOString() }
    onChange(nuevo)
    onAplicar(nuevo)
  }

  // JSX en lenguaje Apple-style (DESIGN.md §4): pills para presets (mismo
  // patrón que KpiTiposIncidencias), glass card de contenedor, botón
  // "Actualizar" en var(--apple-font-display).
  // Estructura de referencia: sección .desp-kpi-head + botones pill
  // (background #1f355a activo / #f1f5f9 inactivo, radius var(--radius-full)),
  // + inputs datetime-local con el mismo tratamiento de campo que el resto
  // del dashboard admin (ver app/dashboard/catalogos para inputs de admin).
}
```

## Archivo nuevo: `components/911/kpi-generales/Panel911.tsx`

Componente cliente principal. Responsabilidades:
1. Estado del rango (`useState<RangoFechas>`, default = últimas 24h, igual patrón que `filtrosIniciales()` en `KpiIncidenciasView.tsx:17-27`).
2. `fetch('/api/incidentes/kpi-911-generales?desde=...&hasta=...')` al montar y al aplicar filtro (sin polling — refresco manual).
3. Estados `cargando`/`error` (mismo patrón try/catch/finally que `KpiIncidenciasView.tsx:48-83`).
4. Render de las 5 secciones usando el tipo `KpisGenerales911` (`lib/911/types.ts`, Etapa 2) recibido del endpoint:

   - **Resumen del periodo** (`data.resumen`): stat cards Apple-glass — Total, por canal (`porCanal`), por tipo (`porTipo`: normal/alarma_escolar/extorsión con etiquetas legibles, mismo mapeo de labels que `TIPOS` en `KpiTiposIncidencias.tsx:18-22`).
   - **Atención y despacho** (`data.atencion`, tipo `KpiIncidencias` de `lib/incidentes/types.ts`): `canalizadosADespacho`/`sinCanalizacion` de `data.resumen`, `sinDespacharAhora` (badge con acento de alerta si > 0), `porEstatus`, `porPrioridad`.
   - **Tiempos de respuesta** (`data.tiempos`): 3 stat cards (captura→despacho, despacho→llegada, captura→llegada) en formato `Xm` o `X.Xh` si supera 60 min; si `muestras === 0` mostrar estado vacío ("Sin despachos con llegada registrada en el periodo") en vez de `null`/`NaN`.
   - **Alarmas escolares** (`data.alarmaEscolar`): total, `porcentajeFalsas` (con acento rojo si > 20%, umbral a criterio visual), `activacionesTotales`, `tiempoArriboPromedioMin`, lista `topEstablecimientos` (tabla simple o lista, no hace falta `.tabla-wrap` completo para 5 filas).
   - **Extorsión** (`data.extorsion`): total, `porcentajeCanalizados`, lista `topGruposDelictivos`, `tendenciaDiaria` como barras simples (no se requiere librería de charts — barras CSS con `width%` relativo al máximo del arreglo es suficiente, mismo criterio de "sin dependencias nuevas" del resto del proyecto).
   - **Acceso al mapa**: un link/card chico a `/agente_despacho/kpi-incidencias` ("Ver mapa de incidencias →"), no se reconstruye el mapa aquí.

5. Todas las secciones en cards `var(--apple-glass-bg)` + `backdrop-filter` + `var(--radius-xl)`, mismo lenguaje que `app/dashboard/sspm-general.tsx` y `app/dashboard/page.tsx`.

No usar `console.log` de depuración ni dejar TODOs — si algo no se puede resolver con los datos disponibles, mostrar un estado vacío explícito en vez de un placeholder muerto.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Cargar el componente en una página de prueba (o directo en Etapa 5) y confirmar que las 5 secciones renderizan con datos reales para al menos un rango que tenga actividad de los 3 tipos.
3. Cambiar de preset y confirmar que dispara un nuevo fetch y actualiza las 5 secciones (sin recargar la página).
4. Responsive en los 3 breakpoints (`DESIGN.md §8`) — las cards no desbordan en móvil.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 5.
