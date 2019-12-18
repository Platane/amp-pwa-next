import { Movie } from "../omdb/type";

(global as any).fetch = (global as any).fetch || require("node-fetch");

export const getMovie = async (id: string): Promise<Movie> => {
  const res = await fetch(
    (process.env.API_ENDPOINT || "http://localhost:3000") + `/api/movie/${id}`
  );

  const resJson = await res.json();

  return resJson;
};
