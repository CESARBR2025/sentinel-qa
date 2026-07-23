import React from 'react';
import { SeccionGarantia } from './SeccionGarantia';
import { SeccionMotivo } from './SeccionMotivo';
import { selectBase, selectError } from '../ui/inputStyles';


interface PasoInfraccionProps {
    articulos: any[];
    cargandoArticulos: boolean;
    loading: boolean;
    fieldError: (val: any) => boolean;
}

export const PasoInfraccion: React.FC<PasoInfraccionProps> = ({
    articulos,
    cargandoArticulos,
    loading,
    fieldError,
}) => {


    return (
        <div className="space-y-5">
            <SeccionMotivo
                articulos={articulos}
                cargandoArticulos={cargandoArticulos}
                loading={loading}
                fieldError={fieldError}
            />

            <SeccionGarantia
                loading={loading}
                fieldError={fieldError}
                selectBase={selectBase}
                selectError={selectError}
            />
        </div>
    );
};

export default PasoInfraccion;