'use client';

import { useEffect, useRef, useState } from 'react';

import { useInfraccionStore } from '@/stores/useInfraccionStore';

import { Card } from '../ui/Card';
import { CardTitle } from '../ui/CardTitle';
import { SegmentedControl } from '../ui/SegmentedControl';
import {
    Upload,
    FileText,
    CreditCard,
    IdCard,
    X,
    CheckCircle2,
    Percent,
    UserCheck,
    UserX,
} from 'lucide-react';

interface Props {
    loading: boolean;
    boolError: (value: boolean | null) => boolean;
}

type ArchivoField =
    | 'archivoINE'
    | 'archivoTarjetaCirculacion'
    | 'archivoInapam';

export default function PasoDecuentos({ loading, boolError }: Props) {
    const datos = useInfraccionStore((s) => s.datos);
    const actualizarDatos = useInfraccionStore((s) => s.actualizarDatos);

    const ineRef = useRef<HTMLInputElement>(null);
    const tarjetaRef = useRef<HTMLInputElement>(null);
    const inapamRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + 10);

        if (
            datos.esCiudadanoAdultoMayor === true &&
            datos.presentaInapam === true
        ) {
            actualizarDatos({
                descuentoAplicado: 70,
                fechaLimiteDescuento: fechaLimite.toISOString(),
            });
            return;
        }

        actualizarDatos({
            descuentoAplicado: 50,
            fechaLimiteDescuento: fechaLimite.toISOString(),
        });
    }, [datos.esCiudadanoAdultoMayor, datos.presentaInapam, actualizarDatos]);

    function handleFileChange(field: ArchivoField, ref: React.RefObject<HTMLInputElement | null>) {
        const file = ref.current?.files?.[0] || null;
        actualizarDatos({ [field]: file });
    }

    function handleRemoveFile(field: ArchivoField, ref: React.RefObject<HTMLInputElement | null>) {
        actualizarDatos({ [field]: null });
        if (ref.current) ref.current.value = '';
    }

    return (
        <Card>
            <CardTitle>Descuentos y documentación</CardTitle>

            <div className="space-y-5">
                {/* Adulto mayor */}
                <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-2.5">
                        ¿El ciudadano es adulto mayor?
                    </p>
                    <SegmentedControl
                        options={[
                            { value: 'true', label: 'Sí, es adulto mayor', icon: UserCheck },
                            { value: 'false', label: 'No, no es adulto mayor', icon: UserX },
                        ]}
                        value={datos.esCiudadanoAdultoMayor === null ? null : String(datos.esCiudadanoAdultoMayor)}
                        onChange={(val) => {
                            if (val === 'true') {
                                actualizarDatos({ esCiudadanoAdultoMayor: true });
                            } else {
                                actualizarDatos({
                                    esCiudadanoAdultoMayor: false,
                                    presentaInapam: false,
                                });
                            }
                        }}
                        disabled={loading}
                        error={boolError(datos.esCiudadanoAdultoMayor)}
                    />
                    {boolError(datos.esCiudadanoAdultoMayor) && (
                        <p className="text-xs text-red-500 mt-2">
                            Indica si el ciudadano es adulto mayor
                        </p>
                    )}
                </div>

                {/* INAPAM + descuento tag */}
                {datos.esCiudadanoAdultoMayor && (
                    <>
                        <div className="border-t border-slate-100" />
                        <div>
                            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-2.5">
                                ¿Presenta credencial INAPAM?
                            </p>
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <SegmentedControl
                                        options={[
                                            { value: 'true', label: 'Sí presenta', icon: UserCheck },
                                            { value: 'false', label: 'No presenta', icon: UserX },
                                        ]}
                                        value={datos.presentaInapam === null ? null : String(datos.presentaInapam)}
                                        onChange={(val) =>
                                            actualizarDatos({ presentaInapam: val === 'true' })
                                        }
                                        disabled={loading}
                                        error={boolError(datos.presentaInapam)}
                                    />
                                </div>
                                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-muted text-primary text-xs font-semibold border border-primary/20 mt-1">
                                    <Percent size={12} />
                                    {datos.descuentoAplicado}%
                                </div>
                            </div>
                            {boolError(datos.presentaInapam) && (
                                <p className="text-xs text-red-500 mt-2">
                                    Indica si el ciudadano presenta credencial INAPAM
                                </p>
                            )}
                        </div>
                    </>
                )}

                {/* Documentos */}
                <div className="border-t border-slate-100" />
                <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-3">
                        Documentos requeridos
                    </p>
                    <div className="space-y-3">
                        <FileUploadZone
                            icon={<IdCard size={18} />}
                            label="Fotografía del INE"
                            description="Sube una foto clara de tu credencial INE (ambos lados)"
                            accept="image/*,application/pdf"
                            disabled={loading}
                            file={datos.archivoINE}
                            inputRef={ineRef}
                            onChange={() => handleFileChange('archivoINE', ineRef)}
                            onRemove={() => handleRemoveFile('archivoINE', ineRef)}
                        />

                        <FileUploadZone
                            icon={<CreditCard size={18} />}
                            label="Tarjeta de Circulación"
                            description="Sube una foto de la tarjeta de circulación del vehículo"
                            accept="image/*,application/pdf"
                            disabled={loading}
                            file={datos.archivoTarjetaCirculacion}
                            inputRef={tarjetaRef}
                            onChange={() => handleFileChange('archivoTarjetaCirculacion', tarjetaRef)}
                            onRemove={() => handleRemoveFile('archivoTarjetaCirculacion', tarjetaRef)}
                        />

                        {datos.esCiudadanoAdultoMayor === true &&
                            datos.presentaInapam === true && (
                                <FileUploadZone
                                    icon={<FileText size={18} />}
                                    label="Credencial INAPAM"
                                    description="Sube una foto de tu credencial INAPAM vigente"
                                    accept="image/*,application/pdf"
                                    disabled={loading}
                                    file={datos.archivoInapam}
                                    inputRef={inapamRef}
                                    onChange={() => handleFileChange('archivoInapam', inapamRef)}
                                    onRemove={() => handleRemoveFile('archivoInapam', inapamRef)}
                                />
                            )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

function FileUploadZone({
    icon,
    label,
    description,
    accept,
    disabled,
    file,
    inputRef,
    onChange,
    onRemove,
}: {
    icon: React.ReactNode;
    label: string;
    description: string;
    accept: string;
    disabled: boolean;
    file: File | null;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onChange: () => void;
    onRemove: () => void;
}) {
    const [isDragOver, setIsDragOver] = useState(false);

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragOver(false);
        const dt = e.dataTransfer;
        const droppedFile = dt.files?.[0];
        if (droppedFile && inputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(droppedFile);
            inputRef.current.files = dataTransfer.files;
            onChange();
        }
    }

    return (
        <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!disabled && !file) inputRef.current?.click();
                }
            }}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => {
                if (!disabled && !file) inputRef.current?.click();
            }}
            className={`
                relative rounded-xl border-2 p-4 transition-all duration-200
                ${isDragOver
                    ? 'border-primary bg-primary-muted'
                    : file
                        ? 'border-green-500 bg-green-50'
                        : 'border-dashed border-slate-200 bg-white hover:border-primary hover:bg-slate-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                capture="environment"
                disabled={disabled}
                onChange={onChange}
                className="hidden"
            />

            {file ? (
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0 w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-green-500">
                            <CheckCircle2 size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                                {file.name}
                            </p>
                            <p className="text-xs text-slate-500">
                                {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Eliminar archivo"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                            {label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {description}
                        </p>
                    </div>
                    <div className="shrink-0 p-2 rounded-lg bg-primary-muted text-primary">
                        <Upload size={16} />
                    </div>
                </div>
            )}
        </div>
    );
}
