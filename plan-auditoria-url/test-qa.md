# Verificación end-to-end — todas las etapas

## Build y tipos

1. `npx tsc --noEmit` sin errores.
2. `npm run build` sin errores.
3. `node scripts/auditoria-permisos.mjs` — comparar el CSV contra la corrida inicial de la Etapa 0: la cantidad de rutas marcadas `NO` en secciones críticas debe haber bajado (idealmente a 0 en las que el mapa de la Etapa 1 ya cubre).

## Regresión del incidente conocido (Etapa 1)

4. Con un usuario que NO tenga la sección de `reportes_incidentes`, visitar `/reportes_incidentes` directamente por URL (sin pasar por el menú) → debe redirigir a `/dashboard`, no mostrar el contenido. Repetir contra `app/api/reportes-incidentes/exportar` (llamada directa al endpoint, no desde la UI) → debe rechazar.
5. Con un usuario que SÍ tenga esa sección → debe entrar normalmente, sin regresión.

## Cobertura general de secciones (Etapa 1)

6. Para 2-3 módulos más incluidos en `MAPA_SECCIONES` (además de `reportes_incidentes`): repetir el mismo par de pruebas (usuario sin sección bloqueado, usuario con sección permitido).
7. Confirmar que un módulo **fuera** del mapa (todavía no migrado) sigue funcionando exactamente igual que antes de este plan — sin falsos bloqueos.

## IDOR hardening (Etapa 2)

8. Generar un link real desde la UI hacia un expediente/detenido/denuncia → la URL debe mostrar un token (uuid), no el id numérico.
9. Tomar ese uuid y cambiar un carácter (token inventado) → 404, sin filtrar si el recurso existe o no.
10. Tomar el token real de un recurso de otro caso/usuario al que no se tiene permiso de sección → debe bloquear igual que el punto 4 (el control de la Etapa 1 sigue aplicando sobre el recurso ya resuelto).
11. Visitar el mismo recurso dos veces → debe devolver el mismo token ambas veces (no rota en cada visita).

## Cosmética (Etapa 3, si se implementó)

12. `curl -I` contra una página autenticada → headers `Referrer-Policy`, `X-Frame-Options`, `X-Content-Type-Options` presentes.
13. Si el proyecto usa algún iframe interno, confirmar que no se rompió por `X-Frame-Options`.

## Bóveda (al cerrar todas las etapas que se implementen)

14. `boveda/🏗 Arquitectura/Proxy y Auth.md` actualizado: describir el nuevo check de sección en `proxy.ts` vía `/api/auth/secciones-permitidas`, y que sigue siendo edge-compatible (sin runtime Node en el proxy mismo).
15. `boveda/🗺 Roadmap/Troubleshooting.md`: cerrar la entrada del incidente de 2026-07-15 con referencia a este plan y la fecha real del fix.
16. `boveda/🏗 Arquitectura/Decisiones.md`: ADR de por qué se optó por endpoint HTTP + proxy edge en vez de migrar el proxy a runtime Node.
17. `npx graphify update`.
