export function DashboardFooter() {
  return (
    <div
      className="cyber-reveal delay-4"
      style={{
        marginTop: 'auto',
        paddingTop: 24,
        borderTop: '1px solid rgba(62, 81, 113,0.2)',
        fontFamily: 'JetBrains Mono,monospace',
        fontSize: 10,
        color: '#94a3b8',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>SSPM · SAN JUAN DEL RÍO · QRO</div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span>SENTINEL v0.1</span>

        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#3e5171',
          }}
        />
      </div>
    </div>
  );
}