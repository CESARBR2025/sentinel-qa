# Etapa 3 — UI Fiscalía

## Objetivo

Componente para que el agente de Fiscalía capture las armas aseguradas de un
reporte, montado en la misma página donde ya captura antecedentes externos.

## Archivos a tocar

- Nuevo: `components/fiscalia/ArmasAseguradas.tsx`
- `components/fiscalia/FormularioAsegurado.tsx` (una línea, montar el componente)

## Componente nuevo

Clon funcional de `components/fiscalia/AntecedentesExternos.tsx` — mismo
esqueleto (lista + botón "Agregar" + form inline colapsable + eliminar), pero:

- Campos del form: Tipo de Arma (texto, requerido — o `<select>` si se decide
  un catálogo cerrado, ver nota abajo), Marca, Matrícula, Calibre, Carpeta de
  Investigación (prellenada con `carpetaInvestigacionSugerida` de la respuesta
  de `listarArmasAseguradasAction`, editable), Observaciones.
- Usa `listarArmasAseguradasAction`, `agregarArmaAseguradaAction`,
  `eliminarArmaAseguradaAction` de `lib/fiscalia/actions.ts` (Etapa 2) en vez
  de las de antecedentes.
- Mismo patrón de estado: `useState` + `useTransition`, carga en `useEffect`
  al montar, refresca la lista tras agregar/eliminar.
- Reutilizar los mismos estilos inline (`labelSx`, `inputSx`, `selectSx`) —
  copiarlos tal cual de `AntecedentesExternos.tsx:17-42`, no crear un sistema
  de estilos nuevo (este proyecto usa `DESIGN.md` como fuente única de
  tokens/patrones — **leer `DESIGN.md` completo antes de tocar cualquier
  vista**, por regla de `AGENTS.md`).
- Icono: usar algo de `lucide-react` distinto a `ScrollText` (que ya usa
  Antecedentes) — por ejemplo `Crosshair` o `ShieldAlert`, coherente con el
  resto de iconografía de fiscalía.
- `carpeta_investigacion` NO se guarda en `fiscalia_armas_aseguradas` (esa
  tabla no tiene esa columna, ver Etapa 1 y Etapa 2 — el campo es solo una
  sugerencia visual en la UI a partir del D1). El campo "Carpeta de
  Investigación" mostrado aquí es de referencia para el agente; el dato real
  que via a Formato N sale de `formato-n-armas-aseguradas-service.ts` en la
  Etapa 4, que sí puede volver a consultar el D1 en el momento del sync.

  Si al construir esto se decide que sí conviene guardar la carpeta
  editada/confirmada junto con cada arma (por si el agente la corrige a mano),
  es un cambio de alcance — pausar y consultar antes de agregar una columna
  no contemplada en la Etapa 1.

**Nota sobre "Tipo de Arma" como texto libre vs catálogo**: el input manual
actual del paso 7 de Formato N (`app/envio-de-formatos/reporte/[fecha]/page.tsx`,
`PasoArmas`) ya es texto libre para `tipo_arma`. Mantener texto libre aquí
también, por consistencia y para no bloquear al agente con un catálogo
incompleto — no es una migración de catálogo (ver
`boveda/🛠 Stack/Convenciones.md`, regla de catálogos sincronizados, que
aplica a catálogos de negocio con FK real, no a este campo descriptivo).

## Montaje — `components/fiscalia/FormularioAsegurado.tsx`

Junto a la línea 940 (`<AntecedentesExternos reporteCampoId={reporteCampoId} readOnly={readOnly} />`):

```tsx
<AntecedentesExternos reporteCampoId={reporteCampoId} readOnly={readOnly} />
<ArmasAseguradas reporteCampoId={reporteCampoId} readOnly={readOnly} />
```

Agregar el import correspondiente al inicio del archivo, junto al de
`AntecedentesExternos`.

## Fuera de alcance de esta etapa

No tocar `FotosExpedienteSection.tsx` ni `app/fiscalia/solicitudes/[solicitudId]/page.tsx`
— ver `00-contexto.md`, sección "Fuera de alcance".

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores nuevos.
2. Prueba manual en `/fiscalia/asegurados/[id]` con un `reporte_campo_id` real:
   agregar un arma con los 5 campos + carpeta, verificar que aparece en la
   lista, verificar que "Carpeta de Investigación" viene prellenada si ese
   reporte ya tiene D1 con `num_carpeta_investigacion`, eliminar el arma y
   confirmar que desaparece.
3. `readOnly` oculta el botón "Agregar" y el botón de eliminar (igual que en
   `AntecedentesExternos`), pero sigue mostrando la lista.
4. Sin regresión visual en el resto de `FormularioAsegurado.tsx` (Antecedentes
   Externos, Puesta a Disposición, etc. siguen funcionando igual).
