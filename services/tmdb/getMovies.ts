/**
 * get a list of movie from tmdb
 */

(global as any).fetch = (global as any).fetch || require("node-fetch");

import querystring from "querystring";
import { Movie } from "./type";

export const getMovies = async ({
  year,
  genre,
  sort_by = "popularity.desc"
}: {
  year?: number;
  genre?: number;
  sort_by?: "vote_average.desc" | "popularity.desc";
}): Promise<{
  results: Movie[];
  page: number;
  total_results: number;
  total_pages: number;
}> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?` +
      querystring.stringify({
        ...(year && { primary_release_year: year }),
        ...(genre && { with_genres: genre }),
        sort_by,
        api_key: process.env.TMDB_API_KEY
      })
  );

  const resJson = await res.json();

  if (!resJson.results) {
    if (
      resJson.status_message ===
      "Invalid API key: You must be granted a valid key."
    )
      throw new Error("Invalid TMdB API key");

    console.error(resJson);
    throw new Error("TMdB Request error");
  }

  return resJson;
};
