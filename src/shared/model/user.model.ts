import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { ResourcePolicy, UserStatus } from 'types/auth'

export const user = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey().notNull(),
  fullName: text('fullname').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  salt: text('salt').notNull(),
  status: integer('status').notNull().default(UserStatus.ACTIVE),
  accessPolicy: text('access_policy', { mode: 'json' }).$type<Partial<ResourcePolicy>>(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  deletedAt: integer('updated_at', { mode: 'timestamp' }),
})

export const userAddress = sqliteTable('user_addresses', {
  id: integer('id', { mode: 'number' }).primaryKey().notNull(),
  userId: integer('user_id', { mode: 'number' })
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  province: integer('province').notNull(),
  provinceName: text('province_name').notNull(),
  district: integer('district').notNull(),
  districtName: text('district_name').notNull(),
  ward: integer('ward').notNull(),
  wardName: text('ward_name').notNull(),
  detail: text('detail'),
})

relations(userAddress, ({ one }) => ({
  user: one(user),
}))

export type User = typeof user.$inferSelect
export type UserModify = typeof user.$inferInsert
export type UserAddress = typeof userAddress.$inferSelect
export type UserAddressModify = typeof userAddress.$inferInsert
