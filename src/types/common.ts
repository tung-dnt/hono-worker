export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

// Either is needed to have a real mutually exclusive union type
export type Either<T, U> = T extends object
  ? U extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : U
  : T

export type PagingProps = {
  skip: number
  take: number
}
