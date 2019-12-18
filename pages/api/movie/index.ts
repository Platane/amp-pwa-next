import { getMovies } from "../../../services/tmdb/getMovies";
import { parse as parseUrl } from "url";
import querystring from "querystring";

export default async (req, res) => {
  console.log(req.url);

  const { search } = parseUrl(req.url);

  const { year, genre } = querystring.parse((search || "").slice(1)) as any;

  console.log(year, genre);

  const { results } = await getMovies({ year, genre });

  res.statusCode = 200;
  res.json({ items: results });
  res.end();
};
