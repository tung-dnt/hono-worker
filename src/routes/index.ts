import { Hono } from 'hono'

const appRouter = new Hono()

appRouter.get('/', (c) => {
  return c.json(data)
})

export default appRouter
