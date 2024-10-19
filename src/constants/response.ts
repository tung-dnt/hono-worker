import { ApiResponse } from '@/types/response'
import { HTTPResponseError } from 'hono/types'

export const ERROR_RESPONSE: Record<string, (...args: any[]) => ApiResponse> = {
  ['unknown']: (err: Error | HTTPResponseError) => ({
    status: 'error',
    errorMessage: err.message,
  }),
  ['not_found']: () => ({
    status: 'error',
    errorMessage: 'Route not found',
  }),
}
