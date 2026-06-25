/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
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
            borderLeft: '4px solid #3b82f6',
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
  // Hook para buscar al mando
  const empMando = useEmpleado();
  const [nominaMando, setNominaMando] = useState("");
  const [nombreMando, setNombreMando] = useState("");

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

  const [autoridadSeleccionada, setAutoridadSeleccionada] = useState("MINISTERIO PÚBLICO");

  return (
    <form action={createRecorridoCompleto}>
      <input type="hidden" name="canal" value="radio" />
      <input type="hidden" name="tipoReporte" value="normal" />
      <input type="hidden" name="estatus" value="en_despacho" />
      <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

        <DashboardHeader user={user} />

        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>

          {/* ENCABEZADO */}
          <div style={{ marginBottom: '40px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 600 }}>
              Plataforma de Prevención
            </span>
            <h1 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800, fontSize: 32, letterSpacing: '0.02em',
              textTransform: 'uppercase', margin: '4px 0 0 0', color: '#0f172a'
            }}>
              REPORTES DENTRO DE <span style={{ color: '#3b82f6' }}>RECORRIDOS</span>
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* SECCIÓN 01: ORIGEN */}
            <section className="sentinel-card">
              <h2 className="sentinel-section-title">Origen e Identificación</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <SentinelField label="Canal de Origen" icon={MessageSquare} value="RADIO" disabled />

                {/* Este campo es REQUERIDO por la API para canal Radio */}
                <SentinelField
                  label="Nombre del Oficial que Reporta"
                  name="nombreOficial"
                  icon={Shield}
                  placeholder="Nombre completo del oficial"
                  required
                />

                <SentinelField label="Folio CAD" name="folioCad" icon={Hash} placeholder="Número CAD..." />

                <SentinelField
                  label="Quien Capturó"
                  icon={User}
                  value={`${user?.name || ''} ${user?.apellido || ''}`.trim()}
                  disabled
                />

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
                  {/* Input oculto para que el servidor reciba el booleano correcto */}
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

            {/* SECCIÓN 03: UBICACIÓN */}
            <section className="sentinel-card">
              <h2 className="sentinel-section-title">Ubicación</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <SentinelField label="Calle" name="calle" icon={MapPin} placeholder="Nombre de la calle" />
                <SentinelField label="Colonia" name="colonia" icon={MapPin} placeholder="Colonia o Fraccionamiento" />
                <SentinelField label="Entre Calles" name="entreCalles" icon={MapPin} placeholder="Calle A y Calle B" />

                <div style={{ gridColumn: 'span 2' }}>
                  <SentinelField label="Referencia de Ubicación" name="referenciaUbicacion" icon={MapPin} placeholder="Ej. Frente a la tienda, portón negro..." />
                </div>

                {/* SELECT DINÁMICO */}
                <SentinelField
                  label="Datos Positivos/Negativos"
                  // Si es "otro", no le ponemos 'name' aquí para que no se duplique
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
                  <div style={{ gridColumn: 'span 3', marginTop: '-16px' }}>
                    <SentinelField
                      label="Especifique el resultado"
                      name="datosPositivosNegativos" // El backend recibirá este valor
                      icon={FileText}
                      placeholder="Escriba aquí la observación..."
                      fullWidth
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

                      <button type="button" onClick={agregarDetenido} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: '2px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 600 }}>
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

                    <SentinelField label="Expediente / Carpeta CI" name="expedienteCi" icon={FileText} placeholder="Número de carpeta..." />
                    <SentinelField label="Delito / Falta" name="delitoFalta" icon={AlertTriangle} placeholder="Clasificación jurídica" />
                  </>
                )}

                {tipoIncidente === "1" && (
                  <SentinelField
                    label="Monto de lo Robado (Solo números)"
                    name="montoRobo"
                    type="number"
                    placeholder="0"
                  />
                )}
              </div>
            </section>

            {/* SECCIÓN 05: BIENES Y CATEOS */}
            <section className="sentinel-card">
              <h2 className="sentinel-section-title">Aseguramientos y Cateos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>

                {/* Campo de Objetos (Ocupa todo el ancho) */}
                <div style={{ gridColumn: 'span 3' }}>
                  <SentinelField
                    label="Objetos Recuperados"
                    name="objetosRecuperados"
                    as="textarea"
                    placeholder="Descripción de bienes asegurados..."
                  />
                </div>

                {/* Selector de Vehículo */}
                <SentinelField
                  label="¿Aseguró Vehículo?"
                  name="aseguroVehiculo" // Asegúrate de poner el name para el form
                  as="select"
                  value={tieneVehiculo}
                  onChange={(e: any) => setTieneVehiculo(e.target.value)}
                >
                  <option value="false">NO</option>
                  <option value="true">SÍ</option>
                </SentinelField>

                {/* CAMPOS CONDICIONALES DE VEHÍCULO */}
                {tieneVehiculo === "true" && (
                  <>
                    <SentinelField label="Vehículos Recuperados" name="vehiculosRecuperados" icon={Car} placeholder="Placas, Serie, Color..." />
                    <SentinelField label="Tipo de Vehículo" name="tipoVehiculo" placeholder="Ej: Camioneta PickUp" />
                    <SentinelField label="Destino de Vehículo" name="destinoVehiculo" placeholder="Ej: Pensión Municipal" />
                  </>
                )}

                {/* Selector de Cateo */}
                <SentinelField
                  label="¿Hubo Cateo?"
                  name="hayCateo"
                  as="select"
                  value={tieneCateo}
                  onChange={(e: any) => setTieneCateo(e.target.value)}
                >
                  <option value="false">NO</option>
                  <option value="true">SÍ</option>
                </SentinelField>

                {/* CAMPOS CONDICIONALES DE CATEO */}
                {tieneCateo === "true" && (
                  <>
                    <div style={{ gridColumn: 'span 2' }}>
                      <SentinelField label="Domicilio Cateado" name="domicilioCateado" icon={MapPin} placeholder="Dirección exacta del cateo" />
                    </div>
                    <SentinelField label="Resultado del Cateo" name="resultadoCateo" placeholder="¿Qué se encontró?" />
                  </>
                )}

                {/* --- BUSCADOR DE NÓMINA PARA EL MANDO --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Nómina del Mando
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Hash size={14} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8', zIndex: 1 }} />
                      <input
                        type="text"
                        placeholder="Escriba nómina..."
                        value={nominaMando}
                        onChange={(e) => setNominaMando(e.target.value)}
                        onBlur={buscarMando}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); buscarMando(); } }}
                        style={{
                          width: '100%',
                          padding: '12px 12px 12px 40px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderLeft: '4px solid #3b82f6',
                          borderRadius: '2px',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={buscarMando}
                      style={{ padding: '0 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer', borderRadius: '2px' }}
                    >
                      {empMando.cargando ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    </button>
                  </div>
                  {empMando.error && <span style={{ color: '#dc2626', fontSize: '10px', fontFamily: 'JetBrains Mono' }}>{empMando.error}</span>}
                </div>

                {/* Campo de Nombre del Mando (Se llena solo) */}
                <SentinelField
                  label="Policía a Cargo (Mando)"
                  name="policiaCargo" 
                  icon={Shield}
                  placeholder="Nombre del mando responsable"
                  value={nombreMando}
                  onChange={(e: any) => setNombreMando(e.target.value)}
                />

                {/* Campo Final */}
                <SentinelField
                  label="Personal que ingresó a CI"
                  name="personalIngresoCi"
                  icon={User}
                  placeholder="Nombre del agente en fiscalía"
                />
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
              <Send size={16} color="#3b82f6" />
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
                    background: #3b82f6;
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
                .sentinel-btn-toggle:hover { background: #f8fafc; border-color: #3b82f6; }
                input:focus, textarea:focus, select:focus {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
                }
            `}</style>
      </div>
    </form>
  );
}