export const styles = {
    filterCard: { 
        background: 'white', padding: '24px', borderRadius: '4px', 
        border: '1px solid #E2E8F0', marginBottom: '24px' 
    },
    statsGrid: { 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '12px', marginBottom: '32px' 
    },
    tableContainer: { 
        background: 'white', borderRadius: '4px', border: '1px solid #E2E8F0' 
    },
    tableHeader: { padding: '20px 24px', borderBottom: '1px solid #E2E8F0' },
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
    badge: (bg: string, color: string) => ({
        background: bg, color: color, padding: '2px 6px', borderRadius: '3px',
        fontSize: '11px', fontWeight: 700, fontFamily: 'JetBrains Mono'
    })
}