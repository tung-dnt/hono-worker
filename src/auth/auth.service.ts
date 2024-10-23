import { Context } from 'hono'
import { deleteCookie, setSignedCookie } from 'hono/cookie'
import config from '$constant/config'

export const setTokensToCookie = (
  c: Context,
  accessToken: string,
  refreshToken: string,
) =>
  Promise.all([
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
