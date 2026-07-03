import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { listarMediosAlternativos, PERIODOS, Periodo } from '@/lib/reportes/formato-n-medios-alternativos-service'
import { DashboardHeader } from '@/components/partials/Header'
import Link from 'next/link'
import React from 'react'
import { Plus, Filter } from 'lucide-react'
import { pageWrap, fontsImport } from '@/components/reportes/form-styles'

export default async function FormatoNMediosAlternativosPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const { periodo: periodoFilter } = await searchParams
  const periodoValido = periodoFilter && PERIODOS.includes(periodoFilter as Periodo)
    ? periodoFilter as Periodo
    : undefined

  const registros = await listarMediosAlternativos(periodoValido)
  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={pageWrap}>
      <style>{fontsImport}</style>
      <DashboardHeader user={user} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>Formato N a Coordinación</span>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Medios Alternativos de Solución de Conflictos</h1>
            <div style={{ width: 64, height: 3, background: '#2563eb', marginTop: 12 }} />
          </div>
          <Link href="/formato-n-medios-alternativos/nuevo" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', background: '#0f172a', color: '#ffffff', padding: '12px 24px', textDecoration: 'none', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={14} /> NUEVO REPORTE
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          <Filter size={14} color="#64748b" />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Filtrar por periodo:</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <Link href="/formato-n-medios-alternativos" style={filtroBtn(!periodoFilter)}>TODOS</Link>
            <Link href="/formato-n-medios-alternativos?periodo=diario" style={filtroBtn(periodoFilter === 'diario')}>DIARIO</Link>
            <Link href="/formato-n-medios-alternativos?periodo=semanal" style={filtroBtn(periodoFilter === 'semanal')}>SEMANAL</Link>
            <Link href="/formato-n-medios-alternativos?periodo=mensual" style={filtroBtn(periodoFilter === 'mensual')}>MENSUAL</Link>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <Th>Fecha</Th>
                <Th>Periodo</Th>
                <Th>Asuntos Canalizados</Th>
                <Th>Acuerdos</Th>
                <Th>Monto Reparación</Th>
                <Th>​</Th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', fontFamily: 'Inter', fontSize: 13, color: '#94a3b8' }}>No hay reportes</td></tr>
              )}
              {registros.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <Td>{r.fecha}</Td>
                  <Td>{r.periodo}</Td>
                  <Td>{r.asuntos_canalizados_por_fiscalia}</Td>
                  <Td>{r.acuerdos}</Td>
                  <Td>${Number(r.monto_reparacion_danos).toLocaleString('es-MX')}</Td>
                  <Td><Link href={`/formato-n-medios-alternativos/${r.id}`} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', textDecoration: 'none' }}>EDITAR</Link></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', textAlign: 'left', padding: '10px 12px', fontWeight: 600 }}>{children}</th>
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ fontFamily: 'Inter', fontSize: 12, color: '#1e293b', padding: '10px 12px' }}>{children}</td>
}

function filtroBtn(active: boolean): React.CSSProperties {
  return {
    fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 600, textTransform: 'uppercase',
    letterSpacing: '0.1em', padding: '4px 12px', textDecoration: 'none', borderRadius: 2,
    background: active ? '#0f172a' : '#f1f5f9',
    color: active ? '#ffffff' : '#475569',
    border: active ? '1px solid #0f172a' : '1px solid #e2e8f0',
  }
}
