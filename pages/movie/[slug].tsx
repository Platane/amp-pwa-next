import React from "react";
import { AmpImg } from "react-amphtml";
import Head from "next/head";
import type { NextPageContext } from "next";
import { MovieList } from "../../components/MovieList";
import { getSrcSet, getImageUrl } from "../../services/tmdb/image";
import { FavButton } from "../../components/FavButton/FavButton";
import Link from "next/link";
import { getMovie } from "../../services/tmdb/getMovie";
import type { Movie } from "../../services/tmdb/type";

export const config = { amp: true };

type Props = { movie: Movie };

const MoviePage = ({ movie }: Props) => (
  <>
    <Head>
      <Meta movie={movie} />
    </Head>

    <AmpImg
      layout="responsive"
      data-image-link-id={movie.id}
      alt="movie poster"
      specName="default"
      width="500"
      height="750"
      sizes="(min-width: 500px) 500px, 100vw"
      srcset={getSrcSet(movie.poster_path)}
      src={getImageUrl(movie.poster_path)}
    />

    <section style={{ margin: " 20px 0" }}>
      <div>
        <h1 style={{ display: "inline", marginRight: "20px" }}>
          {movie.title}
        </h1>
        <a href={`https://www.imdb.com/title/${movie.imdb_id}`}>imdb</a>
      </div>

      <div>
        <StarRating max={10} value={+movie.vote_average} />
        <span>{`${movie.vote_average} of ${movie.vote_count}`}</span>
      </div>

      <div style={{ margin: " 20px 0" }}>
        <FavButton id={movie.id} />
        <Link href="/my-favourite">
          <a
            style={{
              marginLeft: "20px",
              verticalAlign: "bottom",
              display: "inline-block",
              lineHeight: "30px",
            }}
          >
            my-favourite
          </a>
        </Link>
      </div>

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

      <MovieList src={`/api/movie?genre=${movie.genres[0].id}`} maxItems={5} />
    </section>

    <section style={{ margin: " 20px 0" }}>
      <h2>Most popular movies</h2>

      <MovieList src={`/api/movie`} maxItems={5} />
    </section>
  </>
);

const StarRating = ({ value, max }: { value: number; max: number }) => (
  <>
    {Array.from({ length: max }).map((_, i) => (
      <span
        key={i}
        style={{
          color: i <= value ? "orange" : "grey",
        }}
      >
        ★
      </span>
    ))}
  </>
);

const Meta = ({ movie }: Props) => {
  return (
    <>
      <title key="title">amp pwa next | {movie.title}</title>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@type": "Movie",
            name: movie.title,
            url: `/movie/${movie.id}`,
            image: getImageUrl(movie.poster_path),
            dateCreated: movie.release_date,

            review: {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: movie.vote_average,
                bestRating: 10,
                ratingCount: movie.vote_count,
              },
            },
          }),
        }}
      />
    </>
  );
};

MoviePage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const slug = ctx.query.slug as string;

  const movie = await getMovie(slug);

  return { movie };
};

export default MoviePage;
