import { Context, MiddlewareHandler, Next } from 'hono'
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie'

const auth: MiddlewareHandler = (c: Context, next: Next) => {
  
}

export default auth
