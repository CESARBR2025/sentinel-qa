/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import {
  FileText, Clock, Shield, MapPin, User,
  CheckCircle, AlertCircle, Users, Save,
  Navigation as NavigationIcon,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation'
import { useOficialFormStore } from '@/lib/oficial/store'
import { useD1FormStore } from '@/lib/denuncias/storeD1'

const mapContainerStyle = { width: '100%', height: '350px', borderRadius: '4px' };
const center = { lat: 20.3889, lng: -99.9961 };

const SentinelField = ({ label, icon: Icon, name, type = "text", required = false, ...props }: any) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      {Icon && <Icon size={14} style={iconStyle} />}
      <input
        name={name}
        type={type}
        required={required}
        style={{ ...inputStyle, paddingLeft: Icon ? '38px' : '12px' }}
        {...props}
      />
    </div>
  </div>
);

interface Prefill {
  incidenteId: string | null;
  reporteCampoId: string | null
  lugarHecho: string
  coloniaHecho: string
  lat: number | null
  lng: number | null
  oficialId: string | null
  destino: string | null
  crp: string
  tipoIncidente: string | null
  descripcion: string | null
  folioReporteCampo: string | null
  sector: string | null
  nombreOficial: string | null
  nominaOficial: string | null
  fechaHoraInicioIncidente: string | null
  fechaHoraDespacho: string | null
  fechaReporteCampo: string | null
}

function generarFolioDenuncia(): string {
  const hoy = new Date()
  const y = hoy.getFullYear()
  const m = String(hoy.getMonth() + 1).padStart(2, '0')
  const d = String(hoy.getDate()).padStart(2, '0')
  const fecha = `${y}${m}${d}`
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `SSPM/${fecha}/${codigo}`
}

interface GrupoAdscripcionOption {
  id: number
  clave: string
  nombre: string
  autoridad: string
}

