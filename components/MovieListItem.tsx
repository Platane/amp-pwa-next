import React from "react";
import { AmpImg } from "react-amphtml";
import { Link } from "./Link";
import { Movie } from "../services/tmdb/type";
import { getSrcSet } from "../services/tmdb/image";

type Props = { movie: Movie };

export const MovieListItem = ({ movie }: Props) => {
  return (
    <Link as={`/movie/${movie.id}`} href={`/movie/[slug]`}>
      <a>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "80px",
            alignItems: "center"
          }}
        >
          <AmpImg
            style={{ flex: "auto 0 0" }}
            alt="movie poster"
            specName="default"
            width={(70 / 750) * 500}
            height="70"
            srcset={getSrcSet(movie.poster_path)}
          />

          <span>{movie.title}</span>
        </div>
      </a>
    </Link>
  );
};
