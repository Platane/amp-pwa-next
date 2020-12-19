/**
 * get a list of movie from tmdb
 */

import type { Movie } from "./type";

export const getMovies = async ({
  year,
  genre,
  sort_by = "popularity.desc",
}: {
  year?: number | string;
  genre?: number | string;
  sort_by?: "vote_average.desc" | "popularity.desc";
}): Promise<{
  results: Movie[];
  page: number;
  total_results: number;
  total_pages: number;
}> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?` +
      new URLSearchParams({
        ...(year && { primary_release_year: year }),
        ...(genre && { with_genres: genre }),
        sort_by,
        api_key: process.env.TMDB_API_KEY!,
      } as any).toString()
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
