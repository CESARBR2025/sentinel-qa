import type { DatosExtraidosDeNarrativa } from "../service";

export type IdPreguntaGuiada =
  | "presencia"
  | "vehiculo"
  | "tipoVehiculoServicio"
  | "placa"
  | "placaConfirmacion"
  | "estadoOrigen"
  | "motivo"
  | "conductor"
  | "garantia";

export interface CampoRequerido {
  campo: keyof DatosExtraidosDeNarrativa;
  /** Nombre humano del dato, usado para preguntar específicamente lo que falte (ej. "si es el titular del vehículo"). */
  etiqueta: string;
}

export interface PreguntaGuiada {
  id: IdPreguntaGuiada;
  texto: string;
  /** Reintento genérico — se usa cuando no hubo respuesta alguna, o para preguntas sin `campos` (motivo, placa). */
  reintentoGenerico: string;
  /** Campos que esta pregunta intenta llenar. Si se omite (ej. "motivo"), se usa `evaluarSatisfecho`. */
  campos?: CampoRequerido[];
  /** Campos que se guardan si vienen, pero nunca bloquean el avance ni generan "me falta X" (ej. tipo/servicio del vehículo). */
  camposOpcionales?: CampoRequerido[];
  /** true = hay que preguntar específicamente por lo que falte de `campos` hasta tenerlos todos (o agotar intentos). false/omitido = basta con llenar al menos uno para avanzar. */
  requiereTodosLosCampos?: boolean;
  /** Si true, una respuesta vacía/no entendida no cuenta como fallo — se avanza igual (ej. garantía). */
  opcional?: boolean;
  /** Solo para preguntas sin `campos` cuyo éxito no es un simple null-check de un campo (ej. "motivo" → resultadosMotivo). */
  evaluarSatisfecho?: (r: DatosExtraidosDeNarrativa) => boolean;
  /** Si retorna false, esta pregunta se salta (ej. conductor cuando el ciudadano está ausente). */
  aplica?: (acumulado: Partial<DatosExtraidosDeNarrativa>) => boolean;
}

export const PREGUNTAS_GUIADAS: PreguntaGuiada[] = [
  {
    id: "presencia",
    texto: "¿El conductor está presente en el lugar y es el titular del vehículo?",
    reintentoGenerico:
      'No logré identificarlo. Responde algo como: "El conductor está presente y es titular del vehículo."',
    campos: [
      { campo: "ciudadanoPresente", etiqueta: "si el conductor está presente" },
      { campo: "esCiudadanoTitular", etiqueta: "si es el titular del vehículo" },
    ],
    requiereTodosLosCampos: true,
  },
  {
    id: "vehiculo",
    texto: "Descríbeme el vehículo: marca, modelo, color y año.",
    reintentoGenerico:
      'No logré identificar el vehículo. Intenta de nuevo, por ejemplo: "Nissan Versa gris, año 2022."',
    campos: [
      { campo: "marca", etiqueta: "la marca" },
      { campo: "modelo", etiqueta: "el modelo" },
      { campo: "color", etiqueta: "el color" },
      { campo: "anio", etiqueta: "el año" },
    ],
    requiereTodosLosCampos: true,
  },
  {
    id: "tipoVehiculoServicio",
    texto: `¿Qué tipo de vehículo es y qué tipo de servicio presta?
Tipo de vehículo:
• AUTOMÓVIL
• CAMIONETA
• TRANSPORTE PÚBLICO
• VEHÍCULO DE CARGA
• MOTOCICLETA
Tipo de servicio:
• PARTICULAR
• PÚBLICO
• FEDERAL`,
    reintentoGenerico: 'No logré identificar el tipo de vehículo o servicio. Intenta de nuevo, por ejemplo: "Es un sedán particular".',
    campos: [
      { campo: "tipoVehiculo", etiqueta: "el tipo de vehículo" },
      { campo: "servicio", etiqueta: "el tipo de servicio" },
    ],
    requiereTodosLosCampos: true,
  },
  {
    id: "placa",
    texto: "Dime la placa del vehículo, letra por letra y número por número.",
    reintentoGenerico: 'No escuché nada. Deletréala de nuevo, por ejemplo: "eme, ene, y griega, treinta y dos, treinta y tres."',
  },
  {
    id: "placaConfirmacion",
    texto: "Ahora repite la placa una vez más para confirmarla.",
    reintentoGenerico: "No escuché nada. Repite la placa de nuevo, igual que la dijiste antes.",
  },
  {
    id: "estadoOrigen",
    texto: "¿De qué estado es la placa?",
    reintentoGenerico: 'No logré identificar el estado. Intenta de nuevo, por ejemplo: "El estado de procedencia es Querétaro."',
    campos: [{ campo: "estadoOrigen", etiqueta: "el estado de procedencia" }],
    requiereTodosLosCampos: true,
  },
  {
    id: "motivo",
    texto: "¿Cuál fue el motivo de la detención?",
    reintentoGenerico: 'No logré identificar el motivo. Descríbelo de nuevo, por ejemplo: "Se pasó el semáforo en rojo."',
    evaluarSatisfecho: (r) => r.resultadosMotivo.length > 0,
  },
  {
    id: "conductor",
    texto: "¿Cuál es el nombre completo del conductor?",
    reintentoGenerico: 'No logré identificar el nombre. Dilo de nuevo, por ejemplo: "Juan Carlos García Morales."',
    campos: [
      { campo: "nombreInfractor", etiqueta: "el nombre" },
      { campo: "apPaternoInfractor", etiqueta: "el apellido paterno" },
      { campo: "apMaternoInfractor", etiqueta: "el apellido materno" },
    ],
    requiereTodosLosCampos: false,
    aplica: (acumulado) => acumulado.ciudadanoPresente === true,
  },
  {
    id: "garantia",
    texto: "¿Se retiene alguna garantía? Si aplica, di cuál — tarjeta de circulación, placa, licencia o el vehículo.",
    reintentoGenerico: 'No logré identificar qué se retiene. Nómbralo de nuevo, por ejemplo: "Se retiene la tarjeta de circulación."',
    campos: [
      { campo: "garantiaSeleccionada", etiqueta: "qué se retiene" },
      { campo: "motivoRetencionVehiculo", etiqueta: "el motivo de la retención" },
    ],
    requiereTodosLosCampos: false,
    opcional: true,
  },
];
