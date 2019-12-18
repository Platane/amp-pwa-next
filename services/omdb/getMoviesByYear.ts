(global as any).fetch = (global as any).fetch || require("node-fetch");

import querystring from "querystring";
import { Movie } from "./type";

export const getMoviesByYear = async (year: number): Promise<Movie[]> => {
  const res = await fetch(
    "http://www.omdbapi.com/?" +
      querystring.stringify({
        y: year,
        plot: "short",
        apikey: process.env.OMDB_API_KEY || "86a2dcb0",
        type: "movie",
        s: "guardian"
      })
  );

  const resJson = await res.json();

  return resJson.Search;
};
