# Etapa 4 — UI de captura de antecedentes externos en Fiscalía

Leer primero `00-contexto.md`. Requiere Etapa 3 confirmada.

Confirmado con el usuario: el botón/vista de captura vive **en Fiscalía** (expediente del detenido), no en `/reporte-detenidos` — ese reporte se mantiene 100% de solo lectura.

## Objetivo

Fiscalía puede, dentro del expediente del detenido, agregar/ver/eliminar entradas de "antecedente externo" (delito o falta administrativa de otro estado/fuente que su plataforma externa les muestra pero que este sistema no puede calcular solo).

## Archivo a crear

`components/fiscalia/AntecedentesExternos.tsx` — client component.

```tsx
'use client'

import { useState, useEffect, useTransition } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  listarAntecedentesExternosAction,
  agregarAntecedenteExternoAction,
  eliminarAntecedenteExternoAction,
} from '@/lib/fiscalia/actions'
import type { AntecedenteExterno } from '@/lib/fiscalia/types'

interface Props {
  reporteCampoId: string
  readOnly?: boolean
}

export function AntecedentesExternos({ reporteCampoId, readOnly = false }: Props) {
  const [items, setItems] = useState<AntecedenteExterno[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [tipo, setTipo] = useState<'DELITO' | 'FALTA_ADMINISTRATIVA'>('DELITO')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState('')
  const [lugar, setLugar] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    listarAntecedentesExternosAction(reporteCampoId).then(res => {
      if (res.data) setItems(res.data)
      setCargando(false)
    })
  }, [reporteCampoId])

  const agregar = () => {
    if (!descripcion.trim()) return
    startTransition(async () => {
      const res = await agregarAntecedenteExternoAction(reporteCampoId, {
        tipo, descripcion, fecha: fecha || null, lugar: lugar || null,
      })
      if (res.success) {
        const actualizado = await listarAntecedentesExternosAction(reporteCampoId)
        if (actualizado.data) setItems(actualizado.data)
        setDescripcion(''); setFecha(''); setLugar(''); setMostrarForm(false)
      }
    })
  }

  const eliminar = (id: string) => {
    startTransition(async () => {
      await eliminarAntecedenteExternoAction(id)
      setItems(prev => prev.filter(i => i.id !== id))
    })
  }

  // resto del componente: lista de items (fecha + descripción + lugar, agrupados
  // por tipo DELITO / FALTA_ADMINISTRATIVA), botón "+ Agregar antecedente externo"
  // que despliega el formulario inline (select tipo, input fecha, input lugar,
  // textarea descripción, botón Guardar/Cancelar). Reutiliza labelSx/inputSx/disabledSx
  // del mismo patrón que components/fiscalia/FormularioAsegurado.tsx para que
  // se vea consistente. Si readOnly, no mostrar el botón de agregar ni el ícono
  // de eliminar (solo lista de lectura) — se usa readOnly cuando este componente
  // se monta dentro de DetallesAseguradoView (Juzgado, u otra vista de solo lectura).
}
```

No copies el JSX de la lista/formulario de otro archivo: constrúyelo siguiendo el mismo lenguaje visual que `FormularioAsegurado.tsx` (bordes `borderLeft: 3px solid #7c3aed`, `labelSx`, `Barlow Condensed` para títulos de sección, `JetBrains Mono` para labels). Nota al pie fija (texto, no editable) en la sección: *"Antecedentes calculados dentro de esta base de datos + registros manuales de otras fuentes — no sustituye una consulta a Plataforma México/RNPP."* — esto documenta la limitación ya anotada en `00-contexto.md`.

## Archivo a tocar

`components/fiscalia/FormularioAsegurado.tsx`

- Importar `AntecedentesExternos` y montarlo al final del formulario (después de la sección de detenidos, antes de los botones Guardar/Regresar), pasando `reporteCampoId={reporteCampoId}` y `readOnly={readOnly}` (la misma variable `readOnly` que ya calcula el componente en base a si el detenido ya tiene dirección guardada).

## Verificación

1. `npx tsc --noEmit`.
2. Prueba manual (usuario, en navegador): agregar un antecedente externo de prueba, confirmar que aparece en la lista, eliminarlo, confirmar que desaparece.

## Criterios de aceptación

- Fiscalía puede agregar, ver y eliminar antecedentes externos desde el expediente del detenido.
- `npx tsc --noEmit` limpio.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 5.**
