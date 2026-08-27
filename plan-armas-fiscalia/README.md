# Plan: Captura estructurada de Armas Aseguradas en Fiscalía → auto-sync a Formato N

## Contexto

Ver [00-contexto.md](00-contexto.md) para el diagnóstico completo (verificado
contra la BD real), la decisión de negocio ya confirmada con el usuario, y los
patrones exactos del código existente que este plan replica.

Resumen: el paso 7 de Formato N ("Armas de Fuego Aseguradas") es 100% manual
porque no existe, en ningún lado del sistema, una fuente estructurada de tipo
de arma/marca/matrícula/calibre. Este plan crea esa infraestructura en
Fiscalía (donde el agente ya sube fotos del arma) y la sincroniza a Formato N
con el mismo patrón `origen_*_id` + `UPSERT` que ya se usa para Eventos y RND.

## Etapas

| # | Etapa | Archivo | Qué construye |
|---|-------|---------|----------------|
| 1 | Migración BD | [etapa-1.md](etapa-1.md) | Tabla `fiscalia_armas_aseguradas` + columna `origen_fiscalia_arma_id` en `formato_n_armas_aseguradas` |
| 2 | Backend Fiscalía | [etapa-2.md](etapa-2.md) | Tipos/mapper/repository/service/actions en `lib/fiscalia/`, calcando el patrón de `AntecedenteExterno` |
| 3 | UI Fiscalía | [etapa-3.md](etapa-3.md) | `components/fiscalia/ArmasAseguradas.tsx`, montado en `FormularioAsegurado.tsx` |
| 4 | Sync a Formato N | [etapa-4.md](etapa-4.md) | `sincronizarArmasDelDia` en `lib/reportes/formato-n-armas-aseguradas-service.ts` + endpoint + wiring en el store |
| 5 | UI Formato N paso 7 | [etapa-5.md](etapa-5.md) | Tabla de armas auto-sincronizadas en `PasoArmas`, form manual conservado como respaldo |
| 6 | Documentación + verificación | [etapa-6.md](etapa-6.md) | Bóveda al día + prueba end-to-end completa |

Ejecutar en orden estricto — cada etapa depende de que la anterior esté
verificada y sus criterios de aceptación cumplidos. **No combinar etapas ni
adelantar trabajo de una etapa posterior.**

## Reglas para quien construye

- Leer este README completo, y **cada archivo de etapa completo antes de
  tocar su código** — no trabajar solo con el resumen de la tabla de arriba.
- Antes de tocar cualquier vista (Etapa 3, Etapa 5), leer `DESIGN.md`
  completo (fuente única de tokens/patrones visuales de este proyecto) — no
  reimplementar estilos ni duplicar tokens.
- La migración de la Etapa 1 se aplica contra una BD real remota
  (`DATABASE_URL` no es localhost) — **confirmar con el usuario antes de
  ejecutar cualquier DDL contra ella**, aunque sea aditivo.
- Cada script tsx temporal usado para verificar contra la BD real (Etapas 1,
  2, 4) se borra del repo antes de cerrar esa etapa — no se commitea.
- `npx tsc --noEmit` después de cada etapa, `npm run build` completo al
  cerrar la Etapa 6.
- Reportar el resultado **etapa por etapa**, y esperar confirmación antes de
  avanzar a la siguiente — no encadenar varias etapas sin pausar.

## Fuera de alcance (explícito)

- Arma blanca (`ofi_hay_arma_blanca`) — Formato N paso 7 solo pide arma de
  fuego.
- Tocar `FotosExpedienteSection.tsx` o el flujo `/fiscalia/solicitudes/[solicitudId]`.
- Vincular la foto de `evidencias_detenido` con la fila estructurada de arma.
- Cambiar la lógica de negocio de FGE/FGR/Eventos/RND (ya corregida en la
  sesión previa a este plan).
- Migrar "Tipo de Arma" a un catálogo cerrado — se mantiene texto libre, como
  ya lo era en el form manual actual.

## Checklist general final

Ver la sección "Verificación end-to-end completa" y "Checklist final de
cierre del plan" en [etapa-6.md](etapa-6.md).

El prompt completo para que DeepSeek ejecute las 6 etapas está en
[PROMPT-DEEPSEEK.md](PROMPT-DEEPSEEK.md).
