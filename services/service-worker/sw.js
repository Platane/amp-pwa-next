// importScripts(
//   'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js',
// );

self.__precacheManifest = self.__precacheManifest || [];

const isAmpPage = pathname =>
  [
    //
    /^\/$/,
    /^\/movie$/,
    /^\/movie\/.*$/
  ].some(re => pathname.match(re));

self.__app_shell_url =
  "/pwa-shell?__WB_REVISION__=" +
  __precacheManifest.map(x => x.revision).join("");

/**
 * upon navigation, serve the pwa shell instead
 */
workbox.routing.registerRoute(
  ({ url, event }) =>
    event.request.mode === "navigate" && isAmpPage(url.pathname),

  async ({ url, event, params }) => {
    console.log("navigation, push shell instead", url.pathname);

    const cache = await caches.open(workbox.core.cacheNames.precache);
    const response = await cache.match(
      workbox.precaching.getCacheKeyForURL(__app_shell_url)
    );

    if (response) return response;
    else {
      const res = await fetch(__app_shell_url);

      cache.put(__app_shell_url, res.clone());

      return res;
    }
  }
);

/**
 * pre cache assets
 */
workbox.precaching.precacheAndRoute([
  __app_shell_url,

  ...__precacheManifest
    .filter(x => {
      const m = x.url.match(/pages\/(.*)/);

      return !(m && isAmpPage(m[1]));
    })
    .map(x => ({
      ...x,
      url: x.url.replace(/^static\//, "_next/static/")
    }))
]);

/**
 * cache pages
 */
workbox.routing.registerRoute(
  /(movie)/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "content-cache",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 24 * 60 * 60,
        maxEntries: 20
      })
    ]
  })
);
