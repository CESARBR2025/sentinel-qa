'use client';

import { useState } from 'react';
import { MapaDireccionRegistro } from '@/features/via/oficiales/components/MapaDireccionRegistro';
import { useInfraccionStore } from '@/stores/useInfraccionStore';
import { MapPin, Home, CheckCircle2 } from 'lucide-react';

interface Props {
    setDireccion: (data: any) => void;
}

export default function PasoUbicacion({
    setDireccion,
}: Props) {

    const actualizarDatos =
        useInfraccionStore((s) => s.actualizarDatos);

    const [ultimaDir, setUltimaDir] = useState<{
        latitud?: number;
        longitud?: number;
        calle?: string;
        numero?: string;
        colonia?: string;
        codigoPostal?: string;
        municipio?: string;
        estado?: string;
    } | null>(null);

    return (
        <div className="space-y-3">
            <div className="h-[320px] rounded-xl overflow-hidden border border-slate-200">
                <MapaDireccionRegistro
                    onAddressChange={(addressData) => {
                        setUltimaDir(addressData);
                        setDireccion(addressData);

                        actualizarDatos({
                            latitud: addressData.latitud ?? null,
                            longitud: addressData.longitud ?? null,
                            calle: addressData.calle ?? '',
                            numero: addressData.numero ?? '',
                            colonia: addressData.colonia ?? '',
                            codigoPostal: addressData.codigoPostal ?? '',
                            municipio: addressData.municipio ?? '',
                            estado: addressData.estado ?? '',
                        });
                    }}
                />
            </div>

            {ultimaDir ? (
                <div className="flex items-center justify-between gap-3 rounded-xl bg-white border border-slate-200 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <Home size={15} className="text-blue-700" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                                {ultimaDir.calle || '—'}
                                {ultimaDir.numero && <span className="text-slate-500 font-normal"> #{ultimaDir.numero}</span>}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {[ultimaDir.colonia, ultimaDir.municipio].filter(Boolean).join(', ') || '—'}
                            </p>
                        </div>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-[10px] font-medium">
                        <CheckCircle2 size={10} className="text-green-500" strokeWidth={2} />
                        Confirmada
                    </span>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-4">
                    <MapPin size={14} className="text-slate-400" />
                    <p className="text-xs text-slate-400">
                        Presiona <span className="font-medium text-slate-600">Ubicarme</span> o haz clic en el mapa
                    </p>
                </div>
            )}
        </div>
    );
}
