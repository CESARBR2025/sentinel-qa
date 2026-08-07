# Etapa 5 — Fix real: grupo de wrappers hack (5 archivos)

Depende de Etapa 1. Independiente de Etapas 2-4. Leer `00-contexto.md` (Grupo B) primero — estos 5 archivos están **confirmados** (no solo por grep) con el mismo problema, a diferencia de las etapas anteriores esto no es auditoría, es fix directo.

## El problema, igual en los 5

```tsx
<div style={{ marginTop: 40 }}><DashboardFooter /></div>
```

Esto es un workaround: como el root de la página no tiene la cadena flex, alguien le puso 40px de margen fijo arriba en vez de resolver el problema real. El footer queda pegado al contenido, no al fondo del viewport.

## Archivos y su estado puntual

- `app/agente_911/despacho/page.tsx` — root: `<div style={{ minHeight: '100vh', ... }}>` sin `display:'flex'` ni `flexDirection:'column'`. Agregarlos al root; identificar el wrapper de contenido que envuelve todo antes del footer y darle `flex:1`; reemplazar el `<div style={{marginTop:40}}>` por `<DashboardFooter />` directo.
- `app/agente_despacho/kpi-incidencias/page.tsx` — mismo patrón exacto que el anterior.
- `app/notificaciones/page.tsx` — mismo patrón.
- `app/analisis/iph/page.tsx` — el root (`<div style={{ minHeight: '100vh', ... }}>`) tampoco tiene flex; el `<main className="pad-dashboard" style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>` interno sí tiene `display:flex,flexDirection:column` pero le falta `flex: 1`. Agregar `display:flex,flexDirection:column` al root y `flex:1` al `<main>`; quitar el wrapper `marginTop:40`.
- `app/analisis/pendiente-analisis/page.tsx` — mismo caso exacto que `analisis/iph/page.tsx`.

## Qué no tocar

- El `maxWidth: '1400px'` de los `<main>` en `analisis/iph` y `analisis/pendiente-analisis` — aunque técnicamente contradice `DESIGN.md §5` ("prohibido `maxWidth` en contenedores de página"), **no es parte de este plan** (es sobre el footer, no sobre el layout general de esas vistas). Anotarlo en el reporte como deuda detectada, no tocarlo.
- Lógica de negocio, fetch, auth/redirect de cada página.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual de los 5: footer pegado al fondo del viewport con contenido corto (recargar con pocos datos si aplica), sigue el flujo normal con contenido largo.
3. Confirmar que ya no queda ningún `<div style={{ marginTop: 40 }}><DashboardFooter /></div>` en el repo (`grep -rn "marginTop: 40" app/` no debe mostrar ninguno asociado a `DashboardFooter`).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 6.
