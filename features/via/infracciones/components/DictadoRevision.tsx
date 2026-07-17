'use client';

import React, { useEffect, useRef } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useInfraccionStore } from '@/stores/useInfraccionStore';
import { ResultadoBusquedaMotivo } from '@/features/via/legalidad/types';
import { ResultadoMotivoCard } from './ui/ResultadoMotivoCard';
import { Card } from './ui/Card';
import { CardTitle } from './ui/CardTitle';
import PasoCiudadano from './steps/PasoCiudadano';

export interface DatosExtraidosDeNarrativa {
    ciudadanoPresente: boolean | null;
    esCiudadanoTitular: boolean | null;
    resultadosMotivo: ResultadoBusquedaMotivo[];
    narrativaSugerida: string;
}

interface DictadoRevisionProps {
    datosExtraidos: DatosExtraidosDeNarrativa;
    onDictarDeNuevo: () => void;
    onConfirmar: () => void;
}

export const DictadoRevision: React.FC<DictadoRevisionProps> = ({
    datosExtraidos,
    onDictarDeNuevo,
    onConfirmar,
}) => {
    const datos = useInfraccionStore((s) => s.datos);
    const actualizarDatos = useInfraccionStore((s) => s.actualizarDatos);
    const yaPrellenado = useRef(false);

    // Prellenar el store una sola vez con lo extraído del dictado —
    // el oficial puede corregir cualquier cosa después, aquí mismo.
    useEffect(() => {
        if (yaPrellenado.current) return;
        yaPrellenado.current = true;

        if (datosExtraidos.ciudadanoPresente !== null) {
            actualizarDatos({
                estaCiudadanoPresente: datosExtraidos.ciudadanoPresente,
                esCiudadanoTitular:
                    datosExtraidos.esCiudadanoTitular ?? (datosExtraidos.ciudadanoPresente ? true : false),
            });
        }

        const mejorMotivo = datosExtraidos.resultadosMotivo[0];
        if (mejorMotivo) {
            actualizarDatos({
                articuloId: mejorMotivo.articuloId,
                articuloNumero: mejorMotivo.articuloNumero,
                articuloDescripcion: mejorMotivo.articuloDescripcion,
                fraccionId: mejorMotivo.fraccionId,
                fraccionNumero: mejorMotivo.fraccionNumero,
                fraccionDescripcion: mejorMotivo.fraccionDescripcion,
                fraccionMonto: mejorMotivo.fraccionMonto.toString(),
                fraccionClasificacion: mejorMotivo.fraccionClasificacion,
            });
        }

        if (datosExtraidos.narrativaSugerida) {
            actualizarDatos({ narrativaHechos: datosExtraidos.narrativaSugerida });
        }
        // Solo se ejecuta una vez, al recibir la extracción del dictado.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const seleccionarMotivo = (resultado: ResultadoBusquedaMotivo) => {
        actualizarDatos({
            articuloId: resultado.articuloId,
            articuloNumero: resultado.articuloNumero,
            articuloDescripcion: resultado.articuloDescripcion,
            fraccionId: resultado.fraccionId,
            fraccionNumero: resultado.fraccionNumero,
            fraccionDescripcion: resultado.fraccionDescripcion,
            fraccionMonto: resultado.fraccionMonto.toString(),
            fraccionClasificacion: resultado.fraccionClasificacion,
        });
    };

    return (
        <div className="max-w-2xl mx-auto w-full px-0 py-4 space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-muted border border-primary/20">
                <Sparkles size={18} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed">
                    Esto es lo que entendimos de tu dictado — revisa y corrige lo que
                    necesites antes de continuar con el vehículo y las evidencias.
                </p>
            </div>

            <PasoCiudadano loading={false} boolError={() => false} />

            <Card>
                <CardTitle>Fundamento legal detectado</CardTitle>
                {datosExtraidos.resultadosMotivo.length > 0 ? (
                    <div className="space-y-2">
                        {datosExtraidos.resultadosMotivo.map((r) => (
                            <ResultadoMotivoCard
                                key={r.fraccionId}
                                resultado={r}
                                seleccionado={datos.fraccionId === r.fraccionId}
                                onClick={() => seleccionarMotivo(r)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-amber-600">
                        No se detectó un motivo claro en el dictado — podrás seleccionarlo
                        manualmente en el paso &ldquo;Infracción&rdquo;.
                    </p>
                )}
            </Card>

            <Card>
                <CardTitle>Narrativa de hechos</CardTitle>
                <textarea
                    value={datos.narrativaHechos}
                    onChange={(e) => actualizarDatos({ narrativaHechos: e.target.value })}
                    rows={4}
                    placeholder="Describe brevemente lo ocurrido (opcional)"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
                />
            </Card>

            <div className="flex items-center justify-between pt-2">
                <button
                    type="button"
                    onClick={onDictarDeNuevo}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-all"
                >
                    <RotateCcw size={14} />
                    Dictar de nuevo
                </button>
                <button
                    type="button"
                    onClick={onConfirmar}
                    className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold rounded-lg transition-all active:scale-[0.99]"
                >
                    Confirmar y continuar
                </button>
            </div>
        </div>
    );
};

export default DictadoRevision;
