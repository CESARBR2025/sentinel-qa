/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react'; // Añadidos useCallback, useRef
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api"; // Nuevo
import {
  MessageSquare, User, AlertTriangle, MapPin,
  ClipboardCheck, Clock, Shield, Send, Search, Check, Loader2, Plus, X,
  FileText, Gavel, Car, Hash, Archive
} from 'lucide-react';
import { createRecorridoCompleto } from "@/lib/incidentes/actions";
import { useEmpleado } from '@/hooks/useEmpleado'; // Importar el hook

import { DashboardHeader } from "@/components/partials/Header";

// COMPONENTE DE CAMPO INTERNO (Reemplaza a RolField para evitar errores)
const SentinelField = ({ label, icon: Icon, as = 'input', name, fullWidth = false, ...props }: any) => {
  const Component = as;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: fullWidth ? 'span 3' : 'span 1' }}>
      <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && <Icon size={14} style={{ position: 'absolute', left: '12px', color: '#94a3b8', zIndex: 1 }} />}
        <Component
          {...props}
          name={name}
          style={{
            width: '100%',
            padding: `12px 12px 12px ${Icon ? '40px' : '12px'}`,
            background: props.disabled ? '#f8fafc' : '#ffffff',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #3e5171',
            borderRadius: '2px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            outline: 'none',
            minHeight: as === 'textarea' ? '120px' : 'auto',
            ...props.style
          }}
        />
      </div>
    </div>
  );
};



