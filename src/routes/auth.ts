import auth from '@/middlewares/auth'
import format from '@/middlewares/format'
import { Hono } from 'hono'

const authRouter = new Hono()

authRouter.get(
  '/refresh-token',
  // auth(),
  format((c) => {
    return { test: 'ahihi' }
  }),
)

export default authRouter
