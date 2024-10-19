import { Context, Next } from 'hono'
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

export let db: LibSQLDatabase | null = null

export const connectDb = async (c: Context, next: Next) => {
  const client = createClient({
    url: c.env['TURSO_CONNECTION_URL'],
    authToken: c.env['TURSO_AUTH_TOKEN'],
  })

  db = drizzle(client)

  await next()
}
