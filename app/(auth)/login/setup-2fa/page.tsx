'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { authClient } from '@/lib/auth-client'

export default function Setup2FAPage() {
  const router = useRouter()
  const [qrUrl,     setQrUrl]     = useState<string | null>(null)
  const [totpUri,   setTotpUri]   = useState<string | null>(null)
  const [code,      setCode]      = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [step,      setStep]      = useState<'qr' | 'verify'>('qr')
  const [showUri,   setShowUri]   = useState(false)

  useEffect(() => {
    authClient.twoFactor.getTotpUri(
      { password: '' },
      {
        onSuccess: async (ctx) => {
          const uri = ctx.data?.totpURI
          if (!uri) return
          setTotpUri(uri)
          const QRCode = (await import('qrcode')).default
          const url = await QRCode.toDataURL(uri, { width: 240, margin: 2, color: { dark: '#ffffff', light: '#111827' } })
          setQrUrl(url)
        },
        onError: () => setError('No se pudo generar el código QR'),
      }
    )
  }, [])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) return
    setError(null)
    setLoading(true)

    await authClient.twoFactor.verifyTotp(
      { code },
      {
        onSuccess: () => router.push('/dashboard'),
        onError:   (ctx) => {
          setError(ctx.error.message ?? 'Código inválido, intenta de nuevo')
          setCode('')
        },
      }
    )
    setLoading(false)
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-xl">
      <h2 className="text-lg font-semibold text-white mb-1">Configura tu autenticador</h2>
      <p className="text-sm text-gray-400 mb-6">
        Escanea el código QR con <span className="text-white">Google Authenticator</span>, <span className="text-white">Authy</span> o cualquier app compatible con TOTP.
      </p>

      {/* Pasos */}
      <div className="flex gap-2 mb-6">
        {(['qr', 'verify'] as const).map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1 rounded-full transition-colors ${step === s || (i === 1 && step === 'verify') ? 'bg-blue-500' : 'bg-gray-700'}`} />
            <p className={`text-xs mt-1.5 ${step === s ? 'text-blue-400' : 'text-gray-500'}`}>
              {i === 0 ? '1. Escanear QR' : '2. Verificar código'}
            </p>
          </div>
        ))}
      </div>

      {step === 'qr' && (
        <div className="space-y-5">
          <div className="flex justify-center">
            {qrUrl ? (
              <div className="p-3 bg-gray-800 rounded-xl border border-gray-700">
                <Image src={qrUrl} alt="Código QR para autenticador" width={200} height={200} unoptimized />
              </div>
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-800 rounded-xl border border-gray-700 animate-pulse" />
            )}
          </div>

          {/* URI manual */}
          <div>
            <button
              type="button"
              onClick={() => setShowUri(!showUri)}
              className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
            >
              {showUri ? 'Ocultar' : '¿No puedes escanear el QR?'}
            </button>
            {showUri && totpUri && (
              <div className="mt-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Ingresa este código manualmente en tu app:</p>
                <code className="text-xs text-blue-300 break-all">{totpUri}</code>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setStep('verify')}
            disabled={!qrUrl}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            Ya lo escané →
          </button>
        </div>
      )}

      {step === 'verify' && (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-gray-400">
            Ingresa el código de 6 dígitos que muestra tu app para confirmar que está configurada correctamente.
          </p>

          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            value={code}
            onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(null) }}
            autoFocus
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-center text-2xl tracking-[0.5em] font-mono placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="000000"
          />

          {error && (
            <div className="flex items-center gap-2 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep('qr')}
              className="flex-1 border border-gray-700 hover:border-gray-600 text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm">
              ← Atrás
            </button>
            <button type="submit" disabled={loading || code.length !== 6}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm">
              {loading ? 'Verificando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
