'use client';

import React, { useEffect } from 'react';
import { useEspectroAudio } from '../hooks/useEspectroAudio';

interface EspectroVozProps {
    activo: boolean;
}

const TAMANIO = 176;
const CENTRO = TAMANIO / 2;
const RADIO_BASE = 46;
const LARGO_MIN = 4;
const LARGO_MAX = 34;

/**
 * Espectro de audio circular, tipo orbe reactivo (similar al AI DJ de
 * Spotify), en los colores de la app. Encapsula useEspectroAudio para que
 * solo esta subárbol se re-renderice a la frecuencia de la animación, no el
 * flujo de preguntas completo.
 */
export const EspectroVoz: React.FC<EspectroVozProps> = ({ activo }) => {
    const { niveles, iniciar, detener } = useEspectroAudio();

    useEffect(() => {
        if (activo) {
            iniciar();
        } else {
            detener();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activo]);

    const numBarras = niveles.length;

    return (
        <div className="relative flex items-center justify-center h-44 w-44 mx-auto" aria-hidden="true">
            <div
                className={`absolute inset-6 rounded-full bg-primary/20 blur-xl transition-opacity duration-300 ${
                    activo ? 'opacity-100 animate-pulse' : 'opacity-30'
                }`}
            />
            <svg
                viewBox={`0 0 ${TAMANIO} ${TAMANIO}`}
                className={`relative w-full h-full transition-colors duration-300 ${activo ? 'text-primary' : 'text-slate-300'}`}
            >
                {niveles.map((nivel, i) => {
                    const angulo = (i / numBarras) * 2 * Math.PI - Math.PI / 2;
                    const largo = activo ? LARGO_MIN + nivel * (LARGO_MAX - LARGO_MIN) : LARGO_MIN;
                    const x1 = CENTRO + Math.cos(angulo) * RADIO_BASE;
                    const y1 = CENTRO + Math.sin(angulo) * RADIO_BASE;
                    const x2 = CENTRO + Math.cos(angulo) * (RADIO_BASE + largo);
                    const y2 = CENTRO + Math.sin(angulo) * (RADIO_BASE + largo);
                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="currentColor"
                            strokeWidth={3}
                            strokeLinecap="round"
                            className="transition-all duration-100 ease-out"
                        />
                    );
                })}
                <circle
                    cx={CENTRO}
                    cy={CENTRO}
                    r={RADIO_BASE - 10}
                    fill="currentColor"
                    className={`transition-opacity duration-300 ${activo ? 'opacity-90' : 'opacity-20'}`}
                />
            </svg>
        </div>
    );
};

interface EspectroVozBarraProps {
    activo: boolean;
}

/**
 * Variante lineal y compacta del espectro — pensada para caber inline dentro
 * de una card (p. ej. el bloque de búsqueda por voz del paso "Infracción"),
 * donde el orbe circular sería demasiado grande. Reutiliza useEspectroAudio,
 * así que este subárbol es el único que se re-renderiza al ritmo de la
 * animación, no la sección completa.
 */
export const EspectroVozBarra: React.FC<EspectroVozBarraProps> = ({ activo }) => {
    const { niveles, iniciar, detener } = useEspectroAudio();

    useEffect(() => {
        if (activo) {
            iniciar();
        } else {
            detener();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activo]);

    return (
        <div className="flex items-center gap-[3px] h-8" aria-hidden="true">
            {niveles.map((nivel, i) => (
                <span
                    key={i}
                    className="w-[3px] shrink-0 rounded-full bg-primary transition-all duration-100 ease-out"
                    style={{
                        height: `${Math.max(12, (activo ? nivel : 0) * 100)}%`,
                        opacity: activo ? 0.35 + nivel * 0.65 : 0.2,
                    }}
                />
            ))}
        </div>
    );
};

export default EspectroVoz;
