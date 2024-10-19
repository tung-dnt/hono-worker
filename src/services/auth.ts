import { Context } from 'hono'
import { deleteCookie, setSignedCookie } from 'hono/cookie'
import { eq, or } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { db } from '@/middlewares/database'
import {
  permission,
  role,
  roleOnPermission,
  User,
  user,
  userAddress,
  usersOnRole,
} from '@/schema'
import { Either } from '@/types/common'
import config from '@/constants/config'

export const validatePassword = async (
  user: User,
  password: string,
): Promise<boolean> => {
  if (!user.password) {
    throw new HTTPException(400, { message: 'password is not set' })
  }
  return password === user.password
}

export const getUserProfile = async (identifier: Either<string, number>) => {
  const query = [
    typeof identifier === 'number' ? eq(user.id, identifier) : undefined,
    eq(user.email, identifier),
    eq(user.username, identifier),
  ]

  return db
    .select()
    .from(user)
    .where(or(...query))
    .innerJoin(usersOnRole, eq(user.id, usersOnRole.userId))
    .innerJoin(role, eq(role.id, usersOnRole.roleId))
    .innerJoin(roleOnPermission, eq(role.id, roleOnPermission.roleId))
    .innerJoin(permission, eq(permission.id, roleOnPermission.permissionId))
    .leftJoin(userAddress, eq(user.id, userAddress.userId))
    .limit(1)
}

export const setTokensToCookie = (
  c: Context,
  accessToken: string,
  refreshToken: string,
) =>
  Promise.allSettled([
    setSignedCookie(
      c,
      config.token.access_token_key,
      accessToken,
      config.token.signed_token_secret,
      { httpOnly: true, maxAge: 60 * 60 * 24 * 7 }, // 7 days
    ),
    setSignedCookie(
      c,
      config.token.refresh_token_key,
      refreshToken,
      config.token.signed_token_secret,
      { httpOnly: true, maxAge: 60 * 60 * 24 * 7 }, // 7 days
    ),
  ])

export const deleteTokensFromCookie = (c: Context) => {
  deleteCookie(c, config.token.access_token_key)
  deleteCookie(c, config.token.refresh_token_key)
}
