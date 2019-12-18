import React from "react";
import { AmpImg } from "react-amphtml";
import { Movie } from "../services/tmdb/type";
import { getImageUrl, sizes } from "../services/tmdb/image";

type Props = { movie: Movie };

export const MovieListItem = ({ movie }: Props) => {
  return (
    <a href={`/movie/${movie.id}`}>
      <div style={{ display: "flex", flexDirection: "row", height: "80px" }}>
        <AmpImg
          specName="default"
          width={(60 / 430) * 300}
          height="60"
          srcset={sizes
            .map(
              width => getImageUrl(movie.poster_path, { width }) + ` ${width}w`
            )
            .join(",")}
        />

        <span>{movie.title}</span>
      </div>
    </a>
  );
};
