# Etapa 5 — Página `/reporte-detenidos` + botón "Generar PPT"

## Contexto (resumen — ver `00-contexto.md`)

Requiere las Etapas 1-4 ya construidas. Esta etapa crea la página visible: tabla de detenidos completos (solo lectura, sin acciones de aprobar/rechazar/editar) + botón que dispara la descarga del PPT. Sigue el mismo patrón visual y de permisos que `app/d1/page.tsx` y `app/monitorista/detenidos/page.tsx` (fuentes, `DashboardHeader`, `PageHeader`).

## Objetivo

`app/reporte-detenidos/page.tsx` — página server component, protegida por sesión + permiso `reporte_detenidos`/`ver`, que lista `listarDetenidosCompletos()` en una tabla simple y monta el botón de generar PPT.

`components/reporte-detenidos/BotonGenerarPpt.tsx` — client component simple (sin dropdown de filtros, a diferencia de `components/monitorista/BotonGenerarPpt.tsx`): un solo botón que hace `POST` a `/api/reporte-detenidos/generar-ppt` y descarga el blob.

## Archivos a crear

### 1. `components/reporte-detenidos/BotonGenerarPpt.tsx`

```tsx
'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'

export function BotonGenerarPpt() {
  const [pending, setPending] = useState(false)

  const handleGenerate = async () => {
    setPending(true)
    try {
      const res = await fetch('/api/reporte-detenidos/generar-ppt', { method: 'POST' })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte_detenidos_${new Date().toISOString().split('T')[0]}.pptx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al generar PPT')
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={pending}
      style={{
        fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.1em', padding: '10px 20px',
        background: pending ? '#94a3b8' : '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2,
        cursor: pending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8,
      }}
    >
      <FileText size={14} /> {pending ? 'GENERANDO...' : 'GENERAR PPT'}
    </button>
  )
}
```

### 2. `app/reporte-detenidos/page.tsx`

Mismo patrón de sesión+permiso+header que `app/d1/page.tsx`, tabla simple en vez del componente `D1ReportsTable` (esta tabla es propia, sin filtros ni links a detalle — es de solo lectura):

```tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { tienePermiso } from '@/lib/reporte-detenidos/permisos'
import { listarDetenidosCompletos } from '@/lib/reporte-detenidos/repository'
import { BotonGenerarPpt } from '@/components/reporte-detenidos/BotonGenerarPpt'

export default async function ReporteDetenidosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'reporte_detenidos', 'ver'))) redirect('/agente_reportes')

  const user = session.user as { name: string; apellido?: string; email: string }
  const detenidos = await listarDetenidosCompletos()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <DashboardHeader user={user} roleLabel="Agente Reportes" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Reporte de"
          accent="Detenidos"
          accentColor="#059669"
          subtitle="Detenidos con fotografía frontal, derecho e izquierdo ya completadas por Fiscalía/Juzgado"
          actions={<>
            <PageHeaderLink href="/agente_reportes" variant="secondary">← Panel de Reportes</PageHeaderLink>
            <BotonGenerarPpt />
          </>}
        />

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                {['Nombre', 'Folio', 'Evento', 'Delitos', 'Falta Administrativa', 'Modus Operandi', 'Fecha'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detenidos.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#94a3b8' }}>No hay detenidos con las 3 fotos completadas</td></tr>
              )}
              {detenidos.map(d => (
                <tr key={d.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 16px' }}>{d.nombre}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{d.folio || '—'}</td>
                  <td style={{ padding: '10px 16px' }}>{d.evento}</td>
                  <td style={{ padding: '10px 16px' }}>{d.delito}</td>
                  <td style={{ padding: '10px 16px' }}>{d.faltaAdministrativa}</td>
                  <td style={{ padding: '10px 16px' }}>{d.modusOperandi}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>{new Date(d.createdAt).toLocaleDateString('es-MX')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DashboardFooter />
      </main>
    </div>
  )
}
```

Verificar props exactas de `PageHeader`/`PageHeaderLink` en `components/partials/PageHeader.tsx` antes de implementar — si difieren de lo asumido aquí (ej. nombres de prop), ajustar al componente real, no inventar props nuevas.

## Qué NO tocar en esta etapa

- No agregar la card en `/agente_reportes` todavía (Etapa 6) — la página queda accesible solo por URL directa hasta entonces.
- No agregar links a detalle, edición ni aprobación — esta tabla es de solo lectura por diseño (ver `00-contexto.md`, decisión 2).

## Criterios de aceptación

1. `npx tsc --noEmit` pasa sin errores nuevos.
2. Navegando a `/reporte-detenidos` con un usuario con permiso `reporte_detenidos`, se ve la tabla con los detenidos completos reales de la BD.
3. Sin permiso, redirige a `/agente_reportes`.
4. El botón "Generar PPT" descarga el archivo `.pptx` generado por la Etapa 4.
5. No hay ningún botón/link de aprobar, rechazar o editar en esta página.
