/**
 * Seed inicial: roles base y módulos del sidebar.
 * Ejecutar: npm run db:seed
 */
import { loadEnvConfig } from '@next/env'
import { Pool } from 'pg'

loadEnvConfig(process.cwd())

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  // ── Roles ──────────────────────────────────────────────────────────────────
  await pool.query(`
    INSERT INTO roles (nombre, descripcion)
    VALUES
      ('Administrador',     'Acceso total al sistema'),
      ('Consultor',         'Acceso de sólo lectura/consulta'),
      ('Operador',          'Captura y gestión de incidentes'),
      ('Operador Víctimas', 'Captura y seguimiento de medidas y búsquedas'),
      ('Jurídico',          'Bandeja legal, solicitudes a C4 y contestaciones'),
      ('Agente Fiscalía',   'Agente del ministerio público'),
      ('Agente Liberaciones', 'Gestión de liberaciones de vehículos'),
      ('Agente Infracciones', 'Gestión de infracciones de tránsito')
    ON CONFLICT (nombre) DO NOTHING
  `)

  // ── Módulos del sidebar ────────────────────────────────────────────────────
  await pool.query(`
    INSERT INTO modulos (clave, nombre, ruta, icono, orden)
    VALUES
      ('dashboard',   'Dashboard',           '/dashboard',        'LayoutDashboard', 1),
      ('incidentes',  'Incidentes',          null,                'AlertTriangle',   2),
      ('reportes',    'Reportes',            null,                'BarChart2',       3),
      ('catalogos',   'Catálogos',           null,                'BookOpen',        4),
      ('prevencion',  'Prevención del Delito', null,              'ShieldAlert',     5),
      ('admin',       'Administración',      null,                'Settings',        6)
    ON CONFLICT (clave) DO NOTHING
  `)

  const grupos = (await pool.query<{ id: number; clave: string }>(
    `SELECT id, clave FROM modulos WHERE clave = ANY($1)`,
    [['incidentes', 'reportes', 'catalogos', 'prevencion', 'admin']],
  )).rows
  const id = (clave: string) => grupos.find(g => g.clave === clave)!.id

  await pool.query(`
    INSERT INTO modulos (clave, nombre, ruta, icono, padre_id, orden)
    VALUES
      ('incidentes.nuevo',     'Nuevo incidente',    '/incidentes/nuevo',       'Plus',       $1, 1),
      ('incidentes.listado',   'Listado',             '/incidentes',             'List',       $1, 2),
      ('incidentes.mapa',      'Mapa',                '/incidentes/mapa',        'Map',        $1, 3),
      ('reportes.diario',      'Reporte diario',      '/reportes/diario',        'FileText',   $2, 1),
      ('reportes.estadistico', 'Estadísticas',        '/reportes/estadistico',   'TrendingUp', $2, 2),
      ('catalogos.tipos',      'Tipos de incidente',  '/catalogos/tipos',        'Tag',        $3, 1),
      ('catalogos.colonias',   'Colonias/Sectores',   '/catalogos/colonias',     'MapPin',     $3, 2),
      ('prevencion.medidas',   'Medidas de Protección', '/prevencion/medidas',   'ShieldCheck',$4, 1),
      ('prevencion.busquedas', 'Búsquedas / Alba',    '/prevencion/busquedas',   'Search',     $4, 2),
      ('prevencion.juridico',  'Área Jurídica',       '/prevencion/juridico',    'Scale',      $4, 3),
      ('admin.usuarios',       'Usuarios',            '/admin/usuarios',         'Users',      $5, 1),
      ('admin.permisos',       'Permisos',            '/admin/permisos',         'ShieldCheck',$5, 2),
      ('admin.roles',          'Roles',               '/admin/roles',            'UserCog',    $5, 3)
    ON CONFLICT (clave) DO NOTHING
  `, [id('incidentes'), id('reportes'), id('catalogos'), id('prevencion'), id('admin')])

  console.log('✓ Seed completado')
  await pool.end()
}

main().catch(e => { console.error(e); process.exit(1) })
