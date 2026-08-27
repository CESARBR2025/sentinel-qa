export const styles = {
    secondaryButton: {
        background: '#FFFFFF',
        color: '#475569',
        padding: '6px 12px',
        border: '1px solid #E2E8F0',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--apple-font-display)',
        fontSize: '12px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textTransform: 'none' as const,
        letterSpacing: 'normal',
        ':hover': { background: '#F1F5F9' },
    },
    tag: {
        fontFamily: 'var(--apple-font-display)', fontSize: '12px', letterSpacing: 'normal',
        color: '#64748B', fontWeight: 600, textTransform: 'none' as const
    },
    statsGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '32px'
    },
    tableSection: { marginBottom: '48px' },
    tableContainer: {
        background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #E2E8F0',
        boxShadow: 'var(--shadow-card)', overflow: 'hidden'
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
        padding: '12px 16px', fontFamily: 'var(--apple-font-display)', fontSize: '12px', fontWeight: 600,
        color: '#64748B', textAlign: 'left' as const, borderBottom: '2px solid #F1F5F9',
        textTransform: 'none' as const, letterSpacing: 'normal'
    },
    td: {
        padding: '14px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9',
        fontFamily: 'var(--apple-font-display)'
    },
    primaryButton: {
        background: '#0F172A', color: 'white', padding: '10px 20px', border: 'none',
        borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: '14px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
        textTransform: 'none' as const, letterSpacing: 'normal'
    },
    tabButton: (isActive: boolean) => ({
        padding: '8px 16px', cursor: 'pointer', border: 'none', background: isActive ? '#1f355a' : '#f1f5f9',
        fontFamily: 'var(--apple-font-display)', fontSize: '14px', fontWeight: 600,
        color: isActive ? '#ffffff' : '#64748b',
        borderRadius: 'var(--radius-full)',
        display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
        whiteSpace: 'nowrap' as const,
        textTransform: 'none' as const, letterSpacing: 'normal'
    }),
    searchInput: {
        padding: '0 12px 0 32px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0',
        fontFamily: 'var(--apple-font-display)', fontSize: '12px', width: '200px', height: '32px', outline: 'none',
        background: '#f8fafc'
    },
    badge: (bg: string, color: string) => ({
        background: bg, color: color, padding: '3px 10px', borderRadius: 'var(--radius-full)',
        fontSize: '12px', fontWeight: 500, fontFamily: 'var(--apple-font-display)', textTransform: 'none' as const
    })
}
