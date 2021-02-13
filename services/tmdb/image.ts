/**
 * helpers to manipulate image from tmdb
 */

/**
 * get the image url for a specific size
 */
export const getImageUrl = (
  uri: string,
  { width = 500, original = false } = {}
) => `https://image.tmdb.org/t/p/${original ? "original" : `w${width}`}${uri}`;

export const sizes = [200, 300, 400, 500];

/**
 * get all image resolutions
 */
export const getImageResolutions = (uri: string) => [
  ...sizes.map((width) => ({ width, src: getImageUrl(uri, { width }) })),
  {
    width: 1000,
    src: getImageUrl(uri, { original: true }),
  },
];

/**
 * return the image srcset, as specified by the html image
 */
export const getSrcSet = (uri: string) =>
  getImageResolutions(uri)
    .map(({ src, width }) => `${src} ${width}w`)
    .join(",");
