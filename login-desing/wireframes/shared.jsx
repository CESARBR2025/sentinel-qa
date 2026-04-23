// Shared tokens y helpers para todos los wireframes.
// Paleta derivada del logo: azul marino profundo, rojo institucional, dorado.
// Estética wireframe: monocromo oscuro + 1 acento + rotulación manuscrita.

const WF = {
  // Fondo base y trazos (modo oscuro "blueprint")
  ink:      '#0b1220',   // casi negro azulado
  inkSoft:  '#111a2e',
  inkLine:  '#1c2942',
  stroke:   '#3a4a6b',   // líneas wireframe
  strokeLo: '#24304a',
  text:     '#c9d3e6',
  textDim:  '#7a8aa8',
  textMute: '#4a5878',
  // Acentos del logo
  navy:     '#14224a',
  red:      '#c0223a',
  gold:     '#d4a43a',
  // Fuentes
  fontHand: "'Caveat', 'Architects Daughter', cursive",
  fontSketch: "'Architects Daughter', 'Caveat', cursive",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",
  fontUI:   "'Barlow Condensed', 'Inter', sans-serif",
};

// Escudo placeholder (genérico, NO el logo oficial) — una estrella hexagonal
// con un sello interior. Se usa en todos los wireframes.
function ShieldMark({ size = 72, stroke = WF.stroke, fill = 'transparent', accent = WF.red }) {
  const s = size;
  const cx = s/2, cy = s/2;
  // Hexagrama (estrella de 6 puntas) tipo insignia policial
  const pts = [];
  for (let i = 0; i < 12; i++) {
    const r = i % 2 === 0 ? s*0.48 : s*0.30;
    const a = (Math.PI / 6) * i - Math.PI/2;
    pts.push(`${cx + r*Math.cos(a)},${cy + r*Math.sin(a)}`);
  }
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display:'block' }}>
      <polygon points={pts.join(' ')} fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx={cx} cy={cy} r={s*0.22} fill="none" stroke={stroke} strokeWidth="1.2"/>
      <rect x={cx-s*0.12} y={cy-s*0.14} width={s*0.24} height={s*0.28} fill="none" stroke={accent} strokeWidth="1.2"/>
      <path d={`M ${cx-s*0.08} ${cy} L ${cx-s*0.02} ${cy+s*0.06} L ${cx+s*0.09} ${cy-s*0.07}`}
            fill="none" stroke={accent} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

// Nota manuscrita flotante tipo "post-it" de diseñador
function Scribble({ children, rotate = -2, color = WF.gold, size = 14, style = {} }) {
  return (
    <div style={{
      fontFamily: WF.fontHand,
      color,
      fontSize: size,
      lineHeight: 1.1,
      transform: `rotate(${rotate}deg)`,
      display:'inline-block',
      ...style
    }}>{children}</div>
  );
}

// Flecha dibujada a mano (SVG simple)
function Arrow({ d = 'M 0 0 L 60 20', color = WF.gold, width = 1.4 }) {
  return (
    <svg style={{ overflow:'visible', position:'absolute' }}>
      <defs>
        <marker id="ar-head" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color}/>
        </marker>
      </defs>
      <path d={d} stroke={color} strokeWidth={width} fill="none"
            strokeLinecap="round" markerEnd="url(#ar-head)"/>
    </svg>
  );
}

// Campo de input estilo wireframe
function InputField({ label, placeholder, mono = true, icon, style = {}, accent = false }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      <div style={{
        fontFamily: WF.fontMono, fontSize: 9, letterSpacing: '0.18em',
        color: accent ? WF.gold : WF.textDim, marginBottom: 6, textTransform:'uppercase'
      }}>{label}</div>
      <div style={{
        border: `1px solid ${accent ? WF.gold : WF.stroke}`,
        background: WF.inkSoft,
        padding: '10px 12px',
        display:'flex', alignItems:'center', gap:10,
        fontFamily: mono ? WF.fontMono : WF.fontUI,
        fontSize: 13, color: WF.text,
        minHeight: 40,
      }}>
        {icon && <span style={{ color: WF.textDim, fontSize:12 }}>{icon}</span>}
        <span style={{ color: WF.textMute }}>{placeholder}</span>
        <span style={{ marginLeft:'auto', color: WF.textMute, fontSize:10, fontFamily: WF.fontMono }}>_</span>
      </div>
    </div>
  );
}

function PrimaryButton({ children, variant = 'red', style = {} }) {
  const bg = variant === 'red' ? WF.red : variant === 'gold' ? WF.gold : WF.navy;
  const fg = variant === 'gold' ? '#1a1200' : '#fff';
  return (
    <div style={{
      background: bg, color: fg,
      fontFamily: WF.fontUI, fontWeight: 700, letterSpacing:'0.14em',
      fontSize: 13, textTransform:'uppercase',
      padding:'13px 16px', textAlign:'center',
      border: `1px solid ${bg}`,
      cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center', gap:10,
      ...style
    }}>{children}</div>
  );
}

// Caja base oscura del wireframe con líneas de construcción en esquinas
function DarkFrame({ children, style = {}, corners = true }) {
  return (
    <div style={{
      position:'relative', width:'100%', height:'100%',
      background: WF.ink,
      overflow:'hidden',
      ...style
    }}>
      {corners && <>
        <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
      </>}
      {children}
    </div>
  );
}
function Corner({ pos }) {
  const size = 14;
  const off = 10;
  const s = { position:'absolute', width:size, height:size, borderColor: WF.gold, borderStyle:'solid', borderWidth:0 };
  const map = {
    tl: { top: off, left: off, borderTopWidth:1, borderLeftWidth:1 },
    tr: { top: off, right: off, borderTopWidth:1, borderRightWidth:1 },
    bl: { bottom: off, left: off, borderBottomWidth:1, borderLeftWidth:1 },
    br: { bottom: off, right: off, borderBottomWidth:1, borderRightWidth:1 },
  };
  return <div style={{ ...s, ...map[pos] }}/>;
}

// Grid de fondo tipo blueprint
function GridBG({ size = 24, color = 'rgba(255,255,255,0.025)' }) {
  return (
    <div style={{
      position:'absolute', inset:0,
      backgroundImage:
        `linear-gradient(${color} 1px, transparent 1px),
         linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      pointerEvents:'none',
    }}/>
  );
}

// Línea de estado superior (tipo HUD)
function StatusBar({ label = 'SSP // ACCESO SEGURO', right = 'CIFRADO AES-256' }) {
  return (
    <div style={{
      display:'flex', justifyContent:'space-between', alignItems:'center',
      fontFamily: WF.fontMono, fontSize: 9, letterSpacing:'0.18em',
      color: WF.textDim, textTransform:'uppercase',
      padding: '10px 16px',
      borderBottom: `1px solid ${WF.strokeLo}`,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background: WF.gold, boxShadow:`0 0 8px ${WF.gold}` }}/>
        {label}
      </div>
      <div>{right}</div>
    </div>
  );
}

Object.assign(window, {
  WF, ShieldMark, Scribble, Arrow, InputField, PrimaryButton,
  DarkFrame, GridBG, StatusBar, Corner
});
