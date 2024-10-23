export type ResponseStatus =
  | 'error'
  | 'success'
  | 'async-error'
  | 'async-success'
export type ApiResponse<R = any> = {
  status: ResponseStatus
  data?: R
  message?: string
}
