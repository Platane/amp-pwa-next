import React, { useState, useEffect } from "react";
import { Link } from "../components/Link";

export const config = { amp: false };

const Page = props => {
  const [s, setS] = useState("hello");

  return (
    <>
      <div>{s}</div>

      <input value={s} onChange={e => setS(e.target.value)} />

      <ul>
        <li>
          <Link href="/content">
            <a>/content</a>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Page;
