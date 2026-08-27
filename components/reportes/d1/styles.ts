// components/reportes/d1/styles.ts

export const styles = {
    // Barra de Filtros
    filterBar: {
        background: 'white',
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #E2E8F0',
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        alignItems: 'end',
        boxShadow: 'var(--shadow-card)'
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '6px'
    },
    filterLabel: {
        fontFamily: 'var(--apple-font-display)',
        fontSize: '12px',
        fontWeight: 500,
        color: '#64748B',
        textTransform: 'none' as const,
        letterSpacing: 'normal'
    },

    // Tabla y Secciones
    tableSection: { 
        marginBottom: '48px' 
    },
    tableContainer: {
        background: 'white', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid #E2E8F0', 
        overflowX: 'auto' as const, 
        boxShadow: 'var(--shadow-card)'
    },
    tableHeader: {
        padding: '16px 24px', 
        borderBottom: '1px solid #E2E8F0',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: '#FFFFFF'
    },
    table: { 
        width: '100%', 
        borderCollapse: 'collapse' as const, 
        minWidth: '3200px' // Aumentado para los 40 campos
    },
    th: {
        padding: '12px 16px', 
        fontFamily: 'var(--apple-font-display)', 
        fontSize: '12px',
        fontWeight: 600,
        color: '#64748B', 
        textAlign: 'left' as const, 
        borderBottom: '2px solid #F1F5F9', 
        textTransform: 'none' as const, 
        letterSpacing: 'normal',
        background: '#F8FAFC', 
        whiteSpace: 'nowrap' as const
    },
    td: {
        padding: '14px 16px', 
        fontSize: '12px', 
        color: '#334155', 
        borderBottom: '1px solid #F1F5F9', 
        whiteSpace: 'nowrap' as const,
        fontFamily: 'var(--apple-font-display)'
    },

    // Elementos de Formulario / UI
    input: {
        padding: '8px 12px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #E2E8F0',
        fontFamily: 'var(--apple-font-display)',
        fontSize: '13px',
        outline: 'none',
        color: '#0F172A',
        height: '38px',
        background: '#f8fafc'
    },
    searchInput: {
        padding: '0 12px 0 32px', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid #E2E8F0',
        fontFamily: 'var(--apple-font-display)', 
        fontSize: '12px', 
        width: '250px', 
        height: '32px', 
        outline: 'none',
        background: '#f8fafc'
    },
    select: {
        padding: '6px 8px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #E2E8F0',
        fontFamily: 'var(--apple-font-display)',
        fontSize: '11px',
        background: '#F8FAFC',
        outline: 'none'
    },

    // Botones
    primaryButton: {
        background: '#0F172A', 
        color: 'white', 
        padding: '10px 20px', 
        border: 'none',
        borderRadius: 'var(--radius-lg)', 
        fontFamily: 'var(--apple-font-display)', 
        fontSize: '14px', 
        fontWeight: 600,
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        cursor: 'pointer',
        textTransform: 'none' as const,
        letterSpacing: 'normal'
    },
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
        letterSpacing: 'normal'
    },

    // Paginación
    paginationContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        background: 'white',
        borderTop: '1px solid #E2E8F0'
    },

    // Utilidades
    monoData: {
        fontFamily: 'var(--apple-font-display)', 
        fontWeight: 600, 
        fontSize: '12px'
    },
    badge: (type: 'success' | 'warning' | 'danger' | 'neutral' | 'primary') => {
        const colors = {
            success: { bg: '#DCFCE7', text: '#166534' },
            warning: { bg: '#FEF9C3', text: '#854d0e' },
            danger: { bg: '#FEE2E2', text: '#991B1B' },
            primary: { bg: '#dbdfe5', text: '#172844' },
            neutral: { bg: '#F1F5F9', text: '#475569' }
        };
        return {
            background: colors[type].bg, 
            color: colors[type].text,
            padding: '3px 10px', 
            borderRadius: 'var(--radius-full)', 
            fontSize: '12px',
            fontWeight: 500, 
            fontFamily: 'var(--apple-font-display)', 
            textTransform: 'none' as const,
            display: 'inline-block'
        };
    }
};
