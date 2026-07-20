'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Loader2, X, Keyboard, CheckCircle2 } from 'lucide-react';
import { useReconocimientoVoz } from '../hooks/useReconocimientoVoz';
import { EspectroVoz } from './EspectroVoz';
import { extraerCapturaDeNarrativaAction } from '../actions';
import { PREGUNTAS_GUIADAS } from '../constants/preguntasGuiadas';
import type { DatosExtraidosDeNarrativa } from '../service';

const normalizarPlacaLocal = (valor: string) => valor.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

interface DictadoGuiadoInfraccionProps {
    onCompletado: (datos: DatosExtraidosDeNarrativa) => void;
    onCancelar: () => void;
}

type FaseTurno = 'idle' | 'escuchando' | 'procesando';

/** Tope de reintentos por pregunta (1 intento original + 1 reintento) antes de seguir sin ese dato. */
const MAX_INTENTOS = 2;

const datosVacios = (parcial: Partial<DatosExtraidosDeNarrativa>): DatosExtraidosDeNarrativa => ({
    ciudadanoPresente: parcial.ciudadanoPresente ?? null,
    esCiudadanoTitular: parcial.esCiudadanoTitular ?? null,
    resultadosMotivo: parcial.resultadosMotivo ?? [],
    narrativaSugerida: parcial.narrativaSugerida ?? '',
    marca: parcial.marca ?? null,
    modelo: parcial.modelo ?? null,
    anio: parcial.anio ?? null,
    color: parcial.color ?? null,
    tipoVehiculo: parcial.tipoVehiculo ?? null,
    servicio: parcial.servicio ?? null,
    estadoOrigen: parcial.estadoOrigen ?? null,
    placa: parcial.placa ?? null,
    placaRequiereConfirmacion: !parcial.placa,
    placaCandidata: parcial.placaCandidata ?? null,
    nombreInfractor: parcial.nombreInfractor ?? null,
    apPaternoInfractor: parcial.apPaternoInfractor ?? null,
    apMaternoInfractor: parcial.apMaternoInfractor ?? null,
    garantiaSeleccionada: parcial.garantiaSeleccionada ?? null,
    motivoRetencionVehiculo: parcial.motivoRetencionVehiculo ?? null,
});

const tieneValor = (valor: unknown) => valor !== null && valor !== undefined && valor !== '';

/**
 * Captura por voz en modo preguntas: una pregunta a la vez, con espectro de
 * audio reactivo. Reusa extraerCapturaDeNarrativaAction (el mismo análisis del
 * dictado libre) por cada respuesta. Para preguntas compuestas (ej. presencia +
 * titularidad) solo vuelve a preguntar por lo que realmente falta, no la
 * pregunta completa — hasta 2 intentos por pregunta antes de seguir sin ese
 * dato. Al terminar entrega un DatosExtraidosDeNarrativa igual al del dictado
 * libre, para reusar la misma pantalla de revisión.
 */
