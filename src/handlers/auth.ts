import { HTTPException } from 'hono/http-exception'
import { sign, verify } from 'hono/jwt'
import pick from 'lodash/pick'

import { getUserProfile, validatePassword } from '@/services/auth'
import { LoginPayload } from '@/types/auth'
import config from '@/constants/config'

export const login = async (payload: LoginPayload) => {
  const { identifier, password } = payload
  // Find user by email or username
  const user = await getUserProfile(identifier)
  // Verify password
  if (!(await validatePassword(user, password))) {
    throw new HTTPException(400, { message: 'Wrong password' })
  }
  const encodingUser = pick(user, ['id', 'permissions'])
  // Create access token
  // Create refresh token
  return Promise.all([
    sign(encodingUser, config.token.signed_token_secret),
    sign(encodingUser, config.token.signed_token_secret),
  ])
}

export const refreshToken = async (refreshToken: string) => {
  const decodedUser = verify(refreshToken, config.token.signed_token_secret)

  if (!decodedUser) {
    throw new HTTPException(403, { message: 'Not allowed' })
  }

  const encodingUser = pick(decodedUser, ['id', 'permissions'])
  return Promise.all([
    sign(encodingUser, config.token.signed_token_secret),
    sign(encodingUser, config.token.signed_token_secret),
  ])
}
