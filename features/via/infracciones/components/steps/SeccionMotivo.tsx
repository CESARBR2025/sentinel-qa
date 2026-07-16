'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';
import { CardTitle } from '../ui/CardTitle';
import { FieldLabel } from '../ui/FieldLabel';
import { CustomSelect } from '../ui/CustomSelect';
import { useInfraccionStore } from '@/stores/useInfraccionStore';
import { obtenerFraccionesAction } from '@/features/via/legalidad/actions';

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
        <Card>
            <CardTitle>Motivo de infracción</CardTitle>
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
    );
};
