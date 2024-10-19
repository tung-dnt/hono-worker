import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import { timeout } from 'hono/timeout'

import { ApiResponse } from '@/types/response'
import appRouter from '@/routes'

const app = new Hono()

app.use(logger())
app.use(compress({ encoding: 'gzip' }))
app.use('/api', timeout(3000))

app.get('/', (c) => c.text('Hello Cloudflare Workers!'))
app.route('/api', appRouter)

app.notFound((c) => {
  const response: ApiResponse = {
    status: 'error',
    errorMessage: 'Route not found',
  }
  return c.json(response, 404)
})
app.onError((err, c) => {
  const response: ApiResponse = {
    status: 'error',
    errorMessage: err.message,
  }
  return c.json(response, 500)
})

export default app
