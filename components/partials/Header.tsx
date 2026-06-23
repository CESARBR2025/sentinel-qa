interface DashboardHeaderProps {
  user: {
    name: string;
    apellido?: string;
    email: string;
  };
  children?: React.ReactNode;
}

export function DashboardHeader({
  user,
  children,
}: DashboardHeaderProps) {
  return (
    <div
      className="cyber-reveal delay-1"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 24,
        borderBottom: '1px solid rgba(59,130,246,0.15)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: -1,
          left: 0,
          width: 64,
          height: 2,
          background: '#3b82f6',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <img
          src="/logo_sentinel.png"
          alt="S"
          style={{
            height: 64,
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 16px rgba(59,130,246,0.3))',
          }}
        />

        <div>
          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: '#3b82f6',
              textTransform: 'uppercase',
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: '#3b82f6',
                display: 'inline-block',
              }}
            />
            Sistema Táctico
          </div>

          <h1
            style={{
              fontFamily: 'Barlow Condensed,sans-serif',
              fontWeight: 800,
              fontSize: 56,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: 0,
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            SENTINEL
          </h1>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        <div
          style={{
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              color: '#94a3b8',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Operador Identificado
          </div>

          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 13,
              color: '#3b82f6',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            {user.name} {user.apellido ?? ''}
          </div>

          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              color: '#94a3b8',
            }}
          >
            {user.email}
          </div>
        </div>

        <div
          style={{
            width: 1,
            height: 48,
            background: 'rgba(59,130,246,0.2)',
          }}
        />

        {children}
      </div>
    </div>
  );
}