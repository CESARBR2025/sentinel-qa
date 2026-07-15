import QRCode from 'qrcode'
import { sendMail } from './mailer'
import {
  templateAsignacionFiscalia,
  type EnviarCorreoAsignacionFiscaliaParams,
} from './templates/asignacion-fiscalia'
import {
  templateOrdenLiberacion,
  type EnviarCorreoOrdenLiberacionParams,
} from './templates/orden-liberacion'

export async function enviarCorreoAsignacionFiscalia(
  data: EnviarCorreoAsignacionFiscaliaParams,
) {
  const urlVistaCiudadano = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://via-v2.vercel.app'}/infracciones/${data.idInfraccion}`

  const qrBuffer = await QRCode.toBuffer(urlVistaCiudadano)

  const { html, text } = templateAsignacionFiscalia({
    ...data,
    urlVistaCiudadano,
  })

  await sendMail({
    to: data.correo_titular_liberacion,
    subject: `SSPM - Documentación Requerida #${data.folio}`,
    text,
    html,
    attachments: [
      {
        filename: 'qr.png',
        content: qrBuffer,
        cid: 'qr_infraccion',
      },
    ],
  })
}

export async function enviarCorreoOrdenLiberacion(
  data: EnviarCorreoOrdenLiberacionParams,
) {
  const urlVistaCiudadano = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://via-v2.vercel.app'}/infracciones/${data.idInfraccion}`

  const { html, text } = templateOrdenLiberacion({
    ...data,
    urlVistaCiudadano,
  })

  await sendMail({
    to: data.correoTitular,
    subject: `SSPM - Orden de Liberación #${data.folio}`,
    text,
    html,
  })
}
