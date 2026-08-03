import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getIncidentesPaginados, getConteoEstatus } from "@/lib/911/service";
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
    searchParams: Promise<{ page?: string; estatus?: string }>;
}) {
    // Manejo seguro de paginación
    const params = await searchParams;
    const page = Math.max(1, Number(params?.page) || 1);
    const estatus = params?.estatus || '';
    const pageSize = 10;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");
    if (!(await tieneAccesoSeccion(session.user.id, "911_ciudadano"))) redirect("/dashboard");

    // Datos iniciales (SSR); el cliente los refresca por polling cada 20s.
    const { rows: listado, total: totalCount } = await getIncidentesPaginados('911', page, pageSize, estatus || null);
    const totalPages = Math.ceil(totalCount / pageSize);

    const conteos = await getConteoEstatus('911')
    const mapaConteos = Object.fromEntries(conteos.map(c => [c.estatus, c.count]))
    const totalGeneral = conteos.reduce((sum, c) => sum + c.count, 0)

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', display: 'flex', flexDirection: 'column' }}>
            <Suspense fallback={null}><ToastOnLoad /></Suspense>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

            <DashboardHeader
                user={{ name: session.user.name, apellido: session.user.apellido ?? undefined, email: session.user.email }}
                roleLabel="Bitácora Central 911"
            />

            <main className="pad-pagina" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>

                <PageHeader
                    title="Bitácora"
                    accent="911"
                    subtitle="Llamadas entrantes y estatus de atención"
                    actions={<>
                        <PageHeaderLink href="/agente_911" variant="secondary">← Panel 911</PageHeaderLink>
                        <PageHeaderLink href="/agente_911/ciudadano">+ Nuevo Registro</PageHeaderLink>
                    </>}
                />

                <Bitacora911
                    key={`${estatus}-${page}`}
                    canal="911"
                    estatus={estatus}
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
