// importScripts(
//   'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js',
// );

self.__precacheManifest = self.__precacheManifest || [];

const isAmpPage = pathname =>
  [
    //
    /^\/$/,
    /^\/movie\/[^/]+$/
  ].some(re => pathname.match(re));

const hash = (__precacheManifest.find(x =>
  x.url.match(/static\/([^\/]+)\/pages\//)
) || [])[1];

const appShellUrl = "/pwa-shell?__WB_REVISION__=" + hash;

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
      workbox.precaching.getCacheKeyForURL(appShellUrl)
    );

    if (response) return response;
    else {
      const res = await fetch(appShellUrl);

      cache.put(appShellUrl, res.clone());

      return res;
    }
  }
);

const removeTrailingSlash = s =>
  "/" +
  s
    .split("/")
    .filter(Boolean)
    .join("/");

/**
 * pre cache assets
 */
workbox.precaching.precacheAndRoute([
  appShellUrl,

  ...__precacheManifest
    .filter(x => {
      const m = x.url.split("?")[0].match(/pages(\/.*)\.js/);

      if (!m) return true;

      const pathname = removeTrailingSlash(m[1].replace(/index/, ""));

      return !isAmpPage(pathname);
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
