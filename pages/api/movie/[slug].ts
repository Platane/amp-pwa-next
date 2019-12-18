import { getMovie } from "../../../services/omdb/getMovie";

export default async (req, res) => {
  const { slug } = req.query;

  const movie = await getMovie(slug);

  res.statusCode = 200;
  res.json(movie);
  res.end();
};
