import { Context, MiddlewareHandler, Next } from 'hono'
import { getSignedCookie, setSignedCookie } from 'hono/cookie'

const auth: MiddlewareHandler = (c: Context, next: Next) => {
  
}

export default auth
