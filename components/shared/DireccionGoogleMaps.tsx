'use client'

import { useState } from 'react'
import { Autocomplete, useLoadScript } from '@react-google-maps/api'

export interface Direccion {
  calle: string
  numero: string
  colonia: string
  municipio: string
}

interface Props {
  value: Direccion
  onChange: (dir: Direccion) => void
}

export function DireccionGoogleMaps({ value, onChange }: Props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  })

  const [ac, setAc] = useState<google.maps.places.Autocomplete | null>(null)

  if (loadError) {
    return (
      <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#dc2626' }}>
        Error al cargar Google Maps
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#94a3b8' }}>
        Cargando mapa...
      </div>
    )
  }

  return (
    <Autocomplete
      onLoad={a => setAc(a)}
      onPlaceChanged={() => {
        if (!ac) return
        const place = ac.getPlace()
        if (!place?.address_components) return
        const map: Record<string, string> = {}
        for (const c of place.address_components) {
          map[c.types[0]] = c.long_name ?? c.short_name ?? ''
        }
        onChange({
          calle: map['route'] ?? '',
          numero: map['street_number'] ?? '',
          colonia: map['sublocality_level_1'] ?? map['neighborhood'] ?? '',
          municipio: map['locality'] ?? map['administrative_area_level_2'] ?? '',
        })
      }}
      options={{
        componentRestrictions: { country: 'mx' } as any,
        fields: ['address_components', 'formatted_address'],
        types: ['address'],
      }}
    >
      <input
        placeholder="Buscar dirección en Google Maps..."
        defaultValue={
          value.calle
            ? `${value.calle}${value.numero ? ' #' + value.numero : ''}${value.colonia ? ', ' + value.colonia : ''}${value.municipio ? ', ' + value.municipio : ''}`
            : ''
        }
        style={{
          width: '100%',
          padding: '8px 10px',
          border: '1px solid #e2e8f0',
          borderLeft: '3px solid #059669',
          fontFamily: 'Inter,sans-serif',
          fontSize: 12,
          color: '#334155',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = '#7c3aed' }}
        onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0' }}
      />
    </Autocomplete>
  )
}
