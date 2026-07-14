import { LucideIcon } from 'lucide-react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  icon: LucideIcon;
  as?: 'input' | 'select';
}

export const RolField = ({ label, icon: Icon, as = 'input', children, ...props }: Props) => {
  const Component = as as any;
  
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* LABEL: Estilo JetBrains Mono, técnico y espaciado */}
      <label 
        style={{ 
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '9px',
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          marginLeft: '2px'
        }}
      >
        {label}
      </label>

      <div className="relative group">
        {/* ICONO: Color azul acero que cambia a azul brillante al enfocar */}
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <Icon size={14} strokeWidth={2} />
        </div>

        {/* INPUT / SELECT: Bordes rectos, fuente técnica y fondo limpio */}
        <Component
          {...props}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-900 text-xs transition-all outline-none"
          style={{ 
            fontFamily: 'Inter, sans-serif',
            borderRadius: '2px', // Bordes casi rectos para el look técnico
            borderLeft: '3px solid #e2e8f0', // Detalle lateral sutil
          }}
          // Efecto de foco vía CSS inline o Tailwind
          onFocus={(e: any) => {
            e.target.style.borderColor = '#3e5171';
            e.target.style.borderLeftColor = '#1f355a';
            e.target.style.boxShadow = '0 0 0 1px rgba(62, 81, 113, 0.1)';
          }}
          onBlur={(e: any) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.borderLeftColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        >
          {children}
        </Component>
      </div>

      {/* DETALLE TÉCNICO: Una pequeña línea decorativa opcional en la base al hacer focus */}
      <div className="h-[1px] w-0 group-focus-within:w-full bg-blue-500 transition-all duration-300 opacity-50" />
    </div>
  );
};