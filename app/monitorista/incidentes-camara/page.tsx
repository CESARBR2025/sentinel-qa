import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { listarRegistros } from '@/lib/monitorista/incidentes-camara-service'
import { SignOutButton } from '@/app/dashboard/sign-out-button'
import Link from 'next/link'
import React from 'react'
import { Plus, Camera, BarChart3 } from 'lucide-react'

export default async function IncidentesCamaraPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const registros = await listarRegistros()
  const user = session.user as { name: string }

  const hoy = new Date().toISOString().slice(0, 10)
  const registrosHoy = registros.filter(r => r.fecha.slice(0, 10) === hoy)

  const totalPersonas = registros.reduce((s, r) => s + r.total_personas_revisadas, 0)
  const totalVehiculos = registros.reduce((s, r) => s + r.vehiculos_revisar, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', gap: 24, background: '#ffffff' }}>
        <Link href="/monitorista" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none' }}>← Monitorista</Link>
        <div style={{ flexGrow: 1 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 600 }}>Seguridad Pública Municipal</span>
          <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, letterSpacing: '0.05em', textTransform: 'uppercase', marginLeft: 12, color: '#0f172a' }}>Incidentes por <span style={{ color: '#2563eb' }}>Cámara</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div><span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#94a3b8', display: 'block', letterSpacing: '0.1em' }}>OPERADOR</span><span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#1e40af' }}>{user.name}</span></div>
          <SignOutButton />
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>Cámaras de Vigilancia</span>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Incidentes por Cámara</h1>
            <div style={{ width: 64, height: 3, background: '#2563eb', marginTop: 12 }} />
          </div>
          <Link href="/monitorista/incidentes-camara/nuevo" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', background: '#0f172a', color: '#ffffff', padding: '12px 24px', textDecoration: 'none', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={14} /> NUEVO REGISTRO
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 20, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <BarChart3 size={20} color="#2563eb" />
              <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Registros</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{registros.length}</div></div>
            </div>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 20, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Camera size={20} color="#059669" />
              <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Registros Hoy</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{registrosHoy.length}</div></div>
            </div>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 20, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Camera size={20} color="#b45309" />
              <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Personas Revisadas</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{totalPersonas}</div></div>
            </div>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 20, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Camera size={20} color="#7c3aed" />
              <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vehículos Revisados</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{totalVehiculos}</div></div>
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <Th>Fecha</Th>
                <Th>Personas</Th>
                <Th>Vehículos</Th>
                <Th>Eventos</Th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center', fontFamily: 'Inter', fontSize: 13, color: '#94a3b8' }}>No hay registros</td></tr>
              )}
              {registros.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <Td>{new Date(r.fecha).toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' })}</Td>
                  <Td>{r.total_personas_revisadas}</Td>
                  <Td>{r.vehiculos_revisar}</Td>
                  <Td>{(r.persecuciones + r.asegurados_camara + r.vehiculos_recuperados + r.incendios + r.hechos_transito)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer style={{ padding: '32px 48px', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
        SSPM · SAN JUAN DEL RÍO · QRO · SENTINEL v0.1
      </footer>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>{children}</th>
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ fontFamily: 'Inter', fontSize: 13, color: '#1e293b', padding: '12px 16px' }}>{children}</td>
}
