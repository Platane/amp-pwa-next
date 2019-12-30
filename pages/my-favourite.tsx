import React, { useState, useEffect } from "react";
import { Movie } from "../services/tmdb/type";
import { getMovie } from "../services/api/getMovie";

export const config = { amp: false };

const Page = () => {
  const [movies, setMovies] = useState(null as (Movie | null)[] | null);

  useEffect(() => {
    let ids: string[];
    try {
      ids = JSON.parse(localStorage.getItem("favList") || "");
    } catch (err) {
      ids = [];
    }

    if (!Array.isArray(ids)) ids = [];

    setMovies(ids.map(() => null));

    ids.forEach((id, i) =>
      getMovie(id).then(movie =>
        setMovies(movies => (movies || []).map((x, j) => (i === j ? movie : x)))
      )
    );
  }, []);

  return (
    <>
      <h1>Your favorite</h1>

      {(movies || [null, null]).map((movie, i) =>
        movie ? <div key={movie.id}>{movie.title}</div> : <div key={i} />
      )}
    </>
  );
};

export default Page;
