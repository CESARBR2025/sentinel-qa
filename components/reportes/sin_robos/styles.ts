export const styles = {
    tag: {
        fontFamily: 'var(--apple-font-display)', fontSize: '12px', letterSpacing: 'normal',
        color: '#64748B', fontWeight: 600, textTransform: 'none' as const
    },
    filterCard: {
        background: 'white', padding: '20px', borderRadius: 'var(--radius-lg)',
        border: '1px solid #E2E8F0', marginBottom: '24px', boxShadow: 'var(--shadow-card)'
    },
    label: {
        fontFamily: 'var(--apple-font-display)', fontSize: '12px', fontWeight: 500,
        color: '#64748B', textTransform: 'none' as const, letterSpacing: 'normal', marginBottom: '8px', display: 'block'
    },
    input: {
        width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid #E2E8F0',
        fontFamily: 'var(--apple-font-display)', fontSize: '14px', background: '#f8fafc', outline: 'none'
    },
    tableSection: { marginBottom: '48px' },
    tableContainer: { background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #E2E8F0', overflowX: 'auto' as const, boxShadow: 'var(--shadow-card)' },
    tableHeader: { padding: '20px 24px', borderBottom: '1px solid #E2E8F0' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: {
        padding: '12px 16px', fontFamily: 'var(--apple-font-display)', fontSize: '12px', fontWeight: 600,
        color: '#64748B', textAlign: 'left' as const, borderBottom: '2px solid #F1F5F9',
        textTransform: 'none' as const, letterSpacing: 'normal'
    },
    td: { padding: '14px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9', fontFamily: 'var(--apple-font-display)' },
    monoDataBlue: {
        fontFamily: 'var(--apple-font-display)', fontWeight: 700, fontSize: '12px', color: '#1f355a'
    },
    primaryButton: {
        background: '#0F172A', color: 'white', padding: '10px 20px', border: 'none',
        borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: '14px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
        textTransform: 'none' as const, letterSpacing: 'normal'
    },
    secondaryButtonBlue: {
        background: '#ffffff', color: '#1f355a', padding: '6px 12px', border: '1px solid #dbdfe5',
        borderRadius: 'var(--radius-md)', fontFamily: 'var(--apple-font-display)', fontSize: '12px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
        textTransform: 'none' as const, letterSpacing: 'normal'
    },
    badge: (bg: string, color: string) => ({
        background: bg, color: color, padding: '3px 10px', borderRadius: 'var(--radius-full)',
        fontSize: '12px', fontWeight: 500, fontFamily: 'var(--apple-font-display)'
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
        fontSize: '12px',
        fontFamily: 'var(--apple-font-display)',
        fontWeight: 600,
        borderRadius: 'var(--radius-md)',
        border: '1px solid #E2E8F0',
        background: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: '#64748B'
    },
    paginationActive: {
        background: '#1f355a',
        color: 'white',
        borderColor: '#1f355a'
    },
    paginationText: {
        fontSize: '12px',
        fontFamily: 'var(--apple-font-display)',
        color: '#64748B'
    }
};
