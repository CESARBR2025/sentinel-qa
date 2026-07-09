/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    // 1. Validar Sesión
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    // 2. Parsear FormData (Archivos + Texto)
    const formData = await req.formData();
    
    // 3. Procesar Imágenes
    const uploadDir = path.join(process.cwd(), 'public/uploads/detenidos');
    await mkdir(uploadDir, { recursive: true });

    const saveFile = async (file: File | null, prefix: string) => {
      if (!file || typeof file === 'string') return null;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${prefix}_${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      return `/uploads/detenidos/${fileName}`;
    };

    const fotoFrontalUrl = await saveFile(formData.get('fotoFrontal') as File, 'FRONTAL');
    const fotoObjetosUrl = await saveFile(formData.get('fotoObjetos') as File, 'OBJETOS');

    // 4. Extraer campos de texto
    const d = (key: string) => formData.get(key)?.toString() || null;

    // 5. Insertar en la Base de Datos
    await query(
      `INSERT INTO fichas_inteligencia_detenidos (
        nombre_detenido, folio, foto_frontal_url, foto_objetos_url, fecha_nacimiento,
        origen, genero, escolaridad, estado_civil, ocupacion, domicilio,
        rasgos_particulares, eventos_delictivos, fecha_hora_evento, rnd, iph,
        expediente, lugar_evento, lugar_detencion, nexos_delictivos, zona_operacion,
        puesta_disposicion, modus_operandi, info_adicional, antecedentes, faltas_admin,
        capturado_por
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27
      )`,
      [d('nombreDetenido'), d('folio'), fotoFrontalUrl, fotoObjetosUrl,
       d('fechaNacimiento'), d('origen'), d('genero'), d('escolaridad'),
       d('estadoCivil'), d('ocupacion'), d('domicilio'), d('rasgosParticulares'),
       d('eventosDelictivos'), d('fechaHora'), d('rnd'), d('iph'),
       d('expediente'), d('lugarEvento'), d('lugarDetencion'), d('nexosDelictivos'),
       d('zonaOperacion'), d('puestaDisposicion'), d('modusOperandi'),
       d('infoAdicional'), d('antecedentes'), d('faltasAdmin'), session.user.name],
    );

    return NextResponse.json({ 
      success: true, 
      message: "Ficha de Inteligencia guardada correctamente" 
    }, { status: 201 });

  } catch (error: any) {
    console.error("ERROR_REGISTRO_INTELIGENCIA:", error);
    return NextResponse.json({ message: "Error interno: " + error.message }, { status: 500 });
  }
}