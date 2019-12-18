export const isAmpPage = (pathname: string | null) =>
  pathname &&
  [
    //
    /^\/$/,
    /^\/movie\/[^/]+$/
  ].some(re => pathname.match(re));
