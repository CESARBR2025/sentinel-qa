import React from 'react';
import { ResultadoBusquedaMotivo } from '@/features/via/legalidad/types';

interface ResultadoMotivoCardProps {
    resultado: ResultadoBusquedaMotivo;
    seleccionado: boolean;
    onClick: () => void;
}

export const ResultadoMotivoCard: React.FC<ResultadoMotivoCardProps> = ({
    resultado,
    seleccionado,
    onClick,
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full text-left rounded-lg border p-3 transition-all ${
            seleccionado
                ? 'border-primary bg-primary-muted'
                : 'border-slate-200 bg-white hover:border-primary/40 hover:bg-primary-muted/40'
        }`}
    >
        <p className="text-xs font-semibold text-slate-900">
            ART. {resultado.articuloNumero} — FRACC. {resultado.fraccionNumero}
        </p>
        <p className="mt-0.5 text-xs text-slate-600">{resultado.fraccionDescripcion}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium border border-primary/20">
                {resultado.fraccionClasificacion}
            </span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium border border-primary/20 text-primary">
                {resultado.fraccionMonto} UMAS
            </span>
        </div>
    </button>
);

export default ResultadoMotivoCard;
