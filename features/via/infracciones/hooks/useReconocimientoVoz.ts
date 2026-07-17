'use client';

import { useCallback, useRef, useState } from 'react';

interface SpeechRecognitionResultLike {
    isFinal: boolean;
    0: { transcript: string };
}

interface SpeechRecognitionEventLike {
    resultIndex: number;
    results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechRecognitionEventLike) => void) | null;
    onerror: ((event: { error: string }) => void) | null;
    onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function obtenerConstructor(): SpeechRecognitionConstructor | null {
    if (typeof window === 'undefined') return null;
    const w = window as unknown as {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

interface OpcionesIniciar {
    /** true = dictado largo (varias oraciones, no corta al primer silencio). Default false (Fase 1: frase corta). */
    continuous?: boolean;
    /** Si es false, no borra lo ya transcrito — útil para reanudar tras un corte automático del navegador. */
    reiniciarTexto?: boolean;
}

export function useReconocimientoVoz() {
    const [soportado] = useState(() => obtenerConstructor() !== null);
    const [escuchando, setEscuchando] = useState(false);
    const [transcripcion, setTranscripcion] = useState('');
    const [interim, setInterim] = useState('');
    const [error, setError] = useState<string | null>(null);
    const reconocimientoRef = useRef<SpeechRecognitionLike | null>(null);
    const acumuladoRef = useRef('');

    const detener = useCallback(() => {
        reconocimientoRef.current?.stop();
    }, []);

    const iniciar = useCallback((opciones: OpcionesIniciar = {}) => {
        const { continuous = false, reiniciarTexto = true } = opciones;
        const Constructor = obtenerConstructor();
        if (!Constructor) {
            setError('Tu navegador no soporta reconocimiento de voz');
            return;
        }

        setError(null);
        setInterim('');
        if (reiniciarTexto) {
            acumuladoRef.current = '';
            setTranscripcion('');
        }

        const reconocimiento = new Constructor();
        reconocimiento.lang = 'es-MX';
        reconocimiento.continuous = continuous;
        reconocimiento.interimResults = true;

        reconocimiento.onresult = (event) => {
            let textoInterino = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const resultado = event.results[i];
                if (resultado.isFinal) {
                    acumuladoRef.current = `${acumuladoRef.current} ${resultado[0].transcript}`.trim();
                } else {
                    textoInterino += resultado[0].transcript;
                }
            }
            setTranscripcion(acumuladoRef.current);
            setInterim(textoInterino);
        };

        reconocimiento.onerror = (event) => {
            setError(
                event.error === 'not-allowed'
                    ? 'Permiso de micrófono denegado'
                    : 'No se pudo escuchar, intenta de nuevo'
            );
            setEscuchando(false);
        };

        reconocimiento.onend = () => {
            setEscuchando(false);
            setInterim('');
        };

        reconocimientoRef.current = reconocimiento;
        setEscuchando(true);
        reconocimiento.start();
    }, []);

    const reiniciar = useCallback(() => {
        acumuladoRef.current = '';
        setTranscripcion('');
        setInterim('');
        setError(null);
    }, []);

    return { soportado, escuchando, transcripcion, interim, error, iniciar, detener, reiniciar };
}
