import { emailLayout, emailStyles, inlineStyles } from './layout'

export interface EnviarCorreoPagoConfirmadoParams {
  correoInfractor: string
  nombreInfractor: string
  idInfraccion: string
  folio: string
  placa: string
  monto: number
  urlVistaCiudadano?: string
}

export function templatePagoConfirmado(data: EnviarCorreoPagoConfirmadoParams) {
  const urlVistaCiudadano =
    data.urlVistaCiudadano ||
    `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://via-v2.vercel.app'}/infracciones/${data.idInfraccion}`

  const montoFormateado = data.monto.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const html = emailLayout(`
    <p style="${inlineStyles(emailStyles.greeting)}">
      Estimado(a) <strong>${data.nombreInfractor}</strong>,
    </p>

    <p style="${inlineStyles(emailStyles.body)}">
      Su infracción ha sido <strong>confirmada como pagada</strong> en el sistema digital de la Secretaría de Seguridad Pública Municipal.
    </p>

    <div style="${inlineStyles(emailStyles.folioBox)}">
      <p style="margin:0 0 8px 0;"><b>Folio:</b> ${data.folio}</p>
      <p style="margin:0 0 8px 0;"><b>Placa:</b> ${data.placa || 'N/A'}</p>
      <p style="margin:0 0 8px 0;"><b>Monto pagado:</b> $${montoFormateado} MXN</p>
      <p style="margin:0;"><b>Estatus:</b> PAGADA</p>
    </div>

    <div style="text-align:center; margin: 24px 0;">
      <a href="${urlVistaCiudadano}" style="${inlineStyles(emailStyles.primaryButton)}">
        VER DETALLES DE INFRACCIÓN
      </a>
    </div>

    <p style="${inlineStyles(emailStyles.body)}; text-align:center; font-size:12px;">
      Puede consultar los detalles de su infracción en cualquier momento con el enlace anterior.
    </p>
  `)

  const text = `
SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL
SAN JUAN DEL RÍO

Estimado(a) ${data.nombreInfractor},

Su infracción ha sido confirmada como pagada en el sistema digital.

DATOS DE LA INFRACCIÓN:
─────────────────────────────────────────
Folio:                ${data.folio}
Placa:                ${data.placa || 'N/A'}
Monto pagado:         $${montoFormateado} MXN
Estatus:              PAGADA

Consulte los detalles en:
${urlVistaCiudadano}

Atentamente,

Secretaría de Seguridad Pública Municipal
San Juan del Río, Qro.
`

  return { html, text }
}
