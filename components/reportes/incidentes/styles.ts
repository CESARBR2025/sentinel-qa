export const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff', // Fondo blanco limpio como el original
    fontFamily: 'Inter, sans-serif',
  },
  main: {
    padding: '32px 40px',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  tag: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748B',
    letterSpacing: '0.1em',
  },
  title: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '42px',
    fontWeight: 800,
    color: '#0F172A',
    margin: 0,
    textTransform: 'uppercase' as const,
  },
  filterCard: {
    background: '#f8fafc',
    padding: '20px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '2px', // Bordes más rectos como el original
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#0F172A',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px', // Gap más ajustado
  },
   tableContainer: {
    marginTop: '32px',
    border: '1px solid #e2e8f0',
    background: 'white',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
  },
  th: {
    background: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase' as const,
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    color: '#0F172A',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
  }
};