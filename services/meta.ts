import {
  description as rawDescription,
  name as rawName,
} from "../package.json";

export const name = rawDescription.split("__")[1] || rawName;
export const description = rawDescription.split("__").slice(-1)[0];

export const baseUrl = process.env.VERCEL_URL || window.location.origin;

export { author } from "../package.json";
