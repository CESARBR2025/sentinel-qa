'use client'

import { useState, useMemo } from 'react'
import { Search, FilterX } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import OficialesTable from './OficialesTable'
import type { Departamento, OficialLista, Sector } from '@/lib/admin-transito/types'
import type { PatrullaAsignacion } from '@/lib/flota/types'

const TODOS = '__all__'

const labelCls = 'mb-1.5 block text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground'

// Tabla de oficiales con filtros funcionales (cliente). Recibe la lista completa
// que ya carga el server component y filtra en memoria: texto (nombre, nómina,
// empleado, correo, teléfono), departamento, estatus y patrulla.
export default function OficialesTablaConFiltros({ oficiales, deptos, sectores, patrullas }: {
  oficiales: OficialLista[]
  deptos: Departamento[]
  sectores: Sector[]
  patrullas: PatrullaAsignacion[]
}) {
  const [busqueda, setBusqueda] = useState('')
  const [departamentoId, setDepartamentoId] = useState('')
  const [estatus, setEstatus] = useState('')
  const [patrullaId, setPatrullaId] = useState('')

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return oficiales.filter((o) => {
      const texto = [o.userName, o.userApellido, o.noNomina, o.numeroEmpleado, o.userEmail, o.telefono]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const okTexto = !q || texto.includes(q)
      const okDepto = !departamentoId || o.departamentoId === departamentoId
      const okEstatus = !estatus
        ? true
        : estatus === 'inactivo'
          ? !['activo', 'destituido'].includes(o.ofiEstatus)
          : o.ofiEstatus === estatus
      const okPatrulla = !patrullaId || o.patrullaId === patrullaId

      return okTexto && okDepto && okEstatus && okPatrulla
    })
  }, [oficiales, busqueda, departamentoId, estatus, patrullaId])

  const hayFiltros = Boolean(busqueda || departamentoId || estatus || patrullaId)

  const limpiar = () => {
    setBusqueda('')
    setDepartamentoId('')
    setEstatus('')
    setPatrullaId('')
  }

  return (
    <>
      <Card className="mb-4">
        <CardContent className="flex flex-wrap items-end gap-3">
          {/* Búsqueda */}
          <div className="min-w-[260px] flex-1">
            <Label htmlFor="buscar-oficial" className={labelCls}>Buscar</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="buscar-oficial"
                type="text"
                placeholder="Nombre, nómina, empleado, correo o teléfono..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
                className="pl-8 uppercase"
              />
            </div>
          </div>

          {/* Departamento */}
          <div className="min-w-[190px]">
            <Label className={labelCls}>Departamento</Label>
            <Select
              value={departamentoId || TODOS}
              onValueChange={(v) => setDepartamentoId(v && v !== TODOS ? v : '')}
              items={[
                { value: TODOS, label: 'Todos' },
                ...deptos.map((d) => ({ value: d.id, label: d.nombre })),
              ]}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos</SelectItem>
                {deptos.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estatus */}
          <div className="min-w-[160px]">
            <Label className={labelCls}>Estatus</Label>
            <Select
              value={estatus || TODOS}
              onValueChange={(v) => setEstatus(v && v !== TODOS ? v : '')}
              items={[
                { value: TODOS, label: 'Todos' },
                { value: 'activo', label: 'Activo' },
                { value: 'destituido', label: 'Destituido' },
                { value: 'inactivo', label: 'Inactivo' },
              ]}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="destituido">Destituido</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Patrulla */}
          <div className="min-w-[190px]">
            <Label className={labelCls}>Patrulla</Label>
            <Select
              value={patrullaId || TODOS}
              onValueChange={(v) => setPatrullaId(v && v !== TODOS ? v : '')}
              items={[
                { value: TODOS, label: 'Todas' },
                ...patrullas.map((p) => ({ value: p.id, label: p.etiqueta })),
              ]}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todas</SelectItem>
                {patrullas.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.etiqueta}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Limpiar */}
          <div className="flex items-end">
            <Button type="button" variant="outline" onClick={limpiar} disabled={!hayFiltros} className="gap-1.5">
              <FilterX className="size-4" /> Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contador */}
      <div className="mb-3 flex items-center gap-2">
        <Badge variant="secondary" className="font-mono">{filtrados.length}</Badge>
        <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          de {oficiales.length} oficiales
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-surface">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Nombre', 'Nómina / Empleado', 'Departamento', 'Patrulla', 'Estatus', ''].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 9,
                    color: '#64748b',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <OficialesTable oficiales={filtrados} deptos={deptos} sectores={sectores} patrullas={patrullas} />
          </tbody>
        </table>
      </div>
    </>
  )
}
