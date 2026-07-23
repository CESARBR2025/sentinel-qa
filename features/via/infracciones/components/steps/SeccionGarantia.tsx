'use client'
import React, { useEffect, useState } from 'react';
import { CreditCard, IdCard, BadgeCheck, Truck } from 'lucide-react';
import { CardTitle } from '../ui/CardTitle';
import { Card } from '../ui/Card';
import { SelectWrapper } from '../ui/SelectWrapper';
import { FieldLabel } from '../ui/FieldLabel';
import { useInfraccionStore } from '@/stores/useInfraccionStore';

interface SeccionGarantiaProps {
    loading: boolean;
    fieldError: (val: any) => boolean;
    selectBase: string;
    selectError: string;
}

const MAPA_GARANTIAS: Record<string, string> = {
    TRJ_CIRCULACION: 'Tarjeta de circulación',
    PLACA: 'Placa',
    LICENCIA: 'Licencia',
    VEHICULO: 'Vehículo (Corralón)',
};

const OPCIONES_GARANTIA: Array<{
    valor: string;
    titulo: string;
    descripcion: string;
    icono: React.ElementType;
}> = [
    {
        valor: 'TRJ_CIRCULACION',
        titulo: 'Tarjeta de circulación',
        descripcion: 'Documento que acredita la propiedad y registro del vehículo',
        icono: CreditCard,
    },
    {
        valor: 'PLACA',
        titulo: 'Placa',
        descripcion: 'Placa de identificación vehicular delantera o trasera',
        icono: IdCard,
    },
    {
        valor: 'LICENCIA',
        titulo: 'Licencia',
        descripcion: 'Licencia de conducir del infractor',
        icono: BadgeCheck,
    },
    {
        valor: 'VEHICULO',
        titulo: 'Vehículo (Corralón)',
        descripcion: 'El vehículo será enviado al corralón',
        icono: Truck,
    },
];

