export interface PushSubscriptionRow {
  id: string
  userId: string
  endpoint: string
  p256dh: string
  auth: string
}

/** Payload que se manda al dispositivo — mismos campos que ya usa la campanita in-app. */
export interface PayloadPush {
  titulo: string
  mensaje: string
  href: string | null
  severidad: 'info' | 'aviso' | 'critico'
}

/** Forma que manda el navegador desde `PushSubscription.toJSON()`. */
export interface SuscripcionCliente {
  endpoint: string
  keys: { p256dh: string; auth: string }
}
