import React from "react";
import { AmpImg } from "react-amphtml";
import { getMovie } from "../../services/api/getMovie";
import { Movie } from "../../services/omdb/type";
import { MovieList } from "../../components/MovieList";

export const config = { amp: true };

type Props = { movie: Movie };

const Page = ({ movie }: Props) => {
  return (
    <>
      <AmpImg specName="default" width="300" height="430" src={movie.Poster} />

      <h1>{movie.Title}</h1>

      <p>{movie.Plot}</p>

      <MovieList src="/api/movie-by-year/2019" />
    </>
  );
};

Page.getInitialProps = async (ctx): Promise<Props> => {
  const { slug } = ctx.query;

  return { movie: await getMovie(slug) };
};

export default Page;
