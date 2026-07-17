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

export function useReconocimientoVoz() {
    const [soportado] = useState(() => obtenerConstructor() !== null);
    const [escuchando, setEscuchando] = useState(false);
    const [transcripcion, setTranscripcion] = useState('');
    const [error, setError] = useState<string | null>(null);
    const reconocimientoRef = useRef<SpeechRecognitionLike | null>(null);

    const detener = useCallback(() => {
        reconocimientoRef.current?.stop();
    }, []);

    const iniciar = useCallback(() => {
        const Constructor = obtenerConstructor();
        if (!Constructor) {
            setError('Tu navegador no soporta reconocimiento de voz');
            return;
        }

        setError(null);
        setTranscripcion('');

        const reconocimiento = new Constructor();
        reconocimiento.lang = 'es-MX';
        reconocimiento.continuous = false;
        reconocimiento.interimResults = false;

        reconocimiento.onresult = (event) => {
            let textoFinal = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const resultado = event.results[i];
                if (resultado.isFinal) {
                    textoFinal += resultado[0].transcript;
                }
            }
            if (textoFinal) setTranscripcion(textoFinal.trim());
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
        };

        reconocimientoRef.current = reconocimiento;
        setEscuchando(true);
        reconocimiento.start();
    }, []);

    const reiniciar = useCallback(() => {
        setTranscripcion('');
        setError(null);
    }, []);

    return { soportado, escuchando, transcripcion, error, iniciar, detener, reiniciar };
}
