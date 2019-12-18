export const isAmpPage = pathname =>
  [
    //
    /^\/$/,
    /^\/movie\/[^/]+$/
  ].some(re => pathname.match(re));
