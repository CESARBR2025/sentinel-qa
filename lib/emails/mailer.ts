import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface MailAttachment {
  filename: string
  path?: string
  content?: Buffer
  cid?: string
}

export interface MailOptions {
  to?: string
  cc?: string
  subject: string
  text: string
  html: string
  attachments?: MailAttachment[]
}

export async function sendMail(options: MailOptions) {
  if (!options.to) {
    console.warn('[mailer] Correo no proporcionado, omitiendo envío.')
    return null
  }

  console.log('[mailer] Enviando a:', options.to, 'CC:', options.cc || '(sin CC)')

  const info = await transporter.sendMail({
    from: `"SSPM - San Juan del Río" <${process.env.SMTP_USER}>`,
    to: options.to,
    cc: options.cc,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments ?? [],
  })

  console.log('[mailer] Enviado, messageId:', info.messageId)

  return info
}
