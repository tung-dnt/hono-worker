import { createHmac, randomBytes } from 'node:crypto'

/**
 * Generates a salted hash of a given password.
 *
 * @param password - The password to hash.
 * @param salt - The salt to use for hashing.
 * @returns An object containing the used salt and the hashed password.
 */
export const hash = (password: string, salt: string) => {
  const hash = createHmac('sha512', salt)
  hash.update(password)
  const hashedPassword = hash.digest('hex')
  return { salt, hashedPassword }
}

/**
 * Generates a cryptographic salt of specified length.
 * 
 * @param rounds - The desired length of the salt in characters. 
 *                 Must be less than 15.
 * @returns A hexadecimal string representing the salt.
 * @throws Will throw an error if the specified rounds is 15 or greater.
 */
export const generateSalt = (rounds = 12) => {
  if (rounds >= 15) {
    throw new Error(`${rounds} is greater than 15,Must be less that 15`)
  }

  return randomBytes(Math.ceil(rounds / 2))
    .toString('hex')
    .slice(0, rounds)
}

/**
 * Compares the hashed password with the hashed version of the
 * given password, given the same salt.
 *
 * @param attemptPassword - The password to compare.
 * @param hashedPassword - The hashed password from the database.
 * @param salt - The cryptographic salt used to hash the password.
 * @returns True if the passwords match, false if not.
 */
export const compare = (
  attemptPassword: string,
  hashedPassword: string,
  salt: string,
) => {
  const passwordData = hash(attemptPassword, salt)
  return passwordData.hashedPassword === hashedPassword
}
