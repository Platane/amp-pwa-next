import React from "react";
import { AmpImg } from "react-amphtml";
import { getSrcSet, getImageUrl } from "../services/tmdb/image";
import Link from "next/link";
import { getMovies } from "../services/tmdb/getMovies";
import type { Movie } from "../services/tmdb/type";

export const config = { amp: true };

type Props = {
  genres: {
    id: string;
    name: string;
    movies: Movie[];
  }[];
};

const HomePage = ({ genres }: Props) => {
  return (
    <>
      <h1>Home page</h1>

      {genres.map(({ id, name, movies }) => (
        <Section key={id} name={name} movies={movies} />
      ))}
    </>
  );
};

const Section = ({ name, movies }: { name: string; movies: Movie[] }) => (
  <section style={{ margin: " 20px 0" }}>
    <h2>Most popular {name} movies</h2>

    <div style={{ overflowX: "scroll" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {movies.map((movie) => (
          <MovieItem key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  </section>
);

const MovieItem = ({ movie }: { movie: Movie }) => (
  <Link href="/movie/[slug]" as={`/movie/${movie.id}`}>
    <a title={movie.title}>
      <AmpImg
        layout="responsive"
        data-image-link-id={movie.id}
        alt={`${movie.title} - movie poster`}
        specName="default"
        width="500"
        height="750"
        sizes="(min-width: 500px) 200px, 160px"
        srcset={getSrcSet(movie.poster_path)}
        src={getImageUrl(movie.poster_path)}
      />
    </a>
  </Link>
);

HomePage.getInitialProps = async (): Promise<Props> => {
  const genres = await Promise.all(
    [
      { id: "28", name: "Action" },
      { id: "35", name: "Comedy" },
      { id: "878", name: "Science Fiction" },
      { id: "53", name: "Thriller" },
      { id: "16", name: "Animation" },
      { id: "12", name: "Adventure" },
    ].map(async ({ name, id }) => ({
      id,
      name,
      movies: (await getMovies({ genre: id })).results,
    }))
  );

  return { genres };
};

export default HomePage;
