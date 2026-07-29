# Etapa 5 — No preasignar "Personal prioritario" a un oficial/patrulla ya ocupado

> Lee primero [`00-contexto.md`](./00-contexto.md) si no ejecutaste las
> etapas 1-4 en esta misma sesión. Esta etapa es independiente de esas
> cuatro (toca otra función del mismo archivo), pero comparte el mismo
> módulo de despacho/rondín — vale la pena tener el contexto general.

**Archivos a modificar:**
- `lib/incidentes/actions.ts` (función `createRondinEscalado`)
- `app/oficial/rondin/page.tsx`
- `components/oficial/ToastExito.tsx`

## El bug (reportado por el usuario con un caso real)

Un oficial ya tenía un despacho activo (folio `SSPM/INC/069/2026`, patrulla
`06-TUZ3`). Desde `/oficial/rondin` reportó un incidente nuevo
(`SSPM/INC/2026/999015`, "Detonación de arma de fuego"). El sistema lo creó
y lo mostró en el tablón de despacho con **"Personal prioritario"**
preseleccionado — la misma patrulla `06-TUZ3` y sus tripulantes — como si
estuvieran disponibles. Al intentar despachar de verdad, el sistema
rechazó la operación:

```
No se puede despachar: unidad(es) ya asignada(s) a otro incidente activo:
e28cf784-c272-467b-8e5e-7aa6eacb44b0 (folio SSPM/INC/069/2026)
```

**Causa raíz**: `createRondinEscalado()` en `lib/incidentes/actions.ts`
siempre pre-crea un despacho con el oficial reportante como
`es_prioritario = true`, sin verificar si ese oficial o su patrulla ya
está trabajando activamente otro incidente
(`incidentes.estatus IN ('en_despacho', 'en_sitio')`). El único chequeo de
"unidad ocupada" que existe en el código vive en `createDespacho()`/
`enviarRefuerzos()`, y corre **después**, cuando despacho ya intenta
confirmar la asignación — con el incidente ya creado y el prioritario ya
mal sugerido en pantalla.

## Decisión de negocio (ya confirmada, no hace falta volver a preguntarla)

- El oficial **debe poder** seguir reportando incidentes nuevos aunque ya
  tenga un despacho activo (ej. llega a atender algo de baja prioridad y en
  el sitio encuentra algo más grave). **No se bloquea la creación del
  reporte.**
- Lo que está mal es que el sistema lo sugiera a él/su patrulla como
  "disponible" para el nuevo incidente cuando en realidad no lo está. Eso
  es lo único que se corrige.
- "Ocupado" se detecta de forma **combinada**: por oficial (¿ya es
  elemento activo en otro incidente?) **o** por patrulla (¿su
  `patrulla_id` ya está como unidad activa en otro incidente?). Cubre
  también el caso de que otro oficial de la misma patrulla ya la tenga
  activa en otro folio — no solo "yo mismo ya estoy en otro caso".
- Cuando está ocupado: el incidente se crea igual, en `sin_despachar`,
  pero **sin** crear la fila `incidente_despacho` ni el elemento
  prioritario — queda para asignación manual normal, exactamente como
  cualquier incidente que entra por 911.

## Cambio 1 — `lib/incidentes/actions.ts`, función `createRondinEscalado`

### Código actual (localízalo por coincidencia de texto — puede haber cambiado de línea)

