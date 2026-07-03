export const styles = {
    container: { 
        minHeight: '100vh', 
        background: '#F1F5F9', 
        color: '#0F172A', 
        fontFamily: "'Inter', sans-serif" 
    },
    main: { maxWidth: '1600px', margin: '0 auto', padding: '40px 48px' },
    headerContainer: {
        display: 'flex', justifyContent: 'space-between' as const, alignItems: 'flex-end' as const,
        marginBottom: '40px', borderLeft: '4px solid #2563EB', paddingLeft: '20px'
    },
    title: { 
        fontFamily: "'Barlow Condensed', sans-serif", fontSize: '56px', fontWeight: 800, 
        margin: 0, lineHeight: 1, textTransform: 'uppercase' as const 
    },
    tag: { 
        fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.4em', 
        color: '#64748B', fontWeight: 700 
    },
    filterCard: { 
        background: 'white', padding: '24px', borderRadius: '4px', 
        border: '1px solid #E2E8F0', marginBottom: '24px' 
    },
    label: { 
        fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, 
        color: '#64748B', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' 
    },
    input: { 
        width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #E2E8F0', 
        fontFamily: "'Inter', sans-serif", fontSize: '14px' 
    },
    tableSection: { marginBottom: '48px' }, 
    tableContainer: { background: 'white', borderRadius: '4px', border: '1px solid #E2E8F0', overflow: 'hidden' },
    tableHeader: { padding: '20px 24px', borderBottom: '1px solid #E2E8F0' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { 
        padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', 
        color: '#64748B', textAlign: 'left' as const, borderBottom: '2px solid #F1F5F9' 
    },
    td: { padding: '14px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' },
    monoDataBlue: {
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '12px', color: '#2563EB'
    },
    primaryButton: {
        background: '#0F172A', color: 'white', padding: '10px 16px', border: 'none',
        borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
    },
    secondaryButtonBlue: {
        background: '#EFF6FF', color: '#2563EB', padding: '6px 12px', border: '1px solid #DBEAFE',
        borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
    },
    badge: (bg: string, color: string) => ({
        background: bg, color: color, padding: '2px 6px', borderRadius: '3px',
        fontSize: '11px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace"
    }),
    paginationContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: '#FFF',
        borderTop: '1px solid #E2E8F0'
    },
    paginationButton: {
        padding: '6px 12px',
        fontSize: '11px',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        borderRadius: '4px',
        border: '1px solid #E2E8F0',
        background: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: '#64748B'
    },
    paginationActive: {
        background: '#2563EB',
        color: 'white',
        borderColor: '#2563EB'
    },
    paginationText: {
        fontSize: '11px',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#64748B'
    }
};