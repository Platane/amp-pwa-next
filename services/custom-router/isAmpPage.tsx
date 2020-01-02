export const isAmpPage = (pathname: string | null) =>
  pathname &&
  [
    //
    /^\/$/,
    /^\/about$/,
    /^\/movie\/[^/]+$/
  ].some(re => pathname.match(re));
