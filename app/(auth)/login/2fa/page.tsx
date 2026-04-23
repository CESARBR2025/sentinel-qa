'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function TwoFactorPage() {
  const router  = useRouter()
  const [code,    setCode]    = useState('')
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) return
    setError(null)
    setLoading(true)

    const { error: authError } = await authClient.twoFactor.verifyTotp(
      { code },
      {
        onSuccess: () => router.push('/dashboard'),
        onError:   (ctx) => setError(ctx.error.message ?? 'Código inválido'),
      }
    )

    if (authError) setError(authError.message ?? 'Código inválido')
    setLoading(false)
  }

  function handleCodeChange(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 6)
    setCode(digits)
    setError(null)
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-xl">
      {/* Icono */}
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
          <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3" />
          </svg>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-white text-center mb-1">
        Verificación en dos pasos
      </h2>
      <p className="text-sm text-gray-400 text-center mb-6">
        Abre tu app autenticadora e ingresa el código de 6 dígitos
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-center text-2xl tracking-[0.5em] font-mono placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="000000"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
        >
          {loading ? 'Verificando...' : 'Verificar código'}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-5">
        El código se renueva cada 30 segundos
      </p>
    </div>
  )
}
