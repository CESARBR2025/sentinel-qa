'use client'

import { useState } from 'react'
import { Toast, ToastTipo } from './Toast'

/** Para Server Components: dispara el toast una vez a partir de un boolean (ej. searchParams.exito === '1'). */
export function ToastAuto({ show, mensaje, tipo = 'exito' }: { show: boolean; mensaje: string; tipo?: ToastTipo }) {
  const [visible, setVisible] = useState(show)
  return <Toast show={visible} mensaje={mensaje} tipo={tipo} onClose={() => setVisible(false)} />
}
