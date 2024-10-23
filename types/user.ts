import { JWTPayload } from 'hono/utils/jwt/types'
import { ResourcePolicy } from 'types/auth'

export type DecodedUser = JWTPayload & {
  id: number
  accessPolicy: ResourcePolicy
}
