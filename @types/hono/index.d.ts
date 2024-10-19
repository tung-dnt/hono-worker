import { DecodedUser } from '@/types/user'

declare module 'hono' {
  interface ContextVariableMap {
    decodedUser: DecodedUser
  }
}
