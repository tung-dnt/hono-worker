/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'hono-worker',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'cloudflare',
      providers: { cloudflare: '5.41.0' },
    }
  },
  async run() {
    const bucket = new sst.cloudflare.Bucket('hono-worker-bucket')
    const hono = new sst.cloudflare.Worker('hono-worker', {
      url: true,
      handler: 'src/app.ts',
      link: [bucket],
      environment: {
        TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
        TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN
      }
    })

    return { api: hono.url }
  },
})
