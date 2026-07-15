import { emailLayout, emailStyles, inlineStyles } from './layout'

export interface EnviarCorreoAsignacionFiscaliaParams {
  correo_titular_liberacion: string
  nombreTitular: string
  idInfraccion: string
  folio: string
  numero_oficio: string
}

export function templateAsignacionFiscalia(
  data: EnviarCorreoAsignacionFiscaliaParams & { urlVistaCiudadano?: string },
) {
  const urlVistaCiudadano =
    data.urlVistaCiudadano ||
    `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://via-v2.vercel.app'}/infracciones/${data.idInfraccion}`

  const html = emailLayout(`
    <p style="${inlineStyles(emailStyles.greeting)}">
      Estimado(a) <strong>${data.nombreTitular}</strong>,
    </p>

    <p style="${inlineStyles(emailStyles.body)}">
      Por este medio se le notifica que su expediente ha sido registrado en <strong>Fiscalía de SJR</strong>. A partir de este momento, puede subir la documentación requerida para continuar con el proceso de liberación de su vehículo.
    </p>

    <div style="${inlineStyles(emailStyles.folioBox)}">
      <p style="margin:0 0 8px 0;"><b>Número de Folio:</b> ${data.folio}</p>
      <p style="margin:0 0 8px 0;"><b>Número de Oficio:</b> ${data.numero_oficio}</p>
      <p style="margin:0;"><b>Estado del Expediente:</b> PENDIENTE DE DOCUMENTACIÓN</p>
    </div>

    <hr style="${inlineStyles(emailStyles.divider)}" />

    <h2 style="${inlineStyles(emailStyles.title)}">Documentación Requerida</h2>

    <p style="${inlineStyles(emailStyles.body)}">
      Para continuar con el proceso de liberación, es necesario que cargue la siguiente documentación a través del portal ciudadano:
    </p>

    <ul style="font-size:14px; line-height:2; color:#0f172a; padding-left:20px;">
      <li>Factura original del vehículo</li>
      <li>INE del titular (vigente)</li>
      <li>Comprobante de domicilio (reciente)</li>
      <li>Tarjeta de circulación</li>
      <li>Poder notarial (si aplica)</li>
    </ul>

    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; font-size: 14px; line-height: 1.6; color: #78350f; font-weight: 500;">
      <strong>⚠ ATENCIÓN:</strong> Es obligatorio subir toda la documentación requerida dentro del plazo establecido. La no presentación de documentos puede retrasar el proceso de liberación.
    </div>

    <div style="${inlineStyles(emailStyles.qrContainer)}">
      <img src="cid:qr_infraccion" alt="Código QR" width="180" />
    </div>

    <div style="text-align:center; margin: 20px 0;">
      <a href="${urlVistaCiudadano}" style="${inlineStyles(emailStyles.primaryButton)}">
        SUBIR DOCUMENTACIÓN
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
FISCALÍA DE SJR

Estimado(a) ${data.nombreTitular},

Por este medio se le notifica que su expediente ha sido registrado en Fiscalía de SJR. A partir de este momento, puede subir la documentación requerida para continuar con el proceso de liberación.

DATOS DEL EXPEDIENTE:
─────────────────────────────────────────
Folio:                ${data.folio}
Número de Oficio:     ${data.numero_oficio}
Estado:               PENDIENTE DE DOCUMENTACIÓN

DOCUMENTACIÓN REQUERIDA:
─────────────────────────────────────────
- Factura original del vehículo
- INE del titular (vigente)
- Comprobante de domicilio (reciente)
- Tarjeta de circulación
- Poder notarial (si aplica)

Para acceder al portal de documentación y subir sus archivos, escanee el código QR incluido en este correo o ingrese al siguiente enlace:
${urlVistaCiudadano}

Atentamente,

Secretaría de Seguridad Pública Municipal
Fiscalía de SJR
`

  return { html, text }
}
