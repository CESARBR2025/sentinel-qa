'use client'
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
function IconCheck() {
  return <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7"/></svg>
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
    <div className="terminal-panel" style={{ borderTop:'1px solid var(--line)', background:'#f1f5f9', display:'grid', gridTemplateRows:'auto 1fr', height:240 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', borderBottom:'1px solid var(--line)', background:'var(--ink-2)', fontFamily:'JetBrains Mono,monospace', fontSize:10, letterSpacing:'0.16em', color:'var(--text-dim)', textTransform:'uppercase' }}>
        <span style={{ width:8,height:8,display:'inline-block',background:'var(--red)',borderRadius:0 }}/>
        <span style={{ width:8,height:8,display:'inline-block',background:'var(--gold)',borderRadius:0 }}/>
        <span style={{ width:8,height:8,display:'inline-block',background:'var(--ok)',borderRadius:0 }}/>
        <span style={{ marginLeft:6 }}>ssp-secure@terminal — /auth/session</span>
      </div>
      <div ref={bodyRef} style={{ padding:'10px 16px 14px', fontFamily:'JetBrains Mono,monospace', fontSize:11.5, lineHeight:1.65, color:'var(--text-dim)', overflow:'hidden', position:'relative' }}>
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

  // Focus primer input cuando hay error o se solicita
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
    <div className="otp-input-wrapper" style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8, marginBottom:8 }} onPaste={handlePaste}>
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
  const [failed,  setFailed]  = useState<'credentials'|'otp'|null>(null)
  const [focusOtpInput, setFocusOtpInput] = useState(false)

  // Flujo de éxito: overlay (2800ms) → loader (1200ms) → dashboard
  useEffect(() => {
    if (phase !== 'success') return
    const t1 = setTimeout(() => {
      ;(window as unknown as { __showLoader?: (msg: string, minMs?: number) => void })
        .__showLoader?.('Cargando tablero...', 99999)
    }, 2800)
    const t2 = setTimeout(() => { window.location.href = fromPath }, 2800 + 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase, fromPath])

  // Limpiar overlay en OTP mode para reintentos
  const [email,   setEmail]   = useState('')
  const [pwd,     setPwd]     = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [otp,     setOtp]     = useState('')
  const [otpTime, setOtpTime] = useState(30)
  const [sessionId, setSessionId] = useState('----')
  useEffect(() => {
    setSessionId(String(Math.floor(Math.random()*9000+1000))+'-QRO')
  }, [])

  // Timer TOTP (30 s)
  useEffect(() => {
    if (phase !== 'otp') return
    const remaining = 30 - (Math.floor(Date.now()/1000) % 30)
    setOtpTime(remaining)
    const iv = setInterval(() => setOtpTime(30 - (Math.floor(Date.now()/1000) % 30)), 1000)
    return () => clearInterval(iv)
  }, [phase])

  // Auto-submit cuando hay 6 dígitos
  useEffect(() => {
    if (phase === 'otp' && otp.length === 6) handleOtpSubmit()
  }, [otp]) // eslint-disable-line

  const [dateStr, setDateStr] = useState('----.--.--')
  useEffect(() => {
    const d = new Date()
    setDateStr(`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`)
  }, [])

  // Animación de生成 código 2FA antes de pedirlo
  const [generating2FA, setGenerating2FA] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !pwd) return
    
    // Animación de "Generando código..."
    setGenerating2FA(true)
    setPhase('submitting-1')
    setFailed(null)
    
    await new Promise(r => setTimeout(r, 1200)) // Animation 1.2s
    setGenerating2FA(false)
    
    const { data, error } = await authClient.signIn.email({ email, password: pwd })

    if (error) {
      setFailed('credentials')
      setPhase('idle')
      return
    }

    // better-auth retorna twoFactorRedirect:true (HTTP 200) cuando 2FA está activo
    if ((data as { twoFactorRedirect?: boolean } | null)?.twoFactorRedirect) {
      setPhase('otp')
      return
    }

    setPhase('success')
  }

  async function handleOtpSubmit() {
    if (otp.length !== 6 || phase === 'submitting-2') return
    setPhase('submitting-2')
    setFailed(null)

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
  }

  const step = phase === 'idle' || phase === 'submitting-1' ? 1 : phase === 'success' ? 3 : 2

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        :root {
          --ink:      #f8fafc;
          --ink-2:    #ffffff;
          --ink-3:    #111a2e;
          --line:     #e2e8f0;
          --line-2:   #cbd5e1;
          --text:     #0f172a;
          --text-dim: #64748b;
          --text-mute:#4a5878;
          --navy:     #14224a;
          --red:      #2563eb;
          --red-hi:   #e03349;
          --gold:     #2563eb;
          --gold-hi:  #f0be4c;
          --ok:       #2563eb;
        }
        *{box-sizing:border-box;}
        html,body{margin:0;padding:0;background:var(--ink);color:var(--text);font-family:'Inter',system-ui,sans-serif;min-height:100vh;overflow:hidden;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes blink{50%{opacity:0}}
        @keyframes fadein{from{opacity:0}to{opacity:1}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes cyber-reveal-success {
          0% { opacity: 0; transform: scale(0.95); clip-path: polygon(0 40%, 100% 40%, 100% 60%, 0 60%); }
          50% { opacity: 1; transform: scale(1.02); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); filter: drop-shadow(0 0 10px rgba(74,158,106,0.8)); }
          100% { transform: scale(1); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
        }
        @keyframes text-glitch {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .cyber-success-wrap { animation: fadein 0.5s ease forwards; }
        .cyber-success-icon { animation: cyber-reveal-success 1.2s cubic-bezier(0.1,0.9,0.2,1) forwards; }
        .cyber-success-text { animation: text-glitch 0.6s ease 0.6s both; }
        .field-input-shake{animation:shake .35s ease;}
        @media(max-width:960px){
          .stage{grid-template-columns:1fr!important;grid-template-rows:auto 1fr;overflow-y:auto;position:relative!important;min-height:100vh;}
          html,body{overflow-y:auto;}
          .left-panel{padding:32px 24px!important; border-right:none!important; border-bottom:1px solid var(--line);}
          .h1-big{font-size:64px!important;}
          .main-panel{padding:32px 24px!important;}
          .terminal-panel{height:180px!important;}
          .topbar-container{flex-direction:column; gap:8px; align-items:flex-start!important; padding:12px 24px!important;}
        }
        @media(max-width:480px){
          .left-panel{display:none!important;}
          .topbar-container{display:none!important;}
          .main-panel{padding:24px 16px!important;}
          .terminal-panel{height:140px!important;}
          .otp-input-wrapper{gap:4px!important;}
          .otp-input-field{font-size:20px!important;}
          .hide-mobile{display:none!important;}
          .mobile-logo{display:flex!important;}
        }
        .otp-input-field { font-size: 26px; }
      `}</style>

      <div className="stage" style={{ position:'fixed',inset:0,display:'grid',gridTemplateColumns:'1.05fr 1fr',background:`var(--ink)` }}>
        {/* Grid blueprint */}
        <div style={{ position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(37,99,235,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.06) 1px,transparent 1px)'}}/>

        {/* Corners dorados */}
        {[{top:18,left:18,borderTop:'1px solid',borderLeft:'1px solid'},{top:18,right:18,borderTop:'1px solid',borderRight:'1px solid'},{bottom:18,left:18,borderBottom:'1px solid',borderLeft:'1px solid'},{bottom:18,right:18,borderBottom:'1px solid',borderRight:'1px solid'}].map((s,i) => (
          <div key={i} style={{ position:'absolute',width:22,height:22,borderColor:'var(--gold)',borderStyle:'solid',borderWidth:0,opacity:.6,...s }}/>
        ))}

        {/* ── PANEL IZQUIERDO ── */}
        <aside className="left-panel" style={{ position:'relative',padding:'52px 60px 44px',borderRight:'1px solid var(--line)',background: '#ffffff',display:'flex',flexDirection:'column',overflow:'hidden' }}>

          {/* Brand */}
          <div className="hide-mobile" style={{ display:'flex',alignItems:'center',gap:18,paddingBottom:26,borderBottom:'1px solid var(--line)' }}>
            <div style={{ position:'relative',width:96,height:96,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <div style={{ position:'absolute',inset:-6,borderRadius:'50%',background:'radial-gradient(circle at 50% 50%,rgba(255,255,255,.18) 0%,rgba(212,164,58,.10) 35%,rgba(212,164,58,0) 72%)',filter:'blur(6px)' }}/>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-shield.png" alt="Escudo SSPM" width={84} height={84} style={{ position:'relative',zIndex:1,objectFit:'contain',filter:'drop-shadow(0 4px 12px rgba(0,0,0,.5))' }} />
            </div>
            <div style={{ width:1,background:'linear-gradient(180deg,transparent,var(--gold),transparent)',alignSelf:'stretch',opacity:.55 }}/>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-text-dark.png" alt="SSPM" style={{ height:56,maxWidth:'100%',objectFit:'contain',objectPosition:'left center',opacity:.95 }} />
          </div>

          {/* Headline */}
          <div style={{ marginTop:30 }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'var(--red)',letterSpacing:'0.3em',textTransform:'uppercase',marginBottom:20,display:'flex',alignItems:'center',gap:10 }}>
              <span style={{ width:26,height:1,background:'var(--red)',display:'inline-block' }}/>
              Acceso oficial · uso restringido
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
              <img src="/logo_sentinel.png" alt="SENTINEL" style={{ height: 180, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(136, 129, 228, 0.5))' }} />
            </div>
            <h1 className="h1-big" style={{ fontFamily:'Barlow Condensed,sans-serif',fontWeight:800,fontSize:104,lineHeight:.9,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--text)',margin:0,textShadow:'0 0 40px rgba(37, 99, 235, 0.1)',textAlign:'center' }}>
              <span style={{ color:'var(--gold)' }}>CENTINELA</span>
            </h1>
            <div className="hide-mobile" style={{ display:'flex',gap:10,alignItems:'center',marginTop:16,fontFamily:'JetBrains Mono,monospace',fontSize:11,letterSpacing:'0.32em',color:'var(--text-dim)',textTransform:'uppercase' }}>
              <span>S.S.P.M.</span><span style={{ color:'var(--gold)' }}>·</span>
              <span>SAN JUAN DEL RÍO</span><span style={{ color:'var(--gold)' }}>·</span>
              <span>QRO</span>
            </div>
          </div>

          {/* Sentinel mark 
          <div className="hide-mobile" style={{ marginTop:34,display:'flex',alignItems:'center',gap:14 }}>
            <div style={{ flexShrink:0,width:28,height:1,background:'var(--gold)' }}/>
            <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:10.5,letterSpacing:'0.12em',color:'var(--text-dim)',textTransform:'lowercase',lineHeight:1.5 }}>
              <span style={{ color:'var(--gold)',fontWeight:700,textTransform:'uppercase' }}>S</span>istema{' '}
              <span style={{ color:'var(--gold)',fontWeight:700,textTransform:'uppercase' }}>E</span>stratégico{' '}
              <span style={{ color:'var(--gold)',fontWeight:700,textTransform:'uppercase' }}>N</span>acional{' '}
              <span style={{ color:'var(--gold)',fontWeight:700,textTransform:'uppercase' }}>T</span> de trazabilidad{' '}
              <span style={{ color:'var(--gold)',fontWeight:700,textTransform:'uppercase' }}>I</span> e inteligencia{' '}
              <span style={{ color:'var(--gold)',fontWeight:700,textTransform:'uppercase' }}>N</span> para la{' '}
              <span style={{ color:'var(--gold)',fontWeight:700,textTransform:'uppercase' }}>E</span>valuación{' '}
              <span style={{ color:'var(--gold)',fontWeight:700,textTransform:'uppercase' }}>L</span>ocal
            </div>
            <div style={{ flex:1,height:1,background:'var(--gold)' }}/>
          </div>*/}

          {/* Protocolo */}
          <div className="hide-mobile" style={{ marginTop:30,border:'1px solid var(--line)',background:'#ffffff',padding:'18px 20px',position:'relative' }}>
            <div style={{ position:'absolute',top:-1,left:0,width:40,height:2,background:'var(--gold)' }}/>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:'JetBrains Mono,monospace',fontSize:10,letterSpacing:'0.22em',color:'var(--text-dim)',textTransform:'uppercase',marginBottom:14 }}>
              <span>› Protocolo de acceso</span>
              <span style={{ color:'var(--gold)' }}>Nivel 3</span>
            </div>
            <div style={{ display:'grid',gap:10,fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'var(--text)',letterSpacing:'0.08em' }}>
              {[
                ['Canal cifrado extremo a extremo','Activo'],
                ['Verificación de identidad en dos pasos','Requerido'],
                ['Registro de sesión y trazabilidad','Habilitado'],
              ].map(([lbl,meta]) => (
                <div key={lbl} style={{ display:'grid',gridTemplateColumns:'14px 1fr auto',gap:12,alignItems:'center' }}>
                  <span style={{ color:'var(--ok)',fontSize:14 }}>✓</span>
                  <span>{lbl}</span>
                  <span style={{ color:'var(--text-mute)',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase' }}>{meta}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16,paddingTop:12,borderTop:'1px dashed var(--line-2)',display:'flex',justifyContent:'space-between',fontFamily:'JetBrains Mono,monospace',fontSize:9,letterSpacing:'0.22em',color:'var(--text-mute)',textTransform:'uppercase' }}>
              <span>SESIÓN · {dateStr}</span>
              <span style={{ color:'var(--gold)' }}>SIGN: 0x4F··A1C2</span>
            </div>
          </div>
        </aside>

        {/* ── PANEL DERECHO ── */}
        <section style={{ position:'relative',display:'flex',flexDirection:'column',overflow:'hidden',height:'100%' }}>

          {/* Header móvil — solo visible en ≤480px */}
          <div className="mobile-logo" style={{
            display:'none', alignItems:'center', gap:10,
            padding:'18px 20px', borderBottom:'1px solid var(--line)',
            background:'#ffffff',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo_sentinel.png" alt="S" style={{ height:36, objectFit:'contain', filter:'drop-shadow(0 0 8px rgba(212,164,58,0.5))' }} />
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, fontSize:30, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', lineHeight:1 }}>
              ENTINEL
            </span>
          </div>

          {/* Topbar */}
          <div className="topbar-container" style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 28px',borderBottom:'1px solid var(--line)',fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'var(--text-dim)',letterSpacing:'0.2em',textTransform:'uppercase',background:'rgba(255,255,255,.8)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:10 }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:'var(--gold)',boxShadow:'0 0 10px var(--gold)',display:'inline-block',animation:'pulse 2.2s ease-in-out infinite' }}/>
              <span>SSPM-SJR · ACCESO SEGURO</span>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:10,color:'var(--gold)' }}>
              <span>CIFRADO TLS 1.3</span>
              <span style={{ color:'var(--text-dim)' }}>·</span>
              <span>SESIÓN {sessionId}</span>
            </div>
          </div>

          {/* Formulario */}
          <div className="main-panel" style={{ flex: 1, padding:'60px 56px 20px',display:'flex',flexDirection:'column',overflow:'hidden',position:'relative' }}>

            {/* Solo mostrar formulario si NO es success */}
            {phase !== 'success' && (
            <>
            {/* Encabezado del form */}
            <div style={{ marginBottom:28 }}>
              <span style={{ display:'inline-flex',alignItems:'center',gap:8,fontFamily:'JetBrains Mono,monospace',fontSize:10,letterSpacing:'0.24em',color:'var(--gold)',textTransform:'uppercase',border:'1px solid var(--gold)',padding:'4px 10px',marginBottom:14 }}>
                <IconShield />
                {phase === 'otp' || phase === 'submitting-2' ? 'ETAPA 2 · VERIFICACIÓN 2FA' : 'ETAPA 1 · CREDENCIALES'}
              </span>
              <h2 style={{ fontFamily:'Barlow Condensed,sans-serif',fontWeight:800,fontSize:34,letterSpacing:'0.02em',textTransform:'uppercase',margin:0,color:'var(--text)' }}>
                {phase === 'otp' || phase === 'submitting-2' ? 'Verificación en dos pasos' : 'Inicio de sesión'}
              </h2>
              <div style={{ color:'var(--text-dim)',fontSize:13,marginTop:8 }}>
                {phase === 'otp' || phase === 'submitting-2'
                  ? 'Ingresa el código de 6 dígitos de tu app autenticadora.'
                  : 'Acceso restringido a personal autorizado de la SSPM.'}
              </div>
            </div>

            {/* Stepper */}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:26 }}>
              {[['01','CREDENCIALES',1],['02','DOBLE FACTOR',2],['03','TABLERO C4',3]].map(([num,label,s]) => {
                const n = Number(s)
                const active = step === n
                const done   = step > n
                return (
                  <div key={num} style={{ borderTop:`2px solid ${active?'var(--gold)':done?'var(--ok)':'var(--line-2)'}`,paddingTop:10,fontFamily:'JetBrains Mono,monospace',fontSize:10,letterSpacing:'0.18em',color:active?'var(--gold)':done?'var(--ok)':'var(--text-mute)',textTransform:'uppercase' }}>
                    <span style={{ marginRight:8,color:active?'var(--gold)':done?'var(--ok)':'var(--text-mute)' }}>{num}</span>{label}
                  </div>
                )
              })}
            </div>

            {/* ── FASE 1: credenciales ── */}
            {(phase === 'idle' || phase === 'submitting-1') && (
              <form onSubmit={handleLogin}>
                {/* Email */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:10,letterSpacing:'0.2em',color:'var(--text-dim)',textTransform:'uppercase',marginBottom:8,display:'flex',justifyContent:'space-between' }}>
                    <span>Correo institucional</span>
                    <span style={{ color:'var(--text-mute)',letterSpacing:'0.1em' }}>formato: usuario@gmail.com</span>
                  </div>
                  <div className={failed==='credentials'?'field-input-shake':''} style={{ display:'flex',alignItems:'center',gap:12,background:'var(--ink-2)',border:`1px solid ${failed==='credentials'?'var(--red)':'var(--line-2)'}`,padding:'12px 14px',boxShadow:failed==='credentials'?'0 0 0 3px rgba(192,34,58,.15)':'none',transition:'border-color .15s,box-shadow .15s' }}>
                    <IconUser />
                    <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="usuario@sjr.gob.mx" autoComplete="email" type="email" required disabled={phase==='submitting-1'}
                      style={{ flex:1,background:'transparent',border:'none',outline:'none',color:'var(--text)',fontFamily:'JetBrains Mono,monospace',fontSize:14,letterSpacing:'0.06em' }}
                      onFocus={e=>{ e.currentTarget.parentElement!.style.borderColor='var(--gold)'; e.currentTarget.parentElement!.style.boxShadow='0 0 0 3px rgba(212,164,58,.12)' }}
                      onBlur={e=>{ e.currentTarget.parentElement!.style.borderColor=failed==='credentials'?'var(--red)':'var(--line-2)'; e.currentTarget.parentElement!.style.boxShadow='' }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom:4 }}>
                  <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:10,letterSpacing:'0.2em',color:'var(--text-dim)',textTransform:'uppercase',marginBottom:8,display:'flex',justifyContent:'space-between' }}>
                    <span>Contraseña</span>
                    <span style={{ color:'var(--text-mute)',letterSpacing:'0.1em' }}>mín. 8 caracteres</span>
                  </div>
                  <div className={failed==='credentials'?'field-input-shake':''} style={{ display:'flex',alignItems:'center',gap:12,background:'var(--ink-2)',border:`1px solid ${failed==='credentials'?'var(--red)':'var(--line-2)'}`,padding:'12px 14px',transition:'border-color .15s,box-shadow .15s' }}>
                    <IconLock />
                    <input type={showPwd?'text':'password'} value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="••••••••••••" autoComplete="current-password" required disabled={phase==='submitting-1'}
                      style={{ flex:1,background:'transparent',border:'none',outline:'none',color:'var(--text)',fontFamily:'JetBrains Mono,monospace',fontSize:14,letterSpacing:'0.06em' }}
                      onFocus={e=>{ e.currentTarget.parentElement!.style.borderColor='var(--gold)'; e.currentTarget.parentElement!.style.boxShadow='0 0 0 3px rgba(212,164,58,.12)' }}
                      onBlur={e=>{ e.currentTarget.parentElement!.style.borderColor=failed==='credentials'?'var(--red)':'var(--line-2)'; e.currentTarget.parentElement!.style.boxShadow='' }}
                    />
                    <button type="button" onClick={()=>setShowPwd(s=>!s)} style={{ background:'none',border:'none',color:'var(--text-dim)',cursor:'pointer',fontFamily:'JetBrains Mono,monospace',fontSize:10,letterSpacing:'0.15em',padding:'4px 6px' }}>
                      {showPwd?'OCULTAR':'VER'}
                    </button>
                  </div>
                </div>

                {failed === 'credentials' && (
                  <div style={{ marginTop:14,padding:'10px 14px',borderLeft:'3px solid var(--red)',background:'rgba(192,34,58,.08)',color:'var(--red)',fontFamily:'JetBrains Mono,monospace',fontSize:11,letterSpacing:'0.1em',display:'flex',alignItems:'center',gap:10 }}>
                    <span>⚠</span><span>Credenciales incorrectas · Verifique sus datos de acceso</span>
                  </div>
                )}

<button type="submit" disabled={phase==='submitting-1'||!email||!pwd}
                  style={{ marginTop:22,display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'14px 18px',background:'var(--red)',color:'#fff',border:'1px solid var(--red)',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:14,letterSpacing:'0.2em',textTransform:'uppercase',cursor:phase==='submitting-1'?'not-allowed':'pointer',opacity:(!email||!pwd)?0.5:1,transition:'background .15s' }}
                  onMouseEnter={e=>{if(phase!=='submitting-1')e.currentTarget.style.background='var(--red-hi)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='var(--red)'}}>
                  {phase==='submitting-1'
                    ? generating2FA
                      ? <span style={{ display:'flex',alignItems:'center',gap:8,fontSize:13 }}><span style={{ width:12,height:12,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }} /> Generando código 2FA...</span>
                      : <span style={{ display:'flex',alignItems:'center',gap:8,fontSize:13 }}><span style={{ width:12,height:12,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }} /> Validando…</span>
                    : <span>⬢ Acceder al sistema</span>}
                </button>
              </form>
            )}

            {/* ── FASE 2: TOTP ── */}
            {(phase === 'otp' || phase === 'submitting-2') && (
              <div>
                <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:10,letterSpacing:'0.2em',color:'var(--text-dim)',textTransform:'uppercase',marginBottom:8,display:'flex',justifyContent:'space-between' }}>
                  <span>Código de verificación · 6 dígitos</span>
                  <span style={{ color:'var(--text-mute)',letterSpacing:'0.1em' }}>App autenticadora</span>
                </div>
                <OtpInput value={otp} onChange={setOtp} error={failed==='otp'} focusFirst={focusOtpInput} />
                <div style={{ display:'flex',justifyContent:'space-between',fontFamily:'JetBrains Mono,monospace',fontSize:10,letterSpacing:'0.16em',color:'var(--text-dim)',textTransform:'uppercase',marginBottom:20 }}>
                  <span>Código se renueva en <span style={{ color:'var(--gold)' }}>00:{String(otpTime).padStart(2,'0')}</span></span>
                  <span style={{ color:'var(--text-mute)' }}>Google · Authy</span>
                </div>

                {failed === 'otp' && (
                  <div style={{ marginBottom:14,padding:'10px 14px',borderLeft:'3px solid var(--red)',background:'rgba(192,34,58,.08)',color:'var(--red)',fontFamily:'JetBrains Mono,monospace',fontSize:11,letterSpacing:'0.1em',display:'flex',alignItems:'center',gap:10 }}>
                    <span>⚠</span><span>Token incorrecto · Verifica tu app autenticadora e intenta de nuevo</span>
                  </div>
                )}

                <button onClick={handleOtpSubmit} disabled={phase==='submitting-2'||otp.length!==6}
                  style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:12,width:'100%',padding:'15px 18px',background:'var(--red)',color:'#fff',border:'1px solid var(--red)',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:15,letterSpacing:'0.22em',textTransform:'uppercase',cursor:otp.length!==6||phase==='submitting-2'?'not-allowed':'pointer',opacity:otp.length!==6?0.5:1 }}>
                  {phase==='submitting-2'
                    ? <><span style={{ width:14,height:14,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }}/> Verificando token…</>
                    : <>Confirmar e ingresar <IconArrow /></>}
                </button>

                <button onClick={()=>{setPhase('idle');setFailed(null);setOtp('')}}
                  style={{ marginTop:10,display:'flex',alignItems:'center',justifyContent:'center',gap:12,width:'100%',padding:'15px 18px',background:'transparent',color:'var(--text)',border:'1px solid var(--line-2)',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:15,letterSpacing:'0.22em',textTransform:'uppercase',cursor:'pointer' }}>
                  ← Volver a credenciales
                </button>
              </div>
            )}

            </>
            )}
          </div>

          {/* {phase !== 'success' && <Terminal phase={phase} failed={failed} />} */}

          {/* Overlay de éxito Ciberpunk a nivel de toda la sección */}
          {phase === 'success' && (
            <div className="cyber-success-wrap" style={{ position:'absolute',inset:0,background:'rgba(255,255,255,0.95)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',zIndex:999 }}>
              {/* Grid background success */}
              <div style={{ position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(74,158,106,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(74,158,106,0.08) 1px,transparent 1px)',backgroundSize:'40px 40px',pointerEvents:'none' }}/>
              
              {/* Línea horizontal central */}
              <div style={{ position:'absolute',top:'50%',left:0,right:0,height:1,background:'rgba(37,99,235,0.4)', boxShadow:'0 0 15px rgba(37,99,235,0.6)' }}/>

              <div className="cyber-success-icon" style={{ width:120,height:120,background:'var(--ink)',borderRadius:4,border:'1px solid var(--ok)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 40px rgba(74,158,106,.35), inset 0 0 20px rgba(74,158,106,.2)',marginBottom:36,position:'relative',zIndex:2 }}>
                 {/* Decorative brackets */}
                 <div style={{ position:'absolute',top:-2,left:-2,width:16,height:16,borderTop:'2px solid var(--ok)',borderLeft:'2px solid var(--ok)'}}/>
                 <div style={{ position:'absolute',bottom:-2,right:-2,width:16,height:16,borderBottom:'2px solid var(--ok)',borderRight:'2px solid var(--ok)'}}/>
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              
              <div className="cyber-success-text" style={{ textAlign:'center',position:'relative',zIndex:2 }}>
                 <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:12,color:'var(--ok)',letterSpacing:'0.4em',textTransform:'uppercase',marginBottom:12 }}>[ STATUS: AUTHENTICATED ]</div>
                 <h3 style={{ fontFamily:'Barlow Condensed,sans-serif',fontWeight:800,fontSize:46,letterSpacing:'0.08em',textTransform:'uppercase',margin:'0 0 8px',color:'var(--text)', textShadow:'0 0 20px rgba(37, 99, 235, 0.2)' }}>Acceso concedido</h3>
                 <p style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,letterSpacing:'0.18em',color:'var(--gold)',textTransform:'uppercase',margin:0 }}>Iniciando enlace seguro con el núcleo C4...</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
