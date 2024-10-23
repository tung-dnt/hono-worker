import { HTTPException } from 'hono/http-exception'
import { sign, verify } from 'hono/jwt'
import pick from 'lodash/pick'

import { UserStatus } from 'types/auth'
import config from '$constant/config'
import { compare, generateSalt, hash } from '$helper/password.helper'
import {
  createUser,
  getUserProfile,
  updateResourcePolicy,
} from '@user/user.service'

import { TLoginValidator, TRegisterValidator } from './auth.schema'

/**
 * Login with username or email and password.
 *
 * @param {TLoginValidator} payload - object contains username or email and password
 * @returns {Promise<[string, string]>} - array of two strings, the first is access token and the second is refresh token
 * @throws {HTTPException} - when password is incorrect
 */
export const login = async (
  payload: TLoginValidator,
): Promise<[string, string]> => {
  const { email, password } = payload
  // Find user by email or username
  const user = await getUserProfile(email)
  // Verify password
  if (!compare(password, user.password, user.salt)) {
    throw new HTTPException(400, { message: 'Wrong password' })
  }
  const encodingUser = pick(user, ['id', 'accessPolicy'])
  // Create access token
  // Create refresh token
  return Promise.all([
    sign({ user: encodingUser }, config.token.signed_token_secret),
    sign({ user: encodingUser }, config.token.signed_token_secret),
  ])
}

/**
 * Verify and refresh access token and refresh token.
 *
 * @param {string} refreshToken - refresh token
 * @returns {Promise<[string, string]>} - array of two strings, the first is access token and the second is refresh token
 * @throws {HTTPException} - when refresh token is invalid
 */
export const refreshToken = async (
  refreshToken: string,
): Promise<[string, string]> => {
  const decodedUser = await verify(
    refreshToken,
    config.token.signed_token_secret,
  )

  if (!decodedUser) {
    throw new HTTPException(403, { message: 'Not allowed' })
  }

  const user = pick(decodedUser, ['id', 'accessPolicy'])
  return Promise.all([
    sign({ user }, config.token.signed_token_secret),
    sign({ user }, config.token.signed_token_secret),
  ])
}

/**
 * Register a new user.
 *
 * @param {TRegisterValidator} payload - object contains email, password, and fullName
 * @returns {Promise<[string, string]>} - array of two strings, the first is access token and the second is refresh token
 * @throws {HTTPException} - when email is already exist
 */
export const register = async (
  payload: TRegisterValidator,
): Promise<[string, string]> => {
  const salt = generateSalt()
  const password = hash(payload.password, salt)
  const insertData = {
    ...pick(payload, ['email', 'fullName']),
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    password: password.hashedPassword,
    salt: password.salt,
    accessPolicy: {},
  }

  const { id } = await createUser(insertData)
  const registeredUser = await updateResourcePolicy(id, {})

  return Promise.all([
    sign({ user: registeredUser }, config.token.signed_token_secret),
    sign({ user: registeredUser }, config.token.signed_token_secret),
  ])
}
