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
import {
  templatePinAcceso,
  type EnviarCorreoPinAccesoParams,
} from './templates/pin-acceso'
import {
  templatePagoConfirmado,
  type EnviarCorreoPagoConfirmadoParams,
} from './templates/pago-confirmado'

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

export async function enviarCorreoPinAcceso(
  data: EnviarCorreoPinAccesoParams,
) {
  const urlVistaCiudadano = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://via-v2.vercel.app'}/infracciones/${data.idInfraccion}`

  const { html, text } = templatePinAcceso({
    ...data,
    urlVistaCiudadano,
  })

  await sendMail({
    to: data.correoInfractor,
    subject: `SSPM - Código de Acceso #${data.folio}`,
    text,
    html,
  })
}

export async function enviarCorreoPagoConfirmado(
  data: EnviarCorreoPagoConfirmadoParams,
) {
  const urlVistaCiudadano = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://via-v2.vercel.app'}/infracciones/${data.idInfraccion}`

  const { html, text } = templatePagoConfirmado({
    ...data,
    urlVistaCiudadano,
  })

  await sendMail({
    to: data.correoInfractor,
    subject: `SSPM - Pago Confirmado #${data.folio}`,
    text,
    html,
  })
}
