'use client';

import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { CardTitle } from '../ui/CardTitle';
import { FieldLabel } from '../ui/FieldLabel';
import { useInfraccionStore } from '@/stores/useInfraccionStore';
import {
    ESTADOS_MEXICO,
    COLORES,
    MARCAS,
    MODELOS_POR_MARCA,
    TIPOS_VEHICULO,
    SERVICIOS,
} from '../../constants/vehiculo';

interface Props {
    loading: boolean;
    boolError: (value: boolean | null) => boolean;
    fieldError: (value: string) => boolean;
    inputBase: string;
    inputError: string;
    /** Estado de la placa capturada por voz (doble confirmación) — opcional, solo lo usa DictadoRevision. */
    placaEstado?: 'confirmada' | 'sin_confirmar';
}

export default function PasoVehiculo({
    loading,
    boolError,
    fieldError,
    inputBase,
    inputError,
    placaEstado,
}: Props) {
    //=========================================
    // STORE ZUSTAND
    //=========================================
    const datos = useInfraccionStore((s) => s.datos);
    const actualizarDatos = useInfraccionStore((s) => s.actualizarDatos);

    //=========================================
    // UI LOCAL STATE (solo UX)
    //=========================================
    const [busquedaMarca, setBusquedaMarca] = useState(datos.marca ?? '');
    const [busquedaModelo, setBusquedaModelo] = useState(datos.modelo ?? '');
    const [busquedaColor, setBusquedaColor] = useState(datos.color ?? '');
    const [busquedaEstado, setBusquedaEstado] = useState(datos.estadoOrigen ?? '');

    // Resincroniza el texto visible cuando el store cambia desde fuera de este
    // input (ej. el prellenado del dictado por voz, que llega después del montaje
    // inicial) — sin esto, el buffer local se queda con el valor vacío del montaje.
    useEffect(() => {
        setBusquedaMarca(datos.marca ?? '');
    }, [datos.marca]);

    useEffect(() => {
        setBusquedaModelo(datos.modelo ?? '');
    }, [datos.modelo]);

    useEffect(() => {
        setBusquedaColor(datos.color ?? '');
    }, [datos.color]);

    useEffect(() => {
        setBusquedaEstado(datos.estadoOrigen ?? '');
    }, [datos.estadoOrigen]);

    const [mostrarOpciones, setMostrarOpciones] = useState(false);
    const [mostrarModelos, setMostrarModelos] = useState(false);
    const [mostrarColores, setMostrarColores] = useState(false);
    const [mostrarEstados, setMostrarEstados] = useState(false);

    const [activeMarcaIdx, setActiveMarcaIdx] = useState(-1);
    const [activeModeloIdx, setActiveModeloIdx] = useState(-1);
    const [activeColorIdx, setActiveColorIdx] = useState(-1);
    const [activeEstadoIdx, setActiveEstadoIdx] = useState(-1);

    //=========================================
    // MOCKS (aquí puedes conectar API real)
    //=========================================

    const marcasFiltradas = MARCAS.filter((estado) =>
        estado.toLowerCase().includes(busquedaMarca.toLowerCase())
    );

    const modelosDisponibles =
        MODELOS_POR_MARCA[datos.marca ?? ''] ?? [];

    const modelosFiltrados = modelosDisponibles.filter((modelo) =>
        modelo.toLowerCase().includes(busquedaModelo.toLowerCase())
    );

    const coloresFiltrados = COLORES.filter((color) =>
        color.toLowerCase().includes(busquedaColor.toLowerCase())
    );
    const estadosFiltrados = ESTADOS_MEXICO.filter((estado) =>
        estado.toLowerCase().includes(busquedaEstado.toLowerCase())
    );

    //=========================================
    // GUARD (opcional flujo futuro)
    //=========================================
    if (!datos) return null;

    return (
        <Card>
            <CardTitle>Datos del vehículo</CardTitle>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                {/* ================= MARCA ================= */}
                <div className="relative pb-5">
                    <FieldLabel required>Marca</FieldLabel>

                    <input
                        value={busquedaMarca}
                        disabled={loading}
                        placeholder="Escribe la marca"
                        className={fieldError(datos.marca) ? inputError : inputBase}
                        onFocus={() => setMostrarOpciones(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setActiveMarcaIdx(prev => prev < marcasFiltradas.length - 1 ? prev + 1 : 0);
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setActiveMarcaIdx(prev => prev > 0 ? prev - 1 : marcasFiltradas.length - 1);
                            } else if (e.key === 'Enter' && activeMarcaIdx >= 0) {
                                e.preventDefault();
                                const selected = marcasFiltradas[activeMarcaIdx];
                                if (selected) {
                                    setBusquedaMarca(selected);
                                    actualizarDatos({ marca: selected });
                                    setMostrarOpciones(false);
                                }
                            } else if (e.key === 'Escape') {
                                setMostrarOpciones(false);
                            }
                        }}
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase();

                            setBusquedaMarca(value);

                            actualizarDatos({
                                marca: value,
                                modelo: '',
                            });

                            setMostrarOpciones(true);
                        }}
                    />

                    {mostrarOpciones && busquedaMarca.length > 0 && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                            {marcasFiltradas.length > 0 ? (
                                marcasFiltradas.map((marca, i) => (
                                    <button
                                        key={marca}
                                        ref={i === activeMarcaIdx ? (el) => el?.scrollIntoView({ block: 'nearest' }) : undefined}
                                        onMouseEnter={() => setActiveMarcaIdx(i)}
                                        type="button"
                                        className="w-full px-3 py-2 text-left hover:bg-slate-100"
                                        onClick={() => {
                                            setBusquedaMarca(marca);
                                            actualizarDatos({ marca });
                                            setMostrarOpciones(false);
                                        }}
                                    >
                                        {marca}
                                    </button>
                                ))
                            ) : (
                                <button
                                    type="button"
                                    className="w-full px-3 py-2 text-left text-primary hover:bg-primary-muted"
                                    onClick={() => {
                                        actualizarDatos({ marca: busquedaMarca });
                                        setMostrarOpciones(false);
                                    }}
                                >
                                    Usar "{busquedaMarca}"
                                </button>
                            )}
                        </div>
                    )}

                    <p className="text-xs text-red-500">
                        {fieldError(datos.marca) ? 'Este campo es requerido' : ''}
                    </p>
                </div>

                {/* ================= MODELO ================= */}
                <div className="relative pb-5">
                    <FieldLabel required>Modelo</FieldLabel>

                    <input
                        value={busquedaModelo}
                        disabled={loading || !datos.marca}
                        placeholder={datos.marca ? 'Escribe el modelo' : 'Primero selecciona marca'}
                        className={fieldError(datos.modelo) ? inputError : inputBase}
                        onFocus={() => setMostrarModelos(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setActiveModeloIdx(prev => prev < modelosFiltrados.length - 1 ? prev + 1 : 0);
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setActiveModeloIdx(prev => prev > 0 ? prev - 1 : modelosFiltrados.length - 1);
                            } else if (e.key === 'Enter' && activeModeloIdx >= 0) {
                                e.preventDefault();
                                const selected = modelosFiltrados[activeModeloIdx];
                                if (selected) {
                                    setBusquedaModelo(selected);
                                    actualizarDatos({ modelo: selected });
                                    setMostrarModelos(false);
                                }
                            } else if (e.key === 'Escape') {
                                setMostrarModelos(false);
                            }
                        }}
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase();

                            setBusquedaModelo(value);

                            actualizarDatos({
                                modelo: value,
                            });

                            setMostrarModelos(true);
                        }}
                    />

                    {mostrarModelos && datos.marca && busquedaModelo.length > 0 && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                            {modelosFiltrados.length > 0 ? (
                                modelosFiltrados.map((modelo, i) => (
                                    <button
                                        key={modelo}
                                        ref={i === activeModeloIdx ? (el) => el?.scrollIntoView({ block: 'nearest' }) : undefined}
                                        onMouseEnter={() => setActiveModeloIdx(i)}
                                        type="button"
                                        className="w-full px-3 py-2 text-left hover:bg-slate-100"
                                        onClick={() => {
                                            setBusquedaModelo(modelo);
                                            actualizarDatos({ modelo });
                                            setMostrarModelos(false);
                                        }}
                                    >
                                        {modelo}
                                    </button>
                                ))
                            ) : (
                                <button
                                    type="button"
                                    className="w-full px-3 py-2 text-left text-primary hover:bg-primary-muted"
                                    onClick={() => {
                                        actualizarDatos({ modelo: busquedaModelo });
                                        setMostrarModelos(false);
                                    }}
                                >
                                    Usar "{busquedaModelo}"
                                </button>
                            )}
                        </div>
                    )}

                    <p className="text-xs text-red-500">
                        {fieldError(datos.modelo) ? 'Este campo es requerido' : ''}
                    </p>
                </div>

                {/* ================= AÑO ================= */}
                <div className="relative pb-5">
                    <FieldLabel required>Año</FieldLabel>

                    <input
                        value={datos.anio}
                        disabled={loading}
                        placeholder="2022"
                        className={fieldError(datos.anio) ? inputError : inputBase}
                        onChange={(e) =>
                            actualizarDatos({
                                anio: e.target.value.replace(/\D/g, '').slice(0, 4),
                            })
                        }
                    />

                    <p className="text-xs text-red-500">
                        {fieldError(datos.anio)
                            ? (datos.anio && (parseInt(datos.anio) < 1980 || parseInt(datos.anio) > 2026)
                                ? 'Año debe estar entre 1980 y 2026'
                                : 'Este campo es requerido')
                            : ''}
                    </p>
                </div>

                {/* ================= COLOR ================= */}
                <div className="relative pb-5">
                    <FieldLabel required>Color</FieldLabel>

                    <input
                        value={busquedaColor}
                        disabled={loading}
                        placeholder="Escribe el color"
                        className={fieldError(datos.color) ? inputError : inputBase}
                        onFocus={() => setMostrarColores(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setActiveColorIdx(prev => prev < coloresFiltrados.length - 1 ? prev + 1 : 0);
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setActiveColorIdx(prev => prev > 0 ? prev - 1 : coloresFiltrados.length - 1);
                            } else if (e.key === 'Enter' && activeColorIdx >= 0) {
                                e.preventDefault();
                                const selected = coloresFiltrados[activeColorIdx];
                                if (selected) {
                                    setBusquedaColor(selected);
                                    actualizarDatos({ color: selected });
                                    setMostrarColores(false);
                                }
                            } else if (e.key === 'Escape') {
                                setMostrarColores(false);
                            }
                        }}
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase();

                            setBusquedaColor(value);

                            actualizarDatos({
                                color: value,
                            });

                            setMostrarColores(true);
                        }}
                    />

                    {mostrarColores && busquedaColor.length > 0 && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                            {coloresFiltrados.length > 0 ? (
                                coloresFiltrados.map((color, i) => (
                                    <button
                                        key={color}
                                        ref={i === activeColorIdx ? (el) => el?.scrollIntoView({ block: 'nearest' }) : undefined}
                                        onMouseEnter={() => setActiveColorIdx(i)}
                                        type="button"
                                        className="w-full px-3 py-2 text-left hover:bg-slate-100"
                                        onClick={() => {
                                            setBusquedaColor(color);
                                            actualizarDatos({ color });
                                            setMostrarColores(false);
                                        }}
                                    >
                                        {color}
                                    </button>
                                ))
                            ) : (
                                <button
                                    type="button"
                                    className="w-full px-3 py-2 text-left text-primary hover:bg-primary-muted"
                                    onClick={() => {
                                        actualizarDatos({ color: busquedaColor });
                                        setMostrarColores(false);
                                    }}
                                >
                                    Usar "{busquedaColor}"
                                </button>
                            )}
                        </div>
                    )}

                    <p className="text-xs text-red-500">
                        {fieldError(datos.color) ? 'Este campo es requerido' : ''}
                    </p>
                </div>

                {/* ================= PLACA ================= */}
                <div className="relative pb-5">
                    <FieldLabel required>Placa</FieldLabel>

                    <input
                        value={datos.placa}
                        disabled={loading}
                        placeholder="QRO-A123-B"
                        className={fieldError(datos.placa) ? inputError : inputBase}
                        onChange={(e) =>
                            actualizarDatos({
                                placa: e.target.value.toUpperCase(),
                            })
                        }
                    />

                    <p className="text-xs text-red-500">
                        {fieldError(datos.placa) ? 'Este campo es requerido' : ''}
                    </p>
                    {placaEstado === 'confirmada' && (
                        <p className="text-xs text-primary">✓ Detectada y confirmada por voz</p>
                    )}
                    {placaEstado === 'sin_confirmar' && (
                        <p className="text-xs text-amber-600">
                            Se escuchó una placa por voz pero no coincidió con la confirmación (o no se repitió) — verifícala
                        </p>
                    )}
                </div>

                {/* ================= SERIE ================= */}
                <div className="relative pb-5">
                    <FieldLabel required>No. de serie</FieldLabel>

                    <input
                        value={datos.noSerie}
                        maxLength={17}
                        disabled={loading}
                        placeholder="3VWFE21C04M000001"
                        className={fieldError(datos.noSerie) ? inputError : inputBase}
                        onChange={(e) =>
                            actualizarDatos({
                                noSerie: e.target.value.toUpperCase(),
                            })
                        }
                    />

                    <p className="text-xs text-red-500">
                        {fieldError(datos.noSerie) ? 'Este campo es requerido' : ''}
                    </p>
                </div>

                {/* ================= ESTADO ================= */}
                <div className="relative pb-5">
                    <FieldLabel required>Estado de procedencia</FieldLabel>

                    <input
                        value={busquedaEstado}
                        disabled={loading}
                        placeholder="Escribe el estado"
                        className={fieldError(datos.estadoOrigen) ? inputError : inputBase}
                        onFocus={() => setMostrarEstados(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setActiveEstadoIdx(prev => prev < estadosFiltrados.length - 1 ? prev + 1 : 0);
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setActiveEstadoIdx(prev => prev > 0 ? prev - 1 : estadosFiltrados.length - 1);
                            } else if (e.key === 'Enter' && activeEstadoIdx >= 0) {
                                e.preventDefault();
                                const selected = estadosFiltrados[activeEstadoIdx];
                                if (selected) {
                                    setBusquedaEstado(selected);
                                    actualizarDatos({ estadoOrigen: selected });
                                    setMostrarEstados(false);
                                }
                            } else if (e.key === 'Escape') {
                                setMostrarEstados(false);
                            }
                        }}
                        onChange={(e) => {
                            const value = e.target.value;

                            setBusquedaEstado(value);

                            actualizarDatos({
                                estadoOrigen: value,
                            });

                            setMostrarEstados(true);
                        }}
                    />

                    {mostrarEstados && busquedaEstado.length > 0 && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                            {estadosFiltrados.length > 0 ? (
                                estadosFiltrados.map((estado, i) => (
                                    <button
                                        key={estado}
                                        ref={i === activeEstadoIdx ? (el) => el?.scrollIntoView({ block: 'nearest' }) : undefined}
                                        onMouseEnter={() => setActiveEstadoIdx(i)}
                                        type="button"
                                        className="w-full px-3 py-2 text-left hover:bg-slate-100"
                                        onClick={() => {
                                            setBusquedaEstado(estado);
                                            actualizarDatos({ estadoOrigen: estado });
                                            setMostrarEstados(false);
                                        }}
                                    >
                                        {estado}
                                    </button>
                                ))
                            ) : (
                                <button
                                    type="button"
                                    className="w-full px-3 py-2 text-left text-primary hover:bg-primary-muted"
                                    onClick={() => {
                                        actualizarDatos({ estadoOrigen: busquedaEstado });
                                        setMostrarEstados(false);
                                    }}
                                >
                                    Usar "{busquedaEstado}"
                                </button>
                            )}
                        </div>
                    )}

                    <p className="text-xs text-red-500">
                        {fieldError(datos.estadoOrigen)
                            ? 'Selecciona el estado de procedencia'
                            : ''}
                    </p>
                </div>

                {/* ================= TIPO VEHÍCULO ================= */}
                <div className="relative pb-5">
                    <FieldLabel required>Tipo de vehículo</FieldLabel>

                    <select
                        value={datos.tipoVehiculo}
                        disabled={loading}
                        className={fieldError(datos.tipoVehiculo) ? inputError : inputBase}
                        onChange={(e) =>
                            actualizarDatos({ tipoVehiculo: e.target.value })
                        }
                    >
                        <option value="">Selecciona tipo</option>
                        {TIPOS_VEHICULO.map((tipo) => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>

                    <p className="text-xs text-red-500">
                        {fieldError(datos.tipoVehiculo)
                            ? 'Selecciona el tipo de vehículo'
                            : ''}
                    </p>
                </div>

                {/* ================= SERVICIO ================= */}
                <div className="relative pb-5">
                    <FieldLabel required>Servicio</FieldLabel>

                    <select
                        value={datos.servicio}
                        disabled={loading}
                        className={fieldError(datos.servicio) ? inputError : inputBase}
                        onChange={(e) =>
                            actualizarDatos({ servicio: e.target.value })
                        }
                    >
                        <option value="">Selecciona servicio</option>
                        {SERVICIOS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>

                    <p className="text-xs text-red-500">
                        {fieldError(datos.servicio)
                            ? 'Selecciona el tipo de servicio'
                            : ''}
                    </p>
                </div>

                {/* ================= OTRO SERVICIO ================= */}
                {datos.servicio === 'otro' && (
                    <div className="relative pb-5 col-span-2 sm:col-span-3">
                        <FieldLabel required>Especifica el servicio</FieldLabel>

                        <input
                            value={datos.otroServicio}
                            disabled={loading}
                            placeholder="Describe el tipo de servicio"
                            className={fieldError(datos.otroServicio) ? inputError : inputBase}
                            onChange={(e) =>
                                actualizarDatos({
                                    otroServicio: e.target.value.toUpperCase(),
                                })
                            }
                        />

                        <p className="text-xs text-red-500">
                            {fieldError(datos.otroServicio)
                                ? 'Este campo es requerido'
                                : ''}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}