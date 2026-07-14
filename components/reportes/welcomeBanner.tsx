export const SentinelHero = ({ principal, secundario, tag }: { principal: string, secundario: string, tag: string }) => {
  return (
    <section style={{ marginBottom: '64px' }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', letterSpacing: '0.4em', color: '#3e5171', textTransform: 'uppercase', fontWeight: 600 }}>
        {tag}
      </span>
      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '56px', fontWeight: 800, color: '#0f172a', margin: '12px 0', textTransform: 'uppercase', lineHeight: 1 }}>
        {principal} <span style={{ color: '#1f355a' }}>{secundario}</span>
      </h1>
      <div style={{ width: '80px', height: '4px', background: '#1f355a', marginTop: '16px' }} />
    </section>
  )
}