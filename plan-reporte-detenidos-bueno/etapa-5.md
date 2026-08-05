# Etapa 5 — Antecedentes automáticos (búsqueda local por CURP / nombre)

Leer primero `00-contexto.md`. Requiere Etapa 2 confirmada (no depende de las Etapas 3-4, pero sigue el orden del plan).

## Objetivo

Dado un detenido (CURP si existe, si no nombre completo), buscar en la propia BD sus delitos y faltas administrativas previos — de reportes **distintos** al actual — para armar la sección "Antecedentes" de la ficha.

## Archivo a tocar

`lib/reporte-detenidos/repository.ts`

## Cambio

Nueva función:

```ts
export interface AntecedenteLocal {
  fecha: string | null
  descripcion: string
  lugar: string | null
}

export async function obtenerAntecedentesLocales(
  reporteCampoIdActual: string,
  curp: string | null,
  nombreCompleto: string,
): Promise<{ delitos: AntecedenteLocal[]; faltas: AntecedenteLocal[] }> {
  const usarCurp = !!curp
  const condicionIdentidad = usarCurp
    ? `da.curp = $2`
    : `LOWER(TRIM(CONCAT(da.nombre_detenido, ' ', COALESCE(da.ap_paterno_detenido, ''), ' ', COALESCE(da.ap_materno_detenido, '')))) = LOWER(TRIM($2))`

  const result = await query<Record<string, unknown>>(
    `SELECT DISTINCT rc.id, rc.delito, rc.falta_administrativa, rc.created_at, rc.ofi_colonia
     FROM ofi_detalles_asegurados da
     INNER JOIN ofi_reportes_campo rc ON rc.id = da.reporte_campo_id
     WHERE rc.id <> $1
       AND ${condicionIdentidad}
     ORDER BY rc.created_at DESC`,
    [reporteCampoIdActual, usarCurp ? curp : nombreCompleto],
  )

  const delitos: AntecedenteLocal[] = []
  const faltas: AntecedenteLocal[] = []
  for (const row of result.rows) {
    const fecha = row.created_at ? new Date(row.created_at as string).toISOString().slice(0, 10) : null
    const lugar = row.ofi_colonia ? String(row.ofi_colonia) : null
    if (row.delito) delitos.push({ fecha, descripcion: String(row.delito), lugar })
    if (row.falta_administrativa) faltas.push({ fecha, descripcion: String(row.falta_administrativa), lugar })
  }
  return { delitos, faltas }
}
```

Notas, no te las saltes:

- **`usarCurp` decide la estrategia completa, no se combinan.** Si hay CURP, se usa CURP exclusivamente (más confiable, evita falsos positivos por homónimos). Solo si no hay CURP se cae a nombre completo — que puede dar falsos positivos/negativos (dos personas con el mismo nombre, o el mismo nombre capturado con variaciones de mayúsculas/espacios/orden de apellidos). Esto es una limitación conocida del fallback, no un bug — documentarla en la Etapa 8 (bóveda), no intentar resolverla aquí (ej. no implementes fuzzy matching).
- `rc.id <> $1` excluye el reporte actual — si no, el propio registro que se está armando aparecería como su propio antecedente.
- Un mismo `rc.id` puede aportar tanto a `delitos` como a `faltas` si ambos campos están llenos (pasa en el ejemplo real: un reporte puede tener delito Y falta administrativa a la vez). Eso es correcto, no lo evites.
- No agregues aquí el cruce con `antecedentes_externos_detenido` (Etapa 3) — esta función es solo la parte "local automática". Se combinan en la Etapa 6.

## Verificación

1. `npx tsc --noEmit`.
2. Prueba puntual contra la BD real: toma dos `ofi_reportes_campo` de prueba con el mismo `ofi_detalles_asegurados.nombre_detenido` (o créalos), confirma que `obtenerAntecedentesLocales` del segundo encuentra al primero como antecedente y no se antecede a sí mismo.

## Criterios de aceptación

- La función prioriza CURP y cae a nombre completo solo si no hay CURP.
- No se autoincluye el reporte actual.
- `npx tsc --noEmit` limpio.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 6.**
