'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

/** Buscador de texto libre — actualiza ?q= con debounce y resetea a página 1. */
export function SearchBox({ placeholder = 'Buscar...' }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initial = searchParams.get('q') ?? ''
  const [value, setValue] = useState(initial)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => setValue(initial), [initial])

  const commit = (next: string) => {
    const sp = new URLSearchParams(searchParams.toString())
    if (next) sp.set('q', next)
    else sp.delete('q')
    sp.delete('page') // toda búsqueda nueva regresa a la página 1
    router.push(sp.toString() ? `${pathname}?${sp.toString()}` : pathname)
  }

  const onChange = (v: string) => {
    setValue(v)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => commit(v), 350)
  }

  return (
    <div className="pv-search">
      <SearchIcon />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="pv-clear" onClick={() => { setValue(''); commit('') }} aria-label="Limpiar búsqueda">✕</button>
      )}
    </div>
  )
}
