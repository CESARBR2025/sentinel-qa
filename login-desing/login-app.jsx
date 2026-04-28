// Login hi-fi app — Secretaría de Seguridad Pública Municipal
// Combina layout split (A) + terminal de logs en vivo (B) + flujo 2FA.

const { useState, useEffect, useRef, useCallback } = React;

const TWEAKS = /*EDITMODE-BEGIN*/{
  "accent": "red",
  "terminal": true
} /*EDITMODE-END*/;

// ─── Iconos inline
const IconUser = () =>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>;

const IconLock = () =>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="5" y="11" width="14" height="10" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;

const IconShield = () =>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" /></svg>;

const IconArrow = () =>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

const IconCheck = () =>
<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7" /></svg>;


// ─── Terminal de logs en vivo
function Terminal({ phase, failed }) {
  const [lines, setLines] = useState([]);
  const bodyRef = useRef(null);
  const keyRef = useRef(0);

  const push = useCallback((type, text) => {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLines((ls) => {
      const next = [...ls, { k: keyRef.current++, ts, type, text }];
      return next.slice(-9);
    });
  }, []);

  // Boot logs
  useEffect(() => {
    const boot = [
    [80, 'info', 'iniciando cliente SSPM-SJR v4.2.1'],
    [320, 'dim', 'resolviendo host → sspm.sanjuandelrio.gob.mx'],
    [520, 'dim', 'handshake TLS 1.3 — cert SHA-256 verificado'],
    [120, 'ok', 'canal cifrado AES-256-GCM establecido'],
    [200, 'dim', 'verificando integridad del cliente (0x4F··A1C2)'],
    [340, 'warn', 'esperando credenciales de operador...']];

    let t = 0;
    const timers = boot.map(([d, type, text]) => {
      t += d;
      return setTimeout(() => push(type, text), t);
    });
    return () => timers.forEach(clearTimeout);
  }, [push]);

  // Reacciona a cambios de fase
  useEffect(() => {
    if (phase === 'submitting-1') {
      push('info', 'enviando credenciales al servidor de auth');
      setTimeout(() => push('dim', 'buscando folio de operador en directorio...'), 300);
    }
    if (phase === 'otp') {
      push('ok', 'credenciales válidas · folio localizado');
      setTimeout(() => push('warn', 'enviando código 2FA al dispositivo registrado'), 250);
      setTimeout(() => push('info', 'SMS → +52 ••• ••• 7248 · código TTL 60s'), 550);
    }
    if (phase === 'submitting-2') {
      push('info', 'validando token 2FA...');
    }
    if (phase === 'success') {
      push('ok', 'token aceptado · doble factor superado');
      setTimeout(() => push('ok', 'sesión autorizada · abriendo tablero C4'), 250);
    }
    if (failed === 'credentials') {
      push('err', 'credenciales rechazadas · intento 1 de 3');
    }
    if (failed === 'otp') {
      push('err', 'token 2FA inválido · reintente');
    }
    // eslint-disable-next-line
  }, [phase, failed]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  return (
    <div className="term">
      <div className="term-head">
        <span className="tdot r" /><span className="tdot y" /><span className="tdot g" />
        <span className="tpath">ssp-secure@terminal — /auth/session — 88×14</span>
        <span className="rec" style={{ color: "rgb(34, 105, 192)" }}></span>
      </div>
      <div className="term-body" ref={bodyRef}>
        {lines.map((l) =>
        <div key={l.k} className="log-line">
            <span className="t">[{l.ts}]</span>
            <span className={
          l.type === 'ok' ? 'c-ok' :
          l.type === 'warn' ? 'c-warn' :
          l.type === 'err' ? 'c-err' :
          l.type === 'info' ? 'c-info' : 'c-dim'
          }>
              {l.type === 'err' ? '✗ ' : l.type === 'ok' ? '✓ ' : l.type === 'warn' ? '⚠ ' : '› '}
              {l.text}
            </span>
          </div>
        )}
        <div className="log-line">
          <span className="t">[--:--:--]</span>
          <span className="c-dim">$ </span>
          <span className="cursor" />
        </div>
      </div>
    </div>);

}

// ─── OTP input (6 dígitos)
function OtpInput({ value, onChange, error }) {
  const refs = useRef([]);
  const setChar = (i, c) => {
    const chars = value.split('');
    chars[i] = c;
    const next = chars.join('').padEnd(6, '').slice(0, 6);
    onChange(next.trimEnd());
  };

  const handleChange = (i, e) => {
    const c = e.target.value.replace(/\D/g, '').slice(-1);
    if (!c) return;
    setChar(i, c);
    if (i < 5) refs.current[i + 1]?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value[i]) {setChar(i, '');} else
      if (i > 0) {
        refs.current[i - 1]?.focus();
        setTimeout(() => setChar(i - 1, ''), 0);
      }
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus();
  };
  const handlePaste = (e) => {
    const txt = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (txt) {
      e.preventDefault();
      onChange(txt);
      const focusIdx = Math.min(txt.length, 5);
      setTimeout(() => refs.current[focusIdx]?.focus(), 0);
    }
  };

  return (
    <div className="otp" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((i) =>
      <input key={i}
      ref={(el) => refs.current[i] = el}
      value={value[i] || ''}
      onChange={(e) => handleChange(i, e)}
      onKeyDown={(e) => handleKey(i, e)}
      inputMode="numeric"
      maxLength={1}
      className={(error ? 'error ' : '') + (value[i] ? 'filled' : '')} />

      )}
    </div>);

}

