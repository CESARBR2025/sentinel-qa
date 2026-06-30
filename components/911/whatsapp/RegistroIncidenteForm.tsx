'use client';
import React, { useState, useCallback, useRef } from 'react';
import {
    MessageSquare, User, AlertTriangle, MapPin,
    ClipboardCheck, Clock, Shield, Send, Hash, Search
} from 'lucide-react';
import { RolField } from '@/components/rol_servicios/RolInputs';
import { DashboardHeader } from "@/components/partials/Header";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import { createIncidente } from '@/lib/incidentes/actions';

// 1. LAS LIBRERÍAS SIEMPRE FUERA DEL COMPONENTE
const libraries: ("places")[] = ["places"];

export default function RegistroIncidenteZen({ user, tiposIncidente }: { user: any, tiposIncidente: any[] }) {
    // 2. TODOS LOS ESTADOS DENTRO DE LA FUNCIÓN
    const [canal, setCanal] = useState('WHATSAPP');
    const [isAnonimo, setIsAnonimo] = useState(false);
    const [latitud, setLatitud] = useState<number | null>(null);
    const [longitud, setLongitud] = useState<number | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [direccion, setDireccion] = useState({
        calle: "",
        colonia: "",
        numeroExterior: ""
    });

    // Cargar la API de Google
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries
    });

    const onPlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry && place.geometry.location) {
            const newPos = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            setLatitud(newPos.lat);
            setLongitud(newPos.lng);
            map?.panTo(newPos);

            let calle = "";
            let numero = "";
            let colonia = "";

            place.address_components?.forEach((comp) => {
                const types = comp.types;
                if (types.includes("route")) calle = comp.long_name;
                if (types.includes("street_number")) numero = comp.long_name; // <--- El número exterior
                if (types.includes("sublocality") || types.includes("neighborhood")) colonia = comp.long_name;
            });

            // ASIGNACIÓN LIMPIA: Cada cosa a su campo
            setDireccion({
                calle: calle,
                numeroExterior: numero, // <--- Ahora se guarda solo
                colonia: colonia
            });
        }
    };

    return (
        <form action={createIncidente as any} style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>

            {/* 3. CAMPOS OCULTOS (Aquí es donde se pasan los datos al servidor) */}
            <input type="hidden" name="canal" value="whatsapp" />
            <input type="hidden" name="tipoReporte" value="normal" />
            <input type="hidden" name="fechaHoraInicio" value={new Date().toISOString()} />
            <input type="hidden" name="capturadoPor" value={user?.id} />
            <input type="hidden" name="latitud" value={latitud || ''} />
            <input type="hidden" name="longitud" value={longitud || ''} />
            {isAnonimo && <input type="hidden" name="anonimo" value="true" />}

            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

            <DashboardHeader user={user} />

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 600 }}>
                        Módulo de Operaciones
                    </span>
                    <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.02em', textTransform: 'uppercase', margin: '4px 0 0 0', color: '#0f172a' }}>
                        REGISTRO DE <span style={{ color: '#3b82f6' }}>INCIDENTES 911</span>
                    </h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* SECCIÓN ORIGEN */}
                    <section className="sentinel-card">
                        <h2 className="sentinel-section-title">Origen y Reportante</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                            <RolField label="Canal de Entrada" icon={MessageSquare} value="WHATSAPP" disabled />
                            <RolField name="grupoWhatsapp" label="Grupo de WhatsApp" icon={MessageSquare} placeholder="Nombre del grupo..." />
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                                <div style={{ flexGrow: 1 }}>
                                    <RolField name="nombreReportante" label="Nombre del Reportante" icon={User} placeholder={isAnonimo ? "MODO ANÓNIMO ACTIVO" : "Nombre del ciudadano"} disabled={isAnonimo} />
                                </div>
                                <button type="button" onClick={() => setIsAnonimo(!isAnonimo)} style={{ height: '42px', padding: '0 16px', background: isAnonimo ? '#0f172a' : '#ffffff', color: isAnonimo ? '#ffffff' : '#64748b', border: '1px solid #e2e8f0', borderRadius: '2px', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', fontWeight: 600, cursor: 'pointer' }}>
                                    {isAnonimo ? '[ ANÓNIMO: ON ]' : '[ ANÓNIMO: OFF ]'}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN DETALLES */}
                    <section className="sentinel-card">
                        <h2 className="sentinel-section-title">Detalles del Suceso</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <RolField label="Tipo de Incidente" icon={AlertTriangle} as="select" name="tipoIncidenteId">
                                <option value="">Seleccione un tipo...</option>
                                {tiposIncidente?.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                ))}
                            </RolField>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label>Descripción de los Hechos</label>
                                <textarea name="descripcion" placeholder="Describa la situación reportada..." style={{ width: '100%', height: '120px', padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '2px', fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none', resize: 'none' }} />
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN UBICACIÓN */}
                    <section className="sentinel-card">
                        <h2 className="sentinel-section-title">Ubicación y Georreferencia</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* ÁREA DEL MAPA (IGUAL AL EJEMPLO) */}
                            {isLoaded ? (
                                <div style={{ marginBottom: '10px' }}>
                                    <label>Buscador de Dirección (Google Maps)</label>
                                    <Autocomplete
                                        onLoad={(ref) => (autocompleteRef.current = ref)}
                                        onPlaceChanged={onPlaceChanged}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Escribe una dirección para centrar el mapa..."
                                            style={{ width: '100%', padding: '12px', marginBottom: '12px', borderLeft: '4px solid #3b82f6', border: '1px solid #e2e8f0', borderRadius: '2px' }}
                                        />
                                    </Autocomplete>

                                    <GoogleMap
                                        mapContainerStyle={{ width: '100%', height: '350px', borderRadius: '2px', border: '1px solid #e2e8f0' }}
                                        center={{ lat: latitud || 20.3889, lng: longitud || -99.9961 }}
                                        zoom={15}
                                        onLoad={(m) => setMap(m)}
                                        onClick={(e) => {
                                            if (e.latLng) {
                                                setLatitud(e.latLng.lat());
                                                setLongitud(e.latLng.lng());
                                            }
                                        }}
                                        options={{ streetViewControl: false, mapTypeControl: false }}
                                    >
                                        {(latitud && longitud) && (
                                            <Marker
                                                position={{ lat: latitud, lng: longitud }}
                                                draggable={true}
                                                onDragEnd={(e) => {
                                                    if (e.latLng) {
                                                        setLatitud(e.latLng.lat());
                                                        setLongitud(e.latLng.lng());
                                                    }
                                                }}
                                            />
                                        )}
                                    </GoogleMap>
                                    <p style={{ fontSize: '10px', color: '#64748b', marginTop: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                                        COORDENADAS SELECCIONADAS: {latitud?.toFixed(6)}, {longitud?.toFixed(6)}
                                    </p>
                                </div>
                            ) : (
                                <p>Cargando Mapa Táctico...</p>
                            )}

                            {/* GRILLA DE CAMPOS DE TEXTO */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>

                                {/* CALLE (Ocupa 2 columnas) */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <RolField
                                        name="calle"
                                        label="Calle / Vialidad"
                                        icon={MapPin}
                                        placeholder="Nombre de la calle..."
                                        value={direccion.calle}
                                        onChange={(e: any) => setDireccion({ ...direccion, calle: e.target.value })}
                                    />
                                </div>

                                {/* NÚMERO EXTERIOR (Se llena solo desde el mapa) */}
                                <RolField
                                    name="numero_exterior"
                                    label="Num. Ext"
                                    icon={Hash}
                                    placeholder="Ej. 102-A"
                                    value={direccion.numeroExterior} // <--- Conectado
                                    onChange={(e: any) => setDireccion({ ...direccion, numeroExterior: e.target.value })}
                                />

                                {/* NÚMERO INTERIOR (Sigue siendo manual) */}
                                <RolField name="numero_interior" label="Num. Int" icon={Hash} placeholder="Depto/Local" />

                                {/* COLONIA */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <RolField
                                        name="colonia"
                                        label="Colonia"
                                        icon={MapPin}
                                        placeholder="Nombre de la colonia..."
                                        value={direccion.colonia}
                                        onChange={(e: any) => setDireccion({ ...direccion, colonia: e.target.value })}
                                    />
                                </div>

                                {/* REFERENCIA */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <RolField name="referenciaUbicacion" label="Referencia Visual" icon={MapPin} placeholder="Fachada, color de casa..." />
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN DESPACHO */}
                    <section className="sentinel-card">
                        <h2 className="sentinel-section-title">Despacho y Control</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', alignItems: 'end' }}>
                            <RolField label="Operador" icon={User} value={`${user?.name || ''} ${user?.apellido || ''}`.trim()} disabled />
                            <RolField label="Estatus Inicial" icon={ClipboardCheck} as="select" defaultValue="SIN DESPACHAR">
                                <option value="sin_despachar">SIN DESPACHAR</option>
                            </RolField>
                            <RolField label="Inicio" icon={Clock} type="time" />
                            <RolField label="Fin" icon={Clock} type="time" />
                        </div>
                    </section>
                </div>

                <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" style={{ background: '#0f172a', color: '#ffffff', padding: '16px 48px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '12px', border: 'none', cursor: 'pointer' }}>
                        <Send size={16} color="#3b82f6" />
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Registrar Incidente</span>
                    </button>
                </div>
            </main>

            {/* MODAL DEL MAPA */}
            {showMap && isLoaded && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '800px', borderRadius: '4px', padding: '24px' }}>
                        <h2 className="sentinel-section-title">Localizador Geográfico</h2>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Buscador de Direcciones</label>
                            <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceChanged}>
                                <input type="text" placeholder="Buscar dirección..." style={{ width: '100%', padding: '10px', borderLeft: '4px solid #3b82f6', border: '1px solid #e2e8f0' }} />
                            </Autocomplete>
                        </div>
                        <GoogleMap mapContainerStyle={{ width: '100%', height: '400px' }} center={{ lat: latitud || 20.3889, lng: longitud || -99.9961 }} zoom={15} onLoad={(m) => setMap(m)} onClick={(e) => { if (e.latLng) { setLatitud(e.latLng.lat()); setLongitud(e.latLng.lng()); } }}>
                            {(latitud && longitud) && <Marker position={{ lat: latitud, lng: longitud }} draggable={true} onDragEnd={(e) => { if (e.latLng) { setLatitud(e.latLng.lat()); setLongitud(e.latLng.lng()); } }} />}
                        </GoogleMap>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '10px' }}>COORDS: {latitud?.toFixed(6)}, {longitud?.toFixed(6)}</p>
                            <button type="button" onClick={() => setShowMap(false)} style={{ background: '#0f172a', color: 'white', padding: '8px 24px', border: 'none', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>[ CONFIRMAR ]</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .sentinel-card { background: #ffffff; border: 1px solid #e2e8f0; padding: 32px; border-radius: 4px; }
                .sentinel-section-title { font-family: 'Barlow Condensed', sans-serif !important; font-size: 18px !important; font-weight: 700 !important; text-transform: uppercase !important; color: #1e293b !important; margin-bottom: 24px !important; display: flex; align-items: center; gap: 12px; }
                .sentinel-section-title::before { content: ''; width: 4px; height: 18px; background: #3b82f6; display: inline-block; }
                label { font-family: 'JetBrains Mono', monospace !important; font-size: 10px !important; font-weight: 600 !important; color: #64748b !important; letter-spacing: 0.1em !important; }
            `}</style>
        </form>
    );
}