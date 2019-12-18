import { getMoviesByYear } from "../../../services/omdb/getMoviesByYear";

export default async (req, res) => {
  const { year } = req.query;

  const movies = await getMoviesByYear(year);

  res.statusCode = 200;
  res.json({ items: movies });
  res.end();
};
