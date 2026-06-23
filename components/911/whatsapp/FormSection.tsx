interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection = ({ title, children }: SectionProps) => (
  <section style={{ marginBottom: '40px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
      <div style={{ width: '4px', height: '24px', background: '#2563eb' }} />
      <h3 style={{ 
        fontFamily: 'Barlow Condensed, sans-serif', fontSize: '20px', 
        fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', 
        margin: 0, color: '#0f172a' 
      }}>
        {title}
      </h3>
    </div>
    {children}
  </section>
);