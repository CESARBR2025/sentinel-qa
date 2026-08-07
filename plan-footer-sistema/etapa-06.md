# Etapa 6 — Fix real y aislado: `app/analisis/generar-ppt/page.tsx`

Depende de Etapa 1. Independiente del resto. Leer `00-contexto.md` (Grupo C) primero.

## Objetivo

Único archivo del sistema sin ningún tipo de mitigación previa (ni cadena flex correcta, ni el wrapper hack `marginTop:40` de la Etapa 5). Hoy el footer simplemente aparece después del contenido, nunca pegado al fondo del viewport.

## Archivo

`app/analisis/generar-ppt/page.tsx` — root: `<div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>`, sin `display:'flex'` ni `flexDirection:'column'`. `<DashboardFooter />` se renderiza directo, sin ningún wrapper.

Fix: agregar `display:'flex', flexDirection:'column'` al root; identificar el wrapper que envuelve todo el contenido antes del footer y darle `flex:1` (si no existe uno claro, puede ser necesario envolver el contenido en un div con `flex:1` — hacerlo con el mínimo cambio posible, sin alterar el resto del layout).

## Qué no tocar

- Lógica de negocio, fetch, auth/redirect, generación del PPT.
- Cualquier otro estilo de la página.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: footer pegado al fondo con contenido corto, flujo normal con contenido largo.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 7.
