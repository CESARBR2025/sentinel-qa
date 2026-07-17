'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Loader2, Sparkles, ListChecks } from 'lucide-react';
import { useReconocimientoVoz } from '../hooks/useReconocimientoVoz';
import { extraerCapturaDeNarrativaAction } from '../actions';
import { DictadoRevision, type DatosExtraidosDeNarrativa } from './DictadoRevision';

type Fase = 'eligiendo' | 'dictando' | 'analizando' | 'revisando';

interface DictadoInicialInfraccionProps {
    onOmitir: () => void;
    onListoParaContinuar: () => void;
}

export const DictadoInicialInfraccion: React.FC<DictadoInicialInfraccionProps> = ({
    onOmitir,
    onListoParaContinuar,
}) => {
    const [fase, setFase] = useState<Fase>('eligiendo');
    const { soportado, escuchando, transcripcion, interim, error, iniciar, detener, reiniciar } =
        useReconocimientoVoz();
    const [datosExtraidos, setDatosExtraidos] = useState<DatosExtraidosDeNarrativa | null>(null);

    const iniciarDictado = () => {
        reiniciar();
        setFase('dictando');
        iniciar({ continuous: true });
    };

    const detenerYAnalizar = async () => {
        detener();
        setFase('analizando');
        const res = await extraerCapturaDeNarrativaAction(transcripcion);
        setDatosExtraidos(
            res.success
                ? res.datos
                : { ciudadanoPresente: null, esCiudadanoTitular: null, resultadosMotivo: [], narrativaSugerida: transcripcion },
        );
        setFase('revisando');
    };

    if (fase === 'eligiendo' || !soportado) {
        return (
            <div className="max-w-xl mx-auto w-full px-0 py-12 flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-muted flex items-center justify-center ring-4 ring-primary/15">
                    <Sparkles size={28} className="text-primary" strokeWidth={1.5} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">¿Cómo quieres capturar esta infracción?</h2>
                    <p className="mt-1 text-sm text-slate-500 max-w-sm">
                        Puedes dictar todo de un jalón y dejar que el sistema arme la boleta,
                        o seguir el formulario paso a paso como siempre.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {soportado && (
                        <button
                            type="button"
                            onClick={iniciarDictado}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.99]"
                        >
                            <Mic size={16} />
                            Dictar todo
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onOmitir}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl transition-all"
                    >
                        <ListChecks size={16} />
                        Paso a paso
                    </button>
                </div>
                {!soportado && (
                    <p className="text-xs text-slate-400">
                        Tu navegador no soporta dictado por voz — continúa con el formulario paso a paso.
                    </p>
                )}
            </div>
        );
    }

    if (fase === 'dictando') {
        return (
            <div className="max-w-xl mx-auto w-full px-0 py-12 flex flex-col items-center text-center gap-6">
                <button
                    type="button"
                    onClick={detenerYAnalizar}
                    disabled={!escuchando}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                        escuchando ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-300 text-white'
                    }`}
                >
                    {escuchando ? <MicOff size={28} /> : <Mic size={28} />}
                </button>
                <p className="text-sm text-slate-600">
                    {escuchando ? 'Escuchando… describe la detención completa' : 'Preparando micrófono...'}
                </p>
                <p className="min-h-[3lh] text-sm text-slate-800 leading-relaxed max-w-md">
                    {transcripcion} <span className="text-slate-400">{interim}</span>
                </p>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="button"
                    onClick={detenerYAnalizar}
                    disabled={!escuchando}
                    className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                    Detener y analizar
                </button>
            </div>
        );
    }

    if (fase === 'analizando') {
        return (
            <div className="max-w-xl mx-auto w-full px-0 py-16 flex flex-col items-center text-center gap-4">
                <Loader2 size={28} className="text-primary animate-spin" />
                <p className="text-sm text-slate-600">Analizando lo que dictaste...</p>
            </div>
        );
    }

    if (fase === 'revisando' && datosExtraidos) {
        return (
            <DictadoRevision
                datosExtraidos={datosExtraidos}
                onDictarDeNuevo={() => {
                    setDatosExtraidos(null);
                    iniciarDictado();
                }}
                onConfirmar={onListoParaContinuar}
            />
        );
    }

    return null;
};

export default DictadoInicialInfraccion;
