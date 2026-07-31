import { ResetSistemaForm } from '@/components/admin/ResetSistemaForm'
import { TABLAS_RESET_SISTEMA } from '@/lib/admin/sistema-constants'

export default function SistemaPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, color: '#0f172a', margin: 0 }}>
          Sistema
        </h1>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', marginTop: 4 }}>
          Operaciones administrativas sensibles sobre el sistema completo.
        </p>
      </div>

      <ResetSistemaForm totalTablas={TABLAS_RESET_SISTEMA.length} />
    </div>
  )
}
