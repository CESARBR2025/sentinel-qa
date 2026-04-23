// App — Reúne los 5 wireframes en un design canvas con tweaks.

const TWEAKS = /*EDITMODE-BEGIN*/{
  "accent": "red",
  "showNotes": true,
  "density": "normal"
}/*EDITMODE-END*/;

function App() {
  const [tweaksOn, setTweaksOn] = React.useState(false);
  const [tweaks, setTweaks] = React.useState(TWEAKS);

  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setTweaksOn(true);
      if (d.type === '__deactivate_edit_mode') setTweaksOn(false);
    };
    window.addEventListener('message', onMsg);
    // announce AFTER listener is live
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const update = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };

  // Aplicar override de acento inyectando CSS var
  React.useEffect(() => {
    const accentMap = { red: '#c0223a', gold: '#d4a43a', navy: '#14224a' };
    // parche simple: reasignar WF.red "visualmente" via data-accent
    document.documentElement.style.setProperty('--wf-accent', accentMap[tweaks.accent] || accentMap.red);
  }, [tweaks.accent]);

  const W = 820, H = 520;

  return (
    <>
      <DesignCanvas>
        <DCSection id="intro" title="Login · Seguridad Pública Municipal"
          subtitle="5 direcciones · oscuro + rojo institucional + dorado · wireframe low-fi → hi-fi">

          <DCArtboard id="wf-a" label="A · Split institucional" width={W} height={H}>
            <WireframeA/>
          </DCArtboard>

          <DCArtboard id="wf-b" label="B · Terminal táctico" width={W} height={H}>
            <WireframeB/>
          </DCArtboard>

          <DCArtboard id="wf-c" label="C · Centro de comando C4" width={W} height={H}>
            <WireframeC/>
          </DCArtboard>

          <DCArtboard id="wf-d" label="D · Credencial digital" width={W} height={H}>
            <WireframeD/>
          </DCArtboard>

          <DCArtboard id="wf-e" label="E · Bóveda multi-etapa" width={W} height={H}>
            <WireframeE/>
          </DCArtboard>
        </DCSection>

        <DCSection id="notas" title="Notas de dirección" subtitle="Paleta, sistema y próximos pasos">
          <DCArtboard id="paleta" label="Paleta · extraída del logo" width={520} height={360}>
            <PaletteCard/>
          </DCArtboard>

          <DCArtboard id="sistema" label="Sistema tipográfico" width={520} height={360}>
            <TypeCard/>
          </DCArtboard>

          <DCArtboard id="siguiente" label="Próximos pasos" width={520} height={360}>
            <NextStepsCard/>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      {tweaksOn && <TweaksPanel tweaks={tweaks} update={update}/>}
    </>
  );
}

