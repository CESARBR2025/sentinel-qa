'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const NUM_BARRAS = 28;

const nivelesEnReposo = () => new Array(NUM_BARRAS).fill(0);

/**
 * Analiza el audio crudo del micrófono para dibujar un espectro reactivo.
 * Independiente de useReconocimientoVoz: Web Speech API no expone niveles de
 * audio, solo texto — así que este hook abre su propio canal con Web Audio API
 * (getUserMedia + AnalyserNode) en paralelo, solo para la visualización.
 */
export function useEspectroAudio() {
    const [niveles, setNiveles] = useState<number[]>(nivelesEnReposo);
    const streamRef = useRef<MediaStream | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const rafRef = useRef<number | null>(null);

    const detener = useCallback(() => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
            audioCtxRef.current.close().catch(() => {});
        }
        audioCtxRef.current = null;
        setNiveles(nivelesEnReposo());
    }, []);

    const iniciar = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const AudioContextCtor =
                window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const audioCtx = new AudioContextCtor();
            audioCtxRef.current = audioCtx;

            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.7;
            source.connect(analyser);

            const datos = new Uint8Array(analyser.frequencyBinCount);
            const paso = Math.max(1, Math.floor(datos.length / NUM_BARRAS));

            const loop = () => {
                analyser.getByteFrequencyData(datos);
                const nuevosNiveles: number[] = [];
                for (let i = 0; i < NUM_BARRAS; i++) {
                    nuevosNiveles.push(datos[i * paso] / 255);
                }
                setNiveles(nuevosNiveles);
                rafRef.current = requestAnimationFrame(loop);
            };
            loop();
        } catch {
            // Si no se puede abrir este segundo canal de audio, no es crítico —
            // el reconocimiento de voz sigue funcionando; solo no habrá espectro.
        }
    }, []);

    useEffect(() => () => detener(), [detener]);

    return { niveles, iniciar, detener };
}
