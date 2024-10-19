/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "hono-worker",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "cloudflare",
      providers: { cloudflare: "5.41.0" },
    };
  },
  async run() {
    const bucket = new sst.cloudflare.Bucket("hono-worker-bucket");
    const hono = new sst.cloudflare.Worker("hono-worker", {
      url: true,
      handler: "src/index.ts",
      link: [bucket],
    });
    return {
      api: hono.url,
    };
  },
});
