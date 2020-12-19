const isAmpPage = (pathname) =>
  pathname &&
  [
    //
    /^\/$/,
    /^\/about$/,
    /^\/movie\/[^/]+$/,
  ].some((re) => pathname.match(re));

module.exports = { isAmpPage };
