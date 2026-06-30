export const SentinelHero = ({ principal, secundario, tag }: { principal: string, secundario: string, tag: string }) => {
  return (
    <section style={{ marginBottom: '64px' }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', letterSpacing: '0.4em', color: '#3b82f6', textTransform: 'uppercase', fontWeight: 600 }}>
        {tag}
      </span>
      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '56px', fontWeight: 800, color: '#0f172a', margin: '12px 0', textTransform: 'uppercase', lineHeight: 1 }}>
        {principal} <span style={{ color: '#2563eb' }}>{secundario}</span>
      </h1>
      <div style={{ width: '80px', height: '4px', background: '#2563eb', marginTop: '16px' }} />
    </section>
  )
}