import React from "react";
import { AmpImg } from "react-amphtml";
import { getMovie } from "../../services/api/getMovie";
import { Movie } from "../../services/tmdb/type";
import { MovieList } from "../../components/MovieList";
import { getImageUrl, sizes } from "../../services/tmdb/image";

export const config = { amp: true };

type Props = { movie: Movie };

const Page = ({ movie }: Props) => {
  return (
    <>
      <AmpImg
        specName="default"
        width="500"
        height="750"
        srcset={sizes
          .map(
            width => getImageUrl(movie.poster_path, { width }) + ` ${width}w`
          )
          .join(",")}
      />

      <section>
        <h1>{movie.title}</h1>

        <p>{movie.overview}</p>
      </section>

      <section>
        <h2>genres:</h2>

        <ul>
          {movie.genres.map(({ id, name }) => (
            <li key={id}>{name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Most popular {movie.genres[0].name} movies</h2>

        <MovieList
          src={`/api/movie?genre=${movie.genres[0].id}`}
          maxItems={5}
        />
      </section>
    </>
  );
};

Page.getInitialProps = async (ctx): Promise<Props> => {
  const { slug } = ctx.query;

  return { movie: await getMovie(slug) };
};

export default Page;
