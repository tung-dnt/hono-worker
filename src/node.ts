import { serve } from '@hono/node-server'
import { getRouterName, showRoutes } from 'hono/dev'

import app from './app'

console.log(getRouterName(app))
showRoutes(app, {
  verbose: true,
})

serve(
  {
    fetch: app.fetch,
    port: 3100,
  },
  ({ port }) => {
    console.log(`Listening on port >>>>>>>> ${port}`)
  },
)
