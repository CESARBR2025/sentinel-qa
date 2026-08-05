# Etapa 6 — Consumir el prefill ampliado en `FormularioD1.tsx`

Leer primero `00-contexto.md` de esta misma carpeta. Esta etapa da por hecho que las etapas 1 (fix del botón) y 5 (prefill ampliado) ya se aplicaron — construir sobre esos cambios, no revertirlos. Nota: los campos "Policía a Cargo/Toma la Denuncia/Firma D1/Ingresa CU" (líneas ~403-407) ya usan `prefill?.nominaOficial`, que desde la etapa 2 viene del oficial de sesión — no requieren cambio en esta etapa.

## Objetivo

Mostrar en el formulario los datos nuevos que ya llegan en `prefill` desde la etapa 5: `delito` real (con fallback a `tipoIncidente`), `modusOperandi`, y una nueva sub-sección de solo lectura con reportante y detenido(s). Además, usar `hayDetencion` para un default más inteligente de `tipoEvento`.

## Archivo a modificar

`components/denuncias/FormularioD1.tsx` — único archivo de esta etapa.

## Cambios

### 1. Ampliar la interfaz `Prefill` (líneas ~39-58)

Agregar los campos nuevos:
```ts
interface Prefill {
  incidenteId: string | null;
  reporteCampoId: string | null
  lugarHecho: string
  coloniaHecho: string
  lat: number | null
  lng: number | null
  oficialId: string | null
  destino: string | null
  crp: string
  tipoIncidente: string | null
  descripcion: string | null
  folioReporteCampo: string | null
  sector: string | null
  nombreOficial: string | null
  nominaOficial: string | null
  fechaHoraInicioIncidente: string | null
  fechaHoraDespacho: string | null
  fechaReporteCampo: string | null
  delito: string | null
  modusOperandi: string | null
  hayDetencion: boolean
  nombreReportante: string | null
  telefonoReportante: string | null
  detenidos: { nombre: string | null; apellidoPaterno: string | null; apellidoMaterno: string | null }[]
}
```

### 2. `delito` con fallback real (línea ~376, dentro del bloque del paso 3)

Después del fix de la etapa 1 el campo ya no tiene `required` nativo. Cambiar el `defaultValue` para preferir el delito real sobre la categoría genérica:
```tsx
<SentinelField label="Delito" name="delito" defaultValue={prefill?.delito ?? prefill?.tipoIncidente ?? ''} />
```
(mantener cualquier prop de validación visual que haya quedado de la etapa 1, ej. `required` visual para el asterisco, y el manejo de `errorDelito`/`onChange` ya agregado ahí).

### 3. Modus operandi en observaciones (línea ~461, paso 4)

Textarea actual:
```tsx
<textarea name="observaciones" style={{ ...inputStyle, minHeight: '100px', paddingTop: '12px' }} placeholder="Escriba aquí..." defaultValue={prefill?.descripcion ?? ''} />
```
Componer el default con descripción + modus operandi cuando ambos existan, sin perder ninguno:
```tsx
<textarea
  name="observaciones"
  style={{ ...inputStyle, minHeight: '100px', paddingTop: '12px' }}
  placeholder="Escriba aquí..."
  defaultValue={[prefill?.descripcion, prefill?.modusOperandi ? `Modus operandi: ${prefill.modusOperandi}` : null].filter(Boolean).join('\n\n')}
/>
```

### 4. Nueva sub-sección de solo lectura "Reportante y Detenidos"

Agregar dentro del bloque del paso 3 (`display: step === 3 ? 'flex' : 'none'`, junto a la sección "DETALLES DEL EVENTO" ya existente, líneas ~363-386), una nueva `<section className="sentinel-panel">` que solo se renderiza si hay datos (`prefill?.nombreReportante || prefill?.telefonoReportante || (prefill?.detenidos?.length ?? 0) > 0`), mostrando:
- Nombre y teléfono del reportante (texto simple, de solo lectura — no son campos que se envíen al backend salvo que se decida agregarlos al INSERT, lo cual está fuera de alcance de este plan; son contexto informativo para quien captura, igual que el banner "REPORTE DE RECORRIDO VINCULADO" que ya existe en `app/denuncia/nuevo/page.tsx`).
- Lista de detenidos (`prefill.detenidos`), cada uno como `${nombre} ${apellidoPaterno ?? ''} ${apellidoMaterno ?? ''}`.trim().

Usar el mismo estilo visual que las demás secciones (`sectionTitleStyle`, `subPanelStyle` ya definidos al final del archivo) — no inventar una paleta nueva. Ejemplo de estructura (ajustar al gusto visual de las secciones vecinas, no es obligatorio copiar textual):
```tsx
{(prefill?.nombreReportante || prefill?.telefonoReportante || (prefill?.detenidos?.length ?? 0) > 0) && (
  <section className="sentinel-panel" style={{ borderLeftColor: '#64748b' }}>
    <h2 style={sectionTitleStyle}><Users size={18} /> REPORTANTE Y DETENIDOS (DEL REPORTE DE CAMPO)</h2>
    {(prefill?.nombreReportante || prefill?.telefonoReportante) && (
      <div style={{ fontFamily: 'Inter', fontSize: '13px', color: '#334155', marginBottom: 12 }}>
        Reportante: {prefill?.nombreReportante ?? 'N/D'} {prefill?.telefonoReportante ? `— Tel. ${prefill.telefonoReportante}` : ''}
      </div>
    )}
    {(prefill?.detenidos?.length ?? 0) > 0 && (
      <ul style={{ fontFamily: 'Inter', fontSize: '13px', color: '#334155', margin: 0, paddingLeft: 18 }}>
        {prefill!.detenidos.map((d, i) => (
          <li key={i}>{[d.nombre, d.apellidoPaterno, d.apellidoMaterno].filter(Boolean).join(' ')}</li>
        ))}
      </ul>
    )}
  </section>
)}
```

### 5. Default de `tipoEvento` según `hayDetencion` (línea ~369-375)

```tsx
<select name="tipoEvento" style={inputStyle}>
```
Cambiar a:
```tsx
<select name="tipoEvento" style={inputStyle} defaultValue={prefill?.hayDetencion ? "2" : "1"}>
```

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores (el error esperado de la etapa 5 sobre `Prefill` incompleto debe desaparecer aquí).
2. Con un `reporteCampoId` que tenga delito capturado en el reporte de campo: el campo "Delito" del paso 3 llega prellenado con el delito real, no con la categoría genérica.
3. Con un `reporteCampoId` que tenga reportante y detenido(s): la nueva sub-sección los muestra en el paso 3.
4. Con un `reporteCampoId` sin reportante ni detenidos: la sub-sección no se renderiza (o se renderiza vacía sin verse rota) — no debe mostrar "N/D" en todos lados de forma ruidosa.
5. `tipoEvento` llega en "2.- DETENIDO (FLAGRANCIA)" cuando `hayDetencion` es `true`, y en "1.- D1" cuando es `false` o no hay `reporteCampoId`.
6. El fix del botón de la etapa 1 sigue funcionando (no se reintrodujo el `required` nativo en `delito`).

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-7.md`.**
