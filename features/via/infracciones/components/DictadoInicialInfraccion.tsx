'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Loader2, Sparkles, ListChecks, AlertCircle, AudioLines, BadgeCheck } from 'lucide-react';
import { useReconocimientoVoz } from '../hooks/useReconocimientoVoz';
import { extraerCapturaDeNarrativaAction } from '../actions';
import { DictadoRevision, type DatosExtraidosDeNarrativa } from './DictadoRevision';
import { DictadoGuiadoInfraccion } from './DictadoGuiadoInfraccion';

type Fase = 'eligiendo' | 'dictando' | 'guiado' | 'analizando' | 'revisando';
type ModoOrigen = 'libre' | 'guiado';

interface DictadoInicialInfraccionProps {
    onOmitir: () => void;
    onListoParaContinuar: () => void;
}

/** Resalta una palabra clave del ejemplo — la frase exacta que ayuda al sistema a capturar ese dato. */
const Clave: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <strong className="font-semibold text-primary">{children}</strong>
);

export const DictadoInicialInfraccion: React.FC<DictadoInicialInfraccionProps> = ({
    onOmitir,
    onListoParaContinuar,
}) => {
    const [fase, setFase] = useState<Fase>('eligiendo');
    const [modoOrigen, setModoOrigen] = useState<ModoOrigen>('libre');
    const { soportado, escuchando, transcripcion, interim, error, iniciar, detener, reiniciar } =
        useReconocimientoVoz();
    const [datosExtraidos, setDatosExtraidos] = useState<DatosExtraidosDeNarrativa | null>(null);
    const [mostrarGuia, setMostrarGuia] = useState(false);
    const [mostrarEjemplo, setMostrarEjemplo] = useState(false);

    // Entrar a la pantalla de dictado NO enciende el micrófono — solo lo prepara.
    // El micrófono arranca únicamente cuando el oficial toca el botón, de forma explícita.
    const irAPantallaDeDictado = () => {
        reiniciar();
        setModoOrigen('libre');
        setFase('dictando');
    };

    const irAModoGuiado = () => {
        setModoOrigen('guiado');
        setFase('guiado');
    };

    const comenzarEscucha = () => {
        iniciar({ continuous: true });
    };

    const detenerYAnalizar = async () => {
        detener();
        setFase('analizando');
        const res = await extraerCapturaDeNarrativaAction(transcripcion);
        setDatosExtraidos(
            res.success
                ? res.datos
                : {
                    ciudadanoPresente: null,
                    esCiudadanoTitular: null,
                    resultadosMotivo: [],
                    narrativaSugerida: transcripcion,
                    marca: null,
                    modelo: null,
                    anio: null,
                    color: null,
                    tipoVehiculo: null,
                    servicio: null,
                    estadoOrigen: null,
                    placa: null,
                    placaRequiereConfirmacion: false,
                    placaCandidata: null,
                    nombreInfractor: null,
                    apPaternoInfractor: null,
                    apMaternoInfractor: null,
                    garantiaSeleccionada: null,
                    motivoRetencionVehiculo: null,
                },
        );
        setFase('revisando');
    };

    if (fase === 'eligiendo') {
        const cards = [
            {
                icon: Mic,
                titulo: 'Dictar todo',
                descripcion: 'Habla libremente y el sistema transcribe toda la boleta de una sola vez.',
                tags: ['Potenciado con IA'],
                action: soportado ? irAPantallaDeDictado : undefined,
                disabled: !soportado,
            },
            {
                icon: AudioLines,
                titulo: 'Modo guiado',
                descripcion: 'Responde preguntas una por una para capturar la infracción sin esfuerzo.',
                tags: ['Potenciado con IA', 'Recomendado'],
                action: soportado ? irAModoGuiado : undefined,
                disabled: !soportado,
                recomendado: true,
            },
            {
                icon: ListChecks,
                titulo: 'Paso a paso',
                descripcion: 'Captura cada campo manualmente en el formulario tradicional.',
                tags: [],
                action: onOmitir,
                disabled: false,
            },
        ] as const;

        return (
            <div className="w-full max-w-5xl mx-auto px-4 py-12 flex flex-col items-center gap-8">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold text-slate-900">¿Cómo quieres capturar esta infracción?</h2>
                    <p className="text-sm text-slate-500">Elige el modo que más te acomode — todos llegan al mismo resultado.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {cards.map((card) => {
                        const Icon = card.icon;
                        const esRecomendado = 'recomendado' in card && card.recomendado;

                        return (
                            <button
                                key={card.titulo}
                                type="button"
                                onClick={card.action}
                                disabled={card.disabled}
                                className={`
                                    group relative flex flex-col items-start text-left gap-4
                                    w-full rounded-2xl border-2 p-6 transition-all duration-200
                                    ${esRecomendado
                                        ? 'border-amber-300 bg-amber-50/60 hover:bg-amber-50 hover:shadow-md hover:border-amber-400'
                                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:shadow-sm hover:border-slate-300'
                                    }
                                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
                                `}
                            >
                                {esRecomendado && (
                                    <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-amber-200/80 px-3 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-300/60 shadow-sm">
                                        <BadgeCheck size={12} />
                                        Recomendado
                                    </span>
                                )}

                                <div className={`
                                    flex items-center justify-center rounded-2xl shrink-0
                                    ${esRecomendado
                                        ? 'w-14 h-14 bg-amber-100 text-amber-700 group-hover:bg-amber-200/70'
                                        : 'w-14 h-14 bg-primary-muted text-primary group-hover:bg-primary/10'
                                    }
                                    transition-colors duration-200
                                `}>
                                    <Icon size={28} strokeWidth={1.5} />
                                </div>

                                <div className="space-y-1.5 min-w-0">
                                    <h3 className="text-base font-semibold text-slate-900">{card.titulo}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{card.descripcion}</p>
                                </div>

                                {card.tags.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5 -mb-1">
                                        {card.tags.filter(t => t !== 'Recomendado').map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sky-100 text-sky-700"
                                            >
                                                <Sparkles size={11} strokeWidth={1.5} />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {card.disabled && (
                                    <p className="text-xs text-slate-400">Tu navegador no soporta dictado por voz</p>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (fase === 'dictando') {
        return (
            <div className="w-full max-w-2xl mx-auto px-4 py-10 relative">
                {/* ════════════════════════════════════════
                   ICONOS DE AYUDA — Superior derecha
                   ════════════════════════════════════════ */}
                <div className="absolute top-6 right-4 flex items-start gap-1.5 z-20">
                    {/* Guía — popover se extiende a la izquierda */}
                    <div className="relative flex items-start">
                        <button
                            type="button"
                            onClick={() => { setMostrarEjemplo(false); setMostrarGuia(v => !v); }}
                            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/40 hover:bg-primary-muted shadow-sm transition-all"
                            title="Ver guía de dictado"
                        >
                            <Sparkles size={15} strokeWidth={1.5} />
                        </button>
                        {mostrarGuia && (
                            <GuiaPopover
                                onCerrar={() => setMostrarGuia(false)}
                            />
                        )}
                    </div>

                    {/* Ejemplo — popover se extiende a la izquierda */}
                    <div className="relative flex items-start">
                        <button
                            type="button"
                            onClick={() => { setMostrarGuia(false); setMostrarEjemplo(v => !v); }}
                            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/40 hover:bg-primary-muted shadow-sm transition-all"
                            title="Ver ejemplo de dictado"
                        >
                            <AudioLines size={15} strokeWidth={1.5} />
                        </button>
                        {mostrarEjemplo && (
                            <EjemploPopover
                                onCerrar={() => setMostrarEjemplo(false)}
                            />
                        )}
                    </div>

                    {/* Cancelar */}
                    <button
                        type="button"
                        onClick={() => { detener(); setFase('eligiendo'); }}
                        className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 shadow-sm transition-all ml-2"
                        title="Cancelar y volver"
                    >
                        <span className="text-base leading-none">&times;</span>
                    </button>
                </div>

                {/* ════════════════════════════════════════
                   CONTENIDO CENTRAL — Micrófono + Transcripción
                   ════════════════════════════════════════ */}
                <div className="flex flex-col items-center gap-8 pt-4">
                    {/* Micrófono */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative flex items-center justify-center h-32 w-32">
                            {escuchando && (
                                <>
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/40 to-red-500/20 animate-ping" />
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/20 to-red-500/10 animate-pulse" />
                                    <span className="absolute inset-4 rounded-full bg-gradient-to-r from-red-400/15 to-transparent blur-sm" />
                                    <span className="absolute -bottom-5 flex items-end gap-[3px] h-4">
                                        {[1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((h, i) => (
                                            <span
                                                key={i}
                                                className="w-[3px] rounded-full bg-red-400/70 animate-wave"
                                                style={{
                                                    height: `${Math.max(4, h * 3)}px`,
                                                    animationDelay: `${i * 0.08}s`,
                                                    animationDuration: '0.6s',
                                                }}
                                            />
                                        ))}
                                    </span>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={escuchando ? detenerYAnalizar : comenzarEscucha}
                                aria-pressed={escuchando}
                                className={`
                                    relative z-10 rounded-full flex items-center justify-center
                                    shadow-xl transition-all duration-300 active:scale-90
                                    ${escuchando
                                        ? 'w-28 h-28 bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/30 hover:shadow-red-500/40'
                                        : 'w-28 h-28 bg-gradient-to-br from-primary to-blue-600 text-white shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5'
                                    }
                                `}
                            >
                                {escuchando ? <MicOff size={36} strokeWidth={1.5} /> : <Mic size={36} strokeWidth={1.5} />}
                            </button>
                        </div>
                        <p className={`text-sm font-semibold text-center tracking-wide ${escuchando ? 'text-red-600' : 'text-slate-600'}`}>
                            {escuchando
                                ? 'Escuchando… toca para detener y analizar'
                                : 'Toca el micrófono para empezar a dictar'}
                        </p>
                    </div>

                    {/* Transcripción */}
                    <div className="w-full rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-5 min-h-[120px] text-left">
                        {transcripcion || interim ? (
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    Transcripción en vivo
                                </p>
                                <p className="text-sm text-slate-800 leading-relaxed">
                                    {transcripcion}
                                    {interim && (
                                        <span className="text-slate-400 italic"> {interim}</span>
                                    )}
                                    {escuchando && (
                                        <span className="inline-block w-1.5 h-4 bg-primary rounded-full ml-0.5 animate-blink" />
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-[72px] text-center gap-1.5">
                                <Mic size={20} className="text-slate-300" strokeWidth={1.5} />
                                <p className="text-sm text-slate-400">La transcripción aparecerá aquí mientras hablas…</p>
                            </div>
                        )}
                    </div>

                    {/* Botón detener */}
                    {escuchando && (
                        <button
                            type="button"
                            onClick={detenerYAnalizar}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold rounded-xl border border-red-200 transition-all active:scale-95"
                        >
                            <MicOff size={16} />
                            Detener y analizar
                        </button>
                    )}

                    {error && (
                        <div className="w-full flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-700">Error de micrófono</p>
                                <p className="text-xs text-red-600 mt-0.5">{error}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (fase === 'guiado') {
        return (
            <DictadoGuiadoInfraccion
                onCompletado={(datos) => {
                    setDatosExtraidos(datos);
                    setFase('revisando');
                }}
                onCancelar={() => setFase('eligiendo')}
            />
        );
    }

    if (fase === 'analizando') {
        return (
            <div className="max-w-md mx-auto w-full px-4 py-16 flex flex-col items-center text-center gap-4">
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
                    if (modoOrigen === 'guiado') {
                        setFase('guiado');
                    } else {
                        irAPantallaDeDictado();
                    }
                }}
                onConfirmar={onListoParaContinuar}
            />
        );
    }

    return null;
};

/* ═══════════════════════════════════════════════
   POPOVER CON TEMPORIZADOR — Guía y Ejemplo
   ═══════════════════════════════════════════════ */

const DURACION_POPOVER = 10;

function useTemporizadorPopover(onCerrar: () => void) {
    const [segundos, setSegundos] = useState(DURACION_POPOVER);

    React.useEffect(() => {
        if (segundos <= 0) { onCerrar(); return; }
        const id = setInterval(() => setSegundos(s => s - 1), 1000);
        return () => clearInterval(id);
    }, [segundos, onCerrar]);

    return segundos;
}

const BarraTiempo: React.FC<{ segundos: number }> = ({ segundos }) => {
    const pct = (segundos / DURACION_POPOVER) * 100;
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-[10px] font-mono font-semibold text-slate-400 tabular-nums shrink-0">
                {segundos}s
            </span>
        </div>
    );
};

const GuiaPopover: React.FC<{ onCerrar: () => void }> = ({ onCerrar }) => {
    const segundos = useTemporizadorPopover(onCerrar);

    return (
        <div className="fixed right-6 top-24 w-72 z-30 rounded-2xl border border-slate-200 bg-white shadow-elevated p-4 space-y-3 animate-fadeIn">
            <BarraTiempo segundos={segundos} />
            <p className="text-[12px] font-semibold text-slate-700">Guía de dictado</p>
            <ul className="space-y-2">
                {[
                    { paso: 'Presencia del conductor y si es titular del vehículo', icon: '👤' },
                    { paso: 'Marca, modelo, color, año, tipo y servicio', icon: '🚗' },
                    { paso: 'Placa letra por letra. Ej: E M E — 1 2 3', icon: '🔤' },
                    { paso: 'Estado de procedencia del vehículo', icon: '📍' },
                    { paso: 'Motivo de la detención', icon: '⚖️' },
                    { paso: 'Nombre del conductor y garantía (opcional)', icon: '✏️' },
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px]">{item.icon}</span>
                        <span className="text-[12px] text-slate-600 leading-snug pt-0.5">{item.paso}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const EjemploPopover: React.FC<{ onCerrar: () => void }> = ({ onCerrar }) => {
    const segundos = useTemporizadorPopover(onCerrar);

    return (
        <div className="fixed right-6 top-24 w-80 z-30 rounded-2xl border border-primary/20 bg-white shadow-elevated p-4 space-y-2 animate-fadeIn">
            <BarraTiempo segundos={segundos} />
            <p className="text-[12px] font-semibold text-slate-700">Ejemplo de dictado</p>
            <div className="relative rounded-xl bg-primary-muted/60 border border-primary/15 p-3.5">
                <span className="absolute -top-1.5 left-3 text-lg text-primary/20 leading-none select-none">&ldquo;</span>
                <p className="text-[12px] text-slate-700 leading-relaxed indent-2">
                    El conductor está presente y es titular. Es un Chevrolet Corsa blanco,{' '}
                    <Clave>año</Clave> 2006, <Clave>tipo</Clave> sedán,{' '}
                    <Clave>de servicio</Clave> particular.{' '}
                    <Clave>La placa es</Clave> MNY-33-44 —{' '}
                    <Clave>confirmo placa</Clave> MNY-33-44.{' '}
                    <Clave>El estado de procedencia del vehículo es</Clave> Querétaro.{' '}
                    <Clave>El motivo fue</Clave> que se pasó el semáforo en rojo.{' '}
                    <Clave>Se retiene</Clave> la tarjeta de circulación.
                </p>
                <span className="absolute -bottom-3 right-3 text-lg text-primary/20 leading-none select-none">&rdquo;</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
                Las palabras en <span className="font-semibold text-primary">negritas</span> son clave para que el sistema capte cada dato.
            </p>
        </div>
    );
};

export default DictadoInicialInfraccion;
