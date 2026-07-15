'use client';

import { UserCheck, UserX, BadgeCheck, UserMinus, CheckCircle2 } from 'lucide-react';

import { useInfraccionStore } from '@/stores/useInfraccionStore';

import { Card } from '../ui/Card';
import { CardTitle } from '../ui/CardTitle';
import { SegmentedControl } from '../ui/SegmentedControl';

interface Props {
    loading: boolean;
    boolError: (value: boolean | null) => boolean;
}

export default function PasoCiudadano({
    loading,
    boolError,
}: Props) {

    const datos =
        useInfraccionStore((s) => s.datos);

    const actualizarDatos =
        useInfraccionStore((s) => s.actualizarDatos);

    const presente = datos.estaCiudadanoPresente;
    const titular = datos.esCiudadanoTitular;

    return (
        <Card>
            <CardTitle>
                Información del ciudadano
            </CardTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Presencia */}
                <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-2.5">
                        Presencia
                    </p>
                    <SegmentedControl
                        options={[
                            { value: 'true', label: 'Presente', icon: UserCheck },
                            { value: 'false', label: 'Ausente', icon: UserX },
                        ]}
                        value={presente === null ? null : String(presente)}
                        onChange={(val) => {
                            actualizarDatos({
                                estaCiudadanoPresente: val === 'true',
                                esCiudadanoTitular: val === 'true' ? true : false,
                            });
                        }}
                        disabled={loading}
                        error={boolError(presente)}
                    />

                    {presente !== null && (
                        <p className={`text-xs mt-2 flex items-center gap-1.5 ${presente ? 'text-green-600' : 'text-slate-500'}`}>
                            {presente && <CheckCircle2 size={12} className="shrink-0 text-green-500" strokeWidth={2} />}
                            {presente
                                ? 'El conductor se encuentra en el lugar de la infracción'
                                : 'La infracción se registrará sin la presencia del conductor'
                            }
                        </p>
                    )}

                    {boolError(presente) && (
                        <p className="text-xs text-red-500 mt-2">
                            Selecciona si el ciudadano está presente o ausente
                        </p>
                    )}
                </div>

                {/* Titularidad — solo si presente */}
                {presente ? (
                    <div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-2.5">
                            Titularidad del vehículo
                        </p>
                        <SegmentedControl
                            options={[
                                { value: 'true', label: 'Es titular', icon: BadgeCheck },
                                { value: 'false', label: 'No es titular', icon: UserMinus },
                            ]}
                            value={String(titular)}
                            onChange={(val) =>
                                actualizarDatos({
                                    esCiudadanoTitular: val === 'true',
                                })
                            }
                            disabled={loading}
                        />

                        <p className={`text-xs mt-2 flex items-center gap-1.5 ${titular ? 'text-green-600' : 'text-slate-500'}`}>
                            {titular && <CheckCircle2 size={12} className="shrink-0 text-green-500" strokeWidth={2} />}
                            {titular
                                ? 'El ciudadano es el propietario registrado del vehículo'
                                : 'El ciudadano conduce un vehículo que no está a su nombre'
                            }
                        </p>

                        {boolError(titular) && (
                            <p className="text-xs text-red-500 mt-2">
                                Indica si el ciudadano es titular del vehículo
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full min-h-[60px] rounded-xl border-2 border-dashed border-slate-200">
                        <p className="text-xs text-slate-400">
                            Selecciona "Presente" para definir titularidad
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}
