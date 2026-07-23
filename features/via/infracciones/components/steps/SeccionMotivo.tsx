'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Mic, MicOff, RotateCcw, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { CardTitle } from '../ui/CardTitle';
import { FieldLabel } from '../ui/FieldLabel';
import { CustomSelect } from '../ui/CustomSelect';
import { useInfraccionStore } from '@/stores/useInfraccionStore';
import { obtenerFraccionesAction, buscarFraccionesPorDescripcionAction } from '@/features/via/legalidad/actions';
import { ResultadoBusquedaMotivo } from '@/features/via/legalidad/types';
import { useReconocimientoVoz } from '../../hooks/useReconocimientoVoz';
import { ResultadoMotivoCard } from '../ui/ResultadoMotivoCard';

interface Fraccion {
    id: string;
    numero: string;
    descripcion: string;
    monto_umas: number;
    clasificacion: string;
}

interface Articulo {
    id: string;
    numero: string;
    descripcion: string;
}

interface SeccionMotivoProps {
    articulos: Articulo[];
    cargandoArticulos: boolean;
    loading: boolean;
    fieldError: (val: any) => boolean;
}

export const SeccionMotivo: React.FC<SeccionMotivoProps> = ({
    articulos,
    cargandoArticulos,
    loading,
    fieldError,
}) => {
    const datos = useInfraccionStore((s) => s.datos);
    const actualizarDatos = useInfraccionStore((s) => s.actualizarDatos);

    const [fracciones, setFracciones] = useState<Fraccion[]>([]);
    const [cargandoFracciones, setCargandoFracciones] = useState(false);

    const articuloSeleccionado = articulos.find((a) => a.id === datos.articuloId);
    const fraccionSeleccionada = fracciones.find((f) => f.id === datos.fraccionId);

    // ─────────────────────────────────────────────────────────────
    // BÚSQUEDA POR VOZ - Reconocimiento de voz + búsqueda anclada al catálogo
    // ─────────────────────────────────────────────────────────────
    const { soportado, escuchando, transcripcion, error: errorVoz, iniciar, reiniciar } = useReconocimientoVoz();
    const [resultadosVoz, setResultadosVoz] = useState<ResultadoBusquedaMotivo[]>([]);
    const [buscandoMotivo, setBuscandoMotivo] = useState(false);
    const [busquedaSinResultados, setBusquedaSinResultados] = useState(false);

    useEffect(() => {
        if (!transcripcion) return;

        setBuscandoMotivo(true);
        setBusquedaSinResultados(false);
        buscarFraccionesPorDescripcionAction(transcripcion)
            .then((res) => {
                const data = res.success ? res.data : [];
                setResultadosVoz(data);
                setBusquedaSinResultados(data.length === 0);
            })
            .finally(() => setBuscandoMotivo(false));
    }, [transcripcion]);

    const seleccionarResultadoVoz = (resultado: ResultadoBusquedaMotivo) => {
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
        setFracciones([
            {
                id: resultado.fraccionId,
                numero: resultado.fraccionNumero,
                descripcion: resultado.fraccionDescripcion,
                monto_umas: resultado.fraccionMonto,
                clasificacion: resultado.fraccionClasificacion,
            },
        ]);
    };

    const reintentarVoz = () => {
        reiniciar();
        setResultadosVoz([]);
        setBusquedaSinResultados(false);
    };

    useEffect(() => {
        if (!datos.articuloId) {
            setFracciones([]);
            return;
        }

        setCargandoFracciones(true);
        obtenerFraccionesAction(datos.articuloId)
            .then((res) => {
                if (res.success) setFracciones(res.data);
            })
            .finally(() => setCargandoFracciones(false));
    }, [datos.articuloId]);

    return (
        <div className="space-y-4">
            {soportado && (
                <Card>
                    <CardTitle>Describe lo que pasó</CardTitle>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={escuchando ? undefined : () => iniciar()}
                            disabled={loading || escuchando}
                            className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                escuchando
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-primary text-white hover:bg-primary-dark active:scale-95'
                            } disabled:opacity-60`}
                        >
                            {escuchando ? <MicOff size={22} /> : <Mic size={22} />}
                        </button>

                        <div className="flex-1 min-w-0">
                            {escuchando && (
                                <p className="text-sm text-slate-600">Escuchando… habla ahora</p>
                            )}

                            {!escuchando && transcripcion && (
                                <div className="flex items-start gap-2">
                                    <p className="text-sm text-slate-800 italic">&ldquo;{transcripcion}&rdquo;</p>
                                    <button
                                        type="button"
                                        onClick={reintentarVoz}
                                        className="shrink-0 text-slate-400 hover:text-slate-600"
                                        title="Volver a intentar"
                                    >
                                        <RotateCcw size={14} />
                                    </button>
                                </div>
                            )}

                            {!escuchando && !transcripcion && !errorVoz && (
                                <p className="text-sm text-slate-500">Toca el micrófono y describe la infracción, por ejemplo: &ldquo;por exceso de velocidad y se saltó la luz roja&rdquo;.</p>
                            )}

                            {errorVoz && (
                                <p className="text-sm text-red-600">{errorVoz}</p>
                            )}

                            {buscandoMotivo && (
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                    <Loader2 size={12} className="animate-spin" /> Buscando en el reglamento...
                                </p>
                            )}

                            {busquedaSinResultados && (
                                <p className="mt-1 text-xs text-amber-600">No se encontraron coincidencias. Intenta de nuevo o usa la selección manual.</p>
                            )}
                        </div>
                    </div>

                    {resultadosVoz.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {resultadosVoz.map((r) => (
                                <ResultadoMotivoCard
                                    key={r.fraccionId}
                                    resultado={r}
                                    seleccionado={datos.fraccionId === r.fraccionId}
                                    onClick={() => seleccionarResultadoVoz(r)}
                                />
                            ))}
                        </div>
                    )}
                </Card>
            )}

        <Card>
            <CardTitle>{soportado ? 'Selección manual (respaldo)' : 'Motivo de infracción'}</CardTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative pb-5">
                    <FieldLabel required>Artículo</FieldLabel>
                    <CustomSelect
                        name="articulo"
                        value={datos.articuloId}
                        onChange={(val) => {
                            const art = articulos.find((a) => a.id === val);

                            actualizarDatos({
                                articuloId: String(val),
                                articuloNumero: art?.numero?.toString() ?? '0',
                                articuloDescripcion: art?.descripcion ?? '',
                                fraccionId: '',
                                fraccionNumero: '',
                                fraccionDescripcion: '',
                                fraccionMonto: '',
                                fraccionClasificacion: '',
                            });
                        }}
                        placeholder={cargandoArticulos ? 'Cargando artículos...' : 'Selecciona artículo'}
                        disabled={loading || cargandoArticulos}
                        error={!!fieldError(datos.articuloId)}
                        options={articulos.map((a) => ({
                            value: a.id,
                            label: `ART. ${a.numero} - ${a.descripcion}`,
                        }))}
                    />
                    <p className="absolute bottom-0 left-0 text-xs text-red-500">
                        {fieldError(datos.articuloId) ? 'Selecciona el artículo infringido' : ''}
                    </p>
                </div>

                <div className="relative pb-5">
                    <FieldLabel required>Fracción</FieldLabel>
                    <CustomSelect
                        name="fraccion"
                        value={datos.fraccionId}
                        onChange={(val) => {
                            const frac = fracciones.find((f) => f.id === val);
                            actualizarDatos({
                                fraccionId: frac?.id ?? '',
                                fraccionNumero: frac?.numero ?? '',
                                fraccionDescripcion: frac?.descripcion ?? '',
                                fraccionMonto: frac?.monto_umas?.toString() ?? '0',
                                fraccionClasificacion: frac?.clasificacion ?? '',
                            });
                        }}
                        placeholder={
                            !datos.articuloId
                                ? 'Selecciona primero un artículo'
                                : cargandoFracciones
                                    ? 'Cargando fracciones...'
                                    : 'Selecciona Fracción'
                        }
                        disabled={loading || !datos.articuloId || cargandoFracciones}
                        error={!!fieldError(datos.fraccionId)}
                        options={fracciones.map((f) => ({
                            value: f.id,
                            label: `FRACC. ${f.numero} - ${f.descripcion}`,
                        }))}
                    />
                    <p className="absolute bottom-0 left-0 text-xs text-red-500">
                        {fieldError(datos.fraccionId) ? 'Selecciona la fracción' : ''}
                    </p>
                </div>
            </div>

            {articuloSeleccionado && (
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary-muted p-4 transition-all animate-fadeIn">
                    <div className="flex items-start gap-3">
                        <BookOpen size={20} className="mt-0.5 shrink-0 text-primary" strokeWidth={1.5} />
                        <div className="space-y-3 text-xs leading-relaxed text-slate-800 w-full">
                            <div>
                                <p className="font-semibold text-slate-900">ARTÍCULO {articuloSeleccionado.numero}</p>
                                <p className="mt-1 text-slate-700">{articuloSeleccionado.descripcion}</p>
                            </div>

                            {fraccionSeleccionada && (
                                <div className="border-t border-primary/20 pt-3">
                                    <p className="font-semibold text-slate-900">
                                        FRACCIÓN {fraccionSeleccionada.numero}
                                    </p>
                                    <p className="mt-1 text-slate-700">{fraccionSeleccionada.descripcion}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium border border-primary/20 shadow-sm">
                                            Clasificación: {fraccionSeleccionada.clasificacion}
                                        </span>
                                        <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium border border-primary/20 shadow-sm text-primary">
                                            {fraccionSeleccionada.monto_umas} UMAS
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Card>
        </div>
    );
};
