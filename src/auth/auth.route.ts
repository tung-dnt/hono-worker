import { Hono } from 'hono'
import { getSignedCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import omit from 'lodash/omit'
import { zValidator as validate } from '@hono/zod-validator'

import { ApiResponse } from 'types/response'
import config from '$constant/config'
import auth from '$middleware/auth.middleware'
import { getUserProfile } from '@user/user.service'

import { deleteTokensFromCookie, setTokensToCookie } from './auth.service'
import { login, refreshToken, register } from './auth.controller'
import { LoginValidator, RegisterValidator } from './auth.schema'

const authRouter = new Hono()

authRouter
  .get('/refresh-token', auth(), async (c) => {
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
    return c.json<ApiResponse>({
      status: 'success',
      message: 'Refresh token successfully',
    })
  })

  .get('/me', auth(), async (c) => {
    const decodedUser = c.get('decodedUser')
    const user = await getUserProfile(decodedUser.id)
    const data = omit(user, [
      'createdAt',
      'updatedAt',
      'deletedAt',
      'salt',
      'password',
    ])
    return c.json<ApiResponse>({ status: 'success', data })
  })

  .post('/login', validate('json', LoginValidator), async (c) => {
    const payload = c.req.valid('json')

    const [accessToken, refreshToken] = await login(payload)
    await setTokensToCookie(c, accessToken, refreshToken)

    return c.json<ApiResponse>({
      status: 'success',
      message: 'Login successfully',
    })
  })

  .post('/register', validate('json', RegisterValidator), async (c) => {
    const payload = c.req.valid('json')

    const [accessToken, refreshToken] = await register(payload)
    await setTokensToCookie(c, accessToken, refreshToken)

    return c.json<ApiResponse>({
      status: 'success',
      message: 'Register successfully',
    })
  })

  .delete('/logout', auth(), (c) => {
    deleteTokensFromCookie(c)
    return c.json<ApiResponse>({
      status: 'success',
      message: 'Logout successfully',
    })
  })

export default authRouter
