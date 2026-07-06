import PasoConfirmacion from './PasoConfirmacion';

interface Props {
    files: File[];
    onNavigateToStep: (stepId: string) => void;
}

export default function PasoConfirmacionPago({
    files,
    onNavigateToStep,
}: Props) {
    const handleNavigate = (stepId: string) => {
        const map: Record<string, string> = {
            conductor: 'ciudadano',
            evidencias: 'ubicacion',
        };
        onNavigateToStep(map[stepId] || stepId);
    };

    return (
        <PasoConfirmacion
            files={files}
            onNavigateToStep={handleNavigate}
        />
    );
}
