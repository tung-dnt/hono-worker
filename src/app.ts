import { Hono } from 'hono'
const app = new Hono()

app.use(requestHandler())
app.get('/', (c) => c.text('Hello Cloudflare Workers!'))
app.use('/api', router)
app.notFound((c) => c.text('Not Found', 404))
app.onError((err, c) => c.text(err.message, 500))

export default app