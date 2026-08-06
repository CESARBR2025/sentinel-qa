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
      color: { dark: '#0f172a', light: '#ffffff' },
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
    <Card title="Verificación en dos pasos" tag="Inactivo" tagColor="#ef4444">
      <p style={s.body}>Agrega una capa extra de seguridad. Al activarlo necesitarás tu app autenticadora en cada inicio de sesión.</p>
      <button onClick={() => setStep('confirm-pwd')} style={s.btn}>Activar 2FA →</button>
    </Card>
  )

  // ── confirm-pwd ───────────────────────────────────────────────────────────
  if (step === 'confirm-pwd') return (
    <Card title="Confirmar contraseña" tag="Paso 1 de 3" tagColor="#1f355a">
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
          style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontFamily:'var(--apple-font-display)', fontSize:12 }}>
          {showPwd ? 'Ocultar' : 'Ver'}
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
    <Card title="Escanea el código QR" tag="Paso 2 de 3" tagColor="#1f355a">
      <p style={s.body}>Abre <b style={{ color:'#0f172a' }}>Google Authenticator</b>, <b style={{ color:'#0f172a' }}>Authy</b> o cualquier app TOTP y escanea:</p>
      <div style={{ display:'flex', justifyContent:'center', margin:'16px 0' }}>
        {qrUrl
          ? <div style={{ padding:8, background:'#ffffff', border:'1px solid #e2e8f0', borderRadius:'var(--radius-lg)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR 2FA" width={200} height={200} />
            </div>
          : <div style={{ width:200, height:200, background:'#ffffff', border:'1px solid #e2e8f0', borderRadius:'var(--radius-lg)' }} />
        }
      </div>
      <button type="button" onClick={() => setShowUri(v => !v)} style={{ ...s.ghost, fontSize:12, marginBottom:8 }}>
        {showUri ? 'Ocultar clave manual' : '¿No puedes escanear? Ver clave manual'}
      </button>
      {showUri && (
        <div style={{ padding:'8px 10px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'var(--radius-lg)', marginBottom:12, wordBreak:'break-all', fontFamily:'var(--apple-font-display)', fontSize:12, color:'#1f355a' }}>
          {totpUri}
        </div>
      )}
      <button onClick={() => setStep('verify')} style={s.btn}>Ya lo escaneé → Verificar</button>
    </Card>
  )

  // ── verify ────────────────────────────────────────────────────────────────
  if (step === 'verify') return (
    <Card title="Confirma el código" tag="Paso 3 de 3" tagColor="#1f355a">
      <p style={s.body}>Ingresa el código de 6 dígitos que muestra tu app para confirmar que está configurada.</p>
      <input
        ref={inputRef} type="text" inputMode="numeric" maxLength={6}
        value={code} onChange={e => { setCode(e.target.value.replace(/\D/g,'').slice(0,6)); setError('') }}
        placeholder="000000"
        style={{ ...s.input, textAlign:'center', fontSize:24, letterSpacing:'0.5em', fontFamily:'var(--apple-font-display)' }}
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
    <Card title="Verificación en dos pasos" tag="Activo" tagColor="#16a34a">
      <p style={s.body}>Tu cuenta está protegida con autenticación TOTP. Cada inicio de sesión pedirá el código de tu app autenticadora.</p>
      <div style={{ display:'flex', alignItems:'center', gap:10, fontFamily:'var(--apple-font-display)', fontSize:13, color:'#16a34a' }}>
        <span style={{ fontSize:18 }}>✓</span> 2FA configurado correctamente
      </div>
    </Card>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────
// Piloto Apple-style (DESIGN.md §10) — mismo lenguaje que el resto del hub.
function Card({ title, tag, tagColor, children }: { title: string; tag: string; tagColor: string; children: React.ReactNode }) {
  return (
    <div style={{
      border:'1px solid #e2e8f0',
      background:'#ffffff',
      borderRadius:'var(--radius-lg)',
      padding:'24px 20px',
      position:'relative',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ position:'absolute', top:-1, left:0, width:32, height:2, background:'#1f355a' }}/>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <span style={{ fontFamily:'var(--apple-font-display)', fontWeight:600, fontSize:15, color:'#0f172a' }}>{title}</span>
        <span style={{ fontFamily:'var(--apple-font-display)', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:'var(--radius-full)', border:`1px solid ${tagColor}`, color:tagColor }}>{tag}</span>
      </div>
      {children}
    </div>
  )
}

const s = {
  body:  { fontFamily:'var(--apple-font-display)', fontSize:13, color:'#64748b', lineHeight:1.6, marginBottom:14 } as React.CSSProperties,
  input: { width:'100%', padding:'10px 12px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'var(--radius-lg)', color:'#0f172a', fontFamily:'var(--apple-font-display)', fontSize:13, outline:'none', boxSizing:'border-box' } as React.CSSProperties,
  btn:   { width:'100%', padding:'11px 14px', background:'#1f355a', color:'#fff', border:'1px solid #1f355a', borderRadius:'var(--radius-lg)', fontFamily:'var(--apple-font-display)', fontWeight:600, fontSize:14, cursor:'pointer' } as React.CSSProperties,
  ghost: { padding:'9px 14px', background:'transparent', color:'#64748b', border:'1px solid #e2e8f0', borderRadius:'var(--radius-lg)', fontFamily:'var(--apple-font-display)', fontSize:13, cursor:'pointer' } as React.CSSProperties,
  err:   { marginTop:8, padding:'8px 10px', borderLeft:'3px solid #ef4444', background:'#fef2f2', color:'#ef4444', fontFamily:'var(--apple-font-display)', fontSize:12 } as React.CSSProperties,
}
