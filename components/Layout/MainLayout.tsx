import React from "react";
import Link from "next/link";

export const MainLayout = ({ children }) => (
  <>
    <header
      className="layout-static"
      style={{ padding: "20px 0", background: "#eee" }}
    >
      <Link href="/">
        <a>home</a>
      </Link>

      <span> </span>

      <Link href="/about">
        <a>about</a>
      </Link>
    </header>

    {children}

    <footer className="layout-static" style={{ marginTop: "160px" }}>
      <p>
        data from <a href="https://www.themoviedb.org/">themoviedb.org</a>
      </p>
    </footer>
  </>
);
