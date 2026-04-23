// Wireframe E — Bóveda / Acceso restringido
// Pantalla centrada con "puerta de bóveda" + autenticación multi-paso

function WireframeE() {
  return (
    <DarkFrame>
      <GridBG size={40} color="rgba(192,34,58,0.05)"/>

      {/* Franja roja superior con advertencia */}
      <div style={{
        background: WF.red,
        color:'#fff',
        padding:'8px 20px',
        fontFamily: WF.fontMono, fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase',
        display:'flex', justifyContent:'space-between', alignItems:'center',
      }}>
        <span>⚠ ZONA RESTRINGIDA · SOLO PERSONAL AUTORIZADO ⚠</span>
        <span>SSPM-SJR</span>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'calc(100% - 32px)', padding:'20px 40px', gap: 50 }}>
        {/* Bóveda concéntrica (SVG) */}
        <div style={{ position:'relative', flex:'0 0 auto' }}>
          <svg width="320" height="320" viewBox="0 0 320 320">
            {/* anillos */}
            <circle cx="160" cy="160" r="150" fill="none" stroke={WF.stroke} strokeWidth="1"/>
            <circle cx="160" cy="160" r="130" fill="none" stroke={WF.strokeLo} strokeWidth="1" strokeDasharray="3 4"/>
            <circle cx="160" cy="160" r="110" fill="none" stroke={WF.stroke} strokeWidth="1.5"/>
            <circle cx="160" cy="160" r="78" fill={WF.inkSoft} stroke={WF.gold} strokeWidth="1.5"/>
            {/* 8 pernos de bóveda */}
            {[0,45,90,135,180,225,270,315].map(deg => {
              const r = 120;
              const x = 160 + r*Math.cos(deg * Math.PI/180);
              const y = 160 + r*Math.sin(deg * Math.PI/180);
              return <circle key={deg} cx={x} cy={y} r="5" fill={WF.gold} opacity="0.7"/>;
            })}
            {/* marcas de dial */}
            {Array.from({length: 60}).map((_, i) => {
              const deg = i * 6;
              const x1 = 160 + 146*Math.cos(deg * Math.PI/180);
              const y1 = 160 + 146*Math.sin(deg * Math.PI/180);
              const x2 = 160 + 142*Math.cos(deg * Math.PI/180);
              const y2 = 160 + 142*Math.sin(deg * Math.PI/180);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                           stroke={i % 5 === 0 ? WF.gold : WF.stroke}
                           strokeWidth={i % 5 === 0 ? 1.5 : 0.7}/>;
            })}
            {/* aguja */}
            <line x1="160" y1="160" x2="160" y2="30" stroke={WF.red} strokeWidth="2" strokeLinecap="round"/>
            <circle cx="160" cy="160" r="6" fill={WF.red}/>
            {/* número central */}
            <text x="160" y="155" textAnchor="middle" fontFamily={WF.fontMono}
                  fontSize="36" fontWeight="700" fill={WF.gold} letterSpacing="0.1em">
              00:00
            </text>
            <text x="160" y="180" textAnchor="middle" fontFamily={WF.fontMono}
                  fontSize="9" fill={WF.textDim} letterSpacing="0.3em">
              SELLADO
            </text>
          </svg>

          <Scribble rotate={-8} color={WF.gold} size={15}
            style={{ position:'absolute', bottom: -30, left: 20 }}>
            metáfora: bóveda<br/>gira al hacer login
          </Scribble>
        </div>

        {/* Panel de auth multi-paso */}
        <div style={{ flex:'0 1 360px', position:'relative' }}>
          <div style={{ fontFamily: WF.fontMono, fontSize:10, color: WF.red, letterSpacing:'0.3em', marginBottom: 8 }}>
            [ NIVEL DE SEGURIDAD 3 ]
          </div>
          <div style={{ fontFamily: WF.fontUI, fontSize: 34, fontWeight: 800, color: WF.text, letterSpacing:'0.01em', lineHeight:0.95, textTransform:'uppercase', marginBottom: 6 }}>
            Acceso a<br/>la bóveda
          </div>
          <div style={{ fontFamily: WF.fontMono, fontSize:10, color: WF.textDim, letterSpacing:'0.12em', marginBottom: 24 }}>
            VERIFICACIÓN EN 3 ETAPAS
          </div>

          {/* Pasos */}
          <div style={{ display:'flex', gap:6, marginBottom: 18 }}>
            {['01','02','03'].map((n,i) => (
              <div key={n} style={{ flex:1, textAlign:'center' }}>
                <div style={{
                  height: 4,
                  background: i === 0 ? WF.gold : WF.strokeLo,
                }}/>
                <div style={{ fontFamily: WF.fontMono, fontSize:9, color: i === 0 ? WF.gold : WF.textMute, marginTop:6, letterSpacing:'0.2em' }}>
                  {n} {i === 0 ? 'USUARIO' : i === 1 ? 'CLAVE' : 'BIOMÉTRICO'}
                </div>
              </div>
            ))}
          </div>

          <InputField label="IDENTIFICADOR" placeholder="operador.04821" accent/>

          {/* Slots PIN */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontFamily: WF.fontMono, fontSize:9, letterSpacing:'0.18em', color: WF.textDim, marginBottom:6, textTransform:'uppercase' }}>
              CÓDIGO DE SEGURIDAD · 6 DÍGITOS
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {[0,1,2,3,4,5].map(i => (
                <div key={i} style={{
                  flex:1, height: 44,
                  border:`1px solid ${i < 2 ? WF.gold : WF.stroke}`,
                  background: WF.inkSoft,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily: WF.fontMono, fontSize:20, color: WF.text, fontWeight:700,
                }}>
                  {i < 2 ? '•' : ''}
                </div>
              ))}
            </div>
          </div>

          <PrimaryButton variant="red">
            ▸ INICIAR APERTURA
          </PrimaryButton>

          <div style={{ marginTop:14, fontFamily: WF.fontMono, fontSize:9, color: WF.textMute, letterSpacing:'0.12em', display:'flex', justifyContent:'space-between' }}>
            <span>INTENTOS: 0/3</span>
            <span style={{ color: WF.gold }}>⏱ BLOQUEO TRAS 3 FALLOS</span>
          </div>
        </div>
      </div>

      <Scribble rotate={3} color={WF.red} size={16}
        style={{ position:'absolute', top: 48, right: 36 }}>
        intimidante ✓<br/>pero funcional
      </Scribble>
    </DarkFrame>
  );
}

window.WireframeE = WireframeE;
