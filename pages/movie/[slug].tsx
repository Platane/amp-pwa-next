import React from "react";
import { AmpImg } from "react-amphtml";
import { getMovie } from "../../services/api/getMovie";
import { Movie } from "../../services/tmdb/type";
import { MovieList } from "../../components/MovieList";
import { getSrcSet, getImageUrl } from "../../services/tmdb/image";
import { extractOrigin } from "../../services/next-host-getter";

export const config = { amp: true };

type Props = { movie: Movie };

const Page = ({ movie }: Props) => {
  return (
    <>
      <AmpImg
        alt="movie poster"
        specName="default"
        width="500"
        height="750"
        sizes="(min-width: 500px) 500px, 100vw"
        srcset={getSrcSet(movie.poster_path)}
        src={getImageUrl(movie.poster_path)}
      />

      <section style={{ margin: " 20px 0" }}>
        <h1>{movie.title}</h1>

        <div>
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              style={{
                color: i <= +movie.vote_average ? "orange" : "grey"
              }}
            >
              ★
            </span>
          ))}
          <span>{`${movie.vote_average} of ${movie.vote_count}`}</span>
        </div>

        <a href={`https://www.imdb.com/title/${movie.imdb_id}`}>imdb</a>

        <p>{movie.overview}</p>
      </section>

      <section style={{ margin: " 20px 0" }}>
        <h2>genres:</h2>

        <ul>
          {movie.genres.map(({ id, name }) => (
            <li key={id}>{name}</li>
          ))}
        </ul>
      </section>

      <section style={{ margin: " 20px 0" }}>
        <h2>Most popular {movie.genres[0].name} movies</h2>

        <MovieList
          src={`/api/movie?genre=${movie.genres[0].id}`}
          maxItems={5}
        />
      </section>

      <section style={{ margin: " 20px 0" }}>
        <h2>Most popular movies</h2>

        <MovieList src={`/api/movie`} maxItems={5} />
      </section>
    </>
  );
};

Page.getInitialProps = async (ctx): Promise<Props> => {
  const { slug } = ctx.query;

  return { movie: await getMovie(extractOrigin(ctx))(slug) };
};

export default Page;
