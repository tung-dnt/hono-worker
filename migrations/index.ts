import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { createClient } from '@libsql/client'
import * as path from 'path'

async function runMigrations() {
  const client = createClient({
    url: process.env['TURSO_CONNECTION_URL'],
    authToken: process.env['TURSO_AUTH_TOKEN'],
  })
  const db = drizzle(client)

  // ======== CONNECT TO DATABASE AND RUN MIGRATIONS ========
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, './out'),
  })
  // Don't forget to close the connection, otherwise the script will hang
  client.close()
}

runMigrations()
  .then(() => console.log('Migrations completed successfully.'))
  .catch((error) => {
    console.error('An error occurred during migrations:', error)
    process.exit(1) // Exit the process with an error code
  })
