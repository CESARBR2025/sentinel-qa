import { queryVia } from "@/lib/db";

const GUEST_TOKEN_URL = "https://sanjuandelrio.sytes.net:3044/api/auth/guest-token";

export async function obtenerTokenGuest(): Promise<string> {
  const year = new Date().getFullYear();
  const fecha = new Date();
  const yy = String(fecha.getFullYear()).slice(-2);
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  const fechaCompacta = `${yy}${mm}${dd}`;
  const codigoFinal = `INV-${year}-${fechaCompacta}`;

  const response = await fetch(GUEST_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      codigo_invitacion: codigoFinal,
      nombre_invitado: codigoFinal,
    }),
  });

  const rawResponse = await response.text();
  let sa7Response: Record<string, unknown>;
  try {
    sa7Response = JSON.parse(rawResponse);
  } catch {
    sa7Response = { raw: rawResponse };
  }

  if (!response.ok) {
    throw new Error(String(sa7Response?.message ?? "Error al obtener token guest"));
  }

  const token = sa7Response?.token as string | undefined;
  if (!token) {
    throw new Error("Token inválido");
  }

  return token;
}

function str(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  return String(val);
}

function bool(val: unknown): boolean | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val === "true" || val === "1";
  return Boolean(val);
}

function num(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const n = Number(val);
  return Number.isNaN(n) ? null : n;
}

/* ─── Mapper ─── */

export interface ViaInfraccionHeader {
  id_infraccion: string;
  folio_de_infraccion: string;
  fecha_de_registro_de_infraccion: string;
  estatus_de_infraccion: string;
  url_ine: string;
  url_tarjeta_circulacion: string;
  url_inapam: string;
  url_evidencias: string[];
  no_oficio_fiscalia?: string;
  url_oficio_fiscalia?: string;
  no_carpeta_investigacion?: string;
  url_orden_salida_liberaciones?: string;
  url_oficio_pago_corralon?: string;
  grua_nombre?: string;
}

export interface ViaInfraccionLegal {
  articulo_numero: string;
  articulo_descripcion: string;
  fraccion_numero: string;
  fraccion_descripcion: string;
  total_umas: string;
  total_pesos: string;
}

export interface ViaInfraccionInfractor {
  nombre_infractor: string;
  appaterno_infractor?: string;
  apmaterno_infractor?: string;
  correo_infractor: string;
  curp_infractor: string;
}

export interface ViaInfraccionOficial {
  numero_empleado: string;
  nombre_completo: string;
  patrulla_nombre: string;
  activo: string | boolean;
}

export interface ViaInfraccionVehiculo {
  placa: string;
  tipo: string;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
}

export interface ViaInfraccionGarantia {
  garantia_retenida: string;
}

export interface ViaInfraccionUbicacion {
  latitud: string;
  longitud: string;
  calle: string;
  cod_postal: string;
  numero: string;
  municipio: string;
  estado: string;
}

export interface ViaInfraccionDetalle {
  Header: ViaInfraccionHeader;
  Infraccion: ViaInfraccionLegal;
  datos_infractor: ViaInfraccionInfractor;
  vehiculo: ViaInfraccionVehiculo;
  garantia: ViaInfraccionGarantia;
  ubicacion: ViaInfraccionUbicacion;
  oficial: ViaInfraccionOficial;
}

function parseEvidencias(val: unknown): string[] {
  if (!val || val === "NO_DATA") return [];
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed.map(String) : [val];
    } catch {
      return val ? [val] : [];
    }
  }
  return [];
}

function concatName(...parts: unknown[]): string {
  return parts.map((p) => String(p ?? "")).filter(Boolean).join(" ") || "—";
}

