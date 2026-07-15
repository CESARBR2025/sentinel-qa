import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { registrarFichaInteligencia } from '@/lib/monitorista/repository';
import { tienePermiso } from '@/lib/monitorista/permisos';

export async function POST(req: Request) {
  try {
    // 1. Validar Sesión
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    if (!(await tienePermiso(session.user.id, 'detenidos', 'crear'))) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

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
    await registrarFichaInteligencia({
      nombreDetenido: d('nombreDetenido'),
      folio: d('folio'),
      fotoFrontalUrl,
      fotoObjetosUrl,
      fechaNacimiento: d('fechaNacimiento'),
      origen: d('origen'),
      genero: d('genero'),
      escolaridad: d('escolaridad'),
      estadoCivil: d('estadoCivil'),
      ocupacion: d('ocupacion'),
      domicilio: d('domicilio'),
      rasgosParticulares: d('rasgosParticulares'),
      eventosDelictivos: d('eventosDelictivos'),
      fechaHora: d('fechaHora'),
      rnd: d('rnd'),
      iph: d('iph'),
      expediente: d('expediente'),
      lugarEvento: d('lugarEvento'),
      lugarDetencion: d('lugarDetencion'),
      nexosDelictivos: d('nexosDelictivos'),
      zonaOperacion: d('zonaOperacion'),
      puestaDisposicion: d('puestaDisposicion'),
      modusOperandi: d('modusOperandi'),
      infoAdicional: d('infoAdicional'),
      antecedentes: d('antecedentes'),
      faltasAdmin: d('faltasAdmin'),
      capturadoPor: session.user.name,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Ficha de Inteligencia guardada correctamente" 
    }, { status: 201 });

  } catch (error: any) {
    console.error("ERROR_REGISTRO_INTELIGENCIA:", error);
    return NextResponse.json({ message: "Error interno: " + error.message }, { status: 500 });
  }
}