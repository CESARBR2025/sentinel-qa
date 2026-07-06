import PasoCiudadano from './PasoCiudadano';
import PasoConductor from './PasoConductor';
import PasoDecuentos from './PasoDescuentos';
import { useInfraccionStore } from '@/stores/useInfraccionStore';

interface Props {
    loading: boolean;
    boolError: (value: boolean | null) => boolean;
    fieldError: (value: string) => boolean;
    inputBase: string;
    inputError: string;
}

export default function PasoCiudadanoConductor({
    loading,
    boolError,
    fieldError,
    inputBase,
    inputError,
}: Props) {
    const datos = useInfraccionStore((s) => s.datos);

    return (
        <div className="space-y-5">
            <PasoCiudadano loading={loading} boolError={boolError} />

            {datos.estaCiudadanoPresente && (
                <>
                    <PasoConductor
                        loading={loading}
                        boolError={boolError}
                        fieldError={fieldError}
                        inputBase={inputBase}
                        inputError={inputError}
                    />
                    <PasoDecuentos loading={loading} boolError={boolError} />
                </>
            )}
        </div>
    );
}
