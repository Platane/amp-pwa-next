export const getImageUrl = (
  uri: string,
  { width = 500, original = false } = {}
) => `https://image.tmdb.org/t/p/${original ? "original" : `w${width}`}${uri}`;

export const sizes = [200, 300, 400, 500];

export const getImageResolutions = (uri: string) => [
  ...sizes.map(width => ({ width, src: getImageUrl(uri, { width }) })),
  {
    width: 1000,
    src: getImageUrl(uri, { original: true })
  }
];

export const getSrcSet = (uri: string) =>
  getImageResolutions(uri)
    .map(({ src, width }) => `${src} ${width}w`)
    .join(",");
