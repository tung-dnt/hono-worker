import { Context, Next } from 'hono'
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

let dbClient: LibSQLDatabase | null = null

export const $db = () => {
  if (!dbClient) throw new Error('Database is not connected')
  return dbClient
}

export const connectDb = async (c: Context, next: Next) => {
  const turso = createClient({
    url: c.env['TURSO_CONNECTION_URL'],
    authToken: c.env['TURSO_AUTH_TOKEN'],
  })

  dbClient = drizzle(turso)

  await next()
}
