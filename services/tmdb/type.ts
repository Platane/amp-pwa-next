export type Movie = {
  id: number;
  title: string;
  overview: string;
  genres: { id: number; name: string }[];
  homepage: string;
  imdb_id: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
};
