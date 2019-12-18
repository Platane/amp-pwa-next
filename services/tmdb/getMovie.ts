(global as any).fetch = (global as any).fetch || require("node-fetch");

import querystring from "querystring";
import { Movie } from "./type";

export const getMovie = async (id: string): Promise<Movie> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}` +
      querystring.stringify({
        api_key: process.env.TMDB_API_KEY || "b84d2bc9f75687fea906921b7579eb39"
      })
  );

  const resJson = await res.json();

  return resJson;
};
