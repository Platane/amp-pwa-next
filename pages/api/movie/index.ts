import { getMovies } from "../../../services/tmdb/getMovies";
import { parse as parseUrl } from "url";
import type { NowApiHandler } from "@vercel/node";
import fetch from "node-fetch";

(global as any).fetch = fetch;

const handler: NowApiHandler = async (req, res) => {
  const { search } = parseUrl(req.url!);

  const sp = new URLSearchParams(search || "");

  const { results } = await getMovies({
    year: sp.get("year") || undefined,
    genre: sp.get("genre") || undefined,
  });

  res.statusCode = 200;
  res.json({ items: results.slice(0, 5) });
  res.end();
};

export default handler;
