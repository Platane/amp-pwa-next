import React from "react";
import { Link } from "../components/Link";

export const config = { amp: !true };

const Page = props => {
  return (
    <ul>
      <li>
        <Link href="/content">
          <a>/content</a>
        </Link>
      </li>

      <li>
        <Link href="/podcast/[slug]" as="/podcast/one">
          <a>/podcast/one</a>
        </Link>
      </li>

      <li>
        <Link href="https://www.google.com">
          <a>outside</a>
        </Link>
      </li>

      <li>
        <Link as="/search" href="/search">
          <a>/search</a>
        </Link>
      </li>

      <li>
        <Link href="/movie/[slug]" as="/movie/tt3896198">
          <a>gotg</a>
        </Link>
      </li>
    </ul>
  );
};

export default Page;
