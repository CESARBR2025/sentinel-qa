// Wireframe C — Centro de comando con mapa táctico de fondo
// Mapa como telón de fondo, panel de login flotante en el centro.

function WireframeC() {
  // Generar puntos de mapa pseudo-aleatorios estables
  const dots = React.useMemo(() => {
    const r = [];
    let seed = 7;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i=0;i<42;i++) r.push({ x: rand()*100, y: rand()*100, s: rand()*2+1, t: rand() > 0.8 ? 'alert' : 'unit' });
    return r;
  }, []);

  return (
    <DarkFrame>
      <GridBG size={20} color="rgba(58,74,107,0.18)"/>

      {/* Mapa SVG simplificado de fondo */}
      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"
           style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.55 }}>
        {/* contornos "zonas" */}
        <path d="M 40 80 Q 180 40 300 90 T 560 120 Q 700 140 760 220 L 740 340 Q 640 400 480 380 T 220 400 Q 80 380 40 280 Z"
              fill="none" stroke={WF.stroke} strokeWidth="1" strokeDasharray="4 3"/>
        <path d="M 150 160 Q 260 150 340 180 Q 420 220 480 200 Q 540 180 580 230"
              fill="none" stroke={WF.stroke} strokeWidth="0.8"/>
        <path d="M 100 300 Q 220 280 310 320 Q 420 360 540 320 Q 640 290 700 320"
              fill="none" stroke={WF.stroke} strokeWidth="0.8"/>
        {/* cuadrícula de sector */}
        {[160,320,480,640].map(x => (
          <line key={'v'+x} x1={x} y1="20" x2={x} y2="480" stroke={WF.strokeLo} strokeWidth="0.5" strokeDasharray="2 4"/>
        ))}
        {[120,240,360].map(y => (
          <line key={'h'+y} x1="20" y1={y} x2="780" y2={y} stroke={WF.strokeLo} strokeWidth="0.5" strokeDasharray="2 4"/>
        ))}
        {/* puntos unidades */}
        {dots.map((d,i) => (
          <g key={i}>
            <circle cx={d.x*8} cy={d.y*5} r={d.s+2}
                    fill="none" stroke={d.t==='alert'?WF.red:WF.gold} strokeWidth="0.8" opacity="0.6"/>
            <circle cx={d.x*8} cy={d.y*5} r={d.s}
                    fill={d.t==='alert'?WF.red:WF.gold}/>
          </g>
        ))}
      </svg>

      {/* Esquinas con coordenadas */}
      <div style={{ position:'absolute', top:14, left:16, fontFamily: WF.fontMono, fontSize:9, color: WF.textDim, letterSpacing:'0.15em' }}>
        LAT 20.3862° N · LON 100.0007° W
      </div>
      <div style={{ position:'absolute', top:14, right:16, fontFamily: WF.fontMono, fontSize:9, color: WF.gold, letterSpacing:'0.15em', display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:WF.gold, boxShadow:`0 0 6px ${WF.gold}` }}/>
        C4 — EN LÍNEA · 14 UNIDADES
      </div>
      <div style={{ position:'absolute', bottom:14, left:16, fontFamily: WF.fontMono, fontSize:9, color: WF.textDim, letterSpacing:'0.15em' }}>
        SECTOR 04-QRO · CUADRANTE B
      </div>
      <div style={{ position:'absolute', bottom:14, right:16, fontFamily: WF.fontMono, fontSize:9, color: WF.red, letterSpacing:'0.15em' }}>
        ● 3 ALERTAS ACTIVAS
      </div>

      {/* Panel flotante */}
      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)',
        width: 380,
        background: 'rgba(11,18,32,0.92)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${WF.gold}`,
        boxShadow: `0 0 0 6px rgba(11,18,32,0.5), 0 0 40px rgba(192,34,58,0.15)`,
        padding: '32px 34px',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <ShieldMark size={48}/>
          <div style={{ fontFamily: WF.fontMono, fontSize:9, color: WF.gold, letterSpacing:'0.2em', textAlign:'right', lineHeight:1.6 }}>
            C4 · MANDO<br/>
            <span style={{ color: WF.textDim }}>CENTRO DE OPERACIONES</span>
          </div>
        </div>

        <div style={{ fontFamily: WF.fontUI, fontSize:24, color: WF.text, fontWeight:800, letterSpacing:'0.04em', textTransform:'uppercase', marginBottom:3 }}>
          Identifíquese
        </div>
        <div style={{ fontFamily: WF.fontMono, fontSize:10, color: WF.textDim, letterSpacing:'0.12em', marginBottom:22 }}>
          PARA ACCEDER AL TABLERO TÁCTICO
        </div>

        <InputField label="PLACA / CORREO" placeholder="operador@sspm.gob"/>
        <InputField label="CONTRASEÑA" placeholder="••••••••••••" icon="⚿"/>

        <PrimaryButton variant="red" style={{ marginTop: 8 }}>
          INGRESAR AL C4 →
        </PrimaryButton>

        <div style={{ marginTop:14, display:'flex', justifyContent:'space-between', fontFamily: WF.fontMono, fontSize:9, color: WF.textDim, letterSpacing:'0.12em' }}>
          <span>SOPORTE 24/7</span>
          <span style={{ color: WF.gold }}>ext. 911</span>
        </div>
      </div>

      <Scribble rotate={-5} color={WF.gold} size={16}
        style={{ position:'absolute', top: 60, left: 36 }}>
        mapa vivo detrás<br/>del login ✓
      </Scribble>
      <Scribble rotate={6} color={WF.red} size={15}
        style={{ position:'absolute', bottom: 50, right: 36 }}>
        contexto operativo<br/>antes de entrar
      </Scribble>
    </DarkFrame>
  );
}

window.WireframeC = WireframeC;
