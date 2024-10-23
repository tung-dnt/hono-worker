import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { getConnInfo } from 'hono/cloudflare-workers'

import { ERROR_RESPONSE } from '$constant/response'
import { connectDb } from '$middleware/database.middleware'
import appRouter from '@routes'

const app = new Hono()

// Middlewares
app.use(connectDb)
app.use(logger())

// Route handlers
app.get('/', (c) => {
  const info = getConnInfo(c)
  return c.text(`Hello ${info.remote.address}!`)
})
app.route('/api', appRouter)

// Error handlers
app.notFound((c) => c.json(ERROR_RESPONSE['not_found'](), 404))
app.onError((err, c) => {
  console.error(err)
  return c.json(ERROR_RESPONSE['unknown'](err), 500)
})

export default app
