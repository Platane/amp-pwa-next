import React from "react";
import { Link } from "../components/Link";

export const config = { amp: true };

const Page = props => {
  return (
    <ul>
      <li>
        <Link href="/movie/[slug]" as="/movie/tt3896198">
          <a>gotg</a>
        </Link>
      </li>
    </ul>
  );
};

export default Page;