export default function FormularioD1({ user, prefill, gruposAdscripcion }: { user: any; prefill?: Prefill; gruposAdscripcion?: GrupoAdscripcionOption[] }) {
  const folioDenunciaAuto = useMemo(() => generarFolioDenuncia(), [])

  const consecutivoAnio = useMemo(() => {
    const y = new Date().getFullYear()
    const rand = String(Math.floor(Math.random() * 90000) + 10000)
    return { y, rand }
  }, [])

  const iphDefault = `IPH-${consecutivoAnio.y}-${consecutivoAnio.rand}`
  const cuDefault = `CU-${consecutivoAnio.y}-${consecutivoAnio.rand}`

  const oficialId = prefill?.oficialId ?? ''
  const incidenteId = prefill?.incidenteId ?? ''

  const store = useD1FormStore()

  // Pre-fill avistamiento con misma fecha/hora de reporte
  const fechaAvistamientoDefault = prefill?.fechaReporteCampo
    ? new Date(prefill.fechaReporteCampo).toISOString().split('T')[0]
    : store.fechaReporte

  const horaAvistamientoDefault = prefill?.fechaReporteCampo
    ? new Date(prefill.fechaReporteCampo).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    : store.horaReporte

  // Pre-fill fecha/hora despacho desde incidente
  const fechaDespachoDefault = prefill?.fechaHoraDespacho
    ? new Date(prefill.fechaHoraDespacho).toISOString().split('T')[0]
    : ''

  const horaDespachoDefault = prefill?.fechaHoraDespacho
    ? new Date(prefill.fechaHoraDespacho).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    : ''

  // Cronometría: defaults progresivos desde fecha/hora reporte
  const fechaConfirmacionDefault = fechaDespachoDefault || store.fechaReporte
  const horaConfirmacionDefault = horaDespachoDefault || store.horaReporte
  const fechaLlegadaDefault = fechaDespachoDefault || store.fechaReporte
  const horaLlegadaDefault = horaDespachoDefault || store.horaReporte

  // Default grupo de adscripción: el primero del catálogo filtrado por destino, o el primero general
  const grupoAdscripcionDefault = useMemo(() => {
    if (!gruposAdscripcion || gruposAdscripcion.length === 0) return ''
    return gruposAdscripcion[0].clave
  }, [gruposAdscripcion])

  // Las horas del proceso de denuncia por defecto son las del reporte
  const horaInicioDenunciaDefault = store.horaReporte
  const horaFinDenunciaDefault = store.horaReporte
  const horaTerminoAtencionDefault = store.horaReporte
  const horaCuestionarioDefault = store.horaReporte
  const step = store.step
  const coordsHecho = store.coordsHecho
  const dirHecho = store.dirHecho
  const coordsApoyo = store.coordsApoyo
  const dirApoyo = store.dirApoyo
  const fReporte = store.fechaReporte
  const hReporte = store.horaReporte

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  });

  const reverseGeocode = (lat: number, lng: number, type: 'hecho' | 'apoyo') => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const components = results[0].address_components;
        let calle = ''; let num = ''; let col = '';

        components.forEach(c => {
          if (c.types.includes("route")) calle = c.long_name;
          if (c.types.includes("street_number")) num = c.long_name;
          if (c.types.includes("sublocality") || c.types.includes("neighborhood")) col = c.long_name;
        });

        const fullCalle = `${calle} ${num}`.trim();
        if (type === 'hecho') store.setDirHecho({ calle: fullCalle, colonia: col });
        else store.setDirApoyo({ calle: fullCalle, colonia: col });
      }
    });
  };

  useEffect(() => {
    console.log("STEP:", store.step);
  }, [store.step]);

  useEffect(() => {
    if (prefill?.lat && prefill?.lng) {
      store.setCoordsHecho({ lat: prefill.lat, lng: prefill.lng })
    }
    if (prefill?.lugarHecho || prefill?.coloniaHecho) {
      store.setDirHecho({ calle: prefill?.lugarHecho ?? '', colonia: prefill?.coloniaHecho ?? '' })
    }
  }, [])

  const router = useRouter()
  const resetStore = useOficialFormStore(s => s.reset)

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("SUBMIT", step);

  if (step < 4) return;

  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData.entries());

  // --- CONSTRUCCIÓN DEL CUERPO ---
  const body = {
    ...data,
    incidenteId: prefill?.incidenteId ?? null, 
    reporteCampoId: prefill?.reporteCampoId ?? null,
    oficialId: prefill?.oficialId ?? null,
    capturadoPor: user?.id // ID del usuario en sesión
  };

  console.log("VALORES QUE SE VAN A LA DB:", body); 

  const res = await fetch('/api/reportes-d1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await res.json();
  if (!res.ok) {
    alert("ERROR: " + result.error);
    return;
  }

  // Limpiar store y redirigir
  resetStore();
  const folioEnc = encodeURIComponent(result.folioDenuncia || folioDenunciaAuto)
  router.push(`/oficial/despachos?exito=1&folio=${folioEnc}`);
};


  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Enter' && step < 4) e.preventDefault(); }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      <input type="hidden" name="latitudHecho" value={coordsHecho.lat} />
      <input type="hidden" name="longitudHecho" value={coordsHecho.lng} />
      <input type="hidden" name="latitudApoyo" value={coordsApoyo.lat} />
      <input type="hidden" name="longitudApoyo" value={coordsApoyo.lng} />
      <input type="hidden" name="oficialId" value={oficialId} />
      <input type="hidden" name="incidenteId" value={incidenteId} />
      

      {/* 1. IDENTIFICACIÓN LEGAL Y CORPORATIVA */}
      <div style={{ display: step === 1 ? 'flex' : 'none', flexDirection: 'column', gap: '32px' }}>
      <section className="sentinel-panel">
        <h2 style={sectionTitleStyle}><FileText size={18} /> IDENTIFICACIÓN LEGAL</h2>
        <div style={grid3Style}>
          <SentinelField label="Folio de Denuncia" name="folioDenuncia" required value={folioDenunciaAuto} readOnly />
          <SentinelField label="IPH" name="iph" defaultValue={iphDefault} />
          <SentinelField label="Folio de CU" name="folioCu" defaultValue={cuDefault} />
          <SentinelField label="Corporación" name="corporacion" defaultValue="SSPM" />
          <SentinelField label="Sector" name="sector" defaultValue={prefill?.sector ?? ''} />
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Grupo de Adscripción</label>
            <select name="grupoAdscripcion" style={inputStyle} defaultValue={grupoAdscripcionDefault}>
              <option value="">Seleccione un grupo...</option>
              {gruposAdscripcion?.map(g => (
                <option key={g.id} value={g.clave}>{g.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </section>
      
      {/* 2. CRONOMETRÍA COMPLETA (EL TIMELINE) */}
      <section className="sentinel-panel" style={{ borderLeftColor: '#d4a43a' }}>
        <h2 style={{ ...sectionTitleStyle, color: '#d4a43a' }}><Clock size={18} /> CRONOMETRÍA OPERATIVA</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Fila: Reporte y Avistamiento */}
          <div style={grid4Style}>
            <SentinelField readOnly label="Fecha Reporte" name="fechaReporte" type="date" required value={fReporte} onChange={(e: any) => store.setFechaReporte(e.target.value)} />
            <SentinelField readOnly label="Hora Reporte" name="horaReporte" type="time" required value={hReporte} onChange={(e: any) => store.setHoraReporte(e.target.value)} />
            <SentinelField label="Fecha Avistamiento Ciudadano" name="fechaAvistamiento" type="date" defaultValue={fechaAvistamientoDefault} />
            <SentinelField label="Hora Avistamiento Ciudadano" name="horaAvistamiento" type="time" defaultValue={horaAvistamientoDefault} />
          </div>

          {/* Fila: Despacho y Confirmación */}
          <div style={grid4Style}>
            <SentinelField label="Fecha Despacho" name="fechaDespacho" type="date" defaultValue={fechaDespachoDefault} />
            <SentinelField label="Hora Despacho" name="horaDespacho" type="time" defaultValue={horaDespachoDefault} />
            <SentinelField label="Fecha Confirmación" name="fechaConfirmacion" type="date" defaultValue={fechaConfirmacionDefault} />
            <SentinelField label="Hora Confirmación" name="horaConfirmacion" type="time" defaultValue={horaConfirmacionDefault} />
          </div>

          {/* Fila: Llegada y Toma de Denuncia */}
          <div style={grid4Style}>
            <SentinelField label="Día de Llegada" name="fechaLlegada" type="date" defaultValue={fechaLlegadaDefault} />
            <SentinelField label="Hora de Llegada" name="horaLlegada" type="time" defaultValue={horaLlegadaDefault} />
            <SentinelField label="Hora Inicio Denuncia" name="horaInicioDenuncia" type="time" defaultValue={horaInicioDenunciaDefault} />
            <SentinelField label="Hora Término Denuncia" name="horaFinDenuncia" type="time" defaultValue={horaFinDenunciaDefault} />
          </div>

          {/* Fila: Cierre de Atención */}
          <div style={grid3Style}>
            <SentinelField label="Hora Término Atención" name="horaTerminoAtencion" type="time" defaultValue={horaTerminoAtencionDefault} />
            <SentinelField label="Hora Recaba Cuestionario" name="horaCuestionario" type="time" defaultValue={horaCuestionarioDefault} />
          </div>
        </div>
      </section>
      </div>

      {/* 3. UBICACIÓN Y GEORREFERENCIACIÓN */}
      <div style={{ display: step === 2 ? 'block' : 'none' }}>
      <section className="sentinel-panel">
        <h2 style={sectionTitleStyle}><NavigationIcon size={20} /> GEORREFERENCIACIÓN OPERATIVA</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

          {/* MAPA 1: LUGAR DEL HECHO */}
          <div style={subPanelStyle}>
            <h3 style={subTitleStyle}><MapPin size={14} color="#ef4444" /> 1. LUGAR DEL HECHO</h3>
            <div style={mapWrapperStyle}>
              {isLoaded ? (
                <GoogleMap mapContainerStyle={mapContainerStyle} center={coordsHecho} zoom={15}
                  onClick={(e) => {
                    if (e.latLng) {
                      const lat = e.latLng.lat(); const lng = e.latLng.lng();
                      store.setCoordsHecho({ lat, lng }); reverseGeocode(lat, lng, 'hecho');
                    }
                  }}>
                  <Marker position={coordsHecho} draggable onDragEnd={(e) => {
                    if (e.latLng) {
                      const lat = e.latLng.lat(); const lng = e.latLng.lng();
                      store.setCoordsHecho({ lat, lng }); reverseGeocode(lat, lng, 'hecho');
                    }
                  }} />
                </GoogleMap>
              ) : <div style={loaderStyle}>Cargando Mapa...</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <SentinelField label="Calle y Número (Hecho)" name="lugarHecho" value={dirHecho.calle}
                onChange={(e: any) => store.setDirHecho({ ...dirHecho, calle: e.target.value })} />
              <SentinelField label="Colonia (Hecho)" name="coloniaHecho" value={dirHecho.colonia}
                onChange={(e: any) => store.setDirHecho({ ...dirHecho, colonia: e.target.value })} />
            </div>
          </div>

          {/* MAPA 2: LUGAR DE SOLICITUD DE APOYO */}
          <div style={subPanelStyle}>
            <h3 style={subTitleStyle}><Shield size={14} color="#1f355a" /> 2. LUGAR DE SOLICITUD DE APOYO</h3>
            <div style={mapWrapperStyle}>
              {isLoaded ? (
                <GoogleMap mapContainerStyle={mapContainerStyle} center={coordsApoyo} zoom={15}
                  onClick={(e) => {
                    if (e.latLng) {
                      const lat = e.latLng.lat(); const lng = e.latLng.lng();
                      store.setCoordsApoyo({ lat, lng }); reverseGeocode(lat, lng, 'apoyo');
                    }
                  }}>
                  <Marker position={coordsApoyo} draggable icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    onDragEnd={(e) => {
                      if (e.latLng) {
                        const lat = e.latLng.lat(); const lng = e.latLng.lng();
                        store.setCoordsApoyo({ lat, lng }); reverseGeocode(lat, lng, 'apoyo');
                      }
                    }} />
                </GoogleMap>
              ) : <div style={loaderStyle}>Cargando Mapa...</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <SentinelField label="Calle y Número (Apoyo)" name="lugarApoyo" value={dirApoyo.calle}
                onChange={(e: any) => store.setDirApoyo({ ...dirApoyo, calle: e.target.value })} />
              <SentinelField label="Colonia (Apoyo)" name="coloniaApoyo" value={dirApoyo.colonia}
                onChange={(e: any) => store.setDirApoyo({ ...dirApoyo, colonia: e.target.value })} />
            </div>
          </div>

        </div>
      </section>
      </div>
      
      <div style={{ display: step === 3 ? 'flex' : 'none', flexDirection: 'column', gap: '32px' }}>
      {/* 4. CLASIFICACIÓN Y RESULTADOS */}
      <section className="sentinel-panel">
        <h2 style={sectionTitleStyle}><AlertCircle size={18} /> DETALLES DEL EVENTO</h2>
        <div style={grid3Style}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Tipo de Evento</label>
            <select name="tipoEvento" style={inputStyle}>
              <option value="1">1.- D1</option>
              <option value="2">2.- DETENIDO (FLAGRANCIA)</option>
              <option value="3">3.- DETENIDO CON DIVERSOS ELEMENTOS</option>
            </select>
          </div>
          <SentinelField label="Delito" name="delito" required defaultValue={prefill?.tipoIncidente ?? ''} />
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>¿Hubo Violencia?</label>
            <select name="violencia" style={inputStyle}>
              <option value="false">NO</option>
              <option value="true">SÍ</option>
            </select>
          </div>
        </div>
      </section>
      </div>


      {/* 5. PERSONAL, EQUIPO Y D1 */}
      <div style={{ display: step === 4 ? 'flex' : 'none', flexDirection: 'column', gap: '32px' }}>
      <section className="sentinel-panel">
        <h2 style={sectionTitleStyle}><Shield size={18} /> PERSONAL Y EQUIPAMIENTO</h2>
        <div style={grid3Style}>
          <SentinelField label="CRP (Placa Patrulla)" name="crp" icon={Shield} value={prefill?.crp ?? ''} readOnly />

          <SentinelField
            label="Oficial ID"
            name="oficialId"
            icon={Shield}
            value={oficialId}
            readOnly
          />
          <SentinelField label="Policía a Cargo" name="policiaACargo" icon={Shield} defaultValue={prefill?.nominaOficial ?? ''} />
          <SentinelField label="Mando Responsable" name="nominaMando" icon={Shield} placeholder="Nómina del mando" />
          <SentinelField label="Policía que Toma la Denuncia" name="policiaDenuncia" icon={Shield} defaultValue={prefill?.nominaOficial ?? ''} />
          <SentinelField label="Policía que Firma el D1" name="policiaFirmaD1" icon={Shield} defaultValue={prefill?.nominaOficial ?? ''} />
          <SentinelField label="Policía que Ingresa el CU" name="policiaIngresaCu" icon={Shield} defaultValue={prefill?.nominaOficial ?? ''} />
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>¿Se requirió Tablet?</label>
            <select name="requirioTablet" style={inputStyle} defaultValue="true">
              <option value="true">SÍ</option>
            </select>
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>¿Funcionaba Tablet?</label>
            <select name="funcionabaTablet" style={inputStyle} defaultValue="true">
              <option value="true">SÍ</option>
            </select>
          </div>
        </div>
      </section>

      {/* 6. VICTIMOLOGÍA Y CUESTIONARIOS */}
      <section className="sentinel-panel">
        <h2 style={sectionTitleStyle}><Users size={18} /> VICTIMOLOGÍA</h2>
        <div style={grid4Style}>
          <SentinelField label="Ofendido Hombre" name="ofendidoHombre" type="number" defaultValue="0" />
          <SentinelField label="Ofendido Mujer" name="ofendidoMujer" type="number" defaultValue="0" />
          <SentinelField label="Cuestionarios Enviados" name="numCuestionarios" type="number" defaultValue="0" />
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>¿Intervino GS?</label>
            <select name="intervinoGs" style={inputStyle}>
              <option value="false">NO</option>
              <option value="true">SÍ</option>
            </select>
          </div>
        </div>
      </section>

      {/* 7. ESTATUS FINAL Y OBSERVACIONES */}
      <section className="sentinel-panel">
        <h2 style={sectionTitleStyle}><CheckCircle size={18} /> CIERRE Y D1</h2>
        <div style={grid2Style}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>¿Se generó la D1?</label>
            <select name="seGeneroD1" style={inputStyle}>
              <option value="true">SÍ</option>
              <option value="false">NO</option>
            </select>
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>¿Se va a generar la D1?</label>
            <select name="seVaAGenerarD1" style={inputStyle}>
              <option value="true">SÍ</option>
              <option value="false">NO</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <label style={labelStyle}>Observaciones</label>
          <textarea name="observaciones" style={{ ...inputStyle, minHeight: '100px', paddingTop: '12px' }} placeholder="Escriba aquí..." defaultValue={prefill?.descripcion ?? ''} />
        </div>
      </section>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingBottom: '80px' }}>
  {/* BOTÓN ATRÁS */}
  {step > 1 ? (
    <button type="button" onClick={() => store.setStep(step - 1)} style={btnBackStyle}>
      <ArrowLeft size={16} /> ANTERIOR
    </button>
  ) : <div />}

  {/* BOTÓN SIGUIENTE O REGISTRAR */}
<button
  type={step === 4 ? "submit" : "button"}
  onClick={(e) => {
    if (step < 4) {
      e.preventDefault();
      store.setStep(step + 1);
    }
  }}
  style={step === 4 ? btnSubmitStyle : btnNextStyle}
>
  {step === 4 ? (
    <>
      <Save size={18} /> FINALIZAR REPORTE D1
    </>
  ) : (
    <>
      SIGUIENTE <ArrowRight size={16} />
    </>
  )}
</button>
</div>

      <style jsx>{`
        .sentinel-panel {
          background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #1f355a;
          padding: 32px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
      `}</style>
    </form>
  );
}

// --- ESTILOS TÁCTICOS ---
const grid4Style = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' };
const grid3Style = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' };
const grid2Style = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' };
const fieldContainerStyle = { display: 'flex', flexDirection: 'column' as const, gap: '8px' };
const labelStyle = { fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.1em' };
const inputStyle = { width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '2px', fontFamily: 'Inter', fontSize: '14px', outline: 'none' };
const iconStyle = { position: 'absolute' as const, left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const sectionTitleStyle = { fontFamily: 'Barlow Condensed', fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'uppercase' as const };
const subPanelStyle = {
  background: '#f8fafc',
  padding: '24px',
  borderRadius: '4px',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px'
};

const subTitleStyle = {
  fontFamily: 'JetBrains Mono',
  fontSize: '11px',
  fontWeight: 700,
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textTransform: 'uppercase' as const
};

const mapWrapperStyle = {
  border: '1px solid #cbd5e1',
  padding: '4px',
  background: '#fff',
  borderRadius: '4px',
  overflow: 'hidden'
};

const loaderStyle = {
  height: '280px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'JetBrains Mono',
  fontSize: '12px',
  color: '#64748b'
};

const btnNextStyle = { background: '#1f355a', color: '#ffffff', padding: '16px 32px', border: 'none', borderRadius: '4px', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' };
const btnBackStyle = { background: '#ffffff', color: '#64748b', padding: '16px 32px', border: '1px solid #e2e8f0', borderRadius: '4px', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' };
// Modifica tu btnSubmitStyle actual para que sea verde (opcional):
const btnSubmitStyle = { background: '#059669', color: '#ffffff', padding: '16px 40px', border: 'none', borderRadius: '4px', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' };