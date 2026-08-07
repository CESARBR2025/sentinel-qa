# Etapa 7 — Verificación end-to-end + documentación

Depende de las Etapas 1-6 (todas construidas).

## Objetivo

Cerrar el plan: verificación completa, documentación en la bóveda, y confirmar que no quedó nada suelto.

## Pasos

1. `npx tsc --noEmit` limpio en todo el proyecto (no solo los archivos tocados).
2. `npm run build` sin errores.
3. Verificación manual completa, como admin:
   - `/dashboard` → card "KPIs Generales" visible → click → `/dashboard/kpis`.
   - Tab SSPM (default) → tab 911 → `Panel911` con datos reales.
   - Probar los 4 presets (24h/7d/30d/Hoy) y el rango custom con `datetime-local` — cada uno debe disparar un fetch nuevo y actualizar las 5 secciones.
   - Verificar un rango sin actividad de algún tipo (ej. sin extorsiones) → esa sección debe mostrar un estado vacío legible, no `0` desnudo ni `NaN`/`undefined` en pantalla.
   - Tab Infracciones → placeholder "Próximamente".
   - Intentar `/dashboard/kpis` con un usuario no-admin (logueado) → redirige a `/dashboard`.
   - Intentar `GET /api/incidentes/kpi-911-generales` sin sesión → 401; con sesión no-admin → 403.
4. Responsive en los 3 breakpoints (`DESIGN.md §8`) para `/dashboard/kpis` completo.
5. Revisar consola del navegador durante la prueba manual — sin errores ni warnings nuevos.

## Documentación

1. **Bóveda — `boveda/🧩 Features/KPIs Generales.md`** (nuevo): crear siguiendo el formato de `boveda/🧩 Features/KPI Incidencias.md` como referencia — propósito, ruta, qué muestra cada sección, modelo de datos, decisiones de negocio (gate admin, sin polling, Infracciones fuera de alcance).
2. **`boveda/🧩 Features/Index.md`**: agregar la entrada del módulo nuevo.
3. **`boveda/🗺 Roadmap/Changelog.md`**: agregar entrada breve describiendo qué se construyó.
4. Si algún nombre de columna o de tabla resultó distinto al asumido en `00-contexto.md` durante la Etapa 1, anotarlo en `boveda/🏗 Arquitectura/Decisiones.md` o en `Troubleshooting.md` si fue un hallazgo no trivial.

## Checklist final de la carpeta completa

- [ ] Etapas 1-6 construidas y confirmadas una por una (sin combinar).
- [ ] `npx tsc --noEmit` y `npm run build` limpios.
- [ ] Prueba manual end-to-end completa (lista de arriba).
- [ ] Bóveda actualizada (Feature nuevo + Index + Changelog).
- [ ] `npx graphify update` corrido al final para que el grafo quede al día.

Fin del plan.
