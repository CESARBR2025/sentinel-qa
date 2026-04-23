import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { twoFactor } from 'better-auth/plugins'
import { db } from '@/lib/db/index'
import * as schema from '@/lib/db/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: true,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },

  session: {
    expiresIn:        60 * 60 * 8,  // 8 horas
    updateAge:        60 * 60,       // refresca cada hora
    cookieCache: {
      enabled:    true,
      maxAge:     60 * 5,
    },
  },

  user: {
    additionalFields: {
      apellido: {
        type:     'string',
        required: false,
        input:    true,
      },
      rolId: {
        type:     'number',
        required: false,
        input:    false,
      },
      activo: {
        type:         'boolean',
        required:     false,
        defaultValue: true,
        input:        false,
      },
    },
  },

  plugins: [
    twoFactor({
      issuer: 'Seguridad Pública SJR',
      totpOptions: {
        digits: 6,
        period: 30,
      },
      skipVerificationOnEnable: false,
    }),
  ],
})

export type Session = typeof auth.$Infer.Session
export type AuthUser = typeof auth.$Infer.Session.user
