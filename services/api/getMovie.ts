import { Movie } from "../tmdb/type";

(global as any).fetch = (global as any).fetch || require("node-fetch");

export const getMovie = (origin: string) => async (
  id: string
): Promise<Movie> => {
  const res = await fetch(origin + `/api/movie/${id}`);

  const resJson = await res.json();

  return resJson;
};
