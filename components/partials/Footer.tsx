import { APP_VERSION } from '@/lib/constants'

export function DashboardFooter() {
  return (
    <>
      <style>{`
        .dash-footer {
          margin-top: auto; padding-top: 24px; padding-bottom: env(safe-area-inset-bottom);
          border-top: 1px solid #e2e8f0;
          font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #94a3b8;
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
        }
        @media (max-width: 720px) { .dash-footer { padding-top: 16px; font-size: 11px; } }
      `}</style>
      <div className="dash-footer">
        <div>SSPM · San Juan del Río · Qro</div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span>Centinela {APP_VERSION}</span>
        </div>
      </div>
    </>
  );
}