function PaletteCard() {
  const swatches = [
    { name: 'Navy', hex: '#14224a', desc: 'Fondo institucional' },
    { name: 'Ink',  hex: '#0b1220', desc: 'Fondo base oscuro' },
    { name: 'Red',  hex: '#c0223a', desc: 'Acción / urgencia' },
    { name: 'Gold', hex: '#d4a43a', desc: 'Detalle / HUD' },
    { name: 'Stroke', hex: '#3a4a6b', desc: 'Líneas wireframe' },
    { name: 'Text', hex: '#c9d3e6', desc: 'Texto primario' },
  ];
  return (
    <div style={{ width:'100%', height:'100%', background: WF.ink, padding:'24px 26px', fontFamily: WF.fontUI, color: WF.text }}>
      <div style={{ fontFamily: WF.fontMono, fontSize:9, color: WF.gold, letterSpacing:'0.24em', marginBottom:4 }}>PALETA</div>
      <div style={{ fontSize: 20, fontWeight:800, letterSpacing:'0.02em', textTransform:'uppercase', marginBottom: 18 }}>Del logo al sistema</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
        {swatches.map(s => (
          <div key={s.name} style={{ display:'flex', alignItems:'center', gap:12, border:`1px solid ${WF.strokeLo}`, padding:'8px 10px' }}>
            <div style={{ width:36, height:36, background:s.hex, border:`1px solid ${WF.strokeLo}` }}/>
            <div>
              <div style={{ fontFamily: WF.fontMono, fontSize:10, letterSpacing:'0.12em', color: WF.text }}>{s.name.toUpperCase()} · {s.hex}</div>
              <div style={{ fontSize:11, color: WF.textDim }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeCard() {
  return (
    <div style={{ width:'100%', height:'100%', background: WF.ink, padding:'24px 26px', color: WF.text }}>
      <div style={{ fontFamily: WF.fontMono, fontSize:9, color: WF.gold, letterSpacing:'0.24em', marginBottom:4 }}>TIPOGRAFÍA</div>
      <div style={{ fontFamily: WF.fontUI, fontSize: 20, fontWeight:800, letterSpacing:'0.02em', textTransform:'uppercase', marginBottom: 20 }}>3 familias, 3 roles</div>

      <div style={{ borderTop:`1px solid ${WF.strokeLo}`, paddingTop:14, marginBottom:14 }}>
        <div style={{ fontFamily: WF.fontMono, fontSize:9, color: WF.textDim, letterSpacing:'0.18em' }}>DISPLAY · BARLOW CONDENSED 800</div>
        <div style={{ fontFamily: WF.fontUI, fontSize: 28, fontWeight:800, letterSpacing:'0.02em', textTransform:'uppercase' }}>ACCESO AL SISTEMA</div>
      </div>

      <div style={{ borderTop:`1px solid ${WF.strokeLo}`, paddingTop:14, marginBottom:14 }}>
        <div style={{ fontFamily: WF.fontMono, fontSize:9, color: WF.textDim, letterSpacing:'0.18em' }}>UI · INTER 400/600</div>
        <div style={{ fontFamily: 'Inter', fontSize:15 }}>Ingrese sus credenciales para continuar.</div>
      </div>

      <div style={{ borderTop:`1px solid ${WF.strokeLo}`, paddingTop:14 }}>
        <div style={{ fontFamily: WF.fontMono, fontSize:9, color: WF.textDim, letterSpacing:'0.18em' }}>DATOS · JETBRAINS MONO</div>
        <div style={{ fontFamily: WF.fontMono, fontSize:13, color: WF.gold }}>FOLIO 04821-SJR · IP 187.***.***.42</div>
      </div>
    </div>
  );
}

function NextStepsCard() {
  const steps = [
    'Elegir 1-2 direcciones favoritas',
    'Integrar el logo oficial (si tienes permiso de uso)',
    'Validar flujo 2FA / biometría con stakeholder',
    'Definir estados: error, bloqueo, cargando',
    'Pasar a alta fidelidad la variante ganadora',
  ];
  return (
    <div style={{ width:'100%', height:'100%', background: WF.ink, padding:'24px 26px', color: WF.text }}>
      <div style={{ fontFamily: WF.fontMono, fontSize:9, color: WF.red, letterSpacing:'0.24em', marginBottom:4 }}>→ SIGUIENTE</div>
      <div style={{ fontFamily: WF.fontUI, fontSize: 20, fontWeight:800, letterSpacing:'0.02em', textTransform:'uppercase', marginBottom: 18 }}>Para llegar a hi-fi</div>

      <ol style={{ paddingLeft: 22, margin:0 }}>
        {steps.map((s,i) => (
          <li key={i} style={{ marginBottom:12, fontFamily: 'Inter', fontSize: 13, color: WF.text, lineHeight:1.5 }}>
            {s}
          </li>
        ))}
      </ol>

      <div style={{ marginTop: 18, border:`1px dashed ${WF.gold}`, padding:'10px 12px', fontFamily: WF.fontMono, fontSize:10, color: WF.gold, letterSpacing:'0.08em', lineHeight:1.6 }}>
        NOTA: los wireframes usan un escudo placeholder — NO el logo oficial.
      </div>
    </div>
  );
}

function TweaksPanel({ tweaks, update }) {
  const opt = (group, value, label) => (
    <button onClick={() => update(group, value)} style={{
      padding:'6px 10px', border:`1px solid ${tweaks[group] === value ? WF.gold : WF.strokeLo}`,
      background: tweaks[group] === value ? 'rgba(212,164,58,0.12)' : 'transparent',
      color: tweaks[group] === value ? WF.gold : WF.text,
      fontFamily: WF.fontMono, fontSize:10, letterSpacing:'0.1em', cursor:'pointer',
      textTransform:'uppercase',
    }}>{label}</button>
  );
  return (
    <div style={{
      position:'fixed', bottom: 20, right: 20, zIndex: 1000,
      background: WF.ink, color: WF.text,
      border: `1px solid ${WF.gold}`,
      boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      padding:'16px 18px', width: 280,
      fontFamily: WF.fontUI,
    }}>
      <div style={{ fontFamily: WF.fontMono, fontSize:10, color: WF.gold, letterSpacing:'0.3em', marginBottom: 12 }}>
        ⚙ TWEAKS
      </div>

      <div style={{ fontFamily: WF.fontMono, fontSize:9, color: WF.textDim, letterSpacing:'0.15em', marginBottom:6 }}>ACENTO PRINCIPAL</div>
      <div style={{ display:'flex', gap:6, marginBottom: 14 }}>
        {opt('accent', 'red', 'Rojo')}
        {opt('accent', 'gold', 'Oro')}
        {opt('accent', 'navy', 'Azul')}
      </div>

      <div style={{ fontFamily: WF.fontMono, fontSize:9, color: WF.textDim, letterSpacing:'0.15em', marginBottom:6 }}>NOTAS MANUSCRITAS</div>
      <div style={{ display:'flex', gap:6, marginBottom: 14 }}>
        {opt('showNotes', true, 'Mostrar')}
        {opt('showNotes', false, 'Ocultar')}
      </div>

      <div style={{ fontFamily: WF.fontMono, fontSize:9, color: WF.textMute, letterSpacing:'0.08em', marginTop: 6, lineHeight:1.5 }}>
        Cambios de acento son globales; las notas se ocultan en todas las artboards.
      </div>
    </div>
  );
}

// Hook simple para ocultar notas según tweaks (via CSS global)
function applyGlobalTweaks() {
  const obs = new MutationObserver(() => {});
  const style = document.createElement('style');
  style.id = 'wf-tweaks-style';
  document.head.appendChild(style);
  window.__setNotesVisible = (v) => {
    style.textContent = v ? '' : `[data-dc-slot] [style*="cursive"] { display:none !important; }`;
  };
}
applyGlobalTweaks();

// Wrap App to react to tweaks for notes visibility
function AppWithEffects() {
  return <App/>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<AppWithEffects/>);
