# Etapa 7 — Store Zustand y stepper de 11 pasos

Requiere etapas 3, 4, 5 y 6.

## Store

`lib/novedades/store.ts`, modelado sobre `lib/reportes/formato-n-store.ts`.

Ese archivo abre con una nota de diseño que aplica igual aquí:

> REGLA DE DISEÑO: todo formulario institucional nuevo debe controlarse con un
> store Zustand (ver `boveda/🛠 Stack/Convenciones.md` → "Formularios con
> Zustand"). Centraliza: navegación de pasos, consolidado cargado, drafts de
> cada sección y toda la lógica de fetch/guardado.

Con 11 pasos y ~34 tablas, el store no puede tener un campo por sección como el
de Formato N (que declara `fgeVals`, `fgrVals`, `mediosVals`, `victimasVals`…
uno por uno). Se generaliza:

```ts
interface NovedadesState {
  fecha: string
  paso: number
  loading: boolean
  guardando: boolean
  error: string
  msg: string

  estatus: EstatusDia | null
  /** Draft por sección: matrices de contadores. */
  secciones: Record<SeccionKey, Record<string, unknown>>
  /** Draft por sección: listados. */
  filas: Record<string, FilaNovedad[]>
  /** Lo calculado desde BD, para mostrar el "antes" junto al editable. */
  calculado: Record<SeccionKey, Record<string, unknown>>
}
```

Acciones: `cargar(fecha)`, `setPaso`, `setCampo(seccion, campo, valor)`,
`agregarFila(seccion, datos)`, `editarFila`, `eliminarFila`,
`guardarSeccion(seccion)`, `confirmada(seccion)`, `avanzar(seccion)`.

`avanzar` conserva la semántica de Formato N: guarda → confirma → siguiente
paso, en una sola acción. **No hay botones "Confirmar sección" ni "Omitir"** —
esa decisión ya está registrada para Formato N ("se eliminan botones Confirmar
sección/Omitir de todos los pasos; la confirmación ocurre en la navegación") y se
mantiene aquí por consistencia.

## Carga inicial

`cargar(fecha)` hace **una sola** llamada a `/api/novedades/dia?fecha=...`, que
devuelve el día completo (calculado + capturado + estatus).

Diferencia deliberada con Formato N: aquel dispara 3 `POST /sincronizar` en
paralelo y luego 4 fetches más. Con 11 secciones ese patrón serían ~15 llamadas
por carga. Aquí el servidor arma el día completo en `obtenerDiaNovedades`
(Etapa 3) y el cliente hace un solo `GET`.

## Página

`app/envio-de-formatos/novedades/[fecha]/page.tsx`, hermana de
`app/envio-de-formatos/reporte/[fecha]/page.tsx`.

Reusa sin cambios: `DashboardHeader`, `PageHeader`, `StepIndicator`,
`components/reportes/form-styles` (`inputStyle`, `btnPrimario`, `Label`,
`sectionCard`, `sectionHeader`, `sectionTitleStyle`, `sectionBody`, `pageWrap`).

**Antes de escribir JSX, leer `DESIGN.md` completo** — es la fuente de verdad
visual única del proyecto. Prohibido duplicar tokens o reimplementar patrones ya
documentados ahí.

## Componentes de paso

11 componentes en `features/novedades/components/`, uno por paso. Para no
repetir 34 veces la misma tabla, tres componentes genéricos:

| Componente | Para qué |
|---|---|
| `MatrizContadores` | matrices etiqueta → número (T0, T5, T7, T14, T32) |
| `TablaEditable` | listados con alta/baja/edición de filas (T8-T11, T20-T24) |
| `TablaSoloLectura` | lo autollenado que solo se revisa (T3, T4, T9, T15, T26) |

`MatrizContadores` distingue visualmente campos automáticos de manuales, con el
mismo criterio que ya usa `PasoFiscalia` en el stepper de Formato N (tabla de
solo lectura para los automáticos + grid de inputs para los manuales, con el
encabezado "Captura manual — no hay fuente de datos").

## Indicador de progreso

`StepIndicator` con `total={11}`. En el paso 2 y 8, mostrar el aviso de
pendientes: registros sin sector asignado (Etapa 0.3) y delitos sin clasificar
(Etapa 0.4), con acceso directo para resolverlos.

## Verificación

1. `npx tsc --noEmit` y `npm run build`
2. Recorrer los 11 pasos con datos y sin datos.
3. Los drafts persisten al navegar entre pasos sin remount (es la razón de ser
   del store).
4. `npm run check:responsive` sobre la vista nueva.
