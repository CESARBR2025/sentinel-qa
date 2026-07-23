'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, AlertTriangle, Lock, ArrowRight } from 'lucide-react';

interface PinBarrierProps {
  infraccionId: string;
  folio: string;
  nombreInfractor?: string | null;
}

export default function PinBarrier({ infraccionId, folio, nombreInfractor }: PinBarrierProps) {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [bloqueadoHasta, setBloqueadoHasta] = useState<string | null>(null);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError(null);

    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const pinCompleto = pin.join('');
    if (pinCompleto.length !== 6) {
      setError('Ingresa los 6 dígitos del código de acceso');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/via/infracciones/verificar-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ infraccionId, pin: pinCompleto }),
      });

      const data = await res.json();

      if (data.ok) {
        router.refresh();
      } else if (data.bloqueado) {
        setBloqueado(true);
        setBloqueadoHasta(data.hasta);
      } else if (data.intentos_restantes !== undefined) {
        setError(`Código incorrecto. Intentos restantes: ${data.intentos_restantes}`);
        setPin(Array(6).fill(''));
        const firstInput = document.getElementById('pin-0');
        firstInput?.focus();
      } else {
        setError(data.error || 'Error al verificar código');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (bloqueado) {
    const hastaDate = bloqueadoHasta ? new Date(bloqueadoHasta) : null;
    return (
      <main className="min-h-dvh bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-red-200 shadow-card max-w-md w-full p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <Lock size={32} className="text-red-500" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-slate-900">Demasiados intentos</h2>
            <p className="text-sm text-slate-500">
              Has agotado los intentos permitidos. Podrás intentar de nuevo{hastaDate ? ` a las ${hastaDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}` : ''}.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-card max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-8 text-center">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={28} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-medium text-white">Acceso a infracción</h1>
          <p className="text-sm text-white/70 mt-1">
            Ingresa el código de acceso de 6 dígitos
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Folio</p>
            <p className="text-lg font-mono font-semibold text-slate-900 tracking-wider">{folio}</p>
            {nombreInfractor && (
              <p className="text-xs text-slate-400">{nombreInfractor}</p>
            )}
          </div>

          <div className="flex justify-center gap-2">
            {pin.map((digit, i) => (
              <input
                key={i}
                id={`pin-${i}`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={loading}
                className={`w-11 h-12 text-center text-lg font-bold font-mono rounded-lg border-2 transition-all ${
                  error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20'
                } ${loading ? 'opacity-50' : ''}`}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertTriangle size={14} className="text-red-500 shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || pin.join('').length !== 6}
            className="w-full h-12 rounded-lg bg-primary hover:bg-primary-dark active:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Verificando...</>
            ) : (
              <><ArrowRight size={18} /> Consultar infracción</>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
