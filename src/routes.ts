import { Hono } from 'hono'
import authRouter from '@auth/auth.route'

const appRouter = new Hono()

appRouter.route('/auth', authRouter)

export default appRouter
