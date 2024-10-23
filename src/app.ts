import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'

import { ERROR_RESPONSE } from '@constant/response'
import appRouter from '@routes'
import { connectDb } from '@middleware/database.middleware'

const app = new Hono()

// Middlewares
app.use(connectDb)
app.use(logger())
app.use('/api', timeout(3000))

// Route handlers
app.get('/', (c) => c.text('Hello Cloudflare Workers!'))
app.route('/api', appRouter)

// Error handlers
app.notFound((c) => c.json(ERROR_RESPONSE['not_found'](), 404))
app.onError((err, c) => {
  console.error(err.message)
  return c.json(ERROR_RESPONSE['unknown'](err), 500)
})

export default app