export const DictadoGuiadoInfraccion: React.FC<DictadoGuiadoInfraccionProps> = ({
    onCompletado,
    onCancelar,
}) => {
    const { escuchando, transcripcion, interim, error, iniciar, detener, reiniciar } = useReconocimientoVoz();

    const [indice, setIndice] = useState(0);
    const [intentos, setIntentos] = useState(0);
    const [faseTurno, setFaseTurno] = useState<FaseTurno>('idle');
    const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);
    const [preguntaSeguimiento, setPreguntaSeguimiento] = useState<string | null>(null);
    const [acumulado, setAcumulado] = useState<Partial<DatosExtraidosDeNarrativa>>({});
    const [capturaManualPlaca, setCapturaManualPlaca] = useState(false);
    const [placaManual, setPlacaManual] = useState('');
    const [placaCandidata, setPlacaCandidata] = useState<string | null>(null);
    const [placaConfirmadaVisible, setPlacaConfirmadaVisible] = useState(false);

    const acumuladoRef = useRef<Partial<DatosExtraidosDeNarrativa>>({});
    const respuestaPlacaRef = useRef<string | null>(null);
    const transcripcionRef = useRef('');
    transcripcionRef.current = transcripcion;

    const preguntas = PREGUNTAS_GUIADAS.filter((p) => !p.aplica || p.aplica(acumulado));
    const preguntaActual = preguntas[indice];

    const actualizarAcumulado = (parcial: Partial<DatosExtraidosDeNarrativa>) => {
        acumuladoRef.current = { ...acumuladoRef.current, ...parcial };
        setAcumulado(acumuladoRef.current);
    };

    /** Cambia a otra pregunta del flujo, limpiando el input y el estado del turno anterior. */
    const irAPregunta = (nuevoIndice: number) => {
        reiniciar();
        setIntentos(0);
        setPreguntaSeguimiento(null);
        setCapturaManualPlaca(false);
        setPlacaManual('');
        setPlacaCandidata(null);
        setPlacaConfirmadaVisible(false);
        setFaseTurno('idle');
        setIndice(nuevoIndice);
    };

    const avanzarPregunta = () => irAPregunta(indice + 1);

    /** No hay nada que verificar (voz no captó nada) — se ofrece captura manual directa. */
    const activarCapturaManualPlaca = (mensaje: string) => {
        reiniciar();
        setMensajeEstado(mensaje);
        setPlacaManual('');
        setCapturaManualPlaca(true);
        setFaseTurno('idle');
    };

    const guardarPlacaManual = () => {
        const limpia = normalizarPlacaLocal(placaManual);
        if (limpia) actualizarAcumulado({ placa: limpia });
        avanzarPregunta();
    };

    /** Las dos menciones no coincidieron, pero hay un candidato legible — se le pregunta directo al oficial en vez de reintentar a ciegas por voz. */
    const pedirVerificacionPlaca = (candidata: string) => {
        reiniciar();
        setMensajeEstado(null);
        setPlacaCandidata(candidata);
        setFaseTurno('idle');
    };

    const confirmarPlacaCandidata = () => {
        if (!placaCandidata) return;
        actualizarAcumulado({ placa: placaCandidata });
        setPlacaCandidata(null);
        setPlacaConfirmadaVisible(true);
        setTimeout(() => avanzarPregunta(), 900);
    };

    const rechazarPlacaCandidata = () => {
        setPlacaCandidata(null);
        activarCapturaManualPlaca('Captura la placa manualmente:');
    };

    const volverAIntentar = (mensajeEspecifico?: string) => {
        const siguiente = intentos + 1;
        if (siguiente >= MAX_INTENTOS) {
            if (preguntaActual.id === 'placa' || preguntaActual.id === 'placaConfirmacion') {
                activarCapturaManualPlaca('No se pudo capturar la placa por voz. Captúrala manualmente:');
            } else {
                avanzarPregunta();
            }
        } else {
            reiniciar();
            setIntentos(siguiente);
            setPreguntaSeguimiento(mensajeEspecifico ?? preguntaActual.reintentoGenerico);
            setFaseTurno('idle');
        }
    };

    /** Fusiona lo que vino de la respuesta y decide si la pregunta ya quedó satisfecha o falta algo puntual. */
    const procesarCampos = (datos: DatosExtraidosDeNarrativa) => {
        const pregunta = preguntaActual;
        const campos = pregunta.campos ?? [];
        const parcial: Record<string, unknown> = {};
        for (const { campo } of campos) {
            const valor = (datos as unknown as Record<string, unknown>)[campo];
            if (tieneValor(valor)) parcial[campo] = valor;
        }
        // Los campos opcionales se guardan si vienen, pero nunca cuentan para "qué falta".
        for (const { campo } of pregunta.camposOpcionales ?? []) {
            const valor = (datos as unknown as Record<string, unknown>)[campo];
            if (tieneValor(valor)) parcial[campo] = valor;
        }
        if (Object.keys(parcial).length > 0) actualizarAcumulado(parcial);

        const acumuladoActualizado = { ...acumuladoRef.current, ...parcial };
        const faltantes = campos.filter(({ campo }) => !tieneValor((acumuladoActualizado as Record<string, unknown>)[campo]));
        const huboAlgunaRespuesta = Object.keys(parcial).length > 0;
        const completo = pregunta.requiereTodosLosCampos ? faltantes.length === 0 : huboAlgunaRespuesta;

        if (completo) {
            avanzarPregunta();
        } else if (pregunta.opcional) {
            avanzarPregunta();
        } else if (faltantes.length > 0 && faltantes.length < campos.length) {
            // Se entendió parte de la respuesta — solo se pregunta específicamente lo que falta.
            const etiquetas = faltantes.map((f) => f.etiqueta).join(' y ');
            volverAIntentar(`Solo me falta que me digas ${etiquetas}.`);
        } else {
            volverAIntentar();
        }
    };

    const procesarRespuesta = async () => {
        const pregunta = preguntaActual;
        if (!pregunta) return;
        setFaseTurno('procesando');
        const texto = transcripcionRef.current.trim();

        if (pregunta.id === 'placa') {
            if (!texto) {
                volverAIntentar();
                return;
            }
            respuestaPlacaRef.current = texto;
            avanzarPregunta();
            return;
        }

        if (pregunta.id === 'placaConfirmacion') {
            if (!texto || !respuestaPlacaRef.current) {
                volverAIntentar();
                return;
            }
            const combinado = `La placa es ${respuestaPlacaRef.current}. Confirmo placa ${texto}.`;
            const res = await extraerCapturaDeNarrativaAction(combinado);
            respuestaPlacaRef.current = null;
            if (res.success && res.datos.placa) {
                actualizarAcumulado({ placa: res.datos.placa });
                avanzarPregunta();
                return;
            }
            // No coincidieron — en vez de reintentar por voz a ciegas otra vez,
            // se verifica con el oficial el mejor candidato que se entendió.
            const candidata = res.success ? res.datos.placaCandidata : null;
            if (candidata) {
                pedirVerificacionPlaca(candidata);
            } else {
                activarCapturaManualPlaca('No logramos identificar la placa por voz. Captúrala manualmente:');
            }
            return;
        }

        if (!texto) {
            if (pregunta.opcional) {
                avanzarPregunta();
                return;
            }
            volverAIntentar();
            return;
        }

        const res = await extraerCapturaDeNarrativaAction(texto);
        const datos = res.success ? res.datos : null;

        if (!datos) {
            if (pregunta.opcional) {
                avanzarPregunta();
                return;
            }
            volverAIntentar();
            return;
        }

        if (pregunta.campos) {
            procesarCampos(datos);
            return;
        }

        const satisfecho = pregunta.evaluarSatisfecho?.(datos) ?? false;
        if (satisfecho) {
            if (pregunta.id === 'motivo') {
                actualizarAcumulado({ resultadosMotivo: datos.resultadosMotivo, narrativaSugerida: datos.narrativaSugerida });
            }
            avanzarPregunta();
        } else if (pregunta.opcional) {
            avanzarPregunta();
        } else {
            volverAIntentar();
        }
    };

    useEffect(() => {
        if (faseTurno === 'escuchando' && !escuchando) {
            procesarRespuesta();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [escuchando]);

    useEffect(() => {
        if (indice > 0 && !preguntaActual) {
            onCompletado(datosVacios(acumuladoRef.current));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [indice]);

    useEffect(() => () => detener(), [detener]);

    const comenzarRespuesta = () => {
        reiniciar();
        setMensajeEstado(null);
        setFaseTurno('escuchando');
        iniciar({ continuous: false });
    };

    if (!preguntaActual) {
        return (
            <div className="max-w-md mx-auto w-full px-4 py-16 flex flex-col items-center text-center gap-4">
                <Loader2 size={28} className="text-primary animate-spin" />
                <p className="text-sm text-slate-600">Preparando el resumen...</p>
            </div>
        );
    }

    const numeroPregunta = indice + 1;
    const totalPreguntas = preguntas.length;
    const textoPregunta = preguntaSeguimiento ?? preguntaActual.texto;

    return (
        <div className="max-w-md mx-auto w-full px-4 py-8 flex flex-col items-center gap-6">
            <div className="w-full flex justify-end">
                <button
                    type="button"
                    onClick={onCancelar}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Cancelar modo guiado"
                >
                    <X size={16} />
                </button>
            </div>

            <EspectroVoz activo={faseTurno === 'escuchando'} />

            <div className="text-center space-y-1.5 min-h-[4lh] flex flex-col justify-center">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Pregunta {numeroPregunta} de {totalPreguntas} preguntas
                </p>
                <p className="text-base font-semibold text-slate-900 leading-snug">{textoPregunta}</p>
                {preguntaActual.opcional && faseTurno === 'idle' && (
                    <p className="text-xs text-slate-400">Opcional — puedes omitirla si no aplica</p>
                )}
            </div>

            {mensajeEstado && <p className="text-xs text-amber-600 text-center">{mensajeEstado}</p>}

            {placaConfirmadaVisible ? (
                <div className="w-full flex flex-col items-center gap-2 py-4">
                    <CheckCircle2 size={32} className="text-green-500" />
                    <p className="text-sm font-semibold text-green-600 tracking-wide">PLACA CONFIRMADA</p>
                </div>
            ) : placaCandidata ? (
                <div className="w-full flex flex-col items-center gap-4">
                    <div className="text-center space-y-1">
                        <p className="text-sm text-slate-600">¿Esta es tu placa?</p>
                        <p className="text-2xl font-bold tracking-widest text-slate-900">{placaCandidata}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={confirmarPlacaCandidata}
                            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98]"
                        >
                            Sí
                        </button>
                        <button
                            type="button"
                            onClick={rechazarPlacaCandidata}
                            className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl transition-all active:scale-[0.98]"
                        >
                            No
                        </button>
                    </div>
                </div>
            ) : capturaManualPlaca ? (
                <div className="w-full flex flex-col items-center gap-3">
                    <input
                        value={placaManual}
                        onChange={(e) => setPlacaManual(e.target.value.toUpperCase())}
                        placeholder="Escribe la placa"
                        autoFocus
                        className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3 text-center text-lg font-semibold tracking-widest text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={guardarPlacaManual}
                            disabled={!placaManual.trim()}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <Keyboard size={16} />
                            Guardar y continuar
                        </button>
                        <button
                            type="button"
                            onClick={avanzarPregunta}
                            className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Dejar en blanco
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-4 min-h-[64px] text-left">
                        {faseTurno === 'procesando' ? (
                            <p className="text-sm text-slate-400 italic flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin" /> Analizando tu respuesta...
                            </p>
                        ) : transcripcion || interim ? (
                            <p className="text-sm text-slate-800 leading-relaxed">
                                {transcripcion} <span className="text-slate-400">{interim}</span>
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Tu respuesta aparecerá aquí…</p>
                        )}
                    </div>

                    {error && <p className="text-xs text-red-600">{error}</p>}

                    <div className="flex items-center gap-3">
                        {faseTurno !== 'escuchando' ? (
                            <button
                                type="button"
                                onClick={comenzarRespuesta}
                                disabled={faseTurno === 'procesando'}
                                className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                <Mic size={16} />
                                Toca para responder
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={detener}
                                className="inline-flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98]"
                            >
                                <MicOff size={16} />
                                Listo, ya terminé
                            </button>
                        )}
                        {preguntaActual.opcional && faseTurno === 'idle' && (
                            <button
                                type="button"
                                onClick={avanzarPregunta}
                                className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                Omitir
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DictadoGuiadoInfraccion;
