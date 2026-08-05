# Plan: Precarga inteligente del D1 + fix botón "FINALIZAR REPORTE D1"

Carpeta de trabajo para (1) corregir el botón "FINALIZAR REPORTE D1" que no respondía al hacer clic, (2) resolver la identidad del oficial (Oficial ID/CRP/Sector/Personal) desde la sesión activa en vez de un query param roto, y (3) ampliar la precarga automática del formulario D1 con datos que el reporte de campo ya captura (delito, modus operandi, reportante, detenido(s)), más un fix de unicidad para IPH/Folio CU. Diseñado por Claude (arquitecto), a construir por DeepSeek (worker).

## Orden de trabajo

Las etapas son **secuenciales**. No avanzar a la siguiente sin validar los "Criterios de aceptación" de la anterior. Cada `etapa-N.md` es autocontenida: se puede pegar tal cual como instrucción de trabajo sin necesitar leer las demás (aunque todas parten del mismo contexto en `00-contexto.md`).

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Contexto del problema, decisiones ya tomadas con el usuario, mapa de archivos.
2. [etapa-1.md](etapa-1.md) — Fix del botón "FINALIZAR REPORTE D1": quitar el `required` roto en `delito`, agregar validación manual visible al avanzar del paso 3 al 4, corregir los `<select>` de tablet que solo tienen la opción "SÍ".
3. [etapa-2.md](etapa-2.md) — Identidad del oficial: resolver "Oficial ID", "CRP", "Sector" y "Personal" (Policía a Cargo/Denuncia/Firma D1/Ingresa CU) desde la sesión activa (`obtenerMiPerfil`), no desde un query param `oficialId` que ningún enlace real pasa.
4. [etapa-3.md](etapa-3.md) — Backend de precarga: ampliar `obtenerReporteCampoParaD1` (query + tipo + mapper) con `delito`, `modus_operandi`, `ofi_hay_detencion`, reportante, y corregir el bug de alias `calle`/`colonia`.
5. [etapa-4.md](etapa-4.md) — Nueva consulta de detenidos del reporte de campo (`ofi_detalles_asegurados`) para precargar nombre completo del/los detenido(s).
6. [etapa-5.md](etapa-5.md) — Propagar los campos nuevos al objeto `prefill` en `app/denuncia/nuevo/page.tsx`.
7. [etapa-6.md](etapa-6.md) — Consumir el prefill ampliado en `FormularioD1.tsx`: precargar `delito` real con fallback a `tipoIncidente`, agregar modus operandi a observaciones, nueva sub-sección de solo lectura "Reportante y Detenidos", default inteligente de `tipoEvento` según `hayDetencion`.
8. [etapa-7.md](etapa-7.md) — IPH / Folio CU: generación + verificación de unicidad en servidor, mismo patrón que `folioDenuncia`.
9. [etapa-8.md](etapa-8.md) — Bóveda: actualizar `Reporte Campo.md` con la precarga ampliada y agregar entrada en `Troubleshooting.md` sobre el patrón "required dentro de display:none bloquea submit silenciosamente".

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior "porque ya se está ahí". El propósito de segmentar es poder revisar y detener el trabajo en cualquier punto con una superficie de cambio pequeña y clara.
- No tocar archivos fuera de los listados explícitamente en cada etapa.
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo, y los criterios de aceptación específicos de esa etapa, antes de reportar la etapa como lista. **Detenerse y esperar confirmación del usuario antes de pasar a la siguiente etapa.**
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas, props), priorizar el código real y ajustar la implementación al mismo patrón — este plan describe el estado del código al momento de diseñarlo (2026-08-04), puede haber cambiado.
- Reutilizar patrones ya existentes en el proyecto (ver referencias de archivo en cada etapa) — no inventar convenciones nuevas de UI, capas de datos o naming.
- No confundir `components/denuncias/FormularioD1.tsx` (el D1 real, objeto de este plan) con el módulo `lib/monitorista/denuncia-service.ts` / `app/monitorista/denuncias/**` (gestión de evidencias, otro módulo sin relación) — ver `00-contexto.md`.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update` (regla del proyecto, ver `AGENTS.md` en la raíz del repo).
3. Actualizar bóveda (ver Etapa 8).
4. Prueba manual end-to-end en navegador (la hace el usuario, no el agente):
   - Con sesión de un oficial: navegar a `/denuncia/nuevo` (con y sin `reporteCampoId`) y confirmar que "Oficial ID", "CRP" y "Sector" ya NO llegan vacíos, y que "Policía a Cargo/Denuncia/Firma D1/Ingresa CU" reflejan al oficial de la sesión, no al del reporte de campo.
   - Crear un reporte de campo con detención y datos de reportante → escalar a D1 vía el link `/denuncia/nuevo?reporteCampoId=...` → confirmar que delito, modus operandi, reportante y detenido(s) aparecen precargados de solo lectura.
   - Avanzar los 4 pasos **sin** llenar `delito` a mano y confirmar que ahora aparece un error visible al intentar avanzar del paso 3 al 4 (ya no "el botón no hace nada").
   - Llenar todo y confirmar que "FINALIZAR REPORTE D1" sí inserta y redirige a `/oficial/despachos?exito=1&folio=...`.
   - Generar dos D1 el mismo día y confirmar que IPH/Folio CU no colisionan.