```ts
        const incId = inc.rows[0].id
        console.log('[RONDIN] incidente creado ID:', incId)

        const ofi = await cliente.query<{ id: string; no_nomina: string | null }>(
          `SELECT id, no_nomina FROM ofi_oficiales WHERE user_id = $1 AND ofi_estatus = 'activo' LIMIT 1`,
          [session.user.id],
        )
        const oficialId = ofi.rows[0]?.id ?? null
        const oficialNomina = ofi.rows[0]?.no_nomina ?? null
        console.log('[RONDIN] oficial match:', { oficialId, oficialNomina })

        if (esImprocedente) {
          console.log('[RONDIN] tipo Improcedentes: se omite creación de despacho — solo registro estadístico')
        } else {
          const despacho = await cliente.query<{ id: string }>(
            `INSERT INTO incidente_despacho (incidente_id, despachado_por) VALUES ($1, $2) RETURNING id`,
            [incId, session.user.id],
          )
          await cliente.query(
            `INSERT INTO incidente_despacho_elementos (despacho_id, elemento_ext_id, elemento_nomina, elemento_nombre, oficial_id, es_prioritario)
             VALUES ($1, $2, $3, $4, $5, true)`,
            [despacho.rows[0].id, oficialNomina, oficialNomina, nombreOficial, oficialId],
          )
          console.log('[RONDIN] despacho + elementos INSERT OK')
        }

        await cliente.query('COMMIT')
        console.log('[RONDIN] TRANSACTION COMMITTED')
        return { incidenteId: incId, esOficial: oficialId !== null }
      } catch (err) {
        await cliente.query('ROLLBACK')
        console.error('[RONDIN] TRANSACTION ROLLBACK:', err)
        throw err
      } finally {
        cliente.release()
      }
    })

    console.log('[RONDIN] tryActionRaw result:', { incidenteId, esOficial })

    await registrarAudit({
      userId: session.user.id,
      accion: 'CREATE',
      entidad: 'incidentes',
      entidadId: incidenteId,
      payload: { origen: 'rondin_escalado', prioritario: nombreOficial },
    })
    console.log('[RONDIN] audit registrado')

    if (prioridadId === 3) {
      await notificarMonitoristas(incidenteId, folio)
    }

    // Avisa al rol de despacho: sin esto, un incidente escalado desde rondín
    // solo aparecía si alguien entraba manualmente al tablón. Se omite en
    // incidentes Improcedentes porque esos no generan fila en
    // incidente_despacho ni deben aparecer en el tablón de despacho.
    if (!esImprocedente) {
      await emitir('rondin.escalado', {
        titulo: `📻 Rondín escalado — ${folio}`,
        mensaje: `Un oficial en rondín escaló el incidente ${folio}. Revisa el tablón de despacho.`,
        entidadTipo: 'incidente',
        entidadId: incidenteId,
        emitidaPor: session.user.id,
      })
    }

    revalidatePath('/agente_911/rondin')
    revalidatePath('/oficial/despachos')
    revalidatePath('/incidentes')

    console.log('[RONDIN] redirigiendo a:', esOficial ? `/oficial/rondin?exito=1&folio=${encodeURIComponent(folio)}` : `/agente_911/rondin/incidentes/${incidenteId}`)
    if (esOficial) redirect(`/oficial/rondin?exito=1&folio=${encodeURIComponent(folio)}`)
    redirect(`/agente_911/rondin/incidentes/${incidenteId}`)
```

> Nota: si en tu copia del repo el bloque `emitir('rondin.escalado', ...)`
> no existe todavía (la etapa de notificaciones de rondín no se aplicó
> antes que esta), agrégalo tal cual se muestra arriba primero, y luego
> aplica los cambios de esta etapa sobre él.

### Cambios a aplicar

**a) Ampliar el SELECT de `ofi_oficiales` para traer `patrulla_id`:**

Reemplaza:
```ts
        const ofi = await cliente.query<{ id: string; no_nomina: string | null }>(
          `SELECT id, no_nomina FROM ofi_oficiales WHERE user_id = $1 AND ofi_estatus = 'activo' LIMIT 1`,
          [session.user.id],
        )
        const oficialId = ofi.rows[0]?.id ?? null
        const oficialNomina = ofi.rows[0]?.no_nomina ?? null
        console.log('[RONDIN] oficial match:', { oficialId, oficialNomina })
```

Por:
```ts
        const ofi = await cliente.query<{ id: string; no_nomina: string | null; patrulla_id: string | null }>(
          `SELECT id, no_nomina, patrulla_id FROM ofi_oficiales WHERE user_id = $1 AND ofi_estatus = 'activo' LIMIT 1`,
          [session.user.id],
        )
        const oficialId = ofi.rows[0]?.id ?? null
        const oficialNomina = ofi.rows[0]?.no_nomina ?? null
        const oficialPatrullaId = ofi.rows[0]?.patrulla_id ?? null
        console.log('[RONDIN] oficial match:', { oficialId, oficialNomina, oficialPatrullaId })

        // "Ocupado" = el oficial mismo ya es elemento activo en otro incidente,
        // O su patrulla ya está como unidad activa en otro incidente (cubre el
        // caso de que otro oficial de la misma patrulla ya la tenga activa).
        // Mismo criterio de "estatus activo" que ya usa createDespacho para
        // bloquear el despacho final — aquí se aplica ANTES de sugerir nada.
        let ocupadoEnOtroIncidente = false
        if (oficialId) {
          const ocupado = await cliente.query(
            `SELECT 1 FROM incidente_despacho_elementos ide
             JOIN incidente_despacho d ON d.id = ide.despacho_id
             JOIN incidentes i ON i.id = d.incidente_id
             WHERE i.estatus IN ('en_despacho', 'en_sitio') AND ide.oficial_id = $1
             UNION
             SELECT 1 FROM incidente_despacho_unidades idu
             JOIN incidente_despacho d ON d.id = idu.despacho_id
             JOIN incidentes i ON i.id = d.incidente_id
             WHERE i.estatus IN ('en_despacho', 'en_sitio') AND idu.unidad_ext_id = $2
             LIMIT 1`,
            [oficialId, oficialPatrullaId],
          )
          ocupadoEnOtroIncidente = ocupado.rows.length > 0
          console.log('[RONDIN] ocupadoEnOtroIncidente:', ocupadoEnOtroIncidente)
        }
```

