'use client'
import { useEffect, useRef } from 'react'

export function usePolling(fn: () => void, intervalMs: number, activo = true) {
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    if (!activo) return
    const id = setInterval(() => fnRef.current(), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, activo])
}