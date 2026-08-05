---
name: tsc-error-diagnosis
description: >
  Diagnóstico de errores de TypeScript cuyo mensaje apunta a una línea que se ve
  correcta (TS2322, "Type 'unknown' is not assignable to type 'ReactNode'",
  "Type 'X' is not assignable to type 'Y'") en `tsc --noEmit` o `next build`.
  Use cuando el build/typecheck falle y la línea reportada parezca un
  `boolean && JSX.Element` válido, o en general cuando el código en la línea
  señalada no explique el error. También útil cuando el fix de lint
  (`no-explicit-any` → `Record<string, unknown>`) pueda haber cambiado el tipo
  de un valor usado como condición JSX.
---

# Diagnóstico de errores TS con línea reportada engañosa

## Cuándo aplica

- `tsc --noEmit` o `next build` falla con `TS2322` y la línea señalada se ve
  válida a simple vista.
- El mensaje dice `Type 'unknown' is not assignable to type 'ReactNode'` (u otro
  tipo) y el `{cond && (...)}` de esa línea es un `boolean` genuino.
- Se cambió un `as any` por `as Record<string, unknown>` para quitar un error
  de lint y luego el typecheck se rompió.

## Regla de oro

**NO confiar en la línea que reporta `tsc`/`next build`.** Cuando dentro del
mismo bloque de children JSX de un elemento hay varias condiciones
`{expr && (...)}`, TypeScript puede reportar el error en una línea distinta
a la real (una condición anterior, válida, en el mismo nivel del árbol JSX)
en vez de señalar la línea donde vive el `unknown`. El mecanismo interno
exacto no está confirmado — no asumas "siempre es la primera del bloque" ni
ningún otro patrón fijo; la única regla confiable es **no descartar el error
solo porque la línea señalada se vea válida**, y ampliar la búsqueda al resto
del bloque JSX (ver "Pasos de diagnóstico").

Verificado empíricamente en `components/fiscalia/ExpedienteView.tsx`
(2026-08-05): `tsc` señalaba la línea 157 (un `boolean && JSX` genuino,
confirmado no era la causa) y la causa real estaba ~80 líneas más abajo. Una
prueba aislada posterior (componente mínimo con 5 condiciones `{bool && JSX}`
al mismo nivel y el `unknown` real en la posición 3) mostró que `tsc` **sí**
señaló la línea correcta — así que "reporta la primera del bloque" no es una
regla general, es un caso observado una vez. Tratar la línea reportada como
una pista, no como un hecho.

## Causa raíz típica en este repo

Vistas que leen `raw: Record<string, unknown>` (queries SQL crudas, ej.
`ExpedienteExp.raw` en `lib/fiscalia/types.ts`) y usan un campo como condición
de render:

```tsx
{(r as Record<string, unknown>).pd_id && (   // ← roto: unknown && JSX
  <div>...</div>
)}
```

- `any && JSX` = `any` → asignable a `ReactNode` (por eso el código con
  `as any` compilaba).
- `unknown && JSX` = `unknown` → NO asignable a `ReactNode` → TS2322.
- `boolean` SÍ es ReactNode (verificado en `node_modules/@types/react/index.d.ts`
  de este repo, `@types/react@19.2.17`: `type ReactNode = ReactElement | string
  | number | bigint | Iterable<ReactNode> | ReactPortal | boolean | null |
  undefined | ...`). Si se vuelve a citar este tipo en el futuro, verificar de
  nuevo contra el `node_modules` real del proyecto — cambia entre versiones de
  `@types/react` y no vale la pena memorizarlo.

## Pasos de diagnóstico (en orden)

1. **Descartar la variable de la línea reportada** sin adivinar:
   aislarla con `const _debug: boolean = variable` justo después de su
   definición y volver a correr `npx tsc --noEmit`. Si no rompe, la variable
   NO es la causa — seguir buscando. Revertir el debug antes de cerrar.

2. **Buscar el patrón que produce `unknown && JSX`** en el mismo archivo:

   ```bash
   grep -n "as Record<string, unknown>).*&&" components/.../*.tsx
   grep -n "unknown.*&&" components/.../*.tsx
   ```

   Cada match es un candidato: condiciones `&&` sobre valores casteados a
   `unknown`/`Record<string, unknown>` sin `Boolean(...)`/`!!` envolviendo.

3. **Comparar con usos correctos del MISMO campo** en el archivo: si el mismo
   campo ya se usa con `Boolean(...)` en otro render, ese es el fix idiomático
   confirmado (en `ExpedienteView`, el `pd_id` de la línea 263 ya estaba bien
   y reveló el fix para el de la 236).

4. **Aplicar el fix mínimo**: envolver en `Boolean(...)`.

```diff
- {(r as Record<string, unknown>).pd_id && (
+ {Boolean((r as Record<string, unknown>).pd_id) && (
```

5. **Verificar**: `npx tsc --noEmit` limpio y `npx eslint <archivo>`. (Probado:
   `--incremental false` NO cambia la línea que reporta el error en este tipo
   de caso — el `tsconfig.tsbuildinfo` no es la causa de la línea engañosa,
   descartado. No hace falta agregar esa flag como parte del diagnóstico.)

## Prevención

Al usar un campo de un objeto tipado `Record<string, unknown>` como condición
de render JSX, envolver SIEMPRE en `Boolean(...)` — nunca dejar el valor
`unknown` crudo antes del `&&`.

Al corregir un `no-explicit-any` reemplazando `as any` por
`as Record<string, unknown>` o similar, revisar los usos del valor: el cambio
de `any` → `unknown` puede romper asignaciones/condiciones que antes
compilaban (lint pasa, tsc no). Correr `npx tsc --noEmit` después de ese tipo
de fix de lint, no solo eslint.

## Referencia

Caso documentado en `boveda/🗺 Roadmap/Troubleshooting.md` →
"Error TS2322 'Type 'unknown' is not assignable to type 'ReactNode'" — pero la
línea que señala TS no es la causa real.
