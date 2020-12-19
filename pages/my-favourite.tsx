import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getImageUrl } from "../services/tmdb/image";
import * as favList from "../components/FavButton/favList";
import type { Movie } from "../services/tmdb/type";

export const config = { amp: false };

const MyFavouritePage = () => {
  const [ids, setIds] = useFavouriteIds();
  const movies = useMoviesById(ids);

  const onRemove = (id: string) => () => setIds(ids.filter((i) => i !== id));

  return (
    <>
      <h1>Your favourites</h1>

      {movies.map((movie, i) => {
        const id = ids[i];
        return <Line movie={movie} key={id} id={id} onRemove={onRemove(id)} />;
      })}
    </>
  );
};

const Line = ({
  id,
  movie,
  onRemove,
}: {
  id: string;
  movie?: Movie | null;
  onRemove: () => void;
}) => (
  <div>
    <Link href={`/movie/${id}`}>
      <a>
        <img
          data-image-link-id={movie ? movie.id : undefined}
          alt={`movie poster`}
          style={{
            width: "140px",
            height: "210px",
            display: "inline-block",
            backgroundColor: "#eee",
            objectFit: "cover",
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
const useFavouriteIds = () => {
  const [ids, setIds] = useState<string[]>([]);

  // on mount, read the ids from the localStorage
  useEffect(() => setIds(favList.get()), []);

  // on change, replicate to the localStorage
  useEffect(() => favList.set(ids), [ids]);

  return [ids, setIds] as const;
};

/**
 * given a list of ids, fetch the related data
 * with a cache
 */
const useMoviesById = (ids: string[]) => {
  const [moviesById, setMoviesById] = useState<
    Record<string, Movie | "pending" | "error">
  >({});

  useEffect(() => {
    if (!ids) return;

    const toFetch = ids.filter((id) => !moviesById[id]);

    setMoviesById((x) => ({
      ...x,
      ...Object.fromEntries(toFetch.map((id) => [id, "pending"])),
    }));

    for (const id of toFetch)
      fetch(`/api/movie/${id}`)
        .then((res) => res.json())
        .catch(() => "error")
        .then((res) => setMoviesById((x) => ({ ...x, [id]: res })));
  }, [ids]);

  return ids.map((id) => {
    const m = moviesById[id];

    return !m || m === "pending" || m === "error" ? undefined : m;
  });
};

export default MyFavouritePage;
