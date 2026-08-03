'use client'
import './login.css'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

// ─── Iconos ───────────────────────────────────────────────────────────────────
function IconUser() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
}
function IconLock() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
}
function IconShield() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/></svg>
}
function IconArrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
}

// ─── Terminal de logs ─────────────────────────────────────────────────────────
type LogType = 'ok' | 'warn' | 'err' | 'info' | 'dim'
interface LogLine { k: number; ts: string; type: LogType; text: string }

function Terminal({ phase, failed }: { phase: string; failed: string | null }) {
  const [lines, setLines] = useState<LogLine[]>([])
  const bodyRef = useRef<HTMLDivElement>(null)
  const keyRef  = useRef(0)

  const push = useCallback((type: LogType, text: string) => {
    const now = new Date()
    const ts  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
    setLines(ls => [...ls, { k: keyRef.current++, ts, type, text }].slice(-9))
  }, [])

  useEffect(() => {
    const boot: [number, LogType, string][] = [
      [80,  'info', 'iniciando cliente SSPM-SJR v4.2.1'],
      [320, 'dim',  'resolviendo host → sspm.sanjuandelrio.gob.mx'],
      [520, 'dim',  'handshake TLS 1.3 — cert SHA-256 verificado'],
      [120, 'ok',   'canal cifrado AES-256-GCM establecido'],
      [200, 'dim',  'verificando integridad del cliente (0x4F··A1C2)'],
      [340, 'warn', 'esperando credenciales de operador...'],
    ]
    let t = 0
    const timers = boot.map(([d, type, text]) => { t += d; return setTimeout(() => push(type, text), t) })
    return () => timers.forEach(clearTimeout)
  }, [push])

  useEffect(() => {
    if (phase === 'submitting-1') {
      push('info', 'enviando credenciales al servidor de auth')
      setTimeout(() => push('dim', 'buscando operador en directorio...'), 300)
    }
    if (phase === 'otp') {
      push('ok',   'credenciales válidas · operador localizado')
      setTimeout(() => push('warn', 'pendiente: código 2FA del autenticador'), 250)
      setTimeout(() => push('info', 'TOTP · Google/Authy/Microsoft Authenticator · TTL 30s'), 550)
    }
    if (phase === 'submitting-2') push('info', 'validando token TOTP...')
    if (phase === 'success') {
      push('ok', 'token aceptado · doble factor superado')
      setTimeout(() => push('ok', 'sesión autorizada · abriendo tablero C4'), 250)
    }
    if (failed === 'credentials') push('err', 'credenciales rechazadas · verifique sus datos')
    if (failed === 'otp')         push('err', 'token TOTP inválido · reintente')
  }, [phase, failed]) // eslint-disable-line

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  return (
    <div className="terminal-panel">
      <div className="terminal-head">
        <span className="terminal-dot" style={{ background:'var(--red)' }} />
        <span className="terminal-dot" style={{ background:'var(--gold)' }} />
        <span className="terminal-dot" style={{ background:'var(--ok)' }} />
        <span style={{ marginLeft:6 }}>ssp-secure@terminal — /auth/session</span>
      </div>
      <div ref={bodyRef} className="terminal-body">
        {lines.map(l => (
          <div key={l.k} style={{ whiteSpace:'pre' }}>
            <span style={{ color:'var(--text-mute)', marginRight:10 }}>[{l.ts}]</span>
            <span style={{ color: l.type==='ok'?'var(--ok)':l.type==='warn'?'var(--gold)':l.type==='err'?'var(--red)':l.type==='info'?'#6da4d0':'var(--text-mute)' }}>
              {l.type==='err'?'✗ ':l.type==='ok'?'✓ ':l.type==='warn'?'⚠ ':'› '}{l.text}
            </span>
          </div>
        ))}
        <div style={{ whiteSpace:'pre' }}>
          <span style={{ color:'var(--text-mute)', marginRight:10 }}>[--:--:--]</span>
          <span style={{ color:'var(--text-mute)' }}>$ </span>
          <span style={{ display:'inline-block', width:7, height:13, background:'var(--gold)', verticalAlign:'middle', marginLeft:3, animation:'blink 1s step-end infinite' }}/>
        </div>
      </div>
    </div>
  )
}

