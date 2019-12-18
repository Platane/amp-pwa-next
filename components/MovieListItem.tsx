import React from "react";
import { AmpImg } from "react-amphtml";
import { Movie } from "../services/omdb/type";

type Props = { movie: Movie };

export const MovieListItem = ({ movie }: Props) => {
  return (
    <a href={`/movie/${movie.imdbID}`}>
      <div style={{ display: "flex", flexDirection: "row", height: "80px" }}>
        <AmpImg
          specName="default"
          width={(60 / 430) * 300}
          height="60"
          src={movie.Poster}
        />

        <span>{movie.Title}</span>
      </div>
    </a>
  );
};
