import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { Users } from './user.schema';

export const Posts = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
});

export type InsertPost = typeof Posts.$inferInsert;
export type SelectPost = typeof Posts.$inferSelect;