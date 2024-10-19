import { Hono } from 'hono'
import { getSignedCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'

import { login, refreshToken } from '@/handlers/auth'
import auth from '@/middlewares/auth'
import format from '@/middlewares/format'
import {
  deleteTokensFromCookie,
  getUserProfile,
  setTokensToCookie,
} from '@/services/auth'
import config from '@/constants/config'

const authRouter = new Hono()

authRouter
  .get(
    '/refresh-token',
    auth(),
    format(async (c) => {
      const token = await getSignedCookie(
        c,
        config.token.signed_token_secret,
        config.token.refresh_token_key,
      )
      if (!token) {
        throw new HTTPException(400, { message: 'Cannot get token' })
      }
      const [accToken, refToken] = await refreshToken(token)
      await setTokensToCookie(c, accToken, refToken)
    }),
  )

  .get(
    '/me',
    auth(),
    format(async (c) => {
      const decodedUser = c.get('decodedUser')
      return getUserProfile(decodedUser.id)
    }),
  )

  .post(
    '/login',
    format(async (c) => {
      const payload = await c.req.parseBody()
      const [accessToken, refreshToken] = await login(payload)
      await setTokensToCookie(c, accessToken, refreshToken)
    }),
  )

  .post(
    '/register',
    format(async () => {}),
  )

  .delete('/logout', auth(), format(deleteTokensFromCookie, 204))

export default authRouter
