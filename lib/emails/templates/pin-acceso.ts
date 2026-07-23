import { emailLayout, emailStyles, inlineStyles } from './layout'

export interface EnviarCorreoPinAccesoParams {
  correoInfractor: string
  nombreInfractor: string
  idInfraccion: string
  folio: string
  pin: string
  urlVistaCiudadano?: string
}

export function templatePinAcceso(
  data: EnviarCorreoPinAccesoParams,
) {
  const urlVistaCiudadano =
    data.urlVistaCiudadano ||
    `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://via-v2.vercel.app'}/infracciones/${data.idInfraccion}`

  const html = emailLayout(`
    <p style="${inlineStyles(emailStyles.greeting)}">
      Estimado(a) <strong>${data.nombreInfractor}</strong>,
    </p>

    <p style="${inlineStyles(emailStyles.body)}">
      Se ha registrado una infracción de tránsito a su nombre con el folio <strong>${data.folio}</strong>.
      Para consultar los detalles y realizar el pago, utilice el siguiente código de acceso:
    </p>

    <div style="text-align:center; margin: 24px 0;">
      <div style="display:inline-block; background:#fef3c7; border:2px solid #f59e0b; border-radius:12px; padding:16px 32px; letter-spacing:8px;">
        <span style="font-size:32px; font-weight:700; font-family:monospace; color:#92400e;">
          ${data.pin.split('').join(' ')}
        </span>
      </div>
    </div>

    <div style="${inlineStyles(emailStyles.folioBox)}">
      <p style="margin:0 0 8px 0;"><b>Folio:</b> ${data.folio}</p>
      <p style="margin:0 0 8px 0;"><b>Código de acceso:</b> ${data.pin}</p>
      <p style="margin:0;"><b>Estatus:</b> Pendiente de pago</p>
    </div>

    <div style="text-align:center; margin: 24px 0;">
      <a href="${urlVistaCiudadano}" style="${inlineStyles(emailStyles.primaryButton)}">
        CONSULTAR INFRACCIÓN
      </a>
    </div>

    <p style="${inlineStyles(emailStyles.body)}; text-align:center; font-size:12px;">
      Necesitará el código de acceso de 6 dígitos para visualizar los datos de su infracción.
    </p>

    <div style="background: #f5f5f5; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 11px; border: 1px solid #d0d0d0; text-align:center;">
      <a href="${urlVistaCiudadano}" style="color: #1f355a; text-decoration:none;">
        ${urlVistaCiudadano}
      </a>
    </div>
  `)

  const text = `
SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL
SAN JUAN DEL RÍO

Estimado(a) ${data.nombreInfractor},

Se ha registrado una infracción de tránsito a su nombre con el folio ${data.folio}.
Para consultar los detalles y realizar el pago, utilice el siguiente código de acceso:

  CÓDIGO DE ACCESO: ${data.pin}

DATOS:
─────────────────────────────────────────
Folio:                ${data.folio}
Código de acceso:     ${data.pin}
Estatus:              Pendiente de pago

Ingrese al siguiente enlace para consultar:
${urlVistaCiudadano}

Atentamente,

Secretaría de Seguridad Pública Municipal
San Juan del Río, Qro.
`

  return { html, text }
}
