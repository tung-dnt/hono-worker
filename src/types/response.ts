export type ResponseStatus =
  | 'error'
  | 'success'
  | 'async-error'
  | 'async-success'
export type ApiResponse<R = any, E = any> = {
  status: ResponseStatus
  body?: R
  errorMessage?: E
}
