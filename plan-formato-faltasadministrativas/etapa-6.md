# Etapa 6 — Bóveda y verificación final

Leer primero `00-contexto.md`. Depende de la Etapa 5. Última etapa.

## Objetivo

Cerrar el checklist T2 de `AGENTS.md`: documentar el módulo nuevo en la bóveda y correr la verificación completa.

## Archivo a crear: `boveda/🧩 Features/Formatos UDAI.md`

Usar `boveda/🧩 Features/Feature Example.md` como plantilla de formato (si existe) o calcar la estructura de `boveda/🧩 Features/Reporte de Detenidos.md` (Propósito, Flujo mermaid, Quién lo usa, Componentes involucrados, BD, Vistas, Reglas de negocio, Limitaciones conocidas). Contenido mínimo a incluir:

- Propósito: generar el Excel oficial UDAI "Formato Faltas Administrativas" a partir de `iph_detenidos`, sin captura nueva.
- Tabla de mapeo columna Excel → columna BD (copiar la tabla de `00-contexto.md`).
- Los 3 GAP conocidos (`HORA DE SALIDA`, `FOLIO TABLET`, segundo `OFICIAL QUE REMITE`) como **Limitaciones conocidas (aceptadas, no bugs)** — igual que la sección equivalente en `Reporte de Detenidos.md`.
- Componentes involucrados: `lib/formatos-udai/*`, `app/formatos-udai/*`, `app/api/formatos-udai/faltas-administrativas/exportar/route.ts`, `components/formatos-udai/BotonExportarExcel.tsx`.

## Archivo a modificar: `boveda/🧩 Features/Index.md`

Agregar la entrada "Formatos UDAI" con una línea de descripción, siguiendo el formato de las entradas existentes.

## Verificación final (todas las etapas juntas)

1. `npx tsc --noEmit` — sin errores en todo el proyecto.
2. `npm run build` — sin errores.
3. `npx graphify update`.
4. Confirmar en `git status` / `git diff` que no se tocó ningún archivo fuera de lo listado en las Etapas 1-6 (especialmente: no se tocó `formAnalisis.tsx`, `useAnalistaForm.ts`, `/reporte-detenidos`, `/analisis/iph`).

## Criterios de aceptación

- Bóveda refleja el módulo nuevo con las mismas convenciones que el resto de `🧩 Features/`.
- `npx tsc --noEmit` y `npm run build` limpios.
- El flujo completo funciona end-to-end en navegador (lo confirma el usuario): `/agente_reportes` → "Formatos UDAI" → "Formato Faltas Administrativas" → tabla con datos reales → "Exportar XLSX" → archivo descargado con encabezados idénticos al oficial.
