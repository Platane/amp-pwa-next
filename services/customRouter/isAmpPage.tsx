export const isAmpPage = pathname =>
  [
    //
    /^\/$/,
    /^\/movie$/,
    /^\/movie\/[^/]+$/
  ].some(re => pathname.match(re));
