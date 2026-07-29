# Etapa 4 — Verificación final

> Ejecutar **después** de completar
> [`01-backend-despacho-asignado.md`](./01-backend-despacho-asignado.md),
> [`02-backend-despacho-refuerzos.md`](./02-backend-despacho-refuerzos.md) y
> [`03-frontend-campanita-ui.md`](./03-frontend-campanita-ui.md).

## Checklist

### 1. Typecheck y build

```bash
npx tsc --noEmit
npm run build
```

Ambos deben terminar sin errores. Si `tsc` marca errores en
`lib/incidentes/actions.ts`, revisa que las variables `usuariosNotificar`,
`folioNotificar`, `tipoNombreNotificar` estén correctamente tipadas y
asignadas dentro del callback de `tryActionRaw` (ver etapas 01/02). Si
`next build` falla en `CampanillaNotificaciones.tsx` por un import de icono
inexistente, revisa `node_modules/lucide-react/dist/esm/icons/` para el
nombre correcto (etapa 03).

### 2. Prueba manual end-to-end — asignación inicial (`despacho.asignado`)

El usuario del proyecto valida la UI en su propio navegador (no la valides
tú automatizando un navegador salvo que se te pida explícitamente). Pasos
sugeridos para quien valide:

1. Entrar con una cuenta con permiso de despacho (rol `agente_despacho` o
   equivalente), ir al tablón de despacho (`/agente_911/despacho` o
   `/agente_despacho`).
2. Tomar un incidente en estado `sin_despachar` y asignarle al menos un
   oficial que tenga cuenta activa en el sistema (nómina que exista en
   `ofi_oficiales` con `user_id` no nulo y `ofi_estatus = 'activo'`).
3. Confirmar en base de datos que se insertó una fila en
   `notificaciones_eventos` con `evento = 'despacho.asignado'`, `user_id` del
   oficial correcto, `entidad_id` = el id del incidente:
   ```sql
   SELECT id, user_id, evento, titulo, mensaje, href, entidad_id, creado_en
   FROM notificaciones_eventos
   WHERE evento = 'despacho.asignado'
   ORDER BY creado_en DESC LIMIT 5;
   ```
4. Entrar con la cuenta de ese oficial (rol `Oficial de Campo`). La
   campanita del header debe mostrar el contador de no leídas.
5. Abrir la campanita: debe verse la notificación con el icono del módulo
   `Incidentes` (sirena), título `🚨 Nuevo despacho — <folio>`, y el mensaje
   con folio + tipo de incidente.
6. Hacer click en la notificación: debe redirigir a
   `/oficial/despachos/{incidenteId}` (el mismo id del incidente asignado) y
   marcar la notificación como leída (el contador baja).

### 3. Prueba manual end-to-end — refuerzos (`despacho.refuerzos`)

1. Sobre el mismo incidente ya en `en_despacho`/`en_sitio`, usar la opción de
   "Enviar refuerzos" agregando otro oficial con cuenta activa (distinto al
   ya asignado, o el mismo en una segunda ronda).
2. Confirmar la fila nueva en `notificaciones_eventos` con
   `evento = 'despacho.refuerzos'`.
3. Confirmar que la campanita del oficial de refuerzo muestra la
   notificación y que el click también lleva a
   `/oficial/despachos/{incidenteId}`.

### 4. Casos borde a confirmar

- Asignar un elemento cuya nómina **no** tiene cuenta en el sistema
  (`ofi_oficiales.user_id IS NULL` o no existe fila) — no debe generar
  ninguna fila en `notificaciones_eventos` para ese elemento, y no debe
  lanzar ningún error visible al despachador.
- Provocar un error de validación en `createDespacho` (ej. intentar
  despachar un incidente que ya no está en `sin_despachar`) — no debe
  emitirse ninguna notificación.
- Confirmar que la notificación `despacho.asignado` que ya existía para el
  **despachador humano** (en `createIncidente`/`createIncidenteCliente`)
  sigue funcionando exactamente igual que antes (no se tocó ese código).

### 5. Cierre según convenciones del repo (`AGENTS.md`)

```bash
npx graphify update
```

Y, si aplica, agregar una entrada breve en
`boveda/🗺 Roadmap/Changelog.md` describiendo el cambio (notificación al
oficial de campo al asignar/reforzar un despacho + rediseño de la campanita
con iconos), siguiendo el formato ya usado en ese archivo.
