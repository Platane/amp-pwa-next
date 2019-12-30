import React from "react";
import { Link } from "../components/Link";
import { AmpImg } from "react-amphtml";
import { getMovies } from "../services/api/getMovies";
import { Movie } from "../services/tmdb/type";
import { getSrcSet } from "../services/tmdb/image";

export const config = { amp: true };

type Props = {
  genres: {
    id: string;
    name: string;
    movies: Movie[];
  }[];
};

const Page = ({ genres }: Props) => {
  return (
    <>
      <h1>Home page</h1>

      {genres.map(({ id, name, movies }) => (
        <section key={id} style={{ margin: " 20px 0" }}>
          <h2>Most popular {name} movies</h2>

          <div style={{ overflowX: "scroll" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {movies.map(movie => (
                <div key={movie.id}>
                  <Link href="/movie/[slug]" as={`/movie/${movie.id}`}>
                    <a>
                      <>
                        <AmpImg
                          id={`movie_poster_${movie.id}`}
                          alt="movie poster"
                          specName="default"
                          width="500"
                          height="750"
                          sizes="(min-width: 500px) 200px, 160px"
                          srcset={getSrcSet(movie.poster_path)}
                        />
                      </>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

Page.getInitialProps = async (ctx): Promise<Props> => {
  const genres = await Promise.all(
    [
      { id: "28", name: "Action" },
      { id: "35", name: "Comedy" },
      { id: "878", name: "Science Fiction" },
      { id: "53", name: "Thriller" },
      { id: "16", name: "Animation" }

      // { id: "27", name: "Horror" },
      // { id: "12", name: "Adventure" },
      // { id: "36", name: "History" },
      // { id: "80", name: "Crime" },
      // { id: "18", name: "Drama" },
      // { id: "10402", name: "Music" },
      // { id: "10751", name: "Family" },
      // { id: "14", name: "Fantasy" }
    ].map(async ({ name, id }) => ({
      name,
      id,
      movies: await getMovies({ genre: id })
    }))
  );

  return { genres };
};

export default Page;
