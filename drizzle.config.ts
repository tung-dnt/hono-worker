import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env' })
export default defineConfig({
  strict: true,
  schema: './src/schema',
  out: './migrations',
  dialect: 'turso',
  verbose: true,
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
})
