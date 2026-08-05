# Etapa 2 — Fiscalía captura los datos biográficos del detenido

Leer primero `00-contexto.md`. Requiere Etapa 1 confirmada.

## Objetivo

Fiscalía captura apodo, CURP, fecha de nacimiento, género, originario, estado civil, escolaridad, ocupación y rasgos particulares en el mismo formulario donde ya captura domicilio (`FormularioAsegurado.tsx`), y quedan visibles en modo lectura (`DetallesAseguradoView.tsx` si aplica).

## Archivos a tocar

- `lib/fiscalia/types.ts`
- `lib/fiscalia/mapper.ts`
- `lib/fiscalia/repository.ts`
- `components/fiscalia/FormularioAsegurado.tsx`

## Cambios

### `lib/fiscalia/types.ts`

Extender `DetenidoDireccionInput` y `DetalleDetenidoGuardado` (ambos, mismos 9 campos nuevos):

```ts
export interface DetenidoDireccionInput {
  nombreDetenido: string
  apPaterno: string
  apMaterno: string
  calle: string
  colonia: string
  numero: string
  codPostal: string
  latitud: number | null
  longitud: number | null
  apodo: string
  curp: string
  fechaNacimiento: string | null   // 'YYYY-MM-DD' o null
  genero: string
  originario: string
  estadoCivil: string
  escolaridad: string
  ocupacion: string
  rasgosParticulares: string
}

export interface DetalleDetenidoGuardado {
  id: string
  nombreDetenido: string
  apPaterno: string | null
  apMaterno: string | null
  calle: string | null
  colonia: string | null
  numero: string | null
  codPostal: string | null
  latitud: number | null
  longitud: number | null
  apodo: string | null
  curp: string | null
  fechaNacimiento: string | null
  genero: string | null
  originario: string | null
  estadoCivil: string | null
  escolaridad: string | null
  ocupacion: string | null
  rasgosParticulares: string | null
}
```

### `lib/fiscalia/mapper.ts`

En `rowToDetalleDetenidoGuardado`, agregar el mapeo de las 9 columnas nuevas (snake_case → camelCase, mismo patrón `str()` que el resto de la función):

```ts
apodo: str(row.apodo),
curp: str(row.curp),
fechaNacimiento: row.fecha_nacimiento ? String(row.fecha_nacimiento).slice(0, 10) : null,
genero: str(row.genero),
originario: str(row.originario),
estadoCivil: str(row.estado_civil),
escolaridad: str(row.escolaridad),
ocupacion: str(row.ocupacion),
rasgosParticulares: str(row.rasgos_particulares),
```

### `lib/fiscalia/repository.ts`

`guardarDetenidosDirecciones()` (línea ~386-419): el `INSERT` dentro del `for` gana las 9 columnas nuevas:

```ts
await client.query(
  `INSERT INTO ofi_detalles_asegurados
   (reporte_campo_id, nombre_detenido, ap_paterno_detenido, ap_materno_detenido,
    calle, colonia, numero, cod_postal, latitud, longitud,
    apodo, curp, fecha_nacimiento, genero, originario, estado_civil, escolaridad, ocupacion, rasgos_particulares)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
  [
    reporteCampoId,
    d.nombreDetenido,
    d.apPaterno || null,
    d.apMaterno || null,
    d.calle || null,
    d.colonia || null,
    d.numero || null,
    d.codPostal || null,
    d.latitud,
    d.longitud,
    d.apodo || null,
    d.curp || null,
    d.fechaNacimiento || null,
    d.genero || null,
    d.originario || null,
    d.estadoCivil || null,
    d.escolaridad || null,
    d.ocupacion || null,
    d.rasgosParticulares || null,
  ],
);
```

`obtenerDetenidosGuardados()` ya hace `SELECT *`, no necesita cambio — el mapper (arriba) ya toma las columnas nuevas de ese `*`.

### `components/fiscalia/FormularioAsegurado.tsx`

1. `nombresIniciales` (línea ~259-272) y el estado `detenidosDir`: agregar los 9 campos nuevos leyendo de `data.detenidosDirecciones[i]` con el mismo patrón `guardado?.campo ?? ''` (fechaNacimiento con `?? null`).
2. `handleGuardar()` (línea ~304-331): el `payload` gana los 9 campos nuevos desde `detenidosDir[i]`.
3. Nueva sección de inputs por detenido (dentro del `data.detenidos.map`, junto al bloque de Nombre/ApPaterno/ApMaterno que ya existe ~línea 494-525): agrega un `grid-3` (mismo patrón que el bloque de nombre) con:
   - Apodo (text input)
   - CURP (text input, `maxLength={18}`, `style={{ textTransform: 'uppercase' }}`)
   - Fecha de Nacimiento (`type="date"`)
   - Género (select: Masculino / Femenino / Otro)
   - Originario (text input, placeholder "Ej. Querétaro")
   - Estado Civil (select: Soltero / Casado / Unión Libre / Divorciado / Viudo)
   - Escolaridad (select: Ninguna / Primaria / Secundaria / Preparatoria / Universidad)
   - Ocupación (text input)
   - Rasgos Particulares (textarea o input de texto largo, placeholder "Ej. Tatuaje en el brazo derecho")

   Reutiliza `inputSx` para inputs de texto y el mismo patrón de `<select>` que ya exista en el proyecto (revisa otro formulario del mismo módulo, ej. `FormularioD1.tsx`, para copiar el estilo de `<select>` si no hay uno ya en este archivo). Todos son opcionales — no hay validación obligatoria (el ejemplo real del formato oficial tiene "Apodo" vacío).
4. Si `readOnly` es `true` (detenido ya guardado), estos campos se muestran igual que el resto en modo lectura (`disabledSx`, mismo patrón que Colonia/Calle/Número en el bloque `readOnly ? (...)`).

## Verificación

1. `npx tsc --noEmit`.
2. Prueba manual (la hace el usuario en su navegador): capturar un detenido de prueba en Fiscalía con estos 9 campos, guardar, y confirmar que persisten al recargar (modo lectura).

## Criterios de aceptación

- Los 9 campos se capturan, guardan y se muestran en modo lectura.
- `npx tsc --noEmit` limpio.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 3.**