(Si `oficialPatrullaId` es `null`, `idu.unidad_ext_id = NULL` nunca es
verdadero en SQL estándar — no hace falta manejarlo como caso especial, la
condición simplemente no aporta filas.)

**b) Agregar la rama `ocupadoEnOtroIncidente` al if/else:**

Reemplaza:
```ts
        if (esImprocedente) {
          console.log('[RONDIN] tipo Improcedentes: se omite creación de despacho — solo registro estadístico')
        } else {
          const despacho = await cliente.query<{ id: string }>(
            `INSERT INTO incidente_despacho (incidente_id, despachado_por) VALUES ($1, $2) RETURNING id`,
            [incId, session.user.id],
          )
          await cliente.query(
            `INSERT INTO incidente_despacho_elementos (despacho_id, elemento_ext_id, elemento_nomina, elemento_nombre, oficial_id, es_prioritario)
             VALUES ($1, $2, $3, $4, $5, true)`,
            [despacho.rows[0].id, oficialNomina, oficialNomina, nombreOficial, oficialId],
          )
          console.log('[RONDIN] despacho + elementos INSERT OK')
        }

        await cliente.query('COMMIT')
        console.log('[RONDIN] TRANSACTION COMMITTED')
        return { incidenteId: incId, esOficial: oficialId !== null }
```

Por:
```ts
        if (esImprocedente) {
          console.log('[RONDIN] tipo Improcedentes: se omite creación de despacho — solo registro estadístico')
        } else if (ocupadoEnOtroIncidente) {
          console.log('[RONDIN] oficial/patrulla ya ocupado en otro incidente activo: se omite personal prioritario')
        } else {
          const despacho = await cliente.query<{ id: string }>(
            `INSERT INTO incidente_despacho (incidente_id, despachado_por) VALUES ($1, $2) RETURNING id`,
            [incId, session.user.id],
          )
          await cliente.query(
            `INSERT INTO incidente_despacho_elementos (despacho_id, elemento_ext_id, elemento_nomina, elemento_nombre, oficial_id, es_prioritario)
             VALUES ($1, $2, $3, $4, $5, true)`,
            [despacho.rows[0].id, oficialNomina, oficialNomina, nombreOficial, oficialId],
          )
          console.log('[RONDIN] despacho + elementos INSERT OK')
        }

        await cliente.query('COMMIT')
        console.log('[RONDIN] TRANSACTION COMMITTED')
        return { incidenteId: incId, esOficial: oficialId !== null, ocupado: ocupadoEnOtroIncidente }
```

**c) Ajustar el destructuring del resultado de `tryActionRaw`:**

Busca la línea (justo antes del cierre del `try` externo de la función,
donde se recibe el resultado de `tryActionRaw`):
```ts
        const { incidenteId, esOficial } = await tryActionRaw(async () => {
```
Cámbiala por:
```ts
        const { incidenteId, esOficial, ocupado } = await tryActionRaw(async () => {
```

**d) Enriquecer `registrarAudit` con el nuevo dato:**

Reemplaza:
```ts
    await registrarAudit({
      userId: session.user.id,
      accion: 'CREATE',
      entidad: 'incidentes',
      entidadId: incidenteId,
      payload: { origen: 'rondin_escalado', prioritario: nombreOficial },
    })
```

Por:
```ts
    await registrarAudit({
      userId: session.user.id,
      accion: 'CREATE',
      entidad: 'incidentes',
      entidadId: incidenteId,
      payload: { origen: 'rondin_escalado', prioritario: nombreOficial, ocupado_en_otro_incidente: ocupado },
    })
```

**e) Mensaje condicional en `emitir('rondin.escalado', ...)`:**

