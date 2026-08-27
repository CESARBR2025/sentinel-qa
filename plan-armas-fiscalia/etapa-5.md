# Etapa 5 — UI Formato N paso 7

## Objetivo

Que el paso 7 del stepper (`PasoArmas`) muestre las armas ya sincronizadas
desde Fiscalía en una tabla (igual que `PasoEventos`/`PasoRnd`), y conserve
debajo el form manual existente para casos que Fiscalía aún no haya
procesado.

## Archivo a tocar

`app/envio-de-formatos/reporte/[fecha]/page.tsx` — función `PasoArmas`
(líneas 356-379 en el estado actual del archivo).

## Estado actual (para referencia, no copiar tal cual)

```tsx
function PasoArmas() {
  const armasForm = useFormatoNStore(s => s.armasForm)
  const consolidado = useFormatoNStore(s => s.consolidado)
  const setArmasForm = useFormatoNStore(s => s.setArmasForm)

  return (
    <div style={sectionCard}>
      <div style={sectionHeader}><div style={sectionTitleStyle}>Armas de Fuego Aseguradas</div></div>
      <div style={sectionBody}>
        <div style={infoBanner}>
          Sin fuente automática — el registro de armas de reportes de campo no guarda tipo, matrícula ni calibre. Captura 100% manual.
        </div>
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>Registradas: {consolidado?.armas.length ?? 0}</div>
        <div className="grid-2">
          {/* ...inputs manuales... */}
        </div>
      </div>
    </div>
  )
}
```

## Cambio

1. **Actualizar el banner**: ya no es cierto que no hay fuente — reemplazar
   por algo como *"Las armas capturadas en Fiscalía (con foto de evidencia)
   se sincronizan automáticamente. Usa el formulario de abajo solo para casos
   que Fiscalía todavía no haya procesado."*

2. **Agregar tabla de armas sincronizadas**, mismo patrón visual que
   `PasoEventos`/`PasoRnd` (mismo archivo, líneas ~151-204 y ~270-319 —
   mismos `thStyle`/`tdStyle`, mismo `tabla-wrap` con borde/radio/sombra,
   mismo estado vacío centrado en gris). Columnas: Tipo de Arma, Marca,
   Matrícula, Calibre, Carpeta de Investigación, Observaciones. Filtrar
   `consolidado?.armas` a solo las que tengan `origen_fiscalia_arma_id`
   (las auto-sincronizadas) para no mezclar visualmente con las que el
   propio form manual de este paso vaya agregando en la sesión — o, más
   simple, mostrar la tabla completa de `consolidado.armas` ordenada con las
   auto-sincronizadas primero; decidir según cómo se vea mejor al probarlo,
   no es una decisión de negocio, es de UI.

3. **Conservar el form manual tal cual está** (líneas 369-375 actuales) —
   sigue guardando vía `guardarArmas` del store
   (`lib/reportes/formato-n-store.ts`), que ya tiene el fix de esta sesión
   (no reenvía si `tipo_arma` está vacío, limpia el form tras guardar). No
   tocar esa lógica en esta etapa.

4. `consolidado?.armas` necesita traer `origen_fiscalia_arma_id` para poder
   filtrar/distinguir en el punto 2 — confirmar que
   `lib/reportes/formato-n-consolidado-service.ts` (`obtenerFormatoNConsolidado`)
   sigue usando `obtenerArmasAseguradasPorFecha` (no cambia, ya devuelve todo
   el objeto `FormatoNArmaAsegurada`, que en la Etapa 4 ya incluye el campo
   nuevo).

## Fuera de alcance

- No cambiar `avanzar`/`confirmarSeccion` para este paso — el flujo de
  confirmación del paso sigue igual (el usuario revisa lo que hay, agrega a
  mano si falta algo, y confirma para avanzar).
- No agregar edición/eliminación de armas auto-sincronizadas desde este paso
  — si algo está mal, se corrige en Fiscalía (Etapa 3) y se vuelve a
  sincronizar (recarga de página).

## Criterios de aceptación

1. `npx tsc --noEmit` y `npm run build` sin errores nuevos.
2. Con al menos un arma sincronizada desde Fiscalía para el día del reporte:
   abrir `/envio-de-formatos/reporte/<fecha>`, llegar al paso 7, confirmar
   que aparece en la tabla con sus datos correctos.
3. El form manual sigue funcionando exactamente igual que antes (agregar un
   arma manual, confirmar sección, avanzar).
4. Recargar la página (fuerza un nuevo sync) y confirmar que el arma de
   Fiscalía **no se duplica** en la tabla.
