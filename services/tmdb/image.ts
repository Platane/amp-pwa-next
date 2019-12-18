export const getImageUrl = (uri: string, { width = 500 } = {}) =>
  `https://image.tmdb.org/t/p/w${width}${uri}`;

export const sizes = [200, 300, 400, 500];