export default function ReporteRecorridoZen({ user, catalogos }: { user: any, catalogos: any }) {
  // Hook e instancia para el MANDO (Ya lo tienes)
  const empMando = useEmpleado();
  const [nominaMando, setNominaMando] = useState("");
  const [nombreMando, setNombreMando] = useState("");

  // --- NUEVO: Hook e instancia para el OFICIAL QUE REPORTA ---
  const empOficial = useEmpleado();
  const [nominaOficial, setNominaOficial] = useState("");
  const [nombreOficial, setNombreOficial] = useState("");

  // Estados seguimientos
  const [hayOrdenAprehension, setHayOrdenAprehension] = useState(false)
  const [ordenesAprehension, setOrdenesAprehension] = useState<{ fecha: string; nombrePersona: string; observaciones: string; estatus: string; nombreSeguimiento: string }[]>([])

  const [hayHidrocarburo, setHayHidrocarburo] = useState(false)
  const [hidrocarburos, setHidrocarburos] = useState<{ fecha: string; nombrePersona: string; datosVehiculo: string; litrosExtraccion: string; nombreToma: string; observaciones: string; nombreSeguimiento: string }[]>([])

  const [hayArmaFuego, setHayArmaFuego] = useState(false)
  const [armasFuego, setArmasFuego] = useState<{ fecha: string; datos: string; cartuchos: string; observaciones: string; nombreSeguimiento: string }[]>([])

  const [hayDroga, setHayDroga] = useState(false)
  const [drogas, setDrogas] = useState<{ fecha: string; cantidad: string; nombre: string; observaciones: string; nombreSeguimiento: string }[]>([])

  const [apoyoFiestasPatronales, setApoyoFiestasPatronales] = useState(false)
  const [operativosMetropolitano, setOperativosMetropolitano] = useState(false)
  const [eco8, setEco8] = useState(false)
  const [alcoholimetria, setAlcoholimetria] = useState(false)
  const [motocicletas, setMotocicletas] = useState(false)
  const [apoyoActuarios, setApoyoActuarios] = useState(false)
  const [apoyoCateosFgr, setApoyoCateosFgr] = useState(false)
  const [apoyoCateosFge, setApoyoCateosFge] = useState(false)

  // Función para buscar al Oficial
  const buscarOficial = async () => {
    if (!nominaOficial) return;
    await empOficial.buscarPorNomina(nominaOficial);
  };

  // Efecto para asignar el nombre del oficial cuando se encuentre
  useEffect(() => {
    if (empOficial.empleado) {
      setNombreOficial(empOficial.empleado.nombre);
    }
  }, [empOficial.empleado]);

  // 1. Esta función solo dispara la búsqueda
  const buscarMando = async () => {
    if (!nominaMando) return;
    await empMando.buscarPorNomina(nominaMando);
  };

  // 2. Este efecto reacciona cuando el hook encuentra al empleado
  useEffect(() => {
    if (empMando.empleado) {
      setNombreMando(empMando.empleado.nombre);
    }
  }, [empMando.empleado]); // Se ejecuta cada vez que el "empleado" del hook cambie


  const [isAnonimo, setIsAnonimo] = useState(false);

  const [tipoIncidente, setTipoIncidente] = useState("");
  const [tieneDetencion, setTieneDetencion] = useState("false");
  const [tieneCateo, setTieneCateo] = useState("false");
  const [tieneVehiculo, setTieneVehiculo] = useState("false");
  const [datosPositivos, setDatosPositivos] = useState("positivo");

  const [detenidos, setDetenidos] = useState<string[]>([""]);

  // Funciones para manejar los detenidos
  const manejarCambioDetenido = (index: number, valor: string) => {
    const nuevos = [...detenidos];
    nuevos[index] = valor;
    setDetenidos(nuevos);
  };

  const agregarDetenido = () => setDetenidos([...detenidos, ""]);

  const eliminarDetenido = (index: number) => {
    if (detenidos.length > 1) {
      setDetenidos(detenidos.filter((_, i) => i !== index));
    } else {
      setDetenidos([""]); // Si es el último, solo lo limpia
    }
  };

  const libraries: ("places")[] = ["places"]; // Nuevo

  // 1. Cargar API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries
  });

  // 2. Estados de Ubicación
  const [coords, setCoords] = useState({ lat: 20.3889, lng: -99.9961 });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [direccion, setDireccion] = useState({ calle: "", numeroExterior: "", colonia: "" });
  // Estados nuevos
  const [hayRobo, setHayRobo] = useState("false")
  const [numVehiculos, setNumVehiculos] = useState(0)
  const [vehiculos, setVehiculos] = useState<{ tipo: string; placas: string; serie: string; color: string; destino: string }[]>([])
  const [cateoCoords, setCateoCoords] = useState({ lat: 20.3889, lng: -99.9961 })
  const [cateoDireccion, setCateoDireccion] = useState({ calle: '', colonia: '' })
  const cateAutoRef = useRef<google.maps.places.Autocomplete | null>(null)

  // 3. Funciones de Geocodificación
  const buscarDireccion = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        let calle = "", numero = "", colonia = "";
        results[0].address_components.forEach((comp) => {
          if (comp.types.includes("route")) calle = comp.long_name;
          if (comp.types.includes("street_number")) numero = comp.long_name;
          if (comp.types.includes("sublocality") || comp.types.includes("neighborhood")) colonia = comp.long_name;
        });
        setDireccion({ calle, numeroExterior: numero, colonia });
      }
    });
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      const loc = place.geometry.location;
      const newPos = { lat: loc.lat(), lng: loc.lng() };
      setCoords(newPos);
      map?.panTo(newPos);
      let calle = "", numero = "", colonia = "";
      place.address_components?.forEach((comp) => {
        if (comp.types.includes("route")) calle = comp.long_name;
        if (comp.types.includes("street_number")) numero = comp.long_name;
        if (comp.types.includes("sublocality") || comp.types.includes("neighborhood")) colonia = comp.long_name;
      });
      setDireccion({ calle, numeroExterior: numero, colonia });
    }
  };

  const buscarDireccionCateo = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        let calle = '', colonia = ''
        results[0].address_components.forEach((comp) => {
          if (comp.types.includes('route')) calle = comp.long_name
          if (comp.types.includes('sublocality') || comp.types.includes('neighborhood')) colonia = comp.long_name
        })
        setCateoDireccion({ calle, colonia })
      }
    })
  }

  const onCateoPlaceChanged = () => {
    const place = cateAutoRef.current?.getPlace()
    if (place && place.geometry && place.geometry.location) {
      const loc = place.geometry.location
      const p = { lat: loc.lat(), lng: loc.lng() }
      setCateoCoords(p)
      let calle = '', colonia = ''
      place.address_components?.forEach((comp) => {
        if (comp.types.includes('route')) calle = comp.long_name
        if (comp.types.includes('sublocality') || comp.types.includes('neighborhood')) colonia = comp.long_name
      })
      setCateoDireccion({ calle, colonia })
    }
  }

  const [autoridadSeleccionada, setAutoridadSeleccionada] = useState("MINISTERIO PÚBLICO");

  return (
    <form action={createRecorridoCompleto}>
      <input type="hidden" name="canal" value="radio" />
      <input type="hidden" name="tipoReporte" value="normal" />
      <input type="hidden" name="estatus" value="en_despacho" />
      <input type="hidden" name="apoyo_fiestas_patronales" value={String(apoyoFiestasPatronales)} />
      <input type="hidden" name="operativos_metropolitano" value={String(operativosMetropolitano)} />
      <input type="hidden" name="eco8" value={String(eco8)} />
      <input type="hidden" name="alcoholimetria" value={String(alcoholimetria)} />
      <input type="hidden" name="motocicletas" value={String(motocicletas)} />
      <input type="hidden" name="apoyo_actuarios" value={String(apoyoActuarios)} />
      <input type="hidden" name="apoyo_cateos_fgr" value={String(apoyoCateosFgr)} />
      <input type="hidden" name="apoyo_cateos_fge" value={String(apoyoCateosFge)} />
      <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

        <DashboardHeader user={user} />

        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>

          {/* ENCABEZADO */}
          <div style={{ marginBottom: '40px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase', fontWeight: 600 }}>
              Plataforma de Prevención
            </span>
            <h1 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800, fontSize: 32, letterSpacing: '0.02em',
              textTransform: 'uppercase', margin: '4px 0 0 0', color: '#0f172a'
            }}>
              REPORTES DENTRO DE <span style={{ color: '#3e5171' }}>RECORRIDOS</span>
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* SECCIÓN 01: ORIGEN */}
            <section className="sentinel-card">
              <h2 className="sentinel-section-title">Origen e Identificación</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>

                <SentinelField label="Canal de Origen" icon={MessageSquare} value="RADIO" disabled />

                {/* --- BUSCADOR DE NÓMINA PARA EL OFICIAL --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Nómina Oficial que Reporta
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Hash size={14} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8', zIndex: 1 }} />
                      <input
                        type="text"
                        placeholder="Nómina..."
                        value={nominaOficial}
                        onChange={(e) => setNominaOficial(e.target.value)}
                        onBlur={buscarOficial}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); buscarOficial(); } }}
                        style={{
                          width: '100%',
                          padding: '12px 12px 12px 40px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderLeft: '4px solid #3e5171',
                          borderRadius: '2px',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={buscarOficial}
                      style={{ padding: '0 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer', borderRadius: '2px' }}
                    >
                      {empOficial.cargando ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    </button>
                  </div>
                  {empOficial.error && <span style={{ color: '#dc2626', fontSize: '10px', fontFamily: 'JetBrains Mono' }}>{empOficial.error}</span>}
                </div>

                {/* Nombre del oficial (Se autocompleta) */}
                <SentinelField
                  label="Nombre del Oficial que Reporta"
                  name="nombreOficial"
                  icon={Shield}
                  placeholder="Se llenará automáticamente..."
                  required
                  value={nombreOficial}
                  onChange={(e: any) => setNombreOficial(e.target.value)}
                />

                <SentinelField label="Folio CAD" name="folioCad" icon={Hash} placeholder="Número CAD..." />

                <SentinelField
                  label="Quien Capturó"
                  icon={User}
                  value={`${user?.name || ''} ${user?.apellido || ''}`.trim()}
                  disabled
                />

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', gridColumn: 'span 1' }}>
                  {/* Espacio ajustado para que no descuadre la fila */}
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', gridColumn: 'span 2' }}>
                  <div style={{ flexGrow: 1 }}>
                    <SentinelField
                      label="Nombre del Reportante (Si aplica)"
                      name="nombreReportante"
                      icon={User}
                      placeholder={isAnonimo ? "MODO ANÓNIMO ACTIVO" : "Nombre del ciudadano..."}
                      disabled={isAnonimo}
                    />
                  </div>
                  {!isAnonimo && (
                    <SentinelField label="Teléfono del Reportante" name="telefonoReportante"
                      placeholder="10 dígitos" type="tel" />
                  )}
                  <input type="hidden" name="anonimo" value={isAnonimo ? "true" : "false"} />
                  <button type="button" onClick={() => setIsAnonimo(!isAnonimo)} className="sentinel-btn-toggle">
                    {isAnonimo ? '[ ANÓNIMO: ON ]' : '[ ANÓNIMO: OFF ]'}
                  </button>
                </div>
              </div>
            </section>

            {/* SECCIÓN 02: EL INCIDENTE */}
            <section className="sentinel-card">
              <h2 className="sentinel-section-title">Detalles del Incidente</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <SentinelField
                  label="Tipo de Incidente"
                  name="tipoIncidenteId"
                  as="select"
                  required
                  value={tipoIncidente}
                  onChange={(e: any) => setTipoIncidente(e.target.value)}
                >
                  <option value="">SELECCIONE...</option>
                  {catalogos.incidentes.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </SentinelField>

                <SentinelField label="Tipo de Emergencia" name="tipoEmergenciaId" as="select" required>
                  <option value="">SELECCIONE...</option>
                  {catalogos.emergencias.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </SentinelField>

                <SentinelField label="Prioridad" name="prioridadId" as="select" required>
                  <option value="">SELECCIONE...</option>
                  {catalogos.prioridades.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </SentinelField>
                <div></div>

                <SentinelField label="Fecha y Hora de Inicio" icon={Clock} type="datetime-local" name="fechaHoraInicio" />
                <SentinelField label="Fecha y Hora de Fin" icon={Clock} type="datetime-local" name="fechaHoraFin" />

                <SentinelField name="descripcion" label="Incidente (Descripción)" as="textarea" fullWidth placeholder="Descripción breve..." />
                <SentinelField label="Contenido del Reporte" as="textarea" fullWidth placeholder="Relatoría extensa de los hechos... " name="contenidoReporte" />
              </div>
            </section>

            {/* SECCIÓN 03: UBICACIÓN ACTUALIZADA */}
            <section className="sentinel-card">
              <h2 className="sentinel-section-title">Ubicación</h2>

              {/* MAPA Y BUSCADOR */}
              <div style={{ marginBottom: '24px', gridColumn: 'span 3' }}>
                {isLoaded ? (
                  <>
                    <label style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#64748b', marginBottom: '8px', display: 'block' }}>Buscador de Dirección</label>
                    <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceChanged}>
                      <input
                        type="text"
                        placeholder="Buscar dirección en el mapa..."
                        style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3e5171', marginBottom: '12px' }}
                      />
                    </Autocomplete>
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '300px', borderRadius: '2px' }}
                      center={coords}
                      zoom={15}
                      onLoad={(map) => setMap(map)}
                      onClick={(e) => { if (e.latLng) { const p = { lat: e.latLng.lat(), lng: e.latLng.lng() }; setCoords(p); buscarDireccion(p.lat, p.lng); } }}
                      options={{ streetViewControl: false, mapTypeControl: false }}
                    >
                      <Marker position={coords} draggable onDragEnd={(e) => { if (e.latLng) { const p = { lat: e.latLng.lat(), lng: e.latLng.lng() }; setCoords(p); buscarDireccion(p.lat, p.lng); } }} />
                    </GoogleMap>
                    <input type="hidden" name="latitud" value={coords.lat} />
                    <input type="hidden" name="longitud" value={coords.lng} />
                  </>
                ) : <p>Cargando Mapa...</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <SentinelField
                  label="Calle" name="calle" icon={MapPin}
                  value={direccion.calle} onChange={(e: any) => setDireccion({ ...direccion, calle: e.target.value })}
                />
                <SentinelField
                  label="Número Exterior" name="numero_exterior" icon={Hash}
                  value={direccion.numeroExterior} onChange={(e: any) => setDireccion({ ...direccion, numeroExterior: e.target.value })}
                  autoComplete="off"
                />
                <SentinelField
                  label="Colonia" name="colonia" icon={MapPin}
                  value={direccion.colonia} onChange={(e: any) => setDireccion({ ...direccion, colonia: e.target.value })}
                />

                <SentinelField label="Número Interior" name="numero_interior" placeholder="Depto / Local" autoComplete="address-level4" />
                <SentinelField label="Entre Calles" name="entreCalles" icon={MapPin} placeholder="Calle A y Calle B" />
                <SentinelField label="Referencia" name="referenciaUbicacion" icon={MapPin} placeholder="Ej. Frente a la tienda..." />

                {/* SELECT DINÁMICO POSITIVO/NEGATIVO */}
                <SentinelField
                  label="Datos Positivos/Negativos"
                  name={datosPositivos !== "otro" ? "datosPositivosNegativos" : ""}
                  as="select"
                  icon={Search}
                  value={datosPositivos}
                  onChange={(e: any) => setDatosPositivos(e.target.value)}
                >
                  <option value="positivo">SÍ (POSITIVO)</option>
                  <option value="negativo">NO (NEGATIVO)</option>
                  <option value="otro">OTRO (ESPECIFICAR)</option>
                </SentinelField>

                {datosPositivos === "otro" && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <SentinelField
                      label="Especifique el resultado"
                      name="datosPositivosNegativos"
                      icon={FileText}
                      placeholder="Escriba aquí la observación..."
                    />
                  </div>
                )}
              </div>
            </section>

            {/* SECCIÓN 04: OPERATIVIDAD */}
            <section className="sentinel-card">
              <h2 className="sentinel-section-title">Intervención y Detenciones</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <div style={{ gridColumn: 'span 3' }}>
                  <SentinelField label="Acciones Realizadas" name="accionesRealizadas" as="textarea" placeholder="¿Qué hizo la unidad al llegar?" />
                </div>

                <SentinelField label="¿Hubo Detención?" name="hayDetencion" as="select" value={tieneDetencion} onChange={(e: any) => setTieneDetencion(e.target.value)}>
                  <option value="false">NO</option>
                  <option value="true">SÍ</option>
                </SentinelField>

                {tieneDetencion === "true" && (
                  <>
                    {/* LISTA DINÁMICA DE DETENIDOS */}
                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Nombres de los Detenidos
                      </label>

                      {detenidos.map((nombre, index) => (
                        <div key={index} style={{ display: 'flex', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <SentinelField
                              label=""
                              placeholder={`Nombre del detenido ${index + 1}`}
                              icon={User}
                              value={nombre}
                              onChange={(e: any) => manejarCambioDetenido(index, e.target.value)}
                            />
                          </div>
                          <button type="button" onClick={() => eliminarDetenido(index)} style={{ height: '46px', padding: '0 12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', cursor: 'pointer', borderRadius: '2px' }}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}

                      <button type="button" onClick={agregarDetenido} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', background: '#eff1f3', color: '#1f355a', border: '1px solid #c3c8d2', padding: '8px 16px', borderRadius: '2px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 600 }}>
                        <Plus size={14} /> AÑADIR OTRO
                      </button>

                      {/* ESTA ES LA CLAVE: Convierte el array a un string separado por comas para el backend */}
                      <input
                        type="hidden"
                        name="nombreDetenidos"
                        value={detenidos.filter(n => n.trim() !== "").join(", ")}
                      />
                    </div>

                    {/* AUTORIDAD QUE RECIBE */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <SentinelField
                        label="Autoridad que recibe"
                        name={autoridadSeleccionada !== "OTRO" ? "autoridadRecibe" : ""}
                        as="select"
                        icon={Shield}
                        value={autoridadSeleccionada}
                        onChange={(e: any) => setAutoridadSeleccionada(e.target.value)}
                      >
                        <option value="MINISTERIO PÚBLICO">MINISTERIO PÚBLICO</option>
                        <option value="JUZGADO CÍVICO">JUZGADO CÍVICO</option>
                        <option value="FISCALÍA GENERAL">FISCALÍA GENERAL</option>
                        <option value="OTRO">OTRO (ESPECIFICAR)</option>
                      </SentinelField>

                      {autoridadSeleccionada === "OTRO" && (
                        <SentinelField
                          label="Especifique Autoridad"
                          name="autoridadRecibe" // Se envía con el mismo nombre que espera el backend
                          placeholder="Nombre de la autoridad..."
                          icon={FileText}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* SECCIÓN 05: BIENES Y CATEOS */}
            <section className="sentinel-card">
              <h2 className="sentinel-section-title">Aseguramientos y Cateos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>

                {/* Objetos recuperados */}
                <div style={{ gridColumn: 'span 3' }}>
                  <SentinelField label="Objetos Recuperados" name="objetosRecuperados" as="textarea" placeholder="Descripción de bienes asegurados..." />
                </div>

                {/* ¿Hubo robo? */}
                <SentinelField label="¿Hubo Robo?" name="hayRobo" as="select" value={hayRobo} onChange={(e: any) => setHayRobo(e.target.value)}>
                  <option value="false">NO</option>
                  <option value="true">SÍ</option>
                </SentinelField>

                {hayRobo === "true" && (
                  <SentinelField label="Monto de lo Robado (Solo números)" name="montoRobo" type="number" placeholder="0" />
                )}

                {/* ¿Aseguró Vehículo? */}
                <SentinelField label="¿Aseguró Vehículo?" name="hayVehiculo" as="select" value={tieneVehiculo} onChange={(e: any) => setTieneVehiculo(e.target.value)}>
                  <option value="false">NO</option>
                  <option value="true">SÍ</option>
                </SentinelField>

                {tieneVehiculo === "true" && (
                  <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Cantidad de Vehículos Asegurados
                      </span>
                      <select
                        value={numVehiculos}
                        onChange={(e) => {
                          const n = Number(e.target.value)
                          setNumVehiculos(n)
                          setVehiculos(Array.from({ length: n }, (_, i) => vehiculos[i] ?? { tipo: '', placas: '', serie: '', color: '', destino: '' }))
                        }}
                        style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderLeft: '3px solid #3e5171', borderRadius: 2, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, background: '#ffffff', outline: 'none', minWidth: 60 }}
                      >
                        <option value={0}>0</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>

                    {vehiculos.map((v, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#3e5171', fontWeight: 600, minWidth: 20 }}>#{i + 1}</span>
                        <select value={v.tipo} onChange={(e) => { const next = [...vehiculos]; next[i] = { ...next[i], tipo: e.target.value }; setVehiculos(next) }}
                          style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', background: '#fff' }}>
                          <option value="">Tipo</option>
                          <option value="automovil">Automóvil</option>
                          <option value="camioneta">Camioneta</option>
                          <option value="trans. publico">Trans. Público</option>
                          <option value="trans. carga">Trans. Carga</option>
                          <option value="motocicleta">Motocicleta</option>
                        </select>
                        <input value={v.placas} onChange={(e) => { const next = [...vehiculos]; next[i] = { ...next[i], placas: e.target.value }; setVehiculos(next) }}
                          placeholder="Placas" style={{ flex: 1, padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none' }} />
                        <input value={v.serie} onChange={(e) => { const next = [...vehiculos]; next[i] = { ...next[i], serie: e.target.value }; setVehiculos(next) }}
                          placeholder="Núm. Serie" style={{ flex: 1, padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none' }} />
                        <input value={v.color} onChange={(e) => { const next = [...vehiculos]; next[i] = { ...next[i], color: e.target.value }; setVehiculos(next) }}
                          placeholder="Color" style={{ flex: 1, padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none' }} />
                        <select value={v.destino} onChange={(e) => { const next = [...vehiculos]; next[i] = { ...next[i], destino: e.target.value }; setVehiculos(next) }}
                          style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', background: '#fff' }}>
                          <option value="">Destino</option>
                          <option value="CORRALON MW">CORRALON MW</option>
                          <option value="CORRALON MEJIA">CORRALON MEJIA</option>
                        </select>
                      </div>
                    ))}

                    {/* Campo oculto con JSON de vehículos */}
                    <input type="hidden" name="vehiculos" value={JSON.stringify(vehiculos)} />
                  </div>
                )}

                {/* ¿Hubo Cateo? */}
                <SentinelField label="¿Hubo Cateo?" name="hayCateo" as="select" value={tieneCateo} onChange={(e: any) => setTieneCateo(e.target.value)}>
                  <option value="false">NO</option>
                  <option value="true">SÍ</option>
                </SentinelField>

                {tieneCateo === "true" && (
                  <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
                        Domicilio Cateado — Marcar en el mapa
                      </label>
                      {isLoaded ? (
                        <>
                          <Autocomplete onLoad={(ref) => (cateAutoRef.current = ref)} onPlaceChanged={onCateoPlaceChanged}>
                            <input
                              type="text"
                              placeholder="Buscar domicilio cateado..."
                              style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3e5171', marginBottom: 12, fontFamily: 'Inter,sans-serif', fontSize: 14, outline: 'none' }}
                            />
                          </Autocomplete>
                          <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '250px', borderRadius: 2 }}
                            center={cateoCoords}
                            zoom={15}
                            onClick={(e) => { if (e.latLng) { const p = { lat: e.latLng.lat(), lng: e.latLng.lng() }; setCateoCoords(p); buscarDireccionCateo(p.lat, p.lng) } }}
                            options={{ streetViewControl: false, mapTypeControl: false }}
                          >
                            <Marker position={cateoCoords} draggable
                              onDragEnd={(e) => { if (e.latLng) { const p = { lat: e.latLng.lat(), lng: e.latLng.lng() }; setCateoCoords(p); buscarDireccionCateo(p.lat, p.lng) } }} />
                          </GoogleMap>
                          <input type="hidden" name="cateoCalle" value={cateoDireccion.calle} />
                          <input type="hidden" name="cateoColonia" value={cateoDireccion.colonia} />
                          <input type="hidden" name="cateoLatitud" value={cateoCoords.lat} />
                          <input type="hidden" name="cateoLongitud" value={cateoCoords.lng} />
                          <input type="hidden" name="domicilioCateado" value={`${cateoDireccion.calle}${cateoDireccion.colonia ? `, ${cateoDireccion.colonia}` : ''}`} />
                        </>
                      ) : <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#94a3b8' }}>Cargando mapa...</p>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                      <SentinelField label="Calle (Cateo)" value={cateoDireccion.calle} onChange={(e: any) => setCateoDireccion({ ...cateoDireccion, calle: e.target.value })} />
                      <SentinelField label="Colonia (Cateo)" value={cateoDireccion.colonia} onChange={(e: any) => setCateoDireccion({ ...cateoDireccion, colonia: e.target.value })} />
                      <SentinelField label="Resultado del Cateo" name="resultadoCateo" placeholder="¿Qué se encontró?" />
                    </div>
                  </div>
                )}

                {/* Buscador Mando */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Nómina del Mando
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Hash size={14} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8', zIndex: 1 }} />
                      <input type="text" placeholder="Escriba nómina..." value={nominaMando}
                        onChange={(e) => setNominaMando(e.target.value)}
                        onBlur={buscarMando}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); buscarMando() } }}
                        style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3e5171', borderRadius: '2px', fontFamily: 'Inter,sans-serif', fontSize: '14px', outline: 'none' }} />
                    </div>
                    <button type="button" onClick={buscarMando} style={{ padding: '0 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer', borderRadius: '2px' }}>
                      {empMando.cargando ? <Loader2 size={16} /> : <Search size={16} />}
                    </button>
                  </div>
                  {empMando.error && <span style={{ color: '#dc2626', fontSize: '10px', fontFamily: 'JetBrains Mono' }}>{empMando.error}</span>}
                </div>

                <SentinelField label="Policía a Cargo (Mando)" name="policiaCargo" icon={Shield} placeholder="Nombre del mando responsable" value={nombreMando} onChange={(e: any) => setNombreMando(e.target.value)} />
                <SentinelField label="Personal que ingresó a CI" name="personalIngresoCi" icon={User} placeholder="Nombre del agente en fiscalía" />

              </div>
            </section>

            {/* SECCIÓN 06: SEGUIMIENTOS */}
            <section className="sentinel-card">
              <h2 className="sentinel-section-title">Seguimientos</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <input type="hidden" name="hay_orden_aprehension" value={String(hayOrdenAprehension)} />
                <input type="hidden" name="ordenes_aprehension" value={JSON.stringify(ordenesAprehension)} />
                <input type="hidden" name="hay_hidrocarburo" value={String(hayHidrocarburo)} />
                <input type="hidden" name="hidrocarburos" value={JSON.stringify(hidrocarburos)} />
                <input type="hidden" name="hay_arma_fuego" value={String(hayArmaFuego)} />
                <input type="hidden" name="armas_fuego" value={JSON.stringify(armasFuego)} />
                <input type="hidden" name="hay_droga" value={String(hayDroga)} />
                <input type="hidden" name="drogas" value={JSON.stringify(drogas)} />
                {/* ÓRDENES DE APREHENSIÓN */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      ¿Órdenes de Aprehensión?
                    </span>
                    <button type="button" onClick={() => setHayOrdenAprehension(!hayOrdenAprehension)} className="sentinel-btn-toggle"
                      style={{ background: hayOrdenAprehension ? '#3e5171' : '#ffffff', color: hayOrdenAprehension ? '#ffffff' : '#64748b', borderColor: hayOrdenAprehension ? '#3e5171' : '#e2e8f0' }}>
                      {hayOrdenAprehension ? '[ SÍ ]' : '[ NO ]'}
                    </button>
                  </div>
                  {hayOrdenAprehension && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {ordenesAprehension.map((o, i) => (
                        <div key={i} style={{ padding: 16, border: '1px solid #e2e8f0', borderLeft: '3px solid #3e5171', borderRadius: 2, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#3e5171', fontWeight: 700, gridColumn: 'span 3' }}>#{i + 1}</span>
                          {(['fecha', 'nombrePersona', 'estatus', 'nombreSeguimiento'] as const).map(campo => (
                            <div key={campo}>
                              <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>
                                {campo === 'fecha' ? 'Fecha' : campo === 'nombrePersona' ? 'Nombre Persona' : campo === 'estatus' ? 'Estatus' : 'Nombre Seguimiento'}
                              </label>
                              <input type={campo === 'fecha' ? 'date' : 'text'}
                                value={o[campo]}
                                onChange={(e) => { const next = [...ordenesAprehension]; next[i][campo] = e.target.value; setOrdenesAprehension(next) }}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none' }} />
                            </div>
                          ))}
                          <div style={{ gridColumn: 'span 3' }}>
                            <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Observaciones</label>
                            <textarea value={o.observaciones} onChange={(e) => { const next = [...ordenesAprehension]; next[i].observaciones = e.target.value; setOrdenesAprehension(next) }}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', minHeight: 60, resize: 'vertical' }} />
                          </div>
                          <button type="button" onClick={() => setOrdenesAprehension(ordenesAprehension.filter((_, j) => j !== i))}
                            style={{ gridColumn: 'span 3', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textAlign: 'left' }}>
                            ✕ ELIMINAR
                          </button>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => setOrdenesAprehension([...ordenesAprehension, { fecha: '', nombrePersona: '', observaciones: '', estatus: '', nombreSeguimiento: '' }])}
                        className="sentinel-btn-toggle" style={{ alignSelf: 'flex-start' }}>
                        + AGREGAR ORDEN
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0' }} />

                {/* HIDROCARBUROS */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      ¿Detención Delito Hidrocarburo?
                    </span>
                    <button type="button" onClick={() => setHayHidrocarburo(!hayHidrocarburo)} className="sentinel-btn-toggle"
                      style={{ background: hayHidrocarburo ? '#3e5171' : '#ffffff', color: hayHidrocarburo ? '#ffffff' : '#64748b', borderColor: hayHidrocarburo ? '#3e5171' : '#e2e8f0' }}>
                      {hayHidrocarburo ? '[ SÍ ]' : '[ NO ]'}
                    </button>
                  </div>
                  {hayHidrocarburo && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {hidrocarburos.map((h, i) => (
                        <div key={i} style={{ padding: 16, border: '1px solid #e2e8f0', borderLeft: '3px solid #3e5171', borderRadius: 2, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#3e5171', fontWeight: 700, gridColumn: 'span 3' }}>#{i + 1}</span>
                          {(['fecha', 'nombrePersona', 'datosVehiculo', 'litrosExtraccion', 'nombreToma', 'nombreSeguimiento'] as const).map(campo => (
                            <div key={campo}>
                              <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>
                                {campo === 'fecha' ? 'Fecha' : campo === 'nombrePersona' ? 'Nombre Persona' : campo === 'datosVehiculo' ? 'Datos Vehículo' : campo === 'litrosExtraccion' ? 'Litros Extracción' : campo === 'nombreToma' ? 'Nombre Toma Clandestina' : 'Nombre Seguimiento'}
                              </label>
                              <input type={campo === 'fecha' ? 'date' : 'text'}
                                value={h[campo]}
                                onChange={(e) => { const next = [...hidrocarburos]; next[i][campo] = e.target.value; setHidrocarburos(next) }}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none' }} />
                            </div>
                          ))}
                          <div style={{ gridColumn: 'span 3' }}>
                            <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Observaciones</label>
                            <textarea value={h.observaciones} onChange={(e) => { const next = [...hidrocarburos]; next[i].observaciones = e.target.value; setHidrocarburos(next) }}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', minHeight: 60, resize: 'vertical' }} />
                          </div>
                          <button type="button" onClick={() => setHidrocarburos(hidrocarburos.filter((_, j) => j !== i))}
                            style={{ gridColumn: 'span 3', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textAlign: 'left' }}>
                            ✕ ELIMINAR
                          </button>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => setHidrocarburos([...hidrocarburos, { fecha: '', nombrePersona: '', datosVehiculo: '', litrosExtraccion: '', nombreToma: '', observaciones: '', nombreSeguimiento: '' }])}
                        className="sentinel-btn-toggle" style={{ alignSelf: 'flex-start' }}>
                        + AGREGAR REGISTRO
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0' }} />

                {/* ARMAS DE FUEGO */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      ¿Armas de Fuego?
                    </span>
                    <button type="button" onClick={() => setHayArmaFuego(!hayArmaFuego)} className="sentinel-btn-toggle"
                      style={{ background: hayArmaFuego ? '#3e5171' : '#ffffff', color: hayArmaFuego ? '#ffffff' : '#64748b', borderColor: hayArmaFuego ? '#3e5171' : '#e2e8f0' }}>
                      {hayArmaFuego ? '[ SÍ ]' : '[ NO ]'}
                    </button>
                  </div>
                  {hayArmaFuego && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {armasFuego.map((a, i) => (
                        <div key={i} style={{ padding: 16, border: '1px solid #e2e8f0', borderLeft: '3px solid #3e5171', borderRadius: 2, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#3e5171', fontWeight: 700, gridColumn: 'span 3' }}>#{i + 1}</span>
                          {(['fecha', 'datos', 'cartuchos', 'nombreSeguimiento'] as const).map(campo => (
                            <div key={campo}>
                              <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>
                                {campo === 'fecha' ? 'Fecha' : campo === 'datos' ? 'Datos del Arma' : campo === 'cartuchos' ? 'Cartuchos' : 'Nombre Seguimiento'}
                              </label>
                              <input type={campo === 'fecha' ? 'date' : 'text'}
                                value={a[campo]}
                                onChange={(e) => { const next = [...armasFuego]; next[i][campo] = e.target.value; setArmasFuego(next) }}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none' }} />
                            </div>
                          ))}
                          <div style={{ gridColumn: 'span 3' }}>
                            <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Observaciones</label>
                            <textarea value={a.observaciones} onChange={(e) => { const next = [...armasFuego]; next[i].observaciones = e.target.value; setArmasFuego(next) }}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', minHeight: 60, resize: 'vertical' }} />
                          </div>
                          <button type="button" onClick={() => setArmasFuego(armasFuego.filter((_, j) => j !== i))}
                            style={{ gridColumn: 'span 3', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textAlign: 'left' }}>
                            ✕ ELIMINAR
                          </button>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => setArmasFuego([...armasFuego, { fecha: '', datos: '', cartuchos: '', observaciones: '', nombreSeguimiento: '' }])}
                        className="sentinel-btn-toggle" style={{ alignSelf: 'flex-start' }}>
                        + AGREGAR ARMA
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0' }} />

                {/* DOSIS DE DROGA */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      ¿Dosis de Droga?
                    </span>
                    <button type="button" onClick={() => setHayDroga(!hayDroga)} className="sentinel-btn-toggle"
                      style={{ background: hayDroga ? '#3e5171' : '#ffffff', color: hayDroga ? '#ffffff' : '#64748b', borderColor: hayDroga ? '#3e5171' : '#e2e8f0' }}>
                      {hayDroga ? '[ SÍ ]' : '[ NO ]'}
                    </button>
                  </div>
                  {hayDroga && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {drogas.map((d, i) => (
                        <div key={i} style={{ padding: 16, border: '1px solid #e2e8f0', borderLeft: '3px solid #3e5171', borderRadius: 2, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#3e5171', fontWeight: 700, gridColumn: 'span 3' }}>#{i + 1}</span>
                          {(['fecha', 'cantidad', 'nombre', 'nombreSeguimiento'] as const).map(campo => (
                            <div key={campo}>
                              <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>
                                {campo === 'fecha' ? 'Fecha' : campo === 'cantidad' ? 'Cantidad' : campo === 'nombre' ? 'Nombre Droga' : 'Nombre Seguimiento'}
                              </label>
                              <input type={campo === 'fecha' ? 'date' : 'text'}
                                value={d[campo]}
                                onChange={(e) => { const next = [...drogas]; next[i][campo] = e.target.value; setDrogas(next) }}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none' }} />
                            </div>
                          ))}
                          <div style={{ gridColumn: 'span 3' }}>
                            <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Observaciones</label>
                            <textarea value={d.observaciones} onChange={(e) => { const next = [...drogas]; next[i].observaciones = e.target.value; setDrogas(next) }}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', minHeight: 60, resize: 'vertical' }} />
                          </div>
                          <button type="button" onClick={() => setDrogas(drogas.filter((_, j) => j !== i))}
                            style={{ gridColumn: 'span 3', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textAlign: 'left' }}>
                            ✕ ELIMINAR
                          </button>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => setDrogas([...drogas, { fecha: '', cantidad: '', nombre: '', observaciones: '', nombreSeguimiento: '' }])}
                        className="sentinel-btn-toggle" style={{ alignSelf: 'flex-start' }}>
                        + AGREGAR DOSIS
                      </button>
                    </div>
                  )}
                </div>

                <section className="sentinel-card">
                  <h2 className="sentinel-section-title">Apoyos</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                    {([
                      { val: apoyoFiestasPatronales, set: setApoyoFiestasPatronales, label: 'Apoyo a Fiestas Patronales' },
                      { val: operativosMetropolitano, set: setOperativosMetropolitano, label: 'Operativos / Metropolitano' },
                      { val: eco8, set: setEco8, label: 'ECO 8' },
                      { val: alcoholimetria, set: setAlcoholimetria, label: 'Alcoholimetría' },
                      { val: motocicletas, set: setMotocicletas, label: 'Motocicletas' },
                      { val: apoyoActuarios, set: setApoyoActuarios, label: 'Apoyo a Actuarios' },
                      { val: apoyoCateosFgr, set: setApoyoCateosFgr, label: 'Apoyo a Cateos FGR' },
                      { val: apoyoCateosFge, set: setApoyoCateosFge, label: 'Apoyo a Cateos FGE' },
                    ]).map(({ val, set, label }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                        <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#1e293b' }}>{label}</span>
                        <button type="button" onClick={() => set(!val)}
                          style={{ padding: '4px 14px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, border: '1px solid', borderRadius: 2, cursor: 'pointer', background: val ? '#3e5171' : '#ffffff', color: val ? '#ffffff' : '#64748b', borderColor: val ? '#3e5171' : '#e2e8f0' }}>
                          {val ? 'SÍ' : 'NO'}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <SentinelField label="Observaciones / Conclusión" name="observaciones" as="textarea"
                  placeholder="Observaciones finales del reporte..." />
              </div>
            </section>
          </div>
          {/* ACCIONES FINALES */}
          <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
            <button style={{
              background: '#0f172a', color: '#ffffff', padding: '16px 48px',
              borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '12px',
              border: 'none', cursor: 'pointer'
            }}>
              <Send size={16} color="#3e5171" />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Registrar Reporte de Recorrido
              </span>
            </button>
          </div>
        </main>

        <footer style={{ padding: '32px 48px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#94a3b8', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#ffffff', marginTop: '60px' }}>
          SSPM · SAN JUAN DEL RÍO · SENTINEL v1.0
        </footer>

        <style jsx global>{`
                .sentinel-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    padding: 32px;
                    border-radius: 4px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }
                .sentinel-section-title {
                    font-family: 'Barlow Condensed', sans-serif !important;
                    font-size: 18px !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    color: #1e293b !important;
                    margin-bottom: 24px !important;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .sentinel-section-title::before {
                    content: '';
                    width: 4px; height: 18px;
                    background: #3e5171;
                    display: inline-block;
                }
                .sentinel-btn-toggle {
                    height: 46px; padding: 0 16px;
                    background: #ffffff; color: #64748b;
                    border: 1px solid #e2e8f0; border-radius: 2px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 9px; font-weight: 600; cursor: pointer;
                    transition: all 0.2s;
                }
                .sentinel-btn-toggle:hover { background: #f8fafc; border-color: #3e5171; }
                input:focus, textarea:focus, select:focus {
                    border-color: #3e5171 !important;
                    box-shadow: 0 0 0 1px rgba(62, 81, 113, 0.1);
                }
            `}</style>
      </div>
    </form>
  );
}