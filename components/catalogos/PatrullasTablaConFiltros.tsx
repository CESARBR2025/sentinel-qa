'use client'

import { useState, useMemo } from 'react'
import { Search, FilterX } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PatrullasTable from './PatrullasTable'
import type { PatrullaCatalogo } from '@/lib/catalogos/types'

const TODOS = '__all__'

const labelCls = 'mb-1.5 block text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground'

// Tabla de patrullas con filtros funcionales (cliente). Recibe la lista completa
// que ya carga el server component y filtra en memoria: texto (placa, serie,
// características, marca, modelo, GPS, radio, cámaras), departamento, marca y
// estatus (activa/inactiva).
export default function PatrullasTablaConFiltros({ patrullas }: { patrullas: PatrullaCatalogo[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [departamento, setDepartamento] = useState('')
  const [marca, setMarca] = useState('')
  const [estatus, setEstatus] = useState('')

  // Departamentos y marcas únicos derivados del catálogo actual
  const deptos = useMemo(() => {
    const s = new Set<string>()
    patrullas.forEach((p) => { if (p.departamento) s.add(p.departamento) })
    return [...s].sort((a, b) => a.localeCompare(b, 'es'))
  }, [patrullas])

  const marcas = useMemo(() => {
    const s = new Set<string>()
    patrullas.forEach((p) => { if (p.marca) s.add(p.marca) })
    return [...s].sort((a, b) => a.localeCompare(b, 'es'))
  }, [patrullas])

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return patrullas.filter((p) => {
      const texto = [p.placa, p.numSerie, p.departamento, p.caracteristicas, p.marca, p.modelo, p.gps, p.radio, p.camaras]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const okTexto = !q || texto.includes(q)
      const okDepto = !departamento || p.departamento === departamento
      const okMarca = !marca || p.marca === marca
      const okEstatus = !estatus ? true : estatus === 'activa' ? p.activo : !p.activo

      return okTexto && okDepto && okMarca && okEstatus
    })
  }, [patrullas, busqueda, departamento, marca, estatus])

  const hayFiltros = Boolean(busqueda || departamento || marca || estatus)

  const limpiar = () => {
    setBusqueda('')
    setDepartamento('')
    setMarca('')
    setEstatus('')
  }

  return (
    <>
      <Card className="mb-4">
        <CardContent className="flex flex-wrap items-end gap-3">
          {/* Búsqueda */}
          <div className="min-w-[260px] flex-1">
            <Label htmlFor="buscar-patrulla" className={labelCls}>Buscar</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="buscar-patrulla"
                type="text"
                placeholder="Placa, serie, características, marca, modelo..."
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
              value={departamento || TODOS}
              onValueChange={(v) => setDepartamento(v && v !== TODOS ? v : '')}
              items={[
                { value: TODOS, label: 'Todos' },
                ...deptos.map((d) => ({ value: d, label: d })),
              ]}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos</SelectItem>
                {deptos.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Marca */}
          <div className="min-w-[190px]">
            <Label className={labelCls}>Marca</Label>
            <Select
              value={marca || TODOS}
              onValueChange={(v) => setMarca(v && v !== TODOS ? v : '')}
              items={[
                { value: TODOS, label: 'Todas' },
                ...marcas.map((m) => ({ value: m, label: m })),
              ]}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todas</SelectItem>
                {marcas.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
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
                { value: 'activa', label: 'Activa' },
                { value: 'inactiva', label: 'Inactiva' },
              ]}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos</SelectItem>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="inactiva">Inactiva</SelectItem>
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
          de {patrullas.length} vehículos
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-surface">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif', fontSize: 13, minWidth: 900 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Placa', 'Serie', 'Departamento', 'Características', 'Marca', 'Modelo', 'GPS', 'Radio', 'Cámaras', 'Estatus', ''].map((h) => (
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
            <PatrullasTable
              patrullas={filtrados}
              mensajeVacio={hayFiltros ? '› Sin resultados para los filtros aplicados' : undefined}
            />
          </tbody>
        </table>
      </div>
    </>
  )
}
