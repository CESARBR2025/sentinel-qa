# Etapa 2 — Auditoría + fix: módulo Fiscalía (11 archivos)

Depende de Etapa 1 (componente ya actualizado). Leer `00-contexto.md` (Grupo A) primero.

## Objetivo

Confirmar contra el código real que cada página tiene la cadena flex completa (`DESIGN.md §8`) para que el nuevo `margin-top:auto` de `DashboardFooter` (Etapa 1) realmente pegue el footer al fondo. El grep de `00-contexto.md` sugiere que estas 11 ya la tienen, pero **hay que abrir cada archivo y verificarlo** — en particular, que el `flex:1` esté en el elemento que es padre directo (o ancestro sin displays intermedios que lo rompan) del `<DashboardFooter />`, no en un hijo interno cualquiera.

## Archivos

- `app/fiscalia/page.tsx`
- `app/fiscalia/asegurados/page.tsx`
- `app/fiscalia/asegurados/[id]/page.tsx`
- `app/fiscalia/asegurados/puesta-disposicion/[id]/page.tsx`
- `app/fiscalia/detenidos/page.tsx`
- `app/fiscalia/detenidos/[id]/page.tsx`
- `app/fiscalia/expedientes/[solicitudId]/page.tsx`
- `app/fiscalia/liberaciones/page.tsx`
- `app/fiscalia/liberaciones/[id]/page.tsx`
- `app/fiscalia/solicitudes/page.tsx`
- `app/fiscalia/solicitudes/[solicitudId]/page.tsx`

Para cada uno:
1. Ubicar la línea `<DashboardFooter />`.
2. Subir por sus ancestros hasta el root de la página: confirmar `display:'flex', flexDirection:'column', minHeight:'100vh'` en el root, y `flex: 1` en el wrapper que envuelve todo el contenido (normalmente el que tiene `className="pad-dashboard"` o equivalente).
3. Si está completo, no tocar el archivo (anotarlo como "ya correcto" en el reporte).
4. Si falta algo, agregarlo con el mínimo cambio posible — no reordenar ni reestructurar el resto del JSX.

## Qué no tocar

- Lógica de negocio, fetch, auth/redirect de cada página.
- Cualquier otro estilo que no sea la cadena flex del footer.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual de al menos 2 de los 11 (uno con contenido corto, uno con contenido largo — ej. `fiscalia/page.tsx` y `fiscalia/detenidos/[id]/page.tsx`): footer pegado al fondo cuando el contenido es corto, footer al final del flujo normal cuando el contenido excede el viewport.
3. Reportar explícitamente cuáles de los 11 ya estaban correctos y cuáles necesitaron fix.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 3.