Reemplaza:
```ts
    if (!esImprocedente) {
      await emitir('rondin.escalado', {
        titulo: `📻 Rondín escalado — ${folio}`,
        mensaje: `Un oficial en rondín escaló el incidente ${folio}. Revisa el tablón de despacho.`,
        entidadTipo: 'incidente',
        entidadId: incidenteId,
        emitidaPor: session.user.id,
      })
    }
```

Por:
```ts
    if (!esImprocedente) {
      await emitir('rondin.escalado', {
        titulo: `📻 Rondín escalado — ${folio}`,
        mensaje: ocupado
          ? `Un oficial en rondín escaló el incidente ${folio}, pero ya atiende otro caso activo — requiere asignar personal disponible.`
          : `Un oficial en rondín escaló el incidente ${folio}. Revisa el tablón de despacho.`,
        entidadTipo: 'incidente',
        entidadId: incidenteId,
        emitidaPor: session.user.id,
      })
    }
```

**f) Propagar `ocupado` en el redirect de confirmación del oficial:**

Reemplaza:
```ts
    console.log('[RONDIN] redirigiendo a:', esOficial ? `/oficial/rondin?exito=1&folio=${encodeURIComponent(folio)}` : `/agente_911/rondin/incidentes/${incidenteId}`)
    if (esOficial) redirect(`/oficial/rondin?exito=1&folio=${encodeURIComponent(folio)}`)
    redirect(`/agente_911/rondin/incidentes/${incidenteId}`)
```

Por:
```ts
    const destinoOficial = `/oficial/rondin?exito=1&folio=${encodeURIComponent(folio)}${ocupado ? '&ocupado=1' : ''}`
    console.log('[RONDIN] redirigiendo a:', esOficial ? destinoOficial : `/agente_911/rondin/incidentes/${incidenteId}`)
    if (esOficial) redirect(destinoOficial)
    redirect(`/agente_911/rondin/incidentes/${incidenteId}`)
```

## Cambio 2 — `app/oficial/rondin/page.tsx`

### Código actual completo

```tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verificarRolOficial, obtenerMiPerfil, listarRondinesOficial } from '@/lib/oficial/service'
import { getCatalogos } from '@/lib/911/service'
import { generarFolioIncidente } from '@/lib/incidentes/folio'
import { ToastExito } from '@/components/oficial/ToastExito'
import { RondinPageClient } from '@/components/oficial/rondin/RondinPageClient'

export default async function RondinOficialPage({ searchParams }: { searchParams: Promise<{ exito?: string; folio?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const [catalogos, perfil, folioData, rondines] = await Promise.all([
    getCatalogos(),
    obtenerMiPerfil(session.user.id),
    generarFolioIncidente(),
    listarRondinesOficial(session.user.id),
  ])

  const nombreOficial = perfil
    ? `${perfil.ofiNombre} ${perfil.ofiApPaterno}`.trim()
    : (session.user as { name: string }).name

  const params = await searchParams

  return (
    <>
      <ToastExito show={params.exito === '1'} folio={params.folio} />
      <RondinPageClient
        rondines={rondines}
        catalogos={{ emergencias: catalogos.emergencias, subtipos: catalogos.subtipos, incidentes: catalogos.incidentes, prioridades: catalogos.prioridades }}
        nombreOficial={nombreOficial}
        folio={folioData.folio}
        folioConsecutivo={folioData.consecutivo}
        folioNuevo={params.exito === '1' ? params.folio : undefined}
      />
    </>
  )
}
```

### Cambios a aplicar

Reemplaza la firma de la página y el `<ToastExito>`:

```tsx
export default async function RondinOficialPage({ searchParams }: { searchParams: Promise<{ exito?: string; folio?: string; ocupado?: string }> }) {
```

```tsx
      <ToastExito show={params.exito === '1'} folio={params.folio} ocupado={params.ocupado === '1'} />
```

El resto del archivo queda igual.

## Cambio 3 — `components/oficial/ToastExito.tsx`

### Código actual completo

```tsx
'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, X } from 'lucide-react'

export function ToastExito({ show: initialShow, folio }: { show: boolean; folio?: string }) {
  const [visible, setVisible] = useState(initialShow)

  useEffect(() => {
    if (!initialShow) return
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [initialShow])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: '#0f172a', color: '#ffffff', padding: '16px 24px',
      borderRadius: 2, display: 'flex', alignItems: 'center', gap: 12,
      fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
      borderLeft: '4px solid #22c55e', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      animation: 'slideIn 0.3s ease',
    }}>
      <CheckCircle size={20} color="#22c55e" />
      <span>{folio ? `Reporte registrado: ${folio}` : 'Reporte registrado exitosamente'}</span>
      <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginLeft: 8 }}>
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  )
}
```

