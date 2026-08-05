# Etapa 1 — Fix del botón "FINALIZAR REPORTE D1"

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

El botón "FINALIZAR REPORTE D1" no responde al hacer clic cuando el campo `delito` está vacío. Causa raíz confirmada: `delito` tiene `required` nativo y vive en un bloque `display:none` cuando el step activo es distinto de 3; el navegador bloquea el `submit` en silencio por un `required` inválido no enfocable. Se corrige quitando el `required` nativo de ese campo y agregando validación manual visible al intentar avanzar del paso 3 al 4.

## Archivo a modificar

`components/denuncias/FormularioD1.tsx` — único archivo de esta etapa.

## Cambios

### 1. Quitar el `required` nativo roto

Línea 376 actual:
```tsx
<SentinelField label="Delito" name="delito" required defaultValue={prefill?.tipoIncidente ?? ''} />
```
Quitar el atributo `required` (la validación pasa a ser manual, ver punto 2). El campo sigue mostrando el asterisco visual si se quiere mantener la señal de obligatorio — revisar el componente `SentinelField` (línea 21-37): el asterisco rojo depende de la prop `required`, así que si se quita por completo se pierde la señal visual. Alternativa: mantener el prop `required` para el asterisco visual pero sin que sea el atributo HTML nativo (renombrar a algo como `requiredVisual` o separar la responsabilidad) — usar el criterio que mejor encaje con el resto del componente sin sobre-diseñar; lo mínimo indispensable es que el navegador ya no trate ese `<input>` como `required` nativo mientras está oculto.

### 2. Validación manual visible al avanzar del paso 3 al 4

El botón "SIGUIENTE"/"FINALIZAR" (líneas 475-494) hoy solo hace `store.setStep(step + 1)` sin ninguna validación:
```tsx
<button
  type={step === 4 ? "submit" : "button"}
  onClick={(e) => {
    if (step < 4) {
      e.preventDefault();
      store.setStep(step + 1);
    }
  }}
  ...
```

Agregar: si `step === 3` (el usuario está por avanzar al paso 4, donde vive `delito`), validar que el input `delito` tenga valor antes de permitir `setStep(4)`. Como el campo es un input no controlado (usa `defaultValue`, no `value`+`onChange`), la forma más simple de leer su valor actual sin reescribir el campo a controlado es vía `e.currentTarget.form` (el botón está dentro del `<form>`) y `FormData` o `form.elements.namedItem('delito')`.

Si está vacío: no avanzar, mostrar un mensaje de error visible cerca del campo (nuevo estado local `const [errorDelito, setErrorDelito] = useState(false)` o similar, renderizado condicionalmente debajo del `SentinelField` de `delito` en el bloque del paso 3, con texto tipo "Debes indicar el delito antes de continuar."). Limpiar el error cuando el usuario escribe en el campo (`onChange` del input, o simplemente al reintentar avanzar).

No hace falta un sistema de validación genérico para todos los campos — el único caso real hoy es `delito` (ver `00-contexto.md`, se descartaron los demás `required` porque siempre tienen valor). No sobre-construir.

### 3. Fix de los `<select>` de tablet (bug encontrado en el mismo archivo)

Líneas 408-419, ambos `<select>` solo tienen una opción:
```tsx
<select name="requirioTablet" style={inputStyle} defaultValue="true">
  <option value="true">SÍ</option>
</select>
```
y el mismo patrón para `funcionabaTablet`. Agregar la opción faltante:
```tsx
<select name="requirioTablet" style={inputStyle} defaultValue="true">
  <option value="true">SÍ</option>
  <option value="false">NO</option>
</select>
```
Igual para `funcionabaTablet`.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores nuevos.
2. Al navegar a `/denuncia/nuevo` sin `reporteCampoId` (sin prefill de `delito`), avanzar hasta el paso 3, dejar `delito` vacío, e intentar avanzar al paso 4: debe verse un mensaje de error visible y el step NO debe avanzar.
3. Llenando `delito` y avanzando: debe llegar al paso 4 sin error, y el botón "FINALIZAR REPORTE D1" debe disparar el `POST /api/reportes-d1` (verificar en Network del navegador o `console.log("SUBMIT", step)` que ya existe en el código).
4. Los selects de "¿Se requirió Tablet?" y "¿Funcionaba Tablet?" deben tener ambas opciones SÍ/NO.
5. No modificar ningún otro archivo.

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-2.md`.**
