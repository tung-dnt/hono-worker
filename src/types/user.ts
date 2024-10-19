import { JWTPayload } from 'hono/utils/jwt/types'

export type DecodedUser = JWTPayload & {
  id: number
  permissions: string[]
}
