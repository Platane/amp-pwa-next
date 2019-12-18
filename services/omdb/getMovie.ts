(global as any).fetch = (global as any).fetch || require("node-fetch");

import querystring from "querystring";
import { Movie } from "./type";

export const getMovie = async (id: string): Promise<Movie> => {
  const res = await fetch(
    "http://www.omdbapi.com/?" +
      querystring.stringify({
        i: id,
        plot: "full",
        apikey: process.env.OMDB_API_KEY || "86a2dcb0",
        type: "movie"
      })
  );

  const resJson = await res.json();

  return resJson;
};
