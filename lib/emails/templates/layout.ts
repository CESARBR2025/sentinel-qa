export const emailStyles = {
  greeting: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#0f172a',
    margin: '0 0 16px 0',
  },
  body: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#334155',
    margin: '0 0 16px 0',
  },
  folioBox: {
    background: '#f0f9ff',
    borderLeft: '4px solid #2563eb',
    padding: '16px 20px',
    margin: '20px 0',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#0f172a',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    margin: '24px 0',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 16px 0',
  },
  qrContainer: {
    textAlign: 'center' as const,
    margin: '24px 0',
  },
  primaryButton: {
    display: 'inline-block',
    padding: '12px 32px',
    background: '#2563eb',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
  },
} as const

export function inlineStyles(styles: Record<string, string | number>): string {
  return Object.entries(styles)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ')
}

export function emailLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SSPM - San Juan del Río</title>
</head>
<body style="margin: 0; padding: 0; background: #f1f5f9; font-family: 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: #1e3a5f; padding: 24px 32px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">
                SECRETARÍA DE SEGURIDAD PÚBLICA MUNICIPAL
              </h1>
              <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">
                Fiscalía de San Juan del Río
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                Este es un mensaje automático, por favor no responder a este correo.
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 8px 0 0 0;">
                &copy; ${new Date().getFullYear()} SSPM San Juan del Río
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
