'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { query } from '@/lib/db'
import { tienePermiso } from './permisos'

export interface ComplementoIncidenciaInput {
  incidenteId: string
  rt?: string | null
  turno?: string | null
  articulosObjetos?: string | null
  apNuc?: string | null
  calleAfec?: string | null
  numeroAfec?: string | null
  coloniaAfec?: string | null
  fueroOverride?: string | null
  agrupamiento?: string | null
  folioRnd?: string | null
  originario?: string | null
  nucCu?: string | null
  edad?: number | null
  fechaNacimiento?: string | null
  sexo?: string | null
  calleDet?: string | null
  numeroDet?: string | null
  coloniaDet?: string | null
  marca?: string | null
  submarca?: string | null
  tipoVehiculo?: string | null
  color?: string | null
  placas?: string | null
  estadoVehiculo?: string | null
  niv?: string | null
  motor?: string | null
  modelo?: string | null
  fechaIngreso?: string | null
  fechaSalida?: string | null
  otroDelito?: string | null
  masc?: string | null
  umecas?: string | null
  marcarCompleto: boolean
}

export async function guardarComplementoIncidencia(input: ComplementoIncidenciaInput): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autorizado')
  if (!(await tienePermiso(session.user.id, 'formatos_udai', 'editar'))) throw new Error('No autorizado')

  const campos = { ...input }
  delete (campos as Partial<ComplementoIncidenciaInput>).incidenteId
  delete (campos as Partial<ComplementoIncidenciaInput>).marcarCompleto

  await query(
    `INSERT INTO formato_incidencia_complemento (
       incidente_id, rt, turno, articulos_objetos, ap_nuc, calle_afec, numero_afec, colonia_afec,
       fuero_override, agrupamiento, folio_rnd, originario, nuc_cu, edad, fecha_nacimiento, sexo,
       calle_det, numero_det, colonia_det, marca, submarca, tipo_vehiculo, color, placas,
       estado_vehiculo, niv, motor, modelo, fecha_ingreso, fecha_salida, otro_delito, masc, umecas,
       completado_en, completado_por, actualizado_en
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,NOW())
     ON CONFLICT (incidente_id) DO UPDATE SET
       rt = EXCLUDED.rt, turno = EXCLUDED.turno, articulos_objetos = EXCLUDED.articulos_objetos,
       ap_nuc = EXCLUDED.ap_nuc, calle_afec = EXCLUDED.calle_afec, numero_afec = EXCLUDED.numero_afec,
       colonia_afec = EXCLUDED.colonia_afec, fuero_override = EXCLUDED.fuero_override,
       agrupamiento = EXCLUDED.agrupamiento, folio_rnd = EXCLUDED.folio_rnd, originario = EXCLUDED.originario,
       nuc_cu = EXCLUDED.nuc_cu, edad = EXCLUDED.edad, fecha_nacimiento = EXCLUDED.fecha_nacimiento,
       sexo = EXCLUDED.sexo, calle_det = EXCLUDED.calle_det, numero_det = EXCLUDED.numero_det,
       colonia_det = EXCLUDED.colonia_det, marca = EXCLUDED.marca, submarca = EXCLUDED.submarca,
       tipo_vehiculo = EXCLUDED.tipo_vehiculo, color = EXCLUDED.color, placas = EXCLUDED.placas,
       estado_vehiculo = EXCLUDED.estado_vehiculo, niv = EXCLUDED.niv, motor = EXCLUDED.motor,
       modelo = EXCLUDED.modelo, fecha_ingreso = EXCLUDED.fecha_ingreso, fecha_salida = EXCLUDED.fecha_salida,
       otro_delito = EXCLUDED.otro_delito, masc = EXCLUDED.masc, umecas = EXCLUDED.umecas,
       completado_en = COALESCE(EXCLUDED.completado_en, formato_incidencia_complemento.completado_en),
       completado_por = COALESCE(EXCLUDED.completado_por, formato_incidencia_complemento.completado_por),
       actualizado_en = NOW()`,
    [
      input.incidenteId, campos.rt ?? null, campos.turno ?? null, campos.articulosObjetos ?? null,
      campos.apNuc ?? null, campos.calleAfec ?? null, campos.numeroAfec ?? null, campos.coloniaAfec ?? null,
      campos.fueroOverride ?? null, campos.agrupamiento ?? null, campos.folioRnd ?? null, campos.originario ?? null,
      campos.nucCu ?? null, campos.edad ?? null, campos.fechaNacimiento ?? null, campos.sexo ?? null,
      campos.calleDet ?? null, campos.numeroDet ?? null, campos.coloniaDet ?? null, campos.marca ?? null,
      campos.submarca ?? null, campos.tipoVehiculo ?? null, campos.color ?? null, campos.placas ?? null,
      campos.estadoVehiculo ?? null, campos.niv ?? null, campos.motor ?? null, campos.modelo ?? null,
      campos.fechaIngreso ?? null, campos.fechaSalida ?? null, campos.otroDelito ?? null, campos.masc ?? null,
      campos.umecas ?? null,
      input.marcarCompleto ? new Date().toISOString() : null,
      input.marcarCompleto ? session.user.id : null,
    ],
  )

  revalidatePath('/formatos-udai/reportes-incidencias')
}
