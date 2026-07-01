// components/reportes/d1/styles.ts

export const styles = {
    // Layout Principal
    container: { 
        minHeight: '100vh', 
        background: '#F1F5F9', 
        color: '#0F172A', 
        fontFamily: 'Inter, sans-serif' 
    },
    main: { 
        maxWidth: '1800px', 
        margin: '0 auto', 
        padding: '40px 48px' 
    },
    headerContainer: {
        display: 'flex', 
        justifyContent: 'space-between' as const, 
        alignItems: 'flex-end' as const,
        marginBottom: '40px', 
        borderLeft: '4px solid #2563EB', 
        paddingLeft: '20px'
    },
    title: {
        fontFamily: 'Barlow Condensed', 
        fontSize: '56px', 
        fontWeight: 800,
        margin: 0, 
        lineHeight: 1, 
        textTransform: 'uppercase' as const
    },
    tag: {
        fontFamily: 'JetBrains Mono', 
        fontSize: '11px', 
        letterSpacing: '0.4em',
        color: '#64748B', 
        fontWeight: 700
    },

    // Barra de Filtros
    filterBar: {
        background: 'white',
        padding: '20px',
        borderRadius: '4px',
        border: '1px solid #E2E8F0',
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        alignItems: 'end',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '6px'
    },
    filterLabel: {
        fontFamily: 'JetBrains Mono',
        fontSize: '10px',
        fontWeight: 700,
        color: '#64748B',
        textTransform: 'uppercase' as const
    },

    // Tabla y Secciones
    tableSection: { 
        marginBottom: '48px' 
    },
    tableContainer: {
        background: 'white', 
        borderRadius: '4px', 
        border: '1px solid #E2E8F0', 
        overflowX: 'auto' as const, 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
        fontFamily: 'JetBrains Mono', 
        fontSize: '10px',
        color: '#64748B', 
        textAlign: 'left' as const, 
        borderBottom: '2px solid #F1F5F9', 
        textTransform: 'uppercase' as const, 
        background: '#F8FAFC', 
        whiteSpace: 'nowrap' as const
    },
    td: {
        padding: '14px 16px', 
        fontSize: '12px', 
        color: '#334155', 
        borderBottom: '1px solid #F1F5F9', 
        whiteSpace: 'nowrap' as const,
        fontFamily: 'Inter'
    },

    // Elementos de Formulario / UI
    input: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #E2E8F0',
        fontFamily: 'Inter',
        fontSize: '13px',
        outline: 'none',
        color: '#0F172A',
        height: '38px'
    },
    searchInput: {
        padding: '0 12px 0 32px', 
        borderRadius: '4px', 
        border: '1px solid #E2E8F0',
        fontFamily: 'Inter', 
        fontSize: '12px', 
        width: '250px', 
        height: '32px', 
        outline: 'none'
    },
    select: {
        padding: '6px 8px',
        borderRadius: '4px',
        border: '1px solid #E2E8F0',
        fontFamily: 'JetBrains Mono',
        fontSize: '11px',
        background: '#F8FAFC',
        outline: 'none'
    },

    // Botones
    primaryButton: {
        background: '#0F172A', 
        color: 'white', 
        padding: '10px 16px', 
        border: 'none',
        borderRadius: '4px', 
        fontFamily: 'JetBrains Mono', 
        fontSize: '11px', 
        fontWeight: 600,
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        cursor: 'pointer'
    },
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
        transition: 'all 0.2s ease'
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
        fontFamily: 'JetBrains Mono', 
        fontWeight: 600, 
        fontSize: '11px'
    },
    badge: (type: 'success' | 'warning' | 'danger' | 'neutral' | 'primary') => {
        const colors = {
            success: { bg: '#DCFCE7', text: '#166534' },
            warning: { bg: '#FEF9C3', text: '#854d0e' },
            danger: { bg: '#FEE2E2', text: '#991B1B' },
            primary: { bg: '#DBEAFE', text: '#1E40AF' },
            neutral: { bg: '#F1F5F9', text: '#475569' }
        };
        return {
            background: colors[type].bg, 
            color: colors[type].text,
            padding: '4px 8px', 
            borderRadius: '3px', 
            fontSize: '10px',
            fontWeight: 700, 
            fontFamily: 'JetBrains Mono', 
            textTransform: 'uppercase' as const,
            display: 'inline-block'
        };
    }
};