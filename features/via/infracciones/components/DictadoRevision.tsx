'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, RotateCcw, CheckCircle2, AlertTriangle, RotateCw, Loader2 } from 'lucide-react';
import { useInfraccionStore } from '@/stores/useInfraccionStore';
import { ResultadoBusquedaMotivo } from '@/features/via/legalidad/types';
import { ResultadoMotivoCard } from './ui/ResultadoMotivoCard';
import { Card } from './ui/Card';
import { CardTitle } from './ui/CardTitle';
import { inputBase, inputError, selectBase, selectError } from './ui/inputStyles';
import PasoCiudadano from './steps/PasoCiudadano';
import PasoVehiculo from './steps/PasoVehiculo';
import PasoConductor from './steps/PasoConductor';
import { SeccionGarantia } from './steps/SeccionGarantia';
import { generarNarrativaAction } from '../actions';

import type { DatosExtraidosDeNarrativa } from '../service';

export type { DatosExtraidosDeNarrativa };

interface DictadoRevisionProps {
    datosExtraidos: DatosExtraidosDeNarrativa;
    onDictarDeNuevo: () => void;
    onConfirmar: () => void;
}

/** Señala si una sección se prellenó desde el dictado o quedó pendiente de captura manual. */
const IndicadorDictado: React.FC<{ detectado: boolean; etiqueta: string }> = ({ detectado, etiqueta }) => (
    <p className={`flex items-center gap-1.5 text-xs ${detectado ? 'text-primary' : 'text-amber-600'}`}>
        {detectado ? <CheckCircle2 size={12} className="shrink-0" /> : <AlertTriangle size={12} className="shrink-0" />}
        {detectado ? `Detectado por voz — revisa y corrige si hace falta` : `No se detectó ${etiqueta} en el dictado — captúralo manualmente`}
    </p>
);

