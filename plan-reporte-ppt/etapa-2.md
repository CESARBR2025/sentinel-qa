# Etapa 2 — Corregir el bug de fotos mal etiquetadas/mezcladas en el PPT

Leer primero `00-contexto.md`. Requiere Etapa 1 ya confirmada por el usuario.

## Objetivo

Una vez que un detenido es visible en la tabla (Etapa 1), su slide del PPT debe mostrar exactamente sus 3 fotos de persona (`frontal`, `derecho`, `izquierdo`), en ese orden y con esa etiqueta — nunca una foto de `objeto` (arma/vehículo/droga/etc.) ni una foto de otro detenido del mismo reporte.

## Archivo a tocar

- `lib/reporte-detenidos/ppt-service.ts`

## Cambio

Dentro de `addDetenidoSlide()`, reemplazar el query actual:

```ts
const evs = await query<Record<string, unknown>>(
  `SELECT url_archivo, tipo_foto FROM (
     SELECT url_archivo, tipo_foto, ROW_NUMBER() OVER (PARTITION BY tipo_foto ORDER BY creado_en DESC) as rn
     FROM evidencias_detenido
     WHERE reporte_campo_id = $1
   ) sub WHERE rn = 1
   ORDER BY tipo_foto`, [d.id],
)
```

por:

```ts
const evs = await query<Record<string, unknown>>(
  `SELECT url_archivo, tipo_foto FROM (
     SELECT url_archivo, tipo_foto, ROW_NUMBER() OVER (PARTITION BY tipo_foto ORDER BY creado_en DESC) as rn
     FROM evidencias_detenido
     WHERE reporte_campo_id = $1
       AND tipo_contenido = 'detenido'
       AND detenido_index = 0
       AND tipo_foto IN ('frontal', 'derecho', 'izquierdo')
   ) sub WHERE rn = 1
   ORDER BY CASE tipo_foto WHEN 'frontal' THEN 0 WHEN 'derecho' THEN 1 WHEN 'izquierdo' THEN 2 END`,
  [d.id],
)
```

Dos cambios, ambos necesarios:

1. **Filtro** (`tipo_contenido = 'detenido' AND detenido_index = 0 AND tipo_foto IN (...)`): excluye fotos de objetos (`vehiculo`, `arma`, `droga`, etc.) y, si hubiera 2+ detenidos en el mismo reporte, excluye las fotos de cualquier detenido que no sea el índice 0 (consistente con la Etapa 1 y con la limitación documentada de multi-detenido en `00-contexto.md`).
2. **Orden explícito** (`CASE tipo_foto WHEN ... END` en vez de `ORDER BY tipo_foto` alfabético): garantiza que la posición 0 del arreglo siempre sea `frontal`, la 1 siempre `derecho`, la 2 siempre `izquierdo` — para que coincida con el mapa de etiquetas fijo `{0: 'Frontal', 1: 'Derecho', 2: 'Izquierdo'}` que ya existe más abajo en la misma función (no lo toques, ya es correcto una vez que el orden de entrada es el correcto).

No cambies nada más de la función: `descargarFoto()`, `getAspectRatio()`, el cálculo de anchos/posiciones y el resto del layout del slide ya son correctos y no dependen de este bug.

## Verificación

1. `npx tsc --noEmit`.
2. Generar el PPT manualmente (llamando al endpoint o desde la UI una vez desplegado) para la denuncia de prueba del contexto y confirmar visualmente que las 3 fotos del slide corresponden y están etiquetadas correctamente (frontal=frontal, derecho=derecho, izquierdo=izquierdo) y que no aparece la foto de `vehiculo`.

## Criterios de aceptación

- El query de `addDetenidoSlide()` filtra por `tipo_contenido`, `detenido_index` y `tipo_foto`, y ordena con el `CASE` explícito.
- `npx tsc --noEmit` limpio.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 3.**