// ─── OTP — 6 inputs individuales ─────────────────────────────────────────────
function OtpInput({ value, onChange, error, focusFirst }: { value: string; onChange: (v: string) => void; error?: boolean; focusFirst?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (focusFirst) {
      refs.current[0]?.focus()
    } else if (error) {
      refs.current[0]?.focus()
    }
  }, [focusFirst, error])

  const setChar = (i: number, c: string) => {
    const chars = value.padEnd(6, ' ').split('')
    chars[i] = c
    onChange(chars.join('').trimEnd())
  }

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const c = e.target.value.replace(/\D/g,'').slice(-1)
    if (!c) return
    setChar(i, c)
    if (i < 5) refs.current[i+1]?.focus()
  }

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (value[i]) { setChar(i,'') } else if (i > 0) {
        refs.current[i-1]?.focus()
        setTimeout(() => setChar(i-1,''), 0)
      }
    }
    if (e.key==='ArrowLeft'  && i>0) refs.current[i-1]?.focus()
    if (e.key==='ArrowRight' && i<5) refs.current[i+1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const txt = (e.clipboardData.getData('text')||'').replace(/\D/g,'').slice(0,6)
    if (txt) { e.preventDefault(); onChange(txt); setTimeout(()=>refs.current[Math.min(txt.length,5)]?.focus(),0) }
  }

  return (
    <div className="otp-input-wrapper" onPaste={handlePaste}>
      {[0,1,2,3,4,5].map(i => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          value={value[i]||''}
          onChange={e => handleChange(i,e)}
          onKeyDown={e => handleKey(i,e)}
          inputMode="numeric"
          maxLength={1}
          style={{
            width:'100%', aspectRatio:'1/1.15',
            background:'var(--ink-2)', border:`1px solid ${error?'var(--red)':value[i]?'var(--gold)':'var(--line-2)'}`,
            color: error?'var(--red)':value[i]?'var(--gold)':'var(--text)',
            textAlign:'center', fontFamily:'JetBrains Mono,monospace',
            fontWeight:700, outline:'none',
            boxShadow: value[i]&&!error?'0 0 0 3px rgba(212,164,58,0.12)':error?'0 0 0 3px rgba(192,34,58,0.15)':'none',
          }}
          className="otp-input-field"
        />
      ))}
    </div>
  )
}

