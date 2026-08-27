export const styles = {
    filterCard: {
        background: 'white', padding: '20px', borderRadius: 'var(--radius-lg)',
        border: '1px solid #E2E8F0', marginBottom: '24px', boxShadow: 'var(--shadow-card)'
    },
    statsGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '32px'
    },
    tableSection: { marginBottom: '48px' },
    tableContainer: {
        background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #E2E8F0',
        overflowX: 'auto' as const, boxShadow: 'var(--shadow-card)'
    },
    tableHeader: { padding: '20px 24px', borderBottom: '1px solid #E2E8F0' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: {
        padding: '12px 16px', fontFamily: 'var(--apple-font-display)', fontSize: '12px', fontWeight: 600,
        color: '#64748B', textAlign: 'left' as const, borderBottom: '2px solid #F1F5F9',
        textTransform: 'none' as const, letterSpacing: 'normal'
    },
    td: {
        padding: '14px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9',
        fontFamily: 'var(--apple-font-display)'
    },
    totalTh: { padding: '12px 16px', fontFamily: 'var(--apple-font-display)', fontSize: '12px', fontWeight: 600, textAlign: 'left' as const, borderBottom: '2px solid #F1F5F9', background: '#F1F5F9', color: '#0F172A' },
    totalTd: { padding: '14px 16px', fontSize: '13px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC', fontWeight: 700, color: '#1f355a', fontFamily: 'var(--apple-font-display)' },
    label: { fontFamily: 'var(--apple-font-display)', fontSize: '12px', fontWeight: 500, color: '#64748B', textTransform: 'none' as const, letterSpacing: 'normal', marginBottom: '8px', display: 'block' },
    input: { width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid #E2E8F0', fontFamily: 'var(--apple-font-display)', fontSize: '14px', background: '#f8fafc', outline: 'none' },
    primaryButton: {
        background: '#0F172A', color: 'white', padding: '10px 20px', border: 'none',
        borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: '14px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
        textTransform: 'none' as const, letterSpacing: 'normal'
    },
    secondaryButton: {
        background: '#FFFFFF', color: '#E11D48', padding: '6px 12px', border: '1px solid #FECDD3',
        borderRadius: 'var(--radius-md)', fontFamily: 'var(--apple-font-display)', fontSize: '12px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
        textTransform: 'none' as const, letterSpacing: 'normal'
    },
    monoData: {
        fontFamily: 'var(--apple-font-display)', fontWeight: 700, fontSize: '12px', color: '#E11D48'
    },
    badge: (bg: string, color: string) => ({
        background: bg, color: color, padding: '3px 10px', borderRadius: 'var(--radius-full)',
        fontSize: '12px', fontWeight: 500, fontFamily: 'var(--apple-font-display)'
    })
}
