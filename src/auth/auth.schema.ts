import { z } from 'zod'

export const RegisterValidator = z
  .object({
    email: z.string().email(),
    /**
     * - Must contain at least 1 capital letter and 1 number
     * - At least 6 characters
     * - No spaces
     * - With special characters
     */
    password: z
      .string()
      .min(6)
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        'Password must contain at least 1 capital letter, 1 number, and no spaces',
      ),
    retypePassword: z.string(),
    fullName: z.string(),
  })
  .refine(({ password, retypePassword }) => password === retypePassword, {
    message: 'Passwords do not match',
  })

export const LoginValidator = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type TLoginValidator = z.infer<typeof LoginValidator>
export type TRegisterValidator = z.infer<typeof RegisterValidator>