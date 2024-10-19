import { relations, sql } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey().notNull(),
  firstName: text('firstname').notNull(),
  lastName: text('lastname').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  salt: text('salt').notNull(),
  username: text('username').notNull().unique(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
})
relations(user, ({ many }) => ({
  addresses: many(userAddress),
  usersOnRoles: many(usersOnRole),
}))

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

export const role = sqliteTable('roles', {
  id: integer('id', { mode: 'number' }).primaryKey().notNull(),
  name: text('name').notNull().unique(),
  description: text('description'),
  status: integer('status').notNull().default(1),
  createdBy: integer('created_by', { mode: 'number' }).notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
})
relations(role, ({ many }) => ({
  usersOnRoles: many(usersOnRole),
  roleOnPermissions: many(roleOnPermission),
}))

export const permission = sqliteTable('permissions', {
  id: integer('id', { mode: 'number' }).primaryKey().notNull(),
  name: text('name').notNull().unique(),
  description: text('description'),
  status: integer('status').notNull().default(1),
  createdBy: integer('created_by', { mode: 'number' }).notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
})
relations(permission, ({ many }) => ({
  roles: many(roleOnPermission),
}))

export const usersOnRole = sqliteTable(
  'users_on_roles',
  {
    userId: integer('user_id', { mode: 'number' })
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    roleId: integer('role_id', { mode: 'number' })
      .notNull()
      .references(() => role.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
  }),
)
relations(usersOnRole, ({ one }) => ({
  user: one(user),
  role: one(role),
}))

export const roleOnPermission = sqliteTable(
  'roles_on_permissions',
  {
    roleId: integer('role_id', { mode: 'number' })
      .notNull()
      .references(() => role.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    permissionId: integer('permission_id', { mode: 'number' })
      .notNull()
      .references(() => permission.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.permissionId, t.roleId] }),
  }),
)
relations(roleOnPermission, ({ one }) => ({
  role: one(role),
  permission: one(permission),
}))

export type User = typeof user.$inferSelect
export type UserModify = typeof user.$inferInsert

export type UserAddress = typeof userAddress.$inferSelect
export type UserAddressModify = typeof userAddress.$inferInsert

export type Role = typeof role.$inferSelect
export type RoleModify = typeof role.$inferInsert

export type Permission = typeof permission.$inferSelect
export type PermissionModify = typeof permission.$inferInsert

export type UserOnRole = typeof usersOnRole.$inferSelect
export type UserOnRoleModify = typeof usersOnRole.$inferInsert

export type RoleOnPermission = typeof roleOnPermission.$inferSelect
export type RoleOnPermissionModify = typeof roleOnPermission.$inferInsert
