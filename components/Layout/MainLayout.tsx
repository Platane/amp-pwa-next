import React from "react";
import { Link } from "../Link";
// import { AmpTester } from "../../components/AmpTester";

export const MainLayout = ({ children }) => (
  <>
    <header className="layout-static">
      <Link href="/">
        <a>home</a>
      </Link>

      <span> </span>

      <Link href="/about">
        <a>about</a>
      </Link>
    </header>

    {children}

    <footer className="layout-static" style={{ marginTop: "60px" }}>
      <p>
        data from <a href="https://www.themoviedb.org/">themoviedb.org</a>
      </p>
    </footer>
  </>
);