export const SeccionGarantia: React.FC<SeccionGarantiaProps> = ({
    loading,
    fieldError,
    selectBase,
    selectError,
}) => {
    // Obtener datos y función de actualización del store
    const datos = useInfraccionStore((s) => s.datos);
    const actualizarDatos = useInfraccionStore((s) => s.actualizarDatos);
    const [gruas, setGruas] = useState<
        {
            id: string;
            nombre: string;
            activo: boolean;
        }[]
    >([]);

    useEffect(() => {
        const cargarGruas = async () => {
            try {
                const response = await fetch('/api/complementos/gruas');

                if (!response.ok) {
                    throw new Error('Error al obtener grúas');
                }

                const result = await response.json();

                setGruas(result ?? []);
            } catch (error) {
                console.error('Error cargando grúas:', error);
            }
        };

        cargarGruas();
    }, []);

    return (
        <Card>
            <CardTitle>Garantía retenida</CardTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {OPCIONES_GARANTIA.map((opcion) => {
                    const Icono = opcion.icono;
                    const seleccionada = datos.garantiaSeleccionada === opcion.valor;
                    return (
                        <button
                            key={opcion.valor}
                            type="button"
                            onClick={() =>
                                actualizarDatos({
                                    garantiaSeleccionada: opcion.valor,
                                    motivoRetencionVehiculo: '',
                                    gruaInvolucrada: '',
                                })
                            }
                            disabled={loading}
                            className={`
                                group relative flex flex-col items-center text-center gap-2.5
                                w-full rounded-xl border-2 p-4 transition-all duration-200
                                ${seleccionada
                                    ? 'border-primary bg-primary-muted shadow-sm'
                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                                }
                                disabled:opacity-40 disabled:cursor-not-allowed
                            `}
                        >
                            <div className={`
                                flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors duration-200
                                ${seleccionada
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                                }
                            `}>
                                <Icono size={20} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-0.5">
                                <p className={`text-sm font-semibold leading-tight ${seleccionada ? 'text-primary' : 'text-slate-800'}`}>
                                    {opcion.titulo}
                                </p>
                                <p className="text-[10px] text-slate-500 leading-snug">
                                    {opcion.descripcion}
                                </p>
                            </div>
                        </button>
                    );
                })}
                <p className="col-span-full -mt-1 text-xs text-red-500">
                    {fieldError(datos.garantiaSeleccionada) ? 'Selecciona el tipo de garantía' : ''}
                </p>
            </div>

            {/* Campos Condicionales para Vehículo */}
            {datos.garantiaSeleccionada === 'VEHICULO' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 pt-4 border-t border-slate-100">
                    {/* Motivo Retención */}
                    <div className="relative pb-5">
                        <FieldLabel required>Motivo de retención</FieldLabel>
                        <SelectWrapper>
                            <select
                                name="motivoRetencionVehiculo"
                                value={datos.motivoRetencionVehiculo}
                                onChange={(e) =>
                                    actualizarDatos({
                                        motivoRetencionVehiculo: e.target.value,
                                        gruaInvolucrada: '',
                                    })
                                }
                                disabled={loading}
                                className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-slate-900 transition-all cursor-pointer hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${fieldError(datos.motivoRetencionVehiculo) ? 'border-red-400' : 'border-slate-200'}`}
                            >
                                <option value="">Selecciona motivo</option>
                                <option value="DELITO">Delito</option>
                                <option value="ACCIDENTE">Accidente</option>
                                <option value="INFRACCION">Infracción</option>
                            </select>
                        </SelectWrapper>
                        <p className="mt-1 text-xs text-red-500">
                            {fieldError(datos.motivoRetencionVehiculo)
                                ? 'Selecciona el motivo de retención'
                                : ''}
                        </p>
                    </div>

                    {datos.motivoRetencionVehiculo && (
                        <div className="relative pb-5">
                            <FieldLabel required>Grúa asignada</FieldLabel>
                            <SelectWrapper>
                                <select
                                    name="grua"
                                    value={datos.gruaInvolucrada}
                                    onChange={(e) =>
                                        actualizarDatos({
                                            gruaInvolucrada: e.target.value,
                                        })
                                    }
                                    disabled={loading}
                                    className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-slate-900 transition-all cursor-pointer hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${fieldError(datos.gruaInvolucrada) ? 'border-red-400' : 'border-slate-200'}`}
                                >
                                    <option value="">Selecciona grúa</option>
                                    {gruas.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.nombre}
                                        </option>
                                    ))}
                                </select>
                            </SelectWrapper>
                            <p className="mt-1 text-xs text-red-500">
                                {fieldError(datos.gruaInvolucrada)
                                    ? 'Selecciona la grúa asignada'
                                    : ''}
                            </p>
                        </div>
                    )}

                    {/* Dependencia a remitir — solo si es Delito o Accidente */}
                    {datos.gruaInvolucrada && datos.motivoRetencionVehiculo !== 'INFRACCION' && (
                        <div className="relative pb-5">
                            <FieldLabel required>Infractor sera remitido a</FieldLabel>
                            <SelectWrapper>
                                <select
                                    name="dependenciaRemisora"
                                    value={datos.dependenciaRemisora}
                                    onChange={(e) =>
                                        actualizarDatos({
                                            dependenciaRemisora: e.target.value,
                                        })
                                    }
                                    disabled={loading}
                                    className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-slate-900 transition-all cursor-pointer hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${fieldError(datos.dependenciaRemisora) ? 'border-red-400' : 'border-slate-200'}`}
                                >
                                    <option value="">Selecciona dependencia</option>
                                    <option value="FISCALIA">FISCALIA</option>
                                    <option value="JUZGADO">JUZGADO CIVICO</option>
                                </select>
                            </SelectWrapper>
                            <p className="mt-1 text-xs text-red-500">
                                {fieldError(datos.dependenciaRemisora)
                                    ? 'Selecciona la dependencia a donde sera remitido el infractor'
                                    : ''}
                            </p>
                        </div>
                    )}
                </div>
            )}


        </Card>
    );
};