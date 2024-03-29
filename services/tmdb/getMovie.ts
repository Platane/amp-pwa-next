/**
 * get a single movie from tmdb
 */

(global as any).fetch = (global as any).fetch || require("node-fetch");

import querystring from "querystring";
import { Movie } from "./type";

export const getMovie = async (id: string): Promise<Movie> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?` +
      querystring.stringify({
        api_key: process.env.TMDB_API_KEY
      })
  );

  const resJson = await res.json();

  if (!resJson.imdb_id) {
    if (
      resJson.status_message ===
      "Invalid API key: You must be granted a valid key."
    )
      throw new Error("Invalid TMdB API key");

    if (
      resJson.status_message ===
      "The resource you requested could not be found."
    )
      throw new Error("Movie Unfound");

    console.error(resJson);
    throw new Error("TMdB Request error");
  }

  return resJson;
};
