import PasoUbicacion from './PasoUbicacion';
import { PasoEvidencias } from './PasoEvidencias';
import { Camera } from 'lucide-react';

interface Props {
    setDireccion: (data: any) => void;
    loading?: boolean;
}

export default function PasoUbicacionEvidencias({
    setDireccion,
    loading = false,
}: Props) {
    return (
        <div className="space-y-4">
            {/* Mapa + dirección */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 rounded-full bg-primary" />
                    <p className="text-[13px] font-semibold text-slate-700">Ubicación</p>
                </div>
                <PasoUbicacion setDireccion={setDireccion} />
            </div>

            {/* Evidencias */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 rounded-full bg-primary" />
                    <p className="text-[13px] font-semibold text-slate-700">Evidencias</p>
                </div>
                <PasoEvidencias loading={loading} />
            </div>
        </div>
    );
}
