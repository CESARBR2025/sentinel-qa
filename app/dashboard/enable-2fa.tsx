'use client'
import { useState, useEffect, useRef } from 'react'
import { authClient } from '@/lib/auth-client'

type Step = 'idle' | 'confirm-pwd' | 'qr' | 'verify' | 'done'

export function Enable2FA({ enabled }: { enabled: boolean }) {
  const [step,    setStep]    = useState<Step>(enabled ? 'done' : 'idle')
  const [pwd,     setPwd]     = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [totpUri, setTotpUri] = useState('')
  const [qrUrl,   setQrUrl]   = useState('')
  const [code,    setCode]    = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showUri, setShowUri] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (step === 'verify') inputRef.current?.focus() }, [step])

  async function handleEnable() {
    if (!pwd) return
    setError(''); setLoading(true)

    const { data, error: err } = await authClient.twoFactor.enable({ password: pwd })
    setLoading(false)

    if (err || !data?.totpURI) { setError(err?.message ?? 'Error al activar 2FA'); return }

    setTotpUri(data.totpURI)

    // Genera QR en cliente
    const QRCode = (await import('qrcode')).default
    const url = await QRCode.toDataURL(data.totpURI, {
      width: 220, margin: 2,
      color: { dark: '#ffffff', light: '#0b1220' },
    })
    setQrUrl(url)
    setStep('qr')
  }

  async function handleVerify() {
    if (code.length !== 6) return
    setError(''); setLoading(true)

    const { error: err } = await authClient.twoFactor.verifyTotp({ code })
    setLoading(false)

    if (err) { setError('Código incorrecto, intenta de nuevo'); setCode(''); return }
    setStep('done')
  }

  // ── idle ──────────────────────────────────────────────────────────────────
  if (step === 'idle') return (
    <Card title="Verificación en dos pasos" tag="Inactivo" tagColor="#c0223a">
      <p style={s.body}>Agrega una capa extra de seguridad. Al activarlo necesitarás tu app autenticadora en cada inicio de sesión.</p>
      <button onClick={() => setStep('confirm-pwd')} style={s.btn}>Activar 2FA →</button>
    </Card>
  )

  // ── confirm-pwd ───────────────────────────────────────────────────────────
  if (step === 'confirm-pwd') return (
    <Card title="Confirmar contraseña" tag="Paso 1 / 3" tagColor="#d4a43a">
      <p style={s.body}>Ingresa tu contraseña actual para continuar.</p>
      <div style={{ position:'relative' }}>
        <input
          type={showPwd ? 'text' : 'password'} value={pwd}
          onChange={e => setPwd(e.target.value)}
          placeholder="••••••••" autoFocus
          onKeyDown={e => e.key === 'Enter' && handleEnable()}
          style={{ ...s.input, paddingRight:48 }}
        />
        <button type="button" onClick={() => setShowPwd(v => !v)}
          style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#7f8faf', cursor:'pointer', fontFamily:'JetBrains Mono,monospace', fontSize:10, letterSpacing:'0.12em' }}>
          {showPwd ? 'OCULTAR' : 'VER'}
        </button>
      </div>
      {error && <div style={s.err}>⚠ {error}</div>}
      <div style={{ display:'flex', gap:8, marginTop:12 }}>
        <button onClick={() => { setStep('idle'); setPwd(''); setError('') }} style={s.ghost}>← Cancelar</button>
        <button onClick={handleEnable} disabled={!pwd || loading} style={{ ...s.btn, flex:1 }}>
          {loading ? 'Verificando…' : 'Continuar →'}
        </button>
      </div>
    </Card>
  )

  // ── qr ───────────────────────────────────────────────────────────────────
  if (step === 'qr') return (
    <Card title="Escanea el código QR" tag="Paso 2 / 3" tagColor="#d4a43a">
      <p style={s.body}>Abre <b style={{ color:'#d8e0f0' }}>Google Authenticator</b>, <b style={{ color:'#d8e0f0' }}>Authy</b> o cualquier app TOTP y escanea:</p>
      <div style={{ display:'flex', justifyContent:'center', margin:'16px 0' }}>
        {qrUrl
          ? <div style={{ padding:8, background:'#0b1220', border:'1px solid #2a3a5e' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR 2FA" width={200} height={200} />
            </div>
          : <div style={{ width:200, height:200, background:'#0b1220', border:'1px solid #2a3a5e' }} />
        }
      </div>
      <button type="button" onClick={() => setShowUri(v => !v)} style={{ ...s.ghost, fontSize:10, marginBottom:8 }}>
        {showUri ? 'Ocultar clave manual' : '¿No puedes escanear? Ver clave manual'}
      </button>
      {showUri && (
        <div style={{ padding:'8px 10px', background:'#070b16', border:'1px solid #1b2742', marginBottom:12, wordBreak:'break-all', fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#d4a43a' }}>
          {totpUri}
        </div>
      )}
      <button onClick={() => setStep('verify')} style={s.btn}>Ya lo escaneé → Verificar</button>
    </Card>
  )

  // ── verify ────────────────────────────────────────────────────────────────
  if (step === 'verify') return (
    <Card title="Confirma el código" tag="Paso 3 / 3" tagColor="#d4a43a">
      <p style={s.body}>Ingresa el código de 6 dígitos que muestra tu app para confirmar que está configurada.</p>
      <input
        ref={inputRef} type="text" inputMode="numeric" maxLength={6}
        value={code} onChange={e => { setCode(e.target.value.replace(/\D/g,'').slice(0,6)); setError('') }}
        placeholder="000000"
        style={{ ...s.input, textAlign:'center', fontSize:24, letterSpacing:'0.5em', fontFamily:'JetBrains Mono,monospace' }}
      />
      {error && <div style={s.err}>⚠ {error}</div>}
      <div style={{ display:'flex', gap:8, marginTop:12 }}>
        <button onClick={() => { setStep('qr'); setCode(''); setError('') }} style={s.ghost}>← Atrás</button>
        <button onClick={handleVerify} disabled={code.length !== 6 || loading} style={{ ...s.btn, flex:1 }}>
          {loading ? 'Verificando…' : 'Activar 2FA'}
        </button>
      </div>
    </Card>
  )

  // ── done ──────────────────────────────────────────────────────────────────
  return (
    <Card title="Verificación en dos pasos" tag="Activo" tagColor="#4a9e6a">
      <p style={s.body}>Tu cuenta está protegida con autenticación TOTP. Cada inicio de sesión pedirá el código de tu app autenticadora.</p>
      <div style={{ display:'flex', alignItems:'center', gap:10, fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'#4a9e6a', letterSpacing:'0.1em' }}>
        <span style={{ fontSize:18 }}>✓</span> 2FA configurado correctamente
      </div>
    </Card>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────
function Card({ title, tag, tagColor, children }: { title: string; tag: string; tagColor: string; children: React.ReactNode }) {
  return (
    <div style={{ border:'1px solid #1b2742', background:'#0b1220', padding:'24px 20px', position:'relative' }}>
      <div style={{ position:'absolute', top:-1, left:0, width:32, height:2, background:'#d4a43a' }}/>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:15, letterSpacing:'0.06em', textTransform:'uppercase', color:'#d8e0f0' }}>{title}</span>
        <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', padding:'3px 8px', border:`1px solid ${tagColor}`, color:tagColor }}>{tag}</span>
      </div>
      {children}
    </div>
  )
}

const s = {
  body:  { fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'#7f8faf', letterSpacing:'0.06em', lineHeight:1.6, marginBottom:14 } as React.CSSProperties,
  input: { width:'100%', padding:'10px 12px', background:'#070b16', border:'1px solid #2a3a5e', color:'#d8e0f0', fontFamily:'JetBrains Mono,monospace', fontSize:13, outline:'none', boxSizing:'border-box' } as React.CSSProperties,
  btn:   { width:'100%', padding:'11px 14px', background:'#c0223a', color:'#fff', border:'1px solid #c0223a', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:13, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer' } as React.CSSProperties,
  ghost: { padding:'9px 14px', background:'transparent', color:'#7f8faf', border:'1px solid #2a3a5e', fontFamily:'JetBrains Mono,monospace', fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer' } as React.CSSProperties,
  err:   { marginTop:8, padding:'8px 10px', borderLeft:'3px solid #c0223a', background:'rgba(192,34,58,.08)', color:'#c0223a', fontFamily:'JetBrains Mono,monospace', fontSize:11, letterSpacing:'0.08em' } as React.CSSProperties,
}
