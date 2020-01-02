import { Movie } from "../tmdb/type";
import querystring from "querystring";

(global as any).fetch = (global as any).fetch || require("node-fetch");

export const getMovies = (origin: string) => async ({
  genre
}: {
  genre?: string;
}): Promise<Movie[]> => {
  const res = await fetch(
    origin +
      `/api/movie?` +
      querystring.stringify({
        ...(genre && { genre })
      } as any)
  );

  const resJson = await res.json();

  return resJson.items;
};
