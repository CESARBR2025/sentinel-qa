import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getIncidentesPaginados, getConteoCanalizacion } from "@/lib/911/service";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { PageHeader, PageHeaderLink } from "@/components/partials/PageHeader";
import { DashboardFooter } from "@/components/partials/Footer";
import { Bitacora911 } from "@/components/911/Bitacora911";
import { tieneAccesoSeccion } from "@/lib/911/permisos";
import ToastOnLoad from "./ToastOnLoad";

export default async function Listado911Page({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; canalizacion?: string }>;
}) {
    // Manejo seguro de paginación
    const params = await searchParams;
    const page = Math.max(1, Number(params?.page) || 1);
    const canalizacion = params?.canalizacion || '';
    const pageSize = 10;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");
    if (!(await tieneAccesoSeccion(session.user.id, "911_ciudadano"))) redirect("/dashboard");

    // Datos iniciales (SSR); el cliente los refresca por polling cada 20s.
    const { rows: listado, total: totalCount } = await getIncidentesPaginados('911', page, pageSize, (canalizacion || null) as 'canalizados' | 'sin_canalizacion' | null);
    const totalPages = Math.ceil(totalCount / pageSize);

    const conteos = await getConteoCanalizacion('911')
    const mapaConteos = Object.fromEntries(conteos.map(c => [c.clave, c.count]))
    const totalGeneral = conteos.reduce((sum, c) => sum + c.count, 0)

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', display: 'flex', flexDirection: 'column' }}>
            <Suspense fallback={null}><ToastOnLoad /></Suspense>

            <DashboardHeader
                user={{ name: session.user.name, apellido: session.user.apellido ?? undefined, email: session.user.email }}
                roleLabel="Bitácora Central 911"
                backHref="/agente_911"
                backLabel="Panel 911"
            />

            <main className="pad-pagina" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>

                <PageHeader
                    title="Reportes Telefónicos"
                    accent="de Ciudadano"
                    subtitle="Llamadas entrantes y estatus de atención"
                    actions={<PageHeaderLink href="/agente_911/ciudadano/nuevoreporte">+ Nuevo Registro</PageHeaderLink>}
                />

                <Bitacora911
                    key={`${canalizacion}-${page}`}
                    canal="911"
                    canalizacion={canalizacion}
                    page={page}
                    rows={listado}
                    total={totalCount}
                    totalPages={totalPages}
                    conteos={mapaConteos}
                    totalGeneral={totalGeneral}
                />

                <DashboardFooter />
            </main>
        </div>
    );
}
