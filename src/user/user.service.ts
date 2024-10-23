import { eq, or } from 'drizzle-orm'
import { $db } from '$middleware/database.middleware'
import { User, user } from '$model/user.model'
import { ResourcePolicy } from 'types/auth'

export const getUserProfile = async (identifier: number | string) => {
  const query = [
    typeof identifier === 'number' ? eq(user.id, identifier) : undefined,
    eq(user.email, String(identifier)),
  ]

  return (
    await $db()
      .select()
      .from(user)
      .where(or(...query))
      .limit(1)
  )[0]
}

export const createUser = async (
  userInsert: Omit<User, 'id' | 'updatedAt' | 'deletedAt'>,
) => (await $db().insert(user).values(userInsert).returning({ id: user.id }))[0]

export const updateResourcePolicy = async (
  id: number,
  resourcePolicy: Partial<ResourcePolicy>,
) => {
  await $db()
    .update(user)
    .set({ accessPolicy: resourcePolicy })
    .where(eq(user.id, id))
    .returning({ id: user.id, accessPolicy: user.accessPolicy })
}
