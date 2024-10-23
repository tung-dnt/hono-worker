import { ApiResponse } from 'types/response'
import { HTTPResponseError } from 'hono/types'

export const ERROR_RESPONSE: Record<string, (...args: any[]) => ApiResponse> = {
  ['unknown']: (err: Error | HTTPResponseError) => ({
    status: 'error',
    message: err.message,
  }),
  ['not_found']: () => ({
    status: 'error',
    message: 'Route not found',
  }),
}
