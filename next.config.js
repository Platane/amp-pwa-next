const { InjectManifest } = require("workbox-webpack-plugin");

const nextConfig = {
  target: "serverless",

  /**
   * inject a plugin to generate the service worker
   */
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new InjectManifest({
        swSrc: "./services/service-worker/sw.js",
        swDest: "static/sw.js",
        importsDirectory: "static/workbox/",
        importWorkboxFrom: "local",
        exclude: [
          // file output by next.js, ignore
          "react-loadable-manifest.json",
          "build-manifest.json"
        ]
      })
    );

    return config;
  }
};

module.exports = nextConfig;
