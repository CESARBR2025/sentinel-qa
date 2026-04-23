// Wireframe A — Split clásico institucional
// Columna izquierda: escudo + información institucional
// Columna derecha: formulario de login
// Vibes: burocrático pero moderno, tipo portal SSP federal

function WireframeA() {
  return (
    <DarkFrame>
      <GridBG />
      <StatusBar label="SSP-SJR // PORTAL OFICIAL" right="NIVEL DE ACCESO: RESTRINGIDO" />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', height:'calc(100% - 38px)' }}>
        {/* IZQUIERDA — Branding */}
        <div style={{
          padding: '48px 44px', position:'relative',
          borderRight: `1px solid ${WF.strokeLo}`,
          background: `linear-gradient(180deg, ${WF.inkSoft} 0%, ${WF.ink} 100%)`,
        }}>
          <div style={{ display:'flex', gap:18, alignItems:'flex-start', marginBottom: 28 }}>
            <ShieldMark size={76}/>
            <div>
              <div style={{ fontFamily: WF.fontMono, fontSize:9, letterSpacing:'0.3em', color: WF.gold, marginBottom:6 }}>
                [ PLACEHOLDER ESCUDO ]
              </div>
              <div style={{ fontFamily: WF.fontUI, fontSize: 22, fontWeight: 800, color: WF.text, lineHeight:1.05, letterSpacing:'0.02em', textTransform:'uppercase' }}>
                Secretaría<br/>de Seguridad<br/>Municipal
              </div>
            </div>
          </div>

          <div style={{ height:1, background: WF.strokeLo, margin:'24px 0' }}/>

          <div style={{ fontFamily: WF.fontMono, fontSize:10, color: WF.textDim, lineHeight:1.8, letterSpacing:'0.06em' }}>
            SISTEMA INTEGRAL DE MANDO<br/>
            Y OPERACIONES C4<br/>
            <span style={{ color: WF.textMute }}>v4.2.1 — build 2026.04</span>
          </div>

          <div style={{
            position:'absolute', bottom: 40, left: 44, right: 44,
            border: `1px dashed ${WF.strokeLo}`, padding:'14px 14px',
            fontFamily: WF.fontMono, fontSize:10, color: WF.textDim, lineHeight:1.6,
          }}>
            <div style={{ color: WF.gold, marginBottom:4, letterSpacing:'0.15em' }}>⚠ AVISO LEGAL</div>
            Acceso restringido a personal autorizado. Todas las sesiones son monitoreadas y registradas.
          </div>

          <Scribble rotate={-4} color={WF.gold} size={18}
            style={{ position:'absolute', top: 30, right: 24 }}>
            burocrático<br/>clásico ✓
          </Scribble>
        </div>

        {/* DERECHA — Formulario */}
        <div style={{ padding: '56px 56px', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative' }}>
          <div style={{ fontFamily: WF.fontMono, fontSize:10, letterSpacing:'0.3em', color: WF.red, marginBottom: 8 }}>
            › AUTENTICACIÓN
          </div>
          <div style={{ fontFamily: WF.fontUI, fontSize: 34, fontWeight: 800, color: WF.text, letterSpacing:'0.01em', marginBottom: 36, textTransform:'uppercase' }}>
            Inicio de sesión
          </div>

          <InputField label="NÚMERO DE PLACA / USUARIO" placeholder="ej. 04821-SJR" />
          <InputField label="CONTRASEÑA" placeholder="••••••••••••" icon="🔒" />

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 4, marginBottom: 22 }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, fontFamily: WF.fontMono, fontSize:10, color: WF.textDim, letterSpacing:'0.08em' }}>
              <span style={{ width:12, height:12, border:`1px solid ${WF.stroke}`, display:'inline-block' }}/>
              MANTENER SESIÓN
            </label>
            <a style={{ fontFamily: WF.fontMono, fontSize:10, color: WF.gold, letterSpacing:'0.08em', textDecoration:'none' }}>
              RECUPERAR ACCESO →
            </a>
          </div>

          <PrimaryButton variant="red">
            ⬢ ACCEDER AL SISTEMA
          </PrimaryButton>

          <div style={{ marginTop: 20, textAlign:'center', fontFamily: WF.fontMono, fontSize:9, color: WF.textMute, letterSpacing:'0.12em' }}>
            — O —
          </div>
          <div style={{ marginTop: 12, border:`1px solid ${WF.stroke}`, padding:'10px', textAlign:'center', fontFamily: WF.fontMono, fontSize:11, color: WF.text, letterSpacing:'0.1em' }}>
            AUTENTICAR CON CREDENCIAL BIOMÉTRICA
          </div>

          <Scribble rotate={3} color={WF.red} size={16}
            style={{ position:'absolute', bottom: 30, right: 40 }}>
            botón rojo =<br/>urgencia ✕
          </Scribble>
        </div>
      </div>
    </DarkFrame>
  );
}

window.WireframeA = WireframeA;
