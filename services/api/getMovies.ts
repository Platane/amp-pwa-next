import { Movie } from "../tmdb/type";
import querystring from "querystring";

(global as any).fetch = (global as any).fetch || require("node-fetch");

export const getMovies = async ({
  genre
}: {
  genre?: string;
}): Promise<Movie[]> => {
  const res = await fetch(
    (process.env.API_ENDPOINT || "http://localhost:3000") +
      `/api/movie?` +
      querystring.stringify({
        ...(genre && { genre })
      } as any)
  );

  const resJson = await res.json();

  return resJson.items;
};
