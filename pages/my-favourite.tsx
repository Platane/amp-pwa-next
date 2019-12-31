import React, { useState, useEffect } from "react";
import { Movie } from "../services/tmdb/type";
import { getMovie } from "../services/api/getMovie";
import { Link } from "../components/Link";
import { getImageUrl } from "../services/tmdb/image";

export const config = { amp: false };

const Page = () => {
  const [ids, setIds] = useState(null as null | string[]);

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

  useEffect(() => {
    localStorage.setItem("favList", JSON.stringify(ids));
  }, [ids]);

  const onRemove = id => () => {
    if (!ids) return;
    setIds(ids.filter(i => i !== id));
  };

  const [moviesById, setMoviesById] = useState(
    {} as Record<string, Movie | "pending">
  );

  useEffect(() => {
    if (!ids) return;

    for (const id of ids) {
      if (!moviesById[id])
        getMovie(id).then(movie => setMoviesById(x => ({ ...x, [id]: movie })));
    }
  }, [ids]);

  return (
    <>
      <h1>Your favorite</h1>

      {(ids || ["placeholder1", "placeholder2"]).map(id => {
        const m = moviesById[id];

        return (
          <Line
            movie={m === "pending" ? undefined : m}
            key={id}
            onRemove={onRemove(id)}
          />
        );
      })}
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
        <>
          <div
            style={{
              width: "140px",
              height: "210px",
              display: "inline-block",
              background: movie
                ? `url(${getImageUrl(movie.poster_path, { width: 200 })}`
                : "#eee"
            }}
          />

          {movie && <span>{movie.title}</span>}

          {movie && (
            <button
              data-image-link-id={movie.id}
              style={{
                display: "inline-block",
                margin: 0,
                border: "none",
                background: "none",
                padding: "2px 12px",
                fontSize: "26px",
                color: "red"
              }}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onRemove();
              }}
            >
              ♥
            </button>
          )}
        </>
      </a>
    </Link>
  </div>
);

export default Page;
