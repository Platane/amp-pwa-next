import { getMovie } from "../../../services/tmdb/getMovie";

export default async (req, res) => {
  const { id } = req.query;

  const movie = await getMovie(id);

  res.statusCode = 200;
  res.json(movie);
  res.end();
};
