const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const { InjectManifest } = require("workbox-webpack-plugin");

const getPages = (dir, baseDir = dir) =>
  fs
    .readdirSync(dir)
    .map((x) => {
      const filename = path.join(dir, x);
      const stat = fs.statSync(filename);

      if (stat.isDirectory() && x !== "api") return getPages(filename, baseDir);
      if (stat.isFile() && !x.startsWith("_")) {
        const amp = !!fs
          .readFileSync(filename)
          .toString()
          .match(/config\s*=\s*{\s*amp\s*:\s*true\s*}/);
        const page =
          "/" +
          path
            .relative(baseDir, filename)
            .replace(/\.\w+$/, "")
            .replace("index", "");
        const regexp = page
          .replace(/(\[\w+\])/g, `[^/]+`)
          .replace(/\//g, "\\/");
        return [{ amp, page, regexp }];
      }

      return [];
    })
    .flat();

const pages = getPages(path.join(__dirname, "pages"));

const nextConfig = {
  target: "serverless",

  /**
   * inject a plugin to generate the service worker
   */
  webpack: (config, { webpack }) => {
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
                  .filter(({ url }) => url.startsWith("static/"))
                  .map((x) => ({
                    ...x,
                    url: x.url.replace(/^static\//, "_next/static/"),
                  })),
                { url: "/", revision },
                { url: "/app-shell", revision },
              ],
            };
          },
        ],
      }),

      new webpack.EnvironmentPlugin({
        APP_AMP_PAGE_REGEXP:
          "^(" +
          pages
            .filter((x) => x.amp)
            .map((x) => x.regexp)
            .join("|") +
          ")$",
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
