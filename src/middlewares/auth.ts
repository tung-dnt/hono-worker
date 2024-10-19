import { Context, MiddlewareHandler, Next } from 'hono'
import { verify } from 'hono/jwt'
import config from '@/constants/config'
import { getSignedCookie } from 'hono/cookie'
import { DecodedUser } from '@/types/user'

const isUserPermissionsMatched = (
  userPermissions: string[],
  requiredPermissions: string[],
) => {
  return requiredPermissions.every((requiredPermission) =>
    userPermissions.includes(requiredPermission),
  )
}

const auth =
  (...permissions: string[]): MiddlewareHandler =>
  async (c: Context, next: Next) => {
    const tokenToVerify = await getSignedCookie(
      c,
      config.token.signed_token_secret,
      config.token.access_token_key,
    )

    if (!tokenToVerify) {
      return c.json({ code: 401, message: 'Cannot get token' }, 401)
    }

    const decodedUser = (await verify(
      tokenToVerify,
      config.token.signed_token_secret,
    )) as DecodedUser

    if (!decodedUser) {
      return c.json({ status: 'error', message: 'Unauthorized' }, 401)
    }

    if (
      permissions.length > 0 &&
      !isUserPermissionsMatched(decodedUser.permissions, permissions)
    ) {
      return c.json({ status: 'error', message: 'Not Allowed' }, 403)
    }

    c.set('decodedUser', decodedUser)
    await next()
  }

export default auth
