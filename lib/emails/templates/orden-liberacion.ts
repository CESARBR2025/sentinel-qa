import { emailLayout, emailStyles, inlineStyles } from './layout'

export interface EnviarCorreoOrdenLiberacionParams {
  correoTitular: string
  nombreTitular: string
  idInfraccion: string
  folio: string
  placa: string
}

export function templateOrdenLiberacion(
  data: EnviarCorreoOrdenLiberacionParams & { urlVistaCiudadano?: string },
) {
  const urlVistaCiudadano =
    data.urlVistaCiudadano ||
    `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://via-v2.vercel.app'}/infracciones/${data.idInfraccion}`

  const html = emailLayout(`
    <p style="${inlineStyles(emailStyles.greeting)}">
      Estimado(a) <strong>${data.nombreTitular}</strong>,
    </p>

    <p style="${inlineStyles(emailStyles.body)}">
      Nos complace informarle que su proceso de liberación vehicular ha sido completado exitosamente.
      La <strong>Orden de Liberación</strong> para el vehículo con placa <strong>${data.placa}</strong>
      ya se encuentra disponible.
    </p>

    <div style="${inlineStyles(emailStyles.folioBox)}">
      <p style="margin:0 0 8px 0;"><b>Folio:</b> ${data.folio}</p>
      <p style="margin:0 0 8px 0;"><b>Placa:</b> ${data.placa}</p>
      <p style="margin:0;"><b>Estatus:</b> LIBERADO</p>
    </div>

    <div style="text-align:center; margin: 24px 0;">
      <a href="${urlVistaCiudadano}" style="${inlineStyles(emailStyles.primaryButton)}">
        VER ORDEN DE LIBERACIÓN
      </a>
    </div>

    <p style="${inlineStyles(emailStyles.body)}; text-align:center; font-size:12px;">
      Si no puede acceder mediante el botón anterior, copie el siguiente enlace en su navegador:
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

Estimado(a) ${data.nombreTitular},

Nos complace informarle que su proceso de liberación vehicular ha sido completado exitosamente. La Orden de Liberación para el vehículo con placa ${data.placa} ya se encuentra disponible.

DATOS:
─────────────────────────────────────────
Folio:                ${data.folio}
Placa:                ${data.placa}
Estatus:              LIBERADO

Para descargar su orden de liberación, ingrese al siguiente enlace:
${urlVistaCiudadano}

Atentamente,

Secretaría de Seguridad Pública Municipal
San Juan del Río, Qro.
`

  return { html, text }
}
