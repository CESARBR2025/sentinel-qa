export const styles = {
    container: { minHeight: '100vh', background: '#F1F5F9', color: '#0F172A', fontFamily: 'Inter, sans-serif' },
    main: { maxWidth: '1600px', margin: '0 auto', padding: '40px 48px' },
    headerContainer: {
        display: 'flex', justifyContent: 'space-between' as const, alignItems: 'flex-end' as const,
        marginBottom: '40px', borderLeft: '4px solid #1f355a', paddingLeft: '20px'
    },
    title: { 
        fontFamily: 'Barlow Condensed', fontSize: '56px', fontWeight: 800, 
        margin: 0, lineHeight: 1, textTransform: 'uppercase' as const 
    },
    tag: { 
        fontFamily: 'JetBrains Mono', fontSize: '11px', letterSpacing: '0.4em', 
        color: '#64748B', fontWeight: 700 
    },
    filterCard: { 
        background: 'white', padding: '24px', borderRadius: '4px', 
        border: '1px solid #E2E8F0', marginBottom: '24px' 
    },
    statsGrid: { 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '12px', marginBottom: '32px' 
    },
    // AGREGADO PARA QUE NO MARQUE ERROR
    tableSection: { marginBottom: '48px' }, 
    tableContainer: { 
        background: 'white', borderRadius: '4px', border: '1px solid #E2E8F0', overflow: 'hidden' 
    },
    tableHeader: { padding: '20px 24px', borderBottom: '1px solid #E2E8F0' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { 
        padding: '12px 16px', fontFamily: 'JetBrains Mono', fontSize: '10px', 
        color: '#64748B', textAlign: 'left' as const, borderBottom: '2px solid #F1F5F9' 
    },
    td: { 
        padding: '14px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' 
    },
    totalTh: { padding: '12px 16px', fontFamily: 'JetBrains Mono', fontSize: '10px', textAlign: 'left' as const, borderBottom: '2px solid #F1F5F9', background: '#F1F5F9', color: '#0F172A', fontWeight: 800 },
    totalTd: { padding: '14px 16px', fontSize: '13px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC', fontWeight: 700, color: '#1f355a' },
    label: { fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' },
    input: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #E2E8F0', fontFamily: 'Inter' },
    primaryButton: {
        background: '#0F172A', color: 'white', padding: '10px 16px', border: 'none',
        borderRadius: '4px', fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
    },
    // AGREGADO EN ROJO
    secondaryButton: {
        background: '#FFF1F2', color: '#E11D48', padding: '6px 12px', border: '1px solid #FECDD3',
        borderRadius: '4px', fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
    },
    // AGREGADO EN ROJO
    monoData: {
        fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '12px', color: '#E11D48'
    },
    badge: (bg: string, color: string) => ({
        background: bg, color: color, padding: '2px 6px', borderRadius: '3px',
        fontSize: '11px', fontWeight: 700, fontFamily: 'JetBrains Mono'
    })
}