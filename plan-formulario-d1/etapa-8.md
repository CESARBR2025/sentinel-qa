# Etapa 8 — Bóveda

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

Dejar documentado en la bóveda lo que cambió, siguiendo la convención ya existente del proyecto (ver `AGENTS.md` — checklist post-cambio T2).

## Archivos a modificar

- `boveda/🧩 Features/Reporte Campo.md`
- `boveda/🗺 Roadmap/Troubleshooting.md`

## Cambios

### 1. `boveda/🧩 Features/Reporte Campo.md`

Ya tiene una sección "Campos 'quién' del D1" (cerca de la línea 26) documentando el fix histórico de `policia_a_cargo`/`nomina_mando`/etc. Agregar un párrafo nuevo en el mismo estilo (fecha, qué se agregó, por qué, archivos tocados) describiendo:
- La ampliación de `obtenerReporteCampoParaD1` con `delito`, `modus_operandi`, `ofi_hay_detencion`, reportante.
- El fix del bug de alias `calle`/`colonia` que hacía que esos dos campos siempre llegaran `null` en la precarga.
- La nueva consulta `obtenerDetenidosPorReporteCampo` para precargar detenidos en el D1.
- El fix de identidad del oficial: "Oficial ID"/"CRP"/"Sector"/"Personal" ahora se resuelven desde `obtenerMiPerfil(session.user.id)` (oficial de la sesión activa) en vez de un query param `oficialId` que ningún enlace real pasaba (por lo que esos campos siempre llegaban vacíos) o del oficial que registró el reporte de campo.
- El fix del botón "FINALIZAR REPORTE D1" (causa raíz: `required` nativo en campo oculto por `display:none` bloqueaba el submit en silencio) — vale la pena registrar la causa raíz aquí porque es un patrón que puede repetirse en otros formularios stepper del proyecto.
- La generación única de IPH/Folio CU en servidor (mismo patrón que `folioDenuncia`).

No reescribir el archivo completo — insertar el párrafo nuevo manteniendo el resto intacto, mismo estilo de prosa densa que ya usa el archivo (ver ejemplos existentes).

### 2. `boveda/🗺 Roadmap/Troubleshooting.md`

Agregar una entrada nueva (revisar el formato de las entradas existentes en este archivo y seguirlo) documentando el patrón de bug encontrado, para que no se repita:

> **Formularios stepper con un solo `<form>` y pasos ocultos vía `display:none`**: si un campo `required` nativo vive en un paso distinto al activo, el navegador bloquea el `submit` en silencio (sin disparar `onSubmit`, sin mostrar error) cuando ese campo queda inválido, porque un elemento oculto no es "focusable" para mostrar el mensaje de validación nativo. Síntoma reportado: "el botón no hace nada". Encontrado en `components/denuncias/FormularioD1.tsx` (campo `delito`, paso 3, bloqueaba el botón "FINALIZAR REPORTE D1" del paso 4). Fix: no usar `required` nativo en campos que puedan quedar ocultos entre pasos; validar manualmente antes de avanzar de paso y mostrar el error en el paso donde el campo es visible. Revisar si otros formularios stepper del proyecto (`FormularioRecorrido.tsx`, etc.) tienen el mismo patrón.

## Criterios de aceptación

1. Ambos archivos de bóveda actualizados, sin romper el formato/estructura existente del resto del documento.
2. `npx graphify update` corrido al final (regla del proyecto).
3. `npx tsc --noEmit` y `npm run build` sin errores — checklist general de `README.md` de esta carpeta.

**Esta es la última etapa. Al terminar, correr el checklist general de `README.md` completo y reportar al usuario.**
