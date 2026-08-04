# Verificación end-to-end — ambas etapas

## Build y tipos

1. `npx tsc --noEmit` sin errores.
2. `npm run build` sin errores.

## Etapa 1 — token de solicitudes generales

3. Abrir `/monitorista/solicitudes` con un usuario de sección `solicitudes` → los links "VER" de la columna de solicitudes generales (no las de denuncia) deben mostrar un uuid en la URL, no el id interno.
4. Copiar ese link, abrirlo en una sesión nueva del mismo usuario → debe cargar la misma solicitud (token persistente, no de un solo uso).
5. Tomar la URL y cambiar el token por el id interno crudo (si se conoce) o por un uuid inventado → 404.
6. Confirmar que las solicitudes de origen `denuncia` en la misma bandeja siguen funcionando igual que antes (usan `denunciaToken`, no tocado por esta etapa).

## Etapa 2 — autorización en uploads

7. Con un usuario de sección `busquedas`: abrir el timeline de seguimiento de una ficha de búsqueda y confirmar que los adjuntos siguen cargando (sin 403 nuevo indebido).
8. Con un usuario de sección `medidas`: abrir el modal de prórroga de una medida y confirmar que el documento sigue cargando.
9. Tomar la URL de un archivo (`/api/uploads/busquedas/...` o `/api/uploads/medidas_proteccion/...`) y pedirla con un usuario que NO tenga ninguna de esas dos secciones (ej. un usuario solo de `monitorista`) → debe dar 403.
10. Pedir `/api/uploads/carpeta-inventada/algo.pdf` → 403 (no 404, no 500) — confirma el deny-by-default.
11. Pedir la misma URL sin sesión (cookie borrada) → 401, sin cambios respecto al comportamiento anterior.

## Bóveda

12. Entrada agregada en `boveda/🧩 Features/Auditoría URLs y autorización.md` documentando el cierre de estos dos huecos, con fecha real.
13. `npx graphify update`.
