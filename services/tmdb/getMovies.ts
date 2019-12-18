(global as any).fetch = (global as any).fetch || require("node-fetch");

import querystring from "querystring";
import { Movie } from "./type";

export const getMovies = async ({
  year,
  genre
}: {
  year?: number;
  genre?: number;
}): Promise<{ results: Movie[] }> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?` +
      querystring.stringify({
        ...(year && { primary_release_year: year }),
        ...(genre && { with_genres: genre }),
        sort_by: "popularity.desc",
        api_key: process.env.TMDB_API_KEY || "b84d2bc9f75687fea906921b7579eb39"
      })
  );

  const resJson = await res.json();

  return resJson;
};