export function rowToInfraccionDetalle(
  row: Record<string, unknown>,
): ViaInfraccionDetalle {
  return {
    Header: {
      id_infraccion: str(row.id) ?? "",
      folio_de_infraccion: str(row.folio) ?? "",
      fecha_de_registro_de_infraccion: str(row.created_at) ?? "",
      estatus_de_infraccion: str(row.estatus) ?? "",
      url_ine: str(row.url_ine) ?? "",
      url_tarjeta_circulacion: str(row.url_tarjeta_circulacion) ?? "",
      url_inapam: str(row.url_inapam) ?? "",
      url_evidencias: parseEvidencias(row.evidencias),
      no_oficio_fiscalia: str(row.no_oficio_fiscalia) ?? undefined,
      url_oficio_fiscalia: str(row.url_oficio_fiscalia) ?? undefined,
      no_carpeta_investigacion:
        str(row.no_carpeta_investigacion) ?? undefined,
      url_orden_salida_liberaciones:
        str(row.url_orden_salida_liberaciones) ?? undefined,
      url_oficio_pago_corralon:
        str(row.url_oficio_pago_corralon) ?? undefined,
      grua_nombre:
        str(row.grua_nombre) ?? undefined,
    },
    Infraccion: {
      articulo_numero: str(row.articulo_numero) ?? "",
      articulo_descripcion: str(row.articulo_descripcion) ?? "",
      fraccion_numero: str(row.fraccion_numero) ?? "",
      fraccion_descripcion: str(row.fraccion_descripcion) ?? "",
      total_umas: str(row.total_umas) ?? "0",
      total_pesos: str(row.total_pesos) ?? "0",
    },
    datos_infractor: {
      nombre_infractor: concatName(
        row.nombre_infractor,
        row.apellido_paterno_infractor,
        row.apellido_materno_infractor,
      ),
      appaterno_infractor:
        str(row.apellido_paterno_infractor) ?? undefined,
      apmaterno_infractor:
        str(row.apellido_materno_infractor) ?? undefined,
      correo_infractor: str(row.correo_infractor) ?? "",
      curp_infractor: str(row.curp_infractor) ?? "",
    },
    vehiculo: {
      placa: str(row.placa) ?? "",
      tipo: str(row.tipo_garantia) ?? "",
      marca: str(row.marca) ?? "",
      modelo: str(row.modelo) ?? "",
      anio: str(row.anio) ?? "",
      color: str(row.color) ?? "",
    },
    garantia: {
      garantia_retenida: str(row.garantia_entregada) ?? "",
    },
    ubicacion: {
      latitud: str(row.latitud) ?? "",
      longitud: str(row.longitud) ?? "",
      calle: str(row.calle) ?? "",
      cod_postal: str(row.codigo_postal) ?? "",
      numero: str(row.numero) ?? "",
      municipio: str(row.municipio) ?? "",
      estado: str(row.estado) ?? "",
    },
    oficial: {
      numero_empleado: str(row.oficial_numero_empleado) ?? "",
      nombre_completo: concatName(
        row.oficial_nombres,
        row.oficial_apellido_p,
        row.oficial_apellido_m,
      ),
      patrulla_nombre: str(row.patrulla_nombre) ?? "",
      activo: str(row.oficial_activo) ?? "",
    },
  };
}

/* ─── Repository ─── */

export async function obtenerDetalleInfraccionVia(
  id: string,
): Promise<ViaInfraccionDetalle | null> {
  const result = await queryVia<Record<string, unknown>>(
    `SELECT
       i.evidencias,
       i.url_inapam,
       i.url_ine,
       i.url_tarjeta_circulacion,
       i.id,
       i.folio,
       i.estatus,
       i.created_at,
       i.articulo_id,
       a.numero as articulo_numero,
       a.descripcion as articulo_descripcion,
       i.fraccion_id,
       f.numero as fraccion_numero,
       f.descripcion as fraccion_descripcion,
       i.nombre_infractor,
       i.apellido_paterno_infractor,
       i.apellido_materno_infractor,
       i.curp_infractor,
       i.nombre_titular_liberacion,
       i.appaterno_titular_liberacion,
       i.apmaterno_titular_liberacion,
       i.marca,
       i.modelo,
       i.color,
       i.placa,
       i.correo_infractor,
       i.latitud,
       i.longitud,
       i.codigo_postal,
       i.calle,
       i.numero,
       i.municipio,
       i.estado,
       i.tipo_garantia,
       i.garantia_entregada,
       o.total_umas,
       o.total_pesos,
       i.oficial_id,
       i.es_titular,
       i.no_oficio_fiscalia,
       i.url_oficio_fiscalia,
       i.estatus_dependencia,
       i.no_carpeta_investigacion,
       i.url_oficio_pago_corralon,
       i.url_orden_salida_liberaciones,
       o.estatus as estatus_orden_pago,
       off.numero_empleado as oficial_numero_empleado,
       u.nombres as oficial_nombres,
       u.apellido_p as oficial_apellido_p,
       u.apellido_m as oficial_apellido_m,
        pat.numero_unidad as patrulla_nombre,
        off.activo as oficial_activo,
        g.nombre as grua_nombre
      FROM v2_infracciones i
      LEFT JOIN v2_ordenes_pago_sa7 o ON o.infraccion_id = i.id
      JOIN v2_articulos_ley a on i.articulo_id = a.id
      JOIN v2_fracciones_ley f on i.fraccion_id = f.id
      LEFT JOIN v2_oficiales off ON off.id = i.oficial_id
      LEFT JOIN v2_usuarios u ON off.usuario_id = u.id
      LEFT JOIN v2_patrullas pat ON off.patrulla_id = pat.id
      LEFT JOIN v2_gruas g ON g.id = i.grua_id
     WHERE i.id = $1
     ORDER BY o.created_at DESC
     LIMIT 1`,
    [id],
  );
  const raw = result.rows[0] ?? null;
  if (!raw) return null;
  return rowToInfraccionDetalle(raw);
}
