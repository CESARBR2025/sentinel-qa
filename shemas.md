# ADR-001 — Arquitectura del Ecosistema SSPM (CUS + Sentinel + VIA)

## Estado

Aprobado (Diseño base del sistema)

---

# 1. Objetivo

Definir la arquitectura del ecosistema SSPM para:

- Separar responsabilidades por sistema
- Evitar duplicidad de datos
- Centralizar identidad en CUS
- Centralizar administración en Sentinel
- Aislar operación de campo en VIA
- Garantizar escalabilidad a largo plazo

---

# 2. Arquitectura General

```
                    CUS
         (Proveedor de Identidad)

                      │
                      │ JWT + Perfil
                      ▼

                  Sentinel
        (Núcleo Administrativo SSPM)

                      │
      ┌───────────────┼────────────────┐
      │               │                │
      ▼               ▼                ▼

  VIA            Juzgado         Fiscalía
(Captura)     (Resolución)    (Investigación)
```

---

# 3. Responsabilidad de cada sistema

## 3.1 CUS (Identity Provider)

CUS es el sistema de identidad oficial del municipio.

Responsable de:

- Autenticación de usuarios
- Contraseñas
- Datos personales
- Documentación personal
- JWT de acceso
- Identidad general del ciudadano o trabajador

CUS responde:

> ¿Quién eres?

---

## 3.2 Sentinel (Sistema Administrativo SSPM)

Sentinel es el núcleo institucional.

Responsable de:

- Administración del personal SSPM
- Roles y permisos del sistema
- Estructura organizacional
- Oficiales, jueces, fiscales, capturistas
- Configuración de dashboards
- Gestión de expedientes
- Auditoría del sistema

Sentinel responde:

> ¿Qué eres dentro de la SSPM?
>
> ¿Qué puedes hacer dentro del sistema?

---

## 3.3 VIA (Sistema de Captura)

VIA es una herramienta operativa exclusiva.

Responsable de:

- Captura de infracciones
- Evidencias (fotos, firmas)
- Geolocalización
- Registro de eventos en campo

VIA responde:

> ¿Eres oficial para capturar infracciones?

---

# 4. Flujo de Autenticación

```
Usuario inicia sesión
        │
        ▼
CUS valida credenciales
        │
        ▼
CUS emite JWT
        │
        ▼
Sentinel valida JWT
        │
        ▼
Sentinel construye contexto institucional
        │
        ▼
Acceso a módulos (VIA / dashboards / etc.)
```

---

# 5. Respuesta de CUS

## 5.1 Login

```json
{
  "success": true,
  "token": "JWT",
  "id_usuario_general": 17336,
  "sub": 14843,
  "role": "ciudadano",
  "permisos": ["tramites_view", "tramites_create", "perfil_update"]
}
```

### Significado

| Campo              | Descripción                   |
| ------------------ | ----------------------------- |
| token              | JWT de autenticación          |
| id_usuario_general | Identificador único en CUS    |
| sub                | ID interno del usuario en CUS |
| role               | Rol dentro de CUS             |
| permisos           | Permisos del ecosistema CUS   |

---

## 5.2 Perfil de usuario

```json
{
  "success": true,
  "data": {
    "tipo_usuario": "Ciudadano",
    "id_general": 17336,
    "id_ciudadano": 14843,
    "nombre": "CESAR IVAN",
    "primer_apellido": "BARCENAS",
    "segundo_apellido": "ROSALES",
    "nombre_completo": "CESAR IVAN BARCENAS ROSALES",
    "sexo": "H",
    "curp": "XXXXXX",
    "fecha_nacimiento": "2002-11-02",
    "estado": "QUERETARO",
    "direccion": {
      "calle": "...",
      "numero_exterior": "...",
      "codigo_postal": "..."
    },
    "contacto": {
      "telefono": "...",
      "email": "..."
    },
    "documentos": [
      {
        "nombre_documento": "ine.pdf",
        "url_documento": "https://..."
      }
    ]
  }
}
```

---

# 6. Interpretación en Sentinel

Sentinel NO es dueño de la identidad.

Solo consume:

- id_usuario_general
- nombre
- correo
- información básica de perfil

---

# 7. MODELO DE DATOS (SENTINEL)

Sentinel se organiza mediante schemas PostgreSQL.

