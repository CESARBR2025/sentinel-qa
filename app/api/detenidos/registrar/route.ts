import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { query } from "@/lib/db";

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    try {

        const body = await req.json();

        const cleanData = Object.fromEntries(
            Object.entries(body).map(([key, value]) => {
                if (value === "" || value === undefined || value === null) {
                    return [key, null];
                }
                if (value === "true") return [key, true];
                if (value === "false") return [key, false];
                return [key, value];
            })
        );

        const result = await query<any>(
            `INSERT INTO iph_detenidos(
                fecha_nacimiento,
                edad,
                genero,
                alias,
                ciudad_origen,
                calle_detenido,
                numero_detenido,
                colonia_detenido,
                articulo,
                tipo_falta,
                es_rnd,
                rnd,
                calle_arresto,
                colonia_arresto,
                sector_arresto,
                agrupamiento_arresto,
                latitud_arresto,
                longitud_arresto,
                presencia,
                verbalizacion,
                control_contacto,
                control_fisico,
                tecnicas_no_letales,
                fuerza_letal,
                folio_iph,
                folio_911,
                dia_evento,
                fecha_evento,
                fecha_reporte,
                hora_reporte,
                hora_inicio_evento,
                hora_final_evento,
                hora_promedio,
                delito,
                modus_operandi,
                articulos_objetos,
                calle_hecho,
                numero_hecho,
                colonia_hecho,
                latitud_hecho,
                longitud_hecho,
                sector_hecho,
                rt_responsable,
                turno_responsable,
                crp_unidad,
                nombre_afectado,
                telefono_afectado,
                calle_afectado,
                numero_afectado,
                colonia_afectado,
                marca_vehiculo,
                submarca_vehiculo,
                tipo_vehiculo,
                color_vehiculo,
                placas_vehiculo,
                estado_vehiculo,
                niv_vehiculo,
                motor_vehiculo,
                modelo_vehiculo,
                ap_nuc,
                fuero,
                agente_aprehensor,
                reporte_denuncia_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63) RETURNING id, folio;`,
            [
                cleanData.fechaNacimiento,
                cleanData.edad,
                cleanData.genero,
                cleanData.alias,
                cleanData.ciudadOrigen,
                cleanData.calleDetenido,
                cleanData.numeroDetenido,
                cleanData.coloniaDetenido,
                cleanData.articulo,
                cleanData.tipoFalta,
                cleanData.esRND,
                cleanData.rnd,
                cleanData.calleArresto,
                cleanData.coloniaArresto,
                cleanData.sectorArresto,
                cleanData.agrupamientoArresto,
                cleanData.latitudArresto,
                cleanData.longitudArresto,
                cleanData.presencia,
                cleanData.verbalizacion,
                cleanData.controlContacto,
                cleanData.controlFisico,
                cleanData.tecnicasNoLetales,
                cleanData.fuerzaLetal,
                cleanData.folioIPH,
                cleanData.folio911,
                cleanData.diaEvento,
                cleanData.fechaEvento,
                cleanData.fechaReporte,
                cleanData.horaReporte,
                cleanData.horaInicioEvento,
                cleanData.horaFinalEvento,
                cleanData.horaPromedio,
                cleanData.delito,
                cleanData.modusOperandi,
                cleanData.articulosObjetos,
                cleanData.calleHecho,
                cleanData.numeroHecho,
                cleanData.coloniaHecho,
                cleanData.latitudHecho,
                cleanData.longitudHecho,
                cleanData.sectorHecho,
                cleanData.rtResponsable,
                cleanData.turnoResponsable,
                cleanData.crpUnidad,
                cleanData.nombreAfectado,
                cleanData.telefonoAfectado,
                cleanData.calleAfectado,
                cleanData.numeroAfectado,
                cleanData.coloniaAfectado,
                cleanData.marcaVehiculo,
                cleanData.submarcaVehiculo,
                cleanData.tipoVehiculo,
                cleanData.colorVehiculo,
                cleanData.placasVehiculo,
                cleanData.estadoVehiculo,
                cleanData.nivVehiculo,
                cleanData.motorVehiculo,
                cleanData.modeloVehiculo,
                cleanData.apNuc,
                cleanData.fuero,
                cleanData.agenteAprehensor,
                cleanData.reporteDenunciaId
            ]
        );

        return NextResponse.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { error: "Error al registrar IPH" },
            { status: 500 }
        );

    }
}