// ─── Login principal ──────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const fromPath     = searchParams.get('from') ?? '/dashboard'

  const [phase,   setPhase]   = useState<'idle'|'submitting-1'|'otp'|'submitting-2'|'success'>('idle')
  const [failed,  setFailed]  = useState<'credentials'|'otp'|'server'|null>(null)
  const [focusOtpInput, setFocusOtpInput] = useState(false)

  useEffect(() => {
    if (phase !== 'success') return
    const t = setTimeout(() => {
      window.dispatchEvent(new Event('app:transition'))
      router.push(fromPath)
    }, 1200)
    return () => clearTimeout(t)
  }, [phase, fromPath, router])

  const [email,   setEmail]   = useState('')
  const [pwd,     setPwd]     = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [otp,     setOtp]     = useState('')
  const [sessionId] = useState(() => String(Math.floor(Math.random()*9000+1000))+'-QRO')

  // Tick de 1s para refrescar el contador TOTP (el valor se deriva de Date.now() en render)
  const [, setTick] = useState(0)
  useEffect(() => {
    if (phase !== 'otp') return
    const iv = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(iv)
  }, [phase])
  const otpTime = 30 - (Math.floor(Date.now()/1000) % 30)

  useEffect(() => {
    if (phase === 'otp' && otp.length === 6) handleOtpSubmit()
  }, [otp]) // eslint-disable-line

  const [generating2FA, setGenerating2FA] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !pwd) return

    setGenerating2FA(true)
    setPhase('submitting-1')
    setFailed(null)

    await new Promise(r => setTimeout(r, 1200))
    setGenerating2FA(false)

    try {
      const { data, error } = await authClient.signIn.email({ email, password: pwd })

      if (error) {
        setFailed('credentials')
        setPhase('idle')
        return
      }

      if ((data as { twoFactorRedirect?: boolean } | null)?.twoFactorRedirect) {
        setPhase('otp')
        return
      }

      setPhase('success')
    } catch {
      setFailed('server')
      setPhase('idle')
    }
  }

  async function handleOtpSubmit() {
    if (otp.length !== 6 || phase === 'submitting-2') return
    setPhase('submitting-2')
    setFailed(null)

    try {
      await authClient.twoFactor.verifyTotp(
        { code: otp },
        {
          onSuccess: () => {
            setPhase('success')
          },
          onError: () => {
            setFailed('otp')
            setPhase('otp')
            setOtp('')
            setFocusOtpInput(true)
          },
        }
      )
    } catch {
      setFailed('server')
      setPhase('otp')
      setOtp('')
      setFocusOtpInput(true)
    }
  }

  const step = phase === 'idle' || phase === 'submitting-1' ? 1 : phase === 'success' ? 3 : 2

  return (
    <div className="login-scope">
      <div className="login-stage">
        <div className="login-stage-bg" />

        <div className="login-corner tl" />
        <div className="login-corner tr" />
        <div className="login-corner bl" />
        <div className="login-corner br" />

        {/* ── PANEL IZQUIERDO (desktop) ── */}
        <aside className="login-panel-left">
          <div className="login-brand-row">
            <div className="login-brand-logo-wrap">
              <div className="login-brand-glow" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-shield.png" alt="Escudo SSPM" width={96} height={96} className="login-brand-logo" />
            </div>
            <div className="login-brand-divider" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-text-dark.png" alt="SSPM" className="login-brand-img" />
            <div className="login-brand-divider-soft" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/admin.png" alt="San Juan del Río" className="login-brand-img-tall" />
            <div className="login-brand-divider-soft" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sjr.png" alt="SJR Legado de Bien Común" className="login-brand-img-tall" />
          </div>

          <div className="login-hero-section">
            <div className="login-kicker">
              Acceso oficial · uso restringido
            </div>
            <div className="login-hero-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/chaleco.png" alt="CENTINELA" className="login-hero" />
            </div>
            <h1 className="login-h1">
              <span style={{ color:'var(--gold)' }}>CENTINELA</span>
            </h1>
            <div className="login-mono-line">
              <span>S.S.P.M.</span><span style={{ color:'var(--gold)' }}>·</span>
              <span>SAN JUAN DEL RÍO</span><span style={{ color:'var(--gold)' }}>·</span>
              <span>QRO</span>
            </div>
          </div>
        </aside>

        {/* ── PANEL DERECHO ── */}
        <section className="login-panel-right">

          {/* Cabecera compacta — tablet y móvil */}
          <header className="login-compact-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/chaleco.png" alt="CENTINELA" className="login-compact-logo" />
            <span className="login-compact-title">CENTINELA</span>
            <span className="login-compact-divider" />
            <span className="login-compact-sub">SSPM · SAN JUAN DEL RÍO · QRO</span>
            <span className="login-compact-session">
              <span style={{ color:'var(--text-dim)' }}>CIFRADO TLS 1.3</span>
              <span style={{ color:'var(--text-dim)' }}>·</span>
              <span>SESIÓN {sessionId}</span>
            </span>
          </header>

          {/* Topbar — desktop */}
          <div className="login-topbar">
            <div style={{ display:'flex',alignItems:'center',gap:10 }}>
              <span className="login-topbar-dot" />
              <span>SSPM-SJR · ACCESO SEGURO</span>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:10,color:'var(--gold)' }}>
              <span>CIFRADO TLS 1.3</span>
              <span style={{ color:'var(--text-dim)' }}>·</span>
              <span>SESIÓN {sessionId}</span>
            </div>
          </div>

          {/* Formulario */}
          <div className="login-main">
            {phase !== 'success' && (
            <div className="login-form">
              <div className="login-form-head">
                <span className="login-badge">
                  <IconShield />
                  {phase === 'otp' || phase === 'submitting-2' ? 'ETAPA 2 · VERIFICACIÓN 2FA' : 'ETAPA 1 · CREDENCIALES'}
                </span>
                <h2 className="login-form-title">
                  {phase === 'otp' || phase === 'submitting-2' ? 'Verificación en dos pasos' : 'Inicio de sesión'}
                </h2>
                <div className="login-form-sub">
                  {phase === 'otp' || phase === 'submitting-2'
                    ? 'Ingresa el código de 6 dígitos de tu app autenticadora.'
                    : 'Acceso restringido a personal autorizado de la SSPM.'}
                </div>
              </div>

              <div className="login-stepper">
                {[['01','CREDENCIALES',1],['02','DOBLE FACTOR',2],['03','TABLERO C4',3]].map(([num,label,s]) => {
                  const n = Number(s)
                  const active = step === n
                  const done   = step > n
                  return (
                    <div key={num} className={`login-step ${active?'is-active':''}${done?' is-done':''}`}>
                      <span className="login-step-num">{num}</span>{label}
                    </div>
                  )
                })}
              </div>

              {/* ── FASE 1: credenciales ── */}
              {(phase === 'idle' || phase === 'submitting-1') && (
                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom:22 }}>
                    <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:10.5,letterSpacing:'0.2em',color:'var(--text-dim)',textTransform:'uppercase',marginBottom:10,display:'flex',justifyContent:'space-between' }}>
                      <span>Correo institucional</span>
                      <span style={{ color:'var(--text-mute)',letterSpacing:'0.1em' }}>formato: usuario@gmail.com</span>
                    </div>
                    <div className={failed==='credentials'?'field-input-shake':''} style={{ display:'flex',alignItems:'center',gap:12,background:'var(--ink-2)',border:`1px solid ${failed==='credentials'?'var(--red)':'var(--line-2)'}`,padding:'16px 18px',boxShadow:failed==='credentials'?'0 0 0 3px rgba(192,34,58,.15)':'none',transition:'border-color .15s,box-shadow .15s' }}>
                      <IconUser />
                      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="usuario@sjr.gob.mx" autoComplete="email" type="email" required disabled={phase==='submitting-1'}
                        style={{ flex:1,background:'transparent',border:'none',outline:'none',color:'var(--text)',fontFamily:'JetBrains Mono,monospace',fontSize:15,letterSpacing:'0.06em',minWidth:0 }}
                        onFocus={e=>{ e.currentTarget.parentElement!.style.borderColor='var(--gold)'; e.currentTarget.parentElement!.style.boxShadow='0 0 0 3px rgba(212,164,58,.12)' }}
                        onBlur={e=>{ e.currentTarget.parentElement!.style.borderColor=failed==='credentials'?'var(--red)':'var(--line-2)'; e.currentTarget.parentElement!.style.boxShadow='' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom:6 }}>
                    <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:10.5,letterSpacing:'0.2em',color:'var(--text-dim)',textTransform:'uppercase',marginBottom:10,display:'flex',justifyContent:'space-between' }}>
                      <span>Contraseña</span>
                      <span style={{ color:'var(--text-mute)',letterSpacing:'0.1em' }}>mín. 8 caracteres</span>
                    </div>
                    <div className={failed==='credentials'?'field-input-shake':''} style={{ display:'flex',alignItems:'center',gap:12,background:'var(--ink-2)',border:`1px solid ${failed==='credentials'?'var(--red)':'var(--line-2)'}`,padding:'16px 18px',transition:'border-color .15s,box-shadow .15s' }}>
                      <IconLock />
                      <input type={showPwd?'text':'password'} value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="••••••••••••" autoComplete="current-password" required disabled={phase==='submitting-1'}
                        style={{ flex:1,background:'transparent',border:'none',outline:'none',color:'var(--text)',fontFamily:'JetBrains Mono,monospace',fontSize:15,letterSpacing:'0.06em',minWidth:0 }}
                        onFocus={e=>{ e.currentTarget.parentElement!.style.borderColor='var(--gold)'; e.currentTarget.parentElement!.style.boxShadow='0 0 0 3px rgba(212,164,58,.12)' }}
                        onBlur={e=>{ e.currentTarget.parentElement!.style.borderColor=failed==='credentials'?'var(--red)':'var(--line-2)'; e.currentTarget.parentElement!.style.boxShadow='' }}
                      />
                      <button type="button" onClick={()=>setShowPwd(s=>!s)} style={{ background:'none',border:'none',color:'var(--text-dim)',cursor:'pointer',fontFamily:'JetBrains Mono,monospace',fontSize:10.5,letterSpacing:'0.15em',padding:'4px 6px',flexShrink:0 }}>
                        {showPwd?'OCULTAR':'VER'}
                      </button>
                    </div>
                  </div>

                  {failed === 'credentials' && (
                    <div style={{ marginTop:16,padding:'12px 16px',borderLeft:'3px solid var(--red)',background:'rgba(192,34,58,.08)',color:'var(--red)',fontFamily:'JetBrains Mono,monospace',fontSize:11.5,letterSpacing:'0.1em',display:'flex',alignItems:'center',gap:10 }}>
                      <span>⚠</span><span>Credenciales incorrectas · Verifique sus datos de acceso</span>
                    </div>
                  )}

                  {failed === 'server' && (
                    <div style={{ marginTop:16,padding:'12px 16px',borderLeft:'3px solid var(--red)',background:'rgba(192,34,58,.08)',color:'var(--red)',fontFamily:'JetBrains Mono,monospace',fontSize:11.5,letterSpacing:'0.1em',display:'flex',alignItems:'center',gap:10 }}>
                      <span>⚠</span><span>No se pudo conectar con el servidor · Intenta de nuevo en unos momentos</span>
                    </div>
                  )}

                  <button type="submit" disabled={phase==='submitting-1'||!email||!pwd}
                    style={{ marginTop:28,display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'18px 18px',background:'var(--red)',color:'#fff',border:'1px solid var(--red)',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:15.5,letterSpacing:'0.2em',textTransform:'uppercase',cursor:phase==='submitting-1'?'not-allowed':'pointer',opacity:(!email||!pwd)?0.5:1,transition:'background .15s' }}
                    onMouseEnter={e=>{if(phase!=='submitting-1')e.currentTarget.style.background='var(--red-hi)'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='var(--red)'}}>
                    {phase==='submitting-1'
                      ? generating2FA
                        ? <span style={{ display:'flex',alignItems:'center',gap:8,fontSize:14 }}><span style={{ width:13,height:13,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }} /> Generando código 2FA...</span>
                        : <span style={{ display:'flex',alignItems:'center',gap:8,fontSize:14 }}><span style={{ width:13,height:13,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }} /> Validando…</span>
                      : <span>⬢ Acceder al sistema</span>}
                  </button>
                </form>
              )}

              {/* ── FASE 2: TOTP ── */}
              {(phase === 'otp' || phase === 'submitting-2') && (
                <div>
                  <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:10.5,letterSpacing:'0.2em',color:'var(--text-dim)',textTransform:'uppercase',marginBottom:10,display:'flex',justifyContent:'space-between' }}>
                    <span>Código de verificación · 6 dígitos</span>
                    <span style={{ color:'var(--text-mute)',letterSpacing:'0.1em' }}>App autenticadora</span>
                  </div>
                  <OtpInput value={otp} onChange={setOtp} error={failed==='otp'} focusFirst={focusOtpInput} />
                  <div style={{ display:'flex',justifyContent:'space-between',fontFamily:'JetBrains Mono,monospace',fontSize:10.5,letterSpacing:'0.16em',color:'var(--text-dim)',textTransform:'uppercase',marginBottom:28 }}>
                    <span>Código se renueva en <span style={{ color:'var(--gold)' }}>00:{String(otpTime).padStart(2,'0')}</span></span>
                    <span style={{ color:'var(--text-mute)' }}>Google · Authy</span>
                  </div>

                  {failed === 'otp' && (
                    <div style={{ marginBottom:18,padding:'12px 16px',borderLeft:'3px solid var(--red)',background:'rgba(192,34,58,.08)',color:'var(--red)',fontFamily:'JetBrains Mono,monospace',fontSize:11.5,letterSpacing:'0.1em',display:'flex',alignItems:'center',gap:10 }}>
                      <span>⚠</span><span>Token incorrecto · Verifica tu app autenticadora e intenta de nuevo</span>
                    </div>
                  )}

                  {failed === 'server' && (
                    <div style={{ marginBottom:18,padding:'12px 16px',borderLeft:'3px solid var(--red)',background:'rgba(192,34,58,.08)',color:'var(--red)',fontFamily:'JetBrains Mono,monospace',fontSize:11.5,letterSpacing:'0.1em',display:'flex',alignItems:'center',gap:10 }}>
                      <span>⚠</span><span>No se pudo conectar con el servidor · Intenta de nuevo en unos momentos</span>
                    </div>
                  )}

                  <button onClick={handleOtpSubmit} disabled={phase==='submitting-2'||otp.length!==6}
                    style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:12,width:'100%',padding:'19px 18px',background:'var(--red)',color:'#fff',border:'1px solid var(--red)',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:16,letterSpacing:'0.22em',textTransform:'uppercase',cursor:otp.length!==6||phase==='submitting-2'?'not-allowed':'pointer',opacity:otp.length!==6?0.5:1 }}>
                    {phase==='submitting-2'
                      ? <><span style={{ width:14,height:14,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }}/> Verificando token…</>
                      : <>Confirmar e ingresar <IconArrow /></>}
                  </button>

                  <button onClick={()=>{setPhase('idle');setFailed(null);setOtp('')}}
                    style={{ marginTop:12,display:'flex',alignItems:'center',justifyContent:'center',gap:12,width:'100%',padding:'19px 18px',background:'transparent',color:'var(--text)',border:'1px solid var(--line-2)',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:16,letterSpacing:'0.22em',textTransform:'uppercase',cursor:'pointer' }}>
                    ← Volver a credenciales
                  </button>
                </div>
              )}
            </div>
            )}
          </div>

          {/* {phase !== 'success' && <Terminal phase={phase} failed={failed} />} */}

          {/* Overlay de éxito a nivel de toda la sección */}
          {phase === 'success' && (
            <div className="cyber-success-wrap">
              <div className="cyber-success-grid" />
              <div className="cyber-success-line" />

              <div className="cyber-success-icon">
                <div style={{ position:'absolute',top:-2,left:-2,width:16,height:16,borderTop:'2px solid var(--ok)',borderLeft:'2px solid var(--ok)'}}/>
                <div style={{ position:'absolute',bottom:-2,right:-2,width:16,height:16,borderBottom:'2px solid var(--ok)',borderRight:'2px solid var(--ok)'}}/>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>

              <div className="cyber-success-text" style={{ textAlign:'center',position:'relative',zIndex:2 }}>
                <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:12,color:'var(--ok)',letterSpacing:'0.4em',textTransform:'uppercase',marginBottom:12 }}>[ STATUS: AUTHENTICATED ]</div>
                <h3 className="cyber-success-title">Acceso concedido</h3>
                <p style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,letterSpacing:'0.18em',color:'var(--gold)',textTransform:'uppercase',margin:0 }}>Iniciando enlace seguro con el núcleo C4...</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
