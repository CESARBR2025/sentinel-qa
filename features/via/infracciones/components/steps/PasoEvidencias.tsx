'use client';

import React, { useEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';

import { useInfraccionStore } from '@/stores/useInfraccionStore';

interface Props {
    loading?: boolean;
}

export const PasoEvidencias: React.FC<Props> = ({
    loading = false,
}) => {
    const datos = useInfraccionStore((s) => s.datos);
    const actualizarDatos = useInfraccionStore((s) => s.actualizarDatos);
    const evidencias = datos.evidencias ?? [];
    const inputRef = useRef<HTMLInputElement>(null);
    const urlsRef = useRef<Map<File, string>>(new Map());

    useEffect(() => {
        return () => {
            urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            urlsRef.current.clear();
        };
    }, []);

    function getUrl(file: File): string {
        let url = urlsRef.current.get(file);
        if (!url) {
            url = URL.createObjectURL(file);
            urlsRef.current.set(file, url);
        }
        return url;
    }

    function handleFiles(files: FileList | null) {
        if (!files) return;
        actualizarDatos({
            evidencias: [...evidencias, ...Array.from(files)],
        });
    }

    function eliminar(index: number) {
        const removed = evidencias[index];
        if (removed) {
            const url = urlsRef.current.get(removed);
            if (url) {
                URL.revokeObjectURL(url);
                urlsRef.current.delete(removed);
            }
        }
        actualizarDatos({
            evidencias: evidencias.filter((_, i) => i !== index),
        });
    }

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = '';
                }}
                className="hidden"
            />

            {evidencias.length === 0 ? (
                <button
                    type="button"
                    disabled={loading}
                    onClick={() => inputRef.current?.click()}
                    className="w-full py-8 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-600 hover:bg-blue-50/30 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                    <Plus size={28} className="text-slate-400" strokeWidth={1.5} />
                    <p className="text-sm font-medium text-slate-500">Agregar evidencias</p>
                    <p className="text-xs text-slate-400">PNG, JPG o HEIC · Opcional</p>
                </button>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {evidencias.map((archivo, index) => (
                        <div
                            key={`${archivo.name}-${index}`}
                            className="relative group w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
                        >
                            <img
                                src={getUrl(archivo)}
                                alt={archivo.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => eliminar(index)}
                                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={10} strokeWidth={3} />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => inputRef.current?.click()}
                        className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-200 hover:border-blue-600 hover:bg-blue-50/30 flex items-center justify-center transition-all disabled:opacity-50"
                    >
                        <Plus size={24} className="text-slate-400" strokeWidth={1.5} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PasoEvidencias;
