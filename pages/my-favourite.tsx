import React, { useState, useEffect } from "react";
import { Movie } from "../services/tmdb/type";
import { getMovie } from "../services/api/getMovie";
import { Link } from "../components/Link";
import { getImageUrl } from "../services/tmdb/image";
import { useOrigin } from "../services/next-host-getter";

export const config = { amp: false };

const Page = () => {
  const [ids, setIds] = useFavoriteIds();
  const movies = useMovieDataFetcher(ids);

  const onRemove = (id: string) => () => {
    if (!ids) return;
    setIds(ids.filter(i => i !== id));
  };

  return (
    <>
      <h1>Your favorite</h1>

      {movies.map((movie, i) => (
        <Line
          movie={movie}
          key={movie ? movie.id : i}
          onRemove={movie ? onRemove(movie.id.toString()) : () => ({})}
        />
      ))}
    </>
  );
};

const Line = ({
  movie,
  onRemove
}: {
  movie?: Movie | null;
  onRemove: () => void;
}) => (
  <div>
    <Link
      href={movie ? "/movie/[slug]" : undefined}
      as={movie ? `/movie/${movie.id}` : undefined}
    >
      <a>
        <img
          data-image-link-id={movie ? movie.id : undefined}
          alt={`movie poster`}
          style={{
            width: "140px",
            height: "210px",
            display: "inline-block",
            backgroundColor: "#eee",
            objectFit: "cover"
          }}
          src={
            movie
              ? getImageUrl(movie.poster_path, { width: 200 })
              : "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
          }
        />

        {movie && <span>{movie.title}</span>}
      </a>
    </Link>

    {movie && <button onClick={onRemove}>remove from favourite</button>}
  </div>
);

/**
 * synchronize the value with localStorage
 */
const useFavoriteIds = () => {
  const [ids, setIds] = useState([] as string[]);

  // on mount, read the ids from the localStorage
  useEffect(() => {
    let i: string[];
    try {
      i = JSON.parse(localStorage.getItem("favList") || "");
    } catch (err) {
      i = [];
    }

    if (!Array.isArray(i)) i = [];

    setIds(i);
  }, []);

  // on change, replicate to the localStorage
  useEffect(() => {
    localStorage.setItem("favList", JSON.stringify(ids));
  }, [ids]);

  return [ids, setIds] as const;
};

/**
 * given a list of ids, fetch the related data
 * with a cache
 */
const useMovieDataFetcher = (ids: string[]) => {
  const origin = useOrigin();

  const [moviesById, setMoviesById] = useState(
    {} as Record<string, Movie | "pending">
  );

  useEffect(() => {
    if (!ids) return;

    for (const id of ids) {
      if (!moviesById[id])
        getMovie(origin)(id).then(movie =>
          setMoviesById(x => ({ ...x, [id]: movie }))
        );
    }
  }, [ids]);

  return ids.map(id => {
    const m = moviesById[id];

    return !m || m === "pending" ? undefined : m;
  });
};

export default Page;
