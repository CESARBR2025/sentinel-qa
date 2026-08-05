# Etapa 3 — Mostrar el folio D1 en la tabla de `/reporte-detenidos`

Leer primero `00-contexto.md`. Requiere Etapa 1 ya confirmada por el usuario.

## Objetivo

Ahora que `DetenidoCompleto` trae `folioDenuncia` e `iph` (Etapa 1), la tabla debe mostrar el folio D1 como identificador principal — es el folio con el que Fiscalía/Juzgado y el usuario final identifican el caso (`SSPM/D1/...`), no el folio interno de reporte de campo (`SSPM/CAM/...`).

## Archivo a tocar

- `app/reporte-detenidos/page.tsx`

## Cambio

1. En el `<thead>`, la columna `Folio` pasa a llamarse `Folio D1` y se agrega una columna `IPH` justo después:

```tsx
{['Nombre', 'Folio D1', 'IPH', 'Evento', 'Delitos', 'Falta Administrativa', 'Modus Operandi', 'Fecha'].map(h => (
```

(el `colSpan` del mensaje "No hay detenidos..." pasa de `7` a `8`)

2. En el `<tbody>`, la celda de folio usa `d.folioDenuncia` y se agrega la celda de IPH:

```tsx
<td style={{ padding: '10px 16px' }}>{d.nombre}</td>
<td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{d.folioDenuncia || '—'}</td>
<td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{d.iph || '—'}</td>
<td style={{ padding: '10px 16px' }}>{d.evento}</td>
```

(el resto de columnas — Delitos, Falta Administrativa, Modus Operandi, Fecha — no cambian)

No toques `d.folio` (folio de reporte de campo) — se sigue calculando en el repository por si se necesita después, solo deja de mostrarse en esta tabla. No lo elimines del type ni del repository.

## Verificación

1. `npx tsc --noEmit`.
2. Confirmar visualmente (el usuario lo hace en su navegador, no tú) que la tabla muestra `SSPM/D1/20260805/AIO0V2` en la columna Folio D1 para el registro de prueba.

## Criterios de aceptación

- La tabla muestra 8 columnas: Nombre, Folio D1, IPH, Evento, Delitos, Falta Administrativa, Modus Operandi, Fecha.
- `npx tsc --noEmit` limpio.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 4.**
