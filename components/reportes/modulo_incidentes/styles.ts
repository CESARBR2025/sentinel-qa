export const styles = {
    secondaryButton: {
        background: '#F8FAFC',
        color: '#475569',
        padding: '6px 12px',
        border: '1px solid #E2E8F0',
        borderRadius: '4px',
        fontFamily: 'JetBrains Mono',
        fontSize: '10px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        // Efecto hover simple:
        ':hover': { background: '#F1F5F9' },
    },
    container: { minHeight: '100vh', background: '#F1F5F9', color: '#0F172A', fontFamily: 'Inter, sans-serif' },
    main: { maxWidth: '1600px', margin: '0 auto', padding: '40px 48px' },
    headerContainer: {
        display: 'flex', justifyContent: 'space-between' as const, alignItems: 'flex-end' as const,
        marginBottom: '40px', borderLeft: '4px solid #2563EB', paddingLeft: '20px'
    },
    title: {
        fontFamily: 'Barlow Condensed', fontSize: '56px', fontWeight: 800,
        margin: 0, lineHeight: 1, textTransform: 'uppercase' as const
    },
    tag: {
        fontFamily: 'JetBrains Mono', fontSize: '11px', letterSpacing: '0.4em',
        color: '#64748B', fontWeight: 700
    },
    statsGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px', marginBottom: '32px'
    },
    tableSection: { marginBottom: '48px' },
    tableContainer: {
        background: 'white', borderRadius: '4px', border: '1px solid #E2E8F0', overflow: 'hidden'
    },
    tableHeader: {
        padding: '16px 24px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#FFFFFF'
    },
    th: {
        padding: '12px 16px', fontFamily: 'JetBrains Mono', fontSize: '10px',
        color: '#64748B', textAlign: 'left' as const, borderBottom: '2px solid #F1F5F9', textTransform: 'uppercase' as const
    },
    td: {
        padding: '14px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9'
    },
    primaryButton: {
        background: '#0F172A', color: 'white', padding: '10px 16px', border: 'none',
        borderRadius: '4px', fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
    },
    tabButton: (isActive: boolean) => ({
        padding: '12px 20px', cursor: 'pointer', border: 'none', background: 'none',
        fontFamily: 'Barlow Condensed', fontSize: '18px', fontWeight: 700,
        color: isActive ? '#2563EB' : '#64748B',
        borderBottom: isActive ? '4px solid #2563EB' : '4px solid transparent',
        display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
    }),
    searchInput: {
        padding: '0 12px 0 32px', borderRadius: '4px', border: '1px solid #E2E8F0',
        fontFamily: 'Inter', fontSize: '12px', width: '200px', height: '32px', outline: 'none'
    },
    badge: (bg: string, color: string) => ({
        background: bg, color: color, padding: '4px 8px', borderRadius: '3px',
        fontSize: '11px', fontWeight: 700, fontFamily: 'JetBrains Mono', textTransform: 'uppercase' as const
    })
}