export const DictadoRevision: React.FC<DictadoRevisionProps> = ({
    datosExtraidos,
    onDictarDeNuevo,
    onConfirmar,
}) => {
    const datos = useInfraccionStore((s) => s.datos);
    const actualizarDatos = useInfraccionStore((s) => s.actualizarDatos);
    const yaPrellenado = useRef(false);
    const yaGeneroNarrativa = useRef(false);
    const [generandoNarrativa, setGenerandoNarrativa] = useState(false);

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

        const vehiculo = {
            ...(datosExtraidos.marca ? { marca: datosExtraidos.marca } : {}),
            ...(datosExtraidos.modelo ? { modelo: datosExtraidos.modelo } : {}),
            ...(datosExtraidos.anio ? { anio: datosExtraidos.anio } : {}),
            ...(datosExtraidos.color ? { color: datosExtraidos.color } : {}),
            ...(datosExtraidos.tipoVehiculo ? { tipoVehiculo: datosExtraidos.tipoVehiculo } : {}),
            ...(datosExtraidos.servicio ? { servicio: datosExtraidos.servicio } : {}),
            ...(datosExtraidos.estadoOrigen ? { estadoOrigen: datosExtraidos.estadoOrigen } : {}),
            ...(datosExtraidos.placa ? { placa: datosExtraidos.placa } : {}),
        };
        if (Object.keys(vehiculo).length > 0) actualizarDatos(vehiculo);

        const infractor = {
            ...(datosExtraidos.nombreInfractor ? { nombreInfractor: datosExtraidos.nombreInfractor } : {}),
            ...(datosExtraidos.apPaternoInfractor ? { apPaternoInfractor: datosExtraidos.apPaternoInfractor } : {}),
            ...(datosExtraidos.apMaternoInfractor ? { apMaternoInfractor: datosExtraidos.apMaternoInfractor } : {}),
        };
        if (Object.keys(infractor).length > 0) actualizarDatos(infractor);

        if (datosExtraidos.garantiaSeleccionada) {
            actualizarDatos({
                garantiaSeleccionada: datosExtraidos.garantiaSeleccionada,
                ...(datosExtraidos.motivoRetencionVehiculo
                    ? { motivoRetencionVehiculo: datosExtraidos.motivoRetencionVehiculo }
                    : {}),
            });
        }
        // Solo se ejecuta una vez, al recibir la extracción del dictado.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Redacta la narrativa completa con IA a partir de TODO lo ya capturado
     * (vehículo, placa, fundamento legal) — mismo mecanismo que ya usa
     * PasoConfirmacion.tsx al final del wizard, reusado aquí para no esperar
     * hasta el último paso. Reemplaza el texto crudo del motivo por un párrafo
     * redactado; el oficial puede editarlo o volver a generarlo.
     */
    const generarNarrativaCompleta = () => {
        setGenerandoNarrativa(true);
        generarNarrativaAction({
            motivoDetectado: datos.fraccionDescripcion,
            articuloNumero: datos.articuloNumero,
            articuloDescripcion: datos.articuloDescripcion,
            fraccionNumero: datos.fraccionNumero,
            fraccionDescripcion: datos.fraccionDescripcion,
            marca: datos.marca,
            modelo: datos.modelo,
            color: datos.color,
            placa: datos.placa,
            anio: datos.anio,
            calle: datos.calle,
            numero: datos.numero,
            colonia: datos.colonia,
            municipio: datos.municipio,
            estado: datos.estado,
        })
            .then((res) => {
                if (res.success && res.narrativa) {
                    actualizarDatos({ narrativaHechos: res.narrativa });
                }
            })
            .finally(() => setGenerandoNarrativa(false));
    };

    // Se dispara una sola vez, apenas el prellenado ya escribió suficientes
    // datos en el store (marca/fundamento legal) — no antes, para no redactar
    // con información a medias.
    useEffect(() => {
        if (yaGeneroNarrativa.current) return;
        const hayDatosMinimos = Boolean(datos.fraccionId || datos.articuloId || datos.marca || datos.modelo);
        if (!hayDatosMinimos) return;
        yaGeneroNarrativa.current = true;
        generarNarrativaCompleta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datos]);

    const vehiculoDetectado = Boolean(
        datosExtraidos.marca || datosExtraidos.modelo || datosExtraidos.color ||
        datosExtraidos.tipoVehiculo || datosExtraidos.estadoOrigen,
    );
    const infractorDetectado = Boolean(
        datosExtraidos.nombreInfractor || datosExtraidos.apPaternoInfractor || datosExtraidos.apMaternoInfractor,
    );
    const placaEstado: 'confirmada' | 'sin_confirmar' | undefined = datosExtraidos.placa
        ? 'confirmada'
        : datosExtraidos.placaRequiereConfirmacion
            ? 'sin_confirmar'
            : undefined;

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
                    necesites antes de continuar con las evidencias.
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

            <div className="space-y-1.5">
                <IndicadorDictado detectado={vehiculoDetectado} etiqueta="el vehículo" />
                <PasoVehiculo
                    loading={false}
                    boolError={() => false}
                    fieldError={() => false}
                    inputBase={inputBase}
                    inputError={inputError}
                    placaEstado={placaEstado}
                />
            </div>

            {datos.estaCiudadanoPresente && (
                <div className="space-y-1.5">
                    <IndicadorDictado detectado={infractorDetectado} etiqueta="el nombre del conductor" />
                    <PasoConductor
                        loading={false}
                        boolError={() => false}
                        fieldError={() => false}
                        inputBase={inputBase}
                        inputError={inputError}
                    />
                </div>
            )}

            <SeccionGarantia
                loading={false}
                fieldError={() => false}
                selectBase={selectBase}
                selectError={selectError}
            />

            <Card>
                <div className="flex items-center justify-between mb-2">
                    <CardTitle>Narrativa de hechos</CardTitle>
                    <button
                        type="button"
                        onClick={generarNarrativaCompleta}
                        disabled={generandoNarrativa}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-primary hover:bg-primary-muted font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {generandoNarrativa ? <Loader2 size={13} className="animate-spin" /> : <RotateCw size={13} />}
                        {datos.narrativaHechos ? 'Regenerar con IA' : 'Generar con IA'}
                    </button>
                </div>
                <textarea
                    value={datos.narrativaHechos}
                    onChange={(e) => actualizarDatos({ narrativaHechos: e.target.value })}
                    disabled={generandoNarrativa}
                    rows={4}
                    placeholder={generandoNarrativa ? 'Redactando narrativa con IA...' : 'Describe brevemente lo ocurrido (opcional)'}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-slate-50 disabled:text-slate-400 resize-none"
                />
                <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                    Generada por IA a partir de lo ya capturado — revisa y edita antes de continuar.
                </p>
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
