// Wireframe B — Terminal / HUD táctico
// Estética CLI retro-futura. Todo monospace, prompt visible, logs en vivo.

function WireframeB() {
  const lines = [
    { t: '> conectando a host sspm.sjr.gob', c: WF.textDim },
    { t: '> handshake TLS 1.3 ········ OK', c: WF.textDim },
    { t: '> canal seguro establecido', c: WF.gold },
    { t: '> esperando credenciales...', c: WF.red },
  ];

  return (
    <DarkFrame>
      <GridBG size={32} color="rgba(212,164,58,0.04)"/>

      {/* Barra tipo terminal */}
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        padding:'10px 14px', borderBottom:`1px solid ${WF.strokeLo}`,
        fontFamily: WF.fontMono, fontSize:10, color: WF.textDim, letterSpacing:'0.1em',
      }}>
        <span style={{ width:10, height:10, background:WF.red, display:'inline-block' }}/>
        <span style={{ width:10, height:10, background:WF.gold, display:'inline-block' }}/>
        <span style={{ width:10, height:10, background:'#4a8a5c', display:'inline-block' }}/>
        <span style={{ marginLeft:12 }}>ssp-secure@terminal — /auth/login — 80×24</span>
        <span style={{ marginLeft:'auto', color:WF.gold }}>● REC</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', height:'calc(100% - 34px)' }}>
        {/* Logs + ASCII */}
        <div style={{ padding:'28px 32px', borderRight:`1px solid ${WF.strokeLo}`, position:'relative' }}>
          {/* ASCII shield */}
          <pre style={{
            fontFamily: WF.fontMono, fontSize:10, color: WF.gold,
            lineHeight:1.1, margin:0, marginBottom:22,
          }}>{String.raw`
    ▄▄▄▄▄▄▄▄▄▄▄▄▄
   █             █
  █   ╔═════╗    █
 █    ║ SSP ║     █
  █   ╚═════╝    █
   █    ███     █
    █▄▄▄▄▄▄▄▄▄▄█
       `}</pre>

          <div style={{ fontFamily: WF.fontMono, fontSize:11, color: WF.text, letterSpacing:'0.04em', lineHeight:1.9 }}>
            <div style={{ color: WF.gold, marginBottom:14, letterSpacing:'0.22em' }}>
              ━━ SISTEMA DE ACCESO TÁCTICO ━━
            </div>
            {lines.map((l,i) => (
              <div key={i} style={{ color: l.c }}>{l.t}</div>
            ))}
            <div style={{ color: WF.text, marginTop:6 }}>
              <span style={{ color: WF.red }}>$</span> auth --user _
              <span style={{ background: WF.gold, color: WF.ink, display:'inline-block', width:8, height:14, verticalAlign:'middle', marginLeft:2 }}/>
            </div>
          </div>

          <Scribble rotate={-3} color={WF.gold} size={15}
            style={{ position:'absolute', bottom: 28, left: 32 }}>
            logs en vivo →<br/>sensación de comando
          </Scribble>
        </div>

        {/* Panel de credenciales */}
        <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ fontFamily: WF.fontMono, fontSize:10, color: WF.red, letterSpacing:'0.25em', marginBottom:4 }}>
            [ AUTH::REQUIRED ]
          </div>
          <div style={{ fontFamily: WF.fontMono, fontSize:22, color: WF.text, letterSpacing:'0.04em', fontWeight:700, marginBottom:18 }}>
            &gt; LOGIN_
          </div>

          <InputField label="USR" placeholder="operador.placa" accent />
          <InputField label="PWD" placeholder="━━━━━━━━━━━━" accent />
          <InputField label="2FA // TOKEN" placeholder="XXX-XXX" />

          <div style={{
            display:'flex', gap:10, marginTop:6,
            fontFamily: WF.fontMono, fontSize:10, color: WF.textDim, letterSpacing:'0.1em',
          }}>
            <span style={{ color: WF.gold }}>[F1]</span> AYUDA
            <span style={{ color: WF.gold }}>[F5]</span> RECARGAR
            <span style={{ color: WF.gold }}>[ESC]</span> SALIR
          </div>

          <div style={{ marginTop: 14 }}>
            <PrimaryButton variant="gold">
              ▶ EJECUTAR LOGIN
            </PrimaryButton>
          </div>

          <div style={{ marginTop:10, border:`1px dashed ${WF.strokeLo}`, padding:'8px 10px', fontFamily: WF.fontMono, fontSize:9, color: WF.textMute, lineHeight:1.7, letterSpacing:'0.08em' }}>
            IP: 187.***.***.42<br/>
            GEO: SAN JUAN DEL RÍO, QRO<br/>
            HASH: 0x7FA2E3···4C91
          </div>
        </div>
      </div>
    </DarkFrame>
  );
}

window.WireframeB = WireframeB;
