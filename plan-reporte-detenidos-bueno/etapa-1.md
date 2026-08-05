# Etapa 1 — Migración: campos biográficos + CURP en `ofi_detalles_asegurados`

Leer primero `00-contexto.md`.

## Objetivo

Agregar a `ofi_detalles_asegurados` las columnas que hoy faltan para armar la ficha oficial: apodo, CURP, fecha de nacimiento, género, originario, estado civil, escolaridad, ocupación, rasgos particulares.

## Archivo a crear

`lib/db/manual-migrations/0037_datos_biograficos_detenido.sql`

```sql
-- ofi_detalles_asegurados: campos biográficos del detenido para la Ficha UDAI
-- (FORMATO FICHA DE DETENIDOS.pptx) que hoy no se capturan. Los captura Fiscalía
-- en el mismo formulario donde ya captura domicilio (FormularioAsegurado.tsx).

ALTER TABLE ofi_detalles_asegurados
  ADD COLUMN IF NOT EXISTS apodo character varying,
  ADD COLUMN IF NOT EXISTS curp character varying(18),
  ADD COLUMN IF NOT EXISTS fecha_nacimiento date,
  ADD COLUMN IF NOT EXISTS genero character varying,
  ADD COLUMN IF NOT EXISTS originario character varying,
  ADD COLUMN IF NOT EXISTS estado_civil character varying,
  ADD COLUMN IF NOT EXISTS escolaridad character varying,
  ADD COLUMN IF NOT EXISTS ocupacion character varying,
  ADD COLUMN IF NOT EXISTS rasgos_particulares text;

CREATE INDEX IF NOT EXISTS idx_detalles_asegurados_curp ON ofi_detalles_asegurados (curp) WHERE curp IS NOT NULL;
```

Todas las columnas nullable — es una tabla con datos históricos, no se puede exigir NOT NULL retroactivo. El índice en `curp` es para la búsqueda de antecedentes de la Etapa 5.

## Verificación

1. Aplicar la migración contra la BD real (`DATABASE_URL` en `.env`) — puedes usar un script puntual con el cliente `pg` igual que el resto del proyecto (ver `lib/db.ts` para el patrón de conexión), o el cliente que uses para correr SQL. Bórralo al terminar si es un script temporal, no lo dejes commiteado.
2. Confirmar con `information_schema.columns` que las 9 columnas nuevas existen en `ofi_detalles_asegurados`.
3. `npx tsc --noEmit` (no debería cambiar nada todavía, es solo la migración).

## Criterios de aceptación

- Migración aplicada contra la BD real, columnas confirmadas.
- No se tocó ninguna fila existente (solo `ADD COLUMN`, sin `UPDATE`).
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 2.**