### Reemplázalo por

```tsx
'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, X } from 'lucide-react'

export function ToastExito({ show: initialShow, folio, ocupado = false }: { show: boolean; folio?: string; ocupado?: boolean }) {
  const [visible, setVisible] = useState(initialShow)

  useEffect(() => {
    if (!initialShow) return
    // Con aviso de "ocupado" hay dos líneas que leer — más tiempo antes de autocerrar.
    const timer = setTimeout(() => setVisible(false), ocupado ? 8000 : 5000)
    return () => clearTimeout(timer)
  }, [initialShow, ocupado])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: '#0f172a', color: '#ffffff', padding: '16px 24px',
      borderRadius: 2, display: 'flex', alignItems: 'flex-start', gap: 12,
      fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
      borderLeft: '4px solid #22c55e', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      animation: 'slideIn 0.3s ease', maxWidth: 360,
    }}>
      <CheckCircle size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span>{folio ? `Reporte registrado: ${folio}` : 'Reporte registrado exitosamente'}</span>
        {ocupado && (
          <span style={{ color: '#fbbf24', fontSize: 10.5, lineHeight: 1.4 }}>
            Como ya tienes un despacho activo, no se te preasignó — despacho enviará a otro personal disponible.
          </span>
        )}
      </span>
      <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginLeft: 8, flexShrink: 0 }}>
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  )
}
```

## Por qué no hace falta tocar el tablón/formulario de asignación

La sección "Personal prioritario" en `DespachoForm.tsx`/`TablonDespacho.tsx`
se pinta condicionada a que exista un elemento con `es_prioritario = true`
en `incidente_despacho_elementos` (vía el `LEFT JOIN` de la query de
incidentes pendientes en `lib/incidentes/repository.ts`, alrededor de la
consulta que trae `prioritario_nombre`/`prioritario_nomina`/
`prioritario_patrulla_id`). Al no insertar esa fila cuando el oficial está
ocupado, el JOIN devuelve `NULL` y la UI dejará de mostrar la sección
automáticamente — no se requiere ningún cambio de frontend en esos
archivos.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` y `npm run build` sin errores nuevos.
- [ ] **Caso "ocupado por sí mismo"**: con un oficial que ya es elemento
      activo en otro incidente (`en_despacho`/`en_sitio`), reportar un
      nuevo rondín → el nuevo incidente se crea (fila en `incidentes`,
      `estatus = 'sin_despachar'`), pero **no** genera fila en
      `incidente_despacho` ni `incidente_despacho_elementos`. El tablón de
      despacho lo muestra sin sección "Personal prioritario". El toast de
      confirmación del oficial muestra el aviso de "no se te preasignó".
- [ ] **Caso "ocupado por patrulla, otro oficial"**: un oficial cuya
      `patrulla_id` ya está como unidad activa en otro incidente (bajo el
      elemento de OTRO oficial distinto) reporta un rondín → mismo
      resultado que el caso anterior.
- [ ] **Caso normal (no ocupado)**: el comportamiento es idéntico al
      actual — se crea `incidente_despacho` + elemento con
      `es_prioritario = true`, el tablón muestra "Personal prioritario", el
      toast de confirmación no muestra el aviso extra.
- [ ] El incidente creado en el caso "ocupado" puede despacharse
      normalmente después por la vía de siempre: `createDespacho` entra
      por la rama `else` (no hay despacho previo que reusar), exige
      `unidades`/`elementos` como cualquier incidente nuevo.
- [ ] Un incidente de tipo Improcedentes sigue comportándose igual que
      antes (sin despacho, sin importar el estado "ocupado" del oficial).
- [ ] La notificación `rondin.escalado` recibida por el rol de despacho
      trae el mensaje distinto cuando el oficial reportante estaba
      ocupado.

## Cierre según convenciones del repo

```bash
npx graphify update
```

Y actualizar/complementar la regla #16 de `boveda/🧩 Features/911.md`
(agregada en el fix anterior de `rondin.escalado`) para reflejar este
refinamiento: el prioritario ya no se sugiere automáticamente cuando el
oficial o su patrulla están ocupados en otro incidente activo.
