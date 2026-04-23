// Wireframe D — Credencial / carnet de identidad
// El login es una "tarjeta de identificación" tipo placa/gafete.

function WireframeD() {
  return (
    <DarkFrame>
      <GridBG size={28} color="rgba(255,255,255,0.02)"/>

      {/* Bandas diagonales rojas tenues en el fondo */}
      <div style={{
        position:'absolute', inset:0, opacity:0.08,
        background: `repeating-linear-gradient(135deg, transparent 0 40px, ${WF.red} 40px 41px)`,
      }}/>

      <StatusBar label="CREDENCIAL DIGITAL · FOLIO 0000-SJR" right="EMISIÓN 2026" />

      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'calc(100% - 38px)', padding:'30px' }}>
        <div style={{
          width: 640, height: 380, position:'relative',
          background: `linear-gradient(160deg, ${WF.navy} 0%, ${WF.inkSoft} 60%, ${WF.ink} 100%)`,
          border: `2px solid ${WF.gold}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(212,164,58,0.2)`,
          padding: '28px 32px',
          display:'grid', gridTemplateColumns:'180px 1fr', gap: 28,
        }}>
          {/* Banda superior */}
          <div style={{
            position:'absolute', top:0, left:0, right:0, height:34,
            background: WF.red,
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'0 18px',
            fontFamily: WF.fontUI, fontSize:11, fontWeight:800, color:'#fff', letterSpacing:'0.3em', textTransform:'uppercase',
          }}>
            <span>⬢ Secretaría de Seguridad Municipal</span>
            <span style={{ fontFamily: WF.fontMono, fontSize:9, letterSpacing:'0.2em', color:'rgba(255,255,255,0.8)' }}>CLASIFICACIÓN: A-1</span>
          </div>

          {/* Foto placeholder */}
          <div style={{
            marginTop: 44,
            border: `1px solid ${WF.gold}`,
            height: 200,
            background: `repeating-linear-gradient(45deg, ${WF.inkSoft} 0 6px, ${WF.ink} 6px 12px)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            flexDirection:'column', gap:8,
            fontFamily: WF.fontMono, fontSize:9, color: WF.textDim, letterSpacing:'0.2em',
          }}>
            <ShieldMark size={52} stroke={WF.gold} accent={WF.red}/>
            <div>[ FOTO · 3×4 ]</div>
          </div>

          {/* Lado de datos / login */}
          <div style={{ marginTop: 44 }}>
            <div style={{ fontFamily: WF.fontMono, fontSize:9, color: WF.gold, letterSpacing:'0.24em', marginBottom:4 }}>
              PORTADOR
            </div>
            <div style={{ fontFamily: WF.fontUI, fontSize: 26, fontWeight:800, color: WF.text, letterSpacing:'0.03em', textTransform:'uppercase', lineHeight:1, marginBottom:3 }}>
              Acceso restringido
            </div>
            <div style={{ fontFamily: WF.fontMono, fontSize:10, color: WF.textDim, letterSpacing:'0.1em', marginBottom:18 }}>
              INICIA SESIÓN PARA REVELAR DATOS
            </div>

            <InputField label="NO. DE PLACA" placeholder="04821-SJR" style={{ marginBottom:10 }}/>
            <InputField label="CLAVE" placeholder="••••••••••••" style={{ marginBottom:14 }}/>

            <PrimaryButton variant="red">
              VALIDAR CREDENCIAL
            </PrimaryButton>
          </div>

          {/* Banda inferior con datos */}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0, height:30,
            borderTop: `1px dashed ${WF.gold}`,
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'0 18px',
            fontFamily: WF.fontMono, fontSize:9, color: WF.textDim, letterSpacing:'0.15em',
          }}>
            <span>FOLIO ████-████-████</span>
            <span>VENCE 12·2028</span>
            <span style={{ color: WF.gold }}>● VÁLIDA</span>
          </div>

          {/* Marcas de esquina */}
          <div style={{ position:'absolute', top:44, right:14, width:50, height:50, border:`1px solid ${WF.gold}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily: WF.fontMono, fontSize:8, color:WF.gold, letterSpacing:'0.2em' }}>
            QR
          </div>
        </div>
      </div>

      <Scribble rotate={-4} color={WF.gold} size={17}
        style={{ position:'absolute', top: 60, right: 40 }}>
        es una credencial<br/>= familiar + oficial
      </Scribble>
      <Scribble rotate={5} color={WF.red} size={14}
        style={{ position:'absolute', bottom: 30, left: 40 }}>
        el login ES la placa 👮
      </Scribble>
    </DarkFrame>
  );
}

window.WireframeD = WireframeD;
