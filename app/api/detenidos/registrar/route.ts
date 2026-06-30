import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
    try {

        const body = await req.json();

        const result = await db.execute(sql`

            INSERT INTO iph_detenidos(

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
                agente_aprehensor

            )

            VALUES(

                ${body.fechaNacimiento},
                ${body.edad},
                ${body.genero},
                ${body.alias},
                ${body.ciudadOrigen},

                ${body.calleDetenido},
                ${body.numeroDetenido},
                ${body.coloniaDetenido},

                ${body.articulo},
                ${body.tipoFalta},
                ${body.rnd},

                ${body.calleArresto},
                ${body.coloniaArresto},
                ${body.sectorArresto},
                ${body.agrupamientoArresto},

                ${body.latitudArresto},
                ${body.longitudArresto},

                ${body.presencia},
                ${body.verbalizacion},
                ${body.controlContacto},
                ${body.controlFisico},
                ${body.tecnicasNoLetales},
                ${body.fuerzaLetal},

                ${body.folioIPH},
                ${body.folio911},

                ${body.diaEvento},
                ${body.fechaEvento},
                ${body.fechaReporte},

                ${body.horaReporte},
                ${body.horaInicioEvento},
                ${body.horaFinalEvento},
                ${body.horaPromedio},

                ${body.delito},
                ${body.modusOperandi},
                ${body.articulosObjetos},

                ${body.calleHecho},
                ${body.numeroHecho},
                ${body.coloniaHecho},

                ${body.latitudHecho},
                ${body.longitudHecho},

                ${body.sectorHecho},
                ${body.rtResponsable},
                ${body.turnoResponsable},
                ${body.crpUnidad},

                ${body.nombreAfectado},
                ${body.telefonoAfectado},
                ${body.calleAfectado},
                ${body.numeroAfectado},
                ${body.coloniaAfectado},

                ${body.marcaVehiculo},
                ${body.submarcaVehiculo},
                ${body.tipoVehiculo},
                ${body.colorVehiculo},
                ${body.placasVehiculo},
                ${body.estadoVehiculo},
                ${body.nivVehiculo},
                ${body.motorVehiculo},
                ${body.modeloVehiculo},

                ${body.apNuc},
                ${body.fuero},
                ${body.agenteAprehensor}

            )

            RETURNING id, folio;

        `);

        return NextResponse.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { error: "Error al registrar IPH" },
            { status: 500 }
        );

    }
}