// ─── App principal
function App() {
  // Fases: 'idle' → 'submitting-1' → ('error' | 'otp') → 'submitting-2' → ('otp' err | 'success')
  const [phase, setPhase] = useState('idle');
  const [failed, setFailed] = useState(null);
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [otp, setOtp] = useState('');
  const [otpTime, setOtpTime] = useState(60);

  // Tweaks
  const [tweaksOn, setTweaksOn] = useState(false);
  const [tweaks, setTweaks] = useState(TWEAKS);
  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setTweaksOn(true);
      if (d.type === '__deactivate_edit_mode') setTweaksOn(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const updateTweak = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };
  useEffect(() => {
    const map = { red: '#c0223a', gold: '#d4a43a', navy: '#14224a' };
    document.documentElement.style.setProperty('--red', map[tweaks.accent] || map.red);
    document.documentElement.style.setProperty('--red-hi', tweaks.accent === 'gold' ? '#f0be4c' : tweaks.accent === 'navy' ? '#1e3066' : '#e03349');
  }, [tweaks.accent]);

  // Timer OTP
  useEffect(() => {
    if (phase !== 'otp') return;
    setOtpTime(60);
    const iv = setInterval(() => setOtpTime((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  // Auto-submit al tener 6 dígitos
  useEffect(() => {
    if (phase === 'otp' && otp.length === 6) {
      handleOtpSubmit();
    }
    // eslint-disable-next-line
  }, [otp, phase]);

  const handleLogin = (e) => {
    e?.preventDefault?.();
    if (!user || !pwd) return;
    setPhase('submitting-1');
    setFailed(null);
    setTimeout(() => {
      // demo: si el pwd es "fail" simula fallo; cualquier otro pasa
      if (pwd.toLowerCase() === 'fail') {
        setFailed('credentials');
        setPhase('idle');
      } else {
        setPhase('otp');
      }
    }, 1400);
  };

  const handleOtpSubmit = () => {
    setPhase('submitting-2');
    setFailed(null);
    setTimeout(() => {
      // demo: si el otp es "000000" falla
      if (otp === '000000') {
        setFailed('otp');
        setPhase('otp');
        setOtp('');
      } else {
        setPhase('success');
      }
    }, 1200);
  };

  const resetAll = () => {
    setPhase('idle');setFailed(null);setUser('');setPwd('');setOtp('');
  };

  const step = phase === 'idle' || phase === 'submitting-1' ? 1 : phase === 'success' ? 3 : 2;

  return (
    <div className="stage">
      <div className="corner tl" /><div className="corner tr" />
      <div className="corner bl" /><div className="corner br" />

      {/* ── IZQUIERDA ── */}
      <aside className="left">
        <div className="brand">
          <div className="brand-shield-wrap">
            <img className="brand-shield" src="assets/logo-shield.png" alt="Escudo SSPM" style={{height: 18, width: 18}} />
          </div>
          <div className="brand-divider" />
          <div className="brand-text">
            <img className="brand-wordmark" src="assets/logo-text-light.png" alt="Secretaría de Seguridad Pública" style={{height: 12}} />
            <div className="brand-subtitle">Seguridad Pública</div>
          </div>
        </div>

        <div className="headline">
          <div className="eyebrow">Acceso oficial · uso restringido</div>
          <h1>
            <span className="accent">SENTINEL</span>
          </h1>
          <div className="tagline">
            <span>S.S.P.M.</span>
            <span className="sep">·</span>
            <span>SAN JUAN DEL RÍO</span>
            <span className="sep">·</span>
            <span>QRO</span>
          </div>
        </div>

        <div className="sentinel-mark">
          <div className="sm-line" />
          <div className="sm-text">
            <span className="sm-small">S</span>istema de <span className="sm-small">E</span>nlace,
            <span className="sm-small"> N</span>eutralización,
            <span className="sm-small"> T</span>ácticas e
            <span className="sm-small"> I</span>nteligencia
            <span className="sm-small"> L</span>ocal
          </div>
          <div className="sm-line" />
        </div>

        <div className="protocol">
          <div className="protocol-head">
            <span>› Protocolo de acceso</span>
            <span className="tag">Nivel 3</span>
          </div>
          <div className="protocol-rows">
            <div className="r">
              <span className="ck">✓</span>
              <span className="lbl">Canal cifrado extremo a extremo</span>
              <span className="meta">Activo</span>
            </div>
            <div className="r">
              <span className="ck">✓</span>
              <span className="lbl">Verificación de identidad en dos pasos</span>
              <span className="meta">Requerido</span>
            </div>
            <div className="r">
              <span className="ck">✓</span>
              <span className="lbl">Registro de sesión y trazabilidad</span>
              <span className="meta">Habilitado</span>
            </div>
          </div>
          <div className="protocol-footer">
            <span>SESIÓN · {`${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${String(new Date().getDate()).padStart(2, '0')}`}</span>
            <span className="sig">SIGN: 0x4F··A1C2</span>
          </div>
        </div>
      </aside>

      {/* ── DERECHA ── */}
      <section className="right">
        <div className="topbar">
          <div className="left-group">
            <span className="dot" />
            <span>SSPM-SJR · ACCESO SEGURO</span>
          </div>
          <div className="right-group">
            <span>CIFRADO TLS 1.3</span>
            <span style={{ color: 'var(--text-dim)' }}>·</span>
            <span>SESIÓN {Math.floor(Math.random() * 9000 + 1000)}-QRO</span>
          </div>
        </div>

        <div className="main" style={{ position: 'relative' }}>
          {phase === 'success' &&
          <div className="success-overlay">
              <div className="success-ring"><IconCheck /></div>
              <h3>Acceso concedido</h3>
              <p>Redirigiendo al tablero</p>
              <button className="btn ghost" style={{ marginTop: 30, width: 220 }} onClick={resetAll}>
                ← Reiniciar demo
              </button>
            </div>
          }

          <div className="form-head">
            <span className="step-chip">
              <IconShield />
              {phase === 'otp' || phase === 'submitting-2' ? 'ETAPA 2 · VERIFICACIÓN 2FA' : 'ETAPA 1 · CREDENCIALES'}
            </span>
            <h2>{phase === 'otp' || phase === 'submitting-2' ? 'Verificación en dos pasos' : 'Inicio de sesión'}</h2>
            <div className="sub">
              {phase === 'otp' || phase === 'submitting-2' ?
              <>Ingresa el código de 6 dígitos enviado a tu dispositivo registrado.</> :
              <>Acceso restringido a personal autorizado de la SSPM.</>}
            </div>
          </div>

          <div className="stepper">
            <div className={'step ' + (step === 1 ? 'active' : 'done')}>
              <span className="num">01</span> CREDENCIALES
            </div>
            <div className={'step ' + (step === 2 ? 'active' : step === 3 ? 'done' : '')}>
              <span className="num">02</span> DOBLE FACTOR
            </div>
            <div className={'step ' + (step === 3 ? 'active' : '')}>
              <span className="num">03</span> TABLERO C4
            </div>
          </div>

          {(phase === 'idle' || phase === 'submitting-1') &&
          <form onSubmit={handleLogin}>
              <div className="field">
                <div className="field-label">
                  <span>Núm. de placa / usuario</span>
                  <span className="hint">formato: XXXXX-SJR</span>
                </div>
                <div className={'field-input' + (failed === 'credentials' ? ' error' : '')}>
                  <IconUser />
                  <input
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="04821-SJR"
                  autoComplete="username"
                  disabled={phase === 'submitting-1'} />
                
                </div>
              </div>

              <div className="field">
                <div className="field-label">
                  <span>Contraseña</span>
                  <span className="hint">mín. 12 caracteres</span>
                </div>
                <div className={'field-input' + (failed === 'credentials' ? ' error' : '')}>
                  <IconLock />
                  <input
                  type={showPwd ? 'text' : 'password'}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  disabled={phase === 'submitting-1'} />
                
                  <button type="button" className="toggle" onClick={() => setShowPwd((s) => !s)}>
                    {showPwd ? 'OCULTAR' : 'VER'}
                  </button>
                </div>
              </div>

              <div className="row">
                <label className={'check ' + (remember ? 'on' : '')} onClick={() => setRemember((r) => !r)}>
                  <span className="box" />
                  Mantener sesión · equipo oficial
                </label>
                <a href="#">Recuperar acceso →</a>
              </div>

              {failed === 'credentials' &&
            <div className="err-banner">
                  <span>⚠</span>
                  <span>Credenciales incorrectas · Intento 1 de 3 · Bloqueo tras 3 fallos</span>
                </div>
            }

              <button type="submit" className="btn" disabled={phase === 'submitting-1' || !user || !pwd} style={{ marginTop: 14 }}>
                {phase === 'submitting-1' ?
              <><span className="spinner" /> Validando…</> :

              <>⬢ Acceder al sistema <IconArrow /></>
              }
              </button>

              <div style={{
              marginTop: 16, textAlign: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              color: 'var(--text-mute)', letterSpacing: '0.18em', textTransform: 'uppercase'
            }}>
                Prueba con pwd <span style={{ color: 'var(--gold)' }}>"fail"</span> para ver error · OTP <span style={{ color: 'var(--gold)' }}>"000000"</span> falla
              </div>
            </form>
          }

          {(phase === 'otp' || phase === 'submitting-2') &&
          <div>
              <div className="field-label" style={{ justifyContent: 'space-between' }}>
                <span>Código de verificación · 6 dígitos</span>
                <span className="hint">SMS · +52 ••• ••• 7248</span>
              </div>
              <OtpInput value={otp} onChange={setOtp} error={failed === 'otp'} />
              <div className="otp-meta">
                <span>Código expira en <span className="timer">00:{String(otpTime).padStart(2, '0')}</span></span>
                <button className="resend" onClick={() => setOtpTime(60)}>Reenviar código →</button>
              </div>

              {failed === 'otp' &&
            <div className="err-banner" style={{ marginBottom: 14, marginTop: 0 }}>
                  <span>⚠</span>
                  <span>Token incorrecto · Verifica el dispositivo e intenta de nuevo</span>
                </div>
            }

              <button
              className="btn"
              onClick={handleOtpSubmit}
              disabled={phase === 'submitting-2' || otp.length !== 6}>
              
                {phase === 'submitting-2' ?
              <><span className="spinner" /> Verificando token…</> :

              <>Confirmar e ingresar <IconArrow /></>
              }
              </button>

              <button
              className="btn ghost"
              onClick={resetAll}
              style={{ marginTop: 10 }}>
              
                ← Volver a credenciales
              </button>
            </div>
          }
        </div>

        {tweaks.terminal && <Terminal phase={phase} failed={failed} />}
      </section>

      {tweaksOn &&
      <div className="tweaks">
          <h4>⚙ Tweaks</h4>
          <div className="lbl">Color de acción</div>
          <div className="opts">
            {['red', 'gold', 'navy'].map((v) =>
          <button key={v} className={tweaks.accent === v ? 'on' : ''} onClick={() => updateTweak('accent', v)}>{v}</button>
          )}
          </div>
          <div className="lbl">Terminal de logs</div>
          <div className="opts">
            <button className={tweaks.terminal ? 'on' : ''} onClick={() => updateTweak('terminal', true)}>Mostrar</button>
            <button className={!tweaks.terminal ? 'on' : ''} onClick={() => updateTweak('terminal', false)}>Ocultar</button>
          </div>
        </div>
      }
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);