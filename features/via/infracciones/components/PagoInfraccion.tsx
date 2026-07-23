'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, CreditCard, Loader2, ShieldCheck, X } from 'lucide-react';

type Props = {
  infraccionId: string;
  ordenPagoId: string;
  urlPago: string;
  estatus: string;
  estatusDependencia: string;
  estatusInfraccion: string;
};

export default function PagoInfraccion({
  infraccionId,
  urlPago,
  estatusDependencia,
  estatusInfraccion,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagado, setPagado] = useState(false);
  const [mostrandoExito, setMostrandoExito] = useState(false);
  const [iframeCargado, setIframeCargado] = useState(false);
  const [modalAbiertaAntes, setModalAbiertaAntes] = useState(false);

  const verificarPago = async (): Promise<boolean> => {
    if (loading) return false;
    try {
      setLoading(true);
      let url = '';
      if (estatusInfraccion === 'PENDIENTE_PAGO' && estatusDependencia === 'PENDIENTE_PAGO_INFRACCION') {
        url = `/api/via/pagos/confirmar-ausente/${infraccionId}`;
      } else if (estatusInfraccion === 'PENDIENTE_PAGO' && estatusDependencia === 'PENDIENTE_PAGO_INSTANTE') {
        url = `/api/via/pagos/confirmar-instante/${infraccionId}`;
      } else if (estatusInfraccion === 'PENDIENTE_PAGO' && estatusDependencia === 'PLACA_RETENIDA_EN_TRANSITO') {
        url = `/api/via/pagos/confirmar-retenida/${infraccionId}`;
      } else if (estatusInfraccion === 'PENDIENTE_PAGO' && estatusDependencia === 'PENDIENTE_PAGO_LIBERACION') {
        url = `/api/via/pagos/confirmar-liberacion/${infraccionId}`;
      }
      if (!url) return false;
      const res = await fetch(url, { method: 'GET', cache: 'no-store' });
      const data = await res.json();
      if (data.pagado) {
        setPagado(true);
        setMostrandoExito(true);
        setTimeout(() => {
          setOpen(false);
          setMostrandoExito(false);
          router.refresh();
        }, 3000);
        return true;
      }
      return false;
    } catch (error) {
      console.error('ERROR VERIFICANDO PAGO:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const forzarPago = async () => {
    if (loading) return;
    if (!confirm('¿Forzar pago de esta infracción? (solo pruebas)')) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/via/pagos/forzar-pago/${infraccionId}`, { method: 'POST' });
      const data = await res.json();
      if (data.pagado) {
        setPagado(true);
        setMostrandoExito(true);
        setTimeout(() => {
          setOpen(false);
          setMostrandoExito(false);
          router.refresh();
        }, 3000);
      } else {
        alert('Error: ' + (data.error || 'No se pudo forzar el pago'));
      }
    } catch (error) {
      console.error('ERROR FORZANDO PAGO:', error);
      alert('Error al forzar pago');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (pagado && !open) {
    return (
      <div className="p-8 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-slate-800">Tu infracción fue pagada</h3>
          <p className="text-sm text-slate-500">El pago fue validado correctamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      <button onClick={() => { setOpen(true); setModalAbiertaAntes(true); }}
        className="w-full h-14 rounded-lg bg-primary hover:bg-primary-dark active:bg-primary/80 text-white font-medium transition flex items-center justify-center gap-2 active:scale-[0.99]"
      >
        <CreditCard size={18} strokeWidth={1.5} /> Pagar infracción
      </button>
      <div className="rounded-lg bg-primary-muted border border-primary/20 p-4">
        <p className="text-xs text-primary leading-relaxed">El pago será procesado mediante una plataforma segura externa.</p>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl h-[88vh] overflow-hidden shadow-modal flex flex-col">
            <div className="h-16 border-b border-slate-200 px-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-emerald-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 text-sm">Pago Digital</h3>
                  <p className="text-[11px] text-slate-500">Getnet · Pago seguro con tarjeta</p>
                </div>
              </div>
              {!mostrandoExito && (
                <button onClick={handleClose} className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                  <X size={18} strokeWidth={1.5} />
                </button>
              )}
            </div>

            {mostrandoExito ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 bg-gradient-to-b from-emerald-50 to-white">
                <div className="w-28 h-28 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-8">
                  <CheckCircle2 size={56} strokeWidth={1.5} />
                </div>
                <h2 className="text-4xl font-medium text-slate-800 leading-tight">GRACIAS POR TU PAGO</h2>
                <p className="mt-4 text-lg font-medium text-emerald-700">TODOS SOMOS SAN JUAN</p>
                <p className="mt-6 text-sm text-slate-500 max-w-md leading-relaxed">El pago de tu infracción fue validado correctamente en el sistema digital.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 relative bg-slate-100">
                  {!iframeCargado && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                      <Loader2 size={32} className="animate-spin text-primary" strokeWidth={1.5} />
                      <p className="text-sm text-slate-500">Cargando plataforma de pago...</p>
                    </div>
                  )}
                  <iframe
                    src={urlPago}
                    onLoad={() => setIframeCargado(true)}
                    className="w-full h-full border-0"
                    title="Plataforma de pago"
                    allow="payment"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
                  />
                </div>
                <div className="border-t border-slate-200 p-4 flex items-center justify-between gap-2 bg-white shrink-0">
                  <p className="text-xs text-slate-400 hidden sm:block">
                    Completa el formulario y presiona Verificar pago
                  </p>
                  <div className="flex items-center gap-3">
                    <button onClick={forzarPago} disabled={loading}
                      className="text-[11px] text-slate-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                    >
                      {loading ? null : 'Forzar pago'}
                    </button>
                    <button onClick={verificarPago} disabled={loading}
                      className="h-11 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium flex items-center gap-2 active:scale-[0.99]"
                    >
                      {loading ? <><Loader2 size={18} className="animate-spin" /> Verificando...</>
                      : <><CheckCircle2 size={18} /> Verificar pago</>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {modalAbiertaAntes && !pagado && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-amber-600" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-amber-800">¿Ya realizaste el pago? Verifica el estatus aquí.</p>
          </div>
          <button onClick={verificarPago} disabled={loading}
            className="h-10 px-5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-medium flex items-center gap-2 shrink-0 active:scale-[0.99] transition-colors"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Verificando...</>
            : <><CheckCircle2 size={16} /> Verificar pago</>}
          </button>
        </div>
      )}
    </div>
  );
}
