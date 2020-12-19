import { getMovie } from "../../../services/tmdb/getMovie";
import fetch from "node-fetch";
import type { NowApiHandler } from "@vercel/node";

(global as any).fetch = fetch;

const handler: NowApiHandler = async (req, res) => {
  const id = req.query.id as string;

  const movie = await getMovie(id);

  res.statusCode = 200;
  res.json(movie);
  res.end();
};

export default handler;