---

# 7.1 Schema: auth (Autorización)

Responsabilidad:
Control de acceso al sistema Sentinel.

### Tablas:

## auth.usuarios

```sql
id
cus_id_general
activo
ultimo_login
created_at
```

---

## auth.roles

```sql
id
nombre
descripcion
```

---

## auth.permisos

```sql
id
codigo
descripcion
```

---

## auth.usuario_roles

```sql
usuario_id
rol_id
```

---

## auth.rol_permisos

```sql
rol_id
permiso_id
```

---

## auth.sesiones

```sql
id
usuario_id
jwt
expira_en
```

---

# 7.2 Schema: personal (Estructura institucional)

Responsabilidad:
Definir qué es una persona dentro de la SSPM.

---

## personal.personal

```sql
id
usuario_id
dependencia_id
tipo_personal
estatus
fecha_ingreso
```

### tipo_personal (CRÍTICO)

- OFICIAL
- JUEZ
- FISCALIA
- LIBERACIONES
- CAPTURISTA
- ADMIN

---

## personal.oficiales

```sql
id
personal_id
placa
sector
grado
unidad
```

---

## personal.jueces

```sql
id
personal_id
numero_juzgado
```

---

## personal.fiscalia

```sql
id
personal_id
unidad_fiscal
```

---

# 7.3 Schema: catalogos

Responsabilidad:
Datos maestros del sistema.

### Tablas:

- catalogos.dependencias
- catalogos.municipios
- catalogos.unidades
- catalogos.sectores
- catalogos.tipos_documento
- catalogos.tipos_infraccion

---

# 7.4 Schema: reportes

Responsabilidad:
Información generada en campo.

### Tablas:

- reportes.reportes_campo
- reportes.reportes_denuncia
- reportes.reporte_personas
- reportes.reporte_vehiculos
- reportes.reporte_evidencias

---

# 7.5 Schema: expedientes

Responsabilidad:
Gestión administrativa posterior.

### Tablas:

- expedientes.expedientes
- expedientes.movimientos
- expedientes.documentos
- expedientes.estados
- expedientes.participantes

---

# 7.6 Schema: juzgado

Responsabilidad:
Procesos del juzgado cívico.

### Tablas:

- juzgado.audiencias
- juzgado.resoluciones
- juzgado.sanciones
- juzgado.liberaciones

---

# 7.7 Schema: fiscalia

Responsabilidad:
Investigación y procesos legales.

### Tablas:

- fiscalia.investigaciones
- fiscalia.carpetas
- fiscalia.actuaciones

---

# 7.8 Schema: dashboard

Responsabilidad:
KPIs y visualización.

### Tablas:

- dashboard.vistas
- dashboard.widgets
- dashboard.configuraciones

---

# 7.9 Schema: auditoria

Responsabilidad:
Trazabilidad del sistema.

### Tablas:

- auditoria.logs
- auditoria.eventos
- auditoria.accesos
- auditoria.cambios

---

# 8. REGLA CLAVE DE NEGOCIO (MUY IMPORTANTE)

## Acceso a VIA

El acceso a VIA NO depende de roles.

Depende del tipo de personal.

```pseudo
if (personal.tipo_personal == "OFICIAL") {
    acceso a VIA
} else {
    acceso denegado
}
```

---

# 9. Dimensiones del sistema

## DIMENSIÓN 1 — Identidad (CUS)

> ¿Quién eres?

---

## DIMENSIÓN 2 — Estructura institucional (Sentinel / personal)

> ¿Qué eres dentro de SSPM?

---

## DIMENSIÓN 3 — Permisos del sistema (Sentinel / auth)

> ¿Qué puedes hacer dentro del sistema?

---

## DIMENSIÓN 4 — Operación de campo (VIA)

> Captura de infracciones

---

# 10. Principios arquitectónicos

## 10.1

CUS es el proveedor de identidad.

---

## 10.2

Sentinel es la fuente de verdad del contexto institucional.

---

## 10.3

VIA es una herramienta operativa exclusiva.

---

## 10.4

El acceso a sistemas operativos depende del tipo de personal, no de permisos genéricos.

---

## 10.5

No existe duplicidad de identidad entre sistemas.

---

## 10.6

Cada sistema tiene una responsabilidad única e inmutable.
