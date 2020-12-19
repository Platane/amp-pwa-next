const { InjectManifest } = require("workbox-webpack-plugin");
const crypto = require("crypto");
const { isAmpPage } = require("./services/custom-router/isAmpPage");

const nextConfig = {
  target: "serverless",

  /**
   * inject a plugin to generate the service worker
   */
  webpack: (config) => {
    config.plugins.push(
      new InjectManifest({
        swSrc: "./services/service-worker/sw.ts",
        swDest: "static/sw.js",
        maximumFileSizeToCacheInBytes: 10 * 1000 * 1000,
        manifestTransforms: [
          (manifestEntries) => {
            const b = crypto.createHash("sha256");
            for (const { revision, url } of manifestEntries)
              b.update(Buffer.from(revision || url));
            const revision = b.digest("hex").slice(0, 32);

            return {
              manifest: [
                ...manifestEntries
                  .filter(({ url }) => {
                    const [, page] = url.match(/\/pages(\/.*)\.js$/) || [];
                    return !isAmpPage(page);
                  })
                  .map((x) => ({
                    ...x,
                    url: x.url.replace(/^static\//, "_next/static/"),
                  })),

                ...["/", "/about", "/app-shell"].map((url) => ({
                  url,
                  revision,
                })),
              ],
            };
          },
        ],

        exclude: [
          // file output by next.js, ignore
          "react-loadable-manifest.json",
          "build-manifest.json",
        ],
      })
    );

    return config;
  },

  rewrites: () => [
    {
      source: "/sw.js",
      destination: "/_next/static/sw.js",
    },
  ],
};

module.exports = nextConfig;
