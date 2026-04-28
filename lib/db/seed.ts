/**
 * Seed inicial: roles base y módulos del sidebar.
 * Ejecutar: npm run db:seed
 */
import { loadEnvConfig } from '@next/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

loadEnvConfig(process.cwd())

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db   = drizzle(pool, { schema })

async function main() {
  // ── Roles ──────────────────────────────────────────────────────────────────
  await db.insert(schema.roles).values([
    { nombre: 'Administrador',     descripcion: 'Acceso total al sistema' },
    { nombre: 'Consultor',         descripcion: 'Acceso de sólo lectura/consulta' },
    { nombre: 'Operador',          descripcion: 'Captura y gestión de incidentes' },
    { nombre: 'Operador Víctimas', descripcion: 'Captura y seguimiento de medidas y búsquedas' },
    { nombre: 'Jurídico',          descripcion: 'Bandeja legal, solicitudes a C4 y contestaciones' },
  ]).onConflictDoNothing()

  // ── Módulos del sidebar ────────────────────────────────────────────────────
  await db.insert(schema.modulos).values([
    { clave: 'dashboard',   nombre: 'Dashboard',           ruta: '/dashboard',        icono: 'LayoutDashboard', orden: 1 },
    { clave: 'incidentes',  nombre: 'Incidentes',          ruta: null,                icono: 'AlertTriangle',   orden: 2 },
    { clave: 'reportes',    nombre: 'Reportes',            ruta: null,                icono: 'BarChart2',       orden: 3 },
    { clave: 'catalogos',   nombre: 'Catálogos',           ruta: null,                icono: 'BookOpen',        orden: 4 },
    { clave: 'prevencion',  nombre: 'Prevención del Delito', ruta: null,              icono: 'ShieldAlert',     orden: 5 },
    { clave: 'admin',       nombre: 'Administración',      ruta: null,                icono: 'Settings',        orden: 6 },
  ]).onConflictDoNothing()

  const grupos = await db.query.modulos.findMany({
    where: (m, { inArray }) => inArray(m.clave, ['incidentes', 'reportes', 'catalogos', 'prevencion', 'admin']),
  })
  const id = (clave: string) => grupos.find(g => g.clave === clave)!.id

  await db.insert(schema.modulos).values([
    // Incidentes
    { clave: 'incidentes.nuevo',       nombre: 'Nuevo incidente',       ruta: '/incidentes/nuevo',          icono: 'Plus',          padreId: id('incidentes'), orden: 1 },
    { clave: 'incidentes.listado',     nombre: 'Listado',               ruta: '/incidentes',                icono: 'List',          padreId: id('incidentes'), orden: 2 },
    { clave: 'incidentes.mapa',        nombre: 'Mapa',                  ruta: '/incidentes/mapa',           icono: 'Map',           padreId: id('incidentes'), orden: 3 },
    // Reportes
    { clave: 'reportes.diario',        nombre: 'Reporte diario',        ruta: '/reportes/diario',           icono: 'FileText',      padreId: id('reportes'),    orden: 1 },
    { clave: 'reportes.estadistico',   nombre: 'Estadísticas',          ruta: '/reportes/estadistico',      icono: 'TrendingUp',    padreId: id('reportes'),    orden: 2 },
    // Catálogos
    { clave: 'catalogos.tipos',        nombre: 'Tipos de incidente',    ruta: '/catalogos/tipos',           icono: 'Tag',           padreId: id('catalogos'),   orden: 1 },
    { clave: 'catalogos.colonias',     nombre: 'Colonias/Sectores',     ruta: '/catalogos/colonias',        icono: 'MapPin',        padreId: id('catalogos'),   orden: 2 },
    // Prevención del Delito
    { clave: 'prevencion.medidas',     nombre: 'Medidas de Protección', ruta: '/prevencion/medidas',        icono: 'ShieldCheck',   padreId: id('prevencion'),  orden: 1 },
    { clave: 'prevencion.busquedas',   nombre: 'Búsquedas / Alba',      ruta: '/prevencion/busquedas',      icono: 'Search',        padreId: id('prevencion'),  orden: 2 },
    { clave: 'prevencion.juridico',    nombre: 'Área Jurídica',         ruta: '/prevencion/juridico',       icono: 'Scale',         padreId: id('prevencion'),  orden: 3 },
    // Administración
    { clave: 'admin.usuarios',         nombre: 'Usuarios',              ruta: '/admin/usuarios',            icono: 'Users',         padreId: id('admin'),       orden: 1 },
    { clave: 'admin.permisos',         nombre: 'Permisos',              ruta: '/admin/permisos',            icono: 'ShieldCheck',   padreId: id('admin'),       orden: 2 },
    { clave: 'admin.roles',            nombre: 'Roles',                 ruta: '/admin/roles',               icono: 'UserCog',       padreId: id('admin'),       orden: 3 },
  ]).onConflictDoNothing()

  console.log('✓ Seed completado')
  await pool.end()
}

main().catch(e => { console.error(e); process.exit(1) })
