export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT')
  }
}

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

export async function tryAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code }
    }
    console.error('[ACTION_ERROR]', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

export function tryActionRaw<T>(fn: () => Promise<T>): Promise<T> {
  return fn().catch((error) => {
    if (error instanceof AppError) throw error
    console.error('[ACTION_ERROR]', error)
    throw new Error('Error interno del servidor')
  })
}

type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

export function apiSuccess<T>(data: T, status: number = 200): Response {
  return Response.json({ success: true, data }, { status })
}

export function apiError(error: unknown, status: number = 500): Response {
  if (error instanceof AppError) {
    return Response.json(
      { success: false, error: error.message, code: error.code },
      { status: error.statusCode },
    )
  }
  const message = error instanceof Error ? error.message : 'Error interno del servidor'
  console.error('[API_ERROR]', error)
  return Response.json({ success: false, error: message }, { status })
}

type ApiHandler = (req: Request, ...args: unknown[]) => Promise<Response>

export function apiHandler(handler: ApiHandler): ApiHandler {
  return async (req, ...args) => {
    try {
      return await handler(req, ...args)
    } catch (error) {
      return apiError(error)
    }
  }
}
